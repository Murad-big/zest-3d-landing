# ZEST — little can, big summer

An art-directed, animated Russian-language landing page for a fictional premium citrus soda brand. A portfolio project built with semantic HTML, modern CSS, and Three.js.

[Open the live demo](https://zest-citrus-studio.richard-cabrer849537.chatgpt.site) — currently published with owner-only access.

## Development milestones

- [x] Brand concept, visual direction, and original product photography
- [x] Responsive landing page and flavor collection
- [x] Interactive real-time 3D product scene
- [x] Accessible mix builder, motion controls, and browser verification
- [x] Second design pass: refined materials and typography, touch rotation, persistent mix dock

## Local preview

Requires Node.js 18 or later. No package installation or build step is needed.

```sh
node server.mjs
```

Open http://localhost:4173. Deploy the `dist` directory to any static host.

## Design

Acid yellow, near-black, and forest green. Oversized Cyrillic typography. A floating aluminum can is the central product interaction; three flavor palettes connect it to the collection. The final section uses original generated citrus product photography.

## Credits and scope

- Three.js 0.180.0 — MIT license, vendored locally.
- Golos Text and Roboto Condensed — SIL Open Font License, served locally.
- Original product imagery generated with OpenAI ImageGen.
- ZEST is a fictional portfolio brand. Product pricing and descriptions are demonstrative; the website does not process payments or transmit orders.

All application assets and fonts are local; the site requires no external runtime API.

## Features

- A real Three.js aluminum can with a detailed lid, printed texture, instanced condensation, and studio reflections.
- Damped mouse and touch rotation, keyboard rotation and reset, subtle floating motion, three animated flavor palettes, and a pause control.
- `prefers-reduced-motion`, offscreen rendering suspension, a WebGL fallback, and a capped device pixel ratio.
- Collection product images rendered once from the same model, using only one WebGL context.
- Native accessible dialog with a six-can mix builder, quantity limits, price calculation, and a UTF-8 text download.
- A floating mix summary, one-click balanced selection, clear action, and validated local storage that restores the mix after reload.
- Mobile navigation, scroll reveals, focus restoration, semantic sections, and keyboard controls.

## Verified

Chromium browser checks passed at widths **320, 390, 768, and 1440 px**, with desktop and mobile screenshot review. Checked canvas pause and keyboard rotation, flavor material changes, opening the dialog while motion is paused, quantity limits, totals, downloaded file content, balanced selection, persistence, malformed storage recovery, Escape and focus return, mobile navigation, reduced motion, image loading, and horizontal overflow. No browser console errors or warnings remained. The keyboard skip link was also checked separately after its final visual refinement.

## Files

```text
dist/index.html       Semantic page and accessible dialog
dist/styles.css       Design system, animation, responsive layouts
dist/app.js           Navigation, flavor state, mix builder
dist/scene.js         Three.js model, materials, rendering lifecycle
dist/data.js          Flavors and demonstrative prices
dist/assets/          Original product images, fonts, favicon
dist/vendor/          Pinned Three.js modules and license
server.mjs            Dependency-free local preview
DESIGN.md             Art direction and implementation decisions
ASSETS.md             Image generation provenance
```
