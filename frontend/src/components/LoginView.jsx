import React, { useState } from 'react';
import { Mail, Eye, EyeOff, Globe, ArrowRight, CheckCircle2, Network, Sparkles, Database, Box, Shield, BrainCircuit, Activity, Clock } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { handleGoogleAuthSuccess, handleGoogleAuthError } from '../services/auth';
import NexoraLogo from '../assets/nexora-logo.svg.png';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const LoginView = ({ onLogin, onNavigateSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState(null);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setAuthError(null);
      const result = await handleGoogleAuthSuccess(tokenResponse);
      setIsGoogleLoading(false);
      if (result.success) {
        onLogin();
      } else {
        setAuthError("Google sign-in is temporarily unavailable. Please try again.");
      }
    },
    onError: (error) => {
      handleGoogleAuthError(error);
      setIsGoogleLoading(false);
      setAuthError("Google sign-in is temporarily unavailable. Please try again.");
    },
    prompt: 'select_account'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError("Please fill in all required fields.");
      return;
    }
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.response?.data?.error?.message || err.message || "Invalid email or password";
      setAuthError(errMsg);
    } finally {
      setIsLoggingIn(false);
    }
  };


  return (
    <div className={`min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans text-slate-900 absolute inset-0 z-50 transition-all duration-500`}>
      
      {/* BRAND & STORY PANEL (60% width on desktop) */}
      <div className={`hidden lg:flex lg:w-[60%] bg-[#0A101F] relative flex-col justify-center p-12 overflow-hidden border-r border-[#1E293B] transition-colors duration-500`}>
        
        {/* Dynamic Backgrounds */}
        <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#38BDF8]/5 blur-[100px] pointer-events-none"></div>

        {/* Top: Brand */}
        <div className="absolute top-12 left-12 z-10 flex items-center gap-2.5">
          <img src={NexoraLogo} alt="Nexora Logo" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-wide text-white">NEXORA</span>
        </div>

        <div className={`relative z-10 flex-1 flex flex-col justify-center w-full max-w-2xl mx-auto`}>
          
          {/* ==================== LOGIN ILLUSTRATION ==================== */}
          <div className="animate-fade-in w-full flex flex-col items-center">
            <div className="w-full max-w-[420px] bg-[#0F172A]/80 backdrop-blur-md rounded-xl border border-[#1E293B] shadow-2xl p-6 relative mb-12">
              <div className="flex justify-between items-center mb-8 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                <span>Raw Product Data</span>
                <span className="text-[#38BDF8] flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Enriched Intelligence</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-2.5 flex-1">
                  <div className="h-8 bg-[#1E293B]/50 rounded border border-[#334155]/50 flex items-center px-2.5 gap-2 animate-data-shimmer">
                    <Database className="w-3.5 h-3.5 text-slate-500" />
                    <div className="h-1.5 w-12 bg-slate-600 rounded-full"></div>
                  </div>
                  <div className="h-8 bg-[#1E293B]/50 rounded border border-[#334155]/50 flex items-center px-2.5 gap-2 animate-data-shimmer" style={{ animationDelay: '0.5s' }}>
                    <Database className="w-3.5 h-3.5 text-slate-500" />
                    <div className="h-1.5 w-20 bg-slate-600 rounded-full"></div>
                  </div>
                </div>
                <div className="relative flex-shrink-0 mx-1">
                  <div className="absolute top-1/2 -left-6 w-6 h-[1px] bg-gradient-to-r from-[#334155] to-[#38BDF8]/50 -translate-y-[10px] overflow-hidden">
                    <div className="animate-data-flow"></div>
                  </div>
                  <div className="absolute top-1/2 -left-6 w-6 h-[1px] bg-gradient-to-r from-[#334155] to-[#38BDF8]/50 translate-y-[10px] overflow-hidden">
                    <div className="animate-data-flow" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <div className="absolute top-1/2 -right-6 w-6 h-[1px] bg-gradient-to-l from-[#334155] to-[#38BDF8]/50 -translate-y-[10px] overflow-hidden">
                    <div className="animate-data-flow-out"></div>
                  </div>
                  <div className="absolute top-1/2 -right-6 w-6 h-[1px] bg-gradient-to-l from-[#334155] to-[#38BDF8]/50 translate-y-[10px] overflow-hidden">
                    <div className="animate-data-flow-out" style={{ animationDelay: '1.75s' }}></div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#0F172A] border border-[#38BDF8]/40 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.15)] z-10 relative animate-ai-breathe">
                    <Network className="w-5 h-5 text-[#38BDF8]" />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 flex-1">
                  <div className="h-8 bg-[#0F172A] rounded border border-[#38BDF8]/30 flex items-center px-2.5 gap-2 shadow-[0_0_10px_rgba(56,189,248,0.05)] animate-indicator-cyan transition-all duration-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span className="text-[11px] font-medium text-slate-200">Validated SKU</span>
                  </div>
                  <div className="h-8 bg-[#0F172A] rounded border border-indigo-500/30 flex items-center px-2.5 gap-2 shadow-[0_0_10px_rgba(99,102,241,0.05)] animate-indicator-indigo transition-all duration-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[11px] font-medium text-slate-200">Channel Ready</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-[420px] text-center lg:text-left w-full">
              <h1 className="text-[32px] font-bold text-white mb-3 leading-tight tracking-tight">Turn Product Data Into Product Intelligence.</h1>
              <p className="text-[15px] text-slate-400 leading-relaxed font-medium">Transform fragmented product data into clean, enriched, validated and channel-ready intelligence across your enterprise.</p>
            </div>
          </div>

        </div>
      </div>

      {/* AUTH FORM PANEL (40% width on desktop) */}
      <div className={`w-full lg:w-[40%] flex flex-col px-6 py-6 bg-white relative transition-all duration-500 overflow-y-auto`}>
        <div className="w-full max-w-[380px] mx-auto flex flex-col h-full min-h-full">
          
          {/* Unified Brand (Top) */}
          <div className="flex lg:hidden items-center gap-2.5">
            <img src={NexoraLogo} alt="Nexora Logo" className="w-7 h-7" />
            <span className="text-lg font-bold tracking-wide text-slate-900">NEXORA</span>
          </div>

          {/* Form Container (Middle) */}
          <div className="flex-1 flex flex-col justify-center py-4">
            <div className="mb-5">
              <h2 className="text-[26px] font-bold text-slate-900 mb-1.5 tracking-tight">
                Welcome back
              </h2>
              <p className="text-[13px] text-slate-500">
                Sign in to your Nexora workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
              
              {/* STUBBORN BROWSER AUTOFILL WORKAROUND */}
              <div style={{ position: 'absolute', opacity: 0, top: -9999, left: -9999 }} aria-hidden="true">
                <input type="email" name="fake_email_to_prevent_autofill" tabIndex="-1" autoComplete="username" />
                <input type="password" name="fake_password_to_prevent_autofill" tabIndex="-1" autoComplete="current-password" />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wide">Work Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="off"
                    name="work_email_field"
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-md px-3 py-2 text-[13px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">Password</label>
                  <a href="#" className="text-[12px] font-medium text-blue-600 hover:text-blue-800 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    name="work_password_field"
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-md px-3 py-2 pr-10 text-[13px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center pt-1 pb-1 animate-fade-in">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/30 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-600 font-medium">Remember me</span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-2.5 rounded-md text-[13px] transition-all active:scale-[0.98] disabled:opacity-70 shadow-sm"
              >
                {isLoggingIn ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="my-4 flex items-center before:flex-1 before:border-t before:border-slate-200 after:flex-1 after:border-t after:border-slate-200">
                <p className="mx-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Or continue with</p>
              </div>

              {authError && (
                <div className="text-red-500 font-medium text-center text-xs mb-3 animate-fade-in">
                  {authError}
                </div>
              )}

              <button 
                onClick={() => googleLogin()}
                disabled={isGoogleLoading || isLoggingIn}
                type="button" 
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2 rounded-md text-[13px] transition-all active:scale-[0.98] disabled:opacity-70 shadow-sm mb-4"
              >
                {isGoogleLoading ? (
                  <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                ) : (
                  <GoogleIcon />
                )}
                {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
              </button>
            </form>

            <p className="text-center text-[12px] text-slate-600 mt-1">
              Don't have a NEXORA account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigateSignup(); }} className="font-semibold text-blue-600 hover:underline">Create an account</a>
            </p>
          </div>

          {/* Footer links (Bottom) */}
          <div className="flex justify-between items-center text-[9px] text-slate-400 font-medium mt-auto">
            <span>© 2026 NEXORA. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginView;
