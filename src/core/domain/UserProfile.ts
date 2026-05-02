export interface UserProfile {
  id?: number;
  name: string;
  currency: string;
  theme: 'dark' | 'light' | 'system';
  avatarColor: string;
  totalNeutralized: number;
  monthlyBudget: number;
  notificationsEnabled: boolean;
}

export const defaultProfile: UserProfile = {
  id: 1,
  name: 'User Sentinel',
  currency: 'INR',
  theme: 'system',
  avatarColor: '#CCFF00',
  totalNeutralized: 0,
  monthlyBudget: 0,
  notificationsEnabled: false
};
