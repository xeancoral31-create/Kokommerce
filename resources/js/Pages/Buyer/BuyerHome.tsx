import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';

export default function BuyerHome() {
    const [activeTab, setActiveTab] = React.useState('discover');

    const recommendedItems = [
        { id: 1, name: "Bibingka Royale", price: "₱180", img: "https://images.unsplash.com/photo-1589113331629-34657ce8c9d2?auto=format&fit=crop&q=80&w=400", tag: "Hot Seller" },
        { id: 2, name: "Pandan Macapuno", price: "₱850", img: "https://images.unsplash.com/photo-1544333303-5775aa666d7e?auto=format&fit=crop&q=80&w=400", tag: "New" },
        { id: 3, name: "Artisanal Buko Pie", price: "₱450", img: "https://images.unsplash.com/photo-1572381772749-da6dec4249a0?auto=format&fit=crop&q=80&w=400", tag: "Baker's choice" },
    ];

    return (
        <BuyerLayout>
            <section className="mb-12">
                <div className="buyer-card bg-gradient-to-r from-[#2d2a26] to-[#4a453f] text-white p-12">
                    <span className="text-gold tracking-widest text-xs font-bold uppercase mb-4 block">Welcome Back, Gourmet</span>
                    <h1 className="text-5xl font-bold mb-4">Your Table is <span>Set.</span></h1>
                    <p className="text-gray-300 max-w-lg mb-8">Ready to rediscover the authentic taste of tradition? We've prepared something special just for you today.</p>
                    <button className="btn-buyer btn-buyer-gold inline-block">Order Now</button>
                </div>
            </section>

            <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Curated for You</h2>
                    <div className="flex gap-4">
                        <button onClick={() => setActiveTab('discover')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'discover' ? 'bg-[#2d2a26] text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>Discover</button>
                        <button onClick={() => setActiveTab('recent')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'recent' ? 'bg-[#2d2a26] text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>Recent Favorites</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recommendedItems.map(item => (
                        <div key={item.id} className="buyer-card">
                            <div className="relative overflow-hidden rounded-xl mb-4 h-48">
                                <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#2d2a26] text-[10px] font-bold px-3 py-1 rounded-full">{item.tag}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3>{item.name}</h3>
                                    <p className="text-gold font-bold">{item.price}</p>
                                </div>
                                <button className="w-10 h-10 rounded-full bg-[#f3f0e9] flex items-center justify-center hover:bg-[#eca840] hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </BuyerLayout>
    );
}
