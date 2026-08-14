import { createFileRoute } from "@tanstack/react-router";
import { WeekBar } from "@/components/week-bar";
import { opponentOf } from "@/lib/pairing";
import { DESK_SEVEN } from "@/lib/players";
import { usePool } from "@/lib/pool";
import { WEEKS, scorePlayers, sumRoster } from "@/lib/scoring";
import { mergePool, useLeague } from "@/lib/store";
import { formatPts } from "@/lib/utils";

export const Route = createFileRoute("/standings")({
  component: StandingsPage,
  head: () => ({
    meta: [
      { title: "Standings | Xuideck Fantasy" },
      {
        name: "description",
        content: "Weekly W-L and points for and against. Highest handicapped score wins the week.",
      },
    ],
  }),
});

function StandingsPage() {
  const { name, roster, wins, losses, league } = usePool();
  const custom = useLeague((s) => s.custom);
  const me = useLeague((s) => s.me);

  const teams = league
    ? league.members.map((m) => {
        let w = 0;
        let l = 0;
        let pf = 0;
        let pa = 0;
        for (const week of WEEKS) {
          const board = scorePlayers(mergePool(custom), week);
          const oid = opponentOf(
            league.members.map((x) => x.id),
            m.id,
            week,
          );
          const om = league.members.find((x) => x.id === oid);
          const a = sumRoster(m.roster, board);
          const d = sumRoster(om?.roster ?? DESK_SEVEN, board);
          pf += a;
          pa += d;
          if (a > d) w += 1;
          else if (d > a) l += 1;
        }
        return { team: m.teamName, w, l, pf, pa, you: m.id === me.id };
      })
    : [
        { team: name || "You", w: wins, l: losses, pf: 0, pa: 0, you: true },
        { team: "Desk Seven", w: losses, l: wins, pf: 0, pa: 0, you: false },
      ];

  if (!league) {
    for (const week of WEEKS) {
      const board = scorePlayers(mergePool(custom), week);
      const a = sumRoster(roster, board);
      const d = sumRoster(DESK_SEVEN, board);
      teams[0].pf += a;
      teams[0].pa += d;
      teams[1].pf += d;
      teams[1].pa += a;
    }
  }

  const table = [...teams].sort((a, b) => b.w - a.w || b.pf - a.pf);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <WeekBar record={`${wins}-${losses}`} />
      <h1 className="mt-6 text-4xl">Standings</h1>
      <div className="mt-6 overflow-hidden rounded-md border border-border bg-bg-elevated">
        <table className="w-full text-sm">
          <thead className="border-b border-border font-mono text-[11px] uppercase tracking-wider text-subtle">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Team</th>
              <th className="px-2 py-3 text-right font-medium">W</th>
              <th className="px-2 py-3 text-right font-medium">L</th>
              <th className="px-2 py-3 text-right font-medium">PF</th>
              <th className="px-4 py-3 text-right font-medium">PA</th>
            </tr>
          </thead>
          <tbody>
            {table.map((t, i) => (
              <tr key={t.team + i} className="border-b border-border last:border-0">
                <td className="px-4 py-4">
                  <span className="font-mono text-xs text-muted">{i + 1}</span>{" "}
                  <span className={t.you ? "text-accent" : ""}>{t.team}</span>
                </td>
                <td className="px-2 py-4 text-right score-digits text-2xl">{t.w}</td>
                <td className="px-2 py-4 text-right score-digits text-2xl">{t.l}</td>
                <td className="px-2 py-4 text-right font-mono tabular">{formatPts(t.pf)}</td>
                <td className="px-4 py-4 text-right font-mono tabular">{formatPts(t.pa)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
