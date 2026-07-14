"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordWithToken } from "@/app/actions/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound, CheckCircle2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!token) {
    return (
      <CardContent className="pt-6 text-center text-slate-400">
        Invalid or missing reset token. Please request a new link.
        <Link href="/forgot-password" className="block mt-4 text-cyan-400 hover:underline">
          Go to Forgot Password
        </Link>
      </CardContent>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    formData.append("token", token);
    const res = await resetPasswordWithToken(formData);
    
    setLoading(false);
    
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <CardContent className="pt-6 pb-6 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Password Updated</h3>
        <p className="text-sm text-slate-400">
          Your password has been successfully reset. You can now log in with your new credentials.
        </p>
        <Link href="/login" className="block mt-6">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]">
            Go to Login
          </Button>
        </Link>
      </CardContent>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="pt-6 space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-300">New Password</Label>
          <div className="relative">
            <Input 
              id="password" 
              name="password" 
              type={showNew ? "text" : "password"}
              required 
              minLength={6}
              placeholder="At least 6 characters"
              className="bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500 h-11 pr-10" 
            />
            <button
              type="button"
              onClick={() => setShowNew(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              tabIndex={-1}
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
          <div className="relative">
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type={showConfirm ? "text" : "password"}
              required 
              minLength={6}
              placeholder="Repeat new password"
              className="bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500 h-11 pr-10" 
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 pb-6">
        <Button 
          type="submit" 
          className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]"
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
          {loading ? "Updating..." : "Reset Password"}
        </Button>
      </CardFooter>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[100px]"></div>
      </div>

      <Link href="/login" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </Link>

      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-2xl mb-4 shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]">
            <KeyRound className="w-8 h-8 text-cyan-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create New Password</h1>
          <p className="text-slate-400 text-sm">Enter a strong password to secure your account.</p>
        </div>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl">
          <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading secure form...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
