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
    
    acc[sub.category] = (acc[sub.category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryData)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: burnRate.monthly > 0 ? (amount / burnRate.monthly) * 100 : 0
    }));

  if (activeSubs.length === 0) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-8">
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
        {categories.map((item) => (
          <div 
            key={item.category} 
            onClick={() => setSelectedCategory(selectedCategory === item.category ? null : item.category)}
            className={`group cursor-pointer transition-all ${selectedCategory && selectedCategory !== item.category ? 'opacity-20 grayscale' : 'opacity-100'}`}
          >
            <div className="flex justify-between items-end mb-3">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${selectedCategory === item.category ? 'text-accent' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                {item.category}
              </span>
              <span className="text-sm font-bold text-accent tracking-tighter">
                {item.percentage.toFixed(0)}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-[2px] w-full bg-zinc-800 mb-4 overflow-hidden rounded-full">
              <div 
                className="h-full bg-accent shadow-[0_0_10px_rgba(204,255,0,0.3)] transition-all duration-1000 ease-out" 
                style={{ width: `${item.percentage}%` }}
              />
            </div>

            <div className="text-xl font-bold text-zinc-100 tracking-tighter">
              ₹{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
