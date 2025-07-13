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
  const [view, setView] = useState<"home" | "forecast">("home");

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
    setView("home");
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
                <a
                   href="/"
                   className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                  Home
                </a>
                <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (hasSearched && weatherData && weatherData.forecast && weatherData.forecast.length > 0) {
                          setView("forecast");
                        } else {
                          alert("Please search a city first to view forecast.");
                        }
                      }}
                      className="text-white/80 hover:text-white transition-colors duration-300 cursor-pointer"
                      aria-disabled={!hasSearched || !weatherData?.forecast?.length}
                    >
                      Forecast
                </a>

                <a
                  href="https://www.google.com/maps/@24.690688,46.727168,12z?entry=ttu&g_ep=EgoyMDI1MDYyMy4yIKXMDSoASAFQAw%3D%3D"
                  className="text-white/80 hover:text-white transition-colors duration-300"
                >
                  Maps
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl mx-auto">
            {/* Search Section */}
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Beautiful Weather</h2>
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
                  {error instanceof Error
                    ? error.message
                    : "Sorry, we couldn't find weather data for that location. Please check the city name and try again."}
                </p>
                <button
                  onClick={() => refetch()}
                  className="bg-primary hover:bg-secondary px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Home: Current Weather Display */}
            {view === "home" && weatherData && !isLoading && !error && (
              <WeatherDisplay weatherData={weatherData} />
            )}

            {/* Forecast Display */}
            {view === "forecast" && weatherData?.forecast && (
              <div className="glass-morphism p-6 rounded-2xl text-white space-y-6">
                <h3 className="text-2xl font-bold mb-4">5-Day Forecast for {weatherData.current.city}</h3>
                {weatherData.forecast.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/10 p-4 rounded-lg"
                  >
                    <span>{item.date}</span>
                    <span>{item.description}</span>
                    <span>
                      {item.tempMin}°C - {item.tempMax}°C
                    </span>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                      alt={item.description}
                      className="w-12 h-12"
                    />
                  </div>
                ))}
              </div>
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
                <p>&copy;  2025 WeatherNow — Bringing sunshine to your screen ☀️. Coded by Bilal Khan  using OpenWeatherMap API.</p>
              </div>
              <div className="flex items-center space-x-6">
                <a
                  href="https://twitter.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a
                  href="https://facebook.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
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
