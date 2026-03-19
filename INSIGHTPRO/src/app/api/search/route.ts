// ============================================================
// AI Clone — Streaming Search API Route
// POST /api/search
// ============================================================

import { NextRequest } from 'next/server';
import {
  buildSources,
  makeThinkingSteps,
  expandQuery,
} from '@/lib/search-engine';
import { generateAnswer, generateRelatedQuestions } from '@/lib/answer-generator';
import { StreamWriter, chunkText } from '@/lib/streamer';
import { sleep } from '@/lib/utils';
import type { ThinkingStep, Source } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { query, mode = 'deep', files = [] } = await req.json();

  if (!query?.trim()) {
    return new Response(JSON.stringify({ error: 'Query is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const writer = new StreamWriter(controller);

      try {
        // ── STEP 1: Understand query ──────────────────────────
        const steps = makeThinkingSteps(query, mode);

        const updateStep = (
          index: number,
          updates: Partial<ThinkingStep>
        ) => {
          const step = { ...steps[index], ...updates, timestamp: Date.now() };
          steps[index] = step;
          writer.sendThinking(step);
        };

        updateStep(0, { status: 'active' });
        await sleep(400);
        updateStep(0, { status: 'done' });

        // ── STEP 2: Expand queries ────────────────────────────
        updateStep(1, { status: 'active' });
        const subQueries = expandQuery(query);
        await sleep(300);
        updateStep(1, {
          status: 'done',
          detail: subQueries.map((q) => `✓ ${q}`).join('\n'),
        });

        // ── STEP 3: Parallel web search ───────────────────────
        updateStep(2, { status: 'active', detail: 'Searching 3 threads…' });
        const sources = await buildSources(query);

        // Stream individual sources as they arrive
        const validSources = sources.filter((s: Source) => s.isValid && !s.isPaywall);
        for (const src of validSources.slice(0, 6)) {
          writer.sendSource(src);
          await sleep(60);
        }

        updateStep(2, {
          status: 'done',
          detail: `Found ${sources.length} sources across ${subQueries.length} searches`,
        });

        // ── STEP 4: Rerank & validate ─────────────────────────
        updateStep(3, { status: 'active', detail: 'Scoring relevance…' });
        await sleep(500);
        updateStep(3, {
          status: 'done',
          detail: `${validSources.length} valid sources • ${sources.length - validSources.length} filtered`,
        });

        // ── STEP 5: Generate answer (NVIDIA RAG SYNTHESIS) ────────
        updateStep(4, { status: 'active' });

        const related = generateRelatedQuestions(query);

        // Build context from web sources
        const webContext = validSources.map((s, i) => `[Source ${i+1}] Title: ${s.title}\nDomain: ${s.domain}\nContent: ${s.snippet}`).join('\n\n');
        
        // Separate images from text files
        const imageFiles = files.filter((f: any) => f.type?.startsWith('image/'));
        const textFiles = files.filter((f: any) => !f.type?.startsWith('image/'));

        // Build context from uploaded TEXT files
        const fileContext = textFiles.map((f: { name: string, content: string }) => 
          `[LOCAL FILE: ${f.name}]\nContent: ${f.content}`
        ).join('\n\n---\n\n');

        // Primary: NVIDIA oss-20b | Fallback: Groq Llama 3.3
        const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '$NVIDIA_API_KEY';
        const apiKey = process.env.GROQ_API_KEY;

        const systemPrompt = `You are AI Clone, an enterprise-grade AI research assistant. 
Synthesize a comprehensive, professional answer based on both web sources and user-provided local files.
Prioritize information from local files if they are directly relevant.

LOCAL FILES:
${fileContext || 'No local files provided.'}

WEB RESOURCES:
${webContext}`;

        const hasImages = imageFiles.length > 0;
        let userMessageContent: any = query;
        if (hasImages) {
          userMessageContent = [{ type: 'text', text: query }];
          imageFiles.forEach((img: any) => {
             userMessageContent.push({ type: 'image_url', image_url: { url: img.content }});
          });
        }

        let response;
        try {
          if (hasImages) {
            throw new Error("Images attached, skipping NVIDIA and routing to Groq Vision.");
          }
          if (!NVIDIA_API_KEY || NVIDIA_API_KEY.startsWith('$')) {
            throw new Error("NVIDIA API Key not configured, skipping to Groq fallback.");
          }

          response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${NVIDIA_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'openai/gpt-oss-20b',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessageContent },
              ],
              temperature: 1.0,
              max_tokens: 16384,
              stream: true,
            }),
          });

          if (!response.ok) throw new Error(`NVIDIA Error: ${response.status}`);
        } catch (e) {
          console.warn("Falling back to Groq:", e);
          response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: hasImages ? 'llama-3.2-11b-vision-preview' : 'llama-3.3-70b-versatile',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessageContent },
              ],
              stream: true,
            }),
          });
        }

        if (!response.ok) {
          throw new Error(`Synthesis API error: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed && trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
                const rawJson = trimmed.slice(6);
                try {
                  const json = JSON.parse(rawJson);
                  const delta = json.choices?.[0]?.delta;
                  
                  if (delta) {
                    // Handle REASONING (Thinking)
                    if (delta.reasoning_content) {
                      writer.sendReasoning(delta.reasoning_content);
                    }
                    
                    // Handle CONTENT
                    if (delta.content) {
                      writer.sendText(delta.content);
                    }
                  }
                } catch (e) {
                  console.error("Error parsing stream chunk:", e, "Raw data:", rawJson);
                }
              }
            }
          }
        }

        updateStep(4, { status: 'done' });

        // ── FINAL: Done signal ───────────────────────────────
        writer.send({
          type: 'done',
          data: {
            related,
            totalSources: sources.length,
            validSources: validSources.length,
          },
        });
      } catch (error) {
        writer.sendError(
          error instanceof Error ? error.message : 'Search failed'
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive',
    },
  });
}
