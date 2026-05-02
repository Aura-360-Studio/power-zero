import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { SubscriptionSchema } from '../../../core/domain/SubscriptionSchema';
import { FormGroup } from '../molecules/FormGroup';
import { TextField } from '../atoms/TextField';
import { X, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import type { Subscription } from '../../../core/domain/Subscription';

import { BillingCalculator } from '../../../core/utils/BillingCalculator';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
}

export const EditSubscriptionDrawer: React.FC<DrawerProps> = ({ isOpen, onClose, subscription }) => {
  const { updateSubscription } = useSubscriptionStore();
  
  // Migration logic for initial state
  const normalized = BillingCalculator.migrateLegacySubscription(subscription);

  const [formData, setFormData] = useState({
    name: normalized.name,
    amount: normalized.amount.toString(),
    category: normalized.category,
    cycleType: normalized.cycleType,
    cycleValue: normalized.cycleValue.toString(),
    startDate: new Date(normalized.startDate).toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    const norm = BillingCalculator.migrateLegacySubscription(subscription);
    setFormData({
      name: norm.name,
      amount: norm.amount.toString(),
      category: norm.category,
      cycleType: norm.cycleType,
      cycleValue: norm.cycleValue.toString(),
      startDate: new Date(norm.startDate).toISOString().split('T')[0]
    });
  }, [subscription]);

  if (!isOpen && !successToast) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    
    // Strict validation for Interval Value to prevent zero/negative/empty states
    if (e.target.name === 'cycleValue') {
      const numValue = parseInt(value);
      if (value === '' || isNaN(numValue) || numValue < 1) {
        value = '1';
      }
    }
    
    setFormData(prev => ({ ...prev, [e.target.name]: value as any }));
  };

  const handleUpdate = async () => {
    setErrors({});
    
    const cycleVal = parseInt(formData.cycleValue) || 1;
    
    const scheduleChanged = 
      formData.startDate !== new Date(normalized.startDate).toISOString().split('T')[0] ||
      formData.cycleType !== normalized.cycleType ||
      cycleVal !== normalized.cycleValue;

    let nextDate = subscription.nextBillingDate;
    if (scheduleChanged) {
      nextDate = BillingCalculator.calculateNextBillingDate(
        new Date(formData.startDate), 
        formData.cycleType, 
        cycleVal
      );
    }

    const payload = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      cycleType: formData.cycleType,
      cycleValue: cycleVal,
      startDate: new Date(formData.startDate).toISOString(),
      nextBillingDate: nextDate,
    };

    try {
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
      {/* ... (keep overlay and toast) ... */}
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
                <option value="UTILITIES">UTILITIES</option>
                <option value="ENTERTAINMENT">ENTERTAINMENT</option>
                <option value="WORK">WORK</option>
                <option value="HEALTH">HEALTH</option>
                <option value="SHOPPING">SHOPPING</option>
                <option value="TRAVEL">TRAVEL</option>
                <option value="FINANCE">FINANCE</option>
                <option value="CUSTOM">CUSTOM</option>
              </select>
            </FormGroup>

            <FormGroup label="Start Date" error={errors.startDate}>
               <TextField name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
            </FormGroup>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormGroup label="Frequency" error={errors.cycleType}>
              <select 
                name="frequencySelection" 
                value={
                  formData.cycleType === 'CALENDAR_MONTH' && formData.cycleValue === '1' ? 'MONTHLY' :
                  formData.cycleType === 'CALENDAR_YEAR' ? 'YEARLY' :
                  formData.cycleType === 'DAYS' ? 'CUSTOM_DAYS' : 'CUSTOM_MONTHS'
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'MONTHLY') {
                    setFormData(prev => ({ ...prev, cycleType: 'CALENDAR_MONTH', cycleValue: '1' }));
                  } else if (val === 'YEARLY') {
                    setFormData(prev => ({ ...prev, cycleType: 'CALENDAR_YEAR', cycleValue: '1' }));
                  } else if (val === 'CUSTOM_DAYS') {
                    setFormData(prev => ({ ...prev, cycleType: 'DAYS', cycleValue: '28' }));
                  } else {
                    setFormData(prev => ({ ...prev, cycleType: 'CALENDAR_MONTH', cycleValue: '3' }));
                  }
                }}
                className="w-full bg-white/5 rounded-xl border border-white/10 focus:border-accent p-3 text-zinc-100 font-medium text-sm focus:outline-none transition-all appearance-none"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
                <option value="CUSTOM_MONTHS">Custom Months</option>
                <option value="CUSTOM_DAYS">Custom Days</option>
              </select>
            </FormGroup>

            {formData.cycleType === 'CALENDAR_MONTH' && formData.cycleValue !== '1' && (
              <FormGroup label="Every [X] Months" error={errors.cycleValue}>
                <TextField 
                  name="cycleValue" 
                  type="number" 
                  min="2"
                  step="1"
                  value={formData.cycleValue} 
                  onChange={handleChange} 
                  placeholder="3" 
                  title="Interval must be 2 or greater"
                />
              </FormGroup>
            )}

            {formData.cycleType === 'DAYS' && (
              <FormGroup label="Every [X] Days" error={errors.cycleValue}>
                <TextField 
                  name="cycleValue" 
                  type="number" 
                  min="1"
                  step="1"
                  value={formData.cycleValue} 
                  onChange={handleChange} 
                  placeholder="28" 
                  title="Interval must be 1 or greater"
                />
              </FormGroup>
            )}
          </div>

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
