import { CityZoneMap } from '../CityZoneMap';

export default function CityZoneMapExample() {
  const zones = [
    { id: "1", name: "Sector 1", status: "optimal" as const, temperature: 24, pollution: 35, traffic: 45 },
    { id: "2", name: "Sector 2", status: "optimal" as const, temperature: 25, pollution: 40, traffic: 50 },
    { id: "3", name: "Sector 3", status: "warning" as const, temperature: 28, pollution: 75, traffic: 65 },
    { id: "4", name: "Sector 4", status: "optimal" as const, temperature: 23, pollution: 30, traffic: 40 },
    { id: "5", name: "Sector 5", status: "critical" as const, temperature: 32, pollution: 95, traffic: 85 },
    { id: "6", name: "Sector 6", status: "warning" as const, temperature: 27, pollution: 68, traffic: 70 },
  ];

  return <CityZoneMap zones={zones} />;
}
