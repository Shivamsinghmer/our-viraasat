import { useEffect, useId, useRef } from "react";

type Stop = { offset: number; color: string };

/**
 * Read bottom (0) → top (1), which is the flag read top-to-bottom in reverse:
 * an Ashoka-navy base grounding the glow, then green, white and saffron, fading
 * out into transparent saffron at the crest.
 */
const TRICOLOUR_STOPS: Stop[] = [
	{ offset: 0, color: "#000080" },
	{ offset: 0.14, color: "#0A5C3A" },
	{ offset: 0.26, color: "#138808" },
	{ offset: 0.4, color: "#E8F5E9" },
	{ offset: 0.5, color: "#FFFFFF" },
	{ offset: 0.6, color: "#FF9933" },
	{ offset: 0.68, color: "#FFB866" },
	// Fully out by 0.78 rather than 1.0: the block is tall so it covers plenty,
	// but the top fifth stays clear so the footer text above it is never tinted.
	{ offset: 0.78, color: "#FFC08033" },
	{ offset: 1, color: "#FFC08000" },
];

const VBW = 1271;
const VBH = 599;

/**
 * Height curve: a gentle power falloff rather than a cosine bell, giving the
 * flatter, pyramid-like rise of the original.
 */
function bellHeights(n: number, peak: number, valley: number): number[] {
	const out: number[] = [];
	const mid = (n - 1) / 2;
	for (let i = 0; i < n; i++) {
		const t = mid === 0 ? 0 : Math.abs(i - mid) / mid; // 0 centre → 1 edge
		const eased = 1 - t ** 1.24;
		out.push(peak * VBH * (valley + (1 - valley) * eased));
	}
	return out;
}

export interface TricolourGradientProps {
	bars?: number;
	blur?: number;
	peak?: number;
	valley?: number;
	stops?: Stop[];
	/**
	 * Fraction of the block's own height it must rise through to reach full.
	 * Below 1 it saturates before the page bottom. @default 0.85
	 */
	travel?: number;
}

/**
 * A row of tall, heavily-blurred columns sharing one vertical gradient, arranged
 * short at the edges and tallest in the middle. Anchored to the bottom, so it
 * unfurls from the floor.
 *
 * Adapted from the Dia Browser gradient, which rises once on mount — in a page
 * footer that finishes long before you ever scroll down to it. Here scaleY is
 * driven directly by scroll position, so the glow grows as the footer comes up
 * and retreats as it leaves.
 */
export function TricolourGradient({
	bars = 9,
	blur = 15,
	peak = 0.98,
	valley = 0.55,
	stops = TRICOLOUR_STOPS,
	travel = 0.85,
}: TricolourGradientProps) {
	const ref = useRef<HTMLDivElement>(null);

	// `useId` emits characters that are not valid unescaped in url(#…).
	const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
	const gradientId = `tricolour-grad-${uid}`;
	const blurId = `tricolour-blur-${uid}`;

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		// Measure the PARENT. This element carries the scaleY being computed, so
		// measuring it would feed its own transform back in — and at scaleY(0) its
		// box is zero-height, which would pin the result at a single value.
		const watched = el.parentElement ?? el;

		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (reduced) {
			el.style.transform = "scaleY(1)";
			return;
		}

		let ticking = false;

		// Written straight to style rather than through state: this runs on every
		// scroll frame, and a setState there would re-render the whole SVG.
		const measure = () => {
			ticking = false;
			const rect = watched.getBoundingClientRect();
			const viewportHeight = window.innerHeight || 1;
			// Span is the block's OWN height, not the viewport's. The block sits at
			// the page bottom, so the most it can ever rise into view is its own
			// height — keying to the viewport capped the rise short of full.
			const span = Math.max(1, rect.height * travel);
			const progress = Math.min(
				1,
				Math.max(0, (viewportHeight - rect.top) / span),
			);
			el.style.transform = `scaleY(${progress.toFixed(4)})`;
		};

		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(measure);
		};

		measure();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, [travel]);

	const colW = VBW / bars;
	// Keyed by x so the list has a stable identity that is not the array index.
	const columns = bellHeights(bars, peak, valley).map((h, i) => ({
		x: i * colW,
		h,
	}));

	return (
		<div
			ref={ref}
			aria-hidden="true"
			style={{
				height: "100%",
				width: "100%",
				transformOrigin: "bottom",
				transform: "scaleY(0)",
				willChange: "transform",
			}}
		>
			<svg
				aria-hidden="true"
				style={{ height: "100%", width: "100%" }}
				viewBox={`0 0 ${VBW} ${VBH}`}
				preserveAspectRatio="none"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					{/* objectBoundingBox units: the gradient maps to each rect's own
					    box, so every bar carries the full tricolour over its own
					    height — a field of full-flag columns. */}
					<linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
						{stops.map((s) => (
							<stop key={s.offset} offset={s.offset} stopColor={s.color} />
						))}
					</linearGradient>
					<filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation={blur} />
					</filter>
				</defs>
				{columns.map((col) => (
					<g key={col.x} filter={`url(#${blurId})`}>
						<rect
							x={col.x}
							y={VBH - col.h}
							width={colW * 1.23}
							height={col.h}
							fill={`url(#${gradientId})`}
						/>
					</g>
				))}
			</svg>
		</div>
	);
}
