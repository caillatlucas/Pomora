"use client";

import React from "react";
import { LayoutDashboard, Maximize2, Minimize2, CloudRain } from "lucide-react";
import { useEditor } from "./EditorProvider";
import { useBackgroundAudio } from "./AudioProvider";
import { motion } from "framer-motion";

export const FloatingToolbar = () => {
  const { isEditing, setIsEditing, isFocusMode, setIsFocusMode } = useEditor();
  const { tracks, toggleTrack } = useBackgroundAudio();
  
  const rainTrack = tracks['rain'];

  if (isFocusMode) {
    return (
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 p-2 rounded-2xl bg-black/80 backdrop-blur-[20px] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      >
        <button 
          onClick={() => setIsFocusMode(false)}
          className="p-3 rounded-xl transition-all text-primary hover:bg-white/10 hover:text-white"
          title="Quitter le plein écran"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 p-2 rounded-2xl bg-[#0f0f0f]/60 backdrop-blur-[20px] saturate-[180%] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
    >
      <button 
        onClick={() => setIsEditing(!isEditing)}
        className={`p-3 rounded-xl transition-all ${isEditing ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,49,49,0.5)]' : 'text-white/50 hover:bg-white/10 hover:text-white'}`}
        title="Éditer le Layout (Drag & Drop)"
      >
        <LayoutDashboard className="w-5 h-5" />
      </button>

      <button 
        onClick={() => setIsFocusMode(true)}
        className="p-3 rounded-xl transition-all text-white/50 hover:bg-white/10 hover:text-white"
        title="Mode Deep Focus"
      >
        <Maximize2 className="w-5 h-5" />
      </button>

      {rainTrack && (
        <button 
          onClick={() => toggleTrack('rain')}
          className={`p-3 rounded-xl transition-all ${rainTrack.isActive ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(255,49,49,0.2)]' : 'text-white/50 hover:bg-white/10 hover:text-white'}`}
          title="Bruit de pluie"
        >
          <CloudRain className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
};
