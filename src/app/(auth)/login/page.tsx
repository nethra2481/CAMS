"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  delay: `${Math.random() * 5}s`,
  duration: `${4 + Math.random() * 6}s`,
  size: Math.random() > 0.5 ? "w-1 h-1" : "w-0.5 h-0.5",
}));

const STATS = [
  { label: "Students Tracked", value: "500+" },
  { label: "Achievements Logged", value: "2.4K+" },
  { label: "CTFs Verified", value: "180+" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

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

  return (
    <div className="min-h-screen flex bg-[#030712] overflow-hidden">

      {/* ── LEFT PANEL (branding) ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">

        {/* Animated mesh background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/60 via-slate-950 to-purple-950/40" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          {/* Floating particles */}
          {mounted && PARTICLES.map(p => (
            <div
              key={p.id}
              className={`absolute ${p.size} bg-cyan-400/40 rounded-full`}
              style={{
                left: p.left,
                top: p.top,
                animation: `float ${p.duration} ${p.delay} ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* Top logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">CAMS Portal</span>
          </div>
        </div>

        {/* Centre content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Amrita TIFAC-CORE · Cyber Security
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
              Cyber Achievement<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                Management System
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Centralised platform to record, verify, and celebrate department achievements — hackathons, CTFs, certifications and more.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-6">
            {STATS.map(s => (
              <div key={s.label} className="space-y-1">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom attribution */}
        <div className="relative z-10 text-slate-600 text-xs font-mono">
          © {new Date().getFullYear()} · Amrita Vishwa Vidyapeetham
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ──────────────────────────────── */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 relative">

        {/* Subtle radial glow behind form */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(6,182,212,0.04),transparent)] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">

          {/* Mobile header (visible only on small screens) */}
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
              <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
            </div>

            {/* Error alert */}
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

            {/* Register link */}
            <p className="text-center text-sm text-slate-500">
              New student?{" "}
              <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>

          {/* Security badge */}
          <p className="text-center text-xs text-slate-700 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" />
            Secured with end-to-end encryption
          </p>
        </div>
      </div>

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); opacity: 0.4; }
          to   { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
