import React, { useState, useEffect } from "react";

const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);

const Filter = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
);

const ShoppingCart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
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
  price: number;
  category: string;
  status: 'in_stock' | 'pre_order' | 'sold_out';
  rating: number;
  reviews_count: number;
  image: string;
  is_featured: boolean;
  is_new: boolean;
  is_top_rated: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "Ube Sapin-Sapin", slug: "ube-sapin-sapin", description: "Authentic three-layered sticky rice cake with pure purple yam and...", price: 450.0, category: "Kakanin", status: "in_stock", rating: 4.9, reviews_count: 120, image: "/images/products/sapin-sapin.png", is_top_rated: true, is_featured: false, is_new: false },
  { id: 2, name: "Sea Salt Muscovado", slug: "sea-salt-muscovado", description: "Chewy cookies made with raw muscovado sugar and premium...", price: 320.0, category: "Cookies", status: "in_stock", rating: 4.8, reviews_count: 85, image: "/images/products/cookies.png", is_top_rated: false, is_featured: false, is_new: false },
  { id: 3, name: "Pandesal Artisano", slug: "pandesal-artisano", description: "Slow-fermented traditional bread rolls with a cloud-like interior an...", price: 180.0, category: "Breads", status: "in_stock", rating: 5.0, reviews_count: 210, image: "/images/products/pandesal-v2.png", is_top_rated: false, is_featured: false, is_new: true },
  { id: 4, name: "Tablea Ganache", slug: "tablea-ganache", description: "Rich chocolate cake made from local tablea cacao and silky dark...", price: 1250.0, category: "Cakes", status: "in_stock", rating: 4.7, reviews_count: 56, image: "/images/products/dark-truffle.png", is_top_rated: false, is_featured: false, is_new: false },
  { id: 5, name: "Ensaymada Grande", slug: "ensaymada-grande", description: "Buttery brioche topped with aged queso de bola and premium butt...", price: 85.0, category: "Pastries", status: "in_stock", rating: 4.9, reviews_count: 320, image: "/images/products/ensaymada.png", is_top_rated: false, is_featured: false, is_new: false },
  { id: 6, name: "Premium Buko Pie", slug: "premium-buko-pie", description: "Fresh coconut meat in a creamy custard and buttery flaky crust.", price: 680.0, category: "Pastries", status: "sold_out", rating: 5.0, reviews_count: 45, image: "/images/products/buko-pie.png", is_top_rated: false, is_featured: false, is_new: false }
];

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";


interface ShopProps {
  products: Product[];
}

export default function Shop({ products: initialProducts }: ShopProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || MOCK_PRODUCTS);
  const categories = initialProducts ? [...new Set(initialProducts.map(p => p.category))] : ["Kakanin", "Cookies", "Breads", "Cakes", "Pastries"];

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(2000);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'info' }>({ show: false, message: "", type: 'success' });


  // Filter Logic
  useEffect(() => {
    let filtered = initialProducts || MOCK_PRODUCTS;
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(p => p.price <= priceRange);
    
    setProducts(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [selectedCategories, searchQuery, priceRange, initialProducts]);

  // Pagination Logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    
    // Update the visual badge in header (Image 1)
    const badge = document.getElementById('cart-badge');
    if (badge) badge.innerText = '1';

    setTimeout(() => {
      setToast({ show: false, message: "", type: 'success' });
      // Artisanal Redirect Flow (Image 1 logic)
      window.location.href = '/login';
    }, 1500);
  };


  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6] pt-20">
      <Navbar />
      <main className="flex-grow">

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-24 right-8 z-[1100] animate-in fade-in slide-in-from-right-8 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${toast.type === 'success' ? 'bg-white border-green-100' : 'bg-white border-blue-100'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-green-500' : 'bg-[#eca840]'}`}>
              {toast.type === 'success' ? <span className="text-white">✓</span> : <ShoppingCart className="w-4 h-4 text-white" />}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{toast.message}</p>
              <p className="text-[10px] text-gray-400 font-medium">Added to your artisanal collection</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="mb-12">
           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">The Artisanal Gallery</h1>
           <p className="text-gray-500 max-w-2xl">Curated flavors from our hearth to your home. Discover our range of hand-crafted delicacies.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
            <div>
              <h3 className="flex items-center text-sm font-bold uppercase tracking-widest text-gray-900 mb-6"><Filter className="w-4 h-4 mr-2" /> Filters</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Categories</h4>
                  <div className="space-y-3">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center group cursor-pointer">
                        <div className="relative flex items-center">
                          <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} className="peer appearance-none w-5 h-5 border border-gray-300 rounded checked:bg-[#eca840] checked:border-[#eca840] transition-all" />
                          <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 font-bold text-[10px]">✓</div>
                        </div>
                        <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                   <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Price Range</h4>
                   <div className="px-2">
                      <input type="range" min="0" max="2000" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#eca840]" />
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3"><span>₱0</span><span>₱{priceRange}+</span></div>
                   </div>
                </div>
                <div>
                   <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Status</h4>
                   <div className="flex flex-wrap gap-2">
                      <button className="bg-[#eca840] text-white text-[10px] font-bold px-3 py-1.5 rounded-full">In Stock</button>
                      <button className="bg-white border border-gray-200 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-gray-50">Pre-order</button>
                   </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
             <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input 
                      type="text" 
                      placeholder="Search treats..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#faf9f6] border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#eca840]/20 transition-all font-medium" 
                   />
                </div>
                <div className="flex items-center gap-6 text-sm">
                   <span className="text-gray-400 text-xs font-medium">Showing {products.length} results</span>
                   <div className="flex items-center">
                     <span className="text-gray-400 mr-2 text-xs">Sort by:</span>
                     <select className="bg-transparent font-bold text-[#eca840] focus:outline-none cursor-pointer">
                        <option>Latest Arrivals</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                     </select>
                   </div>
                </div>
             </div>

             {products.length === 0 ? (
               <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No treats found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
                  <button onClick={() => { setSelectedCategories([]); setSearchQuery(""); setPriceRange(2000); }} className="mt-6 text-[#eca840] font-bold text-sm underline underline-offset-4">Reset all filters</button>
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map(product => <ShopProductCard key={product.id} product={product} onAddToCart={() => showToast(`${product.name} added to basket!`)} />)}
               </div>
             )}

             {totalPages > 1 && (
               <div className="mt-16 flex justify-center items-center gap-4">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-[#eca840] hover:text-[#eca840] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-12 h-12 rounded-full font-bold text-sm transition-all duration-300 ${currentPage === i + 1 ? 'bg-[#eca840] text-white shadow-lg shadow-[#eca840]/30 scale-110' : 'bg-white border border-gray-100 text-gray-400 hover:border-[#eca840] hover:text-[#eca840]'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-[#eca840] hover:text-[#eca840] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm bg-white"
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

function ShopProductCard({ product, onAddToCart }: { product: Product, onAddToCart: () => void }) {
  const isSoldOut = product.status === 'sold_out';
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className={`bg-white rounded-3xl overflow-hidden border border-gray-100 flex flex-col group transition-all duration-500 ${isSoldOut ? 'opacity-70' : 'hover:shadow-2xl hover:-translate-y-1'}`}>
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.is_top_rated && <span className="bg-[#eca840] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">Top Rated</span>}
          {product.is_new && <span className="bg-cyan-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">New</span>}
        </div>
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-4 right-4 w-9 h-9 ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400'} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
        {isSoldOut && <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px] flex items-center justify-center"><span className="bg-white/90 text-black text-[10px] font-extrabold px-6 py-2 rounded-lg shadow-xl">Sold Out</span></div>}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
           <h3 className="font-bold text-gray-900 group-hover:text-[#eca840] transition-colors">{product.name}</h3>
           <div className="flex items-center text-[#eca840] text-[10px] font-bold"><Star className="w-3 h-3 fill-current mr-1" /> {product.rating}</div>
        </div>
        <p className="text-xs text-gray-400 mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
           <span className="text-lg font-bold text-gray-900">₱{product.price.toLocaleString()}</span>
           {isSoldOut ? (
             <button disabled className="bg-gray-100 text-gray-400 text-xs font-bold px-4 py-2 rounded-xl">Sold Out</button>
           ) : (
             <button 
                onClick={onAddToCart}
                className="bg-[#eca840] text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 hover:bg-[#d69635] hover:shadow-lg hover:shadow-[#eca840]/30 transition-all active:scale-95"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </button>
           )}
        </div>
      </div>
    </div>
  );
}

