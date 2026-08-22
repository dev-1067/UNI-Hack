import React, { useState } from 'react';
import { Mail, Eye, EyeOff, Globe, ArrowRight, CheckCircle2, Network, Sparkles, Database, Box, Shield, BrainCircuit, Activity, Clock } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { handleGoogleAuthSuccess, handleGoogleAuthError } from '../services/auth';
import NexoraLogo from '../assets/nexora-logo.svg.png';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const SignupView = ({ onSignup, onNavigateLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [authError, setAuthError] = useState(null);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setAuthError(null);
      const result = await handleGoogleAuthSuccess(tokenResponse);
      setIsGoogleLoading(false);
      if (result.success) {
        onSignup();
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
    if (!name || !email || !password || !confirmPassword) {
      setAuthError("Please fill in all required fields.");
      return;
    }
    if (!agreeTerms) {
      setAuthError("You must agree to the Terms of Service.");
      return;
    }
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      await onSignup(name, email, password);
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.response?.data?.error?.message || err.message || "Failed to create account. Please try again.";
      setAuthError(errMsg);
    } finally {
      setIsLoggingIn(false);
    }
  };


  return (
    <div className={`min-h-screen w-full flex flex-col lg:flex-row-reverse bg-white font-sans text-slate-900 absolute inset-0 z-50 transition-all duration-500`}>

      {/* BRAND & STORY PANEL (60% width on desktop) */}
      <div className={`hidden lg:flex lg:w-[60%] bg-[#050810] relative flex-col justify-center p-12 overflow-hidden border-l border-[#1E293B] transition-colors duration-500`}>

        {/* Dynamic Backgrounds */}
        <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

        <div className={`relative z-10 flex-1 flex flex-col justify-center w-full max-w-2xl mx-auto -mt-10`}>

          {/* ==================== SIGNUP ILLUSTRATION ==================== */}
          <div className="animate-fade-in w-full flex flex-col items-center">

            <div className="text-center mb-8 max-w-xl mx-auto">
              <h1 className="text-3xl md:text-[36px] font-bold text-white mb-3 leading-tight tracking-tight">
                Your Product Data.<br />One Intelligent Workspace.
              </h1>
              <p className="text-[14px] text-slate-300/80 leading-relaxed font-medium max-w-[450px] mx-auto">
                Bring fragmented product information together, improve data quality, and activate your catalog across every commerce channel.
              </p>
            </div>

            {/* Glassmorphism Dashboard Mockup */}
            <div className="w-full max-w-[580px] bg-[#0A101F]/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] p-4 relative overflow-hidden text-[10px]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

              {/* Top Row: KPIs */}
              <div className="grid grid-cols-4 gap-2.5 mb-3 relative z-10">
                <div className="bg-[#1E293B]/60 border border-white/5 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 mb-1"><Box className="w-[10px] h-[10px] text-slate-400" /> <span className="text-[8px] font-bold tracking-widest text-slate-400 uppercase">Total Products</span></div>
                  <div className="text-base font-bold text-white">14,482</div>
                </div>
                <div className="bg-[#1E293B]/60 border border-white/5 rounded-lg p-2.5 relative overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-1"><Shield className="w-[10px] h-[10px] text-[#38BDF8]" /> <span className="text-[8px] font-bold tracking-widest text-[#38BDF8] uppercase">Data Quality</span></div>
                  <div className="text-base font-bold text-white">94%</div>
                  <div className="absolute bottom-0 left-0 h-0.5 bg-[#38BDF8] w-full"></div>
                </div>
                <div className="bg-[#1E293B]/60 border border-white/5 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 mb-1"><Sparkles className="w-[10px] h-[10px] text-slate-400" /> <span className="text-[8px] font-bold tracking-widest text-slate-400 uppercase">Enriched Products</span></div>
                  <div className="text-base font-bold text-white">8,742</div>
                </div>
                <div className="bg-[#1E293B]/60 border border-white/5 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 mb-1"><Network className="w-[10px] h-[10px] text-slate-400" /> <span className="text-[8px] font-bold tracking-widest text-slate-400 uppercase">Channel Ready</span></div>
                  <div className="text-base font-bold text-white">9,126</div>
                </div>
              </div>

              {/* Middle Row */}
              <div className="grid grid-cols-3 gap-3 mb-3 relative z-10">
                {/* Chart */}
                <div className="bg-[#1E293B]/60 border border-white/5 rounded-lg p-2.5 flex flex-col min-h-[90px]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Product Health</span>
                    <span className="text-[8px] text-slate-500">Last 30 Days</span>
                  </div>
                  <div className="flex-1 flex items-end gap-1.5 justify-between">
                    <div className="w-full bg-slate-700/50 rounded-t-sm h-[30%] hover:bg-[#38BDF8] transition-colors"></div>
                    <div className="w-full bg-slate-700/50 rounded-t-sm h-[40%] hover:bg-[#38BDF8] transition-colors"></div>
                    <div className="w-full bg-slate-700/50 rounded-t-sm h-[50%] hover:bg-[#38BDF8] transition-colors"></div>
                    <div className="w-full bg-slate-700/50 rounded-t-sm h-[65%] hover:bg-[#38BDF8] transition-colors"></div>
                    <div className="w-full bg-slate-700/50 rounded-t-sm h-[80%] hover:bg-[#38BDF8] transition-colors"></div>
                    <div className="w-full bg-[#0284C7] rounded-t-sm h-[95%]"></div>
                  </div>
                </div>
                {/* Recommendations */}
                <div className="bg-[#1E293B]/60 border border-white/5 rounded-lg p-2.5">
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider block mb-2">AI Recommendations</span>
                  <div className="space-y-1.5">
                    <div className="bg-[#0F172A]/50 border border-blue-500/20 p-1.5 rounded text-[8px] text-blue-200">Optimize 42 descriptions</div>
                    <div className="bg-[#0F172A]/50 border border-slate-700 p-1.5 rounded text-[8px] text-slate-400">Missing attributes: Color, Size</div>
                  </div>
                </div>
                {/* Activity */}
                <div className="bg-[#1E293B]/60 border border-white/5 rounded-lg p-2.5">
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider block mb-2">Recent Activity</span>
                  <div className="space-y-2 relative before:absolute before:left-[4px] before:top-1 before:bottom-1 before:w-[1px] before:bg-slate-700">
                    <div className="flex gap-2 relative z-10 pl-2.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500 absolute left-0 top-[2px] shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                      <div>
                        <p className="text-[8px] text-white font-medium leading-tight">Batch updated 500 SKUs</p>
                        <p className="text-[7px] text-slate-500 mt-0.5">2 mins ago</p>
                      </div>
                    </div>
                    <div className="flex gap-2 relative z-10 pl-2.5">
                      <div className="w-2 h-2 rounded-full bg-slate-600 absolute left-0 top-[2px]"></div>
                      <div>
                        <p className="text-[8px] text-slate-300 font-medium leading-tight">AI generated 120 descriptions</p>
                        <p className="text-[7px] text-slate-500 mt-0.5">15 mins ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="bg-[#1E293B]/60 border border-white/5 rounded-lg p-2.5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] font-bold text-white">Catalog Health Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-gradient-to-r from-blue-500 to-[#38BDF8]"></div>
                  </div>
                  <span className="text-[9px] font-mono text-[#38BDF8]">85%</span>
                  <span className="text-[9px] text-emerald-400 font-medium ml-1 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Excellent
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* AUTH FORM PANEL (40% width on desktop) */}
      <div className={`w-full lg:w-[40%] flex flex-col px-6 py-6 bg-white relative transition-all duration-500 overflow-y-auto`}>
        <div className="w-full max-w-[380px] mx-auto flex flex-col h-full min-h-full">

          {/* Unified Brand (Top) */}
          <div className="flex items-center gap-2.5">
            <img src={NexoraLogo} alt="Nexora Logo" className="w-7 h-7" />
            <span className="text-lg font-bold tracking-wide text-slate-900">NEXORA</span>
          </div>

          {/* Form Container (Middle) */}
          <div className="flex-1 flex flex-col justify-center py-4">
            <div className="mb-5">
              <h2 className="text-[26px] font-bold text-slate-900 mb-1.5 tracking-tight">
                Create your account
              </h2>
              <p className="text-[13px] text-slate-500">
                Start transforming your product data with NEXORA.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">

              {/* STUBBORN BROWSER AUTOFILL WORKAROUND */}
              <div style={{ position: 'absolute', opacity: 0, top: -9999, left: -9999 }} aria-hidden="true">
                <input type="text" name="fake_name_to_prevent_autofill" tabIndex="-1" />
                <input type="email" name="fake_email_to_prevent_autofill" tabIndex="-1" autoComplete="username" />
                <input type="password" name="fake_password_to_prevent_autofill" tabIndex="-1" autoComplete="new-password" />
              </div>

              <div className="animate-fade-in">
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    autoComplete="off"
                    name="work_name_field"
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-md px-3 py-2 text-[13px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400"
                  />
                </div>
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
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
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

              <div className="animate-fade-in">
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wide">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    name="work_password_confirm_field"
                    className={`w-full bg-white border ${password !== confirmPassword && confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600'} text-slate-900 rounded-md px-3 py-2 pr-10 text-[13px] outline-none focus:ring-1 transition-all placeholder:text-slate-400`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start pt-1 pb-1 animate-fade-in">
                <label className="flex items-start gap-2.5 cursor-pointer mt-0.5">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/30 cursor-pointer mt-0.5"
                  />
                  <span className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                  </span>
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
                  "Create Account"
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
              Already have a NEXORA account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLogin(); }} className="font-semibold text-blue-600 hover:underline">Sign in</a>
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

export default SignupView;
