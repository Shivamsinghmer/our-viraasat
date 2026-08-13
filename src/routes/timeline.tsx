import {
	createFileRoute,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { PageShell } from "#/components/page-shell";
import { Reveal } from "#/components/reveal";
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

function Timeline() {
	return (
		<PageShell
			eyebrow="Chronology"
			title="Four and a half thousand years"
			lede="A civilisation long enough that its own monuments become archaeology to the people who follow. What survives is uneven — cities without a readable script, mathematics without its monuments, temples without their painters' names."
		>
			<ol className="relative border-border border-l pl-8 md:pl-12">
				{timeline.map((era, i) => (
					<li key={era.slug} className="relative pb-14 last:pb-0">
						<Reveal delay={0.04 * i}>
							{/* Node on the spine. */}
							<span
								aria-hidden="true"
								className="-left-[41px] absolute top-2 size-3 rounded-full border-2 border-background bg-primary md:-left-[57px]"
							/>
							<Link
								to="/timeline/$slug"
								params={{ slug: era.slug }}
								className="group block no-underline"
							>
								<p className="font-mono text-xs tracking-[0.18em] text-secondary uppercase">
									{era.period}
								</p>
								<h2 className="mt-2 text-2xl font-bold tracking-tight transition-colors duration-300 group-hover:text-primary md:text-3xl">
									{era.title}
								</h2>
								<p className="mt-3 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
									{era.body}
								</p>
								<span className="mt-4 inline-flex items-center gap-2 font-medium text-primary">
									View Details
									<span
										aria-hidden="true"
										className="transition-transform duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:translate-x-1"
									>
										→
									</span>
								</span>
							</Link>
						</Reveal>
					</li>
				))}
			</ol>

			<Reveal>
				<aside className="mt-8 rounded-lg border border-border bg-muted p-8 md:p-12">
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
