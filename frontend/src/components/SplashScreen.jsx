import React, { useEffect, useState, useRef } from 'react';
import { Cpu } from 'lucide-react';
import NexoraLogo from '../assets/nexora-logo.svg.png';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Fast, smooth loading progress over ~800ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          }, 150);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A101F] flex flex-col items-center justify-center tech-grid">
      {/* Central Logo */}
      <div className="relative mb-8 animate-pulse-glow rounded-full p-6 bg-[#0F172A] border border-[#1E293B] shadow-[0_0_50px_rgba(56,189,248,0.25)]">
        <img src={NexoraLogo} alt="Nexora Logo" className="w-16 h-16 animate-pulse" />
        
        {/* Scanning rings */}
        <div className="absolute inset-0 border-2 border-transparent border-t-[#38BDF8] rounded-full animate-spin" style={{ animationDuration: '1.2s' }}></div>
        <div className="absolute inset-[-10px] border border-transparent border-b-[#00E599] rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
      </div>

      {/* Loading Text */}
      <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-2">
        NEXORA AI
      </h1>
      <p className="text-xs font-mono text-[#38BDF8] tracking-widest mb-8">
        INITIALIZING CORE WORKSPACE...
      </p>

      {/* Progress Bar */}
      <div className="w-64 h-1.5 bg-[#1E293B] rounded-full overflow-hidden border border-[#334155]">
        <div 
          className="h-full bg-gradient-to-r from-[#38BDF8] to-[#00E599] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(56,189,248,0.8)]"
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      
      {/* Progress Percentage */}
      <div className="mt-2 text-xs font-mono text-slate-400">
        {Math.min(progress, 100)}%
      </div>
    </div>
  );
};

export default SplashScreen;
