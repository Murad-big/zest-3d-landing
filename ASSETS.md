# Original generated assets

Both original images were generated with the built-in OpenAI ImageGen tool, in one request per asset.

## `dist/assets/can-yuzu.png`

Purpose: original transparent product concept; retained as a design source. The live fallback now uses the pre-rendered model images below.

Prompt:

> Use case: product-mockup. Production landing-page hero fallback, isolated product cutout. Photoreal premium slim 330ml aluminum craft citrus soda can for ZEST. True transparent background with preserved alpha. Single full slim can, tilted slightly clockwise, realistic silver metal lid and base. Electric yellow/chartreuse label #e5f568. Bold minimalist premium studio photography, crisp aluminum details and printed label. Portrait, full can uncropped, generous transparent margin. Soft studio lighting and subtle shadow. Huge bold black vertically stacked wordmark “ZEST”; small text “YUZU TONIC” and “330 ml”. Exactly one can, no other objects, watermark, or UI.

## `dist/assets/citrus-editorial.png`

Purpose: original brand-story editorial photograph. The page serves a WebP copy with the same dimensions and composition.

Prompt:

> Use case: photorealistic-natural. Premium advertising photograph of three slim ZEST craft citrus soda cans and fresh cut citrus, on a hard sunlit light cream tabletop. Exactly three cans: electric chartreuse/yuzu, coral/pink grapefruit, and very pale green/lime. Real sliced lemons and grapefruit, tactile fruit flesh and believable condensation. Crisp, natural, tactile editorial photography. Wide landscape 3:2, overhead close-up. Directional midday sunlight and defined shadows. Each can displays a huge bold black “ZEST” wordmark. No other text, UI, or watermark. Realistic silver aluminum lids and bases, cohesive premium minimalist packaging.

The live 3D product and collection renders are procedural Three.js geometry with code-native printed typography. They are not crops of website concept screenshots.

## Optimized runtime assets

- `product-yuzu.webp` — 600 × 720, 20,114 bytes.
- `product-grapefruit.webp` — 600 × 720, 20,550 bytes.
- `product-lime.webp` — 600 × 720, 17,634 bytes.
- `citrus-editorial.webp` — 1536 × 1024, 329,744 bytes.

The three product images were exported from the existing Three.js model and materials at the collection camera angle, then encoded as WebP at quality 0.88 with transparency preserved. The editorial WebP is a format optimization of the original generated photograph at the same quality. These local files serve the catalog, flavor-specific WebGL fallback, and visual mix tray. No external image API or rendering pass is required to display the catalog.

## Fourth-pass production assets

Both assets were created with the built-in OpenAI ImageGen tool, then encoded as WebP at quality 0.88 without resizing or changing their visual composition. The atlas retains alpha transparency.

### `dist/assets/summer-moments.webp`

1817 × 866; 274,004 bytes. Standalone photograph generated from the selected moments section concept, with product-label corrections for continuity.

Final prompt:

> Use case: photorealistic-natural. Reference image role: approved ZEST editorial section concept. Create a standalone production photograph matching the picnic photo within this reference, not a website screenshot or a crop of UI. Wide landscape 2.1:1. Exactly three adult hands casually bringing together three chilled slim aluminum ZEST soda cans above a forest-green and cream striped picnic blanket in a sunny park near a lake. Foreground citrus on wooden platter, net bag of lemons at left, warm late afternoon light through trees, shallow focus background greenery. The cans are electric-yellow, coral, and pale green; huge black vertical ZEST wordmark. Small printed flavor labels must read YUZU TONIC, PINK GRAPEFRUIT, LIME MINT respectively, matching the existing product brand. Water droplets, realistic aluminum rims, natural hands and casual sleeves, no faces. Preserve reference composition, lighting, colors, tactile photography and relaxed mood. Keep the three cans entirely within the central 60% of frame so a mobile crop still retains them. No UI, no white frame, no heading, no CTA, no decorative text, no watermark. Entire photograph only.

### `dist/assets/citrus-atlas.webp`

2172 × 724; 490,092 bytes. The three texture regions map onto shared front/back geometry in `citrus.js`. The rind, physical depth, studio lighting and movement are live Three.js.

Final prompt:

> Use case: product-mockup. Production transparent texture atlas for real-time 3D citrus slices in a premium soda website. Wide landscape 3:1 image, three exactly equal square cells side by side, no dividers. In each cell one perfectly round citrus cross-section photographed STRICTLY orthographic head-on from directly above: LEFT lemon, MIDDLE pink grapefruit, RIGHT lime. Every disk centered at the exact cell center, equal outer diameter about 85 percent of cell width, complete uncropped circular rind. No tilted or elliptical pieces, no perspective side wall, no wedges or whole fruit. Highly detailed juicy translucent pulp segments, fine natural membranes and a few subtle seeds, thin bright white pith ring and textured outer yellow/yellow-pink/green rind respectively. Soft uniform neutral lighting, no cast shadow, no props, no text. The rest must be genuinely transparent alpha, including corners and gaps between fruit. These three circular face textures will map onto real extruded 3D slice geometry; precise front-on circular alignment and clean alpha edges are essential.
