export const WORDS = ["a", "nation", "written", "in", "stone"];

export type Swatch = { bg: string; fg: string };

/**
 * Re-palettised from the original's clashing brights onto the flag, keeping the
 * source's rule that every swatch carries its own auto-contrast text colour.
 * Deliberately no muted filler — the tiles are meant to be saturated.
 */
export const SWATCHES: Swatch[] = [
	{ bg: "#000080", fg: "#ffffff" }, // Ashoka navy
	{ bg: "#ff9933", fg: "#000080" }, // saffron
	{ bg: "#138808", fg: "#ffffff" }, // green
	{ bg: "#ffffff", fg: "#000080" }, // white band
	{ bg: "#0f6b06", fg: "#ffffff" }, // deep green
	{ bg: "#ffd580", fg: "#000080" }, // light saffron
	{ bg: "#1a1a4d", fg: "#ffffff" }, // ink navy
	{ bg: "#ffb866", fg: "#000080" }, // mid saffron
];

export function randomSwatchAvoiding(used: Swatch[]): Swatch {
	const free = SWATCHES.filter((s) => !used.includes(s));
	const pool = free.length > 0 ? free : SWATCHES;
	return pool[(Math.random() * pool.length) | 0];
}

export const INITIAL: Swatch[] = [
	SWATCHES[1], // saffron
	SWATCHES[3], // white
	SWATCHES[2], // green
	SWATCHES[0], // navy
	SWATCHES[5], // light saffron
];
