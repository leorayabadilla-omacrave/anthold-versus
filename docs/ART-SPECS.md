# ANTHOLD art specs: animations and arenas

What the game needs from new art, and how to check it before uploading. Everything here is measured from the game's code, not guessed.

Check every upload with the checker (needs Python with Pillow and numpy):

```bash
python tools/check-art.py anim knights/imported-art/animations/v3/ants/worker-attack.png
python tools/check-art.py arena arena-02-garden-bed-back.png arena-02-garden-bed-ground.png
```

It prints "all checks passed", or a list of what to fix.

---

## 1. Knight animations

### Why the current set breaks

The `smooth-2d-v1` sheets use 256 px cells with almost no room around the figure. In many frames a spear, wing or slash effect is cropped along a straight line inside the cell, or a lunging body is drawn half outside its cell. The game can stop neighbouring frames bleeding in (it already does), but it cannot restore art that was never drawn. Feet and shadows also touch the bottom edge in 25 of the 41 sheets. Every sheet should be redone to this spec, starting with the ones players see most: the 8 class knights, then the cheapest species of each class.

### The format

| Rule | Value |
|---|---|
| File | One PNG per move per knight, transparent background (RGBA) |
| Frames | 8 per move, in one horizontal strip: 3072 × 384 px |
| Cell | 384 × 384 px per frame, no gutters |
| Clear margin | Nothing within 16 px of any cell edge: weapons, wings, effects, shadow, all of it |
| Feet | The feet rest on y = 352 in every frame of every move (the checker tests the walk) |
| Body position | The body stays near x = 192; a lunge may travel, but everything still fits inside the margin |
| Figure size | Standing figure about 200 px tall (head to feet), so raised weapons and jumps fit |
| Facing | Right. The game mirrors for the other side |
| Effects | Slash arcs, sparks and puffs stay inside their own frame's cell |
| One figure per cell | Never draw a piece of the next or previous frame in a cell |

### The moves

| Move | Frames | Plays | Notes |
|---|---|---|---|
| `walk` | 8 | loops | Feet on y = 352 throughout |
| `attack` | 8 | once | The blow lands on frame 5: draw the contact pose there |
| `special` | 8 | once | The species' signature move |
| `hit` | 8 | once | A flinch; ends back in a standing pose |
| `death` | 8 | once | Ends lying on the ground; the last frame is held |

Winged knights may add `takeoff`, `fly`, `land` and `air-death` in the same format, as in `flying-2d` and `ladybug-wings-v2`.

### Folders and names

```
knights/imported-art/animations/v3/<class>/<species-id>-<move>.png
knights/imported-art/animations/v3/manifest.json
```

Species ids: ants `worker fire leafcutter army wingedant bullet`, beetles `ladybug bombardier stag rhino dung`, butterflies `monarch swallowtail morpho hawkmoth atlas`, flies `fruitfly housefly horsefly botfly robberfly`, crickets `camel field katydid mole weta`, scorpions `pseudo bark vinegaroon deathstalker emperor`, bees `honeybee killer forager carpenter bumble`, termites `alate tworker nasute kamikaze major`.

`manifest.json` lists each file with its species id, move, frame count (8), cell size (384) and feet line (352). A sheet that passes the checker can go straight into the game.

---

## 2. Arenas

### Why the current arenas break

The `arena-parallax-layers` images are 1920 × 1088 and cover only the playfield. The game shows much more than that: on a desktop window about 250 units above the playfield and 380 below it, and on a phone about 400 units past each side. Today the game fills that extra space by stretching the image's top and bottom rows and mirroring its edges, which is the bleeding you see. The fix is art painted larger than the playfield.

### The game's world

- The playfield is 1400 × 700 units. The lane (where feet stand) is at y = 560.
- Nests stand at x = 130 and x = 1270, drawn about 333 units wide and 324 tall.
- Knights stand about 100 units tall; heavy ones up to 130.

### The canvas

| Rule | Value |
|---|---|
| Size | 3600 × 2250 px for every layer (1.5 px per world unit) |
| Covers | World x −500 to 1900, y −400 to 1100: everything any screen shows |
| Playfield | x 750 to 2850 px, y 600 to 1650 px: always on screen; keep the important art here |
| Lane line | y = 1440 px (world y 560) at the nests |
| Nest spots | Centred on x = 945 px and x = 2655 px; keep the ground flat ±0 px for 250 px either side of each |
| Bleed | Everything outside the playfield is painted too, all the way to the edges: more sky, more ground, more scenery. No fades, no blank or mirrored areas |

### Layers

1. `<arena>-back.png`: the full scene behind the fight (sky, distant scenery, big props). Fully opaque, no transparency.
2. `<arena>-ground.png`: the ground knights walk on, transparent above it.
   - The top edge of the solid ground is the walking line: the game measures it from this layer, so it must be clean (no grass tufts or stones sticking up over the walk line inside the playfield).
   - Solid all the way down to the bottom edge, no holes.
   - Height changes only between the nests (x 1250 to 2350 px): at most 150 px up or down (100 units), with slopes no steeper than about 1 in 2. The Garden Bed plateau, Creek bridge, Log Hollow stump and Sandpit pit are good examples.
   - Tall things knights should walk in front of (plants, pots, posts) belong in the back layer, not here.

### Arena rules (for reference)

The six arenas and their planned rules are in `knights/imported-art/arenas-v3/README.md`. The game draws the art today; the rules come in a later step.

---

## 3. Checklist before uploading

- [ ] `python tools/check-art.py anim …` passes for every strip
- [ ] `python tools/check-art.py arena …` passes for every arena pair
- [ ] Files are in the folders above, with a manifest
- [ ] A short README in the upload folder lists what changed
