import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    content: "I had the opportunity to work with Luthfi, a talented UI/UX designer who is also part of the RnD team. He has strong analytical thinking and the ability to create designs that perfectly align with client needs.",
    author: "Raka",
    role: "Lead Engineer",
    company: "PT. Seleris Meditekno Internasional",
    initial: "R"
  },
  {
    id: 2,
    content: "Luthfi consistently delivers high-quality designs. His deep understanding of user behavior and business requirements makes him an invaluable asset. He is a reliable professional to collaborate with on any project.",
    author: "Sarah",
    role: "Product Manager",
    company: "Tech Solutions Inc.",
    initial: "S"
  },
  {
    id: 3,
    content: "Working with Luthfi is a great experience. He is incredibly flexible and adapts quickly to changes, ensuring the user experience is always top-notch without compromising on visual aesthetics.",
    author: "Budi",
    role: "Frontend Developer",
    company: "Creative Studio",
    initial: "B"
  }
];

export const TestimonialSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".testimonial-header", 
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

      gsap.fromTo(".testimonial-card", 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".testimonials-grid",
            start: "top 85%",
          },
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: "back.out(1.2)",
        }
      );
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#020617] text-white py-32 z-20 overflow-hidden" id="testimonials">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2B7FFF]/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-start w-full">
        
        <div className="flex flex-col items-start gap-4 mb-16 testimonial-header text-left">
          <div className="flex items-center gap-3">
            <span className="text-[#2B7FFF] font-mono text-sm tracking-widest uppercase">05. <span className="text-white/80">Testimonials</span></span>
            <div className="h-px w-12 bg-gradient-to-r from-[#2B7FFF] to-transparent" />
          </div>
          <h2 className="text-4xl lg:text-[56px] font-display font-medium tracking-tight leading-[1.1]">
            What colleagues <br className="hidden md:block"/>say about <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B7FFF] to-[#5C32FF]">working with me.</span>
          </h2>
          <p className="text-[#8B9DBB] font-light max-w-lg mt-2 leading-relaxed">
            Feedback from professionals I've collaborated with throughout my design journey.
          </p>
        </div>

        <div className="testimonials-grid flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-[calc(100%+48px)] -ml-6 px-6 md:w-full md:ml-0 md:px-0 text-left overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card shrink-0 w-[85%] md:w-auto snap-center relative group flex flex-col h-full bg-[#060A14]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-[#2B7FFF]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2B7FFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
              
              <Quote className="w-8 h-8 text-[#2B7FFF]/30 mb-6 shrink-0 group-hover:text-[#2B7FFF]/50 transition-colors" />
              
              <p className="flex-1 text-[#E0E7F1] font-light text-[15px] leading-relaxed mb-8">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-6 group-hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E293B] to-[#0A1128] border border-white/10 flex items-center justify-center shrink-0">
                   <div className="w-full h-full bg-[#2B7FFF]/10 rounded-full flex items-center justify-center font-medium text-[#2B7FFF]">
                     {testimonial.initial}
                   </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium text-sm tracking-wide">{testimonial.author}</span>
                  <span className="text-xs font-mono text-[#2B7FFF] mt-0.5">{testimonial.role}</span>
                  <span className="text-[11px] text-[#8B9DBB] font-light mt-0.5 line-clamp-1">{testimonial.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
