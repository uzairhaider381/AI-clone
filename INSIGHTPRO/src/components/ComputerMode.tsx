'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Monitor, HardDrive, RefreshCw, Terminal, Activity, Zap, Play, Square, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ComputerMode() {
  const [isBooting, setIsBooting] = useState(true);
  const [stats, setStats] = useState({ cpu: 12, ram: 45, gpu: 0 });
  
  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2000);
    const interval = setInterval(() => {
        setStats({
            cpu: Math.floor(Math.random() * 40) + 10,
            ram: Math.floor(Math.random() * 5) + 40,
            gpu: Math.floor(Math.random() * 100)
        });
    }, 1500);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  if (isBooting) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-black text-green-500 font-mono">
            <Loader2 className="animate-spin mb-4" size={48} />
            <div className="text-xl tracking-widest animate-pulse">SYSTEM INITIALIZING...</div>
            <div className="mt-8 text-xs opacity-40 max-w-md text-center">
                KERNAL_SECURE_LOAD... OK<br/>
                VIRTUAL_NEURAL_BUS_SYNC... OK<br/>
                API_GATEWAY_HANDSHAKE... OK
            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background text-foreground">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-sm">
                <Cpu size={32} className="text-foreground" />
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Core Control</h1>
                <p className="text-foreground/40 text-sm font-mono mt-1">INSTANCE_ID: CLONE_AI_CORE_0442 &bull; STATUS: OPERATIONAL</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
                <button className="h-10 px-4 rounded-xl border border-white/20 hover:bg-white/5 transition-all text-sm font-bold flex items-center gap-2">
                    <RefreshCw size={16} /> Hot Reload
                </button>
                <button className="h-10 px-4 rounded-xl bg-white text-black font-bold text-sm shadow-sm hover:opacity-90">
                    Deploy Update
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
                { label: 'CPU Utilization', value: stats.cpu + '%', icon: Activity, color: 'text-blue-400' },
                { label: 'RAM Availability', value: stats.ram + ' GB', icon: HardDrive, color: 'text-purple-400' },
                { label: 'Neural Throughput', value: stats.gpu + ' TFLOPs', icon: Zap, color: 'text-yellow-400' }
            ].map(stat => (
                <div key={stat.label} className="p-6 bg-white/5 border border-white/10 rounded-[28px] overflow-hidden relative">
                    <div className="absolute bottom-0 right-0 p-4 opacity-5"><stat.icon size={64}/></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">{stat.label}</p>
                    <div className={cn("text-4xl font-bold", stat.color)}>{stat.value}</div>
                    <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: stat.value }}
                          className={cn("h-full", stat.color.replace('text', 'bg'))}
                        />
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Terminal Module */}
            <div className="bg-background border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-foreground/40"/>
                        <span className="text-xs font-bold tracking-widest text-foreground/60">ROOT_CONSOLE</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    </div>
                </div>
                <div className="p-6 font-mono text-[13px] leading-relaxed space-y-1">
                    <p className="text-foreground/40 italic"># Initialize system diagnostic sequence...</p>
                    <p className="text-green-500">$ check --all-modules</p>
                    <p className="text-foreground">SEARCH_ENGINE: <span className="text-green-400 font-bold">[SYNCED]</span></p>
                    <p className="text-foreground">SYNTHESIS_API: <span className="text-green-400 font-bold">[SYNCED]</span></p>
                    <p className="text-foreground">VOICE_ASSISTANT: <span className="text-green-400 font-bold">[READY]</span></p>
                    <p className="text-foreground">VECTOR_DB_LOCAL: <span className="text-yellow-400 font-bold">[INDEXING_89%]</span></p>
                    <p className="text-blue-400 animate-pulse">$ system --live-monitor</p>
                </div>
            </div>

            {/* Neural Execution Management */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                   <div className="flex items-center gap-3 mb-6">
                        <Monitor size={24} className="text-blue-400" />
                        <h3 className="text-xl font-bold">Neural Engine Management</h3>
                   </div>
                   <p className="text-foreground/40 leading-relaxed text-sm mb-6">Allocate computational resources between search depth, synthesis accuracy, and multi-modal generation threads.</p>
                   
                   <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-blue-500/40 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Play size={18} className="text-green-500 fill-green-500" />
                                <span className="text-sm font-bold">Synthesis Thread 01</span>
                            </div>
                            <span className="text-xs font-mono text-foreground/40">PID: 8092</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-red-500/40 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Square size={18} className="text-red-500 fill-red-500" />
                                <span className="text-sm font-bold">Vector Indexing 02</span>
                            </div>
                            <span className="text-xs font-mono text-foreground/40">PID: 1102 &bull; HALTED</span>
                        </div>
                   </div>
                </div>
                <button className="h-12 w-full mt-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all">
                    Open Advanced Matrix Control
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
