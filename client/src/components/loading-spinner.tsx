import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="glass-morphism rounded-3xl p-8 text-center animate-fade-in">
      <div className="flex items-center justify-center mb-4">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
      <div className="text-white text-lg">Fetching weather data...</div>
    </div>
  );
}
