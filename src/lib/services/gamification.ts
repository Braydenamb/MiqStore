import { prisma } from "@/lib/prisma";

/**
 * Mocking MembershipTier since `npx prisma generate` cannot be run in this environment
 */
export type MembershipTier = "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";

export interface GamificationState {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  progressPercent: number;
  tier: MembershipTier;
}

/**
 * 1 Reward Point = 10 XP
 * 
 * Leveling logic:
 * Level = floor(rewardPoints / 100) + 1
 * Max Level = 100
 */
export function calculateLevel(rewardPoints: number): GamificationState {
  const currentXP = rewardPoints * 10;
  
  // Calculate Level (Every 1000 XP = 1 Level)
  // Which means every 100 Reward Points = 1 Level
  const currentLevel = Math.min(Math.floor(rewardPoints / 100) + 1, 100);
  
  const xpForNextLevel = currentLevel * 1000;
  const xpInCurrentLevel = currentXP - ((currentLevel - 1) * 1000);
  const progressPercent = Math.min(Math.floor((xpInCurrentLevel / 1000) * 100), 100);

  let tier: MembershipTier = "BRONZE";
  if (currentLevel >= 50) tier = "DIAMOND";
  else if (currentLevel >= 25) tier = "GOLD";
  else if (currentLevel >= 10) tier = "SILVER";

  return {
    currentLevel,
    currentXP,
    xpForNextLevel,
    progressPercent,
    tier
  };
}

export function getMembershipPerks(tier: MembershipTier) {
  switch (tier) {
    case "DIAMOND":
      return { cashbackPercent: 3, prioritySupport: true, customBadge: true };
    case "GOLD":
      return { cashbackPercent: 2, prioritySupport: true, customBadge: false };
    case "SILVER":
      return { cashbackPercent: 1.5, prioritySupport: false, customBadge: false };
    case "BRONZE":
    default:
      return { cashbackPercent: 1, prioritySupport: false, customBadge: false };
  }
}

/**
 * Award XP based on transaction amount.
 * Rule: 1 Reward Point (10 XP) for every Rp 10.000 spent.
 */
export async function awardTransactionXP(userId: string, transactionTotal: number) {
  if (transactionTotal < 10000) return null;

  const pointsToAward = Math.floor(transactionTotal / 10000);
  if (pointsToAward === 0) return null;

  // Retrieve current user state
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { rewardPoints: true, membership: true }
  });

  if (!user) return null;

  const newPoints = user.rewardPoints + pointsToAward;
  
  // Calculate new tier
  const { tier: newTier } = calculateLevel(newPoints);

  // Update User
  // Note: We use `any` cast for membership since types might not match Prisma's generated types locally
  await prisma.user.update({
    where: { id: userId },
    data: { 
      rewardPoints: newPoints,
      membership: newTier as any 
    }
  });

  return {
    pointsAwarded: pointsToAward,
    newTotal: newPoints,
    tierUpgraded: user.membership !== newTier
  };
}
