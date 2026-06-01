"use client";

import React, { useState } from "react";
import { Play, Pause, CloudRain, Music, SkipForward, SkipBack, Repeat, Shuffle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBackgroundAudio } from "./AudioProvider";
import { useSettings } from "./SettingsProvider";

export const AmbientPlayer = () => {
  const { 
    isRadioPlaying, toggleRadio, youtubeMetadata, tracks, setVolume, youtubeVolume, setYoutubeVolume,
    nextVideo, previousVideo, seekTo, getCurrentTime, getDuration, isLooping, toggleLoop, isShuffle, toggleShuffle,
    playlistIndex, playlistLength
  } = useBackgroundAudio();

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRadioPlaying) {
      interval = setInterval(() => {
        setProgress(getCurrentTime() || 0);
        setDuration(getDuration() || 0);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRadioPlaying, getCurrentTime, getDuration]);

  const bars = Array.from({ length: 8 });
  const coverUrl = youtubeMetadata?.videoId ? `https://img.youtube.com/vi/${youtubeMetadata.videoId}/maxresdefault.jpg` : null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    seekTo(val);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-full relative z-10 pt-2 font-body overflow-hidden rounded-xl">
      
      {/* Cover Background */}
      <AnimatePresence>
        {coverUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-cover bg-center blur-md -z-10 pointer-events-none"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
        )}
      </AnimatePresence>

      {/* Metadata Info (Titre & Artiste) */}
      <div className="w-full px-2 mb-4 flex flex-col justify-center relative flex-shrink-0">
        <AnimatePresence mode="wait">
          <motion.div 
            key={youtubeMetadata?.videoId || 'none'}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="w-full text-center"
          >
            {youtubeMetadata ? (
              <>
                <h3 className="text-xl font-bold font-display text-white mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] truncate max-w-full">
                  {youtubeMetadata ? youtubeMetadata.title : "Pomora Radio"}
                </h3>
                <p className="text-sm font-body text-white/50 drop-shadow-md truncate max-w-full">
                  {youtubeMetadata ? youtubeMetadata.author : "Deep Focus Beats"}
                </p>
                <div className="mt-2 text-[10px] text-white/40 uppercase tracking-widest font-bold bg-black/30 px-2 py-0.5 rounded-full inline-block">
                  {playlistLength > 0 ? `File d'attente : ${playlistIndex + 1} / ${playlistLength}` : "Aucune file d'attente (Vidéo unique)"}
                </div>
              </>
            ) : (
              <p className="text-xs text-white/40 italic">En attente du flux...</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Waveform Animée */}
      <div className="flex items-end justify-center gap-1.5 h-10 w-full mb-3">
        {bars.map((_, i) => (
          <motion.div
            key={i}
            animate={isRadioPlaying ? { height: ["20%", "100%", "40%", "80%", "30%", "90%"] } : { height: "10%" }}
            transition={isRadioPlaying ? { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } : { duration: 0.3 }}
            className="w-1.5 rounded-full bg-primary/80 shadow-[0_0_10px_rgba(255,49,49,0.5)]"
          />
        ))}
      </div>
      
      <div className="w-full px-4 mb-2 relative z-10 flex flex-col gap-1">
        <input 
          type="range" 
          min="0" max={duration || 100} step="1"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-white/20 hover:bg-white/30 transition-colors rounded-lg appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
        />
        <div className="flex justify-between text-[9px] text-white/50 font-bold">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 z-10 relative">
        <button onClick={toggleShuffle} className={`p-2 rounded-full transition-colors ${isShuffle ? 'text-primary drop-shadow-[0_0_5px_rgba(255,49,49,0.8)]' : 'text-white/40 hover:text-white/60'}`}>
          <Shuffle className="w-3 h-3" />
        </button>
        <button onClick={toggleLoop} className={`p-2 rounded-full transition-colors ${isLooping ? 'text-primary drop-shadow-[0_0_5px_rgba(255,49,49,0.8)]' : 'text-white/40 hover:text-white/60'}`}>
          <Repeat className="w-3 h-3" />
        </button>
        <button onClick={previousVideo} className="p-2 rounded-full text-white/60 hover:text-white transition-colors">
          <SkipBack className="w-4 h-4" />
        </button>
        <button 
          onClick={toggleRadio}
          className="p-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,49,49,0.4)]"
        >
          {isRadioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button onClick={nextVideo} className="p-2 rounded-full text-white/60 hover:text-white transition-colors">
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Contrôles de volume */}
      <div className="flex flex-col gap-2 mt-auto w-full px-4 pb-2 z-10 relative">
        <div className="flex items-center gap-3 w-full group">
          <CloudRain className={`w-3.5 h-3.5 transition-colors ${tracks['rain']?.isActive ? 'text-primary drop-shadow-[0_0_5px_rgba(255,49,49,0.8)]' : 'text-white/40 group-hover:text-white/60'}`} />
          <input 
            type="range" 
            min="0" max="1" step="0.05"
            value={tracks['rain']?.volume || 0}
            onChange={(e) => setVolume('rain', parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 hover:bg-white/20 transition-colors rounded-lg appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          />
        </div>
        <div className="flex items-center gap-3 w-full group">
          <Music className={`w-3.5 h-3.5 transition-colors ${isRadioPlaying ? 'text-primary drop-shadow-[0_0_5px_rgba(255,49,49,0.8)]' : 'text-white/40 group-hover:text-white/60'}`} />
          <input 
            type="range" 
            min="0" max="100" step="1"
            value={youtubeVolume}
            onChange={(e) => setYoutubeVolume(parseInt(e.target.value))}
            className="w-full h-1 bg-white/10 hover:bg-white/20 transition-colors rounded-lg appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          />
        </div>
      </div>

      {/* Liquid Glow de fond */}
      {isRadioPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-10 bg-primary/20 blur-[60px] -z-10 pointer-events-none rounded-full"
        />
      )}
    </div>
  );
};
