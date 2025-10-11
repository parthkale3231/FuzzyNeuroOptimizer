import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface ControlAction {
  id: string;
  time: string;
  action: string;
  type: "success" | "warning" | "info";
  zone: string;
}

interface ControlActionTimelineProps {
  actions: ControlAction[];
}

export function ControlActionTimeline({ actions }: ControlActionTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-chart-3" />;
      default:
        return <Info className="h-4 w-4 text-chart-2" />;
    }
  };

  return (
    <Card data-testid="card-control-timeline">
      <CardHeader>
        <CardTitle className="text-lg">Recent Control Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {actions.map((action) => (
              <div
                key={action.id}
                className="flex gap-3 p-3 rounded-md bg-muted/30 hover-elevate"
                data-testid={`action-${action.id}`}
              >
                <div className="shrink-0 mt-0.5">{getIcon(action.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground">
                      {action.time}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {action.zone}
                    </Badge>
                  </div>
                  <p className="text-sm mt-1">{action.action}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
