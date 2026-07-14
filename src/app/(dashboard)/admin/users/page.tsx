import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UsersClient from "./UsersClient";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Manage Users</h1>
        <p className="text-slate-400 mt-2">Add or remove students and faculty members.</p>
      </div>

      <UsersClient initialUsers={users} currentUserId={session.user.id} />
    </div>
  );
}
