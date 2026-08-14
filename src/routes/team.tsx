import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WeekBar } from "@/components/week-bar";
import { usePool } from "@/lib/pool";
import { ROSTER_SIZE } from "@/lib/scoring";
import { useLeague } from "@/lib/store";
import { formatPts } from "@/lib/utils";

export const Route = createFileRoute("/team")({
  component: TeamPage,
});

function TeamPage() {
  const { yours, roster, name, week, league } = usePool();
  const rename = useLeague((s) => s.renameTeam);
  const toggle = useLeague((s) => s.togglePlayer);
  const clear = useLeague((s) => s.clearRoster);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <WeekBar />
      <div className="mt-6">
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Team name
        </label>
        <Input
          value={name}
          onChange={(e) => rename(e.target.value)}
          className="mt-2 max-w-sm font-display text-3xl uppercase"
        />
      </div>
      {league ? (
        <p className="mt-2 font-mono text-xs text-muted">
          {league.name} · {league.code}
        </p>
      ) : null}
      <h1 className="mt-8 text-4xl">Lineup</h1>
      <p className="mt-2 text-sm text-muted">
        {roster.length} of {ROSTER_SIZE} starters. Drop someone to open a slot.
      </p>
      <ul className="mt-6 divide-y divide-border rounded-md border border-border bg-bg-elevated">
        {yours.map((p) => (
          <li key={p.handle} className="flex items-center gap-3 px-3 py-3">
            <img
              src={p.pfp}
              alt=""
              referrerPolicy="no-referrer"
              className="size-12 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <Link
                to="/player/$handle"
                params={{ handle: p.handle }}
                className="block truncate font-medium"
              >
                {p.name}
              </Link>
              <p className="font-mono text-xs text-muted">@{p.handle}</p>
            </div>
            <p className="score-digits text-2xl text-accent">{formatPts(p.score.adj)}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const err = toggle(p.handle);
                if (err) toast.error(err);
              }}
            >
              Drop
            </Button>
          </li>
        ))}
        {Array.from({ length: Math.max(0, ROSTER_SIZE - yours.length) }).map((_, i) => (
          <li key={`empty-${i}`}>
            <Link
              to="/players"
              className="flex min-h-16 items-center justify-between px-3 text-sm text-subtle hover:bg-bg-subtle"
            >
              Empty slot
              <span className="font-mono text-xs uppercase">Fill</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link to="/players">Find players</Link>
        </Button>
        <Button variant="ghost" onClick={clear}>
          Clear lineup
        </Button>
      </div>
      <p className="mt-4 text-xs text-subtle">Week {week} points shown.</p>
    </main>
  );
}
