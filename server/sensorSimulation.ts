import { EnvironmentalData } from "./fuzzyLogic";

export class SensorSimulator {
  private baseData: EnvironmentalData;
  private timeOffset: number = 0;

  constructor(zone: string = "Sector 1") {
    this.baseData = {
      temperature: 25,
      humidity: 60,
      pm25: 45,
      co2: 400,
      traffic: 50,
      energy: 70,
      water: 1.0,
      windSpeed: 5,
      zone
    };
  }

  setZone(zone: string) {
    this.baseData.zone = zone;
  }

  private getTimeOfDay(): number {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  }

  private getDayNightFactor(): number {
    const hour = this.getTimeOfDay();
    if (hour >= 6 && hour < 12) return 0.8;
    if (hour >= 12 && hour < 18) return 1.2;
    if (hour >= 18 && hour < 22) return 1.0;
    return 0.6;
  }

  private getTrafficPattern(): number {
    const hour = this.getTimeOfDay();
    if (hour >= 7 && hour < 9) return 1.4;
    if (hour >= 17 && hour < 19) return 1.5;
    if (hour >= 12 && hour < 14) return 1.1;
    if (hour >= 22 || hour < 6) return 0.3;
    return 0.8;
  }

  private addNoise(value: number, variance: number): number {
    return value + (Math.random() - 0.5) * variance;
  }

  generateData(): EnvironmentalData {
    const dayNightFactor = this.getDayNightFactor();
    const trafficPattern = this.getTrafficPattern();
    
    const temperature = this.addNoise(
      this.baseData.temperature * dayNightFactor,
      3
    );
    
    const humidity = this.addNoise(
      this.baseData.humidity * (2 - dayNightFactor),
      5
    );
    
    const traffic = this.addNoise(
      this.baseData.traffic * trafficPattern,
      10
    );
    
    const pm25 = this.addNoise(
      this.baseData.pm25 * (1 + traffic / 100),
      8
    );
    
    const energy = this.addNoise(
      this.baseData.energy * (0.6 + dayNightFactor * 0.4),
      5
    );
    
    const water = this.addNoise(
      this.baseData.water * (0.8 + dayNightFactor * 0.3),
      0.2
    );
    
    const windSpeed = this.addNoise(
      this.baseData.windSpeed * (1 + Math.sin(this.timeOffset / 10) * 0.3),
      2
    );
    
    this.timeOffset++;
    
    return {
      temperature: Math.max(15, Math.min(40, temperature)),
      humidity: Math.max(30, Math.min(90, humidity)),
      pm25: Math.max(20, Math.min(150, pm25)),
      co2: Math.max(350, Math.min(600, this.addNoise(this.baseData.co2, 30))),
      traffic: Math.max(10, Math.min(100, traffic)),
      energy: Math.max(40, Math.min(100, energy)),
      water: Math.max(0.5, Math.min(2.5, water)),
      windSpeed: Math.max(0, Math.min(20, windSpeed)),
      zone: this.baseData.zone
    };
  }

  updateBaseConditions(temp: number, pollution: number) {
    this.baseData.temperature = temp;
    this.baseData.pm25 = pollution;
  }
}
