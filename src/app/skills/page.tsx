import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { allSkills } from "@/lib/skills-data";

export const metadata = {
  title: "Skill Library — HotelSkill",
};

export default function SkillsLibraryPage() {
  return (
    <>
      <SiteHeader />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-[32px] font-extrabold">Skill Library</h1>
          <p className="mb-10 mt-2 max-w-xl text-sm text-text-muted">
            Ready-made Claude Skills for hotel revenue, guest relations,
            operations, and sales — install as-is, or use the generator on
            the homepage to build your own.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {allSkills.map((skill) => (
              <Link key={skill.slug} href={`/skills/${skill.slug}`}>
                <Card className="h-full transition-colors hover:border-accent/50">
                  <span className="mb-2 inline-block text-xs font-semibold text-accent">
                    {skill.category}
                  </span>
                  <h3 className="mb-2 text-[15px] font-bold">{skill.title}</h3>
                  <p className="text-[13px] text-text-muted">{skill.shortDescription}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
