import { ControlActionTimeline } from '../ControlActionTimeline';

export default function ControlActionTimelineExample() {
  const actions = [
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
  ];

  return <ControlActionTimeline actions={actions} />;
}
