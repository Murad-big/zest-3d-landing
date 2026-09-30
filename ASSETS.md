# Изображения и текстуры ZEST

Фотографии напитков, исходное изображение банки и атлас цитрусов созданы с помощью OpenAI ImageGen. Банка в интерактивной сцене построена в Three.js; изображения товаров для каталога получены из этой же модели.

## Рабочие файлы

| Файл в `dist/assets/` | Назначение | Размер | Объём |
| --- | --- | --- | --- |
| `product-yuzu.webp` | Банка со вкусом юдзу | 600 × 720 | 20 114 байт |
| `product-grapefruit.webp` | Банка с грейпфрутом | 600 × 720 | 20 550 байт |
| `product-lime.webp` | Банка с лаймом | 600 × 720 | 17 634 байта |
| `citrus-editorial.webp` | Фотография трёх напитков | 1536 × 1024 | 329 744 байта |
| `summer-moments.webp` | Фотография пикника | 1817 × 866 | 274 004 байта |
| `citrus-atlas.webp` | Текстуры лимона, грейпфрута и лайма | 2172 × 724 | 490 092 байта |

Значения зафиксированы при подготовке ресурсов. Эти шесть файлов занимают 1 152 138 байт; это объём изображений, а не измерение скорости загрузки страницы.

## Подготовка

Три изображения товаров получены из модели Three.js и переведены в WebP с качеством 0,88 и сохранением прозрачности. Фотографии также оптимизированы в WebP без изменения композиции. Каталог использует готовые файлы и не требует дополнительной 3D-отрисовки.

`can-yuzu.png` и `citrus-editorial.png` сохранены как исходные материалы. Атлас цитрусов содержит три фронтальные текстуры; толщину долек, кожуру, освещение и движение добавляет код в `citrus.js`.

Шрифты и Three.js поставляются со своими лицензиями в `dist/assets/fonts/` и `dist/vendor/`.

## Исходные запросы к генератору

Ниже сохранены оригинальные запросы для воспроизводимости. Это технические исходники; описания проекта находятся в README и DESIGN.md.

<details>
<summary>Показать оригинальные запросы: банка, натюрморт, пикник и текстуры</summary>
> Use case: product-mockup. Production landing-page hero fallback, isolated product cutout. Photoreal premium slim 330ml aluminum craft citrus soda can for ZEST. True transparent background with preserved alpha. Single full slim can, tilted slightly clockwise, realistic silver metal lid and base. Electric yellow/chartreuse label #e5f568. Bold minimalist premium studio photography, crisp aluminum details and printed label. Portrait, full can uncropped, generous transparent margin. Soft studio lighting and subtle shadow. Huge bold black vertically stacked wordmark “ZEST”; small text “YUZU TONIC” and “330 ml”. Exactly one can, no other objects, watermark, or UI.

> Use case: photorealistic-natural. Premium advertising photograph of three slim ZEST craft citrus soda cans and fresh cut citrus, on a hard sunlit light cream tabletop. Exactly three cans: electric chartreuse/yuzu, coral/pink grapefruit, and very pale green/lime. Real sliced lemons and grapefruit, tactile fruit flesh and believable condensation. Crisp, natural, tactile editorial photography. Wide landscape 3:2, overhead close-up. Directional midday sunlight and defined shadows. Each can displays a huge bold black “ZEST” wordmark. No other text, UI, or watermark. Realistic silver aluminum lids and bases, cohesive premium minimalist packaging.

> Use case: photorealistic-natural. Reference image role: approved ZEST editorial section concept. Create a standalone production photograph matching the picnic photo within this reference, not a website screenshot or a crop of UI. Wide landscape 2.1:1. Exactly three adult hands casually bringing together three chilled slim aluminum ZEST soda cans above a forest-green and cream striped picnic blanket in a sunny park near a lake. Foreground citrus on wooden platter, net bag of lemons at left, warm late afternoon light through trees, shallow focus background greenery. The cans are electric-yellow, coral, and pale green; huge black vertical ZEST wordmark. Small printed flavor labels must read YUZU TONIC, PINK GRAPEFRUIT, LIME MINT respectively, matching the existing product brand. Water droplets, realistic aluminum rims, natural hands and casual sleeves, no faces. Preserve reference composition, lighting, colors, tactile photography and relaxed mood. Keep the three cans entirely within the central 60% of frame so a mobile crop still retains them. No UI, no white frame, no heading, no CTA, no decorative text, no watermark. Entire photograph only.

> Use case: product-mockup. Production transparent texture atlas for real-time 3D citrus slices in a premium soda website. Wide landscape 3:1 image, three exactly equal square cells side by side, no dividers. In each cell one perfectly round citrus cross-section photographed STRICTLY orthographic head-on from directly above: LEFT lemon, MIDDLE pink grapefruit, RIGHT lime. Every disk centered at the exact cell center, equal outer diameter about 85 percent of cell width, complete uncropped circular rind. No tilted or elliptical pieces, no perspective side wall, no wedges or whole fruit. Highly detailed juicy translucent pulp segments, fine natural membranes and a few subtle seeds, thin bright white pith ring and textured outer yellow/yellow-pink/green rind respectively. Soft uniform neutral lighting, no cast shadow, no props, no text. The rest must be genuinely transparent alpha, including corners and gaps between fruit. These three circular face textures will map onto real extruded 3D slice geometry; precise front-on circular alignment and clean alpha edges are essential.

</details>
