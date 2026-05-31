/**
 * MiqStore Enterprise Telemetry SDK
 * A unified interface bridging local development logs to Enterprise Observability stacks.
 * 
 * - Logger: Formats logs into JSON for Promtail/Loki ingestion.
 * - Metrics: Accumulates counters for Prometheus scraping.
 * - Tracing: Creates performance spans similar to OpenTelemetry.
 */

// ---------------------------------------------------------
// 1. Structured Logging (Loki-ready)
// ---------------------------------------------------------
type LogLevel = "info" | "warn" | "error" | "debug";

function formatLog(level: LogLevel, message: string, context?: Record<string, any>) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message,
    ...context,
  };
  
  // In a real environment, this goes to stdout for Promtail to scrape
  const output = JSON.stringify(logEntry);
  
  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  info: (msg: string, ctx?: Record<string, any>) => formatLog("info", msg, ctx),
  warn: (msg: string, ctx?: Record<string, any>) => formatLog("warn", msg, ctx),
  error: (msg: string, err?: unknown, ctx?: Record<string, unknown>) => {
    const errorDetails = err instanceof Error ? { error: err.message, stack: err.stack } : { error: String(err) };
    formatLog("error", msg, { ...ctx, ...errorDetails });
    // TODO: Connect to Sentry SDK here via @sentry/nextjs captureException
  },
  debug: (msg: string, ctx?: Record<string, any>) => {
    if (process.env.NODE_ENV !== "production") {
      formatLog("debug", msg, ctx);
    }
  },
};

// ---------------------------------------------------------
// 2. Metrics (Prometheus-ready)
// ---------------------------------------------------------
// Mock in-memory metric store. In production, use prom-client.
const metricStore: Record<string, number> = {};

export const metrics = {
  increment: (metricName: string, value: number = 1) => {
    if (!metricStore[metricName]) {
      metricStore[metricName] = 0;
    }
    metricStore[metricName] += value;
    // We could expose /api/metrics for Prometheus to scrape this
  },
  getMetrics: () => {
    return { ...metricStore };
  }
};

// ---------------------------------------------------------
// 3. Tracing (OpenTelemetry-ready)
// ---------------------------------------------------------
export const tracing = {
  startSpan: (operationName: string, context?: Record<string, any>) => {
    const startTime = Date.now();
    logger.debug(`[Trace Start] ${operationName}`, context);
    
    return {
      end: (status: "success" | "error" = "success") => {
        const duration = Date.now() - startTime;
        logger.info(`[Trace End] ${operationName}`, { ...context, durationMs: duration, status });
        
        // Also record the duration metric
        metrics.increment(`${operationName}_duration_ms`, duration);
        metrics.increment(`${operationName}_${status}`);
      }
    };
  }
};
