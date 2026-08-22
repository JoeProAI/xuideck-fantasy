import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
          Xuideck Fantasy
        </p>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          <Link to="/instructions" className="hover:text-fg">
            How to play
          </Link>
          <Link to="/rules" className="hover:text-fg">
            Scoring
          </Link>
          <Link to="/players" className="hover:text-fg">
            Players
          </Link>
          <span>
            Powered by <span className="text-fg">Grok Build</span>
          </span>
        </nav>
      </div>
    </footer>
  );
}
