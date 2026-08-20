import React, { useState } from 'react';
import { Layers, ArrowRight, Eye, EyeOff } from 'lucide-react';

const LoginView = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => onLogin(), 1300);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-cmd-900 overflow-hidden">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-cmd-950 p-12 relative overflow-hidden">
        {/* Background ambience */}
        <div className="absolute inset-0 tech-grid opacity-40 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-accent-cyan/8 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-purple-500/8 blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2.5 bg-accent-cyan/15 rounded-sm shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <Layers className="w-7 h-7 text-accent-cyan" />
            </div>
            <div>
              <p className="text-lg font-black text-white tracking-wide">Unilog AI</p>
              <p className="text-[11px] text-accent-cyan font-bold tracking-widest uppercase">Command Dashboard</p>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            One click,<br />every spec.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            AI-powered industrial catalog intelligence. Zero hallucinations, traceable sources, 252-column precision.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { val: '98.4%',  label: 'AI Confidence' },
            { val: '252',    label: 'Column Schema' },
            { val: '14,208', label: 'SKUs Processed' },
            { val: '0',      label: 'Hallucinations' },
          ].map((s, i) => (
            <div key={i} className="glass-panel-dark p-4">
              <p className="text-2xl font-black text-white">{s.val}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <p className="text-[12px] italic text-slate-500">"एक क्लिक, हर स्पेक की जानकारी"</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-status-online animate-live-dot" />
            <span className="text-[11px] text-status-online font-bold">System Online — All Services Nominal</span>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-cyan/5 blur-[150px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="p-2 bg-accent-cyan/15 rounded-sm">
              <Layers className="w-6 h-6 text-accent-cyan" />
            </div>
            <p className="text-lg font-black text-white">Unilog AI</p>
          </div>

          <h2 className="text-2xl font-black text-white mb-1">Sign in to Dashboard</h2>
          <p className="text-slate-400 text-sm mb-8">Access the AI product intelligence command center.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="devaansh@unihack.ai"
                className="w-full bg-cmd-800 border border-white/10 text-white rounded-sm px-4 py-3 text-sm outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-all placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cmd-800 border border-white/10 text-white rounded-sm px-4 py-3 pr-12 text-sm outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-all placeholder-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="tactile-button w-full flex items-center justify-center gap-2 bg-accent-cyan text-cmd-900 font-black py-3 rounded-sm text-sm disabled:opacity-70 shadow-[0_0_25px_rgba(56,189,248,0.3)]"
            >
              {isLoggingIn
                ? <><div className="w-4 h-4 border-2 border-cmd-900 border-t-transparent rounded-full animate-spin" /> Initializing...</>
                : <>Sign In to Command Dashboard <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[11px] text-slate-600 uppercase font-semibold">Or continue with</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-cmd-800 hover:bg-cmd-750 border border-white/10 text-white font-semibold py-3 rounded-sm text-sm transition-all active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          <p className="text-center text-[11px] text-slate-600 mt-6">
            UniHack 2026 · AI Product Intelligence Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
