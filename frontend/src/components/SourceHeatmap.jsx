import React, { useState } from 'react';
import { Layers, BarChart2 } from 'lucide-react';

const brands = [
  { name: 'DeWalt',          x: 52, y: 38, hits: 18, color: '#C41E3A' },
  { name: 'Diablo',          x: 38, y: 54, hits: 14, color: '#E85D04' },
  { name: 'Makita',          x: 65, y: 50, hits: 11, color: '#E85D04' },
  { name: 'Bosch',           x: 28, y: 32, hits: 8,  color: '#F59E0B' },
  { name: 'Freud',           x: 72, y: 65, hits: 6,  color: '#F59E0B' },
  { name: '3M',              x: 20, y: 70, hits: 5,  color: '#10B981' },
  { name: 'Milwaukee',       x: 80, y: 25, hits: 9,  color: '#E85D04' },
  { name: 'Ridgid',          x: 55, y: 75, hits: 4,  color: '#10B981' },
  { name: 'Stanley',         x: 43, y: 20, hits: 7,  color: '#F59E0B' },
  { name: 'Black+Decker',    x: 85, y: 55, hits: 3,  color: '#10B981' },
];

const scrapeLog = [
  { time: '22:07', sku: 'DCB518ASTS06G', url: 'dewalt.com/p/DCB518',        status: 'SUCCESS', ms: 312 },
  { time: '22:06', sku: 'BOS-BSH180',    url: 'boschtools.com/p/BSH180',   status: 'SUCCESS', ms: 428 },
  { time: '22:05', sku: 'FRK-T8-PRO',    url: 'freudtools.com/t8-pro',     status: 'RETRY',   ms: 892 },
  { time: '22:04', sku: 'MKT-4200-KIT',  url: 'makitatools.com/4200',      status: 'SUCCESS', ms: 271 },
  { time: '22:03', sku: 'KLH-T5-SET',    url: '3mtools.com/t5-set',        status: 'FAILED',  ms: 5001 },
];

const timelinePoints = ['–30d History', '–20d', '–10d', 'Today (Live)', '+7d Forecast', '+14d Spatial Forecast'];

const SourceHeatmap = () => {
  const [sliderVal, setSliderVal] = useState(3);
  const [showRainfall, setShowRainfall] = useState(true);
  const [showPHC, setShowPHC] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleExportGIS = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ hotspots: brands, timestamp: Date.now() }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "unilog_gis_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-4">

        {/* Temporal Time Scrubber */}
        <div className="glass-panel p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-accent-cyan" />
              <span className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">Temporal Time-Scrubber:</span>
              <span className="text-[12px] font-bold text-accent-cyan">{timelinePoints[sliderVal]}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] text-slate-500">Layers:</span>
              <button
                onClick={() => setShowRainfall(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${showRainfall ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40' : 'bg-cmd-800 text-slate-400 border border-white/10'}`}
              >
                ☁ Scrape Density Overlay
              </button>
              <button
                onClick={() => setShowPHC(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${showPHC ? 'bg-status-low/20 text-status-low border border-status-low/40' : 'bg-cmd-800 text-slate-400 border border-white/10'}`}
              >
                🏭 Manufacturer Hubs
              </button>
              <button onClick={handleExportGIS} className="px-3 py-1 bg-cmd-800 hover:bg-cmd-700 text-white border border-white/10 text-[11px] font-bold rounded-sm ml-2">
                Export GIS Data
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range" min={0} max={5} value={sliderVal}
              onChange={e => setSliderVal(Number(e.target.value))}
              className="w-full accent-accent-cyan cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              {timelinePoints.map((t, i) => (
                <span key={i} className={`text-[9px] ${i === sliderVal ? 'text-accent-cyan font-bold' : 'text-slate-600'}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Map + Focus Panel */}
        <div className="grid grid-cols-12 gap-4">
          {/* Bubble Map */}
          <div className="col-span-12 lg:col-span-8 glass-panel p-4">
            <div className="relative bg-cmd-950 rounded-sm overflow-hidden" style={{ height: 360 }}>
              
              {/* Zoom buttons */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
                <button onClick={() => setZoom(z => Math.min(z + 0.5, 3))} className="w-7 h-7 bg-cmd-800 border border-white/10 rounded text-white text-lg flex items-center justify-center hover:bg-cmd-700 transition-colors font-black">+</button>
                <button onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))} className="w-7 h-7 bg-cmd-800 border border-white/10 rounded text-white text-lg flex items-center justify-center hover:bg-cmd-700 transition-colors font-black">−</button>
              </div>

              {/* Scalable Map Area */}
              <div className="absolute inset-0 origin-center transition-transform duration-500" style={{ transform: `scale(${zoom})` }}>
                {/* SVG grid */}
                <svg className="absolute inset-0 w-full h-full opacity-10">
                  {[10,20,30,40,50,60,70,80,90].map(p => (
                    <React.Fragment key={p}>
                      <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="#38BDF8" strokeWidth="0.5"/>
                      <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="#38BDF8" strokeWidth="0.5"/>
                    </React.Fragment>
                  ))}
                </svg>

                {/* Animated brand bubbles */}
                {brands.map((b, i) => {
                  const size = Math.max(32, b.hits * 3.2);
                  return (
                    <div key={b.name}
                      className="absolute flex flex-col items-center animate-fade-in group cursor-pointer"
                      style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translate(-50%,-50%)', animationDelay: `${i*80}ms` }}
                    >
                      <div
                        className="rounded-full flex items-center justify-center text-white font-black shadow-lg transition-transform group-hover:scale-110"
                        style={{
                          width: size, height: size,
                          background: b.color + 'BB',
                          border: `2px solid ${b.color}`,
                          fontSize: b.hits > 12 ? 13 : 11,
                          boxShadow: `0 0 ${b.hits}px ${b.color}55`,
                        }}
                      >
                        {b.hits}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 bg-cmd-900/80 px-1 rounded">{b.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Labels */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-status-online animate-live-dot" />
                <span className="text-[10px] text-slate-500">Leaflet WebGL Engine</span>
              </div>
            </div>
          </div>

          {/* Focus Panel (Risk Thresholds equivalent) */}
          <div className="col-span-12 lg:col-span-4 glass-panel p-4 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Focus Brands (8 Shown)</p>
              <div className="flex flex-wrap gap-1.5">
                {brands.slice(0,8).map(b => (
                  <span key={b.name}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold text-white"
                    style={{ background: b.color + '44', border: `1px solid ${b.color}77` }}
                  >
                    {b.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                Risk Thresholds <span className="text-accent-cyan">IDSP v2.4</span>
              </p>
              {[
                { label: 'Critical', val: '> 15 hits',    color: '#C41E3A' },
                { label: 'High',     val: '8.55 – 14',    color: '#E85D04' },
                { label: 'Moderate', val: '4.35 – 8.54',  color: '#F59E0B' },
                { label: 'Low',      val: '< 4.35',       color: '#10B981' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                    <span className="text-[12px] text-slate-300">{r.label}</span>
                  </div>
                  <span className="text-[12px] font-mono text-slate-400">{r.val}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Active Scrape Radius</p>
              <p className="text-[24px] font-black text-white">11 <span className="text-sm font-normal text-slate-500">Hotspots</span></p>
            </div>
          </div>
        </div>

        {/* Live Scrape Log */}
        <div className="glass-panel p-5">
          <p className="text-[13px] font-bold text-white mb-3">Live Scrape Activity Log</p>
          <div className="space-y-2">
            {scrapeLog.map((e, i) => (
              <div key={i} className="flex items-center gap-4 p-2.5 rounded-sm bg-cmd-800/50 hover:bg-cmd-700/50 transition-colors animate-fade-in" style={{ animationDelay: `${i*60}ms` }}>
                <span className="text-[11px] font-mono text-slate-500 w-12 shrink-0">{e.time}</span>
                <span className="text-[12px] font-bold text-white w-36 shrink-0 truncate">{e.sku}</span>
                <span className="text-[11px] text-slate-400 flex-1 truncate font-mono">{e.url}</span>
                <span className={`text-[11px] font-bold shrink-0 ${e.status === 'SUCCESS' ? 'text-status-low' : e.status === 'RETRY' ? 'text-status-moderate' : 'text-status-critical'}`}>
                  {e.status}
                </span>
                <span className="text-[11px] font-mono text-slate-500 shrink-0">{e.ms}ms</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceHeatmap;
