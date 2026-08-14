import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/league")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
