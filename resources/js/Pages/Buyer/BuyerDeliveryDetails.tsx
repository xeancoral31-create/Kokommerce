import React, { useState, useEffect, useRef } from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head, Link } from '@inertiajs/inertia-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon issues in bundled environments
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

declare function route(name: string, params?: any): string;

interface BuyerDeliveryDetailsProps {
    cart_items: any[];
}

export default function BuyerDeliveryDetails({ cart_items }: BuyerDeliveryDetailsProps) {
    const [address, setAddress] = useState('Pin your artisanal delivery point...');
    const [isDetecting, setIsDetecting] = useState(false);
    const [receiverName, setReceiverName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    const subtotal = cart_items.reduce((acc, item) => acc + (parseFloat(String(item.price)) * parseInt(String(item.qty))), 0);
    const delivery = 120;
    const total = subtotal + delivery;

    useEffect(() => {
        // Initialize Map
        if (!mapRef.current) {
            mapRef.current = L.map('delivery-map').setView([10.3157, 123.8854], 13); // Default to Cebu City coords as example

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapRef.current);

            // Add initial marker at center
            markerRef.current = L.marker([10.3157, 123.8854], { draggable: true }).addTo(mapRef.current);

            // Update address when marker is dragged
            markerRef.current.on('dragend', async (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                updateAddressFromCoords(position.lat, position.lng);
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    const updateAddressFromCoords = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (data.display_name) {
                setAddress(data.display_name);
            } else {
                setAddress(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            }
        } catch (error) {
            setAddress(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
    };

    const handleDetectLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    if (mapRef.current && markerRef.current) {
                        mapRef.current.setView([latitude, longitude], 16);
                        markerRef.current.setLatLng([latitude, longitude]);
                        await updateAddressFromCoords(latitude, longitude);
                    }
                    setIsDetecting(false);
                },
                (error) => {
                    console.error("Error detecting location:", error);
                    setIsDetecting(false);
                    alert("Unable to detect location. Please check your browser permissions.");
                },
                { enableHighAccuracy: true }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            setIsDetecting(false);
        }
    };

    return (
        <BuyerLayout>
            <div className="max-w-6xl mx-auto pb-20">
                <header className="mb-12">
                    <h1 className="text-5xl font-black text-[#2d2a26] tracking-tight">Set Delivery Point</h1>
                    <p className="text-gray-500 mt-2 font-medium">Pinpoint exactly where your fresh treats should land.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                     <div className="lg:col-span-2 space-y-12">
                         {/* Real Leaflet Map */}
                         <div className="relative group">
                            <div 
                                id="delivery-map" 
                                className="h-[500px] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-4 border-white"
                            >
                                {/* Leaflet map will be injected here */}
                            </div>

                            <div className="absolute bottom-10 inset-x-10 z-20">
                                <div className="buyer-card bg-white p-8 rounded-[2.5rem] flex items-center justify-between border-none shadow-2xl backdrop-blur-md bg-white/95 ring-1 ring-black/5">
                                    <div className="flex items-center gap-6 flex-1 pr-6">
                                        <div className="w-14 h-14 bg-[#fff8e6] rounded-2xl flex items-center justify-center text-[#eca840] shrink-0">
                                             <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Target Destination</p>
                                            <p className="font-bold text-[#2d2a26] text-sm leading-tight truncate">{address}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleDetectLocation}
                                        disabled={isDetecting}
                                        className={`bg-[#eca840] text-white font-black text-xs px-8 py-5 rounded-2xl hover:bg-[#d6942f] transition-all shadow-xl shadow-[#eca840]/20 flex items-center gap-3 uppercase tracking-widest shrink-0 ${isDetecting ? 'animate-pulse' : ''}`}
                                    >
                                        {isDetecting ? 'Locating...' : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                Detect Map
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                         </div>

                         {/* Receiver Details Form */}
                         <section className="buyer-card p-12 bg-white rounded-[3rem] shadow-sm">
                             <div className="flex items-center gap-6 mb-12">
                                 <div className="w-2 h-12 bg-[#eca840] rounded-full"></div>
                                 <h2 className="text-4xl font-black tracking-tight">Receiver Details</h2>
                             </div>
                             <div className="space-y-10">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                     <div className="space-y-4">
                                         <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Receiver Name</label>
                                         <input 
                                            type="text" 
                                            value={receiverName}
                                            onChange={(e) => setReceiverName(e.target.value)}
                                            placeholder="Who's receiving the treats?" 
                                            className="w-full bg-[#fdfaf5] border-2 border-transparent rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all font-bold text-[#2d2a26]" 
                                         />
                                     </div>
                                     <div className="space-y-4">
                                         <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Contact Number</label>
                                         <input 
                                            type="tel" 
                                            value={contactNumber}
                                            onChange={(e) => setContactNumber(e.target.value)}
                                            placeholder="+63 XXX XXX XXXX" 
                                            className="w-full bg-[#fdfaf5] border-2 border-transparent rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all font-bold text-[#2d2a26]" 
                                         />
                                     </div>
                                 </div>
                                 <div className="space-y-4">
                                     <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Detailed Address / Landmark</label>
                                     <input 
                                        type="text" 
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Floor, Unit, or Landmark nearby..." 
                                        className="w-full bg-[#fdfaf5] border-2 border-transparent rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all font-bold text-[#2d2a26]" 
                                     />
                                 </div>
                                 <div className="space-y-4">
                                     <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Special Delivery Instructions</label>
                                     <textarea rows={4} placeholder="Leave at the doorstep if no answer, ring the bell once..." className="w-full bg-[#fdfaf5] border-2 border-transparent rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all font-bold text-[#2d2a26] resize-none"></textarea>
                                 </div>
                             </div>
                         </section>
                     </div>

                     {/* Sidebar: Summary and Action */}
                     <div className="space-y-8">
                         <div className="order-summary-box shadow-2xl p-10 bg-[#2d2a26] text-white rounded-[3rem]">
                             <h2 className="text-2xl font-black mb-8 border-b border-white/10 pb-6 tracking-tight">Artisanal Basket</h2>
                             <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                                 {cart_items.map(item => (
                                     <div key={item.id} className="flex gap-4">
                                         <img src={item.img} className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white/10" alt={item.name} />
                                         <div className="flex-grow">
                                             <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-sm leading-tight max-w-[120px]">{item.name}</h4>
                                                <span className="text-[#eca840] font-black">₱{(parseFloat(String(item.price)) * parseInt(String(item.qty))).toLocaleString()}</span>
                                             </div>
                                             <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-widest bg-white/5 inline-block px-3 py-1 rounded-lg">Qty: {item.qty}</p>
                                         </div>
                                     </div>
                                 ))}
                             </div>

                             <div className="h-px bg-white/10 my-10"></div>

                             <div className="space-y-4">
                                 <div className="flex justify-between text-sm text-gray-400"><span>Subtotal</span> <span className="text-white font-bold">₱{subtotal.toLocaleString()}</span></div>
                                 <div className="flex justify-between text-sm text-gray-400"><span>Delivery Fee</span> <span className="text-white font-bold">₱{delivery.toLocaleString()}</span></div>
                                 <div className="flex justify-between items-center total pt-8 border-t border-white/10 mt-6">
                                     <span className="text-lg font-black">Total</span>
                                     <span className="text-3xl font-black text-[#eca840]">₱{total.toLocaleString()}</span>
                                 </div>
                             </div>

                             <Link 
                                href={route('buyer.payment')}
                                className="w-full bg-[#eca840] text-white py-6 mt-10 rounded-2xl text-sm font-black shadow-2xl shadow-black/20 flex items-center justify-center uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all text-center"
                             >
                                Confirm & Pay Now
                             </Link>
                         </div>

                         <div className="p-10 bg-white border border-gray-100 rounded-[2.5rem] flex items-start gap-4 shadow-sm ring-1 ring-black/5">
                             <div className="w-10 h-10 flex-shrink-0 text-[#eca840] bg-[#fff8e6] rounded-xl flex items-center justify-center">
                                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zM10 16a1 1 0 100 2 1 1 0 000-2zM3 11a1 1 0 100-2H2a1 1 0 100 2h1zm2.464-4.95a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707z" clipRule="evenodd" /></svg>
                             </div>
                             <div>
                                 <h5 className="font-black text-sm text-[#2d2a26]">Sustainable Packaging</h5>
                                 <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-medium">All orders are delivered in compostable, plastic-free thermal wrap.</p>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        </BuyerLayout>
    );
}
