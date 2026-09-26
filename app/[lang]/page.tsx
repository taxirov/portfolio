import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { DomainsSection } from "@/components/site/domains";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { LatestPosts } from "@/components/site/latest-posts";
import { Navbar } from "@/components/site/navbar";
import { Projects } from "@/components/site/projects";
import { Skills } from "@/components/site/skills";
import {
  getPublishedDomains,
  getPublishedPosts,
  getPublishedProjects,
  getPublishedSocials,
  getSkillGroups,
} from "@/lib/data";

const HOME_DOMAINS = 6;

// Admin edits revalidate every language right away; this is only the fallback refresh interval.
export const revalidate = 300;

export default async function Home() {
  const [projects, socials, posts, skillGroups, domains] = await Promise.all([
    getPublishedProjects(),
    getPublishedSocials(),
    getPublishedPosts(3),
    getSkillGroups(),
    // One extra tells whether to show the "All domains" link.
    getPublishedDomains(HOME_DOMAINS + 1),
  ]);

  return (
    <div className="bg-gradient-to-r from-slate-100 to-slate-200">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-28 md:px-10 lg:pb-16">
        <Hero socials={socials.filter((s) => s.showInHero)} />
        <Skills groups={skillGroups} />
        <Projects projects={projects} />
        <DomainsSection domains={domains.slice(0, HOME_DOMAINS)} hasMore={domains.length > HOME_DOMAINS} />
        <LatestPosts posts={posts} />
        <About socials={socials} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
