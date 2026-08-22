import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Check, MoreHorizontal, Package, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { useToast } from '../ToastProvider';
import { apiClient } from '../../services/apiClient';
import { mockApi } from '../../services/mock/api';

const QualityBadge = ({ status }) => {
  let styles = 'bg-slate-100 text-slate-700 dark:bg-[#1c2128] dark:text-slate-400 border-slate-200 dark:border-[#2d333b]';
  if (status >= 90) styles = 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20';
  else if (status >= 70) styles = 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
  else if (status > 0) styles = 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20';

  let text = 'N/A';
  if (status >= 90) text = 'Excellent';
  else if (status >= 70) text = 'Good';
  else if (status > 0) text = 'Needs Attention';

  return <span className={`px-2 py-1 text-[11px] font-bold uppercase tracking-wide rounded border ${styles}`}>{text} ({status}%)</span>;
};

const ChannelStatus = ({ status }) => {
  let dotClass = 'bg-slate-400';
  let textClass = 'text-slate-600 dark:text-slate-400';
  
  if (status === 'Ready') {
    dotClass = 'bg-teal-500';
    textClass = 'text-teal-700 dark:text-teal-400 font-medium';
  }
  if (status === 'Partially Ready') {
    dotClass = 'bg-blue-500';
    textClass = 'text-blue-700 dark:text-blue-400 font-medium';
  }
  if (status === 'Not Ready') {
    dotClass = 'bg-red-500';
    textClass = 'text-red-700 dark:text-red-400 font-medium';
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></div>
      <span className={`text-xs ${textClass}`}>{status || 'Unknown'}</span>
    </div>
  );
};

const ProductTable = ({ products = [], refreshProducts }) => {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const itemsPerPage = 8;

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q));
      
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        // Handle undefined/null
        if (aVal === undefined || aVal === null) aVal = '';
        if (bVal === undefined || bVal === null) bVal = '';

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, selectedStatus, sortConfig]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Selection Logic
  const toggleSelection = (id, e) => {
    e.stopPropagation();
    const newSet = new Set(selectedProducts);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedProducts(newSet);
  };

  const toggleAll = (e) => {
    e.stopPropagation();
    if (selectedProducts.size === paginatedProducts.length && paginatedProducts.length > 0) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map(p => p.sku)));
    }
  };

  const navigateToDetail = (sku) => {
    window.location.hash = `#/products/${sku}`;
  };

  const navigateToEdit = (sku) => {
    window.location.hash = `#/products/edit/${sku}`;
  };

  const handleDelete = async (sku) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.deleteProduct(sku);
        addToast('Product deleted successfully.', 'success');
        if (refreshProducts) refreshProducts();
      } catch (err) {
        addToast('Failed to delete product.', 'error');
      }
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 inline" /> : <ArrowDown className="w-3 h-3 ml-1 inline" />;
  };

  return (
    <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden transition-colors duration-300 flex flex-col">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 dark:border-[#2d333b] flex flex-col md:flex-row gap-4 justify-between items-center transition-colors">
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, sku, category..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#2d333b] text-sm rounded-md py-2 pl-9 pr-4 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors dark:text-white"
          />
        </div>
        
        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-slate-200 dark:border-[#2d333b] rounded-md bg-white dark:bg-[#22272e] hover:bg-slate-50 dark:hover:bg-[#2d333b]/80 transition-colors">
              <span className="text-slate-500 dark:text-slate-400">Category:</span>
              <span className="text-slate-800 dark:text-slate-200">{selectedCategory}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#2d333b] rounded-md shadow-lg hidden group-hover:block z-20">
              {['All', 'Hydration', 'Safety Gear', 'Apparel', 'Electronics', 'Lighting', 'Power Tools'].map(cat => (
                <div key={cat} onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }} className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2d333b] cursor-pointer">
                  {cat}
                </div>
              ))}
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-slate-200 dark:border-[#2d333b] rounded-md bg-white dark:bg-[#22272e] hover:bg-slate-50 dark:hover:bg-[#2d333b]/80 transition-colors">
              <span className="text-slate-500 dark:text-slate-400">Status:</span>
              <span className="text-slate-800 dark:text-slate-200">{selectedStatus}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#2d333b] rounded-md shadow-lg hidden group-hover:block z-20">
              {['All', 'Active', 'Review', 'Draft', 'Archived'].map(st => (
                <div key={st} onClick={() => { setSelectedStatus(st); setCurrentPage(1); }} className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2d333b] cursor-pointer">
                  {st}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => { setSelectedCategory('All'); setSelectedStatus('All'); setSearchQuery(''); setCurrentPage(1); }} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-slate-200 dark:border-[#2d333b] rounded-md bg-white dark:bg-[#22272e] hover:bg-slate-50 dark:hover:bg-[#2d333b]/80 transition-colors text-slate-700 dark:text-slate-300">
            <RefreshCw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedProducts.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-500/10 border-b border-blue-200 dark:border-blue-500/20 px-4 py-3 flex items-center justify-between animate-fade-in">
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
            {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#22272e] border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded shadow-sm">
              Enrich with AI
            </button>
            <button className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#22272e] border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded shadow-sm">
              Validate
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-[#1c2128] border-b border-slate-100 dark:border-[#2d333b] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="px-4 py-3 w-10">
                <div 
                  onClick={toggleAll}
                  className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${selectedProducts.size > 0 && selectedProducts.size === paginatedProducts.length ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-[#1c2128] border-slate-300 dark:border-slate-600'}`}
                >
                  {selectedProducts.size > 0 && selectedProducts.size === paginatedProducts.length && <Check className="w-3 h-3 text-white" />}
                </div>
              </th>
              <th className="px-4 py-3 font-semibold cursor-pointer hover:text-slate-700 dark:hover:text-slate-300" onClick={() => handleSort('name')}>
                Product {renderSortIcon('name')}
              </th>
              <th className="px-4 py-3 font-semibold cursor-pointer hover:text-slate-700 dark:hover:text-slate-300" onClick={() => handleSort('sku')}>
                SKU {renderSortIcon('sku')}
              </th>
              <th className="px-4 py-3 font-semibold cursor-pointer hover:text-slate-700 dark:hover:text-slate-300" onClick={() => handleSort('category')}>
                Category {renderSortIcon('category')}
              </th>
              <th className="px-4 py-3 font-semibold cursor-pointer hover:text-slate-700 dark:hover:text-slate-300" onClick={() => handleSort('status')}>
                Status {renderSortIcon('status')}
              </th>
              <th className="px-4 py-3 font-semibold cursor-pointer hover:text-slate-700 dark:hover:text-slate-300" onClick={() => handleSort('quality')}>
                Data Quality {renderSortIcon('quality')}
              </th>
              <th className="px-4 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#2d333b]">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((item) => (
                <tr 
                  key={item.sku} 
                  onClick={() => navigateToDetail(item.sku)}
                  className="hover:bg-slate-50/50 dark:hover:bg-[#2d333b]/30 transition-colors group cursor-pointer"
                >
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <div 
                      onClick={(e) => toggleSelection(item.sku, e)}
                      className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${selectedProducts.has(item.sku) ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-[#1c2128] border-slate-300 dark:border-slate-600'}`}
                    >
                      {selectedProducts.has(item.sku) && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-[#1c2128] flex items-center justify-center shrink-0 border border-slate-200 dark:border-[#2d333b] text-slate-400 dark:text-slate-500">
                        <Package className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">{item.sku}</td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">{item.category}</td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">{item.status || 'Draft'}</td>
                  <td className="px-4 py-4"><QualityBadge status={item.quality} /></td>
                  <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="relative group/menu inline-block text-left">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-[#2d333b] transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#2d333b] rounded-md shadow-lg hidden group-hover/menu:block z-20 overflow-hidden">
                        <button onClick={() => navigateToDetail(item.sku)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2d333b]">View Product</button>
                        <button onClick={() => navigateToEdit(item.sku)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2d333b]">Edit Product</button>
                        <button onClick={() => addToast('Duplicate workflow coming soon', 'info')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2d333b]">Duplicate</button>
                        <div className="border-t border-slate-100 dark:border-[#2d333b] my-1"></div>
                        <button onClick={() => handleDelete(item.sku)} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">Delete</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No products found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 0 && (
        <div className="px-6 py-4 border-t border-slate-100 dark:border-[#2d333b] bg-white dark:bg-[#22272e] flex flex-col md:flex-row gap-3 items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.min(filteredProducts.length, (currentPage - 1) * itemsPerPage + 1)}</span>–
            <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredProducts.length}</span> products
          </span>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2d333b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="text-xs font-semibold mr-1">Prev</span>
              <ChevronLeft className="w-4 h-4 hidden" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  currentPage === i + 1 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2d333b]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2d333b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="text-xs font-semibold ml-1">Next</span>
              <ChevronRight className="w-4 h-4 hidden" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
