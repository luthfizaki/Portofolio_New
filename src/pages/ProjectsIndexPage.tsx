import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowUpRight, FolderOpen, HeartPulse, ShieldCheck, Sparkles,
  Briefcase, BookOpen, MessageSquare, PenTool, Search, Star, type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { apiUrl } from "../lib/apiBase";
import { requestJson } from "../lib/requestJson";
import { getFallbackProjects } from "../lib/portfolioProjects";

const iconMap: Record<string, LucideIcon> = {
  HeartPulse, ShieldCheck, Sparkles, Briefcase, BookOpen, MessageSquare, PenTool, Search, FolderOpen, Star,
};

export function ProjectsIndexPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "All Projects — Luthfi Arzaki";
    const loadProjects = async () => {
      try {
        const { data } = await requestJson<any[]>(apiUrl("/projects"));
        setProjects(Array.isArray(data) ? data : getFallbackProjects());
      } catch {
        setProjects(getFallbackProjects());
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#060A14] text-white">
      <header className="sticky top-0 z-40 bg-[#060A14]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[#8B9DBB] hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </button>
          <span className="font-mono text-xs text-[#8B9DBB] uppercase tracking-wider">All Projects</span>
        </div>
      </header>

      <section className="max-w-[1100px] mx-auto px-6 pt-14 pb-10">
        <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4">All Projects</h1>
        <p className="text-[#8B9DBB] text-lg max-w-2xl font-light">
          Every product and case study — across health-tech, insurance, education, HR, and productivity.
        </p>
      </section>

      <section className="max-w-[1100px] mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 bg-[#0A1128] border border-white/5 rounded-2xl animate-pulse" />)}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-[#8B9DBB] text-sm">No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p, i) => {
              const Icon = iconMap[p.iconName] || FolderOpen;
              return (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                  onClick={() => navigate(`/project/${p.id}`)}
                  className="group text-left bg-[#0A1128] border border-white/5 rounded-2xl p-6 hover:border-white/15 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center border" style={{ backgroundColor: `${p.hex}1A`, borderColor: `${p.hex}33` }}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-[#8B9DBB] group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="text-base font-medium text-white mb-2">{p.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: `${p.hex}1A`, color: p.hex }}>{p.category}</span>
                  <p className="text-[#8B9DBB] text-sm leading-relaxed mt-3 line-clamp-3">{p.overview}</p>
                </motion.button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
