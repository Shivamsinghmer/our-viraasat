import type { PreloaderImage } from "#/components/preloader";
import { heroFor, smallFile } from "#/lib/gallery";
import { type Monument, monuments } from "#/lib/heritage";

/**
 * The five monuments the intro sequence moves through. Derived from the
 * monument data rather than duplicated, so the hero can caption whichever
 * image is currently showing.
 *
 * All files are self-hosted from Wikimedia Commons — see
 * `public/images/heritage/credits.json`, surfaced on /credits. Nothing is
 * hotlinked, so the site works offline and its licensing is verifiable.
 */
const FEATURED = [
	"khajuraho",
	"konark",
	"taj-mahal",
	"hampi",
	"mahabalipuram",
] as const;

export const featuredMonuments: Monument[] = FEATURED.map((slug) => {
	const monument = monuments.find((m) => m.slug === slug);
	if (!monument) throw new Error(`Unknown monument slug: ${slug}`);
	return monument;
});

export const siteImages: PreloaderImage[] = featuredMonuments.map((m) => {
	// Prefer whatever actually downloaded; fall back to the legacy hero path.
	// The intro cannot render a gap, so a missing image is a hard error here
	// rather than something to discover as a blank frame at runtime.
	const src = heroFor(m.slug)?.file ?? m.image;
	if (!src)
		throw new Error(`No image available for featured monument: ${m.slug}`);
	return { src, alt: m.alt };
});

/**
 * The preloader scales its *middle* image up to fill the viewport, so the hero
 * has to start on this exact one for the hand-off to be seamless. Derived
 * rather than hardcoded so it stays correct if the list above changes length.
 */
export const heroImageIndex = Math.floor(siteImages.length / 2);

/**
 * What the intro strip actually loads.
 *
 * The preloader runs on every page load and was pulling 2.6 MB of full-size
 * photographs before anything else could paint. Only the middle frame is ever
 * seen large — it scales up to become the hero, so it has to stay full
 * resolution or the hand-off pops. The other four are never wider than about
 * 160px in the strip, so they take the 480px derivative.
 */
export const preloaderImages: PreloaderImage[] = siteImages.map((image, i) =>
	i === heroImageIndex ? image : { ...image, src: smallFile(image.src) },
);

export const heroImage = siteImages[heroImageIndex];
