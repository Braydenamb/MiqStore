import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type RecentUser = {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: string;
  createdAt: string;
};

export function RecentUsersWidget({ recentUsers }: { recentUsers: RecentUser[] }) {
  return (
    <Card className="h-full border-gray-100 shadow-sm rounded-2xl overflow-hidden flex flex-col">
      <CardHeader className="border-b border-gray-50 bg-white/50 px-6 py-5">
        <CardTitle className="text-lg font-bold font-heading text-[var(--color-navy)]">Recent Registrations</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-50">
          {recentUsers.map((user) => (
            <div key={user.id} className="p-4 sm:px-6 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
              <Avatar className="w-10 h-10 border border-gray-100">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--color-navy)] text-sm truncate">{user.name || "Unnamed User"}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                <Badge variant="secondary" className="text-[10px] py-0 font-semibold">{user.role}</Badge>
                <span className="text-[10px] text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {recentUsers.length === 0 && (
            <div className="p-6 text-center text-gray-500 text-sm">No recent users.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
