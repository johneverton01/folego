import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

/** Id do usuário logado; use só dentro do handler de uma server function. */
export async function requireUserId() {
	const session = await auth.api.getSession({ headers: getRequest().headers });
	if (!session) throw new Error("Não autenticado");
	return session.user.id;
}
