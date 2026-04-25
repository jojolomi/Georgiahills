const mock = require("./mock-firebase.js");
mock.setup();

const test = require("node:test");
const assert = require("node:assert/strict");

process.env.FIREBASE_CONFIG = process.env.FIREBASE_CONFIG || '{"storageBucket":"ci-bucket.appspot.com"}';
process.env.GCLOUD_PROJECT = process.env.GCLOUD_PROJECT || "ci-project";

const { __test } = require("../index.js");

test("getAdminAllowedOrigins does not fall back to ALLOWED_ORIGINS", () => {
  const originalAdmin = process.env.ADMIN_ALLOWED_ORIGINS;
  const originalAllowed = process.env.ALLOWED_ORIGINS;

  try {
    process.env.ADMIN_ALLOWED_ORIGINS = "";
    process.env.ALLOWED_ORIGINS = "https://malicious.com";

    const origins = __test.getAdminAllowedOrigins();

    // Should NOT contain malicious.com
    assert.strictEqual(origins.includes("https://malicious.com"), false);

    // Should contain default origins
    assert.strictEqual(origins.includes("https://georgiahills.com"), true);

    process.env.ADMIN_ALLOWED_ORIGINS = "https://trusted-admin.com";
    const originsWithAdmin = __test.getAdminAllowedOrigins();
    assert.strictEqual(originsWithAdmin.includes("https://trusted-admin.com"), true);
    assert.strictEqual(originsWithAdmin.includes("https://malicious.com"), false);

  } finally {
    process.env.ADMIN_ALLOWED_ORIGINS = originalAdmin;
    process.env.ALLOWED_ORIGINS = originalAllowed;
  }
});

test("applyCors uses the provided allowedOrigins list", () => {
  const mockReq = {
    get: (header) => {
      if (header.toLowerCase() === "origin") return "https://custom.com";
      return "";
    }
  };

  const headers = {};
  const mockRes = {
    set: (name, value) => {
      headers[name] = value;
    }
  };

  // Case 1: custom.com is NOT in the provided list
  const allowed1 = __test.applyCors(mockReq, mockRes, "POST", ["https://only-this.com"]);
  assert.strictEqual(allowed1, false);
  assert.strictEqual(headers["Access-Control-Allow-Origin"], undefined);

  // Case 2: custom.com IS in the provided list
  const allowed2 = __test.applyCors(mockReq, mockRes, "POST", ["https://custom.com"]);
  assert.strictEqual(allowed2, true);
  assert.strictEqual(headers["Access-Control-Allow-Origin"], "https://custom.com");
  assert.strictEqual(headers["Vary"], "Origin");
});

test("getAllowedOrigins still uses ALLOWED_ORIGINS", () => {
  const originalAllowed = process.env.ALLOWED_ORIGINS;
  try {
    process.env.ALLOWED_ORIGINS = "https://public-site.com";
    const origins = __test.getAllowedOrigins();
    assert.strictEqual(origins.includes("https://public-site.com"), true);
  } finally {
    process.env.ALLOWED_ORIGINS = originalAllowed;
  }
});
