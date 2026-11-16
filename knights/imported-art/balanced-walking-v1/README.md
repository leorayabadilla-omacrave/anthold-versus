# Balanced in-game walking — opt-in handoff

Open `knights/imported-art/balanced-walking-v1/play.html` on the same host as `versus.html`, or load `stride.js` then `versus-adapter.js` after the game's classic script. Original game files are not replaced.

All 41 species have an eight-frame walk row, transparent 144×112 cells. The existing torso, crest and weapon are retained from one source pose; lower-leg armour is procedurally redrawn in the character's sampled palette, not hand-painted. Both feet have equal reach and lift, half a cycle apart. Stance is at frame 0. Grounded flyers use the walk; airborne flight remains the game's existing animation.

The adapter advances frames from actual distance travelled, not wall-clock time. Standing, root, stun, attacks, knockback and jumps do not treadmill. Slows change walk cadence with movement speed; left-facing units use the game's existing horizontal flip. Attack/special/hit/death rows and combat statistics are unchanged. Pausing freezes simulation and stride.

These are game-scale motion replacements, not production-final art; inspect weapons that overlap the legs and approve the new lower-leg silhouettes before promoting into the normal game. The original AI rows were not a balanced walk: one leg often stayed planted across all eight images. No amount of whole-character bobbing repairs that.

Run `node --test stride.test.js` for cadence/foot symmetry and `GAME_FILE=/path/to/versus.html node versus-integration.test.cjs` for real-game adapter checks. `build-walks.py` reproduces the sheets offline from the embedded game artwork.