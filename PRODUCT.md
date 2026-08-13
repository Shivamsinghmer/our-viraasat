# Product

## Register

brand

## Users

Competition judges evaluating submissions for the Thematic Website Development Competition 2026 ("Code for the Nation"). They are technically literate, visually trained, and reviewing many entries — the site must demonstrate exceptional craft and stand apart from the field on first impression and sustained engagement.

## Product Purpose

A digital heritage exhibition showcasing India's built and living heritage — 45 UNESCO World Heritage properties, eight classical dance forms, and 4,500 years of recorded history. The site exists to prove that technical excellence and cultural respect can coexist at a high level. Success means the judges experience the content as deeply considered, visually immersive, and technically flawless.

## Brand Personality

Technical and polished. The voice is scholarly without being dry — every detail is deliberate, every interaction is refined. The site should feel like walking through a well-curated exhibition: immersive, respectful, precise. No shortcuts, no decoration for its own sake. The craftsmanship should be visible in the details, not announced with banners.

## Anti-references

- **Generic SaaS / AI slop**: Cream backgrounds, identical icon+heading+text cards, tiny uppercase kickers on every section, gradient text, numbered section markers (01/02/03). The scaffold is the tell.
- **Playful / startup-y**: Bubbly animations, rounded-everything, overly friendly copy, mascot energy. This is heritage, not a fintech onboarding flow.
- **Dark hacker / crypto**: Dark theme with neon accents, tech-bro energy. The darkness in this site serves the saffron/green tricolour and the globe's atmosphere — not an aesthetic choice for edginess.
- **Government portal**: Sterile, text-heavy, no visual identity. The opposite of immersive. Content depth is right; delivery is wrong.

## Design Principles

1. **Craft is the argument.** Every component, transition, and spacing choice must be defensible. Judges are evaluating the build quality as much as the content. No element should exist without a reason; no animation should fire without purpose.

2. **Heritage demands restraint.** The content carries weight — monuments, temples, dances that survived centuries. The design must amplify that weight, not compete with it. Let the photographs and the text do the talking; the UI frame should be invisible.

3. **Immersive, not decorative.** Motion, 3D, and WebGL exist to deepen understanding of the subject, not to show off. The globe locates India. The fake-3D parallax gives a photograph spatial presence. Each technique has a narrative purpose.

4. **Respect the material.** Devanagari script, Sanskrit verses, regional dance traditions — these are not exotic set dressing. Typography must handle them properly. Attribution must be thorough. Licensing must be transparent.

5. **Polish at every layer.** From the hero's preloader hand-off to the footer's tricolour gradient, every surface must feel finished. Judges will find the seams; make sure the seams are intentional.

## Accessibility & Inclusion

- `prefers-reduced-motion` is handled throughout (GSAP contexts check it, typed headings skip animation, preloader adapts).
- All images have meaningful alt text (identification, not decoration).
- Keyboard navigation: hero button is a real `<button>`, globe toggle uses `aria-pressed`, nav links are focusable.
- The site is built on semantic HTML with proper heading hierarchy and landmark regions.
- Sanskrit/Hindi text uses Noto Serif Devanagari with appropriate font stack.
- No content is gated behind hover or click — everything is visible by default, enhanced by interaction.
