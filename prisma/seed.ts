import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

// Content carried over from the original static index.html. Only inserted into empty tables,
// so re-running the seed never overwrites what was edited in the admin panel.
async function main() {
  if ((await db.project.count()) === 0) {
    await db.project.createMany({
      data: [
        {
          title: "Cafe Management System",
          description: "Order and table management system for cafes and restaurants.",
          imageUrl: "/images/cafe.webp",
          backendStack: "TypeScript, Node.js, Express, Prisma, PostgreSQL",
          frontendStack: "TypeScript, Svelte, Tailwind, Vercel",
          note: "Demo logins: admin / admin, waiter / waiter",
          repoUrl: "https://github.com/taxirov/cafe_backend",
          frontendRepoUrl: "https://github.com/taxirov/cafe_frontend",
          demoUrl: "https://cafe.saad.uz",
          sortOrder: 1,
        },
        {
          title: "Todo Web App",
          description:
            "A simple task manager: add tasks, mark them as done or not done, and delete them.",
          imageUrl: "/images/todo.webp",
          frontendStack: "HTML, CSS, Tailwind, JavaScript, NGINX",
          repoUrl: "https://github.com/taxirov/todo",
          demoUrl: "https://todo.saad.uz",
          sortOrder: 2,
        },
      ],
    });
    console.log("Seeded projects");
  }

  if ((await db.socialLink.count()) === 0) {
    await db.socialLink.createMany({
      data: [
        { platform: "telegram", url: "https://t.me/saad_blog", showInHero: true, sortOrder: 1 },
        { platform: "github", url: "https://github.com/taxirov", showInHero: true, sortOrder: 2 },
        { platform: "linkedin", url: "https://linkedin.com/in/taxirov", showInHero: true, sortOrder: 3 },
        { platform: "youtube", url: "https://youtube.com/@saadtakhir", showInHero: true, sortOrder: 4 },
        { platform: "instagram", url: "https://instagram.com/saad_takhir", sortOrder: 5 },
        { platform: "x", url: "https://x.com/saad_takhir", sortOrder: 6 },
        { platform: "facebook", url: "https://facebook.com/saadtakhir", sortOrder: 7 },
      ],
    });
    console.log("Seeded social links");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
