import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head, useForm } from '@inertiajs/inertia-react';

declare function route(name: string, params?: any): string;

interface CategoriesProps {
  categories: any[];
  total_products: number;
}

export default function SellerCategories({ categories, total_products }: CategoriesProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<any>(null);

  const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
    name: '',
    description: '',
    image: '',
    status: 'Active'
  });

  const openAddModal = () => {
    setEditingCategory(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      status: category.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      put(route('seller.categories.update', editingCategory.id), {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      post(route('seller.categories.store'), {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const handleDelete = (category: any) => {
    if (confirm(`Are you sure you want to remove the "${category.name}" collection?`)) {
      destroy(route('seller.categories.destroy', category.id));
    }
  };

  return (
    <SellerLayout>
      <Head title="Category Management" />

      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="text-[10px] font-bold text-[#f5a623] uppercase tracking-[0.2em] mb-3 block">Catalog Management</span>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Organize your Bakery Catalog</h1>
          <p className="text-gray-500 font-medium max-w-xl">
             Manage your artisanal collection by grouping items into distinct sensory experiences for your customers.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-3 px-10 py-5 bg-[#f5a623] text-white rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-[#f5a623]/30 transition-all uppercase tracking-wider active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Create New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
        {categories.length > 0 && (
          <div className="lg:col-span-2 group bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-2xl">
            <div className="relative aspect-[21/9] overflow-hidden bg-gray-50">
               <img 
                 src={categories[0].name === "Kakanin" ? "/artisanal_kakanin_collection_1776604208581.png" : categories[0].image} 
                 alt={categories[0].name} 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
               />
               <div className="absolute top-8 right-8 flex gap-3">
                  <span className="bg-white/90 backdrop-blur-md text-[#f5a623] text-[10px] font-black px-4 py-2 rounded-xl border border-white/20 shadow-xl uppercase tracking-widest">Featured Collection</span>
               </div>
            </div>
            <div className="p-10 flex justify-between items-center bg-white border-t border-gray-50">
               <div>
                  <div className="flex items-center gap-4 mb-2">
                     <h2 className="text-3xl font-extrabold text-gray-900">{categories[0].name}</h2>
                     <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${categories[0].status === 'Active' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400'}`}>
                       {categories[0].status}
                     </span>
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">{categories[0].products_count} Items in Catalog</p>
               </div>
               <div className="flex gap-4">
                  <button 
                    onClick={() => openEditModal(categories[0])}
                    className="px-8 py-3 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all active:scale-95"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(categories[0])}
                    className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 transition-all active:scale-95"
                  >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* New Category Card */}
        <div 
          onClick={openAddModal}
          className="bg-white/50 border-2 border-dashed border-gray-100 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#f5a623] transition-all active:scale-[0.98]"
        >
           <div className="w-16 h-16 rounded-full bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] mb-8 group-hover:scale-110 transition-all">
              <svg className="w-8 h-8 font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">New Category</h3>
           <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[160px]">Expand your menu with a fresh artisanal collection.</p>
        </div>

        {categories.slice(1).map((category: any) => (
          <SmallCategoryCard 
            key={category.id}
            category={category}
            onEdit={() => openEditModal(category)}
            onDelete={() => handleDelete(category)}
          />
        ))}
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


      {/* Modern Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm shadow-2xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-12">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{editingCategory ? 'Refine Collection' : 'New Collection'}</h2>
                  <p className="text-sm text-gray-400 font-medium mt-1">Define the sensory boundaries of your artisanal catalog.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Collection Name</label>
                  <input 
                    type="text" 
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#f5a623]/20" 
                    placeholder="e.g. Signature Kakanin"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cover Image URL</label>
                  <input 
                    type="text" 
                    value={data.image}
                    onChange={e => setData('image', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#f5a623]/20" 
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sensory Status</label>
                    <select 
                      value={data.status}
                      onChange={e => setData('status', e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#f5a623]/20"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quick Tip</label>
                     <div className="px-6 py-4 bg-orange-50 rounded-2xl text-[10px] font-bold text-orange-600 leading-relaxed">
                        High-quality images increase customer engagement by up to 40%.
                     </div>
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sensory Description</label>
                    <textarea 
                      value={data.description}
                      onChange={e => setData('description', e.target.value)}
                      rows={3}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#f5a623]/20 resize-none" 
                      placeholder="Describe the aroma and texture..."
                    ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={processing}
                  className="w-full py-5 bg-[#f5a623] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#f5a623]/20 hover:bg-[#d69635] transition-all disabled:opacity-50 active:scale-95"
                >
                  {processing ? 'Crafting...' : (editingCategory ? 'Save Collection' : 'Launch Collection')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </SellerLayout>
  );
}

const SmallCategoryCard = ({ category, onEdit, onDelete }: any) => (
  <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1">
    <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
      <img 
        src={category.name === "Kakanin" ? "/artisanal_kakanin_collection_1776604208581.png" : category.image} 
        alt={category.name} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
      />
      <span className={`absolute top-4 right-4 text-[9px] font-black px-3 py-1 rounded shadow-sm ${category.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>{category.status.toUpperCase()}</span>
    </div>
    <div className="p-8">
      <h3 className="text-2xl font-black text-gray-900 mb-2 truncate group-hover:text-[#f5a623] transition-colors">{category.name}</h3>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">{category.products_count} Items</p>
      
      <div className="flex gap-4">
         <button 
          onClick={onEdit}
          className="flex-1 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-100 transition-all border border-gray-50 active:scale-95"
         >
           Edit
         </button>
         <button 
          onClick={onDelete}
          className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-50 active:scale-95"
         >
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
         </button>
      </div>
    </div>
  </div>
);

