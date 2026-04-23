import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head, Link, useForm } from '@inertiajs/inertia-react';

declare function route(name: string, params?: any): string;

interface ProductsProps {
  products: any[];
  archived_products: any[];
  categories: any[];
  stats: {
    total_items: number;
    low_stock: number;
    category_count: number;
    pre_order_count: number;
  };
}

export default function SellerProducts({ products, archived_products, categories, stats }: ProductsProps) {
  const [activeFilter, setActiveFilter] = React.useState('All Products');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortDateDesc, setSortDateDesc] = React.useState(true);
  const [isRestockModalOpen, setIsRestockModalOpen] = React.useState(false);
  const [restockProduct, setRestockProduct] = React.useState<any>(null);
  const restockForm = useForm({
    quantity: '1',
  });

  const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
    name: '',
    category_id: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    image_file: null as File | null,
    status: 'in_stock',
    _method: 'POST' as 'POST' | 'PUT'
  });

  const [modalPreview, setModalPreview] = React.useState<string | null>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setModalPreview(null);
    reset();
    setData({
      name: '',
      category_id: '',
      description: '',
      price: '',
      stock: '',
      image: '',
      image_file: null,
      status: 'in_stock',
      _method: 'POST'
    });
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
      status: product.status,
      _method: 'PUT'
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
    
    const options = {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
        setEditingProduct(null);
      }
    };

    if (editingProduct) {
      post(route('seller.products.update', editingProduct.id), {
        ...options,
        onBefore: () => { setData('_method', 'PUT') } // Ensuring it's set
      });
    } else {
      post(route('seller.products.store'), {
        ...options,
        onBefore: () => { setData('_method', 'POST') }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Move this artisanal masterpiece to the archive?')) {
      destroy(route('seller.products.destroy', id), {
        onSuccess: () => {
           // Optional: Show a fancy toast
        }
      });
    }
  };

  const handleRestore = (id: number) => {
    post(route('seller.products.restore', id));
  };

  const handlePermanentDelete = (id: number) => {
    if (confirm('This will permanently remove this masterpiece. This action cannot be undone. Proceed?')) {
      destroy(route('seller.products.forceDelete', id));
    }
  };

  const [selectedArchived, setSelectedArchived] = React.useState<number[]>([]);

  const toggleSelectArchived = (id: number) => {
    setSelectedArchived(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleBulkRestore = () => {
    if (selectedArchived.length === 0) return;
    selectedArchived.forEach(id => handleRestore(id));
    setSelectedArchived([]);
  };

  const handleBulkDelete = () => {
    if (selectedArchived.length === 0) return;
    if (confirm(`Permanently delete ${selectedArchived.length} items?`)) {
        selectedArchived.forEach(id => destroy(route('seller.products.forceDelete', id)));
        setSelectedArchived([]);
    }
  };

  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    restockForm.post(route('seller.products.restock', restockProduct.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsRestockModalOpen(false);
        restockForm.reset();
        setRestockProduct(null);
      }
    });
  };

  const openRestockModal = (product: any) => {
    setRestockProduct(product);
    restockForm.setData('quantity', '1');
    setIsRestockModalOpen(true);
  };

  const sortedProducts = React.useMemo(() => {
    let result = [...products];
    if (activeFilter === 'Archive') {
      result = [...archived_products];
    } else if (activeFilter === 'Pre-Order') {
      result = products.filter(p => p.status === 'pre_order');
    } else if (activeFilter !== 'All Products') {
      result = products.filter(p => (p.category?.name || p.category) === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
      );
    }
    
    return result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortDateDesc ? dateB - dateA : dateA - dateB;
    });
  }, [products, archived_products, activeFilter, sortDateDesc]);

  const filterTabs = ['All Products', ...categories.map(c => c.name), 'Pre-Order', 'Archive'];

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
        <StatsCardSimple 
          label="Total Masterpieces" 
          value={stats.total_items} 
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        <StatsCardSimple 
          label="Low Stock Alerts" 
          value={stats.low_stock} 
          badge="Action Required" 
          isAlert={stats.low_stock > 0} 
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
        <StatsCardSimple 
          label="Categories" 
          value={stats.category_count} 
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
        />
        <StatsCardSimple 
          label="Pre-Order Items" 
          value={stats.pre_order_count} 
          isStatus 
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>
    
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#eca840] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input 
                type="text" 
                placeholder="Search masterpieces by name, category or description..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-3xl py-6 pl-16 pr-8 text-sm font-bold text-gray-700 shadow-[0_10px_40px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#eca840]/10 focus:border-[#eca840]/20 transition-all placeholder:text-gray-300"
            />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-gray-100 mb-10">
        <div className="flex overflow-x-auto gap-12 scrollbar-hide">
          {filterTabs.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveFilter(tab)}
              className={`pb-4 text-sm font-[1000] uppercase tracking-[0.1em] transition-all relative whitespace-nowrap ${activeFilter === tab ? 'text-[#eca840]' : 'text-gray-300 hover:text-gray-600'}`}
            >
              <span className="flex items-center gap-2">
                {tab}
                {tab === 'Pre-Order' && <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse"></span>}
              </span>
              {activeFilter === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#eca840] rounded-full shadow-[0_2px_8px_rgba(236,168,64,0.3)]"></div>}
            </button>
          ))}
        </div>
        <div 
          className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-600 transition-colors pb-4"
          onClick={() => setSortDateDesc(!sortDateDesc)}
        >
          Sorted by Date
          <svg className={`w-4 h-4 transition-transform ${!sortDateDesc ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12l-4-4m4 4l4-4m5-4l4 4m0 0l4-4m-4 4V20" /></svg>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {activeFilter !== 'Archive' && (
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
        )}

        {activeFilter === 'Archive' && archived_products.length > 0 && (
            <div className="lg:col-span-4 mb-6 flex justify-between items-center bg-[#1a1c23] p-6 rounded-3xl text-white">
                <div className="flex items-center gap-4">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">{selectedArchived.length} Selected</span>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleBulkRestore}
                        disabled={selectedArchived.length === 0}
                        className="px-6 py-2.5 bg-green-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all disabled:opacity-30"
                    >
                        Bulk Restore
                    </button>
                    <button 
                        onClick={handleBulkDelete}
                        disabled={selectedArchived.length === 0}
                        className="px-6 py-2.5 bg-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-30"
                    >
                        Bulk Delete
                    </button>
                </div>
            </div>
        )}

        {sortedProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isArchived={activeFilter === 'Archive'}
            isSelected={selectedArchived.includes(product.id)}
            onSelect={() => toggleSelectArchived(product.id)}
            onEdit={() => openEditModal(product)}
            onArchive={() => handleDelete(product.id)}
            onRestock={() => openRestockModal(product)}
            onRestore={() => handleRestore(product.id)}
            onPermanentDelete={() => handlePermanentDelete(product.id)}
          />
        ))}

        {activeFilter === 'Archive' && archived_products.length === 0 && (
            <div className="lg:col-span-4 py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <h3 className="text-xl font-black text-gray-900">Your archive is empty</h3>
                <p className="text-sm text-gray-400 font-medium mt-2">Masterpieces you archive will appear here.</p>
            </div>
        )}
      </div>

      {/* Modern Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[60vh]">
            <div className="p-12 overflow-y-auto scrollbar-hide">
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
                      className={`w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#eca840]/20 ${errors.name ? 'ring-2 ring-red-500' : ''}`} 
                      placeholder="e.g. Artisanal Sourdough"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      value={data.category_id}
                      onChange={e => setData('category_id', e.target.value)}
                      className={`w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#eca840]/20 ${errors.category_id ? 'ring-2 ring-red-500' : ''}`}
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.category_id}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    rows={3}
                    className={`w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#eca840]/20 resize-none ${errors.description ? 'ring-2 ring-red-500' : ''}`} 
                    placeholder="Describe the artisanal magic..."
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price</label>
                    <input 
                      type="number" 
                      value={data.price}
                      onChange={e => setData('price', e.target.value)}
                      className={`w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#eca840]/20 ${errors.price ? 'ring-2 ring-red-500' : ''}`} 
                    />
                    {errors.price && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.price}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock</label>
                    <input 
                      type="number" 
                      value={data.stock}
                      onChange={e => setData('stock', e.target.value)}
                      className={`w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#eca840]/20 ${errors.stock ? 'ring-2 ring-red-500' : ''}`} 
                    />
                    {errors.stock && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.stock}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                    <select 
                      value={data.status}
                      onChange={e => setData('status', e.target.value)}
                      className={`w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#eca840]/20 ${errors.status ? 'ring-2 ring-red-500' : ''}`}
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="pre_order">Pre-Order</option>
                      <option value="sold_out">Sold Out</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.status}</p>}
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
                  className="w-full py-5 bg-[#eca840] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#eca840]/20 hover:bg-[#d69635] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Updating Masterpiece...
                    </>
                  ) : (editingProduct ? 'Save Changes' : 'Create Masterpiece')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsRestockModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#eca840]">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Replenish Inventory</h3>
              <p className="text-sm text-gray-400 font-medium mb-8">How many units of "{restockProduct?.name}" are you adding?</p>
              
              <form onSubmit={handleRestock} className="space-y-6">
                <div className="relative">
                  <input 
                    type="number" 
                    min="1"
                    value={restockForm.data.quantity}
                    onChange={e => restockForm.setData('quantity', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl px-8 py-5 text-2xl font-black text-center text-gray-900 focus:ring-2 focus:ring-[#eca840]/20"
                    placeholder="0"
                    autoFocus
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-300 uppercase tracking-widest">Units</span>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button 
                    type="button"
                    onClick={() => setIsRestockModalOpen(false)}
                    className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={restockForm.processing}
                    className="flex-1 py-4 bg-[#eca840] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#eca840]/20 hover:bg-[#d69635] transition-all disabled:opacity-50"
                  >
                    {restockForm.processing ? 'Updating...' : 'Add Stock'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </SellerLayout>
  );
}

const StatsCardSimple = ({ label, value, badge, isAlert, isStatus, icon }: any) => (
  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-500 group">
    <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isAlert ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 group-hover:bg-[#2d2a26] group-hover:text-white'}`}>
            {icon || <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        </div>
        {badge && (
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full ${isAlert ? 'bg-red-500 text-white' : 'bg-[#eca840] text-white'}`}>
                {badge}
            </span>
        )}
    </div>
    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">{label}</p>
    <div className="flex items-center gap-4">
      <h2 className="text-4xl font-[1000] text-gray-900 tracking-tight">
        {value}
      </h2>
    </div>
  </div>
);

const ProductCard = ({ product, onEdit, onArchive, onRestock, isArchived, isSelected, onSelect, onRestore, onPermanentDelete }: any) => (
  <div className={`group bg-white rounded-[2.5rem] overflow-hidden border ${isSelected ? 'border-[#eca840] shadow-2xl' : 'border-gray-100'} transition-all hover:shadow-2xl hover:-translate-y-1 relative flex flex-col`}>
    {isArchived && (
        <div className="absolute top-6 left-6 z-10">
            <input 
                type="checkbox" 
                checked={isSelected}
                onChange={onSelect}
                className="w-6 h-6 rounded-lg border-2 border-gray-200 text-[#eca840] focus:ring-[#eca840]/20 transition-all cursor-pointer"
            />
        </div>
    )}
    
    {/* Product Image Section */}
    <div className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
      
      {/* Status Badge */}
      <div className={`absolute top-4 right-4 px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md border border-white/30 flex items-center gap-2 z-10 ${
        product.status === 'in_stock' 
          ? 'bg-green-500/90 text-white' 
          : product.status === 'pre_order' 
            ? 'bg-indigo-600 font-black text-white ring-4 ring-indigo-500/20' 
            : 'bg-red-500/90 text-white'
      }`}>
        {product.status === 'pre_order' && (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
            <div className="relative w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        )}
        <span className="text-[10px] font-black uppercase tracking-[0.1em]">
          {product.status.replace('_', ' ')}
        </span>
      </div>
      
      {product.is_top_rated && (
        <span className="absolute top-4 left-4 bg-[#eca840]/90 text-white text-[9px] font-black px-4 py-2 rounded-xl shadow-lg backdrop-blur-md border border-white/20 z-10">
          BEST SELLER
        </span>
      )}
    </div>

    {/* Content Section */}
    <div className="p-8 flex flex-col flex-1">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-black text-gray-900 truncate leading-tight group-hover:text-[#eca840] transition-colors">{product.name}</h3>
        </div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-xl font-black text-[#eca840] tracking-tight">₱{parseFloat(product.price).toLocaleString()}</p>
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">{product.category?.name}</span>
        </div>
        
        <div className="bg-gray-50/50 rounded-[1.5rem] p-5 mb-6 border border-gray-100/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Inventory Status</p>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-[1000] ${product.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>{product.stock}</span>
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">Units</span>
              </div>
            </div>
            {product.status === 'pre_order' && (
              <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest">Pre-Order</span>
                  </div>
              </div>
            )}
            {product.stock < 10 && product.status !== 'pre_order' && (
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Bar - Formal & Accessible */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
         {!isArchived ? (
           <>
              <button 
                onClick={onEdit}
                title="Edit Product"
                className="flex-1 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 hover:bg-[#eca840] hover:text-white transition-all shadow-sm border border-transparent hover:border-[#eca840]/20 group/btn"
              >
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button 
                onClick={onRestock}
                title="Add Stock"
                className="flex-1 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#eca840] hover:bg-[#eca840] hover:text-white transition-all shadow-sm border border-orange-100 group/btn"
              >
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </button>
              <button 
                onClick={onArchive}
                title="Archive Product"
                className="flex-1 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-transparent hover:border-red-500/20 group/btn"
              >
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </button>
           </>
         ) : (
           <>
              <button 
                onClick={onRestore}
                title="Restore Product"
                className="flex-[2] h-12 bg-green-50 rounded-xl flex items-center justify-center gap-2 text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-100 group/btn"
              >
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span className="text-[10px] font-black uppercase tracking-widest">Restore</span>
              </button>
              <button 
                onClick={onPermanentDelete}
                title="Delete Permanently"
                className="flex-1 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 group/btn"
              >
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
           </>
         )}
      </div>
    </div>
  </div>
);

