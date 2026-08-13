import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import MouseEffects from "#/components/mouse-effects";
import { PageTransition } from "#/components/page-transition";
import { SiteFooter } from "#/components/site-footer";
import { SitePreloader } from "#/components/site-preloader";
import { SmoothScroll } from "#/components/smooth-scroll";
import { UserCursor } from "#/components/user-cursor";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
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
				title: "Virasat — A nation written in stone",
			},
			{
				name: "description",
				content:
					"India's built and living heritage: World Heritage monuments, the eight classical dance forms, and four and a half thousand years of record. Built for the Thematic Website Development Competition 2026.",
			},
			{
				name: "theme-color",
				content: "#ff9933",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<SmoothScroll />
				<SitePreloader />
				{children}
				<SiteFooter />
				{/* No `target` — listens on the document, so a click anywhere bursts.
				    Fixed over the viewport, inert, and clipped so a burst near an edge
				    cannot extend the scroll area. Sits just under the cursor's z-100. */}
				<div className="pointer-events-none fixed inset-0 z-90 overflow-hidden">
					<MouseEffects showLabel={false} color="#0a0a0a" />
				</div>

				{/* Above content and the click bursts, below the cursor. */}
				<PageTransition />

				{/* No `target` — runs site-wide, fixed over the viewport at z-100
				    so it stays above the nav. Hides the OS cursor while mounted. */}
				<UserCursor />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
