function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function normalizeApiBase(value: string) {
  const trimmed = trimTrailingSlash(value.trim());
  if (!trimmed) return "/api";
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

export function getApiBase() {
  const env = import.meta.env as ImportMetaEnv & {
    VITE_API_BASE_URL?: string;
    VITE_APP_URL?: string;
  };

  const configured = env.VITE_API_BASE_URL?.trim() || env.VITE_APP_URL?.trim();
  if (configured) return normalizeApiBase(configured);

  if (typeof window !== "undefined" && window.location?.origin) {
    return `${trimTrailingSlash(window.location.origin)}/api`;
  }

  return "/api";
}

export function apiUrl(path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBase()}${cleanPath}`;
}
