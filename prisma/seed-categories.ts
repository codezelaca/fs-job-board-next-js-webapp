/**
 * Standalone script to seed all 20 tech categories.
 * Run with: npx tsx prisma/seed-categories.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { name: "Software Engineering",      slug: "software-engineering" },
  { name: "Frontend Development",      slug: "frontend-development" },
  { name: "Backend Development",       slug: "backend-development" },
  { name: "Full-Stack Development",    slug: "full-stack-development" },
  { name: "Mobile Development",        slug: "mobile-development" },
  { name: "Data Science & Analytics",  slug: "data-science-analytics" },
  { name: "Machine Learning & AI",     slug: "machine-learning-ai" },
  { name: "DevOps & Cloud",            slug: "devops-cloud" },
  { name: "Cybersecurity",             slug: "cybersecurity" },
  { name: "UI/UX Design",             slug: "ui-ux-design" },
  { name: "Product Management",        slug: "product-management" },
  { name: "QA & Testing",             slug: "qa-testing" },
  { name: "Database Administration",   slug: "database-administration" },
  { name: "Embedded Systems",          slug: "embedded-systems" },
  { name: "Blockchain & Web3",         slug: "blockchain-web3" },
  { name: "Game Development",          slug: "game-development" },
  { name: "IT Support & Systems",      slug: "it-support-systems" },
  { name: "Network Engineering",       slug: "network-engineering" },
  { name: "Technical Writing",         slug: "technical-writing" },
  { name: "Business Analysis",         slug: "business-analysis" },
];

async function main() {
  console.log(`Seeding ${CATEGORIES.length} categories...`);
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
    console.log(`  ✓ ${cat.name}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
