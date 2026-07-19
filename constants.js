/**
 * ArenaPulse AI Hub - Global Client Constants
 * Decouples static translation strings and incident logs from UI interaction logic.
 */
"use strict";

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

TRANSLATIONS.de = TRANSLATIONS.en;
TRANSLATIONS.pt = TRANSLATIONS.en;
TRANSLATIONS.ar = TRANSLATIONS.en;

const DEFAULT_INCIDENTS = [
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
];
