export function getWeatherIcon(weatherMain: string): string {
  const iconMap: Record<string, string> = {
    Clear: "fas fa-sun",
    Clouds: "fas fa-cloud",
    Rain: "fas fa-cloud-rain",
    Drizzle: "fas fa-cloud-drizzle",
    Thunderstorm: "fas fa-bolt",
    Snow: "fas fa-snowflake",
    Mist: "fas fa-smog",
    Smoke: "fas fa-smog",
    Haze: "fas fa-smog",
    Dust: "fas fa-smog",
    Fog: "fas fa-smog",
    Sand: "fas fa-smog",
    Ash: "fas fa-smog",
    Squall: "fas fa-wind",
    Tornado: "fas fa-tornado",
  };

  return iconMap[weatherMain] || "fas fa-cloud-sun";
}

export function getWeatherBackground(weatherMain: string): string {
  const backgroundMap: Record<string, string> = {
    Clear: "weather-bg-sunny",
    Clouds: "weather-bg-cloudy",
    Rain: "weather-bg-rainy",
    Drizzle: "weather-bg-rainy",
    Thunderstorm: "weather-bg-cloudy",
    Snow: "weather-bg-cloudy",
  };

  return backgroundMap[weatherMain] || "weather-bg-default";
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

export function formatForecastDate(dateString: string, index: number): string {
  if (index === 0) return "Today";
  
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
  return date.toLocaleDateString('en-US', options);
}
