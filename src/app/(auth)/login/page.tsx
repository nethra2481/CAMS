"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ShieldCheck, Fingerprint, Lock, TerminalSquare, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
      {/* Cyber Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none"></div>
      
      {/* Decorative floating elements */}
      <div className="absolute top-1/4 left-10 text-cyan-500/20 opacity-50 blur-[1px] animate-pulse">
        <TerminalSquare className="w-24 h-24" />
      </div>
      <div className="absolute bottom-1/4 right-10 text-purple-500/20 opacity-50 blur-[1px] animate-pulse" style={{ animationDelay: '1s' }}>
        <Fingerprint className="w-32 h-32" />
      </div>

      <Card className="w-full max-w-md z-10 bg-slate-950/80 border-cyan-900/50 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(6,182,212,0.2)] relative overflow-hidden">
        {/* Top glowing line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        
        <CardHeader className="space-y-1 text-center pt-8">
          <Link href="/">
            <div className="mx-auto bg-slate-900 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/30 shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] relative group overflow-hidden">
              <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors"></div>
              <ShieldCheck className="w-10 h-10 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
            Cyber Sec Portal
          </CardTitle>
          <CardDescription className="text-slate-400 font-mono text-xs uppercase tracking-widest mt-2">
            Secure Authentication Required
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit} className="px-2">
          <CardContent className="space-y-5">
            {error && (
              <div className="flex items-center text-sm font-medium text-red-400 bg-red-950/50 p-3 rounded-lg border border-red-900/50">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-2 relative group">
              <Label htmlFor="email" className="text-slate-300 text-xs font-mono tracking-wider uppercase flex items-center">
                User Identification
              </Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="user@college.edu" 
                  className="bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-500 pl-10 transition-colors h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TerminalSquare className="w-4 h-4 text-slate-500 absolute left-3 top-4 group-focus-within:text-cyan-400 transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2 relative group">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300 text-xs font-mono tracking-wider uppercase">
                  Passkey
                </Label>
                <Link href="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  Forgot passkey?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-500 pl-10 transition-colors h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-4 group-focus-within:text-cyan-400 transition-colors" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-5 pb-8 pt-4">
            <Button 
              type="submit" 
              className="w-full bg-cyan-600/90 hover:bg-cyan-500 text-white font-semibold transition-all h-12 shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.6)]"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Initialize Session"}
            </Button>
            <div className="text-sm text-center text-slate-400">
              Unregistered operative? <Link href="/register" className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium transition-colors">Request access</Link>.
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
