import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Overview Stats
    // Today's Revenue
    const todayRevenue = await prisma.transaction.aggregate({
      where: {
        status: "SUCCESS",
        createdAt: { gte: today },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    // New Users Today
    const newUsers = await prisma.user.count({
      where: {
        createdAt: { gte: today },
      },
    });

    // Success Rate (All Time or Today)
    const allTxToday = await prisma.transaction.count({
      where: { createdAt: { gte: today } },
    });
    const successTxToday = todayRevenue._count.id;
    const successRate = allTxToday > 0 ? (successTxToday / allTxToday) * 100 : 0;

    // 2. Recent Orders
    const recentTx = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
        productItem: { select: { name: true } },
      },
    });

    const formattedRecentOrders = recentTx.map((tx) => ({
      id: tx.invoiceId,
      user: tx.user.name,
      game: tx.product?.name || "Unknown Game",
      product: tx.productItem?.name || "Unknown Product",
      amount: tx.total,
      status: tx.status.toLowerCase(),
      time: new Intl.DateTimeFormat('id-ID', { timeStyle: 'short' }).format(tx.createdAt) + " WIB",
    }));

    // 3. Top Products (Mocking the aggregation for now since SQLite/Prisma limits raw groupBy joins on relation)
    // Actually Prisma can groupBy productItemId.
    const topSales = await prisma.transaction.groupBy({
      by: ['productId'],
      where: { status: "SUCCESS" },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const topProducts = [];
    const colors = ["var(--liquid-purple)", "var(--liquid-blue)", "var(--liquid-cyan)", "var(--liquid-pink)", "var(--liquid-indigo)"];
    for (let i = 0; i < topSales.length; i++) {
      if (topSales[i].productId) {
        const prod = await prisma.product.findUnique({ where: { id: topSales[i].productId } });
        if (prod) {
          topProducts.push({
            name: prod.name,
            sales: topSales[i]._sum.quantity || 0,
            color: colors[i % colors.length],
          });
        }
      }
    }

    // 4. Historical Revenue (last 7 days)
    const historicalRevenue = [];
    for (let i = 6; i >= 0; i--) {
      const dStart = new Date();
      dStart.setDate(dStart.getDate() - i);
      dStart.setHours(0, 0, 0, 0);

      const dEnd = new Date(dStart);
      dEnd.setHours(23, 59, 59, 999);

      const dayRev = await prisma.transaction.aggregate({
        where: {
          status: "SUCCESS",
          createdAt: { gte: dStart, lte: dEnd },
        },
        _sum: { total: true },
      });
      historicalRevenue.push(dayRev._sum.total || 0);
    }

    return NextResponse.json({
      overview: {
        todayRevenue: todayRevenue._sum.total || 0,
        todayTx: todayRevenue._count.id || 0,
        newUsers,
        successRate: successRate.toFixed(1),
      },
      recentOrders: formattedRecentOrders,
      topProducts,
      historicalRevenue,
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
