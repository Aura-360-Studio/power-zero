import React from 'react';
import { Download, Smartphone, Info, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallCard: React.FC = () => {
  const { isInstallable, isStandalone, isIOS, isMobile, install } = usePWAInstall();

  // Don't show if already installed
  if (isStandalone) return null;

  // Don't show if not on mobile AND not explicitly installable (hides on standard desktop)
  if (!isMobile && !isInstallable) return null;

  // If not iOS and not installable (no prompt yet), hide it
  // But for iOS we always want to show instructions if not standalone
  if (!isIOS && !isInstallable) return null;

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden mb-12 group transition-all duration-500 hover:border-accent/30 shadow-2xl">
      {/* Background Decorative Elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 blur-[80px] rounded-full group-hover:bg-accent/10 transition-colors duration-700" />
      <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 transform group-hover:scale-110">
        <Smartphone size={120} strokeWidth={1} className="text-accent" />
      </div>
      
      <div className="relative z-10">
        <header className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
            <ShieldCheck size={24} className="text-accent" />
          </div>
          <div>
            <h3 className="text-zinc-100 font-black text-xl tracking-tighter uppercase italic">
              {isIOS ? 'Mobile Sentinel' : 'Deploy Native'}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Web App</span>
              <div className="w-1 h-1 bg-zinc-600 rounded-full" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">v1.0.0 Stable</span>
            </div>
          </div>
        </header>
        
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed font-medium">
          {isIOS 
            ? 'Transform Power Zero into a high-performance native utility. Tap "Share" and "Add to Home Screen" to bypass browser limitations.' 
            : 'Experience the full power of the Sentinel with a distraction-free native interface. No address bars, just pure focus.'}
        </p>

        {isInstallable ? (
          <button 
            onClick={install}
            className="w-full bg-accent text-background font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(204,255,0,0.25)] group/btn"
          >
            <Download size={20} strokeWidth={3} className="group-hover:animate-bounce" />
            INSTALL SENTINEL
          </button>
        ) : isIOS ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4 text-accent text-xs font-bold bg-accent/5 p-5 rounded-[1.5rem] border border-accent/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-50" />
              <Info size={18} strokeWidth={3} className="shrink-0 mt-0.5" />
              <div className="relative z-10 flex flex-col gap-1">
                <span className="uppercase tracking-widest">iOS Installation Procedure:</span>
                <span className="text-zinc-300 font-medium">1. Open Safari share menu</span>
                <span className="text-zinc-300 font-medium">2. Select "Add to Home Screen"</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
