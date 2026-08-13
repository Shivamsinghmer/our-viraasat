import { gsap } from "gsap";
import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useRef } from "react";
import { cn } from "#/lib/utils";

export interface PreloaderImage {
	src: string;
	alt?: string;
}

export interface PreloaderProps
	extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
	/** Images to preload/display during the sequence. */
	images: PreloaderImage[];
	/** Fired once the preloading animation finishes. */
	onComplete?: () => void;
}

export function Preloader({
	images,
	className,
	onComplete,
	...restProps
}: PreloaderProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const revealImagesRef = useRef<HTMLDivElement[]>([]);
	const scaleUpRef = useRef<HTMLDivElement[]>([]);
	const secondLoopImagesRef = useRef<HTMLImageElement[]>([]);

	// Kept in a ref so the timeline always calls the latest callback without
	// re-running (and restarting) the animation effect.
	const onCompleteRef = useRef(onComplete);
	useEffect(() => {
		onCompleteRef.current = onComplete;
	}, [onComplete]);

	const attachRevealImage =
		(index: number) => (node: HTMLDivElement | null) => {
			if (node) revealImagesRef.current[index] = node;
		};

	const attachScaleUp = (index: number) => (node: HTMLDivElement | null) => {
		if (node) scaleUpRef.current[index] = node;
	};

	const attachSecondLoopImage =
		(index: number) => (node: HTMLImageElement | null) => {
			if (node) secondLoopImagesRef.current[index] = node;
		};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const middleIndex = Math.floor(images.length / 2);
		const radiusTarget = scaleUpRef.current[images.length + middleIndex];
		const scaleDownTargets = secondLoopImagesRef.current.filter(
			(node, i) => node && i !== middleIndex,
		);
		const revealTargets = revealImagesRef.current.filter(Boolean);
		const scaleUpTargets = scaleUpRef.current.filter(Boolean);

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				defaults: {
					ease: "expo.inOut",
				},
				onComplete: () => {
					onCompleteRef.current?.();
					container.style.display = "none";
				},
			});

			if (revealTargets.length) {
				tl.fromTo(
					revealTargets,
					{
						xPercent: 500,
					},
					{
						xPercent: -500,
						duration: 2.5,
						stagger: 0.05,
					},
				);
			}

			tl.add("scalePhase", "-=0.1");

			if (scaleDownTargets.length) {
				tl.to(
					scaleDownTargets,
					{
						scale: 0.5,
						duration: 2,
						stagger: {
							each: 0.05,
							from: "edges",
							ease: "none",
						},
						onComplete: () => {
							if (radiusTarget) {
								radiusTarget.style.borderRadius = "0";
							}
						},
					},
					"scalePhase",
				);
			}

			if (scaleUpTargets.length) {
				tl.fromTo(
					scaleUpTargets,
					{
						width: "10em",
						height: "10em",
					},
					{
						width: "100vw",
						height: "100dvh",
						duration: 2,
					},
					"scalePhase",
				);
			}

			// Only the STRIP ships with `opacity-0`, not the container — the
			// container's background has to cover the page from the very first
			// paint, or the hero shows through before this fades in.
			//
			// GSAP defers a timeline's from-states to its first tick, so seek to 0
			// to commit them synchronously; without this there is a frame where the
			// strip is visible but un-positioned.
			tl.pause(0);
			if (stageRef.current) gsap.set(stageRef.current, { opacity: 1 });
			tl.play();
		}, container);

		return () => {
			ctx.revert();
		};
	}, [images.length]);

	return (
		<div
			ref={containerRef}
			className={cn(
				"fixed inset-0 z-999 flex items-center justify-center overflow-hidden",
				className,
			)}
			{...restProps}
		>
			<div
				ref={stageRef}
				className="relative flex items-center justify-center opacity-0"
				style={{
					maskImage:
						"linear-gradient(to right, transparent, black 5em, black calc(100% - 5em), transparent)",
					WebkitMaskImage:
						"linear-gradient(to right, transparent, black 5em, black calc(100% - 5em), transparent)",
				}}
			>
				<div className="relative overflow-hidden">
					<div className="absolute flex items-center justify-center rounded-[0.5em]">
						{images.map((image, i) => (
							<div
								key={image.src}
								ref={attachRevealImage(i)}
								className="relative px-[1em]"
							>
								<div
									ref={attachScaleUp(i)}
									className="relative flex h-[10em] w-[10em] items-center justify-center rounded-[0.5em]"
								>
									<img
										loading="eager"
										src={image.src}
										alt={image.alt ?? ""}
										className="absolute h-full w-full rounded-[inherit] object-cover"
									/>
								</div>
							</div>
						))}
					</div>

					<div className="relative left-full flex items-center justify-center rounded-[0.5em]">
						{images.map((image, i) => {
							const isMiddle = i === Math.floor(images.length / 2);

							return (
								<div
									key={image.src}
									ref={attachRevealImage(images.length + i)}
									className="relative px-[1em]"
								>
									<div
										ref={attachScaleUp(images.length + i)}
										style={
											isMiddle
												? {
														transition:
															"border-radius 0.5s cubic-bezier(1, 0, 0, 1)",
													}
												: undefined
										}
										className={cn(
											"relative flex h-[10em] w-[10em] items-center justify-center rounded-[0.5em]",
											isMiddle && "is--radius will-change-transform",
										)}
									>
										<img
											ref={attachSecondLoopImage(i)}
											loading="eager"
											src={image.src}
											alt={image.alt ?? ""}
											className={cn(
												"absolute h-full w-full rounded-[inherit] object-cover",
												!isMiddle && "will-change-transform",
											)}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
