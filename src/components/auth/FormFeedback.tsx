import { CircleAlertIcon } from "lucide-react";

/** Mensagem de erro de um campo, ligada ao input via `aria-describedby`. */
export function FieldError({ id, message }: { id: string; message?: string }) {
	if (!message) return null;
	return (
		<p id={id} className="text-sm text-danger">
			{message}
		</p>
	);
}

/** Erro geral do formulário (credenciais inválidas, falha de rede...). */
export function FormAlert({ message }: { message?: string }) {
	if (!message) return null;
	return (
		<div
			role="alert"
			className="flex items-start gap-2 rounded-control border border-danger/30 bg-danger-wash px-3.5 py-3 text-sm text-danger"
		>
			<CircleAlertIcon className="mt-px size-4 shrink-0" aria-hidden="true" />
			<span>{message}</span>
		</div>
	);
}
