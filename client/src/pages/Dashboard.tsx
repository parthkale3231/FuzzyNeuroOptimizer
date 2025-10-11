import { MetricCard } from "@/components/MetricCard";
import { EnvironmentalChart } from "@/components/EnvironmentalChart";
import { FuzzyRuleCard } from "@/components/FuzzyRuleCard";
import { SystemArchitecture } from "@/components/SystemArchitecture";
import { ControlActionTimeline } from "@/components/ControlActionTimeline";
import { CityZoneMap } from "@/components/CityZoneMap";
import { StatsBanner } from "@/components/StatsBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Thermometer, Droplets, Wind, Car, Zap, Droplet } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // todo: remove mock functionality
  const temperatureData = [
    { time: "00:00", value: 22 },
    { time: "04:00", value: 20 },
    { time: "08:00", value: 24 },
    { time: "12:00", value: 28 },
    { time: "16:00", value: 30 },
    { time: "20:00", value: 26 },
  ];

  const pollutionData = [
    { time: "00:00", value: 35 },
    { time: "04:00", value: 30 },
    { time: "08:00", value: 65 },
    { time: "12:00", value: 85 },
    { time: "16:00", value: 90 },
    { time: "20:00", value: 70 },
  ];

  const energyData = [
    { time: "00:00", value: 45 },
    { time: "04:00", value: 38 },
    { time: "08:00", value: 72 },
    { time: "12:00", value: 88 },
    { time: "16:00", value: 82 },
    { time: "20:00", value: 65 },
  ];

  const controlActions = [
    {
      id: "1",
      time: "14:32",
      action: "Activated cooling mist in high-traffic areas",
      type: "success" as const,
      zone: "Sector 5",
    },
    {
      id: "2",
      time: "14:28",
      action: "Reduced A/C power in office clusters by 12%",
      type: "info" as const,
      zone: "Sector 3",
    },
    {
      id: "3",
      time: "14:25",
      action: "Traffic rerouted via alternate routes",
      type: "warning" as const,
      zone: "Sector 5",
    },
    {
      id: "4",
      time: "14:20",
      action: "Activated rooftop air purifier drones",
      type: "success" as const,
      zone: "Sector 5",
    },
    {
      id: "5",
      time: "14:15",
      action: "Increased water mist spray intervals",
      type: "info" as const,
      zone: "Sector 2",
    },
  ];

  const zones = [
    { id: "1", name: "Sector 1", status: "optimal" as const, temperature: 24, pollution: 35, traffic: 45 },
    { id: "2", name: "Sector 2", status: "optimal" as const, temperature: 25, pollution: 40, traffic: 50 },
    { id: "3", name: "Sector 3", status: "warning" as const, temperature: 28, pollution: 75, traffic: 65 },
    { id: "4", name: "Sector 4", status: "optimal" as const, temperature: 23, pollution: 30, traffic: 40 },
    { id: "5", name: "Sector 5", status: "critical" as const, temperature: 32, pollution: 95, traffic: 85 },
    { id: "6", name: "Sector 6", status: "warning" as const, temperature: 27, pollution: 68, traffic: 70 },
  ];

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
        <StatsBanner />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Temperature"
            value="30.2"
            unit="°C"
            trend="up"
            trendValue="+3.2°C from avg"
            status="warning"
            icon={<Thermometer className="h-4 w-4" />}
          />
          <MetricCard
            title="Humidity"
            value="68"
            unit="%"
            trend="stable"
            trendValue="±1.2%"
            status="normal"
            icon={<Droplets className="h-4 w-4" />}
          />
          <MetricCard
            title="PM2.5"
            value="90"
            unit="μg/m³"
            trend="up"
            trendValue="+25 from avg"
            status="critical"
            icon={<Wind className="h-4 w-4" />}
          />
          <MetricCard
            title="Traffic Density"
            value="85"
            unit="%"
            trend="up"
            trendValue="+15%"
            status="critical"
            icon={<Car className="h-4 w-4" />}
          />
          <MetricCard
            title="Energy Usage"
            value="88"
            unit="MW"
            trend="up"
            trendValue="+8 MW"
            status="warning"
            icon={<Zap className="h-4 w-4" />}
          />
          <MetricCard
            title="Water Usage"
            value="1.2"
            unit="ML/h"
            trend="down"
            trendValue="-0.3 ML/h"
            status="normal"
            icon={<Droplet className="h-4 w-4" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <EnvironmentalChart
              title="Temperature Trend (24h)"
              data={temperatureData}
              color="hsl(var(--chart-1))"
              unit="°C"
            />
            <EnvironmentalChart
              title="Energy Consumption (24h)"
              data={energyData}
              color="hsl(var(--chart-3))"
              unit="MW"
            />
          </div>
          <div className="space-y-6">
            <EnvironmentalChart
              title="Air Quality Index (24h)"
              data={pollutionData}
              color="hsl(var(--chart-2))"
              unit="AQI"
            />
            <ControlActionTimeline actions={controlActions} />
          </div>
        </div>

        <CityZoneMap zones={zones} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold font-display">Active Fuzzy Rules</h2>
            <FuzzyRuleCard
              condition="Temperature HIGH AND Energy Usage HIGH"
              action="Reduce building A/C output by 15%"
              isActive={true}
              confidence={87}
            />
            <FuzzyRuleCard
              condition="Pollution HIGH AND Traffic HIGH AND Wind LOW"
              action="Activate air purifiers AND reroute traffic"
              isActive={true}
              confidence={92}
            />
            <FuzzyRuleCard
              condition="Water Usage HIGH AND Temperature HIGH"
              action="Optimize irrigation schedules"
              isActive={false}
              confidence={0}
            />
          </div>
          <SystemArchitecture />
        </div>
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
