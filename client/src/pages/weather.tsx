import { useState } from "react";
import { WeatherSearch } from "@/components/weather-search";
import { WeatherDisplay } from "@/components/weather-display";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getWeatherBackground } from "@/lib/weather-utils";
import type { WeatherResponse } from "@shared/schema";

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: weatherData,
    isLoading,
    error,
    refetch,
  } = useQuery<WeatherResponse | null>({
    queryKey: ["/api/weather", selectedCity],
    queryFn: async () => {
      if (!selectedCity) return null;
      
      const response = await apiRequest("POST", "/api/weather", {
        city: selectedCity,
      });
      return await response.json();
    },
    enabled: !!selectedCity && hasSearched,
    retry: false,
  });

  const handleSearch = (city: string) => {
    setSelectedCity(city);
    setHasSearched(true);
  };

  const backgroundClass = weatherData?.current 
    ? getWeatherBackground(weatherData.current.main)
    : "weather-bg-default";

  return (
    <div className={`min-h-screen transition-all duration-1000 ${backgroundClass}`}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="relative z-10 px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 animate-fade-in">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <i className="fas fa-cloud-sun text-2xl text-white"></i>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">WeatherNow</h1>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Home</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Forecast</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Maps</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl mx-auto">
            {/* Search Section */}
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Beautiful Weather
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Get real-time weather information for any city worldwide
              </p>
              
              <WeatherSearch onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Loading State */}
            {isLoading && <LoadingSpinner />}

            {/* Error State */}
            {error && !isLoading && (
              <div className="glass-morphism rounded-3xl p-8 text-center animate-fade-in">
                <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                <h3 className="text-xl font-semibold text-white mb-2">Weather Data Unavailable</h3>
                <p className="text-white/80 mb-6">
                  {error instanceof Error ? error.message : "Sorry, we couldn't find weather data for that location. Please check the city name and try again."}
                </p>
                <button 
                  onClick={() => refetch()}
                  className="bg-primary hover:bg-secondary px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Weather Display */}
            {weatherData && !isLoading && !error && (
              <WeatherDisplay weatherData={weatherData} />
            )}

            {/* Welcome State */}
            {!hasSearched && !isLoading && (
              <div className="glass-morphism rounded-3xl p-8 md:p-12 text-center animate-fade-in">
                <div className="inline-block animate-float mb-6">
                  <i className="fas fa-cloud-sun text-8xl md:text-9xl text-white/90"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Welcome to WeatherNow</h3>
                <p className="text-white/80 text-lg">
                  Enter a city name above to get started with real-time weather information
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 px-4 py-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-white/60 mb-4 md:mb-0">
                <p>&copy; 2024 WeatherNow. Powered by OpenWeatherMap API</p>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-white/60 hover:text-white transition-colors duration-300">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors duration-300">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors duration-300">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
