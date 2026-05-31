"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface EditorContextType {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;
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

  return (
    <EditorContext.Provider value={{ isEditing, setIsEditing, isFocusMode, setIsFocusMode }}>
      {children}
    </EditorContext.Provider>
  );
};
