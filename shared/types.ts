export interface EnvironmentalData {
  temperature: number;
  humidity: number;
  pm25: number;
  co2: number;
  traffic: number;
  energy: number;
  water: number;
  windSpeed: number;
  zone: string;
}

export interface FuzzyRuleStatus {
  id: string;
  condition: string;
  action: string;
  isActive: boolean;
  confidence: number;
}

export interface ControlAction {
  id: string;
  time: string;
  action: string;
  type: "success" | "warning" | "info";
  zone: string;
}

export interface ZoneStatus {
  id: string;
  name: string;
  status: "optimal" | "warning" | "critical";
  temperature: number;
  pollution: number;
  traffic: number;
}

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface DashboardState {
  currentData: EnvironmentalData;
  fuzzyRules: FuzzyRuleStatus[];
  controlActions: ControlAction[];
  zones: ZoneStatus[];
  temperatureHistory: ChartDataPoint[];
  pollutionHistory: ChartDataPoint[];
  energyHistory: ChartDataPoint[];
}
