# Uncropped attack and weapon-effect handoff

All 41 entries in animation-cues.json require two facing directions. This is an export contract, not completed replacement artwork.

- Character layer: eight 384×384 cells, 3072×384 strip; full helmet, body, boots and held weapon inside 16px margins. Feet y=352, body centre near x=192 and height approximately 200px. Use one scale/translation across the entire move, not per-frame fitting.
- Effects layer: traveling javelins, darts, spray, impact sparks and slash trails exported separately, with per-frame attachment offsets. Do not fit the knight to the bounds of a large effect. The game places traveling effects independently after release.
- Melee: held weapons stay attached to hands in the character layer; only their trail/impact is separate. Do not remove a held weapon to conceal a broken grip.
- Ranged: frame 5 is the release; the traveling projectile leaves the character layer and uses the weapon identified in UNIT-ROLES. Forager gathers, never attacks.
- Left: mirror within each cell, keeping frame order and mirrored effect attachment offsets. Do not reverse time. Inspect silhouettes to ensure facing is meaningful; a frontal source is not a true side-facing redraw.
- Reconstruct missing source pixels through reference-based editing before resizing. Padding cannot recover a missing helmet, hand, foot or weapon tip.

Acceptance requires inspecting all eight poses and both directions, stable grip/crest/armour, no source clipping, matching effect timing and actual-game playback. The geometric checker is necessary but insufficient. Monarch and Atlas attack redraws remain blocked; do not mark either complete.