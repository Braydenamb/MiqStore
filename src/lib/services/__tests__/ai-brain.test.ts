import { describe, it, expect, vi, beforeEach } from 'vitest'
import { calculateFraudScore, analyzeChurnRisk } from '../ai-brain'
import { prisma } from '@/lib/prisma'

describe('AI Brain - Risk Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('returns low fraud score for normal velocity', async () => {
    // Mock 1 transaction in the last 10 minutes
    vi.mocked(prisma.transaction.count).mockResolvedValue(1);

    const score = await calculateFraudScore("user_1");
    
    expect(score).toBeLessThan(80);
    expect(score).toBeGreaterThanOrEqual(10); // Base minimum
  })

  it('spikes fraud score above 80 for extreme spam velocity', async () => {
    // Mock 5 transactions in the last 10 minutes (Velocity abuse)
    vi.mocked(prisma.transaction.count).mockResolvedValue(5);

    const score = await calculateFraudScore("user_spam");
    
    expect(score).toBeGreaterThanOrEqual(80);
  })
})

describe('AI Brain - Churn Predictor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('flags user as ACTIVE if last purchase was recent', async () => {
    // Mock last purchase 2 days ago
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 2);

    vi.mocked(prisma.transaction.findMany).mockResolvedValue([
      { completedAt: recentDate } as any
    ]);

    const result = await analyzeChurnRisk("user_active");
    expect(result.status).toBe("ACTIVE");
    expect(result.riskScore).toBeLessThan(50);
    expect(result.recommendedAction).toBe("NONE");
  })

  it('flags user as CHURNED if last purchase was 20 days ago', async () => {
    // Mock last purchase 20 days ago
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 20);

    vi.mocked(prisma.transaction.findMany).mockResolvedValue([
      { completedAt: oldDate } as any
    ]);

    const result = await analyzeChurnRisk("user_churn");
    expect(result.status).toBe("CHURNED");
    expect(result.riskScore).toBeGreaterThanOrEqual(80);
    expect(result.recommendedAction).toBe("ISSUE_10_PERCENT_PROMO");
  })
})
