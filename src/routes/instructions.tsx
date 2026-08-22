import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PLAYERS } from "@/lib/players";
import {
  CURRENT_WEEK,
  ROSTER_SIZE,
  WEEKS,
  handicapFactor,
  scoreWeek,
} from "@/lib/scoring";
import { formatNumber, formatPts } from "@/lib/utils";

export const Route = createFileRoute("/instructions")({
  component: InstructionsPage,
  head: () => ({
    meta: [
      { title: "How to play | Xuideck Fantasy" },
      {
        name: "description",
        content:
          "Draft five public X accounts. Likes are runs, 100k posts are home runs, and a log handicap lets a small account take a week off a whale.",
      },
    ],
  }),
});

const TOC = [
  { id: "what", label: "What this is" },
  { id: "start", label: "Start here" },
  { id: "scoring", label: "Scoring" },
  { id: "handicap", label: "Handicap" },
  { id: "roster", label: "Your five" },
  { id: "home", label: "Home" },
  { id: "matchup", label: "Matchup" },
  { id: "team", label: "My Team" },
  { id: "players", label: "Players" },
  { id: "add", label: "Add anyone" },
  { id: "card", label: "Player cards" },
  { id: "weeks", label: "Weeks" },
  { id: "leagues", label: "Leagues" },
  { id: "lobby", label: "Lobby" },
  { id: "standings", label: "Standings" },
  { id: "signin", label: "Sign in" },
  { id: "modeled", label: "Live vs modeled" },
  { id: "situations", label: "If this happens" },
] as const;

const SCORING_ROWS = [
  {
    abbr: "R",
    name: "Runs",
    source: "Likes",
    pts: "1 pt each",
    why: "The crowd agreeing with the post. Volume of approval.",
  },
  {
    abbr: "H",
    name: "Hits",
    source: "Impressions ÷ 1,000",
    pts: "1 pt per 1k",
    why: "How far the posts traveled. Reach, not just fandom.",
  },
  {
    abbr: "HR",
    name: "Home runs",
    source: "Posts over 100k impressions",
    pts: "10 pts each",
    why: "A bomb. One post that clears the wall is worth more than a pile of singles.",
  },
  {
    abbr: "RBI",
    name: "RBI",
    source: "Replies + quotes",
    pts: "2 pts each",
    why: "Conversation. People talking to the account, not just scrolling past.",
  },
  {
    abbr: "SB",
    name: "Stolen bases",
    source: "Bookmarks",
    pts: "3 pts each",
    why: "They saved it. Intent, not a drive-by like.",
  },
] as const;

const HANDICAP_SAMPLES = [1_000, 10_000, 100_000, 1_000_000, 100_000_000] as const;

const hotSmall = scoreWeek(
  {
    posts: 9,
    likes: 2_400,
    impressions: 180_000,
    replies: 180,
    quotes: 40,
    bookmarks: 90,
    homeRuns: 1,
  },
  12_000,
);

const sleepyWhale = scoreWeek(
  {
    posts: 4,
    likes: 800,
    impressions: 40_000,
    replies: 40,
    quotes: 8,
    bookmarks: 20,
    homeRuns: 0,
  },
  2_000_000,
);

function InstructionsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        Playbook
      </p>
      <h1 className="mt-2 text-5xl sm:text-7xl">How to play</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Xuideck Fantasy is a weekly league where the players are public X
        accounts. You start five. Their posts score like a baseball box. Highest
        handicapped total wins the week.
      </p>

      <nav
        aria-label="On this page"
        className="mt-8 rounded-md border border-border bg-bg-elevated p-4"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
          On this page
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {TOC.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="font-mono text-[11px] uppercase tracking-wider text-muted hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section id="what" kicker="The game" title="What this is">
        <p>
          Most fantasy sports draft athletes. This drafts{" "}
          <strong className="text-fg">handles</strong>. Elon. A 2k engineer. Your
          friend who posted something that actually landed. If the profile is
          public, it can start.
        </p>
        <p className="mt-3">
          The pool ships with {PLAYERS.length} accounts already scored for weeks{" "}
          {WEEKS.join(" and ")}. Anyone else comes in through Players. You are
          not limited to what is on the board.
        </p>
        <ul className="mt-4 space-y-2 text-muted">
          <li>
            <span className="text-fg">The unit of play is a week.</span> Week{" "}
            {CURRENT_WEEK} is the live week. You can flip back to {WEEKS[0]} to
            see the previous box.
          </li>
          <li>
            <span className="text-fg">The unit of a team is five starters.</span>{" "}
            No bench. No IR. Drop someone to open a slot, add someone else.
          </li>
          <li>
            <span className="text-fg">The unit of a win is handicapped points.</span>{" "}
            Raw production times a log multiplier so follower count does not
            auto-win.
          </li>
        </ul>
      </Section>

      <Section id="start" kicker="First session" title="Start in three moves">
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "1",
              title: "Draft five",
              body: "Open Players. Start anyone on a card, or type a public handle into Add player. Fill five slots.",
              to: "/players" as const,
              label: "Open Players",
            },
            {
              n: "2",
              title: "Look at the week",
              body: "Matchup is blank until you have a roster. Then it is you versus Desk Seven, or versus a friend if you joined a league.",
              to: "/matchup" as const,
              label: "Open Matchup",
            },
            {
              n: "3",
              title: "Play people",
              body: "Create a league, copy the 6-letter code, send it. Friends pick five. One handle cannot start for two teams in the same league.",
              to: "/leagues" as const,
              label: "Open Leagues",
            },
          ].map((step) => (
            <li
              key={step.n}
              className="flex flex-col rounded-md border border-border bg-bg-elevated p-5"
            >
              <p className="font-display text-5xl text-accent">{step.n}</p>
              <h3 className="mt-3 text-2xl">{step.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{step.body}</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to={step.to}>{step.label}</Link>
              </Button>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="scoring" kicker="The box" title="Scoring">
        <p>
          Every starter puts up a baseball line for the week. The mapping is
          fixed. A compact copy of this table also lives on{" "}
          <Link to="/rules" className="text-accent underline-offset-2 hover:underline">
            Scoring
          </Link>
          .
        </p>
        <div className="mt-5 overflow-hidden rounded-md border border-border bg-bg-elevated">
          <table className="w-full text-sm">
            <thead className="border-b border-border font-mono text-[11px] uppercase tracking-wider text-subtle">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Stat</th>
                <th className="hidden px-2 py-3 text-left font-medium sm:table-cell">
                  Comes from
                </th>
                <th className="px-2 py-3 text-right font-medium">Points</th>
                <th className="hidden px-4 py-3 text-left font-medium md:table-cell">
                  Why
                </th>
              </tr>
            </thead>
            <tbody>
              {SCORING_ROWS.map((row) => (
                <tr key={row.abbr} className="border-b border-border last:border-0">
                  <td className="px-4 py-4">
                    <span className="font-display text-2xl text-accent">{row.abbr}</span>
                    <span className="ml-2 text-muted">{row.name}</span>
                    <p className="mt-1 font-mono text-[11px] text-subtle sm:hidden">
                      {row.source}
                    </p>
                  </td>
                  <td className="hidden px-2 py-4 text-muted sm:table-cell">{row.source}</td>
                  <td className="px-2 py-4 text-right font-mono">{row.pts}</td>
                  <td className="hidden px-4 py-4 text-muted md:table-cell">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-sm text-muted">
          raw = R×1 + H×1 + HR×10 + RBI×2 + SB×3
        </p>
        <p className="mt-2 text-sm text-muted">
          Hits can be a fraction because impressions are divided by 1,000. Home
          runs only count posts that cleared 100,000 impressions in the week.
          Replies and quotes are added together, then doubled. Bookmarks are
          tripled because they are rarer.
        </p>
      </Section>

      <Section id="handicap" kicker="Why a 1k can win" title="Handicap">
        <p>
          Raw points still favor whales. A log handicap shrinks that gap without
          pretending a 400-follower account is Elon.
        </p>
        <p className="mt-3 rounded-md border border-border bg-bg-elevated px-4 py-3 font-mono text-sm">
          adjusted = raw × 10 / log10(followers + 100)
        </p>
        <p className="mt-3 text-sm text-muted">
          Plus 100 inside the log so brand-new accounts do not explode. The
          board, the matchup, and standings all sort and sum on{" "}
          <span className="text-fg">adjusted</span>, not raw.
        </p>
        <div className="mt-5 overflow-hidden rounded-md border border-border bg-bg-elevated">
          <table className="w-full text-sm">
            <thead className="border-b border-border font-mono text-[11px] uppercase tracking-wider text-subtle">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Followers</th>
                <th className="px-4 py-3 text-right font-medium">Multiplier</th>
              </tr>
            </thead>
            <tbody>
              {HANDICAP_SAMPLES.map((n) => (
                <tr key={n} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono">{formatNumber(n)}</td>
                  <td className="px-4 py-3 text-right font-mono text-accent">
                    {handicapFactor(n).toFixed(2)}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <article className="rounded-md border border-border-strong bg-paper p-5 text-ink">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
              Hot 12k week
            </p>
            <h3 className="mt-1 text-3xl">One 180k post</h3>
            <p className="mt-2 font-mono text-xs text-ink/60">
              2,400 likes · 180k imp · 1 HR · 220 RBI · 90 SB
            </p>
            <p className="mt-4 font-display text-5xl text-ink">{formatPts(hotSmall.adj)}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink/50">
              raw {formatPts(hotSmall.raw)} · {hotSmall.factor.toFixed(2)}x
            </p>
          </article>
          <article className="rounded-md border border-border bg-bg-elevated p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
              Sleepy 2M week
            </p>
            <h3 className="mt-1 text-3xl">Quiet whale</h3>
            <p className="mt-2 font-mono text-xs text-muted">
              800 likes · 40k imp · 0 HR · 48 RBI · 20 SB
            </p>
            <p className="mt-4 font-display text-5xl text-accent">
              {formatPts(sleepyWhale.adj)}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-subtle">
              raw {formatPts(sleepyWhale.raw)} · {sleepyWhale.factor.toFixed(2)}x
            </p>
          </article>
        </div>
        <p className="mt-4 text-sm text-muted">
          Same formula both ways. The 12k account wins that week. That is the
          whole point of the multiplier.
        </p>
      </Section>

      <Section id="roster" kicker="Lineup rules" title="Your five">
        <ul className="space-y-3 text-muted">
          <li>
            <span className="text-fg">Capacity is {ROSTER_SIZE}.</span> Start
            fewer while you fill. The matchup stays in empty-state until at
            least one starter is on the card; the week is a real contest once
            five are locked.
          </li>
          <li>
            <span className="text-fg">No lock.</span> Drop and add all week. There
            is no waiver deadline and no Tuesday night freeze.
          </li>
          <li>
            <span className="text-fg">Solo play has no exclusivity.</span> Until
            you join a league, anyone you start is only on your device. Desk
            Seven is the house opponent.
          </li>
          <li>
            <span className="text-fg">Leagues are exclusive.</span> If a handle is
            already started by another team in your active league, the card
            reads Taken. You cannot steal them without that manager dropping.
          </li>
          <li>
            <span className="text-fg">One active league at a time</span> for the
            matchup. Switch which league you are playing from Leagues. Your
            solo five and a league five are separate.
          </li>
        </ul>
      </Section>

      <Section id="home" kicker="Landing" title="Home">
        <p>
          The front page is the pitch, not your scoreboard. Faces from the pool,
          the five scoring letters, three steps, and a blank-board promise. It
          will not show a sample JoePro lineup or a fake box score.
        </p>
        <p className="mt-3">
          Draft five, start a league, or come back here if you want the
          explanation again. Your actual week lives under Matchup.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/">Back to home</Link>
        </Button>
      </Section>

      <Section id="matchup" kicker="The scoreboard" title="Matchup">
        <p>
          This is the game screen. Until your roster has names, it tells you to
          pick five. After that:
        </p>
        <ul className="mt-3 space-y-2 text-muted">
          <li>
            <span className="text-fg">Score gate</span> on top. Your handicapped
            total versus theirs. Live if you are on week {CURRENT_WEEK}. Up,
            down, or tied, with the gap.
          </li>
          <li>
            <span className="text-fg">Two lineups.</span> Left is you. Right is
            the opponent. Each row is a starter with that week’s adjusted
            points.
          </li>
          <li>
            <span className="text-fg">No league?</span> You play Desk Seven, a
            locked house squad. Start a league when you want a human on the
            other side.
          </li>
          <li>
            <span className="text-fg">In a league?</span> The header shows the
            league name and 6-letter code. The other side is whoever the week’s
            pairing gave you. Odd team out plays Desk Seven.
          </li>
        </ul>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/matchup">Open Matchup</Link>
        </Button>
      </Section>

      <Section id="team" kicker="Roster desk" title="My Team">
        <p>Name the squad. See the five. Drop anyone. Clear the whole card.</p>
        <ul className="mt-3 space-y-2 text-muted">
          <li>
            <span className="text-fg">Team name</span> is an input at the top.
            In a league it also updates your member name on the lobby.
          </li>
          <li>
            <span className="text-fg">Each starter</span> shows photo, name,
            handle, and this week’s adjusted points. Tap the name for the full
            card. Drop opens the slot.
          </li>
          <li>
            <span className="text-fg">Empty slot</span> jumps to Players so you
            can fill it.
          </li>
          <li>
            <span className="text-fg">Clear lineup</span> empties all five. In a
            league it only clears your team, not everyone else’s.
          </li>
        </ul>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/team">Open My Team</Link>
        </Button>
      </Section>

      <Section id="players" kicker="Waivers" title="Players">
        <p>
          The board. {PLAYERS.length} public accounts as baseball cards, plus
          anyone you pull. This is where you start the week.
        </p>
        <ul className="mt-3 space-y-2 text-muted">
          <li>
            <span className="text-fg">Lane chips</span> — All, Founder, Sports,
            Platform, Creator, Engineer, Writer, Product, Analyst. A lane is a
            flavor tag, not a required roster slot. You can start five Founders.
          </li>
          <li>
            <span className="text-fg">Filter</span> matches handle, name, or
            bio. Skip the @ if you want; it is stripped.
          </li>
          <li>
            <span className="text-fg">Sort</span> Week pts (default, handicap
            already applied) or Followers.
          </li>
          <li>
            <span className="text-fg">Each card</span> shows lane, size tier
            (micro / mid / macro / whale), board rank, photo, follower count,
            this week’s multiplier, a truncated bio, and the R / H / HR / RBI /
            SB line.
          </li>
          <li>
            <span className="text-fg">The button</span> is Start this week, Drop
            if they are already yours, Taken if a league rival started them, or
            Full if you already have {ROSTER_SIZE}.
          </li>
          <li>
            <span className="text-fg">Tap the card, not the button,</span> to
            open the player page.
          </li>
        </ul>
        <p className="mt-3 text-sm text-muted">
          Size tiers: micro under 10k followers, mid to 100k, macro to 1M, whale
          after that. Rank is this week’s handicapped order across the whole
          pool, including anyone you added.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/players">Open Players</Link>
        </Button>
      </Section>

      <Section id="add" kicker="Any public handle" title="Add anyone">
        <p>
          The Add player field on Players looks up a live public profile. Photo
          and follower count come from the account. The weekly box is modeled
          from size until a full metrics feed is wired — same model the rest of
          the expanded pool uses.
        </p>
        <ul className="mt-3 space-y-2 text-muted">
          <li>Type the handle with or without @.</li>
          <li>Valid handles are 1–15 letters, numbers, or underscores.</li>
          <li>Private, suspended, or missing profiles fail the lookup. Try another.</li>
          <li>
            If you have an open slot, the new account is started for you
            automatically. If the lineup is full they still join the pool; drop
            someone, then start them.
          </li>
          <li>
            Custom pulls stay on this device (and in a signed-in league if you
            start them there). They are merged into the board next to the
            shipped pool.
          </li>
        </ul>
      </Section>

      <Section id="card" kicker="The paper card" title="Player page">
        <p>
          Every handle has a page at <span className="font-mono text-fg">/player/handle</span>.
          Paper baseball card, week lane, photo, the five stats, and the
          handicapped total. Tap the card to expand followers, post count, raw
          points, multiplier, and engagement rate.
        </p>
        <p className="mt-3">
          Start or drop from here. Open on X jumps to the real profile. If you
          typed a URL for someone who is not in the pool yet, you will be sent
          to Players to pull them first.
        </p>
      </Section>

      <Section id="weeks" kicker="The calendar" title="Weeks">
        <p>
          The week bar sits on Matchup, My Team, Players, and Standings. Right
          now the slate is {WEEKS.map((w) => `week ${w}`).join(" and ")}. Week{" "}
          {CURRENT_WEEK} is marked Live.
        </p>
        <p className="mt-3">
          Flipping the bar only changes which box you are looking at. Your
          roster does not reset. Standings still count every week in the slate
          against that same five — so a drop now also rewrites last week’s
          hypothetical. There is no historic lock yet. Play the live week as
          the one that matters.
        </p>
      </Section>

      <Section id="leagues" kicker="Multiplayer" title="Leagues">
        <p>
          A league is a named room with a 6-letter code. You create one, or you
          join one. Then every manager drafts five. Handles cannot be shared
          inside that league.
        </p>
        <ul className="mt-3 space-y-2 text-muted">
          <li>
            <span className="text-fg">Your name</span> at the top of Leagues is
            who you are as a manager. Separate from the team name you put on a
            specific league.
          </li>
          <li>
            <span className="text-fg">Create</span> asks for a league name and
            your team name. You become commissioner. The code uses letters and
            digits that do not look like each other (no 0/O, 1/I).
          </li>
          <li>
            <span className="text-fg">Join</span> needs that code plus your team
            name. If you already belong, Join just makes it the active league.
          </li>
          <li>
            <span className="text-fg">Yours</span> lists every league on this
            browser. Play sets it active (Matchup and Players now use that
            league’s rosters). Lobby opens the room.
          </li>
          <li>
            <span className="text-fg">This device</span> means the league only
            exists in this browser until you sign in.{" "}
            <span className="text-fg">Live</span> means it is in the cloud and
            friends on other phones can join the same code.
          </li>
        </ul>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/leagues">Open Leagues</Link>
        </Button>
      </Section>

      <Section id="lobby" kicker="The room" title="League lobby">
        <p>
          Each league has a lobby at <span className="font-mono text-fg">/leagues/CODE</span>.
        </p>
        <ul className="mt-3 space-y-2 text-muted">
          <li>
            <span className="text-fg">Copy invite</span> puts the 6-letter code
            on the clipboard. Text that to the group.
          </li>
          <li>
            <span className="text-fg">Make this the matchup</span> sets the
            league active so Matchup, My Team, and Players all talk to it.
          </li>
          <li>
            <span className="text-fg">Teams</span> lists every manager, who is
            you, who is commissioner, and how many of five they have started.
          </li>
          <li>
            <span className="text-fg">Add a second manager here</span> is for
            testing on one phone. It does not invite a real person. Friends on
            other phones need you signed in so the league is live.
          </li>
          <li>
            <span className="text-fg">Week slate</span> is the pairing for the
            week on the week bar. Pairings rotate. An odd number of teams gives
            someone Desk Seven that week.
          </li>
        </ul>
      </Section>

      <Section id="standings" kicker="The table" title="Standings">
        <p>Sorted by wins, then points for.</p>
        <ul className="mt-3 space-y-2 text-muted">
          <li>
            <span className="text-fg">W / L</span> — a week is a win if your
            five’s adjusted total beat the opponent that week. A tie is neither
            a win nor a loss.
          </li>
          <li>
            <span className="text-fg">PF / PA</span> — points for and against,
            summed across weeks {WEEKS.join(" and ")}.
          </li>
          <li>
            <span className="text-fg">No league</span> still shows you versus
            Desk Seven so the table is never empty.
          </li>
          <li>
            Your row is highlighted. The week bar’s record is your W-L for the
            same math.
          </li>
        </ul>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/standings">Open Standings</Link>
        </Button>
      </Section>

      <Section id="signin" kicker="Across phones" title="Sign in">
        <p>
          You can play the whole game signed out. Lineup, custom pulls, and
          local leagues live in this browser.
        </p>
        <p className="mt-3">
          Sign in on Leagues when you want friends on other phones. Google or
          email. Once you are in, Create and Join talk to the cloud. The same
          6-letter code works on their device.
        </p>
        <p className="mt-3 text-sm text-muted">
          Signing in also stamps your manager id so the lobby can tell you from
          a guest you added on this device. Sign out does not delete the local
          roster.
        </p>
      </Section>

      <Section id="modeled" kicker="Honesty" title="Live vs modeled">
        <p>Two different things are true at once:</p>
        <ul className="mt-3 space-y-2 text-muted">
          <li>
            <span className="text-fg">Identity is live</span> when you add a
            handle — name, photo, bio, follower count from the public profile.
          </li>
          <li>
            <span className="text-fg">The weekly box is modeled</span> for the
            expanded pool and for every custom pull. Same handle and week always
            produce the same line. Volume scales with log(followers), and some
            weeks run hot, so a 10k account can outscore a quiet whale.
          </li>
          <li>
            <span className="text-fg">A small core</span> of accounts keep
            hand-tuned weeks around the mid-August algo drop — the board
            leaders you see first (Elon, Grok, Doge Designer, X Open Source)
            are that set. That is why a 6k open-source account can sit above
            Curry.
          </li>
        </ul>
        <p className="mt-3">
          When a full metrics feed lands, the mapping does not change. Likes
          stay runs. 100k stays a home run. The numbers on the cards get more
          real.
        </p>
      </Section>

      <Section id="situations" kicker="Unstick yourself" title="If this happens">
        <dl className="divide-y divide-border overflow-hidden rounded-md border border-border bg-bg-elevated">
          {[
            [
              "Matchup is empty",
              "You have zero starters. Go to Players and start five. The scoreboard will not invent a demo.",
            ],
            [
              "The button says Full",
              "You already have five. Drop one on My Team or on that card, then start the new one.",
            ],
            [
              "The button says Taken",
              "Someone in your active league started that handle. Ask them to drop, or pick someone else. In solo play this never happens.",
            ],
            [
              "Lookup failed",
              "The handle is private, banned, mistyped, or not an X account. Handles max out at 15 characters.",
            ],
            [
              "Friend cannot join my code",
              "The league is still this-device. Sign in, create (or recreate) so it reads live, then send the code again.",
            ],
            [
              "I am playing Desk Seven in a league",
              "Odd number of teams this week. The pairing bye is the house squad. Next week it rotates.",
            ],
            [
              "Last week’s score changed when I dropped someone",
              "The roster is live across the slate. Historic lock is not on yet. Treat week " +
                CURRENT_WEEK +
                " as the one you are playing.",
            ],
            [
              "I lost my lineup",
              "It lives in this browser. Another phone, a private window, or a cleared cache is a new manager. Sign in and use a live league if you need the same five on two devices.",
            ],
            [
              "I just want the scoring table",
              "Scoring is the short version. This page is the full one.",
            ],
          ].map(([q, a]) => (
            <div key={q} className="px-4 py-4">
              <dt className="font-medium text-fg">{q}</dt>
              <dd className="mt-1 text-sm text-muted">{a}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/players">Draft five</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/rules">Scoring table</Link>
          </Button>
        </div>
      </Section>
    </main>
  );
}

function Section({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-10 mt-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{kicker}</p>
      <h2 className="mt-2 text-4xl">{title}</h2>
      <div className="mt-4 max-w-3xl text-muted">{children}</div>
    </section>
  );
}
