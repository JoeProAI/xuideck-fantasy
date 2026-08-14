import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/draft")({
  beforeLoad: () => {
    throw redirect({ to: "/players" });
  },
});
