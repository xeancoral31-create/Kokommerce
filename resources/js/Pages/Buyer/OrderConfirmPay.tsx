import React, { useState, useEffect } from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { useCart } from '../../Context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

// Initialize Stripe with the publishable key from env
const stripePromise = loadStripe((window as any).process?.env?.MIX_STRIPE_KEY || 'pk_test_51TEBdV2ei3kClrNzrhvjVcIcojpkEWe6XbuNBztFGrzNL7SfUR4DqmeMFolbSYK1thWE6MsvkamIZqWntGZmGpZf00OBKhGJjj');

declare function route(name: string, params?: any): string;

interface OrderConfirmPayProps {
    cart_items: any[];
}

const CheckoutForm = ({ total, subtotal, deliveryFee, deliveryAddress, itemsData }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useUser();
    const { clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('gcash');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Inertia form for order storage
    const { post } = useForm({
        buyer_id: user?.id || 'guest_' + Math.random().toString(36).substring(7),
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        total_amount: total,
        payment_method: paymentMethod,
        delivery_address: deliveryAddress,
        items_data: itemsData
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (paymentMethod === 'cod') {
            post(route('orders.store'), {
                onSuccess: () => clearCart()
            });
            return;
        }

        if (paymentMethod === 'card') {
            if (!stripe || !elements) return;

            setIsProcessing(true);

            try {
                // 1. Create Payment Intent on backend
                const { data: { clientSecret } } = await axios.post(route('payment.intent'), {
                    total: total
                });

                // 2. Confirm Payment with Card Element
                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement)!,
                    }
                });

                if (result.error) {
                    alert(result.error.message);
                    setIsProcessing(false);
                } else {
                    if (result.paymentIntent.status === 'succeeded') {
                        // 3. Store order in database
                        post(route('orders.store'), {
                            onSuccess: () => clearCart()
                        });
                    }
                }
            } catch (err) {
                console.error(err);
                setIsProcessing(false);
            }
        }

        if (paymentMethod === 'gcash') {
            setIsProcessing(true);
            setTimeout(() => {
                post(route('orders.store'), {
                    onSuccess: () => clearCart()
                });
            }, 1000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-12">
                {/* Order Summary Recap */}
                <section className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-black tracking-tighter">Acquisition Summary</h2>
                    </div>
                    
                    <div className="space-y-8">
                        {itemsData.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-8 py-6 border-b border-gray-50 last:border-0 group">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border border-gray-100 shrink-0">
                                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                                </div>
                                <div className="flex-grow">
                                    <span className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest mb-1 block">Heirloom Selection</span>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{item.name}</h3>
                                    <p className="text-xs text-gray-400 font-medium italic mt-1">Quantity: {item.qty} Units</p>
                                </div>
                                <p className="text-xl font-black text-gray-900 tracking-tighter">₱{(item.price * item.qty).toLocaleString()}.00</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Logistics Recap */}
                <section className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-black tracking-tighter">Logistics Destination</h2>
                        <Link href={route('buyer.delivery')} className="text-[#d4af37] font-black text-[10px] tracking-[0.2em] uppercase underline decoration-[#d4af37]/30 underline-offset-8">Edit Details</Link>
                    </div>
                    <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Delivery Point</h4>
                            <p className="font-bold text-gray-700 leading-relaxed italic text-xs">{deliveryAddress}</p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="lg:col-span-4 space-y-12">
                <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-black mb-10 tracking-tight">Payment Method</h2>
                    <div className="space-y-4">
                        {/* GCash Option */}
                        <div 
                            onClick={() => setPaymentMethod('gcash')} 
                            className={`cursor-pointer w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${paymentMethod === 'gcash' ? 'border-[#d4af37] bg-[#fdfcf0]' : 'border-gray-50 hover:border-gray-200 bg-white'}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-[10px] text-white font-black italic shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">G</div>
                                <span className={`font-black uppercase text-[10px] tracking-widest ${paymentMethod === 'gcash' ? 'text-black' : 'text-gray-400'}`}>GCash E-Wallet</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 p-[2px] transition-all flex items-center justify-center ${paymentMethod === 'gcash' ? 'border-[#d4af37]' : 'border-gray-100'}`}>
                                {paymentMethod === 'gcash' && <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>}
                            </div>
                        </div>

                        {/* Card Option */}
                        <div 
                            onClick={() => setPaymentMethod('card')} 
                            className={`cursor-pointer w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${paymentMethod === 'card' ? 'border-[#d4af37] bg-[#fdfcf0]' : 'border-gray-50 hover:border-gray-200 bg-white'}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
                                </div>
                                <span className={`font-black uppercase text-[10px] tracking-widest ${paymentMethod === 'card' ? 'text-black' : 'text-gray-400'}`}>Credit / Debit Card</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 p-[2px] transition-all flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#d4af37]' : 'border-gray-100'}`}>
                                {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>}
                            </div>
                        </div>

                        {/* Stripe Card Element Rendering */}
                        {paymentMethod === 'card' && (
                            <div className="mt-4 p-6 bg-slate-900 rounded-3xl border border-white/10 shadow-2xl animate-in slide-in-from-top-4 duration-500">
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-4 block">Secure Card Entry</label>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <CardElement options={{
                                        style: {
                                            base: {
                                                fontSize: '14px',
                                                color: '#ffffff',
                                                '::placeholder': { color: '#4b5563' },
                                            },
                                            invalid: { color: '#ef4444' },
                                        },
                                    }} />
                                </div>
                            </div>
                        )}
                        
                        {/* COD Option */}
                        <div 
                            onClick={() => setPaymentMethod('cod')} 
                            className={`cursor-pointer w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${paymentMethod === 'cod' ? 'border-[#d4af37] bg-[#fdfcf0]' : 'border-gray-50 hover:border-gray-200 bg-white'}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 002-2H4z" /><path d="M18 8a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h12z" /><path fillRule="evenodd" d="M9 11a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                </div>
                                <span className={`font-black uppercase text-[10px] tracking-widest ${paymentMethod === 'cod' ? 'text-black' : 'text-gray-400'}`}>Cash on Delivery</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 p-[2px] transition-all flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#d4af37]' : 'border-gray-100'}`}>
                                {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                     <div className="space-y-6 pb-12 border-b border-white/10">
                         <div className="flex justify-between items-center text-white/40 text-[10px] font-black uppercase tracking-widest">
                             <span>Subtotal</span>
                             <span className="text-white">₱{subtotal.toLocaleString()}.00</span>
                         </div>
                         <div className="flex justify-between items-center text-white/40 text-[10px] font-black uppercase tracking-widest">
                             <span>Logistics</span>
                             <span className="text-white">₱{deliveryFee.toLocaleString()}.00</span>
                         </div>
                     </div>
                     
                     <div className="py-12 flex justify-between items-end">
                         <div>
                             <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mb-2 leading-none">Grand Total</p>
                             <p className="text-[#d4af37] text-[10px] font-black leading-none uppercase tracking-tighter">Secure Acquisition</p>
                         </div>
                         <p className="text-5xl font-black tracking-tighter text-[#d4af37]">₱{total.toLocaleString()}.00</p>
                     </div>

                     <button 
                        type="submit"
                        disabled={isProcessing || (paymentMethod === 'card' && !stripe)}
                        className="w-full py-7 bg-[#d4af37] text-[#1a1a1a] rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-white hover:-translate-y-1 transition-all shadow-xl shadow-[#d4af37]/20 group disabled:opacity-50"
                     >
                        {isProcessing ? 'Verifying...' : 'Confirm & Pay'}
                        {!isProcessing && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
                     </button>
                </div>
            </div>
        </form>
    );
};

export default function OrderConfirmPay({ cart_items }: OrderConfirmPayProps) {
    const { cartItems, setItems, deliveryDetails } = useCart();
    
    useEffect(() => {
        if (cartItems.length === 0 && cart_items && cart_items.length > 0) {
            setItems(cart_items);
        }
    }, [cart_items]);

    const activeItems = cartItems.length > 0 ? cartItems : (cart_items || []);
    const subtotal = activeItems.reduce((acc, item) => acc + (parseFloat(String(item.price)) * parseInt(String(item.qty))), 0);
    const deliveryValue = 20;
    const total = subtotal + deliveryValue;

    return (
        <BuyerLayout>
            <Head title="Confirm Payment - Kokommerce" />
            <div className="max-w-7xl mx-auto px-4 pb-32 mt-8">
                <header className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <Link href={route && route('buyer.delivery')} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#d4af37] transition-all group">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#fdfcf0]">
                                <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </div>
                            Return to Delivery
                        </Link>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
                        <span className="text-gray-200">01. Selection</span>
                        <span className="w-8 h-[1px] bg-gray-200"></span>
                        <span className="text-gray-200">02. Delivery</span>
                        <span className="w-8 h-[1px] bg-gray-200"></span>
                        <span className="text-[#d4af37]">03. Payment</span>
                    </div>
                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4 italic">
                        Final <span className="text-[#d4af37]">Commitment.</span>
                    </h1>
                </header>

                <Elements stripe={stripePromise}>
                    <CheckoutForm 
                        total={total} 
                        subtotal={subtotal} 
                        deliveryFee={deliveryValue} 
                        deliveryAddress={deliveryDetails.address}
                        itemsData={activeItems}
                    />
                </Elements>
            </div>
        </BuyerLayout>
    );
}
