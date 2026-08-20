import React, { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';

const bootMessages = [
  'Initializing neural networks...',
  'Loading LOV schema (252 columns)...',
  'Connecting to FastAPI backend...',
  'Warming up web search grounding...',
  'Calibrating zero-hallucination engine...',
  'Ready.',
];

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.floor(Math.random() * 12) + 4, 100);
        const mIdx = Math.floor((next / 100) * bootMessages.length);
        setMsgIdx(Math.min(mIdx, bootMessages.length - 1));
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
        }
        return next;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-cmd-900 flex flex-col items-center justify-center tech-grid overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-accent-cyan/6 blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      {/* Logo */}
      <div className="relative mb-8">
        {/* Outer rings */}
        <div className="absolute inset-[-20px] border border-accent-cyan/15 rounded-full animate-spin-slow" />
        <div className="absolute inset-[-36px] border border-accent-cyan/8 rounded-full animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />

        <div className="relative p-6 bg-cmd-800 rounded-sm border border-accent-cyan/20 shadow-[0_0_50px_rgba(56,189,248,0.2)]">
          <Layers className="w-14 h-14 text-accent-cyan" />
          {/* Laser scan */}
          <div className="animate-laser" />
        </div>
      </div>

      {/* Brand */}
      <h1 className="text-[28px] font-black text-white tracking-widest uppercase mb-1">
        Unilog AI
      </h1>
      <p className="text-[13px] font-bold text-accent-cyan tracking-[0.3em] uppercase mb-2">
        Command Dashboard
      </p>
      <p className="text-[12px] font-mono text-slate-500 mb-10 h-4">
        {bootMessages[msgIdx]}
      </p>

      {/* Progress bar */}
      <div className="w-72 space-y-2">
        <div className="h-1 bg-cmd-800 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full rounded-full transition-all duration-200 ease-out shadow-[0_0_10px_rgba(56,189,248,0.8)]"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #0EA5E9, #38BDF8)' }}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-mono text-slate-600">SYSTEM BOOT</p>
          <p className="text-[10px] font-mono text-accent-cyan">{Math.min(progress, 100)}%</p>
        </div>
      </div>

      {/* UniHack badge */}
      <p className="absolute bottom-8 text-[11px] text-slate-700 font-mono">
        UniHack 2026 · AI Product Intelligence · v2.1.0
      </p>
    </div>
  );
};

export default SplashScreen;
