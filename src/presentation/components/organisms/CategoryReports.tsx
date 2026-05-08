import React from 'react';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { useRouterStore } from '../../store/useRouterStore';

export const CategoryReports: React.FC = () => {
  const { subscriptions, burnRate } = useSubscriptionStore();
  const { selectedCategory, setSelectedCategory } = useRouterStore();

  // Logic: Group and calculate category-wise metrics
  const activeSubs = subscriptions.filter(s => s.status === 'ACTIVE');
  
  const categoryData = activeSubs.reduce((acc, sub) => {
    const amount = sub.cycle === 'YEARLY' ? sub.amount / 12 : 
                   sub.cycle === 'WEEKLY' ? sub.amount * 4 : 
                   sub.cycle === 'DAILY' ? sub.amount * 30 : 
                   sub.amount;
    
    if (!acc[sub.category]) {
      acc[sub.category] = { amount: 0, count: 0 };
    }
    acc[sub.category].amount += amount;
    acc[sub.category].count += 1;
    return acc;
  }, {} as Record<string, { amount: number, count: number }>);

  const categories = Object.entries(categoryData)
    .sort(([, a], [, b]) => b.amount - a.amount)
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count,
      percentage: burnRate.monthly > 0 ? (data.amount / burnRate.monthly) * 100 : 0
    }));

  if (activeSubs.length === 0) return null;

  return (
    <div className="bg-surface shadow-[var(--card-shadow)] border border-border rounded-[2rem] p-8 mb-8">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-zinc-100 uppercase leading-none mb-2">
            Asset <br /> Allocation
          </h2>
          <p className="text-zinc-500 text-sm font-medium tracking-tight">
            Diversification across <br /> primary networks
          </p>
        </div>
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`text-[10px] font-black tracking-widest uppercase px-4 py-3 rounded-full transition-all shadow-xl ${selectedCategory ? 'bg-accent text-background' : 'bg-zinc-800 text-zinc-500'}`}
        >
          {selectedCategory ? 'Clear Filter' : 'Adjust Weights'}
        </button>
      </div>

      <div className="space-y-10">
        {categories.map((item) => {
          const getHeatColor = (pct: number) => {
            if (pct > 60) return '#FF003D'; // Red
            if (pct > 30) return '#FF8A00'; // Orange
            return '#CCFF00'; // Yellow
          };
          
          const heatColor = getHeatColor(item.percentage);

          return (
            <div 
              key={item.category} 
              onClick={() => setSelectedCategory(selectedCategory === item.category ? null : item.category)}
              className={`group cursor-pointer transition-all ${selectedCategory && selectedCategory !== item.category ? 'opacity-20 grayscale' : 'opacity-100'}`}
            >
              <div className="flex justify-between items-end mb-3">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${selectedCategory === item.category ? 'text-accent' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                  {item.category}
                </span>
                <span className="text-sm font-bold tracking-tighter" style={{ color: heatColor }}>
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-[2px] w-full bg-zinc-800 mb-4 overflow-hidden rounded-full">
                <div 
                  className="h-full transition-all duration-1000 ease-out" 
                  style={{ 
                    width: `${item.percentage}%`, 
                    backgroundColor: heatColor,
                    boxShadow: `0 0 10px ${heatColor}44`
                  }}
                />
              </div>

              <div className="flex justify-between items-end">
                <div className="text-xl font-bold text-zinc-100 tracking-tighter leading-none">
                  ₹{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-baseline gap-1.5 leading-none">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                    {item.count === 1 ? 'sentinel' : 'sentinels'}
                  </span>
                  <span className="text-sm font-black transition-colors" style={{ color: heatColor }}>{item.count}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
