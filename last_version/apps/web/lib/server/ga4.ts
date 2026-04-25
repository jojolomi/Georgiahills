import crypto from "node:crypto";
import { serverLogger } from "./logger";

type GA4EventInput = {
  clientId?: string;
  eventName: string;
  params?: Record<string, unknown>;
  debug?: boolean;
};

function getGa4Config() {
  return {
    measurementId: process.env.GA4_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    apiSecret: process.env.GA4_API_SECRET || "",
    testEventCode: process.env.GA4_TEST_EVENT_CODE || ""
  };
}

function normalizeClientId(input?: string) {
  if (input && String(input).trim()) return String(input).trim();
  return `gh.${Date.now()}.${crypto.randomUUID().slice(0, 8)}`;
}

export async function sendGA4MeasurementEvent(input: GA4EventInput) {
  const config = getGa4Config();
  if (!config.measurementId || !config.apiSecret) {
    serverLogger.warn("analytics.ga4.skipped", {
      reason: "missing_config",
      eventName: input.eventName
    });
    return {
      sent: false,
      skipped: true,
      reason: "missing_config"
    };
  }

  const shouldDebug = Boolean(input.debug || config.testEventCode);
  const endpoint = shouldDebug
    ? "https://www.google-analytics.com/debug/mp/collect"
    : "https://www.google-analytics.com/mp/collect";

  const baseParams = [
    `measurement_id=${encodeURIComponent(config.measurementId)}`,
    `api_secret=${encodeURIComponent(config.apiSecret)}`
  ];
  if (config.testEventCode) {
    baseParams.push(`test_event_code=${encodeURIComponent(config.testEventCode)}`);
  }
  const url = `${endpoint}?${baseParams.join("&")}`;

  const payload: Record<string, unknown> = {
    client_id: normalizeClientId(input.clientId),
    events: [
      {
        name: input.eventName,
        params: {
          ...(input.params || {}),
          engagement_time_msec: Number((input.params || {}).engagement_time_msec || 100)
        }
      }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`GA4 request failed (${response.status}): ${errorBody.slice(0, 300)}`);
  }

  if (shouldDebug) {
    const debugResponse = await response.json().catch(() => ({}));
    return {
      sent: true,
      endpoint,
      debug: true,
      validationMessages: (debugResponse as { validationMessages?: unknown[] })?.validationMessages || []
    };
  }

  return {
    sent: true,
    endpoint,
    debug: false
  };
}
