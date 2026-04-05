type LogLevel = "info" | "warn" | "error";

type LogPayload = {
  event: string;
  message?: string;
  context?: Record<string, unknown>;
};

function write(level: LogLevel, payload: LogPayload) {
  const line = {
    level,
    timestamp: new Date().toISOString(),
    event: payload.event,
    message: payload.message || "",
    context: payload.context || {}
  };

  const body = JSON.stringify(line);
  if (level === "error") {
    console.error(body);
    return;
  }
  if (level === "warn") {
    console.warn(body);
    return;
  }
  console.log(body);
}

export const serverLogger = {
  info(event: string, context?: Record<string, unknown>, message?: string) {
    write("info", { event, message, context });
  },
  warn(event: string, context?: Record<string, unknown>, message?: string) {
    write("warn", { event, message, context });
  },
  error(event: string, context?: Record<string, unknown>, message?: string) {
    write("error", { event, message, context });
  }
};
