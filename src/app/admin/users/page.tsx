import { getAdminUsers } from "@/actions/admin-users";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const result = await getAdminUsers(1, 10, "", "all");
  
  const initialData = result.success && result.data ? result.data : { 
    users: [], 
    total: 0, 
    totalPages: 0,
    stats: { total: 0, reseller: 0, admin: 0, active: 0 }
  };

  return <UsersClient initialData={initialData} />;
}
