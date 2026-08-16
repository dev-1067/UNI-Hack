import React, { useState } from 'react';
import { Cpu, Globe, Mail, ArrowRight } from 'lucide-react';

const LoginView = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    // Simulate auth delay
    setTimeout(() => {
      onLogin();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center tech-grid bg-industrial-900">
      
      {/* Ambience */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-industrial-accent/5 blur-[150px] pointer-events-none"></div>

      <div className="glass-panel w-full max-w-md p-8 relative z-10 animate-fade-in shadow-[0_0_50px_rgba(56,189,248,0.1)]">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-industrial-800 rounded-2xl border border-industrial-700 shadow-lg group hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all">
            <Cpu className="w-10 h-10 text-industrial-accent group-hover:animate-pulse" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white tracking-tight">AI Product Intelligence</h2>
          <p className="text-slate-400 text-sm mt-2">Log in to access the extraction workspace.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="devaansh@unihack.ai"
                className="w-full bg-industrial-900/80 border border-industrial-700 text-white rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-industrial-accent focus:ring-1 focus:ring-industrial-accent transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 bg-industrial-accent hover:bg-sky-400 text-industrial-900 font-black py-2.5 rounded-lg transition-all active:scale-95 disabled:opacity-70 mt-2"
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-industrial-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Sign In <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-industrial-700 after:mt-0.5 after:flex-1 after:border-t after:border-industrial-700">
          <p className="mx-4 mb-0 text-center text-xs font-semibold text-slate-500 uppercase">Or</p>
        </div>

        <button 
          onClick={handleLogin}
          type="button" 
          className="w-full flex items-center justify-center gap-3 bg-industrial-800 hover:bg-industrial-700 border border-industrial-700 text-white font-semibold py-2.5 rounded-lg transition-all active:scale-95"
        >
          <Globe className="w-5 h-5" /> Continue with GitHub
        </button>

      </div>
    </div>
  );
};

export default LoginView;
