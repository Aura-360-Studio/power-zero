import React, { useRef, useState } from 'react';
import { Download, Upload, Trash2, Database, ShieldAlert, CheckCircle2, Moon, Sun, Monitor, Bell } from 'lucide-react';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { backupService } from '../../infrastructure/utils/BackupService';
import { useProfileStore } from '../store/useProfileStore';
import { useRouterStore } from '../store/useRouterStore';
import { Settings2 } from 'lucide-react';
import { SetBudgetDrawer } from '../components/organisms/SetBudgetDrawer';
import { formatCurrency } from '../../core/utils/Currency';

export const Settings: React.FC = () => {
  const { subscriptions, archivedSubscriptions, wipeData, importData, isLoading, error } = useSubscriptionStore();
  const { profile, updateProfile } = useProfileStore();
  const { } = useRouterStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isBudgetDrawerOpen, setIsBudgetDrawerOpen] = useState(false);

  const handleExport = async () => {
    try {
      const json = await backupService.exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zhero-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed.");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (confirm("This will merge imported data with your local records. Proceed?")) {
        await importData(content);
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleWipe = async () => {
    if (confirm("CAUTION: This will permanently delete all your subscription data. This action is irreversible. Proceed?")) {
      if (confirm("Are you absolutely sure?")) {
        await wipeData();
      }
    }
  };

  const handleToggleNotifications = async () => {
    if (!profile.notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updateProfile({ notificationsEnabled: true });
      } else {
        alert("Permission denied. Enable notifications in your browser settings to activate Sentinel Alerts.");
      }
    } else {
      updateProfile({ notificationsEnabled: false });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-bold tracking-tighter text-zinc-100 mb-2">Settings</h2>
        <p className="text-zinc-500 font-medium">Manage your data sovereignty.</p>
      </header>

      <div className="space-y-6">
        {/* Status / Feedback */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
            <ShieldAlert size={18} />
            {error}
          </div>
        )}

        {/* Data Tools Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Database size={16} className="text-zinc-500" />
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Local-First Storage</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl divide-y divide-white/5 overflow-hidden">
            {/* Export */}
            <button 
              onClick={handleExport}
              className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group text-left"
            >
              <div>
                <span className="block font-bold text-zinc-100 mb-1">Export Database</span>
                <span className="text-sm text-zinc-500">Download all Sentinels, Preferences, and Alert configs as a portable JSON file.</span>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-accent group-hover:text-background transition-all">
                <Download size={20} />
              </div>
            </button>

            {/* Import */}
            <button 
              onClick={handleImportClick}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group text-left"
            >
              <div>
                <span className="block font-bold text-zinc-100 mb-1">Import Backup</span>
                <span className="text-sm text-zinc-500">Ingest records from a previously exported file.</span>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-accent group-hover:text-background transition-all">
                <Upload size={20} />
              </div>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />

            {/* Wipe */}
            <button 
              onClick={handleWipe}
              className="w-full flex items-center justify-between p-6 hover:bg-red-500/5 transition-colors group text-left"
            >
              <div>
                <span className="block font-bold text-red-400 mb-1">Wipe All Data</span>
                <span className="text-sm text-zinc-500">Nuke the local database. Proceed with extreme caution.</span>
              </div>
              <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-all">
                <Trash2 size={20} />
              </div>
            </button>
          </div>
        </section>

        {/* Global Budget Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Settings2 size={16} className="text-zinc-500" />
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Preferences</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden divide-y divide-white/5">
            {/* Budget */}
            <button 
              onClick={() => setIsBudgetDrawerOpen(true)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group text-left"
            >
              <div>
                <span className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Monthly Budget</span>
                <span className="text-2xl font-black text-zinc-100 tracking-tighter">
                  {formatCurrency(profile.monthlyBudget, profile.currency)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-accent group-hover:text-background transition-all">
                  <Settings2 size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-accent transition-colors">Update</span>
              </div>
            </button>

            {/* Currency */}
            <div className="p-6">
              <span className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Base Currency</span>
              <select 
                value={profile.currency}
                onChange={(e) => updateProfile({ currency: e.target.value })}
                className="w-full bg-zinc-900 rounded-xl border border-white/10 focus:border-accent p-3 text-zinc-100 font-medium text-sm focus:outline-none transition-all appearance-none"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* Theme Control */}
            <button 
              onClick={() => {
                const themes: ('system' | 'dark' | 'light')[] = ['system', 'dark', 'light'];
                const next = themes[(themes.indexOf(profile.theme) + 1) % themes.length];
                updateProfile({ theme: next });
              }}
              className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group text-left"
            >
              <div>
                <span className="block font-bold text-zinc-100 mb-1">Appearance</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                    {profile.theme === 'system' ? 'System Sync' : `${profile.theme} Mode`}
                  </span>
                  {profile.theme === 'system' && (
                    <span className="text-[9px] text-zinc-500 font-bold lowercase italic">
                      (Follows device settings)
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-accent group-hover:text-background transition-all flex items-center justify-center">
                {profile.theme === 'dark' ? <Moon size={18} /> : profile.theme === 'light' ? <Sun size={18} /> : <Monitor size={18} />}
              </div>
            </button>

            {/* Notifications */}
            <button 
              onClick={handleToggleNotifications}
              className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group text-left"
            >
              <div>
                <span className="block font-bold text-zinc-100 mb-1">Sentinel Alerts</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${profile.notificationsEnabled ? 'text-accent' : 'text-zinc-500'}`}>
                    {profile.notificationsEnabled ? 'Active' : 'Disabled'}
                  </span>
                  {profile.notificationsEnabled && (
                    <span className="text-[9px] text-zinc-500 font-bold lowercase italic">
                      (3 days and 24h prior)
                    </span>
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-2xl transition-all ${profile.notificationsEnabled ? 'bg-accent text-background' : 'bg-white/5 text-zinc-500 group-hover:bg-white/10'}`}>
                <Bell size={18} />
              </div>
            </button>
          </div>
        </section>

        {/* System Info */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Database size={16} className="text-zinc-500" />
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">System Info</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 font-medium text-sm">Database Health</span>
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-accent" />
                <span className="text-zinc-100 font-bold">{subscriptions.length + archivedSubscriptions.length} Records</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 font-medium text-sm">Version Tag</span>
              <span className="text-zinc-100 font-mono text-sm bg-white/10 px-2 py-1 rounded-md">v1.2.0</span>
            </div>
          </div>
        </section>

        {/* Budget Drawer */}
        <SetBudgetDrawer 
          isOpen={isBudgetDrawerOpen} 
          onClose={() => setIsBudgetDrawerOpen(false)} 
        />

        {/* Info Section */}
        <section className="pt-8">
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-accent" />
              <span className="font-bold text-zinc-100">Privacy Verified</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Zhero is a <strong>local-first</strong> application. Your data never leaves this device unless you explicitly export it. We do not use trackers, cloud sync, or external analytics.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
