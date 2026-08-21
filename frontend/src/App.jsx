import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TopTabBar from './components/TopTabBar';
import OverviewDashboard from './components/OverviewDashboard';
import SKUMatrix from './components/SKUMatrix';
import SourceHeatmap from './components/SourceHeatmap';
import DeepAnalytics from './components/DeepAnalytics';
import ReportsView from './components/ReportsView';
import DataReviewer from './components/DataReviewer';
import DocumentViewer from './components/DocumentViewer';
import SettingsView from './components/SettingsView';
import HelpDocsView from './components/HelpDocsView';
import CommandPalette from './components/CommandPalette';
import SplashScreen from './components/SplashScreen';
import LoginView from './components/LoginView';
import ReviewQueue from './components/ReviewQueue';
import BulkUpload from './components/BulkUpload';

import { processProduct } from './api/backend';
import { Bot, Network } from 'lucide-react';

function App() {
  const [appLoaded, setAppLoaded]           = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme]                   = useState('light');
  const [activeView, setActiveView]         = useState('overview');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [aiData, setAiData]                 = useState(null);
  const [isProcessing, setIsProcessing]     = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  /* ── Ctrl+K ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── Theme class ── */
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');

  /* ── AI Process ── */
  const handleProcessAI = async () => {
    setIsProcessing(true);
    try {
      const result = await processProduct(
        'DCB518ASTS06G',
        'Diablo Steel Demon 5-3/8 in. x 50-Teeth Thick Metal Cutting Saw Blade',
        'Diablo'
      );
      setAiData(result);
      // Show celebration briefly
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } catch {
      alert('Backend not reachable. Ensure FastAPI is running on port 8000.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = () => setAiData(null);
  const handleLogout  = () => { setIsAuthenticated(false); setActiveView('overview'); };

  /* ── Views that live inside the TopTabBar area ── */
  const tabViews = new Set(['overview', 'sku-matrix', 'heatmap', 'analytics', 'review-queue', 'bulk-upload']);

  /* ── Render the active view ── */
  const renderView = () => {
    switch (activeView) {
      case 'overview':     return <OverviewDashboard setActiveView={setActiveView} />;
      case 'sku-matrix':   return <SKUMatrix setActiveView={setActiveView} />;
      case 'heatmap':      return <SourceHeatmap setActiveView={setActiveView} />;
      case 'analytics':    return <DeepAnalytics setActiveView={setActiveView} />;
      case 'reports':      return <ReportsView setActiveView={setActiveView} />;
      case 'settings':     return <SettingsView setActiveView={setActiveView} />;
      case 'help':         return <HelpDocsView setActiveView={setActiveView} />;
      case 'review-queue': return <ReviewQueue setActiveView={setActiveView} />;
      case 'bulk-upload':  return <BulkUpload setActiveView={setActiveView} />;

      case 'catalogs':
      default:
        return (
          <>
            {/* Action Toolbar */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-cmd-900/60 shrink-0 relative">
              {showCelebration && (
                <div className="absolute inset-0 bg-accent-cyan/20 animate-pulse pointer-events-none" />
              )}
              <div>
                <h2 className="text-lg font-bold text-white mb-0.5">Parts Extraction Workspace</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Queue: <span className="text-accent-cyan">1 document pending</span>
                </p>
              </div>
              <button
                onClick={handleProcessAI}
                disabled={isProcessing || aiData !== null}
                className="tactile-button flex items-center gap-2 bg-accent-cyan text-cmd-900 font-black px-6 py-2.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(56,189,248,0.25)] relative overflow-hidden"
              >
                {isProcessing && <div className="absolute inset-0 bg-white/30 w-12 animate-[slide_1.5s_infinite]" style={{ transform: 'skewX(-20deg)' }} />}
                <Bot className="w-5 h-5" />
                {isProcessing ? 'AI IS ANALYZING...' : 'PROCESS WITH AI'}
              </button>
            </div>

            {/* Dual-Pane View */}
            <div className="flex-1 flex p-4 gap-4 overflow-hidden relative">
              {/* Pipeline Visualization Overlay (when not processing and no data) */}
              {!isProcessing && !aiData && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-8 opacity-20">
                    <div className="p-4 border-2 border-dashed border-white rounded-sm"><FileText className="w-12 h-12" /></div>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
                    <div className="p-6 bg-accent-cyan/20 rounded-full border border-accent-cyan"><Network className="w-16 h-16 text-accent-cyan animate-pulse-glow" /></div>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent animate-pulse" />
                    <div className="p-4 border-2 border-solid border-accent-cyan rounded-sm"><Database className="w-12 h-12 text-accent-cyan" /></div>
                  </div>
                </div>
              )}
              
              <DocumentViewer isProcessing={isProcessing} />
              <DataReviewer data={aiData} onApprove={handleApprove} isProcessing={isProcessing} />
            </div>
          </>
        );
    }
  };

  return (
    <div className={`theme-${theme} transition-colors duration-500`}>
      {/* Splash */}
      {!appLoaded && <SplashScreen onComplete={() => setAppLoaded(true)} />}

      {/* Login */}
      {appLoaded && !isAuthenticated && (
        <LoginView onLogin={() => setIsAuthenticated(true)} />
      )}

      {/* Main App */}
      <div
        className={`h-screen w-full flex bg-cmd-900 font-sans text-slate-200 overflow-hidden relative transition-opacity duration-1000 ${
          appLoaded && isAuthenticated ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Background ambience */}
        <div className="absolute inset-0 tech-grid pointer-events-none opacity-60" />
        <div className="absolute top-0 right-0 w-[55%] h-[55%] rounded-full bg-accent-cyan/4 blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 left-[20%] w-[40%] h-[40%] rounded-full bg-purple-600/3 blur-[150px] pointer-events-none" />

        {/* Command Palette */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          setActiveView={setActiveView}
        />

        {/* Left Sidebar */}
        <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">

          {/* Top Tab Bar (only for tab views) */}
          {tabViews.has(activeView) && (
            <TopTabBar activeView={activeView} setActiveView={setActiveView} />
          )}
          
          {/* Slim Header (Batch Processing) */}
          <Header activeView={activeView} theme={theme} toggleTheme={toggleTheme} />

          {/* View Area */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {renderView()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
