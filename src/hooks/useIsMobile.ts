import { useState, useEffect } from "react";

/**
 * SSR-safe hook that reports whether the viewport is at/below a breakpoint.
 * Defaults to the Tailwind `md` breakpoint (768px) so it matches the
 * existing `md:` responsive classes throughout the app.
 *
 * Used to cheapen heavy visuals on phones: shrink large GPU blurs and
 * skip `repeat: Infinity` animations that tank the framerate on mobile GPUs.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`;

  const getInitial = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : false;

  const [isMobile, setIsMobile] = useState<boolean>(getInitial);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia(query);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return isMobile;
}

/**
 * Reports the user's OS-level "reduce motion" preference.
 * Pair with `useIsMobile` to decide when to drop expensive animations.
 */
export function usePrefersReducedMotion(): boolean {
  const query = "(prefers-reduced-motion: reduce)";

  const getInitial = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : false;

  const [reduced, setReduced] = useState<boolean>(getInitial);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia(query);
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Convenience: true when heavy/continuous effects should be cut back,
 * i.e. on small screens OR when the user asked for reduced motion.
 */
export function useReduceEffects(breakpoint = 768): boolean {
  const isMobile = useIsMobile(breakpoint);
  const reducedMotion = usePrefersReducedMotion();
  return isMobile || reducedMotion;
}
