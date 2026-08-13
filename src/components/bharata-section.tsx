import { useState } from "react";
import { Globe } from "#/components/globe/globe";
import type { GlobeMarker } from "#/components/globe/types";
import { Reveal } from "#/components/reveal";
import { TypedHeading } from "#/components/typed-heading";

/** Roughly the geographic centre of India, used to frame the globe. */
const INDIA: [number, number] = [22.5, 79.0];

const markers: GlobeMarker[] = [
	{ location: INDIA, label: "भारत · India", color: "#ffffff", size: 0.055 },
];

/**
 * The verse the section is built around. Dark on purpose: the globe's saffron
 * rim and atmosphere only read against a dark stage, the same reason the footer
 * is navy.
 */
export function BharataSection() {
	// Free rotate by default: the globe turning on arrival reads as alive, and
	// the marker is still one tap away via Locate India.
	const [locked, setLocked] = useState(false);

	return (
		<section className="relative overflow-hidden bg-accent text-white">
			<div className="mx-auto grid w-full max-w-6xl items-start gap-16 px-6 py-24 md:grid-cols-[1fr_0.9fr] md:gap-20 md:px-10 md:py-36">
				<Reveal>
					<div className="flex flex-col gap-8">
						<div>
							<p className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
								Where it is
							</p>
							<TypedHeading
								as="h2"
								className="typer-on-image mt-5 text-3xl font-bold tracking-tight text-balance md:text-4xl"
							>
								The land between the mountains and the sea
							</TypedHeading>
						</div>

						<figure className="flex flex-col gap-5">
							<blockquote className="font-devanagari border-white/20 border-l pl-5 text-lg leading-[1.9] text-white/90 md:text-xl">
								<p>उत्तरं यत् समुद्रस्य हिमाद्रेश्चैव दक्षिणम्‌।</p>
								<p>वर्षं तद् भारतं नाम भारती यत्र सन्ततिः॥</p>
							</blockquote>

							<figcaption className="flex flex-col gap-3 pl-5">
								<p className="font-devanagari text-white/60 leading-relaxed">
									जो समुद्र के उत्तर और हिमालय के दक्षिण में स्थित भूभाग है, वही भारतवर्ष
									कहलाता है, और वहाँ की संतति भारती कहलाती है।
								</p>
								<p className="text-sm text-white/45">
									"The land that lies north of the ocean and south of the snowy
									mountains is called Bhārata; and its people, the Bhāratī."
								</p>
								<cite className="font-mono text-[10px] tracking-[0.14em] text-white/30 uppercase not-italic">
									Viṣṇu Purāṇa 2.3.1
								</cite>
							</figcaption>
						</figure>

						<p className="max-w-md text-sm leading-relaxed text-white/50">
							A definition written by geography rather than by border: the
							Himalaya to the north, the ocean on three sides. Every monument on
							this site sits inside it.
						</p>
					</div>
				</Reveal>

				<Reveal delay={0.12}>
					<div className="flex flex-col items-center gap-5">
						<div className="relative aspect-square w-full max-w-[480px]">
							<Globe
								markers={markers}
								focusOn={locked ? INDIA : null}
								autoRotate={!locked}
								lockedPolarAngle={false}
								pointCount={26000}
								pointSize={0.055}
								fresnelConfig={{
									color: "#05052B",
									rimColor: "#FF9933",
									rimPower: 8,
									rimIntensity: 1.1,
								}}
								atmosphereConfig={{
									color: "#FF9933",
									scale: 1.08,
									power: 14,
									coefficient: 0.9,
									intensity: 0.9,
								}}
								landPointColor="#1FA30F"
								renderMarker={(marker) => (
									<div className="-translate-y-9 relative rounded-sm bg-white px-2 py-1 font-mono text-[10px] font-semibold tracking-wide whitespace-nowrap text-accent uppercase">
										{marker.label}
										<span className="absolute top-[calc(100%-1px)] left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-white" />
									</div>
								)}
								className="h-full w-full"
							/>
						</div>

						<div className="flex gap-1 rounded-sm bg-white/10 p-1">
							<button
								type="button"
								onClick={() => setLocked(true)}
								aria-pressed={locked}
								className={`rounded-xs px-3 py-1.5 font-medium text-xs tracking-wide uppercase transition-colors duration-300 ${
									locked
										? "bg-primary text-primary-foreground"
										: "text-white/60 hover:text-white"
								}`}
							>
								Locate India
							</button>
							<button
								type="button"
								onClick={() => setLocked(false)}
								aria-pressed={!locked}
								className={`rounded-xs px-3 py-1.5 font-medium text-xs tracking-wide uppercase transition-colors duration-300 ${
									locked
										? "text-white/60 hover:text-white"
										: "bg-primary text-primary-foreground"
								}`}
							>
								Free rotate
							</button>
						</div>

						<p className="text-center text-[11px] text-white/30">
							Drag the globe to turn it.
						</p>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
