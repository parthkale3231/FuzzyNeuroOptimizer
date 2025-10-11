export interface FuzzyRule {
  id: string;
  condition: string;
  action: string;
  evaluate: (data: EnvironmentalData) => { isActive: boolean; confidence: number };
  execute: (data: EnvironmentalData) => ControlAction | null;
}

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

export interface ControlAction {
  id: string;
  time: string;
  action: string;
  type: "success" | "warning" | "info";
  zone: string;
}

function fuzzyMembership(value: number, low: number, medium: number, high: number): { low: number; medium: number; high: number } {
  const lowValue = value <= low ? 1 : value >= medium ? 0 : (medium - value) / (medium - low);
  const mediumValue = value <= low ? 0 : value >= high ? 0 : value < medium ? (value - low) / (medium - low) : (high - value) / (high - medium);
  const highValue = value <= medium ? 0 : value >= high ? 1 : (value - medium) / (high - medium);
  
  return { low: lowValue, medium: mediumValue, high: highValue };
}

export const fuzzyRules: FuzzyRule[] = [
  {
    id: "rule1",
    condition: "Temperature HIGH AND Energy Usage HIGH",
    action: "Reduce building A/C output by 15%",
    evaluate: (data) => {
      const temp = fuzzyMembership(data.temperature, 20, 28, 35);
      const energy = fuzzyMembership(data.energy, 50, 75, 100);
      
      const confidence = Math.min(temp.high, energy.high) * 100;
      return {
        isActive: confidence > 50,
        confidence: Math.round(confidence)
      };
    },
    execute: (data) => {
      const eval_result = fuzzyRules[0].evaluate(data);
      if (!eval_result.isActive) return null;
      
      return {
        id: `action_${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        action: `Reduced A/C power in ${data.zone} by ${Math.round(12 + Math.random() * 6)}%`,
        type: "info",
        zone: data.zone
      };
    }
  },
  {
    id: "rule2",
    condition: "Pollution HIGH AND Traffic HIGH AND Wind LOW",
    action: "Activate air purifiers AND reroute traffic",
    evaluate: (data) => {
      const pollution = fuzzyMembership(data.pm25, 30, 70, 120);
      const traffic = fuzzyMembership(data.traffic, 30, 60, 90);
      const wind = fuzzyMembership(data.windSpeed, 0, 5, 15);
      
      const confidence = Math.min(pollution.high, traffic.high, wind.low) * 100;
      return {
        isActive: confidence > 50,
        confidence: Math.round(confidence)
      };
    },
    execute: (data) => {
      const eval_result = fuzzyRules[1].evaluate(data);
      if (!eval_result.isActive) return null;
      
      const actions = [
        `Activated rooftop air purifier drones in ${data.zone}`,
        `Traffic rerouted via alternate routes in ${data.zone}`,
        `Air quality monitoring increased in ${data.zone}`
      ];
      
      return {
        id: `action_${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        action: actions[Math.floor(Math.random() * actions.length)],
        type: "warning",
        zone: data.zone
      };
    }
  },
  {
    id: "rule3",
    condition: "Temperature VERY HIGH AND Humidity HIGH",
    action: "Activate cooling mist in high-traffic areas",
    evaluate: (data) => {
      const temp = fuzzyMembership(data.temperature, 20, 28, 35);
      const humidity = fuzzyMembership(data.humidity, 40, 65, 85);
      
      const confidence = Math.min(temp.high, humidity.high) * 100;
      return {
        isActive: confidence > 60,
        confidence: Math.round(confidence)
      };
    },
    execute: (data) => {
      const eval_result = fuzzyRules[2].evaluate(data);
      if (!eval_result.isActive) return null;
      
      return {
        id: `action_${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        action: `Activated cooling mist systems in ${data.zone}`,
        type: "success",
        zone: data.zone
      };
    }
  },
  {
    id: "rule4",
    condition: "Water Usage HIGH AND Temperature HIGH",
    action: "Optimize irrigation schedules",
    evaluate: (data) => {
      const water = fuzzyMembership(data.water, 0.5, 1.5, 2.5);
      const temp = fuzzyMembership(data.temperature, 20, 28, 35);
      
      const confidence = Math.min(water.high, temp.high) * 100;
      return {
        isActive: confidence > 55,
        confidence: Math.round(confidence)
      };
    },
    execute: (data) => {
      const eval_result = fuzzyRules[3].evaluate(data);
      if (!eval_result.isActive) return null;
      
      return {
        id: `action_${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        action: `Optimized irrigation schedule in ${data.zone}`,
        type: "info",
        zone: data.zone
      };
    }
  },
  {
    id: "rule5",
    condition: "Energy Usage CRITICAL AND Temperature HIGH",
    action: "Emergency load balancing",
    evaluate: (data) => {
      const energy = fuzzyMembership(data.energy, 50, 75, 100);
      const temp = fuzzyMembership(data.temperature, 20, 28, 35);
      
      const confidence = Math.min(energy.high, temp.high) * 100;
      return {
        isActive: confidence > 70,
        confidence: Math.round(confidence)
      };
    },
    execute: (data) => {
      const eval_result = fuzzyRules[4].evaluate(data);
      if (!eval_result.isActive) return null;
      
      return {
        id: `action_${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        action: `Emergency load balancing activated in ${data.zone}`,
        type: "warning",
        zone: data.zone
      };
    }
  }
];

export function evaluateAllRules(data: EnvironmentalData) {
  return fuzzyRules.map(rule => ({
    id: rule.id,
    condition: rule.condition,
    action: rule.action,
    ...rule.evaluate(data)
  }));
}

export function executeActiveRules(data: EnvironmentalData): ControlAction[] {
  const actions: ControlAction[] = [];
  
  for (const rule of fuzzyRules) {
    const evaluation = rule.evaluate(data);
    if (evaluation.isActive) {
      const action = rule.execute(data);
      if (action) {
        actions.push(action);
      }
    }
  }
  
  return actions;
}
