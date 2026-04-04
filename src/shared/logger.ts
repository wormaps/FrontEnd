type JsonPrimitive = string | number | boolean | null;

type JsonObject = {
  [key: string]: JsonValue;
};

type JsonArray = JsonValue[];

type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type LogContext = Record<string, JsonValue | undefined>;

type LogLevel = "debug" | "info" | "warn" | "error";

type LogMethod = (message: string, context?: LogContext) => void;

export type Logger = {
  scope: string;
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  child: (scope: string) => Logger;
};

const LOG_LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function resolveLogLevel(): LogLevel {
  const publicLevel = process.env.NEXT_PUBLIC_LOG_LEVEL?.toLowerCase();
  const serverLevel =
    typeof window === "undefined" ? process.env.LOG_LEVEL?.toLowerCase() : undefined;
  const configuredLevel = publicLevel ?? serverLevel;

  if (
    configuredLevel === "debug" ||
    configuredLevel === "info" ||
    configuredLevel === "warn" ||
    configuredLevel === "error"
  ) {
    return configuredLevel;
  }

  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

const MIN_LOG_LEVEL = resolveLogLevel();

const LOG_SINK: Record<LogLevel, (message?: unknown, ...optionalParams: unknown[]) => void> = {
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

function shouldLog(level: LogLevel) {
  return LOG_LEVEL_WEIGHT[level] >= LOG_LEVEL_WEIGHT[MIN_LOG_LEVEL];
}

function toErrorLikeContext(error: unknown): JsonValue {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack ?? null,
    };
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown error";
}

function emitLog(level: LogLevel, scope: string, message: string, context?: LogContext) {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    ts: new Date().toISOString(),
    level,
    scope,
    message,
    context,
  };

  try {
    LOG_SINK[level](JSON.stringify(payload));
  } catch (error) {
    const fallback = {
      ts: payload.ts,
      level,
      scope,
      message,
      context: {
        fallbackReason: "Failed to serialize structured log payload",
        serializationError: toErrorLikeContext(error),
      },
    };
    LOG_SINK[level](JSON.stringify(fallback));
  }
}

export function toErrorContext(error: unknown): LogContext {
  return {
    error: toErrorLikeContext(error),
  };
}

export function createLogger(scope: string): Logger {
  const write = (level: LogLevel): LogMethod => {
    return (message, context) => {
      emitLog(level, scope, message, context);
    };
  };

  return {
    scope,
    debug: write("debug"),
    info: write("info"),
    warn: write("warn"),
    error: write("error"),
    child: (childScope: string) => createLogger(`${scope}:${childScope}`),
  };
}

export const logger = createLogger("app");
