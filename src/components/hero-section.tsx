import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { Fake3DImage } from "#/components/fake-3d-image";
import { TypedHeading } from "#/components/typed-heading";
import { UNESCO_SITE_COUNT } from "#/lib/heritage";
import { isIntroDone, onIntroDone } from "#/lib/intro";
import {
	featuredMonuments,
	heroImageIndex,
	siteImages,
} from "#/lib/site-images";

export function HeroSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const copyRef = useRef<HTMLDivElement>(null);

	// Starts on the image the preloader ended on, then cycles.
	const [index, setIndex] = useState(heroImageIndex);
	// Where the last click landed, so the ripple starts under the cursor.
	const [rippleOrigin, setRippleOrigin] = useState({ x: 0.5, y: 0.5 });
	// Read synchronously at mount, not just subscribed to. The root shell's
	// effects run before the route's, so on a returning visit the intro is
	// already over by the time this mounts and there is no event left to catch.
	const [introDone, setIntroDone] = useState(isIntroDone);
	const image = siteImages[index];
	const monument = featuredMonuments[index];

	const showNextImage = (event: React.MouseEvent<HTMLButtonElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		setRippleOrigin({
			x: (event.clientX - rect.left) / rect.width,
			y: (event.clientY - rect.top) / rect.height,
		});
		setIndex((current) => (current + 1) % siteImages.length);
	};

	useEffect(() => {
		if (introDone) return;
		return onIntroDone(() => setIntroDone(true));
	}, [introDone]);

	// Warm the next frame.
	//
	// Clicking swaps the caption instantly — it is just text — but the WebGL
	// layer decodes a fresh full-size photograph before it can transition, so an
	// uncached click stalled for seconds with nothing moving. The intro used to
	// happen to warm these; it now loads 480px strip frames instead, so the
	// cache has to be warmed deliberately.
	//
	// One frame ahead rather than all five: it covers clicking through in order
	// without pulling megabytes nobody asked for.
	useEffect(() => {
		if (!introDone) return;
		if (
			(navigator as Navigator & { connection?: { saveData?: boolean } })
				.connection?.saveData
		) {
			return;
		}

		const next = siteImages[(index + 1) % siteImages.length];
		const warm = new Image();
		warm.decoding = "async";
		warm.src = next.src;
	}, [index, introDone]);

	// Hold the hero copy until the curtain lifts, then bring it up in sequence.
	// Keyed off state rather than a one-shot listener: if the reveal is ever
	// missed the copy must not be left stranded at opacity 0.
	useEffect(() => {
		const root = copyRef.current;
		if (!root) return;

		const items = root.querySelectorAll("[data-hero-item]");
		if (!items.length) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			gsap.set(items, { autoAlpha: 1, y: 0 });
			return;
		}

		if (!introDone) {
			gsap.set(items, { autoAlpha: 0, y: 26 });
			return;
		}

		const tween = gsap.to(items, {
			autoAlpha: 1,
			y: 0,
			duration: 0.9,
			stagger: 0.12,
			ease: "power3.out",
			// lets the heading's own reveal get moving first
			delay: 0.2,
		});
		return () => {
			tween.kill();
		};
	}, [introDone]);

	return (
		<section
			ref={sectionRef}
			className="relative flex min-h-dvh w-full items-end overflow-hidden"
		>
			{/*
			 * Matches the preloader's final frame exactly: same image, same
			 * `object-cover` at the same viewport size. When the preloader
			 * unmounts this is already sitting underneath it, so the hand-off
			 * reads as the image simply staying put.
			 */}
			<img
				src={image.src}
				alt={image.alt ?? ""}
				className="absolute inset-0 h-full w-full object-cover"
			/>
			{/*
			 * Layered over the <img> rather than replacing it: the WebGL canvas
			 * starts transparent, so the image above stays visible until the
			 * texture decodes and covers it exactly — and remains the fallback
			 * if WebGL is unavailable.
			 */}
			<Fake3DImage
				colorSrc={image.src}
				depthSrc="/images/photos/hero-depth.png"
				transitionOrigin={rippleOrigin}
				className="absolute inset-0"
			/>
			{/* Fades to fully transparent by 45% up, so the photograph itself is
			    clean — the old scrim carried black/40 all the way to the top, which
			    greyed the whole image. Legibility below is carried by this bottom
			    fade plus the text shadow, not by washing the picture. */}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 via-25% to-transparent to-45%" />

			{/* A real button rather than a click handler on the section, so the
				    interaction is keyboard reachable and announced. */}
			<button
				type="button"
				onClick={showNextImage}
				aria-label="Show next image"
				className="absolute inset-0 z-10"
			/>

			<div
				ref={copyRef}
				className="pointer-events-none relative z-20 w-full p-8 pb-16 md:p-16"
			>
				<p
					data-hero-item
					className="text-over-image font-mono text-xs tracking-[0.2em] text-white/80 uppercase"
				>
					{UNESCO_SITE_COUNT} World Heritage sites
				</p>
				<TypedHeading
					as="h1"
					start="intro"
					className="typer-on-image text-over-image mt-4 max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl"
				>
					A nation written in stone
				</TypedHeading>
				<p
					data-hero-item
					className="text-over-image mt-4 max-w-xl text-lg text-white/90"
				>
					Nine centuries of building, carving and painting — held in the places
					that outlived the empires that raised them.
				</p>

				{/* Caption the frame that is actually showing, so the image is
				    identified rather than decorative. */}
				<div data-hero-item className="mt-10 border-t border-white/25 pt-4">
					{/* Stacked on mobile so the monument name gets the full column.
					    Sharing the row with the counter left it about 100px wide, which
					    wrapped every name onto three lines. */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
						{/* The hero is bottom-anchored, so anything that changes this
						    block's height pushes the headline above it up or down — the
						    names vary from one line to three and moved it by 76px. The
						    reserved height keeps every frame in the same place. */}
						<div className="min-h-[6rem] min-w-0 sm:min-h-0">
							<p className="text-over-image text-lg font-semibold text-white">
								{monument.name}
							</p>
							<p className="text-over-image text-sm text-white/80">
								{monument.place} · {monument.period}
							</p>
						</div>
						<p className="text-over-image font-mono text-xs text-white/75 sm:shrink-0">
							{String(index + 1).padStart(2, "0")} /{" "}
							{String(siteImages.length).padStart(2, "0")} · click to advance
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
