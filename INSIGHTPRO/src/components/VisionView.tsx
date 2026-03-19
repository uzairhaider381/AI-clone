'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Upload, Search, Trash2, Cpu, FileText, Sparkles, Wand2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface AnalysisResult {
  description: string;
  ocr: string;
  confidence: number;
  labels: string[];
}

export default function VisionView() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<Array<{ preview: string, result: AnalysisResult }>>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error('Analysis failed');
      
      const mockResult = await res.json();
      
      setResult(mockResult);
      setHistory(prev => [{ preview: preview!, result: mockResult }, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Neural analysis failed. Check network stabilization.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border/40">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-foreground text-background">
              <ImageIcon size={20} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Neural Vision</h1>
          </div>
          <p className="text-muted-foreground/60 font-medium max-w-md leading-relaxed">
            Upload images for multi-dimensional scene analysis and OCR extraction using autonomous vision kernels.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Upload Column */}
        <div className="space-y-8">
           <div 
             {...getRootProps()} 
             className={cn(
               "relative aspect-square md:aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden group",
               isDragActive ? "border-primary bg-primary/5" : "border-border/40 hover:border-foreground/20 hover:bg-foreground/[0.02]",
               preview && "border-solid"
             )}
           >
             <input {...getInputProps()} />
             
             {preview ? (
               <>
                 <img src={preview} alt="Upload" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-4 rounded-full bg-background/20  border border-white/20 text-foreground">
                       <Upload size={32} />
                    </div>
                 </div>
               </>
             ) : (
               <div className="flex flex-col items-center text-center p-12">
                 <div className="w-20 h-20 rounded-3xl bg-foreground/5 flex items-center justify-center mb-6 text-muted-foreground/40 group-hover:scale-110 group-hover:text-primary transition-all">
                    <Upload size={40} />
                 </div>
                 <h3 className="text-xl font-black tracking-tighter uppercase mb-2">Initialize Upload</h3>
                 <p className="text-sm text-muted-foreground font-medium">Drag & drop image or click to browse</p>
                 <p className="text-[10px] text-muted-foreground/40 mt-6 font-bold uppercase tracking-widest">Supports PNG, JPG, WebP</p>
               </div>
             )}
           </div>

           <button 
             disabled={!file || isAnalyzing}
             onClick={handleAnalyze}
             className="w-full h-16 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:pointer-events-none shadow-2xl shadow-foreground/10"
           >
             {isAnalyzing ? (
               <>
                 <Cpu size={20} className="animate-spin" />
                 <span>Analyzing Node...</span>
               </>
             ) : (
               <>
                 <Search size={20} />
                 <span>Analyze Image</span>
               </>
             )}
           </button>
        </div>

        {/* Results Column */}
        <div className="space-y-8">
           <AnimatePresence mode="wait">
             {result ? (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-8"
               >
                 <div className="p-8 bg-card/40  border border-border/40 rounded-3xl space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                       <Sparkles size={18} />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Deep Analysis Breakdown</span>
                    </div>
                    
                    <div className="bg-foreground/[0.02] p-6 rounded-xl border border-border/20">
                      <p className="text-xl font-bold tracking-tight leading-relaxed">{result.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-4">Identified Properties & Objects</h4>
                      <div className="flex flex-wrap gap-2">
                         {result.labels.map(l => (
                           <span key={l} className="px-4 py-2 rounded-2xl bg-foreground/5 text-xs font-bold uppercase tracking-widest border border-border/20 text-foreground/80 hover:bg-foreground/10 transition-colors">
                              {l}
                           </span>
                         ))}
                      </div>
                    </div>
                 </div>

                 <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <FileText size={80} />
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3 text-blue-500">
                          <Wand2 size={18} />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Extracted OCR Text</span>
                       </div>
                       <div className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                         Confidence: {(result.confidence * 100).toFixed(1)}%
                       </div>
                    </div>
                    {result.ocr && result.ocr.trim() !== "" ? (
                      <pre className="text-[13px] font-mono leading-relaxed text-foreground/80 bg-background/60 p-6 rounded-xl border border-blue-500/20 overflow-x-auto shadow-inner">
                         {result.ocr}
                      </pre>
                    ) : (
                      <div className="text-sm font-bold text-muted-foreground/60 italic pb-2">
                        No readable text detected in this image.
                      </div>
                    )}
                 </div>
               </motion.div>
             ) : (
               <div className="h-full min-h-[400px] border-2 border-dashed border-border/20 rounded-3xl flex flex-col items-center justify-center text-center p-12">
                  <Cpu size={48} className="text-muted-foreground/10 mb-6" />
                  <h3 className="text-lg font-black tracking-tighter text-muted-foreground/20 uppercase">Awaiting Neural Input</h3>
                  <p className="text-sm text-muted-foreground/20 font-medium">Results will manifest here after processing.</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="pt-12 border-t border-border/20">
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-8">Analysis History</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {history.map((item, idx) => (
                <motion.div 
                   key={idx}
                   whileHover={{ y: -4 }}
                   className="aspect-square rounded-3xl overflow-hidden border border-border/40 bg-card cursor-pointer relative group"
                   onClick={() => {
                     setPreview(item.preview);
                     setResult(item.result);
                   }}
                >
                   <img src={item.preview} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Search size={20} className="text-foreground" />
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
