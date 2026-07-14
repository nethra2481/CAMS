"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { changePassword } from "@/app/actions/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    const res = await changePassword(formData);
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // Success: Keep them logged in, but clear the form
      alert("Password changed successfully. Please use your new password next time you log in.");
      (e.target as HTMLFormElement).reset();
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your account security and preferences.</p>
      </div>

      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-xl text-slate-200 flex items-center">
              <KeyRound className="w-5 h-5 mr-2 text-cyan-400" />
              Reset Password
            </CardTitle>
            <CardDescription className="text-slate-400">
              Update your password. You will be logged out upon success.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
              <Input 
                id="currentPassword" 
                name="currentPassword" 
                type="password" 
                required 
                className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
              <Input 
                id="newPassword" 
                name="newPassword" 
                type="password" 
                required 
                minLength={6}
                className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                required 
                minLength={6}
                className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500" 
              />
            </div>
          </CardContent>
          <CardFooter className="bg-slate-900/50 rounded-b-xl border-t border-slate-800 p-4">
            <Button 
              type="submit" 
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
