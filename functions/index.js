const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

function sanitizeString(value = "", max = 200) {
  return String(value || "").trim().slice(0, max);
}

function buildBookingPayload(input = {}, req) {
  const name = sanitizeString(input.name, 120);
  const phone = sanitizeString(input.phone, 40);
  const passengers = sanitizeString(input.passengers, 20);
  const vehicle = sanitizeString(input.vehicle, 40);
  const service = sanitizeString(input.service, 80);
  const dates = sanitizeString(input.dates, 120);
  const duration = sanitizeString(input.duration, 40);
  const price = sanitizeString(input.price, 40);
  const notes = sanitizeString(input.notes, 1000);
  const sourcePage = sanitizeString(input.sourcePage || req.path, 200);
  const sourceLang = input.sourceLang === "ar" ? "ar" : "en";

  if (name.length < 2) return { valid: false, message: "Invalid name" };
  if (phone.length < 4) return { valid: false, message: "Invalid phone" };
  if (service.length < 2) return { valid: false, message: "Invalid service" };

  return {
    valid: true,
    payload: {
      name,
      phone,
      passengers,
      vehicle,
      service,
      dates,
      duration,
      price,
      notes,
      sourcePage,
      sourceLang,
      status: "new",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  };
}

exports.createBookingLead = onRequest(
  {
    region: "europe-west1",
    timeoutSeconds: 30,
    memory: "256MiB"
  },
  async (req, res) => {
    const origin = req.get("origin") || "";
    const allowedOrigins = [
      "https://georgiahills.com",
      "https://www.georgiahills.com",
      "http://localhost:5000",
      "http://127.0.0.1:5000"
    ];
    const originAllowed = !origin || allowedOrigins.includes(origin);

    if (originAllowed && origin) {
      res.set("Access-Control-Allow-Origin", origin);
      res.set("Vary", "Origin");
    }
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");

    if (req.method === "OPTIONS") {
      res.status(originAllowed ? 204 : 403).send("");
      return;
    }

    if (!originAllowed) {
      res.status(403).json({ ok: false, error: "origin_not_allowed" });
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ ok: false, error: "method_not_allowed" });
      return;
    }

    const parsed = buildBookingPayload(req.body || {}, req);
    if (!parsed.valid) {
      res.status(400).json({ ok: false, error: "invalid_payload", message: parsed.message });
      return;
    }

    try {
      const ref = await admin.firestore().collection("bookings").add(parsed.payload);
      res.status(201).json({ ok: true, id: ref.id });
    } catch (error) {
      logger.error("Failed to create booking lead", { error: error.message });
      res.status(500).json({ ok: false, error: "server_error" });
    }
  }
);

exports.notifyNewBooking = onDocumentCreated(
  {
    document: "bookings/{bookingId}",
    region: "europe-west1",
    timeoutSeconds: 60,
    memory: "256MiB"
  },
  async (event) => {
    const bookingId = event.params.bookingId;
    const snapshot = event.data;
    if (!snapshot) return;

    const booking = snapshot.data() || {};
    logger.info("New booking created", { bookingId, booking });
  }
);
