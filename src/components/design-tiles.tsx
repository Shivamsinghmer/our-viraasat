import { useEffect, useRef } from "react";
import { DesignTiles } from "#/components/design-tiles/engine";
import { cn } from "#/lib/utils";

/**
 * Mounts the tile bar and reveals it when it scrolls into view. Reduced motion
 * gets the assembled bar, static.
 */
export function DesignTilesBar({ className }: { className?: string }) {
	const hostRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;

		// Webfonts change glyph metrics, and the rects are measured from them —
		// building before the face lands would misalign every tile.
		let tiles: DesignTiles | null = null;
		let observer: IntersectionObserver | null = null;
		let cancelled = false;

		const build = () => {
			if (cancelled || !hostRef.current) return;
			tiles = new DesignTiles(hostRef.current);

			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				tiles.renderStill();
				return;
			}

			observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							tiles?.start();
							observer?.disconnect();
						}
					}
				},
				{ threshold: 0.25 },
			);
			observer.observe(host);
		};

		document.fonts.ready.then(build).catch(build);

		return () => {
			cancelled = true;
			observer?.disconnect();
			tiles?.destroy();
		};
	}, []);

	return <div ref={hostRef} className={cn("w-full", className)} />;
}
