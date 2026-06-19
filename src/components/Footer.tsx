import React from "react";
import { Linkedin, Mail, MapPin, Globe, Sparkles, Heart } from "lucide-react";
import { MobileAmbientBackground } from "./MobileAmbientBackground";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#020617] text-[#8B9DBB] pb-12 pt-8 relative z-20 overflow-hidden">
      
      {/* Tiny soft highlight under the footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[200px] bg-[#2B7FFF]/5 blur-[60px] md:blur-[100px] rounded-full pointer-events-none" />

      {/* Mobile-only ambient parallax field (desktop unaffected). */}
      <MobileAmbientBackground tint="blue" density="low" showGrid={false} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Integrated Premium Glassmorphic Footer Capsule Block mirroring the mockup exactly */}
        <div className="spinning-border-container relative w-full rounded-xl mb-10 shadow-[0_0_20px_rgba(43,127,255,0.06),_inset_0_1px_1px_rgba(255,255,255,0.05)] p-[1px] transition-all duration-500 hover:shadow-[0_0_30px_rgba(43,127,255,0.12)]">
          
          {/* Inner content container to mask the spinning border */}
          <div className="relative w-full rounded-[11px] bg-[#040c1e]/95 backdrop-blur-3xl px-6 py-6 sm:px-8 sm:py-5 lg:px-12 lg:py-6 overflow-hidden z-10">
            
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#2B7FFF]/5 blur-[70px] md:blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

            {/* Main columns grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-20">
              
              {/* LEFT: Branding signature */}
              <div className="lg:col-span-6 flex flex-col items-start text-left gap-2.5">
                 <span className="text-[#2B7FFF] font-mono text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-2 select-none">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B7FFF]/60 opacity-75" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-[#2B7FFF]" />
                    </span>
                    UI/UX Designer
                 </span>
                 <p className="text-sm font-light leading-relaxed text-slate-300/90 max-w-[450px]">
                   Designing impactful digital experiences through user-centered thinking.
                 </p>
              </div>

            {/* RIGHT: Based in Location & Status Indicator */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row gap-6 sm:gap-12 w-full justify-start lg:justify-end items-start sm:items-center">
               
               {/* Location Jakarta */}
               <div className="flex flex-col gap-2">
                  <span className="text-white/40 uppercase font-mono text-[9px] tracking-widest leading-none">Based in</span>
                  <div className="flex items-center gap-2 text-[#E0E7F1] font-light text-sm">
                     <MapPin className="w-4 h-4 text-[#2B7FFF]" />
                     <span>Jakarta, Indonesia</span>
                  </div>
               </div>

               {/* Status Indicator */}
               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                     <div className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                     </div>
                     <span className="text-white/40 uppercase font-mono text-[9px] tracking-widest text-[#2B7FFF] leading-none">Available for:</span>
                  </div>
                  <p className="text-xs font-light text-[#8B9DBB] leading-relaxed max-w-[200px]">
                     Full-time, Freelance, and Contract Projects
                  </p>
               </div>

            </div>

            </div>

          </div>

        </div>

        {/* BOTTOM FLOOR LINE */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px] font-light">
          <div>
            <p className="text-white/30">© 2025 Luthfi Arzaki. All rights reserved.</p>
          </div>
        </div>

      </div>

    </footer>
  );
};
