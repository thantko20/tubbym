import {
	createFileRoute,
	Link,
	Outlet,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	const ctx = useRouteContext({ from: "/_layout" });
	const router = useRouter();
	return (
		<div className="max-w-7xl mx-auto">
			<nav className="flex items-center justify-between px-4 py-3">
				<div></div>
				<div>
					{ctx.session ? (
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<img
									src={ctx.session.user.image!}
									alt={ctx.session.user.name}
									className="w-8 h-8 rounded-full"
								/>
								<span>{ctx.session.user.name}</span>
							</div>
							<Button
								type="button"
								onClick={async () => {
									await authClient.signOut();
									await router.invalidate();
								}}
							>
								Sign Out
							</Button>
						</div>
					) : (
						<Link to="/sign-in" className={buttonVariants()}>
							Sign In
						</Link>
					)}
				</div>
			</nav>
			<main className="px-4 py-4">
				<Outlet />
			</main>
		</div>
	);
}
