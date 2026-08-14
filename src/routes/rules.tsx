import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rules")({
  component: RulesPage,
  head: () => ({
    meta: [
      { title: "Scoring | Xuideck Fantasy" },
      {
        name: "description",
        content: "Likes are runs. Impressions are hits. A 100k post is a home run. Small accounts get a log handicap.",
      },
    ],
  }),
});

function RulesPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        How to play
      </p>
      <h1 className="mt-2 text-5xl">Stupid simple</h1>
      <ol className="mt-6 list-decimal space-y-3 pl-5 text-muted">
        <li>Set five starters.</li>
        <li>Add any public X handle from Players.</li>
        <li>Highest handicapped score beats Desk Seven.</li>
      </ol>
      <h2 className="mt-10 text-3xl">Scoring</h2>
      <table className="mt-4 w-full text-sm">
        <tbody>
          {[
            ["R", "Likes", "1 pt"],
            ["H", "Impressions / 1,000", "1 pt"],
            ["HR", "Posts over 100k impressions", "10 pts"],
            ["RBI", "Replies + quotes", "2 pts"],
            ["SB", "Bookmarks", "3 pts"],
          ].map((row) => (
            <tr key={row[0]} className="border-b border-border">
              <td className="py-3 font-mono text-muted">{row[0]}</td>
              <td className="py-3">{row[1]}</td>
              <td className="py-3 text-right font-mono">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="mt-10 text-3xl">Handicap</h2>
      <p className="mt-3 text-muted">
        Adjusted = raw times 10 / log10(followers + 100). Small accounts keep a
        bigger multiplier. Whales still post huge raw numbers. The board sorts on
        adjusted so a 1k account can take a week.
      </p>
      <p className="mt-4 text-sm text-subtle">
        New pulls use live photo and followers. Their weekly box is modeled from
        account size until a full metrics feed is wired.
      </p>
    </main>
  );
}
