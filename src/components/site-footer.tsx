import { Link } from "@tanstack/react-router";
import { TricolourGradient } from "#/components/tricolour-gradient";
import { UNESCO_SITE_COUNT } from "#/lib/heritage";

const explore = [
	{ to: "/", label: "Home" },
	{ to: "/india", label: "About India" },
	{ to: "/monuments", label: "Monuments" },
	{ to: "/arts", label: "Classical Arts" },
	{ to: "/timeline", label: "Timeline" },
	{ to: "/credits", label: "Credits" },
] as const;

const reference = [
	{
		href: "https://whc.unesco.org/en/statesparties/in",
		label: "UNESCO World Heritage — India",
	},
	{
		href: "https://commons.wikimedia.org/wiki/Category:World_Heritage_Sites_in_India",
		label: "Wikimedia Commons",
	},
	{
		href: "https://www.unesco.org/en/articles/ancient-buddhist-site-sarnath-inscribed-unesco-world-heritage-list",
		label: "Sarnath inscription",
	},
];

/**
 * Closing block for every page. Dark on purpose: the tricolour glow needs a
 * dark stage or its white and saffron bands disappear into the page. The deep
 * bottom padding is deliberate too — it leaves the empty floor the gradient
 * unfurls into.
 */
export function SiteFooter() {
	return (
		<footer className="relative isolate overflow-hidden bg-accent text-white">
			{/* Definite height on purpose: the footer's own height is content-driven,
			    so a percentage here resolves against `auto` and collapses to zero.
			    Kept shorter than the content's bottom padding below, so the bright
			    white/saffron band of the gradient never sits behind the text. */}
			<div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[460px] md:h-[620px]">
				<TricolourGradient valley={0.66} />
			</div>

			<div className="mx-auto w-full max-w-6xl px-6 pt-20 pb-[400px] md:px-10 md:pt-28 md:pb-[520px]">
				<div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-16">
					<div>
						<p className="text-2xl font-bold tracking-tight">Virasat</p>
						<p className="mt-3 max-w-sm text-pretty text-white/70">
							India's built and living heritage — {UNESCO_SITE_COUNT} World
							Heritage properties, eight classical dance forms, and four and a
							half thousand years of record.
						</p>
					</div>

					<nav aria-label="Site">
						<h2 className="font-mono text-xs tracking-[0.18em] text-white/50 uppercase">
							Explore
						</h2>
						<ul className="mt-4 flex flex-col gap-2.5">
							{explore.map((item) => (
								<li key={item.to}>
									<Link
										to={item.to}
										className="text-white/85 no-underline transition-colors duration-300 hover:text-white"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<nav aria-label="Reference">
						<h2 className="font-mono text-xs tracking-[0.18em] text-white/50 uppercase">
							Reference
						</h2>
						<ul className="mt-4 flex flex-col gap-2.5">
							{reference.map((item) => (
								<li key={item.href}>
									<a
										href={item.href}
										target="_blank"
										rel="noreferrer"
										className="text-pretty text-white/85 underline-offset-4 transition-colors duration-300 hover:text-white"
									>
										{item.label}
									</a>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div className="mt-16 flex flex-col gap-3 border-t border-white/20 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
					<p>
						Built for the Thematic Website Development Competition 2026 —{" "}
						<span className="text-white/85">Code for the Nation</span>.
					</p>
					<p>
						Photography from Wikimedia Commons under CC licences.{" "}
						<Link
							to="/credits"
							className="text-white/85 underline underline-offset-4"
						>
							Full attribution
						</Link>
						.
					</p>
				</div>
			</div>
		</footer>
	);
}
