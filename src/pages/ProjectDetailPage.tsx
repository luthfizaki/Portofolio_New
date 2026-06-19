import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, Clock, Monitor, ArrowUpRight, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { setProject(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060A14] text-white flex items-center justify-center">
        <div className="text-[#2B7FFF] font-mono text-sm animate-pulse">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#060A14] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-[#8B9DBB] font-mono text-sm">Project not found</p>
        <button onClick={() => navigate("/")} className="text-[#2B7FFF] text-sm hover:underline">Back to Portfolio</button>
      </div>
    );
  }

  const cs = project.caseStudy || {};

  return (
    <div className="min-h-screen bg-[#060A14] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#060A14]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[#8B9DBB] hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </button>
          <span className="font-mono text-xs text-[#8B9DBB] uppercase tracking-wider">{project.category}</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1100px] mx-auto px-6 pt-16 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.hex }} />
            <span className="text-xs font-mono text-[#8B9DBB] uppercase tracking-widest">{project.fullCategory}</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-display font-bold tracking-tight mb-6">{project.title}</h1>
          <p className="text-[#8B9DBB] text-lg lg:text-xl font-light leading-relaxed max-w-3xl">{project.overview}</p>
        </motion.div>
      </section>

      {/* Gallery */}
      {project.gallery?.length > 0 && (
        <section className="max-w-[1100px] mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery.map((url: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0A1128] ${i === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
              >
                <img
                  src={url}
                  alt={`${project.title} — visual ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-2xl pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Meta Grid */}
      {(cs.myRole || cs.teamSize || cs.timeline || cs.platforms?.length) && (
        <section className="max-w-[1100px] mx-auto px-6 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cs.myRole && (
              <div className="bg-[#0A1128] border border-white/5 rounded-2xl p-5">
                <Users className="w-5 h-5 text-[#8B9DBB] mb-2" />
                <span className="text-xs text-[#8B9DBB] font-mono uppercase tracking-wider block mb-1">My Role</span>
                <span className="text-sm text-white">{cs.myRole}</span>
              </div>
            )}
            {cs.teamSize && (
              <div className="bg-[#0A1128] border border-white/5 rounded-2xl p-5">
                <Users className="w-5 h-5 text-[#8B9DBB] mb-2" />
                <span className="text-xs text-[#8B9DBB] font-mono uppercase tracking-wider block mb-1">Team Size</span>
                <span className="text-sm text-white">{cs.teamSize} people</span>
              </div>
            )}
            {cs.timeline && (
              <div className="bg-[#0A1128] border border-white/5 rounded-2xl p-5">
                <Clock className="w-5 h-5 text-[#8B9DBB] mb-2" />
                <span className="text-xs text-[#8B9DBB] font-mono uppercase tracking-wider block mb-1">Timeline</span>
                <span className="text-sm text-white">{cs.timeline}</span>
              </div>
            )}
            {cs.platforms?.length > 0 && (
              <div className="bg-[#0A1128] border border-white/5 rounded-2xl p-5">
                <Monitor className="w-5 h-5 text-[#8B9DBB] mb-2" />
                <span className="text-xs text-[#8B9DBB] font-mono uppercase tracking-wider block mb-1">Platforms</span>
                <span className="text-sm text-white">{cs.platforms.join(", ")}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Problem & Solution */}
      {(cs.problem || cs.solution) && (
        <section className="max-w-[1100px] mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cs.problem && (
              <div className="bg-[#0A1128] border border-white/5 rounded-2xl p-8">
                <h2 className="text-lg font-medium mb-4" style={{ color: project.hex }}>The Problem</h2>
                <p className="text-[#8B9DBB] leading-relaxed">{cs.problem}</p>
              </div>
            )}
            {cs.solution && (
              <div className="bg-[#0A1128] border border-white/5 rounded-2xl p-8">
                <h2 className="text-lg font-medium mb-4" style={{ color: project.hex }}>The Solution</h2>
                <p className="text-[#8B9DBB] leading-relaxed">{cs.solution}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Process Steps */}
      {cs.processSteps?.length > 0 && (
        <section className="max-w-[1100px] mx-auto px-6 pb-16">
          <h2 className="text-2xl font-display font-bold mb-8">Design Process</h2>
          <div className="flex flex-col gap-6">
            {cs.processSteps.map((step: any, i: number) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0A1128] border border-white/5 rounded-2xl overflow-hidden"
              >
                {step.imageUrl && (
                  <div className="w-full h-64 bg-[#020617] overflow-hidden">
                    <img src={step.imageUrl} alt={step.title} className="w-full h-full object-cover opacity-80" />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full" style={{ backgroundColor: `${project.hex}1A`, color: project.hex, border: `1px solid ${project.hex}33` }}>
                      Step {i + 1}
                    </span>
                    <h3 className="text-lg font-medium">{step.title}</h3>
                  </div>
                  <p className="text-[#8B9DBB] leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Contributions */}
      {project.contributions?.length > 0 && (
        <section className="max-w-[1100px] mx-auto px-6 pb-16">
          <h2 className="text-2xl font-display font-bold mb-6">Key Contributions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.contributions.map((c: string, i: number) => (
              <div key={i} className="flex items-center gap-3 bg-[#0A1128] border border-white/5 rounded-xl p-4">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: project.hex }} />
                <span className="text-sm text-[#E0E7F1]">{c}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Impact & Tools */}
      <section className="max-w-[1100px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.impact && (
            <div className="bg-[#0A1128] border border-white/5 rounded-2xl p-8">
              <h2 className="text-lg font-medium mb-3" style={{ color: project.hex }}>Impact</h2>
              <p className="text-[#8B9DBB] leading-relaxed">{project.impact}</p>
            </div>
          )}
          {project.tools?.length > 0 && (
            <div className="bg-[#0A1128] border border-white/5 rounded-2xl p-8">
              <h2 className="text-lg font-medium mb-3" style={{ color: project.hex }}>Tools Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((t: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-[#E0E7F1]">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[#8B9DBB] hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </button>
          <span className="text-xs text-[#8B9DBB]/40 font-mono">&copy; 2025 Luthfi Arzaki</span>
        </div>
      </footer>
    </div>
  );
}
