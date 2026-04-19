import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head, useForm } from '@inertiajs/inertia-react';

declare function route(name?: string, params?: any, absolute?: boolean, config?: any): string;

interface SettingsProps {
  store_profile: any;
  operating_hours: any[];
  payment_methods: any[];
}

export default function SellerSettings({ store_profile, operating_hours, payment_methods }: SettingsProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: store_profile.name,
    tagline: store_profile.tagline,
    description: store_profile.description,
    image: null as File | null,
  });

  const [preview, setPreview] = React.useState(store_profile.image || "https://via.placeholder.com/300?text=Logo");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        // Special Sync for Sidebar and Header (Image 2 & 3)
        window.dispatchEvent(new CustomEvent('artisanal_profile_sync', { 
          detail: { image: result } 
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSchedule = () => {
    alert("Artisanal Schedule Management: Your operating hours are currently being synchronized with our logistics engine.");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('seller.settings.update'), {
      onSuccess: () => alert("Bakery configuration successfully saved and artisanal storefront updated!"),
    });
  };

  return (
    <SellerLayout>
      <Head title="Store Settings" />

      <form onSubmit={submit}>
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="inline-block bg-[#f5a623] text-white text-[9px] font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-[0.2em]">Store Management</span>
            <h1 className="text-7xl font-black text-gray-900 tracking-tighter mb-4 leading-none">Configure Your Bakery</h1>
            <p className="text-gray-500 font-bold text-xl max-w-2xl leading-relaxed">
               Tailor your digital storefront to match the warmth and craftsmanship of your physical kitchen.
            </p>
          </div>
          <div className="flex gap-6">
             <button 
              type="button" 
              onClick={() => alert("Artisanal Preview: Generating a live snapshot of '"+data.name+"' for customer-facing storefronts...")}
              className="px-12 py-5 bg-gray-50 text-gray-400 rounded-2xl text-sm font-black hover:bg-gray-100 transition-all uppercase tracking-widest"
             >
                Preview
             </button>
             <button 
              type="submit" 
              disabled={processing}
              className="px-12 py-5 bg-[#f5a623] text-white rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-[#f5a623]/30 transition-all uppercase tracking-widest shadow-xl disabled:opacity-50"
             >
                {processing ? 'Saving...' : 'Save All Changes'}
             </button>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Main Configuration Area */}
           <div className="lg:col-span-2 space-y-12">
              {/* Store Profile Section */}
              <div className="bg-white rounded-[3rem] p-16 border border-gray-100 shadow-sm">
                 <div className="flex items-center gap-4 mb-12">
                    <span className="text-2xl">🏬</span>
                    <h3 className="text-3xl font-black text-gray-900">Store Profile</h3>
                 </div>
                 
                 <div className="flex gap-12 items-start">
                    <div className="relative group">
                       <div className="w-56 h-56 rounded-[2.5rem] bg-[#1a1c23] flex items-center justify-center p-8 overflow-hidden">
                          <img src={preview} alt="Store Logo" className="w-full h-full object-contain" />
                       </div>
                       <label className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-xl shadow-xl border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-all cursor-pointer">
                          <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                       </label>
                    </div>
                    
                    <div className="flex-1 space-y-8">
                       <SettingsInput 
                        label="Store Name" 
                        value={data.name} 
                        onChange={(e: any) => {
                          const val = e.target.value;
                          setData('name', val);
                          window.dispatchEvent(new CustomEvent('artisanal_profile_sync', { 
                            detail: { name: val } 
                          }));
                        }}
                        placeholder="Enter your bakery name" 
                       />

                       <SettingsInput 
                        label="Tagline" 
                        value={data.tagline} 
                        onChange={(e: any) => setData('tagline', e.target.value)}
                        placeholder="Enter a catchy tagline" 
                       />
                    </div>
                 </div>
                 
                 <div className="mt-12">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Description</p>
                    <textarea 
                      className="w-full h-48 bg-gray-50 border-none rounded-[2rem] p-8 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-[#f5a623] transition-all resize-none"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                    ></textarea>
                 </div>
              </div>

              {/* Payment Methods Section */}
              <div className="bg-white rounded-[3rem] p-16 border border-gray-100 shadow-sm">
                 <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                       <span className="text-2xl">💵</span>
                       <h3 className="text-3xl font-black text-gray-900">Payment Methods</h3>
                    </div>
                    <button type="button" className="text-xs font-black text-[#f5a623] uppercase tracking-widest hover:underline transition-all">Add New Method</button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {payment_methods.map(method => (
                      <div key={method.id} className="group p-8 border border-gray-100 rounded-[2rem] hover:border-[#f5a623]/30 transition-all relative overflow-hidden">
                         <div className="flex justify-between items-start mb-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-xl shadow-blue-500/10 ${method.name.includes('GCash') ? 'bg-blue-600' : 'bg-[#1a1c23]'}`}>
                               {method.name.includes('GCash') ? 'GC' : '🏛️'}
                            </div>
                            <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${method.status === 'ACTIVE' ? 'bg-orange-50 border-orange-100 text-[#f5a623]' : 'bg-green-50 border-green-100 text-green-500'}`}>
                               {method.status}
                            </span>
                         </div>
                         <h4 className="text-xl font-bold text-gray-900 mb-2">{method.name}</h4>
                         <p className="text-xs text-gray-400 font-bold mb-10">{method.details}</p>
                         <button type="button" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-all">
                            {method.status === 'ACTIVE' ? 'Edit Details' : 'Configure'}
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Sidebar Controls Area */}
           <div className="space-y-12">
              {/* Operating Hours */}
              <div className="bg-white rounded-[3rem] p-12 border border-orange-100 shadow-xl shadow-orange-500/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                 <div className="flex items-center gap-4 mb-10 relative z-10">
                    <span className="text-2xl">🕒</span>
                    <h3 className="text-2xl font-black text-gray-900">Operating Hours</h3>
                 </div>
                 
                 <div className="space-y-6 relative z-10 mb-12">
                    {operating_hours.map(day => (
                      <div key={day.day} className="flex justify-between items-center group/day">
                         <span className="text-sm font-bold text-gray-400 group-hover/day:text-gray-900 transition-all">{day.day}</span>
                         <span className={`text-sm font-black ${day.hours === 'CLOSED' ? 'text-red-500' : 'text-gray-900'}`}>{day.hours}</span>
                      </div>
                    ))}
                 </div>
                 
                 <button 
                  type="button"
                  onClick={handleUpdateSchedule}
                  className="w-full py-5 bg-gray-50 rounded-[1.5rem] text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] hover:bg-gray-100 transition-all relative z-10 border border-gray-100"
                 >
                    Update Schedule
                 </button>
              </div>

              {/* Live Storefront Status */}
              <div className="bg-[#1a1c23] rounded-[3rem] p-12 text-white relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-transparent"></div>
                 <h3 className="text-2xl font-black mb-6">Live Storefront</h3>
                 <p className="text-sm text-gray-400 font-medium leading-relaxed mb-12">
                    Your store is currently visible to customers in the "Bakery" category.
                 </p>
                 
                 <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse"></div>
                       <span className="text-xs font-bold uppercase tracking-widest text-white/60">Store is Online</span>
                    </div>
                    <div className="w-12 h-6 bg-white/10 rounded-full relative p-1 flex items-center">
                       <div className="w-4 h-4 bg-[#f5a623] rounded-full translate-x-6"></div>
                    </div>
                 </div>
              </div>

              {/* Support CTA */}
              <div className="bg-gray-50/50 border border-gray-100/50 rounded-[3rem] p-12 text-center group">
                 <p className="text-sm text-gray-400 font-bold mb-6">Need help setting up your store?</p>
                 <button type="button" className="flex items-center justify-center gap-4 w-full py-5 text-[#f5a623] font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                    <span className="bg-[#f5a623]/10 p-2 rounded-xl">❓</span>
                    Talk to a Specialist
                 </button>
              </div>
           </div>
        </div>
      </form>

    </SellerLayout>
  );
}

const SettingsInput = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-4">
     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
     <input 
      type="text" 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-50 border-none rounded-[1.5rem] px-8 py-5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#f5a623] transition-all placeholder:text-gray-300" 
     />
  </div>
);

