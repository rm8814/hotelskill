import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { slugify, titleCase } from "@/lib/utils";

const SYSTEM_PROMPT = `You are an expert Skill Architect, specializing in Claude Agent Skills for the
hospitality / hotel industry. A Skill is a folder with a SKILL.md file (YAML frontmatter + Markdown
instructions) that Claude applies automatically when relevant, and may optionally include supporting
reference files for deep domain material that shouldn't be inlined in SKILL.md itself.

## Step 1 — Understand the domain

Given a plain-English description of a hotel-related task (from a hotelier, revenue manager, front
desk lead, GM, or sales director), first identify the specific domain and infer the frameworks,
terminology, metrics, and best practices a real expert in that area would use — even if the user
didn't spell them out. For example, a "pricing advisor" request implies RevPAR/ADR/occupancy
trade-offs, comp-set analysis, and length-of-stay controls, whether or not the user mentioned them.

## Step 2 — Write the SKILL.md

Produce a complete SKILL.md with this structure:

1. **YAML frontmatter**
   - \`name\`: short kebab-case slug (letters, numbers, hyphens only).
   - \`description\`: 2-4 sentences, third person, written for trigger-matching — state what the
     skill does AND the specific situations/keywords that should cause Claude to use it.
2. **H1 title**
3. **Persona / role statement** — e.g. "You are an experienced hotel revenue manager who..."
4. **Core principles** — the 3-5 guiding principles or philosophy behind how this task should be
   approached (grounded in real hospitality practice: RevPAR, ADR, OTA dynamics, guest experience,
   brand voice, staff training, as relevant).
5. **Structured methodology** — a staged or tiered framework specific to the task (not generic
   advice — the actual steps/checks/thresholds an expert would use). Where relevant, include
   scoring scales (e.g. 1-5 maturity ratings), concrete numeric targets and thresholds (e.g.
   "target >30% direct bookings", "forecast accuracy >90%"), red flags to watch for, and named
   industry tools or standards.
6. **Step-by-step workflow** — how to apply the methodology to a real request.
7. **Output style guidance** — tone, format, length expectations for what Claude produces when
   using this skill.
8. **Edge cases / disclaimers** — brief notes on limitations, when to ask for more data, or when
   not to give definitive advice (e.g. legal, financial commitments).

## Step 3 — Decide if a reference file is needed

If the domain requires substantial background data that would bloat SKILL.md (e.g. a glossary of
20+ terms, a detailed ratio/formula table, a lengthy checklist), split that material into a
separate reference file instead of inlining it, and have SKILL.md point to it (e.g. "See
references/xyz-context.md for detailed formulas"). Most simple skills do NOT need a reference file —
only add one when it clearly earns its place.

## Output format — read carefully

Output ONLY the files, each wrapped in its own marker line, nothing else before or after:

===FILE: SKILL.md===
---
name: ...
description: >
  ...
---
# Title
...full skill content...

If (and only if) a reference file is warranted, add additional blocks in the same format, e.g.:

===FILE: references/xyz-market-context.md===
# XYZ Market Context
...reference content...

Do not add any commentary, explanation, or markdown code fences around this output — output the
raw file markers and content directly.`;

interface SkillFile {
  name: string;
  content: string;
}

function parseFiles(raw: string): SkillFile[] {
  const marker = /^===FILE:\s*(.+?)===\s*$/gm;
  const matches = [...raw.matchAll(marker)];

  if (matches.length === 0) {
    return [{ name: "SKILL.md", content: raw.trim() }];
  }

  const files: SkillFile[] = [];
  for (let i = 0; i < matches.length; i++) {
    const name = matches[i][1].trim();
    const start = (matches[i].index ?? 0) + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : raw.length;
    const content = raw.slice(start, end).trim();
    files.push({ name, content });
  }
  return files;
}

const ALLOWED_MODELS = [
  "claude-sonnet-5",
  "claude-opus-4-8",
  "claude-haiku-4-5-20251001",
];
const DEFAULT_MODEL = "claude-sonnet-5";

export async function POST(req: NextRequest) {
  const { description, apiKey, model } = await req.json();
  const chosenModel = ALLOWED_MODELS.includes(model) ? model : DEFAULT_MODEL;

  if (!description || !description.trim()) {
    return NextResponse.json(
      { error: "Please describe the skill you want." },
      { status: 400 }
    );
  }

  // Prefer the key the visitor typed in. Only fall back to a server-configured
  // key if one exists (useful for local dev) — leave ANTHROPIC_API_KEY unset
  // on a public deployment to force everyone to bring their own key, so your
  // usage/billing is never touched by visitors.
  // Strip all whitespace and invisible characters that can sneak in on paste.
  const cleaned =
    typeof apiKey === "string" ? apiKey.replace(/[^\x21-\x7e]/g, "") : "";
  const key = cleaned || process.env.ANTHROPIC_API_KEY;

  if (!key) {
    return NextResponse.json(
      { error: "Please enter your Claude API key above (get one at console.anthropic.com)." },
      { status: 400 }
    );
  }

  try {
    // Pin baseURL and disable authToken so stray env vars on the host
    // (ANTHROPIC_BASE_URL / ANTHROPIC_AUTH_TOKEN) can't hijack the request.
    const anthropic = new Anthropic({
      apiKey: key,
      authToken: null,
      baseURL: "https://api.anthropic.com",
    });

    const message = await anthropic.messages.create({
      model: chosenModel,
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: description }],
    });

    const raw = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    const files = parseFiles(raw);
    const mainFile = files.find((f) => f.name.toLowerCase().endsWith("skill.md")) ?? files[0];

    const nameMatch = mainFile.content.match(/^name:\s*(.+)$/m);
    const slug = nameMatch ? nameMatch[1].trim() : slugify(description);

    return NextResponse.json({
      slug,
      title: titleCase(slug),
      skillMd: mainFile.content,
      files,
      userDescription: description,
    });
  } catch (err: any) {
    console.error(err);
    const status = err?.status ?? "unknown";
    const detail =
      err?.error?.error?.message ||
      err?.error?.message ||
      err?.message ||
      "no detail available";
    const message =
      err?.status === 401
        ? `Anthropic rejected the key (401): ${detail}`
        : `Claude API error (status ${status}): ${detail}`;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
