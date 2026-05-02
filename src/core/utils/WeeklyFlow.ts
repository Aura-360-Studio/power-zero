import { CurrencyCalculator } from './Currency';
import { BillingCalculator } from './BillingCalculator';
import type { Subscription } from '../domain/Subscription';

export interface DailyFlowItem {
  id: string;
  name: string;
  dailyCost: number;
}

export interface DailyFlowDay {
  date: string; // ISO format (YYYY-MM-DD)
  dayName: string; // e.g. Mon, Tue
  totalDaily: number;
  activeItems: DailyFlowItem[];
}

export const getWeeklyFlow = (subscriptions: Subscription[], archivedSubscriptions: Subscription[] = []): DailyFlowDay[] => {
  const allSubs = [...subscriptions, ...archivedSubscriptions];
  const days: DailyFlowDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  // Generate the last 7 days (including today)
  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);
    
    const dateStr = targetDate.toISOString().split('T')[0];
    const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
    
    let totalDailyAtomic = 0;
    const activeItems: DailyFlowItem[] = [];

    // Check which subs were active on this specific targetDate
    allSubs.forEach((sub) => {
      const subStartDate = new Date(sub.startDate);
      subStartDate.setHours(0, 0, 0, 0);
      
      let wasActive = subStartDate.getTime() <= targetDate.getTime();
      
      // If it was cancelled, check if cancellation happened before or on the target date
      if (wasActive && sub.cancelledAt) {
        const cancelDate = new Date(sub.cancelledAt);
        cancelDate.setHours(0, 0, 0, 0);
        if (cancelDate.getTime() <= targetDate.getTime()) {
          wasActive = false; // It was cancelled before this day ended
        }
      }

      if (wasActive) {
        const normalizedSub = BillingCalculator.migrateLegacySubscription(sub);
        const annualAmount = BillingCalculator.getYearlySpend(
          normalizedSub.amount, 
          normalizedSub.cycleType, 
          normalizedSub.cycleValue
        );
        
        const dailyAtomic = CurrencyCalculator.toAtomic(annualAmount) / 365;
        totalDailyAtomic += dailyAtomic;
        
        activeItems.push({
          id: sub.id || sub.name,
          name: sub.name,
          dailyCost: CurrencyCalculator.fromAtomic(dailyAtomic)
        });
      }
    });

    days.push({
      date: dateStr,
      dayName,
      totalDaily: CurrencyCalculator.fromAtomic(totalDailyAtomic),
      activeItems: activeItems.sort((a, b) => b.dailyCost - a.dailyCost) // Sort highest cost first
    });
  }

  return days;
};
