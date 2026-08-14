import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pairings } from "@/lib/pairing";
import { useLeague } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/leagues/$code")({
  component: LobbyPage,
});

function LobbyPage() {
  const { code } = Route.useParams();
  const leagues = useLeague((s) => s.leagues);
  const me = useLeague((s) => s.me);
  const week = useLeague((s) => s.week);
  const setActive = useLeague((s) => s.setActiveCode);
  const addLocal = useLeague((s) => s.addLocalManager);
  const league = leagues.find((l) => l.code === code.toUpperCase());
  const [guest, setGuest] = useState("");

  if (!league) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-4xl">No league {code}</h1>
        <p className="mt-3 text-muted">Create one or join with a code.</p>
        <Button asChild className="mt-6">
          <Link to="/leagues">Leagues</Link>
        </Button>
      </main>
    );
  }

  const live = league;

  const pairs = pairings(
    live.members.map((m) => m.id),
    week,
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(live.code);
      toast.success("Code copied. Send it to your league.");
    } catch {
      toast.error("Could not copy. Code is " + live.code);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        League lobby
      </p>
      <h1 className="mt-2 text-5xl">{live.name}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-sm bg-accent px-3 py-2 font-mono text-lg tracking-[0.2em] text-accent-fg">
          {live.code}
        </span>
        <Button size="sm" onClick={copy}>
          Copy invite
        </Button>
        <Button size="sm" variant="outline" onClick={() => setActive(live.code)}>
          Make this the matchup
        </Button>
      </div>

      <h2 className="mt-10 text-2xl">Teams</h2>
      <ul className="mt-3 divide-y divide-border rounded-md border border-border bg-bg-elevated">
        {live.members.map((m) => (
          <li key={m.id} className="flex items-center justify-between px-4 py-3">
            <span>
              <span className="font-medium">{m.teamName}</span>
              {m.id === me.id ? (
                <span className="ml-2 font-mono text-[10px] uppercase text-accent">You</span>
              ) : null}
              {m.id === live.commissionerId ? (
                <span className="ml-2 font-mono text-[10px] uppercase text-muted">Commish</span>
              ) : null}
            </span>
            <span className="font-mono text-xs text-muted">{m.roster.length}/5</span>
          </li>
        ))}
      </ul>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addLocal(guest);
          setGuest("");
          toast.success("Added a manager on this device for testing.");
        }}
      >
        <Input
          value={guest}
          onChange={(e) => setGuest(e.target.value)}
          placeholder="Add a second manager here"
        />
        <Button type="submit" variant="outline">
          Add
        </Button>
      </form>
      <p className="mt-2 text-xs text-subtle">
        Friends on other phones need Firebase + Convex. Same-device testers can add a manager here.
      </p>

      <h2 className="mt-10 text-2xl">Week {week} slate</h2>
      <ul className="mt-3 space-y-2">
        {pairs.map(([a, b]) => {
          const A = live.members.find((m) => m.id === a);
          const B = live.members.find((m) => m.id === b);
          return (
            <li
              key={a + b}
              className="flex items-center justify-between rounded-md border border-border bg-bg-elevated px-4 py-3"
            >
              <span>{A?.teamName ?? "Desk Seven"}</span>
              <span className="font-display text-xl text-accent">VS</span>
              <span>{B?.teamName ?? "Desk Seven"}</span>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
