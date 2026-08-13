import { gsap } from "gsap";
import {
	Camera,
	Mesh,
	Program,
	Renderer,
	Texture,
	Transform,
	Triangle,
	Vec2,
} from "ogl";
import { useEffect, useRef } from "react";

export interface Fake3DImageSceneProps {
	/** Source URL of the colour texture. */
	colorSrc: string;
	/** Source URL of the grayscale depth map texture. */
	depthSrc: string;
	/** Horizontal displacement threshold. @default 8 */
	xThreshold?: number;
	/** Vertical displacement threshold. @default 8 */
	yThreshold?: number;
	/** Pointer sensitivity applied before displacement thresholding. @default 0.25 */
	sensitivity?: number;
	/** Seconds the ripple takes to sweep the canvas. @default 1.2 */
	transitionDuration?: number;
	/**
	 * Where the ripple starts, normalised 0–1 from the top-left of the canvas.
	 * @default { x: 0.5, y: 0.5 }
	 */
	transitionOrigin?: { x: number; y: number };
}

/** Matches WAVE_WIDTH in the shader; the front must travel this far past the
 *  furthest corner for the trailing crossfade to finish everywhere. */
const WAVE_WIDTH = 0.5;

interface SceneHandle {
	setColorSource: (source: string) => void;
	setDepthSource: (source: string) => void;
	threshold: Vec2;
}

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
	precision mediump float;

	uniform sampler2D uOriginalTexture;
	uniform sampler2D uNextTexture;
	uniform sampler2D uDepthTexture;
	uniform vec2 uMouse;
	uniform vec2 uThreshold;
	uniform vec2 uResolution;
	uniform vec2 uOriginalTextureSize;
	uniform vec2 uNextTextureSize;
	uniform vec2 uDepthTextureSize;
	uniform float uProgress;
	uniform vec2 uOrigin;
	varying vec2 vUv;

	// Ripple constants, carried over from the reference slider's config.
	const float WAVE_FREQ = 25.0;
	const float WAVE_POW = 0.035;
	const float WAVE_WIDTH = 0.5;
	const float FALLOFF = 10.0;
	const float BOOST_STRENGTH = 0.5;
	const float CROSSFADE_WIDTH = 0.05;

	vec2 mirrored(vec2 value) {
		vec2 m = mod(value, 2.0);
		return mix(m, 2.0 - m, step(1.0, m));
	}

	vec2 getCoverUV(vec2 uv, vec2 textureSize) {
		vec2 safeTexture = max(textureSize, vec2(1.0));
		vec2 s = uResolution / safeTexture;
		float scale = max(s.x, s.y);
		vec2 scaledSize = safeTexture * scale;
		vec2 offset = (uResolution - scaledSize) * 0.5;
		return (uv * uResolution - offset) / scaledSize;
	}

	void main() {
		// Aspect-corrected space, so the wavefront stays circular on a wide canvas.
		float ratio = uResolution.y / max(uResolution.x, 1.0);
		vec2 coord = vec2(vUv.x, vUv.y * ratio);
		vec2 center = vec2(uOrigin.x, uOrigin.y * ratio);

		float dist = distance(coord, center);

		vec2 displaced = coord;
		float brightness = 0.0;
		float blend = 0.0;

		if (uProgress > 0.001) {
			// Negative once the front has swept past this pixel.
			float trailing = dist - uProgress;

			if (trailing < WAVE_WIDTH && trailing < 0.0) {
				float age = -trailing;
				float decay = exp(-age * FALLOFF);
				float wave = sin(age * WAVE_FREQ) * decay;
				// Guard the origin pixel: normalize(0) is undefined.
				vec2 direction = dist > 0.0001 ? (coord - center) / dist : vec2(0.0);
				displaced += direction * wave * WAVE_POW;
				brightness = abs(wave) * BOOST_STRENGTH * decay;
			}

			blend = smoothstep(0.0, CROSSFADE_WIDTH, -trailing);
		}

		vec2 rippleUv = vec2(displaced.x, displaced.y / max(ratio, 0.00001));

		// Depth parallax is sampled at the undisplaced uv, so the pointer effect
		// stays anchored to the scene while the ripple travels over it.
		vec2 depthUv = mirrored(getCoverUV(vUv, uDepthTextureSize));
		float depth = texture2D(uDepthTexture, depthUv).r;
		vec2 safeThreshold = max(uThreshold, vec2(0.00001));
		vec2 parallax = (depth - 0.5) * uMouse / safeThreshold;

		vec4 color = texture2D(
			uOriginalTexture,
			mirrored(getCoverUV(rippleUv, uOriginalTextureSize) + parallax)
		);

		// Second sample only where the front has actually passed.
		if (blend > 0.0) {
			vec4 next = texture2D(
				uNextTexture,
				mirrored(getCoverUV(rippleUv, uNextTextureSize) + parallax)
			);
			color = mix(color, next, blend);
		}

		// Specular lift riding the crest.
		color.rgb += color.rgb * brightness;

		gl_FragColor = color;
	}
`;

export function Fake3DImageScene({
	colorSrc,
	depthSrc,
	xThreshold = 8,
	yThreshold = 8,
	sensitivity = 0.25,
	transitionDuration = 1.2,
	transitionOrigin,
}: Fake3DImageSceneProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sceneRef = useRef<SceneHandle | null>(null);

	// Read inside the render loop, so changing it does not tear down the scene.
	const sensitivityRef = useRef(sensitivity);
	useEffect(() => {
		sensitivityRef.current = sensitivity;
	}, [sensitivity]);

	// Both are read when a transition starts, for the same reason.
	const transitionDurationRef = useRef(transitionDuration);
	useEffect(() => {
		transitionDurationRef.current = transitionDuration;
	}, [transitionDuration]);

	const transitionOriginRef = useRef(transitionOrigin);
	useEffect(() => {
		transitionOriginRef.current = transitionOrigin;
	}, [transitionOrigin]);

	// Seed value only. Kept in a ref so the thresholds are not effect deps —
	// depending on them would rebuild the whole WebGL scene on every change,
	// when the sync effect below already updates the live uniform.
	const thresholdSeedRef = useRef({ x: xThreshold, y: yThreshold });

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const targetPointer = new Vec2(0, 0);
		const smoothPointer = new Vec2(0, 0);

		const renderer = new Renderer({
			canvas,
			alpha: true,
			// Capped: this is a blurred parallax, so full retina buys nothing visible
			// and costs 4x the fragments on a 2x display.
			dpr: Math.min(1.5, window.devicePixelRatio || 1),
		});
		const gl = renderer.gl;
		gl.clearColor(0, 0, 0, 0);

		canvas.style.width = "100%";
		canvas.style.height = "100%";

		const camera = new Camera(gl);
		camera.position.z = 1;

		const scene = new Transform();
		const geometry = new Triangle(gl);

		const textureOptions = {
			width: 1,
			height: 1,
			format: gl.RGBA,
			type: gl.UNSIGNED_BYTE,
			minFilter: gl.LINEAR,
			magFilter: gl.LINEAR,
			wrapS: gl.CLAMP_TO_EDGE,
			wrapT: gl.CLAMP_TO_EDGE,
			generateMipmaps: true,
			flipY: true,
		};

		// Two colour slots, ping-ponged: a change decodes into the "next" slot,
		// uProgress crossfades to it, then the slots swap so the arriving image
		// becomes the resting one. Transparent (not opaque black) until the first
		// photo decodes, so the plain <img> underneath shows through.
		const colorTexture = new Texture(gl, {
			...textureOptions,
			image: new Uint8Array([0, 0, 0, 0]),
		});

		const nextColorTexture = new Texture(gl, {
			...textureOptions,
			image: new Uint8Array([0, 0, 0, 0]),
		});

		const depthTexture = new Texture(gl, {
			...textureOptions,
			image: new Uint8Array([127, 127, 127, 255]),
		});

		const resolutionUniform = new Vec2(1, 1);
		const mouseUniform = new Vec2(0, 0);
		const thresholdUniform = new Vec2(
			thresholdSeedRef.current.x,
			thresholdSeedRef.current.y,
		);
		const colorTextureSizeUniform = new Vec2(1, 1);
		const nextColorTextureSizeUniform = new Vec2(1, 1);
		const depthTextureSizeUniform = new Vec2(1, 1);
		const progressUniform = { value: 0 };
		const originUniform = new Vec2(0.5, 0.5);

		const uniforms = {
			uOriginalTexture: { value: colorTexture },
			uNextTexture: { value: nextColorTexture },
			uDepthTexture: { value: depthTexture },
			uMouse: { value: mouseUniform },
			uThreshold: { value: thresholdUniform },
			uResolution: { value: resolutionUniform },
			uOriginalTextureSize: { value: colorTextureSizeUniform },
			uNextTextureSize: { value: nextColorTextureSizeUniform },
			uDepthTextureSize: { value: depthTextureSizeUniform },
			uProgress: progressUniform,
			uOrigin: { value: originUniform },
		};

		const sizeOf = (img: HTMLImageElement) =>
			[
				img.naturalWidth || img.width || 1,
				img.naturalHeight || img.height || 1,
			] as const;

		const swapColorSlots = () => {
			const texture = uniforms.uOriginalTexture.value;
			uniforms.uOriginalTexture.value = uniforms.uNextTexture.value;
			uniforms.uNextTexture.value = texture;

			const size = uniforms.uOriginalTextureSize.value;
			uniforms.uOriginalTextureSize.value = uniforms.uNextTextureSize.value;
			uniforms.uNextTextureSize.value = size;

			progressUniform.value = 0;
		};

		let transition: gsap.core.Tween | null = null;

		// A change arriving mid-crossfade lands the one in flight first, so the
		// outgoing frame is never a half-mixed image.
		const settleTransition = () => {
			if (!transition) return;
			transition.kill();
			transition = null;
			swapColorSlots();
		};

		let colorToken = 0;
		let hasColor = false;

		const setColorSource = (source: string) => {
			colorToken += 1;
			const token = colorToken;
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.decoding = "async";
			img.onload = () => {
				if (token !== colorToken) return;
				const [w, h] = sizeOf(img);

				// First image has nothing to crossfade from — show it outright.
				if (!hasColor) {
					uniforms.uOriginalTexture.value.image = img;
					uniforms.uOriginalTextureSize.value.set(w, h);
					hasColor = true;
					return;
				}

				settleTransition();
				uniforms.uNextTexture.value.image = img;
				uniforms.uNextTextureSize.value.set(w, h);
				progressUniform.value = 0;

				// Origin arrives in top-left coords; the shader's uv has y=0 at the
				// bottom, so flip it.
				const origin = transitionOriginRef.current ?? { x: 0.5, y: 0.5 };
				const originX = Math.min(Math.max(origin.x, 0), 1);
				const originY = 1 - Math.min(Math.max(origin.y, 0), 1);
				originUniform.set(originX, originY);

				// The front has to reach the furthest corner, plus WAVE_WIDTH so the
				// trailing crossfade completes there too. Distances are measured in
				// the shader's aspect-corrected space (y scaled by height/width).
				const ratio = resolutionUniform.y / Math.max(resolutionUniform.x, 1);
				const centreY = originY * ratio;
				const reach = Math.max(
					...[
						[0, 0],
						[1, 0],
						[0, ratio],
						[1, ratio],
					].map(([cx, cy]) => Math.hypot(cx - originX, cy - centreY)),
				);

				transition = gsap.to(progressUniform, {
					value: reach + WAVE_WIDTH,
					duration: transitionDurationRef.current,
					ease: "power2.inOut",
					onComplete: () => {
						transition = null;
						swapColorSlots();
					},
				});
			};
			img.src = source;
		};

		let depthToken = 0;
		const setDepthSource = (source: string) => {
			depthToken += 1;
			const token = depthToken;
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.decoding = "async";
			img.onload = () => {
				if (token !== depthToken) return;
				const [w, h] = sizeOf(img);
				depthTexture.image = img;
				depthTextureSizeUniform.set(w, h);
			};
			img.src = source;
		};

		sceneRef.current = {
			setColorSource,
			setDepthSource,
			threshold: thresholdUniform,
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
		mesh.setParent(scene);

		// Listens on the window, not the canvas. As a background layer the canvas
		// almost always sits under something (a scrim, hero copy), and those
		// swallow its pointer events — the displacement would just never move.
		// Coordinates are still canvas-relative, and outside its box we recentre,
		// so the behaviour matches a direct pointermove/pointerleave pair.
		const handlePointerMove = (event: PointerEvent) => {
			const rect = canvas.getBoundingClientRect();
			const inside =
				event.clientX >= rect.left &&
				event.clientX <= rect.right &&
				event.clientY >= rect.top &&
				event.clientY <= rect.bottom;

			if (!inside) {
				targetPointer.set(0, 0);
				return;
			}

			const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
			targetPointer.set(x, y);
		};

		const handlePointerLeave = () => {
			targetPointer.set(0, 0);
		};

		window.addEventListener("pointermove", handlePointerMove, {
			passive: true,
		});
		document.addEventListener("pointerleave", handlePointerLeave);

		let raf = 0;
		let previous = 0;
		let onScreen = true;
		let pageVisible = !document.hidden;
		// Redraw only when something changed. Sitting still, this shader was
		// re-rendering an identical frame 60 times a second.
		let dirty = true;

		const shouldRun = () => onScreen && pageVisible;

		const startLoop = () => {
			if (raf || !shouldRun()) return;
			previous = 0; // avoid a huge delta after a pause
			raf = window.requestAnimationFrame(tick);
		};
		const stopLoop = () => {
			if (raf) window.cancelAnimationFrame(raf);
			raf = 0;
		};

		const tick = (now: number) => {
			const w = Math.max(1, canvas.clientWidth);
			const h = Math.max(1, canvas.clientHeight);
			const bufW = Math.round(w * renderer.dpr);
			const bufH = Math.round(h * renderer.dpr);
			if (canvas.width !== bufW || canvas.height !== bufH) {
				canvas.width = bufW;
				canvas.height = bufH;
				renderer.width = w;
				renderer.height = h;
				renderer.state.viewport = { x: 0, y: 0, width: null, height: null };
				resolutionUniform.set(w, h);
				dirty = true;
			}
			const delta = previous ? (now - previous) / 1000 : 0;
			previous = now;

			const targetX = targetPointer.x * sensitivityRef.current;
			const targetY = targetPointer.y * sensitivityRef.current;
			const lerp = Math.min(1, 5 * delta);
			const settling =
				Math.abs(targetX - smoothPointer.x) > 1e-4 ||
				Math.abs(targetY - smoothPointer.y) > 1e-4;
			smoothPointer.x += (targetX - smoothPointer.x) * lerp;
			smoothPointer.y += (targetY - smoothPointer.y) * lerp;
			mouseUniform.set(smoothPointer.x, smoothPointer.y);

			// A crossfade is running whenever uProgress has been lifted off zero.
			const transitioning = progressUniform.value > 0;
			if (dirty || settling || transitioning) {
				renderer.render({ scene, camera });
				dirty = false;
			}
			raf = shouldRun() ? window.requestAnimationFrame(tick) : 0;
		};

		// Scrolled past the hero, or the tab is in the background: stop rendering
		// entirely. This loop used to run at 60fps for the life of the page.
		const observer = new IntersectionObserver(
			(entries) => {
				onScreen = entries[0]?.isIntersecting ?? true;
				if (shouldRun()) startLoop();
				else stopLoop();
			},
			{ rootMargin: "120px" },
		);
		observer.observe(canvas);

		const onVisibilityChange = () => {
			pageVisible = !document.hidden;
			if (shouldRun()) startLoop();
			else stopLoop();
		};
		document.addEventListener("visibilitychange", onVisibilityChange);

		startLoop();

		return () => {
			stopLoop();
			observer.disconnect();
			document.removeEventListener("visibilitychange", onVisibilityChange);
			mesh.setParent(null);
			window.removeEventListener("pointermove", handlePointerMove);
			document.removeEventListener("pointerleave", handlePointerLeave);
			sceneRef.current = null;
			transition?.kill();
			transition = null;
			program.remove();
			geometry.remove();
			for (const texture of [colorTexture, nextColorTexture, depthTexture]) {
				if (texture.texture) {
					gl.deleteTexture(texture.texture);
				}
			}
		};
	}, []);

	useEffect(() => {
		sceneRef.current?.threshold.set(xThreshold, yThreshold);
	}, [xThreshold, yThreshold]);

	useEffect(() => {
		sceneRef.current?.setColorSource(colorSrc);
	}, [colorSrc]);

	useEffect(() => {
		sceneRef.current?.setDepthSource(depthSrc);
	}, [depthSrc]);

	return (
		// biome-ignore lint/a11y/noAriaHiddenOnFocusable: a canvas with no tabindex is not focusable, and this one is a decorative duplicate of the <img> beneath it
		<canvas
			ref={canvasRef}
			aria-hidden="true"
			className="absolute inset-0 block h-full w-full"
			style={{ width: "100%", height: "100%" }}
		/>
	);
}
