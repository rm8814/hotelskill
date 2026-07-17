# HotelSkill — Claude Skills for Hotels

A Next.js + Tailwind + shadcn-style site for generating real Claude Skills, tailored to hoteliers.
Includes a working generator (calls the Claude API), a Skill Library with example hotel skills,
individual skill detail pages.

## Bring-your-own-key (BYOK)

Every visitor enters their **own** Anthropic API key in the generator before creating a skill. The key is:

- sent to your Next.js server for that one request only
- forwarded straight to Anthropic to make the API call
- never stored, logged, or written to disk on the server
- optionally saved in the *visitor's own browser* (`localStorage`) if they check "Remember on this device" — this never leaves their machine

This means if you deploy this publicly, **you don't need to set `ANTHROPIC_API_KEY` on the server at all** —
visitors are required to supply their own key, so their usage is billed to them, not you.

If you *do* set `ANTHROPIC_API_KEY` in `.env.local`, it's used as a fallback only when a visitor
doesn't enter their own key — handy for local development so you're not retyping your key every time,
but remove it (or just don't set it) before deploying publicly if you want to fully enforce BYOK.

## 1. Prerequisites

- **Node.js 18.18+** (Next.js 14 requirement) — check with `node -v`. Install from [nodejs.org](https://nodejs.org) if needed.
- **An Anthropic API key** for local testing — separate from Claude Pro. Get one at [console.anthropic.com](https://console.anthropic.com) → Settings → API Keys.

## 2. Install

Open a terminal in this folder (`hotelskill-nextjs`) and run:

```
npm install
```

## 3. (Optional) Add a fallback key for local dev

Copy `.env.example` to `.env.local`:

```
cp .env.example .env.local
```

Paste a key in if you want a fallback for local testing. Skip this entirely if you'd rather just
type your key into the UI every time you test — that's exactly what visitors will do.

## 4. Run it

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Enter an API key in the generator box, describe
a skill, and click Create Skill.

## Project structure

```
hotelskill-nextjs/
├── src/
│   ├── app/
│   │   ├── page.tsx              — homepage (hero, generator, featured, templates, FAQ)
│   │   ├── layout.tsx            — root layout + metadata
│   │   ├── globals.css           — Tailwind + base theme
│   │   ├── skills/
│   │   │   ├── page.tsx          — Skill Library grid
│   │   │   └── [slug]/page.tsx   — individual skill detail page
│   │   └── api/
│   │       ├── generate/route.ts — calls Claude API with the visitor's key, returns SKILL.md
│   │       └── download/route.ts — zips the SKILL.md (+ any reference files) for download
│   ├── components/
│   │   ├── ui/                   — button, card, textarea, badge, accordion (shadcn-style)
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   ├── skill-generator.tsx   — the interactive generator form, incl. API key field
│   │   └── skill-detail-actions.tsx
│   └── lib/
│       ├── utils.ts              — cn(), slugify(), titleCase()
│       └── skills-data.ts        — example hotel skills shown on the site
├── package.json
├── tailwind.config.ts
├── .env.example
└── README.md
```

## Production build (optional)

```
npm run build
npm start
```

## Notes

- Each generation calls the Claude API using the visitor's own key and is billed to them.
- The example skills in the Skill Library and Featured sections are static (pre-written) so the
  site has real content to show even before anyone generates their first skill — they don't require
  an API key to view or download.
- To stop the dev server: `Ctrl+C` in the terminal.
- If a visitor sees "That API key was rejected by Anthropic," it's usually a typo, an inactive key,
  or a key with no remaining credit — point them to console.anthropic.com to check.
