import React, { useState } from 'react';
import { Key, Shield, Save, CheckCircle } from 'lucide-react';

const SettingsView = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-white tracking-tight mb-6">System Settings</h1>
        
        <div className="space-y-6">
          {/* API Configuration */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-industrial-accent" /> API Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">OpenAI API Key (GPT-4o)</label>
                <input type="password" defaultValue="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx" className="w-full bg-industrial-900 border border-industrial-700 rounded px-4 py-2 text-white focus:outline-none focus:border-industrial-accent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">LlamaParse API Key</label>
                <input type="password" defaultValue="llx-xxxxxxxxxxxxxxxxxxxxxxxx" className="w-full bg-industrial-900 border border-industrial-700 rounded px-4 py-2 text-white focus:outline-none focus:border-industrial-accent" />
              </div>
            </div>
          </div>

          {/* AI Validation Preferences */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-industrial-success" /> Confidence Routing Rules
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-industrial-900/50 rounded-lg border border-industrial-700/50">
                <div>
                  <p className="font-bold text-white">Auto-Approve Threshold</p>
                  <p className="text-xs text-slate-400">Automatically bypass human review if confidence is higher than this value.</p>
                </div>
                <select className="bg-industrial-800 border border-industrial-600 text-white rounded px-3 py-1 outline-none">
                  <option>90%</option>
                  <option>95%</option>
                  <option selected>98%</option>
                  <option>99%</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 bg-industrial-900/50 rounded-lg border border-industrial-700/50">
                <div>
                  <p className="font-bold text-white">Strict LOV Enforcement</p>
                  <p className="text-xs text-slate-400">Flag items immediately if extracted value is not in the predefined List of Values.</p>
                </div>
                <div className="w-12 h-6 bg-industrial-accent rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(56,189,248,0.4)]">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              className="tactile-button flex items-center gap-2 bg-industrial-accent text-industrial-900 font-black px-8 py-3 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.2)]"
            >
              {saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? "SETTINGS SAVED" : "SAVE CONFIGURATION"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;
