# ZEST — little can, big summer

An art-directed, animated Russian-language landing page for a fictional premium citrus soda brand. A portfolio project built with semantic HTML, modern CSS, and Three.js.

[Open the live demo](https://zest-citrus-studio.richard-cabrer849537.chatgpt.site) — currently published with owner-only access.

## Development milestones

- [x] Brand concept, visual direction, and original product photography
- [x] Responsive landing page and flavor collection
- [x] Interactive real-time 3D product scene
- [x] Accessible mix builder, motion controls, and browser verification
- [x] Second design pass: refined materials and typography, touch rotation, persistent mix dock
- [x] Product experience pass: tasting notes, visual six-can tray, useful questions, optimized WebP assets
- [x] Editorial design pass: floating 3D citrus, detailed flavor panels, shared motion controls, summer-moments photography

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
- Two floating citrus slices with a shared generated texture atlas, real rind geometry, and synchronized lemon/grapefruit/lime changes.
- Damped mouse and touch rotation, keyboard rotation and reset, subtle floating motion, three animated flavor palettes, and a pause control.
- `prefers-reduced-motion`, offscreen rendering suspension, a WebGL fallback, and a capped device pixel ratio.
- Collection and fallback images pre-rendered from the same model, with one WebGL context reserved for the live hero.
- Native accessible dialog with an animated six-can visual tray, quantity limits, price calculation, and a UTF-8 text download.
- A floating mix summary, one-click balanced selection, clear action, and validated local storage that restores the mix after reload.
- Tasting notes for comparing flavors, separate selection badges, clear add/edit buttons, and expandable product questions.
- Fine product orbits, outlined flavor numbers, pointer-responsive product images, and a forest-green marquee with a synchronized pause control.
- A new picnic editorial section, three serving rituals, and a direct balanced-mix action. The photograph loads lazily and retains all three cans in the mobile crop.
- Rendering also stops while the mix dialog is open; adding the sixth can keeps the user in the collection.
- Mobile navigation, scroll reveals, focus restoration, semantic sections, and keyboard controls.

## Verified

Chromium checks passed at widths **320, 390, 768, 1024, 1440, and 1920 px**, with desktop, full-page, catalog, and mobile screenshot review. Checked 3D keyboard rotation, flavor changes, suspension/resumption behind the dialog, synchronized marquee pause/resume, the new moments CTA, six-can limits, live tray contents, totals, download contents, balanced presets, persistence, malformed storage recovery, keyboard focus, mobile menu, reduced motion, image decoding, and overflow. A separate test disabled WebGL and verified accurate flavor fallback images and the mix builder. No console errors or warnings occurred in the normal WebGL-enabled run. Safari, Firefox, and physical-device performance have not been tested.

The in-app Browser was used first for page identity, DOM, screenshots, and console inspection. Its automated header-button click repeatedly failed to open the native dialog, so interaction and viewport checks used the already configured local Chrome/Playwright fallback. Verification scripts and screenshots stay outside the repository.

## Image performance

The original four optimized WebP images total **388,042 bytes**, compared with **4,575,966 bytes** for their previous two PNG sources. The fourth design pass adds a **274,004-byte** picnic photograph and a **490,092-byte** shared citrus atlas, bringing the six current runtime images to **1,152,138 bytes**. Original PNGs remain as design source assets but are no longer requested by the page. The catalog requires no runtime rendering or PNG encoding. Decorative citrus loads after the main can is usable. These are asset sizes, not loading-time benchmarks.

## Files

```text
dist/index.html       Semantic page and accessible dialog
dist/styles.css       Design system, animation, responsive layouts
dist/details.css      Editorial section, product details, motion band
dist/app.js           Navigation, flavor state, mix builder
dist/scene.js         Three.js model, materials, rendering lifecycle
dist/citrus.js        Shared citrus atlas, slice geometry and movement
dist/data.js          Flavors and demonstrative prices
dist/assets/          Original product images, fonts, favicon
dist/vendor/          Pinned Three.js modules and license
server.mjs            Dependency-free local preview
DESIGN.md             Art direction and implementation decisions
ASSETS.md             Image generation provenance
```
