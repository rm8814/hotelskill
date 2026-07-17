"use client";

import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Copy,
  Check,
  Download,
  KeyRound,
  FileText,
  Search,
  CheckCircle2,
  Folder,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { SYSTEM_PROMPT, parseFiles } from "@/lib/skill-prompt";
import { slugify, titleCase } from "@/lib/utils";
import { ShareButton } from "@/components/skill-detail-actions";

interface SkillFile {
  name: string;
  content: string;
}

interface GeneratedSkill {
  slug: string;
  title: string;
  skillMd: string;
  shortDescription: string;
  files: SkillFile[];
  userDescription: string;
}

// Pulls the `description: >` (or `description: "..."`) block out of a
// SKILL.md's YAML frontmatter for display as the trigger-matching summary.
function extractDescription(skillMd: string): string {
  const block = skillMd.match(/^description:\s*>?\s*\n((?:[ \t]+.+\n?)+)/m);
  if (block) {
    return block[1]
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .join(" ");
  }
  const inline = skillMd.match(/^description:\s*(.+)$/m);
  return inline ? inline[1].trim().replace(/^["']|["']$/g, "") : "";
}

interface SearchQuery {
  id: string;
  query: string;
  done: boolean;
}

const STORAGE_KEY = "hotelskill_api_key";

export function SkillGenerator() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("claude-sonnet-5");
  const [rememberKey, setRememberKey] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"idle" | "researching" | "building">("idle");
  const [searches, setSearches] = useState<SearchQuery[]>([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GeneratedSkill | null>(null);
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      setApiKey(saved);
      setRememberKey(true);
      setLoadedFromStorage(true);
    }
  }, []);

  function handleClearSavedKey() {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey("");
    setRememberKey(false);
    setLoadedFromStorage(false);
  }

  function handleRememberToggle(checked: boolean) {
    setRememberKey(checked);
    if (checked && apiKey) {
      localStorage.setItem(STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function handleApiKeyChange(value: string) {
    setApiKey(value);
    setLoadedFromStorage(false);
    if (rememberKey) {
      if (value) localStorage.setItem(STORAGE_KEY, value);
      else localStorage.removeItem(STORAGE_KEY);
    }
  }

  async function handleCreate() {
    setError("");
    if (!apiKey.trim()) {
      setError("Please enter your Claude API key above first.");
      return;
    }
    if (!apiKey.trim().startsWith("sk-ant-")) {
      setError(
        "That doesn't look like a Claude API key — keys start with sk-ant-. Clear the field and paste your key from console.anthropic.com."
      );
      return;
    }
    if (!description.trim()) {
      setError("Please describe the skill you want first.");
      return;
    }
    setLoading(true);
    setProgress(0);
    setPhase("researching");
    setSearches([]);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      // Call Anthropic directly from the browser (officially supported via
      // the CORS opt-in header below). No server hop = no serverless
      // timeout, and streaming keeps the connection active so network
      // proxies with inactivity timeouts don't kill it.
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model,
          max_tokens: 8000,
          stream: true,
          system: SYSTEM_PROMPT,
          tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }],
          messages: [{ role: "user", content: description }],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        let detail = errText.slice(0, 300);
        try {
          detail = JSON.parse(errText)?.error?.message ?? detail;
        } catch {}
        throw new Error(
          res.status === 401
            ? `Anthropic rejected the key: ${detail}`
            : `Claude API error (${res.status}): ${detail}`
        );
      }
      if (!res.body) throw new Error("No response stream from Anthropic.");

      // Parse the SSE stream, accumulating text deltas and tracking the two
      // phases the model goes through: web research (server_tool_use /
      // web_search_tool_result blocks), then building the skill files
      // (plain text once the "===FILE:" marker starts appearing).
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let raw = "";
      let buildStarted = false;
      const pendingToolBlocks = new Map<number, { id: string; partial: string }>();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;
          let event: any;
          try {
            event = JSON.parse(payload);
          } catch {
            continue;
          }
          if (event.type === "error") {
            throw new Error(event.error?.message ?? "Claude API stream error.");
          }

          if (event.type === "content_block_start") {
            const block = event.content_block;
            if (block?.type === "server_tool_use" && block.name === "web_search") {
              pendingToolBlocks.set(event.index, { id: block.id, partial: "" });
            } else if (block?.type === "web_search_tool_result") {
              setSearches((prev) =>
                prev.map((s) => (s.id === block.tool_use_id ? { ...s, done: true } : s))
              );
            }
          } else if (event.type === "content_block_delta") {
            if (event.delta?.type === "input_json_delta" && pendingToolBlocks.has(event.index)) {
              const entry = pendingToolBlocks.get(event.index)!;
              entry.partial += event.delta.partial_json ?? "";
            } else if (event.delta?.type === "text_delta") {
              raw += event.delta.text;
              if (!buildStarted && raw.includes("===FILE:")) {
                buildStarted = true;
                setPhase("building");
              }
              if (buildStarted) setProgress(raw.length);
            }
          } else if (event.type === "content_block_stop" && pendingToolBlocks.has(event.index)) {
            const entry = pendingToolBlocks.get(event.index)!;
            pendingToolBlocks.delete(event.index);
            try {
              const input = JSON.parse(entry.partial || "{}");
              if (input.query) {
                setSearches((prev) => [
                  ...prev,
                  { id: entry.id, query: input.query, done: false },
                ]);
              }
            } catch {
              // Malformed tool input JSON — skip showing this query.
            }
          }
        }
      }

      raw = raw.trim();
      if (!raw) throw new Error("Claude returned no content — please try again.");

      const files = parseFiles(raw);
      const mainFile =
        files.find((f) => f.name.toLowerCase().endsWith("skill.md")) ?? files[0];
      const nameMatch = mainFile.content.match(/^name:\s*(.+)$/m);
      const slug = nameMatch ? nameMatch[1].trim() : slugify(description);

      setResult({
        slug,
        title: titleCase(slug),
        skillMd: mainFile.content,
        shortDescription: extractDescription(mainFile.content) || description,
        files,
        userDescription: description,
      });
      setActiveFile(0);
    } catch (err: any) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setLoading(false);
      setPhase("idle");
      abortRef.current = null;
    }
  }

  function handleCancel() {
    abortRef.current?.abort();
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.files[activeFile].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleDownload() {
    if (!result) return;
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: result.slug, files: result.files }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.slug}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div id="generator" className="mx-auto max-w-6xl scroll-mt-24">
    <div className="mx-auto max-w-[640px]">
      <div className="mb-4 rounded-2xl border border-border bg-card p-6 text-left">
        <label className="mb-2.5 flex items-center gap-1.5 text-[13px] text-text-muted">
          <KeyRound className="h-3.5 w-3.5" /> Your Claude API key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => handleApiKeyChange(e.target.value)}
          placeholder="sk-ant-api03-..."
          className="w-full rounded-xl border border-border bg-card2 p-3.5 text-sm text-text placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-accent"
        />
        {loadedFromStorage && apiKey && (
          <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-card2 px-3 py-2 text-[12px] text-text-dim">
            <span>
              Using saved key ending in{" "}
              <code className="rounded bg-card px-1 text-text-muted">
                …{apiKey.slice(-6)}
              </code>
              {" "}— if you rotated your key, clear it and paste the new one.
            </span>
            <button
              onClick={handleClearSavedKey}
              className="ml-3 shrink-0 rounded-md border border-border px-2 py-1 text-[11.5px] text-text-muted hover:text-text"
            >
              Clear saved key
            </button>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between text-[12.5px] text-text-dim">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={rememberKey}
              onChange={(e) => handleRememberToggle(e.target.checked)}
              className="accent-accent"
            />
            Remember on this device
          </label>
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener"
            className="text-accent hover:text-accent-dark"
          >
            Get a key →
          </a>
        </div>
        <div className="mt-3">
          <label className="mb-1.5 block text-[12.5px] text-text-dim">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-xl border border-border bg-card2 p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="claude-sonnet-5">Claude Sonnet 5 — balanced quality &amp; cost (recommended)</option>
            <option value="claude-opus-4-8">Claude Opus 4.8 — highest quality, higher cost</option>
            <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 — fastest &amp; cheapest</option>
          </select>
        </div>
        <p className="mt-2 text-[11.5px] text-text-dim">
          Sent only to this server, forwarded straight to Anthropic to generate your
          skill, and never stored or logged. Your key, your usage, your bill.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 text-left">
        <label className="mb-2.5 block text-[13px] text-text-muted">
          Describe your skill
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. A revenue advisor that helps set dynamic rates by date and segment, using demand signals and competitor pricing, and explains its reasoning like a mentor..."
        />
      </div>
      <p className="my-4 text-center text-[13px] text-text-dim">
        The more detail you provide, the better your skill will be.
      </p>
      {!loading && (
        <Button size="lg" onClick={handleCreate} className="w-full">
          Create Skill
        </Button>
      )}

      {loading && (
        <div className="text-left">
          {/* Phase tracker */}
          <div className="mb-4 flex items-center justify-center gap-2 text-[13px]">
            <span
              className={`flex items-center gap-1.5 font-semibold ${
                phase === "researching" ? "text-accent" : "text-text-muted"
              }`}
            >
              {phase === "building" ? (
                <CheckCircle2 className="h-4 w-4 text-accent" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
              )}
              Researching
            </span>
            <span className="h-px w-8 bg-border" />
            <span
              className={`flex items-center gap-1.5 font-semibold ${
                phase === "building" ? "text-accent" : "text-text-dim"
              }`}
            >
              {phase === "building" ? (
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Building
            </span>
          </div>

          {phase === "researching" && (
            <div className="mb-4 overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5 text-[13.5px] font-semibold">
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-accent" /> Researching the web
                </span>
                {searches.length === 0 && (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                )}
              </div>
              {searches.length === 0 ? (
                <p className="px-5 py-4 text-[13px] text-text-dim">
                  Looking up current best practices for this domain…
                </p>
              ) : (
                searches.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between border-b border-border px-5 py-3.5 text-[13.5px] last:border-b-0"
                  >
                    <span className="text-text-muted">{s.query}</span>
                    {s.done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                    ) : (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-text-dim" />
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {phase === "building" && (
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-[13.5px]">
              <span className="flex items-center gap-2 text-text-muted">
                <FileText className="h-4 w-4 text-accent" /> Writing SKILL.md and reference files…
              </span>
              <span className="text-text-dim">{Math.round(progress / 1000) || "<1"}k characters</span>
            </div>
          )}

          <button
            onClick={handleCancel}
            className="mx-auto block rounded-xl border border-border px-5 py-2.5 text-[13px] text-text-muted hover:text-text"
          >
            Cancel and start over
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3.5 text-[13.5px] text-red-300">
          {error}
        </div>
      )}
    </div>

      {result && (
        <div className="mt-14 text-left">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 className="text-2xl font-extrabold">{result.title}</h2>
            <ShareButton title={result.title} text={result.shortDescription} />
          </div>
          <p className="mb-7 max-w-3xl text-sm text-text-muted">{result.shortDescription}</p>

          <div className="grid gap-5 lg:grid-cols-[2fr,1fr]">
            <div>
              <div className="mb-5 flex gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="mb-2 text-[15px] font-bold">Skill Description</h3>
                  <p className="text-[13.5px] text-text-muted">{result.userDescription}</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-[18px]">
                  <div className="flex gap-6 overflow-x-auto">
                    {result.files.map((file, i) => (
                      <button
                        key={file.name}
                        onClick={() => setActiveFile(i)}
                        className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-1 py-3.5 text-[13.5px] ${
                          i === activeFile
                            ? "border-accent text-text"
                            : "border-transparent text-text-dim"
                        }`}
                      >
                        <FileText className="h-3.5 w-3.5" /> {file.name}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-card2 px-3 py-1.5 text-xs text-text-muted"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="max-h-[460px] overflow-auto whitespace-pre-wrap p-5 font-mono text-[12.8px] leading-relaxed text-[#C9C9C9]">
                  {result.files[activeFile]?.content}
                </pre>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-[2fr,1fr]">
                <Button size="lg" onClick={handleDownload}>
                  <Download className="h-4 w-4" /> Download Skill (.zip)
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    setResult(null);
                    setDescription("");
                  }}
                >
                  Generate New Skill →
                </Button>
              </div>
            </div>

            <div>
              <div className="mb-5 rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-3.5 flex items-center gap-2 text-sm font-bold">
                  <Folder className="h-4 w-4 text-accent" /> {result.slug}/
                </h3>
                {result.files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center gap-2 py-1.5 pl-5 text-[13.5px] text-text-muted"
                  >
                    <FileText className="h-3.5 w-3.5" /> {file.name}
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-4 flex items-center gap-2 text-[15px] font-bold">
                  <HelpCircle className="h-4 w-4 text-accent" /> How to install this skill
                </h3>
                <ol className="text-[13.5px] text-text-muted">
                  {[
                    <>
                      <span className="font-semibold text-accent">Download</span> and unzip the
                      file
                    </>,
                    <>Go to Settings in Claude &amp; Open Capabilities &rarr; scroll to Skills</>,
                    <>Click Add Skill &rarr; Upload Skill</>,
                    <>Drag and drop the .zip file</>,
                    <>Once it&apos;s enabled click the three dots &rarr; Try in chat</>,
                    <>And voila! Now you can try your new Skill in Claude</>,
                  ].map((step, i, arr) => (
                    <li key={i} className="flex gap-3.5">
                      <div className="flex flex-col items-center">
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                        {i < arr.length - 1 && (
                          <span className="my-1.5 flex flex-1 flex-col items-center justify-center gap-[3px]">
                            <span className="h-[3px] w-[3px] rounded-full bg-text-dim" />
                            <span className="h-[3px] w-[3px] rounded-full bg-text-dim" />
                            <span className="h-[3px] w-[3px] rounded-full bg-text-dim" />
                          </span>
                        )}
                      </div>
                      <span className="pb-5 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
