"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff,
  Terminal, Globe, Key, Cpu, Search, Wifi, Code2, Bug, Fingerprint,
  Binary, BookOpen, Zap, ShieldAlert,
} from "lucide-react";

// ── CTF Category badges ────────────────────────────────────
const CTF_CATS = [
  { icon: Globe,       label: "Web",        color: "from-blue-500   to-cyan-500",   glow: "rgba(6,182,212,0.4)"    },
  { icon: Key,         label: "Crypto",     color: "from-amber-500  to-yellow-400", glow: "rgba(245,158,11,0.4)"   },
  { icon: Cpu,         label: "Rev",        color: "from-purple-500 to-violet-400", glow: "rgba(139,92,246,0.4)"   },
  { icon: Terminal,    label: "Pwn",        color: "from-red-500    to-rose-400",   glow: "rgba(239,68,68,0.4)"    },
  { icon: Search,      label: "Forensics",  color: "from-emerald-500 to-green-400", glow: "rgba(16,185,129,0.4)"   },
  { icon: Wifi,        label: "Network",    color: "from-sky-500    to-blue-400",   glow: "rgba(14,165,233,0.4)"   },
  { icon: Code2,       label: "Web3",       color: "from-orange-500 to-amber-400",  glow: "rgba(249,115,22,0.4)"   },
  { icon: Bug,         label: "Bug Bounty", color: "from-pink-500   to-rose-400",   glow: "rgba(236,72,153,0.4)"   },
  { icon: Fingerprint, label: "OSINT",      color: "from-teal-500   to-cyan-400",   glow: "rgba(20,184,166,0.4)"   },
  { icon: Binary,      label: "Binary",     color: "from-lime-500   to-green-400",  glow: "rgba(132,204,22,0.4)"   },
  { icon: BookOpen,    label: "Misc",       color: "from-slate-400  to-slate-300",  glow: "rgba(148,163,184,0.3)"  },
  { icon: Zap,         label: "Hardware",   color: "from-yellow-400 to-orange-400", glow: "rgba(251,191,36,0.4)"   },
];

// ── Log lines ──────────────────────────────────────────────
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
  { type: "ok",   text: "[+] CVE-2024-1337 patch applied" },
  { type: "info", text: "[*] Nmap scan finished: 3 open ports" },
  { type: "warn", text: "[!] Suspicious payload in POST /api/login" },
  { type: "ok",   text: "[+] Reverse shell blocked at firewall" },
];

const SKILLS = ["Penetration Testing","Reverse Engineering","Network Security","Malware Analysis","OSINT","Cryptography","Web Exploitation","Forensics"];

const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i, left: `${(i * 37 + 11) % 100}%`, top: `${(i * 53 + 7) % 100}%`,
  delay: `${(i * 0.4).toFixed(1)}s`, dur: `${4 + (i % 4)}s`, sm: i % 3 === 0,
}));

// Hex clip path (pointy-top)
const HEX = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

export default function LoginPage() {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPass] = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [termLines, setTermLines]   = useState<typeof LOG_LINES>([]);
  const [skillIdx, setSkillIdx]     = useState(0);
  const [activeHex, setActiveHex]   = useState<number | null>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const router  = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    let idx = 0;
    const tick = () => {
      setTermLines(prev => {
        const next = [...prev, LOG_LINES[idx % LOG_LINES.length]];
        return next.length > 8 ? next.slice(-8) : next;
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

  useEffect(() => {
    const id = setInterval(() => setSkillIdx(i => (i + 1) % SKILLS.length), 2500);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { redirect: false, email, password });
    if (res?.error) { setError("Invalid email or password."); setLoading(false); }
    else router.push("/dashboard");
  };

  const logColor = (t: string) => t === "ok" ? "text-emerald-400" : t === "warn" ? "text-amber-400" : "text-cyan-400";

  return (
    <div className="min-h-screen flex bg-[#030712] overflow-hidden">

      {/* ══ LEFT PANEL ══════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[58%] relative flex-col justify-between p-10 overflow-hidden">

        {/* BG layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-slate-950 to-purple-950/30" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.06]" />
        <div className="absolute top-1/4  left-1/4  w-72 h-72 bg-cyan-500/8   rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

        {mounted && PARTICLES.map(p => (
          <div key={p.id} className={`absolute ${p.sm ? "w-0.5 h-0.5" : "w-1 h-1"} bg-cyan-400/25 rounded-full`}
            style={{ left: p.left, top: p.top, animation: `floatPt ${p.dur} ${p.delay} ease-in-out infinite alternate` }} />
        ))}

        {/* ── Top logo ── */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Skull-style CTF logo */}
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <p className="text-white font-bold tracking-tight text-sm leading-none">CAMS · TIFAC-CORE</p>
            <p className="text-cyan-500/70 font-mono text-[10px] mt-0.5">Amrita Vishwa Vidyapeetham</p>
          </div>
        </div>

        {/* ── Middle ── */}
        <div className="relative z-10 space-y-7">

          {/* Skill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {SKILLS[skillIdx]}
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight mb-2">
              Cyber Security<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                Achievement Hub
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Log your hackathons, CTFs, certs and research — verified by faculty, showcased to the world.
            </p>
          </div>

          {/* ── CTF CATEGORY HEX GRID ── */}
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldAlert className="w-3 h-3 text-cyan-500" /> Challenge Categories
            </p>
            <div className="grid grid-cols-6 gap-2">
              {CTF_CATS.map((cat, i) => {
                const Icon = cat.icon;
                const isActive = activeHex === i;
                return (
                  <div
                    key={cat.label}
                    onMouseEnter={() => setActiveHex(i)}
                    onMouseLeave={() => setActiveHex(null)}
                    className="flex flex-col items-center gap-1.5 cursor-default group"
                  >
                    {/* Hexagon badge */}
                    <div className="relative w-12 h-14 flex items-center justify-center transition-all duration-300"
                      style={{ filter: isActive ? `drop-shadow(0 0 8px ${cat.glow})` : undefined }}>
                      {/* Hex background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-${isActive ? '20' : '10'} transition-opacity duration-300`}
                        style={{ clipPath: HEX }}
                      />
                      {/* Hex border */}
                      <div
                        className="absolute inset-0 border border-white/10"
                        style={{ clipPath: HEX, background: "transparent" }}
                      />
                      {/* Hex border glow on hover */}
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}
                        style={{
                          clipPath: HEX,
                          background: `linear-gradient(135deg, ${cat.glow.replace("0.4", "0.3")}, transparent)`,
                          border: `1px solid ${cat.glow}`,
                        }}
                      />
                      <Icon className={`w-5 h-5 relative z-10 transition-all duration-300 bg-gradient-to-br ${cat.color} bg-clip-text text-transparent
                        ${isActive ? "scale-110" : ""}`}
                        style={{ color: isActive ? "white" : undefined }}
                      />
                    </div>
                    <span className={`text-[9px] font-mono uppercase tracking-wide transition-colors duration-200
                      ${isActive ? "text-white" : "text-slate-600"}`}>
                      {cat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Live terminal ── */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-950/90 overflow-hidden shadow-[0_0_30px_-12px_rgba(6,182,212,0.2)] backdrop-blur">
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/80 bg-slate-900/50">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              <div className="flex items-center gap-1.5 ml-3 text-slate-500 text-[10px] font-mono">
                <Terminal className="w-3 h-3" />
                cams-soc — live threat feed
              </div>
            </div>
            <div ref={termRef} className="p-3 h-36 overflow-hidden font-mono text-[10px] space-y-1">
              {termLines.map((line, i) => (
                <div key={i} className={`flex items-start gap-2 ${logColor(line.type)}`}
                  style={{ animation: "fadeUp 0.35s ease forwards", opacity: 0 }}>
                  <span className="text-slate-700 shrink-0">
                    {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                  <span>{line.text}</span>
                </div>
              ))}
              <div className="flex items-center gap-1 text-cyan-400 text-[10px] font-mono">
                <span className="text-slate-700">$</span>
                <span className="w-1.5 h-3.5 bg-cyan-400 animate-pulse inline-block" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-slate-700 text-[10px] font-mono">
          © {new Date().getFullYear()} · Amrita Vishwa Vidyapeetham · Coimbatore
        </div>
      </div>

      {/* ══ RIGHT PANEL ═════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(6,182,212,0.04),transparent)] pointer-events-none" />

        <div className="w-full max-w-md space-y-7 relative z-10">

          {/* Mobile header */}
          <div className="lg:hidden text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">CAMS Portal</h2>
            {/* Mobile mini hex grid */}
            <div className="flex justify-center gap-2 pt-2 flex-wrap">
              {CTF_CATS.slice(0, 6).map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.label} className="w-9 h-10 flex items-center justify-center relative"
                    style={{ filter: `drop-shadow(0 0 4px ${cat.glow})` }}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-15`} style={{ clipPath: HEX }} />
                    <Icon className="w-4 h-4 text-white/60 relative z-10" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form card */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 shadow-[0_0_60px_-15px_rgba(6,182,212,0.15)] backdrop-blur-xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-slate-400 text-sm">Sign in to your secure portal</p>
            </div>

            {error && (
              <div className="flex items-start gap-3 text-sm text-red-400 bg-red-950/40 px-4 py-3 rounded-xl border border-red-900/50">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-200" />
                  <input id="email" type="email" autoComplete="email" placeholder="you@cb.amrita.edu"
                    value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-200" />
                  <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password"
                    placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full h-12 pl-10 pr-11 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition-all duration-200"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="group w-full h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_-5px_rgba(6,182,212,0.6)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500">
              New student?{" "}
              <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-700 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" /> End-to-end encrypted · AES-256
          </p>
        </div>
      </div>

      <style>{`
        @keyframes floatPt {
          from { transform: translateY(0px);   opacity: 0.25; }
          to   { transform: translateY(-16px); opacity: 0.65; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}
