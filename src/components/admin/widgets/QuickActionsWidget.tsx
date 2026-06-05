import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Tag, Users, Clock } from "lucide-react";
import Link from "next/link";

export function QuickActionsWidget() {
  const actions = [
    { label: "Add Product", icon: PlusCircle, href: "/admin/products/new", color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Add Promo", icon: Tag, href: "/admin/promos/new", color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Manage Users", icon: Users, href: "/admin/users", color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Pending Orders", icon: Clock, href: "/admin/orders?status=pending", color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <Card className="h-full bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-sm rounded-2xl overflow-hidden flex flex-col">
      <CardHeader className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-5">
        <CardTitle className="text-lg font-bold font-heading text-[hsl(var(--foreground))]">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-2 gap-4 flex-1">
        {actions.map((action, idx) => (
          <Button key={idx} variant="outline" className="h-auto flex flex-col items-center justify-center py-6 gap-3 rounded-xl border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--secondary))] transition-all bg-[hsl(var(--card))]" asChild>
            <Link href={action.href}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.bg}`}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{action.label}</span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
