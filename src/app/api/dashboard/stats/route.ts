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

    const userId = session.user.id;

    // Run all queries in PARALLEL — much faster than serial await
    const [aggregations, user, wallet, recent, walletHistoryRecords, favoriteGamesRecords] =
      await Promise.all([
        prisma.transaction.aggregate({
          where: { userId, status: "SUCCESS" },
          _count: { id: true },
          _sum: { total: true },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { rewardPoints: true, membership: true },
        }),
        prisma.wallet.findUnique({
          where: { userId },
          select: { balance: true },
        }),
        prisma.transaction.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            product: { select: { name: true } },
            productItem: { select: { name: true } },
          },
        }),
        prisma.balanceHistory.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        prisma.favoriteGame.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 4,
          include: {
            product: { select: { id: true, name: true, publisher: true, color: true, image: true } },
          },
        }),
      ]);

    const formatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "long" });

    const formattedRecent = recent.map((tx) => ({
      id: tx.id,
      invoiceId: tx.invoiceId,
      game: tx.product?.name || "Unknown Product",
      product: tx.productItem?.name || "Unknown Item",
      amount: tx.total,
      status: tx.status,
      date: formatter.format(tx.createdAt),
    }));

    const formattedWalletHistory = walletHistoryRecords.map((wh) => ({
      id: wh.id,
      type: wh.type.toLowerCase(),
      amount:
        wh.type === "DEPOSIT" || wh.type === "CASHBACK" || wh.type === "BONUS" || wh.type === "REFUND"
          ? wh.amount
          : -wh.amount,
      date: formatter.format(wh.createdAt),
      status: "success",
    }));

    const formattedFavoriteGames = favoriteGamesRecords.map((fg) => ({
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
