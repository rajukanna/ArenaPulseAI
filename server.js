require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the root of the project
app.use(express.static(__dirname));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Helper function to call the Gemini API REST endpoint
async function callGemini(systemPrompt, userPrompt) {
  const activeKey = process.env.GEMINI_API_KEY || "";
  if (!activeKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${activeKey}`;
  const payload = {
    contents: [
      {
        parts: [
          {
            text: userPrompt
          }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        {
          text: systemPrompt
        }
      ]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800
    }
  };

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
    return data.candidates[0].content.parts[0].text;
  }
  throw new Error("Invalid response format from Gemini API");
}

// Chat API using Gemini
app.post('/api/chat', async (req, res) => {
  const { message, lang } = req.body;
  try {
    const systemPrompt = `You are ArenaPulse AI Concierge, a helpful stadium guide for the FIFA World Cup 2026 at Dallas Arena.
Assist fans with stadium navigation, concessions (including Halal, vegan, eco-friendly stands), transportation (buses at Gate B, rail at Gate D), accessibility (stroller parking behind Sec 104-B, wheelchair ramps), and sustainability (recycling hubs, chilled water stations behind Sec 101 and 103).
Respond concisely in the language the user speaks. Use friendly emojis.
Keep formatting clean and readable. Use basic bolding and lists.
If asked about stroller/wheelchair paths, mention Gate D or Section 104 ramp, and stroller parking behind Sec 104-B.
If asked about sustainability/water, mention eco-cups, recycling bins, and water refilling at Sec 101/103.
If asked about transit, mention Gate B for downtown shuttles (every 3 mins) and Gate D for light rail (every 6 mins).
Current user language selection is: ${lang || 'en'}.`;

    const reply = await callGemini(systemPrompt, message);
    res.json({
      status: 'success',
      response: reply
    });
  } catch (error) {
    console.error("Gemini Chat Error:", error.message);
    res.json({
      status: 'error',
      message: error.message
    });
  }
});

// Operations Incident Resolver API using Gemini
app.post('/api/resolve-incident', async (req, res) => {
  const { title, summary, location } = req.body;
  try {
    const systemPrompt = `You are ArenaPulse Incident Coordinator, a real-time stadium operations support AI for the FIFA World Cup 2026.
You will be provided with a stadium incident description.
Generate a response containing three distinct sections separated by markers exactly as shown below:
===PLAN===
[Detailed, actionable step-by-step mitigation plan for stadium staff and security, tailored specifically to the incident.]
===BROADCAST===
[Public announcement scripts in English, Spanish, and French to keep fans updated or redirect them safely.]
===SMS===
[Short pager/SMS message for dispatching volunteers to the scene.]

Ensure you output the markers '===PLAN===', '===BROADCAST===', and '===SMS===' exactly. Do not add any other major section titles.`;

    const userPrompt = `Incident Title: ${title}\nLocation: ${location}\nDetails: ${summary}`;
    
    const rawResult = await callGemini(systemPrompt, userPrompt);
    
    // Parse the output
    let plan = "";
    let broadcast = "";
    let sms = "";

    const planIndex = rawResult.indexOf("===PLAN===");
    const broadcastIndex = rawResult.indexOf("===BROADCAST===");
    const smsIndex = rawResult.indexOf("===SMS===");

    if (planIndex !== -1 && broadcastIndex !== -1) {
      plan = rawResult.substring(planIndex + 10, broadcastIndex).trim();
    }
    if (broadcastIndex !== -1 && smsIndex !== -1) {
      broadcast = rawResult.substring(broadcastIndex + 15, smsIndex).trim();
    }
    if (smsIndex !== -1) {
      sms = rawResult.substring(smsIndex + 9).trim();
    }

    // Fallback if parsing failed or text formats are incomplete
    if (!plan || !broadcast || !sms) {
      throw new Error("Unable to parse structured response sections from Gemini API output.");
    }

    res.json({
      status: 'success',
      plan,
      broadcast,
      sms
    });
  } catch (error) {
    console.error("Gemini Resolution Error:", error.message);
    res.json({
      status: 'error',
      message: error.message
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏟️  ArenaPulse AI Hub - FIFA World Cup 2026`);
    console.log(`🚀 Server is running at: http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
