import type { Subscription, CycleType } from '../domain/Subscription';

/**
 * Power Zero Calculation Engine
 * Handles ISO-compliant date math for flexible billing cycles.
 */
export const BillingCalculator = {
  calculateNextBillingDate: (startDate: string | Date, cycleType: CycleType, cycleValue: number): string => {
    const start = new Date(startDate);
    const next = new Date(start);

    switch (cycleType) {
      case 'CALENDAR_MONTH':
        next.setMonth(start.getMonth() + cycleValue);
        // Ensure day consistency (e.g., Mar 31 -> Apr 30, not May 1)
        if (next.getDate() !== start.getDate()) {
          next.setDate(0);
        }
        break;
      case 'CALENDAR_YEAR':
        next.setFullYear(start.getFullYear() + cycleValue);
        // Handle Feb 29 on non-leap years
        if (next.getDate() !== start.getDate()) {
          next.setDate(0);
        }
        break;
      case 'DAYS':
        next.setDate(start.getDate() + cycleValue);
        break;
      case 'WEEKS':
        next.setDate(start.getDate() + (cycleValue * 7));
        break;
    }

    return next.toISOString();
  },

  /**
   * Perpetual Renewal Logic:
   * Ensures the subscription is treated as a recurring loop. If a billing date 
   * is in the past, it advances step-by-step until it finds the next upcoming date.
   */
  getNextFutureBillingDate: (currentNextDate: string, cycleType: CycleType, cycleValue: number): string => {
    let nextDate = new Date(currentNextDate);
    const now = new Date();

    // If the date is already in the future, return as is
    if (nextDate >= now) return nextDate.toISOString();

    // Increment until we find the next future occurrence
    // This ensures that even if the app wasn't opened for months, it catches up
    while (nextDate < now) {
      const nextStr = BillingCalculator.calculateNextBillingDate(nextDate, cycleType, cycleValue);
      nextDate = new Date(nextStr);
    }

    return nextDate.toISOString();
  },

  /**
   * Calculates the daily financial leak for a given subscription cycle.
   */
  getDailyLeak: (amount: number, cycleType: CycleType, cycleValue: number): number => {
    switch (cycleType) {
      case 'CALENDAR_MONTH':
        return (amount * 12) / (365 * cycleValue);
      case 'CALENDAR_YEAR':
        return amount / (365 * cycleValue);
      case 'DAYS':
        return amount / cycleValue;
      case 'WEEKS':
        return amount / (7 * cycleValue);
      default:
        return 0;
    }
  },

  /**
   * Normalizes any billing cycle to an annual spend value.
   */
  getYearlySpend: (amount: number, cycleType: CycleType, cycleValue: number): number => {
    switch (cycleType) {
      case 'CALENDAR_MONTH':
        return amount * (12 / cycleValue);
      case 'CALENDAR_YEAR':
        return amount / cycleValue;
      case 'DAYS':
        return (amount / cycleValue) * 365;
      case 'WEEKS':
        return (amount / (7 * cycleValue)) * 365;
      default:
        return 0;
    }
  },

  /**
   * Calculates the total amount spent on a subscription since its start date.
   */
  calculateLifetimeTotal: (amount: number, startDate: string, cycleType: CycleType, cycleValue: number): number => {
    const start = new Date(startDate);
    const now = new Date();
    if (start > now) return 0;

    let billingCount = 0;
    let checkDate = new Date(start);

    while (checkDate <= now) {
      billingCount++;
      const nextStr = BillingCalculator.calculateNextBillingDate(checkDate, cycleType, cycleValue);
      checkDate = new Date(nextStr);
    }

    return billingCount * amount;
  },

  /**
   * Compatibility layer to transition legacy fixed-cycles to the new flexible system.
   */
  migrateLegacySubscription: (sub: any): Subscription => {
    if (sub.cycleType && sub.cycleValue && sub.startDate) return sub as Subscription;

    let cycleType: CycleType = 'CALENDAR_MONTH';
    let cycleValue = 1;

    switch (sub.cycle) {
      case 'DAILY':
        cycleType = 'DAYS';
        cycleValue = 1;
        break;
      case 'WEEKLY':
        cycleType = 'WEEKS';
        cycleValue = 1;
        break;
      case 'MONTHLY':
        cycleType = 'CALENDAR_MONTH';
        cycleValue = 1;
        break;
      case 'YEARLY':
        cycleType = 'CALENDAR_YEAR';
        cycleValue = 1;
        break;
    }

    return {
      ...sub,
      cycleType,
      cycleValue,
      startDate: sub.nextBillingDate || new Date().toISOString(),
      nextBillingDate: sub.nextBillingDate || new Date().toISOString()
    };
  }
};
