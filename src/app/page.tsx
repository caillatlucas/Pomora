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
import { Timer, CheckSquare, Music, BarChart2, BookOpen, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useEditor } from "@/components/EditorProvider";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { isFocusMode } = useEditor();
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [droppedDocs, setDroppedDocs] = useState<DocItem[]>([]);

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
      <FloatingToolbar onToggleDocs={() => setIsDocsOpen(prev => !prev)} isDocsOpen={isDocsOpen} />
      <DocumentsDrawer isOpen={isDocsOpen} setIsOpen={setIsDocsOpen} />
      <PlaylistPreview />
      
      <main className="min-h-screen p-6 md:p-12 lg:p-24 flex flex-col items-center overflow-x-hidden text-white relative z-10">
        
        <motion.div 
          className="w-full max-w-6xl pb-40 transition-opacity duration-1000"
        >
          <div className="mb-12 md:mb-20 text-center pt-10">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-primary mb-4 drop-shadow-[0_0_20px_rgba(255,49,49,0.5)]">
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
                defaultRowStart={5 + Math.floor(idx / 2) * 4} 
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
                    <img src={doc.content} alt={doc.title} className="w-full h-full object-cover rounded-xl" />
                  )}
                  {doc.type === "youtube" && (
                    <a href={doc.content} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center h-full text-center hover:bg-white/5 rounded-xl transition-colors border border-dashed border-white/20">
                      <Music className="w-8 h-8 text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
                      <span className="text-xs font-bold text-white uppercase tracking-widest">Ouvrir la vidéo</span>
                    </a>
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
      </main>
    </>
  );
}
