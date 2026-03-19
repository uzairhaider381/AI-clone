'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Clock, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Thread } from '@/types';

export default function HistoryView() {
  const { threads, setActiveThread, setActiveView } = useStore();

  const handleSelect = (threadId: string) => {
    setActiveThread(threadId);
    setActiveView('thread');
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Clock className="text-muted-foreground" size={28} />
            Research History
        </h1>
        <p className="text-muted-foreground">Access and continue your past architectural deep-dives and queries.</p>
      </div>

      <div className="space-y-4">
        {threads.length === 0 ? (
          <div className="h-64 border border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground">
             <MessageSquare size={48} className="opacity-10 mb-4" />
             <p className="font-medium">No search history found.</p>
             <p className="text-sm opacity-60">Begin your first research query to populate history.</p>
          </div>
        ) : (
          threads.map((thread: Thread) => (
            <button
              key={thread.id}
              onClick={() => handleSelect(thread.id)}
              className="w-full text-left p-6 bg-card border hover:border-primary/40 rounded-[28px] transition-all group flex items-center justify-between shadow-sm hover:shadow-md"
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1.5">
                    <Calendar size={12} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{formatDate(thread.createdAt)}</span>
                </div>
                <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors">{thread.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {thread.results[thread.results.length - 1]?.answer.slice(0, 150)}...
                </p>
              </div>
              <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
