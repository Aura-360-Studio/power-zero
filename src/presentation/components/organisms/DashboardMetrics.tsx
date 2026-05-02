import React from 'react';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { CalendarDays } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { useRouterStore } from '../../store/useRouterStore';
import { formatCurrency } from '../../../core/utils/Currency';
import { getWeeklyFlow } from '../../../core/utils/WeeklyFlow';

export const DashboardMetrics: React.FC = () => {
  const { burnRate, subscriptions, archivedSubscriptions } = useSubscriptionStore();
  const { profile } = useProfileStore();
  const { navigate } = useRouterStore();
  const [viewMode, setViewMode] = React.useState<'monthly' | 'yearly'>('monthly');
  const [selectedDayIndex, setSelectedDayIndex] = React.useState(6);
  
  const weeklyFlow = React.useMemo(() => getWeeklyFlow(subscriptions, archivedSubscriptions), [subscriptions, archivedSubscriptions]);
  const maxDaily = Math.max(...weeklyFlow.map(d => d.totalDaily), 1); // Avoid div by zero
  const selectedDay = weeklyFlow[selectedDayIndex];
  
  const isMonthly = viewMode === 'monthly';
  
  // Dynamic Calculation based on View
  const budget = isMonthly ? (profile.monthlyBudget || 0) : (profile.monthlyBudget || 0) * 12;
  const currentBurn = isMonthly ? burnRate.monthly : burnRate.yearly;
  const rawPercentage = budget > 0 ? (currentBurn / budget) * 100 : 0;
  
  const circumference = 339.29; 
  
  // Segment Calculations
  const yellowPercentage = Math.min(rawPercentage, 80);
  const orangePercentage = Math.min(Math.max(0, rawPercentage - 80), 20);
  const overflowPercentage = Math.max(0, rawPercentage - 100);

  const yellowOffset = circumference - (yellowPercentage / 100) * circumference;
  const orangeOffset = circumference - (orangePercentage / 100) * circumference;
  const overflowOffset = circumference - (Math.min(overflowPercentage, 100) / 100) * circumference;

  const overflowAmount = currentBurn - budget;
  const isBreached = budget > 0 && overflowAmount > 0;
  const isWarning = budget > 0 && rawPercentage > 80;

  const getStatusBg = () => {
    if (isBreached) return 'bg-red-500';
    if (isWarning) return 'bg-orange-400';
    return 'bg-accent';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      
      {/* Large Circular Visual (Primary Card) */}
      <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Hud View Switcher */}
        <div className="absolute top-8 right-8 flex bg-black/40 p-1 rounded-full border border-white/5 z-30">
          {(['monthly', 'yearly'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-accent text-background shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Status Indicator */}
        <div className="absolute top-8 left-8 flex flex-col gap-1">
          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{isMonthly ? 'Monthly Burn' : 'Annual Projection'}</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-ping ${getStatusBg()}`} />
            <span className={`font-bold text-xs ${isBreached ? 'text-red-500' : isWarning ? 'text-orange-400' : 'text-zinc-100'}`}>
              {isBreached ? 'Perimeter Breached' : isWarning ? 'Critical Threshold' : 'Protocol Active'}
            </span>
          </div>
        </div>
        
        <div className="relative mt-12 mb-4">
          <div className="absolute inset-0 bg-accent/20 blur-[30px] rounded-full scale-90" />
          
          <svg className="w-44 h-44 relative z-10" viewBox="0 0 120 120">
            {/* Background Track */}
            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
            
            {/* 1. Yellow Segment (0-80%) */}
            <circle 
              cx="60" cy="60" r="54" fill="none" stroke="#CCFF00" strokeWidth="8" 
              strokeDasharray={circumference} strokeDashoffset={yellowOffset} strokeLinecap="round"
              className="transition-all duration-1000 ease-out transform -rotate-90 origin-center opacity-90" 
            />
            
            {/* 2. Orange Segment (80-100%) */}
            {rawPercentage > 80 && (
              <circle 
                cx="60" cy="60" r="54" fill="none" stroke="#FF8A00" strokeWidth="8" 
                strokeDasharray={circumference} strokeDashoffset={orangeOffset} strokeLinecap="round"
                className="transition-all duration-1000 ease-out transform rotate-[198deg] origin-center shadow-[0_0_10px_rgba(255,138,0,0.4)]" 
              />
            )}

            {/* 3. Red Overflow Ring (100%+) */}
            {isBreached && (
              <circle 
                cx="60" cy="60" r="54" fill="none" stroke="#FF003D" strokeWidth="8" 
                strokeDasharray={circumference} strokeDashoffset={overflowOffset} strokeLinecap="round"
                className="transition-all duration-1000 ease-out transform -rotate-90 origin-center shadow-[0_0_20px_rgba(255,0,61,0.6)]"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <span className="text-3xl font-black text-zinc-100 tracking-tighter">
              {formatCurrency(currentBurn, profile.currency)}
            </span>
          </div>
        </div>

        {budget > 0 && (
          <div className="mt-4 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5 flex-wrap justify-center px-4 text-[10px] tracking-widest font-black uppercase">
              {isBreached ? (
                <>
                  <span className="text-red-500">{formatCurrency(overflowAmount, profile.currency)}</span>
                  <span className="text-zinc-500">OVERFLOW FROM</span>
                  <span className="text-accent">{formatCurrency(budget, profile.currency)}</span>
                  <span className="text-zinc-500">{isMonthly ? 'BUDGET' : 'ANNUALLY'}</span>
                </>
              ) : (
                <>
                  <span className="text-zinc-100">{formatCurrency(currentBurn, profile.currency)}</span>
                  <span className="text-zinc-500">/</span>
                  <span className="text-accent">{formatCurrency(budget, profile.currency)}</span>
                </>
              )}
            </div>
            <div className="text-[10px] font-bold tracking-tight">
              <span className="text-zinc-500">(</span>
              <span className={isBreached ? 'text-red-400' : isWarning ? 'text-orange-300' : 'text-accent'}>
                {rawPercentage.toFixed(1)}%
              </span>
              <span className="text-zinc-500"> {isMonthly ? 'Budget Used' : 'Annual Impact'})</span>
            </div>

            <div className="mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              <span>
                {isMonthly ? 'Annual Forecast: ' : 'Monthly Mean: '}
                <span className="text-zinc-400">{formatCurrency(isMonthly ? burnRate.yearly : burnRate.monthly, profile.currency)}</span>
              </span>
            </div>
          </div>
        )}
        {budget <= 0 && (
          <button 
            onClick={() => navigate('settings')}
            className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center mt-4 max-w-[250px] leading-relaxed hover:text-accent transition-colors"
          >
            To track utilization and percentages, define a <span className="text-accent underline">Monthly Budget</span> in Settings.
          </button>
        )}
      </div>

      {/* Dynamic Daily Cost Flow - Timeline Chart */}
      <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {selectedDayIndex === 6 ? "Today's Cost Flow" : `${selectedDay.dayName}'s Cost Flow`}
              </span>
              <h3 className="text-zinc-100 text-xs font-bold mt-1 tracking-tight">Active Burn Map</h3>
            </div>
            <CalendarDays size={18} className="text-zinc-500" />
          </div>

          <div className="flex items-end gap-1.5 h-16 mb-4">
            {weeklyFlow.map((day, i) => {
              const isSelected = i === selectedDayIndex;
              const heightPct = (day.totalDaily / maxDaily) * 100;
              return (
                <button 
                  key={i} 
                  onClick={() => setSelectedDayIndex(i)}
                  className={`flex-1 rounded-full transition-all duration-300 relative group flex items-end justify-center ${isSelected ? 'bg-accent shadow-[0_0_15px_rgba(204,255,0,0.5)]' : 'bg-white/10 hover:bg-white/20'}`}
                  style={{ height: `${Math.max(heightPct, 5)}%` }} // Minimum 5% height so it's clickable even if 0
                >
                  {/* Tooltip on hover for non-selected days */}
                  {!isSelected && (
                    <div className="absolute -top-6 bg-zinc-800 text-[8px] font-bold px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.dayName}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Day Labels */}
          <div className="flex justify-between px-2 mb-6 border-b border-white/5 pb-6">
             {weeklyFlow.map((day, i) => (
                <span key={i} className={`text-[8px] font-black uppercase transition-colors ${i === selectedDayIndex ? 'text-accent' : 'text-zinc-600'}`}>
                  {day.dayName.charAt(0)}
                </span>
             ))}
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-2xl font-black text-zinc-100 tracking-tighter">{formatCurrency(selectedDay.totalDaily, profile.currency)}</span>
              <div className="text-accent text-[10px] font-bold mt-1 tracking-widest uppercase">/ Day</div>
            </div>
            <div className="text-right">
               <span className="text-zinc-500 text-[10px] font-bold tracking-tight">{selectedDay.activeItems.length} Active Modules</span>
            </div>
          </div>
          
          {/* List Breakdown */}
          {selectedDay.activeItems.length > 0 ? (
            <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
              {selectedDay.activeItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <span className="text-xs font-bold text-zinc-300">{item.name}</span>
                  <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">{formatCurrency(item.dailyCost, profile.currency)}</span>
                </div>
              ))}
            </div>
          ) : (
             <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center text-xs font-bold text-zinc-600">
               No active drains detected on this day.
             </div>
          )}
        </div>
      </div>

    </div>
  );
};
