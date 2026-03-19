'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { readStream } from '@/lib/streamer';
import { useStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import SearchInput from '@/components/SearchInput';
import AnswerView from '@/components/AnswerView';
import AdminPanel from '@/components/AdminPanel';
import HistoryView from '@/components/HistoryView';
import DiscoverView from '@/components/DiscoverView';
import ComputerMode from '@/components/ComputerMode';
import {
  Settings, CheckCircle2, RefreshCw, Sparkles, Globe, ArrowRight, LogOut,
  Fingerprint, Scan, Wifi, Bluetooth, Radio, Mic,
  Speaker, Headphones, Mail, Phone, MessageSquare,
  Hash, Image, FileText, Folder, HardDrive,
  AlertTriangle, Info, HelpCircle,
  Key, Camera, Library, Clock, Trash2, Plus, Brain, Sparkles as SparklesIcon, Box, Type, Wand2, ShoppingBag, Power, BarChart,
  Search as SearchIcon
} from 'lucide-react';
import type { SearchMode, SearchResult, Source } from '@/types';

import VisionView from '@/components/VisionView';
import StudioView from '@/components/StudioView';
import dynamic from 'next/dynamic';
const LiveCamView = dynamic(() => import('@/components/LiveCamView'), { ssr: false });
import AdvancedFeaturesView from '@/components/AdvancedFeaturesView';
import AutomationConsole from '@/components/AutomationConsole';

export default function Dashboard() {
  const {
    theme, createThread, addResultToThread, setIsSearching, isSearching, setSearchError, searchError,
    activeThreadId, threads, setActiveThread, activeView, setActiveView, isAdmin,
    fetchUsers
  } = useStore();

  useEffect(() => {
    document.documentElement.className = theme;
    fetchUsers();
  }, [theme, fetchUsers]);

  const handleSearch = async (query: string, mode: SearchMode) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setActiveView('thread');

    const newResult: SearchResult = {
      id: Date.now().toString(),
      query,
      subQueries: [],
      sources: [],
      answer: '',
      citations: [],
      model: mode,
      mode,
      timestamp: Date.now(),
      exportable: false,
    };

    let threadId = activeThreadId;
    if (!threadId || activeView === 'home') {
      threadId = createThread(newResult);
    } else {
      addResultToThread(threadId, newResult);
    }

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            query, 
            mode, 
            files: useStore.getState().uploadedFiles.map(f => ({ name: f.name, content: f.content }))
        }),
      });

      if (!res.ok) throw new Error('Search failed');

      await readStream(res, (chunk) => {
        const currentThread = useStore.getState().threads.find(t => t.id === threadId);
        if (!currentThread) return;
        const currentResult = currentThread.results[currentThread.results.length - 1];
        const updatedResult = { ...currentResult };

        if (chunk.type === 'source') {
          updatedResult.sources = [...updatedResult.sources, chunk.data as Source];
        } else if (chunk.type === 'reasoning') {
          updatedResult.reasoning = (updatedResult.reasoning || '') + (chunk.data as string);
        } else if (chunk.type === 'text') {
          updatedResult.answer += chunk.data as string;
        } else if (chunk.type === 'done') {
          updatedResult.exportable = true;
          setIsSearching(false);
        } else if (chunk.type === 'error') {
          setSearchError(chunk.data as string);
          setIsSearching(false);
        }

        useStore.setState(s => ({
          threads: s.threads.map(t =>
            t.id === threadId ? {
              ...t,
              results: t.results.map(r => r.id === updatedResult.id ? updatedResult : r)
            } : t
          )
        }));
      });

    } catch (err) {
      console.error(err);
      setSearchError(err instanceof Error ? err.message : 'Unknown error');
      setIsSearching(false);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'history': return <HistoryView />;
      case 'discover': return <DiscoverView />;
      case 'computer': return <ComputerMode />;
      case 'cam': return <LiveCamView />;
      case 'features': return <AdvancedFeaturesView />;
      case 'admin': return <AdminPanel />;
      case 'automation': return <AutomationConsole />;
      case 'thread': return <AnswerView onSearch={handleSearch} />;
      default: return (
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 max-w-5xl mx-auto w-full overflow-hidden text-foreground">
          {/* Futuristic Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
            <motion.div
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] left-[15%] w-64 h-64 bg-accent text-accent-foreground rounded-full blur-[100px]"
            />
            <motion.div
              animate={{
                y: [0, 40, 0],
                x: [0, -30, 0],
                rotate: [0, -10, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent blur-[150px] rounded-full" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-6 flex items-center justify-center"
            >
              <div className="px-5 py-2 rounded-full bg-accent border border-border text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-muted text-muted-foreground animate-pulse" />
                 Global Sudo Access Granted
              </div>
            </motion.div>

            <h1 className="text-6xl lg:text-[100px] font-black tracking-tighter mb-12 text-center text-foreground drop-shadow-sm uppercase leading-none pb-2">
              Neural<br/>Query Node
            </h1>
            
            <motion.div 
              className="w-full max-w-3xl filter drop-shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <SearchInput onSearch={handleSearch} isSearching={isSearching} />
            </motion.div>
            
            {searchError && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-red-950/40 border border-red-500/40 rounded-2xl text-red-400 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-3  shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>API Error: {searchError}. System stabilizing...</span>
              </motion.div>
            )}
            
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.6, duration: 0.8 }}
               className="mt-12 flex flex-wrap justify-center gap-4"
            >
              {[
                { icon: CheckCircle2, label: 'Deep Analysis' },
                { icon: RefreshCw, label: 'Dynamic Recap' },
                { icon: Sparkles, label: 'Trend Insight' },
                { icon: Globe, label: 'Global Routing' }
              ].map((chip, idx) => (
                <motion.button 
                  key={chip.label}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + (idx * 0.1) }}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-border bg-card  hover:bg-accent hover:border-border transition-all shadow-sm group text-muted-foreground"
                >
                  <chip.icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-widest">{chip.label}</span>
                </motion.button>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-20 w-full max-w-2xl grid grid-cols-1 gap-3"
            >
              {[
                "Analyze the future of decentralized finance and its impact.",
                "Compare the architectural differences between Next.js and SvelteKit.",
                "How does quantum computing threaten modern encryption?"
              ].map((q, idx) => (
                <motion.button 
                  key={q} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + (idx * 0.1) }}
                  whileHover={{ x: 8 }}
                  onClick={() => handleSearch(q, 'deep')}
                  className="w-full text-left px-5 py-4 rounded-2xl bg-card border border-border hover:border-border hover:bg-accent text-xs font-semibold tracking-wide text-foreground0/80 hover:text-foreground transition-all flex items-center justify-between group shadow-sm drop-shadow-sm"
                >
                  <span className="truncate">{q}</span>
                  <div className="p-2 rounded-xl bg-background border border-border text-foreground0 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                    <ArrowRight size={14} />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans selection:bg-primary text-foreground">
      <Sidebar
        onNewSearch={() => { setActiveThread(null); setActiveView('home'); }}
        onSelectThread={() => setActiveView('thread')}
        activeView={activeView as any}
      />

      <main className="flex-1 relative overflow-hidden flex flex-col h-full bg-background">
        <div className="absolute top-4 right-6 flex items-center gap-4 z-40">
           <button 
             onClick={() => useStore.getState().logout()}
             className="p-2.5 hover:bg-red-950/40 rounded-xl transition-all text-muted-foreground hover:text-red-400 group flex items-center gap-2 border border-transparent hover:border-red-900/30 shadow-sm"
           >
             <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Abort Console</span>
             <LogOut size={18}/>
           </button>
           <div className="w-10 h-10 rounded-2xl bg-accent border border-border flex items-center justify-center text-foreground text-[11px] font-black uppercase tracking-tighter shadow-sm">
             {useStore.getState().currentUser?.name?.slice(0, 2) || 'AI'}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="h-full"
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
