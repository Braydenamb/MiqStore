import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Tag, Users, Clock } from "lucide-react";
import Link from "next/link";

export function QuickActionsWidget() {
  const actions = [
    { label: "Add Product", icon: PlusCircle, href: "/admin/products/new", color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Add Promo", icon: Tag, href: "/admin/promos/new", color: "text-green-500", bg: "bg-green-50" },
    { label: "Manage Users", icon: Users, href: "/admin/users", color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Pending Orders", icon: Clock, href: "/admin/orders?status=pending", color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <Card className="h-full border-gray-100 shadow-sm rounded-2xl overflow-hidden flex flex-col">
      <CardHeader className="border-b border-gray-50 bg-white/50 px-6 py-5">
        <CardTitle className="text-lg font-bold font-heading text-[var(--color-navy)]">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-2 gap-4 flex-1">
        {actions.map((action, idx) => (
          <Button key={idx} variant="outline" className="h-auto flex flex-col items-center justify-center py-6 gap-3 rounded-xl border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all" asChild>
            <Link href={action.href}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.bg}`}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{action.label}</span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
