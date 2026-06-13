/**
 * Enterprise Reliability Engine
 * Provides Circuit Breaker and Exponential Backoff patterns to protect external API calls.
 */

import { logger } from "./telemetry";

export class CircuitBreakerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitBreakerError";
  }
}

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerOptions {
  failureThreshold?: number; // How many failures before tripping (default: 3)
  resetTimeoutMs?: number;   // How long to wait before trying again (default: 60000ms)
}

export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private nextAttempt = 0;

  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold || 3;
    this.resetTimeoutMs = options.resetTimeoutMs || 60000;
  }

  async fire<T>(action: () => Promise<T>): Promise<T> {
    const now = Date.now();

    if (this.state === "OPEN") {
      if (now < this.nextAttempt) {
        throw new CircuitBreakerError("Circuit breaker is OPEN. Fast-failing request.");
      }
      // Time has passed, transition to HALF_OPEN to test the waters
      this.state = "HALF_OPEN";
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  private onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.resetTimeoutMs;
      logger.warn(`CircuitBreaker tripped OPEN for ${this.resetTimeoutMs}ms`);
    }
  }

  getState() {
    return this.state;
  }
}

/**
 * Executes a promise with an exponential backoff retry strategy.
 */
export async function withRetry<T>(
  action: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 500
): Promise<T> {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await action();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) throw error;
      
      // Delay exponentially: 500ms -> 1000ms -> 2000ms
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      logger.info(`Retry attempt ${attempt} failed, waiting ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error("Retry limit exceeded");
}
