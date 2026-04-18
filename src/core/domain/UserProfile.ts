export interface UserProfile {
  id?: number;
  name: string;
  currency: string;
  theme: 'dark' | 'light';
  avatarColor: string;
  totalNeutralized: number;
}

export const defaultProfile: UserProfile = {
  id: 1,
  name: 'User Sentinel',
  currency: 'INR',
  theme: 'dark',
  avatarColor: '#CCFF00',
  totalNeutralized: 0
};
