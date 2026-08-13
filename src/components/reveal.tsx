import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { registerPluginOnce } from "#/lib/gsap";
import { cn } from "#/lib/utils";

interface RevealProps {
	children: ReactNode;
	className?: string;
	/** Seconds to hold before the element rises in. @default 0 */
	delay?: number;
	/** Travel distance in px. @default 28 */
	distance?: number;
}

/**
 * Rises its children into place once, when they first scroll into view. Uses
 * the same GSAP easing vocabulary as the intro so the inner pages feel like
 * part of the same site rather than a plain document.
 */
export function Reveal({
	children,
	className,
	delay = 0,
	distance = 28,
}: RevealProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		// Readers who ask for less motion still get the content; they just get it
		// without the rise. Checked before the tween is built rather than inside
		// it, so nothing is ever set to autoAlpha 0 and left waiting on a
		// ScrollTrigger that will not fire.
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		registerPluginOnce(ScrollTrigger);

		const ctx = gsap.context(() => {
			// `opacity`, deliberately not `autoAlpha`. autoAlpha also sets
			// `visibility: hidden`, and Chrome will not start a `loading="lazy"`
			// image inside a hidden subtree — so every photograph below the fold
			// waited for its own reveal to fire before it began downloading, and
			// arrived late. Opacity alone hides the element without stalling the
			// fetch, so the image is already decoded by the time it rises in.
			gsap.fromTo(
				el,
				{ y: distance, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.8,
					delay,
					ease: "power3.out",
					scrollTrigger: { trigger: el, start: "top 88%", once: true },
				},
			);
		}, el);

		return () => ctx.revert();
	}, [delay, distance]);

	return (
		<div ref={ref} className={cn(className)}>
			{children}
		</div>
	);
}
