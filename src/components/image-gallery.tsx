import { useCallback, useEffect, useState } from "react";
import { type GalleryImage, smallFile } from "#/lib/gallery";

interface ImageGalleryProps {
	images: GalleryImage[];
	/** Subject name, used to build alt text for each frame. */
	subject: string;
	heading?: string;
}

/**
 * A grid of self-hosted photographs with a lightbox.
 *
 * Deliberately not a native <dialog>: showModal() promotes the element to the
 * browser's top layer, which sits above every z-index on the page — including
 * the custom cursor at z-100. Since the site hides the OS pointer, a top-layer
 * overlay would leave no visible cursor at all. A plain fixed overlay below
 * z-100 keeps the site's own cursor drawn over it.
 */
export function ImageGallery({
	images,
	subject,
	heading = "Gallery",
}: ImageGalleryProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const close = useCallback(() => setOpenIndex(null), []);
	const step = useCallback(
		(delta: number) =>
			setOpenIndex((current) =>
				current === null
					? null
					: (current + delta + images.length) % images.length,
			),
		[images.length],
	);

	// Esc to close and arrows to page, matching what a lightbox is expected to
	// do. Bound on the document because focus sits on the overlay's own button.
	useEffect(() => {
		if (openIndex === null) return;

		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") close();
			if (event.key === "ArrowRight") step(1);
			if (event.key === "ArrowLeft") step(-1);
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		document.addEventListener("keydown", onKey);

		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = previousOverflow;
		};
	}, [openIndex, close, step]);

	if (!images.length) return null;

	const active = openIndex === null ? null : images[openIndex];

	return (
		<section>
			<div className="flex items-baseline justify-between gap-4">
				{/* Matches DetailSection's h2 step — the gallery is a peer of the
				    body sections, not a subordinate of them. */}
				<h2 className="text-[clamp(1.5rem,1.35rem+0.7vw,1.875rem)] font-bold tracking-tight">
					{heading}
				</h2>
				<p className="font-mono text-xs text-muted-foreground">
					{images.length} {images.length === 1 ? "image" : "images"}
				</p>
			</div>

			<ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
				{images.map((image, i) => (
					<li key={image.file}>
						<button
							type="button"
							onClick={() => setOpenIndex(i)}
							className="group block w-full cursor-pointer text-left"
							aria-label={`View larger image ${i + 1} of ${images.length} — ${subject}`}
						>
							<span className="block overflow-hidden rounded-md border border-border">
								{/* Tiles are ~200px; the full-size file is only fetched when
								    the lightbox opens. */}
								<img
									src={smallFile(image.file)}
									alt={`${subject}, view ${i + 1}`}
									loading="lazy"
									decoding="async"
									className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:scale-105"
								/>
							</span>
							<span className="mt-2 block font-mono text-[11px] leading-snug text-muted-foreground">
								{image.author} · {image.license}
							</span>
						</button>
					</li>
				))}
			</ul>

			{active !== null && openIndex !== null && (
				<div
					className="fixed inset-0 z-80 flex flex-col bg-accent/95 p-4 md:p-8"
					role="dialog"
					aria-modal="true"
					aria-label={`${subject} — image ${openIndex + 1} of ${images.length}`}
				>
					{/* Full-bleed backdrop button so a click anywhere outside the figure
					    closes, without wrapping the figure itself in a button. */}
					<button
						type="button"
						onClick={close}
						aria-label="Close image viewer"
						className="absolute inset-0 cursor-pointer"
					/>

					<div className="pointer-events-none relative flex min-h-0 flex-1 flex-col">
						<figure className="flex min-h-0 flex-1 items-center justify-center">
							<img
								src={active.file}
								alt={`${subject}, view ${openIndex + 1}`}
								className="max-h-full max-w-full rounded-md object-contain"
							/>
						</figure>

						<figcaption className="pointer-events-auto mx-auto mt-4 flex max-w-3xl flex-col gap-2 text-center text-white">
							<p className="text-sm">
								{subject} — {openIndex + 1} of {images.length}
							</p>
							<p className="font-mono text-xs text-white/70">
								{active.author} · {active.license} ·{" "}
								<a
									href={active.commons}
									target="_blank"
									rel="noreferrer"
									className="text-white underline underline-offset-4"
								>
									Wikimedia Commons
								</a>
							</p>
						</figcaption>
					</div>

					<div className="pointer-events-none relative mt-4 flex items-center justify-center gap-3">
						<button
							type="button"
							onClick={() => step(-1)}
							className="pointer-events-auto min-h-11 cursor-pointer rounded-sm bg-white/10 px-4 text-sm text-white transition-colors hover:bg-white/20"
						>
							← Previous
						</button>
						{/* Navy on saffron rather than white: white on this saffron
						    measures 2.13:1, which is unreadable at button size. */}
						<button
							type="button"
							onClick={close}
							className="pointer-events-auto min-h-11 cursor-pointer rounded-sm bg-primary px-4 text-sm font-medium text-accent transition-colors hover:bg-primary/90"
						>
							Close
						</button>
						<button
							type="button"
							onClick={() => step(1)}
							className="pointer-events-auto min-h-11 cursor-pointer rounded-sm bg-white/10 px-4 text-sm text-white transition-colors hover:bg-white/20"
						>
							Next →
						</button>
					</div>
				</div>
			)}
		</section>
	);
}
