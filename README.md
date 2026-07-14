# Cyber Achievement Portal (CYS)

A secure portal for Cyber Security students to log achievements and for faculty to approve them.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions, Prisma, SQLite
- **Auth**: NextAuth.js (Role-based: Student, Faculty, Admin)
- **Integrations**: Cloudinary (Storage), Gemini AI (Motivation)

## Getting Started

1. **Install dependencies:** `npm install`
2. **Environment Variables:** Set `.env` with `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GEMINI_API_KEY`, and `CLOUDINARY_URL`.
3. **Database:** `npx prisma db push && npx tsx prisma/seed.ts`
4. **Run:** `npm run dev`
