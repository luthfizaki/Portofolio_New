import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  ArrowUpRight, 
  Search, 
  ShieldCheck, 
  HeartPulse, 
  Briefcase, 
  BookOpen, 
  MessageSquare, 
  PenTool, 
  Sparkles,
  ArrowRight,
  X,
  Star,
  FolderOpen,
  type LucideIcon
} from "lucide-react";
import { useContent } from "../context/ContentContext";

gsap.registerPlugin(ScrollTrigger);

// Icon mapping from string names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  HeartPulse, ShieldCheck, Sparkles, Briefcase, BookOpen, MessageSquare, PenTool, Search, FolderOpen, Star,
};

const defaultProjects = [
  {
    id: "mymedix",
    title: "MyMedix SuperApp",
    category: "HealthTech",
    fullCategory: "HealthTech • Mobile Application",
    icon: HeartPulse,
    overview:
      "Designed a healthcare and wellness super application that combines health assessment, monitoring, and digital health services into a unified mobile experience.",
    contributions: [
      "End-to-end user journey design",
      "Health scanning experience",
      "Dashboard systems",
      "Design system development",
    ],
    impact: "Simplified healthcare interactions and improved operational workflows.",
    tools: ["Figma", "Design System"],
    color: "from-[#2B7FFF] to-[#1E3A8A]",
    accent: "bg-[#2B7FFF]",
    hex: "#2B7FFF",
    mockupType: "mobile-double",
  },
  {
    id: "e-hd",
    title: "e-HD Health Insurance Platform",
    category: "HealthTech",
    fullCategory: "HealthTech • Insurance",
    icon: ShieldCheck,
    overview:
      "Designed a digital health insurance ecosystem that streamlines claim processes and operational workflows for insurance providers and healthcare services.",
    contributions: [
      "Insurance claim workflows",
      "Enterprise dashboards",
      "Healthcare provider interfaces",
      "High-fidelity UI concepts",
    ],
    impact: "Improved operational visibility and workflow efficiency.",
    tools: ["Figma", "FigJam"],
    color: "from-[#10B981] to-[#047857]",
    accent: "bg-[#10B981]",
    hex: "#10B981",
    mockupType: "desktop-mobile",
  },
  {
    id: "flexa",
    title: "FLEXA Insurance Platform",
    category: "Insurance",
    fullCategory: "Insurance • Gamification",
    icon: Sparkles,
    overview:
      "Designed a Gen Z-focused insurance purchasing experience with customizable coverage, rewards, missions, and affiliate systems.",
    contributions: [
      "Mobile-first experience",
      "Gamification design",
      "Insurance customization workflows",
      "Affiliate experience",
    ],
    impact: "Increased user engagement and product accessibility.",
    tools: ["Figma", "Design System"],
    color: "from-[#8B5CF6] to-[#4C1D95]",
    accent: "bg-[#8B5CF6]",
    hex: "#8B5CF6",
    mockupType: "mobile-double-purple",
  },
  {
    id: "sentris",
    title: "Sentris Attendance",
    category: "HR Technology",
    fullCategory: "HR Technology",
    icon: Briefcase,
    overview:
      "Designed an employee attendance platform focused on efficiency and operational usability.",
    contributions: [
      "Attendance workflows",
      "Leave management",
      "Mobile-first experience",
      "WFH request system",
    ],
    impact: "Improved employee operational efficiency.",
    tools: ["Figma"],
    color: "from-[#F59E0B] to-[#B45309]",
    accent: "bg-[#059669]", // Adjusting accent based on image (greenish)
    hex: "#059669",
    mockupType: "mobile-cards",
  },
  {
    id: "lms",
    title: "LMS Improvement",
    category: "Education Tech",
    fullCategory: "Education Technology",
    icon: BookOpen,
    overview:
      "Conducted UX research and redesigned critical user journeys to improve learning experiences.",
    contributions: [
      "UX Research",
      "Information Architecture",
      "Navigation Redesign",
      "Usability Improvements",
    ],
    impact: "Enhanced learning accessibility and usability.",
    tools: ["Figma", "UX Research"],
    color: "from-[#EC4899] to-[#BE185D]",
    accent: "bg-[#D97706]", // yellowish in image
    hex: "#D97706",
    mockupType: "desktop-half",
  },
  {
    id: "student-complaint",
    title: "Student Complaint Service Platform",
    category: "Education",
    fullCategory: "Education Platform",
    icon: MessageSquare,
    overview:
      "Designed a digital complaint service platform for university students.",
    contributions: [
      "Complaint Submission Workflow",
      "UI Redesign",
      "Responsive Design",
      "User Experience Optimization",
    ],
    impact: "Improved transparency and student satisfaction.",
    tools: ["Figma"],
    color: "from-[#14B8A6] to-[#0F766E]",
    accent: "bg-[#7C3AED]", // purple in image
    hex: "#7C3AED",
    mockupType: "desktop-slant",
  },
  {
    id: "notelt",
    title: "Notelt Mobile App",
    category: "Productivity",
    fullCategory: "Productivity Application",
    icon: PenTool,
    overview:
      "Designed a mobile note-taking application focused on usability and information management.",
    contributions: [
      "Note Management Workflow",
      "Mobile-first Design",
      "Digital Payment Integration",
      "Accessibility Improvements",
    ],
    impact: "Created a more intuitive productivity experience.",
    tools: ["Figma"],
    color: "from-[#6366F1] to-[#4338CA]",
    accent: "bg-[#2563EB]", // blueish in image
    hex: "#2563EB",
    mockupType: "mobile-half",
  },
];

const Mockup = ({ type }: { type: string }) => {
  if (type.includes("desktop")) {
    return (
      <div className="absolute right-0 bottom-0 w-[85%] h-[65%] bg-[#0A1128] border border-white/10 rounded-tl-xl shadow-2xl flex flex-col overflow-hidden">
        <div className="h-4 bg-[#1E293B] border-b border-white/5 flex items-center px-2 gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]/50" />
           <div className="w-1.5 h-1.5 rounded-full bg-[#eab308]/50" />
           <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]/50" />
        </div>
        <div className="flex-1 p-2 flex gap-2">
           <div className="w-1/4 h-full bg-white/5 rounded-md" />
           <div className="flex-1 flex flex-col gap-2">
             <div className="h-8 bg-white/5 rounded-md" />
             <div className="flex-1 bg-white/5 rounded-md" />
           </div>
        </div>
      </div>
    );
  }
  
  if (type.includes("mobile")) {
    return (
      <div className="absolute right-4 bottom-[-20%] w-[45%] aspect-[1/2] bg-[#0A1128] border-2 border-[#1E293B] rounded-[1.5rem] shadow-2xl flex flex-col overflow-hidden transform rotate-[-5deg]">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 h-3 bg-[#1E293B] rounded-full z-10" />
        <div className="flex-1 mt-6 p-2 flex flex-col gap-2">
           <div className="h-10 bg-white/5 rounded-[0.5rem]" />
           <div className="flex-1 bg-white/5 rounded-[0.5rem]" />
        </div>
        {type.includes("double") && (
          <div className="absolute right-[-60%] bottom-[10%] w-full aspect-[1/2] bg-[#0F172A] border-2 border-[#1E293B] rounded-[1.5rem] shadow-2xl flex flex-col overflow-hidden transform rotate-[10deg] opacity-80 decoration-white/5">
             <div className="flex-1 mt-8 p-2 flex flex-col gap-2">
               <div className="h-1/3 bg-white/10 rounded-[0.5rem]" />
               <div className="flex-1 bg-white/5 rounded-[0.5rem]" />
             </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export const ProjectsSection = () => {
  const navigate = useNavigate();
  const { projects: dynamicProjects } = useContent();
  
  // Merge dynamic data with default projects (icon mapping from iconName)
  const projects = (dynamicProjects?.projects || defaultProjects).map((p: any) => ({
    ...p,
    icon: iconMap[p.iconName] || p.icon || FolderOpen,
  }));

  const [activeProject, setActiveProject] = useState<any>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return null;
    }
    return projects[0];
  });
  const previewRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleProjectClick = (project: any) => {
    setActiveProject(project);
    setHasInteracted(true);
  };

  // Staggered GSAP fade-in animation
  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.project-card');

    gsap.fromTo(
      cards,
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === gridRef.current) t.kill();
      });
    };
  }, []);

  // Auto-scroll to preview when a new project is selected by user
  useEffect(() => {
    if (activeProject && previewRef.current && hasInteracted) {
      // Use a slight timeout to allow the layout to calculate rendering 
      const timer = setTimeout(() => {
        if (window.innerWidth >= 768) {
          const topOfPreview = previewRef.current?.getBoundingClientRect().top ?? 0;
          const scrollPosition = topOfPreview + window.scrollY - 100; // Offset for header/nav
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeProject, hasInteracted]);

  return (
    <section className="relative w-full bg-[#020617] text-white py-16 md:py-24 z-20" id="projects">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#2B7FFF]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#8B5CF6]/5 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative z-10" ref={gridRef}>
        
        {/* MOBILE HEADER */}
        <div className="flex md:hidden flex-col gap-4 mb-6 relative z-10 text-left">
          <div className="flex items-center gap-4">
            <span className="text-[#2B7FFF] font-mono text-[10px] sm:text-[11px] tracking-[0.15em] uppercase font-bold">
              03. FEATURED PROJECTS
            </span>
            <div className="h-px w-8 bg-[#2B7FFF]/30" />
          </div>
          <h2 className="text-[28px] sm:text-[32px] font-medium tracking-tight text-white leading-[1.1] text-left">
            Selected products and <br/>
            experiences that transformed <br/>
            ideas into <span className="text-[#2B7FFF]">impactful digital solutions.</span>
          </h2>
          <p className="text-[#8B9DBB] text-sm leading-[1.6] mt-1 text-left">
            A curated collection of digital products spanning health-tech, insurance, enterprise systems, productivity tools, and mobile applications.
          </p>
          <div className="w-[200px] flex items-center gap-4 bg-[#0A1128]/80 border border-white/5 rounded-[20px] px-4 py-3 mt-4 shadow-lg backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-[#1E3A8A]/40 border border-[#2B7FFF]/20 flex items-center justify-center shrink-0">
               <Star className="w-5 h-5 text-[#2B7FFF] fill-[#2B7FFF]" />
            </div>
            <div className="flex flex-col">
               <span className="text-white font-semibold text-[15px] leading-tight mb-0.5">7+</span>
               <span className="text-[#8B9DBB] text-[11px] leading-tight">Projects Completed</span>
            </div>
          </div>
        </div>

        {/* DESKTOP HEADER */}
        <div className="hidden md:flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 lg:mb-10 gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-[#2B7FFF] font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium">
                03. Featured Projects
              </span>
              <div className="h-px w-16 bg-gradient-to-r from-[#2B7FFF]/50 to-transparent" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.15]">
              Selected products and experiences that transformed ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B7FFF] to-[#A8C7FA]">impactful digital solutions.</span>
            </h2>
          </div>
          
          <div className="flex flex-col items-start xl:items-end gap-6 max-w-sm">
            <p className="text-[#8B9DBB] leading-[1.6] text-sm lg:text-base text-left xl:text-right">
              A curated collection of digital products spanning health-tech, insurance, enterprise systems, productivity tools, and mobile applications.
            </p>
            <div className="flex items-center gap-3 bg-[#0A1128]/80 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm -ml-2 xl:ml-0">
               <div className="w-8 h-8 rounded-full bg-[#2B7FFF]/20 flex items-center justify-center">
                 <Star className="w-4 h-4 text-[#2B7FFF] fill-[#2B7FFF]" />
               </div>
               <div>
                 <p className="text-white font-medium text-sm">7+</p>
                 <p className="text-[#8B9DBB] text-xs">Projects Completed</p>
               </div>
            </div>
          </div>
        </div>

        {/* MOBILE PROJECTS LIST */}
        <div className="flex md:hidden flex-col gap-2.5 mb-8 w-full z-10 relative">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <button
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="project-card w-full relative h-[94px] bg-[#0A1128]/60 border border-white/5 hover:border-white/10 rounded-[18px] flex items-center p-3 overflow-hidden text-left transition-colors active:bg-white/5"
              >
                 {/* Icon */}
                 <div className="w-[44px] h-[44px] rounded-[14px] bg-[#020617] border border-white/5 flex items-center justify-center shrink-0 z-10 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                    <Icon className="w-5 h-5 text-white/90" />
                 </div>

                 {/* Text Content */}
                 <div className="ml-3 sm:ml-4 flex flex-col gap-1.5 flex-1 z-10 max-w-[45%]">
                    <h4 className="text-[14px] sm:text-[15px] font-semibold text-white leading-tight truncate">
                       {project.title}
                    </h4>
                    <span 
                      className="inline-flex items-center justify-center px-1.5 py-[2px] rounded text-[8px] sm:text-[9px] font-mono w-max tracking-wide border border-transparent"
                      style={{ backgroundColor: `${project.hex}25`, color: project.hex }}
                    >
                      {project.category}
                    </span>
                 </div>

                 {/* CSS Mockup Representation */}
                 <div className="absolute right-[52px] top-1/2 -translate-y-1/2 w-[100px] rounded-[10px] overflow-hidden border border-white/10 z-0 h-[70px] shadow-lg" 
                      style={{ background: `linear-gradient(135deg, #0A1128 0%, ${project.hex}35 100%)` }}>
                    <div className="absolute inset-0 opacity-60">
                       <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
                          <span className="text-[6px] font-bold text-white tracking-wide truncate max-w-[60%]">{project.title.substring(0, 10)}</span>
                          <div className="w-2.5 h-2.5 rounded-full border border-white/30 flex items-center justify-center bg-[#020617]/50">
                             <div className="w-[2px] h-[2px] bg-white rounded-full"/>
                          </div>
                       </div>
                       <div className="absolute top-[22px] left-2 w-3/4 h-[2px] bg-white/20 rounded-full" />
                       <div className="absolute top-[28px] left-2 w-1/2 h-[2px] bg-white/10 rounded-full" />
                       
                       <div className="absolute top-[38px] left-2 right-2 flex gap-1.5">
                          <div className="flex-1 h-6 bg-gradient-to-br from-[#020617]/50 to-transparent rounded-[4px] border border-white/5" />
                          <div className="w-[30%] h-6 bg-white/5 rounded-[4px] border border-white/5" />
                       </div>
                    </div>
                    {/* Floating Mobile Element for mobile apps */}
                    {project.mockupType.includes('mobile') && (
                      <div className="absolute -bottom-2 right-[-2px] w-[35px] h-[55px] bg-[#020617] rounded-[6px] border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex flex-col p-[3px] rotate-[-8deg]">
                         <div className="w-1/3 h-[1px] bg-white/20 self-center rounded-full mb-1" />
                         <div className="w-full h-5 bg-gradient-to-b from-[#1E293B] to-transparent rounded-[2px] border border-white/5 mb-1" />
                         <div className="w-full h-[2px] bg-white/10 rounded-full" />
                      </div>
                    )}
                 </div>

                 {/* Right Side: Number & Arrow */}
                 <div className="absolute right-4 top-0 bottom-0 py-4 flex flex-col justify-between items-end z-10 w-8">
                    <span className="text-[#8B9DBB]/80 font-mono text-[11px] font-semibold leading-none">
                      0{index + 1}
                    </span>
                    <div className="w-[24px] h-[24px] rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/70 shadow-sm">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                 </div>
              </button>
            )
          })}
          
          {/* View All Projects Button (Mobile Only) */}
          <button className="project-card w-full h-[56px] bg-[#0A1128]/40 border border-[#2B7FFF]/20 rounded-[18px] flex items-center justify-between px-5 py-2 mt-2 active:scale-[0.98] transition-transform shadow-[inset_0_0_15px_rgba(43,127,255,0.05),_0_4px_10px_rgba(0,0,0,0.2)]">
             <span className="text-[#2B7FFF] font-mono text-[11px] uppercase tracking-[0.2em] font-medium">
                View All Projects
             </span>
             <div className="w-[36px] h-[36px] rounded-[10px] bg-[#2B7FFF] flex items-center justify-center shadow-[0_2px_10px_rgba(43,127,255,0.4)]">
                <ArrowUpRight className="w-[18px] h-[18px] text-white" />
             </div>
          </button>
        </div>

        {/* DESKTOP BENTO GRID */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4 mb-8">
          
          {/* Projects List */}
          {projects.map((project, index) => {
            const isActive = activeProject?.id === project.id;
            const Icon = project.icon;
            
            return (
              <button
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className={`project-card group relative text-left rounded-[1.5rem] lg:rounded-[2rem] border transition-all duration-300 overflow-hidden flex flex-col h-[180px] w-full
                  ${isActive 
                    ? 'bg-[#0A1128]/90 ring-1' 
                    : 'bg-[#050B14]/60 border-white/10 hover:bg-[#0A1128]/60 hover:border-white/20'
                  } backdrop-blur-sm`}
                style={isActive ? {
                  borderColor: `${project.hex}80`,
                  boxShadow: `0 0 30px ${project.hex}26`,
                  '--tw-ring-color': `${project.hex}33`,
                } as React.CSSProperties : {}}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(to bottom right, ${project.hex}1A, transparent)` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                )}
                
                <div className="p-4 lg:p-5 flex justify-between w-full relative z-20">
                   <div className="flex gap-2 lg:gap-3">
                     <div 
                        className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center border`}
                        style={{ backgroundColor: `${project.hex}1A`, borderColor: `${project.hex}33` }}
                     >
                        <Icon className="w-4 h-4 text-white" />
                     </div>
                     <div>
                       <h4 className="text-sm font-medium text-white mb-0.5 pr-4 leading-tight group-hover:text-white transition-colors">
                         {project.title}
                       </h4>
                       <span 
                         className="inline-block px-2 py-0.5 rounded-full border text-[9px] font-mono mt-0.5"
                         style={{ backgroundColor: `${project.hex}1A`, borderColor: `${project.hex}33`, color: project.hex }}
                       >
                         {project.category}
                       </span>
                     </div>
                   </div>
                   <span className="text-white/20 font-mono text-xs font-medium shrink-0">
                     0{index + 1}
                   </span>
                </div>

                <div 
                  className="absolute bottom-4 left-4 lg:bottom-5 lg:left-5 z-20 w-7 h-7 rounded-full border flex items-center justify-center transition-colors shadow-sm"
                  style={isActive 
                    ? { backgroundColor: project.hex, borderColor: project.hex } 
                    : { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }
                  }
                >
                  <ArrowRight className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-black' : 'text-white/60 group-hover:text-white'}`} />
                </div>

                <Mockup type={project.mockupType} />
              </button>
            )
          })}
          
          {/* More Projects Slot */}
          <div className="project-card group relative rounded-[1.5rem] lg:rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-white/30 hover:bg-[#0A1128]/40 h-[180px] w-full backdrop-blur-md cursor-pointer">
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mb-2 bg-white/5 group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-300">
               <Search className="w-4 h-4 text-white/30 group-hover:text-white/70" />
             </div>
             <span className="text-xs font-medium text-white/50 group-hover:text-white/80 transition-colors">More projects<br/>coming soon</span>
          </div>
        </div>

        {/* DYNAMIC PROJECT PREVIEW AREA (DESKTOP) */}
        <AnimatePresence mode="popLayout">
          {activeProject && (
            <motion.div
              ref={previewRef}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full bg-[#0A1128]/60 border rounded-[2rem] backdrop-blur-2xl hidden md:flex col-span-full mt-4 scroll-m-24"
              style={{ borderColor: `${activeProject.hex}33`, boxShadow: `0 30px 100px ${activeProject.hex}1A` }}
            >
              <button 
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-6 z-30 w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col lg:flex-row w-full min-h-[400px]">
                {/* Content Side */}
                <div className="w-full lg:w-[45%] p-6 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span 
                      className="font-mono text-xs font-semibold px-2 py-1 rounded border"
                      style={{ backgroundColor: `${activeProject.hex}1A`, borderColor: `${activeProject.hex}33`, color: activeProject.hex }}
                    >
                      {(projects.findIndex(p => p.id === activeProject.id) + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[#8B9DBB] text-[10px] sm:text-xs font-mono tracking-widest uppercase">
                      {activeProject.fullCategory}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl xl:text-4xl font-medium tracking-tight text-white mb-4">
                    {activeProject.title}
                  </h3>
                  
                  <p className="text-[#8B9DBB] leading-[1.6] text-sm mb-6 max-w-lg">
                    {activeProject.overview}
                  </p>

                  <button
                    onClick={() => navigate(`/project/${activeProject.id}`)}
                    className="group/cta self-start flex items-center gap-2 mb-8 pl-5 pr-4 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:shadow-lg active:scale-[0.97]"
                    style={{ backgroundColor: activeProject.hex, boxShadow: `0 8px 24px ${activeProject.hex}33` }}
                  >
                    View Full Case Study
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    {/* Key Contributions */}
                    <div>
                      <h4 
                        className="flex items-center text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-3"
                        style={{ color: activeProject.hex }}
                      >
                        <PenTool className="w-3.5 h-3.5 mr-2" />
                        Key Contributions
                      </h4>
                      <ul className="flex flex-col gap-2">
                        {activeProject.contributions.map((item, i) => (
                           <li key={i} className="flex items-start gap-2 text-[#8B9DBB] text-xs">
                             <div className="w-3 h-3 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${activeProject.hex}1A` }}>
                               <div className="w-1 h-1 rounded-full" style={{ backgroundColor: activeProject.hex }} />
                             </div>
                             <span className="leading-snug">{item}</span>
                           </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-6">
                      {/* Impact */}
                      <div>
                        <h4 
                          className="flex items-center text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-3"
                          style={{ color: activeProject.hex }}
                        >
                          <HeartPulse className="w-3.5 h-3.5 mr-2" />
                          Impact
                        </h4>
                        <p className="text-white/80 leading-relaxed font-medium text-xs md:text-sm">
                          {activeProject.impact}
                        </p>
                      </div>
                      
                      {/* Tools */}
                      <div>
                        <h4 
                          className="flex items-center text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-3"
                          style={{ color: activeProject.hex }}
                        >
                          <Briefcase className="w-3.5 h-3.5 mr-2" />
                          Tools Used
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProject.tools.map((tool, i) => (
                             <span key={i} className="flex items-center text-[10px] font-medium px-2 py-1 rounded bg-[#0A1128] border border-white/5 text-[#8B9DBB]">
                               {tool}
                             </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mockup Side */}
                <div className="w-full lg:w-[55%] relative flex items-center justify-center p-6 lg:p-10 overflow-hidden bg-[#0A1128]/30 rounded-b-[2rem] lg:rounded-bl-none lg:rounded-br-[2rem] lg:rounded-tr-[2rem]">
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gradient-to-br ${activeProject.color} opacity-20 blur-[120px] rounded-full`} />
                  
                  {/* Detailed Desktop/Tablet Mockup Preview (CSS Only) */}
                  <div className="relative w-full max-w-[600px] aspect-[16/10] bg-[#0A1128] rounded-[1rem] border border-[#1E293B] shadow-2xl flex flex-col overflow-hidden transform scale-100 lg:scale-[1.05] 2xl:scale-110">
                     <div className="h-6 sm:h-8 bg-[#1E293B] flex items-center px-4 gap-2 border-b border-black">
                        <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                        <div className="w-2 h-2 rounded-full bg-[#eab308]" />
                        <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                     </div>
                     <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-white/10" />
                             <div className="w-24 h-4 bg-white/10 rounded-full" />
                          </div>
                          <div className="w-16 h-6 bg-[#2B7FFF]/20 rounded-md" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                           <div className="col-span-2 h-32 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex p-4">
                             <div className="w-16 h-16 rounded-full border-4 border-[#2B7FFF]/30 border-t-[#2B7FFF] flex items-center justify-center">
                               <div className="w-8 h-8 rounded-full bg-[#2B7FFF]/20" />
                             </div>
                             <div className="ml-6 flex flex-col justify-center gap-3 flex-1">
                                <div className="w-full h-3 bg-white/10 rounded-full" />
                                <div className="w-2/3 h-3 bg-white/10 rounded-full" />
                             </div>
                           </div>
                           <div className="col-span-1 h-32 rounded-xl bg-white/5 flex flex-col p-4 justify-between gap-2">
                             <div className="w-1/2 h-4 bg-white/10 rounded" />
                             <div className="w-full flex-1 bg-white/5 border border-white/5 rounded" />
                           </div>
                        </div>
                        <div className="flex gap-4 flex-1">
                          <div className="w-1/4 h-full bg-white/5 rounded-xl border border-white/5" />
                          <div className="flex-1 h-full bg-white/5 rounded-xl border border-white/5" />
                        </div>
                     </div>
                  </div>

                  {/* Overlaid Mobile Mockup */}
                  <div className="absolute right-8 sm:right-16 md:right-24 bottom-[-10%] sm:bottom-0 w-[25%] sm:w-[22%] max-w-[160px] aspect-[1/2] bg-[#020617] rounded-[2rem] border-4 sm:border-8 border-[#334155] shadow-2xl overflow-hidden flex flex-col">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 h-3 sm:h-4 bg-[#334155] rounded-full z-10" />
                    <div className="h-full w-full bg-gradient-to-b from-[#0A1128] to-[#020617] pt-10 px-3 flex flex-col pb-4 gap-3">
                        <div className="w-full h-8 bg-[#2B7FFF]/10 rounded-md border border-[#2B7FFF]/20" />
                        <div className="w-full h-24 bg-white/5 rounded-md" />
                        <div className="grid grid-cols-2 gap-2 mt-auto">
                          <div className="h-10 bg-white/5 rounded-md" />
                          <div className="h-10 bg-white/5 rounded-md" />
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE BOTTOM SHEET / POPUP */}
        <AnimatePresence>
          {activeProject && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveProject(null)}
                className="fixed inset-0 z-40 bg-[#020617]/70 backdrop-blur-md md:hidden touch-none"
              />
              
              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 w-full max-h-[88vh] bg-[#0A1128] border-t border-white/10 rounded-t-[32px] z-50 md:hidden flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.6)]"
              >
                <div 
                  className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-t-[32px]" 
                  style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} 
                />
                
                {/* Header (Sticky) */}
                <div className="sticky top-0 bg-[#0A1128]/95 backdrop-blur z-20 rounded-t-[32px] border-b border-white/5">
                  <div className="w-full flex justify-center pt-3 pb-2 cursor-pointer" onClick={() => setActiveProject(null)}>
                     <div className="w-12 h-1.5 rounded-full bg-white/20" />
                  </div>
                  <div className="flex items-center justify-between px-6 pb-4 pt-1">
                    <div className="flex items-center gap-3">
                      <span 
                        className="font-mono text-xs font-semibold px-2 py-1 rounded border"
                        style={{ backgroundColor: `${activeProject.hex}1A`, borderColor: `${activeProject.hex}33`, color: activeProject.hex }}
                      >
                        {(projects.findIndex(p => p.id === activeProject.id) + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="text-[#8B9DBB] text-[10px] font-mono tracking-widest uppercase">
                        {activeProject.category}
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveProject(null)}
                      className="w-8 h-8 bg-white/5 active:bg-white/10 rounded-full flex items-center justify-center text-white/50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto w-full px-6 py-6 pb-24 relative">
                  <h3 className="text-[26px] font-semibold tracking-tight text-white mb-3 leading-tight">
                    {activeProject.title}
                  </h3>
                  
                  <p className="text-[#8B9DBB] leading-[1.6] text-[14px] mb-8">
                    {activeProject.overview}
                  </p>

                  <div className="flex flex-col gap-8">
                    {/* Key Contributions */}
                    <div>
                      <h4 
                        className="flex items-center text-[11px] font-semibold tracking-widest uppercase mb-4"
                        style={{ color: activeProject.hex }}
                      >
                        <PenTool className="w-[14px] h-[14px] mr-2" />
                        Key Contributions
                      </h4>
                      <ul className="flex flex-col gap-3">
                        {activeProject.contributions.map((item, i) => (
                           <li key={i} className="flex items-start gap-2.5 text-white/80 text-[13px] leading-snug">
                             <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: activeProject.hex }} />
                             <span>{item}</span>
                           </li>
                        ))}
                      </ul>
                    </div>

                    {/* Impact */}
                    <div>
                      <h4 
                        className="flex items-center text-[11px] font-semibold tracking-widest uppercase mb-3"
                        style={{ color: activeProject.hex }}
                      >
                        <HeartPulse className="w-[14px] h-[14px] mr-2" />
                        Impact
                      </h4>
                      <div className="p-4 bg-[#020617]/50 rounded-2xl border border-white/5">
                        <p className="text-white/90 leading-relaxed font-medium text-[13px]">
                          {activeProject.impact}
                        </p>
                      </div>
                    </div>
                    
                    {/* Tools */}
                    <div>
                      <h4 
                        className="flex items-center text-[11px] font-semibold tracking-widest uppercase mb-3"
                        style={{ color: activeProject.hex }}
                      >
                        <Briefcase className="w-[14px] h-[14px] mr-2" />
                        Tools Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.tools.map((tool, i) => (
                           <span key={i} className="flex items-center text-[11px] font-medium px-3 py-1.5 rounded-lg bg-[#020617] border border-white/5 text-[#8B9DBB]">
                             {tool}
                           </span>
                        ))}
                      </div>
                    </div>

                    {/* View Full Case Study CTA */}
                    <button
                      onClick={() => navigate(`/project/${activeProject.id}`)}
                      className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl text-white font-semibold text-sm active:scale-[0.98] transition-transform"
                      style={{ backgroundColor: activeProject.hex, boxShadow: `0 8px 24px ${activeProject.hex}40` }}
                    >
                      View Full Case Study <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

