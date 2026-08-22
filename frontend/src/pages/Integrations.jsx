import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, ShoppingCart, 
  Users, Globe, Store, Network, Database, Check, X, ShieldAlert,
  ArrowRight, Code, MoreHorizontal, Settings, RefreshCw, Zap
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { useToast } from '../components/ToastProvider';

const Integrations = ({ setActiveView }) => {
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  
  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'connect', 'manage', 'add'
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [syncState, setSyncState] = useState('idle'); // 'idle', 'syncing', 'success'
  const [connectState, setConnectState] = useState('idle');
  
  const [integrationsList, setIntegrationsList] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const [data, logs] = await Promise.all([
        apiClient.getIntegrations(),
        apiClient.getActivityLogs({ entity_type: 'integration', limit: 10 }).catch(() => [])
      ]);
      // map icons based on category/name
      const mapped = (data || []).map(item => {
        let icon = Store;
        let color = 'text-slate-500 bg-slate-100 dark:bg-slate-500/20 dark:text-slate-400';
        if (item.name === 'Shopify') { icon = ShoppingCart; color = 'text-green-600 bg-green-100 dark:bg-green-500/20 dark:text-green-400'; }
        else if (item.name.includes('Amazon') || item.name.includes('Walmart')) { icon = Store; color = 'text-amber-600 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-400'; }
        else if (item.name.includes('Salesforce')) { icon = Users; color = 'text-blue-600 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400'; }
        else if (item.name.includes('Google')) { icon = Globe; color = 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400'; }
        else if (item.name.includes('SAP')) { icon = Database; }
        
        return {
          ...item,
          icon,
          color,
          status: item.status === 'connected' ? 'Connected' : 'Not Connected',
          category: item.id === 'shopify' ? 'Commerce' : item.id === 'salesforce' ? 'CRM' : item.id === 'sap' ? 'Enterprise' : 'Marketplace'
        };
      });
      setIntegrationsList(mapped);
      setRecentActivity((logs || []).map(l => ({
        id: l.id,
        integration: l.entity_id || 'Channel',
        activity: l.action,
        products: l.metadata?.count || '—',
        status: 'Completed',
        time: l.time || 'Recently'
      })));
    } catch (err) {
      addToast('Failed to load integrations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  // Derived state
  const connectedCount = integrationsList.filter(i => i.status === 'Connected').length;
  
  const filteredIntegrations = integrationsList.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' 
      ? true 
      : filter === 'Connected' ? integration.status === 'Connected'
      : filter === 'Not Connected' ? integration.status === 'Not Connected'
      : integration.category === filter;
    return matchesSearch && matchesFilter;
  });

  // Handlers
  const handleOpenManage = (integration) => {
    setSelectedIntegration(integration);
    setSyncState('idle');
    setActiveModal('manage');
  };

  const handleOpenConnect = (integration) => {
    setSelectedIntegration(integration);
    setConnectState('idle');
    setActiveModal('connect');
  };

  const handleTestConnection = async () => {
    addToast('Testing connection...', 'info');
    await new Promise(resolve => setTimeout(resolve, 600));
    addToast('Connection successful!', 'success');
  };

  const handleConnect = async () => {
    setConnectState('loading');
    addToast('Connecting to integration...', 'info');
    try {
      await apiClient.connectIntegration(selectedIntegration.id);
      addToast(`${selectedIntegration.name} connected successfully.`, 'success');
      
      // Update local state to reflect connection
      setIntegrationsList(prev => prev.map(i => i.id === selectedIntegration.id ? { ...i, status: 'Connected', lastSync: 'Just now' } : i));
      
      setActiveModal(null);
    } catch (err) {
      addToast(`Failed to connect to ${selectedIntegration.name}.`, 'error');
    } finally {
      setConnectState('idle');
    }
  };

  const handleDisconnect = async () => {
    addToast('Disconnecting integration...', 'info');
    try {
      await apiClient.disconnectIntegration(selectedIntegration.id);
      addToast(`${selectedIntegration.name} disconnected successfully.`, 'success');
      
      setIntegrationsList(prev => prev.map(i => i.id === selectedIntegration.id ? { ...i, status: 'Not Connected' } : i));
      setActiveModal(null);
    } catch (err) {
      addToast('Failed to disconnect integration.', 'error');
    }
  };

  const handleSyncNow = async () => {
    setSyncState('syncing');
    addToast('Syncing data...', 'info');
    try {
      await apiClient.syncIntegration(selectedIntegration.id);
      setSyncState('success');
      addToast('Sync completed successfully!', 'success');
      setIntegrationsList(prev => prev.map(i => i.id === selectedIntegration.id ? { ...i, lastSync: 'Just now' } : i));
      setTimeout(() => setSyncState('idle'), 3000);
    } catch (err) {
      setSyncState('failed');
      addToast('Sync failed.', 'error');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8f9fc] dark:bg-[#1a1f26] animate-fade-in text-slate-800 dark:text-slate-200 relative">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Integrations</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Connect Nexora to the tools and channels that power your product ecosystem.</p>
          </div>
          <button 
            onClick={() => setActiveModal('add')}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Integration
          </button>
        </div>

        {/* Top Search & Filter Bar */}
        <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search integrations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            {['All', 'Connected', 'Not Connected', 'Commerce', 'Marketplace', 'CRM', 'Enterprise'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                  filter === f 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1c2128] dark:text-slate-400 dark:hover:bg-[#2d333b]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* LEFT: Integration Grid (col-span-3) */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Connected Ecosystem</h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded-full border border-teal-200 dark:border-teal-500/20 shadow-sm text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                {connectedCount} Connected
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map(integration => (
                <div key={integration.id} className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm flex flex-col transition-all hover:shadow-md">
                  
                  {/* Card Header */}
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${integration.color}`}>
                        <integration.icon className="w-5 h-5" />
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border ${
                        integration.status === 'Connected' 
                          ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20' 
                          : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-[#1c2128] dark:text-slate-400 dark:border-[#3d444d]'
                      }`}>
                        {integration.status}
                      </span>
                    </div>
                    
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{integration.name}</h4>
                    <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">{integration.category}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {integration.description}
                    </p>
                    
                    {integration.supporting && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-3 italic">
                        * {integration.supporting}
                      </p>
                    )}
                  </div>
                  
                  {/* Card Footer */}
                  <div className="px-5 py-3 border-t border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128] flex justify-between items-center rounded-b-xl">
                    {integration.status === 'Connected' ? (
                      <>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          Last sync: {integration.lastSync}
                        </span>
                        <button 
                          onClick={() => handleOpenManage(integration)}
                          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Manage
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                          Not configured
                        </span>
                        {integration.name === 'SAP ERP' ? (
                          <button className="text-xs font-bold text-slate-400 dark:text-slate-500 cursor-not-allowed">
                            Upgrade
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleOpenConnect(integration)}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                          >
                            Connect
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Promotional Cards */}
          <div className="flex flex-col gap-6">
            
            {/* Nexora Ecosystem Card */}
            <div className="bg-gradient-to-b from-[#1c2128] to-[#12151a] rounded-xl border border-[#2d333b] shadow-lg p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">One Product Catalog.<br/>Every Channel.</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                    Centralize product data in Nexora and sync it seamlessly to any channel.
                  </p>
                  
                  {/* Visual Node Graphic */}
                  <div className="flex flex-col items-center mb-6 py-2">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50 relative z-10 border border-blue-400">
                      <Network className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-px h-6 bg-slate-600 my-1"></div>
                    <div className="flex gap-2 justify-center">
                      <div className="w-8 h-8 bg-[#2d333b] rounded flex items-center justify-center border border-slate-600"><ShoppingCart className="w-4 h-4 text-slate-300"/></div>
                      <div className="w-8 h-8 bg-[#2d333b] rounded flex items-center justify-center border border-slate-600"><Globe className="w-4 h-4 text-slate-300"/></div>
                      <div className="w-8 h-8 bg-[#2d333b] rounded flex items-center justify-center border border-slate-600"><Store className="w-4 h-4 text-slate-300"/></div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveView('enrichment')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600 hover:border-transparent transition-all"
                >
                  <Zap className="w-3.5 h-3.5" /> View AI Enrichment
                </button>
              </div>
            </div>

            {/* Build With Nexora Card */}
            <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Build With NEXORA</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-5">
                Use our robust REST API and GraphQL API to integrate custom workflows into your product ecosystem.
              </p>
              <button 
                onClick={() => addToast("Opening API Documentation...", "info")}
                className="w-full py-2 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-colors"
              >
                View API Documentation
              </button>
            </div>

          </div>
        </div>

        {/* Recent Integration Activity Table */}
        <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden flex flex-col mt-4">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2d333b] flex justify-between items-center bg-white dark:bg-[#22272e]">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Integration Activity</h3>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-[#1c2128] border-b border-slate-100 dark:border-[#2d333b] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Integration</th>
                  <th className="px-6 py-3">Activity</th>
                  <th className="px-6 py-3">Products</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2d333b]">
                {recentActivity.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-[#2d333b]/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-sm text-slate-900 dark:text-white">{item.integration}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{item.activity}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{item.products}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md border ${
                        item.status === 'Completed' ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20' :
                        item.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                        'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-slate-50/50 dark:bg-[#1c2128] border-t border-slate-100 dark:border-[#2d333b] flex justify-end">
            <button 
              onClick={() => setActiveView('activity')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              View All Activity <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* OVERLAYS / MODALS */}
      {activeModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
          
          {/* Add Integration Modal */}
          {activeModal === 'add' && (
            <div className="bg-white dark:bg-[#1a1f26] rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-[#2d333b] overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128]">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Integration</h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-[#1a1f26]">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search available integrations..." className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-[#22272e] border border-slate-200 dark:border-[#3d444d] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white" />
                </div>
                
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Commerce & Marketplaces</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {/* Mock Add Card */}
                  <div className="p-3 border border-slate-200 dark:border-[#2d333b] rounded-lg flex items-center gap-3 hover:border-blue-500 cursor-pointer group bg-slate-50/50 dark:bg-[#22272e]">
                    <div className="w-10 h-10 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">WooCommerce</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">E-commerce plugin</p>
                    </div>
                  </div>
                  <div className="p-3 border border-slate-200 dark:border-[#2d333b] rounded-lg flex items-center gap-3 hover:border-blue-500 cursor-pointer group bg-slate-50/50 dark:bg-[#22272e]">
                    <div className="w-10 h-10 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Target Plus</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Marketplace listings</p>
                    </div>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Data Sources & Storage</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 border border-slate-200 dark:border-[#2d333b] rounded-lg flex items-center gap-3 hover:border-blue-500 cursor-pointer group bg-slate-50/50 dark:bg-[#22272e]">
                    <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Snowflake</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Data warehouse</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connect Modal */}
          {activeModal === 'connect' && selectedIntegration && (
            <div className="bg-white dark:bg-[#1a1f26] rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-[#2d333b] overflow-hidden flex flex-col">
              <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128]">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Connect Integration</h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedIntegration.color}`}>
                    <selectedIntegration.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{selectedIntegration.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{selectedIntegration.description}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">API Endpoint / Store URL</label>
                    <input type="text" className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#22272e] border border-slate-200 dark:border-[#3d444d] rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white" defaultValue="https://" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">API Key / Access Token</label>
                    <input type="password" className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#22272e] border border-slate-200 dark:border-[#3d444d] rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white" placeholder="••••••••••••••••" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleTestConnection} className="flex-1 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b]">
                    Test Connection
                  </button>
                  <button 
                    onClick={handleConnect} 
                    disabled={connectState !== 'idle'}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-80"
                  >
                    {connectState === 'loading' ? <><RefreshCw className="w-4 h-4 animate-spin" /> Connecting...</> : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Manage Modal */}
          {activeModal === 'manage' && selectedIntegration && (
            <div className="bg-white dark:bg-[#1a1f26] rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-[#2d333b] overflow-hidden flex flex-col">
              <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128]">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-500" /> Manage Integration
                </h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-[#2d333b]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedIntegration.color}`}>
                      <selectedIntegration.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{selectedIntegration.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Connected</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Products synced</span>
                    <span className="font-bold text-slate-900 dark:text-white">12,402</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Sync frequency</span>
                    <span className="font-bold text-slate-900 dark:text-white">Every 15 mins</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Sync direction</span>
                    <span className="font-bold text-slate-900 dark:text-white">Two-way sync</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Last sync</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedIntegration.lastSync}</span>
                  </div>
                </div>

                {syncState === 'idle' && (
                  <div className="flex gap-3">
                    <button onClick={handleSyncNow} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all">
                      <RefreshCw className="w-4 h-4" /> Sync Now
                    </button>
                    <button className="flex-1 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b]">
                      Configure
                    </button>
                  </div>
                )}
                {syncState === 'syncing' && (
                  <div className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Syncing...
                  </div>
                )}
                {syncState === 'success' && (
                  <div className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-900/50">
                    <Check className="w-4 h-4" /> Sync completed successfully
                  </div>
                )}
                {syncState === 'failed' && (
                  <div className="flex flex-col gap-2 w-full mt-2">
                    <div className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/50">
                      <ShieldAlert className="w-4 h-4" /> Sync failed. Please try again.
                    </div>
                    <button onClick={handleSyncNow} className="w-full py-2 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b]">
                      Retry Sync
                    </button>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <button onClick={handleDisconnect} className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline">
                    Disconnect Integration
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Integrations;
