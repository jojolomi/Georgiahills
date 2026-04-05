const mock = require("./mock-firebase.js");
mock.setup();

const test = require("node:test");
const assert = require("node:assert/strict");

process.env.FIREBASE_CONFIG = process.env.FIREBASE_CONFIG || '{"storageBucket":"ci-bucket.appspot.com"}';
process.env.GCLOUD_PROJECT = process.env.GCLOUD_PROJECT || "ci-project";

let __test;
try {
  const mod = require("../index.js");
  __test = mod.__test;
} catch (e) {
  // index.js not found or failed to load
}

function makeReq(overrides = {}) {
  const headers = overrides.headers || {};
  return {
    path: overrides.path || "/booking",
    ip: overrides.ip || "127.0.0.1",
    get(name) {
      return headers[String(name || "").toLowerCase()] || "";
    }
  };
}

if (__test) {
test("sanitizeString trims and limits length", () => {
  const value = __test.sanitizeString("   hello world   ", 5);
  assert.equal(value, "hello");
});

test("sanitizeObject drops invalid keys and deeply sanitizes", () => {
  const input = {
    safe_key: "  value  ",
    "bad key": "nope",
    nested: {
      ok: "yes",
      "": "nope"
    }
  };
  const sanitized = __test.sanitizeObject(input);
  assert.deepEqual(sanitized, {
    safe_key: "value",
    nested: { ok: "yes" }
  });
});

test("roleFromToken and hasAnyRole map claims correctly", () => {
  assert.equal(__test.roleFromToken(null), "viewer");
  assert.equal(__test.roleFromToken({ role: "editor" }), "editor");
  assert.equal(__test.roleFromToken({ role: "admin" }), "admin");
  assert.equal(__test.roleFromToken({ admin: true }), "admin");
  assert.equal(__test.hasAnyRole({ role: "editor" }, ["admin", "editor"]), true);
  assert.equal(__test.hasAnyRole({ role: "viewer" }, ["admin", "editor"]), false);
});

test("stableHash is deterministic and fixed length", () => {
  const a = __test.stableHash("abc");
  const b = __test.stableHash("abc");
  assert.equal(a, b);
  assert.equal(a.length, 40);
});

test("extractLikelyMediaUrls finds image urls in nested data", () => {
  const input = {
    hero: {
      image: "https://cdn.example.com/a.webp",
      caption: "test"
    },
    blocks: ["https://cdn.example.com/b.jpg?x=1", "no-url"]
  };
  const found = __test.extractLikelyMediaUrls(input);
  assert.equal(found.includes("https://cdn.example.com/a.webp"), true);
  assert.equal(found.includes("https://cdn.example.com/b.jpg?x=1"), true);
});

test("buildBookingPayload rejects invalid payloads", () => {
  const req = makeReq({
    headers: { "user-agent": "test-agent" }
  });
  const parsed = __test.buildBookingPayload(
    { name: "A", phone: "12", service: "", consent: false },
    req
  );
  assert.equal(parsed.valid, false);
  assert.equal(parsed.message, "Consent is required");
});

test("buildBookingPayload accepts valid payload and normalizes language", () => {
  const req = makeReq({
    headers: { "user-agent": "test-agent" }
  });
  const parsed = __test.buildBookingPayload(
    {
      name: "John Doe",
      phone: "+995555123456",
      service: "Airport transfer",
      consent: true,
      sourceLang: "ar",
      sourcePage: "/booking-ar.html"
    },
    req
  );

  assert.equal(parsed.valid, true);
  assert.equal(parsed.payload.name, "John Doe");
  assert.equal(parsed.payload.phone, "+995555123456");
  assert.equal(parsed.payload.sourceLang, "ar");
  assert.equal(parsed.payload.status, "new");
  assert.ok(parsed.payload.createdAt);
});

test("looksLikeBotUserAgent flags automation signatures", () => {
  assert.equal(__test.looksLikeBotUserAgent("Mozilla/5.0"), false);
  assert.equal(__test.looksLikeBotUserAgent("python-requests/2.31"), true);
  assert.equal(__test.looksLikeBotUserAgent("Playwright/1.50"), true);
});

test("hasSuspiciousLeadText detects spam-like text", () => {
  assert.equal(__test.hasSuspiciousLeadText(["Family tour in Georgia"]), false);
  assert.equal(
    __test.hasSuspiciousLeadText(["Visit https://x.example and https://y.example now"]),
    true
  );
  assert.equal(__test.hasSuspiciousLeadText(["Free money crypto signal"]), true);
});

test("normalizePhoneForRateLimit keeps digits and trims length", () => {
  assert.equal(__test.normalizePhoneForRateLimit("+995 (555) 12-34-56"), "995555123456");
  assert.equal(__test.normalizePhoneForRateLimit("abc"), "");
});

test("buildDuplicateLeadKey is stable for same normalized payload", () => {
  const a = __test.buildDuplicateLeadKey({
    name: " John Doe ",
    phone: "+995 555 123456",
    dates: "May 1 - May 7",
    sourcePage: "/booking.html"
  });

  const b = __test.buildDuplicateLeadKey({
    name: "john doe",
    phone: "995555123456",
    dates: "May 1 - May 7",
    sourcePage: "/booking.html"
  });

  assert.equal(a, b);
  assert.equal(a.length, 40);
});

test("buildBookingPayload accepts suspicious text but keeps payload valid", () => {
  const suspiciousReq = makeReq({ headers: { "user-agent": "Mozilla/5.0" } });
  const suspicious = __test.buildBookingPayload(
    {
      name: "John Doe",
      phone: "+995555123456",
      service: "Airport transfer",
      notes: "Check https://a.example and https://b.example",
      consent: true
    },
    suspiciousReq
  );
  assert.equal(suspicious.valid, true);
});

test("extractClientMetadata sanitizes and constrains client values", () => {
  const req = makeReq({
    headers: {
      "accept-language": "en-US,en;q=0.9",
      referer: "https://www.georgiahills.com/booking"
    }
  });
  const meta = __test.extractClientMetadata(
    {
      clientMeta: {
        platform: "Win32",
        timezoneOffsetMinutes: -180,
        viewportWidth: 390.7,
        viewportHeight: 844.2,
        maxTouchPoints: 5
      }
    },
    req
  );

  assert.equal(meta.language, "en-us");
  assert.equal(meta.platform, "win32");
  assert.equal(meta.refererHost, "www.georgiahills.com");
  assert.equal(meta.timezoneOffsetMinutes, -180);
  assert.equal(meta.viewportWidth, 390);
  assert.equal(meta.viewportHeight, 844);
  assert.equal(meta.maxTouchPoints, 5);
});

test("computeLeadRiskProfile marks suspicious leads for review", () => {
  const profile = __test.computeLeadRiskProfile({
    name: "John",
    phone: "+995555123456",
    service: "Airport transfer",
    notes: "Check https://a.example and https://b.example free money",
    userAgent: "Mozilla/5.0"
  });

  assert.equal(profile.reviewRequired, true);
  assert.equal(profile.hardBlock, false);
  assert.equal(profile.score >= 40, true);
});

test("computeLeadRiskProfile hard-blocks bot user-agent", () => {
  const botReq = makeReq({ headers: { "user-agent": "python-requests/2.31" } });
  const bot = __test.buildBookingPayload(
    {
      name: "John Doe",
      phone: "+995555123456",
      service: "Airport transfer",
      consent: true
    },
    botReq
  );
  assert.equal(bot.valid, true);

  const profile = __test.computeLeadRiskProfile(bot.payload);
  assert.equal(profile.hardBlock, true);
  assert.equal(profile.level, "high");
});
} else {
  test("admin-core tests skipped", (t) => {
    t.skip("functions/index.js not found or __test not exported");
  });
}
