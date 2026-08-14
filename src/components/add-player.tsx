import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePool } from "@/lib/pool";
import { ROSTER_SIZE } from "@/lib/scoring";
import { useLeague } from "@/lib/store";
import { formatNumber } from "@/lib/utils";
import { lookupXUser } from "@/lib/x-lookup";

export function AddPlayer({ onAdded }: { onAdded?: (handle: string) => void }) {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lookup = useServerFn(lookupXUser);
  const addCustom = useLeague((s) => s.addCustom);
  const togglePlayer = useLeague((s) => s.togglePlayer);
  const { roster } = usePool();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const handle = value.replace(/^@/, "").trim();
    if (!handle) {
      setError("Type a handle first.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const result = await lookup({ data: { handle } });
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      addCustom(result.player);
      if (!roster.includes(result.player.handle) && roster.length < ROSTER_SIZE) {
        togglePlayer(result.player.handle);
      }
      toast.success(
        `Got @${result.player.handle}. ${formatNumber(result.player.followers)} followers.`,
      );
      setValue("");
      onAdded?.(result.player.handle);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lookup failed. Try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Any public handle. Try pmarca"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "add-player-error" : undefined}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={pending} className="shrink-0">
          {pending ? <Loader2 className="animate-spin" /> : <Plus />}
          Add player
        </Button>
      </div>
      {error ? (
        <p id="add-player-error" className="text-sm text-danger">
          {error}
        </p>
      ) : (
        <p className="text-xs text-subtle">
          Live photo and followers. Week score uses public size until full metrics land.
        </p>
      )}
    </form>
  );
}
