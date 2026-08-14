import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayerCard } from "@/components/player-card";
import { Button } from "@/components/ui/button";
import { usePool } from "@/lib/pool";
import { ROSTER_SIZE } from "@/lib/scoring";
import { useLeague } from "@/lib/store";

export const Route = createFileRoute("/player/$handle")({
  component: PlayerPage,
});

function PlayerPage() {
  const { handle } = Route.useParams();
  const { board, roster } = usePool();
  const toggle = useLeague((s) => s.togglePlayer);
  const player = board.find((p) => p.handle.toLowerCase() === handle.toLowerCase());

  if (!player) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-4xl">@{handle} is not in the pool</h1>
        <p className="mt-3 text-muted">Pull them from Players first.</p>
        <Button asChild className="mt-6">
          <Link to="/players">Open waivers</Link>
        </Button>
      </main>
    );
  }

  const on = roster.includes(player.handle);
  const full = roster.length >= ROSTER_SIZE;

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <PlayerCard player={player} />
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          onClick={() => toggle(player.handle)}
          disabled={!on && full}
          variant={on ? "outline" : "default"}
        >
          {on ? "Drop from lineup" : full ? "Lineup full" : "Start this week"}
        </Button>
        <Button asChild variant="outline">
          <a href={`https://x.com/${player.handle}`} target="_blank" rel="noreferrer">
            Open on X
          </a>
        </Button>
      </div>
    </main>
  );
}
