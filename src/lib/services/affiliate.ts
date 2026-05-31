import { prisma } from "@/lib/prisma";
import { creditWallet } from "./wallet";
import { type TransactionRecord } from "./transaction";

/**
 * Generates a unique 6-character referral code for a user.
 */
export async function generateReferralCode(userId: string): Promise<string> {
  // Generate random 6 character alphanumeric code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // In production: ensure code is strictly unique before saving, retry if collision
  
  await prisma.user.update({
    where: { id: userId },
    data: { referralCode: code }
  });

  return code;
}

/**
 * Step 6 (Affiliate Ecosystem): Affiliate Commissions
 * Distributes a 0.5% commission to the user who referred the buyer.
 */
export async function distributeAffiliateCommission(transaction: TransactionRecord) {
  // 1. Look up the buyer to see if they were referred by someone
  const buyer = await prisma.user.findUnique({
    where: { id: transaction.userId },
    select: { referredBy: true }
  });

  if (!buyer || !buyer.referredBy) {
    return; // Buyer wasn't referred by anyone, exit early
  }

  // 2. Look up the referrer's user ID using the referral code
  const referrer = await prisma.user.findUnique({
    where: { referralCode: buyer.referredBy },
    select: { id: true, name: true }
  });

  if (!referrer) {
    console.warn(`[Affiliate] Referral code ${buyer.referredBy} not found for transaction ${transaction.invoiceId}`);
    return;
  }

  // 3. Calculate Commission (0.5%)
  const commissionAmount = Math.floor(transaction.total * 0.005);
  
  if (commissionAmount <= 0) {
    return; // Amount too small to commission
  }

  // 4. Pay the referrer directly to their wallet as a BONUS balance
  await creditWallet(
    referrer.id,
    commissionAmount,
    "BONUS",
    `Affiliate Commission (0.5%) from transaction ${transaction.invoiceId}`,
    transaction.invoiceId
  );

  console.log(`[Affiliate] Paid Rp${commissionAmount} commission to ${referrer.name} (ID: ${referrer.id})`);
}
