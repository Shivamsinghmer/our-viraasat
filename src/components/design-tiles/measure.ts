/**
 * Glyph metrics for the tile bar. This file was not part of the supplied source
 * — the engine imports it — so it is written to that contract: a reference font
 * size, a baseline inside the viewBox, and per-glyph x / width / ink extents.
 *
 * Widths come from cumulative PREFIX measurements rather than per-character
 * ones, so kerning is accounted for. Measuring each character alone and summing
 * would drift from the `<text>` element the rects sit behind.
 */

export const REF_FS = 100;
export const BASELINE_Y = 100;

export interface Glyph {
	ch: string;
	/** Left edge in reference units. */
	x: number;
	/** Advance width. */
	w: number;
	/** Top of the ink, in viewBox units. */
	top: number;
	/** Bottom of the ink, in viewBox units. */
	bottom: number;
}

export interface WordMetrics {
	width: number;
	glyphs: Glyph[];
}

let ctx: CanvasRenderingContext2D | null | undefined;

export function measureWord(
	word: string,
	fontFamily: string,
	weight = "500",
): WordMetrics | null {
	if (typeof document === "undefined") return null;
	if (ctx === undefined) {
		ctx = document.createElement("canvas").getContext("2d");
	}
	if (!ctx || !word) return null;

	ctx.font = `${weight} ${REF_FS}px ${fontFamily}`;

	const chars = [...word];
	const glyphs: Glyph[] = [];
	let previousWidth = 0;

	for (let i = 0; i < chars.length; i++) {
		const ch = chars[i];
		// Prefix widths keep kerning pairs intact.
		const upto = ctx.measureText(word.slice(0, i + 1)).width;
		const x = previousWidth;
		const w = Math.max(0, upto - previousWidth);
		previousWidth = upto;

		const m = ctx.measureText(ch);
		const ascent = m.actualBoundingBoxAscent;
		const descent = m.actualBoundingBoxDescent;

		// Whitespace and some glyphs report no ink box; fall back to typical
		// proportions so the band never collapses.
		const top =
			Number.isFinite(ascent) && ascent > 0
				? BASELINE_Y - ascent
				: BASELINE_Y - REF_FS * 0.72;
		const bottom =
			Number.isFinite(descent) && descent > 0
				? BASELINE_Y + descent
				: BASELINE_Y + REF_FS * 0.02;

		glyphs.push({ ch, x, w, top, bottom });
	}

	return { width: ctx.measureText(word).width, glyphs };
}
