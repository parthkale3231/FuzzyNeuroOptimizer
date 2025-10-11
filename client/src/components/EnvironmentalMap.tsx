import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation } from "lucide-react";
import { useState, useEffect } from "react";

interface MapLocation {
  lat: number;
  lng: number;
  name: string;
  status: "optimal" | "warning" | "critical";
}

interface EnvironmentalMapProps {
  userLocation?: { latitude: number; longitude: number };
}

export function EnvironmentalMap({ userLocation }: EnvironmentalMapProps) {
  const [locations] = useState<MapLocation[]>([
    { lat: 0, lng: 0, name: "Monitoring Station 1", status: "optimal" },
    { lat: 0.5, lng: 0.5, name: "Monitoring Station 2", status: "warning" },
    { lat: -0.5, lng: 0.5, name: "Monitoring Station 3", status: "critical" },
    { lat: 0.5, lng: -0.5, name: "Monitoring Station 4", status: "optimal" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-primary";
      case "warning":
        return "bg-chart-3";
      case "critical":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <Card data-testid="card-environmental-map">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Environmental Monitoring Points
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-muted/30 rounded-md p-8 h-[300px] overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-border/20" />
            ))}
          </div>

          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: "50%",
                top: "50%",
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-chart-2/20 rounded-full animate-ping" />
                <MapPin className="h-6 w-6 text-chart-2 relative z-10" />
                <Badge className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs">
                  Your Location
                </Badge>
              </div>
            </div>
          )}

          {locations.map((loc, idx) => (
            <div
              key={idx}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover-elevate rounded-full"
              style={{
                left: `${50 + loc.lng * 30}%`,
                top: `${50 + loc.lat * 30}%`,
              }}
            >
              <div
                className={`h-3 w-3 rounded-full ${getStatusColor(loc.status)} border-2 border-background`}
                title={loc.name}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Optimal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-3" />
            <span className="text-xs text-muted-foreground">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">Critical</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
