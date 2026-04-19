import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head, Link, useForm } from '@inertiajs/inertia-react';

declare function route(name: string, params?: any): string;

interface ProductsProps {
  products: any[];
  categories: any[];
  stats: {
    total_items: number;
    low_stock: number;
    category_count: number;
  };
}

export default function SellerProducts({ products, categories, stats }: ProductsProps) {
  const [activeFilter, setActiveFilter] = React.useState('All Products');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any>(null);

  const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
    name: '',
    category_id: categories[0]?.id || '',
    description: '',
    price: '',
    stock: '',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
    image_file: null as File | null,
    status: 'in_stock'
  });

  const [modalPreview, setModalPreview] = React.useState<string | null>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setModalPreview(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setModalPreview(product.image);
    setData({
      name: product.name,
      category_id: product.category_id,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
      image_file: null,
      status: product.status
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('image_file', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setModalPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Use POST with _method spoofing for file uploads in PUT requests
      post(route('seller.products.update', editingProduct.id), {
        forceFormData: true,
        data: { ...data, _method: 'PUT' },
        onSuccess: () => setIsModalOpen(false)
      } as any);
    } else {
      post(route('seller.products.store'), {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this artisanal masterpiece?')) {
      destroy(route('seller.products.destroy', id));
    }
  };

  const filteredProducts = activeFilter === 'All Products' 
    ? products 
    : products.filter(p => p.category?.name === activeFilter);

  const filterTabs = ['All Products', ...categories.map(c => c.name)];

  return (
    <SellerLayout>
      <Head title="Product Management" />

      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Product Management</h1>
          <p className="text-gray-500 font-medium">Curate and manage your artisanal inventory.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-8 py-4 bg-[#eca840] text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-[#eca840]/30 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Add New Product
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <StatsCardSimple label="Total Items" value={stats.total_items} />
        <StatsCardSimple label="Low Stock Alerts" value={stats.low_stock} badge="Urgent" isAlert={stats.low_stock > 0} />
        <StatsCardSimple label="Categories" value={stats.category_count} />
        <StatsCardSimple label="Store Status" value="Live" isStatus />
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-100 mb-10 overflow-x-auto gap-12 scrollbar-hide">
        {filterTabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveFilter(tab)}
            className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeFilter === tab ? 'text-[#eca840]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab}
            {activeFilter === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#eca840] rounded-full"></div>}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          onClick={openAddModal}
          className="bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 group cursor-pointer hover:border-[#eca840] transition-all"
        >
           <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-[#eca840] mb-6 group-hover:scale-110 transition-all">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
           </div>
           <h4 className="text-lg font-bold text-[#eca840] mb-2">Add Product</h4>
           <p className="text-xs text-center text-gray-400 font-medium">Start a new creation</p>
        </div>

        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onEdit={() => openEditModal(product)}
            onDelete={() => handleDelete(product.id)}
          />
        ))}
      </div>

      {/* Modern Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-12">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{editingProduct ? 'Edit Masterpiece' : 'Add New Creation'}</h2>
                  <p className="text-sm text-gray-400 font-medium mt-1">Every detail matters for the perfect bake.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                    <input 
                      type="text" 
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#eca840]/20" 
                      placeholder="e.g. Artisanal Sourdough"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      value={data.category_id}
                      onChange={e => setData('category_id', e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#eca840]/20"
                    >
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    rows={3}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#eca840]/20 resize-none" 
                    placeholder="Describe the artisanal magic..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price</label>
                    <input 
                      type="number" 
                      value={data.price}
                      onChange={e => setData('price', e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#eca840]/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock</label>
                    <input 
                      type="number" 
                      value={data.stock}
                      onChange={e => setData('stock', e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#eca840]/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                    <select 
                      value={data.status}
                      onChange={e => setData('status', e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#eca840]/20"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="pre_order">Pre-Order</option>
                      <option value="sold_out">Sold Out</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Masterpiece Visual</label>
                  <div className="flex gap-6 items-center bg-gray-50 p-6 rounded-[2rem]">
                    <div className="relative w-28 h-28 bg-white rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                      {modalPreview ? (
                        <img src={modalPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700 mb-2">Upload a high-resolution image</p>
                      <p className="text-[10px] text-gray-400 font-medium mb-4">Craftsmanship is best shown in detail.</p>
                      <label className="inline-block px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 cursor-pointer hover:bg-gray-100 transition-all">
                        Select File
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                      </label>
                      {errors.image_file && <p className="text-red-500 text-[10px] font-bold mt-2">{errors.image_file}</p>}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={processing}
                  className="w-full py-5 bg-[#eca840] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#eca840]/20 hover:bg-[#d69635] transition-all disabled:opacity-50"
                >
                  {processing ? 'Processing...' : (editingProduct ? 'Save Changes' : 'Create Product')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </SellerLayout>
  );
}

const StatsCardSimple = ({ label, value, badge, isAlert, isStatus }: any) => (
  <div className="bg-white rounded-[2rem] p-8 border border-gray-100">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{label}</p>
    <div className="flex items-center gap-4">
      <h2 className="text-4xl font-extrabold text-gray-900">
        {isStatus && <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-3"></span>}
        {value}
      </h2>
      {badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isAlert ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>{badge}</span>}
    </div>
  </div>
);

const ProductCard = ({ product, onEdit, onDelete }: any) => (
  <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1">
    <div className="relative aspect-square overflow-hidden bg-gray-50">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <span className={`absolute top-4 right-4 text-[9px] font-extrabold px-3 py-1.5 rounded-lg shadow-sm ${product.status === 'in_stock' ? 'bg-green-500 text-white' : (product.status === 'pre_order' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white')}`}>
        {product.status.replace('_', ' ').toUpperCase()}
      </span>
      {product.is_top_rated && <span className="absolute top-4 left-4 bg-[#eca840] text-white text-[9px] font-extrabold px-3 py-1.5 rounded-lg shadow-sm">POPULAR</span>}
    </div>
    <div className="p-8">
      <h3 className="text-lg font-extrabold text-gray-900 mb-2 truncate group-hover:text-[#eca840] transition-colors">{product.name}</h3>
      <div className="flex justify-between items-center mb-6">
        <p className="text-xl font-black text-[#eca840]">₱{parseFloat(product.price).toLocaleString()}</p>
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{product.category?.name}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stock</p>
          <span className={`text-xs font-bold ${product.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>{product.stock} units</span>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={onEdit}
             className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 hover:bg-[#eca840] hover:text-white transition-all shadow-sm"
           >
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
           </button>
           <button 
             onClick={onDelete}
             className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white transition-all shadow-sm"
           >
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
           </button>
        </div>
      </div>
    </div>
  </div>
);

