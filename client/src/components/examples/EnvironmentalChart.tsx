import { EnvironmentalChart } from '../EnvironmentalChart';

export default function EnvironmentalChartExample() {
  const data = [
    { time: "00:00", value: 22 },
    { time: "04:00", value: 20 },
    { time: "08:00", value: 24 },
    { time: "12:00", value: 28 },
    { time: "16:00", value: 26 },
    { time: "20:00", value: 23 },
  ];

  return (
    <EnvironmentalChart
      title="Temperature Trend"
      data={data}
      color="hsl(var(--chart-1))"
      unit="°C"
    />
  );
}
