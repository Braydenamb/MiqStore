import { getAdminProducts } from "@/actions/admin-products";
import ProductsClient from "./ProductsClient";

export default async function AdminProductsPage() {
  const result = await getAdminProducts();
  const initialProducts = result.success && result.data ? result.data : [];

  return <ProductsClient initialProducts={initialProducts as any} />;
}
