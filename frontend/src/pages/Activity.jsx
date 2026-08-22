import React, { useState, useEffect } from 'react';
import { 
  DownloadCloud, Calendar, Activity as ActivityIcon, Edit3, 
  BrainCircuit, ShieldAlert, UploadCloud, Download, Zap, Key,
  ChevronDown, Search, ArrowUp, X, CheckCircle, RefreshCw, Eye, Package, Trash2
} from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import { apiClient } from '../services/apiClient';

const iconMap = {
  'action': ActivityIcon,
  'create': Package,
  'update': Edit3,
  'delete': Trash2,
};

const Activity = ({ setActiveView, user }) => {
  // Local State
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [exportState, setExportState] = useState('idle'); // idle, loading, success
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Activity');
  const [statusFilter, setStatusFilter] = useState('All');

  // Detail Drawer State
  const [selectedActivity, setSelectedActivity] = useState(null);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getActivityLogs({ limit: 50 });
        const mapped = (data || []).map(item => {
          let type = 'System Event';
          let icon = ActivityIcon;
          let status = 'Successful';
          let colorClass = 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-500/20';

          const actionLower = (item.action || '').toLowerCase();
          if (actionLower.includes('product')) {
             type = 'Product Updates';
             icon = actionLower.includes('create') ? Package : (actionLower.includes('delete') ? X : Edit3);
             colorClass = actionLower.includes('delete') ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/20' : 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20';
          }
          if (actionLower.includes('ai') || actionLower.includes('enrich')) {
             type = 'AI Enrichment';
             icon = BrainCircuit;
             colorClass = 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-500/20';
          }
          if (actionLower.includes('quality') || actionLower.includes('fix')) {
             type = 'Data Quality';
             icon = ShieldAlert;
             colorClass = 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/20';
          }
          if (actionLower.includes('import') || actionLower.includes('catalog')) {
             type = 'Imports';
             icon = UploadCloud;
             colorClass = 'text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-500/20';
          }
          if (actionLower.includes('export')) {
             type = 'Exports';
             icon = Download;
             colorClass = 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-500/20';
          }
          if (actionLower.includes('connect') || actionLower.includes('sync') || actionLower.includes('channel')) {
             type = 'Integrations';
             icon = Zap;
             colorClass = 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-500/20';
          }

          return {
            id: item.id,
            group: 'RECENT', // simplified grouping
            type,
            title: item.action,
            description: item.target ? `Target: ${item.target}` : item.action,
            user: item.user || user?.name || 'System',
            timestamp: item.time || 'Just now',
            exactTime: item.time || new Date().toLocaleString(),
            status,
            icon,
            colorClass,
            product: actionLower.includes('product') ? item.target : 'N/A',
            sku: item.sku || 'N/A',
            raw: item
          };
        });
        setActivities(mapped);
      } catch (e) {
        addToast('Failed to load activities', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  // Handlers
  const handleExport = () => {
    setExportState('loading');
    addToast('Preparing activity export...', 'info');
    setTimeout(() => {
      setExportState('success');
      addToast('Activity exported successfully.', 'success');
      setTimeout(() => setExportState('idle'), 3000);
    }, 1500);
  };

  // Filtering Logic
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'All Activity' || activity.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || activity.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Grouping Logic
  const groupedActivities = filteredActivities.reduce((acc, curr) => {
    if (!acc[curr.group]) acc[curr.group] = [];
    acc[curr.group].push(curr);
    return acc;
  }, {});

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All Activity');
    setStatusFilter('All');
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8f9fc] dark:bg-[#1a1f26]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading activity feed...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8f9fc] dark:bg-[#1a1f26] animate-fade-in text-slate-800 dark:text-slate-200 flex">
      <div className={`max-w-[1400px] w-full mx-auto space-y-6 transition-all duration-300 ${selectedActivity ? 'md:pr-[400px]' : ''}`}>
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Activity</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track product changes, AI actions, imports, integrations, and other workspace activity.</p>
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
                  {['Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map(range => (
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
              onClick={handleExport}
              disabled={exportState !== 'idle'}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all min-w-[150px]"
            >
              {exportState === 'idle' && <><DownloadCloud className="w-4 h-4" /> Export Activity</>}
              {exportState === 'loading' && <><RefreshCw className="w-4 h-4 animate-spin" /> Exporting...</>}
              {exportState === 'success' && <><CheckCircle className="w-4 h-4" /> Exported</>}
            </button>
          </div>
        </div>

        {/* 1. Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="TOTAL ACTIVITIES" value={activities.length.toLocaleString()} trend="+18%" icon={ActivityIcon} />
          <KpiCard title="PRODUCT UPDATES" value={activities.filter(a => a.type === 'Product Updates').length.toLocaleString()} trend="+12%" icon={Edit3} />
          <KpiCard title="AI ACTIONS" value={activities.filter(a => a.type === 'AI Enrichment').length.toLocaleString()} trend="+24%" icon={BrainCircuit} />
          <KpiCard title="INTEGRATION EVENTS" value={activities.filter(a => a.type === 'Integrations').length.toLocaleString()} trend="+9%" icon={Zap} />
        </div>

        {/* 2. Activity Filter Bar */}
        <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search activity..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          
          <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Type:</span>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md px-2 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option>All Activity</option>
                <option>Product Updates</option>
                <option>AI Enrichment</option>
                <option>Data Quality</option>
                <option>Imports</option>
                <option>Exports</option>
                <option>Integrations</option>
                <option>Authentication</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md px-2 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option>All</option>
                <option>Successful</option>
                <option>Pending</option>
                <option>Needs Review</option>
                <option>Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Main Activity Timeline */}
        <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2d333b]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          </div>
          
          <div className="p-6 flex-1">
            {filteredActivities.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 bg-slate-100 dark:bg-[#1c2128] rounded-full flex items-center justify-center mb-4">
                  <ActivityIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No activity found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Try changing your filters or search terms.</p>
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedActivities).map(([group, acts]) => (
                  <div key={group}>
                    <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 ml-14">
                      {group}
                    </h4>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-[#2d333b]">
                      {acts.map((activity) => (
                        <div 
                          key={activity.id} 
                          onClick={() => setSelectedActivity(activity)}
                          className={`relative flex items-start group cursor-pointer p-3 -m-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b]/30 transition-colors ${selectedActivity?.id === activity.id ? 'bg-slate-50 dark:bg-[#2d333b]/50 ring-1 ring-slate-200 dark:ring-[#3d444d]' : ''}`}
                        >
                          {/* Timeline Icon */}
                          <div className={`shrink-0 w-12 h-12 rounded-full border-4 border-white dark:border-[#22272e] flex items-center justify-center z-10 ${activity.colorClass}`}>
                            <activity.icon className="w-5 h-5" />
                          </div>
                          
                          {/* Content */}
                          <div className="ml-4 flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                              <h5 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{activity.title}</h5>
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">{activity.timestamp}</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-2 leading-relaxed">
                              {activity.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3">
                              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded border ${
                                activity.status === 'Successful' ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20' :
                                activity.status === 'Pending' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                                activity.status === 'Needs Review' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                                'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                              }`}>
                                {activity.status}
                              </span>
                              
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">User:</span> {activity.user}
                              </div>
                              
                              {activity.product !== 'N/A' && (
                                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">Target:</span> <span className="truncate">{activity.product}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Drawer (Desktop) / Modal (Mobile) */}
      {selectedActivity && (
        <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 md:absolute md:inset-auto md:top-0 md:right-0 md:bottom-0 md:w-[400px] bg-slate-900/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none`}>
          
          <div className={`w-full md:w-full h-full bg-white dark:bg-[#1c2128] border-l border-slate-200 dark:border-[#2d333b] shadow-2xl flex flex-col transform transition-transform duration-300`}>
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#22272e]">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Activity Details</h3>
              <button onClick={() => setSelectedActivity(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedActivity.colorClass}`}>
                  <selectedActivity.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{selectedActivity.title}</h4>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded border inline-block ${
                    selectedActivity.status === 'Successful' ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20' :
                    selectedActivity.status === 'Pending' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                    selectedActivity.status === 'Needs Review' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                    'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                  }`}>
                    {selectedActivity.status}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#22272e] p-3 rounded-lg border border-slate-100 dark:border-[#2d333b]">
                    {selectedActivity.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Activity Type</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedActivity.type}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">User / System</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedActivity.user}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Date & Time</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedActivity.exactTime}</p>
                </div>
                
                <div className="h-px w-full bg-slate-100 dark:bg-[#2d333b]"></div>

                {selectedActivity.product !== 'N/A' && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Target</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{selectedActivity.product}</p>
                  </div>
                )}

              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-[#2d333b] bg-white dark:bg-[#1c2128]">
              <button 
                onClick={() => setSelectedActivity(null)}
                className="w-full py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-all"
              >
                Close Details
              </button>
            </div>
            
          </div>
        </div>
      )}
      
    </div>
  );
};

// Subcomponent for KPI Cards
const KpiCard = ({ title, value, trend, icon: Icon }) => (
  <div className="bg-white dark:bg-[#22272e] p-5 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-2">
      <p className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">{title}</p>
      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 opacity-70" />
    </div>
    <div className="flex items-baseline gap-2 mt-1">
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
    </div>
    <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
      <ArrowUp className="w-3 h-3" /> <span>{trend} this month</span>
    </div>
  </div>
);

export default Activity;
