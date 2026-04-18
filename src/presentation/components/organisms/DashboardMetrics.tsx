import React from 'react';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { TrendingUp, Zap } from 'lucide-react';

export const DashboardMetrics: React.FC = () => {
  const { burnRate } = useSubscriptionStore();
  
  // Monthly Logic (Circular)
  const monthlyThreshold = 10000;
  const monthlyPercentage = Math.min((burnRate.monthly / monthlyThreshold) * 100, 100);
  const circumference = 339.29; 
  const offset = circumference - (monthlyPercentage / 100) * circumference;

  // Yearly Logic (Linear/Report Style)
  const yearlyThreshold = 120000;
  const yearlyPercentage = Math.min((burnRate.yearly / yearlyThreshold) * 100, 100);

  // Daily Logic (Bar Chart Style)
  // Mocking a trend based on current daily burn
  const bars = [0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 1.0]; // scale factors

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      
      {/* Monthly Leak - Circular Visual (Large Card) */}
      <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Adjusted Status Indicator to avoid overlap */}
        <div className="absolute top-8 left-8 flex flex-col gap-1">
          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Monthly Burn</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span className="text-zinc-100 font-bold text-xs">Protocol Active</span>
          </div>
        </div>
        
        <div className="relative mt-12 mb-4">
          {/* Enhanced Circular Glow - Fixing the "Square" issue */}
          <div className="absolute inset-0 bg-accent/20 blur-[30px] rounded-full scale-90" />
          
          <svg className="w-44 h-44 transform -rotate-90 relative z-10" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
            <circle 
              cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" 
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
              className="text-accent transition-all duration-1000 ease-out" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <span className="text-3xl font-black text-zinc-100 tracking-tighter">
              ₹{burnRate.monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-accent text-[10px] font-bold mt-1">
              {monthlyPercentage.toFixed(1)}% Capacity
            </span>
          </div>
        </div>
      </div>

      {/* Daily Leak - Bar Chart Style */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Daily Leak</span>
              <h3 className="text-zinc-100 text-xs font-bold mt-1 tracking-tight">Volatility: Low</h3>
            </div>
            <TrendingUp size={18} className="text-accent" />
          </div>

          <div className="flex items-end gap-1.5 h-16 mb-6">
            {bars.map((scale, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-full transition-all duration-1000 ${i === bars.length - 1 ? 'bg-accent shadow-[0_0_10px_rgba(204,255,0,0.4)]' : 'bg-white/10'}`}
                style={{ height: `${scale * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="text-2xl font-black text-zinc-100 tracking-tighter">₹{burnRate.daily.toFixed(2)}</span>
          <div className="text-accent text-[10px] font-bold mt-1">+2.4% vs Yesterday</div>
        </div>
      </div>

      {/* Yearly Leak - Report Style (Linear Progress) */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Annual Leak</span>
              <h3 className="text-zinc-100 text-xs font-bold mt-1 tracking-tight">Projected Impact</h3>
            </div>
            <Zap size={18} className="text-accent" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-500">Resource Drain</span>
              <span className="text-[10px] font-bold text-accent">{yearlyPercentage.toFixed(0)}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-1000 ease-out" 
                style={{ width: `${yearlyPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <span className="text-2xl font-black text-zinc-100 tracking-tighter">₹{burnRate.yearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          <div className="text-zinc-500 text-[10px] font-bold mt-1 italic tracking-tight">System Forecast</div>
        </div>
      </div>

    </div>
  );
};
