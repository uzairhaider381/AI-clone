'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Users, UserPlus, Shield, Key, Trash2, Edit2, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPanel() {
  const { users, addUser, updateUser, deleteUser } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });

  const handleSave = async () => {
    if (editingId) {
      await updateUser(editingId, formData);
      setEditingId(null);
    } else {
      await addUser(formData);
    }
    setFormData({ name: '', email: '', password: '', role: 'user' });
    setShowAdd(false);
  };

  const startEdit = (user: any) => {
    setFormData({ ...user });
    setEditingId(user.id);
    setShowAdd(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to revoke this identity? This action is permanent.")) {
      await deleteUser(id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center relative scroll-smooth bg-background/50 ">
      {/* Background elements for continuity */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[5%] left-[5%] w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] right-[5%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl px-8 py-12 lg:py-20 space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border/40">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-foreground text-background">
                <Shield size={20} />
              </div>
              <h1 className="text-4xl font-bold tracking-tighter text-foreground">Control Center</h1>
            </div>
            <p className="text-muted-foreground/60 font-medium max-w-md leading-relaxed">
              Sovereign entity management and neural access authorization. Oversee all research identities within the node.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setShowAdd(true); setEditingId(null); }}
            className="h-14 px-8 bg-foreground text-background rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all font-bold shadow-2xl shadow-foreground/10"
          >
            <UserPlus size={20} />
            <span>Initialize Identity</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {users.map((user, idx) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative overflow-hidden p-6 bg-card/40  border border-border/40 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:bg-card hover:border-foreground/20 hover:shadow-2xl hover:shadow-foreground/[0.02]"
            >
              <div className="flex items-center gap-6 flex-1 w-full">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg",
                  user.role === 'admin' 
                    ? "bg-red-500 text-foreground shadow-red-500/20 group-hover:shadow-red-500/40" 
                    : "bg-blue-500 text-foreground shadow-blue-500/20 group-hover:shadow-blue-500/40"
                )}>
                  {user.role === 'admin' ? <Shield size={32} /> : <User size={32} />}
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-bold flex items-center gap-3">
                    {user.name}
                    {user.role === 'admin' && (
                      <span className="text-[9px] font-black tracking-widest bg-red-500/10 text-red-500 px-2.5 py-1 rounded-full border border-red-500/20 uppercase">
                        Protocol Root
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground/60 font-medium text-sm">
                    <Mail size={14} className="opacity-40" />
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-border/20">
                  <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-1.5">Authorization</p>
                      <p className={cn(
                        "text-sm font-bold capitalize flex items-center gap-2 md:justify-end",
                        user.role === 'admin' ? "text-red-500" : "text-blue-500"
                      )}>
                        {user.role === 'admin' && <Lock size={12} />}
                        {user.role}
                      </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                      <button 
                        onClick={() => startEdit(user)}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-foreground/5 text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                        title="Edit Identity"
                      >
                          <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-500/5 text-red-500/60 hover:bg-red-500 hover:text-foreground transition-all duration-300"
                        title="Revoke Identity"
                      >
                          <Trash2 size={20} />
                      </button>
                  </div>
              </div>
            </motion.div>
          ))}
        </div>

        {showAdd && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-background/60 "
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-xl bg-card border border-border/40 rounded-3xl p-10 sm:p-12 shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <UserPlus size={120} />
              </div>

              <div className="flex items-center gap-5 mb-10 relative z-10">
                  <div className="p-4 bg-foreground rounded-2xl text-background shadow-xl shadow-foreground/10">
                    <UserPlus size={32}/>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">{editingId ? 'Modify Schema' : 'New Identity'}</h2>
                    <p className="text-muted-foreground/60 font-medium text-sm uppercase tracking-widest">Neural Access Protocol</p>
                  </div>
              </div>

              <div className="space-y-8 relative z-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Common Designation</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Researcher Alpha"
                      className="w-full h-14 px-6 bg-foreground/[0.03] border border-border/40 rounded-2xl outline-none focus:border-foreground/20 focus:ring-8 focus:ring-foreground/[0.01] transition-all font-bold placeholder:text-muted-foreground/20 placeholder:font-medium"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Node Identifier (Email)</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="researcher@node.ai"
                      className="w-full h-14 px-6 bg-foreground/[0.03] border border-border/40 rounded-2xl outline-none focus:border-foreground/20 focus:ring-8 focus:ring-foreground/[0.01] transition-all font-bold placeholder:text-muted-foreground/20 placeholder:font-medium"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Security Token</label>
                    <input 
                      type="text"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full h-14 px-6 bg-foreground/[0.03] border border-border/40 rounded-2xl outline-none focus:border-foreground/20 focus:ring-8 focus:ring-foreground/[0.01] transition-all font-bold tracking-widest placeholder:text-muted-foreground/20"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Authorization Clearance</label>
                    <div className="flex gap-4">
                       <button 
                          onClick={() => setFormData({...formData, role: 'user'})}
                          className={cn(
                              "flex-1 h-14 rounded-2xl border-2 flex items-center justify-center gap-3 font-bold text-sm transition-all duration-300",
                              formData.role === 'user' 
                                ? "border-blue-500 bg-blue-500/10 text-blue-600 shadow-xl shadow-blue-500/10" 
                                : "border-border/40 text-muted-foreground/40 hover:border-foreground/20 hover:text-muted-foreground"
                          )}
                       >
                          <User size={18}/> Researcher
                       </button>
                       <button 
                          onClick={() => setFormData({...formData, role: 'admin'})}
                          className={cn(
                              "flex-1 h-14 rounded-2xl border-2 flex items-center justify-center gap-3 font-bold text-sm transition-all duration-300",
                              formData.role === 'admin' 
                                ? "border-red-500 bg-red-500/10 text-red-600 shadow-xl shadow-red-500/10" 
                                : "border-border/40 text-muted-foreground/40 hover:border-foreground/20 hover:text-muted-foreground"
                          )}
                       >
                          <Shield size={18}/> Root Admin
                       </button>
                    </div>
                 </div>
              </div>

              <div className="mt-12 flex gap-4 relative z-10 transition-all">
                <button 
                  onClick={() => setShowAdd(false)}
                  className="px-8 h-14 rounded-2xl font-bold border border-border/40 text-muted-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-all"
                >
                  Terminate
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 h-14 bg-foreground text-background rounded-2xl font-bold shadow-2xl shadow-foreground/20 hover:opacity-90 transition-all flex items-center justify-center gap-3"
                >
                  <ArrowRight size={20} className="order-last ml-2" />
                  <span>{editingId ? 'Push Manifest' : 'Initialize Identity'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
