import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-card border-border rounded-2xl border p-5 backdrop-blur-md">
      <Icon className="mb-4 h-6 w-6 text-violet-400" />

      <p className="text-muted-foreground text-sm">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </div>
  );
}
