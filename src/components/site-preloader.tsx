import { useEffect, useState } from "react";
import { FloatingMenu, type MenuGroup } from "#/components/floating-menu";
import { Preloader } from "#/components/preloader";
import { markIntroDone } from "#/lib/intro";
import { preloaderImages } from "#/lib/site-images";

const menuGroups: MenuGroup[] = [
	{
		title: "Explore",
		variant: "muted",
		links: [
			{ label: "Home", href: "/" },
			{ label: "Monuments", href: "/monuments" },
			{ label: "Classical Arts", href: "/arts" },
		],
	},
	{
		title: "Context",
		variant: "default",
		links: [
			{ label: "About India", href: "/india" },
			{ label: "Timeline", href: "/timeline" },
			{ label: "Credits", href: "/credits" },
		],
	},
	{
		title: "Reference",
		variant: "muted",
		links: [
			{
				label: "UNESCO List",
				href: "https://whc.unesco.org/en/statesparties/in",
			},
			{
				label: "Wikimedia Commons",
				href: "https://commons.wikimedia.org/wiki/Category:World_Heritage_Sites_in_India",
			},
		],
	},
];

/**
 * Runs the entry sequence on every full page load, so a reload replays it on
 * whichever page you are on. The preloader plays, then the floating nav drops
 * in.
 *
 * Mounted from the root shell, so client-side route changes never replay it —
 * those get the transition sweep instead, and the nav stays put once it has
 * arrived.
 */
export function SitePreloader() {
	const [done, setDone] = useState(false);

	// Nothing should scroll behind the preloader while it is playing.
	useEffect(() => {
		if (done) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previous;
		};
	}, [done]);

	if (!done) {
		return (
			<Preloader
				className="site-preloader bg-background"
				images={preloaderImages}
				onComplete={() => {
					markIntroDone();
					setDone(true);
				}}
			/>
		);
	}

	return (
		<FloatingMenu
			menuGroups={menuGroups}
			primaryButton={{ label: "Monuments", href: "/monuments" }}
			secondaryButton={{ label: "Timeline", href: "/timeline" }}
			logo={
				<a href="/" className="flex items-center gap-2 no-underline">
					<img src="/images/photos/logo.png" alt="" className="h-7 w-7" />
					<span className="font-semibold tracking-tight text-foreground">
						Virasat
					</span>
				</a>
			}
		/>
	);
}
