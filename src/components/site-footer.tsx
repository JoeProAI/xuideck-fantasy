export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
          Xuideck Fantasy
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Powered by{" "}
          <span className="text-fg">Grok Build</span>
        </p>
      </div>
    </footer>
  );
}
