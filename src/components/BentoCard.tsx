"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { useSettings } from "./SettingsProvider";
import { useEditor } from "./EditorProvider";
import { Maximize2, Grip } from "lucide-react";

interface BentoCardProps {
  id: string;
  children: React.ReactNode;
  defaultColStart: number;
  defaultRowStart: number;
  defaultColSpan: number;
  defaultRowSpan: number;
  isHidden?: boolean;
  layoutId?: string;
  className?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({ 
  id, children, defaultColStart, defaultRowStart, defaultColSpan, defaultRowSpan, isHidden, layoutId, className = "" 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { blurOpacity } = useSettings();
  const { isEditing, isFocusMode, updateRegistry, removeRegistry, checkCollision } = useEditor();

  const [mounted, setMounted] = useState(false);
  const [gridState, setGridState] = useState({
    colStart: defaultColStart,
    rowStart: defaultRowStart,
    colSpan: defaultColSpan,
    rowSpan: defaultRowSpan
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(`pomora_grid_${id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGridState(parsed);
      } catch(e) {}
    }
  }, [id]);

  useEffect(() => {
    if (mounted) {
      updateRegistry(id, {
        colStart: gridState.colStart,
        rowStart: gridState.rowStart,
        colSpan: gridState.colSpan,
        rowSpan: gridState.rowSpan
      });
    }
    return () => removeRegistry(id);
  }, [id, gridState, mounted]);

  // 3D Parallax & LiquidGlass
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], isEditing ? ["0deg", "0deg"] : ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], isEditing ? ["0deg", "0deg"] : ["-6deg", "6deg"]);

  const innerX = useTransform(mouseXSpring, [-0.5, 0.5], [-6, 6]);
  const innerY = useTransform(mouseYSpring, [-0.5, 0.5], [-6, 6]);

  const haloX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const haloY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  const haloBackground = useMotionTemplate`radial-gradient(circle at ${haloX}% ${haloY}%, rgba(255,255,255,0.03) 0%, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditing || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!mounted) return null;

  return (
    <motion.div
      ref={ref}
      layoutId={layoutId}
      layout={isFocusMode && id === "timer" ? false : true}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isHidden ? 0 : 1,
        scale: isHidden ? 0.95 : 1,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.8 }}
      style={{
        gridColumn: isFocusMode && id === "timer" ? undefined : `${gridState.colStart} / span ${gridState.colSpan}`,
        gridRow: isFocusMode && id === "timer" ? undefined : `${gridState.rowStart} / span ${gridState.rowSpan}`,
        rotateX: isFocusMode && id === "timer" ? 0 : rotateX,
        rotateY: isFocusMode && id === "timer" ? 0 : rotateY,
        transform: isFocusMode && id === "timer" ? "none" : undefined,
        transformStyle: isFocusMode && id === "timer" ? undefined : "preserve-3d",
        pointerEvents: isHidden || (isFocusMode && id !== "timer") ? "none" : "auto",
        backdropFilter: isFocusMode && id === "timer" ? "none" : `blur(${blurOpacity}px) saturate(180%)`,
        WebkitBackdropFilter: isFocusMode && id === "timer" ? "none" : `blur(${blurOpacity}px) saturate(180%)`,
        zIndex: isFocusMode && id === "timer" ? 100 : (isEditing ? 20 : 10)
      }}
      className={`relative rounded-3xl overflow-hidden group ${
        isEditing ? 'border border-primary/50 border-dashed shadow-[0_0_20px_rgba(255,49,49,0.1)]' : ''
      } ${
        isFocusMode && id === "timer" 
          ? '!fixed !top-0 !left-0 !right-0 !bottom-0 !w-[100vw] !h-[100vh] !max-w-none !max-h-none !m-0 !p-0 bg-[#050505] !rounded-none !transform-none !z-[150]' 
          : 'bg-[#0f0f0f]/70'
      } ${
        isFocusMode && id !== "timer" ? '!opacity-0 !pointer-events-none' : ''
      } ${className}`}
    >
      {/* Background Pointillés en mode Édition */}
      {isEditing && (
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      )}

      {/* Specular Edge */}
      {!isEditing && (
        <div className="absolute inset-0 rounded-3xl pointer-events-none p-[1px] bg-gradient-to-br from-white/20 via-transparent to-transparent mask-image-content" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
      )}
      {!isEditing && (
        <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" />
      )}

      {/* Halo */}
      {!isEditing && (
        <motion.div 
          style={{ background: haloBackground }}
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        />
      )}

      <motion.div
        style={{
          x: isEditing || isFocusMode ? 0 : innerX,
          y: isEditing || isFocusMode ? 0 : innerY,
          transform: isEditing || isFocusMode ? "none" : "translateZ(30px)",
          transformStyle: "preserve-3d",
        }}
        className={`h-full w-full p-6 flex flex-col relative z-10 ${isFocusMode && id === "timer" ? "items-center justify-center" : ""} overflow-y-auto custom-scrollbar overflow-x-hidden`}
      >
        {children}
      </motion.div>

      {/* Move Handle (Grid mode) */}
      {isEditing && (
        <div 
          className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center cursor-move z-50 text-white/50 hover:text-white bg-black/50 rounded-lg"
          onPointerDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startCol = gridState.colStart;
            const startRow = gridState.rowStart;

            const onPointerMove = (eMove: PointerEvent) => {
              const deltaX = Math.round((eMove.clientX - startX) / 80);
              const deltaY = Math.round((eMove.clientY - startY) / 80);
              
              const newCol = Math.max(1, startCol + deltaX);
              const newRow = Math.max(1, startRow + deltaY);
              
              if (!checkCollision(id, { colStart: newCol, rowStart: newRow, colSpan: gridState.colSpan, rowSpan: gridState.rowSpan })) {
                setGridState(prev => ({ ...prev, colStart: newCol, rowStart: newRow }));
              }
            };

            const onPointerUp = () => {
              window.removeEventListener("pointermove", onPointerMove);
              window.removeEventListener("pointerup", onPointerUp);
              setGridState(latest => {
                localStorage.setItem(`pomora_grid_${id}`, JSON.stringify(latest));
                return latest;
              });
            };

            window.addEventListener("pointermove", onPointerMove);
            window.addEventListener("pointerup", onPointerUp);
          }}
        >
          <Grip className="w-4 h-4" />
        </div>
      )}

      {/* Resize Handle (Grid mode) */}
      {isEditing && (
        <div 
          className="absolute bottom-2 right-2 w-6 h-6 cursor-nwse-resize z-50 text-primary drop-shadow-[0_0_10px_rgba(255,49,49,0.8)]"
          onPointerDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startSpanW = gridState.colSpan;
            const startSpanH = gridState.rowSpan;

            const onPointerMove = (eMove: PointerEvent) => {
              const deltaX = Math.round((eMove.clientX - startX) / 80);
              const deltaY = Math.round((eMove.clientY - startY) / 80);
              
              const newSpanW = Math.max(2, Math.min(12, startSpanW + deltaX));
              const newSpanH = Math.max(2, startSpanH + deltaY);
              
              if (!checkCollision(id, { colStart: gridState.colStart, rowStart: gridState.rowStart, colSpan: newSpanW, rowSpan: newSpanH })) {
                setGridState(prev => ({ ...prev, colSpan: newSpanW, rowSpan: newSpanH }));
              }
            };

            const onPointerUp = () => {
              window.removeEventListener("pointermove", onPointerMove);
              window.removeEventListener("pointerup", onPointerUp);
              setGridState(latest => {
                localStorage.setItem(`pomora_grid_${id}`, JSON.stringify(latest));
                return latest;
              });
            };

            window.addEventListener("pointermove", onPointerMove);
            window.addEventListener("pointerup", onPointerUp);
          }}
        >
          <Maximize2 className="w-full h-full" />
        </div>
      )}
    </motion.div>
  );
};
