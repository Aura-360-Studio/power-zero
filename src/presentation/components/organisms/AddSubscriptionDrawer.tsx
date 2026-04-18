import React, { useState } from 'react';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { SubscriptionSchema } from '../../../core/domain/SubscriptionSchema';
import { FormGroup } from '../molecules/FormGroup';
import { TextField } from '../atoms/TextField';
import { X, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSubscriptionDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { addSubscription } = useSubscriptionStore();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'ENTERTAINMENT' as 'ENTERTAINMENT' | 'MUSIC' | 'TOOLS' | 'LEARNING' | 'WELLNESS' | 'UTILITY',
    cycle: 'MONTHLY' as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
    nextBillingDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen && !successToast) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value as any }));
  };

  const handleSave = async () => {
    setErrors({});
    
    // Explicit payload formation matching ISO schema requirements
    const payload = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      cycle: formData.cycle,
      nextBillingDate: new Date(formData.nextBillingDate).toISOString(),
      status: 'ACTIVE' as const
    };

    try {
      // Validate logically completely external to the store to maintain pristine state
      SubscriptionSchema.parse(payload);
      
      // Persist to indexedDB and reactively update Burn Rates
      await addSubscription(payload);
      
      // Trigger Success UI Protocol 
      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
        setFormData({
          name: '', amount: '', category: 'ENTERTAINMENT', cycle: 'MONTHLY', 
          nextBillingDate: new Date().toISOString().split('T')[0]
        });
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

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`fixed inset-0 max-w-md mx-auto bg-gray-900/30 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={onClose}
      />
      
      {/* Central Success Toast */}
      {successToast && (
         <div className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded shadow-2xl z-[60] flex items-center gap-2 font-mono text-sm max-w-md w-[80%] mx-auto justify-center animate-pulse">
           <CheckCircle2 size={16} className="text-emerald-400" />
           Sentinel Active
         </div>
      )}

      {/* The Bottom Drawer Interface */}
      <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white rounded-t-[2rem] shadow-2xl z-50 transition-transform duration-300 ease-in-out px-8 py-8 border-t border-gray-100 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold tracking-tighter text-gray-900">Add Sentinel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors"><X size={24} strokeWidth={1.5} /></button>
        </div>

        <div className="flex flex-col gap-6 mb-8 max-h-[50vh] overflow-y-auto">
          <FormGroup label="Sentinel Name" error={errors.name}>
            <TextField name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Netflix, OpenAI..." />
          </FormGroup>

          <FormGroup label="Financial Leak (Amount)" error={errors.amount}>
            <TextField name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} placeholder="0.00" />
          </FormGroup>

          <div className="flex gap-4">
            <FormGroup label="Category" error={errors.category}>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full appearance-none bg-transparent rounded-none border-b border-gray-300 focus:border-gray-900 py-2 text-gray-900 font-mono text-sm focus:outline-none transition-colors"
                style={{ WebkitAppearance: 'none' }}
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
                className="w-full appearance-none bg-transparent rounded-none border-b border-gray-300 focus:border-gray-900 py-2 text-gray-900 font-mono text-sm focus:outline-none transition-colors"
                style={{ WebkitAppearance: 'none' }}
              >
                <option value="MONTHLY">MONTHLY</option>
                <option value="YEARLY">YEARLY</option>
                <option value="WEEKLY">WEEKLY</option>
                <option value="DAILY">DAILY</option>
              </select>
            </FormGroup>
          </div>

          <FormGroup label="Next Billing Timestamp" error={errors.nextBillingDate}>
             <TextField name="nextBillingDate" type="date" value={formData.nextBillingDate} onChange={handleChange} />
          </FormGroup>

        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-gray-900 text-white font-bold tracking-widest uppercase text-xs py-4 rounded hover:bg-gray-800 transition-colors focus:ring-4 focus:ring-gray-200 focus:outline-none"
        >
          Save Sentinel
        </button>
      </div>
    </>
  );
};
