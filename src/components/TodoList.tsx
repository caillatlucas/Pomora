"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check, Plus } from "lucide-react";
import { useUISound } from "@/hooks/useUISound";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const { playSound } = useUISound();

  // Charger les tâches depuis le localStorage au montage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("pomora_tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur de parsing des tâches");
      }
    }
  }, []);

  // Sauvegarder dans localStorage à chaque modification
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("pomora_tasks", JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  const addTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
    };
    
    // On ajoute en haut de la liste
    setTasks((prev) => [newTask, ...prev]);
    setInputValue("");
    playSound("click");
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      playSound(task.completed ? "click" : "check");
    }
    setTasks((prev) => 
      prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id: string) => {
    playSound("pop");
    setTasks((prev) => prev.filter(task => task.id !== id));
  };

  // Éviter l'erreur d'hydratation côté serveur
  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col w-full h-full font-body overflow-hidden">
      {/* Champ de saisie minimaliste */}
      <form onSubmit={addTask} className="relative mb-4 mt-2">
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ajouter une tâche..."
          className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-2 pr-8 text-text-light dark:text-text-dark text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-text-light-dim/40 dark:placeholder:text-text-dark-dim/40"
        />
        <button 
          type="submit"
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-text-light-dim/50 dark:text-text-dark-dim/50 hover:text-primary transition-colors"
          title="Ajouter la tâche"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* Liste des tâches */}
      <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Style hack pour cacher la scrollbar sur Chrome/Safari */}
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -15, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group flex items-center justify-between py-3 mb-1 border-b border-transparent hover:border-black/5 dark:hover:border-white/5 transition-colors"
            >
              <div 
                className="flex items-start gap-3 flex-1 cursor-pointer pr-2"
                onClick={() => toggleTask(task.id)}
              >
                <div 
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 rounded flex items-center justify-center border transition-all duration-300 ${task.completed ? 'bg-primary border-primary' : 'border-text-light-dim/30 dark:border-text-dark-dim/30 group-hover:border-primary'}`}
                >
                  {task.completed && <Check className="w-3 h-3 text-white" />}
                </div>
                <span 
                  className={`text-sm transition-all duration-300 break-words flex-1 ${task.completed ? 'line-through text-text-light-dim/40 dark:text-text-dark-dim/40' : 'text-text-light dark:text-text-dark'}`}
                >
                  {task.text}
                </span>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-text-light-dim/40 dark:text-text-dark-dim/40 hover:text-primary transition-all focus:opacity-100"
                aria-label="Supprimer la tâche"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-text-light-dim/40 dark:text-text-dark-dim/40 mt-8"
          >
            Aucune tâche. Profitez du moment présent.
          </motion.p>
        )}
      </div>
    </div>
  );
};
