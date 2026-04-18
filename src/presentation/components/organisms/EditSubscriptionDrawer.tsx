import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { SubscriptionSchema } from '../../../core/domain/SubscriptionSchema';
import { FormGroup } from '../molecules/FormGroup';
import { TextField } from '../atoms/TextField';
import { X, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import type { Subscription } from '../../../core/domain/Subscription';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
}

export const EditSubscriptionDrawer: React.FC<DrawerProps> = ({ isOpen, onClose, subscription }) => {
  const { updateSubscription } = useSubscriptionStore();
  const [formData, setFormData] = useState({
    name: subscription.name,
    amount: subscription.amount.toString(),
    category: subscription.category,
    cycle: subscription.cycle,
    nextBillingDate: new Date(subscription.nextBillingDate).toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setFormData({
      name: subscription.name,
      amount: subscription.amount.toString(),
      category: subscription.category,
      cycle: subscription.cycle,
      nextBillingDate: new Date(subscription.nextBillingDate).toISOString().split('T')[0]
    });
  }, [subscription]);

  if (!isOpen && !successToast) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value as any }));
  };

  const handleUpdate = async () => {
    setErrors({});
    
    const payload = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      cycle: formData.cycle,
      nextBillingDate: new Date(formData.nextBillingDate).toISOString(),
    };

    try {
      // Validate logically completely external to the store to maintain pristine state
      SubscriptionSchema.partial().parse(payload);
      
      await updateSubscription(subscription.id!, payload as any);
      
      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
        onClose();
      }, 1500);

    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        (err as z.ZodError<any>).issues.forEach((e) => {
          if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return createPortal(
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={onClose}
      />
      
      {successToast && (
         <div className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-accent text-background px-6 py-3 rounded-full shadow-2xl z-[80] flex items-center gap-2 font-bold text-sm max-w-md w-[80%] mx-auto justify-center animate-in fade-in zoom-in duration-300">
           <CheckCircle2 size={18} />
           Sentinel Updated
         </div>
      )}

      <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-zinc-900 rounded-t-[2.5rem] shadow-2xl z-[70] transition-transform duration-500 ease-out px-8 py-10 border-t border-white/10 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter text-zinc-100">Edit Sentinel</h2>
            <p className="text-zinc-500 text-sm">Update financial monitor parameters.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-zinc-100 transition-colors"><X size={24} strokeWidth={1.5} /></button>
        </div>

        <div className="flex flex-col gap-8 mb-10 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <FormGroup label="Sentinel Name" error={errors.name}>
            <TextField name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Netflix, OpenAI..." />
          </FormGroup>

          <FormGroup label="Financial Leak (Amount)" error={errors.amount}>
            <TextField name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} placeholder="0.00" />
          </FormGroup>

          <div className="grid grid-cols-2 gap-6">
            <FormGroup label="Category" error={errors.category}>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full bg-white/5 rounded-xl border border-white/10 focus:border-accent p-3 text-zinc-100 font-medium text-sm focus:outline-none transition-all appearance-none"
              >
                <option value="ENTERTAINMENT">ENTERTAINMENT</option>
                <option value="MUSIC">MUSIC</option>
                <option value="TOOLS">TOOLS</option>
                <option value="LEARNING">LEARNING</option>
                <option value="WELLNESS">WELLNESS</option>
                <option value="UTILITY">UTILITY</option>
              </select>
            </FormGroup>

            <FormGroup label="Time Cycle" error={errors.cycle}>
              <select 
                name="cycle" 
                value={formData.cycle} 
                onChange={handleChange}
                className="w-full bg-white/5 rounded-xl border border-white/10 focus:border-accent p-3 text-zinc-100 font-medium text-sm focus:outline-none transition-all appearance-none"
              >
                <option value="MONTHLY">MONTHLY</option>
                <option value="YEARLY">YEARLY</option>
                <option value="WEEKLY">WEEKLY</option>
                <option value="DAILY">DAILY</option>
              </select>
            </FormGroup>
          </div>

          <FormGroup label="Next Billing Date" error={errors.nextBillingDate}>
             <TextField name="nextBillingDate" type="date" value={formData.nextBillingDate} onChange={handleChange} />
          </FormGroup>

        </div>

        <button 
          onClick={handleUpdate}
          className="w-full bg-accent text-background font-black tracking-widest uppercase text-xs py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgb(204,255,0,0.2)]"
        >
          Update Sentinel
        </button>
      </div>
    </>,
    document.body
  );
};
