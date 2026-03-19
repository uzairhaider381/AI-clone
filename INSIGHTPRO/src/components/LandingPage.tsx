'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Shield, Zap, Search, Layers, Cpu, 
  Globe, Sparkles, Database, FileText, ImageIcon, Mic, Square
} from 'lucide-react';
import Navbar from './Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary font-sans text-foreground">
      <Navbar />
      
      {/* Hero Section - Futuristic VR Interface */}
      <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Gradients & Glows */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="absolute w-full h-[1px] top-1/3 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent shadow-sm" />
          <div className="absolute w-full h-[1px] bottom-1/3 bg-gradient-to-r from-transparent via-blue-900/50 to-transparent shadow-sm" />
          
          {/* Abstract wavy lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
            <path d="M-100 800 Q 400 600 800 800 T 1600 700 T 2400 800" fill="none" stroke="url(#wave-grad)" strokeWidth="2" />
            <path d="M-100 850 Q 500 700 900 850 T 1700 800 T 2500 850" fill="none" stroke="url(#wave-grad)" strokeWidth="1" />
            <defs>
              <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        </div>

        {/* Central 3D Glowing Sphere */}
        <div className="relative z-10 flex items-center justify-center w-[500px] h-[500px]">
          {/* Outer diffuse glow */}
          <div className="absolute inset-0 rounded-full bg-primary blur-[60px]" />
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-20 rounded-full border border-border" 
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute inset-10 rounded-full border border-blue-500/20 border-dashed" 
          />
          
          {/* Inner complex sphere structure */}
          <div className="absolute w-72 h-72">
            {[0, 30, 60, 90, 120, 150].map((deg) => (
              <motion.div 
                key={`y-${deg}`} 
                animate={{ rotateY: [deg, deg + 360], rotateX: 20 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-border"
              />
            ))}
            {[0, 30, 60, 90, 120, 150].map((deg) => (
              <motion.div 
                key={`x-${deg}`} 
                animate={{ rotateX: [deg, deg + 360], rotateY: 20 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-blue-400/30"
              />
            ))}
            
            {/* Core Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-sm" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-muted text-muted-foreground rounded-full blur-[2px]" />
          </div>
        </div>

        {/* LEFT FLOATING PANELS */}
        <div className="absolute hidden lg:flex left-16 top-1/2 -translate-y-1/2 z-20 flex-col gap-8 w-96 transform-gpu" style={{ transform: 'perspective(1200px) rotateY(15deg)' }}>
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-card  border border-border p-6 rounded-2xl shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 
                            group-hover:opacity-100 transition-opacity" />
            <p className="text-foreground text-[15px] font-medium leading-relaxed tracking-wide">
              <strong className="text-foreground">AI Clone 3</strong> is capable of reasoning better than previous models, enabling autonomous logic synthesis across multi-modal inputs.
            </p>
          </motion.div>
          
          <div className="flex gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="w-48 h-32 bg-gradient-to-b from-[#0a1930]/80 to-[#040D21]/80  border border-border rounded-2xl overflow-hidden relative"
            >
              {/* Abstract Landscape */}
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute bottom-0 w-full h-2/3 opacity-80">
                <path d="M0,100 L0,60 L20,30 L40,70 L60,20 L80,50 L100,10 L100,100 Z" fill="url(#mount-grad)" />
                <defs>
                  <linearGradient id="mount-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#082f49" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className="flex-1 bg-card  border border-border rounded-2xl flex items-center justify-center gap-3 p-4 hover:border-border transition-colors cursor-pointer"
            >
              <ImageIcon className="text-primary w-6 h-6" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="w-full h-1.5 bg-primary rounded-full" />
                <div className="w-2/3 h-1.5 bg-primary rounded-full" />
              </div>
            </motion.div>
          </div>
          
          <motion.div 
             initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
             className="w-full h-40 bg-card  border border-border rounded-2xl p-5 relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 p-4 border-l border-b border-border rounded-bl-2xl bg-primary text-[10px] uppercase font-bold text-primary tracking-wider">
               Realtime Analytics
             </div>
             <svg className="absolute bottom-0 left-0 w-full h-[70%]" viewBox="0 0 100 30" preserveAspectRatio="none">
               <path d="M0 20 Q 5 15 10 18 T 20 10 T 30 15 T 40 5 T 50 12 T 60 10 T 70 25 T 80 15 T 90 20 T 100 5 L100 30 L0 30 Z" fill="url(#chart-fill)" />
               <path d="M0 20 Q 5 15 10 18 T 20 10 T 30 15 T 40 5 T 50 12 T 60 10 T 70 25 T 80 15 T 90 20 T 100 5" fill="none" stroke="#0ea5e9" strokeWidth="1" className="drop-shadow-sm" />
               <defs>
                 <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                   <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                 </linearGradient>
               </defs>
             </svg>
          </motion.div>
        </div>

        {/* RIGHT FLOATING PANELS */}
        <div className="absolute hidden lg:flex right-16 top-1/2 -translate-y-1/2 z-20 flex-col gap-8 w-96 transform-gpu" style={{ transform: 'perspective(1200px) rotateY(-15deg)' }}>
          
          {/* Search bar clone */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="w-full h-14 bg-card  border border-border rounded-full flex items-center px-6 gap-4 shadow-sm hover:border-border transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center">
               <Globe className="text-foreground w-3 h-3" />
            </div>
            <span className="text-foreground font-medium text-sm flex-1">AI Clone Search</span>
            <Mic className="text-orange-400 w-5 h-5 cursor-pointer hover:text-orange-300 transition-colors" />
          </motion.div>

          {/* Code Block */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="w-full bg-card  border border-border rounded-2xl p-6 font-mono text-sm leading-relaxed shadow-sm relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-primary">async <span className="text-blue-300">programming</span> use {'<'}</div>
            <div className="text-blue-100/70 mt-2 indent-4">use({'{'} build: "A_Program\"V\"-1" {'}'});</div>
            <div className="text-primary mt-2">for <span className="text-blue-300">command</span> apply(req) {'{'}</div>
            <div className="text-green-300/80 mt-2 indent-8">runtime_apply({'{'} arg_node: req {'}'});</div>
            <div className="text-primary mt-2">{'}'}</div>
          </motion.div>

          {/* Icons Grid & Labels */}
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
              className="flex justify-end gap-5"
            >
              {[ImageIcon, Search, Square].map((Icon, i) => (
                <div key={i} className="w-14 h-14 bg-muted  border border-blue-500/30 rounded-[1.25rem] flex items-center justify-center hover:bg-accent transition-all cursor-pointer hover:scale-105 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Icon className="text-primary w-6 h-6 relative z-10" />
                </div>
              ))}
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
               className="flex items-center justify-end gap-8 mt-2"
            >
               <div className="flex items-center gap-3 cursor-pointer group">
                 <div className="w-8 h-8 rounded-full border-[3px] border-border border-t-cyan-400 animate-[spin_3s_linear_infinite] group-hover:border-t-cyan-300" />
                 <span className="text-foreground font-semibold tracking-wide text-sm group-hover:text-foreground transition-colors">AI Studio</span>
               </div>
               <div className="flex items-center gap-2 cursor-pointer group">
                 <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/40 group-hover:text-blue-200 transition-colors">
                    <Layers className="w-5 h-5" />
                 </div>
                 <span className="text-foreground font-semibold tracking-wide text-sm group-hover:text-foreground transition-colors">Vertex Node</span>
               </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator positioned low */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-30"
          onClick={() => {
            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Initialize</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-cyan-400/60 to-transparent" />
        </motion.div>

      </section>

      {/* Grid Features - Kept from original to provide full page experience but restyled slightly darker to match */}
      <section id="features" className="py-32 px-6 relative bg-background">
          <div className="max-w-7xl mx-auto z-10 relative">
             <div className="text-center mb-24 space-y-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-foreground drop-shadow-sm">Technological Core</h2>
                <p className="text-foreground font-medium text-lg max-w-xl mx-auto">Engineered for the most demanding multi-modal workloads.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Search, title: 'Multi-Query Reasoning', desc: 'Deconstruct complex requests into granular sub-tasks for exhaustive coverage.' },
                  { icon: Layers, title: 'Source Reranking', desc: 'Proprietary algorithms prioritize authoritative citations over common results.' },
                  { icon: Database, title: 'Vector Synthesis', desc: 'Embed data across high-dimensional space for relational context mapping.' },
                  { icon: Shield, title: 'Sovereign Security', desc: 'End-to-end encryption with zero-knowledge architecture.' },
                  { icon: Zap, title: 'Live Latency', desc: 'Real-time inference with millisecond response times on global GPU clusters.' },
                  { icon: Globe, title: 'Global Node Access', desc: 'Distributed compute network available for seamless scaling on demand.' }
                ].map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-10 bg-card  border border-border rounded-[2.5rem] hover:border-border transition-all group shadow-sm"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-8 text-primary group-hover:scale-110 group-hover:bg-accent transition-all border border-border">
                       <feature.icon size={28} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter mb-4 uppercase text-foreground">{feature.title}</h3>
                    <p className="text-foreground font-medium leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
             </div>
          </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 flex flex-col items-center bg-gradient-to-b from-[#010308] to-[#020611] relative border-t border-border">
         <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
         
         <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-none text-foreground text-shadow-glow">Ready to Evolve?</h2>
            <p className="text-xl text-muted-foreground font-medium">Join thousands of developers building the future on AI Clone Studio.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <motion.button
                 whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(6,182,212,0.4)" }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => window.location.hash = 'login'}
                 className="h-16 px-12 bg-primary text-[#010308] rounded-2xl font-black uppercase tracking-widest text-sm shadow-sm hover:bg-accent transition-colors"
               >
                 Initialize Workspace
               </motion.button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-background">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
               <Cpu className="text-foreground0 w-6 h-6" />
               <span className="text-lg font-black tracking-tighter uppercase text-foreground">AI Clone Labs</span>
            </div>
            <p className="text-xs text-foreground0/40 font-bold uppercase tracking-widest">&copy; 2026 AI Clone. All Systems Operational.</p>
         </div>
      </footer>
    </div>
  );
}

