import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, Briefcase, MessageSquare, Wrench, ArrowRight, Activity, ExternalLink } from "lucide-react";
import { getStats } from "./api";

interface Stats {
  projects: number;
  experiences: number;
  testimonials: number;
  skills: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, experiences: 0, testimonials: 0, skills: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Projects", value: stats.projects, icon: FolderOpen, color: "#2B7FFF", route: "/cms/projects" },
    { label: "Experiences", value: stats.experiences, icon: Briefcase, color: "#10B981", route: "/cms/experience" },
    { label: "Testimonials", value: stats.testimonials, icon: MessageSquare, color: "#8B5CF6", route: "/cms/testimonials" },
    { label: "Skills", value: stats.skills, icon: Wrench, color: "#F59E0B", route: "/cms/skills" },
  ];

  const quickLinks = [
    { label: "Edit Hero Section", route: "/cms/hero", icon: Activity },
    { label: "Edit About Section", route: "/cms/about", icon: Activity },
    { label: "Edit Process Steps", route: "/cms/process", icon: Activity },
    { label: "Contact Settings", route: "/cms/contact", icon: Activity },
    { label: "Appearance Settings", route: "/cms/settings", icon: Activity },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide">Dashboard</h1>
          <p className="text-[#8B9DBB] text-sm mt-1 font-light">Overview of your portfolio content</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2B7FFF]/10 border border-[#2B7FFF]/20 text-[#2B7FFF] text-sm hover:bg-[#2B7FFF]/20 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          View Live Portfolio
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <button
            key={card.label}
            onClick={() => navigate(card.route)}
            className="group bg-[#060A14]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 text-left hover:border-white/10 transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15`, border: `1px solid ${card.color}30` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <ArrowRight className="w-4 h-4 text-[#8B9DBB]/30 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="flex flex-col">
              {loading ? (
                <div className="w-8 h-8 bg-white/5 rounded-lg animate-pulse" />
              ) : (
                <span className="text-3xl font-semibold">{card.value}</span>
              )}
              <span className="text-[#8B9DBB] text-sm mt-1">{card.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-[#060A14]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map(link => (
            <button
              key={link.label}
              onClick={() => navigate(link.route)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#2B7FFF]/20 hover:bg-[#2B7FFF]/5 text-left text-sm text-[#8B9DBB] hover:text-white transition-all group"
            >
              <link.icon className="w-4 h-4 text-[#2B7FFF]/50 group-hover:text-[#2B7FFF]" />
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-[#2B7FFF]/5 to-[#5C32FF]/5 border border-[#2B7FFF]/10 rounded-2xl p-6">
        <h3 className="text-sm font-medium text-white mb-2">Getting Started</h3>
        <p className="text-[#8B9DBB] text-sm font-light leading-relaxed">
          Use the sidebar to navigate between sections. Each section can be edited independently.
          Changes are saved to the PostgreSQL-backed Node.js API and will be reflected on your live portfolio immediately.
          Projects have the most detail — you can add case studies with process steps for each project.
        </p>
      </div>
    </div>
  );
}
