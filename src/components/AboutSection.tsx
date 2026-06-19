import { motion } from "motion/react";
import { MapPin, PenTool, LayoutDashboard, Zap } from "lucide-react";
import { AboutSectionBackground } from "./AboutSectionBackground";
import { CubeSystem } from "./CubeSystem";
import { AnimatedWord } from "./AnimatedWord";

export const AboutSection = () => {
  return (
    <section
      className="relative w-full min-h-screen bg-[#02040A] py-16 lg:py-20 flex flex-col justify-center overflow-hidden z-20"
      id="about"
    >
      {/* Cinematic Background Elements */}
      <AboutSectionBackground />

      {/* Interactive Cube Layer - Positioned to be interactable but visually integrated */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none flex items-center justify-center"
        style={{ perspective: "3000px" }}
      >
        <div className="pointer-events-auto">
          <CubeSystem />
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center pointer-events-none">
        {/* Left Side: Text content */}
        <div className="flex flex-col pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-[#2B7FFF] font-mono text-xs tracking-[0.2em] uppercase font-medium">
              01. About Me
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-2xl lg:text-[2rem] leading-[1.6] text-white font-mono tracking-wide mb-10"
          >
            "Where <AnimatedWord index={0}>strategy</AnimatedWord>,<br />
            <AnimatedWord index={1}>usability</AnimatedWord>, and{" "}
            <AnimatedWord index={2}>design</AnimatedWord>
            <br />
            come together"
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#8B9DBB] text-base lg:text-lg mb-8 max-w-[500px] leading-[1.8]"
          >
            I create user-centered digital products that balance usability,
            scalability, and business impact through strategic thinking,
            research, and intuitive design solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <MapPin className="w-4 h-4 text-[#2B7FFF]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#8B9DBB] text-xs">Based in</span>
                <span className="text-[#E0E7F1] text-sm font-medium">
                  Indonesia
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 relative before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-px before:h-8 before:bg-white/10 ml-3 pl-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#8B9DBB] text-xs">Available for</span>
                <span className="text-[#E0E7F1] text-sm font-medium">
                  Freelance
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Floating 3D Glass Cards */}
        <div
          className="relative flex flex-col items-center lg:items-end w-full lg:max-w-[700px] lg:ml-auto min-h-[500px] lg:min-h-[600px] justify-center z-20 mt-12 lg:mt-0 pointer-events-auto"
          style={{ perspective: "1500px" }}
        >
          {/* Cards Composition - Consolidated Single Glass Card */}
          <div className="relative z-10 w-full flex items-center justify-center lg:justify-end pr-0 lg:pr-4">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-full max-w-[500px] group"
              style={{ perspective: "2000px" }}
            >
              <div
                className="bg-[#050b1a]/40 backdrop-blur-[30px] border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden transition-all duration-700 hover:border-white/20 hover:bg-[#071026]/50"
                style={{
                  boxShadow:
                    "0 40px 100px rgba(0,0,0,0.8), inset 0 0 80px rgba(255,255,255,0.02)",
                }}
              >
                {/* Decorative gradients */}
                <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="flex flex-col gap-10 relative z-10">
                  {/* Row 1: Design Focus */}
                  <div className="flex gap-6 group/row">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover/row:bg-blue-500/20 group-hover/row:border-blue-500/30">
                      <PenTool className="w-6 h-6 text-white/70 group-hover/row:text-blue-400 group-hover/row:scale-110 transition-all duration-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-white font-bold tracking-widest text-sm uppercase">
                        Design Focus
                      </h4>
                      <p className="text-[#94a3b8] text-sm leading-relaxed">
                        End-to-end product design, bridging aesthetics with
                        scalable design systems.
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Domain Experience */}
                  <div className="flex gap-6 group/row">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover/row:bg-purple-500/20 group-hover/row:border-purple-500/30">
                      <LayoutDashboard className="w-6 h-6 text-white/70 group-hover/row:text-purple-400 group-hover/row:scale-110 transition-all duration-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-white font-bold tracking-widest text-sm uppercase">
                        Domain Experience
                      </h4>
                      <p className="text-[#94a3b8] text-sm leading-relaxed">
                        HealthTech, Flexible Insurance platforms, Dashboards,
                        and AI Systems.
                      </p>
                    </div>
                  </div>

                  {/* Row 3: Approach */}
                  <div className="flex gap-6 group/row">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover/row:bg-emerald-500/20 group-hover/row:border-emerald-500/30">
                      <Zap className="w-6 h-6 text-white/70 group-hover/row:text-emerald-400 group-hover/row:scale-110 transition-all duration-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-white font-bold tracking-widest text-sm uppercase">
                        Approach
                      </h4>
                      <p className="text-[#94a3b8] text-sm leading-relaxed">
                        User-centered, data-driven, prioritizing functional
                        clarity without sacrificing aesthetics.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subtle light sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative center line connecting sections (optional) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/10 to-transparent" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 items-center mb-8">
        <span className="text-[#2B7FFF] font-mono text-[10px] tracking-widest uppercase">
          02. Experience
        </span>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2B7FFF] shadow-[0_0_8px_rgba(43,127,255,0.8)]" />
    </section>
  );
};
