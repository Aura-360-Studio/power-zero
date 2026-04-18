import React, { useRef } from 'react';
import { Download, Upload, Trash2, Database, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { backupService } from '../../infrastructure/utils/BackupService';

export const Settings: React.FC = () => {
  const { wipeData, importData, isLoading, error } = useSubscriptionStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const json = await backupService.exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `power-zero-export-${new Date().toISOString().split('T')[0]}.json`;
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
                <span className="text-sm text-zinc-500">Download all records as a portable JSON file.</span>
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

        {/* Info Section */}
        <section className="pt-8">
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-accent" />
              <span className="font-bold text-zinc-100">Privacy Verified</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Power Zero is a <strong>local-first</strong> application. Your data never leaves this device unless you explicitly export it. We do not use trackers, cloud sync, or external analytics.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
