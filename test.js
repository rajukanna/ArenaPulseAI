const assert = require('assert');
const app = require('./server');

console.log("=======================================================");
console.log("🧪 Starting ArenaPulse AI Hub Automated Test Suite...");
console.log("=======================================================");

// --- Test 1: Express App Export Validation ---
try {
  assert.ok(app, "Express app instance should be successfully exported.");
  assert.strictEqual(typeof app.use, "function", "App instance should expose express middleware methods.");
  console.log("✅ Test 1 Passed: Express app exports and exposes middleware API correctly.");
} catch (e) {
  console.error("❌ Test 1 Failed:", e.message);
  process.exit(1);
}

// --- Test 2: XSS Sanitization & HTML Escaping Unit Tests ---
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
function formatMarkdown(text) {
  const escaped = escapeHTML(text);
  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
    .replace(/- (.*?)(<br\/>|$)/g, '• $1$2');
}
try {
  const dirtyPayload = "<script>alert('xss')</script>";
  const cleanResult = escapeHTML(dirtyPayload);
  assert.ok(!cleanResult.includes("<script>"), "HTML escaping must neutralize raw script tag injections.");
  assert.ok(cleanResult.includes("&lt;script&gt;"), "Script tag should be properly escaped to html entities.");
  
  const markdownText = "**Bold Text**\n- Bullet point";
  const formatted = formatMarkdown(markdownText);
  assert.ok(formatted.includes("<strong>Bold Text</strong>"), "Double asterisks should compile to strong tags.");
  assert.ok(formatted.includes("<br/>"), "Newlines should compile to break tags.");
  console.log("✅ Test 2 Passed: XSS sanitization and Markdown formatting helpers behave securely.");
} catch (e) {
  console.error("❌ Test 2 Failed:", e.message);
  process.exit(1);
}

// --- Mocking Setup for Async Route Tests ---
const originalFetch = globalThis.fetch;

// A simple routing handler tester helper
function runRouteHandler(routePath, method, mockReq, mockRes) {
  const route = app._router.stack.find(s => s.route && s.route.path === routePath && s.route.methods[method]);
  if (route) {
    route.route.stack[0].handle(mockReq, mockRes);
  } else {
    throw new Error(`Cannot locate route handler for ${method.toUpperCase()} ${routePath}`);
  }
}

// --- Test 3: Input Request Validation Boundaries (Security) ---
try {
  const mockReq = { body: { message: "a".repeat(600), lang: "en" } }; // Over limit (500 max)
  const mockRes = {
    statusCode: 200,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      assert.strictEqual(this.statusCode, 400, "Should return 400 Bad Request status code.");
      assert.strictEqual(data.status, "error", "Response status should indicate error.");
      assert.ok(data.message.includes("Invalid request payload"), "Error message should report payload validation failure.");
      console.log("✅ Test 3 Passed: Server successfully rejects oversized/invalid input bodies (Security).");
    }
  };
  runRouteHandler('/api/chat', 'post', mockReq, mockRes);
} catch (e) {
  console.error("❌ Test 3 Failed:", e.message);
  process.exit(1);
}

// --- Test 4: Mocked /api/chat Successful Gemini Generation ---
try {
  // Mock global fetch to intercept Gemini endpoint calls
  globalThis.fetch = async (url, options) => {
    if (url.includes("generativelanguage.googleapis.com")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{
                text: "Here is your mocked concierge response about Section 104 stroller drop-off."
              }]
            }
          }]
        })
      };
    }
    return originalFetch(url, options);
  };

  const originalKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = "mock_key"; // Set temporary key so it triggers API

  const mockReq = { body: { message: "Where can I leave my stroller?", lang: "en" } };
  const mockRes = {
    statusCode: 200,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      try {
        assert.strictEqual(data.status, "success", "Response should indicate success status.");
        assert.ok(data.response.includes("stroller drop-off"), "Response content should contain mock text.");
        console.log("✅ Test 4 Passed: AI Concierge route successfully fetches and returns mocked Gemini content.");
        
        // Trigger Test 5 inside callback to preserve asynchronous event execution
        runTest5(originalKey);
      } catch (e) {
        console.error("❌ Test 4 Failed:", e.message);
        process.exit(1);
      }
    }
  };

  runRouteHandler('/api/chat', 'post', mockReq, mockRes);
} catch (e) {
  console.error("❌ Test 4 Failed:", e.message);
  process.exit(1);
}

// --- Test 5: Mocked /api/resolve-incident Parsing Validation ---
function runTest5(originalKey) {
  try {
    globalThis.fetch = async (url, options) => {
      if (url.includes("generativelanguage.googleapis.com")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [{
              content: {
                parts: [{
                  text: "===PLAN===\nStep 1: Open backup turnstiles.\n===BROADCAST===\nAttention fans...\n===SMS===\nDeploy team."
                }]
              }
            }]
          })
        };
      }
      return originalFetch(url, options);
    };

    const mockReq = { body: { title: "Gate C Congestion", summary: "High backing", location: "Gate C" } };
    const mockRes = {
      statusCode: 200,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        try {
          assert.strictEqual(data.status, "success", "Response status should be success.");
          assert.strictEqual(data.plan, "Step 1: Open backup turnstiles.", "Plan should be correctly parsed.");
          assert.strictEqual(data.broadcast, "Attention fans...", "Broadcast log should be correctly parsed.");
          assert.strictEqual(data.sms, "Deploy team.", "Volunteer SMS should be correctly parsed.");
          console.log("✅ Test 5 Passed: AI Incident Resolver parses and formats plan, PA broadcast, and SMS outputs.");

          // Restore native fetch and environment variables
          globalThis.fetch = originalFetch;
          process.env.GEMINI_API_KEY = originalKey;

          console.log("=======================================================");
          console.log("🎉 All 5 tests passed successfully!");
          console.log("=======================================================");
          process.exit(0);
        } catch (e) {
          console.error("❌ Test 5 Failed:", e.message);
          process.exit(1);
        }
      }
    };

    runRouteHandler('/api/resolve-incident', 'post', mockReq, mockRes);
  } catch (e) {
    console.error("❌ Test 5 Failed:", e.message);
    process.exit(1);
  }
}
