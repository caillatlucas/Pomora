"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface GridRect {
  colStart: number;
  rowStart: number;
  colSpan: number;
  rowSpan: number;
}

interface EditorContextType {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;
  updateRegistry: (id: string, rect: GridRect) => void;
  removeRegistry: (id: string) => void;
  checkCollision: (id: string, rect: GridRect) => boolean;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditor must be used within EditorProvider");
  return context;
};

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [gridRegistry, setGridRegistry] = useState<Record<string, GridRect>>({});

  const updateRegistry = (id: string, rect: GridRect) => {
    setGridRegistry(prev => ({ ...prev, [id]: rect }));
  };

  const removeRegistry = (id: string) => {
    setGridRegistry(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const checkCollision = (id: string, rect: GridRect) => {
    for (const key in gridRegistry) {
      if (key === id) continue;
      const other = gridRegistry[key];
      if (
        rect.colStart < other.colStart + other.colSpan &&
        rect.colStart + rect.colSpan > other.colStart &&
        rect.rowStart < other.rowStart + other.rowSpan &&
        rect.rowStart + rect.rowSpan > other.rowStart
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <EditorContext.Provider value={{ 
      isEditing, setIsEditing, isFocusMode, setIsFocusMode,
      updateRegistry, removeRegistry, checkCollision
    }}>
      {children}
    </EditorContext.Provider>
  );
};
