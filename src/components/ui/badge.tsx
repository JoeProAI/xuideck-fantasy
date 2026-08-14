import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"span"> & { tone?: "default" | "paper" | "ok" | "warn" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase",
        tone === "default" && "bg-bg-subtle text-muted",
        tone === "paper" && "bg-accent text-accent-fg",
        tone === "ok" && "bg-ok/15 text-ok",
        tone === "warn" && "bg-danger/15 text-danger",
        className,
      )}
      {...props}
    />
  );
}
