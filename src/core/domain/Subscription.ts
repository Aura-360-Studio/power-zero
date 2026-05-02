export type CycleType = 'CALENDAR_MONTH' | 'CALENDAR_YEAR' | 'DAYS' | 'WEEKS';

export interface Subscription {
  id?: string;
  name: string;
  amount: number;
  category: 'UTILITIES' | 'ENTERTAINMENT' | 'WORK' | 'HEALTH' | 'SHOPPING' | 'TRAVEL' | 'FINANCE' | 'CUSTOM';
  cycleType: CycleType;
  cycleValue: number;
  startDate: string;
  nextBillingDate: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PAUSED';
  isArchived: boolean;
  lastNotifiedAt?: string;
  cancelledAt?: string;
  // Kept for backward compatibility during migration
  cycle?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}
