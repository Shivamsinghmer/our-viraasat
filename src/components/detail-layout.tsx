import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { type GalleryImage, srcSetFor } from "#/lib/gallery";

/**
 * Shared layout for the three detail templates (monument, dance form, era).
 *
 * The three pages were the same skeleton copied three times, and carried the
 * same three structural problems: section headings only 1.11× the body size, so
 * six sections read as one undifferentiated slab; a static sidebar that ran out
 * 780px before the article did, leaving a tall empty gutter; and a gallery
 * boxed into the 600px prose column on a 1280px page.
 *
 * The fixes are structural rather than decorative — a real type step between
 * heading and body, a rail that tracks the reader, and full-width imagery — and
 * they live here so all three templates stay in step.
 */

/** Spacing rhythm. Tight inside a group, generous between groups. */
const SECTION_GAP = "clamp(2.75rem,4vw,4rem)";

export function DetailPage({
	backTo,
	backLabel,
	children,
}: {
	backTo: "/monuments" | "/arts" | "/timeline";
	backLabel: string;
	children: ReactNode;
}) {
	return (
		<main className="mx-auto w-full max-w-6xl px-6 pt-32 pb-24 md:px-10 md:pt-40">
			<nav className="mb-10">
				<Link
					to={backTo}
					className="group inline-flex items-center gap-2 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
				>
					<span
						aria-hidden="true"
						className="transition-transform duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:-translate-x-1"
					>
						←
					</span>
					{backLabel}
				</Link>
			</nav>
			{children}
		</main>
	);
}

/**
 * Title left, metadata right-aligned on a rail. Asymmetric on purpose: it
 * breaks the stacked eyebrow-over-heading cadence the rest of the site uses for
 * list pages, and it lets the facts a reader scans for — a year, a period, a
 * region — sit where they can be read without going through the title first.
 */
export function DetailHeader({
	title,
	subtitle,
	meta,
}: {
	title: string;
	subtitle?: string;
	meta: { label: string; value: string }[];
}) {
	return (
		<header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
			<div>
				<h1 className="text-[clamp(2.125rem,1.3rem+3.4vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-balance">
					{title}
				</h1>
				{subtitle && (
					<p className="mt-4 max-w-[46ch] text-lg text-pretty text-muted-foreground">
						{subtitle}
					</p>
				)}
			</div>

			{meta.length > 0 && (
				<dl className="flex flex-wrap gap-x-8 gap-y-3 lg:justify-end lg:text-right">
					{meta.map((item) => (
						<div key={item.label}>
							<dt className="font-mono text-[11px] tracking-[0.16em] text-secondary uppercase">
								{item.label}
							</dt>
							<dd className="mt-1 font-medium text-sm whitespace-nowrap">
								{item.value}
							</dd>
						</div>
					))}
				</dl>
			)}
		</header>
	);
}

/**
 * The hero runs the full container width at a wider crop than the old 16:9,
 * so the photograph reads as the second beat of the page rather than as an
 * illustration sitting inside the text column.
 */
export function DetailHero({
	image,
	alt,
}: {
	image: GalleryImage | null;
	alt: string;
}) {
	if (!image) return null;

	return (
		<figure className="mt-[clamp(2rem,3.5vw,3rem)]">
			<div className="overflow-hidden rounded-lg border border-border">
				{/* Displayed up to ~1070px on desktop but only ~330px on a phone,
				    so let the browser choose rather than shipping 1200px to both. */}
				<img
					src={image.file}
					srcSet={srcSetFor(image.file)}
					sizes="(min-width: 1152px) 1072px, 92vw"
					alt={alt}
					className="aspect-[3/2] w-full object-cover md:aspect-[16/7]"
				/>
			</div>
			<figcaption className="mt-2 font-mono text-[11px] text-muted-foreground">
				{image.author} · {image.license} ·{" "}
				<a
					href={image.commons}
					target="_blank"
					rel="noreferrer"
					className="underline underline-offset-2"
				>
					Commons
				</a>
			</figcaption>
		</figure>
	);
}

/**
 * A standfirst. Set larger than the body and given its own air, so the page has
 * an obvious entry point — previously the summary was styled identically to the
 * five sections that followed it.
 *
 * Replaces the coloured left-border quote the arts and timeline pages used: a
 * thick accent stripe is decoration standing in for hierarchy, and type can do
 * the job properly.
 */
export function DetailLead({ children }: { children: ReactNode }) {
	return (
		<p className="mt-[clamp(2rem,3.5vw,3rem)] max-w-[60ch] text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] leading-[1.5] text-pretty">
			{children}
		</p>
	);
}

/** Prose column plus a rail that stays with the reader down a long page. */
export function DetailColumns({
	children,
	rail,
}: {
	children: ReactNode;
	rail?: ReactNode;
}) {
	return (
		<div className="mt-[clamp(3rem,5vw,4.5rem)] grid items-start gap-[clamp(2.5rem,4vw,4.5rem)] lg:grid-cols-[minmax(0,1fr)_17rem]">
			{/* Section rhythm lives here as a flex gap rather than as a margin on
			    each section: a top margin on the first child would push the prose
			    column down while the rail stayed put, and the two would no longer
			    align at the top of the grid row. */}
			<div className="flex min-w-0 flex-col" style={{ gap: SECTION_GAP }}>
				{children}
			</div>

			{rail && (
				// top-32 clears the fixed floating nav. self-start is required for
				// sticky to have anywhere to travel inside a grid item.
				<aside className="flex flex-col gap-8 lg:sticky lg:top-32 lg:self-start lg:border-l lg:border-border lg:pl-8">
					{rail}
				</aside>
			)}
		</div>
	);
}

/**
 * One body section. The hairline above and the space below it are what separate
 * sections now — no cards, no boxes. The heading sits tight to its own text and
 * far from the previous section, which is what makes the grouping readable.
 */
export function DetailSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="border-border border-t pt-[clamp(1.75rem,2.5vw,2.5rem)] first:border-t-0 first:pt-0">
			<h2 className="text-[clamp(1.5rem,1.35rem+0.7vw,1.875rem)] font-bold tracking-tight text-balance">
				{title}
			</h2>
			{/* 51ch, not 65: the `ch` unit measures the "0" glyph, which is much
			    wider than average lowercase prose. Measured against this content,
			    58ch rendered 75–83 real characters per line; 51ch lands inside the
			    65–75 range this text actually wants. */}
			<div className="mt-4 max-w-[51ch] text-lg leading-relaxed text-pretty text-muted-foreground">
				{children}
			</div>
		</section>
	);
}

/** Full-container-width band, for content that wants more room than the prose. */
export function DetailWide({ children }: { children: ReactNode }) {
	return (
		<div className="mt-[clamp(3.5rem,6vw,5.5rem)] border-border border-t pt-[clamp(2rem,3vw,3rem)]">
			{children}
		</div>
	);
}

export function RailPanel({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section>
			<h2 className="font-mono text-[11px] tracking-[0.16em] text-secondary uppercase">
				{title}
			</h2>
			<div className="mt-4">{children}</div>
		</section>
	);
}

/** Facts as hairline-separated rows rather than a bordered muted box. */
export function FactList({
	facts,
}: {
	facts: { label: string; value: string }[];
}) {
	return (
		<dl className="flex flex-col">
			{facts.map((fact) => (
				<div
					key={fact.label}
					className="border-border border-b py-2.5 last:border-b-0"
				>
					<dt className="text-xs text-muted-foreground">{fact.label}</dt>
					<dd className="mt-0.5 font-medium text-sm text-pretty">
						{fact.value}
					</dd>
				</div>
			))}
		</dl>
	);
}

interface PagerLink {
	to: "/monuments/$slug" | "/arts/$slug" | "/timeline/$slug";
	slug: string;
	name: string;
}

/**
 * Stacks on mobile — the old two-column grid put two cards side by side at
 * 375px, which left each one about 160px wide.
 */
export function DetailPager({
	prev,
	next,
	prevLabel = "Previous",
	nextLabel = "Next",
}: {
	prev: PagerLink | null;
	next: PagerLink | null;
	prevLabel?: string;
	nextLabel?: string;
}) {
	if (!prev && !next) return null;

	return (
		<nav
			aria-label="Pagination"
			className="mt-[clamp(3.5rem,6vw,5.5rem)] grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2"
		>
			{prev ? (
				<Link
					to={prev.to}
					params={{ slug: prev.slug }}
					className="group flex flex-col gap-1 bg-background p-6 no-underline transition-colors duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] hover:bg-muted"
				>
					<span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-secondary uppercase">
						<span
							aria-hidden="true"
							className="transition-transform duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:-translate-x-1"
						>
							←
						</span>
						{prevLabel}
					</span>
					<span className="font-semibold text-pretty transition-colors duration-300 group-hover:text-primary">
						{prev.name}
					</span>
				</Link>
			) : (
				<div className="hidden bg-background sm:block" />
			)}

			{next ? (
				<Link
					to={next.to}
					params={{ slug: next.slug }}
					className="group flex flex-col items-start gap-1 bg-background p-6 no-underline transition-colors duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] hover:bg-muted sm:items-end sm:text-right"
				>
					<span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-secondary uppercase">
						{nextLabel}
						<span
							aria-hidden="true"
							className="transition-transform duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:translate-x-1"
						>
							→
						</span>
					</span>
					<span className="font-semibold text-pretty transition-colors duration-300 group-hover:text-primary">
						{next.name}
					</span>
				</Link>
			) : (
				<div className="hidden bg-background sm:block" />
			)}
		</nav>
	);
}
