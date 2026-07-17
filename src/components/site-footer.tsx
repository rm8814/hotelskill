import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-10 text-sm text-text-muted">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-8 pb-8">
        <div className="max-w-[280px]">
          <div className="mb-3.5 flex items-center gap-2 text-[15px] font-bold text-text">
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-md bg-accent-soft text-[11px] font-extrabold text-accent">
              HS
            </span>
            HotelSkill
          </div>
          <p>
            Claude Skills built for hoteliers. Describe a task, get a
            ready-to-use Skill your team can install today.
          </p>
        </div>
        <div>
          <h5 className="mb-3.5 text-xs font-semibold tracking-wide text-text">MAIN PAGES</h5>
          <div className="flex flex-col gap-2.5">
            <Link href="/skills" className="hover:text-accent">Skill Library</Link>
            <Link href="/#what-is-it" className="hover:text-accent">What is it?</Link>
            <Link href="/#benefits" className="hover:text-accent">Benefits</Link>
            <Link href="/#use-cases" className="hover:text-accent">Use cases</Link>
          </div>
        </div>
        <div>
          <h5 className="mb-3.5 text-xs font-semibold tracking-wide text-text">LEGAL</h5>
          <div className="flex flex-col gap-2.5">
            <Link href="#" className="hover:text-accent">Privacy Policy</Link>
            <Link href="#" className="hover:text-accent">Contact</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-border pt-5 text-xs text-text-dim">
        <span>Built for hoteliers, powered by Claude.</span>
        <span>
          Color scheme inspired by{" "}
          <a
            href="https://upscale.asia"
            target="_blank"
            rel="noopener"
            className="text-text-dim underline hover:text-accent"
          >
            UPSCALE
          </a>
        </span>
      </div>
    </footer>
  );
}
