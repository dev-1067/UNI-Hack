import React, { useState, useEffect } from 'react';
import { ChevronRight, Edit2, Sparkles, MoreVertical, CheckCircle2, RefreshCw } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { mockApi } from '../services/mock/api';
import { useToast } from '../components/ToastProvider';
import ProductInfoCard from '../components/products/detail/ProductInfoCard';
import AIEnrichmentCard from '../components/products/detail/AIEnrichmentCard';
import IntelligenceLayer from '../components/products/detail/IntelligenceLayer';
import ChannelReadiness from '../components/products/detail/ChannelReadiness';

const ProductDetail = ({ productId }) => {
  const [saveState, setSaveState] = useState('idle');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getProductById(productId);
        setProduct(data);
      } catch (error) {
        addToast('Failed to load product details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();

    // Subscribe to store updates for automatic reactivity
    const unsubscribe = mockApi.subscribe(() => {
      fetchProduct();
    });

    return () => {
      unsubscribe();
    };
  }, [productId]);

  const navigateBack = () => {
    window.location.hash = '#/products';
  };

  const handleSave = async () => {
    if (saveState !== 'idle' || !product) return;
    setSaveState('loading');
    try {
      await apiClient.updateProduct(productId, product);
      setSaveState('success');
      addToast('Product saved successfully!', 'success');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (err) {
      setSaveState('idle');
      addToast('Failed to save product.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#f8f9fc] dark:bg-[#1a1f26]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9fc] dark:bg-[#1a1f26] animate-fade-in text-slate-800 dark:text-slate-200 transition-colors duration-300 relative">
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
          
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 gap-2 mb-2">
            <button onClick={navigateBack} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              &larr; Back to Products
            </button>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <button onClick={navigateBack} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Products
            </button>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{product.name}</span>
          </div>

          {/* Product Header Card */}
          <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
            <div className="flex items-center gap-6">
              {/* Thumbnail Placeholder */}
              <div className="w-24 h-24 rounded-lg bg-slate-100 dark:bg-[#1c2128] border border-slate-200 dark:border-[#2d333b] flex flex-col items-center justify-center shrink-0">
                <div className="w-6 h-12 border-2 border-slate-400 dark:border-slate-500 rounded-sm relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-3 border-2 border-slate-400 dark:border-slate-500 rounded-t-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{product.name}</h1>
                  <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border flex items-center gap-1 ${
                    product.status === 'Active' 
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" /> {product.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-mono"><span className="text-slate-400 dark:text-slate-500">#</span> SKU: {product.sku}</span>
                  <span className="flex items-center gap-1.5"><span className="text-slate-400 dark:text-slate-500">Brand:</span> {product.brand || 'Nexora'}</span>
                  <span className="flex items-center gap-1.5"><span className="text-slate-400 dark:text-slate-500">Category:</span> {product.category || 'General'}</span>
                  <span className="flex items-center gap-1.5"><span className="text-slate-400 dark:text-slate-500">Quality:</span> <strong className="text-blue-600 dark:text-blue-400">{product.quality || 70}%</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button 
                onClick={() => window.location.hash = '#/products/edit/' + product.id}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-colors shadow-sm"
              >
                <Edit2 className="w-4 h-4" /> Edit Product
              </button>
              <button 
                onClick={() => window.location.hash = '#/enrichment/' + product.id}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" /> AI Enrich
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-[#2d333b] transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Product Info & AI) */}
            <div className="lg:col-span-2 space-y-6">
              <ProductInfoCard product={product} />
              <AIEnrichmentCard product={product} onProductUpdated={(updated) => setProduct(updated)} />
            </div>

            {/* Right Column (Intelligence & Channels) */}
            <div className="space-y-6">
              <IntelligenceLayer product={product} />
              <ChannelReadiness product={product} />
            </div>

          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#1a1f26]/80 backdrop-blur-md border-t border-slate-200 dark:border-[#2d333b] flex justify-end gap-3 z-40">
        <button 
          onClick={navigateBack}
          className="px-6 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#3d444d] rounded-md hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={saveState !== 'idle'}
          className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-all min-w-[140px] disabled:opacity-80"
        >
          {saveState === 'idle' && 'Save Changes'}
          {saveState === 'loading' && <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>}
          {saveState === 'success' && <><CheckCircle2 className="w-4 h-4" /> Saved</>}
        </button>
      </div>

    </div>
  );
};

export default ProductDetail;
