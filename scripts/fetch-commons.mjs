/**
 * Fetches openly licensed imagery from Wikimedia Commons and self-hosts it.
 *
 * Nothing on this site is hotlinked: every image is downloaded, resized by the
 * Commons thumbnailer, and written to public/images/, with author and licence
 * recorded so the credits page can be generated from the same source of truth.
 *
 *   node scripts/fetch-commons.mjs                 # everything in the manifest
 *   node scripts/fetch-commons.mjs taj-mahal ajanta
 *
 * Existing files are left alone, so a re-run only fetches what is missing and
 * an interrupted run can simply be repeated.
 */

import { existsSync, statSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = join(ROOT, "scripts", "commons-manifest.json");
const OUT_JSON = join(ROOT, "src", "lib", "image-credits.json");
const API = "https://commons.wikimedia.org/w/api.php";

// Wikimedia blocks generic agents outright and throttles hard on bursts. A
// contact-bearing UA and a deliberate gap between calls is the difference
// between this finishing and getting a wall of 429s.
const UA =
	"VirasatHeritageSite/1.0 (educational competition entry; contact via repository) node-fetch";
const GAP_MS = 1100;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Free licences only. Anything not matching here is skipped, not guessed at. */
const ALLOWED_LICENCE =
	/^(cc[ -]?by([ -]sa)?([ -]\d(\.\d)?)?|cc0|public domain|pd|cc[ -]pd)/i;

/**
 * Commons categories are exhaustive, not curated: alongside the monument you
 * get signage, ticket counters, shoe racks and litter bins photographed by
 * documentarians. None of that belongs in a gallery.
 */
const BAD_TITLE =
	/(logo|map\b|coat of arms|flag|diagram|plan of|signature|stamp|banner|icon|chart|graph|shoe ?rack|signage|sign ?board|notice|ticket|counter|toilet|washroom|dustbin|garbage|litter|parking|queue|scaffold|construction|barricade|poster|leaflet|brochure|screenshot|collage|panorama of the world|selfie)/i;

let lastCall = 0;

async function api(params, attempt = 0) {
	const wait = lastCall + GAP_MS - Date.now();
	if (wait > 0) await sleep(wait);
	lastCall = Date.now();

	const url = `${API}?${new URLSearchParams({ ...params, format: "json", formatversion: "2", origin: "*" })}`;
	const res = await fetch(url, { headers: { "User-Agent": UA } });

	if (res.status === 429 || res.status >= 500) {
		if (attempt >= 5) throw new Error(`${res.status} after ${attempt} retries`);
		const backoff = 2000 * 2 ** attempt;
		console.log(`    ${res.status}; backing off ${backoff}ms`);
		await sleep(backoff);
		return api(params, attempt + 1);
	}
	if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
	return res.json();
}

/**
 * Strips the HTML Commons returns in the Artist field down to a plain name.
 *
 * Older uploads carry a boilerplate preamble — "No machine-readable author
 * provided. Foo assumed (based on copyright claims)." — which is metadata about
 * the metadata, not a credit. The name inside it is the actual attribution, so
 * pull that out rather than printing the apparatus around it.
 */
export function plainText(html) {
	if (!html) return "Unknown";

	const text = html
		.replace(/<[^>]*>/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&nbsp;/g, " ")
		.replace(/&quot;/g, '"')
		.replace(/&#0?39;/g, "'")
		.replace(/\s+/g, " ")
		.trim();

	const assumed = text.match(
		/No machine-readable author provided\.?\s*(.+?)\s+assumed\b/i,
	);
	if (assumed) return assumed[1].trim().slice(0, 120) || "Unknown";

	return (
		text
			.replace(/\(based on copyright claims\)\.?/gi, "")
			.replace(/\s+/g, " ")
			.trim()
			.slice(0, 120) || "Unknown"
	);
}

async function candidatesFromCategory(category, limit) {
	const data = await api({
		action: "query",
		generator: "categorymembers",
		gcmtitle: category.startsWith("Category:") ? category : `Category:${category}`,
		gcmtype: "file",
		gcmlimit: String(limit),
		prop: "imageinfo",
		iiprop: "url|extmetadata|size|mime",
		iiurlwidth: "1200",
	});
	return data?.query?.pages ?? [];
}

async function candidatesFromSearch(term, limit) {
	const data = await api({
		action: "query",
		generator: "search",
		gsrsearch: `${term} filetype:bitmap`,
		gsrnamespace: "6",
		gsrlimit: String(limit),
		prop: "imageinfo",
		iiprop: "url|extmetadata|size|mime",
		iiurlwidth: "1200",
	});
	return data?.query?.pages ?? [];
}

function usable(page, { allowPortrait = false } = {}) {
	const info = page?.imageinfo?.[0];
	if (!info) return null;
	if (!/^image\/(jpeg|png)$/.test(info.mime ?? "")) return null;
	if (BAD_TITLE.test(page.title)) return null;
	// Landscape or near-square by default, because portrait crops badly in the
	// gallery grid. Performance photography is overwhelmingly portrait, so
	// subjects that opt in accept the crop rather than get no images at all.
	if (
		!allowPortrait &&
		info.width &&
		info.height &&
		info.width / info.height < 1.1
	) {
		return null;
	}

	const meta = info.extmetadata ?? {};
	const licence = meta.LicenseShortName?.value ?? "";
	if (!ALLOWED_LICENCE.test(licence.replace(/\s+/g, " ").trim())) return null;

	return {
		title: page.title,
		thumb: info.thumburl ?? info.url,
		descriptionurl: info.descriptionurl,
		author: plainText(meta.Artist?.value),
		license: licence.trim(),
		// Original pixel area, used only to rank: a photographer who uploaded a
		// 24-megapixel frame was usually shooting the monument, not the signage.
		area: (info.width ?? 0) * (info.height ?? 0),
	};
}

/**
 * The thumbnailer throttles as aggressively as the API does, and a burst of
 * downloads with no gap earns a wall of 429s. Same pacing and backoff as api().
 */
async function download(url, dest, attempt = 0) {
	const wait = lastCall + GAP_MS - Date.now();
	if (wait > 0) await sleep(wait);
	lastCall = Date.now();

	const res = await fetch(url, { headers: { "User-Agent": UA } });

	if (res.status === 429 || res.status >= 500) {
		if (attempt >= 5) throw new Error(`${res.status} after ${attempt} retries`);
		const backoff = 3000 * 2 ** attempt;
		console.log(`    ${res.status}; backing off ${backoff}ms`);
		await sleep(backoff);
		return download(url, dest, attempt + 1);
	}
	if (!res.ok) throw new Error(`download ${res.status}`);

	const buf = Buffer.from(await res.arrayBuffer());
	await mkdir(dirname(dest), { recursive: true });
	await writeFile(dest, buf);
	return Math.round(buf.length / 1024);
}

/** Writes the credits file, sorted, and remembers what it wrote. */
async function flush(byFile) {
	const out = [...byFile.values()].sort(
		(a, b) => a.slug.localeCompare(b.slug) || a.file.localeCompare(b.file),
	);
	await writeFile(OUT_JSON, `${JSON.stringify(out, null, "\t")}\n`);
	flush.last = out;
	return out;
}

async function main() {
	const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
	const only = process.argv.slice(2);
	const entries = only.length
		? manifest.filter((m) => only.includes(m.slug))
		: manifest;

	if (!entries.length) {
		console.error("No manifest entries matched.");
		process.exit(1);
	}

	const credits = existsSync(OUT_JSON)
		? JSON.parse(await readFile(OUT_JSON, "utf8"))
		: [];
	const byFile = new Map(credits.map((c) => [c.file, c]));
	// Same photo appearing under two sites is a duplicate download and a
	// duplicate credit row; hash the source title to catch it.
	const seenTitles = new Set(credits.map((c) => c.commons).filter(Boolean));

	for (const entry of entries) {
		const want = entry.count ?? 5;
		console.log(`\n${entry.slug} — want ${want}`);

		let pages = [];
		try {
			if (entry.category) pages = await candidatesFromCategory(entry.category, 60);
		} catch (err) {
			console.log(`    category failed: ${err.message}`);
		}
		const opts = { allowPortrait: entry.allowPortrait === true };
		let picked = pages.map((p) => usable(p, opts)).filter(Boolean);

		if (picked.length < want) {
			try {
				const extra = await candidatesFromSearch(entry.search ?? entry.name, 60);
				picked = picked.concat(extra.map((p) => usable(p, opts)).filter(Boolean));
			} catch (err) {
				console.log(`    search failed: ${err.message}`);
			}
		}

		// Best-resolution first, so the gallery gets the serious photographs
		// rather than whatever happens to sort first alphabetically.
		picked.sort((a, b) => b.area - a.area);

		const chosen = [];
		const localTitles = new Set();
		for (const c of picked) {
			if (chosen.length >= want) break;
			if (localTitles.has(c.title)) continue;
			if (seenTitles.has(c.descriptionurl)) continue;
			localTitles.add(c.title);
			chosen.push(c);
		}

		if (!chosen.length) {
			console.log("    NOTHING USABLE — leaving for manual sourcing");
			continue;
		}

		let n = 0;
		for (const c of chosen) {
			n += 1;
			const ext = c.thumb.toLowerCase().includes(".png") ? "png" : "jpg";
			const rel = `/images/${entry.dir ?? "heritage"}/${entry.slug}/${String(n).padStart(2, "0")}.${ext}`;
			const dest = join(ROOT, "public", rel);

			try {
				// Re-record the credit even when the bytes are already on disk:
				// that is what makes an interrupted run resumable rather than a
				// reason to download 200 images again.
				const kb = existsSync(dest)
					? Math.round(statSync(dest).size / 1024)
					: await download(c.thumb, dest);
				const row = {
					slug: entry.slug,
					file: rel,
					kb,
					author: c.author,
					license: c.license,
					commons: c.descriptionurl,
				};
				byFile.set(rel, row);
				seenTitles.add(c.descriptionurl);
				console.log(`    ${rel}  ${kb}KB  ${c.license}  ${c.author}`);
			} catch (err) {
				console.log(`    FAILED ${c.title}: ${err.message}`);
			}
		}

		// Persist after every site rather than once at the end. A run over the
		// full manifest takes long enough that finishing in one go is not
		// something to rely on, and a half-finished run should leave a usable
		// credits file rather than nothing.
		await flush(byFile);
	}

	const out = flush.last ?? [];
	const totalKb = out.reduce((s, c) => s + c.kb, 0);
	console.log(
		`\n${out.length} images, ${(totalKb / 1024).toFixed(1)} MB total, credits written.`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
