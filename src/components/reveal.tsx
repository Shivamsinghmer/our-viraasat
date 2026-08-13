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

		registerPluginOnce(ScrollTrigger);

		const ctx = gsap.context(() => {
			gsap.fromTo(
				el,
				{ y: distance, autoAlpha: 0 },
				{
					y: 0,
					autoAlpha: 1,
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
