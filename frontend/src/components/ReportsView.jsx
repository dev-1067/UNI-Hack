import React, { useState } from 'react';
import { FileText, Download, Eye, CheckCircle, Clock, Calendar, Printer } from 'lucide-react';

const reports = [
  {
    id: 'R-2026-08-20',
    title: 'Official Pipeline Record Bulletin',
    subtitle: 'Full 252-Column Extraction Report — Aug 20, 2026',
    type: 'CSV Export',
    skus: 36,
    status: 'Ready',
    generated: '22:07, Aug 20',
    size: '4.2 MB',
  },
  {
    id: 'R-2026-08-19',
    title: 'Daily Audit Log — Aug 19',
    subtitle: 'Confidence scores, flagged items, source URL proof',
    type: 'PDF Report',
    skus: 42,
    status: 'Ready',
    generated: '23:59, Aug 19',
    size: '2.8 MB',
  },
  {
    id: 'R-2026-08-18',
    title: 'Weekly Velocity Summary',
    subtitle: '7-day throughput, LOV compliance, brand coverage',
    type: 'XLSX Report',
    skus: 280,
    status: 'Ready',
    generated: '00:01, Aug 19',
    size: '8.1 MB',
  },
  {
    id: 'R-2026-08-13',
    title: 'Flagged SKU Review Pack',
    subtitle: 'Items requiring human-in-the-loop intervention',
    type: 'PDF Report',
    skus: 14,
    status: 'Archived',
    generated: '09:15, Aug 13',
    size: '1.1 MB',
  },
];

const metrics = [
  { label: 'Reports Generated',  val: '128',     color: 'text-accent-cyan'   },
  { label: 'SKUs Exported',      val: '14,208',  color: 'text-status-low'    },
  { label: 'Hours Documented',   val: '3,450',   color: 'text-status-moderate' },
  { label: 'Compliance Rate',    val: '98.4%',   color: 'text-purple-400'    },
];

const ReportsView = () => {
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setToast('Report generated successfully!');
      setTimeout(() => setToast(null), 3000);
    }, 2200);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
      <div className="max-w-[1100px] mx-auto space-y-5">

        {/* Toast */}
        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-cmd-800 border border-status-low/40 rounded-full shadow-2xl animate-modal-pop">
            <CheckCircle className="w-4 h-4 text-status-low" />
            <span className="text-sm font-bold text-white">{toast}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Official Record Bulletins</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">Export, archive, and audit AI pipeline reports</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="tactile-button flex items-center gap-2 px-5 py-2.5 bg-accent-cyan text-cmd-900 font-black rounded-sm text-sm disabled:opacity-60"
          >
            {generating
              ? <><div className="w-4 h-4 border-2 border-cmd-900 border-t-transparent rounded-full animate-spin" /> Generating...</>
              : <><FileText className="w-4 h-4" /> Generate New Report</>
            }
          </button>
        </div>

        {/* Metric Bar */}
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="glass-panel p-4 animate-fade-in" style={{ animationDelay: `${i*60}ms` }}>
              <p className={`text-2xl font-black ${m.color}`}>{m.val}</p>
              <p className="text-[11px] text-slate-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Report List */}
        <div className="glass-panel overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-cmd-900/40">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Report Archive</p>
            <button className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-white transition-colors">
              <Calendar className="w-3.5 h-3.5" /> Filter by Date
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {reports.map((r, i) => (
              <div key={r.id}
                className="flex items-center gap-5 px-5 py-4 hover:bg-white/3 transition-colors animate-fade-in"
                style={{ animationDelay: `${i*60}ms` }}
              >
                <div className="p-2.5 bg-accent-cyan/10 rounded-sm shrink-0">
                  <FileText className="w-5 h-5 text-accent-cyan" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[14px] font-bold text-white truncate">{r.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.status === 'Ready' ? 'bg-status-low/15 text-status-low border border-status-low/30' : 'bg-slate-600/20 text-slate-500 border border-slate-600/30'}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{r.subtitle}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {r.generated}
                    </span>
                    <span className="text-[10px] text-slate-600">•</span>
                    <span className="text-[10px] text-slate-600">{r.skus} SKUs</span>
                    <span className="text-[10px] text-slate-600">•</span>
                    <span className="text-[10px] text-slate-600">{r.size}</span>
                    <span className="text-[10px] text-accent-cyan/70 font-semibold">{r.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => window.print()} className="p-2 hover:bg-white/5 rounded-sm text-slate-400 hover:text-white transition-colors" title="Preview">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => window.print()} className="p-2 hover:bg-white/5 rounded-sm text-slate-400 hover:text-white transition-colors" title="Print">
                    <Printer className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleGenerate()} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-cyan/15 border border-accent-cyan/30 rounded-sm text-accent-cyan text-[12px] font-semibold hover:bg-accent-cyan/25 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Query Panel (Clinical Protocols equivalent) */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">✨</span>
            <p className="text-[13px] font-bold text-white">Query AI Catalog Protocols</p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              id="ai-query-input"
              placeholder="e.g. What is the LOV for 'Thread Size' in Power Tools?"
              className="flex-1 bg-cmd-900 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white outline-none focus:border-accent-cyan transition-colors"
              onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
            />
            <button onClick={() => { document.getElementById('ai-query-input').value = ''; handleGenerate(); }} className="px-5 py-2.5 bg-accent-cyan text-cmd-900 font-black rounded-sm text-sm hover:bg-sky-400 transition-colors">
              Ask AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
