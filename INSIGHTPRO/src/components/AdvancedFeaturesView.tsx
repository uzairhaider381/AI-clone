'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, Shield, Cpu, Globe, Activity, Search, LayoutGrid,
  ArrowUpRight, Bot, Database, Server, Smartphone,
  Layers, Lock, Share2, Terminal, Code, Palette,
  Music, Video, Map, Bell, Cloud, Settings,
  Users, Briefcase, DollarSign, PieChart, TrendingUp,
  Fingerprint, Scan, Wifi, Radio, Mic,
  Speaker, Headphones, Mail, Phone, MessageSquare,
  Hash, Image, FileText, HardDrive,
  CheckCircle2, AlertTriangle, HelpCircle,
  Key, Camera, Library, Clock, Trash2, Plus,
  Wand2, RefreshCw, Type, Box, ShoppingBag, BarChart2, Power
} from 'lucide-react';

const Brain = Cpu;
const Sparkles = Zap;
const BarChart = BarChart2;

const FEATURES = [
  { id: '1', name: 'Neural Sentiment API', description: 'Real-time sentiment analysis across global data streams.', category: 'Neural', icon: Brain },
  { id: '2', name: 'NLP Core', description: 'Decentralized language processing architecture.', category: 'Neural', icon: Bot },
  { id: '3', name: 'Cognitive Reasoning', description: 'Multi-step causal inference and logic validation.', category: 'Neural', icon: Cpu },
  { id: '4', name: 'Multimodal Engine', description: 'Synthesis of visual and auditory data types.', category: 'Neural', icon: Zap },
  { id: '5', name: 'Voice Transcription', description: 'Voice-to-text conversion in 140+ languages.', category: 'Neural', icon: Mic },
  { id: '6', name: 'Emotion Mapping', description: 'Detection of psychological markers in text.', category: 'Neural', icon: Activity },
  { id: '7', name: 'Predictive Model', description: 'Anticipate user intent with high accuracy.', category: 'Neural', icon: TrendingUp },
  { id: '8', name: 'Translation Bridge', description: 'Zero-latency cross-lingual communication.', category: 'Neural', icon: Globe },
  { id: '9', name: 'Knowledge Graph', description: 'Semantic linking of research data nodes.', category: 'Neural', icon: Layers },
  { id: '10', name: 'Logic Sorter', description: 'Self-correcting algorithmic reasoning framework.', category: 'Neural', icon: Code },
  { id: '11', name: 'Prompt Engine', description: 'Self-optimizing prompt refinement for complex queries.', category: 'Neural', icon: Sparkles },
  { id: '12', name: 'IQ Boost Module', description: 'Dynamic allocation of extra neural compute resources.', category: 'Neural', icon: Cpu },
  { id: '13', name: 'Vector Database', description: 'High-dimensional search across large data sets.', category: 'Security', icon: Database },
  { id: '14', name: 'Zero-Knowledge Auth', description: 'Privacy-focused biometric verification system.', category: 'Security', icon: Lock },
  { id: '15', name: 'Sovereign Firewall', description: 'Active threat neutralizer with pattern matching.', category: 'Security', icon: Shield },
  { id: '16', name: 'Data Tunnel', description: 'End-to-end encryption for all data packets.', category: 'Security', icon: Wifi },
  { id: '17', name: 'Blockchain Audit', description: 'Immutable logging of all system access events.', category: 'Security', icon: Hash },
  { id: '18', name: 'Phishing Shield', description: 'Real-time warning for malicious external links.', category: 'Security', icon: Shield },
  { id: '19', name: 'Malware Scanner', description: 'Deep-learning based file integrity analysis.', category: 'Security', icon: Scan },
  { id: '20', name: 'Biometric Auth', description: 'Continuous user verification via optical sensor.', category: 'Security', icon: Fingerprint },
  { id: '21', name: 'Key Rotator', description: 'Auto-cycling of 4096-bit encryption keys.', category: 'Security', icon: Key },
  { id: '22', name: 'Ghost Proxy', description: 'Anonymity layer for high-risk research cycles.', category: 'Security', icon: Shield },
  { id: '23', name: 'Intrusion Detector', description: 'Detect unauthorized access via observer system.', category: 'Security', icon: Camera },
  { id: '24', name: 'Vault v3', description: 'Cold-storage for hyper-sensitive data assets.', category: 'Security', icon: Lock },
  { id: '25', name: 'Venture Tracking', description: 'Real-time monitoring of seed funding velocity.', category: 'Market', icon: TrendingUp },
  { id: '26', name: 'Geo-Political Risk', description: 'Analysis of global instability and trade shifts.', category: 'Market', icon: Globe },
  { id: '27', name: 'Sentiment Lab', description: 'Identify market gaps using social listening.', category: 'Market', icon: DollarSign },
  { id: '28', name: 'Crypto Scanner', description: 'Deep-chain analysis for decentralized assets.', category: 'Market', icon: PieChart },
  { id: '29', name: 'Yield Optimizer', description: 'Algorithmic strategy generation for capital growth.', category: 'Market', icon: TrendingUp },
  { id: '30', name: 'Supply Chain', description: 'Tracking millions of logistics nodes for disruptions.', category: 'Market', icon: Map },
  { id: '31', name: 'Trend Pulse', description: 'Real-time mapping of global retail behavior.', category: 'Market', icon: Activity },
  { id: '32', name: 'Unicorn Finder', description: 'Identify high-growth startups based on data signals.', category: 'Market', icon: Search },
  { id: '33', name: 'VC CRM', description: 'Relationship management for elite investors.', category: 'Market', icon: Briefcase },
  { id: '34', name: 'Flash Guard', description: 'Protection against volatile market movements.', category: 'Market', icon: Shield },
  { id: '35', name: 'Whale Log', description: 'Tracking large private wallet transactions.', category: 'Market', icon: Library },
  { id: '36', name: 'Market Cycles', description: 'Historical resonance mapping for economics.', category: 'Market', icon: Clock },
  { id: '37', name: 'Voice Synthesis', description: 'Generate natural audio in 95+ languages.', category: 'Creative', icon: Music },
  { id: '38', name: 'Design Lab', description: 'AI-assisted UI/UX prototyping and layout.', category: 'Creative', icon: Palette },
  { id: '39', name: 'Cinema Studio', description: 'Text-to-video synthesis for storytelling.', category: 'Creative', icon: Video },
  { id: '40', name: 'Sonic Architect', description: 'Creation of unique spatial audio identities.', category: 'Creative', icon: Speaker },
  { id: '41', name: 'Art Generator', description: 'Abstract visual generation from real-time data.', category: 'Creative', icon: Image },
  { id: '42', name: 'Copy Synthesis', description: 'High-conversion copywriting for brands.', category: 'Creative', icon: FileText },
  { id: '43', name: '3D Generator', description: 'Polygon modeling from text descriptions.', category: 'Creative', icon: Box },
  { id: '44', name: 'Moodboard AI', description: 'Contextual image curation for designers.', category: 'Creative', icon: Image },
  { id: '45', name: 'Font Lab', description: 'Dynamic creation of brand typography.', category: 'Creative', icon: Type },
  { id: '46', name: 'Storyboard', description: 'Convert scripts into animated sequences.', category: 'Creative', icon: Video },
  { id: '47', name: 'Neural Filters', description: 'Advanced image processing for cinema.', category: 'Creative', icon: Wand2 },
  { id: '48', name: 'Creative Muse', description: 'Ideation partner for creative blocks.', category: 'Creative', icon: Sparkles },
  { id: '49', name: 'Auto-Refactor', description: 'Automated code technical debt elimination.', category: 'Dev', icon: Code },
  { id: '50', name: 'API Gateway', description: 'High-performance node for AI interactions.', category: 'Dev', icon: Terminal },
  { id: '51', name: 'Code Pilot', description: 'Advanced pair-programming with reasoning.', category: 'Dev', icon: Bot },
  { id: '52', name: 'Test Synthesizer', description: 'Generation of test suites for any stack.', category: 'Dev', icon: CheckCircle2 },
  { id: '53', name: 'Debugger', description: 'Predictive bug identification and patches.', category: 'Dev', icon: Zap },
  { id: '54', name: 'Cloud Deployer', description: 'One-click global scaling for web apps.', category: 'Dev', icon: Cloud },
  { id: '55', name: 'DB Architect', description: 'Optimized schema and migration management.', category: 'Dev', icon: Database },
  { id: '56', name: 'Frontend Orchestrator', description: 'Application modularity management.', category: 'Dev', icon: LayoutGrid },
  { id: '57', name: 'Docker Engine', description: 'Instant containerization and orchestration.', category: 'Dev', icon: Server },
  { id: '58', name: 'Git Velocity', description: 'Visual analysis of team code productivity.', category: 'Dev', icon: TrendingUp },
  { id: '59', name: 'Security Audit Bot', description: 'Vulnerability scanning and dependency check.', category: 'Dev', icon: Shield },
  { id: '60', name: 'Perf Profiler', description: 'Identify bottlenecks in sub-millisecond detail.', category: 'Dev', icon: Activity },
  { id: '61', name: 'Compute Cluster', description: 'Elastic GPU scaling for heavy workloads.', category: 'Infra', icon: Cpu },
  { id: '62', name: 'CDN Edge', description: 'Ultra-low latency content delivery.', category: 'Infra', icon: Wifi },
  { id: '63', name: 'Data Lake', description: 'Petabyte-scale storage for research.', category: 'Infra', icon: HardDrive },
  { id: '64', name: 'Latency Map', description: 'Visual mapping of global network speeds.', category: 'Infra', icon: Map },
  { id: '65', name: 'Serverless Forge', description: 'Instant execution nodes for compute tasks.', category: 'Infra', icon: Server },
  { id: '66', name: 'Load Balancer', description: 'Predictive traffic redirection and shaping.', category: 'Infra', icon: Activity },
  { id: '67', name: 'DDoS Deflector', description: 'Neural traffic filter for attack blocking.', category: 'Infra', icon: Shield },
  { id: '68', name: 'Multi-Cloud Sync', description: 'Real-time parity across AWS, GCP, Azure.', category: 'Infra', icon: Cloud },
  { id: '69', name: 'Backup Node', description: 'Point-in-time recovery for all systems.', category: 'Infra', icon: Clock },
  { id: '70', name: 'Status Monitor', description: 'Public uptime and health reporting.', category: 'Infra', icon: Bell },
  { id: '71', name: 'Rate Limiter', description: 'Customized flow control for API consumers.', category: 'Infra', icon: Hash },
  { id: '72', name: 'Docker Swarm', description: 'Enterprise container management.', category: 'Infra', icon: Box },
  { id: '73', name: 'Chat Bridge', description: 'Integrated communications with core bots.', category: 'Comms', icon: MessageSquare },
  { id: '74', name: 'Mail Syncer', description: 'Aggregated intelligence from business mail.', category: 'Comms', icon: Mail },
  { id: '75', name: 'VoIP Node', description: 'Encrypted voice over IP with zero logging.', category: 'Comms', icon: Phone },
  { id: '76', name: 'Broadcast Engine', description: 'Mass communication for announcements.', category: 'Comms', icon: Radio },
  { id: '77', name: 'SMS Gateway', description: 'Direct-to-carrier messaging for alerts.', category: 'Comms', icon: Smartphone },
  { id: '78', name: 'Live Translation', description: 'Real-time conversation overlay for meetings.', category: 'Comms', icon: Globe },
  { id: '79', name: 'Meeting Scribe', description: 'Instant meeting summaries and logs.', category: 'Comms', icon: FileText },
  { id: '80', name: 'Presence Map', description: 'Visual tracking of team availability.', category: 'Comms', icon: Users },
  { id: '81', name: 'Project Pulse', description: 'Automated status updates from task APIs.', category: 'Comms', icon: Activity },
  { id: '82', name: 'Client Portal', description: 'Secure collaboration for external vendors.', category: 'Comms', icon: Lock },
  { id: '83', name: 'Thread Weaver', description: 'Aggregating discussions into reports.', category: 'Comms', icon: Layers },
  { id: '84', name: 'Voice Manager', description: 'Control for sovereign voice applications.', category: 'Comms', icon: Mic },
  { id: '85', name: 'Data Scraper', description: 'Mass web data extraction with rotation.', category: 'Data', icon: Search },
  { id: '86', name: 'Semantic Parser', description: 'Converting messy data to structured JSON.', category: 'Data', icon: Code },
  { id: '87', name: 'Image Processor', description: 'High-speed conversion and enhancement.', category: 'Data', icon: Image },
  { id: '88', name: 'Audio Miner', description: 'Extracting insights from audio files.', category: 'Data', icon: Headphones },
  { id: '89', name: 'PDF Sorter', description: 'Deep indexing of documents and papers.', category: 'Data', icon: FileText },
  { id: '90', name: 'DB Cleaner', description: 'Deduplication and normalization of datasets.', category: 'Data', icon: Trash2 },
  { id: '91', name: 'Anomaly Finder', description: 'Identify statistical outliers in streams.', category: 'Data', icon: AlertTriangle },
  { id: '92', name: 'Data Visualizer', description: 'Instant creation of charts and infographics.', category: 'Data', icon: PieChart },
  { id: '93', name: 'Compression', description: 'Advanced lossy/lossless data reduction.', category: 'Data', icon: ArrowUpRight },
  { id: '94', name: 'Privacy Masker', description: 'Automated PII identification and masking.', category: 'Data', icon: Shield },
  { id: '95', name: 'Inventory Sync', description: 'E-commerce logistics across storefronts.', category: 'Data', icon: ShoppingBag },
  { id: '96', name: 'API Connector', description: 'One-click integration for 2,000+ SaaS apps.', category: 'Data', icon: Share2 },
  { id: '97', name: 'System Monitor', description: 'Health monitoring for all platform nodes.', category: 'System', icon: Activity },
  { id: '98', name: 'Resource Governor', description: 'Dynamic CPU/GPU cap for cost control.', category: 'System', icon: Cpu },
  { id: '99', name: 'Theme Lab', description: 'Platform visual customization and branding.', category: 'System', icon: Palette },
  { id: '100', name: 'Update Manager', description: 'Zero-downtime hot-patching of code.', category: 'System', icon: RefreshCw },
  { id: '101', name: 'Role Manager', description: 'Advanced RBAC and credential management.', category: 'System', icon: Users },
  { id: '102', name: 'Settings Sync', description: 'Cross-device parity of user preferences.', category: 'System', icon: Settings },
  { id: '103', name: 'Help Desk Bot', description: 'Sovereign technical support agent.', category: 'System', icon: HelpCircle },
  { id: '104', name: 'Audit Logs', description: 'Deep search into system events and alerts.', category: 'System', icon: FileText },
  { id: '105', name: 'Extension Forge', description: 'Development kit for custom feature nodes.', category: 'System', icon: Plus },
  { id: '106', name: 'Telemetry', description: 'Live reporting of all user interactions.', category: 'System', icon: BarChart },
  { id: '107', name: 'Automation', description: 'Macro-engine for repetitive research tasks.', category: 'System', icon: Terminal },
  { id: '108', name: 'Shutdown Script', description: 'Safe termination of all processes.', category: 'System', icon: Power },
] as const;

const ALL_CATEGORIES = ['All', 'Neural', 'Security', 'Market', 'Creative', 'Dev', 'Infra', 'Comms', 'Data', 'System'];

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdvancedFeaturesView() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = FEATURES.filter(f =>
    (activeCategory === 'All' || f.category === activeCategory) &&
    (f.name.toLowerCase().includes(search.toLowerCase()) ||
     f.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 overflow-y-auto bg-background text-foreground relative">
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-accent text-accent-foreground rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-foreground drop-shadow-sm">Sub-System Modules</h1>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mt-2">{FEATURES.length} nodes integrated</p>
          </div>
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <input
              type="text"
              placeholder="Query subsystems..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="relative w-full sm:w-80 h-11 pl-11 pr-4 text-[13px] font-bold tracking-wider rounded-xl border border-border bg-card  text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border shadow-sm transition-all uppercase"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap pb-4 border-b border-border">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] uppercase font-black tracking-[0.2em] transition-all",
                activeCategory === cat
                  ? "bg-primary text-[#010308] shadow-sm border border-border"
                  : "bg-accent border border-border text-muted-foreground hover:text-primary hover:border-border hover:bg-accent"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(f => (
            <motion.div
              key={f.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="group p-5 rounded-2xl border border-border bg-card  hover:bg-accent hover:border-border shadow-sm hover:shadow-sm transition-all cursor-crosshair relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-accent border border-border flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:border-border transition-all shadow-inner">
                  <f.icon size={18} className="text-muted-foreground group-hover:text-primary group-hover:drop-shadow-sm transition-all" />
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </div>
              <div className="mt-4 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent text-accent-foreground animate-pulse group-hover:bg-accent group-hover:shadow-sm" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">{f.category}</p>
                </div>
                <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground leading-snug drop-shadow-sm group-hover:text-foreground transition-colors">{f.name}</h3>
                <p className="text-[11px] font-medium text-muted-foreground mt-2 leading-relaxed line-clamp-2 group-hover:text-foreground transition-colors">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
             <div className="inline-flex w-16 h-16 rounded-full bg-accent border border-border items-center justify-center mb-4">
                <Search size={24} className="text-muted-foreground" />
             </div>
             <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">No matching sub-systems detected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
