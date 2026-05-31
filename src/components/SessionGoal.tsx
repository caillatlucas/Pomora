"use client";

import React, { useState, useEffect } from "react";
import { Target, Check } from "lucide-react";
import { motion } from "framer-motion";

export const SessionGoal = () => {
  const [goal, setGoal] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedGoal = localStorage.getItem("pomora_sessionGoal");
    if (savedGoal) {
      setGoal(savedGoal);
      setIsEditing(false);
    }
  }, []);

  const saveGoal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goal.trim()) return;
    setIsEditing(false);
    localStorage.setItem("pomora_sessionGoal", goal.trim());
  };

  const editGoal = () => {
    setIsEditing(true);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full font-body relative group">
      {isEditing ? (
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={saveGoal} 
          className="w-full flex flex-col items-center gap-3"
        >
          <label className="text-xs uppercase tracking-widest text-white/50 text-center">Quel est ton objectif principal ?</label>
          <input 
            type="text" 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Ex: Finir le rapport Q3..."
            className="w-full bg-transparent border-b border-primary/50 text-center py-2 text-lg text-white font-bold focus:outline-none focus:border-primary transition-colors placeholder:text-white/20"
            autoFocus
          />
        </motion.form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={editGoal}
          className="flex flex-col items-center justify-center w-full cursor-pointer text-center px-4"
        >
          <Target className="w-6 h-6 text-primary mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
          <p className="text-lg md:text-xl font-display font-bold text-white/80 group-hover:text-white transition-colors line-clamp-2">
            {goal}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-white/30 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            Cliquer pour modifier
          </p>
        </motion.div>
      )}
    </div>
  );
};
