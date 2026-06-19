import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────────

export interface HeroContent {
  role: string;
  yearsRange: string;
  experienceYears: string;
  firstName: string;
  lastName: string;
  tagline: string;
  taglineHighlight: string;
  sideTexts: { text: string }[];
  scrollIndicatorText: string;
  ctaText: string;
  ctaLink: string;
}

export interface AboutContent {
  sectionLabel: string;
  headline: { before: string; animatedWords: string[]; after: string };
  bio: string;
  location: string;
  availability: string;
  infoCards: { id: string; icon: string; title: string; description: string; hoverColor: string }[];
}

export interface ExperienceEntry {
  id: string;
  year: string;
  company: string;
  role: string;
  date: string;
  location: string;
  description: string;
  icon: string;
}

export interface ExperienceContent {
  sectionLabel: string;
  headline: string;
  headlineHighlight: string;
  description: string;
  experiences: ExperienceEntry[];
}

export interface CaseStudyStep {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

export interface CaseStudy {
  problem: string;
  solution: string;
  myRole: string;
  teamSize: number;
  timeline: string;
  platforms: string[];
  processSteps: CaseStudyStep[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  fullCategory: string;
  iconName: string;
  overview: string;
  contributions: string[];
  impact: string;
  tools: string[];
  hex: string;
  mockupType: string;
  featured: boolean;
  order: number;
  status: string;
  gallery?: string[];
  caseStudy?: CaseStudy;
}

export interface ProjectsContent {
  sectionLabel: string;
  headline: string;
  headlineHighlight: string;
  description: string;
  projectBadge: string;
  projects: Project[];
}

export interface ProcessStage {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

export interface ProcessContent {
  sectionLabel: string;
  headline: string;
  headlineHighlight: string;
  description: string;
  stages: ProcessStage[];
  aiWorkflow: {
    title: string;
    description: string;
    categories: { title: string; items: string[] }[];
  };
}

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string;
  company: string;
  initial: string;
  order: number;
}

export interface TestimonialsContent {
  sectionLabel: string;
  headline: string;
  headlineHighlight: string;
  description: string;
  testimonials: Testimonial[];
}

export interface SkillsContent {
  sectionLabel: string;
  headline: string;
  headlineHighlight: string;
  description: string;
  coreSkills: { name: string; icon: string }[];
  designTools: { name: string; iconType: string }[];
  aiToolkit: { name: string; icon: string }[];
  collaboration: { name: string; icon: string }[];
}

export interface ContactContent {
  sectionLabel: string;
  headline: string;
  headlineHighlight: string;
  description: string;
  contactCards: { id: string; type: string; label: string; value: string; href: string; icon: string; external?: boolean }[];
  formLabels: Record<string, string>;
  formPlaceholders: Record<string, string>;
  submitButtonText: string;
  privacyNotice: string;
}

export interface Settings {
  colors: Record<string, string>;
  personalInfo: Record<string, string>;
  navLinks: { label: string; id: string }[];
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
  footer: { tagline: string; copyright: string; availability: string };
  resumeUrl?: string;
  resumeName?: string;
}

interface ContentContextType {
  hero: HeroContent | null;
  about: AboutContent | null;
  experience: ExperienceContent | null;
  projects: ProjectsContent | null;
  process: ProcessContent | null;
  testimonials: TestimonialsContent | null;
  skills: SkillsContent | null;
  contact: ContactContent | null;
  settings: Settings | null;
  loading: boolean;
  refresh: () => void;
}

const ContentContext = createContext<ContentContextType>({
  hero: null, about: null, experience: null, projects: null,
  process: null, testimonials: null, skills: null, contact: null,
  settings: null, loading: true, refresh: () => {},
});

export const useContent = () => useContext(ContentContext);

// ─── Provider ────────────────────────────────────────────────────────────────────

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [experience, setExperience] = useState<ExperienceContent | null>(null);
  const [projects, setProjects] = useState<ProjectsContent | null>(null);
  const [process, setProcess] = useState<ProcessContent | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialsContent | null>(null);
  const [skills, setSkills] = useState<SkillsContent | null>(null);
  const [contact, setContact] = useState<ContactContent | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const sections = ["hero", "about", "experience", "projects", "process", "testimonials", "skills", "contact", "settings"];
      const results = await Promise.all(
        sections.map(async (s) => {
          try {
            const res = await fetch(`/api/content/${s}`);
            if (res.ok) return { section: s, data: await res.json() };
            return { section: s, data: null };
          } catch {
            return { section: s, data: null };
          }
        })
      );
      for (const { section, data } of results) {
        if (!data) continue;
        switch (section) {
          case "hero": setHero(data); break;
          case "about": setAbout(data); break;
          case "experience": setExperience(data); break;
          case "projects": setProjects(data); break;
          case "process": setProcess(data); break;
          case "testimonials": setTestimonials(data); break;
          case "skills": setSkills(data); break;
          case "contact": setContact(data); break;
          case "settings": setSettings(data); break;
        }
      }
    } catch (e) {
      console.warn("ContentContext: API unavailable, using defaults", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <ContentContext.Provider value={{ hero, about, experience, projects, process, testimonials, skills, contact, settings, loading, refresh: fetchAll }}>
      {children}
    </ContentContext.Provider>
  );
};
