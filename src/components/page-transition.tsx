import { useRouter } from "@tanstack/react-router";
import { gsap } from "gsap";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import { onIntroDone } from "#/lib/intro";

/**
 * A shader-driven band that sweeps across the viewport on route change, with a
 * gaussian falloff at its edges and the new page appearing behind it as it
 * passes.
 *
 * Modelled on glimm (glimm.dev), which is a Next-only package — its peer
 * dependency is `next >= 14` and its adapter drives the Next router, so it
 * cannot drive TanStack Router. This reimplements the effect on the `ogl`
 * already in the bundle, and colours the band as the flag: saffron, white and
 * green banded across it, so the sweep reads as a tricolour curtain.
 *
 * The sweep band is gaussian and never fully opaque, so an opaque backdrop
 * covers the page content during the transition. The sweep is decorative;
 * the backdrop hides the content swap.
 */

const SWEEP_MS = 700;
const FADE_MS = 280;

const vertexShader = `
	attribute vec2 uv;
	attribute vec2 position;
	varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = vec4(position, 0.0, 1.0);
	}
`;

const fragmentShader = `
	precision highp float;

	varying vec2 vUv;

	uniform float uProgress;   // 0 -> 1 sweep across the screen
	uniform float uFade;       // global alpha, dropped after the traverse
	uniform float uBandWidth;  // half-width of the band, in screen widths
	uniform float uTight;      // gaussian tightness; higher is a narrower core

	// Flag stripes, in linear-ish sRGB.
	const vec3 SAFFRON = vec3(1.0, 0.6, 0.2);
	const vec3 WHITE   = vec3(1.0, 1.0, 1.0);
	const vec3 GREEN   = vec3(0.075, 0.533, 0.031);
	const vec3 NAVY    = vec3(0.0, 0.0, 0.502);

	void main() {
		// Travel from fully off the left to fully off the right.
		float centre = mix(-uBandWidth, 1.0 + uBandWidth, uProgress);
		float d = (vUv.x - centre) / max(uBandWidth, 0.0001);
		float band = exp(-d * d * uTight);

		// vUv.y is 0 at the bottom, so green sits low and saffron high.
		vec3 col = mix(GREEN, WHITE, smoothstep(0.18, 0.50, vUv.y));
		col = mix(col, SAFFRON, smoothstep(0.50, 0.82, vUv.y));

		// A thin navy seam rides the leading edge, echoing the chakra blue.
		float seam = smoothstep(0.50, 1.0, band) * (1.0 - smoothstep(0.80, 1.0, band));
		col = mix(col, NAVY, seam * 0.18);

		gl_FragColor = vec4(col, clamp(band, 0.0, 1.0) * uFade);
	}
`;

export function PageTransition() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const backdropRef = useRef<HTMLDivElement>(null);
	const sweepRef = useRef<(() => void) | null>(null);
	const pendingNavRef = useRef<string | null>(null);
	// True from the moment a sweep starts until its timeline finishes, so the
	// router.navigate() the timeline itself fires cannot re-trigger a sweep.
	const sweepingRef = useRef(false);
	const router = useRouter();

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const renderer = new Renderer({
			canvas,
			alpha: true,
			antialias: false,
			dpr: Math.min(2, window.devicePixelRatio || 1),
		});
		const gl = renderer.gl;
		gl.clearColor(0, 0, 0, 0);

		canvas.style.width = "100%";
		canvas.style.height = "100%";

		const geometry = new Triangle(gl);
		const uniforms = {
			uProgress: { value: 0 },
			uFade: { value: 0 },
			uBandWidth: { value: 0.52 },
			uTight: { value: 1.9 },
		};

		const program = new Program(gl, {
			vertex: vertexShader,
			fragment: fragmentShader,
			uniforms,
			transparent: true,
			depthTest: false,
			depthWrite: false,
		});
		const mesh = new Mesh(gl, { geometry, program });

		let raf = 0;
		let running = false;

		const resize = () => {
			const w = Math.max(1, canvas.clientWidth);
			const h = Math.max(1, canvas.clientHeight);
			const bw = Math.round(w * renderer.dpr);
			const bh = Math.round(h * renderer.dpr);
			if (canvas.width !== bw || canvas.height !== bh) {
				canvas.width = bw;
				canvas.height = bh;
				renderer.width = w;
				renderer.height = h;
				renderer.state.viewport = { x: 0, y: 0, width: null, height: null };
			}
		};

		resize();

		const frame = () => {
			resize();
			renderer.render({ scene: mesh });
			if (running) raf = window.requestAnimationFrame(frame);
		};

		const startLoop = () => {
			canvas.style.opacity = "1";
			if (running) return;
			running = true;
			raf = window.requestAnimationFrame(frame);
		};
		const stopLoop = () => {
			running = false;
			if (raf) window.cancelAnimationFrame(raf);
			raf = 0;
			canvas.style.opacity = "0";
			gl.clear(gl.COLOR_BUFFER_BIT);
		};

		let tl: gsap.core.Timeline | null = null;

		sweepRef.current = () => {
			const backdrop = backdropRef.current;
			tl?.kill();
			uniforms.uProgress.value = 0;
			uniforms.uFade.value = 1;
			sweepingRef.current = true;
			startLoop();

			if (backdrop) {
				gsap.set(backdrop, { opacity: 1 });
			}

			tl = gsap.timeline({
				onComplete: () => {
					sweepingRef.current = false;
					stopLoop();
				},
			});

			// Sweep the band across the full width.
			tl.to(uniforms.uProgress, {
				value: 1,
				duration: SWEEP_MS / 1000,
				ease: "power2.inOut",
			});

			// Navigate when the band is centred — backdrop covers the page, so the
			// content swap is invisible.
			tl.call(
				() => {
					const target = pendingNavRef.current;
					if (target) {
						pendingNavRef.current = null;
						router.navigate({ to: target });
					}
				},
				[],
				SWEEP_MS / 2000,
			);

			// Fade the sweep out in the second half.
			tl.to(
				uniforms.uFade,
				{ value: 0, duration: FADE_MS / 1000, ease: "power1.out" },
				`-=${FADE_MS / 1000}`,
			);

			// Fade the backdrop out after the sweep exits, revealing new content.
			if (backdrop) {
				tl.to(
					backdrop,
					{ opacity: 0, duration: 0.25, ease: "power1.out" },
					`-=${(FADE_MS / 1000) * 0.4}`,
				);
			}
		};

		window.addEventListener("resize", resize);

		return () => {
			sweepRef.current = null;
			sweepingRef.current = false;
			tl?.kill();
			stopLoop();
			window.removeEventListener("resize", resize);
			geometry.remove();
			program.remove();
			gl.getExtension("WEBGL_lose_context")?.loseContext();
		};
	}, [router]);

	useEffect(() => {
		if (window.location.pathname === "/") return;
		return onIntroDone(() => sweepRef.current?.());
	}, []);

	// Back / forward. The click interceptor below never sees these: the browser
	// pops the history entry itself and TanStack Router swaps the route off
	// `popstate`, with no anchor involved. Unlike a link click there is nothing
	// to defer either — the navigation has already committed by the time we
	// hear about it — so the sweep plays *over* the swap instead of around it.
	// The backdrop goes opaque on the same tick, so the change still lands
	// behind the curtain.
	useEffect(() => {
		const onPopState = () => {
			// The sweep already running means this pop is the one the sweep's own
			// timeline just triggered, so it must not restart itself.
			if (sweepingRef.current) return;
			sweepRef.current?.();
		};

		window.addEventListener("popstate", onPopState);
		return () => window.removeEventListener("popstate", onPopState);
	}, []);

	// Intercept all same-origin link clicks. The backdrop covers the page
	// instantly, the sweep plays decoratively, and the route swaps behind both.
	useEffect(() => {
		const onClick = (event: MouseEvent) => {
			if (event.button !== 0) return;
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
				return;
			}

			const anchor = (event.target as Element | null)?.closest?.("a");
			if (!anchor) return;

			const href = anchor.getAttribute("href");
			if (!href) return;
			if (anchor.target && anchor.target !== "_self") return;
			if (anchor.hasAttribute("download")) return;
			if (anchor.dataset.noTransition !== undefined) return;
			if (anchor.getAttribute("rel")?.includes("external")) return;

			let url: URL;
			try {
				url = new URL(href, window.location.href);
			} catch {
				return;
			}
			if (url.origin !== window.location.origin) return;
			if (url.pathname === window.location.pathname && url.hash) return;

			event.preventDefault();

			const target = url.pathname + url.search + url.hash;
			pendingNavRef.current = target;

			const sweep = sweepRef.current;
			if (sweep) {
				sweep();
			} else {
				pendingNavRef.current = null;
				router.navigate({ to: target });
			}
		};

		document.addEventListener("click", onClick, true);
		return () => document.removeEventListener("click", onClick, true);
	}, [router]);

	return (
		<>
			{/* Opaque backdrop — covers page content during the transition so the
			    content swap is invisible. Colour matches body background. */}
			<div
				ref={backdropRef}
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 z-90 bg-background"
				style={{ opacity: 0 }}
			/>
			{/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: a canvas with no tabindex is not focusable, and this one is purely a transition curtain */}
			<canvas
				ref={canvasRef}
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 z-95 h-full w-full"
				style={{ opacity: 0, filter: "blur(28px)" }}
			/>
		</>
	);
}
