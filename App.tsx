
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Trophy, 
  Users, 
  User as UserIcon, 
  Settings, 
  ShieldCheck,
  TrendingUp,
  History,
  LogOut,
  Ban
} from 'lucide-react';
import { User, Transaction, Task, AppStats, MediationSettings } from './types';
import { INITIAL_TASKS } from './constants';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import WalletPage from './pages/WalletPage';
import ReferPage from './pages/ReferPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

// Initial Mock Data for simulation
const MOCK_DB_USERS: User[] = [
  { id: 'admin_master', name: 'Sagor Raju', email: 'sagorrajuyt@gmail.com', points: 1000000, referralCode: 'SAGOR_ADMIN', referralsCount: 999, role: 'ADMIN', status: 'ACTIVE', joinedAt: '2023-01-01', streakCount: 365 },
  { id: 'u2', name: 'Rakib Ahmed', email: 'rakib@example.com', points: 4500, referralCode: 'RAKIB123', referralsCount: 12, role: 'USER', status: 'ACTIVE', joinedAt: '2023-05-12', streakCount: 5 },
  { id: 'u3', name: 'Nabila Islam', email: 'nabila@work.io', points: 12000, referralCode: 'NABILA_PRO', referralsCount: 45, role: 'USER', status: 'ACTIVE', joinedAt: '2023-06-20', streakCount: 14 },
  { id: 'u4', name: 'Faisal Karim', email: 'faisal@gmail.com', points: 850, referralCode: 'FAISAL_EE', referralsCount: 2, role: 'USER', status: 'BANNED', joinedAt: '2023-11-02', streakCount: 0 },
];

const DEFAULT_MEDIATION: MediationSettings = {
  waterfallEnabled: true,
  primaryNetworkId: 'admob',
  adUnits: {
    appId: 'ca-app-pub-3940256099942544~3347511713',
    rewardedId: 'ca-app-pub-3940256099942544/5224354917',
    interstitialId: 'ca-app-pub-3940256099942544/1033173712',
    bannerId: 'ca-app-pub-3940256099942544/6300978111'
  },
  networks: [
    { id: 'admob', name: 'Google AdMob', isEnabled: true, priority: 1, fillRate: 90 },
    { id: 'unity', name: 'Unity Ads', isEnabled: true, priority: 2, fillRate: 70 },
    { id: 'applovin', name: 'AppLovin', isEnabled: true, priority: 3, fillRate: 60 },
    { id: 'ironsource', name: 'ironSource', isEnabled: true, priority: 4, fillRate: 50 },
  ]
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_DB_USERS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [mediation, setMediation] = useState<MediationSettings>(DEFAULT_MEDIATION);
  const [view, setView] = useState<'DASHBOARD' | 'TASKS' | 'WALLET' | 'REFER' | 'PROFILE' | 'ADMIN'>('DASHBOARD');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('easyEarning_user');
    const savedTx = localStorage.getItem('easyEarning_transactions');
    const savedUsers = localStorage.getItem('easyEarning_all_users');
    const savedTasks = localStorage.getItem('easyEarning_tasks');
    const savedMediation = localStorage.getItem('easyEarning_mediation');
    
    if (savedUsers) setAllUsers(JSON.parse(savedUsers));
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedTx) setTransactions(JSON.parse(savedTx));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedMediation) setMediation(JSON.parse(savedMediation));
    
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Sync state with storage
  useEffect(() => { localStorage.setItem('easyEarning_all_users', JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem('easyEarning_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('easyEarning_mediation', JSON.stringify(mediation)); }, [mediation]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('easyEarning_user', JSON.stringify(currentUser));
      const dbUser = allUsers.find(u => u.id === currentUser.id);
      if (dbUser && dbUser.status === 'BANNED') {
        setCurrentUser(null);
        alert('Your account has been suspended for violating terms.');
      }
    } else {
      localStorage.removeItem('easyEarning_user');
    }
  }, [currentUser, allUsers]);

  useEffect(() => {
    localStorage.setItem('easyEarning_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addPoints = useCallback((amount: number, description: string, type: 'EARN' | 'REFERRAL') => {
    if (!currentUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    const lastActive = currentUser.lastActiveDate ? currentUser.lastActiveDate.split('T')[0] : null;
    
    let newStreak = currentUser.streakCount || 0;
    let streakBonus = 0;
    let updatedActiveDate = currentUser.lastActiveDate;

    if (type === 'EARN' && lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (lastActive === yesterdayStr) newStreak += 1;
      else newStreak = 1;
      updatedActiveDate = new Date().toISOString();
      if (newStreak === 3) streakBonus = 50;
      else if (newStreak === 7) streakBonus = 150;
    }

    const totalEarned = amount + streakBonus;
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      amount: totalEarned,
      type,
      status: 'PAID',
      date: new Date().toISOString(),
      description: streakBonus > 0 ? `${description} (+${streakBonus} streak bonus!)` : description
    };

    setTransactions(prev => [newTx, ...prev]);
    const updatedUser = { 
      ...currentUser, 
      points: currentUser.points + totalEarned,
      streakCount: newStreak,
      lastActiveDate: updatedActiveDate
    };
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }, [currentUser]);

  const requestWithdrawal = useCallback((amount: number, method: string, accountNumber: string) => {
    if (!currentUser || currentUser.points < amount) return;
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      amount: -amount,
      type: 'WITHDRAWAL',
      method,
      accountNumber,
      status: 'PENDING',
      date: new Date().toISOString(),
      description: `Withdrawal via ${method}`
    };
    setTransactions(prev => [newTx, ...prev]);
    const updatedUser = { ...currentUser, points: currentUser.points - amount };
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-amber-500 p-6 text-center">
        <div className="w-20 h-20 mb-6 bg-amber-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-pulse">
           <TrendingUp size={48} className="text-slate-950" />
        </div>
        <h1 className="text-3xl font-bold mb-2">EasyEarning</h1>
        <p className="text-slate-400">Loading secure environment...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage 
      allUsers={allUsers}
      onLogin={(user) => {
        if (!allUsers.find(u => u.id === user.id || u.email === user.email)) {
          setAllUsers(prev => [...prev, user]);
        }
        setCurrentUser(user);
        setView(user.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD');
      }} 
    />;
  }

  const renderView = () => {
    switch (view) {
      case 'DASHBOARD': return <Dashboard user={currentUser} transactions={transactions} setView={setView} />;
      case 'TASKS': return <TasksPage user={currentUser} tasks={tasks} onComplete={addPoints} mediation={mediation} />;
      case 'WALLET': return <WalletPage user={currentUser} transactions={transactions} onWithdraw={requestWithdrawal} />;
      case 'REFER': return <ReferPage user={currentUser} onRefer={addPoints} />;
      case 'PROFILE': return <ProfilePage user={currentUser} onLogout={() => setCurrentUser(null)} onAdminToggle={() => setView('ADMIN')} />;
      case 'ADMIN': return <AdminPage 
        user={currentUser} 
        allUsers={allUsers}
        setAllUsers={setAllUsers}
        transactions={transactions} 
        setTransactions={setTransactions} 
        tasks={tasks}
        setTasks={setTasks}
        mediation={mediation}
        setMediation={setMediation}
        onBack={() => setView('DASHBOARD')} 
      />;
      default: return <Dashboard user={currentUser} transactions={transactions} setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-950 selection:bg-amber-500/30">
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-slate-900" />
            </div>
            <span className="font-bold text-lg text-slate-100">EasyEarning</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
            <Trophy size={14} className="text-amber-500" />
            <span className="text-sm font-semibold text-amber-500">{currentUser.points} <span className="text-[10px] text-slate-400">Pts</span></span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-20">
        {renderView()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 pb-safe">
        <div className="max-w-md mx-auto px-4 py-2 flex justify-between items-center">
          <NavButton active={view === 'DASHBOARD'} onClick={() => setView('DASHBOARD')} icon={<LayoutDashboard size={20} />} label="Home" />
          <NavButton active={view === 'TASKS'} onClick={() => setView('TASKS')} icon={<Trophy size={20} />} label="Earn" />
          <NavButton active={view === 'WALLET'} onClick={() => setView('WALLET')} icon={<Wallet size={20} />} label="Wallet" />
          <NavButton active={view === 'REFER'} onClick={() => setView('REFER')} icon={<Users size={20} />} label="Refer" />
          <NavButton active={view === 'PROFILE'} onClick={() => setView('PROFILE')} icon={<UserIcon size={20} />} label="Me" />
        </div>
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 px-3 py-1 rounded-xl ${
      active ? 'text-amber-500 scale-110' : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
