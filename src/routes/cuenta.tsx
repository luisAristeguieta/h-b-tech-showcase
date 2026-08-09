import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cuenta")({
  beforeLoad: () => {
    throw redirect({
      to: "/mi-cuenta",
    });
  },
});
