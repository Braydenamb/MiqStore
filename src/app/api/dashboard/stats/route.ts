import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
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
      select: { rewardPoints: true },
    });

    // 2. Recent Transactions
    const recent = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      stats: {
        totalTransactions: aggregations._count.id || 0,
        totalSpent: aggregations._sum.total || 0,
        rewardPoints: user?.rewardPoints || 0,
      },
      recentTransactions: recent,
    });
  } catch (error) {
    console.error("[DASHBOARD_STATS]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
