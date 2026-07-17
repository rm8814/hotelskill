import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SkillGenerator } from "@/components/skill-generator";
import { Card, CardBadge } from "@/components/ui/card";
import { AccordionItem } from "@/components/ui/accordion";
import { featuredSkills, templateSkills } from "@/lib/skills-data";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section className="px-6 pb-10 pt-24 text-center">
        <div className="mx-auto max-w-[640px]">
          <h1 className="text-[38px] font-bold leading-[1.25] tracking-tight">
            Claude Skills, <span className="text-accent">built for hoteliers.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[480px] text-[14.5px] text-text-muted">
            Describe the task — pricing, guest replies, OTA listings, SOPs — and
            get a ready-to-use Claude Skill your team can install and start
            using today. No coding required.
          </p>
        </div>
        <div className="mt-10">
          <SkillGenerator />
        </div>
      </section>

      {/* Recently Featured */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[26px] font-extrabold">Recently Featured</h2>
          <p className="mb-8 mt-2 text-sm text-text-muted">
            Skills hoteliers are building with HotelSkill.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredSkills.map((skill, i) => (
              <Link key={skill.slug} href={`/skills/${skill.slug}`}>
                <Card className="h-full transition-colors hover:border-accent/50">
                  <CardBadge>{String(i + 1).padStart(2, "0")}</CardBadge>
                  <h3 className="mb-2 text-[15px] font-bold">{skill.title}</h3>
                  <p className="text-[13px] text-text-muted">{skill.shortDescription}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Templates */}
      <section id="use-cases" className="scroll-mt-24 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-[26px] font-extrabold">Popular Hotel Skill Templates</h2>
            <Link href="/skills" className="whitespace-nowrap text-sm font-semibold text-accent">
              Browse the library →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {templateSkills.map((skill) => (
              <Link key={skill.slug} href={`/skills/${skill.slug}`}>
                <Card className="h-full transition-colors hover:border-accent/50">
                  <ArrowUpRight className="absolute right-5 top-5 h-3.5 w-3.5 text-text-dim" />
                  <h3 className="mb-2 text-[15px] font-bold">{skill.title}</h3>
                  <p className="text-[13px] text-text-muted">{skill.shortDescription}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What is a Claude Skill */}
      <section id="what-is-it" className="scroll-mt-24 px-6 py-16">
        <div className="prose-muted mx-auto max-w-[680px]">
          <h2 className="mb-5 text-[26px] font-extrabold text-text">
            What is a Claude Skill — for a hotel?
          </h2>
          <p>
            <strong>A Claude Skill</strong> is a reusable set of instructions
            that teaches Claude how to handle a specific task the way{" "}
            <em>your</em> property does it — your pricing logic, your brand
            voice for guest replies, your housekeeping standards. It's a
            SKILL.md file that Claude applies automatically whenever it's
            relevant, so you stop re-explaining the same context every time.
          </p>
          <p>
            <strong>HotelSkill</strong> turns a plain-English description of a
            hotel task into a complete, ready-to-use Skill — no coding
            required, and no revenue management or engineering background
            needed.
          </p>
        </div>
      </section>

      {/* Benefits / How it works */}
      <section id="benefits" className="scroll-mt-24 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[26px] font-extrabold">How it works for your property</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardBadge className="text-accent">01</CardBadge>
              <h3 className="mb-2 text-[15px] font-bold">Describe the task</h3>
              <p className="text-[13px] text-text-muted">
                Write what you want Claude to help with — pricing, reviews,
                SOPs, proposals — in plain English, the way you'd brief a
                new team member.
              </p>
            </Card>
            <Card>
              <CardBadge className="text-accent">02</CardBadge>
              <h3 className="mb-2 text-[15px] font-bold">We generate the Skill</h3>
              <p className="text-[13px] text-text-muted">
                HotelSkill produces a complete, Claude-compatible SKILL.md
                tailored to hotel operations and revenue management.
              </p>
            </Card>
            <Card>
              <CardBadge className="text-accent">03</CardBadge>
              <h3 className="mb-2 text-[15px] font-bold">Install and use it</h3>
              <p className="text-[13px] text-text-muted">
                Download the .zip, upload it in Claude's Skills settings, and
                your whole team benefits from it immediately.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-[680px]">
          <h2 className="mb-6 text-[26px] font-extrabold">Frequently asked questions</h2>

          <AccordionItem question="I'm not technical — can I still use this?">
            Yes. You describe the task in plain English, the way you'd brief a
            new hire. HotelSkill writes the SKILL.md file for you — no coding
            or revenue management software experience needed.
          </AccordionItem>
          <AccordionItem question="Can this help my revenue manager, not just front desk?">
            Yes — the examples above include a dynamic pricing advisor and a
            competitor rate tracker built specifically for revenue teams,
            alongside guest-facing and operations skills.
          </AccordionItem>
          <AccordionItem question="How do I install a generated Skill?">
            Download and unzip the file, then in Claude go to Settings →
            Capabilities → Skills, click Add Skill → Upload Skill, and drag in
            the .zip. Once enabled, your whole team can use it in chat.
          </AccordionItem>
          <AccordionItem question="Does this replace my PMS or revenue management system?">
            No — Skills work alongside your existing tools. They teach Claude
            how to reason through a task consistently (like a well-trained
            team member), not replace your PMS, channel manager, or RMS.
          </AccordionItem>
          <AccordionItem question="Is my property's data used to train Claude?">
            The descriptions you type are sent to the Claude API to generate
            your Skill. Check Anthropic's current data usage policy for API
            requests if you have specific compliance requirements.
          </AccordionItem>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
