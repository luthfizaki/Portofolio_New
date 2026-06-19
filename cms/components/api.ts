// Reusable API helper for CMS components
const API_BASE = "/api";

export function getToken(): string | null {
  return localStorage.getItem("cms_token");
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options?.headers },
  });
  if (res.status === 401) {
    localStorage.removeItem("cms_token");
    localStorage.removeItem("cms_user");
    window.location.href = "/cms/login";
    throw new Error("Unauthorized");
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
}

export async function getContent(section: string) {
  return apiFetch(`/content/${section}`);
}

export async function updateContent(section: string, body: any) {
  return apiFetch(`/content/${section}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function getProjects() {
  return apiFetch("/projects");
}

export async function getProject(id: string) {
  return apiFetch(`/projects/${id}`);
}

export async function createProject(body: any) {
  return apiFetch("/projects", { method: "POST", body: JSON.stringify(body) });
}

export async function updateProject(id: string, body: any) {
  return apiFetch(`/projects/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function deleteProject(id: string) {
  return apiFetch(`/projects/${id}`, { method: "DELETE" });
}

export async function reorderProjects(ids: string[]) {
  return apiFetch("/projects/reorder", { method: "PUT", body: JSON.stringify({ ids }) });
}

export async function getExperiences() {
  return apiFetch("/experiences");
}

export async function createExperience(body: any) {
  return apiFetch("/experiences", { method: "POST", body: JSON.stringify(body) });
}

export async function updateExperience(id: string, body: any) {
  return apiFetch(`/experiences/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function deleteExperience(id: string) {
  return apiFetch(`/experiences/${id}`, { method: "DELETE" });
}

export async function getStats() {
  return apiFetch("/stats");
}

// Downscale + recompress large images in the browser before upload, so the
// site never ships multi-MB originals. Non-raster files (PDF/SVG/GIF) pass
// through untouched, and we keep the original if compression doesn't help.
async function compressImage(file: File, maxDim = 1920, quality = 0.85): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp" });
  } catch {
    return file;
  }
}

export async function uploadFile(file: File): Promise<{ url: string; filename: string }> {
  const processed = await compressImage(file);
  const formData = new FormData();
  formData.append("file", processed);
  const token = getToken();
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data;
}

// Upload several files at once (used by the project gallery). Reuses the
// single-file endpoint so no backend change is needed.
export async function uploadFiles(files: File[]): Promise<{ url: string; filename: string }[]> {
  return Promise.all(files.map(uploadFile));
}

// Delete a previously uploaded file when an image is replaced or removed.
export async function deleteUpload(url: string) {
  if (!url || !url.startsWith("/uploads/")) return;
  try {
    await apiFetch("/upload", { method: "DELETE", body: JSON.stringify({ url }) });
  } catch (e) {
    console.warn("deleteUpload failed", e);
  }
}

// ─── Contact messages (CMS inbox) ────────────────────────────────────────────────
export async function getMessages() {
  return apiFetch("/messages");
}

export async function markMessageRead(id: string) {
  return apiFetch(`/messages/${id}/read`, { method: "PUT" });
}

export async function deleteMessage(id: string) {
  return apiFetch(`/messages/${id}`, { method: "DELETE" });
}
