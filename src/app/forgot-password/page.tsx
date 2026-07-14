"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/app/actions/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await requestPasswordReset(formData);
    
    setLoading(false);
    
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-900/20 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-2xl mb-4 shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]">
            <ShieldAlert className="w-8 h-8 text-cyan-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Reset Password</h1>
          <p className="text-slate-400 text-sm">Enter your registered email address to receive a password reset link.</p>
        </div>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl">
          {success ? (
            <CardContent className="pt-6 pb-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                <Mail className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Check Your Email</h3>
              <p className="text-sm text-slate-400">
                If an account exists with that email, we have sent a reset link. Please check your inbox.
              </p>
              <Link href="/login" className="block mt-4">
                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                  Return to Login
                </Button>
              </Link>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="pt-6 space-y-4">
                {error && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">College Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="cb.xx.u4xxx22000@cb.students.amrita.edu"
                    className="bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500 h-11" 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4 pb-6">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  {loading ? "Sending Link..." : "Send Reset Link"}
                </Button>
                
                <p className="text-sm text-slate-500 text-center w-full">
                  Remember your password?{" "}
                  <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
