export interface Subscription {
  id?: string;
  name: string;
  amount: number;
  category: 'ENTERTAINMENT' | 'MUSIC' | 'TOOLS' | 'LEARNING' | 'WELLNESS' | 'UTILITY';
  cycle: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  nextBillingDate: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PAUSED';
}
