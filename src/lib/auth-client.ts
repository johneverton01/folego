import { twoFactorClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	// O redirecionamento para o 2FA é tratado no próprio formulário de sign-in
	// (via `data.twoFactorRedirect`), sem recarregar a página.
	plugins: [twoFactorClient()],
});
