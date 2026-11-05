import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authMiddleware } from "@/middleware/auth-middleware";

// Layout: só o Outlet, pra /app/metas/$id substituir a listagem em vez de empilhar com ela.
export const Route = createFileRoute("/app/metas")({
	beforeLoad: authMiddleware,
	component: Outlet,
});
