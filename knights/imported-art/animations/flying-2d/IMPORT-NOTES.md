# ANTHOLD flying animations (draft)
16 winged knights: Butterfly Knight, Monarch, Blue Morpho, Atlas Moth, Fly Knight, Fruit Fly, Horsefly, Botfly, Robber Fly, Bee Knight, Killer Bee, Forager, Carpenter Bee, Bumblebee, Flying Ant, Alate.

## Format
- `<class>/<knight>/<knight>-flying-sheet.png`: 8 columns x 4 rows, 256x256 cells, transparent, facing right (flip for left), feet/body on cell bottom.
- Row 1 takeoff (play once) -> Row 2 fly (loop) -> Row 3 land (play once). Row 4 mid-air death: hit, wings fold, fall, hit ground, lie still (play once, hold last frame).
- Each row is also saved as its own strip: `-takeoff`, `-fly`, `-land`, `-death`.
- 12 fps. `manifest.json` lists every sheet.
- Ground death stays the existing smooth-2d death row; use the flying death only when a knight dies in the air lane.

## Combat rules (design, from the combat page)
- Ground lane + one air lane; only winged knights enter the air via takeoff/land.
- 6s flight stamina, refills 2x on the ground; empty stamina forces a landing.
- Air attacks deal 80% damage; walkers hit flyers only during takeoff/landing or with upward abilities.
- Ranged attacks, upward specials, Gale and Downpour hit the air lane; hit stun in the air drops the flyer.
- Flyers must land to damage a stronghold.
- Flyers ignore Creek water and Garden Bed slopes; Meadow grass does not hide them while airborne.
All numbers are playtest starting values.

## Known draft issues
- Clear wings keep a faint pink tint from the cut-out background.
- Wing shape, weapon and crest drift a little between frames; the death row is drawn at a slightly smaller scale.
- Hawk Moth has no visible wings and has no flying set.
