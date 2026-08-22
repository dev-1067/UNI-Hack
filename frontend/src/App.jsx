import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DocumentViewer from './components/DocumentViewer';
import DataReviewer from './components/DataReviewer';
import CatalogWorkspace from './pages/CatalogWorkspace';
import DataQuality from './pages/DataQuality';
import AIEnrichment from './pages/AIEnrichment';
import Integrations from './pages/Integrations';
import Reports from './pages/Reports';
import Activity from './pages/Activity';
import Profile from './pages/Profile';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SettingsView from './components/SettingsView';
import HelpDocsView from './components/HelpDocsView';
import CommandPalette from './components/CommandPalette';
import SplashScreen from './components/SplashScreen';
import LoginView from './components/LoginView';
import SignupView from './components/SignupView';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import { apiClient } from './services/apiClient';

function App() {
  const [appLoaded, setAppLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('nexora_auth') === 'true' || !!sessionStorage.getItem('nexora_token');
  });
  const [authScreen, setAuthScreen] = useState(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash === 'login') return 'login';
    if (hash === 'signup') return 'signup';
    return 'landing';
  });
  const [theme, setTheme] = useState('light'); // 'dark' | 'light'
  
  // Real authenticated user state (derived from FastAPI -> Supabase)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('nexora_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Alex Morgan',
      email: 'alex@nexora.ai',
      role: 'Administrator',
      company: 'NEXORA Industrial Corp',
      avatar: null
    };
  });

  const mockUser = currentUser; // Alias for components accepting mockUser prop


  // Verify and refresh session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = sessionStorage.getItem('nexora_token');
      if (token) {
        try {
          const userProfile = await apiClient.getCurrentUser();
          if (userProfile && userProfile.email) {
            setCurrentUser(userProfile);
            sessionStorage.setItem('nexora_user', JSON.stringify(userProfile));
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.warn("Session expired or unreachable:", e);
        }
      }
    };
    checkSession();
  }, []);

  const [activeView, setActiveView] = useState(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash || 'dashboard';
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Sync URL hash with activeView only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.hash = `/${activeView}`;
      setIsSidebarOpen(false); // Close sidebar on navigation (mobile)
    }
  }, [activeView, isAuthenticated]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!isAuthenticated) {
        if (hash === 'login') {
          setAuthScreen('login');
        } else if (hash === 'signup') {
          setAuthScreen('signup');
        } else {
          setAuthScreen('landing');
          if (hash && hash !== 'login' && hash !== 'signup') {
            window.location.hash = 'login';
          }
        }
      } else {
        if (hash) setActiveView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

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

  // Theme effect (add 'dark' class to html element)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = async (email, password) => {
    const res = await apiClient.login(email, password);
    if (res && res.data?.user) {
      setCurrentUser(res.data.user);
      sessionStorage.setItem('nexora_user', JSON.stringify(res.data.user));
    }
    setIsAuthenticated(true);
    setActiveView('dashboard');
    window.location.hash = 'dashboard';
  };

  const handleSignup = async (name, email, password) => {
    const res = await apiClient.signup(name, email, password);
    if (res && res.data?.user) {
      setCurrentUser(res.data.user);
      sessionStorage.setItem('nexora_user', JSON.stringify(res.data.user));
    }
    setIsAuthenticated(true);
    setActiveView('dashboard');
    window.location.hash = 'dashboard';
  };

  const handleLogout = async () => {
    await apiClient.logout();
    sessionStorage.removeItem('nexora_user');
    setIsAuthenticated(false);
    setActiveView('dashboard');
    setAuthScreen('login');
    window.location.hash = 'login';
  };



  // Render the correct view based on Sidebar/Command Palette selection
  const renderView = () => {
    if (activeView.startsWith('products/')) {
      const productId = activeView.split('/')[1];
      if (productId === 'new') {
        return <AddProduct />;
      } else if (productId === 'edit') {
        const editId = activeView.split('/')[2];
        return <EditProduct productId={editId} />;
      }
      return <ProductDetail productId={productId} />;
    }

    switch (activeView) {
      case 'dashboard':
        return <AnalyticsDashboard setActiveView={setActiveView} mockUser={currentUser} />;

      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <Profile setActiveView={setActiveView} mockUser={currentUser} onLogout={handleLogout} />;
      case 'help':
        return <HelpDocsView />;
      case 'products':
        return <Products />;
      case 'quality':
        return <DataQuality setActiveView={setActiveView} />;
      case 'enrichment':
        return <AIEnrichment setActiveView={setActiveView} />;
      case 'reports':
        return <Reports setActiveView={setActiveView} mockUser={currentUser} />;
      case 'activity':
        return <Activity setActiveView={setActiveView} mockUser={currentUser} />;
      case 'catalog':
      case 'catalogs':
        return <CatalogWorkspace />;
      case 'integrations':
        return <Integrations setActiveView={setActiveView} />;
      default:
        if (activeView.startsWith('enrichment/')) {
          const id = activeView.split('/')[1];
          return <AIEnrichment setActiveView={setActiveView} preselectId={id} />;
        }
        return <AnalyticsDashboard setActiveView={setActiveView} mockUser={currentUser} />;
    }
  };

  return (
    <div className={`transition-colors duration-500`}>
      {!appLoaded && <SplashScreen onComplete={() => setAppLoaded(true)} />}
      
      {/* If loaded but not authenticated, show Landing/Login/Signup Screens */}
      {appLoaded && !isAuthenticated && (
        authScreen === 'landing' ? (
          <LandingPage 
            onNavigateLogin={() => { window.location.hash = 'login'; }} 
            onNavigateSignup={() => { window.location.hash = 'signup'; }}
          />
        ) : authScreen === 'login' ? (
          <LoginView 
            onLogin={handleLogin} 
            onNavigateSignup={() => { window.location.hash = 'signup'; }} 
          />
        ) : (
          <SignupView 
            onSignup={handleSignup} 
            onNavigateLogin={() => { window.location.hash = 'login'; }} 
          />
        )

      )}


      {/* The main app rendered behind the splash screen/login so it's ready when splash fades */}
      <div className={`h-screen w-full flex bg-[#f8f9fc] dark:bg-[#1a1f26] font-sans text-slate-800 dark:text-slate-200 overflow-hidden selection:bg-blue-600 selection:text-white transition-opacity duration-1000 ${appLoaded && isAuthenticated ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none -z-10'}`}>
        
        {/* Global Modals */}
        <CommandPalette 
          isOpen={isCommandPaletteOpen} 
          onClose={() => setIsCommandPaletteOpen(false)}
          setActiveView={setActiveView}
        />

        {/* Global Layout: Left Sidebar */}
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          onLogout={handleLogout} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          mockUser={mockUser}
        />

        {/* Global Layout: Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 bg-[#f8f9fc] dark:bg-[#1a1f26]">
          
          {/* Top Header / Taskbar */}
          <Header 
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} 
            theme={theme} 
            toggleTheme={toggleTheme} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            setActiveView={setActiveView}
            mockUser={mockUser}
            onLogout={handleLogout}
          />
          
          {/* Main Workspace Area */}
          <main className="flex-1 flex flex-col overflow-hidden bg-transparent">
            <ErrorBoundary>
              {renderView()}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
