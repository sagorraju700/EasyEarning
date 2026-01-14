
import { Task } from './types';

export const POINT_TO_CURRENCY_RATE = 0.05; // 100 points = $5 or equivalent
export const MIN_WITHDRAWAL_POINTS = 4000; // Example: 4000 points = $200 / 200 Taka

export const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Watch Video Ad', reward: 50, type: 'AD', cooldownMinutes: 5 },
  { id: '2', title: 'PTC: Visit Website', reward: 30, type: 'PTC', cooldownMinutes: 10 },
  { id: '3', title: 'Daily Check-in', reward: 100, type: 'CHECKIN', cooldownMinutes: 1440 },
  { id: '4', title: 'Lucky Spin', reward: 0, type: 'SPIN', cooldownMinutes: 15 },
];

export const WITHDRAWAL_METHODS = [
  { id: 'bkash', name: 'bKash', icon: '📱' },
  { id: 'nagad', name: 'Nagad', icon: '💸' },
  { id: 'paypal', name: 'PayPal', icon: '🌐' },
];
