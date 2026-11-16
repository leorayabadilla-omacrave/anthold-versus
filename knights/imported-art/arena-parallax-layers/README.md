# Six ANTHOLD arena parallax layer pairs

Companion artwork for the touched-up arenas in `../arenas-v3/`. This upload adds assets only; it does not change the game code or arena rules.

## Files
Each arena has a full-canvas background JPEG (`-back.jpg`) and a transparent foreground/ground PNG (`-front.png`):

1. `arena-01-meadow`
2. `arena-02-garden-bed`
3. `arena-03-creek`
4. `arena-04-log-hollow`
5. `arena-05-sandpit`
6. `arena-06-night-porch`

All images are 1920 x 1088. Preserve the full canvas, transparent margins and identical scale within each pair; do not independently crop the foreground to its visible bounds. Use the same top-left origin for both layers.

## Suggested scrolling integration
- Draw background first, then transparent ground, then knights/minions and gameplay effects. The front images include the playfield and some framing plants/props, so keep combatants above them unless explicit occlusion is desired.
- Ground follows the gameplay camera at 1.0x; start the background at 0.25x horizontal camera movement. These are suggested rendering values, not new combat rules.
- With a shared camera reference, use `screenX = layerOriginX - (cameraX - cameraStartX) * parallaxFactor`. Apply the same world-to-screen scale to each pair and align them at cameraStartX.
- These are finite painted scenes, NOT seamless repeating textures. Clamp each layer's scroll to its rendered bounds or provide overscan; do not wrap/repeat the edges. At a full-scene camera width, there is no spare horizontal image to scroll: zoom in or extend the artwork before enabling camera travel.
- Prefer a fixed vertical camera. Design collisions, platforms, spawn points and stronghold placement separately; the images are not collision maps. Check the Creek stepping-stone path and Garden Bed plateau against gameplay geometry.
- The backgrounds were reconstructed separately rather than extracted as exact compositing passes. All six pairs were checked visually at the shared origin; test the maximum camera travel for newly revealed edges and any alignment differences before shipping.
- Foreground PNGs were checked to contain transparent and opaque pixels. Background JPEGs are opaque. No animation or game-engine wiring is included in this upload.

## Ambient movement
Optional future overlays: Meadow clouds/grass; Garden flowers/leaves; Creek water/reeds; Log Hollow mushroom glow/dust; Sandpit heat haze/sand; Night Porch lamp/moths. Loop videos are a separate deliverable, not part of these layers.
