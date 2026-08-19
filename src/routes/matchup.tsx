import { createFileRoute, Link } from "@tanstack/react-router";
import { LineupRow } from "@/components/lineup-row";
import { ScoreGate } from "@/components/score-gate";
import { WeekBar } from "@/components/week-bar";
import { Button } from "@/components/ui/button";
import { usePool } from "@/lib/pool";
import { ROSTER_SIZE } from "@/lib/scoring";

export const Route = createFileRoute("/matchup")({
  component: MatchupPage,
  head: () => ({
    meta: [
      { title: "Matchup | Xuideck Fantasy" },
      {
        name: "description",
        content: "Your five versus theirs. Highest handicapped score wins the week.",
      },
    ],
  }),
});

function MatchupPage() {
  const { you, them, yours, theirs, winning, live, name, week, wins, losses, league, oppName, roster } =
    usePool();
  const empty = roster.length === 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <WeekBar record={empty ? undefined : `${wins}-${losses}`} />
      {league ? (
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-muted">
          {league.name} · {league.code}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted">
          Practice week vs Desk Seven.{" "}
          <Link to="/leagues" className="text-accent underline-offset-2 hover:underline">
            Start a league
          </Link>{" "}
          to play friends.
        </p>
      )}

      {empty ? (
        <section className="mt-8 rounded-md border border-border-strong bg-bg-elevated px-5 py-10 text-center sm:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Lineup empty
          </p>
          <h1 className="mt-3 text-5xl sm:text-6xl">Pick five. Then this is a matchup.</h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            No sample scores. Draft any public X account and the week starts on your roster.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/players">Draft anyone on X</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/leagues">Start a league</Link>
            </Button>
          </div>
        </section>
      ) : (
        <>
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
        </>
      )}
    </main>
  );
}
