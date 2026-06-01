"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BentoCard } from "@/components/BentoCard";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { TodoList } from "@/components/TodoList";
import { AmbientPlayer } from "@/components/AmbientPlayer";
import { DocumentsDrawer, DocItem } from "@/components/DocumentsDrawer";
import { BackgroundEngine } from "@/components/BackgroundEngine";
import { PlaylistPreview } from "@/components/PlaylistPreview";
import { SettingsModal } from "@/components/SettingsModal";
import { StatCard } from "@/components/StatCard";
import { FloatingToolbar } from "@/components/FloatingToolbar";
import { SessionGoal } from "@/components/SessionGoal";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Timer, CheckSquare, Music, BarChart2, BookOpen, Target, Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useEditor } from "@/components/EditorProvider";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { isFocusMode } = useEditor();
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [droppedDocs, setDroppedDocs] = useState<DocItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<DocItem | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("pomora_droppedDocs");
    if (saved) {
      try { setDroppedDocs(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("pomora_droppedDocs", JSON.stringify(droppedDocs));
    }
  }, [droppedDocs, mounted]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (data) {
      try {
        const doc = JSON.parse(data) as DocItem;
        if (!droppedDocs.find(d => d.id === doc.id)) {
          setDroppedDocs(prev => [...prev, doc]);
        }
      } catch(e) {}
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeDoc = (id: string) => {
    setDroppedDocs(prev => prev.filter(d => d.id !== id));
  };

  if (!mounted) return null;

  return (
    <>
      <BackgroundEngine />
      <SettingsModal />
      <WeatherWidget />
      <FloatingToolbar onToggleDocs={() => setIsDocsOpen(prev => !prev)} isDocsOpen={isDocsOpen} />
      <DocumentsDrawer isOpen={isDocsOpen} setIsOpen={setIsDocsOpen} />
      <PlaylistPreview />
      
      <main className="min-h-screen p-4 md:p-6 lg:p-12 flex flex-col items-center overflow-x-hidden text-white relative z-10">
        
        <motion.div 
          className="w-full max-w-6xl transition-opacity duration-1000"
        >
          <div className="mb-6 md:mb-10 text-center pt-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary mb-2 drop-shadow-[0_0_20px_rgba(255,49,49,0.5)]">
              Pomora
            </h1>
            <p className="opacity-70 text-lg md:text-xl font-body drop-shadow-md">
              Votre espace de productivité LiquidGlass.
            </p>
          </div>
        </motion.div>

        {/* Bento Grid 12 Colonnes Container */}
        <div className="w-full max-w-6xl">
          <div 
            className="grid grid-cols-1 md:grid-cols-12 auto-rows-[60px] gap-6 relative"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            
            {/* Pomodoro Timer - Large */}
            <BentoCard 
              id="timer" 
              defaultColStart={1} defaultRowStart={3} 
              defaultColSpan={3} defaultRowSpan={5}
              layoutId={isFocusMode ? undefined : "pomodoro-timer"}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-body font-bold uppercase tracking-widest text-white/80 drop-shadow-[0_0_10px_rgba(255,49,49,0.3)]">
                  Pomodoro Timer
                </h2>
                <Timer className="text-primary w-5 h-5 drop-shadow-[0_0_10px_rgba(255,49,49,0.5)]" />
              </div>
              <PomodoroTimer />
            </BentoCard>

            <BentoCard 
              id="session-goal" 
              defaultColStart={11} defaultRowStart={3} 
              defaultColSpan={2} defaultRowSpan={2}
            >
              <div className="absolute top-4 left-4 flex items-center justify-between w-[calc(100%-2rem)]">
                <h2 className="text-sm font-body font-bold uppercase tracking-widest text-white/80 drop-shadow-[0_0_10px_rgba(255,49,49,0.3)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Objectif
                </h2>
              </div>
              <SessionGoal />
            </BentoCard>

            <BentoCard 
              id="todo" 
              defaultColStart={8} defaultRowStart={5} 
              defaultColSpan={5} defaultRowSpan={3}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-body font-bold uppercase tracking-widest text-white/80 drop-shadow-[0_0_10px_rgba(255,49,49,0.3)]">
                  To-Do List
                </h2>
                <CheckSquare className="text-primary w-4 h-4 drop-shadow-[0_0_10px_rgba(255,49,49,0.5)]" />
              </div>
              <TodoList />
            </BentoCard>

            <BentoCard 
              id="stats" 
              defaultColStart={8} defaultRowStart={3} 
              defaultColSpan={3} defaultRowSpan={2}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-body font-bold uppercase tracking-widest text-white/80 drop-shadow-[0_0_10px_rgba(255,49,49,0.3)]">
                  Statistiques
                </h2>
                <BarChart2 className="text-white/40 w-4 h-4" />
              </div>
              <StatCard />
            </BentoCard>

            {droppedDocs.map((doc, idx) => (
              <BentoCard 
                key={doc.id}
                id={`doc-${doc.id}`}
                defaultColStart={(idx % 2 === 0) ? 1 : 7} 
                defaultRowStart={8 + Math.floor(idx / 2) * 4} 
                defaultColSpan={6} defaultRowSpan={4}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-body font-bold uppercase tracking-widest text-white/80 drop-shadow-[0_0_10px_rgba(255,49,49,0.3)] truncate max-w-[200px]">
                    {doc.title}
                  </h2>
                  <button onClick={() => removeDoc(doc.id)} className="text-white/40 hover:text-primary transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                  {doc.type === "note" && (
                    <p className="text-sm text-white/70 whitespace-pre-wrap">{doc.content}</p>
                  )}
                  {doc.type === "image" && (
                    <div className="relative group w-full h-full">
                      <img src={doc.content} alt={doc.title} className="w-full h-full object-cover rounded-xl" />
                      <button onClick={() => setSelectedMedia(doc)} className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-primary text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {doc.type === "youtube" && (
                    (() => {
                      const match = doc.content.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                      const videoId = match ? match[1] : null;
                      return videoId ? (
                        <div className="relative group w-full h-full">
                          <iframe 
                            src={`https://www.youtube.com/embed/${videoId}`} 
                            title={doc.title}
                            className="w-full h-full rounded-xl border-0 pointer-events-auto"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                          />
                          <button onClick={() => setSelectedMedia(doc)} className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-primary text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md z-10">
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <a href={doc.content} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center h-full text-center hover:bg-white/5 rounded-xl transition-colors border border-dashed border-white/20">
                          <Music className="w-8 h-8 text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
                          <span className="text-xs font-bold text-white uppercase tracking-widest">Lien Invalide / Ouvrir</span>
                        </a>
                      );
                    })()
                  )}
                  {doc.type === "pdf" && (
                    <a href={doc.content} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center h-full text-center hover:bg-white/5 rounded-xl transition-colors border border-dashed border-white/20">
                      <BookOpen className="w-8 h-8 text-orange-400 mb-2 drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]" />
                      <span className="text-xs font-bold text-white uppercase tracking-widest">Ouvrir le PDF</span>
                    </a>
                  )}
                </div>
              </BentoCard>
            ))}

            <BentoCard 
              id="audio" 
              defaultColStart={4} defaultRowStart={3} 
              defaultColSpan={4} defaultRowSpan={5}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-body font-bold uppercase tracking-widest text-white/80 drop-shadow-[0_0_10px_rgba(255,49,49,0.3)]">
                  Focus Audio
                </h2>
                <Music className="text-primary w-4 h-4 drop-shadow-[0_0_10px_rgba(255,49,49,0.5)]" />
              </div>
              <AmbientPlayer />
            </BentoCard>

          </div>
        </div>

        {/* Footer */}
        <div className="w-full max-w-6xl mt-24 mb-12 flex flex-col items-center justify-center gap-2 text-white/40 text-sm font-body">
          <p>Made by <span className="font-bold text-white/60">lc.20ytb</span></p>
          <div className="flex items-center gap-4">
            <a href="mailto:caillatlucas2304@gmail.com" className="hover:text-primary transition-colors">caillatlucas2304@gmail.com</a>
            <span>|</span>
            <a href="https://instagram.com/lc.20ytb" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">IG: lc.20ytb</a>
          </div>
        </div>
      </main>

      {/* Fullscreen Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 md:p-12"
            onClick={() => setSelectedMedia(null)}
          >
            <button 
              onClick={() => setSelectedMedia(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl max-h-[85vh] h-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              {selectedMedia.type === "image" && (
                <img src={selectedMedia.content} alt={selectedMedia.title} className="w-full h-full object-contain" />
              )}
              {selectedMedia.type === "youtube" && (() => {
                const match = selectedMedia.content.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                const videoId = match ? match[1] : null;
                return videoId ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
                    title={selectedMedia.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                ) : null;
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
