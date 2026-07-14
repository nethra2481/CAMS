"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerStudent } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await registerStudent(formData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/login?registered=true");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 py-12">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <Card className="w-full max-w-xl z-10 bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <Link href="/login" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
          <div className="pt-6">
            <Link href="/">
              <div className="mx-auto bg-cyan-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-cyan-500/20">
                <span className="text-2xl font-bold text-cyan-400">C</span>
              </div>
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Student Registration
          </CardTitle>
          <CardDescription className="text-slate-400">
            Join the Cyber Achievement Portal
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="text-sm font-medium text-red-500 text-center bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="e.g. John Doe" 
                  className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">College Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="roll.no@cb.students.amrita.edu" 
                  className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500"
                  required
                />
                <p className="text-[10px] text-slate-500">Must be a @cb.students.amrita.edu email</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative group">
                  <Input 
                    id="password" 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-slate-300">Department</Label>
                <select id="department" name="department" required className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="text-slate-300">Year</Label>
                <select id="year" name="year" required className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="section" className="text-slate-300">Section</Label>
                <Input 
                  id="section" 
                  name="section"
                  placeholder="e.g. A, B, C" 
                  className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500 uppercase"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-slate-800 mt-4">
            <Button 
              type="submit" 
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)]"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? "Creating Account..." : "Register Now"}
            </Button>
            <div className="text-sm text-center text-slate-400">
              Already have an account? <Link href="/login" className="text-cyan-400 hover:underline">Sign In here</Link>.
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
