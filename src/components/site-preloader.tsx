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
/**
 * Ceiling on the entry sequence. The timeline itself runs a shade under five
 * seconds; this only ever fires when it has stopped running at all.
 */
const INTRO_CEILING_MS = 8000;

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

	/**
	 * The preloader hands over on the `onComplete` of a GSAP timeline, and GSAP
	 * advances off requestAnimationFrame. A tab that is backgrounded or throttled
	 * mid-intro stops getting frames, the timeline freezes, `onComplete` never
	 * arrives — and because this overlay is opaque, `z-999`, without
	 * `pointer-events-none`, and holds `body { overflow: hidden }` the whole time,
	 * the site is left unclickable and unscrollable. That is the hang.
	 *
	 * So the hand-over is guaranteed by two things that do not need a frame: a
	 * ceiling, and going to the background — where the animation is not being
	 * watched anyway, so there is nothing to cut short.
	 */
	useEffect(() => {
		if (done) return;

		const finish = () => {
			markIntroDone();
			setDone(true);
		};

		// Asking for reduced motion should skip the sequence outright rather than
		// sit through it, which PRODUCT.md already claims happens.
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			finish();
			return;
		}

		// Opened in a background tab, which is common enough to be the ordinary
		// case rather than an edge one: there were never any frames to begin with,
		// so there is no change event coming and nothing to wait for.
		if (document.visibilityState === "hidden") {
			finish();
			return;
		}

		const ceiling = window.setTimeout(finish, INTRO_CEILING_MS);
		const onVisibilityChange = () => {
			if (document.visibilityState === "hidden") finish();
		};
		document.addEventListener("visibilitychange", onVisibilityChange);

		return () => {
			window.clearTimeout(ceiling);
			document.removeEventListener("visibilitychange", onVisibilityChange);
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
