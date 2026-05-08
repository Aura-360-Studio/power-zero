import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Phase 1: Keep visible for a moment
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    // Phase 2: Unmount after fade out
    const unmountTimer = setTimeout(() => {
      setShouldRender(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="relative">
        {/* Pulsing Aura */}
        <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse scale-150" />
        
        {/* Logo Container */}
        <div className="relative w-24 h-24 bg-zinc-900 border-2 border border-border rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(204,255,0,0.1)] animate-bounce-subtle">
          <img src="/favicon.svg" alt="Power Zero Logo" className="w-12 h-12" />
        </div>
      </div>

      <div className={`mt-8 text-center transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h1 className="text-2xl font-black tracking-[0.2em] text-zinc-100 uppercase italic">Power Zero</h1>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="h-1 w-1 bg-accent rounded-full animate-ping" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Sentinel Protocol v1.0</span>
        </div>
      </div>

      {/* Loading Progress Line */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-surface shadow-[var(--card-shadow)] border border-border overflow-hidden rounded-full">
        <div className="h-full bg-accent animate-loading-bar" />
      </div>

      {/* Attribution */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <a 
          href="https://aura360studio.com/showcase" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[8px] font-black tracking-[0.3em] text-zinc-600 hover:text-accent transition-colors uppercase"
        >
          Powered by Aura 360 Studio
        </a>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite ease-in-out;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
