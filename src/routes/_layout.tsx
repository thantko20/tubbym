import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-7xl mx-auto">
			<nav className="flex items-center justify-between px-4 py-3"></nav>
			<main className="px-4 py-4">
				<Outlet />
			</main>
		</div>
	);
}
