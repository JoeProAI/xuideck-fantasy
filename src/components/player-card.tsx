import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { ScoredPlayer } from "@/lib/types";
import { formatNumber, formatPts } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PlayerCard({ player }: { player: ScoredPlayer }) {
  const [open, setOpen] = useState(false);
  const s = player.score;

  return (
    <article className="overflow-hidden rounded-md border border-border-strong bg-paper text-ink">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full text-left">
        <div className="flex items-start justify-between px-4 pt-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
              Week {player.week} · {player.lane}
            </p>
            <h3 className="font-display text-3xl normal-case tracking-wide">{player.name}</h3>
            <p className="font-mono text-xs text-ink/60">@{player.handle}</p>
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
      </button>
      <div className={cn("border-t border-ink/10 px-4 py-3", !open && "hidden")}>
        <dl className="space-y-1 font-mono text-xs">
          <Row k="Followers" v={formatNumber(player.followers)} />
          <Row k="Posts" v={String(s.posts)} />
          <Row k="Raw" v={formatPts(s.raw)} />
          <Row k="Handicap" v={`${s.factor.toFixed(2)}x`} />
          <Row k="Eng rate" v={`${(s.avg * 100).toFixed(2)}%`} />
        </dl>
        <p className="mt-2 text-[11px] text-ink/50">{player.bio}</p>
      </div>
    </article>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink/45">{k}</dt>
      <dd className="tabular">{v}</dd>
    </div>
  );
}
