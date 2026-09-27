# ZEST visual specification

Three coordinated ImageGen references establish the hero, collection, and story/footer. Their generated UI remains a reference only; all website text and controls are live HTML.

- Hero: acid yellow `#e7f576`, black `#20251e`, open split composition, giant compact headline, tilted can, fine elliptical orbit, circular flavor swatches.
- Typography: Roboto Condensed 900 for expressive display headlines; Golos Text 700 for readable section and product headings and 400 for body. Hero scale up to 145px with fluid mobile reductions. UI text 14–16px; body 16–18px.
- Containers: open full-width sections with 48px desktop and 20px mobile gutters. Collection uses three purposeful product panels; other sections remain unboxed.
- Components: capsule CTAs, circular plus buttons, three color selectors, fine divider rows. One accessible native dialog is an intentional extension needed to make the build-a-mix action functional.
- Hero copy: “Маленькая банка. Большое лето.” No eyebrow or promotional badge. Navigation: Вкусы / Что внутри / О нас / Попробовать.
- Media: full transparent product fallback, untinted lifestyle photography, live Three.js can for the requested interactive 3D animation.
- Motion: slow product float and rotation, pointer response, flavor transition, restrained scroll reveal. A pause button and reduced-motion preference stop automatic movement.
- Collection: Юдзу & лимон; Розовый грейпфрут; Лайм & мята. Demonstrative price 190 ₽ each.
- Footer: forest `#203c32`, acid typography, “Добавь лето в свои планы.”
- Functional boundary: local six-can mix builder and downloadable selection; no fabricated order submission, checkout, or external recipient.

Concept interpretation: omit the collection reference's spontaneously invented second navigation bar. Preserve the hero navigation once for the whole landing page. Use live code-native product labels rather than the reference's fruit illustration to keep the 3D model performant and legible.

## Visual review

Compared the three original concepts with desktop, full-page, and mobile browser renders:

1. Hero composition: preserved the left-aligned three-line headline and oversized tilted can on the right. Replaced an initially too-wide display font with Roboto Condensed and corrected tracking.
2. Palette: matched the acid-yellow hero, paper collection, three flavor colors, and forest-green footer. Reduced overexposure on the can material.
3. Product: retained typography, silver rim and lid, orbit, condensation, and flavor controls. Live 3D materials intentionally replace the photoreal concept image.
4. Collection: retained three open product panels, image proportions, plus buttons, descriptions, prices, and the mix strip.
5. Story/footer: preserved the image-left/text-right arrangement, two ruled ingredient rows, oversized footer CTA, and simple bottom navigation.
6. Mobile: stacked the hero and collection, reduced heading size, added a compact menu, and increased space between the can and flavor controls.

The six-can dialog is a functional extension of the concept's CTA. The project remains an explicit fictional brand demo and does not simulate a successful real order.

## Second refinement

The second pass preserves the composition while giving the can more saturated print, brushed metal, smaller condensation droplets, and clearer studio highlights. Pointer and drag movement use damping; flavor transitions rotate the can as its label changes. Touch gestures and keyboard controls make the product interaction available beyond a mouse. Automatic movement remains optional and stops offscreen.

The collection and story now use more readable heading weights, larger controls, and a single-column collection on narrow screens. A compact floating summary keeps the selected mix within reach; local storage restores it after a refresh. The dialog adds a balanced preset and clear action, and remains animated independently of the 3D pause control. Desktop, full-page, and mobile renders were reviewed after these changes.

## Product experience refinement

The audit found ambiguous quantity-only add buttons, decorative arrows without an action, insufficient flavor comparison, and unnecessary catalog rendering at startup. The third pass separates selected quantities from labeled add/edit actions, introduces first-sip and aftertaste notes, turns the story rows into native expandable questions, and presents a clearly priced balanced starter mix.

The mix dialog now combines a visual six-can tray with its quantity controls. On desktop, the tray and editor sit side by side; on mobile, a compact horizontal tray keeps the save button within the normal tall-phone viewport. Filling the sixth slot updates the dock without opening an unexpected modal. Automatic 3D rendering stops behind the dialog and resumes when it closes, respecting the user's motion preference.

Pre-rendered WebP cans retain the live model's artwork and material appearance while avoiding render/encode work on startup. Every flavor has an accurate static fallback. Screenshot review confirmed the original hero composition and palette, improved catalog hierarchy, the mobile mix tray, and working question expansions.
