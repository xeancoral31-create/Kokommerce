import React, { useState } from 'react';
import { Head } from '@inertiajs/inertia-react';

interface MockEwalletProps {
    source_id: string;
    amount: number;
    provider: 'gcash' | 'maya';
    reference: string;
    items: any[];
}

export default function MockEwallet({ source_id, amount, provider, reference, items }: MockEwalletProps) {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    const isGcash = provider === 'gcash';
    const primaryColor  = isGcash ? '#0066d6' : '#008a45';
    const providerLabel = isGcash ? 'GCash' : 'Maya';

    const handleConfirm = () => {
        setStatus('processing');
        setTimeout(() => setStatus('success'), 2000);
    };

    const deliveryFee = 20;
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

    return (
        <>
            <Head title={`Receipt - ${providerLabel} Secure Checkout`} />

            <div className="min-h-screen bg-[#121417] flex flex-col items-center justify-center p-4 md:p-8 selection:bg-[#d4af37]/30" style={{ fontFamily: "'Inter', sans-serif" }}>
                
                {/* Background Accents */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#d4af37]/5 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
                </div>

                <div className="w-full max-w-lg relative">
                    {/* Header Branding */}
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#d4af37] rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
                                <span className="text-white font-black text-xs uppercase tracking-tighter">Koko</span>
                            </div>
                            <div>
                                <h1 className="text-white font-black text-sm uppercase tracking-[0.2em]">Kokommerce</h1>
                                <p className="text-[#d4af37] text-[8px] font-bold uppercase tracking-widest italic">Artisanal Bakery Terminal</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest block">Checkout Portal</span>
                            <span className="text-white text-[10px] font-bold flex items-center gap-1.5 justify-end">
                                <span className={`w-1.5 h-1.5 rounded-full ${isGcash ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                                {providerLabel} Protected
                            </span>
                        </div>
                    </div>

                    {/* Main Receipt Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/10">
                        {status !== 'success' ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {/* Order Summary Header */}
                                <div className="p-8 pb-4 border-b border-gray-100 bg-gray-50/50">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2 italic">Official <span className="text-[#d4af37]">Receipt.</span></h2>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Reference: {reference}</p>
                                        </div>
                                        <div className="bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm text-center min-w-[80px]">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Payment Via</p>
                                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{providerLabel}</p>
                                        </div>
                                    </div>

                                    {/* Itemized List */}
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 group">
                                                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm group-hover:border-[#d4af37]/30 transition-colors">
                                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-wide truncate">{item.name}</h3>
                                                    <p className="text-[10px] text-gray-400 font-medium">
                                                        Qty: {item.qty} · <span className="italic">₱{item.price.toLocaleString()}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-gray-900 tracking-tight">₱{(item.price * item.qty).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Calculation Nexus */}
                                <div className="p-8 pt-6 space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <span>Subtotal Settlement</span>
                                        <span className="text-gray-900 font-black">₱{subtotal.toLocaleString()}.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 pb-4 border-b border-gray-100">
                                        <span>Logistics & Delivery</span>
                                        <span className="text-gray-900 font-black">₱{deliveryFee.toLocaleString()}.00</span>
                                    </div>
                                    
                                    <div className="pt-2 flex justify-between items-center">
                                        <div>
                                            <p className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-1">Total Authorization</p>
                                            <p className="text-[9px] text-[#d4af37] font-bold uppercase tracking-widest">Safe Simulated Payment</p>
                                        </div>
                                        <p className="text-4xl font-black text-gray-900 tracking-tighter italic">
                                            <sup className="text-lg align-super font-bold mr-1">₱</sup>
                                            {amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    {/* Tech Registry */}
                                    <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-400">
                                            <span>System Source ID</span>
                                            <span className="font-mono text-gray-500">{source_id}</span>
                                        </div>
                                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-400">
                                            <span>Checkout Gateway</span>
                                            <span className="text-gray-500">{providerLabel} E-Wallet</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-6 space-y-4">
                                        <button
                                            onClick={handleConfirm}
                                            disabled={status === 'processing'}
                                            className={`w-full py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl ${status === 'processing' ? 'bg-gray-400' : 'bg-gray-900 hover:bg-black shadow-gray-900/20'}`}
                                        >
                                            {status === 'processing' ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    Committing...
                                                </>
                                            ) : (
                                                `Finalize ₱${amount.toLocaleString()}`
                                            )}
                                        </button>
                                        <button
                                            onClick={() => window.close()}
                                            className="w-full py-4 text-gray-300 hover:text-gray-500 text-[9px] font-black uppercase tracking-widest transition-colors"
                                        >
                                            Abandon Transaction
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Success State - Professional Mastery */
                            <div className="p-12 text-center animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner relative group">
                                    <div className="absolute inset-0 bg-emerald-500/10 rounded-[2rem] animate-ping opacity-20"></div>
                                    <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic mb-4">Settlement <span className="text-emerald-500">Confirmed.</span></h2>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-8 max-w-[240px] mx-auto">
                                    Your artisanal order has been formally secured in the registry. You may now return to your dashboard.
                                </p>
                                <button
                                    onClick={() => window.close()}
                                    className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-gray-900/20 active:scale-95"
                                >
                                    Exit Terminal
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer Credentials */}
                    <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Encryption v4.2</span>
                        <span className="w-1 h-1 rounded-full bg-[#d4af37]"></span>
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Mock Environment</span>
                        <span className="w-1 h-1 rounded-full bg-[#d4af37]"></span>
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Kokommerce Secure</span>
                    </div>
                </div>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #f1f1f1;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #d4af37;
                    }
                `}</style>
            </div>
        </>
    );
}
