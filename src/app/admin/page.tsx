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

  const initialData = {
    totalRevenue,
    totalOrders,
    totalUsers,
    pendingOrders,
    recentOrders: mappedRecentOrders,
  };

  return <DashboardClient initialData={initialData} />;
}
