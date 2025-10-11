import { Card } from "@/components/ui/card";
import { TrendingDown, Zap, Droplets, Wind } from "lucide-react";

const stats = [
  {
    icon: <TrendingDown className="h-5 w-5" />,
    label: "Pollution Reduced",
    value: "32%",
    color: "text-primary",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    label: "Energy Optimized",
    value: "18%",
    color: "text-chart-3",
  },
  {
    icon: <Droplets className="h-5 w-5" />,
    label: "Water Saved",
    value: "24%",
    color: "text-chart-2",
  },
  {
    icon: <Wind className="h-5 w-5" />,
    label: "Air Quality",
    value: "Good",
    color: "text-primary",
  },
];

export function StatsBanner() {
  return (
    <Card className="p-4" data-testid="card-stats-banner">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div className={`${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold font-mono">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
