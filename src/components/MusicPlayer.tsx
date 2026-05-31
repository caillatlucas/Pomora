"use client";

import React, { useState } from "react";
import { Play, Pause, SkipForward } from "lucide-react";

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate next track logic
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full h-full relative">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center relative overflow-hidden mb-4 ${isPlaying ? 'animate-spin-slow shadow-[0_0_20px_rgba(255,49,49,0.25)]' : 'shadow-sm'} transition-all duration-700`}>
        {/* Disque vinyle abstrait / Pochette */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ff3131]/20 to-[#ff3131]/5 border border-[#ff3131]/20" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 border border-black/5 dark:border-white/5" />
        <div className="w-5 h-5 rounded-full bg-white/80 dark:bg-black/80 flex items-center justify-center z-10 shadow-inner">
          <div className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={togglePlay}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-light dark:text-text-dark"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button 
          onClick={nextTrack}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-light/50 dark:text-text-dark/50 hover:text-text-light dark:hover:text-text-dark"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
