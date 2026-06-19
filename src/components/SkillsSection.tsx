import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Sparkles, Package, PenTool, User, LayoutGrid, Search, 
  LayoutTemplate, Smartphone, MousePointer2, Share2, 
  CheckCircle2, Lightbulb, Code, Briefcase, Terminal, 
  Users, FileText, Zap, BarChart, RefreshCw, ChevronDown, ChevronUp,
  type LucideIcon
} from "lucide-react";
import { useContent } from "../context/ContentContext";

gsap.registerPlugin(ScrollTrigger);

// Icon mapping
const skillIconMap: Record<string, LucideIcon> = {
  Package, PenTool, User, LayoutGrid, Search, LayoutTemplate, Smartphone,
  MousePointer2, Share2, CheckCircle2, Lightbulb, Code, Terminal, Users, FileText, Zap, BarChart, RefreshCw, Briefcase,
};

const defaultCoreSkills = [
  { name: "Product Design", icon: Package },
  { name: "UI Design", icon: PenTool },
  { name: "UX Design", icon: User },
  { name: "Design Systems", icon: LayoutGrid },
  { name: "User Research", icon: Search },
  { name: "Wireframing", icon: LayoutTemplate },
  { name: "Prototyping", icon: Smartphone },
  { name: "Interaction Design", icon: MousePointer2 },
  { name: "Information Architecture", icon: Share2 },
  { name: "Usability Testing", icon: CheckCircle2 },
  { name: "Problem Solving", icon: Lightbulb },
  { name: "Frontend Collaboration", icon: Code }
];

const designTools = [
  { 
    name: "Figma", 
    icon: () => <svg viewBox="0 0 38 57" className="w-6 h-6"><path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#0acf83"/><path d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#1abcfe"/><path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#ff7262"/><path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#f24e1e"/><path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#a259ff"/></svg>
  },
  { 
    name: "FigJam", 
    icon: () => <svg viewBox="0 0 38 57" className="w-6 h-6"><path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#0acf83"/><path d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#1abcfe"/><path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#ff7262"/><path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#f24e1e"/><path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#a259ff"/></svg>
  },
  { 
    name: "Adobe Illustrator", 
    icon: () => <div className="w-8 h-8 bg-[#330000] text-[#FF9A00] font-bold text-[14px] flex items-center justify-center rounded">Ai</div>
  },
  { 
    name: "Adobe Photoshop", 
    icon: () => <div className="w-8 h-8 bg-[#001E36] text-[#31A8FF] font-bold text-[14px] flex items-center justify-center rounded">Ps</div>
  },
  { 
    name: "Jira", 
    icon: () => <div className="text-[#2684FF] text-2xl font-bold font-display tracking-tighter">~</div> // Placeholder
  },
  { 
    name: "Notion", 
    icon: () => <div className="w-8 h-8 bg-white text-black font-serif font-bold text-[18px] flex items-center justify-center rounded">N</div>
  },
  { 
    name: "Google Workspace", 
    icon: () => <div className="text-xl font-bold text-[#EA4335]">G</div>
  }
];

const aiToolkitDefault = [
  { name: "AI Research", icon: Search },
  { name: "Prompt Engineering", icon: Terminal },
  { name: "AI Ideation", icon: Lightbulb },
  { name: "UX Research Acceleration", icon: Users },
  { name: "Content Generation", icon: FileText },
  { name: "Workflow Automation", icon: Zap }
];

const collaborationDefault = [
  { name: "Product Teams", icon: Package },
  { name: "Developers", icon: Code },
  { name: "QA Teams", icon: CheckCircle2 },
  { name: "Stakeholders", icon: User },
  { name: "Business Teams", icon: BarChart },
  { name: "Agile Workflow", icon: RefreshCw }
];

const MobileAccordionItem = ({ 
  id, title, desc, icon: Icon, openId, toggle, children, isAi 
}: any) => {
  const isOpen = openId === id;
  return (
    <div className={`relative flex flex-col rounded-[24px] transition-colors duration-300 overflow-hidden ${
      isAi ? "bg-gradient-to-br from-[#0A1128] via-[#060A14] to-[#12082A]/80 border border-[#2B7FFF]/30" : "bg-[#060A14]/80 backdrop-blur-md border border-[#1E293B]"
    }`}>
      <button 
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left z-10"
      >
        <div className="flex items-center gap-4">
          <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0 ${isAi ? "bg-gradient-to-br from-[#2B7FFF]/20 to-[#5C32FF]/20 border border-[#2B7FFF]/40" : "bg-gradient-to-b from-[#1E293B] to-[#0A1128] border border-white/5"}`}>
            <Icon className={`w-6 h-6 ${isAi ? "text-white" : "text-[#2B7FFF]"}`} />
          </div>
          <div className="flex flex-col pr-4">
            <h3 className="text-[15px] font-semibold tracking-wider text-white uppercase">{title}</h3>
            <p className="text-[#8B9DBB] text-xs font-light leading-snug mt-1">{desc}</p>
          </div>
        </div>
        <div className="w-[38px] h-[38px] rounded-full border border-white/5 bg-[#060A14] flex items-center justify-center shrink-0 text-[#8B9DBB]">
           {isOpen ? <ChevronUp className="w-5 h-5 text-white/80" /> : <ChevronDown className="w-5 h-5 text-white/80" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 sm:p-6 pt-0">
               {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const SkillsSection = () => {
  const { skills: dynamicSkills } = useContent();

  // Merge dynamic data with defaults, mapping iconName to Lucide components
  const coreSkills = (dynamicSkills?.coreSkills || defaultCoreSkills).map((s: any) => ({
    ...s,
    icon: skillIconMap[s.icon] || s.icon || Package,
  }));
  const aiToolkit = (dynamicSkills?.aiToolkit || aiToolkitDefault).map((s: any) => ({
    ...s,
    icon: skillIconMap[s.icon] || s.icon || Search,
  }));
  const collaboration = (dynamicSkills?.collaboration || collaborationDefault).map((s: any) => ({
    ...s,
    icon: skillIconMap[s.icon] || s.icon || Package,
  }));

  const sectionRef = useRef<HTMLDivElement>(null);
  const [openSection, setOpenSection] = useState<string>("core");
  
  const toggleSection = (id: string) => {
    setOpenSection(prev => prev === id ? "" : id);
  };
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(".skill-header", 
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        }
      );

      // Section Cards Stagger
      gsap.fromTo(".skill-section-card", 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 75%",
          },
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1.2,
          ease: "back.out(1.1)",
        }
      );

      // Parallax graphic
      gsap.to(".parallax-graphic", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        y: (i, el) => (parseFloat(el.getAttribute('data-speed') || '1')) * -100,
        ease: "none"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#020617] text-white py-24 z-20 overflow-hidden" id="skills">
      
      {/* Ambient BG */}
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-[#2B7FFF]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-[#5C32FF]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Decorative Network in Header */}
      <div className="parallax-graphic absolute top-0 right-[-5%] w-[60%] h-[500px] pointer-events-none opacity-40 mix-blend-screen" data-speed="0.8">
        <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
           <path d="M 100 200 Q 300 100 500 250 T 800 100" stroke="#2B7FFF" strokeWidth="1" strokeOpacity="0.4" fill="none" strokeDasharray="4 4" />
           <path d="M 200 300 Q 400 400 600 200 T 800 350" stroke="#5C32FF" strokeWidth="1" strokeOpacity="0.3" fill="none" />
           {/* Nodes */}
           <circle cx="300" cy="150" r="15" fill="#0A1128" stroke="#2B7FFF" strokeWidth="1" />
           <circle cx="500" cy="250" r="20" fill="#0A1128" stroke="#5C32FF" strokeWidth="1" />
           <circle cx="650" cy="180" r="15" fill="#0A1128" stroke="#2B7FFF" strokeWidth="1" />
           <text x="295" y="154" fill="#2B7FFF" fontSize="12" fontFamily="sans-serif" opacity="0.8">F</text>
           <text x="492" y="254" fill="#5C32FF" fontSize="12" fontFamily="sans-serif" opacity="0.8">AI</text>
           <text x="643" y="184" fill="#2B7FFF" fontSize="12" fontFamily="sans-serif" opacity="0.8">U</text>
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 w-full">
        
        {/* Header Segment */}
        <div className="skill-header flex flex-col items-start gap-4 mb-20 lg:w-[65%] text-left">
          <div className="flex items-center gap-3">
            <span className="text-[#2B7FFF] font-mono text-sm tracking-widest uppercase">06. <span className="text-white/80">Skills & Tools</span></span>
            <div className="h-px w-12 bg-gradient-to-r from-[#2B7FFF] to-transparent" />
          </div>
          <h2 className="text-4xl lg:text-[56px] font-display font-medium tracking-tight leading-[1.1]">
            The tools, skills, and technologies<br className="hidden md:block"/>
            behind my <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B7FFF] to-[#5C32FF]">design process.</span>
          </h2>
          <p className="text-[#8B9DBB] font-light max-w-xl mt-2 leading-relaxed">
            Combining design expertise, product thinking, and AI-assisted workflows to create meaningful digital experiences.
          </p>
        </div>

        {/* Mobile Accordion */}
        <div className="flex md:hidden flex-col gap-3 w-full relative z-10 mb-8">
          <MobileAccordionItem
            id="core"
            title="CORE SKILLS"
            desc={<>My core expertise in product<br/>and experience design.</>}
            icon={Sparkles}
            openId={openSection}
            toggle={toggleSection}
          >
            <div className="grid grid-cols-2 gap-2 mt-2">
               {coreSkills.map((skill, i) => (
                 <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#020617]/50 border border-white/5 truncate">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2B7FFF] shrink-0" />
                    <span className="text-[11.5px] text-[#E0E7F1] font-light truncate">{skill.name}</span>
                 </div>
               ))}
            </div>
          </MobileAccordionItem>

          <MobileAccordionItem
            id="tools"
            title="DESIGN TOOLS"
            desc={<>The tools I use to design,<br/>collaborate, and deliver.</>}
            icon={Briefcase}
            openId={openSection}
            toggle={toggleSection}
          >
            <div className="grid grid-cols-2 gap-2 mt-2">
               {designTools.map((tool, i) => (
                 <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#020617]/50 border border-white/5 truncate">
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                       <tool.icon />
                    </div>
                    <span className="text-[11px] text-[#E0E7F1] font-light truncate">{tool.name}</span>
                 </div>
               ))}
            </div>
          </MobileAccordionItem>

          <MobileAccordionItem
            id="ai"
            title="AI TOOLKIT"
            desc={<>I leverage AI at every stage of the<br/>design process to move faster<br/>and create smarter.</>}
            icon={Sparkles}
            openId={openSection}
            toggle={toggleSection}
            isAi={true}
          >
            <div className="flex flex-col gap-3 mt-1">
               <div className="flex flex-wrap gap-2">
                  {aiToolkit.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#0A1128]/80 border border-[#2B7FFF]/30 align-middle">
                       <item.icon className="w-3 h-3 text-[#5C32FF] shrink-0" strokeWidth={1.5} />
                       <span className="text-[11px] text-white/90 font-light whitespace-nowrap">{item.name}</span>
                    </div>
                  ))}
               </div>
             </div>
          </MobileAccordionItem>

          <MobileAccordionItem
            id="collab"
            title="COLLABORATION"
            desc={<>Working closely with cross-functional<br/>teams to build impactful products.</>}
            icon={Users}
            openId={openSection}
            toggle={toggleSection}
          >
            <div className="grid grid-cols-2 gap-2 mt-2">
               {collaboration.map((item, i) => (
                 <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#020617]/50 border border-white/5 truncate">
                    <item.icon className="w-3.5 h-3.5 text-[#2B7FFF] shrink-0" strokeWidth={1.5} />
                    <span className="text-[11.5px] text-[#E0E7F1] font-light truncate">{item.name}</span>
                 </div>
               ))}
            </div>
          </MobileAccordionItem>
        </div>

        {/* Desktop Bento Grid */}
        <div className="skills-grid hidden md:grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
          
          {/* Core Skills */}
          <div className="skill-section-card relative bg-[#060A14]/80 backdrop-blur-md border border-[#1E293B] hover:border-[#2B7FFF]/40 rounded-3xl p-8 lg:p-10 transition-colors duration-500 flex flex-col gap-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#1E293B] to-[#0A1128] border border-white/5 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-[#2B7FFF]" />
              </div>
              <div className="flex flex-col gap-1">
                 <h3 className="text-xl font-medium tracking-wide text-white">CORE SKILLS</h3>
                 <p className="text-[#8B9DBB] text-sm font-light">My core expertise in product and experience design.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
               {coreSkills.map((skill, i) => (
                 <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-[#2B7FFF]/10 hover:border-[#2B7FFF]/30 transition-colors group">
                    <skill.icon className="w-4 h-4 text-[#8B9DBB] group-hover:text-[#2B7FFF] transition-colors" strokeWidth={1.5} />
                    <span className="text-[13px] text-[#E0E7F1] font-light">{skill.name}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Design Tools */}
          <div className="skill-section-card relative bg-[#060A14]/80 backdrop-blur-md border border-[#1E293B] hover:border-[#2B7FFF]/40 rounded-3xl p-8 lg:p-10 transition-colors duration-500 flex flex-col gap-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#1E293B] to-[#0A1128] border border-white/5 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-[#2B7FFF]" />
              </div>
              <div className="flex flex-col gap-1">
                 <h3 className="text-xl font-medium tracking-wide text-white">DESIGN TOOLS</h3>
                 <p className="text-[#8B9DBB] text-sm font-light">The tools I use to design, collaborate, and deliver.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
               {designTools.map((tool, i) => (
                 <div key={i} className="flex flex-col items-center justify-center gap-3 p-4 w-[110px] h-[110px] rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-[#0A1128] hover:border-[#2B7FFF]/30 transition-all duration-300 group">
                    <tool.icon />
                    <span className="text-[11px] text-[#8B9DBB] font-light text-center leading-tight group-hover:text-white transition-colors">{tool.name}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* AI Toolkit */}
          <div className="skill-section-card relative bg-gradient-to-br from-[#0A1128] via-[#060A14] to-[#12082A]/80 border border-[#2B7FFF]/30 hover:border-[#5C32FF]/50 rounded-3xl p-8 lg:p-10 transition-colors duration-500 flex flex-col gap-8 group/ai overflow-hidden">
            <div className="absolute top-0 right-0 w-[60%] h-full pointer-events-none opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxjaXJjbGUgY3g9IjgwJSIgY3k9IjUwJSIgcj0iMzAlIiBmaWxsPSJub25lIiBzdHJva2U9IiM1QzMyRkYiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] bg-no-repeat bg-right-top" />
            
            <div className="absolute right-[-10%] top-[-10%] w-[300px] h-[300px] bg-[#5C32FF]/20 blur-[100px] rounded-full group-hover/ai:bg-[#2B7FFF]/20 transition-colors duration-700" />

            <div className="relative z-10 flex flex-col gap-8 h-full">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2B7FFF]/20 to-[#5C32FF]/20 border border-[#2B7FFF]/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col gap-1">
                   <h3 className="text-xl font-medium tracking-wide text-white">AI TOOLKIT</h3>
                   <p className="text-[#8B9DBB] text-sm font-light max-w-sm">I leverage AI at every stage of the design process to move faster and create smarter.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                 {aiToolkit.map((item, i) => (
                   <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0A1128]/80 border border-[#2B7FFF]/30 group-hover/ai:border-[#5C32FF]/40 transition-colors text-white">
                      <item.icon className="w-4 h-4 text-[#5C32FF] group-hover/ai:text-[#2B7FFF]" strokeWidth={1.5} />
                      <span className="text-[13px] font-light">{item.name}</span>
                   </div>
                 ))}
              </div>

              <div className="mt-auto pt-4 border-t border-white/10">
                <p className="text-xs text-[#8B9DBB] font-light leading-relaxed">
                  AI helps me accelerate research, generate insights, explore design directions, improve content creation, and streamline repetitive tasks.
                </p>
              </div>
            </div>
          </div>

          {/* Collaboration */}
          <div className="skill-section-card relative bg-[#060A14]/80 backdrop-blur-md border border-[#1E293B] hover:border-[#2B7FFF]/40 rounded-3xl p-8 lg:p-10 transition-colors duration-500 overflow-hidden">
            <div className="flex items-start gap-5 mb-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#1E293B] to-[#0A1128] border border-white/5 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-[#2B7FFF]" />
              </div>
              <div className="flex flex-col gap-1">
                 <h3 className="text-xl font-medium tracking-wide text-white">COLLABORATION</h3>
                 <p className="text-[#8B9DBB] text-sm font-light">Working closely with cross-functional teams to build impactful products.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 relative z-10">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-3/5">
                 {collaboration.map((item, i) => (
                   <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <item.icon className="w-4 h-4 text-[#2B7FFF]" strokeWidth={1.5} />
                      <span className="text-[13px] text-[#E0E7F1] font-light">{item.name}</span>
                   </div>
                 ))}
               </div>

               {/* Orbital Graphic */}
               <div className="hidden md:flex flex-1 items-center justify-center relative min-h-[160px]">
                 {/* Concentric circles */}
                 <div className="absolute w-[160px] h-[160px] rounded-full border border-dashed border-white/10 animate-[spin_60s_linear_infinite]" />
                 <div className="absolute w-[100px] h-[100px] rounded-full border border-[#2B7FFF]/20" />
                 
                 {/* Center icon */}
                 <div className="w-14 h-14 bg-[#2B7FFF]/20 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(43,127,255,0.3)]">
                    <Users className="w-6 h-6 text-white" />
                 </div>

                 {/* Orbiting items */}
                 <div className="absolute top-[10%] left-[20%] w-6 h-6 bg-[#0A1128] border border-white/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-[#5C32FF]" />
                 </div>
                 <div className="absolute bottom-[20%] right-[10%] w-6 h-6 bg-[#0A1128] border border-white/10 rounded-full flex items-center justify-center">
                    <Package className="w-3 h-3 text-[#5C32FF]" />
                 </div>
                 <div className="absolute top-[30%] right-[10%] w-7 h-7 bg-[#0A1128] border border-white/10 rounded-full flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                 </div>
                 <div className="absolute bottom-[10%] left-[30%] w-7 h-7 bg-[#0A1128] border border-white/10 rounded-full flex items-center justify-center">
                    <BarChart className="w-4 h-4 text-white" />
                 </div>
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-16 w-full flex items-center justify-center gap-3">
           <Sparkles className="w-4 h-4 text-[#8B9DBB]" />
           <p className="text-sm font-light text-[#8B9DBB] tracking-wide text-center">
             I combine human-centered design with AI-powered workflows to deliver meaningful, scalable, and user-focused solutions.
           </p>
        </div>

      </div>
    </section>
  );
};