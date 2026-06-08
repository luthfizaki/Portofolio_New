import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, PenTool, ClipboardCheck, Rocket, Sparkles, Target, Zap, Lightbulb, FileText, TrendingUp, MessageSquare, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    id: "01",
    title: "Research",
    description: <>Understanding users, business goals, and product challenges through stakeholder discussions, competitor analysis, and <span className="text-[#2B7FFF]">AI-assisted research</span>.</>,
    icon: Search
  },
  {
    id: "02",
    title: "Define",
    description: "Translating insights into clear problem statements, user flows, and product requirements.",
    icon: Target
  },
  {
    id: "03",
    title: "Design",
    description: "Creating wireframes, design systems, prototypes, and scalable interfaces focused on usability and consistency.",
    icon: PenTool
  },
  {
    id: "04",
    title: "Validate",
    description: "Testing concepts, gathering feedback, and refining experiences through iterative improvements.",
    icon: ClipboardCheck
  },
  {
    id: "05",
    title: "Deliver",
    description: "Collaborating with developers and stakeholders to ensure seamless implementation and product quality.",
    icon: Rocket
  }
];

export const ProcessSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Reveal header
      gsap.from(".process-header", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Desktop Cards stagger
      gsap.fromTo(".process-card-desktop", 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".process-cards-container",
            start: "top 75%",
          },
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: "back.out(1.2)",
        }
      );

      // Mobile Cards stagger
      gsap.fromTo(".process-card-mobile", 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".process-mobile-container",
            start: "top 80%",
          },
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: "back.out(1.2)",
        }
      );

      // AI Card
      gsap.fromTo(".process-card-ai", 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".process-card-ai",
            start: "top 85%",
          },
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out"
        }
      );

      // Micro animation for horizontal line
      gsap.fromTo(".process-connecting-line", 
        { scaleX: 0 },
        { 
          scrollTrigger: {
            trigger: ".process-cards-container",
            start: "top 70%",
          },
          scaleX: 1, 
          duration: 1.5, 
          ease: "power2.inOut",
          transformOrigin: "left center" 
        }
      );

      // Parallax effect for background elements
      gsap.to(".parallax-bg", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        y: (i, el) => (parseFloat(el.getAttribute('data-speed') || '1')) * -100,
        ease: "none"
      });

      // AI card float

      gsap.to(".ai-card-icon", {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#020617] text-white py-24 z-20 overflow-hidden" id="process">
      
      {/* Ambient Blur Orbs */}
      <div className="parallax-bg absolute top-0 left-[-10%] w-[40vw] h-[40vw] bg-[#2B7FFF]/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" data-speed="1.2" />
      <div className="parallax-bg absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] bg-[#5C32FF]/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" data-speed="0.8" />
      <div className="parallax-bg absolute top-[40%] left-[20%] w-[30vw] h-[30vw] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none mix-blend-screen" data-speed="1.5" />

      {/* Floating Particles */}
      <div className="parallax-bg absolute top-[15%] left-[5%] w-1.5 h-1.5 rounded-full bg-[#2B7FFF]/40 blur-[1px]" data-speed="2.5" />
      <div className="parallax-bg absolute top-[45%] left-[90%] w-2 h-2 rounded-full bg-[#5C32FF]/40 blur-[1px]" data-speed="0.8" />
      <div className="parallax-bg absolute top-[75%] left-[10%] w-1.5 h-1.5 rounded-full bg-white/20 blur-[1px]" data-speed="1.8" />
      <div className="parallax-bg absolute bottom-[20%] right-[15%] w-1.5 h-1.5 rounded-full bg-[#2B7FFF]/30 blur-[1px]" data-speed="1.3" />
      <div className="parallax-bg absolute top-[60%] right-[30%] w-1 h-1 rounded-full bg-white/30 blur-[0.5px]" data-speed="2.1" />

      {/* Network Background Graphic */}
      <div className="parallax-bg absolute top-0 right-0 w-1/2 h-[500px] pointer-events-none opacity-60" data-speed="0.5">
        <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
           <path d="M 0 200 Q 200 100 400 250 T 800 100" stroke="#2B7FFF" strokeWidth="1" strokeOpacity="0.3" fill="none" strokeDasharray="4 4" />
           <path d="M 100 300 Q 300 400 600 200 T 800 350" stroke="#5C32FF" strokeWidth="1" strokeOpacity="0.2" fill="none" />
           <circle cx="200" cy="150" r="4" fill="#2B7FFF" className="animate-pulse" />
           <circle cx="400" cy="250" r="6" fill="#2B7FFF" />
           <circle cx="400" cy="250" r="16" stroke="#2B7FFF" strokeOpacity="0.3" strokeWidth="1" />
           <circle cx="600" cy="200" r="3" fill="#5C32FF" />
           <circle cx="700" cy="150" r="4" fill="#2B7FFF" />
           
           <text x="180" y="130" fill="#2B7FFF" fontSize="12" fontFamily="monospace" opacity="0.7">Understand</text>
           <text x="420" y="280" fill="#2B7FFF" fontSize="12" fontFamily="monospace" opacity="0.7">Create</text>
           <text x="690" y="130" fill="#2B7FFF" fontSize="12" fontFamily="monospace" opacity="0.7">Explore</text>
           <text x="750" y="380" fill="#2B7FFF" fontSize="12" fontFamily="monospace" opacity="0.7">Deliver</text>
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="process-header flex flex-col gap-5 mb-24 lg:w-[60%]">
          <div className="flex items-center gap-4">
            <span className="text-[#2B7FFF] font-mono text-sm tracking-widest uppercase">04. Design Process</span>
            <div className="h-px w-16 bg-gradient-to-r from-[#2B7FFF] to-transparent" />
          </div>
          <h2 className="text-4xl lg:text-[56px] font-display font-medium tracking-tight leading-[1.1]">
            How I transform ideas <br className="hidden lg:block" />
            into <span className="text-[#2B7FFF]">meaningful</span> digital experiences.
          </h2>
          <p className="text-lg text-[#8B9DBB] font-light max-w-2xl mt-4 leading-relaxed">
            From understanding user needs to delivering scalable solutions, 
            my process combines research, strategy, design thinking, 
            and <span className="text-[#2B7FFF]">AI-assisted workflows</span> to create impactful digital products.
          </p>
        </div>

        {/* Process Cards Journey */}
        <div className="process-cards-container relative w-full mb-32 hidden lg:flex items-stretch justify-between gap-4">
          
          {/* Main Continuous Connecting Line behind cards */}
          <div className="absolute top-[102px] left-[5%] right-0 h-px bg-[#2B7FFF]/10 z-0 overflow-hidden">
             <div className="process-connecting-line absolute inset-0 bg-gradient-to-r from-transparent via-[#2B7FFF] to-[#2B7FFF] opacity-50" />
          </div>

          {stages.map((stage, i) => (
            <div key={stage.id} className="process-card-desktop group relative flex-1 flex flex-col bg-gradient-to-b from-[#060A14] to-[#0A1128]/50 border border-[#1E293B] hover:border-[#2B7FFF]/50 rounded-2xl p-8 pt-6 transition-all duration-500 overflow-hidden min-h-[380px]">
              
              {/* Subtle hover glow inside card */}
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#2B7FFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <span className="font-medium text-[#2B7FFF] text-base mb-8">{stage.id}</span>
              
              {/* Icon Container positioned on the line */}
              <div className="relative z-10 w-16 h-16 mx-auto mb-8 rounded-full bg-[#020617] border border-[#2B7FFF]/40 flex items-center justify-center group-hover:border-[#2B7FFF] group-hover:shadow-[0_0_20px_rgba(43,127,255,0.4)] transition-all duration-500">
                <div className="absolute -inset-1 rounded-full bg-[#2B7FFF]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <stage.icon className="w-6 h-6 text-[#2B7FFF] relative z-10" strokeWidth={1.5} />
                {/* Connector dots side to side of icon */}
                {i > 0 && <div className="absolute -left-6 top-1/2 w-1.5 h-1.5 -translate-y-1/2 rounded-full bg-[#2B7FFF]/50" />}
                {i < stages.length - 1 && <div className="absolute -right-6 top-1/2 w-1.5 h-1.5 -translate-y-1/2 rounded-full bg-[#2B7FFF]/50" />}
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                <h3 className="text-2xl font-medium tracking-wide text-white">{stage.title}</h3>
                <div className="text-[15px] text-[#8B9DBB] leading-relaxed font-light">
                  {stage.description}
                </div>
              </div>
            </div>
          ))}

          {/* Arrow at the end of the line */}
          <div className="absolute top-[102px] -right-4 -translate-y-1/2 text-[#2B7FFF]">
             <ArrowRight className="w-5 h-5 opacity-70" strokeWidth={1.5} />
          </div>
        </div>

        {/* Mobile Process Cards (Horizontal Slider) */}
        <div className="process-mobile-container flex lg:hidden w-[calc(100%+48px)] -ml-6 px-6 gap-4 mb-20 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {stages.map((stage, i) => (
             <div key={stage.id} className="process-card-mobile shrink-0 w-[85%] snap-center relative flex flex-col bg-gradient-to-b from-[#060A14] to-[#0A1128]/50 border border-[#1E293B] rounded-2xl p-6 transition-all duration-500 overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-full bg-[#020617] border border-[#2B7FFF]/40 flex items-center justify-center shrink-0">
                     <stage.icon className="w-5 h-5 text-[#2B7FFF]" strokeWidth={1.5} />
                   </div>
                   <div className="flex gap-3 items-center">
                     <span className="font-medium text-[#2B7FFF]">{stage.id}</span>
                     <h3 className="text-xl font-medium text-white">{stage.title}</h3>
                   </div>
                </div>
                <div className="text-[15px] text-[#8B9DBB] leading-relaxed font-light">
                  {stage.description}
                </div>
             </div>
          ))}
        </div>

        {/* AI Assisted Workflow Full Card */}
        <div className="process-card-ai w-full relative group rounded-[1.5rem] border border-[#1E293B] bg-gradient-to-b from-[#060A14] to-[#0A1128]/80 overflow-hidden p-8 lg:p-12 shadow-2xl">
           <div className="absolute -inset-1 bg-gradient-to-r from-[#2B7FFF]/10 to-[#5C32FF]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
           
           <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
             
             {/* Left Text Side */}
             <div className="flex flex-col lg:flex-row items-start gap-8 lg:w-[55%]">
                <div className="ai-card-icon w-20 h-20 rounded-2xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-[#2B7FFF]/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(43,127,255,0.15)] relative overflow-hidden group-hover:border-[#2B7FFF] transition-colors duration-500">
                  <div className="absolute inset-0 bg-[#2B7FFF]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Sparkles className="w-10 h-10 text-[#2B7FFF] relative z-10" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl lg:text-[28px] font-medium tracking-wide text-white">AI-Assisted Workflow</h3>
                  <p className="text-[#8B9DBB] font-light leading-relaxed text-[15px]">
                    I leverage AI tools throughout the design process to accelerate research, generate ideas, validate concepts, analyze user feedback, improve content creation, and enhance productivity while maintaining human-centered decision making.
                  </p>
                </div>
             </div>

             {/* Right Grid Side */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 lg:w-[45%] border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12 w-full">
                
                <div className="flex items-start gap-3 group/item">
                   <Search className="w-[18px] h-[18px] text-[#2B7FFF]/70 mt-0.5 group-hover/item:text-[#2B7FFF] transition-colors" strokeWidth={2} />
                   <span className="text-[14px] text-[#E0E7F1] leading-snug font-light">Research & Insights Acceleration</span>
                </div>

                <div className="flex items-start gap-3 group/item">
                   <Lightbulb className="w-[18px] h-[18px] text-[#2B7FFF]/70 mt-0.5 group-hover/item:text-[#2B7FFF] transition-colors" strokeWidth={2} />
                   <span className="text-[14px] text-[#E0E7F1] leading-snug font-light">AI-Powered<br/>Ideation</span>
                </div>

                <div className="flex items-start gap-3 group/item">
                   <MessageSquare className="w-[18px] h-[18px] text-[#2B7FFF]/70 mt-0.5 group-hover/item:text-[#2B7FFF] transition-colors" strokeWidth={2} />
                   <span className="text-[14px] text-[#E0E7F1] leading-snug font-light">User Feedback<br/>Analysis</span>
                </div>

                <div className="flex items-start gap-3 group/item">
                   <FileText className="w-[18px] h-[18px] text-[#2B7FFF]/70 mt-0.5 group-hover/item:text-[#2B7FFF] transition-colors" strokeWidth={2} />
                   <span className="text-[14px] text-[#E0E7F1] leading-snug font-light">Content<br/>Generation</span>
                </div>

                <div className="flex items-start gap-3 group/item">
                   <Zap className="w-[18px] h-[18px] text-[#2B7FFF]/70 mt-0.5 group-hover/item:text-[#2B7FFF] transition-colors" strokeWidth={2} />
                   <span className="text-[14px] text-[#E0E7F1] leading-snug font-light">Workflow<br/>Automation</span>
                </div>

                <div className="flex items-start gap-3 group/item">
                   <TrendingUp className="w-[18px] h-[18px] text-[#2B7FFF]/70 mt-0.5 group-hover/item:text-[#2B7FFF] transition-colors" strokeWidth={2} />
                   <span className="text-[14px] text-[#E0E7F1] leading-snug font-light">Productivity<br/>Enhancement</span>
                </div>

             </div>
           </div>
        </div>

      </div>
    </section>
  );
};
