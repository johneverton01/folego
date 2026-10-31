import { createFileRoute } from "@tanstack/react-router";
import { authMiddleware } from "@/middleware/auth-middleware";

export const Route = createFileRoute("/app/historico")({
  beforeLoad: authMiddleware,
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/historico"!</div>;
}
