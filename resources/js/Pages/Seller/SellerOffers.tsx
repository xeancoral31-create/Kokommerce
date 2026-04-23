import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head, useForm } from '@inertiajs/inertia-react';

declare function route(name: string, params?: any): string;

interface OffersProps {
  promotions: any[];
  archived_promotions: any[];
  products: any[];
  stats: {
    total_reach: string;
    reach_growth: string;
    active_offers: number;
    conversion_rate: string;
    users_converted: number;
  };
}

export default function SellerOffers({ promotions, archived_promotions, products, stats }: OffersProps) {
  const [activeTab, setActiveTab] = React.useState('Active Campaigns');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPromo, setEditingPromo] = React.useState<any>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentStep, setCurrentStep] = React.useState(1);
  const itemsPerPage = 7;

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
    setCurrentStep(1);
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
    setCurrentStep(1);
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
    if (confirm(`Move the "${promo.title}" campaign to the archive?`)) {
      destroy(route('seller.promotions.destroy', promo.id));
    }
  };

  const handleRestore = (id: number) => {
    post(route('seller.promotions.restore', id));
  };

  const handlePermanentDelete = (id: number) => {
    if (confirm('Permanently remove this campaign? This action cannot be undone.')) {
      destroy(route('seller.promotions.forceDelete', id));
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
          className="flex items-center gap-3 px-8 py-5 bg-[#eca840] text-white rounded-[2rem] text-xs font-[1000] hover:shadow-2xl hover:shadow-[#eca840]/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em]"
        >
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </span>
          Create Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
        <PromoStatCard label="Total Performance Reach" value={stats.total_reach} change={stats.reach_growth} icon="reach" />
        <PromoStatCard label="Live Active Curation" value={stats.active_offers.toString()} change="Synchronized Hub" icon="offers" />
        <PromoStatCard label="Market Conversion" value={stats.conversion_rate} change={`${stats.users_converted} conversions`} icon="conversion" />
      </div>

      <div className="flex border-b border-gray-100 mb-12 gap-12">
        {['Active Campaigns', 'Archive'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#eca840]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#eca840] rounded-full"></div>}
          </button>
        ))}
      </div>

        {(() => {
          const currentPromos = activeTab === 'Active Campaigns' ? promotions : archived_promotions;
          const totalPages = Math.ceil(currentPromos.length / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedPromos = currentPromos.slice(startIndex, startIndex + itemsPerPage);

          return (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {activeTab === 'Active Campaigns' && currentPage === 1 && (
                  <div 
                    onClick={openAddModal} 
                    className="bg-orange-50/20 border-2 border-dashed border-[#eca840]/30 rounded-[3.5rem] p-10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#eca840] hover:bg-orange-50/40 transition-all min-h-[500px]"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#eca840] flex items-center justify-center text-white mb-8 group-hover:scale-110 shadow-lg shadow-orange-200/50 transition-all">
                      <svg className="w-8 h-8 font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <h3 className="text-sm font-black text-[#eca840] uppercase tracking-[0.3em] mb-2 leading-none">Start</h3>
                    <h3 className="text-sm font-black text-[#eca840] uppercase tracking-[0.3em] leading-none text-center">Creation</h3>
                  </div>
                )}

                {paginatedPromos.map((promo) => (
                  <CampaignCard
                    key={promo.id}
                    promo={promo}
                    isArchived={activeTab === 'Archive'}
                    onEdit={() => openEditModal(promo)}
                    onDelete={() => activeTab === 'Active Campaigns' ? handleDelete(promo) : handlePermanentDelete(promo.id)}
                    onRestore={() => handleRestore(promo.id)}
                  />
                ))}
              </div>

              {activeTab === 'Archive' && archived_promotions.length === 0 && (
                <div className="lg:col-span-4 py-40 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">Your archive is empty</h3>
                  <p className="text-sm text-gray-400 font-medium mt-3">Archived campaigns will appear here.</p>
                </div>
              )}

              {/* Professional Pagination Footer */}
              {currentPromos.length > itemsPerPage && (
                <div className="lg:col-span-4 mt-20 p-10 bg-white rounded-[3rem] border border-gray-50 flex justify-between items-center shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Campaign Discovery</span>
                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
                      Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, currentPromos.length)} of {currentPromos.length} Global Offers
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={`flex items-center gap-3 px-8 py-4 border rounded-2xl text-[10px] font-[1000] uppercase tracking-[0.2em] transition-all shadow-sm active:scale-95 ${currentPage === 1 ? 'bg-white opacity-20 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-white border-gray-100 text-gray-400 hover:text-[#eca840] hover:border-orange-100'}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                      Previous
                    </button>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={`flex items-center gap-3 px-8 py-4 border rounded-2xl text-[10px] font-[1000] uppercase tracking-[0.2em] transition-all shadow-sm active:scale-95 ${currentPage === totalPages ? 'bg-white opacity-20 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-white border-gray-100 text-gray-400 hover:text-[#eca840] hover:border-orange-100'}`}
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          );
        })()}

      {/* Promotion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col md:flex-row">

            {/* Left Column: Formal Form */}
            <div className="flex-1 p-12 lg:p-16 border-r border-gray-50 overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="mb-16">
                <div className="flex justify-between items-center relative">
                  {[
                    { id: 1, label: 'Selection' },
                    { id: 2, label: 'Campaign' },
                    { id: 3, label: 'Benefit' },
                    { id: 4, label: 'Launch' }
                  ].map((step, idx) => (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center z-10">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500 ${currentStep >= step.id ? 'bg-[#eca840] text-white shadow-lg shadow-orange-200' : 'bg-gray-50 text-gray-300 border border-gray-100'}`}>
                          {step.id}
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] mt-3 transition-colors ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</span>
                      </div>
                      {idx < 3 && (
                        <div className="flex-1 h-[2px] bg-gray-50 mx-4 -mt-8 relative overflow-hidden">
                          <div className={`absolute top-0 left-0 h-full bg-[#eca840] transition-all duration-700 ease-in-out`} style={{ width: currentStep > step.id ? '100%' : '0%' }}></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-[1000] text-gray-900 tracking-tight leading-none mb-3">
                  {currentStep === 1 && 'Select Masterpiece'}
                  {currentStep === 2 && 'Campaign Narrative'}
                  {currentStep === 3 && 'Reward Architecture'}
                  {currentStep === 4 && 'Launch Configuration'}
                </h2>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Step {currentStep} of 4 — Offering Module</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {currentStep === 1 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-4 group">
                      <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1 group-focus-within:text-[#eca840] transition-colors">Target Product Selections</label>
                      <div className="grid grid-cols-1 gap-4">
                        <div 
                          onClick={() => {
                            setData(prev => ({ ...prev, product_id: '', title: 'Store-Wide Collective Campaign', image: '' }));
                          }}
                          className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between ${data.product_id === '' ? 'border-[#eca840] bg-orange-50/30' : 'border-gray-50 bg-white hover:border-gray-100'}`}
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <div>
                              <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Global Offering</p>
                              <p className="text-[10px] font-medium text-gray-400 mt-1">Apply this campaign to all masterpieces</p>
                            </div>
                          </div>
                          {data.product_id === '' && <div className="w-6 h-6 rounded-full bg-[#eca840] flex items-center justify-center text-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>}
                        </div>

                        <div className="relative group/select">
                          <select
                            value={data.product_id}
                            onChange={e => {
                              const pid = e.target.value;
                              if (pid) {
                                const p = products.find(prod => prod.id.toString() === pid);
                                if (p) {
                                  setData(prev => ({
                                    ...prev,
                                    product_id: pid,
                                    image: p.image,
                                    title: `${p.name} — Exclusive Showcase`
                                  }));
                                }
                              }
                            }}
                            className={`w-full appearance-none bg-gray-50 border border-gray-100 rounded-[2rem] px-8 py-6 text-sm font-bold text-gray-700 focus:ring-4 focus:ring-[#eca840]/10 transition-all ${errors.product_id ? 'border-red-300' : ''}`}
                          >
                            <option value="" disabled>Select Individual Masterpiece...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1 group-focus-within:text-[#eca840] transition-colors">Campaign Title</label>
                      <input
                        type="text"
                        value={data.title}
                        onChange={e => setData('title', e.target.value)}
                        placeholder="e.g. Artisanal Summer Solstice"
                        className={`w-full bg-gray-50/50 border border-gray-100/50 rounded-2xl px-6 py-4.5 text-sm font-bold text-gray-700 focus:ring-4 focus:ring-[#eca840]/10 focus:bg-white transition-all placeholder:text-gray-200 ${errors.title ? 'border-red-300' : ''}`}
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1 group-focus-within:text-[#eca840] transition-colors">Promo Code Identifier</label>
                      <input
                        type="text"
                        value={data.code}
                        onChange={e => setData('code', e.target.value)}
                        placeholder="SUMMER24"
                        className={`w-full bg-gray-50/50 border border-gray-100/50 rounded-2xl px-6 py-4.5 text-sm font-black uppercase tracking-[0.2em] text-[#eca840] focus:ring-4 focus:ring-[#eca840]/10 focus:bg-white transition-all placeholder:text-gray-200 ${errors.code ? 'border-red-300' : ''}`}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1 group-focus-within:text-[#eca840] transition-colors">Benefit Type</label>
                        <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full appearance-none bg-gray-50 border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-bold text-gray-700 focus:ring-4 focus:ring-[#eca840]/10 transition-all">
                          <option value="percentage">Percentage Discount</option>
                          <option value="fixed">Fixed Currency Value</option>
                        </select>
                      </div>
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1 group-focus-within:text-[#eca840] transition-colors">Discount Value</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={data.discount_value}
                            onChange={e => setData('discount_value', e.target.value)}
                            className={`w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-lg font-black text-gray-900 focus:ring-4 focus:ring-[#eca840]/10 transition-all ${errors.discount_value ? 'border-red-300' : ''}`}
                          />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#eca840] uppercase">{data.type === 'percentage' ? '%' : '₱'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1 group-focus-within:text-[#eca840] transition-colors">Narrative & Legacy Details</label>
                      <textarea
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        rows={5}
                        placeholder="Describe the story and value of this promotion..."
                        className={`w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-medium text-gray-600 focus:ring-4 focus:ring-[#eca840]/10 focus:bg-white transition-all resize-none ${errors.description ? 'border-red-300' : ''}`}
                      ></textarea>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-12 border-t border-gray-50">
                  {currentStep > 1 && (
                    <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="px-10 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">Previous</button>
                  )}
                  {currentStep < 4 ? (
                    <button 
                      type="button" 
                      onClick={() => {
                        // Basic Validation per step
                        if (currentStep === 1 && !data.title) {
                          alert('Please select a masterpiece baseline.');
                          return;
                        }
                        setCurrentStep(prev => prev + 1);
                      }} 
                      className="flex-1 py-5 bg-[#eca840] text-white rounded-2xl font-[1000] text-[11px] uppercase tracking-[0.25em] shadow-[0_20px_40px_-10px_rgba(236,168,64,0.3)] hover:bg-[#d69635] hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Continue Narrative
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 py-5 bg-[#eca840] text-white rounded-2xl font-[1000] text-[11px] uppercase tracking-[0.25em] shadow-[0_20px_40px_-10px_rgba(236,168,64,0.3)] hover:bg-[#d69635] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {processing ? 'Launching...' : (editingPromo ? 'Save Refinements' : 'Activate Campaign')}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column: Premium Preview Theater */}
            <div className="hidden lg:flex w-[380px] bg-gray-50 p-12 flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(236,168,64,0.05)_0%,transparent_70%)]"></div>
              <div className="relative w-full aspect-[16/11] rounded-[2.5rem] bg-white shadow-2xl overflow-hidden border-8 border-white group/preview flex items-center justify-center">
                {data.image ? (
                  <>
                    <img src={data.image} className="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-110" alt="Preview" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 w-full h-full">
                    <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-gray-200 mb-4 shadow-sm border border-gray-50 group-hover/preview:scale-110 transition-transform">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connect Visual</p>
                    <p className="text-[8px] text-gray-300 font-bold mt-1 max-w-[120px] leading-relaxed">Select a masterpiece selection to preview your story.</p>
                  </div>
                )}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] mb-1 block">Live Preview</span>
                  <h4 className="text-lg font-black text-white leading-tight truncate">{data.title || 'Untitled Campaign'}</h4>
                </div>
              </div>

              <div className="mt-12 space-y-6 w-full">
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3 text-center">Reward Architecture</p>
                  <div className="flex justify-center items-baseline gap-2">
                    <span className="text-4xl font-[1000] text-gray-900">{data.discount_value || '0'}</span>
                    <span className="text-lg font-black text-[#eca840]">{data.type === 'percentage' ? '%' : '₱'}</span>
                    <span className="text-sm font-bold text-gray-400">OFF</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">"{data.description?.substring(0, 50) || 'Your campaign legacy begins here...'}{data.description?.length > 50 ? '...' : ''}"</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </SellerLayout>
  );
}

const PromoStatCard = ({ label, value, change, icon }: any) => (
  <div className="bg-white rounded-[3rem] p-12 border border-gray-100/50 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] relative group overflow-hidden transition-all hover:shadow-xl">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/30 rounded-bl-[5rem] transition-transform duration-700 group-hover:scale-110"></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{label}</p>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${icon === 'reach' ? 'bg-[#eca840]' : 'bg-green-400'}`}></div>
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{change}</p>
          </div>
        </div>
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#eca840]/60 group-hover:text-[#eca840] transition-colors">
          {icon === 'reach' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>}
          {icon === 'offers' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>}
          {icon === 'conversion' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        </div>
      </div>
      <h2 className="text-6xl font-[1000] text-gray-900 tracking-tighter tabular-nums">{value}</h2>
    </div>
  </div>
);

const CampaignCard = ({ promo, onEdit, onDelete, isArchived, onRestore }: any) => (
  <div className="group bg-white rounded-[3rem] overflow-hidden border border-gray-100/50 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] transition-all hover:shadow-2xl hover:translate-y-[-5px] duration-500 flex flex-col min-h-[420px]">
    <div className="relative aspect-[16/10] overflow-hidden">
      <img src={promo.image || "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600"} alt={promo.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>

    <div className="p-8 flex-1 flex flex-col items-stretch text-center">
      <div className="mb-6 min-h-[60px] flex flex-col justify-center">
        <h3 className="text-[18px] font-black text-gray-900 mb-1 tracking-tight line-clamp-1">{promo.title}</h3>
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">{promo.product?.name || 'STORE-WIDE OFFER'}</p>
      </div>

      <div className="bg-gray-50/80 border border-gray-100 rounded-[2rem] p-8 mb-6 group-hover:bg-white transition-all shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#eca840]/20 to-transparent"></div>
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Reward Architecture</p>
        <div className="flex justify-center items-center gap-3">
          <span className="text-4xl font-[1000] text-gray-900 leading-none tabular-nums">{promo.discount_value}</span>
          <div className="flex flex-col items-start leading-none">
            <span className="text-base font-black text-[#eca840]">{promo.type === 'percentage' ? '%' : '₱'}</span>
            <span className="text-[8px] font-black text-gray-400 mt-0.5">OFF</span>
          </div>
        </div>
      </div>

      <div className="mb-8 px-2 min-h-[32px]">
        <p className="text-[10px] font-medium text-gray-400 italic leading-tight line-clamp-2">
          "{promo.description || 'Discover a new layer of artisanal excellence with this curation.'}"
        </p>
      </div>

      <div className="flex gap-2 mt-auto items-center">
        {!isArchived ? (
          <>
            <button onClick={onEdit} className="flex-[3] h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#eca840] hover:border-[#eca840]/30 transition-all gap-3 group/btn">
              <svg className="w-5 h-5 text-gray-300 group-hover/btn:text-[#eca840] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Refine</span>
            </button>
            <button onClick={onDelete} className="flex-1 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-100 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            </button>
          </>
        ) : (
          <>
            <button onClick={onRestore} className="flex-[3] h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-green-500 hover:text-green-600 hover:border-green-100 transition-all gap-3 group/btn">
              <svg className="w-5 h-5 text-gray-300 group-hover/btn:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Restore</span>
            </button>
            <button onClick={onDelete} className="flex-1 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-red-300 hover:text-red-500 hover:border-red-100 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);
