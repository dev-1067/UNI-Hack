import React from 'react';
import { LineChart, AlertTriangle, Store, CheckCircle } from 'lucide-react';

const IntelligenceLayer = ({ product }) => {
  const quality = product?.quality || 70;
  const readiness = product?.readiness || 65;
  const pName = product?.name || 'Product';
  const seoScore = Math.min(100, Math.round(quality * 0.95));
  const hasIssues = quality < 85;

  return (
    <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-[#2d333b] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <LineChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Intelligence Layer
        </h3>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
          Health: {quality}%
        </span>
      </div>

      {/* Visual Analytics Bars */}
      <div className="px-6 py-3 border-b border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128]/50 space-y-2.5">
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-600 dark:text-slate-400">Data Completeness</span>
            <span className="text-blue-600 dark:text-blue-400">{quality}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-[#2d333b] rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${quality}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-600 dark:text-slate-400">SEO & Search Visibility</span>
            <span className="text-teal-600 dark:text-teal-400">{seoScore}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-[#2d333b] rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 dark:bg-teal-500 rounded-full transition-all duration-700" style={{ width: `${seoScore}%` }}></div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        
        {/* Insight 1: SEO Score */}
        <div className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1c2128] transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
            <LineChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">
              {seoScore >= 85 ? 'SEO metadata & description optimized.' : 'Product description can be improved for better search visibility.'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">SEO score is currently {seoScore}/100.</p>
          </div>
        </div>

        {/* Insight 2: Quality & Missing Attributes */}
        {hasIssues ? (
          <div className="flex gap-3 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-900/30 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">Specification attributes need standardization.</p>
              <p className="text-xs text-amber-600/90 dark:text-amber-400/90 mt-1">Category: {product?.category || 'General'} • Quality: {quality}%</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 p-3 rounded-lg bg-teal-50/50 dark:bg-teal-500/5 border border-teal-100 dark:border-teal-900/30 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">All core attributes verified and complete.</p>
              <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">Ready for multi-channel distribution.</p>
            </div>
          </div>
        )}

        {/* Insight 3: Channel Content Readiness */}
        <div className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1c2128] transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#2d333b] flex items-center justify-center shrink-0">
            <Store className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">Channel readiness index.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Catalog status is {readiness}% ready across connected platforms.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IntelligenceLayer;
