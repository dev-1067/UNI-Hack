import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ListChecks, History, CheckCircle2, ArrowRight, 
  Search, Filter, ChevronDown, CheckSquare, BrainCircuit, Play, Check, X, ShieldAlert, ArrowLeftRight, RefreshCw, ThumbsDown, FileText
} from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import { apiClient } from '../services/apiClient';
import { mockApi } from '../services/mock/api';


const AIEnrichment = ({ setActiveView, preselectId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enrichmentStep, setEnrichmentStep] = useState(-1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Functional Options State
  const [tone, setTone] = useState('Professional');
  const [language, setLanguage] = useState('English');
  const [targetChannel, setTargetChannel] = useState('All Channels');
  const [contentOptions, setContentOptions] = useState({
    description: true,
    seoTitle: true,
    attributes: true,
    metaDescription: true,
    bullets: false
  });
  
  // Generated output state
  const [generatedResult, setGeneratedResult] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getProducts();
      const mapped = (data || []).map(p => ({
        id: p.id,
        product: p.name,
        sku: p.sku,
        category: p.category || 'General',
        missing: (p.quality || 0) < 80 ? 'Dimensions, Material' : ((p.quality || 0) < 90 ? 'Descriptions' : 'None'),
        quality: p.quality || 0,
        status: (p.quality || 0) < 90 ? 'Needs Enrichment' : 'Enriched (Ready)',
        statusColor: (p.quality || 0) < 90 
          ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10'
          : 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-500/10'
      })).sort((a, b) => a.quality - b.quality);
      setProducts(mapped);
      
      if (preselectId) {
        const exists = mapped.find(p => String(p.id) === String(preselectId) || String(p.sku) === String(preselectId));
        if (exists) {
          setSelectedProducts([exists.id]);
        }
      }
    } catch (err) {
      addToast("Failed to load products for enrichment.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const unsubscribe = mockApi.subscribe(() => {
      fetchProducts();
    });
    return () => unsubscribe();
  }, [preselectId]);

  const getPreviewText = () => {
    if (previewContent?.description) return previewContent.description;
    const toneMap = {
      Professional: `Engineered for superior performance and reliability, the ${products[0]?.product || 'industrial product'} delivers exceptional quality with durable construction designed for heavy-duty commercial operations.`,
      Engaging: `Elevate your workflow with modern engineering and high-grade materials, offering unmatched reliability and sleek design every day!`,
      Technical: `High-precision industrial component manufactured to strict dimensional tolerances with reinforced structural composition and multi-channel compliance.`
    };
    return toneMap[tone] || toneMap.Professional;
  };

  // Handle the enrichment flow
  const handleStartEnrichment = async () => {
    if (selectedProducts.length === 0) {
      addToast('Please select at least one product.', 'error');
      return;
    }
    setIsModalOpen(true);
    setEnrichmentStep(0);
    addToast(`Starting AI enrichment (${tone} / ${language})...`, 'info');
    
    try {
      const targetId = selectedProducts[0];
      const generated = await apiClient.generateEnrichment({
        productId: targetId,
        tone,
        language,
        channel: targetChannel
      });
      setGeneratedResult(generated);
      setPreviewContent(generated);

      // Smooth progression
      setTimeout(() => setEnrichmentStep(1), 600);
      setTimeout(() => setEnrichmentStep(2), 1200);
      setTimeout(() => setEnrichmentStep(3), 1800);
    } catch (err) {
      addToast('Failed to generate enrichment content', 'error');
      setIsModalOpen(false);
    }
  };

  const handleAcceptEnrichment = async () => {
    try {
      for (const id of selectedProducts) {
        await apiClient.approveEnrichment(id);
      }
      addToast(`Enrichment accepted and applied to ${selectedProducts.length} product(s).`, 'success');
      setIsModalOpen(false);
      await fetchProducts();
    } catch (e) {
      addToast('Failed to save enrichment data.', 'error');
    }
  };

  const handleRejectEnrichment = async () => {
    if (selectedProducts.length > 0) {
      try {
        await apiClient.rejectEnrichment(selectedProducts[0]);
      } catch (e) {
        console.warn("Reject enrichment notice:", e);
      }
    }
    addToast('Enrichment draft rejected. No changes were applied.', 'info');
    setIsModalOpen(false);
  };



  const steps = [
    "Analyzing product catalog specs...",
    `Generating content in ${language} (${tone} tone)...`,
    `Validating attributes for ${targetChannel}...`,
    "Review & Accept Output"
  ];

  const toggleSelect = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase();
    return p.product.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8f9fc] dark:bg-[#1a1f26]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8f9fc] dark:bg-[#1a1f26] animate-fade-in text-slate-800 dark:text-slate-200 relative">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">AI Enrichment</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Transform incomplete product data into rich, channel-ready content with AI.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setActiveView('activity')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-all shadow-sm"
            >
              <History className="w-4 h-4" /> Enrichment History
            </button>
            <button 
              onClick={handleStartEnrichment}
              disabled={selectedProducts.length === 0}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" /> Start Enrichment ({selectedProducts.length})
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Products Enriched</span>
              <BrainCircuit className="w-4 h-4 text-teal-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{products.filter(p => p.quality >= 90).length}</h2>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">↗ +18.4% this month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Enrichment</span>
              <ListChecks className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{products.filter(p => p.quality < 90).length}</h2>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Products waiting</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Success Rate</span>
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">98.8%</h2>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">High confidence</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total in Catalog</span>
              <FileText className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{products.length}</h2>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">SKUs tracked</span>
            </div>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT: Products to Enrich */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm flex flex-col overflow-hidden h-full">
              
              <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2d333b] flex flex-col gap-4 bg-white dark:bg-[#22272e]">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Products to Enrich</h3>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {selectedProducts.length} of {products.length} selected
                  </span>
                </div>
                
                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search products..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={toggleSelectAll}
                      className="px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-100 dark:hover:bg-[#2d333b] transition-colors"
                    >
                      {selectedProducts.length === products.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-[#1c2128] border-b border-slate-100 dark:border-[#2d333b] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="px-4 py-3 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedProducts.length > 0 && selectedProducts.length === products.length} 
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" 
                        />
                      </th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">SKU & Category</th>
                      <th className="px-4 py-3">Missing Data</th>
                      <th className="px-4 py-3">Quality</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#2d333b]">
                    {filteredProducts.map((item) => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-slate-50/50 dark:hover:bg-[#2d333b]/30 transition-colors cursor-pointer ${selectedProducts.includes(item.id) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                        onClick={() => toggleSelect(item.id)}
                      >
                        <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={selectedProducts.includes(item.id)}
                            onChange={() => toggleSelect(item.id)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" 
                          />
                        </td>
                        <td className="px-4 py-4 font-semibold text-sm text-slate-900 dark:text-white">
                          {item.product}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-0.5">{item.sku}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">{item.category}</div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                          {item.missing}
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                          {item.quality}%
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md ${item.statusColor}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => {
                              setSelectedProducts([item.id]);
                              handleStartEnrichment();
                            }}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline"
                          >
                            Enrich
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* RIGHT: NEXORA AI & Settings */}
          <div className="flex flex-col gap-6">
            
            {/* NEXORA AI Card */}
            <div className="bg-white dark:bg-[#22272e] rounded-xl border border-blue-200 dark:border-blue-900/50 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  NEXORA AI
                </h3>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Intelligent Content Enrichment</p>
                
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                  AI analyzes your existing product data, identifies missing or weak attributes, and generates optimized product content tailored to your configured tone & language.
                </p>

                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <Check className="w-4 h-4 text-teal-500 shrink-0" /> Multilingual localized descriptions
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <Check className="w-4 h-4 text-teal-500 shrink-0" /> Configurable brand tone
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <Check className="w-4 h-4 text-teal-500 shrink-0" /> Complete missing dimensions & attributes
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <Check className="w-4 h-4 text-teal-500 shrink-0" /> SEO titles & metadata generation
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#1c2128] rounded-lg p-3 border border-slate-100 dark:border-[#2d333b]">
                  <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span>AI Confidence</span>
                    <span className="text-teal-600 dark:text-teal-400">98.4%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-[#2d333b] rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full w-[98%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrichment Settings */}
            <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Enrichment Settings</h3>
              
              <div className="mb-5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">Content to Generate</label>
                <div className="grid grid-cols-2 gap-y-2">
                  <label className="flex items-center gap-2 cursor-pointer group text-xs font-medium text-slate-700 dark:text-slate-300">
                    <input 
                      type="checkbox" 
                      checked={contentOptions.description} 
                      onChange={(e) => setContentOptions(prev => ({ ...prev, description: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" 
                    />
                    Product Description
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group text-xs font-medium text-slate-700 dark:text-slate-300">
                    <input 
                      type="checkbox" 
                      checked={contentOptions.seoTitle} 
                      onChange={(e) => setContentOptions(prev => ({ ...prev, seoTitle: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" 
                    />
                    SEO Title
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group text-xs font-medium text-slate-700 dark:text-slate-300">
                    <input 
                      type="checkbox" 
                      checked={contentOptions.attributes} 
                      onChange={(e) => setContentOptions(prev => ({ ...prev, attributes: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" 
                    />
                    Missing Attributes
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group text-xs font-medium text-slate-700 dark:text-slate-300">
                    <input 
                      type="checkbox" 
                      checked={contentOptions.metaDescription} 
                      onChange={(e) => setContentOptions(prev => ({ ...prev, metaDescription: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" 
                    />
                    Meta Description
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group text-xs font-medium text-slate-700 dark:text-slate-300">
                    <input 
                      type="checkbox" 
                      checked={contentOptions.bullets} 
                      onChange={(e) => setContentOptions(prev => ({ ...prev, bullets: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" 
                    />
                    Bullet Points
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">Tone</label>
                  <div className="relative">
                    <select 
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 appearance-none focus:outline-none cursor-pointer"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Engaging">Engaging</option>
                      <option value="Technical">Technical</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">Language</label>
                  <div className="relative">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 appearance-none focus:outline-none cursor-pointer"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">Target Channel</label>
                  <div className="relative">
                    <select 
                      value={targetChannel}
                      onChange={(e) => setTargetChannel(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 appearance-none focus:outline-none cursor-pointer"
                    >
                      <option value="All Channels">All Channels</option>
                      <option value="Shopify">Shopify</option>
                      <option value="Amazon">Amazon</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => addToast(`Preview updated: ${tone} tone in ${language}`, 'info')}
                  className="flex-1 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#3d444d] rounded-md hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-colors"
                >
                  Preview Settings
                </button>
                <button 
                  onClick={handleStartEnrichment}
                  disabled={selectedProducts.length === 0}
                  className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" /> Run AI
                </button>
              </div>
            </div>

            {/* Product Enrichment Preview (Before/After) */}
            <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128] flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-blue-500" /> Live Preview ({tone} / {language})
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-2 py-0.5 rounded">
                  {language}
                </span>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="bg-slate-50 dark:bg-[#1c2128] rounded-md border border-slate-200 dark:border-[#3d444d] p-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Original Data</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">"Stainless steel water bottle."</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 px-1.5 py-0.5 rounded font-medium">Missing Specs</span>
                  </div>
                </div>
                
                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-md border border-blue-200 dark:border-blue-900/50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">AI Generated Output</div>
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {previewContent ? previewContent.description : getPreviewText()}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="text-[10px] bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 px-1.5 py-0.5 rounded font-bold border border-teal-200 dark:border-teal-500/30">Tone: {tone}</span>
                    <span className="text-[10px] bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 px-1.5 py-0.5 rounded font-bold border border-teal-200 dark:border-teal-500/30">Lang: {language}</span>
                    <span className="text-[10px] bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 px-1.5 py-0.5 rounded font-bold border border-teal-200 dark:border-teal-500/30">SEO Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent AI Activity */}
            <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Recent AI Activity</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-teal-500 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">AI enriched catalog items</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Tone: {tone} • Lang: {language}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Enrichment Progress & Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1a1f26] rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-[#2d333b] overflow-hidden flex flex-col relative max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128]">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" /> AI Content Enrichment
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center overflow-y-auto">
              {enrichmentStep < 3 ? (
                <div className="flex flex-col items-center justify-center min-h-[260px] text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-100 dark:bg-blue-500/20 rounded-full animate-ping"></div>
                    <div className="relative bg-white dark:bg-[#22272e] p-4 rounded-full border border-blue-200 dark:border-blue-900 shadow-lg">
                      <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-pulse" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Processing {selectedProducts.length} Product{selectedProducts.length > 1 ? 's' : ''}
                  </h4>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
                    Tone: {tone} | Language: {language} | Channel: {targetChannel}
                  </p>
                  <div className="h-6 overflow-hidden relative w-full text-center">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {steps[enrichmentStep]}
                    </p>
                  </div>
                  <div className="w-64 h-2 bg-slate-100 dark:bg-[#2d333b] rounded-full mt-6 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-1000 ease-linear" 
                      style={{ width: `${((enrichmentStep + 1) / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                /* Step 3: Review Generated Content & Accept / Reject */
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2d333b]">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">Review Generated Content</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Review the AI draft before applying to {selectedProducts.length} product(s).</p>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded border border-blue-200 dark:border-blue-800">
                        {language}
                      </span>
                      <span className="text-[10px] font-bold bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 px-2 py-1 rounded border border-teal-200 dark:border-teal-800">
                        {tone}
                      </span>
                    </div>
                  </div>

                  {/* Generated Description */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Generated Description</label>
                    <div className="p-3.5 bg-slate-50 dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#3d444d] text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {generatedResult?.description}
                    </div>
                  </div>

                  {/* Generated SEO Title */}
                  {contentOptions.seoTitle && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Title & Meta</label>
                      <div className="p-3 bg-slate-50 dark:bg-[#22272e] rounded-lg border border-slate-200 dark:border-[#3d444d]">
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">{generatedResult?.seoTitle}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{generatedResult?.seoDescription}</p>
                      </div>
                    </div>
                  )}

                  {/* Bullet points */}
                  {generatedResult?.bullets && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Key Feature Bullets</label>
                      <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {generatedResult.bullets.map((b, idx) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-[#2d333b]">
                    <button 
                      onClick={handleRejectEnrichment}
                      className="px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-colors"
                    >
                      Reject & Discard
                    </button>
                    <button 
                      onClick={handleAcceptEnrichment}
                      className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg shadow-md transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4" /> Accept & Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function FileTextIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

export default AIEnrichment;
