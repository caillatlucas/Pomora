"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Save } from "lucide-react";
import { useSettings } from "./SettingsProvider";
import { useToast } from "./ToastProvider";

export const SettingsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { backgroundUrl, setBackgroundUrl, blurOpacity, setBlurOpacity, youtubeUrl, setYoutubeUrl } = useSettings();
  const { addToast } = useToast();
  const [bgInput, setBgInput] = useState(backgroundUrl || "");
  const [ytInput, setYtInput] = useState(youtubeUrl || "");
  const [localBlur, setLocalBlur] = useState(blurOpacity);

  const handleSave = () => {
    setBackgroundUrl(bgInput);
    setYoutubeUrl(ytInput);
    setBlurOpacity(localBlur);
    setIsOpen(false);
    addToast("Paramètres LiquidGlass sauvegardés.");
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all shadow-[0_0_15px_rgba(255,49,49,0.1)] hover:shadow-[0_0_20px_rgba(255,49,49,0.3)]"
      >
        <Settings className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-3xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0f0f0f]/70 backdrop-blur-[30px] saturate-[180%] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 font-body"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(255,49,49,0.5)]">Paramètres</h2>
                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/70">URL du Fond d'écran (Image/Vidéo)</label>
                  <input 
                    type="text" 
                    value={bgInput}
                    onChange={(e) => setBgInput(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/70">URL Musique YouTube (Vidéo ou Playlist)</label>
                  <input 
                    type="text" 
                    value={ytInput}
                    onChange={(e) => setYtInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... ou &list=..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/70">Flou des Cartes (px): {localBlur}px</label>
                  <input 
                    type="range" 
                    min="0" max="40" 
                    value={localBlur}
                    onChange={(e) => setLocalBlur(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="mt-4 w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(255,49,49,0.3)] flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Appliquer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
