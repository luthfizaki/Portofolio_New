/**
 * DesktopAmbientBackground
 * ------------------------
 * A continuously-animated decorative layer for the big landing sections so they
 * never feel empty/static on desktop. It is the desktop counterpart to
 * `MobileAmbientBackground` (which is scroll-driven for phones):
 *
 *  - DESKTOP ONLY. The root is `hidden md:block`, so on phones it is
 *    `display:none` — it never paints, animates, or composites there. Mobile
 *    sections keep using `MobileAmbientBackground` instead.
 *  - All motion is transform/opacity keyframes (see `ambient-*` in index.css),
 *    which run on the compositor and are automatically frozen by the global
 *    `prefers-reduced-motion` rule.
 *  - Soft glows use `radial-gradient` paint, never the expensive `blur()` filter.
 */

type Tint = "blue" | "purple" | "teal";

const HEX: Record<Tint, string> = {
  blue: "#2B7FFF",
  purple: "#8B5CF6",
  teal: "#20C997",
};

interface DesktopAmbientBackgroundProps {
  /** Dominant accent colour. */
  tint?: Tint;
  /** Secondary accent mixed into the field. */
  secondary?: Tint;
  /** Flip the constellation/orbs so adjacent sections don't look identical. */
  variant?: "a" | "b";
  /** Draw the animated constellation network. */
  showConstellation?: boolean;
  /** Draw the slow vertical light sweep. */
  showScan?: boolean;
  className?: string;
}

type Star = {
  x: number; // %
  y: number; // %
  s: number; // px
  dur: number; // s
  delay: number; // s
  hue: Tint;
  twinkle?: boolean;
};

// Stable, hand-placed field so it never reshuffles between renders.
const FIELD: Star[] = [
  { x: 6, y: 18, s: 2, dur: 7, delay: 0, hue: "blue", twinkle: true },
  { x: 14, y: 64, s: 3, dur: 9, delay: 1.2, hue: "blue" },
  { x: 22, y: 34, s: 2, dur: 6, delay: 2.1, hue: "purple", twinkle: true },
  { x: 31, y: 82, s: 2, dur: 8, delay: 0.6, hue: "blue", twinkle: true },
  { x: 40, y: 12, s: 3, dur: 10, delay: 1.8, hue: "teal" },
  { x: 47, y: 52, s: 2, dur: 7, delay: 3.2, hue: "blue", twinkle: true },
  { x: 55, y: 26, s: 2, dur: 9, delay: 0.4, hue: "purple", twinkle: true },
  { x: 63, y: 74, s: 3, dur: 8, delay: 2.6, hue: "blue" },
  { x: 71, y: 40, s: 2, dur: 6, delay: 1.1, hue: "teal", twinkle: true },
  { x: 78, y: 16, s: 2, dur: 9, delay: 3.6, hue: "blue", twinkle: true },
  { x: 84, y: 60, s: 3, dur: 10, delay: 0.9, hue: "purple" },
  { x: 92, y: 30, s: 2, dur: 7, delay: 2.3, hue: "blue", twinkle: true },
  { x: 88, y: 86, s: 2, dur: 8, delay: 1.5, hue: "blue", twinkle: true },
  { x: 50, y: 90, s: 2, dur: 9, delay: 3.0, hue: "teal" },
  { x: 35, y: 50, s: 2, dur: 6, delay: 0.2, hue: "blue", twinkle: true },
];

export const DesktopAmbientBackground = ({
  tint = "blue",
  secondary = "purple",
  variant = "a",
  showConstellation = true,
  showScan = false,
  className = "",
}: DesktopAmbientBackgroundProps) => {
  const accent = HEX[tint];
  const accent2 = HEX[secondary];
  const flip = variant === "b";

  return (
    <div
      aria-hidden
      className={`hidden md:block absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* Drifting aurora glows — radial-gradient paint, not blur() */}
      <div
        className="absolute -top-[12%] w-[46vw] h-[46vw] rounded-full mix-blend-screen"
        style={{
          [flip ? "left" : "right"]: "-10%",
          background: `radial-gradient(circle, ${accent}1f 0%, transparent 68%)`,
          animation: "ambient-drift-a 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-14%] w-[40vw] h-[40vw] rounded-full mix-blend-screen"
        style={{
          [flip ? "right" : "left"]: "-12%",
          background: `radial-gradient(circle, ${accent2}1a 0%, transparent 70%)`,
          animation: "ambient-drift-b 26s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[38%] left-[28%] w-[28vw] h-[28vw] rounded-full mix-blend-screen"
        style={{
          background: `radial-gradient(circle, ${accent}14 0%, transparent 72%)`,
          animation: "ambient-drift-a 30s ease-in-out infinite 4s",
        }}
      />

      {/* Animated constellation network */}
      {showConstellation && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.18]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 600"
          style={flip ? { transform: "scaleX(-1)" } : undefined}
        >
          <path
            d="M -100,140 C 320,40 520,360 880,200 S 1300,420 1700,160"
            stroke={accent}
            strokeWidth="1"
            fill="none"
            strokeDasharray="6 10"
            style={{ animation: "ambient-dash 18s linear infinite" }}
          />
          <path
            d="M -60,460 C 260,360 600,560 940,360 S 1320,180 1720,500"
            stroke={accent2}
            strokeWidth="1"
            fill="none"
            strokeDasharray="6 10"
            strokeDashoffset="200"
            style={{ animation: "ambient-dash 24s linear infinite reverse" }}
          />
          <circle cx="320" cy="120" r="3" fill={accent} style={{ animation: "ambient-twinkle 6s ease-in-out 0.4s infinite" }} />
          <circle cx="880" cy="200" r="4" fill={accent} style={{ animation: "ambient-twinkle 7s ease-in-out 2s infinite" }} />
          <circle cx="600" cy="430" r="3" fill={accent2} style={{ animation: "ambient-twinkle 8s ease-in-out 1s infinite" }} />
          <circle cx="1180" cy="300" r="2.5" fill={accent} style={{ animation: "ambient-twinkle 6.5s ease-in-out 3s infinite" }} />
        </svg>
      )}

      {/* Floating particles */}
      {FIELD.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            background: HEX[p.hue],
            boxShadow: `0 0 ${p.s * 3}px ${p.s}px ${HEX[p.hue]}59`,
            animation: p.twinkle
              ? `ambient-twinkle ${p.dur}s ease-in-out ${p.delay}s infinite`
              : `ambient-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Slow vertical light sweep */}
      {showScan && (
        <div
          className="absolute left-0 w-full h-px"
          style={{
            top: 0,
            background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
            animation: "ambient-scan 14s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
};
