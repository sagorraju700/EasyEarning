
import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  MousePointer2, 
  RotateCcw, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  X, 
  Flame,
  Award,
  Loader2,
  ExternalLink,
  Volume2,
  Zap,
  ShieldCheck,
  Globe,
  Star,
  Monitor
} from 'lucide-react';
import { Task, User, MediationSettings, MediationNetwork } from '../types';

interface TasksPageProps {
  user: User;
  tasks: Task[];
  onComplete: (amount: number, description: string, type: 'EARN') => void;
  mediation: MediationSettings;
}

const TasksPage: React.FC<TasksPageProps> = ({ user, tasks, onComplete, mediation }) => {
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<{ network: string; status: string; unitId?: string }>({ network: '', status: '' });
  const [activeAd, setActiveAd] = useState<{ isOpen: boolean; seconds: number; task: Task | null; network: MediationNetwork | null }>({
    isOpen: false,
    seconds: 0,
    task: null,
    network: null
  });
  const [showSpin, setShowSpin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);

  const streak = user.streakCount || 0;
  
  const getNextMilestone = () => {
    if (streak < 3) return { days: 3, reward: 50 };
    if (streak < 7) return { days: 7, reward: 150 };
    if (streak < 15) return { days: 15, reward: 400 };
    return { days: 30, reward: 1000 };
  };

  const nextMilestone = getNextMilestone();
  const progressPercent = (streak / nextMilestone.days) * 100;

  // Dynamic Mediation Simulation Logic based on Admin Panel Settings
  const startTask = async (task: Task) => {
    if (task.type === 'AD') {
      setIsAdLoading(true);
      
      setLoadingStep({ network: 'Mediation Layer', status: 'Fetching Admin Config...' });
      await new Promise(r => setTimeout(r, 600));

      const activeNetworks = mediation.networks
        .filter(n => n.isEnabled)
        .sort((a, b) => a.priority - b.priority);

      if (activeNetworks.length === 0) {
        alert('System Error: No active ad networks configured. Please contact support.');
        setIsAdLoading(false);
        return;
      }

      let filledNetwork: MediationNetwork | null = null;

      for (const network of activeNetworks) {
        setLoadingStep({ 
          network: network.name, 
          status: `Requesting Ad (P${network.priority})...`,
          unitId: network.id === 'admob' ? mediation.adUnits.rewardedId : undefined
        });
        await new Promise(r => setTimeout(r, 1000));

        // Simulated Fill Rate Check
        const random = Math.random() * 100;
        if (random <= network.fillRate) {
          filledNetwork = network;
          break;
        } else {
          setLoadingStep({ network: network.name, status: 'No Fill. Cascading...' });
          await new Promise(r => setTimeout(r, 400));
        }
      }

      if (!filledNetwork) {
        alert('Optimization Failed: All ad networks reported low inventory. Please try again in 5 minutes.');
        setIsAdLoading(false);
        return;
      }

      setLoadingStep({ 
        network: filledNetwork.name, 
        status: 'Buffering Media Assets...',
        unitId: filledNetwork.id === 'admob' ? mediation.adUnits.rewardedId : undefined
      });
      await new Promise(r => setTimeout(r, 800));
      
      setIsAdLoading(false);
      setActiveAd({ isOpen: true, seconds: 15, task, network: filledNetwork });
    } else if (task.type === 'PTC') {
      setActiveAd({ isOpen: true, seconds: 10, task, network: null });
    } else if (task.type === 'SPIN') {
      setShowSpin(true);
    } else if (task.type === 'CHECKIN') {
      onComplete(task.reward, task.title, 'EARN');
      alert(`Success! You claimed ${task.reward} points daily bonus.`);
    }
  };

  useEffect(() => {
    let timer: number;
    if (activeAd.isOpen && activeAd.seconds > 0) {
      timer = window.setInterval(() => {
        setActiveAd(prev => ({ ...prev, seconds: prev.seconds - 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeAd.isOpen, activeAd.seconds]);

  const claimReward = () => {
    if (activeAd.task) {
      onComplete(activeAd.task.reward, activeAd.task.title, 'EARN');
      setActiveAd({ isOpen: false, seconds: 0, task: null, network: null });
    }
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const newDeg = spinDeg + 1800 + Math.floor(Math.random() * 360);
    setSpinDeg(newDeg);
    
    setTimeout(() => {
      setIsSpinning(false);
      const rewards = [20, 50, 100, 200, 10, 5];
      const reward = rewards[Math.floor(Math.random() * rewards.length)];
      onComplete(reward, 'Lucky Spin Reward', 'EARN');
      setShowSpin(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">Earn Points</h2>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
           <ShieldCheck size={14} className="text-amber-500" />
           <span>High Fill Rate Enabled via Active Mediation</span>
        </div>
      </div>

      {/* Daily Streak Counter Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-4 overflow-hidden relative shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              streak > 0 ? 'bg-amber-500 text-slate-950 shadow-amber-500/20' : 'bg-slate-800 text-slate-500'
            }`}>
              <Flame size={24} className={streak > 0 ? 'animate-pulse' : ''} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{streak} Day Streak</h3>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                {streak > 0 ? 'Multipliers Active' : 'Start your streak'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-amber-500 font-bold flex items-center justify-end gap-1">
              <Award size={14} />
              <span>{nextMilestone.reward} Pts Bonus</span>
            </div>
            <p className="text-[10px] text-slate-400">Target: {nextMilestone.days} days</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></div>
          </div>
        </div>
        <Flame className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12 pointer-events-none" />
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-amber-500/30 transition-all shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  task.type === 'AD' ? 'bg-blue-500/10 text-blue-500' :
                  task.type === 'PTC' ? 'bg-emerald-500/10 text-emerald-500' :
                  task.type === 'SPIN' ? 'bg-purple-500/10 text-purple-500' :
                  'bg-amber-500/10 text-amber-500'
                }`}>
                  {task.type === 'AD' && <PlayCircle size={24} />}
                  {task.type === 'PTC' && <MousePointer2 size={24} />}
                  {task.type === 'SPIN' && <RotateCcw size={24} />}
                  {task.type === 'CHECKIN' && <CalendarCheck size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{task.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    <span className="text-amber-500">+{task.reward} Points</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Mediation Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => startTask(task)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-95 shadow-md"
              >
                {task.type === 'AD' ? 'Watch' : 'Start'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdLoading && (
        <div className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-200">
           <div className="relative mb-8">
              <Loader2 size={64} className="text-amber-500 animate-spin" />
              <div className="absolute inset-0 bg-amber-500 blur-[60px] opacity-30"></div>
           </div>
           
           <div className="space-y-4 max-w-xs w-full">
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Mediation Layer</h3>
                <div className="h-1 w-20 bg-amber-500 rounded-full"></div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>Provider</span>
                    <span>Status</span>
                 </div>
                 <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center justify-between w-full">
                      <span className={`font-bold transition-all duration-300 text-amber-500`}>
                        {loadingStep.network}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-medium italic">{loadingStep.status}</span>
                        <Zap size={10} className="text-amber-500 animate-pulse" />
                      </div>
                    </div>
                    {loadingStep.unitId && (
                      <div className="flex items-center gap-1.5 mt-1 opacity-50">
                        <Monitor size={10} className="text-slate-500" />
                        <span className="text-[8px] font-mono text-slate-500 truncate max-w-[200px]">{loadingStep.unitId}</span>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeAd.isOpen && (
        <div className="fixed inset-0 z-[80] bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
            <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Reward Unlock in</span>
               <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  {activeAd.seconds}
               </div>
            </div>
            {activeAd.seconds === 0 && (
              <button onClick={claimReward} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors shadow-2xl backdrop-blur-md">
                <X size={28} className="text-white" />
              </button>
            )}
          </div>

          <div className="w-full h-full max-w-md flex flex-col bg-slate-900 relative">
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
               <div className="relative group">
                 <div className="w-36 h-36 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-[3rem] flex items-center justify-center shadow-2xl gold-glow animate-bounce cursor-pointer">
                    <PlayCircle size={80} className="text-slate-950" />
                 </div>
                 <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg">
                    <Zap size={18} className="text-white" />
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="space-y-1">
                   <h2 className="text-4xl font-black text-white tracking-tighter leading-none">ULTRA EARNER</h2>
                   <div className="flex items-center justify-center gap-1.5">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="text-amber-500" fill="currentColor" />)}
                      <span className="text-[10px] font-black text-slate-500 uppercase ml-2">Verified Ad</span>
                   </div>
                 </div>
                 <p className="text-slate-400 text-lg leading-snug px-4">Stop wasting time. Start earning real rewards today with our automated system!</p>
               </div>

               <div className="pt-4 w-full px-6">
                  <div className="w-full bg-white text-slate-950 font-black py-5 rounded-[2rem] shadow-2xl flex items-center justify-center gap-2 group cursor-pointer hover:scale-105 transition-all active:scale-95 text-lg">
                    INSTALL NOW <ExternalLink size={24} />
                  </div>
                  
                  {activeAd.network && (
                    <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
                       <Globe size={14} className="text-slate-500" />
                       <span className="text-[9px] text-slate-500 uppercase font-black tracking-[0.3em]">Network: {activeAd.network.name}</span>
                    </div>
                  )}
               </div>
            </div>

            {activeAd.seconds === 0 && (
              <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-8 animate-in zoom-in duration-500">
                <div className="w-28 h-28 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.6)] mb-8 animate-pulse">
                  <CheckCircle2 size={56} className="text-slate-950" />
                </div>
                <h2 className="text-4xl font-black text-white mb-2 text-center leading-tight">REWARD<br/>UNLOCKED</h2>
                <div className="bg-amber-500/10 border border-amber-500/30 px-6 py-2 rounded-2xl mb-12">
                   <p className="text-amber-500 font-black text-2xl">+{activeAd.task?.reward} Pts</p>
                </div>
                <button onClick={claimReward} className="w-full max-w-xs bg-amber-500 text-slate-950 font-black py-5 rounded-3xl shadow-2xl text-xl transition-all active:scale-95 gold-glow">
                  CLAIM & CLOSE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showSpin && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <button onClick={() => setShowSpin(false)} className="absolute top-6 right-6 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400"><X size={24} /></button>
          <div className="text-center mb-10"><h2 className="text-3xl font-black text-white mb-2">Lucky Wheel</h2><p className="text-slate-500 text-sm">Spin to win up to 200 points!</p></div>
          <div className="relative w-72 h-72 mb-12">
            <div className="w-full h-full rounded-full border-[6px] border-amber-500/50 relative overflow-hidden transition-transform duration-[3000ms] ease-out" style={{ transform: `rotate(${spinDeg}deg)` }}>
               {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                 <div key={i} className="absolute top-0 left-1/2 -ml-[50%] w-full h-1/2 origin-bottom" style={{ transform: `rotate(${deg}deg)`, backgroundColor: i % 2 === 0 ? '#1e293b' : '#0f172a', clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}>
                   <span className="absolute top-6 left-1/2 -translate-x-1/2 font-black text-amber-500 text-lg">{[20, 50, 100, 200, 10, 5][i]}</span>
                 </div>
               ))}
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 z-10"><div className="w-6 h-10 bg-amber-500" style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}></div></div>
          </div>
          <button disabled={isSpinning} onClick={handleSpin} className={`w-full max-w-xs py-5 rounded-2xl font-black text-xl shadow-xl transition-all ${isSpinning ? 'bg-slate-800 text-slate-600' : 'bg-amber-500 text-slate-950 hover:scale-105 active:scale-95'}`}>{isSpinning ? 'Spinning...' : 'SPIN NOW'}</button>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
