import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useToast } from '../ToastProvider';

const ImportProductsModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success
  const [progress, setProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      addToast('Please upload a valid CSV file.', 'error');
      return;
    }

    setUploadState('uploading');
    setProgress(0);
    
    // Fake progress animation while processing
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 200);

    try {
      const text = await file.text();
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (lines.length < 2) {
        throw new Error('CSV is empty or missing data rows.');
      }

      // Basic parsing (assumes no commas inside quotes for this prototype)
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const dataRows = lines.slice(1);
      
      const promises = dataRows.map(async (row) => {
        // split by comma, naive approach
        const values = row.split(',').map(v => v.replace(/^"|"$/g, '').trim());
        const productData = {};
        
        headers.forEach((header, index) => {
          if (header.includes('name')) productData.name = values[index];
          else if (header.includes('sku')) productData.sku = values[index];
          else if (header.includes('category')) productData.category = values[index];
          else if (header.includes('brand')) productData.brand = values[index];
          else if (header.includes('description')) productData.description = values[index];
          else if (header.includes('status')) productData.status = values[index];
        });

        // Minimum required fields
        if (productData.name && productData.sku) {
          return apiClient.createProduct(productData);
        }
        return null;
      });

      const results = await Promise.all(promises);
      const successful = results.filter(r => r !== null);
      
      clearInterval(progressInterval);
      setProgress(100);
      setImportedCount(successful.length);
      setUploadState('success');
      
      if (onImportSuccess) {
        onImportSuccess();
      }

    } catch (err) {
      clearInterval(progressInterval);
      setUploadState('idle');
      addToast(`Import failed: ${err.message}`, 'error');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClose = () => {
    if (uploadState === 'uploading') return;
    setUploadState('idle');
    setProgress(0);
    onClose();
  };

  const downloadTemplate = () => {
    const csvContent = "Name,SKU,Category,Brand,Description,Status\nSample Product,SMPL-001,Electronics,Acme,A great sample product,Draft";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'nexora_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-[#1a1f26] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-[#2d333b]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#2d333b]">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Import Products</h3>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2d333b] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          
          {uploadState === 'idle' && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-[#2d333b] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-[#22272e]/50 hover:bg-slate-50 dark:hover:bg-[#22272e] transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Drag and drop your file here or click to browse</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Supports CSV files up to 50MB</p>
              
              <button className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-colors shadow-sm">
                Browse Files
              </button>
            </div>
          )}

          {uploadState === 'uploading' && (
            <div className="border-2 border-slate-200 dark:border-[#2d333b] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-[#22272e]/50">
              <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Uploading and Validating...</h4>
              <div className="w-full max-w-xs bg-slate-200 dark:bg-[#3d444d] rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{progress}% complete</p>
            </div>
          )}

          {uploadState === 'success' && (
            <div className="border-2 border-teal-200 dark:border-teal-900/50 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-teal-50/50 dark:bg-teal-900/10">
              <CheckCircle className="w-12 h-12 text-teal-500 mb-4" />
              <h4 className="text-sm font-semibold text-teal-700 dark:text-teal-400 mb-1">Upload Successful!</h4>
              <p className="text-xs text-teal-600/70 dark:text-teal-400/70">{importedCount} product(s) imported successfully.</p>
            </div>
          )}
          
          
          <div className="mt-6">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Or start with a template</h4>
            <div 
              onClick={downloadTemplate}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-[#2d333b] hover:border-blue-300 dark:hover:border-blue-500/50 cursor-pointer transition-colors bg-white dark:bg-[#1c2128]"
            >
              <FileText className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Nexora Standard Template</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">CSV format with all standard headers</p>
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Download</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#1c2128] border-t border-slate-100 dark:border-[#2d333b] flex justify-end gap-3">
          <button 
            onClick={handleClose}
            disabled={uploadState === 'uploading'}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2d333b] rounded-md transition-colors disabled:opacity-50"
          >
            {uploadState === 'success' ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportProductsModal;
