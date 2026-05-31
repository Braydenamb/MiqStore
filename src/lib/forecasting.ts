/**
 * Forecasting Utility
 * Uses simple linear regression to predict future data points
 * based on historical data.
 */

export function linearRegressionForecast(
  historicalData: number[],
  pointsToPredict: number
): number[] {
  if (historicalData.length < 2) return [];

  const n = historicalData.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += historicalData[i];
    sumXY += i * historicalData[i];
    sumX2 += i * i;
  }

  // Calculate slope (m) and intercept (b)
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Forecast future points
  const forecast: number[] = [];
  for (let i = n; i < n + pointsToPredict; i++) {
    let predictedValue = slope * i + intercept;
    
    // Add a slight randomization factor (±5%) to make the mock data look organic
    const organicFactor = 1 + (Math.random() * 0.1 - 0.05);
    predictedValue = Math.max(0, predictedValue * organicFactor); // Prevent negative revenue
    
    forecast.push(Math.round(predictedValue));
  }

  return forecast;
}
