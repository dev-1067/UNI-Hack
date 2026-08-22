import React, { useState, useRef } from 'react';
import { Sparkles, CheckCircle2, Circle, Eye, Trash2, Plus, ChevronDown, FileText } from 'lucide-react';
import DocumentViewer from '../components/DocumentViewer';
import DataReviewer from '../components/DataReviewer';
import { mockApi } from '../services/mock/api';
import { apiClient } from '../services/apiClient';
import { useToast } from '../components/ToastProvider';

const CatalogWorkspace = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentDoc, setCurrentDoc] = useState({
    name: 'spec_sheet_DCB518.pdf',
    type: 'PDF',
    pages: '1',
    status: 'Ready'
  });
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      setSelectedFile(file);
      setCurrentDoc({
        name: file.name,
        type: ext,
        pages: ext === 'PDF' ? '1' : 'Spreadsheet',
        status: 'Ready'
      });
      addToast(`Document "${file.name}" ready for extraction.`, 'success');
    }
  };

  const handleProcessAI = async () => {
    setIsProcessing(true);
    addToast(`Uploading & analyzing ${currentDoc.name} with AI...`, 'info');
    
    try {
      let result = null;

      // 1. Try real FastAPI backend first
      if (selectedFile) {
        result = await apiClient.processDocumentFile(selectedFile, {
          mfg_part_num: selectedFile.name.replace(/\.[^/.]+$/, ""),
          part_desc: `Catalog Item ${selectedFile.name}`,
          part_manuf: 'Industrial'
        });
      } else {
        // Default document: send request to FastAPI endpoint
        result = await apiClient.processProductData({
          mfg_part_num: "DCB518ASTS06G",
          part_desc: "Diablo Steel Demon 5-3/8 in. x 50-Teeth Thick Metal Cutting Saw Blade",
          e1_brand: "Diablo",
          part_manuf: "Diablo"
        });
      }

      if (result) {
        addToast('Document processed through AI pipeline!', 'success');
        setAiData({
          category_name: result.category_name || "Power Tools / Saw Blades",
          sub_category: result.sub_category || "Circular Saw Blades",
          mfg_part_num: result.mfg_part_num || "DCB518ASTS06G",
          part_desc: result.part_desc || "Diablo Steel Demon Saw Blade",
          e1_brand: result.e1_brand || "Diablo",
          features: result.features || [
            "Industrial carbide teeth",
            "Precision laser cut",
            "High durability coating"
          ],
          specifications: result.specifications || {
            "Diameter": "5-3/8 in.",
            "Teeth": "50",
            "Arbor": "20mm",
            "Application": "Metal Cutting"
          },
          confidence: result.confidence || 95
        });
        return;
      }
    } catch (apiError) {
      addToast('Failed to process document. Please verify the document format.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async () => {
    if (aiData) {
      try {
        await apiClient.createProduct({
          name: aiData.part_desc,
          sku: aiData.mfg_part_num,
          category: aiData.category_name,
          brand: aiData.e1_brand,
          description: Array.isArray(aiData.features) ? aiData.features.join(' • ') : String(aiData.features || ''),
          price: '$79.99',
          stock: 50,
          quality: 95,
          status: 'Active'
        });
        addToast('Product successfully added to catalog.', 'success');
      } catch (e) {
        addToast('Failed to create product.', 'error');
      }
    }
    setAiData(null);
    window.location.hash = '#/products';
  };

  const handleReprocess = () => {
    handleProcessAI();
  };

  const handleCancel = () => {
    setAiData(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9fc] dark:bg-[#1a1f26] overflow-hidden">
      
      {/* Hidden File Input Picker */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelected} 
        accept=".pdf,.csv,.xlsx,.xls,.txt,.doc,.docx" 
        className="hidden" 
      />

      {/* Action Toolbar */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-[#2d333b] bg-white dark:bg-[#22272e] shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Parts Extraction Workspace</h2>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            Queue: 1 document pending 
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              Ready for extraction
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleProcessAI}
          disabled={isProcessing || aiData !== null}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-6 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <Sparkles className={`w-5 h-5 ${isProcessing ? 'animate-pulse' : ''}`} />
          {isProcessing ? "Processing document..." : "Process with AI"}
        </button>
      </div>

      {/* Workflow Indicator */}
      <div className="bg-slate-50 dark:bg-[#1c2128] border-b border-slate-200 dark:border-[#2d333b] px-6 py-3 flex items-center gap-4 md:gap-8 overflow-x-auto shrink-0">
        {/* Step 1 */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 shrink-0">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
          1. Document <span className="text-xs text-slate-400 font-normal ml-1 hidden md:inline">✓ Uploaded</span>
        </div>
        <div className="w-4 md:w-8 h-px bg-slate-300 dark:bg-[#3d444d] shrink-0"></div>
        {/* Step 2 */}
        <div className={`flex items-center gap-2 text-sm font-medium shrink-0 ${isProcessing || aiData ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isProcessing || aiData ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-slate-200 text-slate-500 dark:bg-[#2d333b] dark:text-slate-400'}`}>
            {(isProcessing || aiData) ? <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" /> : <Circle className="w-3.5 h-3.5" />}
          </span>
          2. AI Extraction <span className="text-xs text-slate-400 font-normal ml-1 hidden md:inline">{isProcessing ? '● Processing' : aiData ? '✓ Complete' : '● Ready'}</span>
        </div>
        <div className="w-4 md:w-8 h-px bg-slate-300 dark:bg-[#3d444d] shrink-0"></div>
        {/* Step 3 */}
        <div className={`flex items-center gap-2 text-sm font-medium shrink-0 ${aiData ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${aiData ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-slate-200 text-slate-500 dark:bg-[#2d333b] dark:text-slate-400'}`}>
             {aiData ? <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" /> : <Circle className="w-3.5 h-3.5" />}
          </span>
          3. Review <span className="text-xs text-slate-400 font-normal ml-1 hidden md:inline">{aiData ? '● Pending' : '○ Pending'}</span>
        </div>
        <div className="w-4 md:w-8 h-px bg-slate-300 dark:bg-[#3d444d] shrink-0"></div>
        {/* Step 4 */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 shrink-0">
          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-[#2d333b] text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px]">
             <Circle className="w-3.5 h-3.5" />
          </span>
          4. Catalog <span className="text-xs text-slate-400 font-normal ml-1 hidden md:inline">○ Pending</span>
        </div>
      </div>

      {/* Main Workspace Dual-Pane */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto h-full min-h-[800px]">
          
          {/* Left Column (PDF + Metadata) */}
          <div className="flex-1 lg:w-[65%] lg:flex-none flex flex-col gap-6">
            
            {/* PDF Viewer */}
            <div className="flex-1 min-h-[600px] bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm flex flex-col overflow-hidden relative">
              <DocumentViewer isProcessing={isProcessing} />
            </div>
            
            {/* Lower Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              
              {/* Document Metadata */}
              <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-4">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Document Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500 dark:text-slate-400">File</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200 truncate ml-4" title={currentDoc.name}>{currentDoc.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Type</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{currentDoc.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Pages</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{currentDoc.pages}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Status</span>
                    <span className="font-medium text-teal-600 dark:text-teal-400">{currentDoc.status}</span>
                  </div>
                </div>
              </div>

              {/* Extraction Queue */}
              <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-4 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Extraction Queue</h3>
                  <span className="text-xs font-medium text-slate-400">1 Pending</span>
                </div>
                <div className="flex-1 border border-slate-100 dark:border-[#2d333b] rounded-lg p-3 bg-slate-50/50 dark:bg-[#1c2128] flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">{currentDoc.name}</p>
                      <p className="text-[11px] text-slate-500">Ready for processing</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-1.5 border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-auto"
                >
                  <Plus className="w-4 h-4" /> Add Document
                </button>
              </div>

              {/* Extraction Settings */}
              <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-4">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Extraction Settings</h3>
                <div className="mb-3">
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Extraction Mode</label>
                  <div className="relative">
                    <select className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>Standard</option>
                      <option>Deep Extraction</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Detect missing attributes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Flag uncertain values</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Normalize specifications</span>
                  </label>
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Right Column (AI Panel) */}
          <div className="flex-1 lg:w-[35%] lg:flex-none flex flex-col min-h-[600px]">
            <DataReviewer 
              data={aiData} 
              onProcess={handleProcessAI}
              onApprove={handleApprove} 
              onReprocess={handleReprocess}
              onCancel={handleCancel}
              isProcessing={isProcessing}
            />
          </div>
          
        </div>
      </div>
      
    </div>
  );
};

export default CatalogWorkspace;
