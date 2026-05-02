import React from 'react';
// Kokommerce Seller Portal - Product Management (Verified Structural Integrity)
import SellerLayout from '../../Components/SellerLayout';
import { Head, Link, useForm } from '@inertiajs/inertia-react';

declare function route(name: string, params?: any): string;

import { Product } from '../../types';

interface ProductsProps {
  products: Product[];
  archived_products: Product[];
  categories: any[];
  stats: {
    total_items: number;
    in_stock_count: number;
    sold_out_count: number;
    low_stock: number;
    category_count: number;
    pre_order_count: number;
  };
}

const ProductStatsIdentity = ({ label, value, badge, isAlert, isStatus, icon }: any) => (
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

const ArtisanVaultCard = (props: any) => {
  const { product, onEdit, onArchive, onRestock, isArchived, isSelected, onSelect, onRestore, onPermanentDelete } = props;
  const [displayImage, setDisplayImage] = React.useState(product.solo_image || product.image);
  const [isChanging, setIsChanging] = React.useState(false);

  // Sync image if product changes
  React.useEffect(() => {
    setDisplayImage(product.solo_image || product.image);
  }, [product.solo_image, product.image]);

  const handleImageChange = (newImage: string | null) => {
    const finalImage = newImage || product.image;
    if (finalImage === displayImage) return;
    setIsChanging(true);
    setTimeout(() => {
      setDisplayImage(finalImage);
      setIsChanging(false);
    }, 250);
  };

  return (
    <div className={`group bg-white rounded-[3rem] overflow-hidden border transition-all duration-700 ${isSelected ? 'border-[#eca840] shadow-2xl' : 'border-gray-100 shadow-sm'} hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative flex flex-col`}>
      {isArchived && (
        <div className="absolute top-8 left-8 z-20">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-7 h-7 rounded-xl border-2 border-gray-200 text-[#eca840] focus:ring-[#eca840]/20 transition-all cursor-pointer"
          />
        </div>
      )}

      {/* Main Architectural Vault */}
      <div className="relative aspect-[4/5] overflow-hidden p-6 pb-2">
        <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden bg-[#fcfaf7] shadow-inner group/vault">
          <img
            src={displayImage || '/images/placeholder.png'}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-1000 ease-out transform group-hover/vault:scale-110 ${isChanging ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100 blur-0'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />

          {/* Floating Inventory Status */}
          <div className={`absolute top-6 right-6 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-md border border-white/20 flex items-center gap-2 z-10 ${product.stock <= 5 ? 'bg-red-500 text-white' :
            product.status === 'pre_order' ? 'bg-indigo-600 text-white' : 'bg-white/90 text-gray-900'
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${product.stock <= 5 || product.status === 'pre_order' ? 'bg-white animate-pulse' : 'bg-[#eca840]'}`}></div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{product.status === 'in_stock' ? `${product.stock} Units` : product.status.replace('_', ' ')}</span>
          </div>

          {/* Sold Out Architecture */}
          {product.status === 'sold_out' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-8 bg-black/20 backdrop-blur-[4px]">
              <div className="bg-white/10 backdrop-blur-xl border border-white/30 px-10 py-5 rounded-[2rem] shadow-2xl skew-x-[-6deg] animate-in zoom-in-95 duration-700">
                <span className="text-white text-2xl font-bold tracking-[0.4em] uppercase drop-shadow-2xl">Sold Out</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Identity & Variants Module */}
      <div className="px-8 pt-4 pb-8 flex flex-col flex-1">

        {/* Formal Variant Switcher */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {/* Solo Entry */}
          <button
            type="button"
            onClick={() => handleImageChange(product.solo_image || product.image)}
            className={`group/solo flex flex-col items-center gap-4 p-5 rounded-[2.5rem] transition-all duration-700 border ${displayImage === (product.solo_image || product.image)
              ? 'bg-[#fcfaf7] border-[#eca840]/40 shadow-[inset_0_2px_10px_rgba(236,168,64,0.05)]'
              : 'bg-white border-gray-50 hover:bg-gray-50 hover:border-gray-200'
              }`}
          >
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 shadow-xl transition-all duration-700 ${displayImage === (product.solo_image || product.image) ? 'border-[#eca840] scale-110 shadow-[#eca840]/20' : 'border-gray-50 group-hover/solo:scale-110'
              }`}>
              <img src={product.solo_image || product.image || '/images/placeholder.png'} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className={`text-[13px] font-bold tabular-nums tracking-tight ${displayImage === (product.solo_image || product.image) ? 'text-gray-900' : 'text-gray-400'}`}>
                ₱{parseFloat(product.solo_price || 0).toLocaleString()}
              </span>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${displayImage === (product.solo_image || product.image) ? 'text-[#eca840]' : 'text-gray-300'}`}>
                {product.solo_unit || 'SOLO'}
              </span>
            </div>
          </button>

          {/* Package Entry */}
          <button
            type="button"
            onClick={() => handleImageChange(product.package_image || product.image)}
            className={`group/pkg flex flex-col items-center gap-4 p-5 rounded-[2.5rem] transition-all duration-700 border ${displayImage === (product.package_image || product.image)
              ? 'bg-white border-[#eca840] shadow-2xl scale-[1.02]'
              : 'bg-white border-gray-50 hover:bg-gray-50 hover:border-gray-200'
              }`}
          >
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 shadow-xl transition-all duration-700 ${displayImage === (product.package_image || product.image) ? 'border-[#eca840] scale-110 shadow-[#eca840]/20' : 'border-gray-50 group-hover/pkg:scale-110'
              }`}>
              <img src={product.package_image || product.image || '/images/placeholder.png'} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className={`text-[13px] font-bold tabular-nums tracking-tight ${displayImage === (product.package_image || product.image) ? 'text-gray-900' : 'text-gray-400'}`}>
                ₱{product.package_price ? parseFloat(product.package_price).toLocaleString() : '---'}
              </span>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] truncate max-w-[80px] ${displayImage === (product.package_image || product.image) ? 'text-[#eca840]' : 'text-gray-300'}`}>
                {product.package_unit || 'PACKAGE'}
              </span>
            </div>
          </button>
        </div>

        {/* Identity Section - Now Below Variants */}
        <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <h3 className="text-xl font-[1000] text-gray-900 uppercase tracking-[0.3em] line-clamp-1 mb-2 group-hover:text-[#eca840] transition-colors duration-500">{product.name}</h3>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-8 bg-gray-100 hidden sm:block"></div>
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em]">Product ID #BK-{product.id}</span>
            <div className="h-[1px] w-8 bg-gray-100 hidden sm:block"></div>
          </div>
          {product.is_top_rated && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-100/50 rounded-full">
              <span className="w-1 h-1 rounded-full bg-[#eca840] animate-pulse"></span>
              <span className="text-[7px] font-bold text-[#eca840] uppercase tracking-widest">Best Seller</span>
            </div>
          )}
        </div>

        {/* Operational Actions */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
          {!isArchived ? (
            <>
              <button
                onClick={onEdit}
                className="flex-1 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-[#2d2a26] hover:text-white transition-all shadow-sm group/btn border border-transparent"
              >
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button
                onClick={onRestock}
                className="flex-1 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-[#eca840] hover:bg-[#eca840] hover:text-white transition-all shadow-sm border border-orange-100 group/btn"
              >
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </button>
              <button
                onClick={onArchive}
                className="flex-1 h-14 bg-red-50/30 rounded-2xl flex items-center justify-center text-red-200 hover:bg-red-500 hover:text-white transition-all group/btn border border-transparent"
              >
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onRestore}
                className="flex-[2] h-14 bg-green-50 rounded-2xl flex items-center justify-center gap-3 text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-100 group/btn"
              >
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Restore Product</span>
              </button>
              <button
                onClick={onPermanentDelete}
                className="flex-1 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 group/btn"
              >
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ArtisanVaultRow = (props: any) => {
  const { product, onEdit, onArchive, onRestock, isArchived, isSelected, onSelect, onRestore, onPermanentDelete } = props;
  const [displayImage, setDisplayImage] = React.useState(product.solo_image || product.image);
  const [isChanging, setIsChanging] = React.useState(false);

  // Sync image if product changes
  React.useEffect(() => {
    setDisplayImage(product.solo_image || product.image);
  }, [product.solo_image, product.image, product.package_image]);

  const handleImageChange = (newImage: string | null) => {
    const finalImage = newImage || product.image;
    if (finalImage === displayImage) return;
    setIsChanging(true);
    setTimeout(() => {
      setDisplayImage(finalImage);
      setIsChanging(false);
    }, 250);
  };

  return (
    <tr className={`group transition-all hover:bg-[#fdfaf5]/50 border-b border-gray-50 last:border-0 ${isSelected ? 'bg-orange-50/50' : ''}`}>
      {isArchived && (
        <td className="px-8 py-6">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-5 h-5 rounded-md border-gray-200 text-[#eca840] focus:ring-[#eca840]/20 cursor-pointer transition-all"
          />
        </td>
      )}
      <td className="px-8 py-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-[#fcfaf7] border border-gray-100 flex-shrink-0 relative shadow-sm">
            <img
              src={displayImage || '/images/placeholder.png'}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${isChanging ? 'opacity-40 scale-105' : 'opacity-100 scale-100'} ${product.status === 'sold_out' ? 'grayscale opacity-50' : ''}`}
            />
            {product.status === 'sold_out' && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center p-2">
                <span className="text-[7px] font-black text-gray-900 uppercase tracking-widest text-center leading-tight">Sold Out</span>
              </div>
            )}
          </div>
          <div>
            <h4 className="text-base font-black text-gray-900 group-hover:text-[#eca840] transition-colors leading-tight mb-1.5">{product.name}</h4>
            <div className="flex items-center gap-3">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Vault ID #BAKE-{product.id}</p>
              {product.is_top_rated && (
                <span className="bg-[#eca840]/10 text-[#eca840] text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Best Seller</span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-8 py-8">
        <span className="inline-flex px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border border-gray-100 italic">
          {product.category?.name || 'Uncategorized'}
        </span>
      </td>
      <td className="px-8 py-8">
        <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${product.status === 'in_stock' ? 'bg-green-500 text-white' :
          product.status === 'pre_order' ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/10' :
            'bg-red-500 text-white'
          }`}>
          {product.status === 'pre_order' && (
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
          )}
          {product.status.replace('_', ' ')}
        </div>
      </td>
      <td className="px-8 py-8 text-right">
        <div className="flex flex-col items-end">
          <div className="flex items-center justify-end gap-2.5">
            <span className={`text-xl font-[1000] tabular-nums ${product.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>{product.stock}</span>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Units</span>
          </div>
          {product.stock < 10 && product.status !== 'pre_order' && (
            <span className="text-[7px] font-black text-red-400 uppercase tracking-tighter mt-1 animate-pulse">Critical Stock Level</span>
          )}
        </div>
      </td>
      <td className="px-8 py-8 text-right min-w-[320px]">
        <div className="flex justify-end gap-6">
          {/* Solo Variant Connection */}
          <button
            type="button"
            onClick={() => handleImageChange(product.solo_image || product.image)}
            className={`flex items-center gap-4 transition-all duration-700 p-2.5 rounded-full pr-6 ${displayImage === (product.solo_image || product.image)
              ? 'bg-[#fcfaf7] ring-1 ring-[#eca840]/30 shadow-[0_5px_15px_-5px_rgba(236,168,64,0.1)]'
              : 'hover:bg-gray-50 group/solo border border-transparent hover:border-gray-100'
              }`}
          >
            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 shadow-md transition-all duration-700 ${displayImage === (product.solo_image || product.image)
              ? 'border-[#eca840] scale-110 shadow-[#eca840]/20'
              : 'border-gray-50 group-hover/solo:scale-110'
              }`}>
              <img src={product.solo_image || product.image || '/images/placeholder.png'} alt="Solo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className={`text-[12px] font-bold tabular-nums tracking-tight transition-colors ${displayImage === (product.solo_image || product.image) ? 'text-gray-900' : 'text-gray-400'
                }`}>₱{parseFloat(product.solo_price || 0).toLocaleString()}</span>
              <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${displayImage === (product.solo_image || product.image) ? 'text-[#eca840]' : 'text-gray-300'
                }`}>{product.solo_unit || 'Solo'}</span>
            </div>
          </button>

          {/* Package Variant Connection */}
          <button
            type="button"
            onClick={() => handleImageChange(product.package_image || product.image)}
            className={`flex items-center gap-4 transition-all duration-700 p-2.5 rounded-full pr-6 ${displayImage === (product.package_image || product.image)
              ? 'bg-white border border-[#eca840]/30 shadow-2xl scale-[1.02]'
              : 'hover:bg-gray-50 group/pkg border border-transparent hover:border-gray-100'
              }`}
          >
            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 shadow-md transition-all duration-700 ${displayImage === (product.package_image || product.image)
              ? 'border-[#eca840] scale-110 shadow-[#eca840]/20'
              : 'border-gray-50 group-hover/pkg:scale-110'
              }`}>
              <img src={product.package_image || product.image || '/images/placeholder.png'} alt="Package" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className={`text-[12px] font-bold tabular-nums tracking-tight transition-colors ${displayImage === (product.package_image || product.image) ? 'text-gray-900' : 'text-gray-400'
                }`}>₱{product.package_price ? parseFloat(product.package_price).toLocaleString() : '---'}</span>
              <span className={`text-[7px] font-black uppercase tracking-[0.2em] truncate max-w-[80px] ${displayImage === (product.package_image || product.image) ? 'text-[#eca840]' : 'text-gray-300'
                }`}>
                {product.package_unit || 'Units'}
              </span>
            </div>
          </button>
        </div>
      </td>
      <td className="px-8 py-8 text-right">
        <div className="flex justify-end gap-3">
          {!isArchived ? (
            <>
              <button onClick={onEdit} className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#eca840] hover:text-white transition-all shadow-sm flex items-center justify-center border border-transparent hover:border-[#eca840]/20 group/btn">
                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button onClick={onRestock} className="w-10 h-10 bg-orange-50 text-[#eca840] rounded-xl hover:bg-[#eca840] hover:text-white transition-all shadow-sm flex items-center justify-center border border-orange-100 group/btn">
                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </button>
              <button onClick={onArchive} className="w-10 h-10 bg-gray-50 text-gray-300 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center group/btn">
                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </>
          ) : (
            <>
              <button onClick={onRestore} className="px-6 py-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-500 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest shadow-sm border border-green-100">
                Restore
              </button>
              <button onClick={onPermanentDelete} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center border border-red-100 group/btn">
                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

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
  const [offeringType, setOfferingType] = React.useState<'solo' | 'package' | 'both'>('solo');

  const restockForm = useForm({
    quantity: '1',
  });

  const { data, setData, post, put, delete: destroy, reset, processing, errors, transform } = useForm<{
    name: string;
    category_id: string | number;
    description: string;
    solo_price: string | number;
    package_price: string | number;
    package_unit: string;
    package_qty: string | number;
    stock: string | number;
    image: string;
    image_file: File | null;
    solo_image: string;
    solo_image_file: File | null;
    solo_unit: string;
    package_image: string;
    package_image_file: File | null;
    status: string;
    offering_type: 'solo' | 'package' | 'both';
    _method: 'POST' | 'PUT';
  }>({
    name: '',
    category_id: '',
    description: '',
    solo_price: '',
    package_price: '',
    package_unit: '',
    package_qty: '',
    stock: '',
    image: '',
    image_file: null as File | null,
    solo_image: '',
    solo_image_file: null as File | null,
    solo_unit: '',
    package_image: '',
    package_image_file: null as File | null,
    status: 'in_stock',
    offering_type: 'solo',
    _method: 'POST'
  });

  // Sync offeringType state to form data
  React.useEffect(() => {
    setData('offering_type', offeringType);
  }, [offeringType]);

  const selectedCategoryName = categories.find(c => c.id.toString() === data.category_id.toString())?.name?.toLowerCase() || '';
  const isCake = selectedCategoryName.includes('cake');
  const isBread = ['bread', 'cookie', 'cookies', 'pastry', 'pastries'].some(c => selectedCategoryName.includes(c));
  const isDelicacy = ['delicacy', 'delicacies', 'sweets', 'kakanin', 'kutchinta', 'puto', 'biko'].some(c => selectedCategoryName.includes(c));
  const isPackageable = isCake || isDelicacy || isBread || ['cupcake', 'muffin'].some(c => selectedCategoryName.includes(c));

  // Auto-detect recommended units based on category
  React.useEffect(() => {
    if (data.category_id && !editingProduct) {
      if (isCake) {
        setData(d => ({ ...d, solo_unit: 'slice', package_unit: 'whole_tray' }));
      } else if (isDelicacy) {
        // For small delicacies, default to set units (minimum of 3 or more pieces)
        setData(d => ({ ...d, solo_unit: 'Set of 3', package_unit: 'bilao', package_qty: 12 }));
      } else if (isBread) {
        setData(d => ({ ...d, solo_unit: 'pc', package_unit: 'pcs', package_qty: 12 }));
      } else {
        setData(d => ({ ...d, solo_unit: 'pc', package_unit: 'pcs' }));
      }
    }
  }, [data.category_id]);


  const [modalPreview, setModalPreview] = React.useState<string | null>(null);
  const [soloPreview, setSoloPreview] = React.useState<string | null>(null);
  const [packagePreview, setPackagePreview] = React.useState<string | null>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setModalPreview(null);
    reset();
    setData({
      name: '',
      category_id: '',
      description: '',
      solo_price: '',
      package_price: '',
      package_unit: '',
      package_qty: '',
      stock: '',
      image: '',
      image_file: null,
      solo_image: '',
      solo_image_file: null,
      solo_unit: '',
      package_image: '',
      package_image_file: null,
      status: 'in_stock',
      offering_type: 'both' as const,
      _method: 'POST' as const
    });
    setSoloPreview(null);
    setPackagePreview(null);
    setOfferingType('solo');
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setModalPreview(product.image);
    let initialType: 'solo' | 'package' | 'both' = 'solo';
    if (product.solo_price && product.package_price) initialType = 'both';
    else if (product.solo_price) initialType = 'solo';
    else if (product.package_price) initialType = 'package';

    setData({
      name: product.name,
      category_id: product.category_id,
      description: product.description,
      solo_price: product.solo_price || '',
      package_price: product.package_price || '',
      package_unit: product.package_unit || '',
      package_qty: product.package_qty || '',
      stock: product.stock,
      image: product.image,
      image_file: null,
      solo_image: product.solo_image || '',
      solo_image_file: null,
      solo_unit: product.solo_unit || '',
      package_image: product.package_image || '',
      package_image_file: null,
      status: product.status,
      offering_type: initialType,
      _method: 'PUT' as const
    });
    setSoloPreview(product.solo_image);
    setPackagePreview(product.package_image);
    
    setOfferingType(initialType);
    setIsModalOpen(true);
  };

  const handleVariantFileChange = (e: React.ChangeEvent<HTMLInputElement>, variant: 'solo' | 'package') => {
    const file = e.target.files?.[0];
    if (file) {
      setData(variant === 'solo' ? 'solo_image_file' : 'package_image_file', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (variant === 'solo') setSoloPreview(reader.result as string);
        else setPackagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('image_file', file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setModalPreview(result);

        // Smart Sync: If variant images haven't been set yet, use the main image as default
        if (!data.solo_image_file && !soloPreview) {
          setData('solo_image_file', file);
          setSoloPreview(result);
        }
        if (!data.package_image_file && !packagePreview) {
          setData('package_image_file', file);
          setPackagePreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    transform((data: any) => ({
      ...data,
      _method: editingProduct ? 'PUT' : 'POST',
      // Clean up data based on offering type to ensure backend integrity
      ...(offeringType === 'solo' ? {
        package_price: '',
        package_unit: '',
        package_qty: '',
        package_image_file: null,
      } : {}),
      ...(offeringType === 'package' ? {
        solo_price: '',
        solo_unit: '',
        solo_image_file: null,
      } : {}),
    }));

    const options = {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
        setEditingProduct(null);
        setModalPreview(null);
        setSoloPreview(null);
        setPackagePreview(null);
      }
    };

    if (editingProduct) {
      post(route('seller.products.update', editingProduct.id), options);
    } else {
      post(route('seller.products.store'), options);
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
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2">Product Management</h1>
          <p className="text-gray-500 font-medium">Manage and monitor your product inventory.</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6 mb-16">
        <ProductStatsIdentity
          label="Total Products"
          value={stats.total_items}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        <ProductStatsIdentity
          label="In Stock Item"
          value={stats.in_stock_count}
          badge="Live"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <ProductStatsIdentity
          label="Low Stock Alerts"
          value={stats.low_stock}
          badge="Action Required"
          isAlert={stats.low_stock > 0}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
        <ProductStatsIdentity
          label="Categories"
          value={stats.category_count}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
        />
        <ProductStatsIdentity
          label="Pre-Order Items"
          value={stats.pre_order_count || 0}
          isStatus
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <ProductStatsIdentity
          label="Out of Stock"
          value={stats.sold_out_count}
          badge="Replenish"
          isAlert={stats.sold_out_count > 0}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
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
          <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            Current Inventory
            <div className="w-1.5 h-1.5 rounded-full bg-[#eca840] animate-pulse"></div>
          </h3>
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.15em] mt-1">Real-time inventory monitoring</p>
        </div>
        <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100/50">
          <span className="text-gray-900">{sortedProducts.length}</span> Products
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
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-[#eca840] transition-colors">Add Product</h4>
              </div>
            )}

            {activeFilter === 'Archive' && archived_products.length > 0 && (
              <div className="lg:col-span-4 mb-6 flex justify-between items-center bg-white border border-gray-100 p-6 rounded-[1.5rem] shadow-xl">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{selectedArchived.length} Ready for restoration</span>
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
              <ArtisanVaultCard
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
                    <ArtisanVaultRow
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
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">No matching products found</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-[0.2em]">Try adjusting your search or filters</p>
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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-[#eca840]/10 border border-[#eca840]/20 flex items-center justify-center text-[#eca840] shadow-[0_0_20px_rgba(236,168,64,0.1)]">
                   <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                 </div>
                 <div>
                   <span className="text-[9px] font-black text-[#eca840] uppercase tracking-[0.4em] mb-1.5 block">Product Architect</span>
                   <h2 className="text-2xl font-[1000] text-gray-900 tracking-tight uppercase">{editingProduct ? 'Refine Masterpiece' : 'Design New Masterpiece'}</h2>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable Architectural Container */}
            <div className="overflow-y-auto custom-scrollbar flex-1">
              <div className="p-10">
                {/* Strategy Selection - Global Master Control */}
                <div className="mb-12 flex justify-center">
                  <div className="bg-gray-50 p-2 rounded-[2.5rem] flex gap-2 border border-gray-100 shadow-inner w-full max-w-2xl">
                    {[
                      { id: 'solo' as const, label: 'Solo Focused', icon: '🍪' },
                      { id: 'both' as const, label: 'Strategic Synergy', icon: '✨' },
                      { id: 'package' as const, label: 'Package Focused', icon: '📦' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setOfferingType(type.id);
                          setData('offering_type', type.id);
                        }}
                        className={`flex-1 py-5 px-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex flex-col md:flex-row items-center justify-center gap-3 border ${
                          offeringType === type.id 
                            ? 'bg-gradient-to-br from-[#eca840] to-[#d69635] text-white border-[#eca840] shadow-[0_10px_20px_-10px_rgba(236,168,64,0.5)] scale-[1.02]' 
                            : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100 hover:text-gray-700'
                        }`}
                      >
                        <span className="text-2xl leading-none transition-transform group-hover:scale-110">{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12 max-w-5xl mx-auto">
                  
                  {/* Grid Layout for Core and Narrative */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Phase 1: Core Vault Identity */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-2">
                         <span className="text-[10px] font-black text-[#eca840] uppercase tracking-[0.3em] bg-[#eca840]/10 px-3 py-1.5 rounded-full border border-[#eca840]/20">Phase 01</span>
                         <h4 className="text-[11px] font-[1000] text-gray-900 uppercase tracking-[0.2em]">Global Identity</h4>
                      </div>

                      <div className="relative group/main p-6 bg-gray-50 rounded-[3rem] border border-gray-100 transition-all hover:border-gray-200 hover:shadow-xl">
                        <div className="flex flex-col gap-8">
                          <div className="flex gap-6 items-center">
                            <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-sm flex shrink-0 items-center justify-center relative group-hover/main:border-[#eca840]/30 transition-all duration-500">
                              {modalPreview ? (
                                <img src={modalPreview} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000" alt="Masterpiece" />
                              ) : (
                                <div className="flex flex-col items-center gap-3">
                                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                              )}
                              <label className="absolute inset-0 bg-white/60 opacity-0 group-hover/main:opacity-100 transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-[4px]">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-10 h-10 rounded-full bg-[#eca840] flex items-center justify-center text-white shadow-xl">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                  </div>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                              </label>
                            </div>
                            
                            <div className="flex-1 space-y-5">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Canonical Name</label>
                                <input
                                  type="text"
                                  value={data.name}
                                  onChange={e => setData('name', e.target.value)}
                                  className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all shadow-sm placeholder:text-gray-300"
                                  placeholder="Signature Masterpiece..."
                                />
                                {errors.name && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-2 ml-1">{errors.name}</p>}
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Collection</label>
                                <div className="relative">
                                  <select
                                    value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)}
                                    className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-xs font-bold text-gray-900 focus:ring-4 focus:ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all appearance-none cursor-pointer uppercase tracking-widest shadow-sm"
                                  >
                                    <option value="" className="bg-white">Select Category...</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id} className="bg-white">{cat.name}</option>)}
                                  </select>
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                  </div>
                                </div>
                                {errors.category_id && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-2 ml-1">{errors.category_id}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Narrative Canvas */}
                    <div className="space-y-6 flex flex-col">
                      <div className="flex items-center gap-4 mb-2">
                         <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">Phase 01B</span>
                         <h4 className="text-[11px] font-[1000] text-gray-900 uppercase tracking-[0.2em]">Narrative Canvas</h4>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-[3rem] border border-gray-100 p-6 flex flex-col transition-all hover:border-gray-200 hover:shadow-xl">
                         <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-3 block">Product Description & Specs</label>
                         <textarea
                           value={data.description}
                           onChange={e => setData('description', e.target.value)}
                           className="w-full flex-1 bg-white border border-gray-100 rounded-[2rem] p-6 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all shadow-sm placeholder:text-gray-300 resize-none min-h-[160px] custom-scrollbar"
                           placeholder="Articulate the vision, ingredients, and artisanal process behind this masterpiece..."
                         ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2: Solo Offering Architecture */}
                  {(offeringType === 'solo' || offeringType === 'both') && (
                    <div className="space-y-8 bg-gray-50 p-10 rounded-[3.5rem] border border-gray-100 relative overflow-hidden group/solo shadow-xl animate-in fade-in slide-in-from-right-8 duration-1000">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#eca840]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                      
                      <div className="flex justify-between items-center relative z-10 border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-[1.5rem] bg-[#eca840]/10 flex items-center justify-center border border-[#eca840]/20 shadow-inner text-[#eca840]">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.701 2.701 0 01-1.5-.454M9 16v2m3-6v6m3-8v8m2-8a2 2 0 11-4 0 2 2 0 014 0zM9 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-[1000] text-gray-900 uppercase tracking-[0.4em]">Solo configuration</h3>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Individual unit pricing & appropriate labeling</p>
                          </div>
                        </div>
                        <span className="text-[8px] font-black text-[#eca840] uppercase tracking-[0.3em] bg-[#eca840]/10 px-5 py-2.5 rounded-full border border-[#eca840]/20 shadow-sm">Config Phase 02</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative z-10">
                        {/* Solo Image Module */}
                        <div className="space-y-5">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block">distinct solo view</label>
                          <div className={`relative group p-2.5 rounded-[2.5rem] border-2 transition-all duration-700 ${soloPreview ? 'border-[#eca840]/30 bg-white shadow-2xl shadow-[#eca840]/10 ring-4 ring-[#eca840]/5' : 'border-dashed border-gray-100 bg-gray-100/50'}`}>
                            <div className="w-full aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center relative shadow-inner">
                              {soloPreview ? (
                                <img src={soloPreview} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000" alt="Solo" />
                              ) : (
                                <div className="flex flex-col items-center gap-4">
                                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center shadow-lg text-gray-500">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                  </div>
                                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Upload solo variant</span>
                                </div>
                              )}
                              <label className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-[6px]">
                                <div className="flex flex-col items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-[#eca840] flex items-center justify-center text-white shadow-2xl">
                                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                  </div>
                                  <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Replace solo</span>
                                </div>
                                <input type="file" className="hidden" onChange={e => handleVariantFileChange(e, 'solo')} accept="image/*" />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Solo Pricing & Unit Module */}
                        <div className="space-y-10 py-2">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Solo master rate</label>
                              <div className="flex gap-2">
                                {isDelicacy && <span className="text-[8px] font-black text-[#eca840] uppercase tracking-widest bg-[#eca840]/10 px-2.5 py-1 rounded-full border border-[#eca840]/20 shadow-sm">Delicacy detected</span>}
                                {Number(data.solo_price) >= 5 && Number(data.solo_price) <= 15 && (
                                  <span className="text-[8px] font-black text-[#eca840] uppercase tracking-[0.2em] bg-[#eca840]/10 px-3 py-1.5 rounded-lg border border-[#eca840]/30 shadow-xl animate-pulse flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#eca840]"></span>
                                    4x Batch Protocol Active
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="relative group">
                              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-gray-600 group-focus-within:text-[#eca840] transition-colors">₱</div>
                              <input
                                type="number"
                                value={data.solo_price}
                                onChange={e => setData('solo_price', e.target.value)}
                                className="w-full bg-white border border-gray-100 rounded-[2rem] pl-12 pr-20 py-6 text-2xl font-black tabular-nums text-gray-900 focus:bg-gray-50 focus:ring-[10px] focus:ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all shadow-inner placeholder:text-gray-300"
                                placeholder="0.00"
                              />
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 px-4 py-2 bg-gray-50 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] shadow-sm border border-gray-100">PH Pesos</div>
                            </div>
                            {errors.solo_price && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-2 ml-1">{errors.solo_price}</p>}
                          </div>

                          <div className="space-y-6">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Appropriate Unit architecture</label>
                             <div className="grid grid-cols-2 gap-4">
                                {[
                                  { 
                                    id: 'pc', 
                                    label: 'Piece', 
                                    sub: 'Cookies & Bread Architect',
                                    icon: '🥖', 
                                    rec: isBread || (!isCake && !isDelicacy)
                                  },
                                  { 
                                    id: 'slice', 
                                    label: 'Slice', 
                                    sub: 'Signature Cake Cut',
                                    icon: '🍰', 
                                    rec: isCake 
                                  },
                                  { 
                                    id: 'Set of 3', 
                                    label: 'Set of 3', 
                                    sub: 'Small Delicacy Batch',
                                    icon: '🍡', 
                                    rec: isDelicacy 
                                  },
                                  { 
                                    id: 'set', 
                                    label: 'Mini Set', 
                                    sub: 'Sampler Collection',
                                    icon: '🎁', 
                                    rec: false
                                  }
                                ].map((unit) => (
                                 <button
                                   key={unit.id}
                                   type="button"
                                   onClick={() => setData('solo_unit', unit.id)}
                                   className={`flex flex-col items-start gap-2 p-5 rounded-[2rem] border-2 transition-all duration-500 relative group/unit ${
                                     data.solo_unit === unit.id 
                                       ? 'bg-white border-[#eca840] shadow-2xl shadow-[#eca840]/20 ring-4 ring-[#eca840]/10' 
                                       : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                   }`}
                                 >
                                   <div className="flex items-center justify-between w-full mb-1">
                                      <span className="text-2xl grayscale opacity-70 group-hover/unit:grayscale-0 group-hover/unit:opacity-100 transition-all duration-500">{unit.icon}</span>
                                      {data.solo_unit === unit.id && (
                                         <div className="w-2.5 h-2.5 rounded-full bg-[#eca840] shadow-[0_0_12px_rgba(236,168,64,0.6)]"></div>
                                      )}
                                   </div>
                                   <div className="flex flex-col items-start">
                                      <span className={`text-[11px] font-[1000] uppercase tracking-[0.1em] transition-colors ${data.solo_unit === unit.id ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {unit.label}
                                      </span>
                                      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{unit.sub}</span>
                                   </div>
                                 </button>
                               ))}
                            </div>
                            
                            {/* Insight Notification */}
                            {(isDelicacy || (Number(data.solo_price) >= 5 && Number(data.solo_price) <= 15)) && (
                              <div className="p-6 bg-[#eca840]/10 rounded-[2.5rem] border border-[#eca840]/20 animate-in slide-in-from-top-4 duration-700 shadow-sm">
                                 <div className="flex items-start gap-4">
                                   <div className="w-10 h-10 rounded-full bg-[#eca840]/20 flex items-center justify-center text-[#eca840] shadow-sm shrink-0 border border-[#eca840]/30">
                                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                   </div>
                                   <div className="flex flex-col gap-1.5">
                                     <span className="text-[10px] font-black text-[#eca840] uppercase tracking-[0.2em]">Master Architect's Insight</span>
                                     <p className="text-[10px] font-bold text-gray-500 uppercase leading-[1.6] tracking-[0.05em]">
                                       {isDelicacy 
                                         ? "For bespoke delicacies, 'Set of 3' is the mandatory standard to preserve the artisanal presentation."
                                         : "Items priced between ₱5–₱15 are automatically provisioned as a 4x Collective Batch for logistical integrity."
                                       }
                                     </p>
                                   </div>
                                 </div>
                              </div>
                            )}
                          </div>
                        </div>
                       </div>
                     </div>
                  )}

                  {/* Phase 3: Package Offering Architecture */}
                  {(offeringType === 'package' || offeringType === 'both') && (
                    <div className="space-y-8 bg-gray-50 p-10 rounded-[3.5rem] border border-gray-100 relative overflow-hidden group/package shadow-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                      
                      <div className="flex justify-between items-center relative z-10 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-[1.5rem] bg-white border border-gray-100 flex items-center justify-center shadow-inner text-[#eca840]">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-[1000] text-gray-900 uppercase tracking-[0.4em]">Package configuration</h3>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Collective bundles & premium packaging rates</p>
                          </div>
                        </div>
                        <span className="text-[8px] font-black text-[#eca840] uppercase tracking-[0.3em] bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-lg">Config Phase 03</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative z-10">
                        {/* Package Image Module */}
                        <div className="space-y-5">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block">distinct package view</label>
                          <div className={`relative group p-2.5 rounded-[2.5rem] border-2 transition-all duration-700 ${packagePreview ? 'border-[#eca840]/40 bg-white shadow-2xl shadow-black/5 ring-8 ring-gray-50' : 'border-dashed border-gray-100 bg-gray-50'}`}>
                            <div className="w-full aspect-square rounded-[2rem] overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center relative shadow-inner">
                              {packagePreview ? (
                                <img src={packagePreview} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000" alt="Package" />
                              ) : (
                                <div className="flex flex-col items-center gap-4">
                                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center shadow-2xl text-gray-200">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                  </div>
                                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Upload pack variant</span>
                                </div>
                              )}
                              <label className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-[8px]">
                                <div className="flex flex-col items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-[#eca840] flex items-center justify-center text-white shadow-2xl">
                                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                  </div>
                                  <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Replace pack</span>
                                </div>
                                <input type="file" className="hidden" onChange={e => handleVariantFileChange(e, 'package')} accept="image/*" />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Package Pricing & Spec Module */}
                        <div className="space-y-8 py-2">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Collective master rate</label>
                            <div className="relative group">
                              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-gray-400 group-focus-within:text-[#eca840] transition-colors">₱</div>
                              <input
                                type="number"
                                value={data.package_price}
                                onChange={e => setData('package_price', e.target.value)}
                                className="w-full bg-white border border-gray-100 rounded-[2rem] pl-12 pr-20 py-6 text-2xl font-black tabular-nums text-gray-900 focus:bg-gray-50 focus:ring-8 focus:ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all shadow-2xl placeholder:text-gray-300"
                                placeholder="0.00"
                              />
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 px-4 py-2 bg-gray-50 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] shadow-lg border border-gray-100">PH Pesos</div>
                            </div>
                            {errors.package_price && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-2 ml-1">{errors.package_price}</p>}
                          </div>

                          <div className="space-y-8 bg-gray-100/50 p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl">
                             <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Package master format</label>
                                <div className="relative">
                                  <select
                                    value={data.package_unit}
                                    onChange={e => {
                                       const newUnit = e.target.value;
                                       setData(prev => ({
                                         ...prev,
                                         package_unit: newUnit,
                                         package_qty: (!prev.package_qty || Number(prev.package_qty) === 0) ? '1' : prev.package_qty
                                       }));
                                     }}
                                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-700 focus:ring-8 focus:ring-[#eca840]/10 appearance-none cursor-pointer hover:bg-gray-50 transition-all shadow-inner"
                                  >
                                    <option value="" className="bg-white">Choose Format...</option>
                                    <option value="pcs" className="bg-white">Pieces (Pcs)</option>
                                    <option value="bilao" className="bg-white">Whole Bilao</option>
                                    <option value="tray" className="bg-white">Formal Tray</option>
                                    <option value="whole_tray" className="bg-white">Whole Masterpiece</option>
                                    <option value="jar" className="bg-white">Artisanal Jar</option>
                                    <option value="pack" className="bg-white">Standard Pack</option>
                                    <option value="set" className="bg-white">Selection Set</option>
                                    <option value="large_tub" className="bg-white">Signature Tub</option>
                                  </select>
                                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#eca840]">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                  </div>
                                </div>
                              <div className="space-y-4 pt-2 animate-in slide-in-from-right-8 duration-700">
                                <div className="flex justify-between items-center px-1">
                                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Collective Yield</label>
                                  <span className="text-[7px] font-black text-[#eca840] uppercase tracking-[0.3em] bg-[#eca840]/10 px-3 py-1 rounded-full border border-[#eca840]/20">Required spec</span>
                                </div>
                                <div className="relative group">
                                  <input
                                    type="number"
                                    min="1"
                                    value={data.package_qty}
                                    onChange={e => {
                                      const val = e.target.value;
                                      if (val === '' || Number(val) >= 1) {
                                        setData('package_qty', val);
                                      }
                                    }}
                                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-5 text-lg font-black text-gray-900 focus:ring-8 focus:ring-[#eca840]/10 focus:bg-gray-50 transition-all shadow-inner placeholder:text-gray-300"
                                    placeholder="1"
                                  />
                                </div>
                                {errors.package_qty && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-2 ml-1">{errors.package_qty}</p>}
                              </div>

                             <div className="p-6 mt-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-6 shadow-3xl">
                                <div className="flex items-center justify-between">
                                   <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Master Yield preview</span>
                                   <div className="px-3 py-1 bg-[#eca840]/10 rounded-full border border-[#eca840]/20">
                                      <span className="text-[7px] font-black text-[#eca840] uppercase tracking-widest">Pricing Logic</span>
                                   </div>
                                </div>
                                <div className="flex items-end justify-between">
                                   <div className="space-y-1.5">
                                      <span className="text-[8px] font-[1000] text-gray-500 uppercase tracking-widest">Effective Unit Price</span>
                                      <div className="text-2xl font-black text-gray-900 tracking-tight tabular-nums flex items-baseline gap-2">
                                        ₱{data.package_price && Number(data.package_qty) > 0 ? (Number(data.package_price) / Number(data.package_qty)).toFixed(2) : '0.00'}
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/ {(data.package_unit || 'Unit').replace('_', ' ')}</span>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <span className="text-[8px] font-[1000] text-gray-500 uppercase tracking-widest">Collective Yield</span>
                                      <div className="text-sm font-black text-[#eca840] uppercase tracking-[0.3em] mt-2">
                                        {data.package_qty || '0'} {(data.package_unit || 'Units').toUpperCase()}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  )}

                  {/* Phase 4: Master Inventory Stewardship */}
                  <div className="space-y-10 pt-10 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-2.5 h-2.5 rounded-full bg-[#eca840] shadow-[0_0_15px_rgba(236,168,64,0.6)]"></div>
                         <h4 className="text-[12px] font-[1000] text-gray-900 uppercase tracking-[0.3em]">Inventory & Stewardship</h4>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-[8px] font-black text-[#eca840] uppercase tracking-widest bg-[#eca840]/10 px-3 py-1.5 rounded-full border border-[#eca840]/20">Real-time Vault Sync</span>
                          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Global Ops</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Total Vault availability</label>
                        <div className="relative group">
                          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[#eca840] font-black text-[14px] opacity-40 group-focus-within:opacity-100 transition-opacity tracking-[0.3em]">VAULT</div>
                          <input
                            type="number"
                            value={data.stock}
                            onChange={e => setData('stock', e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-[2.5rem] pl-28 pr-10 py-7 text-3xl font-black tabular-nums text-gray-900 focus:bg-gray-50 focus:ring-[15px] focus:ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all shadow-inner placeholder:text-gray-300"
                            placeholder="0"
                          />
                        </div>
                        {errors.stock && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-2 ml-1">{errors.stock}</p>}
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-4">Total MASTER quantity available across all variants</p>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Listing Visibility status</label>
                        <div className="relative group">
                          <select
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-[2.5rem] pl-10 pr-16 py-7 text-[12px] font-black uppercase tracking-[0.25em] text-[#eca840] focus:bg-gray-50 focus:ring-[15px] focus:ring-[#eca840]/10 focus:border-[#eca840]/30 transition-all appearance-none cursor-pointer shadow-inner"
                          >
                            <option value="in_stock" className="bg-white">Vault Open / In Stock</option>
                            <option value="pre_order" className="bg-white">Queue Entry / Pre-Order</option>
                            <option value="sold_out" className="bg-white">Vault Sealed / Sold Out</option>
                          </select>
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#eca840] group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4 4 4-4" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="pt-12 pb-6">
                    <button
                      type="submit"
                      disabled={processing}
                      className="group relative w-full py-8 bg-[#eca840] text-gray-900 rounded-[2.5rem] font-black text-[14px] uppercase tracking-[0.6em] shadow-[0_20px_50px_-10px_rgba(236,168,64,0.4)] transition-all hover:bg-[#d69635] hover:-translate-y-2 active:translate-y-0 disabled:opacity-50 overflow-hidden"
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer transition-all"></div>
                      <span className="relative z-10">{processing ? 'Engraving Data...' : (editingProduct ? 'Finalize Masterpiece' : 'Commit to vault')}</span>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Update Inventory</h3>
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
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase tracking-widest">Units</span>
                </div>
                {restockForm.errors.quantity && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-2">{restockForm.errors.quantity}</p>}

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
