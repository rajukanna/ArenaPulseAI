// ArenaPulse AI - Client Application Logic

// ==================== APP STATE ====================
const state = {
  currentMode: 'fan',
  currentLang: 'en',
  selectedMapObject: null,
  selectedIncident: null,
  incidents: [
    {
      id: 'inc-1',
      title: 'Gate C Bottleneck (Ingress Congestion)',
      type: 'critical',
      summary: 'Heavy pedestrian backup (500+ fans) at Gate C due to the simultaneous arrival of 8 supporter shuttles. Security checks experiencing high queue wait times (14m).',
      location: 'Gate C - South Gate',
      time: 'T-3m ago',
      resolved: false,
      aiGenerated: false,
      plan: `**🏟️ Crowd Management Operations Plan (Gate C Ingress):**
1. **Divert Pedestrian Influx**: Immediately reroute incoming pedestrian traffic arriving from South Shuttle Hub towards **Gate B** and **Gate D** using safety barriers.
2. **Activate Auxiliary Lanes**: Open backup security turnstiles 11 & 12 at Gate C.
3. **Staff Redistribution**: Dispatch 6 standby security personnel from North concourse to Gate C for manual ticket pre-scanning and bag prep support.
4. **Transit Coordination**: Instruct shuttle dispatch command to pause Gate C drop-offs and route next 4 bus waves to Gate B.`,
      broadcast: `**🇺🇸 English**: "Attention Fans: Gate C is currently experiencing heavy volume. To expedite your entry, please follow volunteers towards Gate B or Gate D, where queues are under 3 minutes. Thank you."
**🇪🇸 Español**: "Atención aficionados: La Puerta C presenta una alta congestión. Para acelerar su ingreso, por favor diríjase a las Puertas B o D siguiendo las indicaciones de los voluntarios. Tiempo de espera menor a 3 minutos."
**🇫🇷 Français**: "Attention supporters: La porte C est actuellement très encombrée. Pour entrer plus rapidement, veuillez suivre les volontaires vers la porte B ou D. Attente estimée à moins de 3 minutes."`,
      sms: `⚠️ **OPS DISPATCH [URGENT]**: Security bottleneck at Gate C. Volunteer Team 4 (Crowd Support) immediately deploy to Southern crossing. Direct fans to Gate B. Contact Logistics for additional barriers.`
    },
    {
      id: 'inc-2',
      title: 'Waste Bin #24 Full (Compost Overflow)',
      type: 'eco',
      summary: 'Compost sensor at Section 103 concourse indicates Bin #24 is at 98% capacity. Immediate emptying required to prevent plastic/organic mixing.',
      location: 'Section 103 (South Stand)',
      time: 'T-8m ago',
      resolved: false,
      aiGenerated: false,
      plan: `**🌱 Green Stadium Sustainability Protocol:**
1. **Eco-Crew Dispatch**: Alert Eco-Volunteer Group 3 (Zone South) to execute bin swap for Bin #24.
2. **Waste Sorting Audit**: Inspect surrounding bins for potential organic contamination. Relocate mobile sorting bin to row 16 concourse.
3. **Points Credit**: Push a local "Eco-Alert" to active fan devices in Section 103 offering +25 extra Eco-Points for sorting trash correctly at the sorting stations.`,
      broadcast: `*(No general PA broadcast required for minor waste management alert to maintain auditory comfort. Local volunteer alert only.)*
**🌱 Automated Eco Ticker Update**: "Earn double eco-points at Dallas Arena today by utilizing the composting sorting hubs!"`,
      sms: `🌱 **ECO-DISPATCH**: Bin #24 (Compost) behind Section 103 is full (98%). Eco-volunteer 7 dispatched with compostable bags. Swap and transport bin to South Compaction Hub.`
    },
    {
      id: 'inc-3',
      title: 'Water Refill Station North - Low Pressure',
      type: 'warn',
      summary: 'Flow sensor at the North eco water refill station reports a drop in delivery pressure (1.2 GPM), slowing down fan bottle refills.',
      location: 'Water Refilling Station North',
      time: 'T-15m ago',
      resolved: false,
      aiGenerated: false,
      plan: `**🔧 Technical Operations Resolution Plan:**
1. **Maintenance Dispatch**: Route Stadium Facilities Team 2 (Plumbing) to the North concourse inspection cabinet.
2. **Valve Adjustment**: Check primary booster pump valve #12-A for pressure drops. Flush main line filter if sediment buildup is detected.
3. **Fan Redirection**: Update the Fan Companion Wayfinding App to temporarily mark North Water Station as "Low Flow" and redirect fans to North-East auxiliary stations.`,
      broadcast: `**🇺🇸 English**: "To keep hydrated, fans near Section 101 can find auxiliary chilled water stations open behind Section 102. Reusable bottles are welcome!"
**🇪🇸 Español**: "Para mantenerse hidratados, los aficionados cerca de la Sección 101 pueden encontrar estaciones de agua auxiliares detrás de la Sección 102."`,
      sms: `🔧 **FACILITIES ALERT**: Low water pressure (1.2 GPM) at North Water Refill Hub. Plumbing Unit 2 dispatch to inspection valve #12-A. Report pressure status on arrival.`
    }
  ]
};

// ==================== DICTIONARIES & MOCK AI RESPONSES ====================
const TRANSLATIONS = {
  en: {
    welcome: "🏟️ **Welcome to Dallas Stadium!** I'm your ArenaPulse AI assistant.\n\nAsk me anything about seating routes, stroller paths, water refilling stations, transit, or food locations. How can I help you enjoy the match today?",
    strollerRoute: "♿ **Accessibility Route (Stroller & Wheelchair Friendly):**\n- From your current location, take the **West Accessibility Ramp** behind Section 104.\n- Follow the glowing cyan markers on the floor to reach the elevators.\n- **Stroller Parking**: A secure, staffed stroller drop-off is located directly behind **Section 104-B**. You can tag and leave your stroller there free of charge and collect it after the game.",
    sustainability: "🌱 **Sustainability at Dallas Arena:**\n- We are a **Zero-Plastic waste venue**. All drinks are served in compostable eco-cups.\n- **Water Refill**: Chilled water stations are located at the North Concourses (behind Section 101) and South Concourses (behind Section 103). Refill your reusable bottles here for free!\n- **Reward**: Sort your trash at our Sorting Stations. Scan the QR code on the bins to claim **50 Eco-Points** toward concessions discounts!",
    transit: "🚌 **Transportation & Shuttle Info:**\n- **Downtown Shuttles**: Depart from the outer concourse near **Gate B (East)**. Shuttles are running every 3 minutes directly to Dallas Union Station.\n- **Light Rail Link**: Connects directly to **Gate D (West)**. Trains are running every 6 minutes with no delays.\n- **Rideshare Zone**: Accessible via the West Gate walkway. Estimated rideshare pickup wait time is currently 12 minutes.",
    food: "🌭 **Halal & Vegan Concessions:**\n- **Eco-Bites Concession** (Behind Section 102) features delicious 100% plant-based burgers, loaded vegan nachos, and organic soft pretzels.\n- **Dallas Spice Hub** (Behind Section 103) is fully certified **Halal** and serves halal beef sliders, chicken shawarma wraps, and vegetarian options.\n- All food packaging is compostable and should be placed in green bins.",
    fallback: "🤖 **ArenaPulse AI Assist:**\n- I've checked the stadium database. Regarding your question: *{query}*.\n- **Live Status**: Gates A, B, and D are currently experiencing fast queue times (under 4m). Gate C has moderate queues (14m).\n- **Support**: If you need medical or volunteer assistance, please press the Red Emergency Button in your app or alert any staff wearing fluorescent green jackets."
  },
  es: {
    welcome: "🏟️ **¡Bienvenido al Estadio de Dallas!** Soy tu asistente virtual ArenaPulse AI.\n\nPregúntame sobre rutas, accesos para cochecitos, recarga de agua, transporte o comida. ¿Cómo puedo ayudarte hoy?",
    strollerRoute: "♿ **Ruta de Accesibilidad (Apta para coches y sillas de ruedas):**\n- Desde tu ubicación actual, toma la **Rampa de Accesibilidad Oeste** detrás de la Sección 104.\n- Sigue las líneas cian brillantes en el suelo hacia los ascensores.\n- **Estacionamiento de Cochecitos**: Detrás de la **Sección 104-B** hay un área vigilada y gratuita para guardar cochecitos.",
    sustainability: "🌱 **Sostenibilidad en el Estadio:**\n- Somos un **estadio libre de plásticos de un solo uso**. Todas las bebidas se sirven en vasos compostables.\n- **Recarga de Agua**: Estaciones de agua fría detrás de la Sección 101 (Norte) y la Sección 103 (Sur). ¡Trae tu botella reutilizable!\n- **Premios**: Separa tus residuos en las estaciones ecológicas y escanea el código QR para ganar **50 Eco-Puntos** de descuento.",
    transit: "🚌 **Transporte y Autobuses:**\n- **Shuttles al Centro**: Salen del concenso exterior cerca de la **Puerta B (Este)** cada 3 minutos hacia la estación central de Dallas.\n- **Tren Ligero**: Conexión directa en la **Puerta D (Oeste)** con frecuencias de 6 minutos.\n- **Zona de Uber/Rideshare**: Ubicada en la salida oeste. El tiempo de espera actual es de 12 minutos.",
    food: "🌭 **Comida Halal y Vegana:**\n- **Eco-Bites** (Detrás de Sección 102): Hamburguesas veganas y nachos 100% basados en plantas.\n- **Dallas Spice Hub** (Detrás de Sección 103): Certificado **Halal**, ofrece shawarma de pollo, sliders de res y opciones vegetarianas.",
    fallback: "🤖 **Asistente ArenaPulse AI:**\n- Analizando tu consulta: *{query}*.\n- **Estado en Vivo**: Puertas A, B y D tienen esperas menores a 4 min. Puerta C tiene demoras de 14 min.\n- **Apoyo**: Para emergencias o ayuda física, avisa a los voluntarios vestidos con chaquetas verde fluorescente."
  },
  fr: {
    welcome: "🏟️ **Bienvenue au Stade de Dallas !** Je suis votre assistant ArenaPulse AI.\n\nPosez-moi des questions sur les itinéraires, les poussettes, les fontaines d'eau, les navettes ou la nourriture. Comment puis-je vous aider ?",
    strollerRoute: "♿ **Itinéraire Accessible (Poussettes & Fauteuils):**\n- Depuis votre position, prenez la **Rampe d'Accessibilité Ouest** derrière la Section 104.\n- Suivez les lignes cyan lumineuses jusqu'aux ascenseurs.\n- **Parking Poussettes**: Un espace sécurisé est disponible gratuitement derrière la **Section 104-B**.",
    sustainability: "🌱 **Éco-Responsabilité au Stade:**\n- Événement **Zéro Plastique**. Boissons servies dans des gobelets compostables.\n- **Fontaines d'eau**: Disponibles gratuitement derrière la Section 101 (Nord) et la Section 103 (Sud).\n- **Récompense**: Triez vos déchets, scannez le code QR et gagnez **50 Éco-Points** de réduction !",
    transit: "🚌 **Transports et Navettes :**\n- **Navettes Centre-ville**: Départ de la **Porte B (Est)** toutes les 3 minutes vers la gare de Dallas Union.\n- **Tramway**: Accès direct via la **Porte D (Ouest)**, rames toutes les 6 minutes.\n- **Zone de Covoiturage**: Accessible par la porte Ouest, temps d'attente estimé à 12 minutes.",
    food: "🌭 **Nourriture Halal & Végane :**\n- **Eco-Bites** (Derrière Section 102) : Burgers 100% végétaux et nachos véganes.\n- **Dallas Spice Hub** (Derrière Section 103) : Certifié **Halal**, shawarma de poulet et sliders de bœuf halal.",
    fallback: "🤖 **Aide ArenaPulse AI :**\n- Analyse de votre demande : *{query}*.\n- **Statut en Direct**: Files d'attente fluides aux portes A, B, D (<4m). Porte C encombrée (14m d'attente).\n- **Assistance**: En cas d'urgence, prévenez le personnel vêtu d'un gilet vert fluorescent."
  }
};

// Alternate language fallbacks for remaining options
TRANSLATIONS.de = TRANSLATIONS.en;
TRANSLATIONS.pt = TRANSLATIONS.en;
TRANSLATIONS.ar = TRANSLATIONS.en;

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
};
