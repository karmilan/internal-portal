import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const DEMO_EMAIL = "demo@example.com";
const DEMO_NAME = "Demo User";
const DEMO_PASSWORD = "Demo@12345";

const SEED_ANNOUNCEMENTS = [
  {
    title: "Welcome to the Internal Portal",
    content:
      "Welcome to the team internal portal. This is the place to share important updates and announcements.",
  },
  {
    title: "Team Meeting",
    content: "The next team meeting will be held tomorrow at 10:00 AM. Please make sure to join on time.",
  },
] as const;

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    const demoUser = await prisma.user.upsert({
      where: { email: DEMO_EMAIL },
      update: {
        name: DEMO_NAME,
        passwordHash,
      },
      create: {
        name: DEMO_NAME,
        email: DEMO_EMAIL,
        passwordHash,
      },
    });

    for (const announcement of SEED_ANNOUNCEMENTS) {
      const existing = await prisma.announcement.findFirst({
        where: {
          authorId: demoUser.id,
          title: announcement.title,
        },
      });

      if (!existing) {
        await prisma.announcement.create({
          data: {
            title: announcement.title,
            content: announcement.content,
            authorId: demoUser.id,
          },
        });
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
