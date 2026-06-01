"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "./SettingsProvider";
import { Cloud, Sun, CloudRain, CloudLightning, CloudSnow, Loader2 } from "lucide-react";

export const WeatherWidget = () => {
  const { weatherCity } = useSettings();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!weatherCity) {
      setWeatherData(null);
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`https://wttr.in/${encodeURIComponent(weatherCity)}?format=j1`);
        if (!res.ok) throw new Error("Failed to fetch weather");
        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000); // refresh every 30 mins
    return () => clearInterval(interval);
  }, [weatherCity]);

  if (!weatherCity) return null;

  const getIcon = (condition: string) => {
    const l = condition.toLowerCase();
    if (l.includes("rain") || l.includes("drizzle") || l.includes("shower")) return <CloudRain className="w-5 h-5 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]" />;
    if (l.includes("snow") || l.includes("ice")) return <CloudSnow className="w-5 h-5 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />;
    if (l.includes("thunder") || l.includes("storm")) return <CloudLightning className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" />;
    if (l.includes("cloud") || l.includes("overcast")) return <Cloud className="w-5 h-5 text-gray-300 drop-shadow-[0_0_5px_rgba(209,213,219,0.5)]" />;
    return <Sun className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />;
  };

  return (
    <div className="fixed top-6 right-20 z-40 px-4 py-2 rounded-2xl bg-[#0f0f0f]/70 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,49,49,0.1)] flex items-center gap-3 transition-all hover:bg-[#0f0f0f]/90">
      {loading && !weatherData && (
        <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
      )}
      {error && (
        <span className="text-xs text-red-400 font-body">Erreur météo</span>
      )}
      {weatherData && !error && (
        <>
          {getIcon(weatherData.current_condition[0].weatherDesc[0].value)}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white font-display leading-tight">{weatherCity}</span>
            <span className="text-xs text-white/70 font-body">{weatherData.current_condition[0].temp_C}°C</span>
          </div>
        </>
      )}
    </div>
  );
};
