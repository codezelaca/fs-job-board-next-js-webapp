import "dotenv/config";
import { PrismaClient, JobType, LocationType } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { jobs } from "../data/jobs";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function mapJobType(type: string): JobType {
  const t = type.toLowerCase();
  if (t.includes("internship")) return JobType.INTERNSHIP;
  if (t.includes("part-time") || t.includes("part time")) return JobType.PART_TIME;
  if (t.includes("contract")) return JobType.CONTRACT;
  return JobType.FULL_TIME;
}

function mapLocationType(location: string): LocationType {
  const l = location.toLowerCase();
  if (l.includes("remote")) return LocationType.REMOTE;
  if (l.includes("hybrid")) return LocationType.HYBRID;
  return LocationType.ONSITE;
}

async function main() {
  console.log("Seeding started...");

  // Create a default Category
  const category = await prisma.category.upsert({
    where: { slug: "software-engineering" },
    update: {},
    create: {
      name: "Software Engineering",
      slug: "software-engineering",
    },
  });

  // Hash passwords
  const adminPassword = await bcrypt.hash("123456Codezela", 10);
  const userPassword = await bcrypt.hash("password123", 10);

  // Create a default Admin
  await prisma.user.upsert({
    where: { email: "info@codezela.com" },
    update: {
      passwordHash: adminPassword,
      onboardingCompleted: true,
    },
    create: {
      email: "info@codezela.com",
      name: "CCA Admin",
      role: "ADMIN",
      passwordHash: adminPassword,
      onboardingCompleted: true,
    },
  });

  // Seed jobs
  for (const job of jobs) {
    const mockRecruiterUserId = `${job.company.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}@mock.recruiter.com`;
    
    // Create user for recruiter
    const rUser = await prisma.user.upsert({
      where: { email: mockRecruiterUserId },
      update: {
        passwordHash: userPassword,
        onboardingCompleted: true,
      },
      create: {
        email: mockRecruiterUserId,
        name: job.company,
        role: "RECRUITER",
        passwordHash: userPassword,
        onboardingCompleted: true,
      },
    });

    const recruiter = await prisma.recruiter.upsert({
      where: { userId: rUser.id },
      update: {},
      create: {
        userId: rUser.id,
        companyName: job.company,
        aboutCompany: `A leading tech company: ${job.company}`,
      },
    });

    // Create Job, using the mock data's ID as the SEO slug for safety
    await prisma.job.upsert({
      where: { slug: job.id },
      update: {},
      create: {
        slug: job.id,
        title: job.title,
        location: job.location,
        locationType: mapLocationType(job.location),
        jobType: mapJobType(job.type),
        about: job.about,
        term: job.term,
        skills: job.skills,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        status: "PUBLISHED",
        recruiterId: recruiter.id,
        categoryId: category.id,
        createdAt: new Date(job.postedAt),
      },
    });
  }

  // Create a dummy candidate
  const candidateEmail = "candidate@example.com";
  const cUser = await prisma.user.upsert({
    where: { email: candidateEmail },
    update: {
      passwordHash: userPassword,
      onboardingCompleted: true,
    },
    create: {
      email: candidateEmail,
      name: "John Candidate",
      role: "JOB_SEEKER",
      passwordHash: userPassword,
      onboardingCompleted: true,
    },
  });

  await prisma.candidate.upsert({
    where: { userId: cUser.id },
    update: {},
    create: {
      userId: cUser.id,
      bio: "I am a passionate software engineer looking for new opportunities.",
      skills: ["React", "TypeScript", "Node.js"],
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
