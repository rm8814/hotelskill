"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyButton({ skillMd }: { skillMd: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(skillMd);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1.5 rounded-md border border-border bg-card2 px-3 py-1.5 text-xs text-text-muted"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function DownloadButton({ slug, skillMd }: { slug: string; skillMd: string }) {
  return (
    <Button
      size="lg"
      onClick={async () => {
        const res = await fetch("/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, skillMd }),
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${slug}.zip`;
        a.click();
        URL.revokeObjectURL(url);
      }}
    >
      <Download className="h-4 w-4" /> Download Skill
    </Button>
  );
}
