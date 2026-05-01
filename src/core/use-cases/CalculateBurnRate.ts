import { CurrencyCalculator } from '../utils/Currency';
import { BillingCalculator } from '../utils/BillingCalculator';
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

    // Migrate if needed (defensive)
    const normalizedSub = BillingCalculator.migrateLegacySubscription(sub);

    const annualAmount = BillingCalculator.getYearlySpend(
      normalizedSub.amount, 
      normalizedSub.cycleType, 
      normalizedSub.cycleValue
    );
    
    totalAnnualAtomic += CurrencyCalculator.toAtomic(annualAmount);
  });

  return {
    daily: CurrencyCalculator.fromAtomic(totalAnnualAtomic / 365),
    monthly: CurrencyCalculator.fromAtomic(totalAnnualAtomic / 12),
    yearly: CurrencyCalculator.fromAtomic(totalAnnualAtomic),
  };
};
