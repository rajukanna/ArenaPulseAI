require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Import modular prompt templates and offline databases
const { CONCIERGE_SYSTEM_PROMPT, INCIDENT_SYSTEM_PROMPT } = require('./dataStore');

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

/**
 * Security: Validates string format, type, and size to mitigate DoS and XSS payloads.
 * @param {any} param - Variable to check.
 * @param {number} maxLen - Maximum allowed length.
 * @returns {boolean} True if input is valid.
 */
function isValidString(param, maxLen) {
  return typeof param === 'string' && param.trim().length > 0 && param.length <= maxLen;
}

// Chat API using Gemini
app.post('/api/chat', async (req, res) => {
  const { message, lang } = req.body;
  
  // Security input validation boundary
  if (!isValidString(message, 500) || (lang !== undefined && !isValidString(lang, 10))) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request payload: message must be a non-empty string under 500 characters.'
    });
  }

  try {
    // Append language-specific user constraints dynamically
    const dynamicPrompt = `${CONCIERGE_SYSTEM_PROMPT}\nActive User Language Constraint: ${lang || 'en'}.`;
    const reply = await callGemini(dynamicPrompt, message);
    
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

  // Security input validation boundary
  if (!isValidString(title, 500) || !isValidString(summary, 500) || !isValidString(location, 500)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request payload: parameters must be non-empty strings under 500 characters.'
    });
  }

  try {
    const userPrompt = `Incident Title: ${title}\nLocation: ${location}\nDetails: ${summary}`;
    const rawResult = await callGemini(INCIDENT_SYSTEM_PROMPT, userPrompt);
    
    // Parse structured tags
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
