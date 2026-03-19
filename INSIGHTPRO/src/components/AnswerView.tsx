'use client';

// ============================================================
// AI Clone — Neural Answer View
// ============================================================

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText, Copy, ThumbsUp, ThumbsDown, Share2,
  Download, RefreshCw, Layers, CheckCircle2, Circle, Loader2,
  Link as LinkIcon, Database, ArrowRight, Layers3, Text, Bot, Wand2, Image as ImageIcon, Volume2, Sparkles, Cpu
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import SearchInput from './SearchInput';
import type { SearchMode } from '@/types';

interface AnswerViewProps {
  onSearch: (query: string, mode: SearchMode) => void;
}

export default function AnswerView({ onSearch }: AnswerViewProps) {
  const { activeThreadId, threads, isSearching, addImageToResult } = useStore();
  const thread = threads.find((t) => t.id === activeThreadId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = React.useState<string | null>(null);

  const handleSpeak = (id: string, text: string) => {
    if (isSpeaking === id) {
        window.speechSynthesis.cancel();
        setIsSpeaking(null);
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select a premium voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Natural'));
    if (premiumVoice) utterance.voice = premiumVoice;
    
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);
    
    setIsSpeaking(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleGenerateImage = async (resultId: string, query: string) => {
    if (isGenerating) return;
    setIsGenerating(resultId);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Futuristic cinematic sci-fi illustration high tech for: ${query}. Dark cyan neon aesthetic.` }),
      });
      if (!res.ok) throw new Error('Image generation failed');
      const { url } = await res.json();
      if (activeThreadId) {
        addImageToResult(activeThreadId, resultId, url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(null);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.results.length, isSearching]);

  if (!thread) return null;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center relative scroll-smooth bg-background text-foreground">
      {/* Background elements for continuity */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-accent text-accent-foreground rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] left-[10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-3xl px-6 py-12 lg:py-24 space-y-16 relative z-10">
        
        {thread.results.map((res, idx) => (
          <motion.div 
            key={res.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="space-y-12 animate-in"
          >
            {/* User Question */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-accent border border-border flex items-center justify-center text-primary shadow-sm">
                   <Text size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground0/60 drop-shadow-sm">Neural Query</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground drop-shadow-sm leading-tight uppercase">
                {res.query}
              </h1>
            </div>

            {/* Sources section */}
            {res.sources.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary border border-border text-primary shadow-sm">
                    <Database size={16} />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground drop-shadow-sm">Verification Nodes</h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-900/50 to-transparent ml-2" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {res.sources.slice(0, 6).map((src, i) => (
                    <motion.a 
                      key={i} 
                      href={src.url} 
                      target="_blank" 
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative overflow-hidden rounded-2xl border border-border bg-card  p-4 transition-all hover:bg-accent hover:border-border shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded flex items-center justify-center overflow-hidden">
                            <img src={src.favicon} className="w-4 h-4 rounded-sm transition-all grayscale group-hover:grayscale-0" alt="" />
                          </div>
                          <span className="text-[10px] text-foreground0/60 font-black uppercase tracking-widest truncate max-w-[100px]">{src.domain}</span>
                        </div>
                        <ArrowRight size={10} className="text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                      <div className="text-[11px] font-bold line-clamp-2 text-foreground leading-relaxed group-hover:text-foreground transition-colors uppercase tracking-wide">{src.title}</div>
                    </motion.a>
                  ))}
                  {res.sources.length > 6 && (
                    <button className="rounded-2xl border border-dashed border-border hover:border-border hover:bg-accent transition-all flex items-center justify-center p-4">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">+{res.sources.length - 6} Data Nodes</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Reasoning / Thinking section */}
            {(res.reasoning || (isSearching && idx === thread.results.length - 1)) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-sm">
                    <Cpu size={16} />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-purple-600/80 drop-shadow-sm">Deep Synthesis</h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-900/40 to-transparent ml-2" />
                </div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card p-6 rounded-3xl border border-purple-900/40  relative overflow-hidden group shadow-inner"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-500 group-hover:opacity-30 transition-opacity">
                    <Sparkles size={48} />
                  </div>
                  <div className="text-[12px] text-purple-200/60 font-mono leading-relaxed relative z-10 tracking-widest uppercase">
                    {res.reasoning ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {res.reasoning}
                      </ReactMarkdown>
                    ) : (
                      <div className="flex items-center gap-3 py-2 text-purple-400">
                        <div className="w-3 h-3 rounded-sm border-[1.5px] border-purple-400/30 border-t-purple-400 animate-spin" />
                        <span className="animate-pulse">Processing multi-dimensional datasets...</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Answer Synthesis */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary text-primary border border-border shadow-sm">
                  <Layers3 size={16} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary drop-shadow-sm">Final Output</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-900/60 to-transparent ml-2" />
              </div>
              
              {!res.answer && isSearching && (
                <div className="space-y-6 py-4">
                  <div className="h-5 w-3/4 bg-accent animate-pulse rounded-xl border border-border" />
                  <div className="h-5 w-full bg-accent animate-pulse rounded-xl border border-border" />
                  <div className="h-40 w-full bg-accent animate-pulse rounded-3xl border border-border" />
                </div>
              )}

              <div className="prose-perplex px-1 text-foreground font-medium tracking-wide">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {res.answer}
                </ReactMarkdown>
              </div>
            </div>

            {/* Visuals / Images section */}
            {(res.images?.length || isGenerating === res.id) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 shadow-sm">
                    <ImageIcon size={16} />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-pink-600/80 drop-shadow-sm">Visual Rendering</h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-pink-900/40 to-transparent ml-2" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {res.images?.map((img, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="aspect-video relative rounded-3xl overflow-hidden border border-border group shadow-sm"
                    >
                      <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Research visual" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020611] via-[#020611]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-6">
                         <span className="text-primary text-[10px] font-black uppercase tracking-widest drop-shadow-sm">Visual Alpha</span>
                         <button className="bg-primary text-primary border border-border  px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-primary transition-all">Extract</button>
                      </div>
                    </motion.div>
                  ))}
                  {isGenerating === res.id && (
                    <div className="aspect-video rounded-3xl border border-dashed border-border flex flex-col items-center justify-center bg-card animate-in overflow-hidden relative ">
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                       <Loader2 size={28} className="animate-spin text-foreground0/60 mb-3" />
                       <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">Rendering Hologram...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer actions */}
            {res.answer && (
              <div className="flex flex-wrap items-center gap-3 pt-8 mt-4 border-t border-border">
                <div className="flex items-center gap-1.5 p-1 bg-card rounded-2xl border border-border shadow-inner">
                   <button className="p-2.5 hover:bg-accent rounded-xl transition-all text-muted-foreground hover:text-primary"><ThumbsUp size={16}/></button>
                   <div className="w-[1px] h-4 bg-accent mx-0.5" />
                   <button className="p-2.5 hover:bg-accent rounded-xl transition-all text-muted-foreground hover:text-primary"><ThumbsDown size={16}/></button>
                </div>
                
                <div className="flex-1" />
                
                <div className="flex flex-wrap items-center gap-2">
                  {!res.images?.length && !isGenerating && (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleGenerateImage(res.id, res.query)}
                      className="flex items-center gap-2.5 px-5 py-2.5 bg-primary border border-border text-primary rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all hover:bg-primary hover:text-[#010308] shadow-sm hover:shadow-sm"
                    >
                      <Wand2 size={15}/> Materialize
                    </motion.button>
                  )}
                  
                  <button 
                    onClick={() => handleSpeak(res.id, res.answer)}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all border",
                      isSpeaking === res.id ? "bg-primary text-[#010308] border-border shadow-sm" : "bg-card border-border text-muted-foreground hover:bg-accent hover:text-primary"
                    )}
                  >
                    <Volume2 size={15}/> {isSpeaking === res.id ? 'Translating' : 'Vocalize'}
                  </button>

                  <button className="flex items-center gap-2.5 px-4 py-2.5 bg-card hover:bg-accent border border-border rounded-2xl text-[10px] uppercase tracking-widest font-black text-muted-foreground hover:text-primary transition-all">
                    <Share2 size={15}/> Route Data
                  </button>

                  <button className="flex items-center gap-2.5 px-4 py-2.5 bg-card hover:bg-accent border border-border rounded-2xl text-[10px] uppercase tracking-widest font-black text-muted-foreground hover:text-primary transition-all">
                    <RefreshCw size={15}/> Re-Iterate
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {/* Follow up box */}
        {!isSearching && (
          <div className="pt-20 pb-40 relative">
             <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-accent blur-[100px] rounded-full pointer-events-none" />
             <div className="mb-10 flex flex-col items-center relative z-10">
                <div className="w-12 h-[2px] bg-accent mb-6" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-8 drop-shadow-sm">Sub-Process Sequence</h4>
                <SearchInput onSearch={onSearch} isSearching={isSearching} compact={true} />
             </div>
          </div>
        )}

      </div>
      <div ref={bottomRef} className="h-20" />
    </div>
  );
}
