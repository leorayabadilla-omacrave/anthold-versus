# ANTHOLD Versus

A 1v1 side-view lane battler: two colonies of armoured bug knights fight timed clashes in a tug of war over one meadow. Hatch units with food, gather them into a wave, and every 18 seconds both waves clash. The winner pushes the front one mark; a clash won at the enemy's door storms their nest. Best of three rounds.

8 classes (Ants, Beetles, Butterflies, Flies, Crickets, Scorpions, Bees, Termites), 41 species, a bot with three difficulties, Auto mode, and online 1v1 when the game runs as a claude.ai artifact.

## Run

The whole game is one file. Open `versus.html` in a browser, in landscape.

## Check balance

```bash
node versus-sim.js 4
```

Plays every class against every other with bots on both sides (4 matches per pairing) and prints class win rates and round lengths. It tests rules only, not drawing.

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

Prototype. No automated tests beyond the balance sim. See the developer guide (shared separately) for the code map, game systems, known issues and the improvement plan.
