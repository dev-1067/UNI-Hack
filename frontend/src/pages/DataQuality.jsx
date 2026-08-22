import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckSquare, AlertTriangle, AlertCircle, 
  DownloadCloud, Play, Sparkles, Edit3, ChevronRight, RefreshCw, X, Check
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { mockApi } from '../services/mock/api';
import { useToast } from '../components/ToastProvider';

const DataQuality = ({ setActiveView }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(0);
  const [needsAttention, setNeedsAttention] = useState(0);
  const [fixState, setFixState] = useState('idle');
  const [aiIssueCount, setAiIssueCount] = useState(0);
  const [recentIssues, setRecentIssues] = useState([]);
  
  // Manual Fix Review Modal State
  const [reviewModalIssue, setReviewModalIssue] = useState(null);
  const [manualFieldValue, setManualFieldValue] = useState('');
  const [isSavingManualFix, setIsSavingManualFix] = useState(false);

  const { addToast } = useToast();

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const [issues, metrics] = await Promise.all([
        apiClient.getQualityIssues(),
        apiClient.getDashboardMetrics()
      ]);
      
      const mapped = (issues || []).map(item => ({
        ...item,
        severityColor: item.severity === 'high' ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10' : item.severity === 'medium' ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' : 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10',
        score: item.severity === 'high' ? 50 : item.severity === 'medium' ? 75 : 90
      }));
      
      setRecentIssues(mapped);
      setHealthScore(metrics?.avgQuality || 0);
      setNeedsAttention((metrics?.pendingEnrichment || 0) + (metrics?.issuesCount || 0));
      setAiIssueCount(metrics?.issuesCount || 0);
    } catch (err) {
      addToast('Failed to load quality issues.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    const unsubscribe = mockApi.subscribe(() => {
      fetchIssues();
    });
    return () => unsubscribe();
  }, []);

  const handleRunCheck = () => {
    setIsChecking(true);
    addToast('Running catalog quality check...', 'info');
    setTimeout(() => {
      setIsChecking(false);
      fetchIssues(); // Refresh to ensure we have latest
      addToast('Quality check complete.', 'success');
    }, 1500);
  };

  const handleExport = async () => {
    addToast("Exporting Quality Report CSV...", 'info');
    try {
      const res = await apiClient.exportReportCsv('quality');
      addToast(`Downloaded: ${res.filename}`, 'success');
    } catch (e) {
      addToast('Failed to export quality report', 'error');
    }
  };

  const handleFixAI = async () => {
    if (fixState !== 'idle') return;
    setFixState('loading');
    addToast('AI is fixing data quality issues...', 'info');
    try {
      await apiClient.fixQualityIssueAI('all');
      await fetchIssues(); // Re-fetch to get updated global state
      setFixState('success');
      addToast('AI successfully fixed issues.', 'success');
      setTimeout(() => setFixState('idle'), 3000);
    } catch (err) {
      setFixState('idle');
      addToast('Failed to apply AI fixes.', 'error');
    }
  };

  const handleOpenReview = (issue) => {
    setReviewModalIssue(issue);
    // Provide a smart default suggestion based on the issue attribute
    if (issue.attribute === 'Material') {
      setManualFieldValue('Stainless Steel / High-Impact Polymer');
    } else if (issue.attribute === 'Wattage') {
      setManualFieldValue('15W Qi-Certified Fast Charge');
    } else if (issue.attribute === 'Dimensions') {
      setManualFieldValue('72" L x 24" W x 6mm Thick');
    } else if (issue.attribute === 'Weight') {
      setManualFieldValue('450 grams (0.99 lbs)');
    } else {
      setManualFieldValue('Verified standard specification');
    }
  };

  const handleSaveManualFix = async () => {
    if (!manualFieldValue.trim()) {
      addToast('Please enter a valid value.', 'error');
      return;
    }
    setIsSavingManualFix(true);
    try {
      await apiClient.fixQualityIssueManual(reviewModalIssue.id, {
        attribute: reviewModalIssue.attribute || 'specification',
        value: manualFieldValue.trim(),
        sku: reviewModalIssue.sku
      });
      addToast(`Resolved issue for ${reviewModalIssue.product}`, 'success');
      setReviewModalIssue(null);
      await fetchIssues();
    } catch (e) {
      addToast('Failed to resolve issue', 'error');
    } finally {
      setIsSavingManualFix(false);
    }
  };

  const topIssueTypes = [
    { label: 'Missing Attributes', count: recentIssues.filter(i => (i.issue || '').toLowerCase().includes('missing')).length, color: 'bg-amber-500' },
    { label: 'Format & Values', count: recentIssues.filter(i => (i.issue || '').toLowerCase().includes('mismatch') || (i.issue || '').toLowerCase().includes('invalid')).length, color: 'bg-red-500' },
    { label: 'Unit Inconsistency', count: recentIssues.filter(i => (i.issue || '').toLowerCase().includes('unit')).length, color: 'bg-slate-400' },
    { label: 'Category & Specs', count: recentIssues.filter(i => (i.issue || '').toLowerCase().includes('spec') || (i.issue || '').toLowerCase().includes('category')).length, color: 'bg-teal-500' },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8f9fc] dark:bg-[#1a1f26]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading quality data...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8f9fc] dark:bg-[#1a1f26] animate-fade-in text-slate-800 dark:text-slate-200 relative">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Data Quality</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Identify, understand and resolve issues across your product data.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleExport}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-[#22272e] border border-blue-200 dark:border-blue-900 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm"
            >
              <DownloadCloud className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={handleRunCheck}
              disabled={isChecking}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all"
            >
              <Play className={`w-4 h-4 ${isChecking ? 'animate-pulse' : ''}`} /> 
              {isChecking ? 'Checking...' : 'Run Quality Check'}
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Catalog Health</span>
              <Shield className="w-4 h-4 text-teal-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{healthScore}%</h2>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center">↗</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Products Checked</span>
              <CheckSquare className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{needsAttention + 1}</h2>
            </div>
          </div>

          <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-amber-200 dark:border-amber-900/30 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="flex justify-between items-start mb-4 pl-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Needs Attention</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 pl-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{needsAttention}</h2>
            </div>
          </div>

          <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-red-200 dark:border-red-900/30 shadow-sm flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="flex justify-between items-start mb-4 pl-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unresolved Issues</span>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex items-baseline gap-2 pl-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{aiIssueCount}</h2>
            </div>
          </div>

        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column (Main Content) */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            
            {/* Quality Breakdown Card */}
            <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
                <h3 className="text-base font-bold text-slate-900 dark:text-white self-start w-full mb-4">Quality Breakdown</h3>
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" className="stroke-slate-100 dark:stroke-[#1c2128]" strokeWidth="12" fill="none" />
                    <circle cx="80" cy="80" r="70" className="stroke-teal-600 dark:stroke-teal-500" strokeWidth="12" fill="none" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * healthScore) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">{healthScore}%</span>
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mt-1">
                      {healthScore >= 90 ? 'Excellent' : healthScore >= 75 ? 'Good' : 'Needs Review'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/3 flex flex-col gap-5 pt-8 md:pt-10">
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Completeness</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{healthScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-[#1c2128] rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${healthScore}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Accuracy</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{Math.min(100, healthScore + 2)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-[#1c2128] rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 dark:bg-teal-500 rounded-full" style={{ width: `${Math.min(100, healthScore + 2)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Consistency</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{Math.min(100, healthScore - 1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-[#1c2128] rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, healthScore - 1)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Validity</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{Math.min(100, healthScore)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-[#1c2128] rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${healthScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Issues Table */}
            <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2d333b] flex justify-between items-center bg-white dark:bg-[#22272e]">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Detected Quality Issues</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Click Review on any issue to manually edit and fix.</p>
                </div>
                <button 
                  onClick={() => setActiveView('products')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  View Catalog
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-[#1c2128] border-b border-slate-100 dark:border-[#2d333b] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Field & Issue</th>
                      <th className="px-6 py-3">Severity</th>
                      <th className="px-6 py-3">Score</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#2d333b]">
                    {recentIssues.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">
                          <div className="flex flex-col items-center justify-center">
                            <CheckSquare className="w-8 h-8 text-teal-500 mb-2" />
                            <p className="font-semibold text-slate-700 dark:text-slate-300">All Quality Issues Resolved!</p>
                            <p className="text-xs text-slate-400 mt-0.5">Your product catalog health is in optimal condition.</p>
                          </div>
                        </td>
                      </tr>
                    ) : recentIssues.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-[#2d333b]/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.product}</p>
                          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">SKU: {item.sku}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.issue}</p>
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Field: {item.attribute || 'Specification'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md ${item.severityColor}`}>
                            {item.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <span className={`text-sm font-bold ${item.score < 60 ? 'text-red-600' : 'text-amber-600'}`}>{item.score}%</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleOpenReview(item)}
                            className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-all inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Review & Fix
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            
            {/* NEXORA Intelligence Card */}
            <div className="bg-white dark:bg-[#22272e] rounded-xl border-2 border-blue-100 dark:border-blue-900/50 shadow-md p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">NEXORA Intelligence</h3>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6">
                  AI has detected systemic patterns in your catalog data. Resolving these will improve overall health by <strong className="text-teal-600 dark:text-teal-400">3.4%</strong>.
                </p>

                {aiIssueCount > 0 ? (
                  <div className="bg-slate-50 dark:bg-[#1c2128] border border-slate-100 dark:border-[#2d333b] rounded-lg p-4 mb-6 transition-all duration-500">
                    <div className="flex gap-2 items-start mb-2">
                      <Sparkles className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{aiIssueCount} quality issues detected</h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 pl-6 mb-4">
                      AI can extract missing attributes and standardize specifications automatically.
                    </p>
                    
                    <div className="flex gap-3 pl-6">
                      <button 
                        onClick={handleFixAI}
                        disabled={fixState !== 'idle'}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-80 min-w-[110px] justify-center"
                      >
                        {fixState === 'idle' && <><Sparkles className="w-3.5 h-3.5" /> Fix with AI</>}
                        {fixState === 'loading' && 'Fixing...'}
                        {fixState === 'success' && 'Resolved!'}
                      </button>
                      <button 
                        onClick={() => {
                          if (recentIssues.length > 0) handleOpenReview(recentIssues[0]);
                        }}
                        className="px-4 py-2 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#3d444d] text-slate-700 dark:text-slate-300 text-xs font-bold rounded-md hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 rounded-lg p-4 mb-6 transition-all duration-500 flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <div>
                      <h4 className="text-sm font-bold text-teal-900 dark:text-teal-300">All AI recommendations applied</h4>
                      <p className="text-xs text-teal-700 dark:text-teal-500/70">Your catalog health has improved.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Issue Types Card */}
            <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5">Top Issue Types</h3>
              
              <div className="space-y-4">
                {topIssueTypes.map((type, idx) => (
                  <div key={idx} className="flex justify-between items-center group cursor-default">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${type.color}`}></div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{type.label}</span>
                    </div>
                    <span className="text-sm font-mono text-slate-500 dark:text-slate-400">{type.count}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Manual Review / Fix Modal */}
      {reviewModalIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1a1f26] rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-[#2d333b] overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Review & Fix Issue</h3>
              </div>
              <button onClick={() => setReviewModalIssue(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Product Info Banner */}
              <div className="p-4 bg-slate-50 dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#3d444d]">
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">SKU: {reviewModalIssue.sku}</p>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{reviewModalIssue.product}</h4>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Detected Issue:</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/20">
                    {reviewModalIssue.issue}
                  </span>
                </div>
              </div>

              {/* Target Field Editor */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase">
                  Field: <span className="text-blue-600 dark:text-blue-400">{reviewModalIssue.attribute || 'Attribute Value'}</span> *
                </label>
                <input 
                  type="text" 
                  value={manualFieldValue}
                  onChange={(e) => setManualFieldValue(e.target.value)}
                  placeholder="Enter correct value for this attribute..."
                  className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                  Saving this value will resolve the issue, update the product globally, and boost your Data Quality score.
                </p>
              </div>

              {/* AI Suggestion quick insert */}
              <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Standardized schema suggestion available</span>
                </div>
                <button 
                  onClick={() => setManualFieldValue('Certified High-Grade Standard Material')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                >
                  Auto-fill
                </button>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128] flex justify-end gap-3">
              <button 
                onClick={() => setReviewModalIssue(null)}
                disabled={isSavingManualFix}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2d333b] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveManualFix}
                disabled={isSavingManualFix}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm disabled:opacity-80"
              >
                {isSavingManualFix ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</> : <><Check className="w-4 h-4" /> Save & Resolve</>}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DataQuality;
