import { useEffect } from "react";

/**
 * Warn before the tab is closed/refreshed while there are unsaved edits.
 * The CMS uses a declarative BrowserRouter (not a data router), so `useBlocker`
 * isn't available for in-app navigation — this covers the common data-loss case
 * (refresh / close / hard navigation).
 */
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}
