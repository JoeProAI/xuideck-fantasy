import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-sm border border-border bg-bg-elevated px-3 text-sm text-fg outline-none placeholder:text-subtle focus:border-border-strong",
        className,
      )}
      {...props}
    />
  );
}
