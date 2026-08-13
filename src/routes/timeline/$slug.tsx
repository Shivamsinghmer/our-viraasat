import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
	DetailColumns,
	DetailHeader,
	DetailHero,
	DetailLead,
	DetailPage,
	DetailPager,
	DetailSection,
	DetailWide,
	FactList,
	RailPanel,
} from "#/components/detail-layout";
import { ImageGallery } from "#/components/image-gallery";
import { galleryFor, heroFor, smallFile } from "#/lib/gallery";
import { allMonuments, timeline } from "#/lib/heritage";

export const Route = createFileRoute("/timeline/$slug")({
	component: EraDetail,
	loader: ({ params }) => {
		const era = timeline.find((e) => e.slug === params.slug);
		if (!era) throw notFound();
		return { era };
	},
});

function EraDetail() {
	const { era } = Route.useLoaderData();
	const index = timeline.findIndex((e) => e.slug === era.slug);
	const prev = index > 0 ? timeline[index - 1] : null;
	const next = index < timeline.length - 1 ? timeline[index + 1] : null;

	// Era imagery lives under an `era-` prefixed credit slug.
	const imageSlug = `era-${era.slug}`;
	const heroImage = heroFor(imageSlug);
	const restImages = galleryFor(imageSlug).filter(
		(i) => i.file !== heroImage?.file,
	);

	// Only the places actually documented on this site, so a link never leads
	// to a page that does not exist.
	const related = era.relatedMonuments
		.map((slug) => allMonuments.find((m) => m.slug === slug))
		.filter((m) => m !== undefined);

	return (
		<DetailPage backTo="/timeline" backLabel="Full timeline">
			<article>
				<DetailHeader
					title={era.title}
					meta={[
						{ label: "Period", value: era.period },
						{
							label: "Era",
							value: `${String(index + 1).padStart(2, "0")} / ${timeline.length}`,
						},
					]}
				/>

				<DetailHero
					image={heroImage}
					alt={`${era.title} — surviving material`}
				/>

				<DetailLead>{era.body}</DetailLead>

				<DetailColumns
					rail={
						<>
							<RailPanel title="Key facts">
								<FactList facts={era.keyFacts} />
							</RailPanel>

							{related.length > 0 && (
								<RailPanel title="On this site">
									<ul className="flex flex-col gap-3">
										{related.map((monument) => (
											<li key={monument.slug}>
												<Link
													to="/monuments/$slug"
													params={{ slug: monument.slug }}
													className="group flex items-center gap-3 no-underline"
												>
													<img
														src={(() => {
															const f =
																heroFor(monument.slug)?.file ?? monument.image;
															return f ? smallFile(f) : undefined;
														})()}
														alt=""
														loading="lazy"
														decoding="async"
														className="size-10 shrink-0 rounded-sm border border-border object-cover"
													/>
													<span className="font-medium text-sm text-pretty text-foreground transition-colors group-hover:text-primary">
														{monument.name}
													</span>
												</Link>
											</li>
										))}
									</ul>
								</RailPanel>
							)}
						</>
					}
				>
					<DetailSection title="About">{era.description}</DetailSection>
					<DetailSection title="Context">{era.context}</DetailSection>
					<DetailSection title="What survives">
						{era.whatSurvives}
					</DetailSection>
					<DetailSection title="Significance">{era.significance}</DetailSection>
				</DetailColumns>

				{restImages.length > 0 && (
					<DetailWide>
						<ImageGallery
							images={restImages}
							subject={era.title}
							heading="Material from this period"
						/>
					</DetailWide>
				)}
			</article>

			<DetailPager
				prev={
					prev
						? { to: "/timeline/$slug", slug: prev.slug, name: prev.title }
						: null
				}
				next={
					next
						? { to: "/timeline/$slug", slug: next.slug, name: next.title }
						: null
				}
				prevLabel="Earlier"
				nextLabel="Later"
			/>
		</DetailPage>
	);
}
