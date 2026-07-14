import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BulkApprovalTable from "./BulkApprovalTable";

export default async function FacultyApprovalsPage({ searchParams }: { searchParams: Promise<{ eventId?: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "FACULTY") {
    redirect("/login");
  }

  const { eventId } = await searchParams;
  const whereClause: any = {};
  if (eventId) {
    whereClause.announcementId = eventId;
  }

  const [achievements, templates] = await Promise.all([
    prisma.achievement.findMany({
      where: whereClause,
      include: {
        student: { select: { name: true, registerNumber: true } },
        proofFiles: { select: { url: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.formTemplate.findMany({
      select: { category: true, readinessPoints: true },
    }),
  ]);

  // Build a category → default points lookup for the UI
  const categoryPoints = Object.fromEntries(
    templates.map((t) => [t.category, t.readinessPoints])
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Bulk Approvals</h1>
        <p className="text-slate-400 mt-2">Fast triage and batch approve/reject student submissions.</p>
      </div>

      <BulkApprovalTable achievements={achievements} categoryPoints={categoryPoints} />
    </div>
  );
}
