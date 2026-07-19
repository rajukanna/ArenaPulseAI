const assert = require('assert');
const app = require('./server');

console.log("=======================================================");
console.log("🧪 Starting ArenaPulse AI Hub Automated Test Suite...");
console.log("=======================================================");

// Test 1: Express App Export Validation
try {
  assert.ok(app, "Express app instance should be successfully exported.");
  assert.strictEqual(typeof app.use, "function", "App instance should expose express middleware methods.");
  console.log("✅ Test 1 Passed: Express app exports and exposes middleware API correctly.");
} catch (e) {
  console.error("❌ Test 1 Failed:", e.message);
  process.exit(1);
}

// Test 2: Error Boundaries with Missing API Keys
// Simulate missing environment variable
const originalKey = process.env.GEMINI_API_KEY;
process.env.GEMINI_API_KEY = "";

const mockReq = { body: { message: "stroller route", lang: "en" } };
const mockRes = {
  json: function(data) {
    try {
      assert.strictEqual(data.status, "error", "Response status should indicate error when key is empty.");
      assert.ok(
        data.message.includes("GEMINI_API_KEY"),
        "Error logs should explicitly point out the missing GEMINI_API_KEY environment variable."
      );
      console.log("✅ Test 2 Passed: Server throws a secure boundary error when API Key is missing.");
      
      // Restore key
      process.env.GEMINI_API_KEY = originalKey;
      
      console.log("=======================================================");
      console.log("🎉 All 2 tests passed successfully!");
      console.log("=======================================================");
      process.exit(0);
    } catch (e) {
      console.error("❌ Test 2 Failed:", e.message);
      process.exit(1);
    }
  }
};

// Locate the route handler from Express router stacks
const chatRoute = app._router.stack.find(s => s.route && s.route.path === '/api/chat');
if (chatRoute) {
  chatRoute.route.stack[0].handle(mockReq, mockRes);
} else {
  console.error("❌ Test 2 Failed: Cannot locate '/api/chat' endpoint in Express stacks.");
  process.exit(1);
}
