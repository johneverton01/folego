import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type GoogleSignInButtonProps = {
	callbackURL?: string;
	disabled?: boolean;
	onError?: (message: string) => void;
};

export function GoogleSignInButton({
	callbackURL = "/app",
	disabled,
	onError,
}: GoogleSignInButtonProps) {
	const [pending, setPending] = useState(false);

	async function handleClick() {
		setPending(true);
		const { error } = await authClient.signIn.social({
			provider: "google",
			callbackURL,
		});
		// Em caso de sucesso o navegador é redirecionado para o Google.
		if (error) {
			setPending(false);
			onError?.("Não foi possível entrar com o Google. Tente novamente.");
		}
	}

	return (
		<Button
			type="button"
			variant="outline"
			disabled={disabled || pending}
			onClick={handleClick}
			className="h-11 rounded-control border-line bg-surface text-base text-ink hover:bg-surface-soft hover:text-ink dark:bg-surface dark:hover:bg-surface-soft"
		>
			{pending ? (
				<LoaderCircleIcon className="animate-spin" aria-hidden="true" />
			) : (
				<GoogleIcon />
			)}
			Continuar com Google
		</Button>
	);
}

function GoogleIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
			<path
				fill="#4285F4"
				d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
			/>
			<path
				fill="#34A853"
				d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.28v3.11A12 12 0 0 0 12 24Z"
			/>
			<path
				fill="#FBBC05"
				d="M5.28 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.28a12 12 0 0 0 0 10.8l4-3.11Z"
			/>
			<path
				fill="#EA4335"
				d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.28 6.6l4 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
			/>
		</svg>
	);
}
