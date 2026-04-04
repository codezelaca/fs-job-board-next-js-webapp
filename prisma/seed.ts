import "dotenv/config";
import { PrismaClient, JobType, LocationType } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { jobs } from "../data/jobs";

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

  // Create a default Admin
  await prisma.user.upsert({
    where: { email: "admin@cca-jobboard.com" },
    update: {},
    create: {
      email: "admin@cca-jobboard.com",
      name: "CCA Admin",
      role: "ADMIN",
    },
  });

  // Seed jobs
  for (const job of jobs) {
    const mockRecruiterUserId = `${job.company.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}@mock.recruiter.com`;
    
    // Create user for recruiter
    const rUser = await prisma.user.upsert({
      where: { email: mockRecruiterUserId },
      update: {},
      create: {
        email: mockRecruiterUserId,
        name: job.company,
        role: "RECRUITER",
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
