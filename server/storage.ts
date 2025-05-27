import { weatherData, forecast, type WeatherData, type Forecast, type InsertWeatherData, type InsertForecast } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getWeatherData(city: string): Promise<WeatherData | undefined>;
  createWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  getForecast(city: string): Promise<Forecast[]>;
  createForecast(data: InsertForecast): Promise<Forecast>;
  clearOldWeatherData(city: string): Promise<void>;
  clearOldForecast(city: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private weatherData: Map<string, WeatherData>;
  private forecast: Map<string, Forecast[]>;
  private weatherId: number;
  private forecastId: number;

  constructor() {
    this.weatherData = new Map();
    this.forecast = new Map();
    this.weatherId = 1;
    this.forecastId = 1;
  }

  async getWeatherData(city: string): Promise<WeatherData | undefined> {
    return this.weatherData.get(city.toLowerCase());
  }

  async createWeatherData(insertData: InsertWeatherData): Promise<WeatherData> {
    const id = this.weatherId++;
    const data: WeatherData = { 
      ...insertData, 
      id, 
      timestamp: new Date() 
    };
    this.weatherData.set(insertData.city.toLowerCase(), data);
    return data;
  }

  async getForecast(city: string): Promise<Forecast[]> {
    return this.forecast.get(city.toLowerCase()) || [];
  }

  async createForecast(insertData: InsertForecast): Promise<Forecast> {
    const id = this.forecastId++;
    const data: Forecast = { 
      ...insertData, 
      id, 
      timestamp: new Date() 
    };
    
    const cityKey = insertData.city.toLowerCase();
    const existing = this.forecast.get(cityKey) || [];
    existing.push(data);
    this.forecast.set(cityKey, existing);
    
    return data;
  }

  async clearOldWeatherData(city: string): Promise<void> {
    this.weatherData.delete(city.toLowerCase());
  }

  async clearOldForecast(city: string): Promise<void> {
    this.forecast.delete(city.toLowerCase());
  }
}

export const storage = new MemStorage();
