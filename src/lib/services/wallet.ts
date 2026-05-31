import { prisma } from "@/lib/prisma";

// Mocking BalanceType since `npx prisma generate` cannot be run in this environment
export type BalanceType = "DEPOSIT" | "PURCHASE" | "REFUND" | "CASHBACK" | "BONUS" | "WITHDRAWAL";

/**
 * Get current wallet balance for a user.
 * If wallet doesn't exist, returns 0.
 */
export async function getWalletBalance(userId: string): Promise<number> {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    select: { balance: true },
  });
  return wallet?.balance ?? 0;
}

/**
 * Initialize a wallet for a user if it doesn't exist.
 */
export async function ensureWalletExists(userId: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    return prisma.wallet.create({ data: { userId, balance: 0 } });
  }
  return wallet;
}

/**
 * Credit the user's wallet (Add balance).
 * Ensures ACID compliance by using a Prisma transaction.
 */
export async function creditWallet(
  userId: string,
  amount: number,
  type: BalanceType,
  description?: string,
  referenceId?: string
) {
  if (amount <= 0) throw new Error("Amount must be greater than 0");

  return prisma.$transaction(async (tx: any) => {
    // 1. Get or create wallet
    const wallet = await tx.wallet.upsert({
      where: { userId },
      update: {},
      create: { userId, balance: 0 },
    });

    // 2. Add balance
    const updatedWallet = await tx.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });

    // 3. Record history
    const history = await tx.balanceHistory.create({
      data: {
        userId,
        type,
        amount,
        balanceBefore: wallet.balance,
        balanceAfter: updatedWallet.balance,
        description,
        referenceId,
      },
    });

    return { wallet: updatedWallet, history };
  });
}

/**
 * Debit the user's wallet (Subtract balance).
 * Throws error if insufficient balance. Ensures ACID compliance.
 */
export async function debitWallet(
  userId: string,
  amount: number,
  type: BalanceType,
  description?: string,
  referenceId?: string
) {
  if (amount <= 0) throw new Error("Amount must be greater than 0");

  return prisma.$transaction(async (tx: any) => {
    // 1. Get wallet and lock it for update (optional if DB supports atomic decrement without dropping below 0 easily, but we'll manually check)
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.balance < amount) {
      throw new Error("Insufficient wallet balance");
    }

    // 2. Subtract balance
    const updatedWallet = await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });

    // 3. Record history
    const history = await tx.balanceHistory.create({
      data: {
        userId,
        type,
        amount: -amount, // Record as negative for debits
        balanceBefore: wallet.balance,
        balanceAfter: updatedWallet.balance,
        description,
        referenceId,
      },
    });

    return { wallet: updatedWallet, history };
  });
}

/**
 * Step 5 (Wallet Ecosystem): Loyalty Cashback 
 * Gives dynamic cashback to the user's wallet based on their Gamification Membership Tier.
 */
export async function distributeCashback(transaction: import("./transaction").TransactionRecord) {
  const { getMembershipPerks } = await import("./gamification");
  
  const user = await prisma.user.findUnique({
    where: { id: transaction.userId },
    select: { membership: true }
  });

  const tier = (user?.membership as any) || "BRONZE";
  const { cashbackPercent } = getMembershipPerks(tier);

  const cashbackAmount = Math.floor(transaction.total * (cashbackPercent / 100));
  if (cashbackAmount > 0) {
    await creditWallet(
      transaction.userId,
      cashbackAmount,
      "CASHBACK",
      `Cashback ${cashbackPercent}% from ${transaction.invoiceId}`,
      transaction.invoiceId
    );
    console.log(`[Cashback] Awarded ${cashbackAmount} IDR to User ${transaction.userId}`);
  }
}
