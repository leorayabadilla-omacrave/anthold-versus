# Full-body fitted skins v1 (all 41 species)

- Joints (hip/knee/ankle/toe, neck, pelvis) re-fitted per species on the original art (`landmarks-512.json`, 512px space).
- Every skin faces right in `*-right.png`; sources that faced left were mirrored first. `*-left.png` is a cell-local mirror (time not reversed).
- All pieces are cut from the original armour pixels; no redraw or rescale. Legs swing from the Mesh2Motion walk on each knight's own leg lengths; arms and weapon move with the torso.
- Strips: 8 frames x 384px cells, sole at y=352, pelvis centred at x=192. `idle` and `walk`.
- `catalog.json` lists species, class, role and source facing. Rebuild with `build_fitted_rigs.py`.
- Review drafts for the teammate; nothing in the game was changed.
