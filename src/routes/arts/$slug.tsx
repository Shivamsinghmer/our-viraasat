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
import { galleryFor, heroFor } from "#/lib/gallery";
import { danceForms } from "#/lib/heritage";

export const Route = createFileRoute("/arts/$slug")({
	component: DanceFormDetail,
	loader: ({ params }) => {
		const form = danceForms.find((f) => f.slug === params.slug);
		if (!form) throw notFound();
		return { form };
	},
});

function DanceFormDetail() {
	const { form } = Route.useLoaderData();
	const index = danceForms.findIndex((f) => f.slug === form.slug);
	const prev = index > 0 ? danceForms[index - 1] : null;
	const next = index < danceForms.length - 1 ? danceForms[index + 1] : null;

	// Images for the arts live under an `art-` prefixed credit slug so they
	// cannot collide with a monument of the same name.
	const imageSlug = `art-${form.slug}`;
	const hero = heroFor(imageSlug);
	const rest = galleryFor(imageSlug).filter((i) => i.file !== hero?.file);

	return (
		<DetailPage backTo="/arts" backLabel="All classical arts">
			<article>
				<DetailHeader
					title={form.name}
					subtitle={form.origin}
					meta={[
						{ label: "State", value: form.state },
						{
							label: "Of eight",
							value: `${String(index + 1).padStart(2, "0")} / ${danceForms.length}`,
						},
					]}
				/>

				<DetailHero image={hero} alt={`${form.name} in performance`} />

				{/* Was a thick saffron left-border quote. Type carries the emphasis
				    instead — an accent stripe is decoration standing in for
				    hierarchy. */}
				<DetailLead>{form.note}</DetailLead>

				<DetailColumns
					rail={
						<>
							<RailPanel title="Quick facts">
								<FactList facts={form.keyFacts} />
							</RailPanel>
							<RailPanel title="The eight forms">
								<ul className="flex flex-col gap-2">
									{danceForms.map((other) => (
										<li key={other.slug}>
											<Link
												to="/arts/$slug"
												params={{ slug: other.slug }}
												aria-current={
													other.slug === form.slug ? "page" : undefined
												}
												className={`text-sm no-underline transition-colors ${
													other.slug === form.slug
														? "font-semibold text-foreground"
														: "text-muted-foreground hover:text-foreground"
												}`}
											>
												{other.name}
											</Link>
										</li>
									))}
								</ul>
							</RailPanel>
						</>
					}
				>
					<DetailSection title="About">{form.description}</DetailSection>
					<DetailSection title="History">{form.history}</DetailSection>
					<DetailSection title="Technique">{form.technique}</DetailSection>
					<DetailSection title="Repertoire">{form.repertoire}</DetailSection>
					<DetailSection title="Music and text">{form.music}</DetailSection>
					<DetailSection title="Significance">
						{form.significance}
					</DetailSection>
				</DetailColumns>

				{rest.length > 0 && (
					<DetailWide>
						<ImageGallery
							images={rest}
							subject={form.name}
							heading="In performance"
						/>
					</DetailWide>
				)}
			</article>

			<DetailPager
				prev={
					prev ? { to: "/arts/$slug", slug: prev.slug, name: prev.name } : null
				}
				next={
					next ? { to: "/arts/$slug", slug: next.slug, name: next.name } : null
				}
			/>
		</DetailPage>
	);
}
