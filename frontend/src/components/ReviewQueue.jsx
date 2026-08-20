import React, { useState } from 'react';
import { AlertTriangle, Check, X, Edit2, ShieldAlert } from 'lucide-react';

const initialQueue = [
  {
    id: 'Q-901',
    sku: 'FRK-T8-PRO',
    issue: 'Brand Name Ambiguity',
    confidence: 62.4,
    fields: [
      { key: 'brand', original: 'Freud / FRK-PLT', ai: 'Freud', status: 'pending' },
      { key: 'category', original: 'Router Bits Set (Wood)', ai: 'Router Bits', status: 'approved' }
    ]
  },
  {
    id: 'Q-902',
    sku: 'MKT-4200-KIT',
    issue: 'Missing Voltage Spec',
    confidence: 58.1,
    fields: [
      { key: 'voltage', original: '18v-20v max', ai: '18V', status: 'pending' }
    ]
  },
  {
    id: 'Q-903',
    sku: 'BOS-BSH180',
    issue: 'Category Mismatch',
    confidence: 68.9,
    fields: [
      { key: 'category', original: 'Band Saws', ai: 'Cordless Drills', status: 'pending' }
    ]
  }
];

const ReviewQueue = () => {
  const [queue, setQueue] = useState(initialQueue);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (itemId, fieldKey, action) => {
    setQueue(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedFields = item.fields.map(f => 
          f.key === fieldKey ? { ...f, status: action } : f
        );
        return { ...item, fields: updatedFields };
      }
      return item;
    }).filter(item => item.fields.some(f => f.status === 'pending')));
    
    showToast(`Item ${action === 'approved' ? 'approved' : 'rejected'} successfully`, action);
  };

  if (queue.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400">
        <ShieldAlert className="w-16 h-16 mb-4 text-industrial-success opacity-50" />
        <h2 className="text-xl font-bold text-white mb-2">Queue Empty</h2>
        <p>All flagged items have been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto animate-fade-in relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-sm shadow-xl border font-bold text-sm flex items-center gap-2 animate-fade-in z-50 ${
          toast.type === 'approved' ? 'bg-industrial-success/20 border-industrial-success/50 text-industrial-success' : 'bg-industrial-warning/20 border-industrial-warning/50 text-industrial-warning'
        }`}>
          {toast.type === 'approved' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-industrial-warning" />
              Human-in-the-Loop Review Queue
            </h2>
            <p className="text-xs text-slate-400 mt-1">Resolve low-confidence extractions to train the AI model.</p>
          </div>
          <div className="px-3 py-1 bg-industrial-900 border border-industrial-700 rounded-sm text-xs font-bold text-industrial-warning">
            {queue.length} Pending
          </div>
        </div>

        <div className="space-y-4">
          {queue.map((item, idx) => (
            <div key={item.id} className="glass-panel border-l-4 border-l-industrial-warning p-5 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{item.sku}</h3>
                  <p className="text-xs text-industrial-warning mt-0.5">{item.issue} (Confidence: {item.confidence}%)</p>
                </div>
              </div>

              <div className="space-y-3">
                {item.fields.filter(f => f.status === 'pending').map((field) => (
                  <div key={field.key} className="bg-industrial-900/50 border border-industrial-700 rounded-sm p-3 flex items-center justify-between group">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Original Input ({field.key})</span>
                        <span className="text-xs text-slate-400 line-through">{field.original}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-industrial-accent uppercase mb-1">AI Suggestion</span>
                        <input 
                          id={`input-${item.id}-${field.key}`}
                          type="text" 
                          defaultValue={field.ai}
                          className="bg-transparent text-sm font-bold text-white border-b border-dashed border-industrial-500 focus:outline-none focus:border-industrial-accent w-full transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleAction(item.id, field.key, 'rejected')} className="p-1.5 rounded bg-industrial-800 hover:bg-industrial-warning/20 text-slate-400 hover:text-industrial-warning transition-colors" title="Reject & Revert">
                        <X className="w-4 h-4" />
                      </button>
                      <button onClick={() => document.getElementById(`input-${item.id}-${field.key}`)?.focus()} className="p-1.5 rounded bg-industrial-800 hover:bg-industrial-accent/20 text-slate-400 hover:text-industrial-accent transition-colors" title="Edit manually">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction(item.id, field.key, 'approved')} className="p-1.5 rounded bg-industrial-800 hover:bg-industrial-success/20 text-slate-400 hover:text-industrial-success transition-colors" title="Approve">
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewQueue;
