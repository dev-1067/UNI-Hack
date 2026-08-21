import React, { useState, useRef, useEffect } from 'react';
import { Activity, TrendingUp, Zap, Target, Brain } from 'lucide-react';

/* ── Animated Bar Chart ── */
const BarChart = ({ data, colors, labels, height = 140 }) => {
  const max = Math.max(...data, 1);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex items-end gap-1.5 w-full" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full relative flex-1 flex items-end">
            <div className="w-full bg-cmd-800 rounded-t-sm relative overflow-hidden" style={{ height: '100%' }}>
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-sm transition-all duration-700 ease-out"
                style={{ height: mounted ? `${(v / max) * 100}%` : '0%', background: colors?.[i] ?? '#38BDF8', opacity: 0.85 }}
              />
            </div>
          </div>
          {labels && <span className="text-[9px] text-slate-500 truncate w-full text-center">{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
};

/* ── Line Sparkline ── */
const Sparkline = ({ data, color = '#38BDF8', height = 60 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = ((max - v) / (max - min || 1)) * 100;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }}>
      <polyline fill="none" stroke={color} strokeWidth="2.5" points={pts} vectorEffect="non-scaling-stroke" />
      <polyline fill={color + '22'} stroke="none"
        points={`0,100 ${pts} 100,100`} />
    </svg>
  );
};

/* ── RadialGauge ── */
const RadialGauge = ({ pct, color, label, value }) => {
  const r = 40, circ = 2 * Math.PI * r;
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const dash = mounted ? (pct / 100) * circ : 0;
  
  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1E2D42" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.22,1,.36,1)' }}
        />
        <text x="50" y="54" textAnchor="middle" fill="white" fontSize="16" fontWeight="900">{mounted ? value : '0%'}</text>
      </svg>
      <p className="text-[11px] text-slate-400 mt-1 text-center">{label}</p>
    </div>
  );
};

const weekLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const confData   = [92, 95, 98, 94, 99, 97, 98];
const throughput = [40, 60, 55, 80, 70, 90, 85];
const lovData    = [88, 91, 95, 93, 97, 96, 98];
const latData    = [420, 380, 350, 310, 290, 270, 312];

import { useBatch } from '../context/BatchContext';

const statusColors = ['#C41E3A','#E85D04','#F59E0B','#10B981'];
const statusLabels = ['Flagged','Low-Conf','Processing','Verified'];

const DeepAnalytics = () => {
  const { batchStats } = useBatch();
  const [tab, setTab] = useState('accuracy');
  const [timeRange, setTimeRange] = useState('7D');

  const statusData = [batchStats.flagged, batchStats.lowConf, batchStats.processing, batchStats.verified];

  const tabs = [
    { id: 'accuracy',   label: 'Accuracy Trends' },
    { id: 'throughput', label: 'Extraction Velocity' },
    { id: 'lov',        label: 'LOV Compliance' },
    { id: 'latency',    label: 'Latency Profile' },
  ];

  // Mock data adjustment for 30D
  const getExtendedData = (data) => {
    if (timeRange === '7D') return data;
    // Generate 30 days of data by repeating and varying
    const extended = [];
    for (let i=0; i<30; i++) extended.push(data[i % data.length] * (0.8 + Math.random() * 0.4));
    return extended;
  };

  const getExtendedLabels = () => {
    if (timeRange === '7D') return weekLabels;
    return ['1', '5', '10', '15', '20', '25', '30']; // Simplified 30d axis
  };

  const chartData = {
    accuracy:   { data: getExtendedData(confData),   label: 'Confidence %', color: '#38BDF8' },
    throughput: { data: getExtendedData(throughput), label: 'SKUs/hr',       color: '#10B981' },
    lov:        { data: getExtendedData(lovData),    label: 'LOV Match %',   color: '#F59E0B' },
    latency:    { data: getExtendedData(latData),    label: 'Avg ms',        color: '#C41E3A' },
  };

  const current = chartData[tab];
  const axisLabels = getExtendedLabels();

  return (
    <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Title */}
        <div>
          <h2 className="text-xl font-black text-white">Deep Analytics & ML Telemetry</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">District multi-axis AI telemetry & confidence projections</p>
        </div>

        {/* KPI Gauges */}
        <div className="glass-panel p-6">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-5">Pipeline Health Radials</p>
          <div className="flex justify-around flex-wrap gap-6">
            <RadialGauge pct={98} color="#38BDF8"  label="AI Confidence"    value="98%" />
            <RadialGauge pct={90} color="#10B981"  label="LOV Compliance"   value="90%" />
            <RadialGauge pct={76} color="#F59E0B"  label="Throughput Util"  value="76%" />
            <RadialGauge pct={22} color="#C41E3A"  label="Flagged Rate"     value="22%" />
            <RadialGauge pct={95} color="#8B5CF6"  label="Source Match"     value="95%" />
          </div>
        </div>

        {/* Main Chart + Distribution */}
        <div className="grid grid-cols-12 gap-4">
          {/* Main line chart */}
          <div className="col-span-12 lg:col-span-8 glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[13px] font-bold text-white flex items-center gap-2">
                  {current.label} 
                  <span className="text-slate-500 font-normal">—</span>
                  <select 
                    value={timeRange} 
                    onChange={e => setTimeRange(e.target.value)}
                    className="bg-cmd-900 border border-white/10 rounded text-xs px-2 py-0.5 outline-none cursor-pointer text-accent-cyan"
                  >
                    <option value="7D">Last 7 Days</option>
                    <option value="30D">Last 30 Days</option>
                  </select>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Real-time AI pipeline metrics</p>
              </div>
              <div className="flex gap-1 bg-cmd-900 rounded-sm p-1 border border-white/5">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${tab === t.id ? 'bg-accent-cyan/20 text-accent-cyan' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <Sparkline data={current.data} color={current.color} height={120} />
            <div className="flex justify-between mt-2">
              {axisLabels.map(l => <span key={l} className="text-[10px] text-slate-600">{l}</span>)}
            </div>
          </div>

          {/* Batch Distribution */}
          <div className="col-span-12 lg:col-span-4 glass-panel p-5">
            <p className="text-[13px] font-bold text-white mb-4">Batch Status Distribution</p>
            <BarChart data={statusData} colors={statusColors} labels={statusLabels} height={120} />
            <div className="mt-4 space-y-2">
              {statusLabels.map((l, i) => (
                <div key={l} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: statusColors[i] }} />
                    <span className="text-[12px] text-slate-400">{l}</span>
                  </div>
                  <span className="text-[12px] font-bold text-white">{statusData[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confidence histogram */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-accent-cyan" />
            <p className="text-[13px] font-bold text-white">Confidence Distribution Histogram</p>
            <span className="text-[10px] text-slate-500 ml-2">AI-generated field confidence across all SKUs</span>
          </div>
          <BarChart
            data={[2, 3, 5, 8, 12, 20, 35, 42, 38, 25, 14, 6, 3]}
            labels={['50%','55%','60%','65%','70%','75%','80%','85%','90%','93%','96%','98%','99%+']}
            height={110}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] text-slate-500">Peak confidence cluster: <span className="text-white font-bold">85–90%</span></span>
            <span className="text-[11px] text-status-low font-bold">Zero-Hallucination Active ✓</span>
          </div>
        </div>

        {/* AI Projections table */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-status-moderate" />
            <p className="text-[13px] font-bold text-white">AI Projection — Next 7 Days</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full cmd-table text-center">
              <thead>
                <tr>
                  {['Day','Expected SKUs','Projected Confidence','Flagged Estimate','LOV Compliance','API Load'].map(h => (
                    <th key={h} className="text-center">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Aug 21', '180', '97.8%', '14', '91%', '72%'],
                  ['Aug 22', '210', '98.1%', '11', '93%', '78%'],
                  ['Aug 23', '195', '97.4%', '16', '90%', '69%'],
                  ['Aug 24', '225', '98.5%', '9',  '95%', '82%'],
                  ['Aug 25', '250', '98.9%', '7',  '96%', '87%'],
                ].map((row, i) => (
                  <tr key={i}>
                    {row.map((c, j) => (
                      <td key={j} className="text-center font-semibold text-slate-300">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepAnalytics;
