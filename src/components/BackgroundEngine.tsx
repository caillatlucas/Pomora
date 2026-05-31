"use client";

import React from "react";
import { useSettings } from "./SettingsProvider";
import { motion } from "framer-motion";

export const BackgroundEngine = () => {
  const { backgroundUrl } = useSettings();
  
  const isVideo = backgroundUrl?.toLowerCase().match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden bg-[#050505]">
      {/* Overlay Vignettage Noir */}
      <div className="absolute inset-0 z-20 bg-black/60 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-[#050505] pointer-events-none" />
      
      {/* Background Media */}
      {backgroundUrl && (
        <div className="absolute inset-0 z-0 opacity-40">
          {isVideo ? (
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={backgroundUrl} />
            </video>
          ) : (
            <img src={backgroundUrl} alt="Background" className="w-full h-full object-cover" />
          )}
        </div>
      )}

      {/* Aurora Liquide (Blobs) */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-80 mix-blend-screen">
        <motion.div 
          animate={{ x: [0, 100, -50, 0], y: [0, -50, 100, 0], scale: [1, 1.2, 0.8, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-purple-900/30 blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -100, 50, 0], y: [0, 100, -50, 0], scale: [1, 1.5, 0.9, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#ff3131]/20 blur-[150px]"
        />
        <motion.div 
          animate={{ x: [0, 50, -100, 0], y: [0, -100, 50, 0], scale: [1, 0.8, 1.3, 1] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] left-[40%] w-[35vw] h-[35vw] rounded-full bg-blue-900/20 blur-[100px]"
        />
      </div>
    </div>
  );
};
