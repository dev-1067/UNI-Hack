import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { useBatch } from '../context/BatchContext';

const StatusVerticalStack = ({ onFilter }) => {
  const [active, setActive] = useState(null);
  const { batchStats } = useBatch();

  const handleClick = (key) => {
    const next = active === key ? null : key;
    setActive(next);
    if (onFilter) onFilter(next);
  };

  const segments = [
    { key: 'flagged',    label: 'Flagged',         count: batchStats.flagged,  pct: ((batchStats.flagged / batchStats.totalSkus) * 100).toFixed(1) + '%', color: '#EF4444', textColor: '#fff' },
    { key: 'low-conf',  label: 'Low Confidence',  count: batchStats.lowConf,  pct: ((batchStats.lowConf / batchStats.totalSkus) * 100).toFixed(1) + '%', color: '#F97316', textColor: '#fff' },
    { key: 'processing',label: 'Processing',       count: batchStats.processing, pct: ((batchStats.processing / batchStats.totalSkus) * 100).toFixed(1) + '%', color: '#F59E0B', textColor: '#fff' },
    { key: 'verified',  label: 'Verified',         count: batchStats.verified, pct: ((batchStats.verified / batchStats.totalSkus) * 100).toFixed(1) + '%', color: '#10B981', textColor: '#fff' },
  ];

  return (
    <div className="glass-panel p-5 animate-fade-in mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-4 h-4 text-accent-cyan" />
        <h3 className="text-[13px] font-bold text-white uppercase tracking-wider">Pipeline Flow Status</h3>
      </div>
      
      {/* Total */}
      <div className="flex items-center justify-between bg-cmd-800 border border-white/5 rounded-sm p-3 mb-4">
        <p className="text-[11px] text-slate-500 uppercase font-bold">Total Batch Size</p>
        <p className="text-xl font-black text-white">{batchStats.totalSkus} <span className="text-[10px] text-slate-400 font-normal">SKUs</span></p>
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
