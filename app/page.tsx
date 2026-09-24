import { About } from "@/components/site/about";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { Navbar } from "@/components/site/navbar";
import { Projects } from "@/components/site/projects";
import { Skills } from "@/components/site/skills";
import { getPublishedProjects, getPublishedSocials } from "@/lib/data";

// Admin edits call revalidatePath("/"); this is only the fallback refresh interval.
export const revalidate = 300;

export default async function Home() {
  const [projects, socials] = await Promise.all([getPublishedProjects(), getPublishedSocials()]);

  return (
    <div className="bg-gradient-to-r from-slate-100 to-slate-200">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-28 md:px-10 md:pb-16">
        <Hero socials={socials.filter((s) => s.showInHero)} />
        <Skills />
        <Projects projects={projects} />
        <About socials={socials} />
      </main>
      <Footer />
    </div>
  );
}
