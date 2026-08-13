import {
	createFileRoute,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { PageShell } from "#/components/page-shell";
import { Reveal } from "#/components/reveal";
import { heroFor, srcSetFor } from "#/lib/gallery";
import { timeline } from "#/lib/heritage";

export const Route = createFileRoute("/timeline")({
	component: TimelineLayout,
});

function TimelineLayout() {
	const router = useRouterState();
	const isChildRoute = router.location.pathname.startsWith("/timeline/");
	if (isChildRoute) {
		return <Outlet />;
	}

	return <Timeline />;
}

/**
 * The axis every era is measured against: the earliest date on the page to the
 * latest. Kept here rather than in heritage.ts because these are reductions of
 * the period strings — "c. 2600–1900 BCE" is a range with a hedge in front of
 * it, and the bar needs two plain numbers. The prose keeps the hedge.
 */
const AXIS_START = -2600;
const AXIS_END = 1947;

const ERA_SPANS: Record<string, readonly [number, number]> = {
	"indus-valley": [-2600, -1900],
	"vedic-period": [-1500, -500],
	"mauryan-empire": [-322, -185],
	"gupta-period": [320, 550],
	"chola-dynasty": [800, 1300],
	"delhi-sultanate": [1206, 1526],
	"mughal-empire": [1526, 1857],
	independence: [1947, 1947],
};

function axisPercent(year: number): number {
	return ((year - AXIS_START) / (AXIS_END - AXIS_START)) * 100;
}

/**
 * Gridlines shared by the legend and by every era's own axis. Because the scale
 * and the tick positions are identical on all of them, scrolling the page reads
 * as one continuous measure with the extents moving left to right across it —
 * which is the argument the page is making.
 */
const AXIS_TICKS = [
	{ year: -2000, label: "2000 BCE" },
	{ year: -1000, label: "1000 BCE" },
	{ year: 0, label: "1 CE" },
	{ year: 1000, label: "1000 CE" },
] as const;

/**
 * One era's extent drawn against the full chronology. The point is proportion:
 * the Indus block is wide and sits at the far left, Independence is a tick at
 * the right edge, and the empty stretches between them are the centuries the
 * page has no entry for.
 *
 * Sits between the era's name and its photograph rather than under the whole
 * entry. Below the prose it read as a stray rule; here it is plainly a
 * measurement of the thing just named.
 */
function EraSpan({ slug }: { slug: string }) {
	const span = ERA_SPANS[slug];
	if (!span) return null;

	// A single-year era would otherwise compute to zero width and vanish; 1947
	// sits at the very end of the axis, so the tick is pulled back inside it
	// rather than allowed to hang off the right edge.
	const width = Math.max(axisPercent(span[1]) - axisPercent(span[0]), 0.55);
	const left = Math.min(axisPercent(span[0]), 100 - width);

	return (
		<div aria-hidden="true" className="relative mt-5 h-2 w-full">
			<span className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-foreground/12" />

			{AXIS_TICKS.map((tick) => (
				<span
					key={tick.year}
					className={`absolute top-1/2 w-px -translate-y-1/2 ${
						tick.year === 0 ? "h-2 bg-secondary/50" : "h-1.5 bg-foreground/15"
					}`}
					style={{ left: `${axisPercent(tick.year)}%` }}
				/>
			))}

			<span
				className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-primary transition-[height,filter] duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:h-[5px] group-hover:brightness-105 motion-reduce:transition-none motion-reduce:group-hover:h-[3px]"
				style={{ left: `${left}%`, width: `${width}%` }}
			/>
		</div>
	);
}

function Timeline() {
	return (
		<PageShell
			eyebrow="Chronology"
			title="Four and a half thousand years"
			lede="A civilisation long enough that its own monuments become archaeology to the people who follow. What survives is uneven — cities without a readable script, mathematics without its monuments, temples without their painters' names."
		>
			{/* The legend earns the bars underneath each era; without it they are
			    decoration, and the whole point is that they are measurements. */}
			<Reveal>
				<figure className="mb-16 md:mb-24">
					{/* Ticks hang below the rule so each label sits under its own mark. */}
					<div className="relative h-3 w-full">
						<span className="absolute top-0 h-px w-full bg-foreground/20" />
						<span className="absolute top-0 left-0 h-2.5 w-px bg-foreground/35" />
						<span className="absolute top-0 right-0 h-2.5 w-px bg-foreground/35" />

						{AXIS_TICKS.map((tick) => (
							<span
								key={tick.year}
								className={`absolute top-0 w-px ${
									tick.year === 0
										? "h-2.5 bg-secondary"
										: "h-1.5 bg-foreground/20"
								}`}
								style={{ left: `${axisPercent(tick.year)}%` }}
							/>
						))}
					</div>

					<figcaption className="relative mt-2 h-4 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
						<span className="absolute left-0">2600 BCE</span>

						{/* lg, not md: measured at 800px the 2000 BCE label still runs
						    into the 2600 BCE endpoint. The ticks stay at every size; only
						    their labels wait for the room to sit clear. */}
						{AXIS_TICKS.map((tick) => (
							<span
								key={tick.year}
								className={`absolute -translate-x-1/2 ${
									tick.year === 0
										? "text-secondary"
										: "hidden text-muted-foreground/70 lg:inline"
								}`}
								style={{ left: `${axisPercent(tick.year)}%` }}
							>
								{tick.label}
							</span>
						))}

						<span className="absolute right-0">1947</span>
					</figcaption>

					<p className="mt-8 max-w-[68ch] text-pretty text-muted-foreground">
						Each era below carries this same axis, with its own extent marked
						against it. The gaps are as much of the record as the entries are.
					</p>
				</figure>
			</Reveal>

			<ol className="flex flex-col">
				{timeline.map((era, i) => {
					const shot = heroFor(`era-${era.slug}`);

					return (
						<li
							key={era.slug}
							// A hairline plus the gap, rather than gap alone: eight
							// unseparated stacks read as one long column of loose parts.
							className={
								i === 0
									? ""
									: "mt-16 border-foreground/10 border-t pt-16 md:mt-24 md:pt-24"
							}
						>
							<Reveal>
								<Link
									to="/timeline/$slug"
									params={{ slug: era.slug }}
									className="group block no-underline"
								>
									{/* Period above title, both left-aligned: one caption block.
									    Split to opposite edges of a 1072px row they read as two
									    unrelated labels. */}
									<p className="font-mono text-xs tracking-[0.18em] text-secondary uppercase">
										{era.period}
									</p>
									<h2 className="mt-2 text-3xl font-bold tracking-tight text-balance transition-colors duration-300 group-hover:text-primary-strong md:text-4xl">
										{era.title}
									</h2>

									<EraSpan slug={era.slug} />

									{/* No scrim. With the title lifted off the photograph there
									    is nothing to keep legible, so the image is left alone —
									    the navy wash it used to carry stained every warm-toned
									    manuscript and stone it sat on. */}
									<figure className="mt-8 overflow-hidden rounded-lg border border-border shadow-md transition-shadow duration-500 group-hover:shadow-lg">
										{shot ? (
											<img
												src={shot.file}
												srcSet={srcSetFor(shot.file)}
												sizes="(min-width: 1152px) 1072px, 92vw"
												alt={`${era.title}: ${era.body}`}
												loading="lazy"
												decoding="async"
												className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 md:aspect-[16/9]"
											/>
										) : (
											<div className="flex aspect-[4/3] w-full items-center justify-center bg-muted md:aspect-[16/9]">
												<span className="font-mono text-[11px] text-muted-foreground">
													Photograph not yet sourced
												</span>
											</div>
										)}
									</figure>

									<div className="mt-6 max-w-[68ch]">
										<p className="text-lg leading-relaxed text-pretty text-muted-foreground">
											{era.body}
										</p>
										<span className="mt-4 inline-flex items-center gap-2 font-medium text-primary-strong underline decoration-primary/40 decoration-2 underline-offset-4 transition-colors duration-300 group-hover:decoration-primary">
											View details
											<span
												aria-hidden="true"
												className="no-underline transition-transform duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
											>
												→
											</span>
										</span>
									</div>
								</Link>
							</Reveal>
						</li>
					);
				})}
			</ol>

			<Reveal>
				<aside className="mt-24 rounded-lg border border-border bg-muted p-8 md:mt-32 md:p-12">
					<h2 className="text-xl font-bold tracking-tight md:text-2xl">
						Why the wheel is on the flag
					</h2>
					<p className="mt-4 max-w-2xl leading-relaxed text-pretty text-muted-foreground">
						The Ashokan lion capital was excavated at Sarnath, where the Buddha
						first taught. In 1947 the wheel from its abacus was placed at the
						centre of the national flag and the capital itself adopted as the
						State Emblem — a republic three years old choosing a marker from the
						third century BCE. Sarnath became India's 45th World Heritage
						property in 2026.
					</p>
				</aside>
			</Reveal>
		</PageShell>
	);
}
