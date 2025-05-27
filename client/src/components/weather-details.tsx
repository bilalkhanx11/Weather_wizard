import { Eye, Droplets, Wind, Thermometer } from "lucide-react";
import type { WeatherData } from "@shared/schema";

interface WeatherDetailsProps {
  weatherData: WeatherData;
}

export function WeatherDetails({ weatherData }: WeatherDetailsProps) {
  const details = [
    {
      icon: Eye,
      value: `${weatherData.visibility} km`,
      label: "Visibility",
      delay: "0.1s"
    },
    {
      icon: Droplets,
      value: `${weatherData.humidity}%`,
      label: "Humidity",
      delay: "0.2s"
    },
    {
      icon: Wind,
      value: `${weatherData.windSpeed} km/h`,
      label: "Wind Speed",
      delay: "0.3s"
    },
    {
      icon: Thermometer,
      value: `${weatherData.feelsLike}°C`,
      label: "Feels Like",
      delay: "0.4s"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {details.map((detail, index) => {
        const Icon = detail.icon;
        return (
          <div 
            key={index}
            className="glass-morphism rounded-2xl p-6 text-center animate-fade-in"
            style={{ animationDelay: detail.delay }}
          >
            <Icon className="w-8 h-8 text-white/80 mb-3 mx-auto" />
            <div className="text-2xl font-semibold text-white">{detail.value}</div>
            <div className="text-white/70 text-sm">{detail.label}</div>
          </div>
        );
      })}
    </div>
  );
}
