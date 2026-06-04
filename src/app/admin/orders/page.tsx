import { getAdminOrders } from "@/actions/admin-orders";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const result = await getAdminOrders(1, 20, "", "all");
  const initialData = result.success && result.data ? result.data : { orders: [], total: 0, totalPages: 0 };

  return <OrdersClient initialData={initialData} />;
}
