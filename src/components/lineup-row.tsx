import { Link } from "@tanstack/react-router";
import type { ScoredPlayer } from "@/lib/types";
import { formatPts } from "@/lib/utils";

export function LineupRow({
  player,
  emptyLabel,
}: {
  player?: ScoredPlayer;
  emptyLabel: string;
}) {
  if (!player) {
    return (
      <Link
        to="/players"
        className="flex min-h-16 items-center justify-between border-b border-border px-3 py-2 text-sm text-subtle hover:bg-bg-subtle"
      >
        <span>{emptyLabel}</span>
        <span className="font-mono text-xs uppercase tracking-wider">Add</span>
      </Link>
    );
  }

  return (
    <Link
      to="/player/$handle"
      params={{ handle: player.handle }}
      className="flex min-h-16 items-center gap-3 border-b border-border px-3 py-2 hover:bg-bg-subtle"
    >
      <img
        src={player.pfp}
        alt=""
        referrerPolicy="no-referrer"
        className="size-10 shrink-0 rounded-full object-cover outline outline-1 -outline-offset-1 outline-white/10"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{player.name}</span>
        <span className="block truncate font-mono text-[11px] text-muted">
          @{player.handle} · {player.lane}
        </span>
      </span>
      <span className="score-digits text-2xl text-accent">{formatPts(player.score.adj)}</span>
    </Link>
  );
}
