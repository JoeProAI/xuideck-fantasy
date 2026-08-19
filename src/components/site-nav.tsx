import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Swords, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/matchup", label: "Matchup", icon: Swords },
  { to: "/team", label: "My Team", icon: Users },
  { to: "/players", label: "Players", icon: Search },
  { to: "/leagues", label: "Leagues", icon: Trophy },
] as const;

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-bg/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-3xl leading-none tracking-wide">XUIDECK</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted sm:inline">
              Fantasy
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-sm px-3 py-2 text-sm text-muted transition-colors hover:text-fg",
                  (pathname === l.to || (l.to === "/leagues" && pathname.startsWith("/leagues"))) &&
                    "bg-bg-subtle text-fg",
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/standings"
              className={cn(
                "rounded-sm px-3 py-2 text-sm text-muted hover:text-fg",
                pathname === "/standings" && "bg-bg-subtle text-fg",
              )}
            >
              Standings
            </Link>
            <Link
              to="/rules"
              className={cn(
                "rounded-sm px-3 py-2 text-sm text-muted hover:text-fg",
                pathname === "/rules" && "bg-bg-subtle text-fg",
              )}
            >
              Scoring
            </Link>
          </nav>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-4">
          {links.map((l) => {
            const Icon = l.icon;
            const on =
              pathname === l.to || (l.to === "/leagues" && pathname.startsWith("/leagues"));
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] text-muted",
                    on && "text-accent",
                  )}
                >
                  <Icon className="size-5" strokeWidth={on ? 2.4 : 1.8} />
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
