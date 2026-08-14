import { CURRENT_WEEK, WEEKS } from "@/lib/scoring";
import { useLeague } from "@/lib/store";
import { cn } from "@/lib/utils";

export function WeekBar({ record }: { record?: string }) {
  const week = useLeague((s) => s.week);
  const setWeek = useLeague((s) => s.setWeek);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex rounded-sm border border-border bg-bg-elevated p-1">
        {WEEKS.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setWeek(w)}
            className={cn(
              "min-h-10 rounded-sm px-3 font-mono text-xs uppercase tracking-wider",
              w === week ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
            )}
          >
            Week {w}
            {w === CURRENT_WEEK ? " Live" : ""}
          </button>
        ))}
      </div>
      {record ? (
        <p className="font-display text-2xl tracking-wide text-muted">{record}</p>
      ) : null}
    </div>
  );
}
