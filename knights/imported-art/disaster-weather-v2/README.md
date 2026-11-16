# ANTHOLD disaster gameplay v2 — animated weather handoff

## Play without replacing any game files
Host the repo normally and open `knights/imported-art/disaster-weather-v2/play.html`.
The launcher fetches the CURRENT root `versus.html` and loads three additive scripts into an isolated frame. The existing menu, deck, food payment, bot, art, sound and duel remain in use. Root game and phone app are unchanged. This is a playable opt-in version, not enabled on the normal game entry point.

To promote after review, load `disaster-engine.js`, `weather-effects.js`, then `versus-adapter.js` AFTER the game's classic script. The teammate must make that change. Do not use the old `stepEffects` alongside the adapter (double damage). No online support: current game hides online; network snapshots do not serialize the warning/queue/recharge state.

## Animated weather
- Hailstorm: cloud build-up, streaking ice, terrain-aligned bounces and fragments, clipped to the targeted half.
- Downpour: dense slanted drops, expanding splash rings, rippling ground-level pools and storm cloud cover.
- Gale: directional curved gusts, spinning leaves and grit; direction follows the same caster-side push as gameplay.
- Procedural vector animation matches the ink-and-paper arena and does not require videos or downloads. Time comes from the engine so pausing freezes movement. Reduced-motion preferences stop particle travel; no lightning flashes or camera shake. Warnings stay visible. Existing damage, durations and costs are unchanged.

## What changed
All eight casts have a full 1-second warning with a marked area before damage. One active disaster, at most two queued; each queued cast gets a fresh warning. Charge recharge starts on acceptance, including queued casts. Cards still cost current food amounts and cycle through the deck. Recharge can no longer be bypassed by playing the card again. Both bot and player use the same cast function. Pause/countdown freeze gameplay. New rounds discard queue and cooldowns.

| Disaster | Food | Active time | Recharge | Gameplay / nest damage |
| --- | ---: | ---: | ---: | --- |
| Hailstorm | 4 | 4s | 60s | Enemy half, 8 HP/s; airborne 12 HP/s; own nest roof (110px) protects units; nest 3% once at end |
| Downpour | 3 | 6s | 64s | Enemy walkers at 60% speed; light units (<70 max HP) lose 4 HP/s; flyers forced to land; Garden Bed plateau protects; no nest damage |
| Gale | 3 | 3s | 52s | Push enemies 72px/s toward own nest; flying ×2; Beetle/Termite/steady ×0.5; no nest damage |
| Boulder | 5 | up to 9s | 92s | Rolls 252px/s; each grounded non-jumping enemy takes 45 once and 30px push; nest 8% on arrival |
| Earthquake | 5 | one pulse | 116s | 10 HP and 2s stun to grounded non-jumping enemies; flyers/burrowers evade; nest 6% |
| Sunbeam | 4 | up to 6s | 92s | Sweeps 288px/s, 24 HP/s within 40px; roof / Garden Bed ramp-edge shadows block unit damage; nest 5% once |
| Tornado | 5 | up to 8s | 104s | Sweeps 234px/s; within 70px, 12 HP/s +100px/s push +0.2s stun; nest 4% once |
| Wildfire | 4 | 5s | 68s | Ground enemies lose 4 HP/s; air and Creek water safe; casting Downpour immediately extinguishes current fire; no nest damage |

Nest damage uses max HP percentages and existing hardy resistance, capped at 25% max HP per cast. Disasters leave at least 1 HP: knights/minions must deliver the winning hit. They can cross a visual threshold if the nest is already near it. These are starting balance values, not production balance.

## Compatibility decisions
Reviewed main `70ad42e3426be03317b511072d8141394a80fb34`. The repo now uses Card Command army/deck rules, unlike the earlier single-knight design notes. This module preserves the current game rather than replacing it. Earlier notes conflict on Downpour: this pass uses the later flight counter (forced landing), not immunity. Sunbeam/Tornado duration extends to reach the far nest. Existing walls remain and are not disaster shields in this version.

Terrain counters use the three maps currently in versus.html: plateau x400–1000, ramp-edge shadows x330–400 /1000–1070, Creek water x580–820. New arena integrations must supply new geometry predicates; three imported newer arenas are not wired into the root game. Unit visual animations remain the game's existing implementation.

## Validation / remaining review
`node --test disaster-engine.test.js` in an ES-module project, or `node --experimental-default-type=module --test disaster-engine.test.js` in this repo: 12 checks covering all eight mechanics, costs/recharge, warning, queue, counters and nest protection.
A real browser match selected Ants, built the default deck, cycled normal cards, paid food to cast Gale, displayed warning then active wind. No page errors. A separate real-game integration test covers all eight via the existing cast/stepEffects functions and food/cooldown paths. These are functional tests, not a tournament balance pass. Test on phones and long bot matches before promotion; verify warning readability, flood timing, nest thresholds and root-game compatibility after teammate edits.

Source files are intentionally standalone; no dependencies, API keys or accounts.
