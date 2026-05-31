"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BentoCard } from "@/components/BentoCard";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { TodoList } from "@/components/TodoList";
import { AmbientPlayer } from "@/components/AmbientPlayer";
import { KnowledgeBaseTool } from "@/components/KnowledgeBaseTool";
import { BackgroundEngine } from "@/components/BackgroundEngine";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <BackgroundEngine />
      <SettingsModal />
      <FloatingToolbar />
      
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
          <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[60px] gap-6 relative">
            
            {/* Pomodoro Timer - Large */}
            <BentoCard 
              id="timer" 
              defaultColStart={1} defaultRowStart={1} 
              defaultColSpan={6} defaultRowSpan={4}
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
              defaultColStart={7} defaultRowStart={1} 
              defaultColSpan={2} defaultRowSpan={4}
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
              defaultColStart={9} defaultRowStart={1} 
              defaultColSpan={2} defaultRowSpan={4}
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
              defaultColStart={11} defaultRowStart={1} 
              defaultColSpan={2} defaultRowSpan={4}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-body font-bold uppercase tracking-widest text-white/80 drop-shadow-[0_0_10px_rgba(255,49,49,0.3)]">
                  Statistiques
                </h2>
                <BarChart2 className="text-white/40 w-4 h-4" />
              </div>
              <StatCard />
            </BentoCard>

            <BentoCard 
              id="knowledge" 
              defaultColStart={1} defaultRowStart={5} 
              defaultColSpan={8} defaultRowSpan={4}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-body font-bold uppercase tracking-widest text-white/80 drop-shadow-[0_0_10px_rgba(255,49,49,0.3)]">
                  Knowledge Base
                </h2>
                <BookOpen className="text-primary w-5 h-5 drop-shadow-[0_0_10px_rgba(255,49,49,0.5)]" />
              </div>
              <KnowledgeBaseTool />
            </BentoCard>

            <BentoCard 
              id="audio" 
              defaultColStart={9} defaultRowStart={5} 
              defaultColSpan={4} defaultRowSpan={4}
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
