
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  Users, 
  ArrowLeft, 
  TrendingUp,
  Clock,
  ExternalLink,
  Search,
  Ban,
  ShieldAlert,
  ShieldCheck,
  MoreVertical,
  Mail,
  UserCheck,
  Award,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  PlayCircle,
  MousePointer2,
  RotateCcw,
  CalendarCheck,
  X,
  Save,
  Layout,
  Layers,
  Zap,
  Power,
  ChevronUp,
  ChevronDown,
  Percent,
  Monitor,
  Video,
  RectangleHorizontal,
  Info
} from 'lucide-react';
import { Transaction, User, Task, MediationSettings, MediationNetwork } from '../types';
import { POINT_TO_CURRENCY_RATE } from '../constants';

interface AdminPageProps {
  user: User;
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  mediation: MediationSettings;
  setMediation: React.Dispatch<React.SetStateAction<MediationSettings>>;
  onBack: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ 
  user, 
  allUsers, 
  setAllUsers, 
  transactions, 
  setTransactions, 
  tasks,
  setTasks,
  mediation,
  setMediation,
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'WITHDRAWALS' | 'USERS' | 'TASKS' | 'MEDIATION'>('WITHDRAWALS');
  const [searchTerm, setSearchTerm] = useState('');
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Task form state
  const [taskForm, setTaskForm] = useState<Partial<Task>>({
    title: '',
    reward: 0,
    type: 'AD',
    cooldownMinutes: 5
  });

  const pendingWithdrawals = transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === 'PENDING');
  const totalPaid = transactions
    .filter(t => t.type === 'WITHDRAWAL' && t.status === 'PAID')
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  
  const handleApprove = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'PAID' } : t));
  };

  const handleReject = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'REJECTED' } : t));
  };

  const toggleUserStatus = (id: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
      t.type.toLowerCase().includes(taskSearchTerm.toLowerCase())
    );
  }, [tasks, taskSearchTerm]);

  const stats = {
    total: allUsers.length,
    active: allUsers.filter(u => u.status === 'ACTIVE').length,
    banned: allUsers.filter(u => u.status === 'BANNED').length,
  };

  const taskStats = {
    total: tasks.length,
    ads: tasks.filter(t => t.type === 'AD').length,
    ptc: tasks.filter(t => t.type === 'PTC').length,
    spins: tasks.filter(t => t.type === 'SPIN').length,
  };

  // Task Management Functions
  const handleOpenTaskModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTaskForm(task);
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        reward: 0,
        type: 'AD',
        cooldownMinutes: 5
      });
    }
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskForm.title || taskForm.reward === undefined || !taskForm.type || taskForm.cooldownMinutes === undefined) {
      alert('Please fill all fields');
      return;
    }

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskForm as Task } : t));
    } else {
      const newTask: Task = {
        ...taskForm as Task,
        id: Math.random().toString(36).substr(2, 9)
      };
      setTasks(prev => [...prev, newTask]);
    }
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  // Mediation Management
  const toggleNetwork = (id: string) => {
    setMediation(prev => ({
      ...prev,
      networks: prev.networks.map(n => n.id === id ? { ...n, isEnabled: !n.isEnabled } : n)
    }));
  };

  const movePriority = (id: string, dir: 'up' | 'down') => {
    const networks = [...mediation.networks].sort((a, b) => a.priority - b.priority);
    const index = networks.findIndex(n => n.id === id);
    if (dir === 'up' && index > 0) {
      const temp = networks[index].priority;
      networks[index].priority = networks[index - 1].priority;
      networks[index - 1].priority = temp;
    } else if (dir === 'down' && index < networks.length - 1) {
      const temp = networks[index].priority;
      networks[index].priority = networks[index + 1].priority;
      networks[index + 1].priority = temp;
    }
    setMediation(prev => ({ ...prev, networks }));
  };

  const updateFillRate = (id: string, rate: number) => {
    setMediation(prev => ({
      ...prev,
      networks: prev.networks.map(n => n.id === id ? { ...n, fillRate: rate } : n)
    }));
  };

  const updateAdUnit = (field: keyof typeof mediation.adUnits, value: string) => {
    setMediation(prev => ({
      ...prev,
      adUnits: { ...prev.adUnits, [field]: value }
    }));
  };

  return (
    <div className="space-y-6 pb-6 animate-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Admin Panel</h2>
            <p className="text-slate-500 text-sm">System management & controls</p>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
        {[
          { id: 'WITHDRAWALS', label: 'Payouts' },
          { id: 'USERS', label: 'Users' },
          { id: 'TASKS', label: 'Tasks' },
          { id: 'MEDIATION', label: 'Mediation' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'WITHDRAWALS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Paid Out</span>
                <TrendingUp size={14} className="text-green-500" />
              </div>
              <div className="text-2xl font-bold text-white">৳{totalPaid}</div>
              <div className="text-[10px] text-slate-600 mt-1">Confirmed payments</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Pending</span>
                <Clock size={14} className="text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-white">{pendingWithdrawals.length}</div>
              <div className="text-[10px] text-slate-600 mt-1">Awaiting review</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 px-1">
              <Clock size={18} className="text-amber-500" />
              Pending Withdrawals
            </h3>
            <div className="space-y-3">
              {pendingWithdrawals.length > 0 ? (
                pendingWithdrawals.map(tx => (
                  <div key={tx.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">৳{Math.abs(tx.amount)}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">{tx.method}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">{tx.accountNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-600 uppercase">Req ID</p>
                        <p className="text-[10px] text-slate-500 font-mono">{tx.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApprove(tx.id)}
                        className="flex-1 bg-green-500/20 hover:bg-green-500 text-green-500 hover:text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button 
                        onClick={() => handleReject(tx.id)}
                        className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
                  <BarChart3 size={32} className="text-slate-800 mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-slate-600">No pending withdrawals in queue.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'USERS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-center shadow-lg">
              <div className="text-slate-500 text-[8px] uppercase font-bold mb-1">Total</div>
              <div className="text-white font-bold text-lg">{stats.total}</div>
            </div>
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-center shadow-lg">
              <div className="text-green-500 text-[8px] uppercase font-bold mb-1">Active</div>
              <div className="text-white font-bold text-lg">{stats.active}</div>
            </div>
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-center shadow-lg">
              <div className="text-red-500 text-[8px] uppercase font-bold mb-1">Banned</div>
              <div className="text-white font-bold text-lg">{stats.banned}</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 px-1">
            <h3 className="font-bold text-lg flex items-center gap-2 whitespace-nowrap">
              <Users size={18} className="text-blue-500" />
              User List
            </h3>
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search name/email..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredUsers.map(u => (
              <div key={u.id} className={`bg-slate-900 border p-4 rounded-2xl transition-all animate-in fade-in ${u.status === 'BANNED' ? 'border-red-500/40 opacity-70 bg-red-500/5' : 'border-slate-800 hover:border-slate-700 shadow-xl'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${u.role === 'ADMIN' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Users size={24} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-100 truncate max-w-[120px]">{u.name}</h4>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${u.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                          {u.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Mail size={10} className="text-slate-500 shrink-0" />
                        <span className="text-[10px] text-slate-500 truncate max-w-[150px]">{u.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-amber-500 font-bold text-sm">৳{(u.points * POINT_TO_CURRENCY_RATE).toFixed(0)}</div>
                    <div className="text-[10px] text-slate-600 font-mono">{u.points} Pts</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase font-bold text-slate-600">Joined</span>
                      <div className="flex items-center gap-1 text-[9px] text-slate-400">
                        <Calendar size={10} />
                        {u.joinedAt.split('T')[0]}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase font-bold text-slate-600">Referrals</span>
                      <div className="flex items-center gap-1 text-[9px] text-slate-400">
                        <Award size={10} />
                        {u.referralsCount}
                      </div>
                    </div>
                  </div>
                  
                  {u.role !== 'ADMIN' && (
                    <button 
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                        u.status === 'ACTIVE' 
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white shadow-lg' 
                        : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white shadow-lg'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? <Ban size={12} /> : <UserCheck size={12} />}
                      {u.status === 'ACTIVE' ? 'Ban User' : 'Unban User'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'TASKS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 text-center shadow-lg">
              <div className="text-slate-500 text-[7px] uppercase font-bold mb-1">Total</div>
              <div className="text-white font-bold text-sm">{taskStats.total}</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 text-center shadow-lg">
              <div className="text-blue-500 text-[7px] uppercase font-bold mb-1">Ads</div>
              <div className="text-white font-bold text-sm">{taskStats.ads}</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 text-center shadow-lg">
              <div className="text-emerald-500 text-[7px] uppercase font-bold mb-1">PTC</div>
              <div className="text-white font-bold text-sm">{taskStats.ptc}</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 text-center shadow-lg">
              <div className="text-purple-500 text-[7px] uppercase font-bold mb-1">Spins</div>
              <div className="text-white font-bold text-sm">{taskStats.spins}</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 px-1">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search tasks..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                value={taskSearchTerm}
                onChange={e => setTaskSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => handleOpenTaskModal()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/30 transition-all active:scale-95"
            >
              <Plus size={16} /> Add Task
            </button>
          </div>

          <div className="space-y-3">
            {filteredTasks.map(task => (
              <div key={task.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl animate-in fade-in group hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                      task.type === 'AD' ? 'bg-blue-500/10 text-blue-500' :
                      task.type === 'PTC' ? 'bg-emerald-500/10 text-emerald-500' :
                      task.type === 'SPIN' ? 'bg-purple-500/10 text-purple-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {task.type === 'AD' && <PlayCircle size={22} />}
                      {task.type === 'PTC' && <MousePointer2 size={22} />}
                      {task.type === 'SPIN' && <RotateCcw size={22} />}
                      {task.type === 'CHECKIN' && <CalendarCheck size={22} />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-100 truncate">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-black bg-slate-800 text-slate-400 px-2 py-0.5 rounded-sm uppercase tracking-tighter">{task.type}</span>
                        <span className="text-[10px] text-amber-500 font-black">+{task.reward} Pts</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleOpenTaskModal(task)}
                      className="p-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all hover:bg-slate-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                    <Clock size={12} className="text-slate-600" />
                    Cooldown: <span className="text-slate-400">{task.cooldownMinutes}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'MEDIATION' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* AdMob Configuration Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                  <Monitor size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">AdMob Ad Units</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Configure Primary ID Infrastructure</p>
                </div>
              </div>

              <div className="grid gap-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">AdMob App ID</label>
                    <Info size={12} className="text-slate-600" />
                  </div>
                  <input 
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-xs text-slate-300 font-mono focus:ring-1 focus:ring-blue-500/50 outline-none"
                    placeholder="ca-app-pub-xxxxxxxx~xxxxxxxx"
                    value={mediation.adUnits.appId}
                    onChange={(e) => updateAdUnit('appId', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      <Video size={12} className="text-amber-500" /> Rewarded ID
                    </div>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-[10px] text-slate-400 font-mono focus:ring-1 focus:ring-blue-500/50 outline-none"
                      placeholder="ca-app-pub-xxx/xxx"
                      value={mediation.adUnits.rewardedId}
                      onChange={(e) => updateAdUnit('rewardedId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      <PlayCircle size={12} className="text-blue-500" /> Interstitial ID
                    </div>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-[10px] text-slate-400 font-mono focus:ring-1 focus:ring-blue-500/50 outline-none"
                      placeholder="ca-app-pub-xxx/xxx"
                      value={mediation.adUnits.interstitialId}
                      onChange={(e) => updateAdUnit('interstitialId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      <RectangleHorizontal size={12} className="text-emerald-500" /> Banner ID
                    </div>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-[10px] text-slate-400 font-mono focus:ring-1 focus:ring-blue-500/50 outline-none"
                      placeholder="ca-app-pub-xxx/xxx"
                      value={mediation.adUnits.bannerId}
                      onChange={(e) => updateAdUnit('bannerId', e.target.value)}
                    />
                  </div>
                </div>
              </div>
          </div>

          {/* Mediation Waterfall Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Waterfall Mediation</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Dynamic Provider Prioritization</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMediation(prev => ({ ...prev, waterfallEnabled: !prev.waterfallEnabled }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${mediation.waterfallEnabled ? 'bg-amber-500' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${mediation.waterfallEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="space-y-3">
                {mediation.networks.sort((a,b) => a.priority - b.priority).map((network, idx) => (
                  <div key={network.id} className={`bg-slate-950 border p-4 rounded-2xl transition-all ${network.isEnabled ? 'border-slate-800 shadow-lg shadow-black/20' : 'border-slate-900 opacity-60'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1 mr-2">
                          <button onClick={() => movePriority(network.id, 'up')} className="text-slate-600 hover:text-amber-500 disabled:opacity-30" disabled={idx === 0}><ChevronUp size={14} /></button>
                          <button onClick={() => movePriority(network.id, 'down')} className="text-slate-600 hover:text-amber-500 disabled:opacity-30" disabled={idx === mediation.networks.length - 1}><ChevronDown size={14} /></button>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm">{network.name}</h4>
                          <span className="text-[8px] font-black uppercase text-slate-600 tracking-tighter">Priority Level: {network.priority}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleNetwork(network.id)}
                        className={`p-2 rounded-lg transition-all ${network.isEnabled ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-500'}`}
                      >
                        <Power size={16} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
                          <Percent size={10} /> Simulated Fill Rate
                        </div>
                        <span className="text-xs font-black text-amber-500">{network.fillRate}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={network.fillRate} 
                        onChange={(e) => updateFillRate(network.id, parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -ml-24 -mb-24" />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-4">
            <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-blue-400 text-sm">Mediation Safety</h4>
              <p className="text-xs text-blue-400/60 leading-relaxed">
                Settings are validated against official AdMob schemas. Waterfall logic prioritizes networks by rank to maximize CPM yield.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                  {editingTask ? <Edit2 size={20} /> : <Plus size={20} />}
                </div>
                <h3 className="text-xl font-black text-white">{editingTask ? 'Edit Task' : 'New Task'}</h3>
              </div>
              <button onClick={() => setIsTaskModalOpen(false)} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Task Title</label>
                <input 
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3.5 px-4 text-white focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
                  placeholder="e.g. Watch Video Ad #1"
                  value={taskForm.title}
                  onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Reward Pts</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3.5 px-4 text-white focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
                    value={taskForm.reward}
                    onChange={e => setTaskForm({...taskForm, reward: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Cooldown (m)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3.5 px-4 text-white focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
                    value={taskForm.cooldownMinutes}
                    onChange={e => setTaskForm({...taskForm, cooldownMinutes: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveTask}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-4.5 rounded-[1.25rem] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-amber-500/20 mt-6 text-sm uppercase tracking-widest"
              >
                <Save size={18} />
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
