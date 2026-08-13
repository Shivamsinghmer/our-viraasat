import { useEffect, useRef } from "react";
import { onIntroDone } from "#/lib/intro";
import { Typer } from "#/lib/typer";

interface TypedHeadingProps {
	/** Plain text only — the engine rewrites the element's children. */
	children: string;
	as?: "h1" | "h2" | "h3" | "p";
	className?: string;
	/** Frames per second of the reveal. @default 20 */
	fps?: number;
	/** States each character rolls through before settling. @default 3 */
	cycles?: number;
	/**
	 * What triggers the reveal. `inView` waits for the heading to scroll into
	 * view; `intro` waits for the entry sequence to finish — needed for anything
	 * sitting behind the preloader, which is on screen but not yet visible.
	 * @default "inView"
	 */
	start?: "inView" | "intro";
}

/**
 * Reveals a line character by character when it scrolls into view, each glyph
 * rippling through pill / accent / outline states before settling.
 *
 * The Typer rewrites the element's innerHTML, so children must be a plain string
 * and React must not own that subtree afterwards — which is why the text is
 * passed as a prop and the element is only ever written to through the ref.
 */
export function TypedHeading({
	children,
	as: Tag = "h2",
	className,
	fps = 20,
	cycles = 3,
	start = "inView",
}: TypedHeadingProps) {
	const ref = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const typer = new Typer(el, { fps, cycles, initVisible: reduced });

		if (reduced) return () => typer.destroy();

		if (start === "intro") {
			const unsubscribe = onIntroDone(() => typer.in());
			return () => {
				unsubscribe();
				typer.destroy();
			};
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						typer.in();
						observer.disconnect();
					}
				}
			},
			{ threshold: 0.2 },
		);
		observer.observe(el);

		return () => {
			observer.disconnect();
			typer.destroy();
		};
	}, [fps, cycles, start]);

	return (
		<Tag ref={ref} data-typer className={className}>
			{children}
		</Tag>
	);
}
