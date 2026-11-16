# ANTHOLD winged Ladybug — v2

Species: Ladybug. Class: Beetle. Smooth 2D, right-facing, transparent RGBA.

- Every move: 8 frames, 256×256 cells, 2048×256 strip, no gutters, suggested 12fps.
- Ground combined sheet: 2048×1280; rows walk, attack, special, hit, death.
- Flight combined sheet: 2048×1024; rows takeoff, fly, land, air-death.
- Pivot: (128,244). Foot line y=244; flight animation has visual height changes. Engine physics controls real altitude; do not add the visual ascent twice.
- Loop walk and fly only. Play all others once. Hold final death frame; hit returns to locomotion; takeoff enters fly; land returns to grounded state.
- Mace strike peaks at attack frame 5 (index 4). Trigger damage from gameplay events, not image playback alone.
- Special: proposed Carapace Guard, shell-case flare; no handheld shield. Numbers/kit unchanged.
- Ladybug is flyer 17. Merge into the prior flying roster without deleting any of the other 16 sets. Use manifest.json here for the nine moves; merge Ladybug into the existing flight roster.
- Existing wingless files are preserved. Configure the game to use these paths for Ladybug only; older repository assets remain untouched. Pixel and opposite-facing sets are not revised here.

## Checks and limitations
All 72 output cells checked for nonempty transparent silhouettes and padded frame containment. Connected silhouettes isolated before packing instead of slicing weapons and wings at equal raw boundaries. Walk and landing were redrawn to improve poses/remove duplicated mace.
These are AI animation drafts, not hand-animated production assets: walk still repeats similar lead-leg poses; wing veins, armour details and weapon grip drift, especially across different moves; body size varies slightly between moves. Full crest spot consistency and two-wing visibility are not guaranteed in profile. Retouch and test in the target engine before shipping. GIFs are review previews, not engine assets.

## Repository integration
Folder: knights/imported-art/ladybug-wings-v2/. Nine individual move strips plus two combined sheets; manifest.json defines timing and file paths. This upload supplies assets only: the teammate must connect these paths and flight eligibility in the game. Never apply the old wingless animation files to this winged sprite.
