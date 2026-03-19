'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Cpu } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Login() {
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const { login } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    const success = await login(password);
    if (!success) {
      setError('Neural authorization failed. Invalid security clearance.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden font-sans text-foreground">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent text-accent-foreground blur-[100px] rounded-full" />
        <div className="absolute w-full h-[1px] top-1/4 bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-card border border-border mb-6 shadow-sm">
            <Cpu className="text-primary w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase drop-shadow-sm">AI Clone</h1>
          <p className="text-xs text-muted-foreground mt-2 font-bold tracking-widest uppercase">System Initialization</p>
        </div>

        {/* Form Box */}
        <div className="bg-card  border border-border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-2">Decryption Key</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access code..."
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-border bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-border transition-all font-mono tracking-widest"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-400 font-mono bg-red-950/30 border border-red-500/30 rounded-xl px-4 py-3 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full h-12 bg-primary hover:bg-accent text-[#010308] text-xs font-black uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-[#010308]/30 border-t-[#010308] rounded-full animate-spin" />
                </div>
              ) : (
                'Authenticate'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] uppercase tracking-widest font-bold text-foreground0/30 mt-10">
          Neural access restricted to Level 5 clearance.
        </p>
      </motion.div>
    </div>
  );
}
