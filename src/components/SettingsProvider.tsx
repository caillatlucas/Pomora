"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface YoutubeFavorite {
  name: string;
  url: string;
}

interface SettingsContextType {
  backgroundUrl: string;
  setBackgroundUrl: (url: string) => void;
  blurOpacity: number;
  setBlurOpacity: (opacity: number) => void;
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  youtubeFavorites: YoutubeFavorite[];
  setYoutubeFavorites: (favs: YoutubeFavorite[]) => void;
  dailyWorkLog: Record<string, number>;
  currentStreak: number;
  addWorkMinutes: (minutes: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};

const DEFAULT_FAVORITES: YoutubeFavorite[] = [
  { name: "Lo-Fi", url: "https://www.youtube.com/playlist?list=PLofht4NTcUKHwzHh_P_o35Wc6aG2e4_PZ" },
  { name: "Synthwave", url: "https://www.youtube.com/watch?v=4xDzrJKXOOY" },
  { name: "Ambient", url: "https://www.youtube.com/watch?v=1ZYbU82GVz4" }
];

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [backgroundUrl, setBackgroundUrl] = useState("https://images.unsplash.com/photo-1725354282080-cf7e4b7325bc?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHJlZCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D");
  const [blurOpacity, setBlurOpacity] = useState(20);
  const [youtubeUrl, setYoutubeUrl] = useState("https://youtu.be/cIZhlFIyJ_Y?si=5ewrU0IpaFObIXDI");
  const [youtubeFavorites, setYoutubeFavorites] = useState<YoutubeFavorite[]>(DEFAULT_FAVORITES);
  
  const [totalWorkMinutes, setTotalWorkMinutes] = useState(0);
  const [dailyWorkLog, setDailyWorkLog] = useState<Record<string, number>>({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const bg = localStorage.getItem("pomora_bgUrl");
    const blur = localStorage.getItem("pomora_blur");
    const youtube = localStorage.getItem("pomora_youtubeUrl");
    const favs = localStorage.getItem("pomora_youtubeFavs");
    const log = localStorage.getItem("pomora_dailyWorkLog");
    const streak = localStorage.getItem("pomora_currentStreak");
    const totalMinutes = localStorage.getItem("pomora_totalWorkMinutes");

    if (bg) setBackgroundUrl(bg);
    if (blur) setBlurOpacity(Number(blur));
    if (youtube) setYoutubeUrl(youtube);
    if (favs) setYoutubeFavorites(JSON.parse(favs));
    if (log) setDailyWorkLog(JSON.parse(log));
    if (streak) setCurrentStreak(Number(streak));
    if (totalMinutes) setTotalWorkMinutes(Number(totalMinutes));
  }, []);

  const handleSetBg = (url: string) => {
    setBackgroundUrl(url);
    localStorage.setItem("pomora_bgUrl", url);
  };

  const handleSetBlur = (val: number) => {
    setBlurOpacity(val);
    localStorage.setItem("pomora_blur", val.toString());
  };

  const handleSetYoutube = (url: string) => {
    setYoutubeUrl(url);
    localStorage.setItem("pomora_youtubeUrl", url);
  };

  const handleSetFavorites = (favs: YoutubeFavorite[]) => {
    setYoutubeFavorites(favs);
    localStorage.setItem("pomora_youtubeFavs", JSON.stringify(favs));
  };

  const addWorkMinutes = (minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setTotalWorkMinutes(prev => {
      const newTotal = prev + minutes;
      localStorage.setItem("pomora_totalWorkMinutes", newTotal.toString());
      return newTotal;
    });

    setDailyWorkLog(prev => {
      const newLog = { ...prev };
      newLog[today] = (newLog[today] || 0) + minutes;
      localStorage.setItem("pomora_dailyWorkLog", JSON.stringify(newLog));
      return newLog;
    });

    setCurrentStreak(prev => {
      const lastWorkDay = localStorage.getItem("pomora_lastWorkDay");
      let newStreak = prev;
      if (lastWorkDay !== today) {
        newStreak += 1;
        localStorage.setItem("pomora_lastWorkDay", today);
        localStorage.setItem("pomora_currentStreak", newStreak.toString());
      }
      return newStreak;
    });
  };

  return (
    <SettingsContext.Provider 
      value={{
        backgroundUrl,
        setBackgroundUrl: handleSetBg,
        blurOpacity,
        setBlurOpacity: handleSetBlur,
        youtubeUrl,
        setYoutubeUrl: handleSetYoutube,
        youtubeFavorites,
        setYoutubeFavorites: handleSetFavorites,
        dailyWorkLog,
        currentStreak,
        addWorkMinutes
      }}
    >
      <div style={{ opacity: mounted ? 1 : 0 }} className="transition-opacity duration-300 min-h-screen">
        {children}
      </div>
    </SettingsContext.Provider>
  );
};
