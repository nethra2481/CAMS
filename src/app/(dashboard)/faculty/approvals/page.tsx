import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BulkApprovalTable from "./BulkApprovalTable";

export default async function FacultyApprovalsPage({ searchParams }: { searchParams: { eventId?: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    redirect("/login");
  }

  const whereClause: any = {};
  if (searchParams.eventId) {
    whereClause.announcementId = searchParams.eventId;
  }

  const achievements = await prisma.achievement.findMany({
    where: whereClause,
    include: {
      student: { select: { name: true, registerNumber: true } },
      proofFiles: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Bulk Approvals</h1>
        <p className="text-slate-400 mt-2">Fast triage and batch approve/reject student submissions.</p>
      </div>

      <BulkApprovalTable achievements={achievements} />
    </div>
  );
}
