import { createFileRoute, Link } from "@tanstack/react-router";
import { LineupRow } from "@/components/lineup-row";
import { LaunchPost } from "@/components/launch-post";
import { ScoreGate } from "@/components/score-gate";
import { WeekBar } from "@/components/week-bar";
import { Button } from "@/components/ui/button";
import { usePool } from "@/lib/pool";
import { ROSTER_SIZE } from "@/lib/scoring";

export const Route = createFileRoute("/")({
  component: MatchupPage,
});

function MatchupPage() {
  const { you, them, yours, theirs, winning, live, name, week, wins, losses, league, oppName } =
    usePool();

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <WeekBar record={`${wins}-${losses}`} />
      {league ? (
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-muted">
          {league.name} · {league.code}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted">
          Solo vs Desk Seven.{" "}
          <Link to="/leagues" className="text-accent underline-offset-2 hover:underline">
            Start a league
          </Link>{" "}
          to play friends.
        </p>
      )}
      <div className="mt-5">
        <ScoreGate
          you={you}
          them={them}
          yourName={name || "You"}
          theirName={oppName}
          winning={winning}
          live={live}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-md border border-border bg-bg-elevated">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-2xl">{name || "You"}</h2>
            <span className="font-mono text-xs text-muted">
              {yours.length}/{ROSTER_SIZE}
            </span>
          </header>
          {Array.from({ length: ROSTER_SIZE }).map((_, i) => (
            <LineupRow key={i} player={yours[i]} emptyLabel={`Starter ${i + 1} open`} />
          ))}
        </section>
        <section className="rounded-md border border-border bg-bg-elevated">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-2xl">{oppName}</h2>
            <span className="font-mono text-xs text-muted">
              {oppName === "Desk Seven" ? "Locked" : "Live"}
            </span>
          </header>
          {Array.from({ length: ROSTER_SIZE }).map((_, i) => (
            <LineupRow key={theirs[i]?.handle ?? i} player={theirs[i]} emptyLabel="Empty" />
          ))}
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/players">Add anyone on X</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/leagues">Leagues</Link>
        </Button>
      </div>
      <p className="mt-4 text-sm text-muted">
        Week {week}. Five starters. Highest handicapped score wins.
      </p>
      <LaunchPost />
    </main>
  );
}
