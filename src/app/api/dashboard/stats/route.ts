import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Aggregations
    const aggregations = await prisma.transaction.aggregate({
      where: { userId: session.user.id, status: "SUCCESS" },
      _count: { id: true },
      _sum: { total: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { rewardPoints: true, membership: true },
    });

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
      select: { balance: true },
    });

    // 2. Recent Transactions
    const recent = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        product: { select: { name: true } },
        productItem: { select: { name: true } }
      }
    });

    const formattedRecent = recent.map(tx => ({
      id: tx.id,
      invoiceId: tx.invoiceId,
      game: tx.product?.name || "Unknown Product",
      product: tx.productItem?.name || "Unknown Item",
      amount: tx.total,
      status: tx.status,
      date: new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(tx.createdAt)
    }));

    // 3. Wallet History
    const walletHistoryRecords = await prisma.balanceHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const formattedWalletHistory = walletHistoryRecords.map(wh => ({
      id: wh.id,
      type: wh.type.toLowerCase(),
      amount: wh.type === 'DEPOSIT' || wh.type === 'CASHBACK' || wh.type === 'BONUS' || wh.type === 'REFUND' ? wh.amount : -wh.amount,
      date: new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(wh.createdAt),
      status: 'success'
    }));

    // 4. Favorite Games
    const favoriteGamesRecords = await prisma.favoriteGame.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        product: { select: { id: true, name: true, publisher: true, color: true, image: true } }
      }
    });
    
    const formattedFavoriteGames = favoriteGamesRecords.map(fg => ({
      id: fg.product.id,
      name: fg.product.name,
      publisher: fg.product.publisher || "Unknown",
      color: fg.product.color || "from-blue-500 to-indigo-600",
      image: fg.product.image || null,
    }));

    return NextResponse.json({
      stats: {
        totalTransactions: aggregations._count.id || 0,
        totalSpent: aggregations._sum.total || 0,
        rewardPoints: user?.rewardPoints || 0,
        membership: user?.membership || "BRONZE",
        walletBalance: wallet?.balance || 0,
      },
      recentTransactions: formattedRecent,
      walletHistory: formattedWalletHistory,
      favoriteGames: formattedFavoriteGames,
    });
  } catch (error) {
    console.error("[DASHBOARD_STATS]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
