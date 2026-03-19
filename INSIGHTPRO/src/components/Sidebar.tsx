'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, History, ChevronLeft, Settings,
  Zap, Camera, LayoutDashboard, Compass, Moon, Sun, LogOut, X, Cpu, Terminal
} from 'lucide-react';
import { useStore, AVAILABLE_MODELS } from '@/lib/store';
import { cn, truncate } from '@/lib/utils';
import { useTheme } from 'next-themes';
import type { Thread } from '@/types';

interface SidebarProps {
  onNewSearch: () => void;
  onSelectThread: (thread: Thread) => void;
  activeView: string;
}

export default function Sidebar({ onNewSearch }: SidebarProps) {
  const {
    threads, sidebarOpen, toggleSidebar,
    selectedModel, setSelectedModel, apiKey, setApiKey,
    activeThreadId, setActiveThread, activeView, setActiveView, isAdmin, logout
  } = useStore();
  
  const { theme, setTheme } = useTheme();

  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(apiKey);

  const recent = threads.filter(t => !t.pinned).slice(0, 20);

  const navItems = [
    { icon: Search, label: 'Search Engine', id: 'home' },
    { icon: History, label: 'History Archive', id: 'history' },
    { icon: Compass, label: 'Global Node', id: 'discover' },
    { icon: Terminal, label: 'Automation Core', id: 'automation' },
    { icon: LayoutDashboard, label: 'Compute Core', id: 'computer' },
    { icon: Zap, label: 'Features Node', id: 'features' },
    { icon: Camera, label: 'Vision Matrix', id: 'cam' },
    ...(isAdmin ? [{ icon: Settings, label: 'Admin Core', id: 'admin' }] : []),
  ];

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 70 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative flex flex-col h-screen shrink-0 border-r border-border bg-sidebar-bg text-foreground overflow-hidden shadow-sm z-40"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-accent border border-border flex items-center justify-center shrink-0 shadow-sm">
              <Cpu size={16} className="text-primary" />
            </div>
            {sidebarOpen && (
              <span className="font-black text-sm tracking-widest uppercase text-foreground drop-shadow-sm truncate">AI Clone</span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-foreground0 hover:text-primary transition-colors shrink-0"
          >
            <ChevronLeft size={16} className={cn("transition-transform duration-300", !sidebarOpen && "rotate-180")} />
          </button>
        </div>

        {/* New Search */}
        <div className="p-4 border-b border-border shrink-0">
          <button
            onClick={() => { onNewSearch(); setActiveView('home'); }}
            className={cn(
              "flex items-center gap-3 w-full rounded-xl bg-primary border border-border text-primary text-xs font-black uppercase tracking-widest transition-all hover:bg-primary hover:border-border hover:text-primary active:scale-[0.98] shadow-sm",
              sidebarOpen ? "px-4 py-3" : "h-10 justify-center"
            )}
          >
            <Plus size={16} className="shrink-0" />
            {sidebarOpen && <span>New Query</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 border-b border-border shrink-0">
          {navItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={cn(
                  "flex items-center gap-3 w-full rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all overflow-hidden",
                  sidebarOpen ? "px-4 py-3" : "h-11 justify-center",
                  isActive
                    ? "bg-accent text-foreground border border-border shadow-sm"
                    : "text-muted-foreground border border-transparent hover:bg-accent hover:text-primary hover:border-border"
                )}
              >
                <item.icon size={16} className="shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Recent Threads */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0 custom-scrollbar">
            {recent.length > 0 && (
              <p className="text-[9px] text-muted-foreground px-4 pt-2 pb-2 font-black uppercase tracking-[0.2em] mb-1">Recent Data</p>
            )}
            {recent.map(t => (
              <button
                key={t.id}
                onClick={() => { setActiveThread(t.id); setActiveView('thread'); }}
                className={cn(
                  "flex items-center w-full px-4 py-2.5 rounded-lg text-xs text-left transition-colors border border-transparent",
                  activeThreadId === t.id
                    ? "bg-accent text-foreground border-border font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-primary"
                )}
              >
                <span className="truncate tracking-wide">{t.title}</span>
              </button>
            ))}
            {recent.length === 0 && (
              <div className="flex flex-col items-center justify-center h-20 opacity-40">
                <History className="w-5 h-5 mb-2 text-muted-foreground" />
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">No Archives</p>
              </div>
            )}
          </div>
        )}
        {!sidebarOpen && <div className="flex-1" />}

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-1 shrink-0 bg-sidebar-bg">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
               "flex items-center gap-3 w-full rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all",
               sidebarOpen ? "px-4 py-3" : "h-11 justify-center",
               "text-muted-foreground hover:bg-accent hover:text-primary"
            )}
          >
            {theme === 'dark' ? <Sun size={15} className="shrink-0" /> : <Moon size={15} className="shrink-0" />}
            {sidebarOpen && <span>Visual Protocol</span>}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className={cn(
               "flex items-center gap-3 w-full rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all",
               sidebarOpen ? "px-4 py-3" : "h-11 justify-center",
               "text-muted-foreground hover:bg-accent hover:text-primary"
            )}
          >
            <Settings size={15} className="shrink-0" />
            {sidebarOpen && <span>Core Settings</span>}
          </button>
          <button
            onClick={logout}
            className={cn(
               "flex items-center gap-3 w-full rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all mt-2",
               sidebarOpen ? "px-4 py-3" : "h-11 justify-center",
               "text-red-500/70 border border-transparent hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/50"
            )}
          >
            <LogOut size={15} className="shrink-0" />
            {sidebarOpen && <span>Disconnect Node</span>}
          </button>
        </div>
      </motion.aside>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 "
            onClick={() => { setApiKey(apiKeyInput); setShowSettings(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md shadow-sm overflow-hidden text-foreground"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted">
                <h3 className="font-black tracking-widest uppercase text-sm drop-shadow-sm">Core Configuration</h3>
                <button
                  onClick={() => { setApiKey(apiKeyInput); setShowSettings(false); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-6 bg-card">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-foreground0/80 ml-1">Groq Execution Key</label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    placeholder="gsk_..."
                    className="w-full h-10 px-4 rounded-xl border border-border bg-background text-xs text-muted-foreground placeholder:text-foreground focus:outline-none focus:border-border focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-foreground0/80 ml-1">Language Logic Model</label>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                    {AVAILABLE_MODELS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedModel(m.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all",
                          selectedModel === m.id
                            ? "border-border bg-accent shadow-sm"
                            : "border-border bg-background hover:bg-accent hover:border-border"
                        )}
                      >
                        <div>
                          <div className={cn("text-xs font-bold tracking-wide", selectedModel === m.id ? "text-muted-foreground" : "text-muted-foreground")}>{m.name}</div>
                          <div className={cn("text-[10px] mt-1", selectedModel === m.id ? "text-primary" : "text-muted-foreground")}>{m.description}</div>
                        </div>
                        {selectedModel === m.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-muted text-muted-foreground shadow-sm shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 pt-4 border-t border-border bg-muted">
                <button
                  onClick={() => { setApiKey(apiKeyInput); setShowSettings(false); }}
                  className="w-full h-11 bg-primary border border-border text-primary text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-[#010308] transition-all shadow-sm hover:shadow-sm"
                >
                  Compile Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
