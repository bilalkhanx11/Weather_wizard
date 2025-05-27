import { WeatherDetails } from "./weather-details";
import { WeatherForecast } from "./weather-forecast";
import { getWeatherIcon, formatDate } from "@/lib/weather-utils";
import type { WeatherResponse } from "@shared/schema";

interface WeatherDisplayProps {
  weatherData: WeatherResponse;
}

export function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  const { current, forecast } = weatherData;

  return (
    <div className="grid gap-8 md:gap-12 animate-fade-in">
      {/* Current Weather Card */}
      <div className="glass-morphism rounded-3xl p-8 md:p-12 weather-card-shadow">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <i className="fas fa-map-marker-alt text-white/80 mr-2"></i>
              <span className="text-white/80 text-lg">
                {current.city}, {current.country}
              </span>
            </div>
            <div className="mb-6">
              <span className="text-7xl md:text-8xl font-bold text-white">
                {current.temperature}°
              </span>
              <span className="text-2xl text-white/80 ml-2">C</span>
            </div>
            <div className="text-xl text-white/90 capitalize mb-2">
              {current.description}
            </div>
            <div className="text-white/70">
              {formatDate(new Date())}
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-block animate-float">
              <i className={`${getWeatherIcon(current.main)} text-8xl md:text-9xl text-white/90`}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <WeatherDetails weatherData={current} />

      {/* 5-Day Forecast */}
      <WeatherForecast forecast={forecast} />
    </div>
  );
}
