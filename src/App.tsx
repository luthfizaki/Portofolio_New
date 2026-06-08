import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  useAnimate,
  AnimatePresence,
} from "motion/react";
import {
  Plus,
  ArrowUpRight,
  MapPin,
  Users,
  PenTool,
  Briefcase,
  Target,
  Box,
  Layers,
  Search,
  Shield,
  LayoutDashboard,
  Lightbulb,
  CheckCircle,
  Heart,
  TrendingUp,
  Zap,
  Layout,
  Calendar,
  Sparkles,
  ChevronDown,
  User,
  Code,
  Activity,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ProjectsSection } from "./components/ProjectsSection";
import { ProcessSection } from "./components/ProcessSection";
import { TestimonialSection } from "./components/TestimonialSection";
import { SkillsSection } from "./components/SkillsSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const format2Digit = (num: number) => num.toString().padStart(2, "0");
  const d = format2Digit(time.getDate());
  const m = format2Digit(time.getMonth() + 1);
  const y = time.getFullYear();
  const hrs = format2Digit(time.getHours());
  const mins = format2Digit(time.getMinutes());
  const secs = format2Digit(time.getSeconds());

  return (
    <div className="font-mono text-[10px] tracking-widest text-[#B3C5DF] tabular-nums">
      {d}-{m}-{y} &nbsp;&nbsp; {hrs}:{mins}:{secs}
    </div>
  );
};

const MagneticLink = ({
  children,
  isActive = false,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative cursor-pointer text-sm tracking-wide transition-colors ${
        isActive
          ? "text-[#4176F0] font-medium"
          : "text-[#E0E7F1] hover:text-white"
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="dot"
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4176F0] shadow-[0_0_8px_rgba(65,118,240,0.8)]"
        />
      )}
    </motion.div>
  );
};

const StaggeredText = ({
  text,
  className,
  delayOffset = 0,
}: {
  text: string;
  className?: string;
  delayOffset?: number;
}) => {
  return (
    <div className={`flex flex-wrap overflow-hidden ${className}`}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1.0,
            ease: [0.33, 1, 0.68, 1],
            delay: delayOffset + index * 0.08,
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

const DynamicSpotlightPhoto = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Tentukan posisi awal viewfinder di sini (0.0 hingga 1.0)
  // Contoh: 0.5 = tengah, 0.3 = kiri/atas, 0.7 = kanan/bawah
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const INITIAL_X_PERCENT = isMobile ? 0.98 : 0.6; // Centered on face for Desktop (adjusted for composition)
  const INITIAL_Y_PERCENT = 0.46; // Sedikit ke atas untuk rata-rata wajah

  // Ubah ukuran lebar dan tinggi viewfinder di sini (dalam pixel)
  const VIEWFINDER_WIDTH_MOBILE = 220;
  const VIEWFINDER_HEIGHT_MOBILE = 320;

  const VIEWFINDER_WIDTH_DESKTOP = 400;
  const VIEWFINDER_HEIGHT_DESKTOP = 560;

  // --- KONFIGURASI POSISI BACKGROUND FOTO (MOBILE VIEW) ---
  // Ubah persentase X pada class di bawah ini untuk menggeser gambar secara manual di layar HP.
  // - Nilai makin besar (contoh: object-[85%_center] atau object-[95%_center]): Fokus foto lebih ke sisi kanan (wajah bergeser).
  // - Class 'md:object-center' memastikan di tampilan Web/Desktop foto otomatis kembali ke tengah.
  const photoPositionClasses = "object-[30%_center] md:object-center";

  const mouseX = useMotionValue(
    typeof window !== "undefined" ? window.innerWidth * INITIAL_X_PERCENT : 0,
  );
  const mouseY = useMotionValue(
    typeof window !== "undefined" ? window.innerHeight * INITIAL_Y_PERCENT : 0,
  );

  const [showSpotlight, setShowSpotlight] = useState(false);
  const hasInitiallyMoved = useRef(false);
  const initialMousePos = useRef<{ x: number; y: number } | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2500); // Tunggu sampai animasi teks muncul
    return () => clearTimeout(timer);
  }, []);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 25 });

  const vfWidth = useMotionValue(
    typeof window !== "undefined"
      ? window.innerWidth >= 768
        ? VIEWFINDER_WIDTH_DESKTOP
        : VIEWFINDER_WIDTH_MOBILE
      : 260,
  );
  const vfHeight = useMotionValue(
    typeof window !== "undefined"
      ? window.innerWidth >= 768
        ? VIEWFINDER_HEIGHT_DESKTOP
        : VIEWFINDER_HEIGHT_MOBILE
      : 410,
  );

  // Ukuran jarak (margin) antara kotak spotlight dengan tepi viewfinder
  const SPOTLIGHT_PADDING_X = 40; // Untuk lebar
  const SPOTLIGHT_PADDING_Y = 40; // Untuk tinggi

  const maskPosition = useMotionTemplate`calc(${springX}px - (${vfWidth}px - ${SPOTLIGHT_PADDING_X}px) / 2) calc(${springY}px - (${vfHeight}px - ${SPOTLIGHT_PADDING_Y}px) / 2)`;
  const maskSize = useMotionTemplate`calc(${vfWidth}px - ${SPOTLIGHT_PADDING_X}px) calc(${vfHeight}px - ${SPOTLIGHT_PADDING_Y}px)`;

  useEffect(() => {
    const handleResize = () => {
      vfWidth.set(
        window.innerWidth >= 768
          ? VIEWFINDER_WIDTH_DESKTOP
          : VIEWFINDER_WIDTH_MOBILE,
      );
      vfHeight.set(
        window.innerWidth >= 768
          ? VIEWFINDER_HEIGHT_DESKTOP
          : VIEWFINDER_HEIGHT_MOBILE,
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!hasInitiallyMoved.current) {
        if (!initialMousePos.current) {
          initialMousePos.current = { x: e.clientX, y: e.clientY };
        }

        const dx = e.clientX - initialMousePos.current.x;
        const dy = e.clientY - initialMousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 50) {
          hasInitiallyMoved.current = true;
          setShowSpotlight(true);
        }
      } else {
        setShowSpotlight(true);
      }

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handleGlobalMouseLeave = () => {
      if (hasInitiallyMoved.current) {
        setShowSpotlight(false);
        mouseX.set(window.innerWidth * INITIAL_X_PERCENT);
        mouseY.set(window.innerHeight * INITIAL_Y_PERCENT);
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseleave", handleGlobalMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseleave", handleGlobalMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      {/* Base Layer: Pre-Blurred Image */}
      <div className="absolute inset-0 bg-[#060A14]">
        <img
          src="/luthfi_blur.png"
          alt="Luthfi Base Blurred"
          className={`w-full h-full object-cover opacity-80 ${photoPositionClasses}`}
        />
      </div>

      {/* Activated Background Layer: Transitions in after load */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded && !showSpotlight ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <img
          src="/luthfi_blur.png"
          alt="Luthfi Activated Background"
          className={`w-full h-full object-cover ${photoPositionClasses}`}
        />
      </motion.div>

      {/* Spotlight Layer: Sharp Image + Masked */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded || showSpotlight ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{
          WebkitMaskImage: "linear-gradient(black, black)",
          maskImage: "linear-gradient(black, black)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: maskSize,
          maskSize: maskSize,
          WebkitMaskPosition: maskPosition,
          maskPosition: maskPosition,
        }}
      >
        <img
          src="/luthfi_sharp.png"
          alt="Luthfi Sharp Spotlight"
          className={`w-full h-full object-cover ${photoPositionClasses}`}
        />
      </motion.div>

      {/* Dynamic Viewfinder following cursor */}
      <motion.div
        className="absolute z-20 pointer-events-none"
        style={{
          x: springX,
          y: springY,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded || showSpotlight ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 relative hidden md:block"
          style={{
            width: VIEWFINDER_WIDTH_DESKTOP,
            height: VIEWFINDER_HEIGHT_DESKTOP,
          }}
        >
          <div className="absolute top-0 left-0 w-12 h-12 border-t-[2px] border-l-[2px] border-white/60" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-[2px] border-r-[2px] border-white/60" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[2px] border-l-[2px] border-white/60" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[2px] border-r-[2px] border-white/60" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/40 -translate-y-1/2" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/40 -translate-x-1/2" />
          </div>

          <div className="absolute top-7 left-7 font-mono text-[10px] text-white/90 font-medium tracking-widest hidden md:block drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shimmer-white">
            FOCUS // ARZ
          </div>
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute bottom-7 right-7 font-mono text-[10px] text-[#ff3333]/90 font-medium tracking-widest hidden md:block drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          >
            REC ●
          </motion.div>
        </div>

        {/* Mobile Version Spotlight */}
        <div
          className="-translate-x-1/2 -translate-y-1/2 relative block md:hidden"
          style={{
            width: VIEWFINDER_WIDTH_MOBILE,
            height: VIEWFINDER_HEIGHT_MOBILE,
          }}
        >
          <div className="absolute top-0 left-0 w-8 h-8 border-t-[2px] border-l-[2px] border-white/60" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-[2px] border-r-[2px] border-white/60" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[2px] border-l-[2px] border-white/60" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[2px] border-r-[2px] border-white/60" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/40 -translate-y-1/2" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/40 -translate-x-1/2" />
          </div>
        </div>
      </motion.div>

      {/* Minimal edge gradients for text readability */}
      <div className="absolute inset-y-0 left-0 w-[60%] lg:w-1/2 bg-gradient-to-r from-[#060A14] to-transparent pointer-events-none opacity-90 z-20" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#060A14] to-transparent pointer-events-none opacity-90 z-20" />
    </div>
  );
};

const CubeSystem = () => {
  const rotateX = useMotionValue(25);
  const rotateY = useMotionValue(20);
  const scale = useMotionValue(1);
  const [scope, animate] = useAnimate();
  const isInteracting = useRef(false);

  // Spring physics for "heavy" high-quality movement
  const springX = useSpring(rotateX, { stiffness: 60, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 60, damping: 20 });
  const springScale = useSpring(scale, { stiffness: 200, damping: 25 });

  // Baseline auto-drift (very slow)
  useEffect(() => {
    let animationFrame: number;

    const animateDrift = () => {
      if (!isInteracting.current) {
        // Increased speed for more dynamic movement
        rotateX.set(rotateX.get() + 0.05);
        rotateY.set(rotateY.get() + 0.08);
      }
      animationFrame = requestAnimationFrame(animateDrift);
    };

    animationFrame = requestAnimationFrame(animateDrift);
    return () => cancelAnimationFrame(animationFrame);
  }, [rotateX, rotateY]);

  const handleInteractionStart = () => {
    isInteracting.current = true;
    scale.set(0.98);
    // Batch animate with shared properties
    animate(".glass-face", { filter: "brightness(1.3)" }, { duration: 0.2 });
  };

  const handleInteractionEnd = () => {
    isInteracting.current = false;
    scale.set(1);
    animate(".glass-face", { filter: "brightness(1)" }, { duration: 0.4 });
  };

  return (
    <motion.div
      ref={scope}
      onPanStart={handleInteractionStart}
      onPanEnd={handleInteractionEnd}
      onPan={(_, info) => {
        rotateY.set(rotateY.get() + info.delta.x * 0.35);
        rotateX.set(rotateX.get() - info.delta.y * 0.35);

        // Dynamic "distortion" based on velocity for tactile feel
        const velocity = Math.abs(info.delta.x) + Math.abs(info.delta.y);
        scale.set(1 - Math.min(velocity * 0.003, 0.04));
      }}
      style={{
        rotateX: springX,
        rotateY: springY,
        scale: springScale,
        transformStyle: "preserve-3d",
        willChange: "transform",
        cursor: "grab",
        pointerEvents: "auto",
      }}
      whileTap={{ cursor: "grabbing" }}
      className="relative w-[360px] h-[360px] pointer-events-auto"
    >
      {/* Soft inner blue core glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Cinematic Pulsing Flash Background */}
      <motion.div
        animate={{
          opacity: [0.05, 0.15, 0.05],
          scale: [0.9, 1.1, 0.9],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 blur-[180px] rounded-full pointer-events-none -z-10"
      />

      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-blue-400/10 blur-[140px] rounded-full pointer-events-none -z-10"
      />

      {/* Assemble the 3x3x3 Grid of Cubies */}
      {[-1, 0, 1].map((x) =>
        [-1, 0, 1].map((y) =>
          [-1, 0, 1].map((z) => {
            if (x === 0 && y === 0 && z === 0) return null;

            const isGlass = (x + y + z) % 2 === 0;
            const size = 105;
            const spacing = 120;

            // Positioning offset to ensure the cubie's CENTER is the reference point for the spacing grid
            const offsetX = spacing * x - size / 2;
            const offsetY = spacing * y - size / 2;
            const offsetZ = spacing * z;

            // Draw all 6 faces for proper 3D rendering
            const faces = [
              { t: `translate3d(${offsetX}px, 0, ${offsetZ + size / 2}px)` },
              {
                t: `translate3d(${offsetX}px, 0, ${offsetZ - size / 2}px) rotateY(180deg)`,
              },
              {
                t: `translate3d(${offsetX + size / 2}px, 0, ${offsetZ}px) rotateY(90deg)`,
              },
              {
                t: `translate3d(${offsetX - size / 2}px, 0, ${offsetZ}px) rotateY(-90deg)`,
              },
              {
                t: `translate3d(${offsetX}px, ${-size / 2}px, ${offsetZ}px) rotateX(90deg)`,
              },
              {
                t: `translate3d(${offsetX}px, ${size / 2}px, ${offsetZ}px) rotateX(-90deg)`,
              },
            ];

            return (
              <motion.div
                key={`${x}-${y}-${z}`}
                animate={{
                  y: [offsetY * 0.998, offsetY * 1.002, offsetY * 0.998],
                }}
                transition={{
                  duration: 10 + Math.random() * 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 pointer-events-none"
                style={{
                  width: size,
                  height: size,
                  transformStyle: "preserve-3d",
                }}
              >
                {faces.map((face, fIdx) => (
                  <div
                    key={fIdx}
                    className={`absolute inset-0 rounded-[8px] ${isGlass ? "glass-face" : ""}`}
                    style={{
                      transform: face.t,
                      backfaceVisibility: isGlass ? "visible" : "hidden", // Allow back faces for translucency depth
                      backgroundColor: isGlass
                        ? "rgba(40, 120, 255, 0.15)"
                        : "rgba(20, 25, 35, 1)",
                      border: isGlass
                        ? "1px solid rgba(100, 200, 255, 0.25)"
                        : "0.5px solid rgba(255, 255, 255, 0.05)",
                      boxShadow: isGlass
                        ? "inset 0 0 15px rgba(50, 150, 255, 0.4)"
                        : undefined,
                    }}
                  >
                    {isGlass ? (
                      <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_center,rgba(50,220,255,0.25)_0%,transparent_70%)]">
                        <div className="absolute top-0 right-0 w-full h-[1px] bg-white/20" />
                        <div className="absolute top-2 left-2 w-[3px] h-[3px] bg-white/40 blur-[1px] rounded-full" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-white/5 to-transparent" />
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            );
          }),
        ),
      )}
    </motion.div>
  );
};

const AboutSectionBackground = () => {
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
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[80vw] max-w-[1000px] aspect-square bg-blue-500/50 rounded-full blur-[100px] mix-blend-screen"
        />
        {/* Unified Pulse Layer */}
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="w-[100vw] h-[100vw] bg-blue-600/5 blur-[120px] rounded-full"
        />
      </div>

      {/* Large Blurred Gradient Orbs - Optimized radii */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#1A365D]/20 rounded-full blur-[80px] translate-x-1/4 -translate-y-1/4 opacity-40" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#0A2F7E]/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/3 opacity-30" />

      {/* Cinematic Blue Light Rays */}
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], rotate: [-35, -34, -35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[0%] left-[10%] w-[120vw] h-[150px] bg-gradient-to-r from-transparent via-[#2B7FFF]/15 to-transparent rotate-[-35deg] blur-[40px] origin-left"
      />
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1], rotate: [25, 26, 25] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
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

      {/* Soft Floating Glass UI Layers */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [-5, 5, -5],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[5%] w-64 h-48 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] backdrop-blur-[3px] rounded-3xl"
      />
      <motion.div
        animate={{
          y: [15, -15, 15],
          rotate: [10, -10, 10],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[10%] left-[2%] w-48 h-48 bg-gradient-to-tl from-white/[0.02] to-[#2B7FFF]/[0.02] border border-white/[0.04] backdrop-blur-[2px] rounded-full"
      />

      {/* Spline-Design Style: Cinematic Dark Mode Environment - Optimized shadows */}
      <div className="absolute inset-0 z-0 bg-[#020617] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.8)_0%,rgba(2,6,23,1)_100%)]" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] pointer-events-none z-0">
          <div className="absolute inset-0 bg-blue-600/5 blur-[150px] rounded-full" />
        </div>

        {/* Cinematic Ground Occlusion System - Simplified */}
        <div className="absolute top-[85%] flex items-center justify-center w-full pointer-events-none">
          <div className="absolute w-[800px] h-[40px] bg-black/40 blur-[40px] rounded-full scale-y-[0.2]" />
          <div className="absolute w-[150px] h-[5px] bg-white/5 blur-[10px] rounded-full" />
        </div>
      </div>
    </div>
  );
};

const AnimatedWord = ({
  children,
  index,
}: {
  children: string;
  index: number;
}) => {
  let times, scales, opacities, scaleEases, opacityEases;

  if (index === 0) {
    times = [0, 0.5 / 6, 1.0 / 6, 2.0 / 6, 2.5 / 6, 1];
    scales = [1, 1.1, 1.1, 1.1, 1, 1];
    opacities = [0, 0, 1, 1, 0, 0];
    scaleEases = ["easeInOut", "linear", "linear", "easeInOut", "linear"];
    opacityEases = ["linear", "easeInOut", "linear", "easeInOut", "linear"];
  } else if (index === 1) {
    times = [0, 2.0 / 6, 2.5 / 6, 3.0 / 6, 4.0 / 6, 4.5 / 6, 1];
    scales = [1, 1, 1.1, 1.1, 1.1, 1, 1];
    opacities = [0, 0, 0, 1, 1, 0, 0];
    scaleEases = [
      "linear",
      "easeInOut",
      "linear",
      "linear",
      "easeInOut",
      "linear",
    ];
    opacityEases = [
      "linear",
      "linear",
      "easeInOut",
      "linear",
      "easeInOut",
      "linear",
    ];
  } else {
    // Wrap-around for index 2
    times = [0, 0.5 / 6, 4.0 / 6, 4.5 / 6, 5.0 / 6, 1];
    scales = [1.1, 1, 1, 1.1, 1.1, 1.1];
    opacities = [1, 0, 0, 0, 1, 1];
    scaleEases = ["easeInOut", "linear", "easeInOut", "linear", "linear"];
    opacityEases = ["easeInOut", "linear", "linear", "easeInOut", "linear"];
  }

  const getLetterAnimation = (i: number) => {
    let waveTime = index === 0 ? 0.5 : index === 1 ? 2.5 : 4.5;
    let offset = waveTime + i * 0.05;
    return {
      y: [0, 0, -8, 0, 0],
      times: [0, offset / 6, (offset + 0.3) / 6, (offset + 0.6) / 6, 1],
    };
  };

  return (
    <span className="relative inline-flex font-bold whitespace-nowrap">
      <motion.span
        animate={{ scale: scales }}
        transition={{ duration: 6, repeat: Infinity, times, ease: scaleEases }}
        className="inline-flex text-white relative"
        style={{ transformOrigin: "center" }}
      >
        {children.split("").map((char, i) => {
          const { y, times: yTimes } = getLetterAnimation(i);
          return (
            <motion.span
              key={i}
              className="inline-block"
              animate={{ y }}
              transition={{
                duration: 6,
                repeat: Infinity,
                times: yTimes,
                ease: "easeInOut",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
        <motion.span
          animate={{ opacity: opacities }}
          transition={{
            duration: 6,
            repeat: Infinity,
            times,
            ease: opacityEases,
          }}
          className="absolute inset-0 left-0 top-0 text-transparent bg-clip-text bg-gradient-to-r from-[#2B7FFF] to-[#60A5FA] drop-shadow-[0_0_12px_rgba(43,127,255,0.6)] flex"
          aria-hidden="true"
        >
          {children.split("").map((char, i) => {
            const { y, times: yTimes } = getLetterAnimation(i);
            return (
              <motion.span
                key={i}
                className="inline-block"
                animate={{ y }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  times: yTimes,
                  ease: "easeInOut",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            );
          })}
        </motion.span>
      </motion.span>
    </span>
  );
};

const AboutSection = () => {
  return (
    <section
      className="relative w-full min-h-screen bg-[#02040A] py-16 lg:py-20 flex flex-col justify-center overflow-hidden z-20"
      id="about"
    >
      {/* Cinematic Background Elements */}
      <AboutSectionBackground />

      {/* Interactive Cube Layer - Positioned to be interactable but visually integrated */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none flex items-center justify-center"
        style={{ perspective: "3000px" }}
      >
        <div className="pointer-events-auto">
          <CubeSystem />
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center pointer-events-none">
        {/* Left Side: Text content */}
        <div className="flex flex-col pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-[#2B7FFF] font-mono text-xs tracking-[0.2em] uppercase font-medium">
              01. About Me
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-2xl lg:text-[2rem] leading-[1.6] text-white font-mono tracking-wide mb-10"
          >
            "Where <AnimatedWord index={0}>strategy</AnimatedWord>,<br />
            <AnimatedWord index={1}>usability</AnimatedWord>, and{" "}
            <AnimatedWord index={2}>design</AnimatedWord>
            <br />
            come together"
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#8B9DBB] text-base lg:text-lg mb-8 max-w-[500px] leading-[1.8]"
          >
            I create user-centered digital products that balance usability,
            scalability, and business impact through strategic thinking,
            research, and intuitive design solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <MapPin className="w-4 h-4 text-[#2B7FFF]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#8B9DBB] text-xs">Based in</span>
                <span className="text-[#E0E7F1] text-sm font-medium">
                  Indonesia
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 relative before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-px before:h-8 before:bg-white/10 ml-3 pl-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#8B9DBB] text-xs">Available for</span>
                <span className="text-[#E0E7F1] text-sm font-medium">
                  Freelance
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Floating 3D Glass Cards */}
        <div
          className="relative flex flex-col items-center lg:items-end w-full lg:max-w-[700px] lg:ml-auto min-h-[500px] lg:min-h-[600px] justify-center z-20 mt-12 lg:mt-0 pointer-events-auto"
          style={{ perspective: "1500px" }}
        >
          {/* Cards Composition - Consolidated Single Glass Card */}
          <div className="relative z-10 w-full flex items-center justify-center lg:justify-end pr-0 lg:pr-4">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-full max-w-[500px] group"
              style={{ perspective: "2000px" }}
            >
              <div
                className="bg-[#050b1a]/40 backdrop-blur-[30px] border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden transition-all duration-700 hover:border-white/20 hover:bg-[#071026]/50"
                style={{
                  boxShadow:
                    "0 40px 100px rgba(0,0,0,0.8), inset 0 0 80px rgba(255,255,255,0.02)",
                }}
              >
                {/* Decorative gradients */}
                <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="flex flex-col gap-10 relative z-10">
                  {/* Row 1: Design Focus */}
                  <div className="flex gap-6 group/row">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover/row:bg-blue-500/20 group-hover/row:border-blue-500/30">
                      <PenTool className="w-6 h-6 text-white/70 group-hover/row:text-blue-400 group-hover/row:scale-110 transition-all duration-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-white font-bold tracking-widest text-sm uppercase">
                        Design Focus
                      </h4>
                      <p className="text-[#94a3b8] text-sm leading-relaxed">
                        End-to-end product design, bridging aesthetics with
                        scalable design systems.
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Domain Experience */}
                  <div className="flex gap-6 group/row">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover/row:bg-purple-500/20 group-hover/row:border-purple-500/30">
                      <LayoutDashboard className="w-6 h-6 text-white/70 group-hover/row:text-purple-400 group-hover/row:scale-110 transition-all duration-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-white font-bold tracking-widest text-sm uppercase">
                        Domain Experience
                      </h4>
                      <p className="text-[#94a3b8] text-sm leading-relaxed">
                        HealthTech, Flexible Insurance platforms, Dashboards,
                        and AI Systems.
                      </p>
                    </div>
                  </div>

                  {/* Row 3: Approach */}
                  <div className="flex gap-6 group/row">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover/row:bg-emerald-500/20 group-hover/row:border-emerald-500/30">
                      <Zap className="w-6 h-6 text-white/70 group-hover/row:text-emerald-400 group-hover/row:scale-110 transition-all duration-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-white font-bold tracking-widest text-sm uppercase">
                        Approach
                      </h4>
                      <p className="text-[#94a3b8] text-sm leading-relaxed">
                        User-centered, data-driven, prioritizing functional
                        clarity without sacrificing aesthetics.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subtle light sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative center line connecting sections (optional) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/10 to-transparent" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 items-center mb-8">
        <span className="text-[#2B7FFF] font-mono text-[10px] tracking-widest uppercase">
          02. Experience
        </span>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2B7FFF] shadow-[0_0_8px_rgba(43,127,255,0.8)]" />
    </section>
  );
};

const experiencesData = [
  {
    year: "2018",
    company: "PT. AZIMUTH SOLUTION",
    role: "Front-End Developer",
    date: "Jan 2018 – Mar 2018",
    location: "Jakarta, Indonesia",
    description: "Developed responsive web interfaces and collaborated on digital product implementation using modern frontend technologies."
  },
  {
    year: "2021",
    company: "Freelance",
    role: "UI/UX Designer",
    date: "Jan 2021 – Present",
    location: "Remote",
    description: "Collaborating with startups and businesses to create user-centered digital products, dashboards, and mobile applications across various industries."
  },
  {
    year: "2022",
    company: "PT. TRI NINDYA UTAMA",
    role: "UI Designer",
    date: "Mar 2022 – Aug 2022",
    location: "Jakarta, Indonesia",
    description: "Designed enterprise dashboard systems and digital interfaces with a focus on clarity, information hierarchy, and usability."
  },
  {
    year: "2022",
    company: "PT. TRI NINDYA UTAMA",
    role: "Quality Assurance Intern",
    date: "Mar 2022 – Aug 2022",
    location: "Jakarta, Indonesia",
    description: "Supported product quality through testing, usability validation, and User Acceptance Testing processes."
  },
  {
    year: "2023",
    company: "PT. SELERIS MEDITEKNO INTERNASIONAL",
    role: "UI/UX Designer",
    date: "Nov 2023 – Present",
    location: "Jakarta, Indonesia",
    description: "Designing AI-powered health-tech and insurance platforms focused on usability, workflow efficiency, and scalable enterprise experiences."
  }
];

const ExperienceBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-[#020617]">
      <style>
        {`
          .animated-path {
            stroke-dasharray: 150 150;
            animation: dash 15s linear infinite;
          }
          .animated-path-reverse {
            stroke-dasharray: 150 150;
            animation: dash-reverse 15s linear infinite;
          }
          @keyframes dash {
            from { stroke-dashoffset: 1000; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes dash-reverse {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: 1000; }
          }
          .keyword-glow {
            animation: keywordBlink 8s ease-in-out infinite alternate;
          }
          @keyframes keywordBlink {
            0% { opacity: 0.01; text-shadow: none; filter: blur(3px); }
            100% { opacity: 0.06; text-shadow: 0 0 10px rgba(43, 127, 255, 0.2); filter: blur(0px); }
          }
        `}
      </style>
      {/* Layer 1: Blueprint Grid & lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2B7FFF 1px, transparent 1px),
            linear-gradient(to bottom, #2B7FFF 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Layer 2: Network / Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <path className="animated-path" d="M -200,200 C 300,100 400,500 800,300 S 1200,600 1600,200" stroke="#2B7FFF" strokeWidth="1" fill="none" />
        <path className="animated-path-reverse" d="M 200,800 C 400,600 600,1000 1000,500 S 1400,200 1800,700" stroke="#8B5CF6" strokeWidth="1" fill="none" />
        {/* Additional circular nodes on path */}
        <circle cx="200" cy="150" r="3" fill="#2B7FFF" className="keyword-glow" style={{ animationDelay: '1s' }} />
        <circle cx="600" cy="400" r="4" fill="#2B7FFF" className="keyword-glow" style={{ animationDelay: '3s' }} />
        <circle cx="1000" cy="350" r="2" fill="#8B5CF6" className="keyword-glow" style={{ animationDelay: '2s' }} />
      </svg>

      {/* Layer 3: Cinematic blur orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#2B7FFF]/10 blur-[150px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#1a0b2e]/30 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] bg-[#8B5CF6]/5 blur-[120px] rounded-full mix-blend-screen" />

      {/* Layer 4: Noise texture */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'}} />

      {/* Layer 5: Floating keywords */}
      <div className="absolute inset-0 overflow-hidden hidden md:block opacity-40 pointer-events-none">
        <div className="keyword-glow absolute top-[15%] right-[10%] text-[#2B7FFF] font-mono text-xs tracking-[0.3em] transform -rotate-12" style={{ animationDelay: '0s' }}>DESIGN THINKING</div>
        <div className="keyword-glow absolute top-[65%] right-[5%] text-[#2B7FFF] font-mono text-xs tracking-[0.2em] font-medium" style={{ animationDelay: '1.5s' }}>HEALTHTECH</div>
        <div className="keyword-glow absolute bottom-[20%] left-[8%] text-[#8B5CF6] font-mono text-xs tracking-[0.3em] font-medium transform -rotate-6" style={{ animationDelay: '3s' }}>DESIGN SYSTEMS</div>
        <div className="keyword-glow absolute top-[30%] left-[5%] text-[#2B7FFF] font-mono text-xs tracking-[0.3em]" style={{ animationDelay: '4.5s' }}>USER CENTERED</div>
        <div className="keyword-glow absolute bottom-[15%] right-[25%] text-[#2B7FFF] font-mono text-xs tracking-[0.2em] font-medium" style={{ animationDelay: '2s' }}>INNOVATION</div>
        <div className="keyword-glow absolute top-[45%] left-[8%] text-[#2B7FFF] font-mono text-xs tracking-[0.3em] transform rotate-3" style={{ animationDelay: '1s' }}>RESEARCH</div>
        <div className="keyword-glow absolute bottom-[35%] right-[20%] text-[#4192ff] font-mono text-xs tracking-[0.3em] transform -rotate-3" style={{ animationDelay: '5.5s' }}>PROBLEM SOLVING</div>
      </div>
    </div>
  );
};

const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=4000",
            pin: true,
            scrub: 1,
          }
        });

      // initial states
      gsap.set('.exp-header', { y: () => window.innerHeight * 0.25 });
      gsap.set('.exp-content', { opacity: 0, y: 100 });
      gsap.set('.exp-card', { opacity: 0, scale: 0.95 });
      gsap.set('.progress-line', { scaleY: 0, transformOrigin: 'top center' });
      gsap.set('.node-ring', { borderColor: 'rgba(43,127,255,0.3)', boxShadow: '0 0 0px rgba(43,127,255,0)' });
      gsap.set('.node-core', { backgroundColor: 'rgba(255,255,255,0.1)', boxShadow: '0 0 0px rgba(255,255,255,0)' });
      gsap.set('[class^="horizontal-line-"]', { opacity: 0, scaleX: 0, transformOrigin: 'left center' });
      gsap.set('[class^="year-text-"]', { color: 'rgba(255,255,255,0.15)' });
      gsap.set('[class^="date-text-"]', { color: 'rgba(255,255,255,0.15)' });

      gsap.set('[class^="timeline-role-"]', { color: 'rgba(255,255,255,0.4)' });
      gsap.set('[class^="timeline-company-"]', { color: 'rgba(255,255,255,0.6)' });

      // Intro step: move header up and show content
      tl.to('.exp-header', { 
        y: 0,
        scale: 0.95,
        duration: 3, 
        ease: 'power2.inOut' 
      }, "intro");
      
      tl.to('.exp-content', { 
        opacity: 1, 
        y: 0, 
        duration: 3, 
        ease: 'power2.out' 
      }, "intro");

      // First step animation, right away when pinned
      experiencesData.forEach((_, i) => {
        const stepLabel = `step${i}`;
        
        // Progress line scaleY (from 0 to 1 based on i)
        tl.to('.progress-line', { 
           scaleY: i / (experiencesData.length - 1), 
           duration: 1, 
           ease: 'none' 
        }, stepLabel);

        // Current node highlight
        tl.to(`.node-ring-${i}`, { 
           borderColor: 'rgba(255,255,255,0.8)',
           boxShadow: '0 0 25px 4px rgba(43,127,255,1), inset 0 0 15px 3px rgba(43,127,255,1)',
           scale: 1.25,
           duration: 0.5 
        }, stepLabel);
        
        tl.to(`.node-core-${i}`, {
           backgroundColor: '#ffffff',
           boxShadow: '0 0 15px 4px rgba(255,255,255,1)',
           duration: 0.5
        }, stepLabel);

        tl.to(`.horizontal-line-${i}`, { 
           opacity: 1,
           scaleX: 1,
           duration: 0.5 
        }, stepLabel);

        tl.to(`.year-text-${i}`, { color: '#2B7FFF', duration: 0.5 }, stepLabel);
        tl.to(`.date-text-${i}`, { color: 'rgba(43,127,255,0.8)', duration: 0.5 }, stepLabel);
        tl.to(`.timeline-role-${i}`, { color: '#2B7FFF', duration: 0.5 }, stepLabel);
        tl.to(`.timeline-company-${i}`, { color: '#ffffff', duration: 0.5 }, stepLabel);

        // Previous node de-highlight
        if (i > 0) {
          tl.to(`.node-ring-${i-1}`, { 
             scale: 1,
             borderColor: 'rgba(43,127,255,0.3)',
             boxShadow: '0 0 0px rgba(43,127,255,0), inset 0 0 0px rgba(43,127,255,0)',
             duration: 0.5 
          }, stepLabel);
          
          tl.to(`.node-core-${i-1}`, {
             backgroundColor: 'rgba(255,255,255,0.1)',
             boxShadow: '0 0 0px rgba(255,255,255,0)',
             duration: 0.5
          }, stepLabel);
          
          tl.to(`.horizontal-line-${i-1}`, { 
             opacity: 0,
             scaleX: 0,
             duration: 0.5 
          }, stepLabel);

          tl.to(`.year-text-${i-1}`, { color: 'rgba(255,255,255,0.2)', duration: 0.5 }, stepLabel);
          tl.to(`.date-text-${i-1}`, { color: 'rgba(255,255,255,0.2)', duration: 0.5 }, stepLabel);
          tl.to(`.timeline-role-${i-1}`, { color: 'rgba(255,255,255,0.4)', duration: 0.5 }, stepLabel);
          tl.to(`.timeline-company-${i-1}`, { color: 'rgba(255,255,255,0.6)', duration: 0.5 }, stepLabel);

          // Prev card fade out
          tl.to(`.exp-card-${i-1}`, { opacity: 0, scale: 0.95, duration: 0.5 }, stepLabel);
        }

        // Current card fade in
        tl.to(`.exp-card-${i}`, { opacity: 1, scale: 1, duration: 0.8 }, stepLabel);

        // Add a long pause before next step
        tl.to({}, { duration: 1.5 });
      });
      }); // close mm.add

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen md:h-screen bg-[#020617] overflow-hidden flex flex-col z-20" id="experience">
      <ExperienceBackground />
      {/* Container */}
      <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col pt-16 md:pt-24 pb-12">
         
         {/* Top Header */}
         <div className="exp-header flex flex-col items-center md:items-center text-left md:text-center gap-3 lg:gap-4 max-w-3xl mx-auto md:mx-auto w-full shrink-0 z-20">
            <div className="flex items-center gap-4 justify-start md:justify-center w-full md:w-auto">
              <span className="text-[#2B7FFF] font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium">
                02. Experience
              </span>
            </div>
            <h2 className="text-[32px] md:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.1] md:leading-[1.2] text-left md:text-center self-start md:self-auto w-full">
              My professional <br className="block md:hidden"/> journey shaped by <br className="hidden md:block"/> <span className="text-[#2B7FFF] md:text-transparent md:bg-clip-text md:bg-gradient-to-r md:from-[#2B7FFF] md:to-[#A8C7FA]">curiosity and impact.</span>
            </h2>
            <p className="text-[#8B9DBB] text-[15px] md:text-base leading-relaxed md:max-w-xl text-left md:text-center mt-2 md:mt-0 w-full">
              A timeline of experiences across product design, enterprise systems, health-tech, insurance, and digital innovation.
            </p>
         </div>

         {/* Content Split (Desktop & Tablet) */}
         <div className="exp-content hidden md:flex flex-col lg:flex-row lg:items-center flex-1 gap-8 lg:gap-16 w-full mt-10 md:mt-12 min-h-0 z-10 max-w-[1200px] mx-auto">
            {/* Left: Timeline */}
            <div className="w-full lg:w-[45%] relative shrink-0">
               <div className="flex relative h-[40vh] min-h-[300px] lg:h-[400px]">
                 {/* Desktop vertical line */}
                 <div className="hidden lg:block absolute top-[12px] bottom-[12px] left-[140px] w-px bg-white/10 z-0" />
                 <div className="progress-line hidden lg:block absolute top-[12px] bottom-[12px] left-[140px] w-[2px] bg-[#2B7FFF] shadow-[0_0_20px_2px_rgba(43,127,255,1),_0_0_10px_1px_rgba(43,127,255,0.8)] z-0" />

                 {/* Mobile Line Container */}
                 <div className="block lg:hidden absolute top-[12px] bottom-[12px] left-[20px] w-px bg-white/10 z-0" />
                 <div className="progress-line block lg:hidden absolute top-[12px] bottom-[12px] left-[20px] w-[2px] bg-[#2B7FFF] shadow-[0_0_20px_2px_rgba(43,127,255,1),_0_0_10px_1px_rgba(43,127,255,0.8)] z-0" />

                 <div className="flex flex-col justify-between h-full relative z-10 w-full py-2">
                   {experiencesData.map((exp, i) => {
                     const parts = exp.date.split(" – ");
                     const startMonth = parts[0]?.split(" ")[0] || "JAN";
                     const endWord = parts[1]?.toLowerCase() === "present" ? "PRESENT" : parts[1]?.split(" ")[0];
                     const endMonth = endWord || "DEC";
                     const dateStr = `${startMonth} ${parts[0]?.split(" ")[1] || exp.year} - ${endMonth}`.toUpperCase();

                     return (
                       <div key={i} className={`node-item node-item-${i} relative flex items-center lg:justify-start justify-start w-full min-h-[40px] group`}>
                         
                         {/* Desktop text & node */}
                         <div className="hidden lg:flex flex-row items-center w-full">
                           {/* Year / Date */}
                           <div className="flex flex-col items-end text-right w-[110px] shrink-0">
                              <span className={`year-text-${i} font-mono font-medium text-2xl tracking-wider mb-1 transition-colors duration-500 leading-none drop-shadow-md`}>{exp.year}</span>
                              <span className={`date-text-${i} font-mono text-[9px] tracking-[0.1em] uppercase transition-colors duration-500 whitespace-nowrap`}>{dateStr}</span>
                           </div>

                           {/* Node / Line gap */}
                           <div className="w-[60px] h-full flex items-center justify-center relative shrink-0">
                              <div className={`node-ring node-ring-${i} w-[18px] h-[18px] rounded-full border-[2px] border-[#2B7FFF]/30 bg-[#020617] flex items-center justify-center relative z-10 transition-all duration-500`}>
                                 <div className={`node-core node-core-${i} w-[6px] h-[6px] rounded-full bg-white/20 transition-all duration-500`} />
                              </div>
                              <div className={`horizontal-line-${i} absolute left-[30px] w-[500px] h-[2px] bg-gradient-to-r from-white via-[#2B7FFF] to-transparent top-1/2 -translate-y-1/2 z-0 origin-left drop-shadow-[0_0_15px_rgba(43,127,255,1)]`} />
                           </div>

                           {/* Company / Role */}
                           <div className="flex flex-col items-start w-[calc(100%-170px)] -mt-1">
                              <span className={`timeline-company-${i} text-white font-medium text-xs tracking-wide uppercase mb-1 transition-colors duration-500`}>{exp.company}</span>
                              <span className={`timeline-role-${i} font-medium text-xs transition-colors duration-500 font-mono`}>{exp.role}</span>
                           </div>
                         </div>

                         {/* Mobile text */}
                         <div className="flex lg:hidden flex-col w-full pl-[56px] justify-center h-full">
                           <span className={`year-text-${i} font-mono font-bold text-xl tracking-wider mb-1 transition-colors duration-500 leading-none`}>{exp.year}</span>
                           <span className={`timeline-company-${i} text-white font-medium text-xs tracking-wide uppercase mb-1 transition-colors duration-500`}>{exp.company}</span>
                           <span className={`timeline-role-${i} font-medium text-xs transition-colors duration-500 font-mono mb-1`}>{exp.role}</span>
                           <span className={`date-text-${i} font-mono text-[9px] tracking-[0.1em] uppercase transition-colors duration-500 whitespace-nowrap`}>{dateStr}</span>
                         </div>

                         {/* Mobile dot */}
                         <div className={`node-ring node-ring-${i} block lg:hidden w-4 h-4 rounded-full border-[2px] border-[#2B7FFF]/30 bg-[#020617] flex-col items-center justify-center absolute left-[12px] top-1/2 -translate-y-1/2 z-10 transition-all duration-500`}>
                            <div className={`node-core node-core-${i} w-1.5 h-1.5 rounded-full mx-auto mt-[3px] bg-white/20 transition-all duration-500`} />
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
            </div>

            {/* Right: Glass Card */}
            <div className="w-full lg:w-[55%] relative h-[40vh] min-h-[300px] lg:h-[400px] flex items-center justify-center lg:justify-start mt-4 lg:mt-0">
               <div className="relative w-full h-full max-w-[600px] flex items-start lg:items-center z-10">
                 {experiencesData.map((exp, i) => (
                   <div key={i} className={`exp-card exp-card-${i} absolute top-0 lg:top-1/2 lg:-translate-y-1/2 w-full bg-[#030614]/40 backdrop-blur-3xl border border-[#2B7FFF]/20 rounded-3xl p-6 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_40px_rgba(43,127,255,0.05)] ring-1 ring-white/5`}>
                      <div className="flex flex-col gap-6 mb-8">
                         <div className="flex flex-row items-center gap-6">
                           <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-[#2B7FFF] to-[#5C32FF] shrink-0 shadow-[0_8px_24px_rgba(43,127,255,0.15)] flex items-center justify-center relative overflow-hidden">
                             {/* White geometric shape inside */}
                             <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white shadow-sm rounded-lg absolute z-10" />
                             <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/40 shadow-sm rounded-lg absolute transform translate-x-2 translate-y-2 z-0 backdrop-blur-sm" />
                           </div>
                           <div className="flex flex-col">
                             <h3 className="text-xl lg:text-2xl text-white font-semibold leading-tight tracking-wide mb-2 drop-shadow-sm uppercase">
                                {exp.company}
                             </h3>
                             <span className="text-[#2B7FFF] font-mono text-sm tracking-[0.15em] uppercase font-medium">
                                {exp.role}
                             </span>
                           </div>
                         </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-t border-white/5 pt-6 mb-6">
                         <div className="flex items-center gap-3 text-white/50 text-sm font-medium">
                           <Calendar className="w-4 h-4" />
                           <span>{exp.date}</span>
                         </div>
                         <div className="hidden sm:block w-px h-4 bg-white/10" />
                         <div className="flex items-center gap-3 text-white/50 text-sm font-medium">
                           <MapPin className="w-4 h-4" />
                           <span>{exp.location || "Jakarta, Indonesia"}</span>
                         </div>
                      </div>
                      
                      <p className="text-white/60 text-sm lg:text-[15px] leading-[1.8] font-light pr-2 lg:pr-4">
                         {exp.description}
                      </p>
                   </div>
                 ))}
               </div>
            </div>
         </div>

         {/* Mobile View Container */}
         <div className="flex md:hidden flex-col w-full mt-8 relative z-10 px-0 sm:px-4">
            {/* Global Continuous Line */}
            <div className="absolute top-[32px] bottom-[30px] left-[20px] w-px bg-white/10 z-0" />
            <div className="absolute top-[32px] h-[190px] left-[20px] w-px bg-[#2B7FFF] shadow-[0_0_15px_rgba(43,127,255,1)] z-0" />

            {/* Item 1 - Active */}
            <div className="relative w-full border border-[#2B7FFF]/40 bg-[#2B7FFF]/[0.02] backdrop-blur-md rounded-[20px] p-5 shadow-[inset_0_0_30px_rgba(43,127,255,0.05),_0_8px_32px_rgba(0,0,0,0.3)] mb-4">
               {/* Node Dot */}
               <div className="absolute left-[20px] top-[36px] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[2px] border-[#2B7FFF] bg-[#020617] flex items-center justify-center z-10 shadow-[0_0_15px_rgba(43,127,255,0.6)]">
                 <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
               </div>
               
               <div className="pl-[36px]">
                  {/* Date */}
                  <div className="font-mono text-[9px] tracking-[0.1em] text-[#2B7FFF] uppercase mb-1.5">
                    MAR 2022 - AUG 2022
                  </div>
                  
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="flex flex-col gap-1 pr-2">
                      <h3 className="text-[14px] font-semibold text-white tracking-wide uppercase leading-snug">
                        PT. TRI NINDYA UTAMA
                      </h3>
                      <span className="text-[#2B7FFF] font-mono text-[10px] uppercase font-medium tracking-wider">
                        UI Designer
                      </span>
                      <div className="flex items-center gap-1.5 text-white/40 text-[10px] mt-1">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>Jakarta, Indonesia</span>
                      </div>
                    </div>
                    {/* Icon Box */}
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-gradient-to-br from-[#2B7FFF] to-[#5C32FF] shrink-0 shadow-[0_4px_16px_rgba(43,127,255,0.2)] flex items-center justify-center relative overflow-hidden mt-0.5">
                       <div className="w-5 h-5 bg-white shadow-sm rounded border border-black/5 absolute z-10" />
                       <div className="w-5 h-5 bg-white/40 shadow-sm rounded border border-black/5 absolute transform translate-x-1 translate-y-1 z-0 backdrop-blur-sm" />
                    </div>
                  </div>

                  <div className="w-full h-px bg-white/5 my-3" />
                  
                  <p className="text-white/60 text-[12px] leading-[1.6] font-light">
                    Designed enterprise dashboard systems and digital interfaces with a focus on clarity, information hierarchy, and usability.
                  </p>
               </div>
            </div>

            {/* Item 2 - Inactive */}
            <div className="relative w-full p-4 mb-2">
               {/* Node Dot */}
               <div className="absolute left-[20px] top-[24px] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-[2px] border-white/10 bg-[#020617] flex items-center justify-center z-10" />
               
               <div className="pl-[36px]">
                  <div className="font-mono text-[9px] tracking-[0.1em] text-[#2B7FFF] uppercase mb-1.5 opacity-90">
                    JAN 2021 - PRESENT
                  </div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex flex-col gap-1 pr-2">
                      <h3 className="text-[14px] font-semibold text-white tracking-wide uppercase leading-snug shadow-sm">
                        FREELANCE
                      </h3>
                      <span className="text-[#2B7FFF] font-mono text-[10px] uppercase tracking-wider font-medium opacity-90">
                        UI/UX Designer
                      </span>
                    </div>
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-[#020617] border border-white/5 shrink-0 flex items-center justify-center text-[#2B7FFF]/70">
                       <User className="w-[18px] h-[18px]" />
                    </div>
                  </div>
                  <p className="text-white/50 text-[12px] leading-[1.6] font-light">
                    Working with clients worldwide to create user-centered digital products across various industries.
                  </p>
               </div>
            </div>

            {/* Item 3 - Inactive */}
            <div className="relative w-full p-4 mb-2">
               {/* Node Dot */}
               <div className="absolute left-[20px] top-[24px] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-[2px] border-white/10 bg-[#020617] flex items-center justify-center z-10" />
               
               <div className="pl-[36px]">
                  <div className="font-mono text-[9px] tracking-[0.1em] text-[#2B7FFF] uppercase mb-1.5 opacity-90">
                    JAN 2018 - MAR 2021
                  </div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex flex-col gap-1 pr-2">
                      <h3 className="text-[14px] font-semibold text-white tracking-wide uppercase leading-snug">
                        PT. AZIMUTH SOLUTION
                      </h3>
                      <span className="text-[#2B7FFF] font-mono text-[10px] uppercase tracking-wider font-medium opacity-90">
                        Front-End Developer
                      </span>
                    </div>
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-[#020617] border border-white/5 shrink-0 flex items-center justify-center text-[#2B7FFF]/70">
                       <Code className="w-[18px] h-[18px]" />
                    </div>
                  </div>
                  <p className="text-white/50 text-[12px] leading-[1.6] font-light">
                    Built responsive web applications and collaborated with cross-functional teams to deliver high-quality solutions.
                  </p>
               </div>
            </div>

            {/* Item 4 - Inactive */}
            <div className="relative w-full p-4 mb-2">
               {/* Node Dot */}
               <div className="absolute left-[20px] top-[24px] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-[2px] border-white/10 bg-[#020617] flex items-center justify-center z-10" />
               
               <div className="pl-[36px]">
                  <div className="font-mono text-[9px] tracking-[0.1em] text-[#2B7FFF] uppercase mb-1.5 opacity-90">
                    NOV 2023 - PRESENT
                  </div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex flex-col gap-1 pr-2">
                      <h3 className="text-[14px] font-semibold text-white tracking-wide uppercase leading-snug">
                        PT. SELERIS MEDITEKNO
                      </h3>
                      <span className="text-[#2B7FFF] font-mono text-[10px] uppercase tracking-wider font-medium opacity-90">
                        UI/UX Designer
                      </span>
                    </div>
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-[#020617] border border-white/5 shrink-0 flex items-center justify-center text-[#2B7FFF]/70">
                       <Activity className="w-[18px] h-[18px]" />
                    </div>
                  </div>
                  <p className="text-white/50 text-[12px] leading-[1.6] font-light">
                    Designing digital products for health-tech solutions that drive better outcomes.
                  </p>
               </div>
            </div>

            {/* View All Button */}
            <div className="mt-2 w-full">
              <button 
                className="group flex items-center justify-between w-full h-[54px] bg-[#020617] border border-[#2B7FFF]/20 rounded-[18px] p-[5px] pl-6 active:scale-[0.98] transition-all text-left relative overflow-hidden shadow-[inset_0_0_10px_rgba(43,127,255,0.05),_0_4px_20px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute inset-0 bg-[#2B7FFF]/5 opacity-0 active:opacity-100 transition-opacity" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#2B7FFF] font-medium relative z-10">
                  View All Experience
                </span>
                <div className="w-[44px] h-[44px] rounded-[14px] bg-[#2B7FFF] flex items-center justify-center text-white relative z-10 shadow-[0_2px_10px_rgba(43,127,255,0.3)]">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </button>
            </div>
         </div>
      </div>
    </section>
  );
};

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out mouse movement for parallax
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  // Background glow moves subtly in opposite direction
  const glowX = useTransform(smoothMouseX, [0, 1], ["5%", "-5%"]);
  const glowY = useTransform(smoothMouseY, [0, 1], ["5%", "-5%"]);

  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["home", "about", "experience", "projects", "process", "skills", "contact"];
      const scrollPosition = window.scrollY + 250; // offset for triggers

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Normalize values between 0 and 1
    const x = clientX / innerWidth;
    const y = clientY / innerHeight;

    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-[#060A14] overflow-x-hidden glass-texture font-sans selection:bg-[#2B7FFF] selection:text-white"
    >
      {/* Hero Section */}
      <div
        id="home"
        className="relative min-h-screen w-full"
        onMouseMove={handleMouseMove}
      >
        {/* Dynamic Background Photo with Spotlight & Brackets */}
        <DynamicSpotlightPhoto />

        {/* Dynamic Background Glow */}
        <motion.div
          style={{ x: glowX, y: glowY }}
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2B7FFF] rounded-full blur-[150px] opacity-[0.15] mix-blend-screen pointer-events-none z-10"
        />

        <div className="relative z-20 flex flex-col min-h-screen p-8 lg:p-12 max-w-[1600px] mx-auto">
          {/* Top Navigation */}
          <div className="w-full flex justify-center">
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="flex items-center justify-between w-full max-w-[850px] border border-white/20 rounded-full px-5 py-2 md:px-8 md:py-2.5 backdrop-blur-xl bg-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.3)] z-50 select-none animate-shimmer"
            >
              {/* Left Links - Hidden on Mobile */}
              <div className="hidden md:flex items-center gap-8 lg:gap-12">
                <MagneticLink isActive={activeSection === "home"} onClick={() => scrollToSection("home")}>Home</MagneticLink>
                <MagneticLink isActive={activeSection === "about"} onClick={() => scrollToSection("about")}>About</MagneticLink>
                <MagneticLink isActive={activeSection === "projects"} onClick={() => scrollToSection("projects")}>Project</MagneticLink>
              </div>

              {/* Logo / Control Container */}
              <div className="flex items-center justify-between md:justify-center w-full md:w-auto">
                <div role="button" onClick={() => scrollToSection("home")} className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#0A2F7E] to-[#06122F] flex items-center justify-center shadow-[0_0_20px_rgba(43,127,255,0.25)] border border-white/10 relative overflow-hidden cursor-pointer active:scale-95 transition-transform">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full h-full object-contain mix-blend-screen p-2"
                  />
                </div>
                
                {/* Mobile Hamburger button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex md:hidden w-10 h-10 rounded-full items-center justify-center border border-white/10 bg-white/5 active:scale-90 transition-transform relative z-[100]"
                  aria-label="Toggle Menu"
                >
                  <div className="flex flex-col gap-[5px] w-5 items-end">
                    <motion.span 
                      animate={isMobileMenuOpen ? { rotate: 45, y: 6.5, width: "20px" } : { rotate: 0, y: 0, width: "20px" }}
                      transition={{ duration: 0.3 }}
                      className="h-[1.5px] bg-white rounded-full origin-center"
                    />
                    <motion.span 
                      animate={isMobileMenuOpen ? { opacity: 0, width: "0px" } : { opacity: 1, width: "15px" }}
                      transition={{ duration: 0.2 }}
                      className="h-[1.5px] bg-white rounded-full"
                    />
                    <motion.span 
                      animate={isMobileMenuOpen ? { rotate: -45, y: -6.5, width: "20px" } : { rotate: 0, y: 0, width: "12px" }}
                      transition={{ duration: 0.3 }}
                      className="h-[1.5px] bg-white rounded-full origin-center"
                    />
                  </div>
                </button>
              </div>

              {/* Right Links - Hidden on Mobile */}
              <div className="hidden md:flex items-center gap-8 lg:gap-12">
                <MagneticLink isActive={activeSection === "experience"} onClick={() => scrollToSection("experience")}>Experience</MagneticLink>
                <MagneticLink isActive={activeSection === "skills"} onClick={() => scrollToSection("skills")}>Skill</MagneticLink>
                <MagneticLink isActive={activeSection === "contact"} onClick={() => scrollToSection("contact")}>Contact</MagneticLink>
              </div>
            </motion.nav>
          </div>

          {/* Mobile Overlay Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-0 z-40 bg-[#020617]/98 backdrop-blur-3xl flex flex-col justify-between p-8 pt-32 md:hidden"
              >
                {/* Top decorative glows */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#2B7FFF]/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute top-1/3 left-0 w-[200px] h-[200px] bg-[#5C32FF]/8 blur-[100px] rounded-full pointer-events-none" />

                {/* Navigation Links inside overlay */}
                <div className="flex flex-col gap-5 relative z-10 pl-2">
                  <span className="text-white/20 uppercase font-mono text-[9px] tracking-[0.3em] font-semibold mb-1 block select-none">
                    Navigation Menu
                  </span>
                  {[
                    { label: "Home", id: "home" },
                    { label: "About", id: "about" },
                    { label: "Experience", id: "experience" },
                    { label: "Projects", id: "projects" },
                    { label: "Skills", id: "skills" },
                    { label: "Contact", id: "contact" },
                  ].map((item, index) => {
                    const isActive = activeSection === item.id;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
                      >
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            scrollToSection(item.id);
                          }}
                          className="group flex items-center gap-4 text-left w-full active:scale-95 transition-transform"
                        >
                          <span className="font-mono text-[10px] text-[#2B7FFF]/60 w-5">0{index + 1}.</span>
                          <span className={`text-2xl sm:text-3xl font-light tracking-wide transition-all ${
                            isActive 
                              ? "text-[#2B7FFF] font-normal translate-x-1" 
                              : "text-[#E0E7F1] hover:text-white"
                          }`}>
                            {item.label}
                          </span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2B7FFF] shadow-[0_0_8px_#2B7FFF]" />
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer details inside overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="border-t border-white/10 pt-5 flex flex-col gap-4 relative z-10"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-white/30 font-mono text-[9px] uppercase tracking-widest">Current Time</span>
                    <DigitalClock />
                  </div>

                  <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-white/40 uppercase font-mono text-[8px] tracking-widest text-[#2B7FFF] leading-none">Available for:</span>
                      </div>
                      <p className="text-[10px] font-light text-slate-300 leading-snug">
                        Full-time, Freelance projects
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-white/30 font-mono text-[8px] uppercase tracking-widest block">Inquiries</span>
                      <a href="mailto:hi@luthfiarzaki.com" className="text-[11px] text-[#2B7FFF] font-mono hover:underline">
                        hi@luthfiarzaki.com
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Area */}
          <main className="flex-1 min-h-0 flex items-center mt-8 relative">
            {/* Scroll Indicator (Left edge) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
              className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 hidden lg:flex"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="tracking-widest text-xs font-mono text-[#2B7FFF] [writing-mode:vertical-rl] rotate-180 mb-6 uppercase"
              >
                Scroll to explore
              </motion.div>
              <div className="w-px h-16 bg-[#2B7FFF]/30 relative overflow-hidden">
                <motion.div
                  animate={{ top: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute w-full h-1/2 bg-[#2B7FFF]"
                />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#2B7FFF] shadow-[0_0_8px_rgba(43,127,255,0.8)]" />
            </motion.div>

            <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-8 w-full h-full lg:pl-16 relative">
              {/* Left Content (Text) */}
              <div className="col-span-1 lg:col-span-8 flex flex-col justify-center z-10 pt-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  className="flex items-center gap-3 mb-6 relative"
                >
                  <div className="w-2 h-2 rounded-full bg-[#2B7FFF] shadow-[0_0_10px_#2B7FFF]" />
                  <span className="text-[#2B7FFF] tracking-[0.2em] uppercase font-medium text-sm drop-shadow-md">
                    UI/UX Designer
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                  className="flex gap-6 text-[#8B9DBB] font-mono text-sm mb-12 drop-shadow-md"
                >
                  <span>2022 - 2026</span>
                  <span>4+ yrs exp.</span>
                </motion.div>

                <div className="flex flex-col gap-4 mb-20 relative">
                  <StaggeredText
                    text="LUTHFI"
                    delayOffset={0.2}
                    className="font-display font-bold text-[12vw] lg:text-[9rem] leading-[0.8] tracking-tight uppercase mix-blend-overlay text-white/90 drop-shadow-lg"
                  />
                  <StaggeredText
                    text="ARZAKI"
                    delayOffset={0.4}
                    className="font-display font-bold text-[12vw] lg:text-[9rem] leading-[0.8] tracking-tight uppercase mix-blend-overlay text-white/90 drop-shadow-lg"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 1.1, ease: "easeOut" }}
                  className="flex relative"
                >
                  <div className="w-px bg-[#2B7FFF] mr-6 hidden md:block shadow-[0_0_8px_#2B7FFF]" />
                  <p className="max-w-md text-[#E0E7F1] text-xl lg:text-2xl font-light leading-snug drop-shadow-md">
                    Designing{" "}
                    <span className="shimmer font-normal text-[#2B7FFF]">
                      impactful
                    </span>{" "}
                    digital experiences
                    <br />
                    through user-centered thinking
                  </p>
                </motion.div>
              </div>

              {/* Right Content (Vertical Text & CTA) */}
              <div className="col-span-1 lg:col-span-3 lg:col-start-9 flex flex-col justify-center items-end lg:items-start text-right lg:text-left pt-12 lg:pt-0 pb-20 lg:pb-0 gap-16 relative z-10 lg:pr-12 xl:pr-24 lg:-translate-y-16 lg:translate-x-16 -translate-y-8 translate-x-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                  className="flex flex-col gap-10"
                >
                  <div className="flex flex-col gap-2 drop-shadow-md">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#B3C5DF] leading-relaxed max-w-[200px]">
                      Crafting meaningful
                      <br />
                      digital experiences
                    </span>
                    <div className="w-6 h-px bg-[#2B7FFF]/50" />
                  </div>

                  <div className="flex flex-col gap-2 drop-shadow-md">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#B3C5DF] leading-relaxed max-w-[200px]">
                      Designing with
                      <br />
                      purpose and precision
                    </span>
                    <div className="w-8 h-px bg-[#2B7FFF]" />
                  </div>

                  <div className="flex flex-col gap-2 drop-shadow-md">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#B3C5DF] leading-relaxed max-w-[200px]">
                      Turning ideas into
                      <br />
                      impactful solutions
                    </span>
                    <div className="w-6 h-px bg-[#2B7FFF]/50" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* MOBILE HERO VIEW - High fidelity matching image.png exactly (visible on < md) */}
            <div className="flex md:hidden flex-col w-full px-2 pt-6 pb-4 gap-7 relative z-30 select-none">
              {/* Status & Work Experience */}
              <div className="flex flex-col gap-1.5 animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B7FFF]/70 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2B7FFF] shadow-[0_0_8px_rgba(43,127,255,0.8)]"></span>
                  </span>
                  <span className="text-[#2B7FFF] font-mono text-[11px] uppercase tracking-[0.25em] font-semibold">
                    UI/UX Designer
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-[#7F94B6]/90 font-mono text-xs mt-0.5">
                  <span>2022 - 2026</span>
                  <span className="w-1 h-1 rounded-full bg-[#2B7FFF]/50" />
                  <span>4+ yrs exp.</span>
                </div>
              </div>

              {/* Mega Titles: Stacked LUTHFI ARZAKI */}
              <div className="flex flex-col select-none leading-none -mt-1 gap-1">
                <h1 className="font-sans font-black text-[13.5vw] uppercase tracking-[-0.03em] text-white">
                  LUTHFI
                </h1>
                <h1 className="font-sans font-black text-[13.5vw] uppercase tracking-[-0.03em] text-white -mt-2">
                  ARZAKI
                </h1>
              </div>

              {/* Description with Vertical Blue bar */}
              <div className="flex items-stretch min-h-[44px]">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  className="w-[1.5px] bg-[#2B7FFF] mr-4 shrink-0 shadow-[0_0_10px_rgba(43,127,255,0.8)]" 
                />
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                  className="text-slate-200/90 font-light text-[14px] leading-relaxed max-w-[180px] sm:max-w-[200px]"
                >
                  Designing <span className="shimmer font-semibold">impactful</span> digital experiences through user-centered thinking.
                </motion.p>
              </div>

              {/* Custom High-Fidelity CTA Button */}
              <button 
                onClick={() => scrollToSection("projects")} 
                className="group flex items-center justify-between w-[240px] h-[54px] bg-[#020B1A]/40 border border-[#2B7FFF]/50 hover:bg-[#020B1A]/80 rounded-[16px] p-1.5 pl-6 shadow-[inset_0_1px_8px_rgba(43,127,255,0.1),_0_0_15px_rgba(43,127,255,0.1)] transition-all duration-300 active:scale-95 text-left backdrop-blur-xl mt-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2B7FFF]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#2B7FFF] font-semibold">
                  View My Work
                </span>
                <div className="w-[42px] h-[42px] rounded-[12px] bg-[#2B7FFF]/10 flex items-center justify-center text-[#2B7FFF] group-hover:bg-[#2B7FFF]/20 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </button>

              {/* 3-Column Micro Grid Cards exactly like mockup */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-5 border-t border-white/5 pb-2">
                {/* Micro Card 1 */}
                <div className="flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-md border border-[#2B7FFF]/20 bg-[#2B7FFF]/5 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    <Sparkles className="w-4 h-4 text-[#2B7FFF]/80" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-slate-400 font-medium leading-tight">
                      Crafting
                      <br />
                      Meaningful
                      <br />
                      Experiences
                    </span>
                    <div className="w-4 h-[1.5px] bg-[#2B7FFF]/40 mt-1" />
                  </div>
                </div>

                {/* Micro Card 2 */}
                <div className="flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-md border border-[#2B7FFF]/20 bg-[#2B7FFF]/5 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    <Target className="w-4 h-4 text-[#2B7FFF]/80" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-slate-400 font-medium leading-tight">
                      Designing
                      <br />
                      With Purpose
                      <br />
                      & Precision
                    </span>
                    <div className="w-6 h-[1.5px] bg-[#2B7FFF] mt-1 shadow-[0_0_4px_#2B7FFF]" />
                  </div>
                </div>

                {/* Micro Card 3 */}
                <div className="flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-md border border-[#2B7FFF]/20 bg-[#2B7FFF]/5 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    <Box className="w-4 h-4 text-[#2B7FFF]/80" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-slate-400 font-medium leading-tight">
                      Turning Ideas
                      <br />
                      Into Impactful
                      <br />
                      Solutions
                    </span>
                    <div className="w-4 h-[1.5px] bg-[#2B7FFF]/40 mt-1" />
                  </div>
                </div>
              </div>

              {/* Scroll Down Indicator */}
              <div className="flex flex-col items-center justify-center gap-1 mt-6 w-full select-none">
                {/* Glowing ring */}
                <div className="relative w-8 h-8 rounded-full border border-[#2B7FFF]/25 flex items-center justify-center">
                  <div className="absolute inset-0.5 rounded-full border border-dashed border-[#2B7FFF]/15 animate-spin-slow" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2B7FFF] shadow-[0_0_8px_#2B7FFF] animate-ping" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2B7FFF]" />
                </div>
                
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#8B9DBB]/50 font-medium mt-1">
                  Scroll Down
                </span>
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="text-[#2B7FFF]/60 mt-0.5"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.div>
              </div>
            </div>

            {/* Far Right Nav/CTA Elements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 1.1, ease: "easeOut" }}
              className="hidden md:flex fixed right-4 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-50"
            >
              {/* CONTACT ME (Inactive) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="group flex flex-col items-center justify-center gap-1.5 text-[#CAD5E2] w-12 h-40 relative py-3"
              >
                <div className="relative z-10">
                  <Plus
                    strokeWidth={2}
                    className="w-5 h-5 text-[#2B7FFF] transition-transform group-hover:rotate-90"
                  />
                </div>
                <span
                  className="[writing-mode:vertical-rl] rotate-180 text-[11px] tracking-widest uppercase relative z-10"
                  style={{ fontFamily: "Epilogue, sans-serif" }}
                >
                  Contact Me
                </span>
              </motion.button>

              {/* VIEW MY WORK (Active) */}
              <motion.button
                whileHover="hover"
                className="group flex flex-col items-center justify-center gap-2 text-[#CAD5E2] w-12 h-44 rounded-md border border-[#314158] bg-gradient-to-b from-[#06122F] to-[#0A2F7E] relative overflow-hidden py-4 shadow-[0_0_20px_rgba(10,47,126,0.3)]"
              >
                <motion.div
                  variants={{ hover: { x: 3, y: -3 } }}
                  className="relative z-10"
                >
                  <ArrowUpRight
                    strokeWidth={2}
                    className="w-4 h-4 text-[#CAD5E2]"
                  />
                </motion.div>
                <span
                  className="[writing-mode:vertical-rl] rotate-180 text-[11px] tracking-widest uppercase relative z-10"
                  style={{
                    fontFamily: "Epilogue, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  View my work
                </span>
              </motion.button>
            </motion.div>

            {/* Bottom Right Clock & Barcode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.3, ease: "easeOut" }}
              className="hidden md:flex absolute bottom-0 right-0 flex-col items-end gap-2 pr-8 pb-8 lg:pr-0 lg:pb-0 z-20"
            >
              <DigitalClock />
              <div className="flex gap-px opacity-30 mt-1 justify-end h-6 w-32 items-end">
                {/* Optimized Barcode: Pre-calculated static pattern */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const staticHeight = [
                    40, 70, 30, 90, 50, 80, 20, 60, 45, 75, 35, 85, 55, 65, 25,
                    95, 40, 70, 30, 90, 55, 85, 45, 75, 25, 95, 35, 65, 20, 80,
                  ][i % 30];
                  return (
                    <div
                      key={i}
                      className="w-0.5 bg-[#B3C5DF]"
                      style={{ height: `${staticHeight}%` }}
                    />
                  );
                })}
              </div>
            </motion.div>
          </main>
        </div>
      </div>

      {/* About Section */}
      <AboutSection />

      {/* Experience Section */}
      <ExperienceSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Design Process Section */}
      <ProcessSection />

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* Skills & Tools Section */}
      <SkillsSection />

      {/* Contact Section */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
