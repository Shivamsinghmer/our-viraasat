import {
	animate,
	motion,
	type SpringOptions,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";
import type { CSSProperties, ReactNode, RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type ClassNames = {
	root?: string;
	cursor?: string;
	arrow?: string;
	label?: string;
	labelText?: string;
};

export interface UserCursorProps {
	// Visual / content
	name?: string;
	arrow?: ReactNode | ((color: string) => ReactNode);
	label?: ReactNode;
	color?: string;
	textColor?: string;
	size?: number;
	labelTiltStrength?: number;

	// Behaviour
	showLabel?: boolean;

	// Offsets
	offsetX?: number;
	offsetY?: number;
	labelOffsetUseDefault?: boolean;
	labelOffsetX?: number;
	labelOffsetY?: number;

	// Press feedback
	pressScale?: number;

	classNames?: ClassNames;
	style?: CSSProperties;

	/**
	 * Surface the cursor belongs to. Pointer events are read from it and the
	 * cursor shows only while the pointer is inside. The rendered layer is
	 * pointer-events:none, so it cannot listen for itself.
	 *
	 * Omit it to run site-wide: the layer goes `fixed` over the viewport and
	 * events are read from the document.
	 */
	target?: RefObject<HTMLElement | null>;
}

const DEFAULTS = {
	color: "#FFFFFF",
	size: 31,
	pressScale: 0.92,
	offsetX: 0,
	offsetY: 0,
	showLabel: true,
	name: "Indian",
	textColor: "#000000",
	labelTiltStrength: 8,
	labelOffsetUseDefault: true,
	labelOffsetX: 25,
	labelOffsetY: 12,
};

/**
 * A custom cursor follower. An arrow glyph tracks the pointer on a snappy
 * spring; a coloured label pill trails behind on a laggier one, rocking with
 * movement and scaling while pressed.
 *
 * Adapted from the Originkit component: the original renders a fixed 200x200
 * host and listens on itself, which only makes sense on a Framer canvas. Here
 * it is an inert overlay that reads events from `target`, so it can sit above
 * interactive content without swallowing clicks.
 */
export function UserCursor(props: UserCursorProps) {
	const {
		name = DEFAULTS.name,
		arrow,
		label,
		color = DEFAULTS.color,
		textColor = DEFAULTS.textColor,
		size = DEFAULTS.size,
		labelTiltStrength = DEFAULTS.labelTiltStrength,
		showLabel = DEFAULTS.showLabel,
		offsetX = DEFAULTS.offsetX,
		offsetY = DEFAULTS.offsetY,
		labelOffsetUseDefault = DEFAULTS.labelOffsetUseDefault,
		labelOffsetX = DEFAULTS.labelOffsetX,
		labelOffsetY = DEFAULTS.labelOffsetY,
		pressScale = DEFAULTS.pressScale,
		classNames,
		style,
		target,
	} = props;

	const layerRef = useRef<HTMLDivElement>(null);

	const [isTouchDevice, setIsTouchDevice] = useState(false);
	const [hovering, setHovering] = useState(false);
	const [pressed, setPressed] = useState(false);

	// Skip entirely on coarse pointers — there is no cursor to replace.
	useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;
		const mql = window.matchMedia("(pointer: coarse)");
		const sync = () => setIsTouchDevice(!!mql.matches);
		sync();
		mql.addEventListener("change", sync);
		return () => mql.removeEventListener("change", sync);
	}, []);

	// Arrow is snappier; the label trails.
	const arrowSpring = useMemo<SpringOptions>(
		() => ({ stiffness: 380, damping: 32, mass: 0.6 }),
		[],
	);
	const labelSpringCfg = useMemo<SpringOptions>(
		() => ({ stiffness: 220, damping: 26, mass: 0.7 }),
		[],
	);

	const resolvedLabelOffset = useMemo(() => {
		if (labelOffsetUseDefault) {
			return { x: size * 0.9, y: size * 0.2 + 6 };
		}
		return { x: labelOffsetX, y: labelOffsetY };
	}, [labelOffsetUseDefault, labelOffsetX, labelOffsetY, size]);

	// Off-screen until a real reading arrives, so springs don't sweep in from 0,0.
	const mouseX = useMotionValue(-9999);
	const mouseY = useMotionValue(-9999);

	const arrowX = useSpring(mouseX, arrowSpring);
	const arrowY = useSpring(mouseY, arrowSpring);
	const labelX = useSpring(mouseX, labelSpringCfg);
	const labelY = useSpring(mouseY, labelSpringCfg);

	const scaleMV = useMotionValue(1);
	useEffect(() => {
		const controls = animate(scaleMV, pressed ? pressScale : 1, {
			type: "spring",
			stiffness: 500,
			damping: 28,
			mass: 0.5,
		});
		return () => controls.stop();
	}, [pressed, pressScale, scaleMV]);

	// Tilt magnitude comes from speed, sign from horizontal direction, so the
	// pill rocks forward and back as the cursor reverses.
	const labelTiltTarget = useMotionValue(0);
	const labelRotation = useSpring(labelTiltTarget, {
		stiffness: 200,
		damping: 24,
		mass: 0.6,
	});

	const lastSampleRef = useRef<{ x: number; y: number; t: number } | null>(
		null,
	);

	useEffect(() => {
		if (isTouchDevice) return;
		const layer = layerRef.current;
		if (!layer) return;

		// No target means site-wide: read from the document and never hide on
		// leaving any particular element.
		const global = !target?.current;
		const surface: HTMLElement | Document = target?.current ?? document;

		// Hide the OS cursor by flagging the root, so a device where this component
		// bails out (coarse pointer) keeps its native cursor. It has to be a class
		// rather than an inline style: `cursor` inherits, but buttons and links set
		// their own `cursor: pointer`, which beats an inherited value. The rule in
		// styles.css carries `!important` to win against those.
		const root = document.documentElement;
		root.classList.add("has-custom-cursor");

		const onMove = (event: Event) => {
			const e = event as MouseEvent;
			// Layer and surface share a box, so either rect works; use the layer's
			// so the coordinate space always matches what we render into.
			const rect = layer.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			// In global mode the first movement is what reveals it.
			if (global) setHovering(true);

			const now = performance.now();
			const last = lastSampleRef.current;
			let vx = 0;
			let vy = 0;
			if (last) {
				const dt = Math.max(1, now - last.t);
				vx = ((x - last.x) / dt) * 1000;
				vy = ((y - last.y) / dt) * 1000;
			}
			lastSampleRef.current = { x, y, t: now };

			mouseX.set(x + offsetX);
			mouseY.set(y + offsetY);

			const speed = Math.hypot(vx, vy);
			const norm = Math.min(1, speed / 1500);
			const sign = vx === 0 ? 0 : vx > 0 ? 1 : -1;
			labelTiltTarget.set(sign * norm * labelTiltStrength);
		};

		const onDown = () => setPressed(true);
		const onUp = () => setPressed(false);
		const onEnter = () => setHovering(true);
		const onLeave = () => {
			setHovering(false);
			lastSampleRef.current = null;
			labelTiltTarget.set(0);
		};

		// `document` has no useful mouseenter/mouseleave, so in global mode the
		// hide signal is the pointer leaving the window entirely.
		const onWindowOut = (event: Event) => {
			if ((event as MouseEvent).relatedTarget === null) onLeave();
		};

		surface.addEventListener("mousemove", onMove);
		surface.addEventListener("mousedown", onDown);
		surface.addEventListener("mouseup", onUp);

		if (global) {
			document.addEventListener("mouseout", onWindowOut);
			window.addEventListener("blur", onLeave);
		} else {
			surface.addEventListener("mouseenter", onEnter);
			surface.addEventListener("mouseleave", onLeave);
		}

		return () => {
			root.classList.remove("has-custom-cursor");
			surface.removeEventListener("mousemove", onMove);
			surface.removeEventListener("mousedown", onDown);
			surface.removeEventListener("mouseup", onUp);
			document.removeEventListener("mouseout", onWindowOut);
			window.removeEventListener("blur", onLeave);
			surface.removeEventListener("mouseenter", onEnter);
			surface.removeEventListener("mouseleave", onLeave);
			setPressed(false);
		};
	}, [
		isTouchDevice,
		target,
		offsetX,
		offsetY,
		labelTiltStrength,
		mouseX,
		mouseY,
		labelTiltTarget,
	]);

	const labelTranslateX = useTransform(
		labelX,
		(v) => v + resolvedLabelOffset.x,
	);
	const labelTranslateY = useTransform(
		labelY,
		(v) => v + resolvedLabelOffset.y,
	);

	const arrowContent: ReactNode = useMemo(() => {
		if (typeof arrow === "function") {
			return (arrow as (c: string) => ReactNode)(color);
		}
		if (arrow !== undefined && arrow !== null) return arrow;
		return (
			<svg
				width={size}
				height={size}
				viewBox="0 0 28 28"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				style={{ display: "block", overflow: "visible" }}
			>
				<path
					d="M5 3 L23 14 L14 16 L11 24 Z"
					fill={color}
					stroke="rgba(0,0,0,0.18)"
					strokeWidth={0.6}
					strokeLinejoin="round"
				/>
			</svg>
		);
	}, [arrow, color, size]);

	const labelContent: ReactNode = useMemo(() => {
		if (label !== undefined && label !== null) return label;
		return (
			<div
				className={classNames?.labelText}
				style={{
					color: textColor,
					fontSize: Math.max(7, size * 0.43),
					lineHeight: 1.1,
					fontWeight: 600,
					whiteSpace: "nowrap",
					letterSpacing: 0.1,
				}}
			>
				{name}
			</div>
		);
	}, [label, name, textColor, size, classNames?.labelText]);

	if (isTouchDevice) return null;

	return (
		<div
			ref={layerRef}
			aria-hidden="true"
			className={classNames?.root}
			style={{
				// Fixed when running site-wide so the layer tracks the viewport
				// rather than a section box.
				position: target ? "absolute" : "fixed",
				inset: 0,
				zIndex: target ? undefined : 100,
				pointerEvents: "none",
				overflow: "hidden",
				...style,
			}}
		>
			{/* Label trails behind, rendered first so the arrow tip stays on top. */}
			{showLabel && (
				<motion.div
					className={classNames?.label}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						x: labelTranslateX,
						y: labelTranslateY,
						rotate: labelRotation,
						scale: scaleMV,
						background: color,
						borderRadius: 999,
						padding: `${size * 0.18}px ${size * 0.36}px`,
						boxShadow:
							"0 4px 12px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
						opacity: hovering ? 1 : 0,
						transformOrigin: "0% 50%",
						transition: "opacity 140ms ease",
						willChange: "transform, opacity",
						userSelect: "none",
						pointerEvents: "none",
					}}
				>
					{labelContent}
				</motion.div>
			)}

			<motion.div
				className={classNames?.cursor}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					x: arrowX,
					y: arrowY,
					scale: scaleMV,
					width: size,
					height: size,
					opacity: hovering ? 1 : 0,
					transformOrigin: "0% 0%",
					transition: "opacity 140ms ease",
					willChange: "transform, opacity",
					pointerEvents: "none",
				}}
			>
				<div
					className={classNames?.arrow}
					style={{ width: size, height: size }}
				>
					{arrowContent}
				</div>
			</motion.div>
		</div>
	);
}

export default UserCursor;
