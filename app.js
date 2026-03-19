/* =============================================
   APP.JS — AI Clone AI CLONE
   ============================================= */

// ======= State =======
let searchQuery = '';
let currentModel = 'Auto';
let computerMode = false;
let micActive = false;
let modelMenuOpen = false;
let recentCollapsed = false;
const recentHistory = [];

// ======= DOM Refs =======
const searchInput = document.getElementById('searchInput');
const answerView = document.getElementById('answerView');
const homeContainer = document.getElementById('homeContainer');
const answerQuery = document.getElementById('answerQuery');
const answerText = document.getElementById('answerText');
const sourcesList = document.getElementById('sourcesList');
const relatedList = document.getElementById('relatedList');
const modelMenu = document.getElementById('modelMenu');
const modelNameEl = document.getElementById('modelName');
const computerToggle = document.getElementById('computerToggle');
const micBtn = document.getElementById('micBtn');
const modalOverlay = document.getElementById('modalOverlay');
const toast = document.getElementById('toast');
const recentContent = document.getElementById('recentContent');
const recentToggle = document.getElementById('recentToggle');

// ======= Simulated answer database =======
const answerDatabase = {
  default: {
    answer: `<p>This is a fascinating question that touches on multiple domains of knowledge. Based on the latest research and available information, here's a comprehensive breakdown:</p>
    <p>The phenomenon you're asking about has been studied extensively by researchers across multiple institutions. <sup>[1]</sup> The findings consistently point to a multi-layered understanding that considers both immediate and long-term factors.</p>
    <p>Key aspects to consider include:<br>
    <strong>1. Foundational principles</strong> — The underlying mechanics involve complex interactions between various components that work together to produce observable outcomes.<br>
    <strong>2. Modern developments</strong> — Recent advances in the field have dramatically changed our understanding, with new methodologies providing clearer insights than ever before. <sup>[2]</sup><br>
    <strong>3. Practical implications</strong> — The real-world applications of this knowledge are significant, affecting everyday decisions and long-term planning strategies.</p>
    <p>Scientists and researchers continue to explore this area, with ongoing studies expected to yield further breakthroughs in the coming years. <sup>[3]</sup></p>`,
    sources: [
      { domain: 'nature.com', title: 'Latest research findings on the topic', url: 'https://nature.com' },
      { domain: 'wikipedia.org', title: 'Comprehensive overview and history', url: 'https://wikipedia.org' },
      { domain: 'sciencedirect.com', title: 'Peer-reviewed journal article', url: 'https://sciencedirect.com' },
      { domain: 'arxiv.org', title: 'Pre-print research paper', url: 'https://arxiv.org' },
    ],
    related: [
      'What are the historical origins of this concept?',
      'How does this compare to similar phenomena?',
      'What does the latest research say about future trends?',
      'Are there practical applications I should know about?',
    ]
  },
  inflation: {
    answer: `<p><strong>Inflation</strong> is the rate at which the general level of prices for goods and services rises, eroding purchasing power over time. <sup>[1]</sup></p>
    <p><strong>Primary causes include:</strong><br>
    <strong>Demand-pull inflation</strong> — When aggregate demand exceeds aggregate supply. This occurs when consumers and businesses spend more money than the economy can produce goods and services for.<br>
    <strong>Cost-push inflation</strong> — When production costs rise, forcing companies to raise prices. Examples include rising oil prices or supply chain disruptions.<br>
    <strong>Built-in inflation</strong> — A wage-price spiral where workers demand higher wages (expecting future inflation), causing businesses to raise prices to cover costs. <sup>[2]</sup></p>
    <p>Central banks like the <strong>Federal Reserve</strong> in the U.S. attempt to manage inflation through monetary policy — primarily by adjusting interest rates. Higher interest rates make borrowing more expensive, which tends to reduce spending and slow inflation. <sup>[3]</sup></p>
    <p>Economists generally consider an inflation rate of around <strong>2% per year</strong> to be healthy for a growing economy.</p>`,
    sources: [
      { domain: 'investopedia.com', title: 'What Causes Inflation? — Investopedia', url: 'https://investopedia.com' },
      { domain: 'federalreserve.gov', title: 'Federal Reserve — Understanding Inflation', url: 'https://federalreserve.gov' },
      { domain: 'economist.com', title: 'The Economist — Inflation Explained', url: 'https://economist.com' },
      { domain: 'bls.gov', title: 'Bureau of Labor Statistics — CPI Data', url: 'https://bls.gov' },
    ],
    related: [
      'What is the current US inflation rate?',
      'How does inflation affect savings and investments?',
      'What is hyperinflation and when does it occur?',
      'How do central banks control inflation?',
    ]
  },
  quantum: {
    answer: `<p><strong>Quantum computing</strong> harnesses the principles of quantum mechanics to process information in fundamentally different ways than classical computers. <sup>[1]</sup></p>
    <p><strong>Classical vs. Quantum:</strong><br>
    Classical computers use <em>bits</em> — binary units that are either 0 or 1. Quantum computers use <em>qubits</em>, which can exist in a <strong>superposition</strong> of both 0 and 1 simultaneously, thanks to quantum mechanics.</p>
    <p><strong>Key quantum principles:</strong><br>
    <strong>Superposition</strong> — A qubit can be 0, 1, or any quantum superposition of these states, enabling parallel computation. <sup>[2]</sup><br>
    <strong>Entanglement</strong> — Qubits can be "entangled," meaning the state of one instantly influences another, regardless of distance.<br>
    <strong>Interference</strong> — Quantum algorithms use interference to amplify correct answers and cancel out wrong ones.</p>
    <p>This makes quantum computers exponentially faster for <em>specific problems</em> like factoring large numbers, simulating molecular structures for drug discovery, and optimizing complex systems. <sup>[3]</sup> However, they are not universally faster than classical computers — just better for certain tasks.</p>`,
    sources: [
      { domain: 'ibm.com', title: 'What is Quantum Computing? — IBM', url: 'https://ibm.com' },
      { domain: 'nature.com', title: 'Quantum supremacy using a programmable superconducting processor', url: 'https://nature.com' },
      { domain: 'mit.edu', title: 'Quantum Computing Research — MIT', url: 'https://mit.edu' },
      { domain: 'quantamagazine.org', title: 'The Era of Quantum Computing Is Here', url: 'https://quantamagazine.org' },
    ],
    related: [
      'What problems can quantum computers solve that classical ones can\'t?',
      'Who are the leading companies in quantum computing?',
      'When will quantum computers be available to the public?',
      'What is quantum cryptography?',
    ]
  },
  ai: {
    answer: `<p><strong>Artificial Intelligence (AI)</strong> refers to the simulation of human intelligence processes by computer systems. <sup>[1]</sup> AI systems learn from data, identify patterns, and make decisions with minimal human intervention.</p>
    <p><strong>How modern AI works:</strong><br>
    Most current AI is built on <em>machine learning</em> — specifically <strong>deep learning</strong> — which uses artificial neural networks inspired by the brain's structure. These networks have millions to billions of parameters (weights) that are tuned during training on vast datasets.</p>
    <p><strong>Large Language Models (LLMs)</strong> like GPT-4, Claude, and Gemini are trained on massive text datasets using a technique called <strong>transformer architecture</strong>. <sup>[2]</sup> They predict the next token (word fragment) in a sequence, which allows them to generate coherent text, answer questions, write code, and reason through problems.</p>
    <p>The training process uses <strong>backpropagation</strong> and <strong>gradient descent</strong> to minimize prediction error, while <strong>Reinforcement Learning from Human Feedback (RLHF)</strong> aligns models with human preferences. <sup>[3]</sup></p>`,
    sources: [
      { domain: 'openai.com', title: 'How AI Works — OpenAI', url: 'https://openai.com' },
      { domain: 'deepmind.google', title: 'AI Research — Google DeepMind', url: 'https://deepmind.google' },
      { domain: 'arxiv.org', title: 'Attention Is All You Need — Transformer Paper', url: 'https://arxiv.org' },
      { domain: 'mit.edu', title: 'Artificial Intelligence at MIT', url: 'https://mit.edu' },
    ],
    related: [
      'What is the difference between AI and machine learning?',
      'What are the risks of AI development?',
      'How does ChatGPT work technically?',
      'What is artificial general intelligence (AGI)?',
    ]
  }
};

// ======= Helper: get answer data =======
function getAnswer(query) {
  const q = query.toLowerCase();
  if (q.includes('inflation')) return answerDatabase.inflation;
  if (q.includes('quantum')) return answerDatabase.quantum;
  if (q.includes('ai') || q.includes('artificial intelligence')) return answerDatabase.ai;
  return answerDatabase.default;
}

// ======= Auto-resize textarea =======
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, window.innerHeight * 0.4) + 'px';
}

// ======= Handle search key =======
function handleSearchKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    triggerSearch();
  }
}

// ======= Handle follow-up key =======
function handleFollowup(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleFollowupSubmit();
  }
}

// ======= Fill search from chip =======
function fillSearch(text) {
  searchInput.value = text;
  searchInput.focus();
  autoResize(searchInput);
}

// ======= Trigger Search =======
function triggerSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    searchInput.focus();
    shakeSearchBox();
    return;
  }
  searchQuery = query;
  addToHistory(query);
  showAnswerView(query);
}

function shakeSearchBox() {
  const box = document.getElementById('searchBox');
  box.style.animation = 'shake 0.4s ease';
  setTimeout(() => box.style.animation = '', 500);
}

// ======= Handle follow-up submit =======
function handleFollowupSubmit() {
  const followupInput = document.getElementById('followupInput');
  const query = followupInput.value.trim();
  if (!query) return;
  followupInput.value = '';
  followupInput.style.height = 'auto';
  searchQuery = query;
  addToHistory(query);
  showAnswerView(query, true);
}

// ======= Show Answer View =======
function showAnswerView(query, isFollowup = false) {
  // Setup
  homeContainer.classList.add('hidden');
  answerView.classList.remove('hidden');

  // Set query title
  answerQuery.textContent = query;

  // Clear previous
  answerText.innerHTML = '';
  sourcesList.innerHTML = '';
  relatedList.innerHTML = '';

  // Show loading shimmer
  answerText.innerHTML = `
    <div class="shimmer" style="width:90%;margin-bottom:10px"></div>
    <div class="shimmer" style="width:75%;margin-bottom:10px"></div>
    <div class="shimmer" style="width:85%;margin-bottom:10px"></div>
    <div class="shimmer" style="width:60%;margin-bottom:10px"></div>
    <div class="shimmer" style="width:80%"></div>
  `;

  // Simulate sources loading
  setTimeout(() => {
    const data = getAnswer(query);
    renderSources(data.sources);
  }, 600);

  // Simulate answer streaming
  setTimeout(() => {
    const data = getAnswer(query);
    answerText.innerHTML = '';
    typewriterEffect(answerText, data.answer, () => {
      // After answer, show related
      setTimeout(() => renderRelated(data.related), 300);
    });
  }, 1200);
}

// ======= Typewriter effect =======
function typewriterEffect(container, html, callback) {
  // Parse HTML and display with typing simulation
  const temp = document.createElement('div');
  temp.innerHTML = html;
  container.innerHTML = '';

  let fullHTML = html;
  let idx = 0;
  const totalLen = fullHTML.length;

  // Fast typewriter — add chunks
  const interval = setInterval(() => {
    const chunkSize = Math.floor(Math.random() * 14) + 8;
    idx = Math.min(idx + chunkSize, totalLen);
    // Render progressively
    container.innerHTML = fullHTML.substring(0, idx);

    if (idx >= totalLen) {
      clearInterval(interval);
      container.innerHTML = fullHTML; // finalize
      if (callback) callback();
    }
  }, 24);
}

// ======= Render sources =======
function renderSources(sources) {
  sourcesList.innerHTML = '';
  sources.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'source-item';
    item.innerHTML = `
      <div class="source-domain">
        <div class="source-favicon" style="background: hsl(${i * 60}, 40%, 80%)"></div>
        ${src.domain}
      </div>
      <div class="source-title">${src.title}</div>
    `;
    item.onclick = () => window.open(src.url, '_blank');
    sourcesList.appendChild(item);
  });
}

// ======= Render related questions =======
function renderRelated(questions) {
  relatedList.innerHTML = '';
  questions.forEach(q => {
    const item = document.createElement('div');
    item.className = 'related-item';
    item.innerHTML = `
      <span>${q}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
        <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="12 5 19 12 12 19" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    item.onclick = () => {
      searchQuery = q;
      answerQuery.textContent = q;
      addToHistory(q);
      showAnswerView(q, true);
    };
    relatedList.appendChild(item);
  });
}

// ======= Go home =======
function goHome() {
  answerView.classList.add('hidden');
  homeContainer.classList.remove('hidden');
  searchInput.value = '';
  searchInput.style.height = 'auto';
  searchInput.focus();
}

// ======= Set nav active =======
function setActive(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}

// ======= Toggle model menu =======
function toggleModelMenu() {
  modelMenuOpen = !modelMenuOpen;
  modelMenu.classList.toggle('hidden', !modelMenuOpen);
  document.getElementById('modelBtn').classList.toggle('active', modelMenuOpen);
}

function selectModel(name, btn) {
  currentModel = name;
  modelNameEl.textContent = name;
  document.querySelectorAll('.model-option').forEach(o => {
    o.classList.remove('selected');
    const check = o.querySelector('.model-check');
    if (check) check.remove();
  });
  btn.classList.add('selected');
  const check = document.createElement('span');
  check.className = 'model-check';
  check.textContent = '✓';
  btn.appendChild(check);
  toggleModelMenu();
  showToast(`Switched to ${name}`);
}

// ======= Toggle Computer mode =======
function toggleComputer() {
  computerMode = !computerMode;
  computerToggle.classList.toggle('active', computerMode);
  showToast(computerMode ? 'Computer mode on' : 'Computer mode off');
}

// ======= Toggle mic =======
function toggleMic() {
  micActive = !micActive;
  micBtn.classList.toggle('listening', micActive);
  if (micActive) {
    showToast('Listening... (simulated)');
    setTimeout(() => {
      micActive = false;
      micBtn.classList.remove('listening');
    }, 3000);
  }
}

// ======= Modal =======
function openSignInModal() {
  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeSignInModal() {
  modalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}
function closeModalOutside(e) {
  if (e.target === modalOverlay) closeSignInModal();
}

function handleEmailAuth() {
  const email = document.getElementById('emailInput').value.trim();
  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email');
    return;
  }
  closeSignInModal();
  showToast(`Magic link sent to ${email}!`);
}

// ======= Toast =======
let toastTimeout;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.add('hidden'), 2800);
}

// ======= Copy answer =======
function copyAnswer() {
  const text = answerText.innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Answer copied to clipboard!');
  }).catch(() => {
    showToast('Copied!');
  });
}

// ======= Share answer =======
function shareAnswer() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showToast('Link copied to clipboard!');
  });
}

// ======= Recent history =======
function addToHistory(query) {
  recentHistory.unshift(query);
  if (recentHistory.length > 8) recentHistory.pop();
  renderHistory();
}

function renderHistory() {
  const emptyEl = recentContent.querySelector('.recent-empty');
  if (emptyEl) emptyEl.remove();

  recentContent.innerHTML = '';
  recentHistory.slice(0, 6).forEach(q => {
    const item = document.createElement('div');
    item.className = 'nav-item';
    item.style.fontSize = '0.8rem';
    item.style.padding = '7px 10px';
    item.style.cursor = 'pointer';
    item.style.color = 'var(--text-muted)';
    item.title = q;
    item.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14" style="flex-shrink:0">
        <circle cx="12" cy="12" r="9"/>
        <polyline points="12 6 12 12 16 14" stroke-linecap="round"/>
      </svg>
      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${q}</span>
    `;
    item.onclick = () => {
      searchInput.value = q;
      showAnswerView(q);
    };
    recentContent.appendChild(item);
  });
}

// ======= Recent toggle =======
recentToggle.addEventListener('click', () => {
  recentCollapsed = !recentCollapsed;
  recentContent.style.display = recentCollapsed ? 'none' : '';
  recentToggle.classList.toggle('collapsed', recentCollapsed);
});

// ======= Close model menu on outside click =======
document.addEventListener('click', (e) => {
  if (modelMenuOpen && !e.target.closest('#modelMenu') && !e.target.closest('#modelBtn')) {
    modelMenuOpen = false;
    modelMenu.classList.add('hidden');
    document.getElementById('modelBtn').classList.remove('active');
  }
});

// ======= Keyboard shortcuts =======
document.addEventListener('keydown', (e) => {
  // Escape to close modal / go home
  if (e.key === 'Escape') {
    if (!modalOverlay.classList.contains('hidden')) {
      closeSignInModal();
    } else if (!answerView.classList.contains('hidden')) {
      goHome();
    }
  }
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    if (!answerView.classList.contains('hidden')) {
      goHome();
    }
    setTimeout(() => searchInput.focus(), 50);
  }
});

// ======= Add shake keyframe via JS =======
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(style);

// ======= Initial focus =======
window.addEventListener('load', () => {
  setTimeout(() => searchInput.focus(), 100);
});

// ======= Simulate Google sign in =======
document.getElementById('googleSignIn').addEventListener('click', () => {
  closeSignInModal();
  showToast('Signed in with Google!');
  document.getElementById('signInBtn').innerHTML = `
    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke-linecap="round"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
    <span>My Account</span>
  `;
});

// ======= Simulate Apple sign in =======
document.getElementById('appleSignIn').addEventListener('click', () => {
  closeSignInModal();
  showToast('Signed in with Apple!');
});
