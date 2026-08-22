import React, { useState } from 'react';
import { 
  User, Mail, Briefcase, Building, Phone, Shield, 
  Bell, Palette, LogOut, CheckCircle, RefreshCw, XCircle, AlertTriangle
} from 'lucide-react';

const Profile = ({ mockUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [saveState, setSaveState] = useState('idle'); // idle, loading, success
  const [deleteState, setDeleteState] = useState('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mock Form State
  const [formData, setFormData] = useState({
    name: mockUser?.name || '',
    email: mockUser?.email || '',
    title: mockUser?.role || '',
    company: 'Nexora Inc.',
    phone: '+1 (555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    productAlerts: true,
    aiNotifications: false,
    theme: 'system'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    setSaveState('loading');
    setTimeout(() => {
      setSaveState('success');
      setTimeout(() => setSaveState('idle'), 3000);
    }, 1500);
  };

  const handleDeleteAccount = () => {
    setDeleteState('loading');
    setTimeout(() => {
      onLogout(); // Simulate logging out after deletion
    }, 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8f9fc] dark:bg-[#1a1f26] animate-fade-in text-slate-800 dark:text-slate-200">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white dark:bg-[#22272e] p-6 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-[#1c2128] border-4 border-white dark:border-[#2d333b] shadow-md flex items-center justify-center shrink-0 overflow-hidden relative group">
            {mockUser?.avatar ? (
              <img src={mockUser.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <span className="text-xs font-semibold text-white">Change</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{formData.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{formData.title} • {formData.company}</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 text-xs font-semibold">
                <Mail className="w-3 h-3" /> {formData.email}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 dark:bg-[#2d333b] dark:text-slate-300 dark:border-[#3d444d] text-xs font-semibold">
                <Building className="w-3 h-3" /> Workspace Admin
              </span>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button 
              onClick={handleSave}
              disabled={saveState !== 'idle'}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all min-w-[140px]"
            >
              {saveState === 'idle' && 'Save Changes'}
              {saveState === 'loading' && <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>}
              {saveState === 'success' && <><CheckCircle className="w-4 h-4" /> Saved</>}
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Side Nav */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-1 bg-white dark:bg-[#22272e] p-2 rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm">
              <button 
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'general' ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#2d333b]/50'}`}
              >
                <User className="w-4 h-4" /> Personal Information
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#2d333b]/50'}`}
              >
                <Shield className="w-4 h-4" /> Security
              </button>
              <button 
                onClick={() => setActiveTab('preferences')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'preferences' ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#2d333b]/50'}`}
              >
                <Bell className="w-4 h-4" /> Preferences
              </button>
              <button 
                onClick={() => setActiveTab('session')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'session' ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#2d333b]/50'}`}
              >
                <LogOut className="w-4 h-4" /> Account & Sessions
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            
            {/* General Information Tab */}
            {activeTab === 'general' && (
              <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm animate-fade-in overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2d333b]">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Update your photo and personal details here.</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Work Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Job Title</label>
                      <input 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm animate-fade-in overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2d333b]">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security & Password</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage your password and authentication settings.</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Current Password</label>
                      <input 
                        type="password" 
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">New Password</label>
                      <input 
                        type="password" 
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Confirm New Password</label>
                      <input 
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <button className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm animate-fade-in overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2d333b]">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Preferences</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Control your application experience and notifications.</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Notifications */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Email Notifications</h4>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-[#3d444d] bg-slate-50/50 dark:bg-[#1c2128] cursor-pointer">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Weekly Summary</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Receive a weekly overview of catalog health.</p>
                        </div>
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.emailNotifications ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.emailNotifications ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                        {/* Hidden input to handle state via parent wrapper click if needed, or just wire up an onClick on the container. Simulating state for visual completeness. */}
                        <input type="checkbox" className="hidden" name="emailNotifications" checked={formData.emailNotifications} onChange={handleChange} />
                      </label>

                      <label className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-[#3d444d] bg-slate-50/50 dark:bg-[#1c2128] cursor-pointer">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Product Alerts</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Get notified when products require urgent review.</p>
                        </div>
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.productAlerts ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.productAlerts ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                        <input type="checkbox" className="hidden" name="productAlerts" checked={formData.productAlerts} onChange={handleChange} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Session Tab */}
            {activeTab === 'session' && (
              <div className="space-y-6 animate-fade-in">
                {/* Active Sessions */}
                <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2d333b]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Sessions</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage devices currently logged in to your account.</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-500/5">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          Mac OS • Safari <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white">Current Session</span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">San Francisco, USA • Active now</p>
                      </div>
                    </div>
                    <button onClick={onLogout} className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#3d444d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-colors">
                      Sign out of all other devices
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-[#22272e] rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm overflow-hidden relative">
                  {showDeleteConfirm && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-[#22272e]/95 backdrop-blur-sm z-10 p-6 flex flex-col justify-center items-center text-center border border-red-200 dark:border-red-900/50">
                      <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Are you absolutely sure?</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md">
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                      </p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={deleteState === 'loading'}
                          className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#2d333b] hover:bg-slate-200 dark:hover:bg-[#3d444d] rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleDeleteAccount}
                          disabled={deleteState === 'loading'}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                          {deleteState === 'loading' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Yes, delete account'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="px-6 py-5 border-b border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-500/5">
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Danger Zone</h3>
                    <p className="text-sm text-red-600/70 dark:text-red-400/70">Irreversible account actions.</p>
                  </div>
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Delete Account</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Permanently delete your account and all associated data.</p>
                    </div>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
