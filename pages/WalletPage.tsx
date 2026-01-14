
import React, { useState } from 'react';
import { Wallet, History, Send, Smartphone, ShieldAlert, CreditCard, ChevronRight } from 'lucide-react';
import { User, Transaction } from '../types';
import { WITHDRAWAL_METHODS, MIN_WITHDRAWAL_POINTS, POINT_TO_CURRENCY_RATE } from '../constants';

interface WalletPageProps {
  user: User;
  transactions: Transaction[];
  onWithdraw: (amount: number, method: string, accountNumber: string) => void;
}

const WalletPage: React.FC<WalletPageProps> = ({ user, transactions, onWithdraw }) => {
  const [amount, setAmount] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState(WITHDRAWAL_METHODS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount);
    if (val < MIN_WITHDRAWAL_POINTS) {
      alert(`Minimum withdrawal is ${MIN_WITHDRAWAL_POINTS} points.`);
      return;
    }
    if (val > user.points) {
      alert('Insufficient points balance.');
      return;
    }
    onWithdraw(val, selectedMethod, account);
    setAmount('');
    setAccount('');
    alert('Withdrawal request submitted successfully! It will be reviewed within 24 hours.');
  };

  return (
    <div className="space-y-6 pb-6 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
            <Wallet size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg">My Wallet</h3>
            <p className="text-xs text-slate-500">Available points to withdraw</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-extrabold text-amber-500">{user.points}</h2>
          <span className="text-slate-400 font-medium text-sm">Points</span>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
          <span>Min. Withdrawal: {MIN_WITHDRAWAL_POINTS} Pts</span>
          <span>Status: Verified Account</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold mb-4">Request Withdrawal</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {WITHDRAWAL_METHODS.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMethod(m.id)}
                className={`shrink-0 px-4 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  selectedMethod === m.id 
                  ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                <span className="text-[10px] font-bold uppercase">{m.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Account Number</label>
            <div className="relative">
              <Smartphone size={18} className="absolute left-3 top-3.5 text-slate-500" />
              <input
                type="text"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                placeholder={selectedMethod === 'paypal' ? 'PayPal Email' : 'Phone Number'}
                value={account}
                onChange={e => setAccount(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Points Amount</label>
            <div className="relative">
              <CreditCard size={18} className="absolute left-3 top-3.5 text-slate-500" />
              <input
                type="number"
                required
                min={MIN_WITHDRAWAL_POINTS}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                placeholder={`Min ${MIN_WITHDRAWAL_POINTS}`}
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
              <div className="absolute right-3 top-3.5 text-[10px] font-bold text-amber-500/50">
                ≈ ৳{(parseInt(amount || '0') * POINT_TO_CURRENCY_RATE).toFixed(0)}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Send size={20} /> Withdraw Now
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold flex items-center gap-2 text-slate-300">
          <History size={18} className="text-slate-500" />
          Full Transaction History
        </h3>
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.status === 'PAID' ? 'bg-green-500/10 text-green-500' : 
                  tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 
                  'bg-red-500/10 text-red-500'
                }`}>
                  {tx.type === 'WITHDRAWAL' ? <CreditCard size={18} /> : <History size={18} />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{tx.description}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{new Date(tx.date).toLocaleDateString()}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase ${
                      tx.status === 'PAID' ? 'bg-green-500/20 text-green-500' : 
                      tx.status === 'PENDING' ? 'bg-amber-500/20 text-amber-500' : 
                      'bg-red-500/20 text-red-500'
                    }`}>{tx.status}</span>
                  </div>
                </div>
              </div>
              <div className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-500' : 'text-slate-100'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="py-10 text-center text-slate-600 text-sm italic">
              No transactions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
