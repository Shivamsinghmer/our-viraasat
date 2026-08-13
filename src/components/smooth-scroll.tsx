import { useRouter } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { registerPluginOnce } from "#/lib/gsap";

/**
 * Smooth scrolling, via Lenis (8KB gzipped; Locomotive v5 is a wrapper around it).
 *
 * Three things matter here:
 *
 * 1. It is driven from `gsap.ticker`, not its own rAF. GSAP's ticker is already
 *    running for the rest of the site, so this adds no second frame loop.
 * 2. ScrollTrigger is updated on every Lenis scroll. `Reveal` is built on
 *    ScrollTrigger, and without this its start positions drift once Lenis takes
 *    over the scroll position.
 * 3. Lenis drives the real scroll position rather than transforming a wrapper,
 *    so native `scroll` events still fire — which the footer gradient and the
 *    IntersectionObserver pauses both rely on.
 */
export function SmoothScroll() {
	const lenisRef = useRef<Lenis | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		registerPluginOnce(ScrollTrigger);

		const lenis = new Lenis({
			duration: 1.05,
			smoothWheel: true,
			// Touch devices already have native momentum; hijacking it feels worse.
			syncTouch: false,
		});
		lenisRef.current = lenis;

		const onScroll = () => ScrollTrigger.update();
		lenis.on("scroll", onScroll);

		const tick = (time: number) => lenis.raf(time * 1000);
		gsap.ticker.add(tick);
		// Recommended with Lenis: lag smoothing fights the interpolation.
		gsap.ticker.lagSmoothing(0);

		return () => {
			lenis.off("scroll", onScroll);
			gsap.ticker.remove(tick);
			gsap.ticker.lagSmoothing(500, 33);
			lenis.destroy();
			lenisRef.current = null;
		};
	}, []);

	// Land at the top on a route change. Without this Lenis interpolates the whole
	// document height on every navigation, which reads as the page scrolling away
	// from you. `immediate` puts it there behind the transition sweep.
	//
	// Subscribed rather than derived from router state, so a navigation does not
	// re-render this component just to read a pathname it never displays.
	useEffect(() => {
		return router.subscribe("onResolved", () => {
			lenisRef.current?.scrollTo(0, { immediate: true });
			// The new route has different content heights; without this, reveals
			// keep the previous page's trigger positions.
			ScrollTrigger.refresh();
		});
	}, [router]);

	return null;
}
