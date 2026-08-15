import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LAUNCH_POST, LAUNCH_REPLY } from "@/lib/seo";

export function LaunchPost() {
  const [copied, setCopied] = useState<"post" | "reply" | null>(null);

  async function copy(text: string, which: "post" | "reply") {
    await navigator.clipboard.writeText(text);
    setCopied(which);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <section className="mt-10 rounded-md border border-border-strong bg-bg-elevated">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Launch post</p>
          <h2 className="text-2xl">Copy and post</h2>
        </div>
        <Button size="sm" onClick={() => copy(LAUNCH_POST, "post")}>
          {copied === "post" ? <Check /> : <Copy />}
          {copied === "post" ? "Copied" : "Copy post"}
        </Button>
      </header>
      <pre className="whitespace-pre-wrap px-4 py-4 font-mono text-sm leading-relaxed text-fg">
        {LAUNCH_POST}
      </pre>
      <div className="border-t border-border px-4 py-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Reply with the rules
          </p>
          <Button size="sm" variant="outline" onClick={() => copy(LAUNCH_REPLY, "reply")}>
            {copied === "reply" ? <Check /> : <Copy />}
            {copied === "reply" ? "Copied" : "Copy reply"}
          </Button>
        </div>
        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted">
          {LAUNCH_REPLY}
        </pre>
      </div>
    </section>
  );
}
