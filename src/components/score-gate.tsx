import { useEffect, useState } from "react";
import { formatPts } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ScoreGate({
  you,
  them,
  yourName,
  theirName,
  winning,
  live,
}: {
  you: number;
  them: number;
  yourName: string;
  theirName: string;
  winning: boolean;
  live: boolean;
}) {
  const a = useCount(you);
  const b = useCount(them);
  const gap = Math.abs(you - them);

  return (
    <section className="overflow-hidden rounded-md border border-border-strong bg-bg-elevated">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        <span>{live ? "Live scoring" : "Final"}</span>
        <span>{winning ? `Up by ${formatPts(gap)}` : you === them ? "Tied" : `Down ${formatPts(gap)}`}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-6 sm:px-6">
        <div>
          <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {yourName}
          </p>
          <p className={cn("score-digits text-6xl sm:text-7xl", winning ? "text-accent" : "text-fg")}>
            {formatPts(a)}
          </p>
        </div>
        <div
          className={cn(
            "vs-plate flex size-14 items-center justify-center rounded-sm bg-accent font-display text-2xl text-accent-fg sm:size-16",
            !winning && you !== them && "losing bg-danger text-fg",
          )}
        >
          VS
        </div>
        <div className="text-right">
          <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {theirName}
          </p>
          <p className={cn("score-digits text-6xl sm:text-7xl", !winning && you !== them ? "text-danger" : "text-fg")}>
            {formatPts(b)}
          </p>
        </div>
      </div>
    </section>
  );
}

function useCount(target: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 700);
      const eased = 1 - (1 - t) ** 3;
      setN(from + (target - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return n;
}
