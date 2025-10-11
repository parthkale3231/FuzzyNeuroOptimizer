import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, MousePointer2 } from "lucide-react";
import { useState } from "react";

interface MapLocation {
  lat: number;
  lng: number;
  name: string;
  status: "optimal" | "warning" | "critical";
}

interface EnvironmentalMapProps {
  userLocation?: { latitude: number; longitude: number };
  onLocationChange?: (lat: number, lng: number) => void;
}

export function EnvironmentalMap({ userLocation, onLocationChange }: EnvironmentalMapProps) {
  const [locations] = useState<MapLocation[]>([
    { lat: 0, lng: 0, name: "Monitoring Station 1", status: "optimal" },
    { lat: 0.5, lng: 0.5, name: "Monitoring Station 2", status: "warning" },
    { lat: -0.5, lng: 0.5, name: "Monitoring Station 3", status: "critical" },
    { lat: 0.5, lng: -0.5, name: "Monitoring Station 4", status: "optimal" },
  ]);
  const [isSelecting, setIsSelecting] = useState(false);

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

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting || !onLocationChange) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    
    const baseLat = userLocation?.latitude || 0;
    const baseLng = userLocation?.longitude || 0;
    
    const newLat = baseLat + (y * -0.1);
    const newLng = baseLng + (x * 0.1);
    
    onLocationChange(newLat, newLng);
    setIsSelecting(false);
  };

  return (
    <Card data-testid="card-environmental-map">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Environmental Monitoring Points
          </CardTitle>
          {onLocationChange && (
            <Button
              variant={isSelecting ? "default" : "outline"}
              size="sm"
              onClick={() => setIsSelecting(!isSelecting)}
              data-testid="button-select-location"
              className="gap-2"
            >
              <MousePointer2 className="h-4 w-4" />
              {isSelecting ? "Click on map" : "Select Location"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`relative bg-muted/30 rounded-md p-8 h-[300px] overflow-hidden ${
            isSelecting ? "cursor-crosshair" : ""
          }`}
          onClick={handleMapClick}
        >
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-border/20" />
            ))}
          </div>

          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
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
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover-elevate rounded-full pointer-events-none"
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
