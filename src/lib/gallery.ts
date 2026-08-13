import imageCredits from "#/lib/image-credits.json";

export interface GalleryImage {
	slug: string;
	file: string;
	kb: number;
	author: string;
	license: string;
	commons: string;
}

/**
 * Images are grouped from the credits file rather than listed by hand in the
 * content. The credits file is written by scripts/fetch-commons.mjs at the
 * moment each image lands on disk, so it is the only record that cannot drift
 * out of step with what is actually there — a site whose fetch failed renders
 * without a picture instead of with a broken one.
 */
const bySlug = new Map<string, GalleryImage[]>();

for (const credit of imageCredits as GalleryImage[]) {
	const list = bySlug.get(credit.slug);
	if (list) {
		list.push(credit);
	} else {
		bySlug.set(credit.slug, [credit]);
	}
}

/** Every self-hosted image for a subject, in fetch order. */
export function galleryFor(slug: string): GalleryImage[] {
	return bySlug.get(slug) ?? [];
}

/** The lead image for a subject, or null when nothing was sourced for it. */
export function heroFor(slug: string): GalleryImage | null {
	return bySlug.get(slug)?.[0] ?? null;
}

/** Everything except the lead image — what the gallery grid actually shows. */
export function restFor(slug: string): GalleryImage[] {
	return galleryFor(slug).slice(1);
}

export function imageCount(): number {
	return (imageCredits as GalleryImage[]).length;
}

/**
 * Path to the 480px derivative written by scripts/resize-images.mjs.
 *
 * Commons hands back 1200px files averaging 336 KB. Most of this site shows
 * them far smaller — 48px credit thumbnails, 220px cards, 200px gallery tiles —
 * so serving the original there cost /credits 99 MB to paint 302 thumbnails.
 */
export function smallFile(file: string): string {
	return file.replace(/\.(jpe?g|png)$/i, "-480.jpg");
}

/**
 * For elements whose displayed width changes with the viewport, so the browser
 * picks rather than us guessing. Pair with a `sizes` attribute.
 */
export function srcSetFor(file: string): string {
	return `${smallFile(file)} 480w, ${file} 1200w`;
}
