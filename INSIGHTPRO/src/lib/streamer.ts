// ============================================================
// AI Clone — Streamer Utility
// Handles partial JSON + text streaming for citations & answer
// ============================================================

import type { StreamChunk, ThinkingStep, Source, Citation } from '@/types';

export type StreamCallback = (chunk: StreamChunk) => void;

// ── ENCODER/DECODER for SSE-style streaming ──────────────────
export function encodeChunk(chunk: StreamChunk): string {
  return `data: ${JSON.stringify(chunk)}\n\n`;
}

export function decodeChunk(raw: string): StreamChunk | null {
  try {
    const line = raw.trim();
    if (!line.startsWith('data: ')) return null;
    return JSON.parse(line.slice(6));
  } catch {
    return null;
  }
}

// ── BROWSER-SIDE READER ──────────────────────────────────────
export async function readStream(
  response: Response,
  onChunk: StreamCallback
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Split on double newline (SSE event boundaries)
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const chunk = decodeChunk(part);
      if (chunk) onChunk(chunk);
    }
  }

  // Process any remaining buffer
  if (buffer.trim()) {
    const chunk = decodeChunk(buffer);
    if (chunk) onChunk(chunk);
  }
}

// ── SERVER-SIDE WRITER ───────────────────────────────────────
export class StreamWriter {
  private encoder = new TextEncoder();

  constructor(private controller: ReadableStreamDefaultController) {}

  send(chunk: StreamChunk): void {
    this.controller.enqueue(this.encoder.encode(encodeChunk(chunk)));
  }

  sendThinking(step: ThinkingStep): void {
    this.send({ type: 'thinking', data: step });
  }

  sendSource(source: Source): void {
    this.send({ type: 'source', data: source });
  }

  sendText(text: string): void {
    this.send({ type: 'text', data: text });
  }

  sendReasoning(reasoning: string): void {
    this.send({ type: 'reasoning', data: reasoning });
  }

  sendCitation(citation: Citation): void {
    this.send({ type: 'citation', data: citation });
  }

  sendDone(): void {
    this.send({ type: 'done', data: null });
  }

  sendError(message: string): void {
    this.send({ type: 'error', data: message });
  }
}

// ── TEXT CHUNKER — simulates token-by-token LLM streaming ────
export async function* chunkText(
  text: string,
  delayMs = 18
): AsyncGenerator<string> {
  // Split into word-sized chunks with random natural variation
  const words = text.split(/(\s+)/);
  let buffer = '';

  for (const word of words) {
    buffer += word;
    if (buffer.length >= 3 + Math.floor(Math.random() * 8)) {
      yield buffer;
      buffer = '';
      // Simulate variable LLM latency
      await new Promise((r) =>
        setTimeout(r, delayMs + Math.random() * 20)
      );
    }
  }
  if (buffer) yield buffer;
}
