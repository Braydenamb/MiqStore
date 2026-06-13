import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/telemetry";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const role = session?.user?.role;
    if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build date ranges for last 7 days upfront
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const dStart = new Date();
      dStart.setDate(dStart.getDate() - (6 - i));
      dStart.setHours(0, 0, 0, 0);
      const dEnd = new Date(dStart);
      dEnd.setHours(23, 59, 59, 999);
      return { dStart, dEnd };
    });

    // ── Run ALL queries in parallel — replaces two serial for-loops ──────────
    const [
      todayRevenue,
      newUsers,
      allTxToday,
      recentTx,
      topSalesRaw,
      ...dailyRevenues
    ] = await Promise.all([
      // Today revenue & count
      prisma.transaction.aggregate({
        where: { status: "SUCCESS", createdAt: { gte: today } },
        _sum: { total: true },
        _count: { id: true },
      }),
      // New users today
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      // All transactions today (for success rate)
      prisma.transaction.count({ where: { createdAt: { gte: today } } }),
      // Recent orders
      prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { name: true } },
          product: { select: { name: true } },
          productItem: { select: { name: true } },
        },
      }),
      // Top sales groupBy
      prisma.transaction.groupBy({
        by: ["productId"],
        where: { status: "SUCCESS" },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      // Last 7 days revenue — all 7 in parallel (was a serial for-loop!)
      ...last7Days.map(({ dStart, dEnd }) =>
        prisma.transaction.aggregate({
          where: { status: "SUCCESS", createdAt: { gte: dStart, lte: dEnd } },
          _sum: { total: true },
        })
      ),
    ]);

    // ── Resolve top product names in ONE batch query (not N serial lookups!) ──
    const productIds = topSalesRaw
      .filter((s) => s.productId)
      .map((s) => s.productId as string);

    const topProductDetails = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    const productMap = new Map(topProductDetails.map((p) => [p.id, p.name]));
    const colors = [
      "var(--liquid-purple)",
      "var(--liquid-blue)",
      "var(--liquid-cyan)",
      "var(--liquid-pink)",
      "var(--liquid-indigo)",
    ];

    const topProducts = topSalesRaw.map((s, i) => ({
      name: productMap.get(s.productId ?? "") || "Unknown",
      sales: s._sum.quantity || 0,
      color: colors[i % colors.length],
    }));

    // ── Format results ────────────────────────────────────────────────────────
    const successTxToday = todayRevenue._count.id;
    const successRate =
      allTxToday > 0 ? (successTxToday / allTxToday) * 100 : 0;

    const formatter = new Intl.DateTimeFormat("id-ID", { timeStyle: "short" });
    const formattedRecentOrders = recentTx.map((tx) => ({
      id: tx.invoiceId,
      user: tx.user?.name || "Unknown",
      game: tx.product?.name || "Unknown Game",
      product: tx.productItem?.name || "Unknown Product",
      amount: tx.total,
      status: tx.status.toLowerCase(),
      time: formatter.format(tx.createdAt) + " WIB",
    }));

    const historicalRevenue = dailyRevenues.map((d) => d._sum.total || 0);

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
    logger.error("[ADMIN_STATS]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
