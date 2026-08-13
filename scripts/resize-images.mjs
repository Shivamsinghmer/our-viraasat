/**
 * Generates small derivatives of the self-hosted Commons imagery.
 *
 * Every file fetched from Commons is 1200px wide and averages ~336 KB, but
 * most of the site displays them far smaller: 48px credit thumbnails, 220px
 * site cards, ~200px gallery tiles. Serving the 1200px original into a 48px
 * box meant /credits alone pulled 99 MB to paint 302 thumbnails, which is what
 * made the site hang on a phone — and the memory pressure from decoding all of
 * it is the likeliest reason mobile browsers were dropping the globe's WebGL
 * context.
 *
 * This writes a `-480.jpg` next to each original. The full-size file is kept
 * for hero images and the lightbox, where it is actually displayed at 1000px+.
 *
 *   node scripts/resize-images.mjs          # only what is missing
 *   node scripts/resize-images.mjs --force  # rebuild everything
 */

import { existsSync } from "node:fs";
import { readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CREDITS = join(ROOT, "src", "lib", "image-credits.json");

/** Wide enough for a 220px card on a 2x display, and for 200px gallery tiles. */
const SMALL_WIDTH = 480;
const SMALL_QUALITY = 72;

export const smallSuffix = "-480.jpg";

const force = process.argv.includes("--force");

async function main() {
	const credits = JSON.parse(await readFile(CREDITS, "utf8"));
	let built = 0;
	let skipped = 0;
	let originalBytes = 0;
	let smallBytes = 0;

	for (const credit of credits) {
		const source = join(ROOT, "public", credit.file);
		if (!existsSync(source)) {
			console.log(`  missing source, skipping: ${credit.file}`);
			continue;
		}

		const dest = source.replace(new RegExp(`${extname(source)}$`), smallSuffix);
		originalBytes += (await stat(source)).size;

		if (existsSync(dest) && !force) {
			smallBytes += (await stat(dest)).size;
			skipped += 1;
			continue;
		}

		const buffer = await sharp(source)
			// `withoutEnlargement` matters: a few Commons thumbnails come back
			// narrower than 480px, and upscaling them would add bytes for nothing.
			.resize({ width: SMALL_WIDTH, withoutEnlargement: true })
			.jpeg({ quality: SMALL_QUALITY, progressive: true, mozjpeg: true })
			.toBuffer();

		await writeFile(dest, buffer);
		smallBytes += buffer.length;
		built += 1;
		if (built % 25 === 0) console.log(`  built ${built}…`);
	}

	const mb = (n) => (n / 1024 / 1024).toFixed(1);
	console.log(
		`\n${built} built, ${skipped} already present.\n` +
			`originals ${mb(originalBytes)} MB → derivatives ${mb(smallBytes)} MB ` +
			`(${Math.round((1 - smallBytes / originalBytes) * 100)}% smaller)`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
