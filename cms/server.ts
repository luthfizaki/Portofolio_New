import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(__dirname, "..", "public", "uploads");
const JWT_SECRET = "portfolio-cms-secret-key-change-in-production";

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
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
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

app.put("/api/projects/:id", authMiddleware, (req, res) => {
  const data = readJSON("projects.json") || { projects: [] };
  const idx = data.projects.findIndex((p: any) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Project not found" });
  data.projects[idx] = { ...data.projects[idx], ...req.body };
  writeJSON("projects.json", data);
  res.json(data.projects[idx]);
});

app.delete("/api/projects/:id", authMiddleware, (req, res) => {
  const data = readJSON("projects.json") || { projects: [] };
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

// ─── ALL CONTENT (for dashboard stats) ───────────────────────────────────────────

app.get("/api/stats", (_req, res) => {
  const projects = readJSON("projects.json");
  const experience = readJSON("experience.json");
  const testimonials = readJSON("testimonials.json");
  const skills = readJSON("skills.json");

  res.json({
    projects: projects?.projects?.length || 0,
    experiences: experience?.experiences?.length || 0,
    testimonials: testimonials?.testimonials?.length || 0,
    skills: (skills?.coreSkills?.length || 0) + (skills?.aiToolkit?.length || 0),
  });
});

// ─── START SERVER ────────────────────────────────────────────────────────────────

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`CMS API server running on http://localhost:${PORT}`);
});
