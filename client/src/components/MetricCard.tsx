import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "normal" | "warning" | "critical";
  icon: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  status = "normal",
  icon,
}: MetricCardProps) {
  const statusColors = {
    normal: "bg-primary/10 text-primary border-primary/20",
    warning: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    critical: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Card data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-md ${statusColors[status]}`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        {status !== "normal" && (
          <Badge variant={status === "critical" ? "destructive" : "secondary"} className="text-xs">
            {status}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono" data-testid={`text-value-${title.toLowerCase().replace(/\s+/g, "-")}`}>
                {value}
              </span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-1">
                {trend === "up" && <TrendingUp className="h-3 w-3 text-chart-3" />}
                {trend === "down" && <TrendingDown className="h-3 w-3 text-primary" />}
                {trend === "stable" && <Minus className="h-3 w-3 text-muted-foreground" />}
                <span className="text-xs text-muted-foreground">{trendValue}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
