import React, { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress over ~2.5 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300); // Small delay after hitting 100% before fading out
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-industrial-900 flex flex-col items-center justify-center tech-grid">
      {/* Central Logo */}
      <div className="relative mb-8 animate-pulse-glow rounded-full p-6 bg-industrial-800 border border-industrial-700 shadow-[0_0_50px_rgba(56,189,248,0.2)]">
        <Cpu className="w-16 h-16 text-industrial-accent animate-pulse" />
        
        {/* Scanning ring */}
        <div className="absolute inset-0 border-2 border-transparent border-t-industrial-accent rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute inset-[-10px] border border-transparent border-b-industrial-success rounded-full animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }}></div>
      </div>

      {/* Loading Text */}
      <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-2">
        Booting AI Core
      </h1>
      <p className="text-sm font-mono text-industrial-accent mb-8">
        INITIALIZING NEURAL NETWORKS...
      </p>

      {/* Progress Bar */}
      <div className="w-64 h-1.5 bg-industrial-800 rounded-full overflow-hidden border border-industrial-700">
        <div 
          className="h-full bg-industrial-accent transition-all duration-200 ease-out shadow-[0_0_10px_rgba(56,189,248,0.8)]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Progress Percentage */}
      <div className="mt-2 text-xs font-mono text-slate-500">
        {Math.min(progress, 100)}%
      </div>
    </div>
  );
};

export default SplashScreen;
