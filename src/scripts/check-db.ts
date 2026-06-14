import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  console.log("Starting DB Integrity Check...");
  
  // 1. Transaction total validation
  const transactions = await prisma.transaction.findMany();
  let totalMismatches = 0;
  for (const t of transactions) {
    if (t.total !== t.price + t.fee - t.discount) {
      console.log(`Mismatch on Transaction ${t.invoiceId}: total=${t.total}, expected=${t.price + t.fee - t.discount}`);
      totalMismatches++;
    }
  }
  console.log(`Transaction Total Mismatches: ${totalMismatches}`);

  // 2. Status mismatches between Payment and Transaction
  const payments = await prisma.payment.findMany({
    include: { transaction: true }
  });
  let statusMismatches = 0;
  for (const p of payments) {
    if (!p.transaction) continue;
    if (p.status === 'PAID' && p.transaction.status === 'PENDING') {
      console.log(`Mismatch: Payment ${p.id} is PAID but Transaction ${p.transaction.invoiceId} is PENDING`);
      statusMismatches++;
    }
  }
  console.log(`Payment/Transaction Status Mismatches: ${statusMismatches}`);

  // 3. Stale Pending Transactions (> 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const staleTransactions = await prisma.transaction.count({
    where: {
      status: 'PENDING',
      createdAt: { lt: oneDayAgo }
    }
  });
  console.log(`Stale Pending Transactions (>24h): ${staleTransactions}`);

  // 4. Duplicate Provider Ref IDs (unless null)
  // using prisma client to find duplicates manually to avoid raw query parsing issues
  const providerRefs = await prisma.transaction.findMany({
    where: { providerRef: { not: null } },
    select: { providerRef: true }
  });
  const refCounts: Record<string, number> = {};
  for (const r of providerRefs) {
    const pr = r.providerRef!;
    refCounts[pr] = (refCounts[pr] || 0) + 1;
  }
  const duplicates = Object.entries(refCounts).filter(([k, v]) => v > 1);
  console.log(`Duplicate ProviderRefs:`, duplicates);

  console.log("Check complete.");
  await prisma.$disconnect();
}
check().catch(e => { console.error(e); process.exit(1); });
