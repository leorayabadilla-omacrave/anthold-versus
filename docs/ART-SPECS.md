# ANTHOLD art specs: animations and arenas

What the game needs from new art, and how to check it before uploading. Everything here is measured from the game's code, not guessed.

Check every upload with the checker (needs Python with Pillow and numpy):

```bash
python tools/check-art.py anim knights/imported-art/animations/v3/ants/worker-attack.png
python tools/check-art.py arena arena-02-garden-bed-back.png arena-02-garden-bed-ground.png
```

It prints "all checks passed", or a list of what to fix.

## 0. Display format: what the screen shows

The game keeps one world, **1400 × 700 game units**, and scales it to fit between the top bar and the card dock. The playfield always fits; whatever the screen has left over (wider phones, taller laptop windows) shows the world *around* the playfield. Measured from the running game:

| Screen | Device | Visible width (units) | Visible height (units) |
|---|---|---|---|
| 1920 × 1080 | desktop | −23 to 1423 | −39 to 774 |
| 1366 × 768 | laptop | −130 to 1530 | −63 to 870 |
| 1180 × 820 | tablet, landscape | 0 to 1400 | −84 to 889 |
| 1024 × 768 | small window | 0 to 1400 | −115 to 935 |
| 932 × 430 | large phone, landscape | −316 to 1716 | −76 to 861 |
| 800 × 360 | small phone, landscape | −416 to 1816 | −98 to 906 |

The game is landscape only. The top bar covers about 46 screen px (29 on phones) and the card dock about 100 to 140 px (74 on phones), so the lowest part of the visible world sits under the cards.

**Why things look inverted or sloppy today.** When an arena image does not reach the edge of the screen, the game has nothing to draw there, so it fills the gap with a mirrored copy of the art (and a solid ground colour below). That mirrored strip is the "inverted" look. Likewise, when an animation frame's art stops at the frame edge, the weapon or wing is simply cut. Neither can be fixed in code; the art has to be drawn bigger than what is on screen.

**Templates.** `docs/templates/arena-template.png` (3600 × 2250) and `docs/templates/animation-template.png` (3072 × 384) mark every zone below. Put them on a layer above your art, then hide that layer before export. `python tools/make-templates.py` redraws them.

### The three rules that prevent both problems

1. **Paint past what the screen shows.** Arena layers are 3600 × 2250 and every pixel is painted, to the edges. The green zone of the template is on every screen; the blue zone is on some screens; the grey bleed is a safety margin. Nothing important goes outside the green zone, and nothing is left blank anywhere.
2. **Leave air around every animation frame.** 16 px of empty margin on all four sides of every frame, including the swing of a weapon, a wing tip, a cape or a slash effect. If the widest pose does not fit, make the whole knight smaller, never crop it. A figure about 200 px tall in a 384 px frame leaves room for a full overhead swing.
3. **Keep the anchors fixed.** Feet on the same line (y = 352) in every frame of every move; the lane line at y = 1440 in every arena; the same facing (right) in every frame.

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
| Facing | Right, in every frame of every move: walk, attack, special, hit and death. Several current sheets walk facing left but attack facing right, so they look like they walk backwards. A side or three-quarter view that clearly reads as right-facing; never a front view. The game mirrors for the other side |
| Walk cycle | The legs clearly alternate (left foot forward, then right) over the 8 frames, with the body moving forward. Several current walks barely move their legs, so the knight looks like it slides |
| Effects | Slash arcs, sparks and puffs stay inside their own frame's cell |
| One figure per cell | Never draw a piece of the next or previous frame in a cell |

### Character sizes

**Draw every knight the same size in its sheet: standing about 200 px tall, head to feet, in the 384 px cell.** The game measures the figure in the walk sheet and scales it to that species' height on the battlefield, so you do not make big species bigger in the file. Draw them bigger in the file and the game shrinks them back, but you lose the room for weapons and wings.

Wide or tall species (long horns, claws, tails, big wings) still keep the 16 px margin. Make the body a little shorter than 200 px if that is what it takes.

On the battlefield a knight's height is `100 × size^0.6` world units. The game then makes some knights bigger still:

| Bonus | Effect |
|---|---|
| Veteran | 1.18 × |
| 2-star merge | 1.15 × |
| 3-star merge | 1.30 × |

The biggest knight on screen is a 3-star veteran Emperor Scorpion, about 190 units tall. The art needs to stay sharp at that size.

| Class | Species id: name, height in world units |
|---|---|
| Ants | `worker` Worker Ant 100 · `fire` Fire Ant 100 · `leafcutter` Leafcutter Ant 100 · `wingedant` Flying Ant 100 (flies) · `army` Army Ant 106 · `bullet` Bullet Ant 114 |
| Beetles | `ladybug` Ladybug 94 (flies) · `bombardier` Bombardier Beetle 109 · `dung` Dung Beetle 112 · `stag` Stag Beetle 117 · `rhino` Rhino Beetle 120 |
| Butterflies (all fly) | `monarch` Monarch 100 · `morpho` Blue Morpho 100 · `swallowtail` Swallowtail 100 · `hawkmoth` Hawk Moth 106 · `atlas` Atlas Moth 117 |
| Flies (all fly) | `fruitfly` Fruit Fly 81 · `housefly` Housefly 100 · `botfly` Botfly 100 · `horsefly` Horsefly 109 · `robberfly` Robber Fly 109 |
| Crickets | `field` Field Cricket 100 · `mole` Mole Cricket 100 · `katydid` Katydid 100 · `camel` Camel Cricket 100 · `weta` Giant Weta 120 |
| Scorpions | `pseudo` Pseudoscorpion 84 · `bark` Bark Scorpion 109 · `deathstalker` Deathstalker 112 · `vinegaroon` Vinegaroon 114 · `emperor` Emperor Scorpion 125 |
| Bees (all fly) | `forager` Forager Bee 91 · `killer` Killer Bee 94 · `honeybee` Honeybee 100 · `carpenter` Carpenter Bee 109 · `bumble` Bumblebee 117 |
| Termites | `tworker` Worker Termite 100 · `nasute` Nasute Soldier 100 · `kamikaze` Kamikaze Termite 100 · `alate` Alate 100 (flies) · `major` Major Soldier 120 |
| Wave insects | The plain insects in the free waves: 84 each. The Maggot (flies) is 81 |

**How big that is on a real screen.** The pixel sizes below are CSS pixels.

| Screen | Pixels per world unit | 100-unit knight | Emperor Scorpion (125) |
|---|---|---|---|
| 1920 × 1080 desktop | 1.33 | 133 px | 166 px |
| 1366 × 768 laptop | 0.82 | 82 px | 103 px |
| 1180 × 820 tablet | 0.84 | 84 px | 105 px |
| 932 × 430 large phone | 0.46 | 46 px | 57 px |
| 800 × 360 small phone | 0.36 | 36 px | 45 px |

On a small phone a knight is only about 36 px tall, so the design has to read as a silhouette:

- bold shapes;
- a clear weapon;
- strong contrast between the dark armour and the cream outlines;
- no fine detail that only works at full size.

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
- Knights stand 81 to 125 units tall, and up to about 190 with the veteran and star bonuses (see Character sizes).

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

## 3. Rules for AI image tools

These rules apply when an AI image generator makes or edits any of this art.

- **Copy the design exactly.** The 8 class sheets in `knights/final/` are the only design reference. Every frame must show that exact knight. Keep the helmet, horn, armour plates, colours, weapon and crest. Do not invent a new version, restyle it or add parts.
- **Change only the pose.** For a walk, attack and so on, only the limbs and the weapon move. The design stays the same.
- **Keep it flat.** Use the same flat colours and line style as the sheet. No motion blur, ghosting, smears, extra limbs or second figure.
- **Use a plain background.** Transparent (RGBA), or one flat colour that is easy to remove. Never scenery.
- **Follow the format in section 1.** Face right in side view, 8 frames, 384 px cells, 16 px margin, feet on y = 352, standing figure about 200 px tall.
- **Run the checker.** Every result has to pass `tools/check-art.py` before it goes in the game.

## 4. Checklist before uploading

- [ ] `python tools/check-art.py anim …` passes for every strip
- [ ] `python tools/check-art.py arena …` passes for every arena pair
- [ ] Files are in the folders above, with a manifest
- [ ] A short README in the upload folder lists what changed
