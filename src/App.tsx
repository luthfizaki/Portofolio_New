import { useRef, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentProvider } from "./context/ContentContext";

import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ProcessSection } from "./components/ProcessSection";
import { TestimonialSection } from "./components/TestimonialSection";
import { SkillsSection } from "./components/SkillsSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

// Lazy-load CMS and project detail/index pages
const CMSApp = lazy(() => import("../cms/components/CMSApp").then(m => ({ default: m.CMSApp })));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage").then(m => ({ default: m.ProjectDetailPage })));
const ProjectsIndexPage = lazy(() => import("./pages/ProjectsIndexPage").then(m => ({ default: m.ProjectsIndexPage })));

function PortfolioPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#060A14] overflow-x-hidden glass-texture font-sans selection:bg-[#2B7FFF] selection:text-white"
    >
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ProcessSection />
      <TestimonialSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <Suspense fallback={<div className="min-h-screen bg-[#060A14] flex items-center justify-center"><div className="text-[#2B7FFF] font-mono text-sm animate-pulse">Loading...</div></div>}>
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/projects" element={<ProjectsIndexPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/cms/*" element={<CMSApp />} />
          </Routes>
        </Suspense>
      </ContentProvider>
    </BrowserRouter>
  );
}
