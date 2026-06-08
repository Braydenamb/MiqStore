import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // ── Today's range ──────────────────────────────────────────────────────────
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // ── Parallel fetch all data ────────────────────────────────────────────────
  const [
    revenueAgg,
    totalOrders,
    totalUsers,
    pendingOrders,
    // Today's metrics
    revenueTodayAgg,
    ordersTodayCount,
    successTodayCount,
    // Catalog stats
    totalGames,
    totalItems,
    // Recent transactions
    recentTransactions,
    // Top products
    topProductsRaw,
    // Recent users
    recentUsers,
  ] = await Promise.all([
    // All-time revenue (SUCCESS)
    prisma.transaction.aggregate({
      _sum: { total: true },
      where: { status: "SUCCESS" },
    }),
    // All-time orders
    prisma.transaction.count(),
    // All users
    prisma.user.count(),
    // Pending
    prisma.transaction.count({ where: { status: "PENDING" } }),
    // Today revenue
    prisma.transaction.aggregate({
      _sum: { total: true },
      where: { status: "SUCCESS", createdAt: { gte: todayStart, lte: todayEnd } },
    }),
    // Today orders (all statuses)
    prisma.transaction.count({
      where: { createdAt: { gte: todayStart, lte: todayEnd } },
    }),
    // Today success orders
    prisma.transaction.count({
      where: { status: "SUCCESS", createdAt: { gte: todayStart, lte: todayEnd } },
    }),
    // Total games
    prisma.product.count(),
    // Total items
    prisma.productItem.count(),
    // Recent transactions
    prisma.transaction.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true } },
        productItem: { select: { name: true } },
      },
    }),
    // Top products by sales
    prisma.transaction.groupBy({
      by: ["productId"],
      _count: { productId: true },
      _sum: { total: true },
      where: { status: "SUCCESS" },
      orderBy: { _count: { productId: "desc" } },
      take: 5,
    }),
    // Recent users
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  // Map recent transactions
  const mappedRecentOrders = recentTransactions.map((tx) => ({
    id: tx.invoiceId,
    user: tx.user?.name || tx.user?.email || "Unknown User",
    game: tx.product.name,
    product: tx.productItem.name,
    total: tx.total,
    status: tx.status.toLowerCase(),
    date: new Date(tx.createdAt).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    }),
  }));

  // Fetch product names for top products
  const topProductIds = topProductsRaw.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, image: true },
  });

  const topProducts = topProductsRaw.map((p) => {
    const product = products.find((prod) => prod.id === p.productId);
    return {
      id: p.productId,
      name: product?.name || "Unknown",
      image: product?.image || null,
      sales: p._count.productId,
      revenue: p._sum.total || 0,
    };
  });

  // Calculate today's success rate
  const successRateToday =
    ordersTodayCount > 0
      ? Math.round((successTodayCount / ordersTodayCount) * 1000) / 10
      : 0;

  // Mock chart data (Last 7 Days)
  const chartData = [
    { name: "Mon", revenue: 4000000 },
    { name: "Tue", revenue: 3000000 },
    { name: "Wed", revenue: 5000000 },
    { name: "Thu", revenue: 2780000 },
    { name: "Fri", revenue: 6890000 },
    { name: "Sat", revenue: 8390000 },
    { name: "Sun", revenue: 9490000 },
  ];

  const initialData = {
    // All-time stats
    totalRevenue: revenueAgg._sum.total || 0,
    totalOrders,
    totalUsers,
    pendingOrders,
    // Today's stats
    revenueTodayStats: revenueTodayAgg._sum.total || 0,
    ordersToday: ordersTodayCount,
    successRateToday,
    // Catalog stats
    totalGames,
    totalItems,
    // Lists
    recentOrders: mappedRecentOrders,
    topProducts,
    recentUsers: recentUsers.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
    })),
    chartData,
  };

  return <DashboardClient initialData={initialData} />;
}
