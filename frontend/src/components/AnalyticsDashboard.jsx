import React, { useState, useEffect, useCallback } from 'react';
import { 
  DownloadCloud, Plus, ClipboardList, Shield, BrainCircuit, CheckSquare, 
  AlertTriangle, Wrench, Sparkles, AlertCircle, ChevronRight, Filter, RefreshCw
} from 'lucide-react';
import { useToast } from './ToastProvider';
import { apiClient } from '../services/apiClient';
import { mockApi } from '../services/mock/api';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
};

const AnalyticsDashboard = ({ setActiveView, mockUser }) => {
  const [timeRange, setTimeRange] = useState('30'); 
  const [loading, setLoading] = useState(true);
  const [dashMetrics, setDashMetrics] = useState({
    totalProducts: 0,
    avgQuality: 0,
    enrichedCount: 0,
    pendingEnrichment: 0,
    issuesCount: 0
  });
  const [attentionList, setAttentionList] = useState([]);
  const [chartBars, setChartBars] = useState([]);
  
  const firstName = mockUser?.name?.split(' ')[0] || 'User';
  const { addToast } = useToast();

  const fetchDashboardData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [metricsData, attentionData, chartData] = await Promise.all([
        apiClient.getDashboardMetrics(),
        apiClient.getProductsNeedingAttention(),
        apiClient.getDashboardChartData()
      ]);
      setDashMetrics(metricsData || {
        totalProducts: 0,
        avgQuality: 0,
        enrichedCount: 0,
        pendingEnrichment: 0,
        issuesCount: 0
      });
      setAttentionList(attentionData || []);
      setChartBars(chartData || []);
    } catch (error) {
      if (isInitial) addToast('Failed to load dashboard data', 'error');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDashboardData(true);

    // Subscribe to store updates for automatic reactivity
    const unsubscribe = mockApi.subscribe(() => {
      fetchDashboardData(false);
    });

    return () => {
      unsubscribe();
    };
  }, [fetchDashboardData]);

  // Dynamic KPI Metrics
  const metrics = [
    { id: 1, title: 'TOTAL PRODUCTS', value: (dashMetrics.totalProducts || 0).toLocaleString(), subtitle: 'In Catalog', icon: ClipboardList, color: 'text-blue-600 dark:text-blue-400', positive: true },
    { id: 2, title: 'DATA QUALITY', value: `${dashMetrics.avgQuality || 0}%`, subtitle: 'Overall Health', icon: Shield, color: 'text-blue-600 dark:text-blue-400', highlight: true },
    { id: 3, title: 'AI ENRICHED', value: (dashMetrics.enrichedCount || 0).toLocaleString(), subtitle: 'High Quality SKUs', icon: BrainCircuit, color: 'text-teal-600 dark:text-teal-400' },
    { id: 4, title: 'PENDING ENRICHMENT', value: (dashMetrics.pendingEnrichment || 0).toLocaleString(), subtitle: 'Needs Attention', icon: CheckSquare, color: 'text-amber-600 dark:text-amber-400' },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8f9fc] dark:bg-[#1a1f26]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  const isChartEmpty = chartBars.length === 0 || (dashMetrics.totalProducts || 0) === 0 || chartBars.every(d => (d.complete || 0) + (d.review || 0) + (d.missing || 0) + (d.quality || 0) === 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8f9fc] dark:bg-[#1a1f26] animate-fade-in text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">{getGreeting()}, {firstName} <span className="inline-block">👋</span></h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your product data today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => addToast('Import Data workflow coming soon', 'info')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#2d333b] rounded-md hover:bg-slate-50 dark:hover:bg-[#2d333b] hover:shadow-sm transition-all">
              <DownloadCloud className="w-4 h-4" /> Import Data
            </button>
            <button onClick={() => setActiveView('products')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-600 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 shadow-sm hover:shadow transition-all">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">
                  {metric.title}
                </p>
                <metric.icon className={`w-4 h-4 ${metric.color} opacity-70`} />
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</h3>
                {metric.subtitle && !metric.highlight && (
                  <span className={`text-xs font-semibold ${metric.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {metric.subtitle}
                  </span>
                )}
              </div>
              {metric.highlight && (
                <div className="mt-2 w-full flex items-center gap-2">
                  <div className="h-1 flex-1 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-700" style={{ width: `${dashMetrics.avgQuality}%` }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{metric.subtitle}</span>
                </div>
              )}
              {/* Subtle bottom border accent for the highlight card */}
              {metric.highlight && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500"></div>}
            </div>
          ))}
        </div>

        {/* Main Content: Chart & Insights Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white dark:bg-[#22272e] p-6 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Product Data Health</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Quality index over the last 7 days ({dashMetrics.avgQuality || 0}% current)</p>
              </div>
              <button onClick={() => setActiveView('quality')} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Chart Area */}
            <div className="flex-1 flex flex-col justify-end relative h-64 border-l border-b border-slate-100 dark:border-[#2d333b] pl-2 pb-2">
              {/* Y-axis labels */}
              <div className="absolute left-[-32px] top-0 bottom-8 flex flex-col justify-between text-[10px] font-medium text-slate-400">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 left-0 bottom-8 flex flex-col justify-between pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-slate-100/50 dark:border-[#2d333b]/50"></div>
                ))}
              </div>

              {/* Dynamic Plotted Bars */}
              {isChartEmpty ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">No product data available yet</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Add a product to start charting catalog health trends.</p>
                </div>
              ) : (
                <div className="flex justify-between items-end h-[calc(100%-32px)] w-full px-3 gap-3 z-10">
                  {chartBars.map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      
                      {/* Stacked Bar container with explicit height */}
                      <div 
                        className="w-full max-w-[48px] rounded-t-md overflow-hidden flex flex-col justify-end shadow-sm group-hover:opacity-95 transition-all duration-500 cursor-pointer"
                        style={{ height: `${Math.max(8, data.totalHeight || data.avgQuality || 20)}%` }}
                        title={`${data.label} — Complete: ${data.complete}%, Review: ${data.review}%, Missing: ${data.missing}%`}
                      >
                        {/* Complete Segment (Blue) */}
                        <div 
                          className="w-full bg-blue-600 dark:bg-blue-500 transition-all duration-500" 
                          style={{ height: `${Math.max(15, (data.complete / ((data.complete + data.review + data.missing) || 100)) * 100)}%` }} 
                        />
                        {/* Needs Review Segment (Light Blue) */}
                        <div 
                          className="w-full bg-blue-300 dark:bg-blue-800 transition-all duration-500" 
                          style={{ height: `${Math.max(10, (data.review / ((data.complete + data.review + data.missing) || 100)) * 100)}%` }} 
                        />
                        {/* Missing Data Segment (Red/Amber) */}
                        {data.missing > 0 && (
                          <div 
                            className="w-full bg-red-400 dark:bg-red-500 transition-all duration-500" 
                            style={{ height: `${Math.max(10, (data.missing / ((data.complete + data.review + data.missing) || 100)) * 100)}%` }} 
                          />
                        )}
                      </div>
                      
                      <span className="text-[10px] font-medium text-slate-400 mt-2.5 whitespace-nowrap">{data.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-4 mt-6 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500"></div> Complete</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-300 dark:bg-blue-800"></div> Needs Review</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500"></div> Missing Data</div>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="bg-slate-50/50 dark:bg-[#1c2128] p-6 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm transition-colors duration-300">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" /> AI Insights
            </h3>
            
            <div className="space-y-4">
              {/* Insight 1 */}
              <div className="bg-white dark:bg-[#22272e] p-4 rounded-lg border border-red-100 dark:border-red-900/50 shadow-sm transition-colors duration-300">
                <div className="flex gap-3 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-snug font-medium">
                    <span className="font-bold text-slate-900 dark:text-white">{dashMetrics.pendingEnrichment} products</span> are missing essential attributes or descriptions.
                  </p>
                </div>
                <div className="flex gap-2 pl-7">
                  <button onClick={() => setActiveView('enrichment')} className="px-3 py-1.5 text-xs font-semibold bg-teal-600 dark:bg-teal-500/20 text-white dark:text-teal-400 rounded hover:bg-teal-700 dark:hover:bg-teal-500/30 transition-colors border border-transparent dark:border-teal-500/30">Fix with AI</button>
                  <button onClick={() => setActiveView('quality')} className="px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-[#2d333b] text-slate-600 dark:text-slate-400 rounded hover:bg-slate-50 dark:hover:bg-[#2d333b]/50 transition-colors">Review</button>
                </div>
              </div>

              {/* Insight 2 */}
              <div className="bg-white dark:bg-[#22272e] p-4 rounded-lg border border-slate-200 dark:border-[#2d333b] shadow-sm transition-colors duration-300">
                <div className="flex gap-3 mb-3">
                  <Wrench className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-snug font-medium">
                    <span className="font-bold text-slate-900 dark:text-white">{dashMetrics.issuesCount} SKUs</span> have detected quality issues requiring attention.
                  </p>
                </div>
                <div className="pl-7">
                  <button onClick={() => setActiveView('quality')} className="w-full py-1.5 text-xs font-semibold bg-teal-600 dark:bg-teal-500/20 text-white dark:text-teal-400 rounded hover:bg-teal-700 dark:hover:bg-teal-500/30 transition-colors border border-transparent dark:border-teal-500/30">Align Data</button>
                </div>
              </div>

              {/* Insight 3 */}
              <div className="bg-white dark:bg-[#22272e] p-4 rounded-lg border border-slate-200 dark:border-[#2d333b] shadow-sm transition-colors duration-300">
                <div className="flex gap-3 mb-3">
                  <AlertCircle className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-snug font-medium">
                    General catalog health is at {dashMetrics.avgQuality}%. Run enrichment to improve overall score.
                  </p>
                </div>
                <div className="pl-7">
                  <button onClick={() => setActiveView('enrichment')} className="w-full py-1.5 text-xs font-medium border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 bg-blue-50/50 dark:bg-transparent rounded transition-colors">Generate Content</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attention Table */}
        <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden transition-colors duration-300">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2d333b] flex justify-between items-center bg-white dark:bg-[#22272e]">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Products Needing Attention</h3>
            <button onClick={() => addToast('Filter options coming soon', 'info')} className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-[#1c2128] border-b border-slate-100 dark:border-[#2d333b] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Product</th>
                  <th className="px-6 py-3 font-semibold">SKU</th>
                  <th className="px-6 py-3 font-semibold">Issue</th>
                  <th className="px-6 py-3 font-semibold">Quality</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2d333b]">
                {attentionList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500">
                      No products currently need attention.
                    </td>
                  </tr>
                ) : attentionList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-[#2d333b]/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-[#1c2128] flex items-center justify-center shrink-0 border border-slate-200 dark:border-[#2d333b] text-slate-400 dark:text-slate-500">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">{item.sku}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{item.issue}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-[#1c2128] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.quality < 50 ? 'bg-red-500 dark:bg-red-400' : 'bg-blue-600 dark:bg-blue-500'}`} 
                            style={{ width: `${item.quality}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{item.quality}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setActiveView('quality')} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all p-1">
                        <ChevronRight className="w-5 h-5" />
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
  );
};

export default AnalyticsDashboard;
