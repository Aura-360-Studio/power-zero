import React, { useEffect } from 'react';
import { useProfileStore } from '../store/useProfileStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { formatCurrency } from '../../core/utils/Currency';
import { ShieldCheck, Zap } from 'lucide-react';
import { TextField } from '../components/atoms/TextField';
import { PWAInstallCard } from '../components/atoms/PWAInstallCard';
import { getInitials } from '../../core/utils/Identity';

export const Profile: React.FC = () => {
  const { profile, fetchProfile, updateProfile } = useProfileStore();
  const { archivedSubscriptions } = useSubscriptionStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const initials = getInitials(profile.name);

  // Sync "Total Neutralized" with the sum of archived targets for consistency
  const totalNeutralized = archivedSubscriptions.reduce((acc, sub) => {
    // Convert to monthly weight for the metric
    if (sub.cycle === 'DAILY') return acc + (sub.amount * 30.41);
    if (sub.cycle === 'WEEKLY') return acc + (sub.amount * 4.33);
    if (sub.cycle === 'YEARLY') return acc + (sub.amount / 12);
    return acc + sub.amount;
  }, 0);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProfile({ name: e.target.value });
  };


  return (
    <div className="animate-page-in">
      <header className="mb-10">
        <h2 className="text-3xl font-bold tracking-tighter text-zinc-100 mb-2">Zhero Profile</h2>
        <p className="text-zinc-500 font-medium">Identity and Preferences.</p>
      </header>

      <div className="space-y-8">
        {/* Identity Block */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-50" />
          <div className="relative flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-2xl font-black text-accent tracking-tighter shadow-[0_0_20px_rgba(204,255,0,0.2)]">
              {initials}
            </div>
            <div className="flex-1">
              <TextField 
                className="text-2xl font-bold border-none px-0 py-0 text-zinc-100 bg-transparent focus:ring-0 mb-1" 
                value={profile.name} 
                onChange={handleNameChange}
                placeholder="User Sentinel"
              />
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-xs font-bold text-accent uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>
        </section>

        {/* Lifetime Metrics */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Zap size={16} className="text-accent" />
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Lifetime Metrics</span>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute w-32 h-32 bg-accent/20 blur-3xl rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <span className="text-zinc-400 font-medium mb-1 relative z-10">Total Neutralized</span>
            <span className="text-4xl font-black text-accent tracking-tighter relative z-10">
              {formatCurrency(totalNeutralized, profile.currency)}
            </span>
          </div>
        </section>
        
        {/* Sentinel Briefing */}
        <section className="pb-10">
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck size={100} className="text-accent" />
            </div>
            <div className="relative z-10">
              <h3 className="text-accent text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                Sentinel Briefing
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-zinc-100 font-bold mb-1 text-sm">What is a Sentinel?</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    A Sentinel is more than just a tracker. It is a specialized local-first guardian designed to monitor specific financial "leaks" (subscriptions). In this app, every subscription you add is deployed as an active Sentinel.
                  </p>
                </div>
                <div>
                  <h4 className="text-zinc-100 font-bold mb-1 text-sm">The Philosophy</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    We don't use the word "Subscription" because Zhero is built on the principle of active neutralization. Instead of passively spending, you are deploying Sentinels to ensure that every rupee spent is intentional and visible.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <p className="text-[10px] text-zinc-600 font-mono">
                    IDENTITY: LOCAL // DATA: ENCRYPTED // STATUS: SECURE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PWAInstallCard />

        <div className="py-10 text-center border-t border-white/5">
          <a 
            href="https://aura360studio.com/showcase" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] font-black tracking-[0.4em] text-zinc-600 hover:text-accent transition-colors uppercase italic"
          >
            Powered by Aura 360 Studio
          </a>
        </div>
      </div>
    </div>
  );
};
