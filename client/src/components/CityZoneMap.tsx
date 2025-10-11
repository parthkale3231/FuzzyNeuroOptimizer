import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

interface Zone {
  id: string;
  name: string;
  status: "optimal" | "warning" | "critical";
  temperature: number;
  pollution: number;
  traffic: number;
  latitude: number;
  longitude: number;
}

interface CityZoneMapProps {
  zones: Zone[];
}

function MapUpdater({ zones }: { zones: Zone[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (zones.length > 0) {
      const bounds = L.latLngBounds(zones.map(z => [z.latitude, z.longitude]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [zones, map]);
  
  return null;
}

export function CityZoneMap({ zones }: CityZoneMapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "#16a34a";
      case "warning":
        return "#f59e0b";
      case "critical":
        return "#dc2626";
      default:
        return "#9ca3af";
    }
  };

  const center: [number, number] = zones.length > 0 
    ? [zones[0].latitude, zones[0].longitude]
    : [51.5074, -0.1278];

  return (
    <Card data-testid="card-city-zones">
      <CardHeader>
        <CardTitle className="text-lg">City Zone Status Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md overflow-hidden mb-4">
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
            
            <MapUpdater zones={zones} />
            
            {zones.map((zone) => (
              <CircleMarker
                key={zone.id}
                center={[zone.latitude, zone.longitude]}
                radius={12}
                pathOptions={{
                  fillColor: getStatusColor(zone.status),
                  fillOpacity: 0.6,
                  color: getStatusColor(zone.status),
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-sm min-w-[150px]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <strong>{zone.name}</strong>
                      <Badge
                        variant={zone.status === "optimal" ? "default" : zone.status === "critical" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {zone.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Temperature:</span>
                        <span className="font-mono">{zone.temperature}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PM2.5:</span>
                        <span className="font-mono">{zone.pollution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Traffic:</span>
                        <span className="font-mono">{zone.traffic}%</span>
                      </div>
                      <div className="text-xs mt-1 pt-1 border-t">
                        {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
