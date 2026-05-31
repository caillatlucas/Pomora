"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useSettings } from "./SettingsProvider";

const RAIN_URL = "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg";

interface Track {
  id: string;
  url: string;
  volume: number;
  isActive: boolean;
  isRadio?: boolean;
}

export interface YoutubeMetadata {
  title: string;
  author: string;
  videoId: string;
}

interface AudioContextType {
  tracks: Record<string, Track>;
  toggleTrack: (id: string) => void;
  setVolume: (id: string, volume: number) => void;
  isRadioPlaying: boolean;
  toggleRadio: () => void;
  youtubeMetadata: YoutubeMetadata | null;
  youtubeVolume: number;
  setYoutubeVolume: (vol: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useBackgroundAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useBackgroundAudio must be used within AudioProvider");
  return context;
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

function parseYoutubeUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const list = parsedUrl.searchParams.get("list");
    if (list) return { type: "playlist", id: list };
    
    const v = parsedUrl.searchParams.get("v");
    if (v) return { type: "video", id: v };

    if (parsedUrl.hostname === "youtu.be") {
      const path = parsedUrl.pathname.slice(1);
      if (path) return { type: "video", id: path };
    }
  } catch (e) {
    // Ignore invalid urls
  }
  return null;
}

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const { youtubeUrl } = useSettings();

  const [tracks, setTracks] = useState<Record<string, Track>>({
    rain: { id: "rain", url: RAIN_URL, volume: 0.5, isActive: false },
  });
  
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [youtubeMetadata, setYoutubeMetadata] = useState<YoutubeMetadata | null>(null);

  const audioInstances = useRef<Record<string, HTMLAudioElement>>({});
  const ytPlayerRef = useRef<any>(null);

  const [youtubeVolume, setYoutubeVolume] = useState(50);

  // Intervalle pour rafraîchir les métadonnées (utile pour les playlists)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRadioPlaying && isPlayerReady && ytPlayerRef.current) {
      interval = setInterval(() => {
        if (ytPlayerRef.current.getVideoData) {
          const data = ytPlayerRef.current.getVideoData();
          if (data && data.video_id) {
            setYoutubeMetadata(prev => {
              if (!prev || prev.videoId !== data.video_id) {
                return {
                  title: data.title,
                  author: data.author,
                  videoId: data.video_id
                };
              }
              return prev;
            });
          }
        }
      }, 2000); // Check every 2s
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRadioPlaying, isPlayerReady]);

  // Initialize YouTube API & Ambient Sounds
  useEffect(() => {
    Object.values(tracks).forEach((track) => {
      if (!track.isRadio) {
        const audio = new Audio(track.url);
        audio.loop = true;
        audio.volume = track.volume;
        audioInstances.current[track.id] = audio;
      }
    });

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = () => {
        initYoutubePlayer();
      };
    } else {
      initYoutubePlayer();
    }

    return () => {
      Object.values(audioInstances.current).forEach((audio) => {
        audio.pause();
      });
      audioInstances.current = {};
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        ytPlayerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initYoutubePlayer = () => {
    // Create an invisible div for the iframe
    let container = document.getElementById("youtube-player-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "youtube-player-container";
      container.style.display = "none";
      document.body.appendChild(container);
    }

    ytPlayerRef.current = new window.YT.Player("youtube-player-container", {
      height: '0',
      width: '0',
      playerVars: {
        autoplay: 0,
        loop: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1
      },
      events: {
        onReady: () => {
          setIsPlayerReady(true);
          ytPlayerRef.current.setVolume(youtubeVolume);
        },
        onStateChange: (event: any) => {
          // 1 = PLAYING, 2 = PAUSED, 0 = ENDED (should loop though)
          if (event.data === 1) {
            setIsRadioPlaying(true);
            ytPlayerRef.current.setLoop(true); // Ensure loop is set when playing
            const data = ytPlayerRef.current.getVideoData();
            if (data && data.video_id) {
              setYoutubeMetadata({ title: data.title, author: data.author, videoId: data.video_id });
            }
          } else if (event.data === 2 || event.data === 0) {
            setIsRadioPlaying(false);
          }
        }
      }
    });
  };

  // Sync YouTube URL
  useEffect(() => {
    if (!isPlayerReady || !ytPlayerRef.current) return;
    const parsed = parseYoutubeUrl(youtubeUrl);
    if (!parsed) return;

    if (parsed.type === "playlist") {
      if (isRadioPlaying) {
        ytPlayerRef.current.loadPlaylist({ list: parsed.id, listType: 'playlist' });
      } else {
        ytPlayerRef.current.cuePlaylist({ list: parsed.id, listType: 'playlist' });
      }
    } else {
      if (isRadioPlaying) {
        ytPlayerRef.current.loadPlaylist({ playlist: parsed.id });
      } else {
        ytPlayerRef.current.cuePlaylist({ playlist: parsed.id });
      }
    }
  }, [youtubeUrl, isPlayerReady]);

  const toggleTrack = (id: string) => {
    setTracks(prev => {
      const newState = { ...prev, [id]: { ...prev[id], isActive: !prev[id].isActive } };
      const audio = audioInstances.current[id];
      if (audio) {
        if (newState[id].isActive) {
          audio.play().catch(() => console.error(`Failed to play ${id}`));
        } else {
          audio.pause();
        }
      }
      return newState;
    });
  };

  const setVolume = (id: string, volume: number) => {
    setTracks(prev => ({ ...prev, [id]: { ...prev[id], volume } }));
    const audio = audioInstances.current[id];
    if (audio) {
      audio.volume = volume;
    }
  };

  const updateYoutubeVolume = (vol: number) => {
    setYoutubeVolume(vol);
    if (ytPlayerRef.current && isPlayerReady) {
      ytPlayerRef.current.setVolume(vol);
    }
  };

  const toggleRadio = () => {
    if (!ytPlayerRef.current || !isPlayerReady) return;
    
    if (isRadioPlaying) {
      ytPlayerRef.current.pauseVideo();
    } else {
      ytPlayerRef.current.playVideo();
    }
  };

  return (
    <AudioContext.Provider value={{ tracks, toggleTrack, setVolume, isRadioPlaying, toggleRadio, youtubeMetadata, youtubeVolume, setYoutubeVolume: updateYoutubeVolume }}>
      {children}
    </AudioContext.Provider>
  );
};
