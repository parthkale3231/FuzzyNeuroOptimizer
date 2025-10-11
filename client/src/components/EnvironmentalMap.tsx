import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, MousePointer2 } from "lucide-react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { MonitoringPoint } from "@shared/types";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface EnvironmentalMapProps {
  userLocation?: { latitude: number; longitude: number };
  onLocationChange?: (lat: number, lng: number) => void;
  zones?: Array<{ id: string; name: string; latitude: number; longitude: number; status: string; temperature: number; pollution: number }>;
}

function LocationSelector({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export function EnvironmentalMap({ userLocation, onLocationChange, zones = [] }: EnvironmentalMapProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>([]);

  const center: [number, number] = userLocation 
    ? [userLocation.latitude, userLocation.longitude]
    : [51.5074, -0.1278];

  useEffect(() => {
    if (userLocation) {
      const points: MonitoringPoint[] = zones.map(zone => ({
        id: zone.id,
        name: zone.name,
        latitude: zone.latitude,
        longitude: zone.longitude,
        status: zone.status as "optimal" | "warning" | "critical",
        temperature: zone.temperature,
        pollution: zone.pollution
      }));
      setMonitoringPoints(points);
    }
  }, [zones, userLocation]);

  const getMarkerIcon = (status: string) => {
    const color = status === "optimal" ? "#16a34a" : status === "warning" ? "#f59e0b" : "#dc2626";
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  const userMarkerIcon = L.divIcon({
    className: 'user-marker',
    html: `<div style="position: relative;">
      <div style="width: 16px; height: 16px; background-color: #2563eb; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.3); animation: pulse 2s infinite;"></div>
    </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    if (onLocationChange && isSelecting) {
      onLocationChange(lat, lng);
      setIsSelecting(false);
    }
  };

  return (
    <Card data-testid="card-environmental-map">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Environmental Monitoring Map
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
        <div className={`rounded-md overflow-hidden ${isSelecting ? "cursor-crosshair" : ""}`}>
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {isSelecting && <LocationSelector onLocationSelect={handleLocationSelect} />}
            
            {userLocation && (
              <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userMarkerIcon}>
                <Popup>
                  <div className="text-sm">
                    <strong>Your Location</strong>
                    <div className="text-xs text-muted-foreground mt-1">
                      {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {monitoringPoints.map((point) => (
              <Marker 
                key={point.id} 
                position={[point.latitude, point.longitude]}
                icon={getMarkerIcon(point.status)}
              >
                <Popup>
                  <div className="text-sm min-w-[150px]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <strong>{point.name}</strong>
                      <Badge 
                        variant={point.status === "optimal" ? "default" : point.status === "critical" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {point.status}
                      </Badge>
                    </div>
                    {point.temperature !== undefined && (
                      <div className="text-xs text-muted-foreground">
                        Temp: {point.temperature}°C
                      </div>
                    )}
                    {point.pollution !== undefined && (
                      <div className="text-xs text-muted-foreground">
                        PM2.5: {point.pollution}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
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
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-2" />
            <span className="text-xs text-muted-foreground">Your Location</span>
          </div>
        </div>
      </CardContent>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
          }
        }
      `}</style>
    </Card>
  );
}
