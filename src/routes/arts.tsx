import {
	createFileRoute,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { EmbroideryPatches } from "#/components/embroidery";
import { PageShell } from "#/components/page-shell";
import { Reveal } from "#/components/reveal";
import { galleryFor, smallFile, srcSetFor } from "#/lib/gallery";
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

/** Portrait, because these are photographs of a standing body. */
const TILE_SIZES = "(min-width: 1024px) 25vw, 45vw";

function Arts() {
	return (
		<PageShell
			eyebrow="Living Tradition"
			title="The eight classical forms"
			lede="Stone records what a culture built. Dance records how it moved — and unlike stone, it survives only by being taught. These eight are recognised as classical by the Sangeet Natak Akademi; each carries a regional grammar of gesture, rhythm and stance."
		>
			{/* Staggered rather than ruled into a grid: eight identical boxes would
			    flatten eight distinct traditions into one template, and the offset
			    gives the row the alternation the forms themselves have. */}
			<ul className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-7 md:gap-y-16">
				{danceForms.map((form, i) => {
					const shots = galleryFor(`art-${form.slug}`);
					const front = shots[0];
					const back = shots[1] ?? shots[0];

					return (
						<li
							key={form.slug}
							className={i % 2 === 1 ? "md:mt-20" : undefined}
						>
							<Link
								to="/arts/$slug"
								params={{ slug: form.slug }}
								className="group block no-underline"
							>
								<figure className="relative aspect-[3/4] overflow-hidden rounded-lg bg-accent">
									{front ? (
										<>
											<img
												src={smallFile(front.file)}
												srcSet={srcSetFor(front.file)}
												sizes={TILE_SIZES}
												alt={`${form.name} in performance`}
												loading="lazy"
												decoding="async"
												className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:scale-105 group-hover:opacity-0 motion-reduce:transition-opacity motion-reduce:group-hover:scale-100"
											/>
											{/* A second frame of the same form. Dance is the one
											    subject on this site that a single still cannot hold,
											    so the hover moves it. */}
											<img
												src={smallFile(back.file)}
												srcSet={srcSetFor(back.file)}
												sizes={TILE_SIZES}
												alt=""
												aria-hidden="true"
												loading="lazy"
												decoding="async"
												className="absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:scale-105 group-hover:opacity-100 motion-reduce:transition-opacity motion-reduce:group-hover:scale-100"
											/>
										</>
									) : null}
								</figure>

								<h2 className="mt-5 text-xl font-bold tracking-tight text-balance transition-colors duration-300 group-hover:text-primary md:text-2xl">
									{form.name}
								</h2>
								{/* Underline sweeps in on hover, echoing the nav links. */}
								<span
									aria-hidden="true"
									className="mt-2 block h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:scale-x-100 motion-reduce:transition-none"
								/>
								<p className="mt-2 font-mono text-[0.6875rem] tracking-[0.16em] text-secondary uppercase">
									{form.state}
								</p>
								<p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">
									{form.note}
								</p>
							</Link>
						</li>
					);
				})}
			</ul>

			<Reveal>
				<p className="mt-20 max-w-2xl text-muted-foreground md:mt-28">
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
