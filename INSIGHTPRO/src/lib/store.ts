// AI Clone — Zustand Global Store

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Thread,
  SearchResult,
  UploadedFile,
  Theme,
  AIModel,
  Task,
  ViewType
} from '@/types';
import { nanoid } from '@/lib/utils';

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Most capable multimodal model',
    isDefault: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Fast & cost-efficient',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Exceptional reasoning & code',
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Ultra-fast real-time model',
  },
  {
    id: 'sonar-pro',
    name: 'Sonar Pro',
    provider: 'Perplexity',
    description: 'Grounded in live web data',
    isPro: true,
  },
  {
    id: 'o3-mini',
    name: 'o3-mini',
    provider: 'OpenAI',
    description: 'Advanced multi-step reasoning',
    isPro: true,
  },
];

interface StoreState {
  // Threads
  threads: Thread[];
  activeThreadId: string | null;

  // Search state
  isSearching: boolean;
  searchError: string | null;

  // Files
  uploadedFiles: UploadedFile[];

  // Settings
  theme: Theme;
  selectedModel: string;
  apiKey: string;

  // Sidebar
  sidebarOpen: boolean;

  // New Views
  activeView: ViewType;

  // Tasks (Jarvis Mode)
  tasks: Task[];

  // Auth & Admin
  isAuthenticated: boolean;
  isAdmin: boolean;
  users: Array<{ id: string, name: string, email: string, password: string, role: 'admin' | 'user' }>;
  currentUser: any | null;
  isHydrated: boolean;

  // Actions
  setActiveView: (view: ViewType) => void;
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  fetchUsers: () => Promise<void>;
  addUser: (user: any) => Promise<void>;
  updateUser: (id: string, updates: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  createThread: (firstResult: SearchResult) => string;
  addResultToThread: (threadId: string, result: SearchResult) => void;
  addImageToResult: (threadId: string, resultId: string, imageUrl: string) => void;
  deleteThread: (threadId: string) => void;
  pinThread: (threadId: string) => void;
  setActiveThread: (id: string | null) => void;
  setIsSearching: (v: boolean) => void;
  setSearchError: (e: string | null) => void;
  addFile: (file: UploadedFile) => void;
  removeFile: (fileId: string) => void;
  setTheme: (t: Theme) => void;
  setSelectedModel: (id: string) => void;
  setApiKey: (key: string) => void;
  toggleSidebar: () => void;
  getActiveThread: () => Thread | null;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      threads: [],
      activeThreadId: null,
      isSearching: false,
      searchError: null,
      uploadedFiles: [],
      theme: 'dark',
      selectedModel: 'gpt-4o',
      apiKey: '',
      sidebarOpen: true,
      activeView: 'home',
      tasks: [],
      isAuthenticated: false,
      isAdmin: false,
      users: [],
      currentUser: null,
      isHydrated: false,

      setActiveView: (view) => set({ activeView: view }),

      addTask: (text) => set(s => ({ 
        tasks: [{ id: nanoid(), text, completed: false, createdAt: Date.now() }, ...s.tasks] 
      })),

      toggleTask: (id) => set(s => ({
        tasks: s.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),

      removeTask: (id) => set(s => ({
        tasks: s.tasks.filter(t => t.id !== id)
      })),

      login: async (password) => {
        try {
          const res = await fetch('/api/db');
          const data = await res.json();
          const users = data.users || [];
          set({ users });
          const user = users.find((u: any) => u.password === password);
          if (user) {
            set({ isAuthenticated: true, isAdmin: user.role === 'admin', currentUser: user });
            return true;
          }
          return false;
        } catch (e) {
          console.error('Login fetch failed:', e);
          const { users } = get();
          const user = users.find(u => u.password === password);
          if (user) {
            set({ isAuthenticated: true, isAdmin: user.role === 'admin', currentUser: user });
            return true;
          }
          return false;
        }
      },

      logout: () => set({ isAuthenticated: false, isAdmin: false, currentUser: null, activeView: 'home' }),

      fetchUsers: async () => {
        try {
          const res = await fetch('/api/db');
          const data = await res.json();
          if (data.users) set({ users: data.users });
        } catch (e) { console.error("Sync error", e); }
      },

      addUser: async (user) => {
        const newUser = { ...user, id: nanoid() };
        set(s => ({ users: [...s.users, newUser] }));
        await fetch('/api/db', {
          method: 'POST',
          body: JSON.stringify({ action: 'addUser', payload: newUser })
        });
      },

      updateUser: async (id, updates) => {
        set(s => ({
          users: s.users.map(u => u.id === id ? { ...u, ...updates } : u)
        }));
        await fetch('/api/db', {
          method: 'POST',
          body: JSON.stringify({ action: 'updateUser', payload: { id, updates } })
        });
      },

      deleteUser: async (id) => {
        set(s => ({ users: s.users.filter(u => u.id !== id) }));
        await fetch('/api/db', {
          method: 'POST',
          body: JSON.stringify({ action: 'deleteUser', payload: { id } })
        });
      },

      createThread: (firstResult) => {
        const id = nanoid();
        const thread: Thread = {
          id,
          title: firstResult.query.slice(0, 60) + (firstResult.query.length > 60 ? '…' : ''),
          results: [firstResult],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          pinned: false,
        };
        set((s) => ({
          threads: [thread, ...s.threads],
          activeThreadId: id,
        }));
        return id;
      },

      addResultToThread: (threadId, result) => {
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId ? { ...t, results: [...t.results, result], updatedAt: Date.now() } : t
          ),
        }));
      },

      addImageToResult: (threadId, resultId, imageUrl) => {
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId ? {
              ...t,
              results: t.results.map((r) => r.id === resultId ? { ...r, images: [...(r.images || []), imageUrl] } : r),
              updatedAt: Date.now(),
            } : t
          ),
        }));
      },

      deleteThread: (threadId) => {
        set((s) => ({
          threads: s.threads.filter((t) => t.id !== threadId),
          activeThreadId: s.activeThreadId === threadId ? null : s.activeThreadId,
        }));
      },

      pinThread: (threadId) => {
        set((s) => ({
          threads: s.threads.map((t) => t.id === threadId ? { ...t, pinned: !t.pinned } : t),
        }));
      },

      setActiveThread: (id) => set({ activeThreadId: id }),
      setIsSearching: (v) => set({ isSearching: v }),
      setSearchError: (e) => set({ searchError: e }),
      addFile: (file) => set((s) => ({ uploadedFiles: [...s.uploadedFiles, file] })),
      removeFile: (fileId) => set((s) => ({ uploadedFiles: s.uploadedFiles.filter((f) => f.id !== fileId) })),
      setTheme: (t) => set({ theme: t }),
      setSelectedModel: (id) => set({ selectedModel: id }),
      setApiKey: (key) => set({ apiKey: key }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      getActiveThread: () => {
        const { threads, activeThreadId } = get();
        return threads.find((t) => t.id === activeThreadId) ?? null;
      },
    }),
    {
      name: 'clone-ai-storage-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        threads: state.threads,
        theme: state.theme,
        selectedModel: state.selectedModel,
        apiKey: state.apiKey,
        uploadedFiles: state.uploadedFiles,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        currentUser: state.currentUser,
        activeView: state.activeView,
        activeThreadId: state.activeThreadId,
        tasks: state.tasks,
      }),
      onRehydrateStorage: () => (state) => {
          if (state) {
              state.setIsSearching(false);
          }
          useStore.setState({ isHydrated: true });
      },
    }
  )
);
