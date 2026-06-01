"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "./SettingsProvider";
import { useEditor } from "./EditorProvider";
import { useUISound } from "@/hooks/useUISound";

type Mode = "work" | "shortBreak" | "longBreak";

export const PomodoroTimer = () => {
  const { addWorkMinutes, notificationSound, workTime, shortBreakTime, longBreakTime } = useSettings();
  
  const workSeconds = workTime * 60;
  const shortBreakSeconds = shortBreakTime * 60;
  const longBreakSeconds = longBreakTime * 60;

  const [mode, setMode] = useState<Mode>("work");
  const [timeLeft, setTimeLeft] = useState(workSeconds);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const { playSound } = useUISound();

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(mode === "work" ? workSeconds : mode === "shortBreak" ? shortBreakSeconds : longBreakSeconds);
    }
  }, [workSeconds, shortBreakSeconds, longBreakSeconds]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, []);

  const playNotification = useCallback(() => {
    try {
      if (notificationSound) {
        const audio = new Audio(notificationSound);
        audio.play().catch(e => console.error("Audio play failed:", e));
      }
    } catch (e) {
      console.error("Failed to play sound", e);
    }
    
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification("Pomora", {
        body: mode === "work" ? "Session terminée ! Prenez une pause." : "Pause terminée ! C'est l'heure de se concentrer.",
      });
    }
  }, [mode, notificationSound]);

  const handleCycleEnd = useCallback(() => {
    playNotification();
    if (mode === "work") {
      addWorkMinutes(workTime);
      setSessionCount(prev => prev + 1);
      setMode("shortBreak");
      setTimeLeft(shortBreakSeconds);
      setIsActive(true);
    } else {
      setMode("work");
      setTimeLeft(workSeconds);
      setIsActive(true);
    }
  }, [mode, playNotification, addWorkMinutes, workTime, workSeconds, shortBreakSeconds, longBreakSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            setTimeout(() => handleCycleEnd(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleCycleEnd]);

  const togglePlay = () => {
    playSound("click");
    setIsActive(!isActive);
  };

  const reset = () => {
    playSound("pop");
    setIsActive(false);
    setTimeLeft(mode === "work" ? workSeconds : mode === "shortBreak" ? shortBreakSeconds : longBreakSeconds);
  };

  const skip = () => {
    playSound("click");
    handleCycleEnd();
  };

  const setModeManually = (newMode: Mode) => {
    playSound("click");
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === "work" ? workSeconds : newMode === "shortBreak" ? shortBreakSeconds : longBreakSeconds);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalTime = mode === "work" ? workSeconds : mode === "shortBreak" ? shortBreakSeconds : longBreakSeconds;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const radius = 90;
  const strokeWidth = 2;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const { isFocusMode } = useEditor();

  return (
    <div className={`flex-1 flex flex-col items-center justify-between w-full h-full ${isFocusMode ? 'pt-20 pb-40' : ''}`}>
      <div className={`flex items-center gap-6 mb-2 ${isFocusMode ? 'scale-150 mb-10' : ''}`}>
        <button
          onClick={() => setModeManually("work")}
          className={`text-xs font-body uppercase tracking-widest transition-colors ${mode === "work" ? "text-primary font-bold drop-shadow-[0_0_5px_rgba(255,49,49,0.8)]" : "text-white/40 hover:text-white"}`}
        >
          Travail
        </button>
        <button
          onClick={() => setModeManually("shortBreak")}
          className={`text-xs font-body uppercase tracking-widest transition-colors ${mode === "shortBreak" ? "text-primary font-bold drop-shadow-[0_0_5px_rgba(255,49,49,0.8)]" : "text-white/40 hover:text-white"}`}
        >
          Pause
        </button>
      </div>

      <div className={`relative flex items-center justify-center flex-1 w-full ${isFocusMode ? 'max-h-full' : 'max-h-[220px]'}`}>
        {!isFocusMode && (
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none drop-shadow-[0_0_10px_rgba(255,49,49,0.2)]"
            viewBox="0 0 200 200"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle cx="100" cy="100" r={normalizedRadius} className="stroke-white/5" strokeWidth={strokeWidth} fill="transparent" />
            <circle
              cx="100" cy="100" r={normalizedRadius}
              className="stroke-primary transition-all duration-1000 ease-linear"
              strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
            />
          </svg>
        )}

        <div className="absolute flex flex-col items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.span 
              key={timeLeft}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: isActive ? [1, 1.02, 1] : 1 }}
              transition={{ duration: isActive ? 1 : 0.2, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
              className={`${isFocusMode ? 'text-[12rem] md:text-[18rem]' : 'text-7xl md:text-8xl'} font-display font-light text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,49,49,0.4)] transition-all`}
            >
              {formatTime(timeLeft)}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-8 mt-2">
        <button onClick={reset} className="p-3 rounded-full hover:bg-white/5 transition-colors group focus:outline-none" title="Réinitialiser">
          <RotateCcw className="w-5 h-5 text-white/40 group-hover:text-primary transition-all group-hover:scale-110" />
        </button>

        <button onClick={togglePlay} className="p-5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,49,49,0.2)] hover:shadow-[0_0_25px_rgba(255,49,49,0.4)] focus:outline-none">
          {isActive ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
        </button>

        <button 
          onClick={skip} 
          disabled={mode === "work"}
          className={`p-3 rounded-full transition-colors group focus:outline-none ${mode === "work" ? "opacity-30 cursor-not-allowed" : "hover:bg-white/5"}`} 
          title={mode === "work" ? "Impossible de passer le temps de travail" : "Passer au suivant"}
        >
          <SkipForward className={`w-5 h-5 ${mode === "work" ? "text-white/40" : "text-white/40 group-hover:text-primary transition-all group-hover:scale-110"}`} />
        </button>
      </div>

      <div className={`mt-4 text-xs font-body uppercase tracking-widest text-white/50 ${isFocusMode ? 'mt-8' : ''}`}>
        Sessions complétées : <span className="text-primary font-bold">{sessionCount}</span>
      </div>

      {/* Liquid Glow de fond */}
      {isActive && (
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
