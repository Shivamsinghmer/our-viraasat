import {
	BASELINE_Y,
	measureWord,
	REF_FS,
	type WordMetrics,
} from "#/components/design-tiles/measure";
import {
	INITIAL,
	randomSwatchAvoiding,
	type Swatch,
	WORDS,
} from "#/components/design-tiles/palette";

const SVGNS = "http://www.w3.org/2000/svg";

const FLY_STAGGER = 130;
const FLY_MS = 760;
const SHUFFLE_MIN = 1300;
const SHUFFLE_MAX = 3200;
const COLOR_MS = 520;

const PAD_Y = 6;
const PAD_X = 2;

const BAND_ASCENT = 82;
const BAND_DESCENT = 26;

type LetterRect = {
	el: SVGRectElement;
	x0: number;
	x1: number;
	baseY: number;
	baseH: number;
	hovered: boolean;
};

type Tile = {
	outer: HTMLSpanElement;
	svg: SVGSVGElement;
	rects: LetterRect[];
	textEl: SVGTextElement;
	word: string;
	swatch: Swatch;
};

/**
 * A short sentence laid out as adjacent solid-colour tiles packed edge to edge.
 * Tiles wipe open left-to-right on reveal via grid-template-columns (not
 * scaleX, so the text never distorts), then idly re-roll their swatch.
 */
export class DesignTiles {
	private host: HTMLElement;
	private root: HTMLDivElement;
	private tiles: Tile[] = [];
	private fontFamily = "sans-serif";

	private timers: number[] = [];
	private running = false;
	private disposed = false;
	private revealed = false;

	private ro?: ResizeObserver;
	private cleanup: (() => void)[] = [];

	constructor(host: HTMLElement) {
		this.host = host;

		const root = document.createElement("div");
		Object.assign(root.style, {
			display: "flex",
			alignItems: "center",
			justifyContent: "flex-start",
			userSelect: "none",
		});
		root.setAttribute("aria-label", WORDS.join(" "));
		root.setAttribute("role", "img");

		const bar = document.createElement("div");
		Object.assign(bar.style, {
			display: "flex",
			alignItems: "center",
			borderRadius: "10px",
			overflow: "hidden",
		});

		host.appendChild(root);
		this.root = root;
		this.fontFamily =
			getComputedStyle(root).fontFamily || "system-ui, sans-serif";

		WORDS.forEach((word, i) => {
			const sw = INITIAL[i] ?? randomSwatchAvoiding([]);

			const outer = document.createElement("span");
			Object.assign(outer.style, {
				display: "grid",
				gridTemplateColumns: "0fr",
				transition: `grid-template-columns ${FLY_MS}ms cubic-bezier(.16,1,.3,1)`,
			});
			const clip = document.createElement("span");
			clip.style.overflow = "hidden";

			const svg = document.createElementNS(SVGNS, "svg");
			Object.assign(svg.style, {
				display: "block",
				height: "clamp(2rem, 5vw, 3.6rem)",
				opacity: "0",
				transition: `opacity ${Math.round(FLY_MS * 0.8)}ms ease`,
			});

			const gBg = document.createElementNS(SVGNS, "g");
			const textEl = document.createElementNS(SVGNS, "text");
			textEl.setAttribute("font-family", this.fontFamily);
			textEl.setAttribute("font-weight", "600");
			textEl.setAttribute("font-size", String(REF_FS));
			textEl.setAttribute("dominant-baseline", "alphabetic");
			textEl.style.fill = sw.fg;
			textEl.style.transition = `fill ${COLOR_MS}ms ease`;
			textEl.textContent = word;

			svg.appendChild(gBg);
			svg.appendChild(textEl);
			clip.appendChild(svg);
			outer.appendChild(clip);
			bar.appendChild(outer);

			this.tiles.push({
				outer,
				svg,
				rects: [],
				textEl,
				word,
				swatch: sw,
			});
		});

		root.appendChild(bar);

		this.layout();
		this.bindEvents();
	}

	private layout() {
		for (const tile of this.tiles) {
			const m = measureWord(tile.word, this.fontFamily, "600");
			for (const r of tile.rects) r.el.remove();
			tile.rects = [];
			if (!m) {
				this.buildFallback(tile);
				continue;
			}
			this.buildRects(tile, m);
		}
	}

	private buildRects(tile: Tile, m: WordMetrics) {
		const gBg = tile.svg.firstChild as SVGGElement;
		const bandTop = BASELINE_Y - BAND_ASCENT;
		const bandBottom = BASELINE_Y + BAND_DESCENT;

		for (let i = 0; i < m.glyphs.length; i++) {
			const g = m.glyphs[i];
			if (g.ch === " ") continue;
			const top = Math.max(bandTop, g.top - PAD_Y);
			const bottom = Math.min(bandBottom, g.bottom + PAD_Y);

			const next = m.glyphs[i + 1];
			const right = next ? next.x : g.x + g.w;
			const left = g.x - (i === 0 ? PAD_X : 0);
			const width = right - left + PAD_X;

			const rect = document.createElementNS(SVGNS, "rect");
			rect.setAttribute("x", String(left));
			rect.setAttribute("y", String(top));
			rect.setAttribute("width", String(width));
			rect.setAttribute("height", String(bottom - top));
			rect.style.fill = tile.swatch.bg;
			rect.style.transition = `fill ${COLOR_MS}ms ease, y 160ms ease, height 160ms ease`;
			gBg.appendChild(rect);

			tile.rects.push({
				el: rect,
				x0: left,
				x1: left + width,
				baseY: top,
				baseH: bottom - top,
				hovered: false,
			});
		}

		tile.textEl.setAttribute("x", "0");
		tile.textEl.setAttribute("y", String(BASELINE_Y));
		const vbX = -PAD_X;
		const vbW = m.width + PAD_X * 2;
		const vbY = bandTop;
		const vbH = bandBottom - bandTop;
		tile.svg.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);
		tile.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
		tile.svg.removeAttribute("width");
		tile.svg.removeAttribute("height");
		tile.svg.style.width = "auto";
	}

	private buildFallback(tile: Tile) {
		const gBg = tile.svg.firstChild as SVGGElement;
		const rect = document.createElementNS(SVGNS, "rect");
		rect.setAttribute("x", "0");
		rect.setAttribute("y", "0");
		rect.setAttribute("width", "100");
		rect.setAttribute("height", "100");
		rect.style.fill = tile.swatch.bg;
		gBg.appendChild(rect);
		tile.rects.push({
			el: rect,
			x0: 0,
			x1: 100,
			baseY: 0,
			baseH: 100,
			hovered: false,
		});
		tile.svg.setAttribute("viewBox", "0 0 100 100");
	}

	private bindEvents() {
		for (const tile of this.tiles) {
			const onEnter = () => this.recolor(tile);
			const onMove = (e: PointerEvent) => this.hoverLetter(tile, e);
			const onLeave = () => this.clearHover(tile);
			tile.svg.addEventListener("pointerenter", onEnter);
			tile.svg.addEventListener("pointermove", onMove);
			tile.svg.addEventListener("pointerleave", onLeave);
			this.cleanup.push(() => {
				tile.svg.removeEventListener("pointerenter", onEnter);
				tile.svg.removeEventListener("pointermove", onMove);
				tile.svg.removeEventListener("pointerleave", onLeave);
			});
		}

		this.ro = new ResizeObserver(() => this.layout());
		this.ro.observe(this.host);
	}

	private hoverLetter(tile: Tile, e: PointerEvent) {
		const rect = tile.svg.getBoundingClientRect();
		if (rect.width < 1) return;
		const vb = tile.svg.viewBox.baseVal;
		const scale = vb.width / rect.width;
		const grow = 2 * scale;
		const px = vb.x + ((e.clientX - rect.left) / rect.width) * vb.width;

		for (const r of tile.rects) {
			const isHit = px >= r.x0 && px < r.x1;
			if (isHit === r.hovered) continue;
			r.hovered = isHit;
			if (isHit) {
				r.el.style.y = `${r.baseY - grow / 2}px`;
				r.el.style.height = `${r.baseH + grow}px`;
			} else {
				r.el.style.y = `${r.baseY}px`;
				r.el.style.height = `${r.baseH}px`;
			}
		}
	}

	private clearHover(tile: Tile) {
		for (const r of tile.rects) {
			if (!r.hovered) continue;
			r.hovered = false;
			r.el.style.y = `${r.baseY}px`;
			r.el.style.height = `${r.baseH}px`;
		}
	}

	private recolor(tile: Tile) {
		const used = this.tiles.filter((t) => t !== tile).map((t) => t.swatch);
		const sw = randomSwatchAvoiding(used);
		tile.swatch = sw;
		for (const r of tile.rects) r.el.style.fill = sw.bg;
		tile.textEl.style.fill = sw.fg;
	}

	refreshFont() {
		this.fontFamily = getComputedStyle(this.root).fontFamily || this.fontFamily;
		for (const tile of this.tiles) {
			tile.textEl.setAttribute("font-family", this.fontFamily);
		}
		this.layout();
	}

	private reveal() {
		if (this.revealed) return;
		this.revealed = true;
		this.tiles.forEach((tile, i) => {
			const t = window.setTimeout(() => {
				tile.outer.style.gridTemplateColumns = "1fr";
				tile.svg.style.opacity = "1";
			}, i * FLY_STAGGER);
			this.cleanup.push(() => window.clearTimeout(t));
		});
		const assembledAt = this.tiles.length * FLY_STAGGER + FLY_MS;
		for (const tile of this.tiles) {
			this.scheduleShuffle(
				tile,
				assembledAt + SHUFFLE_MIN + Math.random() * (SHUFFLE_MAX - SHUFFLE_MIN),
			);
		}
	}

	start() {
		if (this.running || this.disposed) return;
		this.running = true;
		this.reveal();
	}

	stop() {
		this.running = false;
		for (const id of this.timers) window.clearTimeout(id);
		this.timers = [];
	}

	/**
	 * One timer per tile rather than a frame loop. The original polled shuffle
	 * deadlines inside requestAnimationFrame, which meant a 60fps loop running
	 * for the life of the page purely to compare two numbers.
	 */
	private scheduleShuffle(tile: Tile, delay: number) {
		const id = window.setTimeout(() => {
			if (!this.running || this.disposed) return;
			this.recolor(tile);
			this.scheduleShuffle(
				tile,
				SHUFFLE_MIN + Math.random() * (SHUFFLE_MAX - SHUFFLE_MIN),
			);
		}, delay);
		this.timers.push(id);
	}

	/** Assembled, static — used for reduced motion. */
	renderStill() {
		this.revealed = true;
		for (const tile of this.tiles) {
			tile.outer.style.transition = "none";
			tile.outer.style.gridTemplateColumns = "1fr";
			tile.svg.style.transition = "none";
			tile.svg.style.opacity = "1";
		}
	}

	destroy() {
		this.disposed = true;
		this.stop();
		this.ro?.disconnect();
		for (const fn of this.cleanup) fn();
		this.root.parentNode?.removeChild(this.root);
	}
}
