import React, { useState } from 'react';
import { 
  Key, Shield, Save, CheckCircle, BrainCircuit, Bell, Settings as SettingsIcon,
  Eye, EyeOff, Check, X, RefreshCw, ChevronDown
} from 'lucide-react';

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('General');
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = ['General', 'Integrations & Sync', 'Data Quality', 'Notifications', 'Security'];

  const handleSave = () => {
    if (!hasChanges) return;
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setHasChanges(false);
    }, 2500);
  };

  const markChanged = () => {
    setHasChanges(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8f9fc] dark:bg-[#1a1f26] animate-fade-in text-slate-800 dark:text-slate-200 relative">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your workspace, AI configuration, data quality rules, and account preferences.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={!hasChanges && !saved}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg shadow-sm transition-all ${
              saved 
                ? 'bg-teal-50 text-teal-600 border border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/30'
                : hasChanges 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20' 
                  : 'bg-slate-100 text-slate-400 dark:bg-[#22272e] dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Settings saved successfully" : "Save Changes"}
          </button>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar border-b border-slate-200 dark:border-[#2d333b]">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="py-2">
          {activeTab === 'General' && <GeneralSettings markChanged={markChanged} />}
          {activeTab === 'Integrations & Sync' && <AIApiSettings markChanged={markChanged} />}
          {activeTab === 'Data Quality' && <DataQualitySettings markChanged={markChanged} />}
          {activeTab === 'Notifications' && <NotificationSettings markChanged={markChanged} />}
          {activeTab === 'Security' && <SecuritySettings markChanged={markChanged} />}
        </div>

      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Sub-Components for Tabs
// -------------------------------------------------------------

const GeneralSettings = ({ markChanged }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <SettingsIcon className="w-5 h-5 text-slate-400" /> Workspace Details
      </h2>
      <div className="space-y-5 max-w-2xl">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">Workspace Name</label>
          <input 
            type="text" 
            defaultValue="NEXORA Global Catalog" 
            onChange={markChanged}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white" 
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">Workspace Description</label>
          <textarea 
            rows="3"
            defaultValue="Primary workspace for managing all multi-channel product intelligence." 
            onChange={markChanged}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white resize-none" 
          ></textarea>
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Localization</h2>
      <div className="space-y-5 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">Default Language</label>
            <div className="relative">
              <select onChange={markChanged} className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">Timezone</label>
            <div className="relative">
              <select onChange={markChanged} className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>UTC (Coordinated Universal Time)</option>
                <option>EST (Eastern Standard Time)</option>
                <option>PST (Pacific Standard Time)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">Date Format</label>
          <div className="relative max-w-xs">
            <select onChange={markChanged} className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AIApiSettings = ({ markChanged }) => {
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showLlama, setShowLlama] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTestSuccess(false);
    setTimeout(() => {
      setTestingConnection(false);
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Enterprise Data Sync Settings Card */}
      <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-500" /> Enterprise Data Sync
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Configure automated synchronization with your primary ERP and CRM systems.</p>
        
        <div className="space-y-6 max-w-3xl">
          {/* SAP Integration */}
          <div className="p-5 rounded-lg border border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128]">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white">SAP S/4HANA Connection</label>
              <span className="flex items-center gap-1.5 px-2 py-1 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded border border-teal-200 dark:border-teal-500/20 text-[10px] font-bold uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> Synced
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Real-time bi-directional synchronization of product master data.</p>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-all">
                Configure Mapping
              </button>
              <button className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-all">
                View Sync Logs
              </button>
            </div>
          </div>

          {/* Salesforce Integration */}
          <div className="p-5 rounded-lg border border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128]">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white">Salesforce Commerce Cloud</label>
              <span className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded border border-amber-200 dark:border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Pending Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Push enriched product catalogs directly to your storefront.</p>
             <button className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-all">
                Force Manual Sync
              </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Processing Preferences */}
        <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">AI Processing Preferences</h2>
          <div className="space-y-4">
            <ToggleSetting title="AI Enrichment" description="Enable generative AI features across the platform." defaultChecked={true} onChange={markChanged} />
            <ToggleSetting title="Automatic Product Enrichment" description="Automatically enrich new products added via integration sync." defaultChecked={false} onChange={markChanged} />
            <ToggleSetting title="Generate SEO Recommendations" titleColor="text-slate-900 dark:text-white" description="Create optimized meta titles and descriptions automatically." defaultChecked={true} onChange={markChanged} />
            <ToggleSetting title="Allow AI to suggest missing attributes" description="Analyze existing product data to infer missing specifications." defaultChecked={true} onChange={markChanged} />
          </div>
        </div>

        {/* Confidence Routing Rules */}
        <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" /> Confidence Routing Rules
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Control how NEXORA handles AI-generated product data based on confidence.</p>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128]">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Auto-Approve Threshold</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">Automatically approve AI-generated values when confidence is above this threshold.</p>
              </div>
              <div className="relative shrink-0">
                <select onChange={markChanged} className="w-full sm:w-24 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#3d444d] rounded-md px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white appearance-none focus:outline-none">
                  <option>90%</option>
                  <option>92%</option>
                  <option>95%</option>
                  <option selected>98%</option>
                  <option>99%</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <ToggleSetting 
              title="Strict LOV Enforcement" 
              description="Flag extracted values immediately when they do not match the predefined list of values." 
              defaultChecked={true} 
              onChange={markChanged} 
              isBoxed={true}
            />
            
            <ToggleSetting 
              title="Low Confidence Review" 
              description="Send low-confidence AI results to manual review instead of failing." 
              defaultChecked={true} 
              onChange={markChanged} 
              isBoxed={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DataQualitySettings = ({ markChanged }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Data Quality Rules</h2>
      
      <div className="space-y-6 max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Required Attributes</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Define which product attributes are mandatory for channel readiness.</p>
          </div>
          <button className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">Configure</button>
        </div>
        
        <div className="h-px w-full bg-slate-100 dark:bg-[#2d333b]"></div>
        
        <ToggleSetting title="Duplicate Detection" description="Enable duplicate SKU and product detection during sync." defaultChecked={true} onChange={markChanged} />
        
        <div className="h-px w-full bg-slate-100 dark:bg-[#2d333b]"></div>

        <ToggleSetting title="Missing Attribute Alerts" description="Enable alerts when critical attributes are missing from active products." defaultChecked={true} onChange={markChanged} />
        
        <div className="h-px w-full bg-slate-100 dark:bg-[#2d333b]"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Quality Threshold</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Products below this score will be flagged as "Needs Attention".</p>
          </div>
          <div className="relative shrink-0">
            <select onChange={markChanged} className="w-full sm:w-24 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#3d444d] rounded-md px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white appearance-none focus:outline-none">
              <option>80%</option>
              <option selected>85%</option>
              <option>90%</option>
              <option>95%</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

      </div>
    </div>
  </div>
);

const NotificationSettings = ({ markChanged }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Bell className="w-5 h-5 text-amber-500" /> Notification Preferences
      </h2>
      
      <div className="space-y-6 max-w-3xl">
        <ToggleSetting title="Email Notifications" description="Receive important alerts and digests via email." defaultChecked={true} onChange={markChanged} />
        <div className="h-px w-full bg-slate-100 dark:bg-[#2d333b]"></div>
        <ToggleSetting title="AI Processing Completed" description="Notify me when batch AI enrichment tasks are finished." defaultChecked={true} onChange={markChanged} />
        <div className="h-px w-full bg-slate-100 dark:bg-[#2d333b]"></div>
        <ToggleSetting title="Data Quality Issues" description="Notify me immediately when critical data quality rules are violated." defaultChecked={false} onChange={markChanged} />
        <div className="h-px w-full bg-slate-100 dark:bg-[#2d333b]"></div>
        <ToggleSetting title="Integration Sync Failures" description="Receive alerts when a channel integration fails to sync." defaultChecked={true} onChange={markChanged} />
        <div className="h-px w-full bg-slate-100 dark:bg-[#2d333b]"></div>
        <ToggleSetting title="Weekly Product Health Summary" description="Receive a weekly report on catalog health and AI improvements." defaultChecked={true} onChange={markChanged} />
      </div>
    </div>
  </div>
);

const SecuritySettings = ({ markChanged }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Security</h2>
      
      <div className="space-y-6 max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Change Password</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Update your account password securely.</p>
          </div>
          <button className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-colors">Update Password</button>
        </div>
        
        <div className="h-px w-full bg-slate-100 dark:bg-[#2d333b]"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Two-Factor Authentication</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security to your account.</p>
          </div>
          <button className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">Enable 2FA</button>
        </div>
        
        <div className="h-px w-full bg-slate-100 dark:bg-[#2d333b]"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Active Sessions</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage and revoke active login sessions.</p>
          </div>
          <button className="text-sm font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Manage Sessions</button>
        </div>
        
        <div className="h-px w-full bg-slate-100 dark:bg-[#2d333b]"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Login Activity</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review recent account access and locations.</p>
          </div>
          <button className="text-sm font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">View Activity</button>
        </div>

      </div>
    </div>
  </div>
);


// -------------------------------------------------------------
// UI Helpers
// -------------------------------------------------------------

const ToggleSetting = ({ title, description, defaultChecked, onChange, isBoxed }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    if(onChange) onChange();
  };

  const Wrapper = isBoxed ? 'div' : React.Fragment;
  const wrapperProps = isBoxed ? { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128]" } : {};
  const innerClass = isBoxed ? "" : "flex flex-col sm:flex-row sm:items-center justify-between gap-4";

  return (
    <Wrapper {...wrapperProps}>
      <div className={innerClass}>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">{description}</p>
        </div>
        <div 
          onClick={handleToggle}
          className={`shrink-0 w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 border ${
            isChecked 
              ? 'bg-blue-600 border-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' 
              : 'bg-slate-200 border-slate-300 dark:bg-[#2d333b] dark:border-slate-700'
          }`}
        >
          <div className={`absolute top-[1px] w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${isChecked ? 'left-[22px]' : 'left-[1px]'}`}></div>
        </div>
      </div>
    </Wrapper>
  );
};

export default SettingsView;
