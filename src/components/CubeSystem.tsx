import { useRef, useEffect } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useAnimate,
} from "motion/react";
import { useIsMobile, usePrefersReducedMotion } from "../hooks/useIsMobile";

export const CubeSystem = () => {
  const rotateX = useMotionValue(25);
  const rotateY = useMotionValue(20);
  const scale = useMotionValue(1);
  const [scope, animate] = useAnimate();
  const isInteracting = useRef(false);

  // On phones (or when the user prefers reduced motion) we cut the heavy
  // continuous work: 156 preserve-3d faces, a forever rAF auto-drift loop and
  // three stacked large-radius blur layers murder mobile GPUs.
  const isMobile = useIsMobile();
  const prefersReduced = usePrefersReducedMotion();
  const reduceEffects = isMobile || prefersReduced;

  // Spring physics for "heavy" high-quality movement
  const springX = useSpring(rotateX, { stiffness: 60, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 60, damping: 20 });
  const springScale = useSpring(scale, { stiffness: 200, damping: 25 });

  // Baseline auto-drift (very slow). Skipped entirely on reduced-effects
  // devices, and paused while the cube is scrolled out of view everywhere else
  // so it stops burning frames/battery once you've passed the About section.
  useEffect(() => {
    if (reduceEffects) return;

    let animationFrame: number;
    let inView = true;
    const el = scope.current as Element | null;
    const observer =
      el && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
            },
            { threshold: 0 },
          )
        : null;
    if (observer && el) observer.observe(el);

    const animateDrift = () => {
      if (!isInteracting.current && inView) {
        // Increased speed for more dynamic movement
        rotateX.set(rotateX.get() + 0.05);
        rotateY.set(rotateY.get() + 0.08);
      }
      animationFrame = requestAnimationFrame(animateDrift);
    };

    animationFrame = requestAnimationFrame(animateDrift);
    return () => {
      cancelAnimationFrame(animationFrame);
      if (observer) observer.disconnect();
    };
  }, [rotateX, rotateY, reduceEffects, scope]);

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
      {/* Soft inner blue core glow (blur radius scaled down on mobile) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] bg-blue-600/5 blur-[60px] md:blur-[150px] rounded-full pointer-events-none" />

      {/* Cinematic Pulsing Flash Background — static & lighter when effects reduced */}
      <motion.div
        animate={
          reduceEffects
            ? { opacity: 0.1 }
            : { opacity: [0.05, 0.15, 0.05], scale: [0.9, 1.1, 0.9], rotate: [0, 180, 360] }
        }
        transition={reduceEffects ? { duration: 0 } : { duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 blur-[70px] md:blur-[180px] rounded-full pointer-events-none -z-10"
      />

      <motion.div
        animate={reduceEffects ? { opacity: 0.15 } : { opacity: [0.1, 0.3, 0.1] }}
        transition={reduceEffects ? { duration: 0 } : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-blue-400/10 blur-[60px] md:blur-[140px] rounded-full pointer-events-none -z-10"
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
                animate={
                  reduceEffects
                    ? { y: offsetY }
                    : { y: [offsetY * 0.998, offsetY * 1.002, offsetY * 0.998] }
                }
                transition={
                  reduceEffects
                    ? { duration: 0 }
                    : { duration: 10 + Math.random() * 5, repeat: Infinity, ease: "easeInOut" }
                }
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
