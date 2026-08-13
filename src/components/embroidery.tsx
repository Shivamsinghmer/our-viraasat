import { useEffect, useRef } from "react";
import { Embroidery } from "#/components/embroidery/engine";
import { cn } from "#/lib/utils";

/**
 * Word-shaped embroidered patches stitched onto cloth, rendered in WebGL.
 *
 * Only runs while on screen — this is a fourth GL context on the site, so it
 * stays parked until you reach it, and the engine parks itself again as soon as
 * the pointer settles.
 */
export function EmbroideryPatches({ className }: { className?: string }) {
	const hostRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef<Embroidery | null>(null);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;

		let observer: IntersectionObserver | null = null;
		let resizeObserver: ResizeObserver | null = null;
		let cancelled = false;

		const build = () => {
			if (cancelled || !hostRef.current) return;

			const fontFamily =
				getComputedStyle(hostRef.current).fontFamily ||
				"Inter Tight, ui-sans-serif, system-ui, sans-serif";
			const engine = new Embroidery(hostRef.current, fontFamily);
			if (!engine.ok) return;
			engineRef.current = engine;

			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				engine.renderStill();
				return;
			}

			observer = new IntersectionObserver(
				(entries) => {
					if (entries[0]?.isIntersecting) engine.start();
					else engine.stop();
				},
				{ rootMargin: "120px" },
			);
			observer.observe(host);

			resizeObserver = new ResizeObserver(() => engine.resize());
			resizeObserver.observe(host);
		};

		// The patches are cut from glyph outlines, so building before the webfont
		// lands would shape them around the fallback face.
		document.fonts.ready.then(build).catch(build);

		return () => {
			cancelled = true;
			observer?.disconnect();
			resizeObserver?.disconnect();
			engineRef.current?.destroy();
			engineRef.current = null;
		};
	}, []);

	return (
		<div
			ref={hostRef}
			// The engine appends its own absolutely-positioned canvas in here.
			className={cn("relative h-full w-full overflow-hidden", className)}
			role="img"
			aria-label="Embroidered patches reading: made by hand"
			onPointerEnter={() => engineRef.current?.setHover(1)}
			onPointerLeave={() => engineRef.current?.setHover(0)}
			onPointerDown={(event) => {
				const rect = event.currentTarget.getBoundingClientRect();
				engineRef.current?.pressTap(
					(event.clientX - rect.left) / rect.width,
					(event.clientY - rect.top) / rect.height,
				);
			}}
		/>
	);
}
