"use client";

import React, { useState } from "react";
import { Flame } from "lucide-react";
import { useSettings } from "./SettingsProvider";
import { motion } from "framer-motion";

type TimeFilter = '7j' | '14j' | '1m' | '6m';

export const StatCard = () => {
  const { currentStreak, dailyWorkLog } = useSettings();
  const [filter, setFilter] = useState<TimeFilter>('14j');

  const getDaysCount = () => {
    if (filter === '7j') return 7;
    if (filter === '14j') return 14;
    if (filter === '1m') return 30;
    return 180; // 6 mois
  };

  const daysCount = getDaysCount();

  // Obtenir les derniers X jours
  const lastXDays = Array.from({ length: daysCount }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (daysCount - 1 - i));
    const dateStr = d.toISOString().split('T')[0];
    return {
      date: dateStr,
      minutes: dailyWorkLog[dateStr] || 0
    };
  });

  const totalFilteredMinutes = lastXDays.reduce((acc, curr) => acc + curr.minutes, 0);

  const getStatusLabel = () => {
    const todayMinutes = lastXDays[lastXDays.length - 1].minutes;
    if (todayMinutes === 0) return "Démarrage";
    if (todayMinutes < 60) return "En chauffe";
    if (todayMinutes < 120) return "Focus Profond";
    return "Distraction Zéro";
  };

  const getColorLevel = (minutes: number) => {
    if (minutes === 0) return "bg-white/5 border border-white/5";
    if (minutes < 30) return "bg-primary/20 border border-primary/10";
    if (minutes < 60) return "bg-primary/40 border border-primary/20";
    if (minutes < 120) return "bg-primary/70 border border-primary/30";
    return "bg-primary border border-primary/50 shadow-[0_0_10px_rgba(255,49,49,0.5)]";
  };

  return (
    <div className="flex-1 flex flex-col justify-between w-full h-full font-body overflow-hidden">
      {/* Header : Total, Streak & Filtres */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-white/50 uppercase tracking-widest">Focus Total</p>
            {/* Filtres LiquidGlass */}
            <div className="flex items-center gap-1 bg-white/5 rounded-full p-0.5 border border-white/10 shadow-inner">
              {(['7j', '14j', '1m', '6m'] as TimeFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[9px] px-1.5 py-0.5 rounded-full transition-all ${
                    filter === f 
                      ? 'bg-primary/40 text-white shadow-[0_0_5px_rgba(255,49,49,0.5)]' 
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-white">
            {Math.floor(totalFilteredMinutes / 60)}h {totalFilteredMinutes % 60}m
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(255,49,49,0.1)]">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Flame className="w-4 h-4 text-primary drop-shadow-[0_0_5px_rgba(255,49,49,0.8)]" />
            </motion.div>
            <span className="text-sm font-bold text-primary">{currentStreak}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">
            {getStatusLabel()}
          </span>
        </div>
      </div>

      {/* Heatmap dynamique */}
      <div className="mt-auto h-full flex flex-col justify-end">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Activité ({filter})</p>
        <div 
          className="flex flex-wrap content-start w-full"
          style={{ gap: filter === '6m' ? '2px' : '6px' }}
        >
          {lastXDays.map((day, idx) => (
            <div 
              key={day.date} 
              style={{
                width: filter === '6m' ? '4px' : filter === '1m' ? '12px' : 'calc(14.28% - 6px)',
                height: filter === '6m' ? '4px' : filter === '1m' ? '12px' : 'auto',
                aspectRatio: filter === '6m' || filter === '1m' ? undefined : '1 / 1'
              }}
              className={`rounded-[1px] md:rounded-sm transition-all group relative ${getColorLevel(day.minutes)}`}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                {day.minutes}m
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
