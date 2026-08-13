import {
	createFileRoute,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { EmbroideryPatches } from "#/components/embroidery";
import { PageShell } from "#/components/page-shell";
import { Reveal } from "#/components/reveal";
import { danceForms } from "#/lib/heritage";

export const Route = createFileRoute("/arts")({ component: ArtsLayout });

function ArtsLayout() {
	const router = useRouterState();
	const isChildRoute = router.location.pathname.startsWith("/arts/");
	if (isChildRoute) {
		return <Outlet />;
	}

	return <Arts />;
}

function Arts() {
	return (
		<PageShell
			eyebrow="Living Tradition"
			title="The eight classical forms"
			lede="Stone records what a culture built. Dance records how it moved — and unlike stone, it survives only by being taught. These eight are recognised as classical by the Sangeet Natak Akademi; each carries a regional grammar of gesture, rhythm and stance."
		>
			<div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
				{danceForms.map((form, i) => (
					<Reveal key={form.slug} delay={(i % 2) * 0.08}>
						<Link
							to="/arts/$slug"
							params={{ slug: form.slug }}
							className="group flex h-full flex-col bg-background p-8 no-underline transition-colors duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] hover:bg-muted md:p-10"
						>
							<div className="flex items-baseline justify-between gap-4">
								<h2 className="text-2xl font-bold tracking-tight md:text-3xl">
									{form.name}
								</h2>
								<span className="shrink-0 font-mono text-xs text-muted-foreground">
									{String(i + 1).padStart(2, "0")}
								</span>
							</div>
							<p className="mt-1 font-mono text-xs tracking-[0.16em] text-secondary uppercase">
								{form.state}
							</p>
							<p className="mt-5 leading-relaxed text-pretty text-muted-foreground">
								{form.note}
							</p>
							<span className="mt-6 inline-flex items-center gap-2 font-medium text-primary">
								View Details
								<span
									aria-hidden="true"
									className="transition-transform duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:translate-x-1"
								>
									→
								</span>
							</span>
							{/* Underline sweeps in on hover, echoing the nav links. */}
							<span className="mt-6 block h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:scale-x-100" />
						</Link>
					</Reveal>
				))}
			</div>

			<Reveal>
				<p className="mt-16 max-w-2xl text-muted-foreground">
					Sattriya was the most recent addition, recognised in 2000 after four
					centuries inside the monasteries of Assam — a reminder that the list
					is a record of what has been documented, not a closed canon.
				</p>
			</Reveal>

			<Reveal>
				<section className="mt-24 overflow-hidden rounded-lg border border-border md:mt-32">
					<div className="grid md:grid-cols-2">
						<div className="bg-accent p-8 text-white md:p-12">
							<p className="font-mono text-xs tracking-[0.2em] text-white/50 uppercase">
								Craft
							</p>
							<h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
								The other tradition, worked in thread
							</h2>
							<p className="mt-5 text-pretty leading-relaxed text-white/70">
								Chikankari in Lucknow, phulkari across Punjab, kantha in Bengal,
								zardozi in the old Mughal workshops — embroidery carries the
								same regional grammar as the dance forms above, and survives the
								same way: by being taught, stitch by stitch, to someone else.
							</p>
							<p className="mt-5 text-pretty text-white/50 text-sm">
								Hover the cloth to move the light across the stitching.
							</p>
						</div>

						{/* Fourth WebGL context on the site, so it is deliberately its own
						    contained block and parked until scrolled to. */}
						<EmbroideryPatches className="min-h-[22rem] md:min-h-[26rem]" />
					</div>
				</section>
			</Reveal>
		</PageShell>
	);
}
