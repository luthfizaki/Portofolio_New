import { motion } from "motion/react";
import { useIsMobile, usePrefersReducedMotion } from "../hooks/useIsMobile";
import { MobileAmbientBackground } from "./MobileAmbientBackground";

export const AboutSectionBackground = () => {
  // Phones get static, lower-blur versions of these decorative glows; the
  // infinite framer-motion loops and 80–150px blurs are the costly part.
  const isMobile = useIsMobile();
  const prefersReduced = usePrefersReducedMotion();
  const reduceEffects = isMobile || prefersReduced;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Subtle Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Dotted Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#2B7FFF 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* Cinematic Flash & Atmospheric Lighting Layers - Consolidated for performance */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Central Bright Blue Light Circle */}
        <motion.div
          animate={reduceEffects ? { opacity: 0.85, scale: 1 } : { opacity: [0.7, 1, 0.7], scale: [1, 1.1, 1] }}
          transition={reduceEffects ? { duration: 0 } : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[80vw] max-w-[1000px] aspect-square bg-blue-500/50 rounded-full blur-[55px] md:blur-[100px] mix-blend-screen"
        />
        {/* Unified Pulse Layer */}
        <motion.div
          animate={reduceEffects ? { opacity: 0.15 } : { opacity: [0.1, 0.2, 0.1] }}
          transition={reduceEffects ? { duration: 0 } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="w-[100vw] h-[100vw] bg-blue-600/5 blur-[60px] md:blur-[120px] rounded-full"
        />
      </div>

      {/* Large Blurred Gradient Orbs - Optimized radii */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#1A365D]/20 rounded-full blur-[45px] md:blur-[80px] translate-x-1/4 -translate-y-1/4 opacity-40" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#0A2F7E]/10 rounded-full blur-[55px] md:blur-[100px] -translate-x-1/4 translate-y-1/3 opacity-30" />

      {/* Cinematic Blue Light Rays */}
      <motion.div
        animate={reduceEffects ? { opacity: 0.35 } : { opacity: [0.2, 0.5, 0.2], rotate: [-35, -34, -35] }}
        transition={reduceEffects ? { duration: 0 } : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[0%] left-[10%] w-[120vw] h-[150px] bg-gradient-to-r from-transparent via-[#2B7FFF]/15 to-transparent rotate-[-35deg] blur-[40px] origin-left"
      />
      <motion.div
        animate={reduceEffects ? { opacity: 0.2 } : { opacity: [0.1, 0.3, 0.1], rotate: [25, 26, 25] }}
        transition={
          reduceEffects ? { duration: 0 } : { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }
        }
        className="absolute top-[40%] right-[-20%] w-[100vw] h-[100px] bg-gradient-to-r from-transparent via-[#20C997]/10 to-transparent rotate-[25deg] blur-[50px] origin-right"
      />

      {/* Abstract Glowing Curved Lines */}
      <svg
        className="absolute w-full h-full opacity-40 mix-blend-screen"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M-10,60 Q30,-10 110,40"
          fill="none"
          stroke="url(#glowGradientBlue)"
          strokeWidth="0.1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M-10,30 Q40,110 110,20"
          fill="none"
          stroke="url(#glowGradientCyan)"
          strokeWidth="0.1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        />
        <defs>
          <linearGradient
            id="glowGradientBlue"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#2B7FFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#2B7FFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#2B7FFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="glowGradientCyan"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#20C997" stopOpacity="0" />
            <stop offset="50%" stopColor="#20C997" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#20C997" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Soft Floating Glass UI Layers — frozen in place on reduced-effects devices */}
      <motion.div
        animate={reduceEffects ? { y: 0, rotate: -5, opacity: 0.5 } : { y: [-20, 20, -20], rotate: [-5, 5, -5], opacity: [0.4, 0.8, 0.4] }}
        transition={reduceEffects ? { duration: 0 } : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[5%] w-64 h-48 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] backdrop-blur-[3px] rounded-3xl"
      />
      <motion.div
        animate={reduceEffects ? { y: 0, rotate: 10, opacity: 0.4 } : { y: [15, -15, 15], rotate: [10, -10, 10], opacity: [0.3, 0.7, 0.3] }}
        transition={reduceEffects ? { duration: 0 } : { duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[10%] left-[2%] w-48 h-48 bg-gradient-to-tl from-white/[0.02] to-[#2B7FFF]/[0.02] border border-white/[0.04] backdrop-blur-[2px] rounded-full"
      />

      {/* Spline-Design Style: Cinematic Dark Mode Environment - Optimized shadows */}
      <div className="absolute inset-0 z-0 bg-[#020617] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.8)_0%,rgba(2,6,23,1)_100%)]" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] pointer-events-none z-0">
          <div className="absolute inset-0 bg-blue-600/5 blur-[70px] md:blur-[150px] rounded-full" />
        </div>

        {/* Cinematic Ground Occlusion System - Simplified */}
        <div className="absolute top-[85%] flex items-center justify-center w-full pointer-events-none">
          <div className="absolute w-[800px] h-[40px] bg-black/40 blur-[40px] rounded-full scale-y-[0.2]" />
          <div className="absolute w-[150px] h-[5px] bg-white/5 blur-[10px] rounded-full" />
        </div>
      </div>

      {/* Mobile-only ambient layer: restores the depth + scroll-reactive motion
          the mobile perf pass had stripped. Renders nothing on desktop. */}
      <MobileAmbientBackground tint="blue" />
    </div>
  );
};
