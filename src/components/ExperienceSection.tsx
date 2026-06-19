import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, MapPin, User, Code, Activity, ArrowUpRight } from "lucide-react";
import { ExperienceBackground } from "./ExperienceBackground";

gsap.registerPlugin(ScrollTrigger);

const experiencesData = [
  {
    year: "2018",
    company: "PT. AZIMUTH SOLUTION",
    role: "Front-End Developer",
    date: "Jan 2018 – Mar 2018",
    location: "Jakarta, Indonesia",
    description: "Developed responsive web interfaces and collaborated on digital product implementation using modern frontend technologies."
  },
  {
    year: "2021",
    company: "Freelance",
    role: "UI/UX Designer",
    date: "Jan 2021 – Present",
    location: "Remote",
    description: "Collaborating with startups and businesses to create user-centered digital products, dashboards, and mobile applications across various industries."
  },
  {
    year: "2022",
    company: "PT. TRI NINDYA UTAMA",
    role: "UI Designer",
    date: "Mar 2022 – Aug 2022",
    location: "Jakarta, Indonesia",
    description: "Designed enterprise dashboard systems and digital interfaces with a focus on clarity, information hierarchy, and usability."
  },
  {
    year: "2022",
    company: "PT. TRI NINDYA UTAMA",
    role: "Quality Assurance Intern",
    date: "Mar 2022 – Aug 2022",
    location: "Jakarta, Indonesia",
    description: "Supported product quality through testing, usability validation, and User Acceptance Testing processes."
  },
  {
    year: "2023",
    company: "PT. SELERIS MEDITEKNO INTERNASIONAL",
    role: "UI/UX Designer",
    date: "Nov 2023 – Present",
    location: "Jakarta, Indonesia",
    description: "Designing AI-powered health-tech and insurance platforms focused on usability, workflow efficiency, and scalable enterprise experiences."
  }
];

export const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=4000",
            pin: true,
            scrub: 1,
          }
        });

      // initial states
      gsap.set('.exp-header', { y: () => window.innerHeight * 0.25 });
      gsap.set('.exp-content', { opacity: 0, y: 100 });
      gsap.set('.exp-card', { opacity: 0, scale: 0.95 });
      gsap.set('.progress-line', { scaleY: 0, transformOrigin: 'top center' });
      gsap.set('.node-ring', { borderColor: 'rgba(43,127,255,0.3)', boxShadow: '0 0 0px rgba(43,127,255,0)' });
      gsap.set('.node-core', { backgroundColor: 'rgba(255,255,255,0.1)', boxShadow: '0 0 0px rgba(255,255,255,0)' });
      gsap.set('[class^="horizontal-line-"]', { opacity: 0, scaleX: 0, transformOrigin: 'left center' });
      gsap.set('[class^="year-text-"]', { color: 'rgba(255,255,255,0.15)' });
      gsap.set('[class^="date-text-"]', { color: 'rgba(255,255,255,0.15)' });

      gsap.set('[class^="timeline-role-"]', { color: 'rgba(255,255,255,0.4)' });
      gsap.set('[class^="timeline-company-"]', { color: 'rgba(255,255,255,0.6)' });

      // Intro step: move header up and show content
      tl.to('.exp-header', { 
        y: 0,
        scale: 0.95,
        duration: 3, 
        ease: 'power2.inOut' 
      }, "intro");
      
      tl.to('.exp-content', { 
        opacity: 1, 
        y: 0, 
        duration: 3, 
        ease: 'power2.out' 
      }, "intro");

      // First step animation, right away when pinned
      experiencesData.forEach((_, i) => {
        const stepLabel = `step${i}`;
        
        // Progress line scaleY (from 0 to 1 based on i)
        tl.to('.progress-line', { 
           scaleY: i / (experiencesData.length - 1), 
           duration: 1, 
           ease: 'none' 
        }, stepLabel);

        // Current node highlight
        tl.to(`.node-ring-${i}`, { 
           borderColor: 'rgba(255,255,255,0.8)',
           boxShadow: '0 0 25px 4px rgba(43,127,255,1), inset 0 0 15px 3px rgba(43,127,255,1)',
           scale: 1.25,
           duration: 0.5 
        }, stepLabel);
        
        tl.to(`.node-core-${i}`, {
           backgroundColor: '#ffffff',
           boxShadow: '0 0 15px 4px rgba(255,255,255,1)',
           duration: 0.5
        }, stepLabel);

        tl.to(`.horizontal-line-${i}`, { 
           opacity: 1,
           scaleX: 1,
           duration: 0.5 
        }, stepLabel);

        tl.to(`.year-text-${i}`, { color: '#2B7FFF', duration: 0.5 }, stepLabel);
        tl.to(`.date-text-${i}`, { color: 'rgba(43,127,255,0.8)', duration: 0.5 }, stepLabel);
        tl.to(`.timeline-role-${i}`, { color: '#2B7FFF', duration: 0.5 }, stepLabel);
        tl.to(`.timeline-company-${i}`, { color: '#ffffff', duration: 0.5 }, stepLabel);

        // Previous node de-highlight
        if (i > 0) {
          tl.to(`.node-ring-${i-1}`, { 
             scale: 1,
             borderColor: 'rgba(43,127,255,0.3)',
             boxShadow: '0 0 0px rgba(43,127,255,0), inset 0 0 0px rgba(43,127,255,0)',
             duration: 0.5 
          }, stepLabel);
          
          tl.to(`.node-core-${i-1}`, {
             backgroundColor: 'rgba(255,255,255,0.1)',
             boxShadow: '0 0 0px rgba(255,255,255,0)',
             duration: 0.5
          }, stepLabel);
          
          tl.to(`.horizontal-line-${i-1}`, { 
             opacity: 0,
             scaleX: 0,
             duration: 0.5 
          }, stepLabel);

          tl.to(`.year-text-${i-1}`, { color: 'rgba(255,255,255,0.2)', duration: 0.5 }, stepLabel);
          tl.to(`.date-text-${i-1}`, { color: 'rgba(255,255,255,0.2)', duration: 0.5 }, stepLabel);
          tl.to(`.timeline-role-${i-1}`, { color: 'rgba(255,255,255,0.4)', duration: 0.5 }, stepLabel);
          tl.to(`.timeline-company-${i-1}`, { color: 'rgba(255,255,255,0.6)', duration: 0.5 }, stepLabel);

          // Prev card fade out
          tl.to(`.exp-card-${i-1}`, { opacity: 0, scale: 0.95, duration: 0.5 }, stepLabel);
        }

        // Current card fade in
        tl.to(`.exp-card-${i}`, { opacity: 1, scale: 1, duration: 0.8 }, stepLabel);

        // Add a long pause before next step
        tl.to({}, { duration: 1.5 });
      });
      }); // close mm.add

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen md:h-screen bg-[#020617] overflow-hidden flex flex-col z-20" id="experience">
      <ExperienceBackground />
      {/* Container */}
      <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col pt-16 md:pt-24 pb-12">
         
         {/* Top Header */}
         <div className="exp-header flex flex-col items-center md:items-center text-left md:text-center gap-3 lg:gap-4 max-w-3xl mx-auto md:mx-auto w-full shrink-0 z-20">
            <div className="flex items-center gap-4 justify-start md:justify-center w-full md:w-auto">
              <span className="text-[#2B7FFF] font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium">
                02. Experience
              </span>
            </div>
            <h2 className="text-[32px] md:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.1] md:leading-[1.2] text-left md:text-center self-start md:self-auto w-full">
              My professional <br className="block md:hidden"/> journey shaped by <br className="hidden md:block"/> <span className="text-[#2B7FFF] md:text-transparent md:bg-clip-text md:bg-gradient-to-r md:from-[#2B7FFF] md:to-[#A8C7FA]">curiosity and impact.</span>
            </h2>
            <p className="text-[#8B9DBB] text-[15px] md:text-base leading-relaxed md:max-w-xl text-left md:text-center mt-2 md:mt-0 w-full">
              A timeline of experiences across product design, enterprise systems, health-tech, insurance, and digital innovation.
            </p>
         </div>

         {/* Content Split (Desktop & Tablet) */}
         <div className="exp-content hidden md:flex flex-col lg:flex-row lg:items-center flex-1 gap-8 lg:gap-16 w-full mt-10 md:mt-12 min-h-0 z-10 max-w-[1200px] mx-auto">
            {/* Left: Timeline */}
            <div className="w-full lg:w-[45%] relative shrink-0">
               <div className="flex relative h-[40vh] min-h-[300px] lg:h-[400px]">
                 {/* Desktop vertical line */}
                 <div className="hidden lg:block absolute top-[12px] bottom-[12px] left-[140px] w-px bg-white/10 z-0" />
                 <div className="progress-line hidden lg:block absolute top-[12px] bottom-[12px] left-[140px] w-[2px] bg-[#2B7FFF] shadow-[0_0_20px_2px_rgba(43,127,255,1),_0_0_10px_1px_rgba(43,127,255,0.8)] z-0" />

                 {/* Mobile Line Container */}
                 <div className="block lg:hidden absolute top-[12px] bottom-[12px] left-[20px] w-px bg-white/10 z-0" />
                 <div className="progress-line block lg:hidden absolute top-[12px] bottom-[12px] left-[20px] w-[2px] bg-[#2B7FFF] shadow-[0_0_20px_2px_rgba(43,127,255,1),_0_0_10px_1px_rgba(43,127,255,0.8)] z-0" />

                 <div className="flex flex-col justify-between h-full relative z-10 w-full py-2">
                   {experiencesData.map((exp, i) => {
                     const parts = exp.date.split(" – ");
                     const startMonth = parts[0]?.split(" ")[0] || "JAN";
                     const endWord = parts[1]?.toLowerCase() === "present" ? "PRESENT" : parts[1]?.split(" ")[0];
                     const endMonth = endWord || "DEC";
                     const dateStr = `${startMonth} ${parts[0]?.split(" ")[1] || exp.year} - ${endMonth}`.toUpperCase();

                     return (
                       <div key={i} className={`node-item node-item-${i} relative flex items-center lg:justify-start justify-start w-full min-h-[40px] group`}>
                         
                         {/* Desktop text & node */}
                         <div className="hidden lg:flex flex-row items-center w-full">
                           {/* Year / Date */}
                           <div className="flex flex-col items-end text-right w-[110px] shrink-0">
                              <span className={`year-text-${i} font-mono font-medium text-2xl tracking-wider mb-1 transition-colors duration-500 leading-none drop-shadow-md`}>{exp.year}</span>
                              <span className={`date-text-${i} font-mono text-[9px] tracking-[0.1em] uppercase transition-colors duration-500 whitespace-nowrap`}>{dateStr}</span>
                           </div>

                           {/* Node / Line gap */}
                           <div className="w-[60px] h-full flex items-center justify-center relative shrink-0">
                              <div className={`node-ring node-ring-${i} w-[18px] h-[18px] rounded-full border-[2px] border-[#2B7FFF]/30 bg-[#020617] flex items-center justify-center relative z-10 transition-all duration-500`}>
                                 <div className={`node-core node-core-${i} w-[6px] h-[6px] rounded-full bg-white/20 transition-all duration-500`} />
                              </div>
                              <div className={`horizontal-line-${i} absolute left-[30px] w-[500px] h-[2px] bg-gradient-to-r from-white via-[#2B7FFF] to-transparent top-1/2 -translate-y-1/2 z-0 origin-left drop-shadow-[0_0_15px_rgba(43,127,255,1)]`} />
                           </div>

                           {/* Company / Role */}
                           <div className="flex flex-col items-start w-[calc(100%-170px)] -mt-1">
                              <span className={`timeline-company-${i} text-white font-medium text-xs tracking-wide uppercase mb-1 transition-colors duration-500`}>{exp.company}</span>
                              <span className={`timeline-role-${i} font-medium text-xs transition-colors duration-500 font-mono`}>{exp.role}</span>
                           </div>
                         </div>

                         {/* Mobile text */}
                         <div className="flex lg:hidden flex-col w-full pl-[56px] justify-center h-full">
                           <span className={`year-text-${i} font-mono font-bold text-xl tracking-wider mb-1 transition-colors duration-500 leading-none`}>{exp.year}</span>
                           <span className={`timeline-company-${i} text-white font-medium text-xs tracking-wide uppercase mb-1 transition-colors duration-500`}>{exp.company}</span>
                           <span className={`timeline-role-${i} font-medium text-xs transition-colors duration-500 font-mono mb-1`}>{exp.role}</span>
                           <span className={`date-text-${i} font-mono text-[9px] tracking-[0.1em] uppercase transition-colors duration-500 whitespace-nowrap`}>{dateStr}</span>
                         </div>

                         {/* Mobile dot */}
                         <div className={`node-ring node-ring-${i} block lg:hidden w-4 h-4 rounded-full border-[2px] border-[#2B7FFF]/30 bg-[#020617] flex-col items-center justify-center absolute left-[12px] top-1/2 -translate-y-1/2 z-10 transition-all duration-500`}>
                            <div className={`node-core node-core-${i} w-1.5 h-1.5 rounded-full mx-auto mt-[3px] bg-white/20 transition-all duration-500`} />
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
            </div>

            {/* Right: Glass Card */}
            <div className="w-full lg:w-[55%] relative h-[40vh] min-h-[300px] lg:h-[400px] flex items-center justify-center lg:justify-start mt-4 lg:mt-0">
               <div className="relative w-full h-full max-w-[600px] flex items-start lg:items-center z-10">
                 {experiencesData.map((exp, i) => (
                   <div key={i} className={`exp-card exp-card-${i} absolute top-0 lg:top-1/2 lg:-translate-y-1/2 w-full bg-[#030614]/40 backdrop-blur-3xl border border-[#2B7FFF]/20 rounded-3xl p-6 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_40px_rgba(43,127,255,0.05)] ring-1 ring-white/5`}>
                      <div className="flex flex-col gap-6 mb-8">
                         <div className="flex flex-row items-center gap-6">
                           <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-[#2B7FFF] to-[#5C32FF] shrink-0 shadow-[0_8px_24px_rgba(43,127,255,0.15)] flex items-center justify-center relative overflow-hidden">
                             {/* White geometric shape inside */}
                             <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white shadow-sm rounded-lg absolute z-10" />
                             <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/40 shadow-sm rounded-lg absolute transform translate-x-2 translate-y-2 z-0 backdrop-blur-sm" />
                           </div>
                           <div className="flex flex-col">
                             <h3 className="text-xl lg:text-2xl text-white font-semibold leading-tight tracking-wide mb-2 drop-shadow-sm uppercase">
                                {exp.company}
                             </h3>
                             <span className="text-[#2B7FFF] font-mono text-sm tracking-[0.15em] uppercase font-medium">
                                {exp.role}
                             </span>
                           </div>
                         </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-t border-white/5 pt-6 mb-6">
                         <div className="flex items-center gap-3 text-white/50 text-sm font-medium">
                           <Calendar className="w-4 h-4" />
                           <span>{exp.date}</span>
                         </div>
                         <div className="hidden sm:block w-px h-4 bg-white/10" />
                         <div className="flex items-center gap-3 text-white/50 text-sm font-medium">
                           <MapPin className="w-4 h-4" />
                           <span>{exp.location || "Jakarta, Indonesia"}</span>
                         </div>
                      </div>
                      
                      <p className="text-white/60 text-sm lg:text-[15px] leading-[1.8] font-light pr-2 lg:pr-4">
                         {exp.description}
                      </p>
                   </div>
                 ))}
               </div>
            </div>
         </div>


         {/* Mobile View Container */}
         <div className="flex md:hidden flex-col w-full mt-8 relative z-10 px-0 sm:px-4">
            {/* Global Continuous Line */}
            <div className="absolute top-[32px] bottom-[30px] left-[20px] w-px bg-white/10 z-0" />
            <div className="absolute top-[32px] h-[190px] left-[20px] w-px bg-[#2B7FFF] shadow-[0_0_15px_rgba(43,127,255,1)] z-0" />

            {/* Item 1 - Active */}
            <div className="relative w-full border border-[#2B7FFF]/40 bg-[#2B7FFF]/[0.02] backdrop-blur-md rounded-[20px] p-5 shadow-[inset_0_0_30px_rgba(43,127,255,0.05),_0_8px_32px_rgba(0,0,0,0.3)] mb-4">
               {/* Node Dot */}
               <div className="absolute left-[20px] top-[36px] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[2px] border-[#2B7FFF] bg-[#020617] flex items-center justify-center z-10 shadow-[0_0_15px_rgba(43,127,255,0.6)]">
                 <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
               </div>
               
               <div className="pl-[36px]">
                  {/* Date */}
                  <div className="font-mono text-[9px] tracking-[0.1em] text-[#2B7FFF] uppercase mb-1.5">
                    MAR 2022 - AUG 2022
                  </div>
                  
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="flex flex-col gap-1 pr-2">
                      <h3 className="text-[14px] font-semibold text-white tracking-wide uppercase leading-snug">
                        PT. TRI NINDYA UTAMA
                      </h3>
                      <span className="text-[#2B7FFF] font-mono text-[10px] uppercase font-medium tracking-wider">
                        UI Designer
                      </span>
                      <div className="flex items-center gap-1.5 text-white/40 text-[10px] mt-1">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>Jakarta, Indonesia</span>
                      </div>
                    </div>
                    {/* Icon Box */}
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-gradient-to-br from-[#2B7FFF] to-[#5C32FF] shrink-0 shadow-[0_4px_16px_rgba(43,127,255,0.2)] flex items-center justify-center relative overflow-hidden mt-0.5">
                       <div className="w-5 h-5 bg-white shadow-sm rounded border border-black/5 absolute z-10" />
                       <div className="w-5 h-5 bg-white/40 shadow-sm rounded border border-black/5 absolute transform translate-x-1 translate-y-1 z-0 backdrop-blur-sm" />
                    </div>
                  </div>

                  <div className="w-full h-px bg-white/5 my-3" />
                  
                  <p className="text-white/60 text-[12px] leading-[1.6] font-light">
                    Designed enterprise dashboard systems and digital interfaces with a focus on clarity, information hierarchy, and usability.
                  </p>
               </div>
            </div>

            {/* Item 2 - Inactive */}
            <div className="relative w-full p-4 mb-2">
               {/* Node Dot */}
               <div className="absolute left-[20px] top-[24px] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-[2px] border-white/10 bg-[#020617] flex items-center justify-center z-10" />
               
               <div className="pl-[36px]">
                  <div className="font-mono text-[9px] tracking-[0.1em] text-[#2B7FFF] uppercase mb-1.5 opacity-90">
                    JAN 2021 - PRESENT
                  </div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex flex-col gap-1 pr-2">
                      <h3 className="text-[14px] font-semibold text-white tracking-wide uppercase leading-snug shadow-sm">
                        FREELANCE
                      </h3>
                      <span className="text-[#2B7FFF] font-mono text-[10px] uppercase tracking-wider font-medium opacity-90">
                        UI/UX Designer
                      </span>
                    </div>
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-[#020617] border border-white/5 shrink-0 flex items-center justify-center text-[#2B7FFF]/70">
                       <User className="w-[18px] h-[18px]" />
                    </div>
                  </div>
                  <p className="text-white/50 text-[12px] leading-[1.6] font-light">
                    Working with clients worldwide to create user-centered digital products across various industries.
                  </p>
               </div>
            </div>

            {/* Item 3 - Inactive */}
            <div className="relative w-full p-4 mb-2">
               {/* Node Dot */}
               <div className="absolute left-[20px] top-[24px] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-[2px] border-white/10 bg-[#020617] flex items-center justify-center z-10" />
               
               <div className="pl-[36px]">
                  <div className="font-mono text-[9px] tracking-[0.1em] text-[#2B7FFF] uppercase mb-1.5 opacity-90">
                    JAN 2018 - MAR 2021
                  </div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex flex-col gap-1 pr-2">
                      <h3 className="text-[14px] font-semibold text-white tracking-wide uppercase leading-snug">
                        PT. AZIMUTH SOLUTION
                      </h3>
                      <span className="text-[#2B7FFF] font-mono text-[10px] uppercase tracking-wider font-medium opacity-90">
                        Front-End Developer
                      </span>
                    </div>
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-[#020617] border border-white/5 shrink-0 flex items-center justify-center text-[#2B7FFF]/70">
                       <Code className="w-[18px] h-[18px]" />
                    </div>
                  </div>
                  <p className="text-white/50 text-[12px] leading-[1.6] font-light">
                    Built responsive web applications and collaborated with cross-functional teams to deliver high-quality solutions.
                  </p>
               </div>
            </div>

            {/* Item 4 - Inactive */}
            <div className="relative w-full p-4 mb-2">
               {/* Node Dot */}
               <div className="absolute left-[20px] top-[24px] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-[2px] border-white/10 bg-[#020617] flex items-center justify-center z-10" />
               
               <div className="pl-[36px]">
                  <div className="font-mono text-[9px] tracking-[0.1em] text-[#2B7FFF] uppercase mb-1.5 opacity-90">
                    NOV 2023 - PRESENT
                  </div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex flex-col gap-1 pr-2">
                      <h3 className="text-[14px] font-semibold text-white tracking-wide uppercase leading-snug">
                        PT. SELERIS MEDITEKNO
                      </h3>
                      <span className="text-[#2B7FFF] font-mono text-[10px] uppercase tracking-wider font-medium opacity-90">
                        UI/UX Designer
                      </span>
                    </div>
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-[#020617] border border-white/5 shrink-0 flex items-center justify-center text-[#2B7FFF]/70">
                       <Activity className="w-[18px] h-[18px]" />
                    </div>
                  </div>
                  <p className="text-white/50 text-[12px] leading-[1.6] font-light">
                    Designing digital products for health-tech solutions that drive better outcomes.
                  </p>
               </div>
            </div>

            {/* View All Button */}
            <div className="mt-2 w-full">
              <button 
                className="group flex items-center justify-between w-full h-[54px] bg-[#020617] border border-[#2B7FFF]/20 rounded-[18px] p-[5px] pl-6 active:scale-[0.98] transition-all text-left relative overflow-hidden shadow-[inset_0_0_10px_rgba(43,127,255,0.05),_0_4px_20px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute inset-0 bg-[#2B7FFF]/5 opacity-0 active:opacity-100 transition-opacity" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#2B7FFF] font-medium relative z-10">
                  View All Experience
                </span>
                <div className="w-[44px] h-[44px] rounded-[14px] bg-[#2B7FFF] flex items-center justify-center text-white relative z-10 shadow-[0_2px_10px_rgba(43,127,255,0.3)]">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </button>
            </div>
         </div>
      </div>
    </section>
  );
};
