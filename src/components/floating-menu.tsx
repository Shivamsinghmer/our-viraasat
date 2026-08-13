import { useRouter } from "@tanstack/react-router";
import type { ClassValue } from "clsx";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ensureMotionCoreEase, registerPluginOnce } from "#/lib/gsap";
import { cn } from "#/lib/utils";

type MenuVariant = "default" | "muted";

interface MenuLink {
	/** The text to display for the link. */
	label: string;
	/** The URL the link points to. */
	href: string;
}

interface MenuButton {
	/** The text to display on the button. */
	label: string;
	/** The URL the button links to. */
	href: string;
}

export interface MenuGroup {
	/** The title of the menu group, displayed above the links. */
	title: string;
	/** Visual style variant. `muted` adds a background colour. */
	variant?: MenuVariant;
	/** Links to display within this group. */
	links: MenuLink[];
}

interface FloatingMenuClasses {
	root?: ClassValue;
	overlay?: ClassValue;
	header?: ClassValue;
	toggleButton?: ClassValue;
	toggleLine?: ClassValue;
	logo?: ClassValue;
	actions?: ClassValue;
	primaryButton?: ClassValue;
	secondaryButton?: ClassValue;
	menuWrapper?: ClassValue;
	grid?: ClassValue;
	group?: ClassValue;
	groupMuted?: ClassValue;
	groupTitle?: ClassValue;
	link?: ClassValue;
	linkText?: ClassValue;
	linkUnderline?: ClassValue;
	divider?: ClassValue;
}

export interface FloatingMenuProps {
	/** Groups of links to display in the menu. */
	menuGroups: MenuGroup[];
	/** Logo node rendered in the centre of the header. */
	logo?: ReactNode;
	/** Primary button in the header. */
	primaryButton?: MenuButton;
	/** Secondary button in the header. */
	secondaryButton?: MenuButton;
	/** Additional classes for the container. */
	className?: string;
	/** Additional classes for specific menu slots. */
	classes?: FloatingMenuClasses;
	/**
	 * Element or selector to portal the menu into.
	 * @default "body"
	 */
	portalTarget?: HTMLElement | string;
	/** Seconds to wait before the bar drops in. @default 0 */
	introDelay?: number;
}

export function FloatingMenu({
	menuGroups,
	logo,
	primaryButton,
	secondaryButton,
	className,
	classes,
	portalTarget = "body",
	introDelay = 0,
}: FloatingMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
	const router = useRouter();

	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const menuWrapperRef = useRef<HTMLDivElement>(null);
	const line1Ref = useRef<HTMLSpanElement>(null);
	const line2Ref = useRef<HTMLSpanElement>(null);
	const overlayRef = useRef<HTMLButtonElement>(null);

	// Content signature, so the setup effect re-runs when the links actually
	// change rather than every time the caller re-creates the array literal.
	const groupsKey = menuGroups
		.map(
			(group) =>
				`${group.title}:${group.variant ?? "default"}:${group.links
					.map((link) => `${link.href}|${link.label}`)
					.join(",")}`,
		)
		.join("~");

	useEffect(() => {
		const node =
			typeof portalTarget === "string"
				? document.querySelector<HTMLElement>(portalTarget)
				: portalTarget;
		setPortalNode(node ?? document.body);
	}, [portalTarget]);

	useEffect(() => {
		if (!portalNode || !groupsKey) return;

		const container = containerRef.current;
		const overlay = overlayRef.current;
		const menuWrapper = menuWrapperRef.current;
		const line1 = line1Ref.current;
		const line2 = line2Ref.current;
		if (!container || !overlay || !menuWrapper || !line1 || !line2) return;

		registerPluginOnce(SplitText);
		const ease = ensureMotionCoreEase();

		let cancelled = false;
		let splits: SplitText[] = [];
		let ctx: gsap.Context | null = null;

		const init = async () => {
			// Splitting before webfonts settle would measure the fallback face and
			// leave the lines masked at the wrong height.
			await document.fonts.ready;
			if (cancelled) return;

			const width = window.innerWidth;
			const isMobile = width < 768;
			const isTablet = width >= 768 && width < 1024;

			let maxWidthOpen = "75%";
			let maxWidthInitial = "50%";

			if (isMobile) {
				maxWidthOpen = "100%";
				maxWidthInitial = "95%";
			} else if (isTablet) {
				maxWidthOpen = "85%";
				maxWidthInitial = "70%";
			}

			ctx = gsap.context(() => {
				gsap.set(overlay, { autoAlpha: 0 });
				gsap.set(container, { maxWidth: maxWidthInitial });
				gsap.set(menuWrapper, { height: 0, autoAlpha: 0 });

				const linkElements = gsap.utils.toArray<HTMLElement>(
					'[data-slot="link-text"]',
					menuWrapper,
				);

				splits = linkElements.map((el) =>
					SplitText.create(el, { type: "lines", mask: "lines" }),
				);
				const allLines = splits.flatMap((split) => split.lines);

				const tl = gsap.timeline({
					paused: true,
					defaults: { ease, duration: 0.5 },
				});

				tl.to(
					container,
					{
						maxWidth: maxWidthOpen,
						...(isMobile
							? {
									top: 0,
									paddingTop: "0.5rem",
									borderTopLeftRadius: 0,
									borderTopRightRadius: 0,
								}
							: {}),
					},
					0,
				)
					.to(overlay, { autoAlpha: 1 }, 0)
					.to(menuWrapper, { height: "auto", autoAlpha: 1 }, 0.2)
					.to([line1, line2], { y: 0, duration: 0.4 }, 0.2)
					.to(line1, { rotation: 45, duration: 0.4 }, 0.2)
					.to(line2, { rotation: -45, duration: 0.4 }, 0.2);

				if (allLines.length) {
					tl.from(
						allLines,
						{
							yPercent: 100,
							autoAlpha: 0,
							stagger: 0.02,
						},
						0.3,
					);
				}

				timelineRef.current = tl;

				// Entrance. `xPercent: -50` carries the horizontal centring, because
				// GSAP writes `translate: none` when it takes over an element's
				// transform, which would otherwise cancel `-translate-x-1/2`.
				gsap.fromTo(
					container,
					{ xPercent: -50, yPercent: -160, autoAlpha: 0 },
					{
						xPercent: -50,
						yPercent: 0,
						autoAlpha: 1,
						duration: 0.9,
						delay: introDelay,
						ease,
					},
				);
			}, container);
		};

		init();

		return () => {
			cancelled = true;
			ctx?.revert();
			ctx = null;
			timelineRef.current = null;
			for (const split of splits) split.revert();
		};
	}, [groupsKey, portalNode, introDelay]);

	// Links now navigate client-side rather than reloading the page, so the menu
	// has to dismiss itself — a full page load used to do that for free.
	useEffect(() => {
		if (!isOpen) return;
		return router.subscribe("onBeforeNavigate", () => {
			setIsOpen(false);
			timelineRef.current?.reverse();
		});
	}, [router, isOpen]);

	// The overlay in the original is a div with a keydown handler, which never
	// fires because it is not focusable — listen on the document instead.
	useEffect(() => {
		if (!isOpen) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			event.preventDefault();
			setIsOpen(false);
			timelineRef.current?.reverse();
		};

		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [isOpen]);

	const toggle = () => {
		const tl = timelineRef.current;
		if (!tl) return;

		const next = !isOpen;
		setIsOpen(next);
		if (next) {
			tl.play();
		} else {
			tl.reverse();
		}
	};

	const menu = (
		<>
			<button
				ref={overlayRef}
				type="button"
				data-slot="overlay"
				data-open={isOpen}
				onClick={toggle}
				aria-label="Close menu"
				tabIndex={-1}
				className={cn(
					"pointer-events-none fixed inset-0 z-40 bg-accent/50 opacity-0 data-[open=true]:pointer-events-auto",
					classes?.overlay,
				)}
			/>

			<div
				ref={containerRef}
				data-slot="root"
				className={cn(
					// No `-translate-x-1/2` here: GSAP folds an existing translate into
					// its own `x` in pixels before taking the transform over, so the
					// class and `xPercent: -50` would stack and double-centre the bar.
					// The entrance tween is the single source of horizontal centring,
					// and `opacity-0` hides the element until it runs.
					"fixed top-2 left-1/2 z-50 w-full max-w-[95vw] rounded-md border border-border bg-background text-foreground opacity-0 shadow-md md:top-4 md:max-w-[70vw] lg:max-w-[50vw]",
					className,
					classes?.root,
				)}
			>
				<div
					data-slot="header"
					className={cn(
						"relative z-20 flex w-full items-center justify-between p-1",
						classes?.header,
					)}
				>
					<button
						type="button"
						onClick={toggle}
						data-slot="toggle-button"
						aria-label="Toggle menu"
						aria-expanded={isOpen}
						className={cn(
							`group relative flex h-10 items-center justify-center rounded-sm pr-2 transition-[background-color] duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] hover:bg-muted`,
							classes?.toggleButton,
						)}
					>
						<div className="relative flex h-10 w-10 items-center justify-center">
							<span
								ref={line1Ref}
								data-slot="toggle-line"
								style={{ transform: "translateY(4px)" }}
								className={cn(
									`absolute h-px w-6 bg-foreground transition-[background-color] duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:bg-primary`,
									classes?.toggleLine,
								)}
							/>
							<span
								ref={line2Ref}
								data-slot="toggle-line"
								style={{ transform: "translateY(-4px)" }}
								className={cn(
									`absolute h-px w-6 bg-foreground transition-[background-color] duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:bg-primary`,
									classes?.toggleLine,
								)}
							/>
						</div>
						<span
							className={`ml-1 text-sm font-medium text-foreground transition-[color] duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:text-primary`}
						>
							Menu
						</span>
					</button>

					<div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu"
						style={{ backfaceVisibility: "hidden" }}
					>
						{logo ? (
							<div
								data-slot="logo"
								className={cn("flex items-center gap-3", classes?.logo)}
							>
								{logo}
							</div>
						) : null}
					</div>

					<div
						data-slot="actions"
						className={cn("flex items-center gap-1", classes?.actions)}
					>
						{secondaryButton ? (
							<a
								href={secondaryButton.href}
								data-slot="secondary-button"
								className={cn(
									`hidden h-10 items-center justify-center rounded-sm px-4 text-sm font-medium text-foreground transition-[background-color,color] duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] hover:bg-muted hover:text-foreground md:flex`,
									classes?.secondaryButton,
								)}
							>
								{secondaryButton.label}
							</a>
						) : null}
						{primaryButton ? (
							<a
								href={primaryButton.href}
								data-slot="primary-button"
								className={cn(
									`flex h-10 items-center justify-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground transition-[background-color] duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] hover:bg-primary/90`,
									classes?.primaryButton,
								)}
							>
								{primaryButton.label}
							</a>
						) : null}
					</div>
				</div>

				<div
					ref={menuWrapperRef}
					data-slot="menu-wrapper"
					className={cn(
						"h-0 w-full overflow-hidden border-t border-border opacity-0",
						classes?.menuWrapper,
					)}
				>
					<div
						data-slot="grid"
						// The panel scrolls on its own; Lenis must not steal its wheel.
						data-lenis-prevent
						className={cn(
							"grid max-h-[65vh] grid-cols-1 gap-4 overflow-y-auto overscroll-contain p-4 md:max-h-none md:grid-cols-3 md:overflow-visible",
							classes?.grid,
						)}
					>
						{menuGroups.map((group) => (
							<div
								key={group.title}
								data-slot="group"
								className={cn(
									`flex flex-col gap-4 rounded-sm p-4 transition-colors ease-[cubic-bezier(0.625,0.05,0,1)]`,
									group.variant === "muted" ? "bg-muted" : "bg-transparent",
									classes?.group,
									group.variant === "muted" && classes?.groupMuted,
								)}
							>
								<h3
									data-slot="group-title"
									className={cn(
										"font-mono text-xs font-medium tracking-wider text-muted-foreground/50 uppercase",
										classes?.groupTitle,
									)}
								>
									{group.title}
								</h3>
								<div className="mt-4 flex flex-col gap-4">
									{group.links.map((link, i) => (
										<div key={`${link.href}|${link.label}`}>
											<a
												href={link.href}
												data-slot="link"
												className={cn(
													`group/link relative block w-fit text-2xl font-normal text-muted-foreground transition-colors duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] hover:text-foreground`,
													classes?.link,
												)}
											>
												<span className="relative z-10 block leading-tight">
													<span
														data-slot="link-text"
														className={cn(
															"menu-link-text block whitespace-nowrap",
															classes?.linkText,
														)}
													>
														{link.label}
													</span>
												</span>
												<span
													data-slot="link-underline"
													className={cn(
														`absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-foreground transition-transform duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover/link:origin-left group-hover/link:scale-x-100`,
														classes?.linkUnderline,
													)}
												/>
											</a>
											{i < group.links.length - 1 ? (
												<hr
													data-slot="divider"
													className={cn("mt-4 border-border", classes?.divider)}
												/>
											) : null}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);

	return portalNode ? createPortal(menu, portalNode) : null;
}
