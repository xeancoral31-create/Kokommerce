import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head, useForm } from '@inertiajs/inertia-react';

declare function route(name: string, params?: any): string;

interface CategoriesProps {
  categories: any[];
  archived_categories: any[];
  total_products: number;
}

export default function SellerCategories({ categories, archived_categories, total_products }: CategoriesProps) {
  const [activeTab, setActiveTab] = React.useState('Active Collections');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<any>(null);

  const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
    name: '',
    description: '',
    image: '',
    image_file: null as File | null,
    status: 'Active',
    _method: 'POST' as 'POST' | 'PUT'
  });

  const openAddModal = () => {
    setEditingCategory(null);
    reset();
    setData('_method', 'POST');
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      image_file: null,
      status: category.status || 'Active',
      _method: 'PUT'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const options = {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      }
    };

    if (editingCategory) {
      post(route('seller.categories.update', editingCategory.id), options);
    } else {
      post(route('seller.categories.store'), options);
    }
  };

  const handleDelete = (category: any) => {
    if (confirm(`Move the "${category.name}" collection to the archive?`)) {
      destroy(route('seller.categories.destroy', category.id));
    }
  };

  const handleRestore = (id: number) => {
    post(route('seller.categories.restore', id));
  };

  const handlePermanentDelete = (id: number) => {
    if (confirm('Permanently remove this collection and all its history? This cannot be undone.')) {
      destroy(route('seller.categories.forceDelete', id));
    }
  };

  return (
    <SellerLayout>
      <Head title="Category Management" />

      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="text-[10px] font-black text-[#eca840] uppercase tracking-[0.3em] mb-3 block">Catalog Management</span>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Organize your Bakery Catalog</h1>
          <p className="text-gray-500 font-medium max-w-xl">
             Manage your artisanal collection by grouping items into distinct sensory experiences for your customers.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-3 px-8 py-4.5 bg-[#eca840] text-white rounded-2xl text-[11px] font-[1000] hover:shadow-2xl hover:shadow-[#eca840]/30 transition-all uppercase tracking-[0.2em] active:scale-95 shadow-lg shadow-[#eca840]/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Create New Category
        </button>
      </div>

      <div className="flex border-b border-gray-100 mb-12 gap-12">
        {['Active Collections', 'Archive'].map(tab => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#eca840]' : 'text-gray-400 hover:text-gray-600'}`}
            >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#eca840] rounded-full"></div>}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
        {activeTab === 'Active Collections' && categories.length > 0 && (
          <div className="lg:col-span-2 group bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-2xl">
            <div className="relative aspect-[21/9] overflow-hidden bg-gray-50">
               <img 
                 src={categories[0].image || "/artisanal_kakanin_collection_1776604208581.png"} 
                 alt={categories[0].name} 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
               />
                <div className="absolute top-8 right-8 flex gap-3">
                  <span className="bg-white/90 backdrop-blur-md text-[#eca840] text-[10px] font-black px-4 py-2 rounded-xl border border-white/20 shadow-xl uppercase tracking-widest">Featured Collection</span>
               </div>
               
               <div className="absolute bottom-8 left-8">
                  <div className="bg-[#1a1c23]/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse border-2 border-white/20"></div>
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">Collection Active</span>
                  </div>
               </div>
            </div>
            <div className="p-10 flex justify-between items-center bg-white border-t border-gray-50">
               <div>
                  <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{categories[0].name}</h2>
                  <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100"></div>
                          ))}
                      </div>
                      <p className="text-[#eca840] font-black uppercase tracking-widest text-[10px] flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#eca840] mr-2"></span>
                          {categories[0].products_count} Artistic Creations
                      </p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button 
                    onClick={() => openEditModal(categories[0])}
                    className="px-8 py-3 bg-gray-50 border border-transparent rounded-xl text-xs font-black text-gray-900 hover:bg-white hover:border-gray-100 hover:shadow-sm transition-all active:scale-95 uppercase tracking-widest"
                  >
                    Manage
                  </button>
                  <button 
                    onClick={() => handleDelete(categories[0])}
                    className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 transition-all active:scale-95"
                  >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* New Category Card */}
        <div 
          onClick={openAddModal}
          className="bg-white/50 border-2 border-dashed border-gray-100 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#eca840] transition-all active:scale-[0.98]"
        >
           <div className="w-16 h-16 rounded-full bg-[#eca840]/10 flex items-center justify-center text-[#eca840] mb-8 group-hover:scale-110 transition-all">
              <svg className="w-8 h-8 font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
           </div>
           <h3 className="text-xl font-[1000] text-gray-900 mb-2 uppercase tracking-tighter">New Collection</h3>
           <p className="text-[10px] text-gray-400 font-bold leading-relaxed max-w-[160px] uppercase tracking-widest">Expand sensory menu</p>
        </div>

        {activeTab === 'Active Collections' && categories.slice(1).map((category: any) => (
          <SmallCategoryCard 
            key={category.id}
            category={category}
            onEdit={() => openEditModal(category)}
            onDelete={() => handleDelete(category)}
          />
        ))}

        {activeTab === 'Archive' && archived_categories.map((category: any) => (
          <SmallCategoryCard 
            key={category.id}
            category={category}
            isArchived={true}
            onRestore={() => handleRestore(category.id)}
            onDelete={() => handlePermanentDelete(category.id)}
          />
        ))}

        {activeTab === 'Archive' && archived_categories.length === 0 && (
            <div className="lg:col-span-3 py-40 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900">Your archive is empty</h3>
                <p className="text-sm text-gray-400 font-medium mt-3">Archived collections will appear here.</p>
            </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="bg-[#1a1c23] rounded-[2.5rem] p-10 text-white flex justify-between items-center group relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent"></div>
         <div className="flex gap-16 relative z-10">
            <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Total Categories</p>
               <h2 className="text-5xl font-black">{categories.length.toString().padStart(2, '0')} <span className="text-sm text-gray-500 font-bold ml-1">Groups</span></h2>
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Product Coverage</p>
               <h2 className="text-5xl font-black">{total_products} <span className="text-sm text-gray-500 font-bold ml-1">Items</span></h2>
            </div>
         </div>
         <div className="flex items-center gap-10 relative z-10">
            <div className="text-right">
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Active Status</p>
               <div className="flex items-center gap-4">
                  <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 w-[92%]"></div>
                  </div>
                  <span className="text-2xl font-black">92%</span>
               </div>
               <p className="text-[10px] text-gray-600 font-bold mt-2">Visible to public</p>
            </div>
            <button className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-95">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
         </div>
      </div>


      {/* Formal Collection Architect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Scrollable Container */}
            <div className="max-h-[85vh] overflow-y-auto formal-scrollbar">
              <div className="p-10">
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-50">
                  <div>
                    <span className="text-[9px] font-black text-[#eca840] uppercase tracking-[0.3em] mb-1 block">Catalog Architect</span>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter">{editingCategory ? 'Update Collection' : 'New Collection'}</h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Section */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity</label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="w-full bg-gray-50 border border-transparent rounded-xl px-5 py-4 text-sm font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all placeholder:text-gray-300" 
                        placeholder="e.g. Signature Sourdough"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-[9px] font-bold ml-1">{errors.name}</p>}
                  </div>

                  {/* Visual Section */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Visual Asset</label>
                    <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-xl p-4 transition-colors hover:border-[#eca840]/30">
                        <label className="cursor-pointer group flex flex-col items-center justify-center py-4">
                            <input 
                                type="file" 
                                className="hidden" 
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) setData('image_file', file);
                                }}
                            />
                            <svg className="w-6 h-6 text-gray-300 mb-2 group-hover:text-[#eca840] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate max-w-[200px]">
                                {data.image_file ? data.image_file.name : (data.image ? 'Update Current Asset' : 'Select Gallery Image')}
                            </div>
                        </label>
                    </div>
                    {errors.image_file && <p className="text-red-500 text-[9px] font-bold ml-1">{errors.image_file}</p>}
                  </div>

                  {/* Status Toggle */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Operational State</label>
                    <select 
                      value={data.status}
                      onChange={e => setData('status', e.target.value)}
                      className="w-full bg-gray-50 border border-transparent rounded-xl px-5 py-4 text-sm font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Active">Public / Active</option>
                      <option value="Inactive">Archived / Hidden</option>
                    </select>
                  </div>

                  {/* Narrative Section */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Sensory Narrative</label>
                    <textarea 
                      value={data.description}
                      onChange={e => setData('description', e.target.value)}
                      rows={3}
                      className="w-full bg-gray-50 border border-transparent rounded-xl px-5 py-4 text-sm font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all resize-none placeholder:text-gray-300" 
                      placeholder="Articulate the aroma, texture, and inspiration behind this collection..."
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={processing}
                      className="w-full py-5 bg-[#eca840] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#eca840]/10 hover:bg-gray-900 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Processing
                        </>
                      ) : (editingCategory ? 'Commit Changes' : 'Initialize Collection')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </SellerLayout>
  );
}

const SmallCategoryCard = ({ category, onEdit, onDelete, isArchived, onRestore }: any) => (
  <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1">
    <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
      <img 
        src={category.image || "/artisanal_kakanin_collection_1776604208581.png"} 
        alt={category.name} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
      />
      <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#eca840]"></div>
              <span className="text-[9px] font-black text-gray-800 uppercase tracking-widest">{category.products_count} Items</span>
          </div>
      </div>
      <span className={`absolute top-4 right-4 text-[8px] font-black px-2.5 py-1 rounded-md shadow-sm border ${category.status === 'Active' ? 'bg-green-500 border-green-400 text-white' : 'bg-gray-400 border-gray-300 text-white'}`}>{category.status.toUpperCase()}</span>
    </div>
    <div className="p-8">
      <h3 className="text-2xl font-extrabold text-gray-900 mb-2 truncate group-hover:text-[#eca840] transition-colors tracking-tight">{category.name}</h3>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 leading-relaxed line-clamp-1">{category.description || "Masterfully curated artisanal range."}</p>
      
      <div className="flex gap-4">
         {!isArchived ? (
            <>
                <button 
                onClick={onEdit}
                className="flex-1 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-[#1a1c23] hover:text-white transition-all active:scale-95"
                >
                Refine
                </button>
                <button 
                onClick={onDelete}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#eca840] hover:text-white transition-all border border-gray-50 active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </button>
            </>
         ) : (
            <>
                <button 
                onClick={onRestore}
                className="flex-1 py-4 bg-green-50 text-green-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all active:scale-95"
                >
                Restore
                </button>
                <button 
                onClick={onDelete}
                className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-50 active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </>
         )}
      </div>
    </div>
  </div>
);

