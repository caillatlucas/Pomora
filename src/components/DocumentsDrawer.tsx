"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, FileText, Image as ImageIcon, File, Video, Link as LinkIcon, ExternalLink, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./ToastProvider";

export interface DocItem {
  id: string;
  type: "note" | "image" | "youtube" | "pdf";
  title: string;
  content: string; // for note: text, for others: URL
}

interface DocumentsDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const DocumentsDrawer: React.FC<DocumentsDrawerProps> = ({ isOpen, setIsOpen }) => {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [newType, setNewType] = useState<DocItem["type"]>("note");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("pomora_docs");
    if (saved) {
      try {
        setDocs(JSON.parse(saved));
      } catch(e){}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pomora_docs", JSON.stringify(docs));
  }, [docs]);

  const handleAdd = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const newDoc: DocItem = {
      id: Date.now().toString(),
      type: newType,
      title: newTitle.trim(),
      content: newContent.trim()
    };
    setDocs(prev => [newDoc, ...prev]);
    setNewTitle("");
    setNewContent("");
    setActiveTab("list");
    addToast("Document ajouté !");
  };

  const handleDelete = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case "note": return <FileText className="w-4 h-4 text-primary" />;
      case "image": return <ImageIcon className="w-4 h-4 text-blue-400" />;
      case "youtube": return <Video className="w-4 h-4 text-red-500" />;
      case "pdf": return <File className="w-4 h-4 text-orange-400" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drawer */}
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-[#0f0f0f]/90 backdrop-blur-xl border-l border-white/10 z-[250] flex flex-col font-body shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-display drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Documents & sources</h2>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex px-4 pt-4 gap-4 border-b border-white/10 pb-2">
              <button onClick={() => setActiveTab("list")} className={`text-xs font-bold uppercase tracking-widest ${activeTab === "list" ? "text-primary" : "text-white/40 hover:text-white"}`}>Mes Docs</button>
              <button onClick={() => setActiveTab("add")} className={`text-xs font-bold uppercase tracking-widest ${activeTab === "add" ? "text-primary" : "text-white/40 hover:text-white"}`}>Ajouter</button>
            </div>

            {activeTab === "list" ? (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
                {docs.length === 0 ? (
                  <p className="text-xs text-white/40 text-center mt-4">Aucun document. Cliquez sur Ajouter.</p>
                ) : (
                  docs.map(doc => (
                    <div 
                      key={doc.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("application/json", JSON.stringify(doc));
                      }}
                      className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/30 transition-colors group relative cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-3">
                        {getIcon(doc.type)}
                        <div className="flex-1 truncate pr-2">
                          <h4 className="text-sm font-bold text-white truncate">{doc.title}</h4>
                          <p className="text-xs text-white/40 truncate">{doc.type === 'note' ? doc.content : doc.content}</p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }} 
                          className="p-1.5 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors z-10 relative" 
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-[10px] uppercase text-white/30 bg-black/50 px-1.5 py-0.5 rounded">Glisser vers la grille</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/50 uppercase tracking-widest font-bold">Type de document</label>
                  <select 
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary [&>option]:bg-black"
                  >
                    <option value="note">Note Textuelle</option>
                    <option value="image">Image (Lien URL)</option>
                    <option value="youtube">Vidéo YouTube (Lien URL)</option>
                    <option value="pdf">PDF (Lien URL)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/50 uppercase tracking-widest font-bold">Titre</label>
                  <input 
                    type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                    placeholder="Mon document..."
                    className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary placeholder:text-white/20"
                  />
                </div>

                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-white/50 uppercase tracking-widest font-bold">{newType === 'note' ? "Contenu" : "URL du lien"}</label>
                  {newType === 'note' ? (
                    <textarea 
                      value={newContent} onChange={e => setNewContent(e.target.value)}
                      placeholder="Vos pensées..."
                      className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary placeholder:text-white/20 flex-1 resize-none custom-scrollbar"
                    />
                  ) : (
                    <input 
                      type="url" value={newContent} onChange={e => setNewContent(e.target.value)}
                      placeholder="https://..."
                      className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary placeholder:text-white/20"
                    />
                  )}
                </div>

                <button 
                  onClick={handleAdd}
                  disabled={!newTitle.trim() || !newContent.trim()}
                  className="w-full py-2 bg-primary text-white font-bold uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  Ajouter à mes docs
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
