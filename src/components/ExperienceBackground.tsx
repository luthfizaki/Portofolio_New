import { MobileAmbientBackground } from "./MobileAmbientBackground";

export const ExperienceBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-[#020617]">
      <style>
        {`
          .animated-path {
            stroke-dasharray: 150 150;
            animation: dash 15s linear infinite;
          }
          .animated-path-reverse {
            stroke-dasharray: 150 150;
            animation: dash-reverse 15s linear infinite;
          }
          @keyframes dash {
            from { stroke-dashoffset: 1000; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes dash-reverse {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: 1000; }
          }
          .keyword-glow {
            animation: keywordBlink 8s ease-in-out infinite alternate;
          }
          @keyframes keywordBlink {
            0% { opacity: 0.01; text-shadow: none; filter: blur(3px); }
            100% { opacity: 0.06; text-shadow: 0 0 10px rgba(43, 127, 255, 0.2); filter: blur(0px); }
          }
        `}
      </style>
      {/* Layer 1: Blueprint Grid & lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2B7FFF 1px, transparent 1px),
            linear-gradient(to bottom, #2B7FFF 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Layer 2: Network / Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <path className="animated-path" d="M -200,200 C 300,100 400,500 800,300 S 1200,600 1600,200" stroke="#2B7FFF" strokeWidth="1" fill="none" />
        <path className="animated-path-reverse" d="M 200,800 C 400,600 600,1000 1000,500 S 1400,200 1800,700" stroke="#8B5CF6" strokeWidth="1" fill="none" />
        {/* Additional circular nodes on path */}
        <circle cx="200" cy="150" r="3" fill="#2B7FFF" className="keyword-glow" style={{ animationDelay: '1s' }} />
        <circle cx="600" cy="400" r="4" fill="#2B7FFF" className="keyword-glow" style={{ animationDelay: '3s' }} />
        <circle cx="1000" cy="350" r="2" fill="#8B5CF6" className="keyword-glow" style={{ animationDelay: '2s' }} />
      </svg>

      {/* Layer 3: Cinematic blur orbs (blur radius scaled down on mobile GPUs) */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#2B7FFF]/10 blur-[70px] md:blur-[150px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#1a0b2e]/30 blur-[60px] md:blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] bg-[#8B5CF6]/5 blur-[60px] md:blur-[120px] rounded-full mix-blend-screen" />

      {/* Layer 4: Noise texture */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'}} />

      {/* Layer 5: Floating keywords */}
      <div className="absolute inset-0 overflow-hidden hidden md:block opacity-40 pointer-events-none">
        <div className="keyword-glow absolute top-[15%] right-[10%] text-[#2B7FFF] font-mono text-xs tracking-[0.3em] transform -rotate-12" style={{ animationDelay: '0s' }}>DESIGN THINKING</div>
        <div className="keyword-glow absolute top-[65%] right-[5%] text-[#2B7FFF] font-mono text-xs tracking-[0.2em] font-medium" style={{ animationDelay: '1.5s' }}>HEALTHTECH</div>
        <div className="keyword-glow absolute bottom-[20%] left-[8%] text-[#8B5CF6] font-mono text-xs tracking-[0.3em] font-medium transform -rotate-6" style={{ animationDelay: '3s' }}>DESIGN SYSTEMS</div>
        <div className="keyword-glow absolute top-[30%] left-[5%] text-[#2B7FFF] font-mono text-xs tracking-[0.3em]" style={{ animationDelay: '4.5s' }}>USER CENTERED</div>
        <div className="keyword-glow absolute bottom-[15%] right-[25%] text-[#2B7FFF] font-mono text-xs tracking-[0.2em] font-medium" style={{ animationDelay: '2s' }}>INNOVATION</div>
        <div className="keyword-glow absolute top-[45%] left-[8%] text-[#2B7FFF] font-mono text-xs tracking-[0.3em] transform rotate-3" style={{ animationDelay: '1s' }}>RESEARCH</div>
        <div className="keyword-glow absolute bottom-[35%] right-[20%] text-[#4192ff] font-mono text-xs tracking-[0.3em] transform -rotate-3" style={{ animationDelay: '5.5s' }}>PROBLEM SOLVING</div>
      </div>

      {/* Mobile-only ambient parallax layer (the floating keywords above are
          desktop-only via `hidden md:block`, so phones get this instead). */}
      <MobileAmbientBackground tint="blue" />
    </div>
  );
};
