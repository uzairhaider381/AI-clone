'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Shield, ShieldAlert, Play, RotateCcw, 
  CheckCircle2, AlertTriangle, Cpu, FastForward,
  Settings, Lock, Unlock, ClipboardList, Info, X, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  action: string;
  category: 'file' | 'system' | 'network' | 'process';
  status: 'planned' | 'approved' | 'executing' | 'completed' | 'denied' | 'rolledback';
  risk: 'low' | 'medium' | 'high';
  timestamp: number;
}

export default function AutomationConsole() {
  const [safeMode, setSafeMode] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', action: 'Sync research manifest to node cluster', category: 'network', status: 'planned', risk: 'low', timestamp: Date.now() },
    { id: '2', action: 'Prune local temporary cache ( > 500MB)', category: 'file', status: 'planned', risk: 'medium', timestamp: Date.now() + 1000 },
    { id: '3', action: 'Initialize external API subscription renewal', category: 'system', status: 'planned', risk: 'high', timestamp: Date.now() + 2000 },
  ]);

  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Kernel initialized in Safe Mode v4.0.2',
    '[AUTH] Permission protocol active.',
    '[NODES] Global sync check completed.'
  ]);

  const handleApprove = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
    setLogs(prev => [`[ACTION] Task ${id} approved by researcher.`, ...prev]);
    
    // Simulate execution
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'executing' } : t));
      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
        setLogs(prev => [`[SUCCESS] Task ${id} stabilization complete.`, ...prev]);
      }, 2000);
    }, 1000);
  };

  const handleDeny = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'denied' } : t));
    setLogs(prev => [`[WARNING] Task ${id} denied. Permission revoked.`, ...prev]);
  };

  const handleRollback = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'rolledback' } : t));
    setLogs(prev => [`[ROLLBACK] Task ${id} state restoration initiated.`, ...prev]);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12 max-w-7xl mx-auto w-full space-y-12 bg-background text-foreground relative">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-accent text-accent-foreground rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary border border-border text-primary shadow-sm">
              <Terminal size={20} />
            </div>
            <h1 className="text-4xl font-black tracking-widest text-foreground uppercase drop-shadow-sm">Automation Core</h1>
          </div>
          <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px] max-w-md leading-relaxed drop-shadow-sm pl-2">
            Autonomous agent task management with hierarchical guardrails and real-time state monitoring.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={() => setSafeMode(!safeMode)}
             className={cn(
               "h-14 px-6 rounded-2xl flex items-center gap-3 transition-all font-black uppercase tracking-widest text-[10px] border-2 shadow-sm",
               safeMode ? "bg-green-500/10 border-green-500/50 text-green-400 hover:bg-green-500/20 hover:shadow-sm" : "bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20 hover:shadow-sm animate-pulse"
             )}
           >
             {safeMode ? <Shield size={18} /> : <AlertTriangle size={18} />}
             {safeMode ? 'Safe Mode Active' : 'Unrestricted Mode'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        {/* Planned Actions Column */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between pl-2">
              <div className="flex items-center gap-3">
                 <ClipboardList size={18} className="text-primary" />
                 <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground0">Action Pipeline</span>
              </div>
              <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">{tasks.filter(t => t.status === 'planned').length} Pending Nodes</span>
           </div>

           <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                 {tasks.map(task => (
                   <motion.div 
                     key={task.id}
                     layout
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className={cn(
                       "p-6 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative group  shadow-lg",
                       task.status === 'planned' ? "bg-card border-border hover:border-border" : 
                       task.status === 'completed' ? "bg-green-950/20 border-green-500/30 shadow-sm" :
                       task.status === 'denied' ? "bg-red-950/20 border-red-500/30 shadow-sm" : "bg-accent border-border"
                     )}
                   >
                     {/* Hover glow effect for planned tasks */}
                     {task.status === 'planned' && (
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     )}

                      <div className="flex items-center gap-5 flex-1 relative z-10">
                         <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner",
                           task.risk === 'high' ? "bg-red-500/20 text-red-400 border-red-500/40 shadow-sm" : 
                           task.risk === 'medium' ? "bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-sm" : "bg-primary text-primary border-border shadow-sm"
                         )}>
                           <Cpu size={20} />
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                               <span className="text-[13px] font-black uppercase tracking-wider text-foreground">{task.action}</span>
                               <span className={cn(
                                 "text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-sm border",
                                 task.risk === 'high' ? "border-red-500/40 text-red-400 bg-red-950/40 shadow-sm" :
                                 task.risk === 'medium' ? "border-orange-500/40 text-orange-400 bg-orange-950/40" :
                                 "border-border text-primary bg-accent"
                               )}>
                                 {task.risk} Risk
                               </span>
                            </div>
                            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-4">
                               <span className="bg-background px-2 py-0.5 rounded-sm border border-border">ID: {task.id}</span>
                               <span className="bg-background px-2 py-0.5 rounded-sm border border-border">Class: {task.category}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 relative z-10">
                         {task.status === 'planned' && (
                           <>
                              <button 
                                onClick={() => handleDeny(task.id)}
                                className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-[#010308] hover:border-red-500 hover:shadow-sm transition-all flex items-center justify-center"
                              >
                                 <X size={18} />
                              </button>
                              <button 
                                onClick={() => handleApprove(task.id)}
                                className="px-6 h-12 rounded-xl bg-primary text-[#010308] border border-border font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:bg-accent hover:shadow-sm transition-all"
                              >
                                 Execute <Play size={14} className="fill-current" />
                              </button>
                           </>
                         )}
                         {task.status === 'executing' && (
                           <div className="px-4 py-2 rounded-xl bg-blue-900/20 text-blue-400 flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] border border-blue-500/30 shadow-sm">
                              <RefreshCw size={14} className="animate-spin" /> Process
                           </div>
                         )}
                         {task.status === 'completed' && (
                           <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-400 bg-green-950/30 px-3 py-1.5 rounded-lg border border-green-500/20">Staged & Synced</span>
                              <button 
                                onClick={() => handleRollback(task.id)}
                                className="w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:border-border hover:bg-accent hover:text-primary transition-all flex items-center justify-center"
                                title="Rollback Action"
                              >
                                 <RotateCcw size={14} />
                              </button>
                           </div>
                         )}
                         {task.status === 'denied' && (
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500 bg-red-950/30 px-3 py-1.5 rounded-lg border border-red-500/20">Access Revoked</span>
                         )}
                         {task.status === 'rolledback' && (
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500 bg-orange-950/30 px-3 py-1.5 rounded-lg border border-orange-500/20">Restored State</span>
                         )}
                      </div>
                   </motion.div>
                 ))}
              </AnimatePresence>
           </div>
        </div>

        {/* Console Log Column */}
        <div className="space-y-8">
           <div className="p-6 bg-background rounded-3xl border border-border shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.05),transparent_50%)] pointer-events-none" />
              <div className="flex items-center justify-between pb-4 border-b border-border relative z-10">
                <div className="flex items-center gap-3 text-muted-foreground">
                   <Terminal size={16} />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node Trace</span>
                </div>
                <div className="flex gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-sm" />
                   <div className="w-2 h-2 rounded-full bg-accent" />
                   <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
              </div>

              <div className="h-[350px] overflow-y-auto space-y-3 font-mono text-[10px] custom-scrollbar pr-2 relative z-10">
                 {logs.map((log, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ opacity: 0, x: 5 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={cn(
                       "leading-relaxed tracking-wider break-all",
                       log.includes('[SUCCESS]') ? "text-green-400 drop-shadow-sm" :
                       log.includes('[WARNING]') ? "text-red-400 drop-shadow-sm" :
                       log.includes('[ACTION]') ? "text-blue-400 drop-shadow-sm" : "text-foreground0/80"
                     )}
                   >
                     <span className="opacity-50 mr-2">{new Date().toISOString().substring(11, 19)}</span>
                     {log}
                   </motion.div>
                 ))}
              </div>
           </div>

           <div className="p-6 bg-card  border border-border rounded-3xl space-y-6 shadow-sm">
              <div className="flex items-center gap-3 text-muted-foreground pb-2">
                 <Lock size={16} />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sec Guardrails</span>
              </div>
              <div className="space-y-4">
                 {[
                   { label: 'File Integrity Monitor', status: true },
                   { label: 'Network Firewall Level 3', status: true },
                   { label: 'System Call Interception', status: safeMode },
                   { label: 'External Memory Write', status: false }
                 ].map((g, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground0/80">{g.label}</span>
                      {g.status ? <CheckCircle2 size={16} className="text-primary drop-shadow-sm" /> : <ShieldAlert size={16} className="text-red-500/40" />}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
