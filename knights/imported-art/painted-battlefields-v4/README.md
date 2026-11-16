# ANTHOLD painted battlefields v4

Six full painted arena pairs. Each PNG is exactly 3600 × 2250, 1.5 pixels per world unit; bounds x -500..1900, y -400..1100.

Draw back then ground at the same world origin. Background is opaque; ground is transparent above y=1440 and opaque below. Walking baseline is world y=560. Nest centres are pixel x=945 and 2655, flat ±250 pixels. No fading or mirrored bleed.

Foreground collision contour is flat. Garden plateau, log stump and sand depression are background scenery, not new platforms or collision rules. Existing gameplay remains teammate-owned. Creek water is painted below the bridge; ground alpha remains opaque beneath the lane per spec.

Source paintings were resized in separate upper/lower regions to anchor the walking line, not regenerated at native 3600 pixels. These are static environments, not animated loops.

All six pairs pass the supplied art checker and exact-size/alpha/nest-anchor tests. All six previews were visually inspected. Gameplay integration and tests with all 41 species have NOT been performed.
