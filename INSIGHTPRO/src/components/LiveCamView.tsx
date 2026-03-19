'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Play, Pause, Download, Activity, Grid, Eye, EyeOff, Mic, MicOff, Shield } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function LiveCamView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [fps, setFps] = useState(0);
  const [objects, setObjects] = useState<cocoSsd.DetectedObject[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [filter, setFilter] = useState<'none' | 'mono' | 'thermal' | 'cyber'>('none');
  const [showGrid, setShowGrid] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [lastAnnounced, setLastAnnounced] = useState('');
  const [snapshots, setSnapshots] = useState<string[]>([]);

  const [modelError, setModelError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const initModel = async () => {
      try {
        setIsModelLoading(true);
        setModelError(null);
        
        await tf.ready();
        
        // TF backend setup sometimes fails in specific browser environments
        try {
          await tf.setBackend('webgl');
        } catch (e) {
          console.warn('WebGL backend failed, falling back to CPU', e);
          await tf.setBackend('cpu');
        }
        
        const m = await cocoSsd.load();
        if (mounted) {
          setModel(m);
          setIsModelLoading(false);
        }
      } catch (err: any) {
        console.error('Error loading model:', err);
        if (mounted) {
          setModelError(err.message || 'Failed to load detection model');
          setIsModelLoading(false);
        }
      }
    };
    initModel();
    return () => { mounted = false; };
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported. This requires a secure HTTPS connection or a compatible browser.');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Ensure video is playing before hiding the permission screen
        await videoRef.current.play().catch(e => console.error("Video play error:", e));
        
        setHasPermission(true);
        setIsActive(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setHasPermission(false);
      
      let errorMsg = 'Could not access the camera. ';
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
         errorMsg += 'Permission was denied by your browser. Please click the site settings (lock icon) in the URL bar and allow the camera.';
      } else if (err.name === 'NotFoundError') {
         errorMsg += 'No camera device was found on your system.';
      } else if (err.name === 'NotReadableError') {
         errorMsg += 'The camera is already in use by another application. Close it and try again.';
      } else {
         errorMsg += err.message || err.name;
      }
      
      setModelError(errorMsg);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const c = document.createElement('canvas');
    c.width = videoRef.current.videoWidth;
    c.height = videoRef.current.videoHeight;
    c.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    setSnapshots(prev => [c.toDataURL(), ...prev].slice(0, 6));
  };

  useEffect(() => {
    let id: number;
    let last = 0;
    const detect = async () => {
      if (videoRef.current && canvasRef.current && model && isActive) {
        const results = await model.detect(videoRef.current);
        setObjects(results);
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          results.forEach(obj => {
            const [x, y, w, h] = obj.bbox;
            ctx.strokeStyle = '#06b6d4'; // Cyan-500
            ctx.lineWidth = 2;
            
            // Add glow to box
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 10;
            ctx.strokeRect(x, y, w, h);
            ctx.shadowBlur = 0; // Reset
            
            ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
            ctx.fillRect(x, y, w, h);

            const textWidth = ctx.measureText(`${obj.class} ${Math.round(obj.score * 100)}%`).width;
            ctx.fillStyle = '#06b6d4';
            ctx.fillRect(x, y - 20, textWidth + 10, 20);
            
            ctx.fillStyle = '#010308';
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.fillText(`${obj.class.toUpperCase()} ${Math.round(obj.score * 100)}%`, x + 5, y - 6);
            
            if (voiceEnabled && obj.score > 0.8 && obj.class !== lastAnnounced) {
              const u = new SpeechSynthesisUtterance(`${obj.class} detected`);
              window.speechSynthesis.speak(u);
              setLastAnnounced(obj.class);
            }
          });
          if (showGrid) {
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
            ctx.lineWidth = 1;
            for (let i = 0; i < ctx.canvas.width; i += 64) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, ctx.canvas.height); ctx.stroke(); }
            for (let j = 0; j < ctx.canvas.height; j += 64) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(ctx.canvas.width, j); ctx.stroke(); }
          }
        }
        const now = performance.now();
        if (last) setFps(Math.round(1000 / (now - last)));
        last = now;
      }
      id = requestAnimationFrame(detect);
    };
    if (isActive) detect();
    return () => cancelAnimationFrame(id);
  }, [model, isActive, voiceEnabled, showGrid, lastAnnounced]);

  const FILTERS = [
    { id: 'none', label: 'Default' },
    { id: 'mono', label: 'Mono' },
    { id: 'thermal', label: 'Thermal' },
    { id: 'cyber', label: 'Cyber' },
  ] as const;

  return (
    <div className="flex-1 overflow-y-auto bg-background text-foreground relative">
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-accent text-accent-foreground rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-widest text-foreground uppercase drop-shadow-sm">Vision Matrix</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground0 mt-2">Real-time neural object detection synthesis</p>
          </div>
          {isActive && (
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary bg-accent px-4 py-2 rounded-lg border border-border shadow-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-[pulse_1s_infinite] shadow-sm" />
              <span>Live Sensor</span>
              <span className="text-foreground">{fps} Hz</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-background border border-border shadow-sm group">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-border rounded-tl-3xl z-20 transition-all duration-300 group-hover:border-border group-hover:w-12 group-hover:h-12" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-border rounded-tr-3xl z-20 transition-all duration-300 group-hover:border-border group-hover:w-12 group-hover:h-12" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-border rounded-bl-3xl z-20 transition-all duration-300 group-hover:border-border group-hover:w-12 group-hover:h-12" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-border rounded-br-3xl z-20 transition-all duration-300 group-hover:border-border group-hover:w-12 group-hover:h-12" />

              {!hasPermission && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center p-8 bg-card  z-30">
                  <div className="w-20 h-20 rounded-2xl bg-accent border border-border flex items-center justify-center shadow-sm">
                    <Camera size={32} className="text-primary animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground drop-shadow-md">Optical Core Offline</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Sensor authorization required</p>
                  </div>
                  {modelError ? (
                    <div className="text-center space-y-4 max-w-md">
                      <div className="text-red-400 font-bold text-[11px] leading-relaxed uppercase tracking-wider px-6 py-4 bg-red-950/40 rounded-xl border border-red-500/30 shadow-sm">{modelError}</div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Ensure secure connection (HTTPS) & valid permissions.</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="h-10 px-6 bg-accent border border-border text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent hover:text-primary hover:shadow-sm transition-all block mx-auto mt-4"
                      >
                        Reinitialize
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startCamera}
                      disabled={isModelLoading}
                      className="h-12 px-8 bg-primary text-[#010308] text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-accent hover:shadow-sm disabled:opacity-50 transition-all border border-border"
                    >
                      {isModelLoading ? 'Booting Neural Net...' : 'Initialize Optics'}
                    </button>
                  )}
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay muted playsInline
                className={cn(
                  "w-full h-full object-cover relative z-10 transition-all duration-1000",
                  filter === 'mono' && "grayscale contrast-125 brightness-90",
                  filter === 'thermal' && "invert hue-rotate-[200deg] brightness-150 saturate-[3]",
                  filter === 'cyber' && "sepia hue-rotate-[200deg] saturate-[3] contrast-150 brightness-75"
                )}
              />
              <canvas ref={canvasRef} width={640} height={480} className="absolute inset-0 w-full h-full pointer-events-none z-20" />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap p-4 bg-card  rounded-2xl border border-border shadow-lg">
              <button
                onClick={() => setIsActive(!isActive)}
                disabled={!hasPermission}
                className="h-10 px-5 bg-primary text-[#010308] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent hover:shadow-sm disabled:opacity-50 disabled:shadow-none flex items-center gap-2 transition-all border border-border"
              >
                {isActive ? <><Pause size={14} className="fill-current" /> Suspend</> : <><Play size={14} className="fill-current" /> Read</>}
              </button>
              <button
                onClick={takeSnapshot}
                disabled={!hasPermission}
                className="h-10 px-5 bg-accent border border-border text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent hover:border-border hover:shadow-sm hover:text-primary disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                <Camera size={14} /> Capture
              </button>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={cn(
                  "h-10 px-5 border text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all",
                  voiceEnabled ? "bg-primary border-border text-primary shadow-sm" : "bg-accent border-border text-muted-foreground hover:bg-accent hover:text-primary"
                )}
              >
                {voiceEnabled ? <Mic size={14} /> : <MicOff size={14} />}
                Audio {voiceEnabled ? 'On' : 'Off'}
              </button>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={cn(
                  "h-10 px-5 border text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all",
                  showGrid ? "bg-primary border-border text-primary shadow-sm" : "bg-accent border-border text-muted-foreground hover:bg-accent hover:text-primary"
                )}
              >
                <Grid size={14} /> Matrix
              </button>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mr-2">Lens:</span>
                {FILTERS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id as any)}
                    className={cn(
                      "h-8 px-3 rounded-lg text-[9px] uppercase tracking-widest font-black transition-all border",
                      filter === f.id ? "bg-accent text-accent-foreground border-border text-[#010308] shadow-sm" : "border-border bg-background text-muted-foreground hover:text-primary hover:border-border hover:bg-accent"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Snapshots */}
            {snapshots.length > 0 && (
              <div className="p-4 bg-card rounded-2xl border border-border">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 ml-1 flex items-center gap-2">
                  <Camera size={12} /> Captured Data
                </p>
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {snapshots.map((src, i) => (
                    <div key={i} className="relative shrink-0 w-36 aspect-video rounded-xl overflow-hidden border border-border group shadow-sm">
                      <img src={src} alt="Snapshot" className="w-full h-full object-cover filter brightness-90 group-hover:brightness-110 transition-all duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#010308]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <a
                        href={src}
                        download={`neural-capture-${i + 1}.png`}
                        className="absolute bottom-2 right-2 w-8 h-8 rounded-lg bg-primary  border border-border flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent hover:shadow-sm"
                      >
                        <Download size={14} className="text-foreground" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Panel */}
          <div className="space-y-6">
            {/* Detection List */}
            <div className="rounded-3xl border border-border bg-card  shadow-sm overflow-hidden flex flex-col h-[350px]">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-cyan-950/30 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-primary border border-border">
                     <Eye size={14} className="text-primary drop-shadow-sm" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-foreground">Entities</span>
                </div>
                <div className="px-2 py-1 bg-accent rounded flex items-center border border-border">
                   <span className="text-[10px] font-bold text-foreground0">{objects.length} Lock</span>
                </div>
              </div>
              <div className="p-3 overflow-y-auto space-y-2 flex-1 custom-scrollbar">
                {objects.length > 0 ? objects.map((obj, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-background border border-border hover:border-border hover:bg-accent transition-all group">
                    <span className="text-[11px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                       {obj.class}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-accent border border-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full shadow-sm relative" style={{ width: `${obj.score * 100}%` }}>
                           <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                        </div>
                      </div>
                      <span className="text-[9px] font-black tracking-wider text-primary w-8 text-right">{Math.round(obj.score * 100)}%</span>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground space-y-3">
                    <div className="w-12 h-12 rounded-full border border-border border-dashed animate-[spin_10s_linear_infinite] flex items-center justify-center opacity-50">
                       <div className="w-8 h-8 rounded-full border border-border border-dotted flex items-center justify-center reverse-spin">
                          <EyeOff size={14} className="text-muted-foreground" />
                       </div>
                    </div>
                    <span>{isActive ? 'Scanning sector...' : 'System dormant'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-3xl border border-border bg-card  p-6 space-y-5 shadow-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                 <Activity size={16} />
                 <p className="text-[11px] font-black uppercase tracking-[0.3em]">Telemetry</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Refresh Rate', value: `${fps} hz` },
                  { label: 'Targets', value: objects.length },
                  { label: 'Engine', value: 'Coco-SSD' },
                  { label: 'Compute', value: 'Edge Node' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                    <span className="text-[11px] font-black tracking-wider text-primary drop-shadow-sm">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Note */}
            <div className="rounded-2xl border border-border bg-background p-5 flex items-start gap-4">
              <Shield size={18} className="text-foreground0 shrink-0 mt-0.5" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed">
                Local inference active. No visual telemetry is transmitted to external servers. High-security protocol enforced.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
