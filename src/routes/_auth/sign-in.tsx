import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/tanstack-react-start";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth/sign-in")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="h-screen flex items-center justify-center">
		<Button variant="secondary" onClick={async () => {
			await authClient.signIn.social({
				provider: "google",
			})
		}}>
			Sign in with Google
		</Button>
		<Button variant="ghost" onClick={async () => {
			await authClient.signIn.social({
				provider: "github",
			})
		}}>
			Sign in with Github
		</Button>
		</div>
	);
}
