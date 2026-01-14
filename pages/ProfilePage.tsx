
import React from 'react';
import { 
  User as UserIcon, 
  Settings, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  LayoutDashboard,
  Lock,
  MessageSquare
} from 'lucide-react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onAdminToggle: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, onAdminToggle }) => {
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-500">
      <div className="flex flex-col items-center py-6">
        <div className="relative mb-4">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl border-4 border-slate-900 transition-all ${isAdmin ? 'bg-gradient-to-tr from-blue-600 to-blue-400 shadow-blue-500/20' : 'bg-gradient-to-tr from-amber-500 to-amber-300 gold-glow'}`}>
            <UserIcon size={48} className={isAdmin ? 'text-white' : 'text-slate-900'} />
          </div>
          <div className={`absolute -bottom-2 -right-2 w-8 h-8 border-4 border-slate-950 rounded-full flex items-center justify-center ${isAdmin ? 'bg-blue-500' : 'bg-green-500'}`} title={isAdmin ? "Administrator" : "Verified Account"}>
            <ShieldCheck size={14} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
        <p className="text-slate-500 text-sm mb-4">{user.email}</p>
        <div className="bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status:</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isAdmin ? 'text-blue-500' : 'text-green-500'}`}>
            {isAdmin ? 'System Administrator' : 'Active VIP'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <ProfileButton icon={<Settings className="text-slate-400" />} label="Account Settings" />
        <ProfileButton icon={<Lock className="text-slate-400" />} label="Security & Privacy" />
        <ProfileButton icon={<MessageSquare className="text-slate-400" />} label="Support Center" />
        <ProfileButton icon={<HelpCircle className="text-slate-400" />} label="FAQs & Tutorials" />
        
        {/* Admin Link - ONLY visible for Admin role */}
        {isAdmin && (
          <button 
            onClick={onAdminToggle}
            className="w-full bg-slate-900/50 p-4 rounded-2xl border border-blue-500/30 flex items-center justify-between group hover:border-blue-500/50 transition-all mt-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <LayoutDashboard size={20} />
              </div>
              <span className="font-bold text-slate-200">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase">Restricted Area</span>
              <ChevronRight size={20} className="text-slate-600" />
            </div>
          </button>
        )}

        <button 
          onClick={onLogout}
          className="w-full bg-red-500/10 p-4 rounded-2xl border border-red-500/20 flex items-center gap-4 group hover:bg-red-500/20 transition-all mt-8"
        >
          <div className="w-10 h-10 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <LogOut size={20} />
          </div>
          <span className="font-bold text-red-500">Logout Account</span>
        </button>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] text-slate-700 uppercase font-black tracking-[0.2em]">EasyEarning v2.4.0-Stable</p>
        <p className="text-[10px] text-slate-800 mt-1">Made with ❤️ for {isAdmin ? 'System Owners' : 'Bangladeshi Earners'}</p>
      </div>
    </div>
  );
};

const ProfileButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="w-full bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-amber-500/30 transition-all">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="font-bold text-slate-300">{label}</span>
    </div>
    <ChevronRight size={20} className="text-slate-600 group-hover:text-amber-500 transition-colors" />
  </button>
);

export default ProfilePage;
