// ArenaPulse AI - Client Application Logic
"use strict";

// ==================== APP STATE ====================
const state = {
  currentMode: 'fan',
  currentLang: 'en',
  selectedMapObject: null,
  selectedIncident: null,
  incidents: typeof DEFAULT_INCIDENTS !== "undefined" ? [...DEFAULT_INCIDENTS] : []
};

// ==================== SWITCH VIEWS LOGIC ====================
/**
 * Switch dashboard mode between Fan view and Operations Command view.
 * @param {string} mode - Mode key ('fan' or 'ops').
 */
function switchMode(mode) {
  state.currentMode = mode;
  
  // Toggle layout display
  const fanView = document.getElementById('fan-view');
  const opsView = document.getElementById('ops-view');
  const btnFan = document.getElementById('btn-fan');
  const btnOps = document.getElementById('btn-ops');
  
  if (mode === 'fan') {
    fanView.classList.add('active');
    opsView.classList.remove('active');
    btnFan.classList.add('active');
    btnOps.classList.remove('active');
    
    // Accessibility adjustments
    btnFan.setAttribute('aria-selected', 'true');
    btnOps.setAttribute('aria-selected', 'false');
  } else {
    fanView.classList.remove('active');
    opsView.classList.add('active');
    btnFan.classList.remove('active');
    btnOps.classList.add('active');
    
    // Accessibility adjustments
    btnFan.setAttribute('aria-selected', 'false');
    btnOps.setAttribute('aria-selected', 'true');
    
    renderIncidents(); // Render operational incidents when showing ops view
  }
}

// ==================== FAN PORTAL: AI CONCIERGE LOGIC ====================
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

// Local client-side cache to minimize network overhead and latency
const chatCache = new Map();

/**
 * Initializes the chat concierge interface with a welcome message.
 */
function initChat() {
  chatMessages.innerHTML = '';
  addBotMessage(TRANSLATIONS[state.currentLang].welcome);
}

/**
 * Handles language switching triggers.
 */
function changeLang() {
  const langSelect = document.getElementById('chat-lang');
  state.currentLang = langSelect.value;
  initChat();
}

/**
 * Binds Enter keypress event to the chat input field.
 */
function handleChatKey(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

/**
 * Dispatches the fan chat message and updates the UI log dynamically.
 */
function sendChatMessage() {
  const query = chatInput.value.trim();
  if (!query) return;
  
  // Render user bubble
  addUserMessage(query);
  chatInput.value = '';
  
  const cacheKey = `${state.currentLang}_${query.toLowerCase()}`;
  
  // 1. Efficiency: Serve immediately from local cache if queried before
  if (chatCache.has(cacheKey)) {
    showBotTypingIndicator();
    setTimeout(() => {
      removeBotTypingIndicator();
      addBotMessage(chatCache.get(cacheKey));
    }, 300);
    return;
  }
  
  showBotTypingIndicator();
  
  // Fetch real Gemini chat completion from local server
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: query, lang: state.currentLang })
  })
  .then(res => res.json())
  .then(data => {
    removeBotTypingIndicator();
    if (data.status === 'success') {
      // Cache the response locally
      chatCache.set(cacheKey, data.response);
      addBotMessage(data.response);
    } else {
      console.warn("Gemini API fallback: utilizing local concierge lookup.");
      const response = analyzeQuery(query);
      addBotMessage(response);
    }
  })
  .catch(err => {
    console.error("Gemini API request failed, calling local fallback:", err);
    removeBotTypingIndicator();
    const response = analyzeQuery(query);
    addBotMessage(response);
  });
}


function sendQuickPrompt(type) {
  let promptText = '';
  switch(type) {
    case 'accessible-route':
      promptText = state.currentLang === 'es' ? "Ruta accesible para cochecitos" : (state.currentLang === 'fr' ? "Itinéraire poussette accessible" : "Stroller-friendly accessible route");
      addUserMessage(promptText);
      showBotTypingIndicator();
      setTimeout(() => {
        removeBotTypingIndicator();
        addBotMessage(TRANSLATIONS[state.currentLang].strollerRoute);
        // Highlight map layer and route
        setMapLayer('accessibility');
        highlightMapRoute('accessibility');
      }, 800);
      break;
    case 'sustainability-cups':
      promptText = state.currentLang === 'es' ? "Estaciones de vasos compostables" : (state.currentLang === 'fr' ? "Points de recharge éco gobelets" : "Eco-friendly cup refill points");
      addUserMessage(promptText);
      showBotTypingIndicator();
      setTimeout(() => {
        removeBotTypingIndicator();
        addBotMessage(TRANSLATIONS[state.currentLang].sustainability);
        setMapLayer('sustainability');
      }, 800);
      break;
    case 'transit-downtown':
      promptText = state.currentLang === 'es' ? "Horarios de autobuses al centro" : (state.currentLang === 'fr' ? "Navettes pour le centre-ville" : "Shuttle wait times to Downtown");
      addUserMessage(promptText);
      showBotTypingIndicator();
      setTimeout(() => {
        removeBotTypingIndicator();
        addBotMessage(TRANSLATIONS[state.currentLang].transit);
        // Point map to Transit Hub
        clickMapObject('Gate B - East Gate', 'Security Queue: Light (2 min)', 'Recommended entry point for shuttle arrivals. Multi-channel ticket scanning active.');
      }, 800);
      break;
    case 'vegan-halal':
      promptText = state.currentLang === 'es' ? "Comida vegana y halal" : (state.currentLang === 'fr' ? "Nourriture halal et végane" : "Halal & Vegan concessions");
      addUserMessage(promptText);
      showBotTypingIndicator();
      setTimeout(() => {
        removeBotTypingIndicator();
        addBotMessage(TRANSLATIONS[state.currentLang].food);
      }, 800);
      break;
  }
}

function analyzeQuery(query) {
  const q = query.toLowerCase();
  const lang = state.currentLang;
  
  if (q.includes('stroller') || q.includes('wheelchair') || q.includes('ramp') || q.includes('accessible') || q.includes('carro') || q.includes('silla') || q.includes('rampe') || q.includes('poussette')) {
    setMapLayer('accessibility');
    highlightMapRoute('accessibility');
    return TRANSLATIONS[lang].strollerRoute;
  }
  
  if (q.includes('cup') || q.includes('water') || q.includes('sustain') || q.includes('compost') || q.includes('recycle') || q.includes('eco') || q.includes('reciclar') || q.includes('agua') || q.includes('bouteille')) {
    setMapLayer('sustainability');
    return TRANSLATIONS[lang].sustainability;
  }
  
  if (q.includes('shuttle') || q.includes('bus') || q.includes('transit') || q.includes('train') || q.includes('taxi') || q.includes('ride') || q.includes('autobus') || q.includes('navette') || q.includes('metro')) {
    return TRANSLATIONS[lang].transit;
  }
  
  if (q.includes('vegan') || q.includes('halal') || q.includes('food') || q.includes('eat') || q.includes('hunger') || q.includes('comida') || q.includes('nourriture') || q.includes('vegetari')) {
    return TRANSLATIONS[lang].food;
  }
  
  // Fallback response with custom query replacement
  return TRANSLATIONS[lang].fallback.replace('{query}', query);
}

function addUserMessage(text) {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user';
  bubble.innerText = text;
  chatMessages.appendChild(bubble);
  scrollToBottom(chatMessages);
}

function addBotMessage(text) {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble bot';
  
  // Format basic bold markdown in local string
  const formattedText = formatMarkdown(text);
  
  bubble.innerHTML = `
    <div class="bot-icon-label">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
      <span>ARENAPULSE CONCIERGE</span>
    </div>
    <div>${formattedText}</div>
  `;
  chatMessages.appendChild(bubble);
  scrollToBottom(chatMessages);
}

function showBotTypingIndicator() {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble bot typing-indicator';
  bubble.id = 'bot-typing';
  bubble.innerHTML = `
    <div class="bot-icon-label">
      <span>AI typing...</span>
    </div>
    <div class="ai-loader-bar" style="padding: 4px; border:none; background:none;">
      <div class="loader-progress" style="height: 3px; background: rgba(255,255,255,0.05); width: 80px;"><div class="progress-fill fill-cyan" style="width: 100%; animation: slideLoader 1.2s infinite ease-in-out;"></div></div>
    </div>
  `;
  chatMessages.appendChild(bubble);
  scrollToBottom(chatMessages);
}

function removeBotTypingIndicator() {
  const indicator = document.getElementById('bot-typing');
  if (indicator) {
    indicator.remove();
  }
}

function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

/**
 * Escapes characters to prevent Cross-Site Scripting (XSS) attacks.
 * @param {string} str - Raw input string.
 * @returns {string} Safe, sanitized string.
 */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/**
 * Safely compiles basic bold and line-break markdowns after escaping tag inputs.
 * @param {string} text - Raw content.
 * @returns {string} Sanitized formatted HTML string.
 */
function formatMarkdown(text) {
  // 1. Security: Escape raw input to neutralize XSS payloads
  const escaped = escapeHTML(text);
  
  // 2. Formatting: Re-introduce permitted stylistic elements
  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
    .replace(/- (.*?)(<br\/>|$)/g, '• $1$2');
}

// ==================== MAP LAYER INTERACTIVITY ====================
function setMapLayer(layer) {
  // Toggle tab states
  const tabs = ['all', 'accessibility', 'sustainability', 'crowd'];
  tabs.forEach(t => {
    const tabEl = document.getElementById(`layer-${t}`);
    if (t === layer) {
      tabEl.classList.add('active');
      tabEl.setAttribute('aria-selected', 'true');
    } else {
      tabEl.classList.remove('active');
      tabEl.setAttribute('aria-selected', 'false');
    }
  });

  // Toggle map SVG overlays
  const accLayer = document.getElementById('map-accessibility-layer');
  const sustLayer = document.getElementById('map-sustainability-layer');
  const crowdLayer = document.getElementById('map-crowd-layer');
  const wayPath = document.getElementById('wayfinder-path');

  accLayer.classList.add('hidden');
  sustLayer.classList.add('hidden');
  crowdLayer.classList.add('hidden');
  wayPath.classList.add('hidden');

  if (layer === 'accessibility') {
    accLayer.classList.remove('hidden');
  } else if (layer === 'sustainability') {
    sustLayer.classList.remove('hidden');
  } else if (layer === 'crowd') {
    crowdLayer.classList.remove('hidden');
  }
}

function highlightMapRoute(type) {
  const wayPath = document.getElementById('wayfinder-path');
  wayPath.classList.remove('hidden');
  
  if (type === 'accessibility') {
    // Path from Gate D to Section 104
    wayPath.setAttribute('d', 'M 70 225 L 120 225 L 180 200');
  } else {
    wayPath.setAttribute('d', 'M 300 37 L 300 130');
  }
}

function clickMapObject(name, status, description) {
  // Render Selection box values
  document.getElementById('loc-name').innerText = name;
  document.getElementById('loc-status').innerHTML = `<strong>Status</strong>: ${status}`;
  document.getElementById('loc-desc').innerText = description;

  // Add click highlights to SVG elements
  const regions = document.querySelectorAll('.map-region');
  regions.forEach(r => r.classList.remove('selected-active'));

  // Match and highlight SVG elements if named correctly
  if (name.includes('Section 101')) document.getElementById('section-101').classList.add('selected-active');
  if (name.includes('Section 102')) document.getElementById('section-102').classList.add('selected-active');
  if (name.includes('Section 103')) document.getElementById('section-103').classList.add('selected-active');
  if (name.includes('Section 104')) document.getElementById('section-104').classList.add('selected-active');
  if (name.includes('Gate A')) document.getElementById('gate-a-rect').classList.add('selected-active');
  if (name.includes('Gate B')) document.getElementById('gate-b-rect').classList.add('selected-active');
  if (name.includes('Gate C')) document.getElementById('gate-c-rect').classList.add('selected-active');
  if (name.includes('Gate D')) document.getElementById('gate-d-rect').classList.add('selected-active');
}

// ==================== OPERATIONS CONSOLE: INCIDENTS LOG ====================
function renderIncidents() {
  const incidentFeed = document.getElementById('incident-feed');
  incidentFeed.innerHTML = '';

  state.incidents.forEach(inc => {
    const item = document.createElement('div');
    item.className = `incident-item ${state.selectedIncident && state.selectedIncident.id === inc.id ? 'active-select' : ''}`;
    item.onclick = () => selectIncident(inc);

    const typeBadge = inc.type === 'critical' ? 'critical' : (inc.type === 'eco' ? 'eco' : 'warn');
    const badgeText = inc.type.toUpperCase();

    item.innerHTML = `
      <div class="incident-meta">
        <span class="badge ${typeBadge}">${badgeText}</span>
        <span class="time-elapsed">${inc.time}</span>
      </div>
      <div class="incident-title">${inc.title}</div>
      <div class="incident-summary">${inc.summary.substring(0, 75)}...</div>
      <div class="incident-bottom">
        <span class="incident-loc">📍 ${inc.location}</span>
        <span class="resolved-status ${inc.resolved ? 'resolved' : 'unresolved'}">
          ${inc.resolved ? '✅ RESOLVED' : '🔴 PENDING'}
        </span>
      </div>
    `;
    incidentFeed.appendChild(item);
  });
}

function selectIncident(incident) {
  state.selectedIncident = incident;
  
  // Highlight selected item in feed
  renderIncidents();

  // Show active workspace panel
  document.getElementById('resolver-workspace').querySelector('.empty-state-resolver').classList.add('hidden');
  document.getElementById('resolver-active').classList.remove('hidden');

  // Fill in incident specifics
  const badge = document.getElementById('selected-inc-badge');
  badge.className = `badge ${incident.type}`;
  badge.innerText = incident.type.toUpperCase();
  document.getElementById('selected-inc-time').innerText = incident.time;
  document.getElementById('selected-inc-title').innerText = incident.title;
  document.getElementById('selected-inc-desc').innerText = incident.summary;

  // Toggle AI generation outputs based on state
  const aiOutput = document.getElementById('ai-output');
  const generateBtn = document.getElementById('btn-generate-ai');
  const aiLoader = document.getElementById('ai-loader');

  aiLoader.classList.add('hidden');

  if (incident.aiGenerated) {
    aiOutput.classList.remove('hidden');
    generateBtn.classList.add('hidden');
    document.getElementById('ai-plan-content').innerHTML = formatMarkdown(incident.plan);
    document.getElementById('ai-broadcast-content').innerHTML = formatMarkdown(incident.broadcast);
    document.getElementById('ai-sms-content').innerHTML = formatMarkdown(incident.sms);
  } else {
    aiOutput.classList.add('hidden');
    generateBtn.classList.remove('hidden');
  }
}

// ==================== SIMULATED AI ACTION DECISION WRITER ====================
function generateAIResolution() {
  if (!state.selectedIncident) return;
  
  const generateBtn = document.getElementById('btn-generate-ai');
  const aiLoader = document.getElementById('ai-loader');
  const aiOutput = document.getElementById('ai-output');

  generateBtn.classList.add('hidden');
  aiLoader.classList.remove('hidden');

  let loadProgress = 0;
  const statusTexts = [
    "AI is analyzing security cameras and gate telemetry...",
    "Querying volunteer team schedules and sector capacity...",
    "Drafting translation files (EN, ES, FR) for PA broadcasts...",
    "Compiling dispatch scripts for venue coordinators..."
  ];

  const statusInterval = setInterval(() => {
    loadProgress += 25;
    const loaderTextEl = aiLoader.querySelector('.loader-text');
    if (loadProgress < 100) {
      loaderTextEl.innerText = statusTexts[Math.floor(loadProgress / 25)];
    }
  }, 500);

  // Fetch real Gemini-based operational resolution plan
  fetch('/api/resolve-incident', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: state.selectedIncident.title,
      summary: state.selectedIncident.summary,
      location: state.selectedIncident.location
    })
  })
  .then(res => res.json())
  .then(data => {
    clearInterval(statusInterval);
    aiLoader.classList.add('hidden');
    aiOutput.classList.remove('hidden');

    if (data.status === 'success') {
      state.selectedIncident.plan = data.plan;
      state.selectedIncident.broadcast = data.broadcast;
      state.selectedIncident.sms = data.sms;
    } else {
      console.warn("Gemini Incident Resolution fallback: using pre-seeded dashboard plan.");
    }

    // Mark incident state as AI processed and stream text output
    state.selectedIncident.aiGenerated = true;
    streamTextResponse();
  })
  .catch(err => {
    console.error("Gemini Resolution API failed, using local pre-seeded model:", err);
    clearInterval(statusInterval);
    aiLoader.classList.add('hidden');
    aiOutput.classList.remove('hidden');
    state.selectedIncident.aiGenerated = true;
    streamTextResponse();
  });
}

function streamTextResponse() {
  const planDest = document.getElementById('ai-plan-content');
  const broadcastDest = document.getElementById('ai-broadcast-content');
  const smsDest = document.getElementById('ai-sms-content');

  const rawPlan = state.selectedIncident.plan;
  const rawBroadcast = state.selectedIncident.broadcast;
  const rawSMS = state.selectedIncident.sms;

  // Clear destinations
  planDest.innerHTML = '';
  broadcastDest.innerHTML = '';
  smsDest.innerHTML = '';

  // Stream plan first, then broadcast, then SMS
  typeStream(planDest, formatMarkdown(rawPlan), () => {
    typeStream(broadcastDest, formatMarkdown(rawBroadcast), () => {
      typeStream(smsDest, formatMarkdown(rawSMS), () => {
        // Automatically mark the incident as resolved for the simulation visual
        state.selectedIncident.resolved = true;
        renderIncidents();
        updateDiagnosticsOnIncidentResolve();
      });
    });
  });
}

function typeStream(element, htmlContent, onComplete) {
  let index = 0;
  element.innerHTML = "";
  
  // We stream character blocks to balance performance and visual impact
  const interval = setInterval(() => {
    if (index >= htmlContent.length) {
      clearInterval(interval);
      element.innerHTML = htmlContent; // Ensure final layout is accurate
      if (onComplete) onComplete();
    } else {
      // Handle opening/closing tags briefly or stream word segments
      const segmentSize = 5;
      element.innerHTML = htmlContent.substring(0, index + segmentSize) + "<span class='logo-title accent-text' style='font-size:inherit;'>_</span>";
      index += segmentSize;
    }
  }, 15);
}

// Dynamic dashboard values modification on resolution
function updateDiagnosticsOnIncidentResolve() {
  if (state.selectedIncident.id === 'inc-1') {
    // Ingress congestion cleared
    setTimeout(() => {
      animateValueUpdate('meter-ingress', 'txt-ingress', 74, 91, '% Ingress Complete');
      document.getElementById('ticker-text').innerText = "📢 Gate C Ingress congestion resolved. Flow running normally across all turnstiles. • ⚽ Match kick-off USA vs Germany underway.";
    }, 1500);
  } else if (state.selectedIncident.id === 'inc-2') {
    // Compost emptied
    setTimeout(() => {
      animateValueUpdate('meter-waste', 'txt-waste', 82, 87, '% Diverted');
    }, 1500);
  }
}

function animateValueUpdate(meterId, textId, start, end, label) {
  const meter = document.getElementById(meterId);
  const textVal = document.getElementById(textId);
  
  let current = start;
  const step = start < end ? 1 : -1;
  
  const timer = setInterval(() => {
    current += step;
    meter.style.width = `${current}%`;
    textVal.innerText = `${current}${label}`;
    if (current === end) {
      clearInterval(timer);
    }
  }, 30);
}

// ==================== DYNAMIC SIMULATION INCIDENT SPAWNER ====================
function startSimulationTicker() {
  // Periodically add new incident simulations to show live system
  setTimeout(() => {
    const newInc = {
      id: 'inc-4',
      title: 'Concession 104 Eco-Cup Shortage',
      type: 'eco',
      summary: 'Eco Cup Inventory sensor reports Concession Stand 104 has only 120 units remaining. Concessions nearby have high reserve inventory.',
      location: 'Section 104 (West Stand)',
      time: 'T-Just Now',
      resolved: false,
      aiGenerated: false,
      plan: `**🌱 Concession Replenishment Plan:**
1. **Eco Inventory Dispatch**: Transfer 4 boxes (1,000 units) of compostable cups from Main North Warehouse to Concession Stand 104.
2. **Assign Courier**: Dispatch volunteer runner team 1 to execute hand-truck transfer immediately.
3. **Verify Compliance**: Log and scan stock replenishment. Ensure no backup plastic cup units are brought out.`,
      broadcast: `*(No public PA broadcast required. Inventory stock replenishment completed internally).*`,
      sms: `🌱 **ECO-STOCK**: Concession 104 is low on eco-cups (120 units left). Runner Unit 1 proceed to North Warehouse to pick up 4 cases and deliver to Section 104.`
    };
    
    state.incidents.unshift(newInc);
    if (state.currentMode === 'ops') {
      renderIncidents();
    }
    
    // Alert ticker update
    document.getElementById('ticker-text').innerText = "⚠️ SYSTEM ALERT: Concession Stand 104 reported low eco-cup stock. Volunteer courier dispatched. • 🌱 Zero-waste compliance active.";
  }, 45000);
}

// ==================== INITIALIZATION ====================
window.onload = () => {
  initChat();
  startSimulationTicker();

  // Accessibility: Bind keypress handlers to interactive SVG paths for keyboard selection
  const mapRegions = document.querySelectorAll('.map-region');
  mapRegions.forEach(region => {
    region.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        region.click();
      }
    });
  });
};
