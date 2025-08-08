import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.session) {
			throw redirect({
				to: "/",
			});
		}
	},
});

function RouteComponent() {
	return <Outlet />;
}
