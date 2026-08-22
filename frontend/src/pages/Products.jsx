import React, { useState, useEffect, useCallback } from 'react';
import { DownloadCloud, UploadCloud, Plus, RefreshCw } from 'lucide-react';

import ProductSummaryCards from '../components/products/ProductSummaryCards';
import ProductIntelligenceBar from '../components/products/ProductIntelligenceBar';
import ProductTable from '../components/products/ProductTable';
import ImportProductsModal from '../components/products/ImportProductsModal';
import { apiClient } from '../services/apiClient';
import { useToast } from '../components/ToastProvider';

const Products = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.getProducts();
      setProducts(data);
    } catch (error) {
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleExport = () => {
    // Generate CSV from products
    if (products.length === 0) {
      addToast('No products to export', 'info');
      return;
    }

    const headers = ['SKU', 'Name', 'Category', 'Brand', 'Status', 'Quality'];
    const csvContent = [
      headers.join(','),
      ...products.map(p => [
        p.sku,
        `"${p.name?.replace(/"/g, '""') || ''}"`,
        p.category,
        p.brand,
        p.status,
        p.quality
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nexora_products_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    mockApi._createActivity?.('Exported Products', `${products.length} products`); // Optional tracking if we expose it
    addToast('Products exported successfully', 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8f9fc] dark:bg-[#1a1f26] animate-fade-in text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">Products</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage, enrich, validate, and organize your entire product catalog.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExport} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#2d333b] rounded-md hover:bg-slate-50 dark:hover:bg-[#2d333b] hover:shadow-sm transition-all"
            >
              <DownloadCloud className="w-4 h-4" /> Export
            </button>
            <button 
              onClick={() => setIsImportModalOpen(true)} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#2d333b] rounded-md hover:bg-slate-50 dark:hover:bg-[#2d333b] hover:shadow-sm transition-all"
            >
              <UploadCloud className="w-4 h-4" /> Import
            </button>
            <button 
              onClick={() => { window.location.hash = '#/products/new'; }} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-600 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <ProductSummaryCards />

        {/* Intelligence Bar */}
        <ProductIntelligenceBar />

        {/* Main Product Table */}
        {loading ? (
          <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] p-16 flex flex-col items-center justify-center min-h-[400px]">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Loading products...</p>
          </div>
        ) : (
          <ProductTable products={products} refreshProducts={fetchProducts} />
        )}

      </div>

      {/* Import Modal */}
      <ImportProductsModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImportSuccess={fetchProducts}
      />
    </div>
  );
};

export default Products;
