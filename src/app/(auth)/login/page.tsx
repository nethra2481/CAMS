"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Terminal } from "lucide-react";

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
  const [termLines, setTermLines] = useState<typeof LOG_LINES>([]);
  const termRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

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
      router.push("/dashboard");
    }
  };

  const logColor = (t: string) => t === "ok" ? "text-[#c0392b]" : t === "warn" ? "text-amber-500" : "text-[#a85050]";

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
      
      <div className="min-h-screen flex items-center justify-center scanlines font-rajdhani text-[#f0f0f0] relative overflow-hidden bg-[#0d0d0d]">
        <div className="grid-bg z-0" />
        <div className="ambient-glow ambient-1 z-0" />
        <div className="ambient-glow ambient-2 z-0" />

        <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-center justify-between p-6">
          
          {/* ── LEFT PANEL (Branding) ── */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            <div className="flex flex-col items-center lg:items-start gap-4">
              <svg width="140" height="140" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(192,57,43,0.6)]">
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
                <ellipse cx="100" cy="100" rx="90" ry="30" stroke="url(#g1)" strokeWidth="11" fill="none" transform="rotate(0 100 100)" opacity="0.9" />
                <ellipse cx="100" cy="100" rx="90" ry="30" stroke="url(#g1)" strokeWidth="11" fill="none" transform="rotate(60 100 100)" opacity="0.85" />
                <ellipse cx="100" cy="100" rx="90" ry="30" stroke="url(#g1)" strokeWidth="11" fill="none" transform="rotate(-60 100 100)" opacity="0.8" />
                <polygon points="100,78 118,89 118,111 100,122 82,111 82,89" fill="url(#g2)" opacity="0.7" stroke="#9B2020" strokeWidth="2" />
                <circle cx="100" cy="100" r="16" fill="#7a1a1a" opacity="0.95" />
                <circle cx="100" cy="100" r="10" fill="#C0392B" opacity="0.7" />
                <circle cx="100" cy="100" r="5" fill="#e05a4a" opacity="0.9" />
              </svg>

              <div>
                <h1 className="font-press-start text-3xl md:text-5xl tracking-widest text-[#f0f0f0] mt-4 mb-2">
                  CAMS <span className="text-[#c0392b]">PORTAL</span>
                </h1>
                <p className="font-share-tech text-[#a85050] tracking-[0.3em] text-sm uppercase">Amrita TIFAC-CORE · {new Date().getFullYear()}</p>
              </div>
            </div>

            <p className="text-[#8a8a8a] max-w-sm text-lg leading-relaxed">
              Log your hackathons, CTFs, certifications and research. Prove your skills and build your placement-ready portfolio.
            </p>

            <div className="w-full max-w-sm border border-[#c0392b]/30 bg-[#141414]/80 backdrop-blur-sm p-4 relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#c0392b]" />
              <div className="flex items-center gap-2 mb-2 text-[#c0392b] font-share-tech text-xs uppercase tracking-widest">
                <Terminal className="w-4 h-4" /> root@cams-soc:~#
              </div>
              <div ref={termRef} className="font-share-tech text-xs space-y-1 h-20 overflow-hidden text-[#8a8a8a]">
                {termLines.map((line, i) => (
                  <div key={i} className={`flex items-start gap-2 ${logColor(line.type)}`}>
                    <span>{line.text}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1 text-[#c0392b]">
                  <span>_</span>
                  <span className="w-2 h-3 bg-[#c0392b] animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL (Login) ── */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-[#141414]/90 border border-[#c0392b]/40 p-8 relative shadow-[0_0_40px_-10px_rgba(192,57,43,0.3)] backdrop-blur-md">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#c0392b]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#c0392b]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#c0392b]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#c0392b]" />

              <div className="text-center mb-8">
                <h2 className="font-share-tech text-2xl text-white uppercase tracking-widest mb-1">System Login</h2>
                <p className="text-[#a85050] text-sm font-share-tech uppercase tracking-widest">Authenticate to continue</p>
              </div>

              {error && (
                <div className="mb-6 flex items-start gap-3 text-sm text-[#c0392b] bg-[#c0392b]/10 border border-[#c0392b]/30 p-3">
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
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a] group-focus-within:text-[#c0392b] transition-colors" />
                    <input
                      id="email"
                      type="email"
                      placeholder="user@cb.amrita.edu"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#0d0d0d] border border-[#333] focus:border-[#c0392b] text-white text-sm pl-10 pr-4 py-3 outline-none transition-colors font-share-tech"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-xs font-share-tech text-[#8a8a8a] uppercase tracking-widest">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-[10px] font-share-tech text-[#a85050] hover:text-[#c0392b] uppercase tracking-widest transition-colors">
                      Recover Key?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a] group-focus-within:text-[#c0392b] transition-colors" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-full bg-[#0d0d0d] border border-[#333] focus:border-[#c0392b] text-white text-sm pl-10 pr-10 py-3 outline-none transition-colors font-share-tech"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#c0392b] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#c0392b] hover:bg-[#a85050] text-white font-share-tech uppercase tracking-widest py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    "Authenticating..."
                  ) : (
                    <>Initialize <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs font-share-tech text-[#8a8a8a] uppercase tracking-widest">
                  New Operative? <Link href="/register" className="text-[#c0392b] hover:text-[#e74c3c] transition-colors">Register</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
