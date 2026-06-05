import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic"; // Ensure fresh data on dashboard

export default async function AdminDashboardPage() {
  // 1. Fetch Total Revenue (Success transactions)
  const revenueAgg = await prisma.transaction.aggregate({
    _sum: { total: true },
    where: { status: "SUCCESS" },
  });
  const totalRevenue = revenueAgg._sum.total || 0;

  // 2. Fetch Total Orders
  const totalOrders = await prisma.transaction.count();

  // 3. Fetch Total Users
  const totalUsers = await prisma.user.count();

  // 4. Fetch Pending Orders
  const pendingOrders = await prisma.transaction.count({
    where: { status: "PENDING" },
  });

  // 5. Fetch Recent Orders (last 5)
  const recentTransactions = await prisma.transaction.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
      product: {
        select: { name: true },
      },
      productItem: {
        select: { name: true },
      },
    },
  });

  // Map transactions to the format expected by the client
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

  // 6. Fetch Top Products
  const topProductsRaw = await prisma.transaction.groupBy({
    by: ['productId'],
    _count: { productId: true },
    _sum: { total: true },
    where: { status: "SUCCESS" },
    orderBy: { _count: { productId: 'desc' } },
    take: 5,
  });

  // Since groupBy doesn't include relations, we fetch product details separately
  const topProductIds = topProductsRaw.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, image: true },
  });

  const topProducts = topProductsRaw.map((p) => {
    const product = products.find((prod) => prod.id === p.productId);
    return {
      id: p.productId,
      name: product?.name || "Unknown Product",
      image: product?.image || null,
      sales: p._count.productId,
      revenue: p._sum.total || 0,
    };
  });

  // 7. Fetch Recent Users
  const recentUsers = await prisma.user.findMany({
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
  });

  // 8. Mock Chart Data (Last 7 Days)
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
    totalRevenue,
    totalOrders,
    totalUsers,
    pendingOrders,
    recentOrders: mappedRecentOrders,
    topProducts,
    recentUsers: recentUsers.map(u => ({
      ...u,
      createdAt: u.createdAt.toISOString()
    })),
    chartData,
  };

  return <DashboardClient initialData={initialData} />;
}
