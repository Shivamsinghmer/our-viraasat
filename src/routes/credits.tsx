import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "#/components/page-shell";
import { Reveal } from "#/components/reveal";
import { type GalleryImage, galleryFor, smallFile } from "#/lib/gallery";
import { allMonuments, danceForms, timeline } from "#/lib/heritage";
import imageCredits from "#/lib/image-credits.json";

export const Route = createFileRoute("/credits")({ component: Credits });

/**
 * Every subject that can own images, with a readable name. Grouping by subject
 * rather than listing two hundred rows flat keeps the page usable, and means a
 * reader checking one monument's licensing can find it.
 */
function subjectIndex(): { slug: string; name: string; group: string }[] {
	return [
		...allMonuments.map((m) => ({
			slug: m.slug,
			name: m.name,
			group: "World Heritage properties",
		})),
		...danceForms.map((f) => ({
			slug: `art-${f.slug}`,
			name: f.name,
			group: "Classical arts",
		})),
		...timeline.map((e) => ({
			slug: `era-${e.slug}`,
			name: e.title,
			group: "Timeline",
		})),
	];
}

function CreditRow({ image }: { image: GalleryImage }) {
	return (
		<li className="flex items-center gap-3 border-border border-t py-3 first:border-t-0">
			<img
				src={smallFile(image.file)}
				alt=""
				loading="lazy"
				decoding="async"
				className="size-12 shrink-0 rounded-sm border border-border object-cover"
			/>
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium">{image.author}</p>
				<p className="font-mono text-xs text-muted-foreground">
					{image.license} · {image.kb} KB
				</p>
			</div>
			<a
				href={image.commons}
				target="_blank"
				rel="noreferrer"
				className="shrink-0 text-sm underline underline-offset-2"
			>
				Commons
			</a>
		</li>
	);
}

function Credits() {
	const all = imageCredits as GalleryImage[];
	const totalMb = (all.reduce((sum, c) => sum + c.kb, 0) / 1024).toFixed(1);

	const subjects = subjectIndex()
		.map((s) => ({ ...s, images: galleryFor(s.slug) }))
		.filter((s) => s.images.length > 0);

	const groups = [
		"World Heritage properties",
		"Classical arts",
		"Timeline",
	].map((name) => ({
		name,
		subjects: subjects.filter((s) => s.group === name),
	}));

	// Licences actually in use, counted — more useful than asserting a policy.
	const licences = [...new Set(all.map((c) => c.license))].sort();

	return (
		<PageShell
			eyebrow="Attribution"
			title="Where the photographs came from"
			lede="Every image on this site is self-hosted and openly licensed, sourced from Wikimedia Commons. Nothing is hotlinked, so the site works without a network and its licensing can be checked against the original file page."
		>
			<Reveal>
				<dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
					{[
						{ n: String(all.length), l: "Images" },
						{ n: totalMb, l: "Megabytes, self-hosted" },
						{ n: String(subjects.length), l: "Subjects covered" },
						{ n: String(licences.length), l: "Distinct licences" },
					].map((stat) => (
						<div key={stat.l} className="bg-background p-5">
							<dt className="font-mono text-xs tracking-[0.16em] text-secondary uppercase">
								{stat.l}
							</dt>
							<dd className="mt-2 text-3xl font-bold tracking-tight">
								{stat.n}
							</dd>
						</div>
					))}
				</dl>
			</Reveal>

			<Reveal>
				<div className="mt-10 rounded-lg border border-border bg-muted p-6 md:p-8">
					<h2 className="font-mono text-xs tracking-[0.16em] text-secondary uppercase">
						Licences in use
					</h2>
					<ul className="mt-4 flex flex-wrap gap-2">
						{licences.map((licence) => (
							<li
								key={licence}
								className="rounded-sm border border-border bg-background px-2 py-1 font-mono text-xs"
							>
								{licence}
							</li>
						))}
					</ul>
					<p className="mt-4 max-w-2xl text-sm text-muted-foreground">
						Only free licences are accepted. The fetch script rejects anything
						that does not match a Creative Commons, CC0 or public-domain
						declaration, rather than assuming permission.
					</p>
				</div>
			</Reveal>

			{groups.map((group) =>
				group.subjects.length === 0 ? null : (
					<Reveal key={group.name}>
						<section className="mt-16">
							<h2 className="text-2xl font-bold tracking-tight md:text-3xl">
								{group.name}
							</h2>
							<div className="mt-8 grid gap-8 md:grid-cols-2">
								{group.subjects.map((subject) => (
									<div
										key={subject.slug}
										className="rounded-lg border border-border p-5"
									>
										<h3 className="font-semibold">{subject.name}</h3>
										<p className="mt-1 font-mono text-xs text-muted-foreground">
											{subject.images.length}{" "}
											{subject.images.length === 1 ? "image" : "images"}
										</p>
										<ul className="mt-4 flex flex-col">
											{subject.images.map((image) => (
												<CreditRow key={image.file} image={image} />
											))}
										</ul>
									</div>
								))}
							</div>
						</section>
					</Reveal>
				),
			)}

			<Reveal>
				<div className="mt-16 grid gap-8 md:grid-cols-2">
					<section>
						<h2 className="text-xl font-bold tracking-tight">Sources</h2>
						<ul className="mt-4 flex flex-col gap-2 text-muted-foreground">
							<li>
								Inscription years and site counts:{" "}
								<a
									href="https://whc.unesco.org/en/statesparties/in"
									target="_blank"
									rel="noreferrer"
									className="underline underline-offset-2"
								>
									UNESCO World Heritage List — India
								</a>
							</li>
							<li>
								Sarnath as the 45th property:{" "}
								<a
									href="https://www.unesco.org/en/articles/ancient-buddhist-site-sarnath-inscribed-unesco-world-heritage-list"
									target="_blank"
									rel="noreferrer"
									className="underline underline-offset-2"
								>
									UNESCO announcement
								</a>
							</li>
							<li>Classical dance recognition: Sangeet Natak Akademi</li>
							<li>
								Imagery:{" "}
								<a
									href="https://commons.wikimedia.org/"
									target="_blank"
									rel="noreferrer"
									className="underline underline-offset-2"
								>
									Wikimedia Commons
								</a>
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-xl font-bold tracking-tight">Build</h2>
						<dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-muted-foreground">
							<dt className="font-mono text-xs uppercase">Framework</dt>
							<dd>TanStack Start · React 19</dd>
							<dt className="font-mono text-xs uppercase">Styling</dt>
							<dd>Tailwind CSS v4</dd>
							<dt className="font-mono text-xs uppercase">Motion</dt>
							<dd>GSAP · framer-motion · Lenis</dd>
							<dt className="font-mono text-xs uppercase">Graphics</dt>
							<dd>OGL (WebGL)</dd>
							<dt className="font-mono text-xs uppercase">Imagery</dt>
							<dd>
								{all.length} files, {totalMb} MB, all self-hosted
							</dd>
						</dl>
					</section>
				</div>
			</Reveal>
		</PageShell>
	);
}
