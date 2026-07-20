import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clear existing templates to avoid duplicate collisions on slug
  await prisma.templateSection.deleteMany({});
  await prisma.template.deleteMany({});

  // 1. Developer Template
  const devTemplate = await prisma.template.create({
    data: {
      name: "Developer",
      slug: "developer",
      description: "A clean, modern layout tailored for software engineers and full-stack developers.",
      thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
      isActive: true,
    },
  });

  await prisma.templateSection.createMany({
    data: [
      {
        templateId: devTemplate.id,
        type: "Hero",
        order: 1,
        content: {
          title: "Building the Future, One Line of Code at a Time",
          subtitle: "Hi, I'm a software engineer specializing in building exceptional digital experiences.",
          ctaText: "View Projects",
        },
      },
      {
        templateId: devTemplate.id,
        type: "About",
        order: 2,
        content: {
          bio: "I'm a full-stack engineer passionate about open source, modern web standards, and developer experience. I write clean, performant code.",
          skills: ["TypeScript", "React", "Next.js", "Node.js", "Prisma", "PostgreSQL"],
        },
      },
      {
        templateId: devTemplate.id,
        type: "Projects",
        order: 3,
        content: {
          title: "Featured Projects",
          list: [
            {
              name: "Buildfolio",
              description: "An open-source portfolio builder for developers.",
              link: "https://github.com",
            },
            {
              name: "NextAuth Custom Adapter",
              description: "A fast, Edge-compatible NextAuth adapter.",
              link: "https://github.com",
            },
          ],
        },
      },
      {
        templateId: devTemplate.id,
        type: "Contact",
        order: 4,
        content: {
          title: "Get In Touch",
          email: "hello@developer.com",
          github: "github.com",
          linkedin: "linkedin.com",
        },
      },
    ],
  });

  // 2. Minimal Template
  const minimalTemplate = await prisma.template.create({
    data: {
      name: "Minimal",
      slug: "minimal",
      description: "A elegant, content-first layout focusing on text legibility and minimal aesthetics.",
      thumbnailUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80",
      isActive: true,
    },
  });

  await prisma.templateSection.createMany({
    data: [
      {
        templateId: minimalTemplate.id,
        type: "Hero",
        order: 1,
        content: {
          title: "Thoughts, Stories and Ideas",
          subtitle: "A personal blog about minimalist living, writing, and coding.",
        },
      },
      {
        templateId: minimalTemplate.id,
        type: "About",
        order: 2,
        content: {
          bio: "I appreciate the art of minimalist layouts where words stand out.",
        },
      },
    ],
  });

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
