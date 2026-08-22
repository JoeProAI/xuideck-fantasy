import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tierOf } from "@/lib/scoring";
import type { ScoredPlayer } from "@/lib/types";
import { formatNumber, formatPts } from "@/lib/utils";

export function WaiverCard({
  player,
  onRoster,
  claimed,
  full,
  onToggle,
}: {
  player: ScoredPlayer;
  onRoster: boolean;
  claimed: boolean;
  full: boolean;
  onToggle: () => void;
}) {
  const s = player.score;

  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-border-strong bg-paper text-ink">
      <Link
        to="/player/$handle"
        params={{ handle: player.handle }}
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex items-start justify-between gap-2 px-4 pt-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
              {player.lane} · {tierOf(player.followers)} · rk {player.rank}
            </p>
            <h3 className="truncate font-display text-3xl normal-case tracking-wide">{player.name}</h3>
            <p className="truncate font-mono text-xs text-ink/60">
              @{player.handle} · {formatNumber(player.followers)}
            </p>
          </div>
          <Badge tone="paper">{formatPts(s.adj)} pts</Badge>
        </div>
        <div className="relative mx-4 mt-3 aspect-[4/3] overflow-hidden rounded-sm bg-bg">
          <img
            src={player.pfp}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 size-full object-cover object-top"
          />
        </div>
        <p className="mt-3 flex items-baseline justify-between px-4 font-mono text-[10px] uppercase tracking-wider text-ink/45">
          <span>
            Wk {player.week} · {s.factor.toFixed(2)}x
          </span>
          <span className="truncate pl-2">{player.bio}</span>
        </p>
        <dl className="grid grid-cols-5 gap-0 px-2 py-3 font-mono text-[10px] uppercase tracking-wider">
          {(
            [
              ["R", s.R],
              ["H", s.H],
              ["HR", s.HR],
              ["RBI", s.RBI],
              ["SB", s.SB],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="text-center">
              <dt className="text-ink/45">{k}</dt>
              <dd className="tabular text-ink">{formatNumber(v)}</dd>
            </div>
          ))}
        </dl>
      </Link>
      <div className="border-t border-ink/10 p-3">
        <Button
          className="h-11 w-full"
          variant={onRoster ? "subtle" : "default"}
          disabled={!onRoster && (full || claimed)}
          onClick={onToggle}
        >
          {onRoster ? "Drop" : claimed ? "Taken" : full ? "Full" : "Start this week"}
        </Button>
      </div>
    </article>
  );
}
