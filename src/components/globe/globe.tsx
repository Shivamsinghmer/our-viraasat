import type { ComponentPropsWithoutRef } from "react";
import {
	GlobeScene,
	type GlobeSceneProps,
} from "#/components/globe/globe-scene";
import { cn } from "#/lib/utils";

export interface GlobeProps
	extends GlobeSceneProps,
		Omit<ComponentPropsWithoutRef<"div">, keyof GlobeSceneProps> {
	className?: string;
}

export function Globe({ className, ...scene }: GlobeProps) {
	return (
		<div className={cn("relative h-full w-full overflow-hidden", className)}>
			<div className="absolute inset-0 z-0">
				<GlobeScene {...scene} />
			</div>
		</div>
	);
}
