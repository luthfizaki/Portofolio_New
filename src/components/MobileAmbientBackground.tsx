import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useIsMobile } from "../hooks/useIsMobile";

/**
 * MobileAmbientBackground
 * -----------------------
 * A lightweight decorative layer that gives the otherwise flat mobile section
 * backgrounds depth and life WITHOUT the GPU cost that the mobile pass removed:
 *
 *  - It mounts on phones ONLY. On desktop the outer component returns `null`
 *    before any scroll listener is even registered, so the desktop experience
 *    is byte-for-byte identical to before.
 *  - All motion is driven by SCROLL POSITION (compositor-only `transform`), so
 *    the field reacts as you scroll instead of sitting static — and costs almost
 *    nothing when the page is idle.
 *  - Soft glows use `radial-gradient` paint, never the expensive `blur()` filter
 *    that was the main mobile bottleneck.
 */

type AmbientTint = "blue" | "purple" | "teal";

interface MobileAmbientBackgroundProps {
  /** Dominant accent colour; the field always mixes in subtle secondary hues. */
  tint?: AmbientTint;
  /** How busy the particle field is. */
  density?: "low" | "medium";
  /** Render the faint blueprint dot-grid wash behind the particles. */
  showGrid?: boolean;
}

const HEX: Record<AmbientTint, string> = {
  blue: "#2B7FFF",
  purple: "#8B5CF6",
  teal: "#20C997",
};

// Stable, hand-placed field so it never reshuffles between renders.
// layer: 0 = far/slow, 1 = mid, 2 = near (stronger parallax).
type Particle = {
  x: number;
  y: number;
  s: number;
  layer: 0 | 1 | 2;
  hue: AmbientTint;
  twinkle?: boolean;
};

const FIELD: Particle[] = [
  { x: 8, y: 12, s: 2, layer: 0, hue: "blue", twinkle: true },
  { x: 22, y: 30, s: 3, layer: 1, hue: "blue" },
  { x: 15, y: 62, s: 2, layer: 0, hue: "purple", twinkle: true },
  { x: 30, y: 82, s: 4, layer: 2, hue: "blue", twinkle: true },
  { x: 44, y: 18, s: 2, layer: 1, hue: "teal" },
  { x: 52, y: 48, s: 3, layer: 2, hue: "purple", twinkle: true },
  { x: 60, y: 72, s: 2, layer: 0, hue: "blue" },
  { x: 70, y: 22, s: 3, layer: 1, hue: "blue", twinkle: true },
  { x: 78, y: 55, s: 2, layer: 0, hue: "teal", twinkle: true },
  { x: 88, y: 35, s: 4, layer: 2, hue: "blue" },
  { x: 92, y: 78, s: 2, layer: 1, hue: "purple", twinkle: true },
  { x: 38, y: 92, s: 2, layer: 0, hue: "blue" },
  { x: 66, y: 90, s: 3, layer: 1, hue: "blue", twinkle: true },
  { x: 5, y: 88, s: 2, layer: 2, hue: "purple" },
  { x: 84, y: 10, s: 2, layer: 0, hue: "blue", twinkle: true },
  { x: 50, y: 5, s: 3, layer: 2, hue: "teal", twinkle: true },
];

const MobileAmbientField = ({
  tint = "blue",
  density = "medium",
  showGrid = true,
}: MobileAmbientBackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Three depth layers move at increasing speeds → parallax sense of depth.
  const yFar = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const yMid = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const yNear = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const rot = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const streakY = useTransform(scrollYProgress, [0, 1], [-80, 220]);
  const layerY = [yFar, yMid, yNear];

  const accent = HEX[tint];
  const particles =
    density === "low" ? FIELD.filter((_, i) => i % 2 === 0) : FIELD;

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none select-none md:hidden z-0"
    >
      <style>
        {`@keyframes ambient-twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50%      { opacity: 0.95; transform: scale(1.7); }
          }`}
      </style>

      {/* Faint blueprint dot-grid wash */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(ellipse 85% 60% at 50% 40%, black 30%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 60% at 50% 40%, black 30%, transparent 85%)",
          }}
        />
      )}

      {/* Soft radial glow blobs — paint, not blur() filter — with parallax */}
      <motion.div
        style={{
          y: yFar,
          background: `radial-gradient(circle, ${accent}1f 0%, transparent 70%)`,
        }}
        className="absolute -top-[12%] -right-[18%] w-[72vw] h-[72vw] rounded-full"
      />
      <motion.div
        style={{
          y: yMid,
          background: `radial-gradient(circle, ${HEX.purple}17 0%, transparent 72%)`,
        }}
        className="absolute top-[52%] -left-[22%] w-[64vw] h-[64vw] rounded-full"
      />

      {/* Blueprint geometric accents */}
      <motion.div
        style={{ y: yMid, rotate: rot, borderColor: `${accent}2e` }}
        className="absolute top-[16%] right-[9%] w-28 h-28 rounded-full border"
      />
      <motion.div
        style={{ y: yNear, rotate: rot, borderColor: `${HEX.purple}2e` }}
        className="absolute bottom-[14%] left-[7%] w-20 h-20 rounded-[18px] border rotate-12"
      />

      {/* Thin horizontal scan line */}
      <motion.div
        style={{
          y: yNear,
          background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
        }}
        className="absolute top-[42%] left-0 w-full h-px"
      />

      {/* Diagonal light streak */}
      <motion.div
        style={{
          y: streakY,
          background: `linear-gradient(to bottom, transparent, ${accent}cc, transparent)`,
        }}
        className="absolute left-[12%] top-0 w-[1.5px] h-40 -rotate-[30deg] origin-top"
      />

      {/* Parallax particle layers */}
      {([0, 1, 2] as const).map((layer) => (
        <motion.div
          key={layer}
          style={{ y: layerY[layer] }}
          className="absolute inset-0"
        >
          {particles
            .filter((p) => p.layer === layer)
            .map((p, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.s,
                  height: p.s,
                  background: HEX[p.hue],
                  boxShadow: `0 0 ${p.s * 3}px ${p.s}px ${HEX[p.hue]}66`,
                  opacity: p.twinkle ? undefined : 0.5,
                  animation: p.twinkle
                    ? `ambient-twinkle ${4 + (i % 4)}s ease-in-out ${i * 0.45}s infinite`
                    : undefined,
                }}
              />
            ))}
        </motion.div>
      ))}
    </div>
  );
};

export const MobileAmbientBackground = (props: MobileAmbientBackgroundProps) => {
  // Desktop: bail out before any scroll hook runs — zero cost, zero change.
  const isMobile = useIsMobile();
  if (!isMobile) return null;
  return <MobileAmbientField {...props} />;
};
