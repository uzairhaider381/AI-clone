// ============================================================
// AI Clone — Deep Research Engine
// Multi-Query Expansion + Reranking + Source Validation
// ============================================================

import type { Source, SubQuery, ThinkingStep } from '@/types';
import { extractDomain, getFaviconUrl, nanoid, sleep } from '@/lib/utils';

// ── 1. QUERY EXPANSION ──────────────────────────────────────
export function expandQuery(query: string): string[] {
  const q = query.trim();

  // Strategy: Generate 3 orthogonal sub-queries
  const expansions = [
    q, // Original
    `${q} latest research and analysis`,   // Depth
    `${q} examples real world applications`, // Width
  ];

  // Simple keyword-based specialization
  if (/why|how|what/i.test(q)) {
    expansions[1] = `technical explanation ${q}`;
    expansions[2] = `${q} expert perspective 2024 2025`;
  } else if (/best|top|compare/i.test(q)) {
    expansions[1] = `${q} pros cons detailed comparison`;
    expansions[2] = `${q} expert recommendations guide`;
  }

  return expansions;
}

// ── 2. RERANKER ─────────────────────────────────────────────
// Cosine-style TF-IDF local scorer
function tokenize(text: string): Map<string, number> {
  const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
  const freq = new Map<string, number>();
  for (const t of tokens) {
    freq.set(t, (freq.get(t) ?? 0) + 1);
  }
  return freq;
}

function cosineScore(queryTokens: Map<string, number>, docTokens: Map<string, number>): number {
  let dot = 0;
  let qMag = 0;
  let dMag = 0;

  for (const [t, qf] of queryTokens) {
    const df = docTokens.get(t) ?? 0;
    dot += qf * df;
  }
  for (const v of queryTokens.values()) qMag += v * v;
  for (const v of docTokens.values()) dMag += v * v;

  if (qMag === 0 || dMag === 0) return 0;
  return dot / (Math.sqrt(qMag) * Math.sqrt(dMag));
}

export function rerankSources(query: string, sources: Source[]): Source[] {
  const qTokens = tokenize(query);
  return sources
    .map((src) => {
      const docTokens = tokenize(`${src.title} ${src.snippet}`);
      const score = cosineScore(qTokens, docTokens);
      // Authority bonus: prefer well-known domains
      const authorityBonus = getAuthorityBonus(src.domain);
      return { ...src, relevanceScore: Math.min(1, score + authorityBonus) };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 8); // Top 8
}

function getAuthorityBonus(domain: string): number {
  const highAuthority = [
    'wikipedia.org', 'github.com', 'arxiv.org', 'nature.com',
    'sciencedirect.com', 'pubmed.ncbi.nlm.nih.gov', 'harvard.edu',
    'mit.edu', 'stanford.edu', 'openai.com', 'google.com',
    'microsoft.com', 'ibm.com', 'ieee.org',
  ];
  const mediumAuthority = [
    'medium.com', 'substack.com', 'techcrunch.com', 'wired.com',
    'theverge.com', 'reuters.com', 'bbc.com', 'nytimes.com',
  ];
  if (highAuthority.some((d) => domain.includes(d))) return 0.15;
  if (mediumAuthority.some((d) => domain.includes(d))) return 0.08;
  return 0;
}

// ── 3. SOURCE VALIDATOR ─────────────────────────────────────
const PAYWALL_DOMAINS = [
  'wsj.com', 'ft.com', 'bloomberg.com', 'nytimes.com',
  'economist.com', 'businessinsider.com', 'thetimes.co.uk',
];

const BLACKLIST = ['reddit.com/r/spam', 'pinterest.com'];

export function validateSourceSync(source: Source): Source {
  const domain = source.domain;
  const isPaywall = PAYWALL_DOMAINS.some((d) => domain.includes(d));
  const isBlacklisted = BLACKLIST.some((d) => domain.includes(d));

  return {
    ...source,
    isPaywall,
    isValid: !isBlacklisted && !!source.url && !!source.title,
  };
}

// ── 4. MOCK SEARCH API (swappable with real Serper/DuckDuckGo) ──
interface SearchAPIResult {
  url: string;
  title: string;
  snippet: string;
}

const MOCK_KNOWLEDGE: Record<string, SearchAPIResult[]> = {
  default: [
    {
      url: 'https://arxiv.org/abs/2310.01208',
      title: 'Survey of Large Language Models — ArXiv',
      snippet:
        'A comprehensive survey of state-of-the-art large language models (LLMs), examining their architecture, training methodologies, capabilities, and alignment techniques.',
    },
    {
      url: 'https://openai.com/research/overview',
      title: 'OpenAI Research — Latest Developments',
      snippet:
        'OpenAI publishes leading research on artificial intelligence, including advances in natural language processing, reinforcement learning, and safety.',
    },
    {
      url: 'https://nature.com/articles/s41586-023-06792-0',
      title: 'Human-level performance on IQ tests — Nature',
      snippet:
        'This study demonstrates that frontier AI systems now match or exceed average human performance on standardized intelligence benchmarks.',
    },
    {
      url: 'https://github.com/microsoft/autogen',
      title: 'AutoGen — Multi-Agent Framework — GitHub',
      snippet:
        'AutoGen is an open-source framework for building multi-agent AI systems that can solve complex tasks through conversational collaboration.',
    },
    {
      url: 'https://wikipedia.org/wiki/Artificial_intelligence',
      title: 'Artificial Intelligence — Wikipedia',
      snippet:
        'Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans.',
    },
    {
      url: 'https://wired.com/story/what-is-ai',
      title: 'What Is AI? — WIRED',
      snippet:
        'WIRED explains artificial intelligence in depth: from its origins in 1956 to modern deep learning breakthroughs and the current era of generative AI.',
    },
    {
      url: 'https://mit.edu/research/artificial-intelligence',
      title: 'MIT AI Research — Cutting Edge Labs',
      snippet:
        "MIT's Computer Science and Artificial Intelligence Laboratory (CSAIL) conducts pioneering research across machine learning, robotics, and natural language.",
    },
    {
      url: 'https://bloomberg.com/technology/ai',
      title: 'AI Technology Coverage — Bloomberg',
      snippet:
        'Bloomberg covers the latest developments in artificial intelligence from enterprise adoption to regulation debates in the US and EU.',
    },
  ],
};

export async function fetchSearchResults(
  query: string
): Promise<SearchAPIResult[]> {
  // Simulate network delay (100–400ms)
  await sleep(100 + Math.random() * 300);

  const q = query.toLowerCase();
  
  // If the query is actually about a specific topic, try to make a semi-realistic mock
  if (q.includes("space") || q.includes("mars") || q.includes("nasa") || q.includes("spacex")) {
    return [
      {
        url: 'https://nasa.gov/missions/artemis',
        title: 'Artemis — NASA Missions',
        snippet: 'NASA is working to land the first woman and first person of color on the Moon using innovative technologies to explore more of the lunar surface than ever before.',
      },
      {
        url: 'https://spacex.com/vehicles/starship',
        title: 'Starship — SpaceX',
        snippet: 'SpaceX’s Starship spacecraft and Super Heavy rocket represent a fully reusable transportation system designed to carry both crew and cargo to Earth orbit, the Moon, Mars and beyond.',
      },
      {
        url: 'https://esa.int/Science_Exploration/Space_Science',
        title: 'European Space Agency — Exploration Strategy',
        snippet: 'The European Space Agency is investigating the future of human exploration beyond Low Earth Orbit with missions to the Moon and robotic exploration of Mars.',
      },
      {
        url: 'https://nature.com/articles/space-travel-future',
        title: 'The Future of Deep Space Exploration — Nature',
        snippet: 'Reviewing the propulsion systems and life support technologies required for long-duration human spaceflight to the outer solar system.',
      }
    ];
  }

  if (q.includes("bitcoin") || q.includes("crypto") || q.includes("finance")) {
    return [
      {
        url: 'https://coindesk.com/markets',
        title: 'Bitcoin Market Analysis — CoinDesk',
        snippet: 'Bitcoin prices show resilience amid regulatory shifts in the US and Europe. Analysts predict volatility in the coming quarters.',
      },
      {
        url: 'https://reuters.com/business/finance/crypto',
        title: 'Global Crypto Regulations — Reuters',
        snippet: 'Governments worldwide are accelerating the implementation of CBDCs and framework for digital asset taxation and tracking.',
      }
    ];
  }

  // Fallback to default mock
  const base = MOCK_KNOWLEDGE.default;
  const shuffled = [...base].sort(() => Math.random() - 0.48);
  return shuffled.slice(0, 6);
}

// ── 5. THINKING STEPS FACTORY ───────────────────────────────
export function makeThinkingSteps(query: string, mode: string): ThinkingStep[] {
  const subQs = expandQuery(query);
  return [
    {
      id: nanoid(),
      label: 'Understanding your query',
      status: 'pending',
      detail: `Parsing intent from: "${query.slice(0, 50)}"`,
      timestamp: 0,
    },
    {
      id: nanoid(),
      label: `Generating ${subQs.length} search queries`,
      status: 'pending',
      detail: subQs.map((q) => `• ${q}`).join('\n'),
      timestamp: 0,
    },
    {
      id: nanoid(),
      label: 'Searching the web in parallel',
      status: 'pending',
      detail: 'Running concurrent searches across sources',
      timestamp: 0,
    },
    {
      id: nanoid(),
      label: 'Validating & reranking sources',
      status: 'pending',
      detail: 'Scoring relevance, checking for paywalls',
      timestamp: 0,
    },
    {
      id: nanoid(),
      label: mode === 'deep' ? 'Synthesizing deep research answer' : 'Composing answer',
      status: 'pending',
      detail: 'Generating a grounded, cited response',
      timestamp: 0,
    },
  ];
}

// ── 6. FULL SOURCES PIPELINE ─────────────────────────────────
export async function buildSources(query: string): Promise<Source[]> {
  const subQueries = expandQuery(query);

  // Parallel search
  const results = await Promise.all(subQueries.map(fetchSearchResults));
  const flat = results.flat();

  // Deduplicate by URL
  const uniqueMap = new Map<string, SearchAPIResult>();
  for (const r of flat) uniqueMap.set(r.url, r);
  const unique = Array.from(uniqueMap.values());

  // Map to Source type
  const sources: Source[] = unique.map((r): Source => {
    const domain = extractDomain(r.url);
    const raw: Source = {
      url: r.url,
      title: r.title,
      domain,
      snippet: r.snippet,
      favicon: getFaviconUrl(domain),
      relevanceScore: 0,
      isValid: true,
      isPaywall: false,
      publishedAt: new Date(
        Date.now() - Math.random() * 90 * 86400000
      ).toISOString(),
    };
    return validateSourceSync(raw);
  });

  // Rerank
  return rerankSources(query, sources);
}
