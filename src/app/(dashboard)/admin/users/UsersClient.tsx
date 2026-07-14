"use client";

import { useState } from "react";
import { addUser, removeUser } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  registerNumber: string | null;
};

export default function UsersClient({ initialUsers, currentUserId }: { initialUsers: User[], currentUserId: string }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    setDeletingId(id);
    try {
      const res = await removeUser(id);
      if (res.success) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (err) {
      alert("Failed to remove user");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await addUser(formData);
      if (res.success) {
        window.location.reload();
      }
    } catch (err) {
      alert("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger 
            render={
              <Button className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_-3px_rgba(147,51,234,0.4)] transition-all hover:-translate-y-0.5">
                <UserPlus className="w-4 h-4 mr-2" /> Add New User
              </Button>
            }
          />
          <DialogContent className="bg-slate-950 border-slate-800 text-slate-200">
            <DialogHeader>
              <DialogTitle className="text-white">Add New User</DialogTitle>
              <DialogDescription className="text-slate-400">
                Create a new student, faculty, or admin account.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                <Input id="name" name="name" required className="bg-slate-900 border-slate-800 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <Input id="email" name="email" type="email" required className="bg-slate-900 border-slate-800 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Temporary Password</Label>
                <Input id="password" name="password" required className="bg-slate-900 border-slate-800 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-300">Role</Label>
                <select id="role" name="role" required className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 mt-4 shadow-[0_0_15px_-3px_rgba(147,51,234,0.4)]">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Create User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-slate-200">Registered Users</CardTitle>
          <CardDescription className="text-slate-400">Manage all accounts in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-sm text-left text-slate-400">
              <thead className="text-xs text-slate-300 uppercase bg-slate-950 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-950/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        user.role === 'ADMIN' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                        user.role === 'FACULTY' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                        'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.id !== currentUserId && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={deletingId === user.id}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          {deletingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
