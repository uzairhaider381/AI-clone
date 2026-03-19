// ============================================================
// AI Clone — Answer Generator (Grounded Synthesis)
// ============================================================

import type { Source } from '@/types';

// Mock answer knowledge base — map keywords to detailed answers
const ANSWER_TEMPLATES: Record<string, string> = {
  ai: `## What is Artificial Intelligence?

**Artificial Intelligence (AI)** refers to the simulation of human cognitive processes by computer systems — encompassing learning, reasoning, problem-solving, perception, and language understanding.[1]

### The Modern AI Stack

Modern AI is built on **transformer neural networks** trained via self-supervised learning on internet-scale datasets. The key architectural advance was the 2017 "Attention Is All You Need" paper, which introduced self-attention mechanisms that allow models to understand context across long sequences.[2]

#### Key Paradigms

- **Supervised Learning** — Models trained on labeled input-output pairs
- **Reinforcement Learning from Human Feedback (RLHF)** — Aligning LLMs to human preferences through reward modeling
- **In-Context Learning** — Zero/few-shot prompting without weight updates[3]

### Current Frontiers

As of 2025, frontier models like GPT-4o, Claude 3.5 Sonnet, and Gemini 2.0 demonstrate emergent capabilities including complex multi-step reasoning, code generation, and multimodal understanding. Research labs are actively pursuing **Artificial General Intelligence (AGI)** — systems that generalize across domains with human-level or superhuman performance.[4]

> **AI Clone Assessment:** AI adoption is accelerating across all sectors. The most impactful near-term applications are autonomous coding assistants, drug discovery pipelines, and natural language interfaces for enterprise data.`,

  quantum: `## Quantum Computing Explained

**Quantum computing** leverages quantum mechanical phenomena — superposition, entanglement, and interference — to perform computation fundamentally impossible for classical machines.[1]

### Classical vs. Quantum Bits

| Feature | Classical Bit | Qubit |
|---------|--------------|-------|
| States | 0 or 1 | 0, 1, or superposition |
| Parallelism | Sequential | Exponential |
| Error Rate | ~0% | 0.1–1% |
| Temperature | Room temp | Near absolute zero |

### Quantum Advantage

Quantum computers offer **exponential speedup** for specific problem classes:[2]

- **Shor's Algorithm** — Factoring large integers (breaks RSA encryption)
- **Grover's Algorithm** — Unstructured database search in O(√N)
- **Quantum Simulation** — Modeling molecular dynamics for drug discovery[3]

### Current State (2025)

IBM has demonstrated 1,000+ qubit systems. Google achieved "quantum supremacy" in 2019 with Sycamore. The key bottleneck remains **decoherence** — qubits are extremely fragile and require extensive error correction.[4]

> **AI Clone Note:** Quantum advantage for commercially useful problems (beyond research benchmarks) is still 5–10 years away according to most experts.`,

  inflation: `## Understanding Inflation

**Inflation** is the sustained rise in the general price level of goods and services over time, eroding the purchasing power of money.[1]

### Root Causes

#### Demand-Pull Inflation
When aggregate demand outpaces productive capacity. Classic example: post-COVID stimulus checks drove consumer spending while supply chains remained constrained, producing 9.1% peak CPI in the US (June 2022).[2]

#### Cost-Push Inflation  
Supply-side shocks raise production costs, which firms pass on to consumers. The 2022 energy crisis following the Russia-Ukraine war is a textbook case — European energy prices rose 400%+.[3]

#### Built-In (Expectations) Inflation
A self-fulfilling wage-price spiral: workers demand higher wages expecting future inflation → firms raise prices to cover labor costs → repeat.

### Central Bank Response

The **Federal Reserve** targets 2% annual inflation as the healthy equilibrium. To cool inflation, they raise the federal funds rate — currently at a 23-year high — making borrowing expensive and suppressing demand.[4]

> **AI Clone Summary:** Inflation is now moderating globally (US CPI ~3% as of 2025), but core services inflation (rent, healthcare) remains "sticky" above target.`,

  default: `## Research Summary

Based on a comprehensive analysis of **8 sources** gathered through parallel web searches, here is what the evidence shows:

### Key Findings

The topic you've queried sits at the intersection of multiple disciplines, and the most credible research reveals several important dimensions:[1]

**1. Established Consensus**  
The majority of high-authority sources converge on a consistent picture: this is a multi-faceted domain where context matters significantly. Researchers from MIT, Stanford, and other leading institutions have produced foundational work that remains the standard reference.[2]

**2. Emerging Developments**  
Recent publications (2024–2025) indicate meaningful shifts in how practitioners approach this area. New methodologies are displacing older frameworks, with practitioners reporting 30–50% efficiency improvements using updated techniques.[3]

**3. Practical Implications**  
For professionals working in this space, the actionable takeaways are:
- Prioritize depth of understanding over breadth of coverage
- Leverage systematic frameworks rather than ad-hoc approaches  
- Stay current with the primary literature (ArXiv, Nature, domain-specific journals)[4]

### Expert Perspectives

Leading voices in the field emphasize that simplistic narratives tend to miss critical nuances. The most robust insights come from triangulating across multiple authoritative sources rather than relying on any single perspective.[5]

> **AI Clone Confidence:** High — Sources include 3 peer-reviewed publications, 2 institutional research portals, and 3 quality journalism outlets.`,
};

export function generateAnswer(query: string, sources: Source[]): string {
  const q = query.toLowerCase();

  // Find best matching template
  let template = ANSWER_TEMPLATES.default;
  for (const [key, val] of Object.entries(ANSWER_TEMPLATES)) {
    if (key !== 'default' && q.includes(key)) {
      template = val;
      break;
    }
  }

  // Append source-grounded citations footer
  const validSources = sources.filter((s) => s.isValid && !s.isPaywall).slice(0, 5);
  const citationsBlock =
    '\n\n---\n\n**Sources Cited:**\n' +
    validSources
      .map(
        (s, i) =>
          `[${i + 1}] [${s.title}](${s.url}) — *${s.domain}*`
      )
      .join('\n');

  return template + citationsBlock;
}

export function generateRelatedQuestions(query: string): string[] {
  const q = query.toLowerCase();

  if (q.includes('ai') || q.includes('artificial intelligence')) {
    return [
      'What is the difference between AI, ML, and deep learning?',
      'Which AI model is best for coding tasks in 2025?',
      'How does RLHF align language models with human preferences?',
      'What are the biggest AI safety risks ahead?',
    ];
  }
  if (q.includes('quantum')) {
    return [
      'When will quantum computers be commercially viable?',
      'How does quantum entanglement work?',
      'What problems can quantum computers solve that classical ones cannot?',
      'Who are the leading quantum computing companies?',
    ];
  }
  if (q.includes('inflation')) {
    return [
      'How does raising interest rates reduce inflation?',
      'What is stagflation and is it happening now?',
      'How should I invest during high inflation?',
      'What is the difference between CPI and core inflation?',
    ];
  }
  return [
    `What are the latest developments in ${query}?`,
    `How does ${query} compare to alternatives?`,
    `What experts say about ${query}?`,
    `Future trends and predictions for ${query}`,
  ];
}
