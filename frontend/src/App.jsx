import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DocumentViewer from './components/DocumentViewer';
import DataReviewer from './components/DataReviewer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SettingsView from './components/SettingsView';
import HelpDocsView from './components/HelpDocsView';
import CommandPalette from './components/CommandPalette';
import SplashScreen from './components/SplashScreen';
import LoginView from './components/LoginView';
import { processProduct } from './api/backend';
import { Bot } from 'lucide-react';

function App() {
  const [appLoaded, setAppLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'catalogs' | 'settings' | 'help'
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  const [aiData, setAiData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Ctrl+K Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme effect
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleProcessAI = async () => {
    setIsProcessing(true);
    try {
      const result = await processProduct("Diablo", "DCB518ASTS06G");
      setAiData(result);
    } catch (error) {
      alert("Backend not reachable. Ensure FastAPI is running on port 8000.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = () => {
    setAiData(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('dashboard');
  };

  // Render the correct view based on Sidebar/Command Palette selection
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <AnalyticsDashboard />;
      case 'settings':
        return <SettingsView />;
      case 'help':
        return <HelpDocsView />;
      case 'catalogs':
      default:
        return (
          <>
            {/* Action Toolbar */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-industrial-800/50 bg-industrial-900/40">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Parts Extraction Workspace</h2>
                <p className="text-xs text-slate-400 font-medium">Queue: <span className="text-industrial-accent">1 document pending</span></p>
              </div>
              
              <button 
                onClick={handleProcessAI}
                disabled={isProcessing || aiData !== null}
                className="tactile-button flex items-center gap-2 bg-industrial-accent text-industrial-900 font-black px-6 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(56,189,248,0.2)]"
              >
                <Bot className="w-5 h-5" />
                {isProcessing ? "INITIALIZING AI..." : "PROCESS WITH AI"}
              </button>
            </div>

            {/* Dual-Pane View */}
            <div className="flex-1 flex p-4 gap-4 overflow-hidden relative">
              <DocumentViewer isProcessing={isProcessing} />
              <DataReviewer 
                data={aiData} 
                onApprove={handleApprove} 
                isProcessing={isProcessing}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className={`theme-${theme} transition-colors duration-500`}>
      {!appLoaded && <SplashScreen onComplete={() => setAppLoaded(true)} />}
      
      {/* If loaded but not authenticated, show Login Screen */}
      {appLoaded && !isAuthenticated && (
        <LoginView onLogin={() => setIsAuthenticated(true)} />
      )}

      {/* The main app rendered behind the splash screen/login so it's ready when splash fades */}
      <div className={`h-screen w-full flex bg-industrial-900 font-sans text-slate-200 overflow-hidden relative selection:bg-industrial-accent selection:text-white transition-opacity duration-1000 ${appLoaded && isAuthenticated ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* World-Class Background Ambience */}
        <div className="absolute inset-0 tech-grid pointer-events-none opacity-50"></div>
        <div className="absolute top-0 right-0 w-[60%] h-[60%] rounded-full bg-industrial-accent/5 blur-[150px] pointer-events-none"></div>

        {/* Global Modals */}
        <CommandPalette 
          isOpen={isCommandPaletteOpen} 
          onClose={() => setIsCommandPaletteOpen(false)}
          setActiveView={setActiveView}
        />

        {/* Global Layout: Left Sidebar */}
        <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />

        {/* Global Layout: Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          
          {/* Top Header / Taskbar */}
          <Header onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} theme={theme} toggleTheme={toggleTheme} />
          
          {/* Main Workspace Area */}
          <main className="flex-1 flex flex-col overflow-hidden bg-industrial-900/20 backdrop-blur-sm">
            {renderView()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
