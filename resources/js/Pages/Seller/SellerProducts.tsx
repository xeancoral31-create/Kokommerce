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
    in_stock_count: number;
    low_stock: number;
    category_count: number;
    pre_order_count: number;
  };
}

export default function SellerProducts({ products, archived_products, categories, stats }: ProductsProps) {
  const [activeFilter, setActiveFilter] = React.useState('All Products');
  const [statusFilter, setStatusFilter] = React.useState('All Statuses');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortDateDesc, setSortDateDesc] = React.useState(true);
  const [isRestockModalOpen, setIsRestockModalOpen] = React.useState(false);
  const [restockProduct, setRestockProduct] = React.useState<any>(null);
  const [viewMode, setViewMode] = React.useState<'Grid' | 'List'>('Grid');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;
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
    } else if (activeFilter !== 'All Products') {
      result = products.filter(p => (p.category?.name || p.category) === activeFilter);
    }

    if (statusFilter === 'In Stock') {
      result = result.filter(p => p.status === 'in_stock');
    } else if (statusFilter === 'Pre-Order') {
      result = result.filter(p => p.status === 'pre_order');
    } else if (statusFilter === 'Sold Out') {
        result = result.filter(p => p.status === 'sold_out');
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
  }, [products, archived_products, activeFilter, statusFilter, sortDateDesc, searchQuery]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = React.useMemo(() => {
    return sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  // Reset page on filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, statusFilter, searchQuery]);

  const filterTabs = ['All Products', ...categories.map(c => c.name), 'Archive'];
  const statusTabs = ['All Statuses', 'In Stock', 'Pre-Order', 'Sold Out'];

  return (
    <SellerLayout>
      <Head title="Product Management" />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Product Management</h1>
          <p className="text-gray-500 font-medium">Curate and manage your artisanal inventory.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#eca840] text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-[#eca840]/30 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Add New Product
        </button>
      </div>

      {/* Stats Summary */}
      {/* Stats Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6 mb-16">
        <StatsCardSimple 
          label="Total Masterpieces" 
          value={stats.total_items} 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        <StatsCardSimple 
          label="In Stock Item" 
          value={stats.in_stock_count} 
          badge="Live Now"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatsCardSimple 
          label="Low Stock Alerts" 
          value={stats.low_stock} 
          badge="Action Required" 
          isAlert={stats.low_stock > 0} 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
        <StatsCardSimple 
          label="Categories" 
          value={stats.category_count} 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
        />
        <StatsCardSimple 
          label="Pre-Order Items" 
          value={stats.pre_order_count} 
          isStatus 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Main Administrative Control Hub */}
      <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-3 lg:p-4 border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] mb-12 flex flex-col xl:flex-row items-stretch xl:items-center gap-4 animate-in fade-in slide-in-from-top-6 duration-700">
        <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-4 lg:pl-4 py-2">
            <div className="flex items-center gap-3">
                <div className="relative min-w-[160px]">
                    <div className="relative group">
                        <select 
                            value={activeFilter}
                            onChange={e => setActiveFilter(e.target.value)}
                            className="w-full appearance-none bg-orange-50/30 border border-transparent rounded-xl pl-5 pr-10 py-3.5 text-[10px] font-black uppercase tracking-wider text-[#eca840] focus:ring-4 focus:ring-[#eca840]/10 focus:border-[#eca840]/20 cursor-pointer transition-all hover:bg-orange-50"
                        >
                            {filterTabs.map(tab => (
                                <option key={tab} value={tab} className="font-bold text-gray-700 uppercase">{tab}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#eca840]">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                <div className="relative min-w-[150px]">
                    <div className="relative group">
                        <select 
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="w-full appearance-none bg-gray-50 border border-transparent rounded-xl pl-5 pr-10 py-3.5 text-[10px] font-black uppercase tracking-wider text-gray-500 focus:ring-4 focus:ring-gray-100 focus:border-gray-200 cursor-pointer transition-all hover:bg-gray-100"
                        >
                            {statusTabs.map(tab => (
                                <option key={tab} value={tab} className="font-bold text-gray-700 uppercase">{tab}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-[1px] h-8 bg-gray-100 mx-2 hidden xl:block"></div>

            <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-300 group-focus-within:text-[#eca840] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Search inventory by name, SKU or ingredients..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none pl-8 pr-4 py-3.5 text-xs font-bold text-gray-700 focus:ring-0 placeholder:text-gray-300 transition-all font-outfit"
                />
            </div>
        </div>

        <div className="flex items-center gap-3 pr-2 pl-4 xl:pl-0 border-t xl:border-t-0 xl:border-l border-gray-100 pt-3 xl:pt-0">
            <button 
                onClick={() => setSortDateDesc(!sortDateDesc)}
                className="flex items-center gap-2.5 px-5 py-3 bg-gray-50 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-100 hover:text-gray-600 transition-all"
            >
                {sortDateDesc ? 'Newest' : 'Oldest'}
                <svg className={`w-3.5 h-3.5 transition-transform duration-500 ${!sortDateDesc ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 12l-4-4m4 4l4-4m5-4l4 4m0 0l4-4m-4 4V20" /></svg>
            </button>
            <div className="h-8 w-[1px] bg-gray-100 mx-1"></div>
            <div className="bg-gray-50 rounded-xl p-1 flex items-center">
                {['Grid', 'List'].map(mode => (
                    <button 
                        key={mode} 
                        onClick={() => setViewMode(mode as 'Grid' | 'List')}
                        className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all duration-300 ${viewMode === mode ? 'bg-white text-[#eca840] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {mode}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end md:items-center px-4 gap-6">
          <div className="flex items-center gap-5">
              <div className="flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                      Current Inventory
                      <div className="w-1.5 h-1.5 rounded-full bg-[#eca840] animate-pulse"></div>
                  </h3>
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.15em] mt-1">Real-time artisan monitoring</p>
              </div>
              <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100/50">
                  <span className="text-gray-900">{sortedProducts.length}</span> Masterpieces
              </span>
          </div>
          
          {searchQuery && (
              <div className="flex items-center gap-3 bg-orange-50/50 px-4 py-2 rounded-xl animate-in slide-in-from-right-4 duration-500 border border-orange-100/30">
                  <span className="text-[9px] font-black text-[#eca840] uppercase tracking-widest">Query: {searchQuery}</span>
                  <button onClick={() => setSearchQuery('')} className="bg-white w-5 h-5 rounded-md flex items-center justify-center text-[#eca840] shadow-sm hover:bg-[#eca840] hover:text-white transition-all">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
              </div>
          )}
      </div>

      {/* View Container */}
      <div className="animate-in fade-in zoom-in-95 duration-700">
        {viewMode === 'Grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeFilter !== 'Archive' && (
                <div 
                  onClick={openAddModal}
                  className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center p-12 group cursor-pointer hover:border-[#eca840]/40 transition-all hover:bg-orange-50/20"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-6 group-hover:bg-[#eca840] group-hover:text-white transition-all duration-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-[#eca840] transition-colors">Start Creation</h4>
                </div>
            )}

            {activeFilter === 'Archive' && archived_products.length > 0 && (
                <div className="lg:col-span-4 mb-6 flex justify-between items-center bg-[#1a1c23] p-6 rounded-[1.5rem] text-white shadow-xl">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">{selectedArchived.length} Ready for restoration</span>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleBulkRestore}
                            disabled={selectedArchived.length === 0}
                            className="px-6 py-2.5 bg-green-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-600 transition-all disabled:opacity-30 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Bulk Restore
                        </button>
                        <button 
                            onClick={handleBulkDelete}
                            disabled={selectedArchived.length === 0}
                            className="px-6 py-2.5 bg-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-30 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Bulk Purge
                        </button>
                    </div>
                </div>
            )}

            {paginatedProducts.map(product => (
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
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-[#fcfaf7] border-b border-gray-100 sticky top-0 z-10">
                  <tr>
                    {activeFilter === 'Archive' && <th className="px-8 py-6 text-left"></th>}
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Masterpiece</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Stock</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedProducts.map(product => (
                    <ProductRow 
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
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sortedProducts.length === 0 && (
            <div className="py-32 text-center bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-100 mt-8">
                <div className="w-20 h-20 bg-white shadow-inner rounded-full flex items-center justify-center mx-auto mb-6 text-gray-100">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">No matching creations</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase mt-2 tracking-[0.2em]">Trajectory adjustment recommended</p>
            </div>
        )}
      </div>

      {/* Professional Pagination Footer */}
      {sortedProducts.length > itemsPerPage && (
        <div className="mt-12 p-6 lg:p-10 bg-white rounded-[2rem] lg:rounded-[3.5rem] border border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-sm">
            <div className="flex flex-col text-center lg:text-left">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 ml-1">Archive Discovery Hub</span>
                <p className="text-xs font-black text-gray-900 uppercase tracking-widest">
                    Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} Units
                </p>
            </div>
            <div className="flex gap-4 w-full lg:w-auto">
                <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 lg:px-8 py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${currentPage === 1 ? 'bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed' : 'bg-white border-gray-200 text-gray-400 hover:text-[#eca840] hover:border-orange-100 shadow-sm'}`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    Prev
                </button>
                <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 lg:px-8 py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${currentPage === totalPages ? 'bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed' : 'bg-white border-gray-200 text-gray-400 hover:text-[#eca840] hover:border-orange-100 shadow-sm'}`}
                >
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
      )}

      {/* Formal Product Architect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Scrollable Architectural Container */}
            <div className="max-h-[85vh] overflow-y-auto formal-scrollbar">
              <div className="p-10">
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-50">
                  <div>
                    <span className="text-[9px] font-black text-[#eca840] uppercase tracking-[0.3em] mb-1 block">Masterpiece Architect</span>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter">{editingProduct ? 'Refine Masterpiece' : 'Initialize Creation'}</h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Visual Identity Section */}
                  <div className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block border-b border-gray-200/50 pb-2 mb-4">Visual Reference</label>
                    <div className="flex gap-6 items-center">
                      <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden border border-gray-200 shrink-0 shadow-inner group">
                        {modalPreview ? (
                          <img src={modalPreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-100">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="inline-flex px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 cursor-pointer hover:bg-gray-900 hover:text-white transition-all active:scale-95">
                          Establish Visual
                          <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                        <p className="text-[8px] text-gray-400 font-bold uppercase mt-2 tracking-widest">Recommended: High Resolution</p>
                      </div>
                    </div>
                    {errors.image_file && <p className="text-red-500 text-[9px] font-bold mt-2">{errors.image_file}</p>}
                  </div>

                  {/* Core Classification */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity Reference</label>
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full bg-gray-50 border border-transparent rounded-xl px-5 py-4 text-sm font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all placeholder:text-gray-300" 
                            placeholder="e.g. Signature Ensaymada"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Archive Classification</label>
                        <select 
                            value={data.category_id}
                            onChange={e => setData('category_id', e.target.value)}
                            className="w-full bg-gray-50 border border-transparent rounded-xl px-5 py-4 text-sm font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Select Gallery...</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                  </div>

                  {/* Narrative Section */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Artisanal Narrative</label>
                    <textarea 
                      value={data.description}
                      onChange={e => setData('description', e.target.value)}
                      rows={3}
                      className="w-full bg-gray-50 border border-transparent rounded-xl px-5 py-4 text-sm font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all resize-none placeholder:text-gray-300" 
                      placeholder="Articulate the textures, aromas, and sensory profile..."
                    ></textarea>
                  </div>

                  {/* Financial & Inventory */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Valuation (₱)</label>
                      <input 
                        type="number" 
                        value={data.price}
                        onChange={e => setData('price', e.target.value)}
                        className="w-full bg-gray-50 border border-transparent rounded-xl px-5 py-4 text-sm font-black tabular-nums text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#eca840]/10 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Inventory Limit</label>
                      <input 
                        type="number" 
                        value={data.stock}
                        onChange={e => setData('stock', e.target.value)}
                        className="w-full bg-gray-50 border border-transparent rounded-xl px-5 py-4 text-sm font-black tabular-nums text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#eca840]/10 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Availability State</label>
                    <select 
                        value={data.status}
                        onChange={e => setData('status', e.target.value)}
                        className="w-full bg-gray-50 border border-transparent rounded-xl px-5 py-4 text-[10px] font-black uppercase tracking-widest text-[#eca840] focus:bg-white focus:ring-2 focus:ring-[#eca840]/10 transition-all appearance-none cursor-pointer"
                    >
                        <option value="in_stock">Ready / In Stock</option>
                        <option value="pre_order">Queue / Pre-Order</option>
                        <option value="sold_out">Archive / Sold Out</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={processing}
                      className="w-full py-5 bg-[#eca840] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#eca840]/10 hover:bg-gray-900 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {processing ? 'Processing...' : (editingProduct ? 'Commit Changes' : 'Initialize Masterpiece')}
                    </button>
                  </div>
                </form>
              </div>
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
  <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all duration-500 group flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 ${isAlert ? 'bg-red-50 text-red-500 shadow-lg shadow-red-500/5' : 'bg-[#fcfaf7] text-gray-400 group-hover:bg-[#2d2a26] group-hover:text-white shadow-inner'}`}>
        {icon || <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
    </div>
    <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] group-hover:text-gray-400 transition-colors">{label}</p>
            {badge && (
                <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-md animate-in fade-in zoom-in duration-700 ${isAlert ? 'bg-red-500 text-white shadow-sm shadow-red-200' : 'bg-[#eca840] text-white shadow-sm shadow-orange-200'}`}>
                    {badge}
                </span>
            )}
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight tabular-nums group-hover:text-[#eca840] transition-colors">
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

const ProductRow = ({ product, onEdit, onArchive, onRestock, isArchived, isSelected, onSelect, onRestore, onPermanentDelete }: any) => (
  <tr className={`group transition-all hover:bg-[#fdfaf5] ${isSelected ? 'bg-orange-50' : ''}`}>
    {isArchived && (
      <td className="px-8 py-6">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={onSelect}
          className="w-5 h-5 rounded-md border-gray-200 text-[#eca840] focus:ring-[#eca840]/20 cursor-pointer"
        />
      </td>
    )}
    <td className="px-8 py-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-sm font-black text-gray-900 group-hover:text-[#eca840] transition-colors">{product.name}</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: #BAKE-{product.id}</p>
        </div>
      </div>
    </td>
    <td className="px-8 py-6">
      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
        {product.category?.name || 'Uncategorized'}
      </span>
    </td>
    <td className="px-8 py-6">
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
        product.status === 'in_stock' ? 'bg-green-50 text-green-600' :
        product.status === 'pre_order' ? 'bg-indigo-50 text-indigo-600' :
        'bg-red-50 text-red-600'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${
          product.status === 'in_stock' ? 'bg-green-500' :
          product.status === 'pre_order' ? 'bg-indigo-500 animate-pulse' :
          'bg-red-500'
        }`}></div>
        {product.status.replace('_', ' ')}
      </div>
    </td>
    <td className="px-8 py-6 text-right">
      <div className="flex items-center justify-end gap-2">
        <span className={`text-base font-black tabular-nums ${product.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>{product.stock}</span>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">units</span>
      </div>
    </td>
    <td className="px-8 py-6 text-right">
      <p className="text-base font-black text-[#eca840] tabular-nums">₱{parseFloat(product.price).toLocaleString()}</p>
    </td>
    <td className="px-8 py-6 text-right">
      <div className="flex justify-end gap-2">
        {!isArchived ? (
          <>
            <button onClick={onEdit} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#eca840] hover:text-white transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button onClick={onRestock} className="p-2.5 bg-orange-50 text-[#eca840] rounded-xl hover:bg-[#eca840] hover:text-white transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </button>
            <button onClick={onArchive} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </>
        ) : (
          <>
            <button onClick={onRestore} className="px-5 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-500 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest shadow-sm">
              Restore
            </button>
            <button onClick={onPermanentDelete} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </>
        )}
      </div>
    </td>
  </tr>
);
