/**
 * ArenaPulse AI Hub - Core Database and Constants Store
 * This module isolates prompt templates, regional stadium database info,
 * and fallback rules to maintain codebase separation and readability.
 */

// 1. System Prompt Templates for the Dallas Host Venue (FIFA World Cup 2026)
const CONCIERGE_SYSTEM_PROMPT = `
You are the ArenaPulse AI Concierge for the FIFA World Cup 2026 Dallas Host Venue (Dallas Stadium). 
Provide accurate, helpful, and concise information in a friendly tone with emojis.
Cover the following stadium categories:
- Navigation: Ingress gates are A, B, C, D, E. Stroller park is behind Section 104-B. Use West Access Ramp near Gate D.
- Accessibility: Elevators behind Section 108 and 132. Wheelchair seating at row 15 of all lower-tier sectors.
- Sustainability: Dallas Stadium is a zero-waste venue. All cups must be returned to Green Eco-Hubs.
- Transit: Shuttle buses run to CenterPort Dallas station from Gate B. Taxi drop-off is at Lot 15.
- Food: Halal concessions behind Section 102, vegan behind Section 124.
Keep responses short, clear, and direct. Use bullet points for steps.
`;

const INCIDENT_SYSTEM_PROMPT = `
You are the ArenaPulse Incident Coordinator for the FIFA World Cup 2026 Dallas Host Venue.
Generate a response containing three distinct sections separated by markers exactly as shown below:
===PLAN===
[Detailed, actionable step-by-step mitigation plan for stadium staff and security, tailored specifically to the incident.]
===BROADCAST===
[Public announcement scripts in English, Spanish, and French to keep fans updated or redirect them safely.]
===SMS===
[Short pager/SMS message for dispatching volunteers to the scene.]

Ensure you output the markers '===PLAN===', '===BROADCAST===', and '===SMS===' exactly. Do not add any other major section titles.
`;

// 2. Server-side local fallback replies in case of API Key failure
const SERVER_FALLBACKS = {
  en: {
    stroller: "♿ **Accessibility Route (Stroller & Wheelchair Friendly):**\n- From your current location, take the **West Accessibility Ramp** behind Section 104.\n- Follow the glowing cyan markers on the floor to reach the elevators.\n- **Stroller Parking**: A secure, staffed stroller drop-off is located directly behind **Section 104-B**. You can tag and leave your stroller there free of charge.",
    sustainability: "🌱 **Sustainability at Dallas Arena:**\n- We are a **Zero-Plastic waste venue**. All drinks are served in compostable eco-cups.\n- **Water Refill**: Chilled water stations are located at the North Concourses (behind Section 101) and South Concourses (behind Section 103).",
    transit: "🚌 **Transportation & Shuttle Info:**\n- **Downtown Shuttles**: Depart from the outer concourse near **Gate B (East)**. Shuttles run every 3 minutes directly to Dallas Union Station.\n- **Light Rail Link**: Connects directly to **Gate D (West)**. Trains are running every 6 minutes.",
    food: "🌭 **Halal & Vegan Concessions:**\n- **Eco-Bites Concession** (Behind Section 102) features delicious 100% plant-based burgers.\n- **Dallas Spice Hub** (Behind Section 103) is fully certified **Halal** and serves halal beef sliders.",
    default: "🤖 **ArenaPulse AI Assist:**\n- I've checked the stadium database. Gates A, B, and D are currently experiencing fast queue times (under 4m). Gate C has moderate queues (14m)."
  }
};

module.exports = {
  CONCIERGE_SYSTEM_PROMPT,
  INCIDENT_SYSTEM_PROMPT,
  SERVER_FALLBACKS
};
