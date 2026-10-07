import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const SLOT_CLASS =
	"h-12 w-11 border-line bg-surface font-mono text-lg text-ink first:rounded-l-control last:rounded-r-control data-[active=true]:border-accent data-[active=true]:ring-accent-wash aria-invalid:border-danger data-[active=true]:aria-invalid:border-danger data-[active=true]:aria-invalid:ring-danger-wash dark:bg-surface sm:w-12";

type OtpCodeInputProps = {
	id: string;
	length: number;
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	onComplete?: () => void;
	disabled?: boolean;
	invalid?: boolean;
	describedBy?: string;
};

/** Campo de código numérico (login 2FA e ativação de 2FA compartilham o mesmo visual). */
export function OtpCodeInput({
	id,
	length,
	value,
	onChange,
	onBlur,
	onComplete,
	disabled,
	invalid,
	describedBy,
}: OtpCodeInputProps) {
	const indices = Array.from({ length }, (_, i) => i);
	const half = Math.ceil(length / 2);
	const firstGroup = indices.slice(0, half);
	const secondGroup = indices.slice(half);

	return (
		<InputOTP
			id={id}
			maxLength={length}
			pattern={REGEXP_ONLY_DIGITS}
			inputMode="numeric"
			autoComplete="one-time-code"
			autoFocus
			disabled={disabled}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
			onComplete={onComplete}
			aria-invalid={invalid}
			aria-describedby={describedBy}
		>
			<InputOTPGroup>
				{firstGroup.map((i) => (
					<InputOTPSlot
						key={i}
						index={i}
						aria-invalid={invalid}
						className={SLOT_CLASS}
					/>
				))}
			</InputOTPGroup>
			<InputOTPSeparator className="text-ink-faint" />
			<InputOTPGroup>
				{secondGroup.map((i) => (
					<InputOTPSlot
						key={i}
						index={i}
						aria-invalid={invalid}
						className={SLOT_CLASS}
					/>
				))}
			</InputOTPGroup>
		</InputOTP>
	);
}
