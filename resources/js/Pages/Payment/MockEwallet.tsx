import React, { useState } from 'react';
import { Head } from '@inertiajs/inertia-react';

interface MockEwalletProps {
    source_id: string;
    amount: number;
    provider: 'gcash' | 'maya';
    reference: string;
}

export default function MockEwallet({ source_id, amount, provider, reference }: MockEwalletProps) {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    const isGcash = provider === 'gcash';

    const primaryColor  = isGcash ? '#0066d6' : '#008a45';
    const headerColor   = isGcash ? '#005ab8' : '#007038';
    const bgColor       = isGcash ? '#f0f5ff' : '#f0fff6';
    const borderColor   = isGcash ? '#cce0ff' : '#bbf7d0';
    const logoLabel     = isGcash ? 'G' : 'maya';
    const providerLabel = isGcash ? 'GCash' : 'Maya';

    const handleConfirm = () => {
        setStatus('processing');
        setTimeout(() => setStatus('success'), 2000);
    };

    return (
        <>
            <Head title={`${providerLabel} – Secure Payment`} />

            <div
                className="min-h-screen flex flex-col items-center justify-center p-6"
                style={{ background: primaryColor, fontFamily: "'Inter', sans-serif" }}
            >
                {/* Card */}
                <div className="w-full max-w-sm bg-white rounded-[2rem] overflow-hidden shadow-2xl"
                     style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.3)' }}>

                    {/* Header */}
                    <div className="flex items-center gap-4 px-6 py-5" style={{ background: headerColor }}>
                        <div
                            className="w-13 h-13 flex-shrink-0 rounded-2xl flex items-center justify-center bg-white"
                            style={{
                                width: 52, height: 52,
                                fontSize: isGcash ? '1.4rem' : '0.7rem',
                                fontWeight: 900,
                                fontStyle: isGcash ? 'italic' : 'normal',
                                color: primaryColor,
                                letterSpacing: isGcash ? 0 : '-0.05em',
                            }}
                        >
                            {logoLabel}
                        </div>
                        <div>
                            <h1 className="text-white font-extrabold text-lg tracking-tight leading-none">
                                {providerLabel} Checkout
                            </h1>
                            <p className="text-white/60 text-xs font-medium mt-0.5">Secure Payment Gateway</p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-6">

                        {status !== 'success' ? (
                            <>
                                {/* Merchant */}
                                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 mb-5">
                                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#d4af37] font-black text-[10px] uppercase tracking-wider">Koko</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Paying to</p>
                                        <p className="text-sm font-black text-gray-900">Kokommerce Bakery</p>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div
                                    className="text-center rounded-2xl p-5 mb-5 border-2"
                                    style={{ background: bgColor, borderColor }}
                                >
                                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">Amount Due</p>
                                    <p className="text-4xl font-black tracking-tight" style={{ color: primaryColor }}>
                                        <sup className="text-xl align-super">₱</sup>
                                        {amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>

                                {/* Reference rows */}
                                <div className="space-y-0 mb-4">
                                    {[
                                        { label: 'Reference No.', value: reference },
                                        { label: 'Provider',      value: `${providerLabel} E-Wallet` },
                                        { label: 'Source ID',     value: source_id, mono: true },
                                    ].map((row, i, arr) => (
                                        <div
                                            key={row.label}
                                            className={`flex justify-between items-center py-3 text-sm ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                                        >
                                            <span className="text-gray-400 font-medium">{row.label}</span>
                                            <span
                                                className={`font-bold text-gray-900 ${row.mono ? 'font-mono text-xs text-gray-500' : ''}`}
                                                style={{ maxWidth: '55%', wordBreak: 'break-all', textAlign: 'right' }}
                                            >
                                                {row.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Test mode badge */}
                                <div className="flex justify-center mb-5">
                                    <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                                        Test Mode — Simulated Payment
                                    </span>
                                </div>

                                {/* Pay button */}
                                <button
                                    onClick={handleConfirm}
                                    disabled={status === 'processing'}
                                    className="w-full py-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                                    style={{ background: primaryColor }}
                                >
                                    {status === 'processing' ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Confirm Payment — ₱{amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </>
                                    )}
                                </button>

                                {/* Cancel */}
                                <button
                                    onClick={() => window.close()}
                                    className="w-full py-3 mt-3 rounded-2xl border-2 border-gray-100 text-gray-400 font-bold text-sm hover:border-gray-200 hover:text-gray-500 transition-all"
                                >
                                    Cancel Payment
                                </button>
                            </>
                        ) : (
                            /* Success State */
                            <div className="flex flex-col items-center text-center py-8">
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center mb-5 border-4"
                                    style={{ background: '#dcfce7', borderColor: '#86efac', animation: 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                                >
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-black text-gray-900 mb-2">Payment Confirmed!</h2>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    ₱{amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} paid to Kokommerce.<br />
                                    You may close this tab and return to the app.
                                </p>
                                <button
                                    onClick={() => window.close()}
                                    className="mt-6 px-6 py-3 rounded-2xl text-white font-bold text-sm"
                                    style={{ background: primaryColor }}
                                >
                                    Close Tab
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-300 text-[10px] font-medium pb-4">
                        Secured by <strong className="text-gray-400">{providerLabel}</strong> · Test Environment
                    </p>
                </div>

                <style>{`
                    @keyframes pop {
                        0% { transform: scale(0); }
                        100% { transform: scale(1); }
                    }
                `}</style>
            </div>
        </>
    );
}
