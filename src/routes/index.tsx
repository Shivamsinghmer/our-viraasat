import { createFileRoute, Link } from "@tanstack/react-router";
import { BharataSection } from "#/components/bharata-section";
import { DesignTilesBar } from "#/components/design-tiles";
import { HeroSection } from "#/components/hero-section";
import { Reveal } from "#/components/reveal";
import { TypedHeading } from "#/components/typed-heading";
import { allMonuments, danceForms, UNESCO_SITE_COUNT } from "#/lib/heritage";

export const Route = createFileRoute("/")({ component: Home });

const sections = [
	{
		to: "/monuments",
		eyebrow: "World Heritage",
		title: "Monuments",
		body: "Rock-cut basalt, granite, sandstone and marble — the same impulse worked out across two thousand years.",
	},
	{
		to: "/arts",
		eyebrow: "Living Tradition",
		title: "Classical Arts",
		body: "Eight dance forms that survive only by being taught, each with its own regional grammar of gesture and stance.",
	},
	{
		to: "/timeline",
		eyebrow: "Chronology",
		title: "Timeline",
		body: "From the grid-planned drains of Mohenjo-daro to a wheel from Sarnath placed at the centre of a new flag.",
	},
] as const;

function Home() {
	return (
		<>
			<HeroSection />

			<BharataSection />

			<section className="mx-auto w-full max-w-6xl px-6 py-24 md:px-10 md:py-32">
				<Reveal>
					<DesignTilesBar className="mb-12" />

					<div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
						<TypedHeading className="text-3xl font-bold tracking-tight text-balance md:text-5xl">
							Heritage is not the past. It is the part of the past that someone
							kept.
						</TypedHeading>
						<p className="text-lg leading-relaxed text-pretty text-muted-foreground">
							Every monument here survived because people chose, repeatedly and
							across centuries, to maintain it — through sacking, abandonment,
							forest, and neglect. What we call heritage is the residue of that
							choice, and it is still being made.
						</p>
					</div>
				</Reveal>

				<Reveal>
					<dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:mt-24 md:grid-cols-4">
						{[
							{ n: UNESCO_SITE_COUNT, l: "World Heritage sites" },
							{ n: danceForms.length, l: "Classical dance forms" },
							{ n: "4,500", l: "Years of record" },
							{ n: allMonuments.length, l: "Places documented here" },
						].map((stat) => (
							<div key={stat.l} className="bg-background p-6 md:p-8">
								<dt className="font-mono text-xs tracking-[0.16em] text-secondary uppercase">
									{stat.l}
								</dt>
								<dd className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
									{stat.n}
								</dd>
							</div>
						))}
					</dl>
				</Reveal>
			</section>

			<section className="mx-auto w-full max-w-6xl px-6 pb-32 md:px-10">
				<div className="grid gap-8 md:grid-cols-3">
					{sections.map((section, i) => (
						<Reveal key={section.to} delay={i * 0.08}>
							<Link
								to={section.to}
								className="group flex h-full flex-col justify-between rounded-lg border border-border bg-background p-8 no-underline shadow-sm transition-colors duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] hover:bg-muted md:p-10"
							>
								<div>
									<p className="font-mono text-xs tracking-[0.18em] text-secondary uppercase">
										{section.eyebrow}
									</p>
									<h3 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
										{section.title}
									</h3>
									<p className="mt-4 text-pretty text-muted-foreground">
										{section.body}
									</p>
								</div>
								<span className="mt-8 inline-flex items-center gap-2 font-medium text-primary">
									Explore
									<span
										aria-hidden="true"
										className="transition-transform duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:translate-x-1"
									>
										→
									</span>
								</span>
							</Link>
						</Reveal>
					))}
				</div>
			</section>
		</>
	);
}
