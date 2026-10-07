/** Conjunto fechado de falhas de autenticação conhecidas pelo domínio. */
export type AuthErrorCode =
	| "INVALID_CREDENTIALS"
	| "EMAIL_NOT_VERIFIED"
	| "USER_BANNED"
	| "EMAIL_ALREADY_IN_USE"
	| "WEAK_PASSWORD"
	| "INVALID_EMAIL"
	| "INVALID_NAME"
	| "UNKNOWN";

/**
 * Erro de domínio da autenticação. Carrega apenas um código estável — a
 * mensagem exibida ao usuário é responsabilidade da camada de apresentação.
 */
export class AuthError extends Error {
	readonly code: AuthErrorCode;

	constructor(code: AuthErrorCode, message = code) {
		super(message);
		this.name = "AuthError";
		this.code = code;
	}
}
