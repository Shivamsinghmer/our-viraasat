export type WordPatch = {
	word: string;
	cx: number;
	cy: number;
	scale: number;
	rotDeg: number;
	fill: [number, number, number];
	ink: [number, number, number];
	border: [number, number, number];
	stitchDeg: number;
};

/**
 * Three patches in the flag's colours, introducing the craft traditions on the
 * arts page. The original's words were "made with love"; these say what the
 * section is actually about.
 */
export const WORDS: WordPatch[] = [
	{
		word: "made",
		cx: 0.44,
		cy: 0.29,
		scale: 0.32,
		rotDeg: -4,
		fill: [1.0, 0.6, 0.2], // saffron
		ink: [0.05, 0.05, 0.16],
		border: [0.97, 0.97, 0.98],
		stitchDeg: 70,
	},
	{
		word: "by",
		cx: 0.62,
		cy: 0.51,
		scale: 0.3,
		rotDeg: 3,
		fill: [0.96, 0.96, 0.94], // white band
		ink: [0.05, 0.05, 0.16],
		border: [1.0, 0.6, 0.2],
		stitchDeg: 20,
	},
	{
		word: "hand",
		cx: 0.47,
		cy: 0.72,
		scale: 0.34,
		rotDeg: -2,
		fill: [0.12, 0.6, 0.1], // green
		ink: [0.98, 0.98, 0.96],
		border: [0.98, 0.97, 0.98],
		stitchDeg: 100,
	},
];

/** Deep navy cloth, so the patches read against the site's dark sections. */
export const FABRIC: [number, number, number] = [0.03, 0.03, 0.17];
