import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ofertas")({
  beforeLoad: () => {
    throw redirect({
      to: "/catalogo",
      search: { tab: "ofertas" } as any,
    });
  },
});
