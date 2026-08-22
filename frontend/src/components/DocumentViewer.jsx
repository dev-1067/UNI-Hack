import React, { useState } from 'react';
import { FileText, ZoomIn, ZoomOut, Download, Scan } from 'lucide-react';

const DocumentViewer = ({ isProcessing }) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  
  const handleDownload = () => {
    // Mock download action
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Mock PDF Document Content');
    link.download = 'spec_sheet_DCB518.txt';
    link.click();
  };

  return (
    <div className={`flex-1 w-full h-full glass-panel flex flex-col overflow-hidden m-0 transition-all duration-500 bg-white dark:bg-[#22272e] shadow-sm ${isProcessing ? 'border-blue-400 dark:border-blue-500 ring-1 ring-blue-400' : 'border-slate-200 dark:border-[#2d333b]'}`}>
      
      {/* Viewer Toolbar */}
      <div className="bg-slate-50/50 dark:bg-[#1c2128] px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-[#2d333b] z-20">
        <div className="flex items-center gap-2 text-slate-300">
          {isProcessing ? (
            <Scan className="w-5 h-5 text-industrial-accent animate-pulse" />
          ) : (
            <FileText className="w-5 h-5 text-industrial-accent" />
          )}
          <span className="font-medium text-sm">spec_sheet_DCB518.pdf</span>
          <span className="text-xs text-slate-500 ml-2">{Math.round(zoom * 100)}%</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <button onClick={handleZoomOut} className="p-1.5 hover:bg-industrial-700 hover:text-white rounded transition-colors active:scale-95">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={handleZoomIn} className="p-1.5 hover:bg-industrial-700 hover:text-white rounded transition-colors active:scale-95">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-industrial-700 mx-1"></div>
          <button onClick={handleDownload} className="p-1.5 hover:bg-industrial-700 hover:text-industrial-accent rounded transition-colors active:scale-95" title="Download Document">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Viewer Canvas */}
      <div className="flex-1 bg-[#2a2a2a] overflow-auto p-8 flex justify-center relative">
        
        {/* Mind-Blowing Laser Scan Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
            <div className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_5px_rgba(59,130,246,0.7)] animate-laser"></div>
            <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
          </div>
        )}

        {/* Mock PDF Page with Zoom Transform */}
        <div 
          className="bg-white w-[600px] h-[800px] shadow-2xl relative transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoom})` }}
        >
          <div className="p-12 text-slate-900 font-sans">
            <h2 className="text-3xl font-black mb-4">DIABLO</h2>
            <h3 className="text-xl font-bold mb-8 text-red-600">PREMIUM SANDING BELTS</h3>
            <p className="text-sm text-slate-600 mb-6 font-mono">PART NO. DCB518ASTS06G</p>
            
            <table className="w-full text-sm border-collapse mb-8">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  <th className="text-left py-2 px-3">Specification</th>
                  <th className="text-left py-2 px-3">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-3 font-medium">Dimensions</td>
                  <td className="py-2 px-3">1/2" x 18"</td>
                </tr>
                <tr className="border-b border-slate-200 relative">
                  <td className="py-2 px-3 font-medium">Grit</td>
                  {/* Highlight Box Demo */}
                  <td className="py-2 px-3 relative z-10">
                    <span className={`rounded px-1 -mx-1 transition-all duration-1000 ${isProcessing ? 'bg-transparent ring-0' : 'bg-yellow-200/50 ring-2 ring-yellow-400'}`}>
                      60, 80, 120 (Assorted)
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-3 font-medium">Quantity</td>
                  <td className="py-2 px-3">6 pc</td>
                </tr>
              </tbody>
            </table>
            
            <p className="text-sm text-slate-500 italic">For use with portable belt sanders. Features premium ceramic grain blend for fast material removal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
