import React, { useState } from 'react';
import {
  Package, ShieldCheck, Clock, TrendingUp,
  AlertTriangle, ArrowUpRight, MapPin,
  Thermometer, Wind, Droplets, CloudRain, ExternalLink
} from 'lucide-react';
import StatusVerticalStack from './StatusPulseBar';

/* ── KPI Cards ── */
const kpiData = [
  {
    id: 1, title: 'Total SKUs Processed',
    value: '14,208', delta: '+12% this period',
    icon: Package, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10', border: 'border-t-accent-cyan', grad: 'from-accent-cyan/10',
  },
  {
    id: 2, title: 'AI Confidence Score',
    value: '98.4%', delta: 'Zero-Hallucination Active',
    icon: ShieldCheck, color: 'text-status-low', bg: 'bg-status-low/10', border: 'border-t-status-low', grad: 'from-status-low/10',
  },
  {
    id: 3, title: 'Hours Saved vs Manual',
    value: '3,450 hrs', delta: '+8.3% vs prev week',
    icon: Clock, color: 'text-status-moderate', bg: 'bg-status-moderate/10', border: 'border-t-status-moderate', grad: 'from-status-moderate/10',
  },
  {
    id: 4, title: 'Active Review Queue',
    value: '2,452', delta: 'Mesh: Connected to FastAPI',
    icon: TrendingUp, color: 'text-accent-fuchsia', bg: 'bg-accent-fuchsia/10', border: 'border-t-accent-fuchsia', grad: 'from-accent-fuchsia/10',
  },
];

/* ── SKU Leaderboard ── */
const leaderboard = [
  { rank: 1, sku: 'DCB518ASTS06G', brand: 'Diablo',   status: 'FLAGGED',    score: '85.5%', velocity: '+12.5%', category: 'Saw Blades',       rain: '112.5mm' },
  { rank: 2, sku: 'FRK-T8-PRO',    brand: 'Freud',    status: 'LOW-CONF',  score: '72.0%', velocity: '+14.2%', category: 'Router Bits',      rain: '45.0mm'  },
  { rank: 3, sku: 'MKT-4200-KIT',  brand: 'Makita',   status: 'LOW-CONF',  score: '68.0%', velocity: '+8.1%',  category: 'Power Tool Kits',  rain: '33.0mm'  },
  { rank: 4, sku: 'BOS-BSH180',    brand: 'Bosch',    status: 'FLAGGED',   score: '80.0%', velocity: '+15.0%', category: 'Cordless Drills',  rain: '90.0mm'  },
];

const badgeClass = (s) => {
  if (s === 'FLAGGED')   return 'badge-critical';
  if (s === 'LOW-CONF') return 'badge-high';
  if (s === 'VERIFIED') return 'badge-low';
  return 'badge-moderate';
};

/* ── Live Metrics sidebar ── */
const liveMetrics = [
  { label: 'API Temp',    val: '22.5°C',  icon: Thermometer, note: 'feels 24.7°' },
  { label: 'Match Rate',  val: '90%',     icon: Droplets,    note: 'LOV compliance' },
  { label: 'Req/s',       val: '14.3 rps',icon: Wind,        note: 'FastAPI throughput' },
  { label: 'Queue Delta', val: '0 new',   icon: CloudRain,   note: 'Last 10 min' },
];

/* ── Source Preview ── */
const hotspots = [
  { x: '52%', y: '35%', count: 18, label: 'dewalt.com' },
  { x: '38%', y: '52%', count: 14, label: 'diablo-tools.com' },
  { x: '65%', y: '48%', count: 11, label: 'makitatools.com' },
  { x: '28%', y: '30%', count: 8,  label: 'boschtools.com' },
  { x: '72%', y: '62%', count: 6,  label: 'freudtools.com' },
];

const OverviewDashboard = ({ setActiveView }) => {
  const [filter, setFilter] = useState(null);

  return (
    <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* ── Header: Live Batch Selector ── */}
        <div className="flex items-center justify-between bg-gradient-to-r from-accent-cyan/10 via-transparent to-transparent border border-accent-cyan/20 p-4 rounded-sm shadow-[inset_4px_0_0_var(--color-accent-cyan)]">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-accent-cyan/20 border border-accent-cyan/30 rounded-sm shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <MapPin className="w-5 h-5 text-accent-cyan" />
            </div>
            <div>
              <select className="bg-transparent text-white font-black text-xl outline-none cursor-pointer tracking-wide appearance-none">
                <option>Batch #2026-08-20 (Live)</option>
                <option>Batch #2026-08-19</option>
                <option>Batch #2026-08-18</option>
              </select>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-status-online animate-ping" />
                <p className="text-[11px] text-accent-cyan font-mono font-bold tracking-widest uppercase">Live Feed Ingestion Active</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-sm bg-accent-cyan text-white text-[12px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center gap-2">
              <Wind className="w-4 h-4" /> Pipeline Running
            </div>
          </div>
        </div>

        {/* ── ROW 1: KPI Grid (4 cols) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((k, i) => (
            <div
              key={k.id}
              className={`glass-panel p-5 animate-fade-in flex flex-col justify-between border-t-2 bg-gradient-to-br ${k.grad} to-transparent overflow-hidden relative group`}
              style={{ animationDelay: `${i * 80}ms`, minHeight: '130px' }}
            >
              <div className={`absolute top-0 left-0 w-full h-0.5 bg-current ${k.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="flex items-start justify-between mb-2 relative z-10">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest w-2/3 leading-tight">{k.title}</p>
                <div className={`p-1.5 rounded-sm ${k.bg} shadow-sm group-hover:scale-110 transition-transform`}>
                  <k.icon className={`w-4 h-4 ${k.color}`} />
                </div>
              </div>
              <div className="relative z-10">
                <p className={`text-3xl font-black ${k.color} font-mono tracking-tight drop-shadow-sm`}>{k.value}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wide">{k.delta}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── ROW 2: Main Layout (8 cols left / 4 cols right) ── */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* LEFT COLUMN (Span 8) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Heatmap/Map */}
            <div className="glass-panel p-5 animate-fade-in" style={{ animationDelay: '320ms' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-[13px] font-bold text-white uppercase tracking-wider">Geospatial Origin Map</h3>
                  <p className="text-[10px] text-slate-500">Real-time telemetry of source distributors</p>
                </div>
                <button
                  onClick={() => setActiveView('heatmap')}
                  className="text-[11px] text-accent-cyan hover:underline flex items-center gap-1 font-mono uppercase tracking-wider"
                >
                  Fullscreen <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Map Container */}
              <div className="relative bg-cmd-950 border border-white/5 overflow-hidden rounded-sm" style={{ height: 260 }}>
                {/* Tech grid overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-10">
                  {[20,40,60,80].map((p) => (
                    <React.Fragment key={p}>
                      <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="#6366F1" strokeWidth="1" />
                      <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="#6366F1" strokeWidth="1" />
                    </React.Fragment>
                  ))}
                </svg>

                {hotspots.map((h, i) => (
                  <div
                    key={h.label}
                    className="absolute flex flex-col items-center animate-fade-in"
                    style={{
                      left: h.x, top: h.y,
                      transform: 'translate(-50%,-50%)',
                      animationDelay: `${i * 100}ms`
                    }}
                  >
                    <div
                      className="flex items-center justify-center font-black text-white shadow-lg relative"
                      style={{
                        width: Math.max(30, h.count * 2),
                        height: Math.max(30, h.count * 2),
                        background: `rgba(99,102,241,${0.3 + h.count * 0.02})`,
                        border: '1px solid rgba(99,102,241,0.8)',
                        fontSize: h.count > 12 ? 12 : 10,
                      }}
                    >
                      <div className="absolute inset-0 border border-accent-cyan/50 animate-ping" />
                      {h.count}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 font-mono whitespace-nowrap bg-cmd-900/80 px-1">{h.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="glass-panel p-5 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white uppercase tracking-wider">Extraction Anomaly Board</h3>
                <button
                  onClick={() => setActiveView('sku-matrix')}
                  className="text-[11px] text-accent-cyan hover:underline flex items-center gap-1 font-mono uppercase tracking-wider"
                >
                  View Matrix <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {leaderboard.map((row, i) => (
                  <div key={row.sku}
                    className="flex items-center gap-4 p-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-sm animate-fade-in"
                    style={{ animationDelay: `${(i + 5) * 80}ms` }}
                  >
                    <span className="text-[11px] font-mono font-bold text-slate-500 w-6 shrink-0">{String(row.rank).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[13px] font-bold text-white font-mono">{row.sku}</span>
                        <span className={badgeClass(row.status)}>{row.status}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                        {row.brand} // {row.category}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[14px] font-black text-white font-mono">{row.score}</p>
                      <p className="text-[9px] text-accent-cyan font-bold uppercase tracking-wider mt-0.5">Conf</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* RIGHT COLUMN (Span 4) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Vertical Status Stack */}
            <StatusVerticalStack onFilter={setFilter} />

            {/* Live API Metrics */}
            <div className="glass-panel p-5 animate-fade-in" style={{ animationDelay: '480ms' }}>
              <p className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">Ingestion Telemetry</p>
              <div className="space-y-3">
                {liveMetrics.map((m) => (
                  <div key={m.label} className="bg-cmd-950/50 border border-white/5 rounded-sm p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white/5 rounded-sm"><m.icon className="w-3.5 h-3.5 text-slate-400" /></div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{m.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-black text-white font-mono">{m.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Box */}
            <div className="glass-panel p-5 bg-accent-cyan/5 border-accent-cyan/20 animate-fade-in" style={{ animationDelay: '560ms' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-accent-cyan uppercase tracking-widest">Manual Override</p>
                <AlertTriangle className="w-4 h-4 text-accent-cyan" />
              </div>
              <p className="text-[20px] font-black text-white mb-1 leading-tight">14 Items Flagged</p>
              <p className="text-[11px] text-slate-400 mb-4">Requires human-in-the-loop validation for Bosch anomalies.</p>
              <button 
                onClick={() => setActiveView('review-queue')}
                className="w-full bg-accent-cyan text-cmd-900 font-bold text-[11px] tracking-widest uppercase py-2.5 rounded-sm hover:bg-white transition-colors"
              >
                Open Review Queue
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
