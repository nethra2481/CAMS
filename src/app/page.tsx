import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* ── Global Styles for CTF Theme ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');
        
        body { background-color: #0d0d0d; }
        .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
        .font-share-tech { font-family: 'Share Tech Mono', monospace; }
        .font-press-start { font-family: 'Press Start 2P', monospace; }

        .scanlines::before {
          content: "";
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(192, 57, 43, 0.03) 2px,
            rgba(192, 57, 43, 0.03) 4px
          );
          pointer-events: none;
          z-index: 9999;
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(192, 57, 43, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(192, 57, 43, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .ambient-glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }
        .ambient-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(107, 15, 15, 0.35) 0%, transparent 70%);
          top: -200px;
          right: -200px;
          animation: float1 8s ease-in-out infinite;
        }
        .ambient-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(155, 32, 32, 0.2) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          animation: float2 10s ease-in-out infinite;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 20px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(0.9); }
        }
      `}</style>
      
      <div className="min-h-screen bg-[#0d0d0d] font-rajdhani text-[#f0f0f0] selection:bg-[#c0392b]/30 scanlines overflow-hidden relative">
        <div className="grid-bg z-0" />
        <div className="ambient-glow ambient-1 z-0" />
        <div className="ambient-glow ambient-2 z-0" />

        {/* ── HEADER ── */}
        <header className="relative z-10 border-b border-[#c0392b]/20 bg-[#0d0d0d]/80 backdrop-blur-md">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              
              {/* Amrita Logos */}
              <div className="flex items-center gap-4 border-r border-[#c0392b]/20 pr-6">
                <img src="/amrita-logo.png" alt="Amrita Vishwa Vidyapeetham" className="h-10 object-contain brightness-0 invert opacity-90" />
                <img src="/tifac-logo.png" alt="TIFAC-CORE in Cyber Security" className="h-10 object-contain brightness-0 invert opacity-90" />
              </div>

              {/* Orbital Logo & Title */}
              <div className="hidden sm:flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C0392B" />
                      <stop offset="100%" stopColor="#6B0F0F" />
                    </linearGradient>
                    <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#9B2020" />
                      <stop offset="100%" stopColor="#4a0a0a" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="100" cy="100" rx="90" ry="30" stroke="url(#g1)" strokeWidth="15" fill="none" transform="rotate(0 100 100)" opacity="0.9" />
                  <ellipse cx="100" cy="100" rx="90" ry="30" stroke="url(#g1)" strokeWidth="15" fill="none" transform="rotate(60 100 100)" opacity="0.85" />
                  <ellipse cx="100" cy="100" rx="90" ry="30" stroke="url(#g1)" strokeWidth="15" fill="none" transform="rotate(-60 100 100)" opacity="0.8" />
                  <polygon points="100,78 118,89 118,111 100,122 82,111 82,89" fill="url(#g2)" opacity="0.7" stroke="#9B2020" strokeWidth="2" />
                  <circle cx="100" cy="100" r="16" fill="#7a1a1a" opacity="0.95" />
                  <circle cx="100" cy="100" r="10" fill="#C0392B" opacity="0.7" />
                </svg>
                <h1 className="font-press-start text-xs tracking-wider mt-1 text-[#f0f0f0]">
                  CAMS <span className="text-[#c0392b]">PORTAL</span>
                </h1>
              </div>

            </div>
            <nav className="flex items-center gap-4">
              <Link href="/login" className="font-share-tech uppercase tracking-widest text-[#a85050] hover:text-[#c0392b] transition-colors border border-transparent hover:border-[#c0392b]/30 bg-transparent hover:bg-[#c0392b]/10 px-4 py-2 text-sm">
                Initialize Login
              </Link>
            </nav>
          </div>
        </header>

        {/* ── MAIN HERO ── */}
        <main className="relative z-10 container mx-auto px-6 py-24 sm:py-32 flex flex-col items-center text-center min-h-[calc(100vh-80px)] justify-center">
          
          <div className="inline-flex items-center border border-[#c0392b]/30 bg-[#c0392b]/10 px-4 py-2 font-share-tech text-[#c0392b] text-xs uppercase tracking-[0.2em] mb-10 shadow-[0_0_20px_-5px_rgba(192,57,43,0.3)]">
            <span className="flex h-2 w-2 bg-[#c0392b] mr-3 animate-pulse shadow-[0_0_8px_rgba(192,57,43,0.8)]"></span>
            Official Achievement Management System
          </div>
          
          <div className="relative mb-8">
            <h2 className="font-press-start text-4xl sm:text-5xl md:text-6xl tracking-widest leading-[1.4] text-[#f0f0f0]">
              <span className="block mb-4">SECURE YOUR</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0392b] via-[#e74c3c] to-[#9b2020] drop-shadow-[0_0_15px_rgba(192,57,43,0.4)]">
                ACHIEVEMENTS
              </span>
            </h2>
          </div>
          
          <p className="mt-6 text-lg md:text-xl text-[#8a8a8a] max-w-3xl mb-12 font-rajdhani font-medium tracking-wide">
            A centralized, secure platform for the Cyber Security Department to log, verify, and showcase hackathons, CTFs, and certifications. Built for the next generation of operatives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md sm:max-w-none sm:justify-center">
            <Link href="/login?role=student" className="group relative px-8 py-4 bg-[#c0392b] hover:bg-[#a85050] text-white font-share-tech text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_-5px_rgba(192,57,43,0.5)] overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                Student Terminal <span className="text-xl leading-none transition-transform group-hover:translate-x-1">»</span>
              </span>
            </Link>
            <Link href="/login?role=faculty" className="group relative px-8 py-4 bg-transparent border border-[#c0392b]/50 hover:border-[#c0392b] text-[#c0392b] hover:text-white hover:bg-[#c0392b]/20 font-share-tech text-sm uppercase tracking-widest transition-all">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Faculty Access <span className="text-xl leading-none opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">»</span>
              </span>
            </Link>
          </div>

          <div className="mt-24 pt-8 border-t border-[#c0392b]/20 w-full max-w-4xl flex justify-between items-center text-[#4a4a4a] font-share-tech text-[10px] uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span>Amrita Vishwa Vidyapeetham</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">TIFAC-CORE In Cyber Security</span>
            </div>
            <div>STATUS: ONLINE</div>
          </div>
        </main>
      </div>
    </>
  );
}
