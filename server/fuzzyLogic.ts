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
    condition: "Temperature MEDIUM-HIGH OR Energy Usage HIGH",
    action: "Optimize A/C and cooling systems",
    evaluate: (data) => {
      const temp = fuzzyMembership(data.temperature, 15, 24, 32);
      const energy = fuzzyMembership(data.energy, 40, 65, 90);
      
      const confidence = Math.max(temp.high * 0.7, energy.high, Math.min(temp.medium, energy.high)) * 100;
      return {
        isActive: confidence > 20,
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
    condition: "Pollution HIGH AND Traffic HIGH",
    action: "Activate air purifiers AND reroute traffic",
    evaluate: (data) => {
      const pollution = fuzzyMembership(data.pm25, 25, 50, 100);
      const traffic = fuzzyMembership(data.traffic, 40, 65, 90);
      
      const confidence = Math.min(pollution.high, traffic.high) * 100;
      return {
        isActive: confidence > 25,
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
    condition: "Temperature HIGH AND Humidity HIGH",
    action: "Activate cooling mist in high-traffic areas",
    evaluate: (data) => {
      const temp = fuzzyMembership(data.temperature, 18, 26, 35);
      const humidity = fuzzyMembership(data.humidity, 50, 70, 90);
      
      const confidence = Math.min(temp.high, humidity.high) * 100;
      return {
        isActive: confidence > 35,
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
    condition: "Water Usage HIGH",
    action: "Optimize irrigation schedules",
    evaluate: (data) => {
      const water = fuzzyMembership(data.water, 0.6, 1.0, 1.8);
      
      const confidence = water.high * 100;
      return {
        isActive: confidence > 30,
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
    condition: "Energy Usage HIGH",
    action: "Load balancing optimization",
    evaluate: (data) => {
      const energy = fuzzyMembership(data.energy, 50, 75, 95);
      
      const confidence = energy.high * 100;
      return {
        isActive: confidence > 40,
        confidence: Math.round(confidence)
      };
    },
    execute: (data) => {
      const eval_result = fuzzyRules[4].evaluate(data);
      if (!eval_result.isActive) return null;
      
      return {
        id: `action_${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        action: `Load balancing optimized in ${data.zone}`,
        type: "warning",
        zone: data.zone
      };
    }
  },
  {
    id: "rule6",
    condition: "Temperature LOW AND Wind HIGH",
    action: "Adjust ventilation systems",
    evaluate: (data) => {
      const temp = fuzzyMembership(data.temperature, 10, 20, 28);
      const wind = fuzzyMembership(data.windSpeed, 5, 12, 20);
      
      const confidence = Math.min(temp.low, wind.high) * 100;
      return {
        isActive: confidence > 25,
        confidence: Math.round(confidence)
      };
    },
    execute: (data) => {
      const eval_result = fuzzyRules[5].evaluate(data);
      if (!eval_result.isActive) return null;
      
      return {
        id: `action_${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        action: `Natural ventilation systems adjusted in ${data.zone}`,
        type: "success",
        zone: data.zone
      };
    }
  },
  {
    id: "rule7",
    condition: "Traffic MEDIUM-HIGH",
    action: "Optimize traffic signals",
    evaluate: (data) => {
      const traffic = fuzzyMembership(data.traffic, 30, 60, 85);
      
      const confidence = Math.max(traffic.high, traffic.medium * 0.8) * 100;
      return {
        isActive: confidence > 25,
        confidence: Math.round(confidence)
      };
    },
    execute: (data) => {
      const eval_result = fuzzyRules[6].evaluate(data);
      if (!eval_result.isActive) return null;
      
      const actions = [
        `Smart traffic lights synchronized in ${data.zone}`,
        `Green wave corridors activated in ${data.zone}`,
        `Real-time traffic optimization enabled in ${data.zone}`
      ];
      
      return {
        id: `action_${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        action: actions[Math.floor(Math.random() * actions.length)],
        type: "info",
        zone: data.zone
      };
    }
  },
  {
    id: "rule8",
    condition: "Humidity LOW AND Temperature HIGH",
    action: "Activate humidification systems",
    evaluate: (data) => {
      const humidity = fuzzyMembership(data.humidity, 30, 50, 70);
      const temp = fuzzyMembership(data.temperature, 20, 28, 36);
      
      const confidence = Math.min(humidity.low, temp.high) * 100;
      return {
        isActive: confidence > 30,
        confidence: Math.round(confidence)
      };
    },
    execute: (data) => {
      const eval_result = fuzzyRules[7].evaluate(data);
      if (!eval_result.isActive) return null;
      
      return {
        id: `action_${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        action: `Humidification systems activated in ${data.zone}`,
        type: "success",
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

let actionCounter = 0;

export function executeActiveRules(data: EnvironmentalData): ControlAction[] {
  const actions: ControlAction[] = [];
  const baseTimestamp = Date.now();
  
  for (const rule of fuzzyRules) {
    const evaluation = rule.evaluate(data);
    if (evaluation.isActive) {
      const action = rule.execute(data);
      if (action) {
        actions.push({
          ...action,
          id: `action_${baseTimestamp}_${actionCounter++}`
        });
      }
    }
  }
  
  return actions;
}
