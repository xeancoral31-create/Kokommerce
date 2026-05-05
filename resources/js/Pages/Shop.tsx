import React, { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);

const Filter = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
);

const ShoppingCart = ({ className }: { className?: string }) => (
  <i className={`fa-solid fa-cart-arrow-down ${className}`}></i>
);

const Heart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15l7-7-7-7" /></svg>
);

const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
);

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number | string;
  solo_price: number | string;
  package_price: number | string;
  package_qty?: number | string;
  package_unit?: string;
  category: any;
  status: 'in_stock' | 'pre_order' | 'sold_out';
  rating: number | string;
  reviews_count: number;
  image: string;
  solo_image?: string;
  package_image?: string;
  img?: string;
  thumbnail?: string;
  is_featured: boolean;
  is_new: boolean;
  is_top_rated: boolean;
  stock: number;
}


const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "Custard Cassava Cake", slug: "custard-cassava-cake", description: "Slow-baked with macapuno.", price: 420.0, solo_price: 420.0, package_price: 2400.0, package_qty: 6, package_unit: 'Pcs', category: "Kakanin", status: "in_stock", rating: 4.8, reviews_count: 120, image: "/images/products/cassava-cake-v2.png", is_top_rated: true, is_featured: false, is_new: false, stock: 15 },
  { id: 2, name: "Sea Salt Muscovado", slug: "sea-salt-muscovado", description: "Chewy cookies made with raw muscovado sugar and premium...", price: 320.0, solo_price: 320.0, package_price: 1800.0, package_qty: 12, package_unit: 'Pcs', category: "Cookies", status: "in_stock", rating: 4.8, reviews_count: 85, image: "/images/products/cookies.png", is_top_rated: false, is_featured: false, is_new: false, stock: 20 },
  { id: 3, name: "Artisan Pandesal", slug: "artisan-pandesal", description: "Soft, pillowy dozen.", price: 120.0, solo_price: 120.0, package_price: 650.0, package_qty: 24, package_unit: 'Pcs', category: "Bread", status: "in_stock", rating: 5.0, reviews_count: 210, image: "/images/products/pandesal-v2.png", is_top_rated: true, is_featured: false, is_new: true, stock: 50 },
];

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart, CartItem } from "../Context/CartContext";


interface ShopProps {
  products: Product[];
  categories: any[];
}

export default function Shop({ products: initialProducts, categories: dbCategories = [] }: ShopProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || MOCK_PRODUCTS);
  const { setItems } = useCart();

  // States for selection modal
  const [selectionProduct, setSelectionProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [priceType, setPriceType] = useState<'Solo' | 'Package'>('Solo');

  // Extract category names from database categories
  const dbCategoryNames = dbCategories.map(c => c.name);
  // Get categories inferred from products that might not be in DB yet (fallback)
  const dynamicCategories = initialProducts ? [...new Set(initialProducts.map(p => p.category?.name || p.category))] : [];

  const categories = [...new Set([
    ...dbCategoryNames,
    ...dynamicCategories
  ])].filter(Boolean);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle URL Category Parameters for Global Detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get('category');
    if (urlCategory && categories.includes(urlCategory)) {
      setSelectedCategories([urlCategory]);
    }
  }, []);

  const [priceRange, setPriceRange] = useState(5000);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'info' }>({ show: false, message: "", type: 'success' });

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: 'success' }), 5000);
  };

  // Helper to split breadcrumb categories
  const getProductCategory = (p: Product) => {
    if (p.category?.name) return String(p.category.name);
    if (typeof p.category === 'string' && p.category) return p.category;

    const name = p.name ? p.name.toLowerCase() : '';
    if (name.includes('sourdough') || name.includes('bread') || name.includes('loaf') || name.includes('croissant') || name.includes('toast')) return 'Bread';
    if (name.includes('cookie') || name.includes('macadamia')) return 'Cookies';
    if (name.includes('cake') || name.includes('tiramisu') || name.includes('cheesecake') || name.includes('tart')) return 'Cakes';
    if (name.includes('kakanin') || name.includes('puto') || name.includes('bibingka') || name.includes('suman') || name.includes('biko') || name.includes('sapin')) return 'Kakanin';

    return 'Other';
  };


  // Filter Logic
  useEffect(() => {
    let filtered = initialProducts || MOCK_PRODUCTS;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => {
        const catName = p.category?.name || p.category;
        return selectedCategories.includes(catName);
      });
    }

    if (searchQuery) {
      const search = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => {
        const catName = (p.category?.name || p.category || '').toLowerCase();
        return p.name.toLowerCase().includes(search) ||
               p.description.toLowerCase().includes(search) ||
               catName.includes(search);
      });
    }

    filtered = filtered.filter(p => parseFloat(String(p.solo_price)) <= priceRange);


    if (selectedStatus) {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    setProducts(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [selectedCategories, searchQuery, priceRange, selectedStatus, initialProducts]);

  // Pagination Logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleOpenSelection = (product: Product) => {
    setSelectionProduct(product);
    setQuantity(1);
    setPriceType('Solo');
  };

  const getProductImage = (p: Product, type?: 'Solo' | 'Package') => {
    if (type === 'Solo' && p.solo_image) return p.solo_image;
    if (type === 'Package' && p.package_image) return p.package_image;
    return p.image || p.img || p.solo_image || p.package_image || p.thumbnail || '/images/placeholder.png';
  };

  const handleAddToBasket = () => {
    if (!selectionProduct) return;

    const soloPrice = selectionProduct.solo_price ? parseFloat(String(selectionProduct.solo_price)) : 0;
    const packagePrice = selectionProduct.package_price ? parseFloat(String(selectionProduct.package_price)) : (soloPrice * 0.9);
    const isSoloFixed4 = priceType === 'Solo' && soloPrice >= 5 && soloPrice <= 20;

    const newItem: CartItem = {
      id: selectionProduct.id + (priceType === 'Package' ? '_pkg' : '_solo'),
      original_id: selectionProduct.id,
      name: `${selectionProduct.name} (${priceType})`,
      price: priceType === 'Solo' ? soloPrice : packagePrice,
      solo_price: soloPrice,
      package_price: packagePrice,
      qty: isSoloFixed4 ? 4 : quantity,
      img: getProductImage(selectionProduct, priceType),
      priceType: priceType,
      isFixedQty: isSoloFixed4
    };


    setItems((prevItems: CartItem[]) => {
      const existing = prevItems.find(i => i.id === newItem.id);
      if (existing) {
        return prevItems.map(i => i.id === newItem.id ? { ...i, qty: i.qty + newItem.qty } : i);
      }
      return [...prevItems, newItem];
    });

    showToast(`${selectionProduct.name} (${priceType}) added to basket!`);
    setSelectionProduct(null);
  };


  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6] dark:bg-gray-950 transition-colors duration-500 pt-20">
      <Navbar />
      <main className="flex-grow">

        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed top-24 right-8 z-[1100] animate-in fade-in slide-in-from-right-8 duration-300">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${toast.type === 'success' ? 'bg-white border-green-100' : 'bg-white border-blue-100'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-green-500' : 'bg-[#d4af37]'}`}>
                {toast.type === 'success' ? <span className="text-white">✓</span> : <ShoppingCart className="w-4 h-4 text-white" />}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{toast.message}</p>
                <p className="text-[10px] text-gray-400 font-medium">Added to your basket</p>
              </div>
            </div>
          </div>
        )}

        {/* Selection Modal */}
        {selectionProduct && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-md bg-[#1a1816]/60">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-300 border border-white/20 dark:border-gray-800">
              <div className="p-12">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]">Adding Item</span>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">Choose Option</h2>
                  </div>
                  <button onClick={() => setSelectionProduct(null)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all transform hover:rotate-90 duration-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="flex items-center gap-8 mb-10 bg-[#fcfaf7] p-8 rounded-[2rem] border border-[#f5eee6]">
                  <div className="relative group flex-shrink-0">
                    {/* Architectural Dynamic Visual */}
                    <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                      <img
                        src={getProductImage(selectionProduct, priceType)}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        alt=""
                      />

                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                      {selectionProduct.category?.name?.toLowerCase() === 'cake' ? 'Premium Cake' : 'Product'}
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-2 tracking-tight">{selectionProduct.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-[#d4af37] tabular-nums tracking-tighter">
                        ₱{parseFloat(String(priceType === 'Solo' ? selectionProduct.solo_price : selectionProduct.package_price)).toLocaleString()}
                      </span>
                      <div className="h-4 w-px bg-gray-200"></div>
                      <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                        {selectionProduct.category?.name?.toLowerCase() === 'cake'
                          ? (priceType === 'Solo' ? 'Slice' : 'Whole')
                          : priceType} Mode
                      </span>
                    </div>
                  </div>
                </div>

                {/* Perspective Selection - Circular Toggles */}
                <div className="mb-8">
                  <div className="flex items-center justify-between px-2 mb-6">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Size</label>
                    <span className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                      {selectionProduct.category?.name?.toLowerCase() === 'cake'
                        ? (priceType === 'Solo' ? 'Slice' : 'Whole Cake')
                        : 'Variant Selected'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setPriceType('Solo')}
                      className={`group flex items-center gap-4 px-6 py-4 rounded-full border-2 transition-all duration-500 ${priceType === 'Solo' ? 'border-[#eca840] bg-white shadow-xl shadow-orange-100' : 'border-gray-50 bg-white hover:border-gray-200'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${priceType === 'Solo' ? 'bg-[#eca840] text-white rotate-0' : 'bg-gray-50 text-gray-300'}`}>
                        {priceType === 'Solo' ? <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div> : <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>}
                      </div>
                      <div className="flex flex-col items-start leading-none">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${priceType === 'Solo' ? 'text-gray-900' : 'text-gray-400'}`}>
                          {selectionProduct.category?.name?.toLowerCase() === 'cake' ? 'Slice' : 'Solo'}
                        </span>
                        <span className={`text-[9px] font-bold tabular-nums mt-1 ${priceType === 'Solo' ? 'text-[#d4af37]' : 'text-gray-300'}`}>₱{parseFloat(String(selectionProduct.solo_price)).toLocaleString()}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setPriceType('Package')}
                      className={`group flex items-center gap-4 px-6 py-4 rounded-full border-2 transition-all duration-500 ${priceType === 'Package' ? 'border-[#d4af37] bg-white shadow-xl shadow-orange-100' : 'border-gray-50 bg-white hover:border-gray-200'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${priceType === 'Package' ? 'bg-[#d4af37] text-white rotate-180' : 'bg-gray-50 text-gray-300'}`}>
                        {priceType === 'Package' ? <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div> : <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>}
                      </div>
                      <div className="flex flex-col items-start leading-none">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${priceType === 'Package' ? 'text-gray-900' : 'text-gray-400'}`}>
                          {selectionProduct.category?.name?.toLowerCase() === 'cake' ? 'Whole' : 'Package'}
                        </span>
                        <span className={`text-[9px] font-bold tabular-nums mt-1 ${priceType === 'Package' ? 'text-[#d4af37]' : 'text-gray-300'}`}>₱{parseFloat(String(selectionProduct.package_price)).toLocaleString()}</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quantity</label>
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{quantity} {quantity === 1 ? 'Item' : 'Items'} Selected</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl font-black text-[#2d2a26] hover:bg-[#2d2a26] hover:text-white transition-all transform active:scale-90"
                    >
                      −
                    </button>
                    <span className="text-3xl font-black text-[#2d2a26] tabular-nums tracking-tighter">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl font-black text-[#2d2a26] hover:bg-[#2d2a26] hover:text-white transition-all transform active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToBasket}
                  className="w-full bg-[#d4af37] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-15px_rgba(212,175,55,0.4)] hover:bg-black hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-4 group border border-[#d4af37]/20"
                >
                  <ShoppingCart className="w-5 h-5 flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
                  <span>Add to Basket</span>
                  <div className="w-8 h-[2px] bg-white/20 transform origin-left group-hover:scale-x-125 transition-transform duration-500"></div>
                  <span className="tabular-nums tracking-tight text-sm">₱{((priceType === 'Solo' ? Number(selectionProduct.solo_price || 0) : Number(selectionProduct.package_price || 0)) * quantity).toLocaleString()}</span>
                </button>

              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-6 md:px-12 py-12">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tighter">Shop</h1>
            <p className="text-gray-500 max-w-2xl font-medium">Discover our range of hand-crafted delicacies.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
              <div>
                <h3 className="flex items-center text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-8 border-b border-gray-100 pb-4"><Filter className="w-4 h-4 mr-3" /> Filter Products</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Categories</h4>
                    <div className="space-y-3">
                      {categories.map(cat => (
                        <label key={cat} className="flex items-center group cursor-pointer">
                          <div className="relative flex items-center">
                            <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} className="peer appearance-none w-5 h-5 border-2 border-gray-100 rounded-lg checked:bg-[#2d2a26] checked:border-[#2d2a26] transition-all" />
                            <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 font-bold text-[8px]">✓</div>
                          </div>
                          <span className="ml-3 text-[11px] text-gray-400 group-hover:text-[#2d2a26] transition-colors font-black uppercase tracking-wider">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Availability</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'All Items', value: null },
                        { label: 'In Stock', value: 'in_stock' },
                        { label: 'Pre-Order', value: 'pre_order' },
                        { label: 'Sold Out', value: 'sold_out' }
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => setSelectedStatus(item.value)}
                          className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-500 group ${
                            selectedStatus === item.value 
                              ? 'bg-[#2d2a26] border-[#2d2a26] text-white shadow-xl shadow-black/10' 
                              : 'bg-white border-gray-50 text-gray-400 hover:border-[#eca840]/30 hover:bg-[#fcfaf7]'
                          }`}
                        >
                          <span className={`text-[9px] font-[1000] uppercase tracking-[0.2em] transition-colors ${selectedStatus === item.value ? 'text-white' : 'text-gray-400 group-hover:text-[#2d2a26]'}`}>
                            {item.label}
                          </span>
                          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                            selectedStatus === item.value 
                              ? 'bg-[#d4af37] scale-125' 
                              : 'bg-gray-100 group-hover:bg-[#d4af37]/40'
                          }`}></div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Max Price</h4>
                    <div className="px-2">
                      <input type="range" min="0" max="5000" step="50" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#eca840]" />
                      <div className="flex justify-between text-[9px] font-black text-gray-400 mt-4 uppercase tracking-widest"><span>₱0</span><span className="text-[#eca840]">₱{priceRange.toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="relative w-full md:w-96 group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#eca840] transition-colors" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#faf9f6]/50 border-2 border-transparent rounded-2xl py-3 pl-12 pr-6 text-[10px] font-black tracking-widest uppercase focus:outline-none focus:border-[#eca840]/10 focus:bg-white transition-all placeholder-gray-300"
                  />
                </div>
                <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-300">{products.length} PRODUCTS</span>
                  <div className="h-4 w-px bg-gray-100"></div>
                  <div className="flex items-center">
                    <span className="text-gray-300 mr-3">Sort by:</span>
                    <select className="bg-transparent text-[#2d2a26] focus:outline-none cursor-pointer">
                      <option>LATEST ARRIVALS</option>
                      <option>PRICE: LOW-HIGH</option>
                      <option>PRICE: HIGH-LOW</option>
                    </select>
                  </div>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                  <div className="w-24 h-24 bg-[#faf9f6] rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-[#2d2a26] tracking-tighter">No products found</h3>
                  <p className="text-gray-400 mt-3 text-xs font-bold uppercase tracking-widest">Adjust your filters to see more results</p>
                  <button onClick={() => { setSelectedCategories([]); setSearchQuery(""); setPriceRange(5000); setSelectedStatus(null); }} className="mt-10 bg-[#2d2a26] text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#eca840] transition-colors shadow-xl shadow-black/10">Clear All Filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentProducts.map(product => <ShopProductCard key={product.id} product={product} onOpenSelection={() => handleOpenSelection(product)} />)}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="w-14 h-14 rounded-2xl border-2 border-gray-50 flex items-center justify-center text-gray-300 hover:border-[#2d2a26] hover:text-[#2d2a26] transition-all disabled:opacity-20 shadow-sm bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-14 h-14 rounded-2xl font-black text-[11px] tracking-tight transition-all duration-300 ${currentPage === i + 1 ? 'bg-[#2d2a26] text-white shadow-2xl shadow-black/40 scale-110' : 'bg-white border-2 border-gray-50 text-gray-300 hover:border-[#eca840] hover:text-[#eca840]'}`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="w-14 h-14 rounded-2xl border-2 border-gray-50 flex items-center justify-center text-gray-300 hover:border-[#2d2a26] hover:text-[#2d2a26] transition-all disabled:opacity-20 shadow-sm bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}

function ShopProductCard({ product, onOpenSelection }: { product: Product, onOpenSelection: () => void }) {
  const isSoldOut = product.stock <= 0;
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getProductImage = (p: Product, type?: 'Solo' | 'Package') => {
    if (type === 'Solo' && p.solo_image) return p.solo_image;
    if (type === 'Package' && p.package_image) return p.package_image;
    return p.image || p.img || p.solo_image || p.package_image || p.thumbnail || '/images/placeholder.png';
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col group transition-all duration-700 ${isSoldOut ? 'opacity-80' : 'hover:shadow-[0_45px_90px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-3'}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#faf9f6] m-3 rounded-[2rem]">
        <img src={getProductImage(product, 'Solo')} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />


        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          {product.is_top_rated && <span className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md text-gray-900 dark:text-white text-[8px] font-black px-4 py-2 rounded-xl shadow-lg border border-white dark:border-gray-700 tracking-[0.2em] uppercase">Top Rated</span>}
          {product.is_new && <span className="bg-[#eca840] text-white text-[8px] font-black px-4 py-2 rounded-xl shadow-lg border border-[#eca840] tracking-[0.2em] uppercase">New Arrival</span>}
          {product.status === 'pre_order' && <span className="bg-blue-600 text-white text-[8px] font-black px-4 py-2 rounded-xl shadow-lg border border-blue-600 tracking-[0.2em] uppercase">Pre-Order</span>}
        </div>


        {isSoldOut && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-gray-900 text-white text-[9px] font-black px-8 py-3 rounded-full shadow-2xl tracking-[0.3em] uppercase rotate-[-5deg]">Sold Out</span>
          </div>
        )}
      </div>

      <div className="px-8 pb-10 pt-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none bg-[#faf9f6] px-3 py-1.5 rounded-lg">
            {product.category?.name || product.category || 'PRODUCT'}
          </span>
          <div className="flex items-center text-[#eca840] text-[10px] font-black"><Star className="w-3 h-3 fill-current mr-1.5" /> {product.rating || '4.9'}</div>
        </div>

        <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-[#eca840] transition-colors tracking-tighter leading-tight mb-3">{product.name}</h3>
        <p className="text-[11px] text-gray-400 mb-8 line-clamp-2 font-bold leading-relaxed">{product.description}</p>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-8 pb-8 border-b border-gray-50">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Price</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">₱{parseFloat(String(product.solo_price)).toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Stock Level</span>
              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${product.stock < 10 ? 'text-red-500 bg-red-50 border-red-100' : 'text-[#2d2a26] bg-white border-gray-100'}`}>
                {product.stock} Units
              </span>
            </div>
          </div>

          {!isSoldOut && (
            <>
              <SignedIn>
                <button
                  onClick={onOpenSelection}
                  className="w-full bg-[#d4af37] text-white font-black py-5 rounded-2xl text-[10px] flex items-center justify-center gap-4 transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(212,175,55,0.4)] hover:bg-black hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 uppercase tracking-[0.3em] group border border-[#d4af37]/20"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
                  Order Item
                </button>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal" afterSignInUrl="/buyer/shop">
                  <button
                    className="w-full bg-[#d4af37] text-white font-black py-5 rounded-2xl text-[10px] flex items-center justify-center gap-4 transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(212,175,55,0.4)] hover:bg-black hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 uppercase tracking-[0.3em] group border border-[#d4af37]/20"
                  >
                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
                    Sign In to Buy
                  </button>
                </SignInButton>
              </SignedOut>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

