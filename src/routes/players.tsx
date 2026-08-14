import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AddPlayer } from "@/components/add-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WeekBar } from "@/components/week-bar";
import { usePool } from "@/lib/pool";
import { ROSTER_SIZE, tierOf } from "@/lib/scoring";
import { useLeague } from "@/lib/store";
import { formatNumber, formatPts } from "@/lib/utils";

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

function PlayersPage() {
  const { board, roster, taken } = usePool();
  const toggle = useLeague((s) => s.togglePlayer);
  const full = roster.length >= ROSTER_SIZE;

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <WeekBar />
      <h1 className="mt-6 text-4xl">Waivers</h1>
      <p className="mt-2 max-w-xl text-muted">
        Pull any public X account. In a league, each handle can only start for one team.
      </p>
      <div className="mt-6 max-w-2xl">
        <AddPlayer />
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-border bg-bg-elevated">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border font-mono text-[11px] uppercase tracking-wider text-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">Player</th>
              <th className="px-2 py-3 font-medium">Tier</th>
              <th className="px-2 py-3 text-right font-medium">Pts</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {board.map((p) => {
              const on = roster.includes(p.handle);
              const claimed = taken.has(p.handle);
              return (
                <tr key={p.handle} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.pfp}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="size-10 rounded-full object-cover"
                      />
                      <span>
                        <span className="block font-medium">{p.name}</span>
                        <span className="font-mono text-xs text-muted">
                          @{p.handle} · {formatNumber(p.followers)}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <Badge>{claimed ? "taken" : tierOf(p.followers)}</Badge>
                  </td>
                  <td className="px-2 py-3 text-right">
                    <span className="score-digits text-2xl text-accent">
                      {formatPts(p.score.adj)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant={on ? "subtle" : "default"}
                      disabled={!on && (full || claimed)}
                      onClick={() => {
                        const err = toggle(p.handle);
                        if (err) toast.error(err);
                      }}
                    >
                      {on ? "Drop" : claimed ? "Taken" : full ? "Full" : "Add"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
