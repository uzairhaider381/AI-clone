'use client';

// ============================================================
// AI Clone — Neural Query Interface (Simplified + Integrated Call)
// ============================================================

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, Cpu, Upload, Mic,
  ChevronDown, Zap, Globe, BookOpen, ArrowRight, Layers, X,
  Plus, MessageSquare, AudioLines, Monitor, Phone, PhoneOff, 
  MicOff, Volume2, Brain, Loader2, Activity, Settings, Check
} from 'lucide-react';
import { useStore, AVAILABLE_MODELS } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { SearchMode } from '@/types';

const apiKey = process.env.GROQ_API_KEY;

interface SearchInputProps {
  onSearch: (query: string, mode: SearchMode) => void;
  isSearching: boolean;
  compact?: boolean;
}

export default function SearchInput({ onSearch, isSearching, compact = false }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('deep');
  const [isFocused, setIsFocused] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Calling Integration States
  const [callActive, setCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'active'>('idle');
  const [callMessages, setCallMessages] = useState<{role: string, content: string}[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const voiceTimeoutRef = useRef<any>(null);
  
  const { selectedModel, addFile, uploadedFiles, removeFile, setSelectedModel } = useStore();
  const currentModelName = AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || 'Model Node';

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 240) + 'px';
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        addFile({
            id: Math.random().toString(36).slice(2),
            name: file.name,
            type: file.type,
            size: file.size,
            content: event.target?.result as string,
            uploadedAt: Date.now()
        });
    };
    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    if (!query.trim() || isSearching) return;
    onSearch(query.trim(), uploadedFiles.length > 0 ? 'rag' : mode);
    setQuery('');
  };

  // --- Voice Call Integrated Logic ---
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) final += event.results[i][0].transcript;
          else interim += event.results[i][0].transcript;
        }
        setInterimTranscript(interim);
        if (final) {
          setInterimTranscript('');
          processCallVoice(final);
        }
      };

      recognitionRef.current.onend = () => {
        if (callActive && !isSpeaking) {
          try { recognitionRef.current?.start(); } catch(e) {}
        }
      };
    }
  }, [callActive, isSpeaking]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => { setIsSpeaking(true); recognitionRef.current?.stop(); };
    utterance.onend = () => {
        setIsSpeaking(false);
        if (callActive) try { recognitionRef.current?.start(); } catch(e) {}
    };
    window.speechSynthesis.speak(utterance);
  };

  const startCall = async () => {
    setCallActive(true);
    setCallStatus('calling');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        setTimeout(() => {
          setCallStatus('active');
          speak("Hey! I'm here. How can I help you today?");
          setCallMessages([{role: 'assistant', content: "Hello! Jarvis here. How can I assist you?"}]);
        }, 1200);
    }).catch(() => setCallActive(false));
  };

  const endCall = () => {
    setCallActive(false);
    setCallStatus('idle');
    window.speechSynthesis.cancel();
    recognitionRef.current?.stop();
    setInterimTranscript('');
  };

  const processCallVoice = async (input: string) => {
    if (!input.trim()) return;
    const newMsgs = [...callMessages, {role: 'user', content: input}];
    setCallMessages(newMsgs);
    
    try {
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{role: 'system', content: 'You are Jarvis, a very friendly and concise AI. Currently on a live call. Be warm and short.'}, ...newMsgs],
          max_tokens: 150
        }),
      });
      const data = await resp.json();
      const reply = data.choices[0].message.content;
      setCallMessages(prev => [...prev, {role: 'assistant', content: reply}]);
      speak(reply);
    } catch(e) { speak("I missed that, sorry. Connection issue."); }
  };

  return (
    <div className={cn("w-full transition-all duration-500", compact ? "max-w-4xl" : "max-w-3xl mx-auto relative group")}>
       
       <AnimatePresence>
         {callActive && (
           <motion.div 
             initial={{ opacity: 0, y: 20, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 20, scale: 0.95 }}
             className="absolute bottom-full left-0 right-0 mb-6 z-50 flex justify-center"
           >
              <div className="bg-card  border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col items-center gap-6">
                 {/* Visualizer Mini */}
                 <div className="flex flex-col items-center gap-4">
                    <div className="relative flex items-center justify-center h-24 w-24">
                        <motion.div animate={{ scale: isSpeaking ? [1, 1.3, 1] : 1 }} transition={{ repeat: Infinity }} className="absolute inset-0 rounded-full bg-primary" />
                        <div className="flex gap-1 items-center h-8">
                            {[1,2,3,4,5].map(i => (
                                <motion.div key={i} animate={{ height: isSpeaking ? [5, 30, 5] : (interimTranscript ? [10, 20, 10] : 4) }} transition={{ repeat: Infinity, delay: i*0.1 }} className="w-1 bg-primary rounded-full" />
                            ))}
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-[10px] font-black tracking-widest text-foreground0 uppercase">Live Call Node</span>
                        <p className="text-xs font-bold text-foreground mt-1">{interimTranscript ? `"${interimTranscript}"` : (isSpeaking ? "Jarvis is speaking..." : "Listening...")}</p>
                    </div>
                 </div>

                 {/* Call End Button */}
                 <button onClick={endCall} className="px-6 py-2.5 bg-red-500/20 border border-red-500/40 rounded-full text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-[#010308] transition-all">
                    End Connection
                 </button>
              </div>
           </motion.div>
         )}
       </AnimatePresence>

       <div 
        className={cn(
          "relative border transition-all duration-300 bg-card  text-foreground",
          compact ? "rounded-2xl" : "rounded-xl",
          isFocused ? "border-border  shadow-sm" : "border-border shadow-lg"
        )}
       >
          <div className="flex flex-col p-5 pb-4">
            <textarea
              ref={textareaRef}
              rows={1}
              value={query}
              onChange={e => { setQuery(e.target.value); autoResize(); }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={compact ? "Ask a follow-up..." : "What can I do for you today?"}
              className="w-full bg-transparent resize-none outline-none text-[15px] font-medium text-foreground placeholder:text-muted-foreground min-h-[44px] leading-relaxed tracking-wide"
            />
            
            <div className="flex items-center justify-between mt-3 pr-2">
              <div className="flex items-center gap-3">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-border transition-all"
                >
                    <Plus size={18}/>
                </button>

                <div className="h-4 w-[1px] bg-accent mx-1" />

                <button 
                  onClick={() => setShowModels(!showModels)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent text-[10px] uppercase tracking-widest font-black text-muted-foreground hover:text-foreground0 transition-all"
                >
                  <Monitor size={12} />
                  <span>{currentModelName.split(' ')[0]}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Integrated Call Button */}
                <button 
                  onClick={callActive ? endCall : startCall}
                  className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-xl transition-all border",
                    callActive ? "bg-red-500/20 border-red-500/40 text-red-500 animate-pulse" : "bg-accent border-border text-muted-foreground hover:text-primary hover:border-border"
                  )}
                  title="Jarvis Voice Call"
                >
                  {callActive ? <PhoneOff size={16} /> : <Phone size={16} />}
                </button>

                <button 
                  onClick={() => {
                     // Mic Quick Listen Logic (same as before but simplified)
                     const windowAny = window as any;
                     const SpeechRec = windowAny.SpeechRecognition || windowAny.webkitSpeechRecognition;
                     if (!SpeechRec) return;
                     const recognition = new SpeechRec();
                     recognition.onresult = (e: any) => { setQuery(e.results[0][0].transcript); };
                     recognition.start();
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-accent border border-border text-muted-foreground hover:text-primary hover:border-border"
                >
                  <Mic size={16}/>
                </button>
                
                <button
                  onClick={submit}
                  disabled={!query.trim() || isSearching}
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all ml-1",
                    query.trim() ? "bg-primary text-[#010308] hover:bg-accent shadow-lg" : "bg-accent text-foreground cursor-not-allowed"
                  )}
                >
                  {isSearching ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={18} />}
                </button>
              </div>
            </div>
          </div>
       </div>
    </div>
  );
}
