import React, { useState } from "react";

// Logos/Icons
const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
);

const InstagramIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);

const ShareIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
);

const ThreadsIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16.103 13.984c-.58.337-1.192.502-1.836.502-.857 0-1.636-.296-2.203-.84l.035-.11.035-.133c.518-.466.86-.922.86-1.579 0-.466-.196-.922-.518-1.258a1.66 1.66 0 0 0-2.348 0c-.322.336-.518.792-.518 1.258 0 .657.342 1.113.86 1.579l.035.133.036.11c-.567.544-1.346.84-2.203.84-.643 0-1.255-.165-1.835-.502-.63-.366-1.042-.922-1.042-1.745 0-.822.411-1.378 1.041-1.745l.98-.567c1.127-.655 2.597-.655 3.723 0l.98.567c.63.367 1.042.923 1.042 1.745 0 .823-.412 1.379-1.042 1.745zm4.8 5.76A11.9 11.9 0 0 1 12 24C5.373 24 0 18.627 0 12S5.373 0 12 0c6.627 0 12 5.373 12 12 0 3.257-1.3 6.216-3.414 8.356l-1.383-1.383A9.9 9.9 0 0 0 10 1.94 10 10 0 0 0 10 21.94c1.6 0 3.12-.384 4.49-1.066l1.383 1.383c-1.777.925-3.79 1.442-5.873 1.442-6.627 0-12-5.373-12-12S5.373 0 12 0s12 5.373 12 12c0 3.136-1.201 6.002-3.14 8.163l1.383 1.383c2.408-2.653 3.886-6.195 3.886-10.083 0-6.627-5.373-12-12-12-4.225 0-7.94 2.193-10.084 5.514l1.383 1.383c1.782-2.316 4.542-3.834 7.633-3.834 5.523 0 10 4.477 10 10 0 2.298-.775 4.416-2.072 6.1l1.383 1.383A11.9 11.9 0 0 1 20.903 19.744z"/>
    </svg>
);

const XIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z"/></svg>
);

const TikTokIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31 0 2.591.233 3.812.69v4.288a7.805 7.805 0 01-3.612-.897V16.85a4.706 4.706 0 11-4.706-4.706c.19 0 .376.012.56.035v-4.35a9.056 9.056 0 00-.56-.017 9.057 9.057 0 109.057 9.057V6.158a12.115 12.115 0 006.883 2.117V3.927a7.82 7.82 0 01-5.183-1.896V.02h-6.233z"/></svg>
);

const GmailIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);

export default function Footer() {
    const [isShareOpen, setIsShareOpen] = useState(false);

    const shareOptions = [
        { name: "Facebook", icon: <FacebookIcon />, url: "https://facebook.com", color: "text-[#1877F2]" },
        { name: "Instagram", icon: <InstagramIcon />, url: "https://instagram.com", color: "text-[#E4405F]" },
        { name: "Threads", icon: <ThreadsIcon />, url: "https://threads.net", color: "text-black" },
        { name: "X", icon: <XIcon />, url: "https://x.com", color: "text-black" },
        { name: "TikTok", icon: <TikTokIcon />, url: "https://tiktok.com", color: "text-black" },
        { name: "Gmail", icon: <GmailIcon />, url: "mailto:?subject=Check this bakery!", color: "text-[#D14836]" },
    ];

    return (
        <footer className="footer-koko">
            <div className="container-custom">
                <div className="footer-grid">
                    <div>
                        <h2 className="footer-logo">Kokommerce</h2>
                        <p className="footer-text">
                            Preserving heritage through artisanal baking. We use only the finest local ingredients to bring you the authentic taste of home.
                        </p>
                        
                        {/* Social Buttons */}
                        <div className="social-links">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
                                <FacebookIcon />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
                                <InstagramIcon />
                            </a>
                            <button onClick={() => setIsShareOpen(true)} className="social-icon">
                                <ShareIcon />
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3>Menu</h3>
                        <ul>
                            {['Breads', 'Kakanin', 'Cakes & Pastries', 'Gifts & Bundles'].map((item) => (
                                <li key={item}><a href="#">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3>Support</h3>
                        <ul>
                            {['Shipping Policy', 'FAQs', 'Contact Us', 'Wholesale'].map((item) => (
                                <li key={item}><a href="#">{item}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Kokommerce Artisanal Bakery. All rights reserved.</p>
                    <div className="bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {isShareOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsShareOpen(false)} />
                    <div className="share-card relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100 opacity-100">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-gray-900">Share Kokommerce</h4>
                            <button onClick={() => setIsShareOpen(false)} className="text-gray-400 hover:text-gray-900">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            {shareOptions.map((opt) => (
                                <a 
                                    key={opt.name} 
                                    href={opt.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl bg-[#faf9f6] flex items-center justify-center ${opt.color} group-hover:scale-110 transition-transform duration-200 border border-gray-100`}>
                                        {opt.icon}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{opt.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}
