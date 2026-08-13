import { createFileRoute, notFound } from "@tanstack/react-router";
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
import { galleryFor, heroFor } from "#/lib/gallery";
import { allMonuments } from "#/lib/heritage";

export const Route = createFileRoute("/monuments/$slug")({
	component: MonumentDetail,
	loader: ({ params }) => {
		const monument = allMonuments.find((m) => m.slug === params.slug);
		if (!monument) throw notFound();
		return { monument };
	},
});

const categoryLabel = {
	cultural: "Cultural",
	natural: "Natural",
	mixed: "Mixed",
} as const;

function MonumentDetail() {
	const { monument } = Route.useLoaderData();
	const index = allMonuments.findIndex((m) => m.slug === monument.slug);
	const prev = index > 0 ? allMonuments[index - 1] : null;
	const next = index < allMonuments.length - 1 ? allMonuments[index + 1] : null;

	// Both come from the credits file, so they can only ever point at images
	// that actually downloaded. The lead frame is dropped from the grid so it
	// is not shown twice.
	const hero = heroFor(monument.slug);
	const rest = galleryFor(monument.slug).filter((i) => i.file !== hero?.file);

	return (
		<DetailPage backTo="/monuments" backLabel="All monuments">
			<article>
				<DetailHeader
					title={monument.name}
					subtitle={monument.place}
					meta={[
						{
							label: monument.inscribed ? "Inscribed" : "Status",
							value: monument.inscribed
								? String(monument.inscribed)
								: "Tentative list",
						},
						{ label: "Period", value: monument.period },
						{
							label: "Property",
							value: categoryLabel[monument.category ?? "cultural"],
						},
					]}
				/>

				<DetailHero image={hero} alt={monument.alt} />

				{/* The description was previously an "About" section identical in
				    weight to the five that followed. As a standfirst it gives the
				    page an entry point. */}
				<DetailLead>{monument.description}</DetailLead>

				<DetailColumns
					rail={
						<>
							<RailPanel title="Quick facts">
								<FactList facts={monument.keyFacts} />
							</RailPanel>
							<RailPanel title="Visiting">
								<p className="text-sm leading-relaxed text-pretty text-muted-foreground">
									{monument.visitorInfo}
								</p>
							</RailPanel>
						</>
					}
				>
					<DetailSection title="History">{monument.history}</DetailSection>

					{monument.architecture && (
						<DetailSection title="Architecture">
							{monument.architecture}
						</DetailSection>
					)}

					{monument.landscape && (
						<DetailSection title="Landscape and wildlife">
							{monument.landscape}
						</DetailSection>
					)}

					<DetailSection title="Significance">
						{monument.significance}
					</DetailSection>

					<DetailSection title="UNESCO recognition">
						{monument.unescoCriteria}
					</DetailSection>
				</DetailColumns>

				{rest.length > 0 && (
					<DetailWide>
						<ImageGallery
							images={rest}
							subject={monument.name}
							heading="More views"
						/>
					</DetailWide>
				)}
			</article>

			<DetailPager
				prev={
					prev
						? { to: "/monuments/$slug", slug: prev.slug, name: prev.name }
						: null
				}
				next={
					next
						? { to: "/monuments/$slug", slug: next.slug, name: next.name }
						: null
				}
			/>
		</DetailPage>
	);
}
