import React, { useState, useEffect } from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head, useForm, Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { useCart } from '../../Context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

// Initialize Stripe safely
const getStripeKey = (key?: string) => {
    if (key) return key;
    try {
        return (typeof process !== 'undefined' && process.env.MIX_STRIPE_KEY)
            || 'pk_test_2zuyBaQ6NePxHFMmmsQ94zxm';
    } catch (e) {
        return 'pk_test_2zuyBaQ6NePxHFMmmsQ94zxm';
    }
};

declare function route(name: string, params?: any): string;

interface OrderConfirmPayProps {
    cart_items: any[];
    stripe_key?: string;
}

const CheckoutForm = ({ total, subtotal, deliveryFee, deliveryAddress, itemsData, appliedVoucher, stripe_key, isProcessing, setIsProcessing }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useUser();
    const { clearCart } = useCart();
    
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [ewalletProvider, setEwalletProvider] = useState('gcash');
    const [ewalletModal, setEwalletModal] = useState(false);
    const [cardModal, setCardModal] = useState(false);
    const [cardStatus, setCardStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [cardError, setCardError] = useState<string | null>(null);
    const [paymongoSource, setPaymongoSource] = useState<{ source_id: string; checkout_url: string } | null>(null);
    const [pollStatus, setPollStatus] = useState<'waiting' | 'paid' | 'failed' | 'expired'>('waiting');
    const pollIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    const getOrderPayload = () => ({
        buyer_id: user?.id || 'guest_' + Math.random().toString(36).substring(7),
        subtotal,
        delivery_fee: deliveryFee,
        discount_amount: itemsData.reduce((acc: number, item: any) => acc + (item.discount || 0), 0),
        total_amount: total,
        payment_method: paymentMethod === 'ewallet' ? ewalletProvider : paymentMethod,
        delivery_address: deliveryAddress,
        items_data: itemsData.map((item: any) => ({
            ...item,
            id: item.original_id || item.id,
            variant: item.priceType
        })),
        promotion_id: appliedVoucher?.id || null
    });

    const handleFinalizeOrder = (orderData: any) => {
        Inertia.post(route('orders.store'), orderData, {
            onStart: () => setIsProcessing(true),
            onSuccess: () => {
                clearCart();
                setEwalletModal(false);
                clearPoll();
            },
            onError: () => {
                setIsProcessing(false);
            }
        });
    };

    const clearPoll = () => {
        if (pollIntervalRef.current) {
            clearTimeout(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    };

    const startPolling = (sourceId: string) => {
        clearPoll();
        if (sourceId.startsWith('mock_src_')) return;

        const poll = async () => {
            try {
                const res = await axios.post(route('payment.paymongo.check'), { source_id: sourceId });
                const status = res.data.status;
                if (status === 'chargeable' || status === 'paid') {
                    setPollStatus('paid');
                    handleFinalizeOrder({ ...getOrderPayload(), payment_method: ewalletProvider });
                } else if (status === 'cancelled' || status === 'failed') {
                    setPollStatus('failed');
                } else {
                    pollIntervalRef.current = setTimeout(poll, 6000);
                }
            } catch (err) {
                pollIntervalRef.current = setTimeout(poll, 10000);
            }
        };
        pollIntervalRef.current = setTimeout(poll, 3000);
    };

    useEffect(() => () => clearPoll(), []);

    const handleEwalletPay = async () => {
        setIsProcessing(true);
        try {
            const res = await axios.post(route('payment.paymongo.source'), {
                amount: total,
                type: ewalletProvider === 'maya' ? 'paymaya' : 'gcash',
                items_data: itemsData
            });
            const { source_id, checkout_url } = res.data;
            setPaymongoSource({ source_id, checkout_url });
            setPollStatus('waiting');
            setEwalletModal(true);
            startPolling(source_id);
            window.open(checkout_url, '_blank', 'noopener,noreferrer');
        } catch (err: any) {
            alert('Payment Error: ' + (err?.response?.data?.error || 'Connection failed'));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentMethod === 'cod') return handleFinalizeOrder(getOrderPayload());
        if (paymentMethod === 'card') return cardModal ? handleCardPay() : setCardModal(true);
        if (paymentMethod === 'ewallet') await handleEwalletPay();
    };

    const handleCardPay = async () => {
        if (!stripe || !elements) return;
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        setCardStatus('processing');
        setIsProcessing(true);

        try {
            const intentRes = await axios.post(route('payment.intent'), { total });
            const { clientSecret, mock } = intentRes.data;

            if (mock) {
                setCardStatus('success');
                await new Promise(r => setTimeout(r, 1800));
                handleFinalizeOrder({ ...getOrderPayload(), payment_method: 'card' });
                setCardModal(false);
                return;
            }

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement }
            });

            if (error) {
                setCardStatus('error');
                setCardError(error.message || 'Payment failed');
                setIsProcessing(false);
            } else if (paymentIntent?.status === 'succeeded') {
                setCardStatus('success');
                await new Promise(r => setTimeout(r, 1800));
                handleFinalizeOrder({ ...getOrderPayload(), payment_method: 'card' });
                setCardModal(false);
            }
        } catch (err: any) {
            setCardStatus('error');
            setCardError(err?.message || 'Unexpected error');
            setIsProcessing(false);
        }
    };

    const providerLabel = ewalletProvider === 'gcash' ? 'GCash' : 'Maya';

    return (
        <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in duration-1000">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold mb-8 tracking-tight text-gray-900">Payment Method</h2>
                <div className="space-y-4">
                    {/* E-Wallet */}
                    <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${paymentMethod === 'ewallet' ? 'border-[#d4af37] bg-stone-50' : 'border-gray-50 bg-white'}`}>
                        <div className="flex items-center justify-between mb-8 cursor-pointer" onClick={() => { setPaymentMethod('ewallet'); setEwalletProvider('gcash'); }}>
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${paymentMethod === 'ewallet' ? 'bg-[#d4af37] text-white' : 'bg-gray-100'}`}>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                </div>
                                <div>
                                    <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">E-wallet</span>
                                    <p className="text-[9px] text-gray-300 italic">Fast digital payment</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" onClick={() => { setPaymentMethod('ewallet'); setEwalletProvider('gcash'); }} className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'ewallet' && ewalletProvider === 'gcash' ? 'border-[#d4af37] bg-white' : 'border-gray-100'}`}>GCash</button>
                            <button type="button" onClick={() => { setPaymentMethod('ewallet'); setEwalletProvider('maya'); }} className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'ewallet' && ewalletProvider === 'maya' ? 'border-[#d4af37] bg-white' : 'border-gray-100'}`}>Maya</button>
                        </div>
                    </div>

                    {/* Card */}
                    <div onClick={() => setPaymentMethod('card')} className={`cursor-pointer flex items-center justify-between p-6 rounded-2xl border-2 ${paymentMethod === 'card' ? 'border-[#d4af37] bg-stone-50' : 'border-gray-50'}`}>
                        <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'card' ? 'bg-[#d4af37] text-white' : 'bg-gray-50'}`}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z" /></svg>
                            </div>
                            <span className="font-bold uppercase text-[10px] tracking-widest">Card Payment</span>
                        </div>
                    </div>

                    {/* COD */}
                    <div onClick={() => setPaymentMethod('cod')} className={`cursor-pointer flex items-center justify-between p-6 rounded-2xl border-2 ${paymentMethod === 'cod' ? 'border-[#d4af37] bg-stone-50' : 'border-gray-50'}`}>
                        <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-[#d4af37] text-white' : 'bg-gray-50'}`}>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <span className="font-bold uppercase text-[10px] tracking-widest">Cash on Delivery</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Settlement Box */}
            <div className="bg-[#1a1a1a] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors duration-1000"></div>
                 <div className="space-y-6 pb-8 border-b border-white/10 relative z-10">
                     <div className="flex justify-between items-center text-white/40 text-[10px] font-bold uppercase tracking-widest">
                         <span>Subtotal</span>
                         <span className="text-white text-base font-bold">₱{subtotal.toLocaleString()}.00</span>
                     </div>
                     {itemsData.reduce((acc: number, item: any) => acc + (item.discount || 0), 0) > 0 && (
                         <div className="flex justify-between items-center text-emerald-400/60 text-[10px] font-bold uppercase tracking-widest">
                             <span>Discount</span>
                             <span className="text-emerald-400 text-base font-bold">- ₱{itemsData.reduce((acc: number, item: any) => acc + (item.discount || 0), 0).toLocaleString()}.00</span>
                         </div>
                     )}
                     <div className="flex justify-between items-center text-white/40 text-[10px] font-bold uppercase tracking-widest">
                         <span>Delivery Fee</span>
                         <span className="text-white text-base font-bold">₱{deliveryFee.toLocaleString()}.00</span>
                     </div>
                 </div>
                 <div className="py-8 flex justify-between items-center relative z-10">
                     <div>
                         <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1 italic">Order Total</p>
                         <p className="text-[#d4af37] text-[10px] font-bold uppercase tracking-widest">Safe and Secure</p>
                     </div>
                     <p className="text-2xl font-bold tracking-tight text-[#d4af37] drop-shadow-md">₱{total.toLocaleString()}.00</p>
                 </div>
                 <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-[#d4af37] text-[#1a1a1a] rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-white transition-all shadow-md active:scale-95"
                 >
                    {isProcessing ? (
                        <><span className="animate-spin w-5 h-5 border-2 border-[#1a1a1a]/30 border-t-[#1a1a1a] rounded-full"></span> Connecting...</>
                    ) : `Authorize ₱${total.toLocaleString()}.00`}
                 </button>
            </div>

            {/* E-Wallet Polling Modal */}
            {ewalletModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
                        <div className="px-10 py-12 text-center">
                            {pollStatus === 'waiting' && (
                                <>
                                    <div className="animate-pulse mb-6 w-16 h-16 bg-amber-50 rounded-full mx-auto flex items-center justify-center">
                                        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p className="text-sm font-black uppercase tracking-widest mb-2 text-gray-900">Waiting for {providerLabel}</p>
                                    <p className="text-[10px] text-gray-400 mb-8 italic">Complete payment in the new tab, then return here.</p>
                                    
                                    {paymongoSource?.checkout_url && (
                                        <a href={paymongoSource.checkout_url} target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 hover:bg-black transition-all">
                                            Open {providerLabel} Again
                                        </a>
                                    )}

                                    {/* Developer Shortcut */}
                                    <div className="pt-6 border-t border-gray-50">
                                        <button 
                                            type="button" 
                                            onClick={() => { clearPoll(); setPollStatus('paid'); handleFinalizeOrder({ ...getOrderPayload(), payment_method: ewalletProvider }); }}
                                            className="text-[9px] font-bold text-[#d4af37] uppercase tracking-widest hover:underline"
                                        >
                                            Confirm Simulated Settlement (Dev)
                                        </button>
                                    </div>
                                </>
                            )}
                            {pollStatus === 'paid' && <p className="text-emerald-600 font-bold italic">Payment Secured. Redirecting...</p>}
                            {(pollStatus === 'failed' || pollStatus === 'expired') && <p className="text-red-500 font-bold italic text-sm">Transaction {pollStatus}. Please try again.</p>}
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-center border-t border-gray-100">
                            <button type="button" onClick={() => { setEwalletModal(false); clearPoll(); }} className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Card Modal */}
            {cardModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl">
                    <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-10">
                        <h3 className="text-white font-black uppercase tracking-[0.2em] mb-8">Secure Vault Access</h3>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 mb-8">
                            <CardElement options={{ style: { base: { color: '#fff', fontSize: '16px' } } }} />
                        </div>
                        <div className="flex gap-4">
                            <button type="button" onClick={handleCardPay} disabled={cardStatus === 'processing'} className="flex-1 py-4 bg-[#d4af37] text-black rounded-xl font-black text-[10px] uppercase tracking-widest">Authorize</button>
                            <button type="button" onClick={() => setCardModal(false)} className="px-6 py-4 border border-white/10 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};

const OrderSummary = ({ itemsData }: any) => (
    <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <h2 className="text-2xl font-bold tracking-tight mb-8 text-gray-900">Order Summary</h2>
        <div className="space-y-6">
            {itemsData.map((item: any) => (
                <div key={item.id} className="flex items-center gap-6 py-4 border-b border-gray-50 last:border-0">
                    <img src={item.img} className="w-16 h-16 rounded-xl object-cover shadow-sm border border-gray-100" alt={item.name} />
                    <div className="flex-grow">
                        <span className="text-[9px] font-bold text-[#d4af37] uppercase tracking-widest mb-1 block">Selected Item</span>
                        <h3 className="text-lg font-bold tracking-tight text-gray-900">{item.name}</h3>
                        <p className="text-xs text-gray-400 italic">
                            Quantity: {item.qty}{item.isFixedQty && <span className="text-[#d4af37] ml-0.5">x</span>}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold tracking-tight text-gray-900">₱{(item.price * item.qty).toLocaleString()}.00</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

const DeliverySummary = ({ deliveryAddress }: any) => (
    <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight mb-8 text-gray-900">Delivery Address</h2>
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            </div>
            <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Address</h4>
                <p className="font-bold text-gray-700 leading-relaxed text-sm">{deliveryAddress}</p>
            </div>
        </div>
    </section>
);

const OrderCart = ({ itemsData }: any) => (
    <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm overflow-hidden relative">
        <h2 className="text-xl font-bold tracking-tight mb-8 text-gray-900">Your Cart</h2>
        <div className="space-y-4">
            {itemsData.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden relative border border-gray-100">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute top-0 right-0 bg-[#1a1a1a] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{item.qty}</div>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-[11px] font-bold truncate uppercase text-gray-900">{item.name}</h4>
                        <span className="text-[10px] text-gray-400 font-bold">₱{item.price.toLocaleString()}</span>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default function OrderConfirmPay({ cart_items, stripe_key }: OrderConfirmPayProps) {
    const { cartItems, deliveryDetails, appliedVoucher } = useCart();
    const { user } = useUser();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        setOrderId(Math.random().toString(36).substring(7).toUpperCase());
    }, []);
    
    const activeItems = cartItems.length > 0 ? cartItems : cart_items || [];
    const currentStripePromise = React.useMemo(() => loadStripe(getStripeKey(stripe_key)), [stripe_key]);
    
    const subtotal = activeItems.reduce((acc, item) => acc + (parseFloat(String(item.price)) * parseInt(String(item.qty))), 0);
    const total = subtotal + 20 - (appliedVoucher?.discount_value || 0);

    return (
        <BuyerLayout>
            <Head title="Confirm Payment - Kokommerce" />
            <div className="max-w-7xl mx-auto px-6 pb-32 pt-24 md:pt-32">
                <header className="mb-12 border-b border-gray-100 pb-8 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                            <span className="text-gray-200">Selection</span>
                            <span className="w-6 h-[1px] bg-gray-200"></span>
                            <span className="text-gray-200">Delivery</span>
                            <span className="w-6 h-[1px] bg-gray-200"></span>
                            <span className="text-[#d4af37]">03. Payment</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none italic">
                            Final <span className="text-[#d4af37]">Order Check.</span>
                        </h1>
                    </div>
                    <div className="text-right space-y-1">
                         <p className="text-[9px] font-bold uppercase text-gray-300 tracking-widest">Order ID: #{orderId}</p>
                         <p className="text-sm font-bold text-gray-900">{user?.fullName || 'Artisanal Member'}</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-8 space-y-8">
                         <OrderSummary itemsData={activeItems} />
                         <DeliverySummary deliveryAddress={deliveryDetails?.address || 'Signature required'} />
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <OrderCart itemsData={activeItems} />
                        <Elements stripe={currentStripePromise}>
                            <CheckoutForm 
                                total={total} 
                                subtotal={subtotal} 
                                deliveryFee={20} 
                                deliveryAddress={deliveryDetails?.address}
                                itemsData={activeItems}
                                appliedVoucher={appliedVoucher}
                                stripe_key={stripe_key}
                                isProcessing={isProcessing}
                                setIsProcessing={setIsProcessing}
                            />
                        </Elements>
                    </div>
                </div>
            </div>

            {/* Settlement Nexus - Professional Processing Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-700">
                    <div className="relative flex flex-col items-center text-center max-w-sm px-8">
                        <div className="mb-12 relative">
                            <div className="w-32 h-32 border-2 border-[#d4af37]/20 rounded-full animate-[spin_4s_linear_infinite]"></div>
                            <div className="absolute inset-2 border-t-4 border-[#d4af37] rounded-full animate-spin"></div>
                            <div className="absolute inset-8 border-b-2 border-white/50 rounded-full animate-[reverse-spin_2s_linear_infinite]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#d4af37] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.5em] block mb-2">Guild Logistics Terminal</span>
                            <h2 className="text-2xl font-bold text-white tracking-tight leading-tight italic">
                                Securing Your <br /> <span className="text-[#d4af37]">Artisanal Acquisition.</span>
                            </h2>
                            <div className="flex flex-col gap-2 pt-4">
                                <div className="h-1 w-48 bg-white/5 rounded-full mx-auto overflow-hidden">
                                    <div className="h-full bg-[#d4af37] w-full animate-[loading_2.5s_ease-in-out_infinite]"></div>
                                </div>
                                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">Committing Ledger to Archives...</p>
                            </div>
                        </div>
                        
                        <div className="mt-12 flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest leading-none">Safe & Secure Protocol v4.2</span>
                        </div>
                    </div>
                </div>
            )}
        </BuyerLayout>
    );
}
