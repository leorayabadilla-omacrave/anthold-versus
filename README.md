# ANTHOLD Versus

A 1v1 side-view lane battler: two colonies of armoured bug knights march on each other's nest, on one of six arenas picked at random. Before the match you choose up to 6 relics from your collection (universal or class-only, common to legendary; every card is unlocked for testing and the boost values are placeholders). In the match you are always dealt 3 choices, knights or disasters, paid from a food bar that fills from 0 to 10; the played slot takes the Next card (always shown), and two or three matching knights merge into one stronger knight. Workers cost 4 food and each raises your income (up to 6); enemies can kill them. At most one disaster is dealt at a time (none for 15 s after you play one), and the refresh button redeals all three for 1 food. Every disaster warns for 1 second first, only one strikes at a time, and none can take more than 25% of a nest. Knights hatch at your nest and always march, up to a 12-slot army. Every 20 seconds each nest also sends a free wave of plain insects. Every attack plays its full animation and lands on the impact frame; every 4th is the species' special. Destroy the enemy nest to win. One round: overtime at 3:00 doubles food, and from 4:00 both nests crumble.

8 classes (Ants, Beetles, Butterflies, Flies, Crickets, Scorpions, Bees, Termites), 41 species, a bot with three difficulties and Auto mode. Online play is hidden until it moves to the new rules.

## Run

The whole game is one file. Open `versus.html` in a browser, in landscape.

## Check balance

```bash
node versus-sim.js 4
```

Plays every class against every other with bots on both sides (4 matches per pairing) and prints class win rates and round lengths. It tests rules only, not drawing. Results swing a lot between runs, so average several. To try a tweak without editing the game, pass code to run after it loads: `SIMEXTRA="KC.cap=16" node versus-sim.js 2`. Species costs are computed from stats at load, so to test a stat change, point `SIMFILE` at an edited copy of `versus.html` instead.

## Build the phone app

```bash
python build-app.py
```

Writes an installable web app to `app/`. Host that folder over https and add it to a phone's home screen. Online play is hidden in the app.

## Layout

| Path | Contents |
|---|---|
| `versus.html` | The game: CSS, screens and one script, with all art embedded as data URIs |
| `versus-sim.js` | Bot-versus-bot balance sim (loads the game's script into Node) |
| `build-app.py` | Builds the phone app into `app/` |
| `knights/final/` | The 8 class sheets: the canonical knight and crest designs |
| `knights/sprites/` | Pixel sheets: class knights, 33 species knights and 8 nests |
| `knights/crests/`, `knights/cutouts/` | Crests and menu cut-outs taken from the class sheets |
| `knights/species-weapons.*` | Weapon, tier and design status for every species |

Inside `versus.html` the script is split into sections by banner comments (`// ===... section ...===`): classes and species, waves and roles, units, the bot, the round loop, unit art, drawing, HUD and screens, online, and sound.

## Status

Prototype. No automated tests beyond the balance sim. See the [developer guide](docs/DEVELOPER-GUIDE.md) for the code map, game systems, known issues and the improvement plan. The guide still describes the old clash rules; the Knight Command section of `versus.html` (search for `Knight Command: the rules`) is current.
