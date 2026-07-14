"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Terminal, ArrowLeft } from "lucide-react";

const LOG_LINES = [
  { type: "ok",   text: "[+] TLS 1.3 handshake complete" },
  { type: "info", text: "[*] Scanning port 443... OPEN" },
  { type: "warn", text: "[!] Brute-force attempt blocked: 192.168.4.21" },
  { type: "ok",   text: "[+] CTF flag captured: flag{r3v3rs3_3ng1n33r}" },
  { type: "info", text: "[*] Packet analysis: 2,048 packets inspected" },
  { type: "ok",   text: "[+] SQL injection payload neutralised" },
  { type: "warn", text: "[!] Anomaly detected in auth logs" },
  { type: "ok",   text: "[+] XSS vector sanitized successfully" },
  { type: "info", text: "[*] AES-256 key rotation complete" },
  { type: "ok",   text: "[+] Privilege escalation attempt denied" },
  { type: "info", text: "[*] OWASP Top-10 audit: 0 critical issues" },
  { type: "warn", text: "[!] Suspicious payload in POST /api/login" },
  { type: "ok",   text: "[+] CVE-2024-1337 patch applied" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState("student");
  const [termLines, setTermLines] = useState<typeof LOG_LINES>([]);
  const termRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => { 
    setMounted(true); 
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("role") === "faculty") {
        setRole("faculty");
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let idx = 0;
    const tick = () => {
      setTermLines(prev => {
        const next = [...prev, LOG_LINES[idx % LOG_LINES.length]];
        return next.length > 5 ? next.slice(-5) : next;
      });
      idx++;
    };
    tick();
    const id = setInterval(tick, 2000);
    return () => clearInterval(id);
  }, [mounted]);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [termLines]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { redirect: false, email, password });
    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push(role === "faculty" ? "/faculty" : "/student");
    }
  };

  // Color theme definitions based on role
  const isFaculty = role === "faculty";
  const primaryColor = isFaculty ? "#0ea5e9" : "#c0392b"; // cyan vs crimson
  const primaryDark = isFaculty ? "#0284c7" : "#9b2020";
  const primaryDarkest = isFaculty ? "#0369a1" : "#6b0f0f";
  const primaryMuted = isFaculty ? "#38bdf8" : "#a85050";
  const primaryHighlight = isFaculty ? "#7dd3fc" : "#e05a4a";

  const logColor = (t: string) => t === "ok" ? `text-[${primaryColor}]` : t === "warn" ? "text-amber-500" : `text-[${primaryMuted}]`;

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');
        
        body {
          background-color: #0d0d0d;
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
            rgba(${isFaculty ? '14, 165, 233' : '192, 57, 43'}, 0.03) 2px,
            rgba(${isFaculty ? '14, 165, 233' : '192, 57, 43'}, 0.03) 4px
          );
          pointer-events: none;
          z-index: 9999;
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(${isFaculty ? '14, 165, 233' : '192, 57, 43'}, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(${isFaculty ? '14, 165, 233' : '192, 57, 43'}, 0.04) 1px, transparent 1px);
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
          background: radial-gradient(circle, rgba(${isFaculty ? '2, 132, 199' : '107, 15, 15'}, 0.35) 0%, transparent 70%);
          top: -200px;
          right: -200px;
          animation: float1 8s ease-in-out infinite;
        }
        .ambient-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(${isFaculty ? '3, 105, 161' : '155, 32, 32'}, 0.2) 0%, transparent 70%);
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
      
      <div className="min-h-screen flex flex-col items-center justify-center scanlines font-rajdhani text-[#f0f0f0] relative overflow-hidden bg-[#0d0d0d]">
        <div className="grid-bg z-0" />
        <div className="ambient-glow ambient-1 z-0" />
        <div className="ambient-glow ambient-2 z-0" />

        {/* ── TOP NAV / BACK BUTTON ── */}
        <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center">
          <Link href="/" className={`flex items-center gap-2 font-share-tech uppercase tracking-widest text-sm transition-colors text-[${primaryMuted}] hover:text-[${primaryColor}]`}>
            <ArrowLeft className="w-4 h-4" /> Return to Base
          </Link>
        </div>

        <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-center justify-between p-6 mt-10 lg:mt-0">
          
          {/* ── LEFT PANEL (Branding) ── */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            <div className="flex flex-col items-center lg:items-start gap-4">
              <svg width="140" height="140" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 15px ${primaryColor}60)` }}>
                <defs>
                  <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={primaryColor} />
                    <stop offset="100%" stopColor={primaryDarkest} />
                  </linearGradient>
                  <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={primaryDark} />
                    <stop offset="100%" stopColor="#4a0a0a" />
                  </linearGradient>
                </defs>
                <ellipse cx="100" cy="100" rx="90" ry="30" stroke="url(#g1)" strokeWidth="11" fill="none" transform="rotate(0 100 100)" opacity="0.9" />
                <ellipse cx="100" cy="100" rx="90" ry="30" stroke="url(#g1)" strokeWidth="11" fill="none" transform="rotate(60 100 100)" opacity="0.85" />
                <ellipse cx="100" cy="100" rx="90" ry="30" stroke="url(#g1)" strokeWidth="11" fill="none" transform="rotate(-60 100 100)" opacity="0.8" />
                <polygon points="100,78 118,89 118,111 100,122 82,111 82,89" fill="url(#g2)" opacity="0.7" stroke={primaryDark} strokeWidth="2" />
                <circle cx="100" cy="100" r="16" fill="#7a1a1a" opacity="0.95" />
                <circle cx="100" cy="100" r="10" fill={primaryColor} opacity="0.7" />
                <circle cx="100" cy="100" r="5" fill={primaryHighlight} opacity="0.9" />
              </svg>

              <div>
                <h1 className="font-press-start text-3xl md:text-5xl tracking-widest text-[#f0f0f0] mt-4 mb-2">
                  CAMS <span style={{ color: primaryColor }}>PORTAL</span>
                </h1>
                <p className="font-share-tech tracking-[0.3em] text-sm uppercase" style={{ color: primaryMuted }}>Amrita TIFAC-CORE · {new Date().getFullYear()}</p>
              </div>
            </div>

            <p className="text-[#8a8a8a] max-w-sm text-lg leading-relaxed">
              Log your hackathons, CTFs, certifications and research. Prove your skills and build your placement-ready portfolio.
            </p>

            <div className="w-full max-w-sm border bg-[#141414]/80 backdrop-blur-sm p-4 relative" style={{ borderColor: `${primaryColor}4d` }}>
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primaryColor }} />
              <div className="flex items-center gap-2 mb-2 font-share-tech text-xs uppercase tracking-widest" style={{ color: primaryColor }}>
                <Terminal className="w-4 h-4" /> root@cams-soc:~#
              </div>
              <div ref={termRef} className="font-share-tech text-xs space-y-1 h-20 overflow-hidden text-[#8a8a8a]">
                {termLines.map((line, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span style={{ color: line.type === 'ok' ? primaryColor : line.type === 'warn' ? '#f59e0b' : primaryMuted }}>{line.text}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1" style={{ color: primaryColor }}>
                  <span>_</span>
                  <span className="w-2 h-3 animate-pulse" style={{ backgroundColor: primaryColor }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL (Login) ── */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-[#141414]/90 border p-8 relative backdrop-blur-md" style={{ borderColor: `${primaryColor}66`, boxShadow: `0 0 40px -10px ${primaryColor}4d` }}>
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: primaryColor }} />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: primaryColor }} />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: primaryColor }} />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: primaryColor }} />

              <div className="text-center mb-8">
                <h2 className="font-share-tech text-2xl text-white uppercase tracking-widest mb-1">
                  {role === "faculty" ? "Faculty Terminal" : "Student Terminal"}
                </h2>
                <p className="text-sm font-share-tech uppercase tracking-widest" style={{ color: primaryMuted }}>Authenticate to continue</p>
              </div>

              {error && (
                <div className="mb-6 flex items-start gap-3 text-sm p-3 border" style={{ color: primaryColor, backgroundColor: `${primaryColor}1a`, borderColor: `${primaryColor}4d` }}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-share-tech uppercase">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-share-tech text-[#8a8a8a] uppercase tracking-widest">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a] transition-colors group-focus-within:text-current" style={{ color: "inherit" }} />
                    <input
                      id="email"
                      type="email"
                      placeholder={role === "faculty" ? "faculty@cb.amrita.edu" : "rollnumber@cb.students.amrita.edu"}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#0d0d0d] border border-[#333] text-white text-sm pl-10 pr-4 py-3 outline-none transition-colors font-share-tech focus-within-border-primary"
                    />
                    {/* Inline style to handle focus border color */}
                    <style>{`
                      #email:focus, #password:focus { border-color: ${primaryColor}; }
                      .group:focus-within svg { color: ${primaryColor} !important; }
                    `}</style>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-xs font-share-tech text-[#8a8a8a] uppercase tracking-widest">
                      Password
                    </label>
                    <Link href="/reset-password" className="text-[10px] font-share-tech uppercase tracking-widest transition-colors hover-text-primary" style={{ color: primaryMuted }}>
                      Recover Key?
                    </Link>
                    <style>{`.hover-text-primary:hover { color: ${primaryColor} !important; }`}</style>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a] transition-colors" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-full bg-[#0d0d0d] border border-[#333] text-white text-sm pl-10 pr-10 py-3 outline-none transition-colors font-share-tech"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] transition-colors hover-text-primary"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-share-tech uppercase tracking-widest py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 hover-bg-primary"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? (
                    "Authenticating..."
                  ) : (
                    <>Initialize <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <style>{`.hover-bg-primary:hover { background-color: ${primaryMuted} !important; }`}</style>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs font-share-tech text-[#8a8a8a] uppercase tracking-widest">
                  New Operative? <Link href="/register" className="transition-colors hover-text-highlight" style={{ color: primaryColor }}>Register</Link>
                </p>
                <style>{`.hover-text-highlight:hover { color: ${primaryHighlight} !important; }`}</style>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
