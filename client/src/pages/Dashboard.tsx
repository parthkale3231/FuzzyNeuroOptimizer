import { MetricCard } from "@/components/MetricCard";
import { EnvironmentalChart } from "@/components/EnvironmentalChart";
import { FuzzyRuleCard } from "@/components/FuzzyRuleCard";
import { SystemArchitecture } from "@/components/SystemArchitecture";
import { ControlActionTimeline } from "@/components/ControlActionTimeline";
import { CityZoneMap } from "@/components/CityZoneMap";
import { StatsBanner } from "@/components/StatsBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocationStatus } from "@/components/LocationStatus";
import { LocationSearch } from "@/components/LocationSearch";
import { EnvironmentalMap } from "@/components/EnvironmentalMap";
import { useFNEEO } from "@/hooks/useFNEEO";
import { Thermometer, Droplets, Wind, Car, Zap, Droplet, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const { state, connected, updateLocation } = useFNEEO();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLocationUpdate = (latitude: number, longitude: number) => {
    setUserLocation({ latitude, longitude });
  };

  useEffect(() => {
    if (userLocation) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.latitude}&lon=${userLocation.longitude}`
      )
        .then(res => res.json())
        .then(data => {
          const city = data.address?.city || data.address?.town || data.address?.village || "Unknown";
          const country = data.address?.country || "";
          updateLocation(`${city}, ${country}`, userLocation.latitude, userLocation.longitude);
        })
        .catch(err => console.error('Error fetching location name:', err));
    }
  }, [userLocation, updateLocation]);

  const currentData = state?.currentData;
  const fuzzyRules = state?.fuzzyRules || [];
  const controlActions = state?.controlActions || [];
  const zones = state?.zones || [];
  const temperatureHistory = state?.temperatureHistory || [];
  const pollutionHistory = state?.pollutionHistory || [];
  const energyHistory = state?.energyHistory || [];

  const getMetricStatus = (value: number, thresholds: { warning: number; critical: number }): "normal" | "warning" | "critical" => {
    if (value >= thresholds.critical) return "critical";
    if (value >= thresholds.warning) return "warning";
    return "normal";
  };

  const getTrend = (history: any[], current: number): { trend: "up" | "down" | "stable"; value: string } => {
    if (history.length < 2) return { trend: "stable", value: "±0" };
    
    const previous = history[history.length - 2].value;
    const diff = current - previous;
    
    if (Math.abs(diff) < 1) return { trend: "stable", value: `±${Math.abs(diff).toFixed(1)}` };
    if (diff > 0) return { trend: "up", value: `+${diff.toFixed(1)}` };
    return { trend: "down", value: `${diff.toFixed(1)}` };
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                FNEEO
              </h1>
              <p className="text-xs text-muted-foreground">
                Smart Urban Climate Regulation
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className={`h-4 w-4 ${connected ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                <Badge variant={connected ? "default" : "secondary"} className="text-xs">
                  {connected ? 'Live' : 'Connecting...'}
                </Badge>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-mono" data-testid="text-current-time">
                  {currentTime.toLocaleTimeString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentTime.toLocaleDateString()}
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LocationStatus 
            location={userLocation} 
            onLocationUpdate={handleLocationUpdate}
          />
          <LocationSearch
            onLocationSelect={(lat, lng, name) => {
              handleLocationUpdate(lat, lng);
            }}
          />
        </div>
        
        <StatsBanner />

        {currentData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                title="Temperature"
                value={currentData.temperature.toFixed(1)}
                unit="°C"
                trend={getTrend(temperatureHistory, currentData.temperature).trend}
                trendValue={getTrend(temperatureHistory, currentData.temperature).value + "°C"}
                status={getMetricStatus(currentData.temperature, { warning: 27, critical: 30 })}
                icon={<Thermometer className="h-4 w-4" />}
              />
              <MetricCard
                title="Humidity"
                value={currentData.humidity.toFixed(0)}
                unit="%"
                trend="stable"
                trendValue="±1.2%"
                status="normal"
                icon={<Droplets className="h-4 w-4" />}
              />
              <MetricCard
                title="PM2.5"
                value={currentData.pm25.toFixed(0)}
                unit="μg/m³"
                trend={getTrend(pollutionHistory, currentData.pm25).trend}
                trendValue={getTrend(pollutionHistory, currentData.pm25).value}
                status={getMetricStatus(currentData.pm25, { warning: 60, critical: 80 })}
                icon={<Wind className="h-4 w-4" />}
              />
              <MetricCard
                title="Traffic Density"
                value={currentData.traffic.toFixed(0)}
                unit="%"
                trend="stable"
                trendValue="Live data"
                status={getMetricStatus(currentData.traffic, { warning: 65, critical: 80 })}
                icon={<Car className="h-4 w-4" />}
              />
              <MetricCard
                title="Energy Usage"
                value={currentData.energy.toFixed(0)}
                unit="MW"
                trend={getTrend(energyHistory, currentData.energy).trend}
                trendValue={getTrend(energyHistory, currentData.energy).value + " MW"}
                status={getMetricStatus(currentData.energy, { warning: 75, critical: 85 })}
                icon={<Zap className="h-4 w-4" />}
              />
              <MetricCard
                title="Water Usage"
                value={currentData.water.toFixed(1)}
                unit="ML/h"
                trend="stable"
                trendValue="Live data"
                status="normal"
                icon={<Droplet className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                {temperatureHistory.length > 0 && (
                  <EnvironmentalChart
                    title="Temperature Trend (Live)"
                    data={temperatureHistory}
                    color="hsl(var(--chart-1))"
                    unit="°C"
                  />
                )}
                {energyHistory.length > 0 && (
                  <EnvironmentalChart
                    title="Energy Consumption (Live)"
                    data={energyHistory}
                    color="hsl(var(--chart-3))"
                    unit="MW"
                  />
                )}
              </div>
              <div className="space-y-6">
                {pollutionHistory.length > 0 && (
                  <EnvironmentalChart
                    title="Air Quality Index (Live)"
                    data={pollutionHistory}
                    color="hsl(var(--chart-2))"
                    unit="AQI"
                  />
                )}
                <ControlActionTimeline actions={controlActions} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CityZoneMap zones={zones} />
              <EnvironmentalMap 
                userLocation={userLocation || undefined} 
                onLocationChange={handleLocationUpdate}
                zones={zones}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold font-display">Active Fuzzy Rules</h2>
                {fuzzyRules.map(rule => (
                  <FuzzyRuleCard
                    key={rule.id}
                    condition={rule.condition}
                    action={rule.action}
                    isActive={rule.isActive}
                    confidence={rule.confidence}
                  />
                ))}
              </div>
              <SystemArchitecture />
            </div>
          </>
        )}

        {!state && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Activity className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
              <p className="text-lg font-medium">Initializing FNEEO System...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Connecting to environmental sensors and fuzzy logic engine
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            FNEEO - Fuzzy-Neuro Environmental Equilibrium Optimizer © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
