
export type UserRole = 'USER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BANNED';

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  referralCode: string;
  referralsCount: number;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  lastCheckIn?: string;
  streakCount: number;
  lastActiveDate?: string;
}

export type TransactionStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
export type TransactionType = 'EARN' | 'WITHDRAWAL' | 'REFERRAL';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  method?: string; // bKash, Nagad, PayPal
  accountNumber?: string;
  status: TransactionStatus;
  date: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  reward: number;
  type: 'AD' | 'PTC' | 'SPIN' | 'CHECKIN';
  cooldownMinutes: number;
  lastCompleted?: string;
}

export interface MediationNetwork {
  id: string;
  name: string;
  isEnabled: boolean;
  priority: number;
  fillRate: number; // 0-100 simulated
}

export interface AdUnitConfig {
  appId: string;
  rewardedId: string;
  interstitialId: string;
  bannerId: string;
}

export interface MediationSettings {
  waterfallEnabled: boolean;
  primaryNetworkId: string;
  adUnits: AdUnitConfig;
  networks: MediationNetwork[];
}

export interface AppStats {
  totalUsers: number;
  totalPaid: number;
  activeTasks: number;
  pendingWithdrawals: number;
}
