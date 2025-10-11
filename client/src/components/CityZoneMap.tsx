import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Zone {
  id: string;
  name: string;
  status: "optimal" | "warning" | "critical";
  temperature: number;
  pollution: number;
  traffic: number;
}

interface CityZoneMapProps {
  zones: Zone[];
}

export function CityZoneMap({ zones }: CityZoneMapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-primary/20 border-primary hover:bg-primary/30";
      case "warning":
        return "bg-chart-3/20 border-chart-3 hover:bg-chart-3/30";
      case "critical":
        return "bg-destructive/20 border-destructive hover:bg-destructive/30";
      default:
        return "bg-muted border-border";
    }
  };

  return (
    <Card data-testid="card-city-zones">
      <CardHeader>
        <CardTitle className="text-lg">City Zone Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`p-4 rounded-md border-2 transition-all cursor-pointer ${getStatusColor(
                zone.status
              )}`}
              data-testid={`zone-${zone.id}`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-semibold text-sm">{zone.name}</h4>
                <Badge
                  variant={zone.status === "optimal" ? "default" : zone.status === "critical" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {zone.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Temp</span>
                  <span className="font-mono">{zone.temperature}°C</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">PM2.5</span>
                  <span className="font-mono">{zone.pollution}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Traffic</span>
                  <span className="font-mono">{zone.traffic}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
