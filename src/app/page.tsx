import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <header className="relative z-10 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-slate-800 pr-6">
              {/* Fallback to text if logos aren't in public dir yet */}
              <img src="/amrita-logo.png" alt="Amrita Vishwa Vidyapeetham" className="h-12 object-contain" />
              <img src="/tifac-logo.png" alt="TIFAC-CORE in Cyber Security" className="h-12 object-contain" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hidden sm:block">
              Cyber Achievement Portal
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-24 sm:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300 backdrop-blur-xl mb-8">
          <span className="flex h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></span>
          Official Achievement Management System
        </div>
        
        <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
          Manage your <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Cyber Security Achievements
          </span>
        </h2>
        
        <p className="mt-4 text-lg text-slate-400 max-w-2xl mb-10">
          A centralized, secure, and modern platform for the Cyber Security Department to record, verify, and manage student hackathons, CTFs, certifications, and more.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/login" className="px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]">
            Student Portal
          </Link>
          <Link href="/login" className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all border border-slate-700 hover:border-slate-600">
            Faculty Portal
          </Link>
        </div>
      </main>
    </div>
  );
}
