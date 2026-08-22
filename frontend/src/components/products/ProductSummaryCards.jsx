import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckSquare, AlertTriangle, Shield, ArrowUp } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { mockApi } from '../../services/mock/api';

const ProductSummaryCards = () => {
  const [data, setData] = useState({
    total: 0,
    published: 0,
    publishedPercent: 0,
    needsAttention: 0,
    avgQuality: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [products, metrics] = await Promise.all([
          apiClient.getProducts(),
          apiClient.getDashboardMetrics()
        ]);
        const total = (products || []).length;
        const published = (products || []).filter(p => p.status === 'Active').length;
        const needsAttention = (products || []).filter(p => (p.quality || 0) < 90).length;
        const avgQuality = metrics?.avgQuality ?? 0;
        const publishedPercent = total > 0 ? Math.round((published / total) * 100) : 0;

        setData({
          total,
          published,
          publishedPercent,
          needsAttention,
          avgQuality
        });
      } catch (e) {
        console.error("Failed to load product summary", e);
      }
    };
    loadData();

    // Subscribe to store updates for automatic reactivity
    const unsubscribe = mockApi.subscribe(() => {
      loadData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const metrics = [
    { 
      id: 1, 
      title: 'TOTAL PRODUCTS', 
      value: data.total.toString(), 
      icon: ClipboardList, 
      trend: '+12% this month',
      trendUp: true,
      iconColor: 'text-slate-600 dark:text-slate-400' 
    },
    { 
      id: 2, 
      title: 'PUBLISHED', 
      value: data.published.toString(), 
      icon: CheckSquare,
      progress: data.publishedPercent,
      iconColor: 'text-blue-600 dark:text-blue-400' 
    },
    { 
      id: 3, 
      title: 'NEEDS ATTENTION', 
      value: data.needsAttention.toString(), 
      icon: AlertTriangle, 
      subtitle: data.needsAttention > 0 ? 'Missing critical attributes' : 'All attributes complete',
      isWarning: data.needsAttention > 0,
      iconColor: 'text-red-500 dark:text-red-400' 
    },
    { 
      id: 4, 
      title: 'DATA QUALITY', 
      value: `${data.avgQuality}%`, 
      icon: Shield, 
      trend: '+2% improvement',
      trendUp: true,
      iconColor: 'text-teal-600 dark:text-teal-400' 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div 
          key={metric.id} 
          className={`p-5 rounded-xl border shadow-sm transition-all relative overflow-hidden group 
            ${metric.isWarning 
              ? 'bg-red-50/50 dark:bg-red-500/5 border-red-100 dark:border-red-900/30' 
              : 'bg-white dark:bg-[#22272e] border-slate-200 dark:border-[#2d333b]'}`}
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">
              {metric.title}
            </p>
            <metric.icon className={`w-4 h-4 ${metric.iconColor} opacity-70`} />
          </div>
          
          <h3 className={`text-3xl font-bold mt-1 ${metric.isWarning ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
            {metric.value}
          </h3>
          
          {/* Bottom Indicators */}
          <div className="mt-2 h-4 flex items-center">
            {metric.trend && (
              <span className={`text-xs font-medium flex items-center gap-1 ${metric.trendUp ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {metric.trendUp && <ArrowUp className="w-3 h-3" />}
                {metric.trend}
              </span>
            )}
            
            {metric.subtitle && (
              <span className={`text-xs font-medium ${metric.isWarning ? 'text-red-500 dark:text-red-400/80' : 'text-slate-500 dark:text-slate-400'}`}>
                {metric.subtitle}
              </span>
            )}
            
            {metric.progress !== undefined && (
              <div className="w-full flex items-center mt-1">
                <div className="h-1.5 flex-1 bg-slate-100 dark:bg-[#1c2128] rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 dark:bg-teal-500 rounded-full" style={{ width: `${metric.progress}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSummaryCards;
