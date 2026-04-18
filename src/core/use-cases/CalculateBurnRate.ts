import { CurrencyCalculator } from '../utils/Currency';
import type { Subscription } from '../domain/Subscription';

export interface BurnRateMetrics {
  daily: number;
  monthly: number;
  yearly: number;
}

export const CalculateBurnRate = (subscriptions: Subscription[]): BurnRateMetrics => {
  let totalAnnualAtomic = 0;

  subscriptions.forEach((sub) => {
    // We only calculate leaks for ACTIVE subscriptions
    if (sub.status !== 'ACTIVE') return;

    const atomicAmount = CurrencyCalculator.toAtomic(sub.amount);
    
    switch (sub.cycle) {
      case 'DAILY':   
        totalAnnualAtomic += (atomicAmount * 365); break;
      case 'WEEKLY':  
        totalAnnualAtomic += (atomicAmount * 52);  break;
      case 'MONTHLY': 
        totalAnnualAtomic += (atomicAmount * 12);  break;
      case 'YEARLY':  
        totalAnnualAtomic += atomicAmount;       break;
    }
  });

  return {
    daily: CurrencyCalculator.fromAtomic(totalAnnualAtomic / 365),
    monthly: CurrencyCalculator.fromAtomic(totalAnnualAtomic / 12),
    yearly: CurrencyCalculator.fromAtomic(totalAnnualAtomic),
  };
};
