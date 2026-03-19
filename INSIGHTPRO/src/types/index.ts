// ============================================================
// AI Clone — Core Type Definitions
// ============================================================

export type SearchMode = 'deep' | 'quick' | 'rag';

export interface Source {
  url: string;
  title: string;
  domain: string;
  snippet: string;
  favicon: string;
  relevanceScore: number;
  isValid: boolean;
  isPaywall: boolean;
  publishedAt?: string;
}

export interface SubQuery {
  query: string;
  status: 'pending' | 'searching' | 'done';
  results: number;
}

export interface ThinkingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done' | 'error';
  detail?: string;
  timestamp: number;
}

export interface SearchResult {
  id: string;
  query: string;
  subQueries: SubQuery[];
  sources: Source[];
  answer: string;
  reasoning?: string; // New field for NVIDIA-style reasoning content
  images?: string[]; // New field for AI-generated images
  citations: Citation[];
  model: string;
  mode: SearchMode;
  timestamp: number;
  exportable: boolean;
}

export interface Citation {
  index: number;
  url: string;
  title: string;
  domain: string;
}

export interface Thread {
  id: string;
  title: string;
  results: SearchResult[];
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  uploadedAt: number;
}

export interface StreamChunk {
  type: 'thinking' | 'source' | 'text' | 'reasoning' | 'citation' | 'done' | 'error';
  data: unknown;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  isPro?: boolean;
  isDefault?: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type Theme = 'dark' | 'light' | 'system';

export type ViewType = 'home' | 'thread' | 'history' | 'discover' | 'computer' | 'admin' | 'cam' | 'features' | 'jarvis' | 'automation' | 'call';
