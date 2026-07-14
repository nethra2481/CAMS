import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  const student = await prisma.user.upsert({
    where: { email: 'student@college.edu' },
    update: {},
    create: {
      email: 'student@college.edu',
      name: 'Alice Cyber',
      passwordHash,
      role: 'STUDENT',
      registerNumber: 'CB.SC.U4CYS24001',
      department: 'Cyber Security',
      year: '3rd Year',
      section: 'A'
    },
  })

  const faculty = await prisma.user.upsert({
    where: { email: 'uma@amrita.edu' },
    update: {},
    create: {
      email: 'faculty@college.edu',
      name: 'Dr. Uma Maheshwari',
      passwordHash,
      role: 'FACULTY',
      department: 'Cyber Security'
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'm_sethu@cb.amrita.edu' },
    update: {},
    create: {
      email: 'm_sethu@cb.amrita.edu',
      name: 'M Sethumadhavan',
      passwordHash,
      role: 'ADMIN',
      department: 'Admin'
    },
  })

  console.log({ student, faculty, admin })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
