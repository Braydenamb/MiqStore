import { redirect } from "next/navigation";

// Voucher system removed — discount handled directly on product pages
export default function VouchersPage() {
  redirect("/dashboard");
}
