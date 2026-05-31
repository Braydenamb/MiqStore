import { prisma } from "@/lib/prisma";

export interface FraudAnalysis {
  score: number; // 0-100
  isSuspicious: boolean;
  reasons: string[];
}

/**
 * AI Risk Engine: Evaluates transaction velocity and patterns to detect fraud.
 */
export async function calculateFraudScore(userId: string): Promise<FraudAnalysis> {
  const analysis: FraudAnalysis = {
    score: 0,
    isSuspicious: false,
    reasons: [],
  };

  // 1. Velocity Check: >3 transactions in the last 10 minutes?
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  
  const recentTransactions = await prisma.transaction.count({
    where: {
      userId,
      createdAt: { gte: tenMinutesAgo },
    },
  });

  if (recentTransactions >= 3) {
    analysis.score += 60;
    analysis.reasons.push(`High Velocity: ${recentTransactions} transactions in 10 mins`);
  }

  // 2. High Value Anomaly Check (Mock logic for now)
  // If we had more time, we'd average their past transactions. 
  // For now, if score > 80, it's blocked.
  
  if (analysis.score >= 80) {
    analysis.isSuspicious = true;
  }

  return analysis;
}

/**
 * AI Churn Predictor: Calculates if a user is slipping away based on purchase gaps.
 */
export async function analyzeChurnRisk(userId: string): Promise<{ isHighRisk: boolean; daysSinceLastPurchase: number }> {
  const lastTransaction = await prisma.transaction.findFirst({
    where: { userId, status: "SUCCESS" },
    orderBy: { createdAt: "desc" },
  });

  if (!lastTransaction) {
    return { isHighRisk: false, daysSinceLastPurchase: 0 };
  }

  const daysSinceLastPurchase = Math.floor((Date.now() - lastTransaction.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  // If > 14 days, flag as high risk
  const isHighRisk = daysSinceLastPurchase > 14;

  return { isHighRisk, daysSinceLastPurchase };
}

/**
 * Auto-Mints a personalized retention promo code for high-risk churners.
 */
export async function triggerRetentionCampaign(userId: string) {
  const code = `COMEBACK-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  
  // Create a 10% discount promo
  await prisma.userPromo.create({
    data: {
      userId,
      promoCode: code,
      discountType: "PERCENTAGE",
      discountValue: 10,
      isUsed: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Valid for 7 days
    }
  });

  console.log(`[AI Brain] Minted 10% retention promo ${code} for user ${userId}`);
  return code;
}
