import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head, useForm } from '@inertiajs/inertia-react';

declare function route(name: string, params?: any): string;

interface OffersProps {
  promotions: any[];
  products: any[];
  stats: {
    total_reach: string;
    active_offers: number;
    conversion_rate: string;
  };
}

export default function SellerOffers({ promotions, products, stats }: OffersProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPromo, setEditingPromo] = React.useState<any>(null);

  const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
    title: '',
    description: '',
    code: '',
    type: 'percentage',
    discount_value: '',
    product_id: '',
    status: 'active',
    image: ''
  });

  const openAddModal = () => {
    setEditingPromo(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (promo: any) => {
    setEditingPromo(promo);
    setData({
      title: promo.title,
      description: promo.description || '',
      code: promo.code,
      type: promo.type,
      discount_value: promo.discount_value,
      product_id: promo.product_id || '',
      status: promo.status,
      image: promo.image || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromo) {
      put(route('seller.promotions.update', editingPromo.id), {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      post(route('seller.promotions.store'), {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const handleDelete = (promo: any) => {
    if (confirm(`Are you sure you want to remove the "${promo.title}" campaign?`)) {
      destroy(route('seller.promotions.destroy', promo.id));
    }
  };

  return (
    <SellerLayout>
      <Head title="Offers & Promotions" />

      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">Elevate Your Reach</h1>
          <p className="text-gray-500 font-bold text-lg max-w-xl leading-relaxed">
             Curate exclusive artisanal offers and scale your bakery's presence across our global gallery.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-4 px-10 py-6 bg-[#f5a623] text-white rounded-3xl text-sm font-black hover:shadow-2xl hover:shadow-[#f5a623]/30 transition-all uppercase tracking-[0.15em]"
        >
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </span>
          Create Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
         <PromoStatCard label="Total Reach" value={stats.total_reach} change="+12% this month" icon="reach" />
         <PromoStatCard label="Active Offers" value={stats.active_offers.toString()} change="Currently running live" icon="offers" />
         <PromoStatCard label="Conversion Rate" value={stats.conversion_rate} change="Top 5% in Bakery" icon="conversion" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {promotions.map((promo) => (
           <CampaignCard 
             key={promo.id} 
             promo={promo} 
             onEdit={() => openEditModal(promo)}
             onDelete={() => handleDelete(promo)}
           />
         ))}
         
         <div onClick={openAddModal} className="bg-white/40 border-2 border-dashed border-gray-100 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#f5a623] transition-all">
            <div className="w-16 h-16 rounded-full bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] mb-8 group-hover:scale-110 transition-all">
               <svg className="w-8 h-8 font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Create New Offer</h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[160px]">Add a new promotion to your list</p>
         </div>
      </div>

      {/* Promotion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-12">
                <div className="flex justify-between items-start mb-10">
                   <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">{editingPromo ? 'Refine Campaign' : 'New Campaign'}</h2>
                      <p className="text-sm text-gray-400 font-medium mt-1">Design a high-impact promotional event.</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Campaign Title</label>
                         <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#f5a623]/20" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Promo Code</label>
                         <input type="text" value={data.code} onChange={e => setData('code', e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#f5a623]/20" />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount Value</label>
                         <input type="number" value={data.discount_value} onChange={e => setData('discount_value', e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#f5a623]/20" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount Type</label>
                         <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#f5a623]/20">
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (₱)</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Product (Optional)</label>
                      <select value={data.product_id} onChange={e => setData('product_id', e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#f5a623]/20">
                         <option value="">All Products</option>
                         {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                      <input type="text" value={data.image} onChange={e => setData('image', e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#f5a623]/20" />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#f5a623]/20 resize-none"></textarea>
                   </div>

                   <button type="submit" disabled={processing} className="w-full py-5 bg-[#f5a623] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#f5a623]/20 hover:bg-[#d69635] transition-all disabled:opacity-50">
                      {processing ? 'Processing...' : (editingPromo ? 'Refine Promotion' : 'Launch Promotion')}
                   </button>
                </form>
             </div>
          </div>
        </div>
      )}

    </SellerLayout>
  );
}

const PromoStatCard = ({ label, value, change, icon }: any) => (
  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative group overflow-hidden">
    <div className="absolute -top-4 -left-4 w-24 h-24 bg-gray-50/50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-10">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
         <div className="text-[#f5a623]">
            {icon === 'reach' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>}
            {icon === 'offers' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>}
            {icon === 'conversion' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
         </div>
      </div>
      <h2 className="text-5xl font-black text-gray-900 mb-4">{value}</h2>
      <p className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
         {change.includes('+') ? '↗' : '🎯'} {change}
      </p>
    </div>
  </div>
);

const CampaignCard = ({ promo, onEdit, onDelete }: any) => (
  <div className="group bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2">
    <div className="relative aspect-[16/11] overflow-hidden">
      <img src={promo.image || "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600"} alt={promo.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      <span className="absolute top-6 left-6 bg-[#111] text-white text-[9px] font-black px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Preview Campaign</span>
      <span className={`absolute top-6 right-6 text-white text-[9px] font-black px-3 py-1.5 rounded-lg ${promo.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}>{promo.status.toUpperCase()}</span>
    </div>
    <div className="p-10">
      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight truncate group-hover:text-[#f5a623] transition-colors">{promo.title}</h3>
      <p className="text-[10px] font-black text-[#f5a623] uppercase tracking-widest mb-6">{promo.product?.name || 'All Products'}</p>
      
      <div className="flex justify-between items-end mb-10">
         <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Redemptions</p>
            <p className="text-xl font-black text-gray-900">{promo.redemptions}</p>
         </div>
         <div className="text-right">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Benefit</p>
            <p className="text-xl font-black text-[#f5a623]">{promo.type === 'percentage' ? `${promo.discount_value}% OFF` : `₱${promo.discount_value} OFF`}</p>
         </div>
      </div>

      <div className="flex gap-4">
         <button onClick={onEdit} className="flex-1 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-100 transition-all border border-gray-50 flex items-center justify-center gap-2">
           Edit
         </button>
         <button onClick={onDelete} className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-red-300 hover:text-red-500 transition-all border border-gray-50">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
         </button>
      </div>
    </div>
  </div>
);

