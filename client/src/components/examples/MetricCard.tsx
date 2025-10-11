import { MetricCard } from '../MetricCard';
import { Thermometer } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <MetricCard
        title="Temperature"
        value="28.5"
        unit="°C"
        trend="up"
        trendValue="+2.3°C from avg"
        status="warning"
        icon={<Thermometer className="h-4 w-4" />}
      />
      <MetricCard
        title="Humidity"
        value="65"
        unit="%"
        trend="stable"
        trendValue="±0.5%"
        status="normal"
        icon={<Thermometer className="h-4 w-4" />}
      />
    </div>
  );
}
