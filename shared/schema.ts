import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  temperature: real("temperature").notNull(),
  feelsLike: real("feels_like").notNull(),
  humidity: integer("humidity").notNull(),
  pressure: integer("pressure").notNull(),
  windSpeed: real("wind_speed").notNull(),
  windDirection: integer("wind_direction").notNull(),
  visibility: real("visibility").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  main: text("main").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const forecast = pgTable("forecast", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  date: text("date").notNull(),
  tempMax: real("temp_max").notNull(),
  tempMin: real("temp_min").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  main: text("main").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  timestamp: true,
});

export const insertForecastSchema = createInsertSchema(forecast).omit({
  id: true,
  timestamp: true,
});

export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertForecast = z.infer<typeof insertForecastSchema>;
export type Forecast = typeof forecast.$inferSelect;

// Weather search schema
export const weatherSearchSchema = z.object({
  city: z.string().min(1, "City name is required").max(100, "City name too long"),
});

export type WeatherSearchRequest = z.infer<typeof weatherSearchSchema>;

// API response types
export type WeatherResponse = {
  current: WeatherData;
  forecast: Forecast[];
};
