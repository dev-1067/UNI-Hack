import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, RefreshCw, Box } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { useToast } from '../components/ToastProvider';

const AddProduct = () => {
  const [saveState, setSaveState] = useState('idle');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    brand: '',
    status: 'Draft'
  });
  const { addToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.sku) {
      addToast('Name and SKU are required', 'error');
      return;
    }

    setSaveState('loading');
    try {
      await apiClient.createProduct(formData);
      setSaveState('success');
      setTimeout(() => {
        window.location.hash = '#/products';
      }, 1000);
    } catch (error) {
      addToast('Failed to create product', 'error');
      setSaveState('idle');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8f9fc] dark:bg-[#1a1f26] animate-fade-in text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.hash = '#/products'}
            className="p-2 rounded-lg bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#2d333b] hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Product</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Create a new product record manually.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Product Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Stainless Steel Bottle"
                  className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">SKU *</label>
                <input 
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g. NXR-1001"
                  className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Description</label>
                <textarea 
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed product description..."
                  className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Category</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Hydration">Hydration</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Safety Gear">Safety Gear</option>
                  <option value="Power Tools">Power Tools</option>
                  <option value="Abrasives">Abrasives</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="Draft">Draft</option>
                  <option value="Review">Review</option>
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Brand</label>
                <input 
                  type="text" 
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g. EcoMakers"
                  className="w-full bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 dark:border-[#2d333b] bg-slate-50 dark:bg-[#1c2128] flex justify-end gap-3">
            <button 
              onClick={() => window.location.hash = '#/products'}
              disabled={saveState !== 'idle'}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2d333b] rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saveState !== 'idle'}
              className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors min-w-[120px]"
            >
              {saveState === 'idle' && 'Create Product'}
              {saveState === 'loading' && <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>}
              {saveState === 'success' && <><CheckCircle className="w-4 h-4" /> Created</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddProduct;
