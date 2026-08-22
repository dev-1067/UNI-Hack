import React from 'react';
import { ShoppingBag, Box, ShoppingCart, Target } from 'lucide-react';

const ChannelReadiness = ({ product }) => {
  const baseScore = product?.readiness || product?.quality || 75;

  const shopifyScore = Math.min(100, Math.max(20, Math.round(baseScore * 1.05)));
  const amazonScore = Math.min(100, Math.max(15, Math.round(baseScore * 0.92)));
  const googleScore = Math.min(100, Math.max(20, Math.round(baseScore * 0.98)));
  const flipkartScore = Math.min(100, Math.max(15, Math.round(baseScore * 0.85)));

  const avgScore = Math.round((shopifyScore + amazonScore + googleScore + flipkartScore) / 4);

  const getStatus = (score) => {
    if (score >= 90) return { label: 'Ready', isWarning: false, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10 border-teal-100 dark:border-teal-500/20' };
    if (score >= 70) return { label: 'Needs Review', isWarning: false, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-slate-50 dark:bg-[#1c2128] border-slate-200 dark:border-[#2d333b]' };
    return { label: 'Incomplete', isWarning: true, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50/50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' };
  };

  const shopifyStatus = getStatus(shopifyScore);
  const amazonStatus = getStatus(amazonScore);
  const googleStatus = getStatus(googleScore);
  const flipkartStatus = getStatus(flipkartScore);

  const channels = [
    { 
      id: 1, name: 'Shopify', status: shopifyStatus.label, score: shopifyScore, 
      icon: ShoppingBag, color: shopifyStatus.color, 
      bg: shopifyStatus.bg,
      isWarning: shopifyStatus.isWarning
    },
    { 
      id: 2, name: 'Amazon', status: amazonStatus.label, score: amazonScore, 
      icon: Box, color: amazonStatus.color, 
      bg: amazonStatus.bg,
      isWarning: amazonStatus.isWarning
    },
    { 
      id: 3, name: 'Google Shopping', status: googleStatus.label, score: googleScore, 
      icon: Target, color: googleStatus.color, 
      bg: googleStatus.bg,
      isWarning: googleStatus.isWarning
    },
    { 
      id: 4, name: 'Flipkart', status: flipkartStatus.label, score: flipkartScore, 
      icon: ShoppingCart, color: flipkartStatus.color, 
      bg: flipkartStatus.bg,
      isWarning: flipkartStatus.isWarning
    }
  ];

  return (
    <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-[#2d333b] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          Channel Readiness
        </h3>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{avgScore}% Avg</span>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        {channels.map(channel => (
          <div 
            key={channel.id} 
            className={`p-3 rounded-lg border ${channel.bg} transition-all flex flex-col items-center text-center`}
          >
            <channel.icon className={`w-6 h-6 mb-2 ${channel.color}`} />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{channel.name}</h4>
            
            <div className="flex flex-col items-center gap-1 mt-auto">
              <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1
                ${channel.isWarning ? 'text-amber-600 dark:text-amber-400' : 
                  channel.score >= 90 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {channel.isWarning && <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>}
                {!channel.isWarning && channel.score >= 90 && <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>}
                {!channel.isWarning && channel.score < 90 && <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>}
                {channel.status}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {channel.score}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelReadiness;
