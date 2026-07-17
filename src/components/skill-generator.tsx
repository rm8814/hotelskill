"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Check, Download, KeyRound } from "lucide-react";

interface SkillFile {
  name: string;
  content: string;
}

interface GeneratedSkill {
  slug: string;
  title: string;
  skillMd: string;
  files: SkillFile[];
  userDescription: string;
}

const STORAGE_KEY = "hotelskill_api_key";

export function SkillGenerator() {
  const [apiKey, setApiKey] = useState("");
  const [rememberKey, setRememberKey] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GeneratedSkill | null>(null);
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      setApiKey(saved);
      setRememberKey(true);
    }
  }, []);

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
    if (!description.trim()) {
      setError("Please describe the skill you want first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, apiKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
      setActiveFile(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
    <div id="generator" className="mx-auto max-w-[640px] scroll-mt-24">
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
      <Button
        size="lg"
        onClick={handleCreate}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Generating...
          </>
        ) : (
          "Create Skill"
        )}
      </Button>

      {error && (
        <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3.5 text-[13.5px] text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-14 text-left">
          <h2 className="mb-1 text-2xl font-extrabold">{result.title}</h2>
          <p className="mb-7 text-sm text-text-muted">{result.userDescription}</p>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-[18px]">
              <div className="flex gap-6 overflow-x-auto">
                {result.files.map((file, i) => (
                  <button
                    key={file.name}
                    onClick={() => setActiveFile(i)}
                    className={`whitespace-nowrap border-b-2 px-1 py-3.5 text-[13.5px] ${
                      i === activeFile
                        ? "border-accent text-text"
                        : "border-transparent text-text-dim"
                    }`}
                  >
                    {file.name}
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

          {result.files.length > 1 && (
            <p className="mt-3 text-[12.5px] text-text-dim">
              This skill includes {result.files.length - 1} reference file
              {result.files.length - 1 > 1 ? "s" : ""} — they'll be included in the
              download inside a <code className="rounded bg-card px-1">references/</code> folder.
            </p>
          )}

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[2fr,1fr]">
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
      )}
    </div>
  );
}
