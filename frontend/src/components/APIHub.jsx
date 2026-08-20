import React, { useState } from 'react';
import { Wifi, Key, Code, Copy, Activity, Plus, Trash2, Check } from 'lucide-react';

const APIHub = () => {
  const [keys, setKeys] = useState([
    { id: 1, name: 'Production Key', value: 'pk_live_8f92j7x9q2', type: 'Active' },
    { id: 2, name: 'Sandbox Key', value: 'pk_test_1m44k8a8b1', type: 'Test' }
  ]);
  const [copiedId, setCopiedId] = useState(null);

  const generateKey = () => {
    const newVal = 'pk_live_' + Math.random().toString(36).substr(2, 10);
    setKeys([...keys, { id: Date.now(), name: 'New API Key', value: newVal, type: 'Active' }]);
  };

  const copyToClipboard = (id, val) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const revokeKey = (id) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Wifi className="w-6 h-6 text-accent-cyan" />
              Integration Hub
            </h2>
            <p className="text-sm text-slate-400 mt-1">Plug-and-play API endpoints for ERP and E-Commerce sync.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-cmd-800 border border-status-online/30 rounded-sm">
            <span className="w-2 h-2 rounded-full bg-status-online animate-pulse" />
            <span className="text-xs font-bold text-status-online uppercase">System Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 border-l-4 border-l-accent-cyan flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-accent-cyan" />
                Active API Keys
              </h3>
              <button onClick={generateKey} className="flex items-center gap-1 text-[11px] font-bold text-cmd-900 bg-accent-cyan hover:bg-sky-400 px-2 py-1 rounded-sm transition-colors">
                <Plus className="w-3 h-3" /> Generate
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Use these keys to authenticate requests from your ERP.</p>
            
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {keys.length === 0 && <p className="text-xs text-slate-500 italic">No active keys. Generate one above.</p>}
              {keys.map((k) => (
                <div key={k.id} className="bg-cmd-900/80 border border-white/10 rounded-sm p-3 group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{k.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${k.type === 'Active' ? 'text-accent-cyan bg-accent-cyan/10' : 'text-slate-400 bg-white/5'}`}>
                      {k.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className={`text-sm font-mono ${k.type === 'Active' ? 'text-white' : 'text-slate-400'}`}>{k.value}</code>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => copyToClipboard(k.id, k.value)} className="text-slate-500 hover:text-accent-cyan transition-colors" title="Copy">
                        {copiedId === k.id ? <Check className="w-4 h-4 text-industrial-success" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={() => revokeKey(k.id)} className="text-slate-500 hover:text-industrial-warning transition-colors" title="Revoke">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-industrial-success" />
              Live Traffic
            </h3>
            <p className="text-xs text-slate-400 mb-6">Real-time requests over the last 24 hours.</p>
            
            <div className="h-32 flex items-end justify-between gap-1 mt-auto">
              {[40, 60, 45, 80, 55, 90, 70, 65, 85, 100, 75, 50, 40, 60, 80].map((h, i) => (
                <div key={i} className="w-full bg-accent-cyan/20 rounded-t-sm relative group hover:bg-accent-cyan/40 transition-colors" style={{ height: `${h}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-cmd-800 text-xs text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}k
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-bold uppercase">
              <span>24h Ago</span>
              <span>Now</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 mt-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Code className="w-4 h-4 text-slate-400" />
            Quick Start (cURL)
          </h3>
          <div className="bg-cmd-950 border border-white/5 rounded-sm p-4 font-mono text-sm overflow-x-auto">
            <span className="text-pink-500">curl</span> <span className="text-blue-400">-X</span> POST https://api.unihack2026.com/v1/enrich \<br/>
            &nbsp;&nbsp;<span className="text-blue-400">-H</span> <span className="text-green-400">"Authorization: Bearer pk_live_***"</span> \<br/>
            &nbsp;&nbsp;<span className="text-blue-400">-H</span> <span className="text-green-400">"Content-Type: application/json"</span> \<br/>
            &nbsp;&nbsp;<span className="text-blue-400">-d</span> <span className="text-yellow-300">'{'{"sku": "DCB518ASTS06G", "raw_desc": "Diablo Steel Demon 5-3/8..."}'}'</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIHub;
