/**
 * Signals when the entry sequence is over.
 *
 * The preloader lives in the root shell and the hero lives in the route, so they
 * are siblings with no shared state. Anything that must hold until the curtain
 * lifts subscribes here rather than to its own visibility — the hero copy is
 * *in* the viewport the whole time the preloader covers it, so an
 * IntersectionObserver fires immediately and the animation is over before
 * anyone can see it.
 */

export const INTRO_DONE_EVENT = "vsips:intro-done";

let done = false;

export const isIntroDone = () => done;

export function markIntroDone() {
	if (done) return;
	done = true;
	window.dispatchEvent(new CustomEvent(INTRO_DONE_EVENT));
}

/**
 * Runs `callback` when the intro finishes, or immediately if it already has —
 * a returning visitor skips the preloader, and the root shell's effects run
 * before the route's, so subscribers can easily arrive after the fact.
 *
 * The already-done path is synchronous on purpose. Deferring it to
 * requestAnimationFrame meant anything pre-hidden by the subscriber stayed
 * hidden if that frame never arrived.
 */
export function onIntroDone(callback: () => void): () => void {
	if (done) {
		callback();
		return () => {};
	}
	const handler = () => callback();
	window.addEventListener(INTRO_DONE_EVENT, handler, { once: true });
	return () => window.removeEventListener(INTRO_DONE_EVENT, handler);
}
