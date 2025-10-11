import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  accuracy: number;
}

export function LocationStatus() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          setLocation({
            latitude,
            longitude,
            city: data.address?.city || data.address?.town || data.address?.village || "Unknown",
            country: data.address?.country || "Unknown",
            accuracy: Math.round(accuracy),
          });
        } catch (err) {
          setLocation({
            latitude,
            longitude,
            accuracy: Math.round(accuracy),
          });
        }
        
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Unable to retrieve location");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Card data-testid="card-location-status">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="shrink-0">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : error ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : (
                <MapPin className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {loading && (
                <p className="text-sm text-muted-foreground">Getting location...</p>
              )}
              {error && (
                <div>
                  <p className="text-sm font-medium text-destructive">Location Error</p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
              )}
              {location && !loading && !error && (
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium" data-testid="text-location-name">
                      {location.city && location.country
                        ? `${location.city}, ${location.country}`
                        : "Location Detected"}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      ±{location.accuracy}m
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-1" data-testid="text-coordinates">
                    {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                  </p>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={getLocation}
            disabled={loading}
            data-testid="button-refresh-location"
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
