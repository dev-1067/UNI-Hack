import React, { useState } from 'react';
import { Layers } from 'lucide-react';

const segments = [
  { key: 'flagged',    label: 'Flagged',         count: 5,  pct: '13.9%', color: '#EF4444', textColor: '#fff' },
  { key: 'low-conf',  label: 'Low Confidence',  count: 9,  pct: '25.0%', color: '#F97316', textColor: '#fff' },
  { key: 'processing',label: 'Processing',       count: 10, pct: '27.8%', color: '#F59E0B', textColor: '#fff' },
  { key: 'verified',  label: 'Verified',         count: 12, pct: '33.3%', color: '#10B981', textColor: '#fff' },
];

const StatusVerticalStack = ({ onFilter }) => {
  const [active, setActive] = useState(null);

  const handleClick = (key) => {
    const next = active === key ? null : key;
    setActive(next);
    if (onFilter) onFilter(next);
  };

  return (
    <div className="glass-panel p-5 animate-fade-in mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-4 h-4 text-accent-cyan" />
        <h3 className="text-[13px] font-bold text-white uppercase tracking-wider">Pipeline Flow Status</h3>
      </div>
      
      {/* Total */}
      <div className="flex items-center justify-between bg-cmd-800 border border-white/5 rounded-sm p-3 mb-4">
        <p className="text-[11px] text-slate-500 uppercase font-bold">Total Batch Size</p>
        <p className="text-xl font-black text-white">36 <span className="text-[10px] text-slate-400 font-normal">SKUs</span></p>
      </div>

      <div className="space-y-2">
        {segments.map((seg) => {
          const isActive = active === seg.key;
          const opacity = active && !isActive ? 'opacity-40' : 'opacity-100';
          
          return (
            <div
              key={seg.key}
              onClick={() => handleClick(seg.key)}
              className={`flex items-center justify-between p-3 rounded-sm border cursor-pointer transition-all hover:bg-white/5 ${opacity}`}
              style={{
                borderColor: isActive ? seg.color : 'rgba(255,255,255,0.05)',
                borderLeftWidth: '4px',
                borderLeftColor: seg.color
              }}
            >
              <div>
                <p className="text-[12px] font-bold text-white">{seg.label}</p>
                <p className="text-[10px] text-slate-400">{seg.pct} of batch</p>
              </div>
              <p className="text-lg font-black" style={{ color: seg.color }}>{seg.count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusVerticalStack;
