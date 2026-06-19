import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Clock, Monitor, CheckCircle, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    fetch(`/api/projects/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { setProject(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  // Sibling projects for prev/next navigation.
  useEffect(() => {
    fetch(`/api/projects`).then(res => (res.ok ? res.json() : [])).then(setAllProjects).catch(() => {});
  }, []);

  // SEO: reflect the open project in the tab title + social meta tags.
  useEffect(() => {
    if (!project) return;
    const prevTitle = document.title;
    document.title = `${project.title} — Luthfi Arzaki`;
    const setMeta = (key: string, attr: "name" | "property", value: string) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute("content", value);
    };
    const desc = project.overview || `${project.title} — case study by Luthfi Arzaki`;
    setMeta("description", "name", desc);
    setMeta("og:title", "property", `${project.title} — Luthfi Arzaki`);
    setMeta("og:description", "property", desc);
    setMeta("og:type", "property", "article");
    if (project.gallery?.[0]) setMeta("og:image", "property", project.gallery[0]);
    return () => { document.title = prevTitle; };
  }, [project]);

  // Keyboard controls for the gallery lightbox.
  useEffect(() => {
    if (lightbox === null) return;
    const total = project?.gallery?.length || 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowRight" && total) setLightbox((i) => ((i ?? 0) + 1) % total);
      else if (e.key === "ArrowLeft" && total) setLightbox((i) => ((i ?? 0) - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, project]);

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
  const currentIdx = allProjects.findIndex((p: any) => p.id === project.id);
  const prevProject = currentIdx > 0 ? allProjects[currentIdx - 1] : null;
  const nextProject = currentIdx >= 0 && currentIdx < allProjects.length - 1 ? allProjects[currentIdx + 1] : null;

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
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0A1128] cursor-zoom-in ${i === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
              >
                <img
                  src={url}
                  alt={`${project.title} — visual ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-2xl pointer-events-none" />
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
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

      {/* Prev / Next project navigation */}
      {(prevProject || nextProject) && (
        <section className="max-w-[1100px] mx-auto px-6 pb-16">
          <div className="grid grid-cols-2 gap-4">
            {prevProject ? (
              <button onClick={() => navigate(`/project/${prevProject.id}`)} className="group flex items-center gap-3 bg-[#0A1128] border border-white/5 rounded-2xl p-5 text-left hover:border-white/15 transition-all">
                <ChevronLeft className="w-5 h-5 text-[#8B9DBB] group-hover:-translate-x-0.5 transition-transform shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B9DBB]/60 block">Previous</span>
                  <span className="text-sm text-white truncate block">{prevProject.title}</span>
                </div>
              </button>
            ) : <div />}
            {nextProject ? (
              <button onClick={() => navigate(`/project/${nextProject.id}`)} className="group flex items-center justify-end gap-3 bg-[#0A1128] border border-white/5 rounded-2xl p-5 text-right hover:border-white/15 transition-all">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B9DBB]/60 block">Next</span>
                  <span className="text-sm text-white truncate block">{nextProject.title}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#8B9DBB] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            ) : <div />}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[#8B9DBB] hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </button>
          <span className="text-xs text-[#8B9DBB]/40 font-mono">&copy; 2025 Luthfi Arzaki</span>
        </div>
      </footer>

      {/* Gallery lightbox */}
      <AnimatePresence>
        {lightbox !== null && project.gallery?.[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button onClick={() => setLightbox(null)} className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            {project.gallery.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setLightbox(((lightbox ?? 0) - 1 + project.gallery.length) % project.gallery.length); }} className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setLightbox(((lightbox ?? 0) + 1) % project.gallery.length); }} className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              src={project.gallery[lightbox]}
              alt={`${project.title} — visual ${lightbox + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[92vw] max-h-[86vh] object-contain rounded-lg shadow-2xl"
            />
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-xs font-mono">{lightbox + 1} / {project.gallery.length}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
