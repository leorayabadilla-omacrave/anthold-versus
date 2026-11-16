# Sound design v1 — teammate handoff

This adds reference docs, the full downloadable sample pack and individually accessible sounds; no existing game code is changed.

## Use in the game
- 24 WAVs: eight weapon sketches, six arena ambient-loop candidates, disaster warning and Boulder, UI confirm/power-up, flight loop/death, knight hit/death and stronghold stage/final destruction.
- `sfx/*.wav`: 48kHz 16-bit mono. `ambience/*.wav`: 48kHz 16-bit stereo. Import these for prototypes; MP3 files are original listening copies. Do not import both formats as duplicate sounds.
- Read the six-page sound direction PDF. `cue-catalogue.csv` marks 89 entries as review samples or design-only cues. `sample-manifest.json` maps generated sample IDs to files. `audio-QA.csv` records decoded duration, peaks and RMS.
- `review-montage.mp3` is for approval listening, not gameplay playback. The ZIP contains the same material for downloading.
- Wire cues to confirmed game events, not frame timers alone. Swing on attack start; hit only on actual contact. Combined weapon sketches require separation/editing before precise attack synchronisation.
- Mirror visuals without reversing audio playback. Pan positioned effects with the knight’s actual screen location. Preserve hidden-species fairness: no revealing unseen enemy footsteps.
- Flying death cancels flight loop, then plays ground impact once; do not double-trigger landing/death sounds. Stage damage and final stronghold collapse are separate events.
- Arena loops are candidates pending listening and seam tests. Keep a single ambient bed while art layers scroll. Music is not supplied: ElevenLabs Music API needs a paid plan; the music prompt is included.
- This is a measured review pack, not a complete production library or engine-tested mix. Check licensing/provider terms and review the actual gameplay mix before release.
