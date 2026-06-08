import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Mail, Linkedin, FileText, Send, User, Edit2, 
  ArrowRight, ArrowUpRight, Phone, MessageSquare, Lock, Sparkles,
  Calendar
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Reveal animations for elements
      gsap.fromTo(".contact-reveal-headline", 
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out"
        }
      );

      gsap.fromTo(".contact-card-anim", 
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".contact-cards-stack",
            start: "top 85%",
          },
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: "back.out(1.2)"
        }
      );

      gsap.fromTo(".contact-panel-anim", 
        { x: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: rightSideRef.current,
            start: "top 80%",
          },
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out"
        }
      );

      // Subtle slow rotate for orbital line or background planet
      gsap.to(".cosmic-planet-rotate", {
        rotate: 360,
        duration: 40,
        repeat: -1,
        ease: "none"
      });

      // Ambient movement of gradient orbs to float dynamically across the space
      gsap.to(".ambient-orb-1", {
        x: "random(-400, 400)",
        y: "random(-240, 240)",
        duration: "random(18, 28)",
        repeat: -1,
        repeatRefresh: true,
        ease: "sine.inOut"
      });
      gsap.to(".ambient-orb-2", {
        x: "random(-450, 450)",
        y: "random(-280, 280)",
        duration: "random(22, 32)",
        repeat: -1,
        repeatRefresh: true,
        ease: "sine.inOut"
      });

      // Randomized gentle floating and slow rotation for the stellar background planets
      gsap.to(".spectacular-planet", {
        x: "random(-30, 30)",
        y: "random(-30, 30)",
        rotation: "random(-10, 10)",
        duration: "random(20, 35)",
        repeat: -1,
        repeatRefresh: true,
        ease: "sine.inOut"
      });
      gsap.to(".spectacular-planet-left", {
        x: "random(-25, 25)",
        y: "random(-25, 25)",
        rotation: "random(-12, 12)",
        duration: "random(22, 38)",
        repeat: -1,
        repeatRefresh: true,
        ease: "sine.inOut"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section ref={sectionRef} className="relative w-full bg-[#020617] text-white py-24 lg:py-32 z-20 overflow-hidden" id="contact">
      
      {/* Immersive Atmospheric background */}
      {/* Large Cinematic Gradient Orbs with beautiful extra-soft blur that blends perfectly */}
      <div 
        className="ambient-orb-1 absolute top-[10%] left-[5%] w-[800px] h-[800px] rounded-full pointer-events-none mix-blend-screen" 
        style={{ 
          backgroundImage: "radial-gradient(circle, rgba(43, 127, 255, 0.1) 0%, rgba(43, 127, 255, 0) 75%)",
          filter: "blur(220px)" 
        }}
      />
      <div 
        className="ambient-orb-2 absolute bottom-[5%] right-[5%] w-[900px] h-[900px] rounded-full pointer-events-none mix-blend-screen" 
        style={{ 
          backgroundImage: "radial-gradient(circle, rgba(92, 50, 255, 0.08) 0%, rgba(92, 50, 255, 0) 75%)",
          filter: "blur(240px)" 
        }}
      />
      
      {/* Left Crescent Planet (Peeking beautifully behind left cards stack as seen in mockup image) */}
      <div className="spectacular-planet-left absolute left-[-160px] top-[32%] md:top-[38%] w-[360px] h-[360px] lg:w-[440px] lg:h-[440px] pointer-events-none select-none z-0">
        {/* Soft atmospheric halo blue glow */}
        <div 
          className="absolute inset-[-50px] bg-[#2B7FFF]/12 rounded-full pointer-events-none" 
          style={{ filter: "blur(140px)" }}
        />
        {/* Planet body with dark back and glowing left crescent outline */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2B7FFF]/25 via-[#0A1833] to-[#020617] rounded-full border border-white/5 shadow-[inset_-30px_30px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(43,127,255,0.25)] overflow-hidden">
          {/* Flare crescent light mapping */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#2B7FFF]/8 to-[#2B7FFF]/35 rounded-full mix-blend-screen" />
        </div>
        {/* Decorative orbit ring line */}
        <div className="absolute inset-[-60px] border border-[#2B7FFF]/5 rounded-full pointer-events-none rotate-[20deg] scale-x-[1.3] opacity-35" />
      </div>

      {/* Spectacular Glowing Planet in Background (Top Right Area similar to mockup) */}
      <div className="spectacular-planet absolute right-[-125px] lg:right-[-65px] top-[5%] md:top-[12%] w-[380px] h-[380px] lg:w-[460px] lg:h-[460px] pointer-events-none select-none z-0">
        {/* Soft atmospheric halo glow */}
        <div 
          className="absolute inset-[-60px] bg-[#2B7FFF]/15 rounded-full pointer-events-none" 
          style={{ filter: "blur(160px)" }}
        />
        {/* Planet body with dark side shadow & bright crescent side glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0D1D3D] to-[#2B7FFF]/70 rounded-full border border-white/5 shadow-[inset_-30px_-30px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(43,127,255,0.35)] overflow-hidden">
          {/* Accent light flare crescent overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2B7FFF]/15 to-[#2B7FFF]/50 rounded-full mix-blend-screen" />
        </div>
        {/* Orbital rings / fine lines */}
        <div className="absolute inset-[-80px] border border-[#2B7FFF]/10 rounded-full pointer-events-none rotate-[-15deg] scale-x-[1.3] opacity-60" />
        <div className="absolute inset-[-120px] border border-[#5C32FF]/5 rounded-full pointer-events-none rotate-[-15deg] scale-x-[1.4] opacity-40 border-dashed" />
      </div>

      {/* Abstract Orbit Lines & Space Dust node overlays */}
      <div className="absolute left-[5%] bottom-[10%] w-[500px] h-[500px] opacity-10 pointer-events-none">
        <svg viewBox="0 0 500 500" fill="none" className="cosmic-planet-rotate w-full h-full">
          <circle cx="250" cy="250" r="240" stroke="#5C32FF" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="250" cy="250" r="150" stroke="#2B7FFF" strokeWidth="0.5" />
          <circle cx="100" cy="150" r="3" fill="#2B7FFF" />
          <circle cx="400" cy="300" r="2" fill="#5C32FF" />
        </svg>
      </div>

      {/* Floating stars field */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:24px_24px]" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* LEFT SIDE: Content & Contact cards stacked */}
        <div ref={leftSideRef} className="lg:col-span-5 flex flex-col items-start text-left relative z-10">
          
          <div className="contact-reveal-headline flex items-center gap-3 mb-6">
            <span className="text-[#2B7FFF] font-mono text-xs tracking-widest uppercase">07. <span className="text-white/80">Contact</span></span>
            <div className="h-px w-12 bg-gradient-to-r from-[#2B7FFF] to-transparent" />
          </div>

          <h2 className="contact-reveal-headline text-4xl lg:text-[56px] font-display font-medium tracking-tight leading-[1.1] mb-6">
            Let's build <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B7FFF] to-[#5C32FF]">meaningful digital</span> <br />
            experiences together.
          </h2>

          <p className="contact-reveal-headline text-[#8B9DBB] font-light text-sm lg:text-[15px] leading-relaxed mb-10 max-w-md">
            I'm open to new opportunities, collaborations, and interesting projects. Let's create something great together!
          </p>

          {/* Interactive Contact Cards Stack EXACTLY like mockup */}
          <div className="contact-cards-stack flex flex-col gap-4 w-full max-w-[420px] mb-8">
             
             {/* Email Card */}
             <a 
               href="mailto:hi@luthfiarzaki.com"
               className="contact-card-anim group relative overflow-hidden flex items-center justify-between p-4 px-5 rounded-2xl bg-[#060A14]/70 border border-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#2B7FFF]/30 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(43,127,255,0.08)]"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-[#2B7FFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-[#2B7FFF]/10 border border-[#2B7FFF]/20 flex items-center justify-center shrink-0 group-hover:bg-[#2B7FFF]/20 group-hover:rotate-6 transition-all duration-300">
                    <Mail className="w-5 h-5 text-[#2B7FFF]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider">Email</span>
                    <span className="text-[#E0E7F1] text-[14px] font-light mt-0.5">hi@luthfiarzaki.com</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-[#2B7FFF]/40 group-hover:bg-[#2B7FFF]/10 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
             </a>

             {/* LinkedIn Card */}
             <a 
               href="https://linkedin.com/in/luthfiarzaki"
               target="_blank"
               rel="noreferrer"
               className="contact-card-anim group relative overflow-hidden flex items-center justify-between p-4 px-5 rounded-2xl bg-[#060A14]/70 border border-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#2B7FFF]/30 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(43,127,255,0.08)]"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-[#2B7FFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-[#2B7FFF]/10 border border-[#2B7FFF]/20 flex items-center justify-center shrink-0 group-hover:bg-[#2B7FFF]/20 group-hover:scale-105 transition-all duration-300">
                    <Linkedin className="w-5 h-5 text-[#2B7FFF]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider">LinkedIn</span>
                    <span className="text-[#E0E7F1] text-[14px] font-light mt-0.5">linkedin.com/in/luthfiarzaki</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-[#2B7FFF]/40 group-hover:bg-[#2B7FFF]/10 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
             </a>

             {/* Download CV Card */}
             <a 
               href="#"
               onClick={(e) => { e.preventDefault(); alert("CV Download Triggered!"); }}
               className="contact-card-anim group relative overflow-hidden flex items-center justify-between p-4 px-5 rounded-2xl bg-[#060A14]/70 border border-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#5C32FF]/30 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(92,50,255,0.08)]"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-[#5C32FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-[#5C32FF]/10 border border-[#5C32FF]/20 flex items-center justify-center shrink-0 group-hover:bg-[#5C32FF]/20 transition-all duration-300">
                    <FileText className="w-5 h-5 text-[#5C32FF]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider">Download CV</span>
                    <span className="text-[#E0E7F1] text-[14px] font-light mt-0.5">View my resume</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-[#5C32FF]/40 group-hover:bg-[#5C32FF]/10 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
             </a>

          </div>

        </div>

        {/* RIGHT SIDE: Premium floating glass message form EXACTLY like the image */}
        <div ref={rightSideRef} className="lg:col-span-7 w-full flex justify-center relative z-10">
          
          {/* Form container with gradient border and rich glowing dark drop-shadow */}
          <div className="contact-panel-anim relative w-full max-w-[580px] rounded-[2rem] p-[1.5px] bg-[#020617] bg-gradient-to-b from-[#2B7FFF]/40 via-white/5 to-[#5C32FF]/20 transition-all duration-500 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_50px_rgba(43,127,255,0.14)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_60px_rgba(43,127,255,0.24)] group/form overflow-hidden">
             
             {/* Glowing gradient subtle pulse accent behind form wrapper */}
             <div className="absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-[#2B7FFF]/12 to-transparent blur-[30px] opacity-100 transition-opacity duration-500 pointer-events-none" />

             {/* Internal Glass Card container */}
             <div className="relative w-full h-full bg-[#060a14]/90 rounded-[1.95rem] p-8 lg:p-10 backdrop-blur-3xl z-10">
                
                {/* Subtly colored decorative elements */}
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#2B7FFF]/5 blur-[70px] rounded-full pointer-events-none" />
                
                {/* Floating Title block */}
                <div className="flex items-center gap-4 mb-8">
                   {/* Clean, angled visual indicator icon box */}
                   <div className="w-12 h-12 rounded-xl bg-[#2B7FFF]/15 border border-[#2B7FFF]/25 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(43,127,255,0.15)] -rotate-3 hover:rotate-3 transition-transform duration-300">
                      <Send className="w-5 h-5 text-[#2B7FFF]" />
                   </div>
                   <div className="flex flex-col text-left">
                     <h3 className="text-xl font-medium tracking-wide">Send a Message</h3>
                     <p className="text-xs text-[#8B9DBB] font-light mt-0.5">I'll get back to you as soon as possible.</p>
                   </div>
                </div>

                {/* Functional email contact form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                   
                   {/* 2-Column fields: Name & Email */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     
                     {/* Your Name */}
                     <div className="relative group/field bg-[#030712]/50 border border-white/5 rounded-2xl p-4 transition-all duration-300 focus-within:border-[#2B7FFF]/40 focus-within:shadow-[0_0_15px_rgba(43,127,255,0.08)]">
                       <label className="block text-[9px] text-[#8B9DBB]/60 uppercase font-mono tracking-widest mb-1 text-left">Your Name</label>
                       <div className="flex items-center justify-between">
                         <input 
                           type="text" 
                           required
                           placeholder="Enter your name" 
                           value={formState.name}
                           onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                           className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-white/10 pt-0.5 font-light" 
                         />
                         <User className="w-4 h-4 text-[#8B9DBB]/30 group-focus-within/field:text-[#2B7FFF] transition-colors shrink-0 ml-2" strokeWidth={1.5} />
                       </div>
                     </div>

                     {/* Your Email */}
                     <div className="relative group/field bg-[#030712]/50 border border-white/5 rounded-2xl p-4 transition-all duration-300 focus-within:border-[#2B7FFF]/40 focus-within:shadow-[0_0_15px_rgba(43,127,255,0.08)]">
                       <label className="block text-[9px] text-[#8B9DBB]/60 uppercase font-mono tracking-widest mb-1 text-left">Your Email</label>
                       <div className="flex items-center justify-between">
                         <input 
                           type="email" 
                           required
                           placeholder="Enter your email" 
                           value={formState.email}
                           onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                           className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-white/10 pt-0.5 font-light" 
                         />
                         <Mail className="w-4 h-4 text-[#8B9DBB]/30 group-focus-within/field:text-[#2B7FFF] transition-colors shrink-0 ml-2" strokeWidth={1.5} />
                       </div>
                     </div>

                   </div>

                   {/* Subject Field */}
                   <div className="relative group/field bg-[#030712]/50 border border-white/5 rounded-2xl p-4 transition-all duration-300 focus-within:border-[#2B7FFF]/40 focus-within:shadow-[0_0_15px_rgba(43,127,255,0.08)]">
                     <label className="block text-[9px] text-[#8B9DBB]/60 uppercase font-mono tracking-widest mb-1 text-left">Subject</label>
                     <div className="flex items-center justify-between">
                       <input 
                         type="text" 
                         required
                         placeholder="What's this about?" 
                         value={formState.subject}
                         onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                         className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-white/10 pt-0.5 font-light" 
                       />
                       <FileText className="w-4 h-4 text-[#8B9DBB]/30 group-focus-within/field:text-[#2B7FFF] transition-colors shrink-0 ml-2" strokeWidth={1.5} />
                     </div>
                   </div>

                   {/* Your Message */}
                   <div className="relative group/field bg-[#030712]/50 border border-white/5 rounded-2xl p-4 transition-all duration-300 focus-within:border-[#2B7FFF]/40 focus-within:shadow-[0_0_15px_rgba(43,127,255,0.08)]">
                     <label className="block text-[9px] text-[#8B9DBB]/60 uppercase font-mono tracking-widest mb-1 text-left">Your Message</label>
                     <div className="flex items-start justify-between gap-2">
                       <textarea 
                         required
                         rows={4}
                         placeholder="Tell me about your project or idea..." 
                         value={formState.message}
                         onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                         className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-white/10 resize-none pt-0.5 min-h-[100px] leading-relaxed font-light" 
                       />
                       <Edit2 className="w-4 h-4 text-[#8B9DBB]/30 group-focus-within/field:text-[#2B7FFF] transition-colors shrink-0 mt-1" strokeWidth={1.5} />
                     </div>
                   </div>

                   {/* Action button matching mockup details with corner glow slide */}
                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="group relative bg-gradient-to-r from-[#2B7FFF] to-[#5C32FF] hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center gap-3 py-4 rounded-xl font-medium overflow-hidden border border-white/10 mt-2 cursor-pointer shadow-[0_15px_30px_rgba(92,50,255,0.15)] disabled:opacity-75 disabled:pointer-events-none z-10"
                   >
                     {isSubmitting ? (
                       <span className="flex items-center gap-2">
                         <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                         </svg>
                         Sending...
                       </span>
                     ) : submitted ? (
                       <span className="flex items-center gap-2 text-emerald-400 font-semibold mb-0">✓ Message Sent Successfully!</span>
                     ) : (
                       <>
                         <span className="pr-12 text-sm">Send Message</span>
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-105 transition-all">
                           <Send className="w-4 h-4 text-white group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-transform" />
                         </div>
                       </>
                     )}
                   </button>

                   {/* Privacy Safeguard note */}
                   <div className="flex items-center justify-center gap-2 text-[#8B9DBB]/50 text-[11px] font-light mt-2">
                      <Lock className="w-3.5 h-3.5 text-[#2B7FFF]" />
                      <span>Your information is safe with me. I respect your privacy.</span>
                   </div>

                </form>
             
             </div>

          </div>

        </div>

      </div>

    </section>
  );
};
