import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthPanel } from "@/components/auth-panel";
import { SetupCloud } from "@/components/setup-cloud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeague } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/leagues")({
  component: LeaguesPage,
  head: () => ({
    meta: [
      { title: "Leagues | Xuideck Fantasy" },
      {
        name: "description",
        content: "Create a league, share a 6-letter code, and play friends. Any public X account can be drafted.",
      },
    ],
  }),
});

function LeaguesPage() {
  const leagues = useLeague((s) => s.leagues);
  const activeCode = useLeague((s) => s.activeCode);
  const createLeague = useLeague((s) => s.createLeague);
  const joinLeague = useLeague((s) => s.joinLeague);
  const setActive = useLeague((s) => s.setActiveCode);
  const me = useLeague((s) => s.me);
  const setMyName = useLeague((s) => s.setMyName);

  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [code, setCode] = useState("");

  function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const league = createLeague(name, team);
    toast.success(`League up. Code ${league.code}`);
    setName("");
  }

  function onJoin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const league = joinLeague(code, team);
      toast.success(`Joined ${league.name}`);
      setCode("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join.");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        Multiplayer
      </p>
      <h1 className="mt-2 text-5xl">Leagues</h1>
      <p className="mt-3 text-muted">
        Make a league. Share the 6-letter code. Friends join, pick five, play you
        every week.
      </p>

      <AuthPanel />

      <label className="mt-6 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Your name
      </label>
      <Input
        value={me.name}
        onChange={(e) => setMyName(e.target.value)}
        className="mt-2 max-w-sm"
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <form onSubmit={onCreate} className="rounded-md border border-border bg-bg-elevated p-4">
          <h2 className="text-2xl">Create</h2>
          <Input
            className="mt-3"
            placeholder="League name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            className="mt-2"
            placeholder="Your team name"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          />
          <Button type="submit" className="mt-3 w-full">
            Create league
          </Button>
        </form>
        <form onSubmit={onJoin} className="rounded-md border border-border bg-bg-elevated p-4">
          <h2 className="text-2xl">Join</h2>
          <Input
            className="mt-3 font-mono uppercase"
            placeholder="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <Input
            className="mt-2"
            placeholder="Your team name"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          />
          <Button type="submit" variant="outline" className="mt-3 w-full">
            Join with code
          </Button>
        </form>
      </div>

      <h2 className="mt-10 text-2xl">Yours</h2>
      {leagues.length === 0 ? (
        <p className="mt-3 text-sm text-muted">None yet. Create one above.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border rounded-md border border-border bg-bg-elevated">
          {leagues.map((l) => (
            <li key={l.code} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-medium">{l.name}</p>
                <p className="font-mono text-xs text-muted">
                  {l.code} · {l.members.length} team{l.members.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={activeCode === l.code ? "default" : "outline"}
                  onClick={() => setActive(l.code)}
                >
                  {activeCode === l.code ? "Active" : "Play"}
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <Link to="/leagues/$code" params={{ code: l.code }}>
                    Lobby
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10">
        <SetupCloud />
      </div>
    </main>
  );
}
