import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface WeatherSearchProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export function WeatherSearch({ onSearch, isLoading }: WeatherSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const city = searchQuery.trim();
    if (city) {
      onSearch(city);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter city name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-32 px-6 py-4 text-lg bg-white/20 glass-morphism rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 search-shadow border-0"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-secondary px-6 py-2 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center"
        >
          <Search className="w-5 h-5 mr-2" />
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  );
}
