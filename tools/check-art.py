"""Check ANTHOLD art against docs/ART-SPECS.md before uploading.

    python tools/check-art.py anim <sheet.png> [more.png ...]   animation sheets or strips
    python tools/check-art.py arena <back.png> <ground.png>       an arena layer pair
    python tools/check-art.py legacy                              report cut frames in the current smooth-2d-v1 set

Exit code 0 when everything passes, 1 when something fails. Needs Pillow and numpy.
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image

CELL, MARGIN, FOOT_Y, ROWS = 384, 16, 352, ["walk", "attack", "special", "hit", "death"]
ARENA_W, ARENA_H, LANE_Y = 3600, 2250, 1440   # world x -500..1900, y -400..1100 at 1.5 px per unit; the lane is world y 560
PLAY_X0, PLAY_X1 = 750, 2850                    # the playfield, world x 0..1400


def check_anim(path, cell=CELL, margin=MARGIN):
    im = Image.open(path).convert("RGBA"); W, H = im.size; a = np.asarray(im)[..., 3] > 40
    bad = []
    if W % cell or H % cell:
        return [f"{path}: size {W}x{H} is not a multiple of the {cell}px cell"]
    rows, cols = H // cell, W // cell
    if cols != 8: bad.append(f"{path}: {cols} frames per row, expected 8")
    for r in range(rows):
        for c in range(cols):
            m = a[r * cell:(r + 1) * cell, c * cell:(c + 1) * cell]
            if not m.any(): bad.append(f"{path}: row {r + 1} frame {c + 1} is empty"); continue
            inner = np.zeros_like(m); inner[margin:-margin, margin:-margin] = True
            if (m & ~inner).any(): bad.append(f"{path}: row {r + 1} frame {c + 1} has art inside the {margin}px clear margin")
            feet = np.where(m.any(1))[0].max()
            if r == 0 and abs(feet - FOOT_Y) > 6: bad.append(f"{path}: walk frame {c + 1} feet at y={feet}, expected {FOOT_Y}")
    return bad


def check_arena(back, ground):
    b = Image.open(back); g = Image.open(ground).convert("RGBA"); bad = []
    for p, im in [(back, b), (ground, g)]:
        if im.size != (ARENA_W, ARENA_H): bad.append(f"{p}: size {im.size[0]}x{im.size[1]}, expected {ARENA_W}x{ARENA_H}")
    if b.mode == "RGBA" and (np.asarray(b)[..., 3] < 255).any(): bad.append(f"{back}: the background must be fully opaque")
    if g.size == (ARENA_W, ARENA_H):
        a = np.asarray(g)[..., 3]
        lane = a[LANE_Y + 4:LANE_Y + 40, PLAY_X0:PLAY_X1]
        if (lane < 200).mean() > .02: bad.append(f"{ground}: the ground is not solid just under the lane line (y {LANE_Y}) across the playfield")
        if (a[:LANE_Y - 260, PLAY_X0:PLAY_X1] > 40).mean() > .15: bad.append(f"{ground}: a lot of the playfield above the lane is covered; tall props belong in the background")
        if (a[ARENA_H - 8:, :] < 200).any(): bad.append(f"{ground}: the bottom edge must be solid ground all the way across")
    return bad


def legacy():
    D = Path(__file__).resolve().parent.parent / "knights/imported-art/animations/smooth-2d-v1"
    man = json.load(open(D / "manifest.json"))["knights"]; report = {}
    feet = {}
    for k in man:
        a = np.asarray(Image.open(D / k["sheet"]).convert("RGBA"))[..., 3] > 40
        for r, move in enumerate(ROWS):
            side, low = [], 0
            for c in range(8):
                m = a[r * 256:(r + 1) * 256, c * 256:(c + 1) * 256]
                if m[:, :2].sum() + m[:, -2:].sum() + m[:2].sum() >= 6: side.append(c + 1)  # a weapon, wing or effect reaching the side or top edge
                elif m[-2:].sum() >= 6: low += 1                                              # feet or shadow cropped by the bottom edge
            if side: report.setdefault(k["knight"], {})[move] = side
            if low: feet[k["knight"]] = feet.get(k["knight"], 0) + low
    print("Weapons, wings or effects reaching a cell's side or top edge (cut off, or bleeding into the next frame):")
    for kn, moves in sorted(report.items()):
        print(f"  {kn:22s} " + "; ".join(f"{m} {','.join(map(str, f))}" for m, f in moves.items()))
    print(f"\nFeet or shadow cropped by the bottom edge (frames): " + ", ".join(f"{k} {n}" for k, n in sorted(feet.items())))
    print(f"\n{len(report)} of {len(man)} knights have side/top contacts; {len(feet)} have cropped feet. Frames drawn incomplete inside the cell (e.g. the bee's thrust) are not detectable here.")
    return report


if __name__ == "__main__":
    if len(sys.argv) < 2: print(__doc__); sys.exit(1)
    mode = sys.argv[1]
    if mode == "legacy": legacy(); sys.exit(0)
    bad = [x for p in sys.argv[2:] for x in check_anim(p)] if mode == "anim" else check_arena(*sys.argv[2:4]) if mode == "arena" else ["unknown mode " + mode]
    print("\n".join(bad) if bad else "all checks passed"); sys.exit(1 if bad else 0)
