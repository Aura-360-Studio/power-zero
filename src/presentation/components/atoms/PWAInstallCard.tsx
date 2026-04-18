import React, { useEffect, useState } from 'react';
import { Download, Smartphone, Info } from 'lucide-react';

export const PWAInstallCard: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Don't show if already installed
  if (isStandalone) return null;

  // If not iOS and no prompt available, hide it
  // This ensures we only show the card if it's actually installable
  if (!isIOS && !deferredPrompt) return null;

  return (
    <div className="bg-accent/10 border border-accent/20 rounded-3xl p-6 relative overflow-hidden mb-6 group">
      <div className="absolute -top-2 -right-2 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Smartphone size={64} className="text-accent" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-zinc-100 font-bold text-lg flex items-center gap-2">
            {isIOS ? 'Mobile Installation' : 'Install Sentinel'}
            <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Native</span>
          </h3>
        </div>
        
        <p className="text-zinc-500 text-sm mb-5 leading-relaxed max-w-[90%]">
          {isIOS 
            ? 'Tap the Share icon and then "Add to Home Screen" to install Power Zero as a native app.' 
            : 'Deploy this app to your home screen for a high-performance, distraction-free experience.'}
        </p>

        {deferredPrompt ? (
          <button 
            onClick={handleInstall}
            className="w-full bg-accent text-background font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(204,255,0,0.2)]"
          >
            <Download size={18} strokeWidth={3} />
            Add to Home Screen
          </button>
        ) : isIOS ? (
          <div className="flex items-center gap-3 text-accent text-[11px] font-bold bg-accent/5 p-4 rounded-2xl border border-accent/10 italic">
            <Info size={16} strokeWidth={3} />
            <span>Open Safari share menu → "Add to Home Screen"</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
