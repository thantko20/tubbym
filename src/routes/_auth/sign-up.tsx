import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-up")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div className="h-screen flex items-center justify-center"></div>;
}
