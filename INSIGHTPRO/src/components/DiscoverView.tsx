'use client';

import React from 'react';
import { Compass, Sparkles, TrendingUp, Globe, Building2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const STARTUPS = [
    { name: 'NeuralArch', sector: 'AI Infrastructure', funding: '$45M Series A', description: 'Real-time optimization of transformer weights for edge-AI devices.', origin: 'Stockholm, Sweden' },
    { name: 'QuantFlow', sector: 'FinTech / Quantum', funding: '$120M Series C', description: 'Quantum-resistant encryption layers for global banking cross-settlements.', origin: 'Zurich, Switzerland' },
    { name: 'BioForge Robotics', sector: 'HealthTech', funding: 'Exited (Merck)', description: 'Nanorobots programmed for localized mRNA delivery in oncology.', origin: 'Boston, USA' },
    { name: 'EcoStream AI', sector: 'ClimateTech', funding: '$22M Seed', description: 'Autonomous micro-grids managed by predictive meteorology models.', origin: 'Nairobi, Kenya' },
];

export default function DiscoverView() {
  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-3 flex items-center gap-3">
              <Compass className="text-blue-500" size={32} />
              Global Discovery
          </h1>
          <p className="text-muted-foreground text-lg">Curated insights into the world's most innovative startups and disruptive technologies.</p>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/10 px-4 py-2 rounded-full flex items-center gap-2 text-[12px] font-bold text-blue-500 uppercase tracking-widest">
            <TrendingUp size={14}/>
            Trending sectors: Lab-Grown Tissue, Fusion Energy
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STARTUPS.map((startup, i) => (
          <motion.div 
            key={startup.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-card border hover:border-blue-500/40 rounded-2xl transition-all group shadow-sm hover:shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Building2 size={80} />
            </div>
            
            <div className="mb-6 flex justify-between items-start">
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">{startup.sector}</span>
                  <h3 className="text-2xl font-bold">{startup.name}</h3>
               </div>
               <div className="bg-muted px-3 py-1 rounded-full text-[11px] font-bold">{startup.funding}</div>
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed font-medium">
                {startup.description}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-border/40">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe size={14} />
                    <span className="text-xs font-bold">{startup.origin}</span>
                </div>
                <button className="flex items-center gap-2 text-[12px] font-bold hover:text-blue-500 transition-all opacity-40 hover:opacity-100">
                    Visit Portfolio <ExternalLink size={14} />
                </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-foreground flex flex-col items-center text-center shadow-2xl overflow-hidden relative">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/10 blur-[100px] rounded-full" />
          <Sparkles className="mb-4 text-foreground/40" size={48} />
          <h2 className="text-3xl font-bold mb-3">AI Venture Predictor</h2>
          <p className="opacity-80 max-w-xl mb-8 leading-relaxed">Our models analyze patent registrations, GitHub velocity, and seed velocity to predict the next unicorn 18 months before a Series A.</p>
          <button className="h-14 px-8 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-opacity-95 transition-all shadow-lg active:scale-95">
              Unlock Advanced Metrics
          </button>
      </div>
    </div>
  );
}
