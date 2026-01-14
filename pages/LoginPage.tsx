
import React, { useState } from 'react';
import { Mail, Phone, Lock, ArrowRight, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  allUsers: User[];
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, allUsers }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    password: '',
    referral: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is banned in the simulated DB
    const existingUser = allUsers.find(u => u.email === formData.emailOrPhone);
    if (existingUser && existingUser.status === 'BANNED') {
      alert('Access Denied: This account has been banned due to policy violations.');
      return;
    }

    // Admin Credentials Check
    if (isAdminMode) {
      if (formData.emailOrPhone === 'sagorrajuyt@gmail.com' && formData.password === '#Sagor#49') {
        const adminUser: User = allUsers.find(u => u.id === 'admin_master') || {
          id: 'admin_master',
          name: 'Sagor Raju',
          email: formData.emailOrPhone,
          points: 1000000,
          referralCode: 'SAGOR_ADMIN',
          referralsCount: 999,
          role: 'ADMIN',
          status: 'ACTIVE',
          joinedAt: new Date().toISOString(),
          streakCount: 365
        };
        onLogin(adminUser);
        return;
      } else {
        alert('Access Denied: Invalid Master Admin Credentials.');
        return;
      }
    }

    // Standard User Simulation
    const user: User = existingUser || {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'EasyEarner',
      email: formData.emailOrPhone,
      points: 100,
      referralCode: 'EE' + Math.floor(Math.random() * 10000),
      referralsCount: 0,
      role: 'USER',
      status: 'ACTIVE',
      joinedAt: new Date().toISOString(),
      streakCount: 0
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-6 transition-all duration-700 ${isAdminMode ? 'bg-blue-600 shadow-blue-500/40 rotate-12 scale-110' : 'bg-amber-500 gold-glow'}`}>
            {isAdminMode ? <ShieldCheck size={40} className="text-white" /> : <TrendingUp size={40} className="text-slate-950" />}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            {isAdminMode ? 'Master Access' : (isRegister ? 'Join EasyEarning' : 'Member Login')}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isAdminMode 
              ? 'Enter master credentials to manage system' 
              : (isRegister ? 'Create your profile and start earning' : 'Access your rewards dashboard')}
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {!isAdminMode && isRegister && (
            <div className="relative group">
              <UserIconIcon size={18} className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="text"
                required
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3.5 pl-10 pr-4 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 focus:outline-none transition-all"
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="relative group">
            <Mail size={18} className={`absolute left-3 top-3.5 text-slate-500 transition-colors ${isAdminMode ? 'group-focus-within:text-blue-400' : 'group-focus-within:text-amber-500'}`} />
            <input
              type="text"
              required
              className={`w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3.5 pl-10 pr-4 focus:outline-none transition-all ${isAdminMode ? 'focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50' : 'focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50'}`}
              placeholder={isAdminMode ? "Admin Email" : "Email or Phone Number"}
              value={formData.emailOrPhone}
              onChange={e => setFormData({ ...formData, emailOrPhone: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Lock size={18} className={`absolute left-3 top-3.5 text-slate-500 transition-colors ${isAdminMode ? 'group-focus-within:text-blue-400' : 'group-focus-within:text-amber-500'}`} />
            <input
              type="password"
              required
              className={`w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3.5 pl-10 pr-4 focus:outline-none transition-all ${isAdminMode ? 'focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50' : 'focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50'}`}
              placeholder="Password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {!isAdminMode && isRegister && (
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-amber-500/50 focus:outline-none transition-all"
              placeholder="Referral Code (Optional)"
              value={formData.referral}
              onChange={e => setFormData({ ...formData, referral: e.target.value })}
            />
          )}

          <button
            type="submit"
            className={`w-full font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 group transition-all transform active:scale-95 shadow-lg ${isAdminMode ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'}`}
          >
            {isAdminMode ? 'Authenticate Master' : (isRegister ? 'Start Earning' : 'Dashboard Access')}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="flex flex-col items-center gap-4">
          {!isAdminMode && (
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-amber-500 hover:text-amber-400 font-medium transition-colors underline decoration-amber-500/30 underline-offset-4"
            >
              {isRegister ? 'Already an active earner? Sign In' : "New here? Create your wallet"}
            </button>
          )}
          
          <button
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              setIsRegister(false);
            }}
            className={`text-xs font-black uppercase tracking-[0.2em] transition-all py-2 px-4 rounded-full border border-slate-800 hover:border-slate-700 ${isAdminMode ? 'text-amber-500' : 'text-slate-600 hover:text-slate-400'}`}
          >
            {isAdminMode ? 'Switch to Member Login' : 'System Admin Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserIconIcon = ({ size, className }: { size: number, className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default LoginPage;
