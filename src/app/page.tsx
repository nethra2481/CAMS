import Link from 'next/link';
import { Terminal, Lock } from 'lucide-react';

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');
        
        html, body { 
          background-color: #0d0d0d; 
          margin: 0; 
          padding: 0;
          height: 100%;
          overflow: hidden !important; 
          overscroll-behavior: none;
        }
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
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(192, 57, 43, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(192, 57, 43, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .ambient-glow {
          position: absolute;
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

        .typewriter h2 {
          overflow: hidden;
          border-right: .15em solid #c0392b;
          white-space: nowrap;
          margin: 0 auto;
          letter-spacing: .15em;
          animation: 
            typing 3.5s steps(40, end),
            blink-caret .75s step-end infinite;
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: #c0392b; }
        }
      `}</style>
      
      <div className="fixed inset-0 w-full h-[100dvh] bg-[#0d0d0d] font-rajdhani text-[#f0f0f0] selection:bg-[#c0392b]/30 scanlines overflow-hidden flex flex-col touch-none">
        <div className="grid-bg z-0" />
        <div className="ambient-glow ambient-1 z-0" />
        <div className="ambient-glow ambient-2 z-0" />

        {/* ── HEADER ── */}
        <header className="relative z-10 border-b border-[#c0392b]/20 bg-[#0d0d0d]/80 backdrop-blur-md shrink-0">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              
              {/* Amrita Logos */}
              <div className="flex items-center gap-4 border-r border-[#c0392b]/20 pr-6">
                <img src="/amrita-logo.png" alt="Amrita Vishwa Vidyapeetham" className="h-12 object-contain" />
                <img src="/tifac-logo.png" alt="TIFAC-CORE in Cyber Security" className="h-12 object-contain" />
              </div>

              {/* Orbital Logo & Title */}
              <div className="hidden sm:flex items-center gap-3">
                <h1 className="font-press-start text-xs tracking-wider mt-1 text-[#f0f0f0]">
                  CAMS <span className="text-[#c0392b]">PORTAL</span>
                </h1>
              </div>

            </div>
            <nav className="flex items-center gap-4">
              <Link href="/login" className="font-share-tech uppercase tracking-widest text-[#a85050] hover:text-[#c0392b] transition-colors border border-transparent hover:border-[#c0392b]/30 bg-transparent hover:bg-[#c0392b]/10 px-4 py-2 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" /> Initialize Login
              </Link>
            </nav>
          </div>
        </header>

        {/* ── MAIN HERO ── */}
        <main className="relative z-10 container mx-auto px-6 flex-1 flex flex-col items-center justify-center text-center">
          
          <div className="inline-flex items-center border border-[#c0392b]/30 bg-[#c0392b]/10 px-4 py-2 font-share-tech text-[#c0392b] text-xs uppercase tracking-[0.2em] mb-8 shadow-[0_0_20px_-5px_rgba(192,57,43,0.3)]">
            <span className="flex h-2 w-2 bg-[#c0392b] mr-3 animate-pulse shadow-[0_0_8px_rgba(192,57,43,0.8)]"></span>
            Encrypted Achievement Management System
          </div>
          
          <div className="relative mb-6">
            <div className="font-press-start text-3xl sm:text-4xl md:text-5xl tracking-widest leading-[1.6] text-[#f0f0f0] typewriter inline-block">
              <h2 className="pb-2">
                SECURE YOUR
              </h2>
            </div>
            <div className="font-press-start text-3xl sm:text-4xl md:text-5xl tracking-widest leading-[1.6] text-transparent bg-clip-text bg-gradient-to-r from-[#c0392b] via-[#e74c3c] to-[#9b2020] drop-shadow-[0_0_15px_rgba(192,57,43,0.4)] mt-4">
              ACHIEVEMENTS
            </div>
          </div>
          
          <p className="mt-6 text-lg md:text-xl text-[#8a8a8a] max-w-2xl mb-12 font-rajdhani font-medium tracking-wide flex items-center justify-center gap-3 mx-auto">
            <Terminal className="w-6 h-6 text-[#c0392b]" />
            A centralized, secure platform for the Cyber Security Department to log, verify, and showcase operations. Built for the next generation of operatives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md sm:max-w-none sm:justify-center">
            <Link href="/login?role=student" className="group relative px-8 py-4 bg-[#c0392b] hover:bg-[#a85050] text-white font-share-tech text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_-5px_rgba(192,57,43,0.5)] overflow-hidden flex items-center justify-center gap-2">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                Student Terminal <span className="text-xl leading-none transition-transform group-hover:translate-x-1">»</span>
              </span>
            </Link>
            <Link href="/login?role=faculty" className="group relative px-8 py-4 bg-transparent border border-[#c0392b]/50 hover:border-[#c0392b] text-[#c0392b] hover:text-white hover:bg-[#c0392b]/20 font-share-tech text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Faculty Access <span className="text-xl leading-none opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">»</span>
              </span>
            </Link>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className="relative z-10 border-t border-[#c0392b]/20 bg-[#0d0d0d]/80 backdrop-blur-md shrink-0">
          <div className="container mx-auto px-6 h-12 flex justify-between items-center text-[#4a4a4a] font-share-tech text-[10px] uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span>Amrita Vishwa Vidyapeetham</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">TIFAC-CORE In Cyber Security</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              STATUS: ONLINE
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
