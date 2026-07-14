"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 hidden md:block backdrop-blur-md">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CAP
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          {session.user?.role === "STUDENT" && (
            <>
              <Link href="/student" className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors">Dashboard</Link>
              <Link href="/student/profile" className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors">My Profile</Link>
              <Link href="/student/add" className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors text-cyan-400">Add Achievement</Link>
            </>
          )}
          {session.user?.role === "FACULTY" && (
            <>
              <Link href="/faculty" className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors">Overview</Link>
              <Link href="/faculty/students" className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors">Student Directory</Link>
              <Link href="/faculty/alumni" className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors">Alumni Directory</Link>
              <Link href="/faculty/approvals" className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors text-cyan-400">Pending Approvals</Link>
              <Link href="/faculty/templates" className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors text-purple-400">Form Templates</Link>
            </>
          )}
          {session.user?.role === "ADMIN" && (
            <>
              <Link href="/admin/users" className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors text-purple-400">Manage Users</Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-end px-8 shrink-0">
           <div className="flex items-center gap-4">
             <div className="text-sm">
               <span className="text-slate-400">Logged in as </span>
               <span className="font-semibold text-cyan-400">{session.user?.name || session.user?.email}</span>
             </div>
             <Button variant="outline" onClick={() => signOut()} className="border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300">
               Sign Out
             </Button>
           </div>
        </header>
        <div className="p-8 flex-1 overflow-auto bg-slate-950 relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none"></div>
          <div className="relative z-10 max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
