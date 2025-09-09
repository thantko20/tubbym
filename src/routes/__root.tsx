// src/routes/__root.tsx
/// <reference types="vite/client" />

import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "../styles/app.css?url";

// const fetchAuth = createServerFn({ method: "GET" }).handler(async () => {
// 	const data = await auth.api.getSession(getWebRequest());
// 	return data;
// });

export const Route = createRootRouteWithContext()({
	beforeLoad: async () => {
		// const session = await fetchAuth();
		// return {
		// 	session,
		// };
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
