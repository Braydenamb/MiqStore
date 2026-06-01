import { expect, test, describe } from 'vitest';
import { linearRegressionForecast } from './forecasting';

describe('linearRegressionForecast', () => {
  test('should return empty array if historical data has fewer than 2 points', () => {
    expect(linearRegressionForecast([100], 3)).toEqual([]);
    expect(linearRegressionForecast([], 3)).toEqual([]);
  });

  test('should generate the requested number of forecast points', () => {
    const data = [100, 200, 300, 400];
    const forecast = linearRegressionForecast(data, 5);
    expect(forecast).toHaveLength(5);
  });

  test('should predict future trends within acceptable organic variance', () => {
    const data = [100, 200, 300];
    const forecast = linearRegressionForecast(data, 3);
    
    // For perfect linear [100,200,300], next points should be ~400, ~500, ~600
    // Account for the +/- 5% organic randomization factor
    expect(forecast[0]).toBeGreaterThanOrEqual(380); // 400 * 0.95
    expect(forecast[0]).toBeLessThanOrEqual(420);    // 400 * 1.05
    
    expect(forecast[1]).toBeGreaterThanOrEqual(475); // 500 * 0.95
    expect(forecast[1]).toBeLessThanOrEqual(525);    // 500 * 1.05
  });

  test('should not return negative predictions', () => {
    const data = [1000, 100, 10]; // Rapid decline
    const forecast = linearRegressionForecast(data, 5);
    
    forecast.forEach(point => {
      expect(point).toBeGreaterThanOrEqual(0);
    });
  });
});
