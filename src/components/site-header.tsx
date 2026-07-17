import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg/85 px-6 py-4 backdrop-blur">
      <Link href="/" className="flex items-center gap-2 text-[15px] font-bold">
        <span className="flex h-[26px] w-[26px] items-center justify-center rounded-md bg-accent-soft text-[11px] font-extrabold text-accent">
          HS
        </span>
        HotelSkill
      </Link>
      <nav className="hidden gap-7 text-sm text-text-muted md:flex">
        <Link href="/skills" className="hover:text-text">Skill Library</Link>
        <Link href="/#what-is-it" className="hover:text-text">What is it?</Link>
        <Link href="/#benefits" className="hover:text-text">Benefits</Link>
        <Link href="/#use-cases" className="hover:text-text">Use cases</Link>
      </nav>
      <Link
        href="/#generator"
        className="rounded-lg bg-gradient-to-br from-accent to-accent-dark px-4 py-2 text-sm font-bold text-black"
      >
        Get Started
      </Link>
    </header>
  );
}
