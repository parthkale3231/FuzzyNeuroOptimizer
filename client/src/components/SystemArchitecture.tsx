import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown } from "lucide-react";

const layers = [
  {
    name: "Input Layer",
    description: "IoT sensors, weather stations, traffic monitors",
    color: "bg-chart-2/20 border-chart-2/40",
  },
  {
    name: "Fuzzy Reasoning",
    description: "Adaptive membership functions & rule evaluation",
    color: "bg-chart-1/20 border-chart-1/40",
  },
  {
    name: "Neuro-Optimization",
    description: "Neural network learns optimal rule weights",
    color: "bg-chart-4/20 border-chart-4/40",
  },
  {
    name: "Genetic Adaptation",
    description: "Evolves fuzzy rules for seasonal patterns",
    color: "bg-chart-3/20 border-chart-3/40",
  },
  {
    name: "Decision Output",
    description: "Control signals to city infrastructure",
    color: "bg-chart-5/20 border-chart-5/40",
  },
];

export function SystemArchitecture() {
  return (
    <Card data-testid="card-system-architecture">
      <CardHeader>
        <CardTitle>FNEEO System Architecture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {layers.map((layer, index) => (
            <div key={layer.name} className="space-y-2">
              <div
                className={`p-4 rounded-md border ${layer.color} transition-all hover-elevate`}
              >
                <h4 className="font-semibold text-sm">{layer.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{layer.description}</p>
              </div>
              {index < layers.length - 1 && (
                <div className="flex justify-center">
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
