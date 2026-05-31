import { describe, it, expect, vi } from 'vitest'
import { CircuitBreaker, CircuitBreakerError, withRetry } from '../../reliability'

describe('Circuit Breaker', () => {
  it('trips OPEN after threshold failures and resets after timeout', async () => {
    vi.useFakeTimers();
    
    // Set threshold to 2, wait time to 1000ms
    const breaker = new CircuitBreaker({ failureThreshold: 2, resetTimeoutMs: 1000 });
    
    const failAction = vi.fn().mockRejectedValue(new Error("API Down"));

    // Attempt 1: Fails, but Circuit is still CLOSED
    await expect(breaker.fire(failAction)).rejects.toThrow("API Down");
    expect(breaker.getState()).toBe("CLOSED");

    // Attempt 2: Fails, Circuit reaches threshold and trips OPEN
    await expect(breaker.fire(failAction)).rejects.toThrow("API Down");
    expect(breaker.getState()).toBe("OPEN");

    // Attempt 3: Circuit is OPEN, fast-fails immediately with custom error
    await expect(breaker.fire(failAction)).rejects.toThrow(CircuitBreakerError);

    // Fast-forward time past the resetTimeout
    vi.advanceTimersByTime(1500);

    // Attempt 4: Should transition to HALF_OPEN, attempt action, and fail again, reverting to OPEN
    await expect(breaker.fire(failAction)).rejects.toThrow("API Down");
    expect(breaker.getState()).toBe("OPEN");

    vi.useRealTimers();
  })
})

describe('Exponential Backoff Retry', () => {
  it('retries exactly maxRetries times before throwing', async () => {
    const action = vi.fn().mockRejectedValue(new Error("Timeout"));
    
    await expect(withRetry(action, 3, 10)).rejects.toThrow("Timeout");
    
    // Initial attempt + 2 retries = 3 total calls
    expect(action).toHaveBeenCalledTimes(3);
  })

  it('returns successful result if it recovers during retry', async () => {
    let attempts = 0;
    const action = vi.fn().mockImplementation(async () => {
      attempts++;
      if (attempts < 3) throw new Error("Temporary Error");
      return "SUCCESS";
    });

    const result = await withRetry(action, 3, 10);
    expect(result).toBe("SUCCESS");
    expect(action).toHaveBeenCalledTimes(3);
  })
})
