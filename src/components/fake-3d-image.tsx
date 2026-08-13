import type { ComponentPropsWithoutRef } from "react";
import {
	Fake3DImageScene,
	type Fake3DImageSceneProps,
} from "#/components/fake-3d-image-scene";
import { cn } from "#/lib/utils";

export interface Fake3DImageProps
	extends Fake3DImageSceneProps,
		Omit<ComponentPropsWithoutRef<"div">, keyof Fake3DImageSceneProps> {
	/** Additional CSS classes for the container. */
	className?: string;
}

export function Fake3DImage({
	colorSrc,
	depthSrc,
	xThreshold = 8,
	yThreshold = 8,
	sensitivity = 0.25,
	transitionDuration = 1.2,
	transitionOrigin,
	className,
	...rest
}: Fake3DImageProps) {
	return (
		<div
			className={cn("relative h-full w-full overflow-hidden", className)}
			{...rest}
		>
			<div className="absolute inset-0 z-0">
				<Fake3DImageScene
					colorSrc={colorSrc}
					depthSrc={depthSrc}
					xThreshold={xThreshold}
					yThreshold={yThreshold}
					sensitivity={sensitivity}
					transitionDuration={transitionDuration}
					transitionOrigin={transitionOrigin}
				/>
			</div>
		</div>
	);
}
