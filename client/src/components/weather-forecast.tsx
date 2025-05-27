import { getWeatherIcon, formatForecastDate } from "@/lib/weather-utils";
import type { Forecast } from "@shared/schema";

interface WeatherForecastProps {
  forecast: Forecast[];
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  return (
    <div className="glass-morphism rounded-3xl p-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
      <h3 className="text-2xl font-bold text-white mb-6 text-center">5-Day Forecast</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div 
            key={day.id}
            className="bg-white/10 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300"
          >
            <div className="text-white/80 font-medium mb-2">
              {formatForecastDate(day.date, index)}
            </div>
            <i className={`${getWeatherIcon(day.main)} text-3xl text-white/90 mb-3`}></i>
            <div className="text-white font-semibold">
              <span>{day.tempMax}°</span> / <span className="text-white/70">{day.tempMin}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
