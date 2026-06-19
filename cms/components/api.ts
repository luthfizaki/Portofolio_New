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

export async function uploadFile(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", file);
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
