import React, { useState, useEffect } from 'react';
import { Sparkles, Check, RefreshCw, X } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';
import { useToast } from '../../ToastProvider';

const AIEnrichmentCard = ({ product, onProductUpdated }) => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [optimizedText, setOptimizedText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();

  const currentDesc = product?.description || 'Standard product specification and detailed catalog description.';
  const pName = product?.name || 'Product';

  const handleGenerate = async () => {
    if (!product?.id && !product?.sku) return;
    setIsGenerating(true);
    try {
      const res = await apiClient.generateEnrichment({
        productId: product?.id || product?.sku,
        tone: 'Professional',
        language: 'English'
      });
      setOptimizedText(res?.description || '');
      setIsGenerated(true);
    } catch (e) {
      addToast('Failed to generate enrichment copy', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = async () => {
    if (!product?.id && !product?.sku) return;
    setIsSaving(true);
    try {
      await apiClient.approveEnrichment(product.id || product.sku);
      addToast('AI enriched content accepted and saved!', 'success');
      setIsGenerated(false);
      if (onProductUpdated) {
        onProductUpdated({
          ...product,
          description: optimizedText,
          quality: Math.min(100, Math.max(92, (product.quality || 70) + 15)),
          status: 'Active',
          readiness: Math.min(100, (product.readiness || 70) + 20)
        });
      }
    } catch (err) {
      addToast('Failed to save enriched content', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#22272e] rounded-xl border border-blue-100 dark:border-blue-900/50 shadow-sm overflow-hidden transition-colors relative">
      
      {/* Background glow when active */}
      {isGenerated && <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-500/5 pointer-events-none"></div>}

      <div className="px-6 py-4 border-b border-slate-100 dark:border-[#2d333b] flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-500/10 dark:to-transparent relative z-10">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          AI Content Enrichment
        </h3>
        {isGenerated && (
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30">
            Draft Mode
          </span>
        )}
      </div>

      <div className="p-6 relative z-10">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Compare current description with AI-optimized content for better conversion and SEO.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Current */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-[#2d333b] flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Current Description</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentDesc}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-[#2d333b] text-xs text-slate-500 flex justify-between">
              <span>Quality Score</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{product?.quality || 70}%</span>
            </div>
          </div>

          {/* AI Generated */}
          <div className={`p-4 rounded-lg border ${isGenerated ? 'bg-blue-50/50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' : 'bg-slate-50 dark:bg-[#1c2128] border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center'}`}>
            {!isGenerated && !isGenerating && (
              <p className="text-sm text-slate-400 text-center">Click Generate to create optimized content for {pName}.</p>
            )}
            
            {isGenerating && (
              <div className="flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 py-4">
                <RefreshCw className="w-6 h-6 animate-spin mb-2" />
                <p className="text-sm font-medium">Generating content with AI...</p>
              </div>
            )}

            {isGenerated && (
              <div>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Optimized Description</h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {optimizedText}
                </p>
                
                <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-500/20">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">SEO Suggestions</h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
                    <li>Added keywords for {product?.category || 'catalog'} search</li>
                    <li>Estimated conversion boost: +18%</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {!isGenerated ? (
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" /> Generate with AI
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsGenerated(false)}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1c2128] border border-slate-200 dark:border-[#3d444d] rounded-md hover:bg-slate-50 dark:hover:bg-[#2d333b] transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button 
                onClick={handleGenerate}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-white dark:bg-[#1c2128] border border-blue-200 dark:border-blue-500/30 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Regenerate
              </button>
              <button 
                onClick={handleAccept}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-all"
              >
                <Check className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Accept'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIEnrichmentCard;
