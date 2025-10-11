import { EnvironmentalData } from "./fuzzyLogic";

interface OpenMeteoWeatherResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
  };
}

interface OpenMeteoAirQualityResponse {
  current: {
    pm2_5: number;
    carbon_monoxide: number;
  };
}

export class RealDataService {
  private latitude: number = 51.5074; // Default: London
  private longitude: number = -0.1278;
  private zone: string = "Unknown Location";
  private lastWeatherData: EnvironmentalData | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 300000; // 5 minutes in milliseconds

  constructor(zone: string = "Unknown Location", lat?: number, lng?: number) {
    this.zone = zone;
    if (lat !== undefined && lng !== undefined) {
      this.latitude = lat;
      this.longitude = lng;
    }
  }

  setLocation(zone: string, lat: number, lng: number) {
    this.zone = zone;
    this.latitude = lat;
    this.longitude = lng;
    // Clear cache when location changes
    this.lastWeatherData = null;
    this.lastFetchTime = 0;
  }

  setZone(zone: string) {
    this.zone = zone;
  }

  private getTimeOfDay(): number {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  }

  private getTrafficPattern(): number {
    const hour = this.getTimeOfDay();
    // Rush hour patterns
    if (hour >= 7 && hour < 9) return 1.4;
    if (hour >= 17 && hour < 19) return 1.5;
    if (hour >= 12 && hour < 14) return 1.1;
    if (hour >= 22 || hour < 6) return 0.3;
    return 0.8;
  }

  private getEnergyPattern(): number {
    const hour = this.getTimeOfDay();
    // Energy usage patterns
    if (hour >= 18 && hour < 23) return 1.3; // Evening peak
    if (hour >= 8 && hour < 17) return 1.0; // Day usage
    if (hour >= 0 && hour < 6) return 0.5; // Night low
    return 0.8;
  }

  private getWaterPattern(): number {
    const hour = this.getTimeOfDay();
    // Water usage patterns
    if (hour >= 6 && hour < 9) return 1.2; // Morning peak
    if (hour >= 18 && hour < 22) return 1.1; // Evening peak
    if (hour >= 0 && hour < 6) return 0.4; // Night low
    return 0.8;
  }

  async fetchWeatherData(): Promise<EnvironmentalData> {
    try {
      // Check cache first
      const now = Date.now();
      if (this.lastWeatherData && (now - this.lastFetchTime) < this.CACHE_DURATION) {
        // Return cached data with updated time-based patterns
        return this.updateTimeBasedMetrics(this.lastWeatherData);
      }

      // Fetch weather data from Open-Meteo
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData: OpenMeteoWeatherResponse = await weatherResponse.json();

      // Fetch air quality data from Open-Meteo
      const airQualityUrl = `https://air-quality.open-meteo.com/v1/air-quality?latitude=${this.latitude}&longitude=${this.longitude}&current=pm2_5,carbon_monoxide`;
      const airQualityResponse = await fetch(airQualityUrl);
      const airQualityData: OpenMeteoAirQualityResponse = await airQualityResponse.json();

      // Calculate traffic based on time patterns
      const traffic = this.getTrafficPattern() * 60; // Base traffic level

      // Calculate PM2.5 with traffic influence
      const basePM25 = airQualityData.current?.pm2_5 || 25;
      const pm25 = basePM25 * (1 + traffic / 200);

      // Convert CO from μg/m³ to ppm (approximate)
      const coPPM = (airQualityData.current?.carbon_monoxide || 300) / 1145;
      const co2 = Math.min(600, Math.max(350, 380 + coPPM * 10));

      const environmentalData: EnvironmentalData = {
        temperature: weatherData.current?.temperature_2m || 20,
        humidity: weatherData.current?.relative_humidity_2m || 60,
        pm25: Math.min(150, Math.max(10, pm25)),
        co2: co2,
        traffic: Math.min(100, Math.max(10, traffic)),
        energy: this.getEnergyPattern() * 70,
        water: this.getWaterPattern() * 1.2,
        windSpeed: weatherData.current?.wind_speed_10m || 5,
        zone: this.zone
      };

      // Cache the data
      this.lastWeatherData = environmentalData;
      this.lastFetchTime = now;

      return environmentalData;
    } catch (error) {
      console.error('Error fetching real weather data:', error);
      
      // Return fallback data if API fails
      return this.getFallbackData();
    }
  }

  private updateTimeBasedMetrics(baseData: EnvironmentalData): EnvironmentalData {
    return {
      ...baseData,
      traffic: Math.min(100, Math.max(10, this.getTrafficPattern() * 60)),
      energy: this.getEnergyPattern() * 70,
      water: this.getWaterPattern() * 1.2,
    };
  }

  private getFallbackData(): EnvironmentalData {
    return {
      temperature: 20,
      humidity: 60,
      pm25: 35,
      co2: 400,
      traffic: this.getTrafficPattern() * 60,
      energy: this.getEnergyPattern() * 70,
      water: this.getWaterPattern() * 1.2,
      windSpeed: 5,
      zone: this.zone
    };
  }

  async generateData(): Promise<EnvironmentalData> {
    return await this.fetchWeatherData();
  }

  updateBaseConditions(temp: number, pollution: number) {
    // For manual override if needed
    if (this.lastWeatherData) {
      this.lastWeatherData.temperature = temp;
      this.lastWeatherData.pm25 = pollution;
    }
  }
}
