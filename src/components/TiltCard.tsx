"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { useSettings } from "./SettingsProvider";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = "", delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { blurOpacity } = useSettings();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  // Parallaxe interne (décalage opposé au mouvement de la souris)
  const innerX = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);
  const innerY = useTransform(mouseYSpring, [-0.5, 0.5], [-12, 12]);

  // Halo lumineux sous la souris (Liquid Effect)
  const haloX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const haloY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  const haloBackground = useMotionTemplate`radial-gradient(circle at ${haloX}% ${haloY}%, rgba(255,255,255,0.06) 0%, transparent 50%)`;

  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]);
  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 40px -10px rgba(0, 0, 0, 0.8)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      style={{
        rotateX,
        rotateY,
        boxShadow,
        transformStyle: "preserve-3d",
        backdropFilter: `blur(${blurOpacity}px) saturate(180%)`,
        WebkitBackdropFilter: `blur(${blurOpacity}px) saturate(180%)`
      }}
      className={`relative rounded-3xl bg-[#0f0f0f]/70 overflow-hidden ${className} group`}
    >
      {/* Specular Edge Border (Border Gradient simulé) */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none p-[1px] bg-gradient-to-br from-white/20 via-transparent to-transparent mask-image-content" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

      {/* Glow Interne */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" />

      {/* Reflet Liquide / Halo interactif */}
      <motion.div 
        style={{ background: haloBackground }}
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
      />

      <motion.div
        style={{
          x: innerX,
          y: innerY,
          transform: "translateZ(40px)",
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full p-6 sm:p-8 flex flex-col relative z-10"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
