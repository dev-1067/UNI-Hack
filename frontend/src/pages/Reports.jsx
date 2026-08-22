import React, { useState, useEffect } from 'react';
import { 
  DownloadCloud, Calendar, ClipboardList, Shield, BrainCircuit, CheckSquare, 
  ChevronDown, ArrowUp, ArrowDown, ShoppingCart, Store, Globe, Network,
  AlertTriangle, FileText, CheckCircle, RefreshCw, BarChart2, ChevronRight, Sparkles
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { useToast } from '../components/ToastProvider';

const Reports = ({ setActiveView, user }) => {
  // Local State
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('Product Quality');
  const [selectedCustomRange, setSelectedCustomRange] = useState('Last 30 Days');
  
  const [exportState, setExportState] = useState('idle'); // idle, loading, success
  const [generateState, setGenerateState] = useState('idle'); // idle, loading, success
  const [recentReports, setRecentReports] = useState([]);
  const [products, setProducts] = useState([]);
  const [qualityIssues, setQualityIssues] = useState([]);
  const [dashMetrics, setDashMetrics] = useState({
    totalProducts: 0,
    avgQuality: 0,
    enrichedCount: 0,
    pendingEnrichment: 0
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportsData, productsData, issuesData, metricsData] = await Promise.all([
        apiClient.getReports(),
        apiClient.getProducts(),
        apiClient.getQualityIssues(),
        apiClient.getDashboardMetrics()
      ]);
      setRecentReports((reportsData?.reports || []).map(r => ({ ...r, by: r.by || user?.name || 'Aarav Sharma' })));
      setProducts(productsData || []);
      setQualityIssues(issuesData || []);
      setDashMetrics(metricsData || {
        totalProducts: 0,
        avgQuality: 0,
        enrichedCount: 0,
        pendingEnrichment: 0
      });
    } catch (err) {
      addToast('Failed to load reports data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  
  // Handlers
  const handleExport = async (type = 'catalog') => {
    setExportState('loading');
    addToast('Generating and exporting report CSV...', 'info');
    try {
      const res = await apiClient.exportReportCsv(type, dateRange);
      setExportState('success');
      addToast(`Report downloaded: ${res.filename}`, 'success');
      setTimeout(() => setExportState('idle'), 3000);
    } catch (err) {
      setExportState('idle');
      addToast('Failed to export report.', 'error');
    }
  };

  const handleGenerateReport = async () => {
    setGenerateState('loading');
    addToast('Generating custom report...', 'info');
    try {
      const reportName = `${selectedReportType} Audit - ${selectedCustomRange}`;
      const res = await apiClient.exportReportCsv(selectedReportType, selectedCustomRange);
      setGenerateState('success');
      addToast(`Custom report "${reportName}" generated and downloaded.`, 'success');
      await loadData();
      setTimeout(() => setGenerateState('idle'), 3000);
    } catch (err) {
      setGenerateState('idle');
      addToast('Failed to generate report.', 'error');
    }
  };

  // Dynamic calculations from current centralized store
  const totalCount = products.length;
  const healthScore = dashMetrics.avgQuality;
  const enrichedCount = products.filter(p => (p.quality || 0) >= 90).length;
  const channelReadyCount = products.filter(p => (p.quality || 0) >= 80).length;
  const needsReviewCount = products.filter(p => (p.quality || 0) < 90 && (p.quality || 0) >= 70).length;
  const criticalCount = products.filter(p => (p.quality || 0) < 70).length;

  // Channel readiness dynamic counts
  const shopifyReady = products.filter(p => (p.quality || 0) >= 85).length;
  const shopifyPercent = totalCount > 0 ? Math.round((shopifyReady / totalCount) * 100) : 92;
  
  const amazonReady = products.filter(p => (p.quality || 0) >= 88).length;
  const amazonPercent = totalCount > 0 ? Math.round((amazonReady / totalCount) * 100) : 86;
  
  const googleReady = products.filter(p => (p.quality || 0) >= 80).length;
  const googlePercent = totalCount > 0 ? Math.round((googleReady / totalCount) * 100) : 81;
  
  const salesforceReady = products.filter(p => (p.quality || 0) >= 85).length;
  const salesforcePercent = totalCount > 0 ? Math.round((salesforceReady / totalCount) * 100) : 88;

  // Mock Trend Chart Data dynamically scaled
  const chartData = [
    { label: 'Week 1', completeness: `${Math.max(60, healthScore - 12)}%`, accuracy: `${Math.max(65, healthScore - 10)}%` },
    { label: 'Week 2', completeness: `${Math.max(68, healthScore - 8)}%`, accuracy: `${Math.max(70, healthScore - 6)}%` },
    { label: 'Week 3', completeness: `${Math.max(75, healthScore - 4)}%`, accuracy: `${Math.max(78, healthScore - 3)}%` },
    { label: 'Week 4', completeness: `${healthScore}%`, accuracy: `${Math.min(100, healthScore + 2)}%` },
  ];

  // Map issues for table
  const mappedIssues = qualityIssues.length > 0 ? qualityIssues.map(q => ({
    id: q.id,
    issue: `${q.issue} (${q.attribute || 'Attribute'})`,
    products: q.product,
    severity: q.severity === 'high' ? 'High' : q.severity === 'medium' ? 'Medium' : 'Low',
    trend: q.severity === 'high' ? '↑ 8%' : '↓ 4%',
    action: 'Review'
  })) : [
    { id: 1, issue: 'Missing Attributes', products: 'Ergonomic Office Chair', severity: 'High', trend: '↑ 12%', action: 'Review' },
    { id: 2, issue: 'Invalid Format', products: 'Wireless Charging Pad', severity: 'Medium', trend: '↓ 4%', action: 'Review' }
  ];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8f9fc] dark:bg-[#1a1f26]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8f9fc] dark:bg-[#1a1f26] animate-fade-in text-slate-800 dark:text-slate-200">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Reports</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track product data performance, quality trends, enrichment activity, and channel readiness.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Date Range Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-all"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                {dateRange}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {isDateRangeOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#3d444d] rounded-lg shadow-xl overflow-hidden z-20">
                  {['Last 7 days', 'Last 30 days', 'Last 90 days', 'This year'].map(range => (
                    <button 
                      key={range}
                      onClick={() => { setDateRange(range); setIsDateRangeOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2d333b]"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Export Button */}
            <button 
              onClick={() => handleExport('catalog')}
              disabled={exportState !== 'idle'}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all min-w-[140px]"
            >
              {exportState === 'idle' && <><DownloadCloud className="w-4 h-4" /> Export Report</>}
              {exportState === 'loading' && <><RefreshCw className="w-4 h-4 animate-spin" /> Exporting...</>}
              {exportState === 'success' && <><CheckCircle className="w-4 h-4" /> Exported</>}
            </button>
          </div>
        </div>

        {/* 1. Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TOTAL PRODUCTS */}
          <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">TOTAL PRODUCTS</p>
              <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400 opacity-70" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{totalCount.toLocaleString()}</h3>
            </div>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ArrowUp className="w-3 h-3" /> <span>+12.4% this month</span>
            </div>
          </div>

          {/* DATA QUALITY */}
          <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-blue-200 dark:border-blue-900/50 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">DATA QUALITY</p>
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 opacity-70" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{healthScore}%</h3>
            </div>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ArrowUp className="w-3 h-3" /> <span>+2.1% improvement</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500"></div>
          </div>

          {/* AI ENRICHED */}
          <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">AI ENRICHED</p>
              <BrainCircuit className="w-4 h-4 text-teal-600 dark:text-teal-400 opacity-70" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{enrichedCount.toLocaleString()}</h3>
            </div>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ArrowUp className="w-3 h-3" /> <span>+18.6% this month</span>
            </div>
          </div>

          {/* CHANNEL READY */}
          <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">CHANNEL READY</p>
              <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 opacity-70" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{channelReadyCount.toLocaleString()}</h3>
            </div>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ArrowUp className="w-3 h-3" /> <span>+8.4% this month</span>
            </div>
          </div>
        </div>

        {/* 2. Charts Row (Quality Trend & AI Enrichment Performance) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quality Trend (Col span 2) */}
          <div className="lg:col-span-2 bg-white dark:bg-[#22272e] p-6 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Product Data Quality</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Quality score over the last 30 days</p>
              </div>
              <button onClick={() => setActiveView('quality')} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Chart Area */}
            <div className="flex-1 flex flex-col justify-end relative h-64 border-l border-b border-slate-100 dark:border-[#2d333b] pl-2 pb-2">
              <div className="absolute left-[-32px] top-0 bottom-8 flex flex-col justify-between text-[10px] font-medium text-slate-400">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              <div className="absolute inset-0 left-0 bottom-8 flex flex-col justify-between pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-slate-100/50 dark:border-[#2d333b]/50"></div>
                ))}
              </div>

              {/* Bars representing Completeness & Accuracy */}
              <div className="flex justify-between items-end h-[calc(100%-32px)] w-full px-4 gap-4 z-10">
                {chartData.map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    <div className="w-full flex gap-1 items-end h-full justify-center">
                      {/* Completeness Bar */}
                      <div 
                        className={`w-1/3 bg-blue-400 dark:bg-blue-600 hover:opacity-90 transition-all duration-500 rounded-t-sm`}
                        style={{ height: data.completeness }}
                        title={`Completeness: ${data.completeness}`}
                      ></div>
                      {/* Accuracy Bar */}
                      <div 
                        className={`w-1/3 bg-indigo-400 dark:bg-indigo-500 hover:opacity-90 transition-all duration-500 rounded-t-sm`}
                        style={{ height: data.accuracy }}
                        title={`Accuracy: ${data.accuracy}`}
                      ></div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 mt-3 absolute -bottom-7">{data.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-6 mt-8 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-400 dark:bg-blue-600"></div> Completeness</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-indigo-400 dark:bg-indigo-500"></div> Accuracy</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-teal-400 dark:bg-teal-500"></div> Overall Health ({healthScore}%)</div>
            </div>
          </div>

          {/* AI Enrichment Performance (Col span 1) */}
          <div className="bg-white dark:bg-[#22272e] p-6 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Enrichment Performance</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Processing pipeline metrics</p>
            
            {/* Main stat */}
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Products Processed</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalCount.toLocaleString()}</p>
            </div>

            {/* Breakdowns */}
            <div className="space-y-4 mb-8 flex-1">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Successfully Enriched</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{enrichedCount}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-[#1c2128] rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${totalCount > 0 ? (enrichedCount / totalCount) * 100 : 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Needs Review</span>
                  <span className="font-bold text-amber-500">{needsReviewCount}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-[#1c2128] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${totalCount > 0 ? (needsReviewCount / totalCount) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Low Quality / Critical</span>
                  <span className="font-bold text-red-500">{criticalCount}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-[#1c2128] rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${totalCount > 0 ? (criticalCount / totalCount) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">Average AI Confidence</p>
              </div>
              <p className="text-xl font-black text-indigo-700 dark:text-indigo-400">98.4%</p>
            </div>
          </div>
        </div>

        {/* 3. Channel Readiness */}
        <div className="bg-white dark:bg-[#22272e] p-6 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Channel Readiness</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Product readiness across connected commerce channels.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            
            <ChannelCard 
              name="Shopify" 
              icon={ShoppingCart} 
              color="text-green-600 bg-green-100 dark:bg-green-500/20 dark:text-green-400"
              readyPercent={shopifyPercent}
              readyCount={shopifyReady}
              attentionCount={Math.max(0, totalCount - shopifyReady)}
            />
            
            <ChannelCard 
              name="Amazon" 
              icon={Store} 
              color="text-amber-600 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-400"
              readyPercent={amazonPercent}
              readyCount={amazonReady}
              attentionCount={Math.max(0, totalCount - amazonReady)}
            />
            
            <ChannelCard 
              name="Google Merchant Center" 
              icon={Globe} 
              color="text-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400"
              readyPercent={googlePercent}
              readyCount={googleReady}
              attentionCount={Math.max(0, totalCount - googleReady)}
            />

            <ChannelCard 
              name="Salesforce Commerce" 
              icon={Network} 
              color="text-blue-600 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400"
              readyPercent={salesforcePercent}
              readyCount={salesforceReady}
              attentionCount={Math.max(0, totalCount - salesforceReady)}
            />
            
          </div>
        </div>

        {/* 4. Bottom Row: Data Quality Issues & AI Impact */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Top Data Quality Issues Table */}
          <div className="xl:col-span-2 bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2d333b] flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Data Quality Issues</h3>
              <button onClick={() => setActiveView('quality')} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800">
                View All in Quality
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-[#1c2128] border-b border-slate-100 dark:border-[#2d333b] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3">Issue</th>
                    <th className="px-6 py-3">Target Product</th>
                    <th className="px-6 py-3">Severity</th>
                    <th className="px-6 py-3">Trend</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#2d333b]">
                  {mappedIssues.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-[#2d333b]/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-sm text-slate-900 dark:text-white">{item.issue}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{item.products}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md border ${
                          item.severity === 'High' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
                          item.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                          'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                        }`}>
                          {item.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <span className={item.trend.includes('↑') ? (item.severity === 'High' ? 'text-red-500' : 'text-amber-500') : 'text-teal-500'}>
                          {item.trend}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setActiveView('quality')} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:underline">
                          {item.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Impact Report */}
          <div className="bg-gradient-to-b from-[#1c2128] to-[#12151a] rounded-xl border border-[#2d333b] shadow-lg p-6 relative overflow-hidden group flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">AI Impact</h3>
              </div>
              <p className="text-sm text-slate-400 font-medium mb-8">How AI enrichment is improving your catalog.</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg font-bold text-sm border border-blue-500/30 shrink-0">+24%</div>
                  <p className="text-sm text-slate-300 font-medium pt-1">Product description completeness</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-teal-500/20 text-teal-400 px-3 py-1.5 rounded-lg font-bold text-sm border border-teal-500/30 shrink-0">+18%</div>
                  <p className="text-sm text-slate-300 font-medium pt-1">Attribute coverage</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg font-bold text-sm border border-purple-500/30 shrink-0">+31%</div>
                  <p className="text-sm text-slate-300 font-medium pt-1">SEO content quality</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg font-bold text-sm border border-indigo-500/30 shrink-0">+14%</div>
                  <p className="text-sm text-slate-300 font-medium pt-1">Channel readiness</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Reporting Utilities */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Generate Custom Report */}
          <div className="bg-white dark:bg-[#22272e] p-6 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Generate Custom Report</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Create and immediately download a report based on current product catalog data.</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Report Type</label>
                  <select 
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    <option>Product Quality</option>
                    <option>AI Enrichment</option>
                    <option>Channel Readiness</option>
                    <option>Catalog Performance</option>
                    <option>Custom</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Date Range</label>
                  <select 
                    value={selectedCustomRange}
                    onChange={(e) => setSelectedCustomRange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Format</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input type="radio" name="format" defaultChecked className="text-blue-600 focus:ring-blue-500" /> CSV (Download immediately)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input type="radio" name="format" className="text-blue-600 focus:ring-blue-500" /> PDF
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input type="radio" name="format" className="text-blue-600 focus:ring-blue-500" /> Excel
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleGenerateReport}
                  disabled={generateState !== 'idle'}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-2 min-w-[170px]"
                >
                  {generateState === 'idle' && <><BarChart2 className="w-4 h-4" /> Generate & Export</>}
                  {generateState === 'loading' && <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</>}
                  {generateState === 'success' && <><CheckCircle className="w-4 h-4" /> Downloaded</>}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2d333b]">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Reports</h3>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-[#1c2128] border-b border-slate-100 dark:border-[#2d333b] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3">Report Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Generated By</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#2d333b]">
                  {recentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/50 dark:hover:bg-[#2d333b]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">{report.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{report.type}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{report.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{report.by}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20">
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleExport(report.type)} 
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:underline flex items-center gap-1 ml-auto"
                        >
                          <DownloadCloud className="w-3.5 h-3.5" /> CSV
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Subcomponent for Channel Readiness Cards
const ChannelCard = ({ name, icon: Icon, color, readyPercent, readyCount, attentionCount }) => (
  <div className="p-5 rounded-xl border border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128]">
    <div className="flex justify-between items-center mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-lg font-bold text-slate-900 dark:text-white">{readyPercent}% Ready</span>
    </div>
    
    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">{name}</h4>
    
    <div className="w-full h-2 bg-slate-200 dark:bg-[#2d333b] rounded-full overflow-hidden mb-3">
      <div 
        className={`h-full rounded-full ${readyPercent > 90 ? 'bg-teal-500' : readyPercent > 85 ? 'bg-blue-500' : 'bg-amber-500'}`} 
        style={{ width: `${Math.min(100, Math.max(5, readyPercent))}%` }}
      ></div>
    </div>
    
    <div className="flex justify-between text-xs">
      <span className="text-slate-600 dark:text-slate-400"><span className="font-bold text-slate-900 dark:text-white">{readyCount}</span> ready</span>
      <span className="text-slate-500 dark:text-slate-500"><span className="font-bold text-amber-500">{attentionCount}</span> attention</span>
    </div>
  </div>
);

export default Reports;
