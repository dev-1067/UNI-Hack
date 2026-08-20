import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, LayoutGrid, List } from 'lucide-react';

const allData = [
  { sku: 'DCB518ASTS06G', brand: 'Diablo Tools', status: 'FLAGGED',   score: 62.5, cases: 1245, velocity: '+12.5%', category: 'Saw Blades',       rain: 'PDF Spec', staff: 845 },
  { sku: 'BOS-BSH180',    brand: 'Bosch',        status: 'FLAGGED',   score: 68.0, cases: 980,  velocity: '+15.0%', category: 'Cordless Drills',  rain: 'CSV Bulk',  staff: 320 },
  { sku: 'FRK-T8-PRO',    brand: 'Freud',        status: 'LOW-CONF',  score: 82.2, cases: 850,  velocity: '+14.2%', category: 'Router Bits',      rain: 'Image OCR',  staff: 412 },
  { sku: 'MKT-4200-KIT',  brand: 'Makita',       status: 'LOW-CONF',  score: 88.1, cases: 610,  velocity: '+8.1%',  category: 'Power Tool Kits',  rain: 'PDF Spec',  staff: 295 },
  { sku: 'KLH-T5-SET',    brand: 'Kolhapure',    status: 'MODERATE',  score: 92.3, cases: 410,  velocity: '+13.3%', category: 'Screwdrivers',     rain: 'ERP API',  staff: 201 },
  { sku: 'NGP-C3-BLK',    brand: 'Nagpur',       status: 'MODERATE',  score: 94.5, cases: 320,  velocity: '-5.4%',  category: 'Chisels',          rain: 'Manual',  staff: 184 },
  { sku: 'SAT-D22-GRN',   brand: 'Satara',       status: 'VERIFIED',  score: 96.8, cases: 140,  velocity: '-2.1%',  category: 'Grinding Discs',   rain: 'Image OCR',  staff: 142 },
  { sku: 'NSK-B88-SLV',   brand: 'Nashik',       status: 'VERIFIED',  score: 98.9, cases: 95,   velocity: '0.0%',   category: 'Drill Bits',       rain: 'ERP API',   staff: 98  },
];

const statusBadge = (s) => {
  if (s === 'FLAGGED')  return 'badge-critical';
  if (s === 'LOW-CONF') return 'badge-high';
  if (s === 'MODERATE') return 'badge-moderate';
  return 'badge-low';
};

const ConfidenceRing = ({ score }) => {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let color = '#10B981'; // Green
  if (score < 90) color = '#F59E0B'; // Yellow
  if (score < 75) color = '#EF4444'; // Red

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg className="w-8 h-8 transform -rotate-90">
          <circle cx="16" cy="16" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="transparent" />
          <circle cx="16" cy="16" r={radius} stroke={color} strokeWidth="3" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-[9px] font-bold text-white">{Math.round(score)}</span>
      </div>
      <span className="text-[12px] font-bold text-white hidden md:inline" style={{ color }}>{score.toFixed(1)}%</span>
    </div>
  );
};

const SortIcon = ({ field, sortField, dir }) => {
  if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
  return dir === 'asc' ? <ArrowUp className="w-3 h-3 text-accent-cyan" /> : <ArrowDown className="w-3 h-3 text-accent-cyan" />;
};

const SKUMatrix = () => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('score');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const PER_PAGE = 8;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let d = allData.filter(r =>
      r.sku.toLowerCase().includes(search.toLowerCase()) ||
      r.brand.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
    );
    d.sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === 'string') va = va.replace(/[^0-9.-]/g, '') * 1 || va;
      if (typeof vb === 'string') vb = vb.replace(/[^0-9.-]/g, '') * 1 || vb;
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return d;
  }, [search, sortField, sortDir]);

  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const cols = [
    { key: 'sku',      label: 'SKU / Brand ↑' },
    { key: 'status',   label: 'Review Status' },
    { key: 'score',    label: 'AI Confidence ↕' },
    { key: 'category', label: 'Primary Category' },
    { key: 'rain',     label: 'Source Data ↕' },
  ];

  const handleExportCSV = () => {
    const headers = cols.map(c => c.label).join(',');
    const rows = filtered.map(row => `${row.sku},${row.status},${row.score},${row.category},${row.rain}`);
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unilog_sku_extract.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
          <div>
            <h2 className="text-xl font-black text-white">Product Extraction Catalog</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">Interactive catalog of {filtered.length} extracted items.</p>
          </div>
          <div className="flex gap-3 items-center">
            {/* Export CSV */}
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-cmd-800 hover:bg-cmd-700 text-white text-[13px] font-bold rounded-sm border border-white/10 transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>

            {/* View Toggles */}
            <div className="flex bg-cmd-800 rounded-sm p-1 border border-white/10">
              <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search SKU, brand, category..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                className="bg-cmd-800 border border-white/10 rounded-sm pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-accent-cyan w-64 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'table' ? (
          <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full cmd-table">
                <thead>
                  <tr className="bg-cmd-900/60">
                    {cols.map(c => (
                      <th key={c.key} onClick={() => handleSort(c.key)} className="select-none cursor-pointer hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-1.5">
                          {c.label}
                          <SortIcon field={c.key} sortField={sortField} dir={sortDir} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((row, i) => (
                    <tr key={row.sku} className="animate-fade-in group" style={{ animationDelay: `${i * 40}ms` }}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center shrink-0">
                            <span className="text-white/50 text-[10px] font-bold">IMG</span>
                          </div>
                          <div>
                            <p className="font-bold text-white text-[13px] group-hover:text-accent-cyan transition-colors">{row.sku}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{row.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={statusBadge(row.status)}>{row.status}</span>
                      </td>
                      <td>
                        <ConfidenceRing score={row.score} />
                      </td>
                      <td className="text-slate-300">{row.category}</td>
                      <td className="text-slate-400 text-[12px]">{row.rain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paged.map((row, i) => (
              <div key={row.sku} className="glass-panel p-4 flex flex-col gap-4 animate-fade-in hover:border-accent-cyan/50 transition-colors cursor-pointer group" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-cmd-900 border border-white/10 rounded-sm flex items-center justify-center">
                    <span className="text-white/50 text-[10px] font-bold">IMG</span>
                  </div>
                  <span className={statusBadge(row.status)}>{row.status}</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-[14px] group-hover:text-accent-cyan transition-colors">{row.sku}</h3>
                  <p className="text-[12px] text-slate-400 mt-1">{row.brand} • {row.category}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">{row.rain}</span>
                  <ConfidenceRing score={row.score} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 px-4 py-3 glass-panel flex items-center justify-between">
          <p className="text-[12px] text-slate-500">
            Showing {Math.min(page * PER_PAGE + 1, filtered.length)}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length} items
          </p>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-[12px] bg-cmd-800 border border-white/10 rounded-sm text-slate-300 disabled:opacity-40 hover:bg-cmd-700 transition-colors">
              Prev
            </button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-[12px] bg-cmd-800 border border-white/10 rounded-sm text-slate-300 disabled:opacity-40 hover:bg-cmd-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SKUMatrix;
