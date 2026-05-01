import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useProfileStore } from '../../store/useProfileStore';
import { FormGroup } from '../molecules/FormGroup';
import { TextField } from '../atoms/TextField';
import { X, CheckCircle2 } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetBudgetDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useProfileStore();
  const [localBudget, setLocalBudget] = useState(profile.monthlyBudget.toString());
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalBudget(profile.monthlyBudget.toString());
    }
  }, [isOpen, profile.monthlyBudget]);

  if (!isOpen && !successToast) return null;

  const handleSave = async () => {
    const budgetNum = parseFloat(localBudget) || 0;
    await updateProfile({ monthlyBudget: budgetNum });
    
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1500);
  };

  return createPortal(
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={onClose}
      />
      
      {successToast && (
         <div className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-accent text-background px-6 py-3 rounded-full shadow-2xl z-[80] flex items-center gap-2 font-bold text-sm max-w-md w-[80%] mx-auto justify-center animate-in fade-in zoom-in duration-300 text-center">
           <CheckCircle2 size={18} />
           Monthly budget set successfully
         </div>
      )}

      <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-zinc-900 rounded-t-[2.5rem] shadow-2xl z-[70] transition-transform duration-500 ease-out px-8 py-10 border-t border-white/10 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter text-zinc-100">Set Monthly Budget</h2>
            <p className="text-zinc-500 text-sm">Define your financial ceiling.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-zinc-100 transition-colors"><X size={24} strokeWidth={1.5} /></button>
        </div>

        <div className="flex flex-col gap-8 mb-10 pr-2">
          <FormGroup label="Monthly Limit">
            <TextField 
              type="number"
              value={localBudget} 
              onChange={(e) => setLocalBudget(e.target.value)} 
              placeholder="0.00" 
              className="text-xl font-bold"
            />
          </FormGroup>
          <p className="text-xs text-zinc-500 leading-relaxed">
            This value will be used as the baseline for all utilization metrics across your dashboard and sentinel records.
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 bg-white/5 text-zinc-100 font-bold tracking-widest uppercase text-xs py-5 rounded-2xl hover:bg-white/10 active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-[2] bg-accent text-background font-black tracking-widest uppercase text-xs py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgb(204,255,0,0.2)]"
          >
            Update Budget
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};
