"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Terminal } from "lucide-react";

// ── Cybersecurity terminal log lines ──────────────────────
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
  { type: "info", text: "[*] Nmap scan finished: 3 open ports" },
  { type: "ok",   text: "[+] Reverse shell blocked at firewall" },
];

const STATS = [
  { label: "Students Tracked", value: "500+" },
  { label: "CTFs Completed",   value: "180+" },
  { label: "Achievements",     value: "2.4K+" },
  { label: "Certs Verified",   value: "340+" },
];

const SKILLS = ["Penetration Testing", "Reverse Engineering", "Network Security", "Malware Analysis", "OSINT", "Cryptography", "Web Exploitation", "Forensics"];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  top:  `${(i * 53 + 7)  % 100}%`,
  delay: `${(i * 0.4).toFixed(1)}s`,
  dur:   `${4 + (i % 4)}s`,
  sm:    i % 3 === 0,
}));

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [termLines, setTermLines] = useState<typeof LOG_LINES>([]);
  const [skillIdx, setSkillIdx] = useState(0);
  const termRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  // Drip log lines into the terminal
  useEffect(() => {
    if (!mounted) return;
    let idx = 0;
    const tick = () => {
      setTermLines(prev => {
        const next = [...prev, LOG_LINES[idx % LOG_LINES.length]];
        return next.length > 10 ? next.slice(-10) : next;
      });
      idx++;
    };
    tick();
    const id = setInterval(tick, 1800);
    return () => clearInterval(id);
  }, [mounted]);

  // Auto-scroll terminal
  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [termLines]);

  // Rotate skill badge
  useEffect(() => {
    const id = setInterval(() => setSkillIdx(i => (i + 1) % SKILLS.length), 2500);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { redirect: false, email, password });
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const logColor = (type: string) =>
    type === "ok"   ? "text-emerald-400" :
    type === "warn" ? "text-amber-400"   :
                     "text-cyan-400";

  return (
    <div className="min-h-screen flex bg-[#030712] overflow-hidden">

      {/* ── LEFT PANEL ────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden">

        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-slate-950 to-purple-950/30" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.07]" />
        <div className="absolute top-1/4  left-1/4  w-72 h-72 bg-cyan-500/8   rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Particles */}
        {mounted && PARTICLES.map(p => (
          <div
            key={p.id}
            className={`absolute ${p.sm ? "w-0.5 h-0.5" : "w-1 h-1"} bg-cyan-400/30 rounded-full`}
            style={{ left: p.left, top: p.top, animation: `floatPt ${p.dur} ${p.delay} ease-in-out infinite alternate` }}
          />
        ))}

        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-white font-bold tracking-tight">CAMS · Amrita TIFAC-CORE</span>
        </div>

        {/* Middle: Hero + terminal */}
        <div className="relative z-10 space-y-8">

          {/* Rotating skill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="transition-all duration-500">{SKILLS[skillIdx]}</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
              Cyber Security<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                Achievement Hub
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Log your hackathons, CTFs, certifications and research. Get verified by faculty. Build your placement-ready portfolio.
            </p>
          </div>

          {/* ── Live terminal ── */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-950/80 overflow-hidden shadow-[0_0_40px_-15px_rgba(6,182,212,0.2)] backdrop-blur">
            {/* Terminal titlebar */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-800 bg-slate-900/60">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-amber-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div className="flex items-center gap-1.5 ml-3 text-slate-500 text-xs font-mono">
                <Terminal className="w-3 h-3" />
                cams-soc — live feed
              </div>
            </div>
            {/* Terminal body */}
            <div ref={termRef} className="p-4 h-44 overflow-hidden font-mono text-xs space-y-1.5">
              {termLines.map((line, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 ${logColor(line.type)} opacity-0`}
                  style={{ animation: `fadeUp 0.4s ease forwards` }}
                >
                  <span className="text-slate-600 shrink-0 select-none">
                    {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                  <span>{line.text}</span>
                </div>
              ))}
              {/* Blinking cursor */}
              <div className="flex items-center gap-1 text-cyan-400 font-mono text-xs">
                <span className="text-slate-600">$</span>
                <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-slate-700 text-xs font-mono">
          © {new Date().getFullYear()} · Amrita Vishwa Vidyapeetham · Coimbatore
        </div>
      </div>

      {/* ── RIGHT PANEL ───────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(6,182,212,0.04),transparent)] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">

          {/* Mobile header */}
          <div className="lg:hidden text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">CAMS Portal</h2>
            <p className="text-slate-500 text-sm">Amrita TIFAC-CORE · Cyber Security</p>
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
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@cb.amrita.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
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
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full h-12 pl-10 pr-11 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_-5px_rgba(6,182,212,0.6)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
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
            <Lock className="w-3 h-3" />
            End-to-end encrypted · AES-256
          </p>
        </div>
      </div>

      <style>{`
        @keyframes floatPt {
          from { transform: translateY(0px);    opacity: 0.3; }
          to   { transform: translateY(-18px);  opacity: 0.7; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}
