import Link from "next/link";
import { notFound } from "next/navigation";
import { Folder, FileText, HelpCircle, Share2, ChevronRight, CheckCircle2, ListChecks, Lightbulb } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton, DownloadButton } from "@/components/skill-detail-actions";
import { allSkills, getSkillBySlug, getRelatedSkills } from "@/lib/skills-data";

export function generateStaticParams() {
  return allSkills.map((skill) => ({ slug: skill.slug }));
}

export default function SkillDetailPage({ params }: { params: { slug: string } }) {
  const skill = getSkillBySlug(params.slug);
  if (!skill) return notFound();

  const related = getRelatedSkills(skill.slug, 2);

  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-text-dim">
          <Link href="/" className="hover:text-accent">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/skills" className="hover:text-accent">Skill Library</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-muted">{skill.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-muted">{skill.title}</span>
        </nav>

        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <span className="mb-3 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              {skill.category}
            </span>
            <h1 className="text-[32px] font-extrabold">{skill.title}</h1>
          </div>
          <Button variant="ghost" size="sm">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
        </div>
        <p className="mb-9 max-w-4xl text-sm text-text-muted">{skill.shortDescription}</p>

        <div className="grid gap-5 lg:grid-cols-[2fr,1fr]">
          <div>
            {/* When to use / What it does */}
            <div className="mb-5 grid gap-4 sm:grid-cols-2">
              <Card>
                <h3 className="mb-3.5 flex items-center gap-2 text-[14.5px] font-bold">
                  <ListChecks className="h-4 w-4 text-accent" /> When to use this skill
                </h3>
                <ul className="space-y-2.5">
                  {skill.whenToUse.map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-[13px] text-text-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-dim" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <h3 className="mb-3.5 flex items-center gap-2 text-[14.5px] font-bold">
                  <CheckCircle2 className="h-4 w-4 text-accent" /> What it does
                </h3>
                <ul className="space-y-2.5">
                  {skill.whatItDoes.map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-[13px] text-text-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-dim" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="mb-5 flex gap-4 rounded-2xl border border-border bg-card p-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <h3 className="mb-2 text-[15px] font-bold">Skill Description</h3>
                <p className="text-[13.5px] text-text-muted">{skill.userDescription}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-[18px]">
                <div className="border-b-2 border-accent px-1 py-3.5 text-[13.5px] text-text">
                  SKILL.md
                </div>
                <CopyButton skillMd={skill.skillMd} />
              </div>
              <pre className="max-h-[460px] overflow-auto whitespace-pre-wrap p-5 font-mono text-[12.8px] leading-relaxed text-[#C9C9C9]">
                {skill.skillMd}
              </pre>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[2fr,1fr]">
              <DownloadButton slug={skill.slug} skillMd={skill.skillMd} />
              <Link href="/#generator" className="w-full">
                <Button size="lg" variant="secondary" className="w-full">
                  Generate New Skill →
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <div className="mb-5 rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-3.5 flex items-center gap-2 text-sm font-bold">
                <Folder className="h-4 w-4 text-accent" /> {skill.slug}/
              </h3>
              <div className="flex items-center gap-2 py-1.5 pl-5 text-[13.5px] text-text-muted">
                <FileText className="h-3.5 w-3.5" /> SKILL.md
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-[15px] font-bold">
                <HelpCircle className="h-4 w-4 text-accent" /> How to install this skill
              </h3>
              <ol className="space-y-4 text-[13.5px] text-text-muted">
                {[
                  "Download and unzip the file",
                  "Go to Settings in Claude → Capabilities → scroll to Skills",
                  "Click Add Skill → Upload Skill",
                  "Drag and drop the .zip file",
                  "Once it's enabled, click the three dots → Try in chat",
                  "And voila — your whole team can use the new Skill",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Related skills */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-5 text-xl font-extrabold">Related skills</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} href={`/skills/${r.slug}`}>
                  <Card className="h-full transition-colors hover:border-accent/50">
                    <span className="mb-2 inline-block text-xs font-semibold text-accent">
                      {r.category}
                    </span>
                    <h3 className="mb-2 text-[15px] font-bold">{r.title}</h3>
                    <p className="text-[13px] text-text-muted">{r.shortDescription}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  );
}
