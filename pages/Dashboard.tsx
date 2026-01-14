
import React from 'react';
import { 
  PlayCircle, 
  RotateCw, 
  Gift, 
  ChevronRight, 
  History, 
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { User, Transaction } from '../types';
import { POINT_TO_CURRENCY_RATE } from '../constants';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
  setView: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions, setView }) => {
  const recentTransactions = transactions.slice(0, 3);
  const currencyAmount = (user.points * POINT_TO_CURRENCY_RATE).toFixed(2);

  return (
    <div className="space-y-6 pb-4 animate-in fade-in duration-500">
      {/* Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 shadow-xl gold-glow">
        <div className="relative z-10">
          <p className="text-slate-900/70 font-semibold text-sm mb-1">Total Balance</p>
          <div className="flex items-baseline gap-2 mb-4">
            <h1 className="text-4xl font-extrabold text-slate-950">{user.points}</h1>
            <span className="text-slate-900 font-medium">Points</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/20 w-fit px-3 py-1 rounded-full border border-white/20">
            <Star size={14} className="text-slate-900" fill="currentColor" />
            <span className="text-xs font-bold text-slate-900">≈ ৳{currencyAmount} BDT</span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-950/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setView('TASKS')}
          className="bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all group"
        >
          <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <PlayCircle size={24} />
          </div>
          <h3 className="font-bold text-slate-100 mb-1">Video Ads</h3>
          <p className="text-xs text-slate-500">Earn 50 pts/ad</p>
        </button>

        <button 
          onClick={() => setView('TASKS')}
          className="bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all group"
        >
          <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <RotateCw size={24} />
          </div>
          <h3 className="font-bold text-slate-100 mb-1">Lucky Spin</h3>
          <p className="text-xs text-slate-500">Up to 200 pts</p>
        </button>
      </div>

      {/* Daily Task Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-amber-500" />
            <h3 className="font-bold">Daily Earning Tips</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Powered by AI</span>
        </div>
        <div className="p-4">
          <p className="text-sm text-slate-400 leading-relaxed italic">
            "Watch at least 5 ads daily to maintain your VIP multiplier. Referring just 3 friends this week can boost your withdrawal priority!"
          </p>
        </div>
      </div>

      {/* Recent History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <History size={18} className="text-slate-500" />
            Recent History
          </h3>
          <button 
            onClick={() => setView('WALLET')}
            className="text-amber-500 text-sm font-medium hover:underline flex items-center gap-1"
          >
            See All <ChevronRight size={14} />
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {tx.amount > 0 ? <Zap size={18} /> : <History size={18} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">{tx.description}</h4>
                    <p className="text-[10px] text-slate-500">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl py-8 flex flex-col items-center justify-center text-slate-600">
            <ShieldCheck size={40} className="mb-2 opacity-20" />
            <p className="text-sm">No transactions yet. Start earning!</p>
          </div>
        )}
      </div>

      {/* Referral Banner */}
      <button 
        onClick={() => setView('REFER')}
        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-800 transition-all text-left"
      >
        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
          <Gift size={24} className="text-slate-950" />
        </div>
        <div>
          <h4 className="font-bold text-slate-100">Invite Friends & Earn</h4>
          <p className="text-xs text-slate-500">Get 10% of their earnings for lifetime</p>
        </div>
        <ChevronRight size={20} className="ml-auto text-slate-600" />
      </button>
    </div>
  );
};

export default Dashboard;
