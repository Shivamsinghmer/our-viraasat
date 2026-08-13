import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "#/components/page-shell";
import { Reveal } from "#/components/reveal";
import { allMonuments, danceForms, UNESCO_SITE_COUNT } from "#/lib/heritage";
import type { Figure } from "#/lib/india";
import {
	intangibleHeritage,
	landFigures,
	nationalSymbols,
	peopleFigures,
	regions,
} from "#/lib/india";

export const Route = createFileRoute("/india")({ component: India });

function FigureGrid({ figures }: { figures: Figure[] }) {
	return (
		<dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
			{figures.map((figure) => (
				<div key={figure.label} className="bg-background p-6">
					<dd className="text-3xl font-bold tracking-tight md:text-4xl">
						{figure.value}
					</dd>
					<dt className="mt-2 font-medium text-sm">{figure.label}</dt>
					{figure.note && (
						<p className="mt-2 text-pretty text-sm text-muted-foreground">
							{figure.note}
						</p>
					)}
				</div>
			))}
		</dl>
	);
}

function India() {
	const natural = allMonuments.filter((m) => m.category === "natural").length;
	const mixed = allMonuments.filter((m) => m.category === "mixed").length;
	const cultural = UNESCO_SITE_COUNT - natural - mixed;

	return (
		<PageShell
			eyebrow="Context"
			title="The country this heritage belongs to"
			lede="A subcontinent the size of Europe, with more languages in daily use than the European Union has member states. What follows is the frame the rest of this site sits inside — the land, the people, the living practices, and the symbols a republic chose for itself in 1947."
		>
			<Reveal>
				<section>
					<h2 className="text-2xl font-bold tracking-tight md:text-3xl">
						The land
					</h2>
					<p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
						India runs from permanent Himalayan snow to equatorial coast within
						a single country. That range is why its heritage is not one
						tradition: what people built depended on what stone was under them
						and how much rain fell on it.
					</p>
					<div className="mt-8">
						<FigureGrid figures={landFigures} />
					</div>
				</section>
			</Reveal>

			<Reveal>
				<section className="mt-20">
					<h2 className="text-2xl font-bold tracking-tight md:text-3xl">
						Six regions, six ways of building
					</h2>
					<p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
						A rough division, but a useful one: each of these produced a
						distinct building tradition because it had different material and
						different weather to work against.
					</p>
					<div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
						{regions.map((region) => (
							<article key={region.name} className="bg-background p-6 md:p-8">
								<h3 className="text-lg font-semibold">{region.name}</h3>
								<p className="mt-3 text-pretty text-muted-foreground">
									{region.summary}
								</p>
								<p className="mt-3 text-pretty text-sm text-muted-foreground">
									<span className="font-medium text-foreground">
										What it left:
									</span>{" "}
									{region.marks}
								</p>
							</article>
						))}
					</div>
				</section>
			</Reveal>

			<Reveal>
				<section className="mt-20">
					<h2 className="text-2xl font-bold tracking-tight md:text-3xl">
						The people and the languages
					</h2>
					<p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
						India has no single national language. The Constitution schedules
						twenty-two, the Union conducts business in two, and the 2011 Census
						recorded well over a thousand mother tongues. Every inscription,
						every sung text and every dance libretto on this site is in one of
						them.
					</p>
					<div className="mt-8">
						<FigureGrid figures={peopleFigures} />
					</div>
				</section>
			</Reveal>

			<Reveal>
				<section className="mt-20">
					<div className="flex flex-wrap items-baseline justify-between gap-4">
						<h2 className="text-2xl font-bold tracking-tight md:text-3xl">
							Heritage that is practised, not built
						</h2>
						<p className="font-mono text-xs text-muted-foreground">
							{intangibleHeritage.length} UNESCO elements
						</p>
					</div>
					<p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
						UNESCO keeps a second list for practices rather than places. It is
						arguably the more fragile register: a temple can stand empty for a
						century and be restored, but a form of chanting that goes one
						generation untaught is gone.
					</p>
					<ol className="mt-8 flex flex-col">
						{intangibleHeritage.map((element) => (
							<li
								key={element.name}
								className="grid gap-1 border-border border-t py-4 md:grid-cols-[6rem_1fr] md:gap-6"
							>
								<span className="font-mono text-sm text-secondary">
									{element.year}
								</span>
								<div>
									<h3 className="font-semibold">{element.name}</h3>
									<p className="mt-1 text-pretty text-muted-foreground">
										{element.note}
									</p>
								</div>
							</li>
						))}
					</ol>
				</section>
			</Reveal>

			<Reveal>
				<section className="mt-20">
					<h2 className="text-2xl font-bold tracking-tight md:text-3xl">
						What the republic chose for itself
					</h2>
					<p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
						Every one of these was settled between 1947 and 1957, by a state
						deciding in public which parts of a very long past it wanted to
						carry forward.
					</p>
					<div className="mt-8 overflow-x-auto rounded-lg border border-border">
						<table className="w-full min-w-[40rem] border-collapse text-left text-sm">
							<caption className="sr-only">
								National symbols of India, with dates of adoption
							</caption>
							<thead className="bg-muted">
								<tr>
									<th scope="col" className="p-4 font-semibold">
										Symbol
									</th>
									<th scope="col" className="p-4 font-semibold">
										Adopted
									</th>
									<th scope="col" className="p-4 font-semibold">
										Notes
									</th>
								</tr>
							</thead>
							<tbody>
								{nationalSymbols.map((symbol) => (
									<tr key={symbol.name} className="border-border border-t">
										<td className="p-4 align-top">
											<p className="font-medium">{symbol.name}</p>
											<p className="text-muted-foreground">{symbol.value}</p>
										</td>
										<td className="p-4 align-top font-mono text-xs whitespace-nowrap">
											{symbol.adopted}
										</td>
										<td className="p-4 align-top text-pretty text-muted-foreground">
											{symbol.note}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</Reveal>

			<Reveal>
				<section className="mt-20 rounded-lg border border-border bg-muted p-8 md:p-12">
					<h2 className="text-2xl font-bold tracking-tight md:text-3xl">
						What is on this site
					</h2>
					<p className="mt-4 max-w-2xl text-muted-foreground">
						India's {UNESCO_SITE_COUNT} World Heritage properties break down as{" "}
						{cultural} cultural, {natural} natural and {mixed} mixed —
						Khangchendzonga being the only property inscribed for both its
						ecology and its sacred meaning.
					</p>
					<div className="mt-8 flex flex-wrap gap-4">
						<Link
							to="/monuments"
							className="inline-flex items-center gap-2 font-medium text-primary no-underline"
						>
							All {UNESCO_SITE_COUNT} properties
							<span aria-hidden="true">→</span>
						</Link>
						<Link
							to="/arts"
							className="inline-flex items-center gap-2 font-medium text-primary no-underline"
						>
							The {danceForms.length} classical forms
							<span aria-hidden="true">→</span>
						</Link>
						<Link
							to="/timeline"
							className="inline-flex items-center gap-2 font-medium text-primary no-underline"
						>
							Four and a half thousand years
							<span aria-hidden="true">→</span>
						</Link>
					</div>
				</section>
			</Reveal>
		</PageShell>
	);
}
