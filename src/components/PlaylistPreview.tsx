"use client";

import React from "react";
import { useBackgroundAudio } from "./AudioProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Play } from "lucide-react";

export const PlaylistPreview = () => {
  const { playlist, playlistIndex, youtubeMetadata, isRadioPlaying, playVideoAt } = useBackgroundAudio();

  // if no metadata, we don't know what's playing yet
  if (!youtubeMetadata) return null;

  const currentVideoId = youtubeMetadata.videoId;
  
  let nextVideos: string[] = [];
  if (playlist && playlist.length > 0) {
    const nextIndex = playlistIndex + 1;
    if (nextIndex < playlist.length) {
      nextVideos = playlist.slice(nextIndex, nextIndex + 3);
    }
  }

  const [metadataCache, setMetadataCache] = React.useState<Record<string, {title: string, author: string}>>({});

  React.useEffect(() => {
    if (nextVideos.length > 0) {
      nextVideos.forEach(id => {
        if (!metadataCache[id]) {
          fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`)
            .then(res => res.json())
            .then(data => {
              if (data.title) {
                setMetadataCache(prev => ({...prev, [id]: { title: data.title, author: data.author_name }}));
              }
            }).catch(() => {});
        }
      });
    }
  }, [playlistIndex, playlist]); // Only re-run when playlist index or playlist changes

  return (
    <div className="fixed top-6 left-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {/* Current Video */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-2 pr-4 shadow-lg w-fit pointer-events-auto transition-transform hover:scale-105"
      >
        <div className="relative w-16 h-10 rounded-md overflow-hidden bg-black/50 flex-shrink-0">
          <img 
            src={`https://img.youtube.com/vi/${currentVideoId}/mqdefault.jpg`} 
            alt="Current" 
            className="w-full h-full object-cover opacity-80"
          />
          {isRadioPlaying && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <Music className="w-4 h-4 text-white animate-pulse drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
            </div>
          )}
        </div>
        <div className="flex flex-col max-w-[150px]">
          <span className="text-[10px] uppercase text-primary font-bold tracking-widest drop-shadow-[0_0_5px_rgba(255,49,49,0.5)]">
            En cours
          </span>
          <span className="text-xs text-white font-bold truncate">
            {youtubeMetadata.title}
          </span>
        </div>
      </motion.div>

      {/* Next Videos */}
      <AnimatePresence>
        {nextVideos.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-col gap-2 pl-4 border-l border-white/10 ml-4 pointer-events-auto"
          >
            <span className="text-[9px] uppercase text-white/40 font-bold tracking-widest mb-1">À suivre</span>
            {nextVideos.map((id, i) => (
              <div 
                key={id + i} 
                onClick={() => playVideoAt(playlistIndex + 1 + i)}
                className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group/item"
              >
                <div className="relative w-12 h-7 rounded overflow-hidden bg-black/30 shadow">
                  <img 
                    src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} 
                    alt="Next" 
                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 flex items-center justify-center transition-colors">
                    <Play className="w-3 h-3 text-white opacity-0 group-hover/item:opacity-100 transition-opacity" fill="currentColor" />
                  </div>
                </div>
                <div className="flex flex-col max-w-[150px]">
                  <span className="text-[10px] text-white/70 font-bold truncate">
                    {metadataCache[id]?.title || `Piste ${playlistIndex + 2 + i}`}
                  </span>
                  {metadataCache[id]?.author && (
                    <span className="text-[9px] text-white/40 truncate">
                      {metadataCache[id].author}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
