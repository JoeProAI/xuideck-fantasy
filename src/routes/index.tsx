import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FEATURED_HANDLES, PLAYERS } from "@/lib/players";
import { APP_DESCRIPTION, APP_TAGLINE } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: `Xuideck Fantasy | ${APP_TAGLINE}` },
      { name: "description", content: APP_DESCRIPTION },
    ],
  }),
});

const SCORING = [
  ["R", "Likes"],
  ["H", "Impressions / 1k"],
  ["HR", "Posts over 100k"],
  ["RBI", "Replies + quotes"],
  ["SB", "Bookmarks"],
] as const;

const STEPS = [
  {
    title: "Pull any handle",
    body: "Elon. A 2k account. Your friend. If the profile is public, it can start.",
  },
  {
    title: "Lock five",
    body: "Five starters. Drop and add all week. One handle per team in a league.",
  },
  {
    title: "Win the week",
    body: "Highest handicapped score takes it. Small accounts keep a log multiplier so whales do not auto-win.",
  },
];

function HomePage() {
  const faces = FEATURED_HANDLES.map((h) => PLAYERS.find((p) => p.handle === h)).filter(
    (p): p is (typeof PLAYERS)[number] => Boolean(p),
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        Weekly fantasy. The players are X accounts.
      </p>
      <h1 className="mt-4 text-6xl sm:text-8xl">
        Draft any
        <span className="mt-1 block text-accent">account on X</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Likes are runs. A 100k post is a home run. You start five. Play your friends
        every week.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/players">Draft five</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/leagues">Start a league</Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link to="/instructions">How to play</Link>
        </Button>
      </div>

      <ul className="-mx-4 mt-12 flex snap-x snap-mandatory flex-nowrap gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin]">
        {faces.map((p) => (
          <li
            key={p.handle}
            className="w-36 shrink-0 snap-start overflow-hidden rounded-md border border-ink/10 bg-paper text-ink"
          >
            <img
              src={p.pfp}
              alt=""
              referrerPolicy="no-referrer"
              className="aspect-[4/5] w-full object-cover object-top"
            />
            <p className="truncate px-2.5 py-2 font-mono text-[11px] tracking-wide">
              @{p.handle}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
        Draft these. Or anyone else.
      </p>

      <div className="mt-12 grid grid-cols-5 gap-px overflow-hidden rounded-md border border-border bg-border">
        {SCORING.map(([abbr, label]) => (
          <div key={abbr} className="bg-bg-elevated px-2 py-4 sm:px-4 sm:py-5">
            <p className="font-display text-2xl text-accent sm:text-4xl">{abbr}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-muted sm:text-[11px]">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 max-w-2xl text-sm text-muted">
        Then a log handicap: adjusted = raw × 10 / log10(followers + 100). A 1k
        account can take a week off a whale.
      </p>

      <ol className="mt-12 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="rounded-md border border-border bg-bg-elevated p-5">
            <p className="font-display text-5xl text-accent">{i + 1}</p>
            <h2 className="mt-3 text-2xl">{step.title}</h2>
            <p className="mt-2 text-sm text-muted">{step.body}</p>
          </li>
        ))}
      </ol>

      <section className="mt-12 rounded-md border border-border-strong bg-bg-elevated px-5 py-8 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Your board starts blank
        </p>
        <h2 className="mt-2 text-4xl">No sample lineup. No demo score.</h2>
        <p className="mt-3 max-w-xl text-muted">
          Matchup stays empty until you pick five. That is the game, not a
          placeholder box score.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/players">Add anyone on X</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/matchup">Open matchup</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/instructions">Read the instructions</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
