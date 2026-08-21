import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, Database } from 'lucide-react';

const BulkUpload = ({ setActiveView }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, complete
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const [recentUploads, setRecentUploads] = useState([
    { id: 1, name: 'diablo_blades_q3_specs.pdf', status: 'Complete', time: '10 mins ago' },
    { id: 2, name: 'makita_tools_catalog_2026.csv', status: 'Complete', time: '2 hours ago' },
    { id: 3, name: 'bosch_power_drills_spec.pdf', status: 'Processing', time: '4 hours ago' }
  ]);

  const handleProcessFile = (name) => {
    setFileName(name);
    setUploadState('uploading');
    
    const newId = Date.now();
    setRecentUploads(prev => [{ id: newId, name, status: 'Processing', time: 'Just now' }, ...prev]);

    setTimeout(() => {
      setUploadState('complete');
      setRecentUploads(prev => prev.map(u => u.id === newId ? { ...u, status: 'Complete' } : u));
    }, 3000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0].name);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto animate-fade-in flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">Omni-Channel Ingestion</h2>
          <p className="text-sm text-slate-400">Upload PDF Specs, Product Images, or CSVs. The AI pipeline will automatically classify and extract data using VLM and OCR.</p>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.csv,.jpg,.png"
        />

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`glass-panel border-2 border-dashed rounded-sm p-12 text-center transition-all mb-8 ${isDragging ? 'border-accent-cyan bg-accent-cyan/5 scale-105' : 'border-white/20 hover:border-accent-cyan/50'}`}
        >
          {uploadState === 'idle' && (
            <div className="animate-fade-in">
              <div className="w-20 h-20 bg-cmd-900 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(56,189,248,0.15)] hover:shadow-[0_0_40px_rgba(56,189,248,0.3)] transition-shadow">
                <UploadCloud className="w-10 h-10 text-accent-cyan" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Drag & Drop Files Here</h3>
              <p className="text-xs text-slate-500 mb-6">Supports .pdf, .csv, .jpg, .png (Max 50MB per batch)</p>
              <button 
                onClick={() => fileInputRef.current.click()}
                className="px-6 py-2.5 bg-cmd-800 hover:bg-cmd-700 text-white text-sm font-bold rounded-sm border border-white/10 transition-colors"
              >
                Browse Files
              </button>
            </div>
          )}

          {uploadState === 'uploading' && (
            <div className="animate-fade-in py-8">
              <div className="w-16 h-16 border-4 border-cmd-800 border-t-accent-cyan rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-lg font-bold text-white mb-2">Analyzing {fileName}...</h3>
              <p className="text-xs text-slate-400">Running Vision-Language Model on spec sheets...</p>
            </div>
          )}

          {uploadState === 'complete' && (
            <div className="animate-fade-in py-6">
              <div className="w-20 h-20 bg-industrial-success/20 border border-industrial-success/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-industrial-success" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ingestion Complete</h3>
              <p className="text-xs text-slate-400 mb-6">Successfully extracted data from {fileName}.</p>
              <button onClick={() => { setUploadState('idle'); setActiveView('sku-matrix'); }} className="px-6 py-2.5 bg-accent-cyan hover:bg-sky-400 text-cmd-900 text-sm font-black rounded-sm transition-colors">
                View in SKU Matrix
              </button>
            </div>
          )}
        </div>

        {/* Recent Uploads Section */}
        <div className="glass-panel p-6 animate-fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Recent Uploads</h3>
          <div className="space-y-3">
            {recentUploads.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-cmd-900/50 border border-white/5 rounded-sm hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'Complete' ? 'bg-industrial-success/20 text-industrial-success' : 'bg-status-moderate/20 text-status-moderate animate-pulse'}`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
