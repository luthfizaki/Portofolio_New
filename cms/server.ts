import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, unlinkSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(__dirname, "..", "public", "uploads");
// Prefer an env-provided secret; the literal fallback keeps local dev working.
const JWT_SECRET = process.env.JWT_SECRET || "portfolio-cms-secret-key-change-in-production";

// Ensure directories exist
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ─── Helpers ────────────────────────────────────────────────────────────────────

function readJSON(filename: string) {
  const filePath = path.join(DATA_DIR, filename);
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function writeJSON(filename: string, data: any) {
  const filePath = path.join(DATA_DIR, filename);
  const tmpPath = `${filePath}.tmp`;
  // Write to a temp file then atomically rename so a crash mid-write can't
  // leave a half-written / corrupted JSON file behind.
  writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  renameSync(tmpPath, filePath);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Remove an uploaded file referenced by its public URL ("/uploads/xyz.ext").
// Guards against path traversal — only ever deletes inside UPLOADS_DIR.
function deleteUploadByUrl(url?: string) {
  if (!url || typeof url !== "string" || !url.startsWith("/uploads/")) return;
  const filePath = path.join(UPLOADS_DIR, path.basename(url));
  try {
    if (filePath.startsWith(UPLOADS_DIR) && existsSync(filePath)) unlinkSync(filePath);
  } catch (e) {
    console.warn("Failed to delete upload", url, e);
  }
}

// ─── Auth Middleware ─────────────────────────────────────────────────────────────

function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ─── File Upload Config ──────────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${generateId()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ─── AUTH ROUTES ─────────────────────────────────────────────────────────────────

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const authData = readJSON("auth.json");
  if (!authData) return res.status(500).json({ error: "Auth config not found" });

  if (username !== authData.username) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  bcrypt.compare(password, authData.passwordHash, (err, match) => {
    if (err || !match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, username });
  });
});

app.post("/api/auth/change-password", authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const authData = readJSON("auth.json");
  if (!authData) return res.status(500).json({ error: "Auth config not found" });

  bcrypt.compare(currentPassword, authData.passwordHash, async (err, match) => {
    if (err || !match) return res.status(401).json({ error: "Current password is incorrect" });
    const newHash = await bcrypt.hash(newPassword, 10);
    writeJSON("auth.json", { ...authData, passwordHash: newHash });
    res.json({ success: true });
  });
});

// ─── CONTENT ROUTES (Generic GET/PUT for simple sections) ────────────────────────

const CONTENT_SECTIONS = ["hero", "about", "process", "testimonials", "skills", "contact"];

app.get("/api/content/:section", (req, res) => {
  const { section } = req.params;
  if (!CONTENT_SECTIONS.includes(section) && !["experience", "projects", "settings"].includes(section)) {
    return res.status(404).json({ error: "Section not found" });
  }
  const data = readJSON(`${section}.json`);
  if (!data) return res.status(404).json({ error: "Data not found" });
  res.json(data);
});

app.put("/api/content/:section", authMiddleware, (req, res) => {
  const { section } = req.params;
  if (!CONTENT_SECTIONS.includes(section) && !["experience", "projects", "settings"].includes(section)) {
    return res.status(404).json({ error: "Section not found" });
  }
  // When the resume is replaced, clean up the previously uploaded PDF.
  if (section === "settings") {
    const old = readJSON("settings.json");
    if (old?.resumeUrl && old.resumeUrl !== req.body?.resumeUrl) deleteUploadByUrl(old.resumeUrl);
  }
  writeJSON(`${section}.json`, req.body);
  res.json({ success: true });
});

// ─── EXPERIENCE CRUD ─────────────────────────────────────────────────────────────

app.get("/api/experiences", (_req, res) => {
  const data = readJSON("experience.json");
  res.json(data?.experiences || []);
});

app.post("/api/experiences", authMiddleware, (req, res) => {
  const data = readJSON("experience.json") || { experiences: [] };
  const entry = { ...req.body, id: req.body.id || `exp-${generateId()}` };
  data.experiences.push(entry);
  writeJSON("experience.json", data);
  res.json(entry);
});

app.put("/api/experiences/:id", authMiddleware, (req, res) => {
  const data = readJSON("experience.json") || { experiences: [] };
  const idx = data.experiences.findIndex((e: any) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Experience not found" });
  data.experiences[idx] = { ...data.experiences[idx], ...req.body };
  writeJSON("experience.json", data);
  res.json(data.experiences[idx]);
});

app.delete("/api/experiences/:id", authMiddleware, (req, res) => {
  const data = readJSON("experience.json") || { experiences: [] };
  data.experiences = data.experiences.filter((e: any) => e.id !== req.params.id);
  writeJSON("experience.json", data);
  res.json({ success: true });
});

// ─── PROJECTS CRUD ───────────────────────────────────────────────────────────────

app.get("/api/projects", (_req, res) => {
  const data = readJSON("projects.json");
  const projects = (data?.projects || []).map((p: any) => ({
    ...p,
    caseStudy: undefined, // Don't send full case study in list
  }));
  res.json(projects);
});

app.get("/api/projects/:id", (req, res) => {
  const data = readJSON("projects.json");
  const project = (data?.projects || []).find((p: any) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

app.post("/api/projects", authMiddleware, (req, res) => {
  const data = readJSON("projects.json") || { projects: [] };
  const project = {
    ...req.body,
    id: req.body.id || `proj-${generateId()}`,
    order: data.projects.length,
    caseStudy: req.body.caseStudy || { problem: "", solution: "", myRole: "", teamSize: 1, timeline: "", platforms: [], processSteps: [] },
  };
  data.projects.push(project);
  writeJSON("projects.json", data);
  res.json(project);
});

// NOTE: must be registered before "/api/projects/:id" so "reorder" isn't
// captured as an :id. Reorders the full array (preserving caseStudy etc.).
app.put("/api/projects/reorder", authMiddleware, (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids)) return res.status(400).json({ error: "ids array required" });
  const data = readJSON("projects.json") || { projects: [] };
  const byId = new Map(data.projects.map((p: any) => [p.id, p]));
  const reordered = ids.map((id: string) => byId.get(id)).filter(Boolean);
  // Safety: keep any project not present in `ids` so nothing is ever dropped.
  for (const p of data.projects) if (!ids.includes(p.id)) reordered.push(p);
  reordered.forEach((p: any, i: number) => { p.order = i; });
  data.projects = reordered;
  writeJSON("projects.json", data);
  res.json({ success: true });
});

const projectImageUrls = (p: any): string[] =>
  [
    ...(p?.gallery || []),
    ...((p?.caseStudy?.processSteps || []).map((s: any) => s.imageUrl)),
  ].filter(Boolean);

app.put("/api/projects/:id", authMiddleware, (req, res) => {
  const data = readJSON("projects.json") || { projects: [] };
  const idx = data.projects.findIndex((p: any) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Project not found" });
  const merged = { ...data.projects[idx], ...req.body };
  // Delete upload files that were removed/replaced in this save (only now that
  // the change is actually persisted, so cancelling an edit never orphans a ref).
  const newUrls = new Set(projectImageUrls(merged));
  projectImageUrls(data.projects[idx]).forEach((url) => {
    if (!newUrls.has(url)) deleteUploadByUrl(url);
  });
  data.projects[idx] = merged;
  writeJSON("projects.json", data);
  res.json(data.projects[idx]);
});

app.delete("/api/projects/:id", authMiddleware, (req, res) => {
  const data = readJSON("projects.json") || { projects: [] };
  const project = data.projects.find((p: any) => p.id === req.params.id);
  if (project) {
    // Clean up this project's uploaded images so they don't orphan in /uploads.
    (project.gallery || []).forEach(deleteUploadByUrl);
    (project.caseStudy?.processSteps || []).forEach((s: any) => deleteUploadByUrl(s.imageUrl));
  }
  data.projects = data.projects.filter((p: any) => p.id !== req.params.id);
  writeJSON("projects.json", data);
  res.json({ success: true });
});

// ─── SETTINGS ────────────────────────────────────────────────────────────────────

app.get("/api/settings", (_req, res) => {
  const data = readJSON("settings.json");
  res.json(data || {});
});

app.put("/api/settings", authMiddleware, (req, res) => {
  writeJSON("settings.json", req.body);
  res.json({ success: true });
});

// ─── FILE UPLOAD ─────────────────────────────────────────────────────────────────

app.post("/api/upload", authMiddleware, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

// Delete a previously uploaded file (called when an image is replaced/removed).
app.delete("/api/upload", authMiddleware, (req, res) => {
  deleteUploadByUrl(req.body?.url);
  res.json({ success: true });
});

// ─── CONTACT MESSAGES ────────────────────────────────────────────────────────────

app.get("/api/messages", authMiddleware, (_req, res) => {
  const data = readJSON("messages.json") || { messages: [] };
  res.json(data.messages);
});

// Public: the site's contact form posts here.
app.post("/api/messages", (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: "Name, email, and message are required" });
  const data = readJSON("messages.json") || { messages: [] };
  const entry = {
    id: `msg-${generateId()}`,
    name, email, subject: subject || "", message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  data.messages.unshift(entry);
  writeJSON("messages.json", data);
  res.json({ success: true });
});

app.put("/api/messages/:id/read", authMiddleware, (req, res) => {
  const data = readJSON("messages.json") || { messages: [] };
  const msg = data.messages.find((m: any) => m.id === req.params.id);
  if (msg) { msg.read = true; writeJSON("messages.json", data); }
  res.json({ success: true });
});

app.delete("/api/messages/:id", authMiddleware, (req, res) => {
  const data = readJSON("messages.json") || { messages: [] };
  data.messages = data.messages.filter((m: any) => m.id !== req.params.id);
  writeJSON("messages.json", data);
  res.json({ success: true });
});

// ─── ALL CONTENT (for dashboard stats) ───────────────────────────────────────────

app.get("/api/stats", (_req, res) => {
  const projects = readJSON("projects.json");
  const experience = readJSON("experience.json");
  const testimonials = readJSON("testimonials.json");
  const skills = readJSON("skills.json");
  const messages = readJSON("messages.json");

  res.json({
    projects: projects?.projects?.length || 0,
    experiences: experience?.experiences?.length || 0,
    testimonials: testimonials?.testimonials?.length || 0,
    skills: (skills?.coreSkills?.length || 0) + (skills?.aiToolkit?.length || 0),
    unreadMessages: (messages?.messages || []).filter((m: any) => !m.read).length,
  });
});

// ─── START SERVER ────────────────────────────────────────────────────────────────

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`CMS API server running on http://localhost:${PORT}`);
});
