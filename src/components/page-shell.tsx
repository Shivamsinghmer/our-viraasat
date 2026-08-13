import type { ReactNode } from "react";
import { Reveal } from "#/components/reveal";
import { TypedHeading } from "#/components/typed-heading";

interface PageShellProps {
	eyebrow: string;
	title: string;
	lede: string;
	children: ReactNode;
}

/**
 * Shared frame for the inner routes. The generous top padding clears the
 * floating nav, which is fixed and would otherwise sit on the heading.
 */
export function PageShell({ eyebrow, title, lede, children }: PageShellProps) {
	return (
		<main className="mx-auto w-full max-w-6xl px-6 pt-32 pb-24 md:px-10 md:pt-44">
			<Reveal>
				<header className="max-w-3xl">
					<p className="font-mono text-xs tracking-[0.2em] text-secondary uppercase">
						{eyebrow}
					</p>
					<TypedHeading
						as="h1"
						className="mt-4 text-4xl font-bold tracking-tight text-balance md:text-6xl"
					>
						{title}
					</TypedHeading>
					<p className="mt-6 text-lg text-muted-foreground text-pretty">
						{lede}
					</p>
				</header>
			</Reveal>

			<div className="mt-16 md:mt-24">{children}</div>
		</main>
	);
}
