import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DesktopWrapperProps {
  children: React.ReactNode;
}

export const DesktopWrapper: React.FC<DesktopWrapperProps> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [hasExplored, setHasExplored] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) {
    return <>{children}</>;
  }

  const BackgroundElements = () => {
    const symbols = ['₹', '$', '€', '£', '¥'];
    return (
      <>
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-10" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />
        
        {/* Animated Glowing Orbs */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-600/50 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        </div>
        
        {/* Lightning Flashes */}
        <div className="absolute inset-0 z-0 bg-white mix-blend-overlay pointer-events-none" style={{ animation: 'lightningFlash 7s infinite' }} />
        <div className="absolute inset-0 z-0 bg-accent mix-blend-overlay pointer-events-none" style={{ animation: 'lightningFlash 11s infinite 3s' }} />

        {/* Floating Currency Leak Animation */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-20 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div 
              key={`currency-${i}`} 
              className="absolute text-accent font-black text-2xl blur-[1px]" 
              style={{ 
                left: `${5 + Math.random() * 90}%`,
                animation: `floatUp ${10 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * -15}s`
              }} 
            >
              {symbols[i % symbols.length]}
            </div>
          ))}
        </div>

        {/* Animated Equalizer Base */}
        <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end gap-1 opacity-20 px-8 z-0">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="flex-1 bg-gradient-to-t from-accent to-transparent rounded-t-sm animate-pulse" 
              style={{ 
                height: `${20 + Math.random() * 80}%`, 
                animationDuration: `${1 + Math.random() * 2}s`,
                animationDelay: `${Math.random()}s` 
              }} 
            />
          ))}
        </div>
      </>
    );
  };

  // Warning Overlay View
  if (!hasExplored) {
    return (
      <div className="min-h-[100dvh] bg-[#09090b] flex items-center justify-center p-6 font-sans relative overflow-hidden">
        
        <BackgroundElements />

        <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 max-w-md text-center relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-center transform scale-95">
          {/* Subtle inner glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.1)] mb-4 backdrop-blur-md">
              <img src="/pwa-icon.svg" alt="Zhero Logo" className="w-6 h-6" />
            </div>
            
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
              Zhero is a <span className="text-accent">Mobile-First</span> Experience
            </h1>
            
            <p className="text-zinc-400 leading-relaxed mb-6 font-medium text-xs max-w-sm">
              To enjoy our privacy-first local tracking and immersive full-screen interactions, please visit this site on your mobile device.
            </p>

            <div className="bg-white p-3 rounded-2xl mb-5 shadow-[0_0_40px_rgba(204,255,0,0.2)] hover:scale-105 transition-transform duration-500">
              {url && (
                <QRCodeSVG 
                  value={url} 
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  includeMargin={false}
                />
              )}
            </div>
            
            <h3 className="text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              Scan to Deploy on Mobile
            </h3>
            <p className="text-zinc-500 text-[10px] mb-6">
              Install as a PWA for the full Zhero App experience.
            </p>
            
            <div className="flex gap-4 w-full justify-center">
              <button 
                onClick={() => setHasExplored(true)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold tracking-widest text-[10px] px-6 py-3 rounded-full transition-colors backdrop-blur-md uppercase"
              >
                Explore Anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Explored Phone Mockup View
  return (
    <div className="min-h-[100dvh] bg-[#09090b] flex items-center justify-center py-10 relative overflow-hidden font-sans">
      
      <BackgroundElements />

      {/* Back to Home Button */}
      <button 
        onClick={() => setHasExplored(false)}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full font-bold text-sm transition-colors backdrop-blur-md"
      >
        <ChevronLeft size={16} />
        Back to Landing
      </button>

      {/* The App Container (Phone Mockup) */}
      {/* Adding transform-gpu converts this div into the containing block for 'fixed' children like the Bottom Nav */}
      <div className="w-full max-w-[400px] h-[850px] max-h-[90vh] bg-background rounded-[3rem] border-[10px] border-[#18181b] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-20 overflow-hidden flex flex-col ring-1 ring-white/10 transform-gpu">
        
        {/* Dynamic Island / Notch Mockup */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#18181b] rounded-b-3xl z-[100] flex items-center justify-center gap-2 shadow-md">
          <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
          <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
        </div>

        {/* Real App Content */}
        {/* We wrap it in a relative container that takes full height to ensure fixed descendants are positioned correctly */}
        <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
          {children}
        </div>
        
        {/* Home Indicator Line */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-500/30 rounded-full z-[100] pointer-events-none" />
      </div>
    </div>
  );
};
