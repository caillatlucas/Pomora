"use client";

import React, { useState, useEffect } from "react";
import { Plus, Database, FileText, Search, X, Link } from "lucide-react";
import { useToast } from "./ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

interface KnowledgeBlock {
  id: string;
  title: string;
  content: string;
  date: number;
}

export const KnowledgeBaseTool = () => {
  const [blocks, setBlocks] = useState<KnowledgeBlock[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "browse">("write");
  const [selectedBlock, setSelectedBlock] = useState<KnowledgeBlock | null>(null);
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("pomora_knowledge");
    if (saved) {
      try {
        setBlocks(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur parsing knowledge base");
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("pomora_knowledge", JSON.stringify(blocks));
    }
  }, [blocks, mounted]);

  const addBlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newBlock: KnowledgeBlock = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      date: Date.now(),
    };

    setBlocks((prev) => [newBlock, ...prev]);
    setTitle("");
    setContent("");
    setActiveTab("browse");
    addToast("Bloc ajouté à la base de connaissances.");
  };

  const associateSession = () => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTitle(`Session Focus - ${timeString}`);
    setContent("Notes de la session : \n- ");
  };

  const saveEditedBlock = () => {
    if (selectedBlock) {
      setBlocks(prev => prev.map(b => b.id === selectedBlock.id ? selectedBlock : b));
      setSelectedBlock(null);
      addToast("Note mise à jour.");
    }
  };

  if (!mounted) return null;

  const filteredBlocks = blocks.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="flex flex-col w-full h-full font-body">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-2 mb-4">
          <button 
            onClick={() => setActiveTab("write")}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "write" ? "text-primary drop-shadow-[0_0_5px_rgba(255,49,49,0.8)]" : "text-white/40 hover:text-white"}`}
          >
            Écrire
          </button>
          <button 
            onClick={() => setActiveTab("browse")}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "browse" ? "text-primary drop-shadow-[0_0_5px_rgba(255,49,49,0.8)]" : "text-white/40 hover:text-white"}`}
          >
            Explorer
          </button>
        </div>

        {/* Tab: Write */}
        {activeTab === "write" && (
          <div className="flex-1 flex flex-col h-full gap-3 relative z-10">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la note..."
              className="w-full bg-transparent border-b border-white/10 py-2 text-white font-bold text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-white/30"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Vos pensées..."
              className="w-full flex-1 bg-transparent resize-none py-2 text-sm text-white/70 focus:outline-none placeholder:text-white/20 custom-scrollbar"
            />
            <div className="flex items-center justify-between mt-auto pt-2">
              <button 
                onClick={associateSession}
                className="text-xs text-white/40 hover:text-primary transition-colors flex items-center gap-1"
                title="Associer à la session"
              >
                <Link className="w-3 h-3" /> Auto-remplir
              </button>
              <button
                onClick={addBlock}
                disabled={!title.trim() || !content.trim()}
                className="py-1.5 px-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        )}

        {/* Tab: Browse */}
        {activeTab === "browse" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Chercher une note..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-3 custom-scrollbar content-start">
              {filteredBlocks.length === 0 ? (
                <p className="text-xs text-white/40 col-span-2 text-center mt-4">Aucun résultat.</p>
              ) : (
                filteredBlocks.map((block) => (
                  <div 
                    key={block.id}
                    onClick={() => setSelectedBlock(block)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10 flex flex-col justify-between group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white truncate">{block.title}</h4>
                      <p className="text-xs text-white/50 line-clamp-3 mt-1">{block.content}</p>
                    </div>
                    {/* Fake NotebookLM Generate Tags */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToast("Tags IA générés (Simulé) !"); }}
                      className="mt-3 w-full py-1 rounded bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20"
                    >
                      ✨ Résumer
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Reading Modal (LiquidGlass) */}
      <AnimatePresence>
        {selectedBlock && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlock(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-3xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl h-full max-h-[80vh] bg-[#0f0f0f]/50 backdrop-blur-xl saturate-[180%] border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col font-body"
            >
              <div className="absolute inset-0 rounded-3xl pointer-events-none p-[1px] bg-gradient-to-br from-white/20 via-transparent to-transparent mask-image-content" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

              <div className="flex justify-between items-start mb-6">
                <input 
                  type="text"
                  value={selectedBlock.title}
                  onChange={(e) => setSelectedBlock({...selectedBlock, title: e.target.value})}
                  className="bg-transparent text-2xl md:text-3xl font-display font-bold text-white focus:outline-none w-full mr-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                />
                <button onClick={() => setSelectedBlock(null)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <textarea 
                value={selectedBlock.content}
                onChange={(e) => setSelectedBlock({...selectedBlock, content: e.target.value})}
                className="w-full flex-1 bg-transparent text-white/80 text-base md:text-lg leading-relaxed resize-none focus:outline-none custom-scrollbar"
              />

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={saveEditedBlock}
                  className="px-6 py-2 bg-primary text-white font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(255,49,49,0.3)]"
                >
                  Fermer & Sauvegarder
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
