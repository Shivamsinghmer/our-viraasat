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
	Vec3,
} from "ogl";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type {
	AtmosphereConfig,
	FresnelConfig,
	GlobeMarker,
} from "#/components/globe/types";
import { type ColorRepresentation, toLinearRgb } from "#/lib/color";

const PI = Math.PI;
const DEG2RAD = PI / 180;
const EPSILON = 1e-6;
const COBE_GLOBE_RADIUS = 0.8;
const DEFAULT_GLOBE_SCALE = 1;
const AUTO_ROTATE_SPEED = (2 * PI) / 30;
const ROTATE_SENSITIVITY = 0.005;
const SMOOTHING_STRENGTH = 14;
const LOCKED_POLAR_ANGLE = 1.5;
const LOCKED_THETA = Math.asin(Math.cos(LOCKED_POLAR_ANGLE));
const MIN_THETA = -PI * 0.5 + 0.001;
const MAX_THETA = PI * 0.5 - 0.001;
const VISIBILITY_MIN_DOT = 0.24;
const VISIBILITY_MAX_DOT = 0.48;
/**
 * Kept small on purpose. Each element of a uniform array occupies a full vec4
 * slot, so `uMarkerData[N]` plus `uMarkerColor[N]` costs 2N of the fragment
 * shader's budget. At N=128 that was ~270 vec4 — fine against the 1024+ desktop
 * GPUs report, but over the 224 that Adreno and Mali commonly cap
 * MAX_FRAGMENT_UNIFORM_VECTORS at. Past the cap the program fails to link, and
 * because OGL only console.warns on link failure the globe rendered as an empty
 * square on those phones. No caller comes close to 16 markers.
 */
const MAX_SHADER_MARKERS = 16;
const SHADER_MARKER_SIZE_SCALE = 0.5;
const MIN_SHADER_MARKER_SIZE = 0.003;
const MAX_SHADER_MARKER_SIZE = 0.06;
const MAX_TOOLTIP_BLUR = 8;

const LAND_TEXTURE_URL = "/images/land-mask.png";

const defaultFresnelConfig: Required<FresnelConfig> = {
	color: "#17181A",
	rimColor: "#FF6900",
	rimPower: 6,
	rimIntensity: 1.5,
};

const defaultAtmosphereConfig: Required<AtmosphereConfig> = {
	color: "#FF6900",
	scale: 1.1,
	power: 12.0,
	coefficient: 0.9,
	intensity: 1.1,
};

export interface GlobeSceneProps {
	scale?: number;
	offsetX?: number;
	offsetY?: number;
	fresnelConfig?: FresnelConfig;
	atmosphereConfig?: AtmosphereConfig;
	pointCount?: number;
	pointSize?: number;
	landPointColor?: ColorRepresentation;
	autoRotate?: boolean;
	lockedPolarAngle?: boolean;
	markers?: GlobeMarker[];
	/** Rendered inside each marker's tooltip slot. */
	renderMarker?: (marker: GlobeMarker, index: number) => ReactNode;
	focusOn?: [number, number] | null;
}

interface Settings {
	scale: number;
	offsetX: number;
	offsetY: number;
	pointCount: number;
	pointSize: number;
	landPointColor: ColorRepresentation;
	fresnelConfig: Required<FresnelConfig>;
	atmosphereConfig: Required<AtmosphereConfig>;
	autoRotate: boolean;
	lockedPolarAngle: boolean;
	markers: GlobeMarker[];
}

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

const clampTheta = (value: number, lockPolar: boolean) =>
	lockPolar ? LOCKED_THETA : clamp(value, MIN_THETA, MAX_THETA);

const smoothstep = (value: number, edge0: number, edge1: number) => {
	if (Math.abs(edge1 - edge0) <= EPSILON) return value >= edge1 ? 1 : 0;
	const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
	return t * t * (3 - 2 * t);
};

const toPointRadius = (nextPointSize: number) =>
	Math.max(0.001, nextPointSize * 0.16);

function normalizeAngle(value: number): number {
	const wrapped = (((value + PI) % (2 * PI)) + 2 * PI) % (2 * PI);
	return wrapped - PI;
}

function shortestAngleTarget(current: number, next: number): number {
	return current + normalizeAngle(next - current);
}

function lonLatToCartesian(lon: number, lat: number, r: number) {
	const lonRad = lon * DEG2RAD;
	const latRad = lat * DEG2RAD;
	const y = r * Math.sin(latRad);
	const rXZ = r * Math.cos(latRad);
	return { x: rXZ * Math.sin(lonRad), y, z: rXZ * Math.cos(lonRad) };
}

function cartesianToRotation(x: number, y: number, z: number) {
	const length = Math.hypot(x, y, z);
	if (length <= EPSILON) return { phi: 0, theta: 0 };
	const nx = x / length;
	const ny = y / length;
	const nz = z / length;
	return { phi: Math.atan2(-nx, nz), theta: Math.asin(clamp(ny, -1, 1)) };
}

function applyRotation(
	x: number,
	y: number,
	z: number,
	phi: number,
	theta: number,
) {
	const cx = Math.cos(theta);
	const cy = Math.cos(phi);
	const sx = Math.sin(theta);
	const sy = Math.sin(phi);
	return {
		rx: cy * x + sy * z,
		ry: sy * sx * x + cx * y - cy * sx * z,
		rz: -sy * cx * x + sx * y + cy * cx * z,
	};
}

function cubicBezierAt(
	t: number,
	p0: number,
	p1: number,
	p2: number,
	p3: number,
) {
	const u = 1 - t;
	return (
		u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
	);
}

function cubicBezierDerivativeAt(
	t: number,
	p0: number,
	p1: number,
	p2: number,
	p3: number,
) {
	const u = 1 - t;
	return 3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2);
}

function dynamicEase(value: number): number {
	const clamped = clamp(value, 0, 1);
	let t = clamped;
	for (let i = 0; i < 5; i++) {
		const x = cubicBezierAt(t, 0, 0.625, 0, 1);
		const dx = cubicBezierDerivativeAt(t, 0, 0.625, 0, 1);
		if (Math.abs(dx) < 1e-6) break;
		t = clamp(t - (x - clamped) / dx, 0, 1);
	}
	return cubicBezierAt(t, 0, 0.05, 1, 1);
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

const globeFragmentShader = `
	#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
	#else
	precision mediump float;
	#endif

	varying vec2 vUv;

	uniform float uTime;
	uniform vec2 uResolution;
	uniform vec2 uRotation;
	uniform float uScale;
	uniform float uDisplayScale;
	uniform vec2 uDisplayOffset;
	uniform float uDots;
	uniform float uPointRadius;
	uniform vec3 uBaseColor;
	uniform vec3 uRimColor;
	uniform float uRimPower;
	uniform float uRimIntensity;
	uniform vec3 uLandPointColor;
	uniform sampler2D uLandTexture;
	uniform float uMarkerCount;
	uniform vec4 uMarkerData[${MAX_SHADER_MARKERS}];
	uniform vec3 uMarkerColor[${MAX_SHADER_MARKERS}];

	const float kPi = 3.141592653589793;
	const float kTau = 6.283185307179586;
	const float kPhi = 1.618033988749895;
	const float kSqrt5 = 2.23606797749979;
	const float kSphereRadius = 0.8;
	const int kMaxMarkers = ${MAX_SHADER_MARKERS};

	float byDots;

	vec2 transformUv(vec2 uv) {
		float aspect = uResolution.x / max(1.0, uResolution.y);
		vec2 centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
		vec2 transformed = (
			centered - vec2(uDisplayOffset.x * aspect, uDisplayOffset.y)
		) / max(uDisplayScale, 0.001);
		return vec2(transformed.x / aspect + 0.5, transformed.y + 0.5);
	}

	mat3 rotate(float theta, float phi) {
		float cx = cos(theta);
		float cy = cos(phi);
		float sx = sin(theta);
		float sy = sin(phi);
		return mat3(
			cy, sy * sx, -sy * cx,
			0.0, cx, sx,
			sy, cy * -sx, cy * cx
		);
	}

	vec3 nearestFibonacciLattice(vec3 p, out float m) {
		p = p.xzy;

		float k = max(2.0, floor(log2(kSqrt5 * uDots * kPi * (1.0 - p.z * p.z)) * 0.72021));
		vec2 f = floor(pow(kPhi, k) / kSqrt5 * vec2(1.0, kPhi) + 0.5);
		vec2 br1 = fract((f + 1.0) * (kPhi - 1.0)) * kTau - 3.883222;
		vec2 br2 = -2.0 * f;
		vec2 sp = vec2(atan(p.y, p.x), p.z - 1.0);
		vec2 c = floor(vec2(
			br2.y * sp.x - br1.y * (sp.y * uDots + 1.0),
			-br2.x * sp.x + br1.x * (sp.y * uDots + 1.0)
		) / (br1.x * br2.y - br2.x * br1.y));

		float mindist = kPi;
		vec3 minip = vec3(0.0, 0.0, 1.0);

		for (float s = 0.0; s < 4.0; s += 1.0) {
			vec2 o = vec2(mod(s, 2.0), floor(s * 0.5));
			float idx = dot(f, c + o);
			if (idx > uDots) continue;

			float a = idx;
			float b = 0.0;
			if (a >= 16384.0) a -= 16384.0, b += 0.868872;
			if (a >= 8192.0) a -= 8192.0, b += 0.934436;
			if (a >= 4096.0) a -= 4096.0, b += 0.467218;
			if (a >= 2048.0) a -= 2048.0, b += 0.733609;
			if (a >= 1024.0) a -= 1024.0, b += 0.866804;
			if (a >= 512.0) a -= 512.0, b += 0.433402;
			if (a >= 256.0) a -= 256.0, b += 0.216701;
			if (a >= 128.0) a -= 128.0, b += 0.108351;
			if (a >= 64.0) a -= 64.0, b += 0.554175;
			if (a >= 32.0) a -= 32.0, b += 0.777088;
			if (a >= 16.0) a -= 16.0, b += 0.888544;
			if (a >= 8.0) a -= 8.0, b += 0.944272;
			if (a >= 4.0) a -= 4.0, b += 0.472136;
			if (a >= 2.0) a -= 2.0, b += 0.236068;
			if (a >= 1.0) a -= 1.0, b += 0.618034;

			float theta = fract(b) * kTau;
			float cosphi = 1.0 - 2.0 * idx * byDots;
			float sinphi = sqrt(max(0.0, 1.0 - cosphi * cosphi));
			vec3 samplePoint = vec3(cos(theta) * sinphi, sin(theta) * sinphi, cosphi);

			float dist = length(p - samplePoint);
			if (dist < mindist) {
				mindist = dist;
				minip = samplePoint;
			}
		}

		m = mindist;
		return minip.xzy;
	}

	vec2 pointToMaskUV(vec3 p) {
		float lengthP = length(p);
		if (lengthP <= 0.0) return vec2(0.0, 0.0);

		vec3 n = p / lengthP;
		float nx = n.z;
		float ny = n.y;
		float nz = -n.x;

		float gPhi = asin(clamp(ny, -1.0, 1.0));
		float cosPhi = cos(gPhi);

		float gTheta = 0.0;
		if (abs(cosPhi) > 1e-6) {
			float thetaInput = clamp(-nx / cosPhi, -1.0, 1.0);
			gTheta = acos(thetaInput);
			if (nz < 0.0) gTheta = -gTheta;
		}

		return vec2(fract((gTheta * 0.5) / kPi), fract(gPhi / kPi + 0.5));
	}

	vec3 linearToSrgb(vec3 color) {
		vec3 safe = max(color, vec3(0.0));
		vec3 low = safe * 12.92;
		vec3 high = 1.055 * pow(safe, vec3(1.0 / 2.4)) - 0.055;
		vec3 cutoff = step(vec3(0.0031308), safe);
		return mix(low, high, cutoff);
	}

	void main() {
		byDots = 1.0 / max(1.0, uDots);

		vec2 uv = transformUv(vUv) * 2.0 - 1.0;
		uv.x *= uResolution.x / max(1.0, uResolution.y);
		uv /= max(0.0001, uScale);

		float l = dot(uv, uv);
		float globeR2 = kSphereRadius * kSphereRadius;

		vec3 color = vec3(0.0);
		float alpha = 0.0;

		if (l <= globeR2) {
			float dis;
			vec3 p = normalize(vec3(uv, sqrt(max(0.0, globeR2 - l))));
			mat3 rot = rotate(uRotation.y, uRotation.x);
			vec3 globePoint = p * rot;
			vec3 samplePoint = nearestFibonacciLattice(globePoint, dis);
			vec2 mapUv = pointToMaskUV(samplePoint);
			float land = texture2D(uLandTexture, mapUv).r;

			float landDots = step(0.5, land) * smoothstep(uPointRadius, 0.0, dis);

			float dotNV = clamp(p.z / kSphereRadius, 0.0, 1.0);
			float rim = pow(1.0 - dotNV, max(0.0001, uRimPower)) * uRimIntensity;
			float dotFade = smoothstep(0.04, 0.28, dotNV);
			landDots *= dotFade;

			vec3 markerColor = vec3(0.0);
			float markerMask = 0.0;
			float markerWeightSum = 0.0;
			for (int i = 0; i < kMaxMarkers; i++) {
				if (float(i) >= uMarkerCount) break;

				vec4 marker = uMarkerData[i];
				float markerDist = length(globePoint - marker.xyz);
				float markerCore = smoothstep(marker.w, marker.w * 0.62, markerDist);
				float pulse = fract(uTime * 0.85 + float(i) * 0.173);
				float pulseRadius = marker.w * mix(1.15, 2.8, pulse);
				float pulseWidth = marker.w * 0.42;
				float pulseInner = smoothstep(pulseRadius - pulseWidth, pulseRadius, markerDist);
				float pulseOuter = 1.0 - smoothstep(pulseRadius, pulseRadius + pulseWidth, markerDist);
				float markerPulse = pulseInner * pulseOuter * (1.0 - pulse);
				float markerDot = max(markerCore, markerPulse * 0.72);
				markerMask = max(markerMask, markerDot);
				markerWeightSum += markerDot;
				markerColor += uMarkerColor[i] * markerDot;
			}

			if (markerWeightSum > 0.0) markerColor /= markerWeightSum;

			vec3 surface = uBaseColor;
			surface += uRimColor * rim;
			surface += uLandPointColor * (landDots * (1.0 - markerMask));

			vec3 boostedMarker = markerColor * (1.0 + 0.25 * markerMask);
			surface = mix(surface, boostedMarker, markerMask);

			color += surface;
			alpha = 1.0;
		}

		gl_FragColor = vec4(linearToSrgb(color), clamp(alpha, 0.0, 1.0));
	}
`;

const atmosphereFragmentShader = `
	#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
	#else
	precision mediump float;
	#endif

	varying vec2 vUv;

	uniform vec2 uResolution;
	uniform float uScale;
	uniform float uDisplayScale;
	uniform vec2 uDisplayOffset;
	uniform vec3 uAtmosphereColor;
	uniform float uAtmosphereScale;
	uniform float uAtmospherePower;
	uniform float uAtmosphereCoefficient;
	uniform float uAtmosphereIntensity;

	const float kSphereRadius = 0.8;

	vec2 transformUv(vec2 uv) {
		float aspect = uResolution.x / max(1.0, uResolution.y);
		vec2 centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
		vec2 transformed = (
			centered - vec2(uDisplayOffset.x * aspect, uDisplayOffset.y)
		) / max(uDisplayScale, 0.001);
		return vec2(transformed.x / aspect + 0.5, transformed.y + 0.5);
	}

	vec3 linearToSrgb(vec3 color) {
		vec3 safe = max(color, vec3(0.0));
		vec3 low = safe * 12.92;
		vec3 high = 1.055 * pow(safe, vec3(1.0 / 2.4)) - 0.055;
		vec3 cutoff = step(vec3(0.0031308), safe);
		return mix(low, high, cutoff);
	}

	void main() {
		vec2 uv = transformUv(vUv) * 2.0 - 1.0;
		uv.x *= uResolution.x / max(1.0, uResolution.y);
		uv /= max(0.0001, uScale);

		float globeR = kSphereRadius;
		float atmosphereR = kSphereRadius * max(1.0, uAtmosphereScale);
		float l = dot(uv, uv);
		float radial = sqrt(l);

		if (radial <= globeR) discard;

		float shellWidth = max(1e-5, atmosphereR - globeR);
		float x = (radial - globeR) / shellWidth;
		if (x > 3.0) discard;

		float falloff = exp(-pow(max(0.0, x), 1.2) * max(0.15, uAtmospherePower * 0.09));
		float finalFactor = falloff * uAtmosphereIntensity * max(0.0, uAtmosphereCoefficient);

		gl_FragColor = vec4(linearToSrgb(uAtmosphereColor * finalFactor), clamp(finalFactor, 0.0, 1.0));
	}
`;

/**
 * Ported from the Svelte original. The one structural change: marker tooltips are
 * positioned imperatively from the render loop rather than through component
 * state. Svelte can afford per-frame reactivity here; in React that would be a
 * setState at 60fps and would re-render the whole subtree every frame.
 */
export function GlobeScene({
	scale = 1,
	offsetX = 0,
	offsetY = 0,
	fresnelConfig,
	atmosphereConfig,
	pointCount = 15000,
	pointSize = 0.05,
	landPointColor = "#f77114",
	autoRotate = true,
	lockedPolarAngle = true,
	markers = [],
	renderMarker,
	focusOn = null,
}: GlobeSceneProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const markerElsRef = useRef<(HTMLDivElement | null)[]>([]);

	/**
	 * Bumped when the browser restores a lost WebGL context, which re-runs the
	 * setup effect and rebuilds every GL resource.
	 *
	 * Mobile browsers drop WebGL contexts under memory pressure, and this page
	 * carries three of them alongside a lot of image decoding. Without this the
	 * globe went blank on the first eviction and never came back.
	 */
	const [contextGeneration, setContextGeneration] = useState(0);

	const settingsRef = useRef<Settings>({
		scale,
		offsetX,
		offsetY,
		pointCount,
		pointSize,
		landPointColor,
		fresnelConfig: { ...defaultFresnelConfig, ...fresnelConfig },
		atmosphereConfig: { ...defaultAtmosphereConfig, ...atmosphereConfig },
		autoRotate,
		lockedPolarAngle,
		markers,
	});

	const apiRef = useRef<{
		applySettings: () => void;
		focus: (target: [number, number] | null) => void;
	} | null>(null);

	// Seed only. Kept in a ref so the setup effect does not depend on focusOn —
	// depending on it would tear down and rebuild the whole WebGL scene on every
	// focus change, which the dedicated effect below already handles.
	const initialFocusRef = useRef(focusOn);

	// Push prop changes into the ref the render loop reads, then nudge the scene.
	useEffect(() => {
		settingsRef.current = {
			scale,
			offsetX,
			offsetY,
			pointCount,
			pointSize,
			landPointColor,
			fresnelConfig: { ...defaultFresnelConfig, ...fresnelConfig },
			atmosphereConfig: { ...defaultAtmosphereConfig, ...atmosphereConfig },
			autoRotate,
			lockedPolarAngle,
			markers,
		};
		apiRef.current?.applySettings();
	}, [
		scale,
		offsetX,
		offsetY,
		pointCount,
		pointSize,
		landPointColor,
		fresnelConfig,
		atmosphereConfig,
		autoRotate,
		lockedPolarAngle,
		markers,
	]);

	useEffect(() => {
		apiRef.current?.focus(focusOn);
	}, [focusOn]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		// On mobile the canvas can be 0×0 when the component mounts (e.g. inside
		// a Reveal that starts with autoAlpha:0 or before layout settles).  WebGL
		// contexts created against a zero-sized surface produce nothing visible,
		// and some mobile GPUs silently discard the context.  Wait until the
		// canvas actually has dimensions before initialising the renderer.
		if (canvas.clientWidth === 0 || canvas.clientHeight === 0) {
			let disposed = false;
			const ro = new ResizeObserver(() => {
				if (disposed) return;
				if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
					disposed = true;
					ro.disconnect();
					setContextGeneration((g) => g + 1);
				}
			});
			ro.observe(canvas);
			return () => {
				disposed = true;
				ro.disconnect();
			};
		}

		// Phone GPUs are a different budget from desktop ones, and this shader is
		// fragment-bound: every pixel does a lattice search. Half the device pixels
		// is a quarter of the work, which is the difference between a globe that
		// turns and one that crawls.
		const small = window.matchMedia("(max-width: 767px)").matches;
		const maxDpr = small ? 1 : 1.5;

		const renderer = new Renderer({
			canvas,
			alpha: true,
			// The globe shader soft-edges its own dots, so MSAA buys nothing here.
			antialias: false,
			// Its fragment shader runs a Fibonacci-lattice nearest-neighbour search
			// per pixel, so cost scales with fragments — cap hard.
			dpr: Math.min(maxDpr, window.devicePixelRatio || 1),
		});
		const gl = renderer.gl;
		gl.clearColor(0, 0, 0, 0);

		canvas.style.width = "100%";
		canvas.style.height = "100%";

		const camera = new Camera(gl);
		camera.position.z = 1;

		const globeScene = new Transform();
		const atmosphereScene = new Transform();
		const geometry = new Triangle(gl);
		const markerData = new Array<number>(MAX_SHADER_MARKERS * 4).fill(0);
		const markerColorData = new Array<number>(MAX_SHADER_MARKERS * 3).fill(0);

		const landTexture = new Texture(gl, {
			image: new Uint8Array([0, 0, 0, 255]),
			width: 1,
			height: 1,
			format: gl.RGBA,
			type: gl.UNSIGNED_BYTE,
			minFilter: gl.NEAREST,
			magFilter: gl.NEAREST,
			generateMipmaps: false,
			wrapS: gl.REPEAT,
			wrapT: gl.REPEAT,
		});

		const initial = settingsRef.current;
		const uniforms = {
			uTime: { value: 0 },
			uResolution: { value: new Vec2(1, 1) },
			uRotation: {
				value: new Vec2(0, clampTheta(0, initial.lockedPolarAngle)),
			},
			uScale: { value: DEFAULT_GLOBE_SCALE },
			uDisplayScale: { value: initial.scale },
			uDisplayOffset: { value: new Vec2(initial.offsetX, initial.offsetY) },
			uDots: { value: Math.max(1, Math.floor(initial.pointCount)) },
			uPointRadius: { value: toPointRadius(initial.pointSize) },
			uBaseColor: { value: new Vec3(0, 0, 0) },
			uRimColor: { value: new Vec3(0, 0, 0) },
			uRimPower: { value: initial.fresnelConfig.rimPower },
			uRimIntensity: { value: initial.fresnelConfig.rimIntensity },
			uAtmosphereColor: { value: new Vec3(0, 0, 0) },
			uAtmosphereScale: { value: initial.atmosphereConfig.scale },
			uAtmospherePower: { value: initial.atmosphereConfig.power },
			uAtmosphereCoefficient: { value: initial.atmosphereConfig.coefficient },
			uAtmosphereIntensity: { value: initial.atmosphereConfig.intensity },
			uLandPointColor: { value: new Vec3(0, 0, 0) },
			uLandTexture: { value: landTexture },
			uMarkerCount: { value: 0 },
			uMarkerData: { value: markerData },
			uMarkerColor: { value: markerColorData },
		};

		const globeProgram = new Program(gl, {
			vertex: vertexShader,
			fragment: globeFragmentShader,
			uniforms,
			transparent: true,
			depthTest: false,
			depthWrite: false,
		});

		const atmosphereProgram = new Program(gl, {
			vertex: vertexShader,
			fragment: atmosphereFragmentShader,
			uniforms,
			transparent: true,
			depthTest: false,
			depthWrite: false,
		});
		atmosphereProgram.setBlendFunc(gl.SRC_ALPHA, gl.ONE);

		// OGL console.warns and returns when a program fails to link, so a shader
		// that is too big for the device draws nothing and says nothing useful.
		// Report it against the device's actual limit, which is the number that
		// explains the failure.
		for (const [name, program] of [
			["globe", globeProgram],
			["atmosphere", atmosphereProgram],
		] as const) {
			if (gl.getProgramParameter(program.program, gl.LINK_STATUS)) continue;
			console.error(
				`GlobeScene: the ${name} program failed to link. ` +
					`MAX_FRAGMENT_UNIFORM_VECTORS on this device is ${gl.getParameter(
						gl.MAX_FRAGMENT_UNIFORM_VECTORS,
					)}.`,
				gl.getProgramInfoLog(program.program),
			);
		}

		const globeMesh = new Mesh(gl, {
			geometry,
			program: globeProgram,
			frustumCulled: false,
		});
		globeMesh.setParent(globeScene);

		const atmosphereMesh = new Mesh(gl, {
			geometry,
			program: atmosphereProgram,
			frustumCulled: false,
		});
		atmosphereMesh.setParent(atmosphereScene);

		const currentScale = DEFAULT_GLOBE_SCALE;
		const tempColor = new Vec3();
		const setColor = (
			target: Vec3,
			value: ColorRepresentation,
			fallback: [number, number, number],
		) => {
			const [r, g, b] = toLinearRgb(value, fallback);
			target.set(r, g, b);
		};

		const applySettings = () => {
			const s = settingsRef.current;
			uniforms.uScale.value = DEFAULT_GLOBE_SCALE;
			uniforms.uDisplayScale.value = Math.max(0.001, s.scale);
			uniforms.uDisplayOffset.value.set(s.offsetX, s.offsetY);
			uniforms.uDots.value = Math.max(1, Math.floor(s.pointCount));
			uniforms.uPointRadius.value = toPointRadius(s.pointSize);

			setColor(uniforms.uBaseColor.value, s.fresnelConfig.color, [
				17 / 255,
				17 / 255,
				19 / 255,
			]);
			setColor(uniforms.uRimColor.value, s.fresnelConfig.rimColor, [
				1,
				105 / 255,
				0,
			]);
			uniforms.uRimPower.value = Math.max(0.0001, s.fresnelConfig.rimPower);
			uniforms.uRimIntensity.value = Math.max(0, s.fresnelConfig.rimIntensity);

			setColor(uniforms.uAtmosphereColor.value, s.atmosphereConfig.color, [
				1,
				105 / 255,
				0,
			]);
			uniforms.uAtmosphereScale.value = Math.max(1, s.atmosphereConfig.scale);
			uniforms.uAtmospherePower.value = Math.max(
				0.0001,
				s.atmosphereConfig.power,
			);
			uniforms.uAtmosphereCoefficient.value = Math.max(
				0,
				s.atmosphereConfig.coefficient,
			);
			uniforms.uAtmosphereIntensity.value = Math.max(
				0,
				s.atmosphereConfig.intensity,
			);

			setColor(tempColor, s.landPointColor, [247 / 255, 113 / 255, 20 / 255]);
			uniforms.uLandPointColor.value.set(tempColor.x, tempColor.y, tempColor.z);
		};

		applySettings();

		let width = 1;
		let height = 1;

		const startTheta = clampTheta(0, initial.lockedPolarAngle);
		let phi = 0;
		let theta = startTheta;
		let targetPhi = phi;
		let targetTheta = startTheta;
		let focusTween: gsap.core.Tween | null = null;

		const applyDisplayTransform = (x: number, y: number, aspect: number) => {
			const s = settingsRef.current;
			const nextScale = Math.max(0.001, s.scale);
			const ax = x * aspect * nextScale;
			const ay = y * nextScale;
			return {
				x: (ax + s.offsetX * aspect * 2) / aspect,
				y: ay - s.offsetY * 2,
			};
		};

		const syncMarkers = (
			currentPhi: number,
			currentTheta: number,
			scaleValue: number,
		) => {
			const list = settingsRef.current.markers;
			const markerRadius = COBE_GLOBE_RADIUS;
			const aspect = width / Math.max(1, height);
			const markerCount = Math.min(list.length, MAX_SHADER_MARKERS);
			markerData.fill(0);
			markerColorData.fill(0);
			uniforms.uMarkerCount.value = markerCount;

			for (let index = 0; index < list.length; index++) {
				const marker = list[index];
				const pos = lonLatToCartesian(
					marker.location[1],
					marker.location[0],
					markerRadius,
				);
				const rotated = applyRotation(
					pos.x,
					pos.y,
					pos.z,
					currentPhi,
					currentTheta,
				);

				const ndcX = (rotated.rx / aspect) * scaleValue;
				const ndcY = -rotated.ry * scaleValue;
				const transformed = applyDisplayTransform(ndcX, ndcY, aspect);
				const screenX = (transformed.x + 1) * 0.5;
				const screenY = (transformed.y + 1) * 0.5;

				const frontDot = rotated.rz / markerRadius;
				const visibility = dynamicEase(
					smoothstep(frontDot, VISIBILITY_MIN_DOT, VISIBILITY_MAX_DOT),
				);

				// Write straight to the DOM; no React state in the render loop.
				const el = markerElsRef.current[index];
				if (el) {
					el.style.left = `${screenX * 100}%`;
					el.style.top = `${screenY * 100}%`;
					el.style.opacity = String(visibility);
					el.style.filter = `blur(${(1 - visibility) * MAX_TOOLTIP_BLUR}px)`;
					el.style.visibility = visibility < 0.01 ? "hidden" : "visible";
				}

				if (index >= markerCount) continue;

				const unitPos = lonLatToCartesian(
					marker.location[1],
					marker.location[0],
					1,
				);
				const o = index * 4;
				markerData[o] = unitPos.x;
				markerData[o + 1] = unitPos.y;
				markerData[o + 2] = unitPos.z;
				markerData[o + 3] = clamp(
					(marker.size ?? 0.05) * SHADER_MARKER_SIZE_SCALE,
					MIN_SHADER_MARKER_SIZE,
					MAX_SHADER_MARKER_SIZE,
				);

				const [r, g, b] = toLinearRgb(marker.color ?? "#ffffff", [1, 1, 1]);
				const co = index * 3;
				markerColorData[co] = r;
				markerColorData[co + 1] = g;
				markerColorData[co + 2] = b;
			}
		};

		const focus = (target: [number, number] | null) => {
			focusTween?.kill();
			focusTween = null;
			if (!target) return;

			const [lat, lon] = target;
			const dir = lonLatToCartesian(lon, lat, 1);
			const rotation = cartesianToRotation(dir.x, dir.y, dir.z);
			const lock = settingsRef.current.lockedPolarAngle;
			const desiredTheta = clampTheta(rotation.theta, lock);
			const desiredPhi = shortestAngleTarget(targetPhi, rotation.phi);

			const tweenState = { phi: targetPhi, theta: targetTheta };
			focusTween = gsap.to(tweenState, {
				phi: desiredPhi,
				theta: desiredTheta,
				duration: 1.5,
				ease: "power2.inOut",
				onUpdate: () => {
					targetPhi = tweenState.phi;
					targetTheta = clampTheta(tweenState.theta, lock);
				},
				overwrite: true,
			});
		};

		apiRef.current = { applySettings, focus };
		focus(initialFocusRef.current);

		let dragging = false;
		let activePointerId = -1;
		let lastPointerX = 0;
		let lastPointerY = 0;

		const onPointerDown = (event: PointerEvent) => {
			if (event.button !== 0) return;
			dragging = true;
			activePointerId = event.pointerId;
			lastPointerX = event.clientX;
			lastPointerY = event.clientY;
			canvas.setPointerCapture(event.pointerId);
			focusTween?.kill();
			focusTween = null;
		};

		const onPointerMove = (event: PointerEvent) => {
			if (!dragging || event.pointerId !== activePointerId) return;
			const dx = event.clientX - lastPointerX;
			const dy = event.clientY - lastPointerY;
			lastPointerX = event.clientX;
			lastPointerY = event.clientY;
			targetPhi += dx * ROTATE_SENSITIVITY;
			targetTheta = clampTheta(
				targetTheta + dy * ROTATE_SENSITIVITY,
				settingsRef.current.lockedPolarAngle,
			);
		};

		const stopDragging = (event: PointerEvent) => {
			if (event.pointerId !== activePointerId) return;
			dragging = false;
			activePointerId = -1;
		};

		canvas.addEventListener("pointerdown", onPointerDown);
		canvas.addEventListener("pointermove", onPointerMove);
		canvas.addEventListener("pointerup", stopDragging);
		canvas.addEventListener("pointercancel", stopDragging);
		canvas.addEventListener("lostpointercapture", stopDragging);

		let disposed = false;
		const image = new Image();
		image.onload = () => {
			if (disposed) return;
			landTexture.image = image;
			landTexture.generateMipmaps = true;
			landTexture.minFilter = gl.NEAREST_MIPMAP_NEAREST;
			landTexture.magFilter = gl.NEAREST;
			landTexture.needsUpdate = true;
		};
		image.onerror = () => {
			console.warn("GlobeScene: failed to load the land mask texture");
		};
		image.src = LAND_TEXTURE_URL;

		let raf = 0;
		let previous = 0;
		let onScreen = true;
		let pageVisible = !document.hidden;

		const shouldRun = () => onScreen && pageVisible;

		const startLoop = () => {
			if (raf || !shouldRun()) return;
			previous = 0;
			raf = window.requestAnimationFrame(tick);
		};
		const stopLoop = () => {
			if (raf) window.cancelAnimationFrame(raf);
			raf = 0;
		};

		const tick = (now: number) => {
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			if (w === 0 || h === 0) {
				raf = window.requestAnimationFrame(tick);
				return;
			}
			const bufW = Math.round(w * renderer.dpr);
			const bufH = Math.round(h * renderer.dpr);
			if (canvas.width !== bufW || canvas.height !== bufH) {
				canvas.width = bufW;
				canvas.height = bufH;
				renderer.width = w;
				renderer.height = h;
				renderer.state.viewport = { x: 0, y: 0, width: null, height: null };
				width = w;
				height = h;
				uniforms.uResolution.value.set(w, h);
			}
			const delta = previous ? (now - previous) / 1000 : 0;
			previous = now;
			uniforms.uTime.value += delta;

			const s = settingsRef.current;
			if (s.autoRotate) targetPhi -= AUTO_ROTATE_SPEED * delta;
			targetTheta = clampTheta(targetTheta, s.lockedPolarAngle);

			const easing = 1 - Math.exp(-delta * SMOOTHING_STRENGTH);
			phi += (targetPhi - phi) * easing;
			theta += (targetTheta - theta) * easing;

			uniforms.uRotation.value.set(phi, theta);

			syncMarkers(phi, theta, currentScale);
			renderer.render({ scene: globeScene, camera, clear: true });
			renderer.render({ scene: atmosphereScene, camera, clear: false });
			raf = shouldRun() ? window.requestAnimationFrame(tick) : 0;
		};

		// The globe is the most expensive thing on the page; never run it while it
		// is scrolled away or the tab is in the background.
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

		// preventDefault() is what tells the browser this canvas wants the context
		// back; without it `webglcontextrestored` never fires and the globe is gone
		// for the rest of the session.
		const onContextLost = (event: Event) => {
			event.preventDefault();
			stopLoop();
		};
		const onContextRestored = () => setContextGeneration((g) => g + 1);
		canvas.addEventListener("webglcontextlost", onContextLost);
		canvas.addEventListener("webglcontextrestored", onContextRestored);

		startLoop();

		return () => {
			disposed = true;
			apiRef.current = null;
			focusTween?.kill();
			window.cancelAnimationFrame(raf);
			canvas.removeEventListener("pointerdown", onPointerDown);
			canvas.removeEventListener("pointermove", onPointerMove);
			canvas.removeEventListener("pointerup", stopDragging);
			canvas.removeEventListener("pointercancel", stopDragging);
			canvas.removeEventListener("lostpointercapture", stopDragging);
			canvas.removeEventListener("webglcontextlost", onContextLost);
			canvas.removeEventListener("webglcontextrestored", onContextRestored);
			observer.disconnect();
			document.removeEventListener("visibilitychange", onVisibilityChange);

			globeMesh.setParent(null);
			atmosphereMesh.setParent(null);
			geometry.remove();
			globeProgram.remove();
			atmosphereProgram.remove();
			if (landTexture.texture) gl.deleteTexture(landTexture.texture);
			gl.getExtension("WEBGL_lose_context")?.loseContext();
		};
	}, [contextGeneration]);

	return (
		<>
			{/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: a canvas with no tabindex is not focusable; the globe is decorative and markers carry the text */}
			<canvas
				ref={canvasRef}
				aria-hidden="true"
				className="absolute inset-0 block h-full w-full"
				style={{ width: "100%", height: "100%", touchAction: "none" }}
			/>

			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				{markers.map((marker, index) => (
					<div
						key={marker.label ?? `${marker.location[0]},${marker.location[1]}`}
						ref={(el) => {
							markerElsRef.current[index] = el;
						}}
						className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
						style={{ opacity: 0 }}
					>
						{renderMarker ? (
							renderMarker(marker, index)
						) : marker.label ? (
							<div className="rounded-sm bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background">
								{marker.label}
							</div>
						) : null}
					</div>
				))}
			</div>
		</>
	);
}
