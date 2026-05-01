export type CycleType = 'CALENDAR_MONTH' | 'CALENDAR_YEAR' | 'DAYS' | 'WEEKS';

export interface Subscription {
  id?: string;
  name: string;
  amount: number;
  category: 'ENTERTAINMENT' | 'MUSIC' | 'TOOLS' | 'LEARNING' | 'WELLNESS' | 'UTILITY';
  cycleType: CycleType;
  cycleValue: number;
  startDate: string;
  nextBillingDate: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PAUSED';
  isArchived: boolean;
  // Kept for backward compatibility during migration
  cycle?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}
