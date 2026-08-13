import type { ColorRepresentation } from "#/lib/color";

export interface GlobeMarker {
	/** Latitude and longitude, as [lat, lon]. */
	location: [number, number];
	/** Marker size in world units. @default 0.05 */
	size?: number;
	/** Marker colour. @default "#ffffff" */
	color?: string;
	/** Fallback tooltip text when no custom renderer is supplied. */
	label?: string;
}

export interface FresnelConfig {
	/** Base body colour for the globe surface. */
	color?: ColorRepresentation;
	/** Accent colour applied by the Fresnel rim. */
	rimColor?: ColorRepresentation;
	/** How tightly the rim hugs the sphere; higher is thinner. */
	rimPower?: number;
	/** Intensity multiplier for the rim colour. */
	rimIntensity?: number;
}

export interface AtmosphereConfig {
	/** Colour of the atmospheric glow. */
	color?: ColorRepresentation;
	/** Size of the atmosphere relative to the globe radius. */
	scale?: number;
	/** Falloff power of the glow; higher is a sharper edge. */
	power?: number;
	/** Base coefficient controlling how far the glow reaches inward. */
	coefficient?: number;
	/** Global intensity multiplier. */
	intensity?: number;
}
