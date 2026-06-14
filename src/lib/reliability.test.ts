import { describe, it, expect, vi } from 'vitest';
import { CircuitBreaker, CircuitBreakerError, withRetry } from './reliability';

describe('CircuitBreaker', () => {
  it('should start in CLOSED state and execute action successfully', async () => {
    const breaker = new CircuitBreaker();
    const action = vi.fn().mockResolvedValue('success');
    
    const result = await breaker.fire(action);
    
    expect(result).toBe('success');
    expect(breaker.getState()).toBe('CLOSED');
  });

  it('should trip to OPEN after threshold failures', async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2 });
    const action = vi.fn().mockRejectedValue(new Error('fail'));

    await expect(breaker.fire(action)).rejects.toThrow('fail');
    expect(breaker.getState()).toBe('CLOSED'); // 1 failure

    await expect(breaker.fire(action)).rejects.toThrow('fail');
    expect(breaker.getState()).toBe('OPEN'); // 2 failures (threshold reached)
    
    // 3rd attempt should fail fast with CircuitBreakerError
    await expect(breaker.fire(action)).rejects.toThrow(CircuitBreakerError);
  });
});

describe('withRetry', () => {
  it('should resolve immediately if action succeeds', async () => {
    const action = vi.fn().mockResolvedValue('ok');
    const result = await withRetry(action, 3, 10);
    expect(result).toBe('ok');
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and resolve if it eventually succeeds', async () => {
    const action = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockResolvedValueOnce('success');
      
    const result = await withRetry(action, 3, 10);
    expect(result).toBe('success');
    expect(action).toHaveBeenCalledTimes(2);
  });

  it('should throw the last error after max retries', async () => {
    const action = vi.fn().mockRejectedValue(new Error('fail'));
    await expect(withRetry(action, 3, 10)).rejects.toThrow('fail');
    expect(action).toHaveBeenCalledTimes(3);
  });
});
