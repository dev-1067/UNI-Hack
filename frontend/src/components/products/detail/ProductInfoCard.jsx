import React from 'react';
import { Edit2, FileText } from 'lucide-react';

const ProductInfoCard = ({ product }) => {
  const pName = product?.name || 'Product Title';
  const pDesc = product?.description || 'Standard product specification and detailed catalog description.';
  const pBrand = product?.brand || 'Nexora';
  const pCategory = product?.category || 'General';
  const pPrice = product?.price || '$0.00';
  const pStock = product?.stock !== undefined ? product.stock : 100;
  const pQuality = product?.quality || 70;

  return (
    <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-[#2d333b] flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-400" />
          Product Information
        </h3>
        <button 
          onClick={() => { if (product?.id) window.location.hash = `#/products/edit/${product.id}`; }}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <Edit2 className="w-4 h-4" /> Edit Attributes
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Basic Information */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Product Title</p>
              <p className="text-base text-slate-900 dark:text-white font-medium">{pName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Short Description</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{pDesc}</p>
            </div>
          </div>
        </div>

        {/* Product Attributes */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Product Attributes</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Category</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{pCategory}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Brand</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{pBrand}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Pricing & Stock</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-900 dark:text-white font-medium">{pPrice} • {pStock} in stock</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Data Quality</p>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{pQuality}% Verified</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Status</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{product?.status || 'Active'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Channel Readiness</p>
              <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">{product?.readiness || Math.min(100, pQuality + 5)}%</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Key Attributes & Tags</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md">
              Category: {pCategory}
            </span>
            <span className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md">
              Brand: {pBrand}
            </span>
            <span className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md">
              Status: {product?.status || 'Active'}
            </span>
            <span className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md">
              Quality: {pQuality}%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductInfoCard;
