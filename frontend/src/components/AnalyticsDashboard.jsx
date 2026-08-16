import React, { useState } from 'react';
import { BarChart3, Database, Clock, ShieldAlert } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7'); // '7' or '30'

  const metrics = [
    { id: 1, title: 'Total Documents', value: timeRange === '7' ? '14,208' : '48,932', subtitle: '+12% this period', icon: Database, color: 'text-industrial-accent' },
    { id: 2, title: 'AI Confidence', value: '98.4%', subtitle: 'Zero-Hallucination Active', icon: ShieldAlert, color: 'text-industrial-success' },
    { id: 3, title: 'Hours Saved', value: timeRange === '7' ? '3,450' : '12,890', subtitle: 'vs. Manual Entry', icon: Clock, color: 'text-industrial-warning' },
    { id: 4, title: 'API Requests', value: timeRange === '7' ? '89.2k' : '312.4k', subtitle: 'FastAPI Backend', icon: BarChart3, color: 'text-purple-400' },
  ];

  // Mock data sets
  const data7Days = [40, 60, 30, 80, 50, 90, 70];
  const data30Days = Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 20); // 30 random bars

  const chartData = timeRange === '7' ? data7Days : data30Days;

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Global Analytics</h1>
          <p className="text-slate-400">Real-time overview of the UniHack Industrial AI Pipeline.</p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, idx) => (
            <div 
              key={metric.id} 
              className="glass-panel p-6 replit-transition hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(56,189,248,0.15)] animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-industrial-900 border border-industrial-700/50 ${metric.color}`}>
                  <metric.icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-4xl font-black text-white mb-1">{metric.value}</h3>
              <p className="text-sm font-semibold text-slate-300 mb-1">{metric.title}</p>
              <p className="text-xs text-slate-500 font-medium">{metric.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Main Chart Area (Mock) */}
        <div className="glass-panel p-6 h-96 flex flex-col justify-center items-center animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="w-full flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Extraction Throughput (Last {timeRange} Days)</h3>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-industrial-900 border border-industrial-700 text-sm text-slate-300 rounded px-3 py-1 outline-none"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 w-full flex items-end justify-between gap-1 px-4 pb-4">
            {/* Dynamic Bar Chart */}
            {chartData.map((height, i) => (
              <div key={`${timeRange}-${i}`} className="w-full bg-industrial-800 rounded-t-sm relative group hover:bg-industrial-700 transition-colors" style={{ height: '100%' }}>
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-industrial-accent rounded-t-sm transition-all duration-1000 group-hover:bg-sky-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]" 
                  style={{ height: `0%` }} // start at 0
                  ref={el => {
                    if (el) setTimeout(() => el.style.height = `${height}%`, 50); // animate to height
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;
