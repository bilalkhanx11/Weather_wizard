import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { weatherSearchSchema, type WeatherResponse } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather API routes
  app.post("/api/weather", async (req, res) => {
    try {
      const { city } = weatherSearchSchema.parse(req.body);
      
      // Check if we have recent weather data (within 10 minutes)
      const existingWeather = await storage.getWeatherData(city);
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      
      if (existingWeather && existingWeather.timestamp > tenMinutesAgo) {
        const existingForecast = await storage.getForecast(city);
        const response: WeatherResponse = {
          current: existingWeather,
          forecast: existingForecast.slice(0, 5)
        };
        return res.json(response);
      }

      // Hardcoded OpenWeather API key here:
      const apiKey = "e7c98e2d596cde84fdefd28ceb46e2fd";

      // Fetch current weather
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const currentResponse = await fetch(currentWeatherUrl);
      
      if (!currentResponse.ok) {
        if (currentResponse.status === 404) {
          return res.status(404).json({ 
            message: "City not found. Please check the spelling and try again." 
          });
        }
        return res.status(500).json({ 
          message: "Failed to fetch weather data. Please try again later." 
        });
      }

      const currentData = await currentResponse.json();

      // Fetch 5-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);
      
      if (!forecastResponse.ok) {
        return res.status(500).json({ 
          message: "Failed to fetch forecast data. Please try again later." 
        });
      }

      const forecastData = await forecastResponse.json();

      // Clear old data
      await storage.clearOldWeatherData(city);
      await storage.clearOldForecast(city);

      // Store current weather
      const weatherRecord = await storage.createWeatherData({
        city: currentData.name,
        country: currentData.sys.country,
        temperature: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        windSpeed: currentData.wind?.speed || 0,
        windDirection: currentData.wind?.deg || 0,
        visibility: (currentData.visibility || 10000) / 1000, // Convert to km
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        main: currentData.weather[0].main,
      });

      // Store 5-day forecast (get one forecast per day at noon)
      const dailyForecasts = new Map();
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toISOString().split('T')[0];
        const hour = date.getHours();
        
        // Prefer noon forecasts, but take any if noon not available
        if (!dailyForecasts.has(dateKey) || hour === 12) {
          dailyForecasts.set(dateKey, item);
        }
      });

      const forecastRecords = [];
      const sortedDates = Array.from(dailyForecasts.keys()).sort().slice(0, 5);
      
      for (const dateKey of sortedDates) {
        const item = dailyForecasts.get(dateKey);
        const forecastRecord = await storage.createForecast({
          city: currentData.name,
          date: dateKey,
          tempMax: Math.round(item.main.temp_max),
          tempMin: Math.round(item.main.temp_min),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          main: item.weather[0].main,
        });
        forecastRecords.push(forecastRecord);
      }

      const response: WeatherResponse = {
        current: weatherRecord,
        forecast: forecastRecords
      };

      res.json(response);
    } catch (error) {
      console.error("Weather API error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid city name. Please enter a valid city name." 
        });
      }
      
      res.status(500).json({ 
        message: "An unexpected error occurred. Please try again later." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
