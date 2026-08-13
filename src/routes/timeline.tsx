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
 * One era's extent drawn against the full chronology. The point is proportion:
 * the Indus block is wide and sits at the far left, Independence is a tick at
 * the right edge, and the empty stretches between them are the centuries the
 * page has no entry for.
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
		<div aria-hidden="true" className="relative mt-8 h-px w-full bg-border/25">
			<span
				className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-primary transition-[filter] duration-500 group-hover:brightness-110"
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
					<div className="relative h-px w-full bg-border/25">
						<span className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-border/40" />
						<span
							className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-secondary"
							style={{ left: `${axisPercent(0)}%` }}
						/>
					</div>
					<figcaption className="relative mt-3 flex items-baseline justify-between font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
						<span>2600 BCE</span>
						<span
							className="absolute -translate-x-1/2 text-secondary"
							style={{ left: `${axisPercent(0)}%` }}
						>
							1 CE
						</span>
						<span>1947</span>
					</figcaption>
					<p className="mt-6 max-w-2xl text-pretty text-muted-foreground">
						Each era below carries this axis beneath it, with its own extent
						marked. The gaps are as much of the record as the entries are.
					</p>
				</figure>
			</Reveal>

			<ol className="flex flex-col gap-20 md:gap-28">
				{timeline.map((era) => {
					const shot = heroFor(`era-${era.slug}`);

					return (
						<li key={era.slug}>
							<Reveal>
								<Link
									to="/timeline/$slug"
									params={{ slug: era.slug }}
									className="group block no-underline"
								>
									<figure className="relative overflow-hidden rounded-lg bg-accent">
										{shot ? (
											<img
												src={shot.file}
												srcSet={srcSetFor(shot.file)}
												sizes="(min-width: 1152px) 1072px, 92vw"
												alt={`${era.title}: ${era.body}`}
												loading="lazy"
												decoding="async"
												className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 md:aspect-[21/8]"
											/>
										) : (
											<div className="aspect-[16/10] w-full md:aspect-[21/8]" />
										)}

										{/* Legibility floor for the title, not decoration — the
										    photographs run from pale stone to dark bronze. */}
										<div
											aria-hidden="true"
											className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/35 to-transparent"
										/>

										<figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-x-8 gap-y-2 p-6 md:p-10">
											<h2 className="text-3xl font-bold tracking-tight text-balance text-white md:text-5xl">
												{era.title}
											</h2>
											<p className="font-mono text-xs tracking-[0.18em] text-white/85 uppercase">
												{era.period}
											</p>
										</figcaption>
									</figure>

									<div className="mt-7 flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-14">
										<p className="max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
											{era.body}
										</p>
										<span className="inline-flex shrink-0 items-center gap-2 font-medium text-primary">
											View Details
											<span
												aria-hidden="true"
												className="transition-transform duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
											>
												→
											</span>
										</span>
									</div>

									<EraSpan slug={era.slug} />
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
