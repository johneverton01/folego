import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { authClient } from "@/lib/auth-client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function DropdownMenuProfile() {
	const { user } = useCurrentUser();
	const navigate = useNavigate();

	const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

	async function handleSignOut() {
		await authClient.signOut();
		navigate({ to: "/auth/sign-in" });
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<span className="grid size-8 place-items-center rounded-full bg-accent font-display text-sm font-semibold text-white">
					{initial}
				</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-paper/85 border-line">
				<DropdownMenuLabel className="flex flex-col">
					<span className="font-medium text-ink">{user?.name}</span>
					<span className="text-xs text-ink-soft">{user?.email}</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-line" />
				<DropdownMenuGroup>
					<DropdownMenuItem>Perfil</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator className="bg-line" />
				<DropdownMenuGroup>
					<DropdownMenuItem onSelect={handleSignOut}>
						<span className="flex gap-2 items-center">
							<LogOut className="w-4 h-4" /> Sair
						</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
