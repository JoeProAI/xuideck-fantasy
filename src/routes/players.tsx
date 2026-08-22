import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AddPlayer } from "@/components/add-player";
import { WaiverCard } from "@/components/waiver-card";
import { WeekBar } from "@/components/week-bar";
import { Input } from "@/components/ui/input";
import { usePool } from "@/lib/pool";
import { ROSTER_SIZE } from "@/lib/scoring";
import { useLeague } from "@/lib/store";
import type { Lane } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/players")({
  component: PlayersPage,
  head: () => ({
    meta: [
      { title: "Waivers | Xuideck Fantasy" },
      {
        name: "description",
        content: "Pull any public X handle. Live photo and followers. Add them to your five this week.",
      },
    ],
  }),
});

const LANES: Array<"All" | Lane> = [
  "All",
  "Founder",
  "Sports",
  "Platform",
  "Creator",
  "Engineer",
  "Writer",
  "Product",
  "Analyst",
];

function PlayersPage() {
  const { board, roster, taken } = usePool();
  const toggle = useLeague((s) => s.togglePlayer);
  const full = roster.length >= ROSTER_SIZE;
  const [lane, setLane] = useState<(typeof LANES)[number]>("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"pts" | "followers">("pts");

  const shown = useMemo(() => {
    const needle = q.replace(/^@/, "").trim().toLowerCase();
    const list = board.filter((p) => {
      if (lane !== "All" && p.lane !== lane) return false;
      if (!needle) return true;
      return (
        p.handle.toLowerCase().includes(needle) ||
        p.name.toLowerCase().includes(needle) ||
        p.bio.toLowerCase().includes(needle)
      );
    });
    if (sort === "followers") return [...list].sort((a, b) => b.followers - a.followers);
    return list;
  }, [board, lane, q, sort]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <WeekBar />
      <h1 className="mt-6 text-4xl">Waivers</h1>
      <p className="mt-2 max-w-xl text-muted">
        {board.length} public accounts in the pool. Filter, start five, or pull anyone else.
        In a league, each handle starts for one team.
      </p>
      <div className="mt-6 max-w-2xl">
        <AddPlayer />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {LANES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLane(l)}
              className={cn(
                "h-11 shrink-0 rounded-sm px-3 font-mono text-[11px] uppercase tracking-wider",
                lane === l ? "bg-accent text-accent-fg" : "bg-bg-elevated text-muted hover:text-fg",
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter the board"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="sm:max-w-sm"
          />
          <div className="flex rounded-sm border border-border bg-bg-elevated p-1">
            {(
              [
                ["pts", "Week pts"],
                ["followers", "Followers"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={cn(
                  "h-9 rounded-sm px-3 font-mono text-[11px] uppercase tracking-wider",
                  sort === key ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
        {shown.length} card{shown.length === 1 ? "" : "s"}
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => {
          const on = roster.includes(p.handle);
          const claimed = taken.has(p.handle);
          return (
            <WaiverCard
              key={p.handle}
              player={p}
              onRoster={on}
              claimed={claimed}
              full={full}
              onToggle={() => {
                const err = toggle(p.handle);
                if (err) toast.error(err);
              }}
            />
          );
        })}
      </div>
    </main>
  );
}
