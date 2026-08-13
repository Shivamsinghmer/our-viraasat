import {
	createFileRoute,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { PageShell } from "#/components/page-shell";
import { Reveal } from "#/components/reveal";
import { heroFor, smallFile, srcSetFor } from "#/lib/gallery";
import {
	allMonuments,
	type Monument,
	monuments,
	UNESCO_SITE_COUNT,
} from "#/lib/heritage";

export const Route = createFileRoute("/monuments")({
	component: MonumentsLayout,
});

function MonumentsLayout() {
	const router = useRouterState();
	const isChildRoute = router.location.pathname.startsWith("/monuments/");
	if (isChildRoute) {
		return <Outlet />;
	}

	return <MonumentsList />;
}

const categoryLabel = {
	cultural: "Cultural",
	natural: "Natural",
	mixed: "Mixed",
} as const;

/** A compact entry for the full list, where 45 full-width rows would not work. */
function SiteCard({ monument }: { monument: Monument }) {
	const hero = heroFor(monument.slug);

	return (
		<Link
			to="/monuments/$slug"
			params={{ slug: monument.slug }}
			className="group flex flex-col no-underline"
		>
			<figure className="overflow-hidden rounded-md border border-border bg-muted">
				{hero ? (
					// Displayed at ~220px. The 480px derivative covers that even on a
					// 2x screen; the 1200px original here is what made this page pull
					// 16 MB.
					<img
						src={smallFile(hero.file)}
						alt={monument.alt}
						loading="lazy"
						decoding="async"
						className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:scale-105"
					/>
				) : (
					// No photograph sourced yet. A labelled placeholder is honest;
					// a broken image element is not.
					<div className="flex aspect-[4/3] w-full items-center justify-center px-4 text-center">
						<span className="font-mono text-[11px] text-muted-foreground">
							Photograph not yet sourced
						</span>
					</div>
				)}
			</figure>
			<p className="mt-3 font-mono text-xs text-secondary">
				{monument.inscribed}
			</p>
			<h3 className="mt-1 font-semibold leading-snug text-balance transition-colors duration-300 group-hover:text-primary">
				{monument.name}
			</h3>
			<p className="mt-1 text-sm text-muted-foreground">{monument.place}</p>
		</Link>
	);
}

function MonumentsList() {
	const inscribed = allMonuments.filter((m) => m.inscribed !== null);
	const tentative = allMonuments.filter((m) => m.inscribed === null);

	// The original selection keeps the full-width treatment; everything else
	// goes into the complete list below, grouped by property type.
	const featured = monuments.filter((m) => m.inscribed !== null);
	const groups = (["cultural", "natural", "mixed"] as const).map((key) => ({
		key,
		label: categoryLabel[key],
		items: inscribed
			.filter((m) => (m.category ?? "cultural") === key)
			.sort((a, b) => (a.inscribed ?? 0) - (b.inscribed ?? 0)),
	}));

	return (
		<PageShell
			eyebrow="World Heritage"
			title="Forty-five places, one continuous argument"
			lede={`India holds ${UNESCO_SITE_COUNT} UNESCO World Heritage properties, and every one of them is documented here. A few are set out at length first — chosen because together they show the same impulse worked out in rock-cut basalt, in granite, in sandstone and in marble, across two thousand years.`}
		>
			<div className="flex flex-col gap-20 md:gap-28">
				{featured.map((monument, i) => (
					<Reveal key={monument.slug}>
						<Link
							to="/monuments/$slug"
							params={{ slug: monument.slug }}
							className={`group grid items-center gap-8 no-underline md:grid-cols-2 md:gap-14 ${
								i % 2 === 1 ? "md:[&>figure]:order-2" : ""
							}`}
						>
							<figure className="overflow-hidden rounded-lg border border-border shadow-md transition-shadow duration-500 group-hover:shadow-lg">
								<img
									src={heroFor(monument.slug)?.file ?? monument.image}
									srcSet={srcSetFor(
										heroFor(monument.slug)?.file ?? monument.image ?? "",
									)}
									sizes="(min-width: 768px) 45vw, 90vw"
									alt={monument.alt}
									loading="lazy"
									decoding="async"
									className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:scale-105"
								/>
							</figure>

							<div>
								<p className="font-mono text-xs tracking-[0.2em] text-secondary uppercase">
									Inscribed {monument.inscribed} · {monument.period}
								</p>
								<h2 className="mt-3 text-3xl font-bold tracking-tight text-balance transition-colors duration-300 group-hover:text-primary md:text-4xl">
									{monument.name}
								</h2>
								<p className="mt-2 text-sm text-muted-foreground">
									{monument.place}
								</p>
								<p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">
									{monument.blurb}
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
							</div>
						</Link>
					</Reveal>
				))}
			</div>

			<Reveal>
				<section className="mt-24 border-border border-t pt-12 md:mt-32">
					<p className="font-mono text-xs tracking-[0.2em] text-secondary uppercase">
						The complete list
					</p>
					<h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
						All {UNESCO_SITE_COUNT} World Heritage properties
					</h2>
					<p className="mt-4 max-w-2xl text-muted-foreground">
						Ordered by year of inscription within each category, from the first
						four in 1983 through to Sarnath in 2026.
					</p>

					{groups.map((group) => (
						<div key={group.key} className="mt-12">
							<h3 className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
								{group.label} · {group.items.length}
							</h3>
							<div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-8">
								{group.items.map((monument) => (
									<SiteCard key={monument.slug} monument={monument} />
								))}
							</div>
						</div>
					))}
				</section>
			</Reveal>

			{tentative.length > 0 && (
				<Reveal>
					<section className="mt-24 rounded-lg border border-border bg-muted p-8 md:mt-32 md:p-12">
						<p className="font-mono text-xs tracking-[0.2em] text-secondary uppercase">
							Tentative List
						</p>
						<h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
							Not yet inscribed
						</h2>
						<p className="mt-4 max-w-2xl text-muted-foreground">
							A place on the Tentative List is a formal candidacy, not a
							designation. These are listed separately here so the distinction
							stays honest.
						</p>

						<div className="mt-8 grid gap-8 md:grid-cols-2">
							{tentative.map((monument) => (
								<Link
									key={monument.slug}
									to="/monuments/$slug"
									params={{ slug: monument.slug }}
									className="group flex flex-col gap-4 no-underline"
								>
									<figure className="overflow-hidden rounded-md border border-border">
										<img
											src={heroFor(monument.slug)?.file ?? monument.image}
											srcSet={srcSetFor(
												heroFor(monument.slug)?.file ?? monument.image ?? "",
											)}
											sizes="(min-width: 768px) 45vw, 90vw"
											alt={monument.alt}
											loading="lazy"
											decoding="async"
											className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:scale-105"
										/>
									</figure>
									<div>
										<h3 className="text-xl font-semibold transition-colors duration-300 group-hover:text-primary">
											{monument.name}
										</h3>
										<p className="mt-1 text-sm text-muted-foreground">
											{monument.place} · {monument.period}
										</p>
										<p className="mt-3 text-pretty text-muted-foreground">
											{monument.blurb}
										</p>
										<span className="mt-3 inline-flex items-center gap-2 font-medium text-primary">
											View Details
											<span
												aria-hidden="true"
												className="transition-transform duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:translate-x-1"
											>
												→
											</span>
										</span>
									</div>
								</Link>
							))}
						</div>
					</section>
				</Reveal>
			)}
		</PageShell>
	);
}
