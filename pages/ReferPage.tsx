
import React from 'react';
import { Share2, Copy, Users, Trophy, Gift, Check } from 'lucide-react';
import { User } from '../types';

interface ReferPageProps {
  user: User;
  onRefer: (amount: number, description: string, type: 'REFERRAL') => void;
}

const ReferPage: React.FC<ReferPageProps> = ({ user, onRefer }) => {
  const [copied, setCopied] = React.useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateInvite = () => {
    onRefer(100, 'New Referral Signup (Bonus)', 'REFERRAL');
    alert('Simulated referral: A new friend joined using your code! +100 Points');
  };

  return (
    <div className="space-y-6 pb-6 animate-in zoom-in-95 duration-500">
      <div className="text-center py-6 px-4">
        <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl mx-auto flex items-center justify-center mb-6">
          <Share2 size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2">Refer & Earn Big!</h2>
        <p className="text-slate-400 text-sm max-w-[250px] mx-auto">
          Share your code with friends and get <span className="text-amber-500 font-bold">100 points</span> instantly + <span className="text-amber-500 font-bold">10% commission</span> for life.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Referral Code</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl py-3 font-mono text-2xl font-black text-amber-500 tracking-widest">
            {user.referralCode}
          </div>
          <button 
            onClick={copyCode}
            className="w-14 h-14 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-90"
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
          </button>
        </div>
        <p className="text-[10px] text-slate-600">Click to copy and share on WhatsApp or Facebook</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center gap-2">
          <Users size={24} className="text-blue-500" />
          <span className="text-2xl font-bold">{user.referralsCount}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Total Referrals</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center gap-2">
          <Trophy size={24} className="text-amber-500" />
          <span className="text-2xl font-bold">{user.referralsCount * 100}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Total Bonus</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Gift size={18} className="text-amber-500" />
          How it works
        </h3>
        <div className="space-y-4">
          <Step num={1} text="Share your referral code with your friends via social media." />
          <Step num={2} text="Your friend joins EasyEarning using your code." />
          <Step num={3} text="You get 100 points instantly as a welcome bonus." />
          <Step num={4} text="Get 10% of everything they earn for a lifetime!" />
        </div>
      </div>

      <button 
        onClick={simulateInvite}
        className="w-full bg-slate-800 border border-slate-700 py-4 rounded-2xl font-bold text-slate-400 hover:text-amber-500 hover:border-amber-500/50 transition-all text-sm italic"
      >
        (Demo: Simulate an Invite)
      </button>
    </div>
  );
};

const Step = ({ num, text }: { num: number, text: string }) => (
  <div className="flex gap-4">
    <div className="w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-amber-500">
      {num}
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
  </div>
);

export default ReferPage;
