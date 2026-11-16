# ANTHOLD opposite-facing artwork v1

Horizontal opposite-facing copies, not inverted colours or new drawings. All original files remain unchanged. PNG output avoids another JPEG compression pass.

## Included
- 41 design sheets: eight base class sheets (latest Ant/Beetle v6), 33 species with four species-v2 corrections. On base sheets only the left 60% art panel is mirrored; the large right crest and its readable caption remain in place. Species portraits are mirrored as a whole.
- Smooth stills and four-pose prototypes for 41 knights.
- Pixel stills, prototypes and 4x previews: original eight-class set plus latest 33 pixel redraws; individual pixel poses for the 33 included. These remain AI-assisted pixel artwork, not human hand-pixelled drawings.
- 41 smooth eight-frame sets: walk, attack, special, hit, death; combined sheets plus each move strip.
- 16 flying sets: takeoff, fly, land, death; combined sheets plus each move strip. Non-flyers have no flying assets.

## Frame order and playback
Every frame is flipped inside its existing cell. Columns and rows are NOT reversed: attacks, takeoff and death still play forwards. Dimensions, cell spacing, alpha, colours and vertical alignment remain unchanged. Use the source-specific widths in asset-manifest.json: older base prototypes are not the same dimensions as newer species prototypes. Do not assume every asset uses 256px cells.

Eight-frame smooth layout: 8 columns, 5 rows of 256px: walk, attack, special, hit, death. Flying: 8 columns, 4 rows of 256px: takeoff, fly, land, death. Four-pose prototypes remain idle/walk/attack/hit, not four frames of a continuous move. Pixel redraw cells are 128px; older eight-class pixel animation cells are 160px.

Do not apply a second engine flip to these copies. Off-centre pivots, weapon sockets and hitboxes must be mirrored in the engine: pixel coordinate x becomes cellWidth - 1 - x, normalised x becomes 1 - x. Vertical coordinates are unchanged. No hitboxes are supplied. Weapon handedness and asymmetric shield patterns are reflected along with each knight; these are exact mirror variants, not physically redesigned opposite-camera views.

## Limits / QA
All output cells were compared pixel-for-pixel to a horizontal flip of their same original cell, and right-hand crest/caption panels were verified unchanged. SHA-256 hashes map outputs to sources. Existing animation grip/crest drift, weak walk motion, pink wing tint, scale differences and broken Flying Ant/Alate death frames are inherited, not fixed. Frontal designs may look similar after mirroring. Preview boards were inspected for all 41 species and 16 flyers. No engine integration/testing or GitHub upload is included.
