"""Full-body rigid skins fitted to per-species skeleton landmarks.

Every piece is cut from the original armour pixels (no redraw, no scaling).
Landmarks come from rig-landmarks/landmarks-512.json (vision-detected on the
512px upscaled walk frame 0, reviewed visually). Sources facing left are
mirrored so every skin faces right; the left export is a cell-local mirror.
"""
import json, math, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps
from scipy.ndimage import binary_dilation

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))
try:
    from seamless_walk import RIGS
except ImportError:  # seamless_walk.py is not in the game repo: take the knight order from the catalog (it matches smooth-2d-v1's manifest)
    RIGS = [r['id'] for r in json.loads((HERE/'catalog.json').read_text())]

CELL, SOLE, CX = 384, 352, 192
SWING = 0.6  # source frames already hold a stride; full clip swing over-extends
# Knights whose source pose has the legs close together shuffle at the base swing: give them a longer stride.
LEG_W = int(__import__('os').environ.get('LEG_W', 17))  # half-width of the band that cuts a leg out; wider catches broad boots and knee pads
STRIDE = {'dung': 2.6, 'bumble': 2.4, 'camel': 1.8, 'robberfly': 2.4, 'pseudo': 1.8, 'katydid': 1.7, 'emperor': 1.8}
SEGS = [('thigh','hip','knee'), ('shin','knee','ankle'), ('foot','ankle','toe')]


def facing(lm):
    """Toe direction decides facing; it is what the walk must follow."""
    d = sum(lm[l]['toe'][0] - lm[l]['ankle'][0] for l in ('near','far'))
    return 'right' if d >= 0 else 'left'


def normalize(src, lm512):
    """Return right-facing 256px RGBA source and 256-space landmarks."""
    lm = {k: ([v[0]/2, v[1]/2] if isinstance(v, list) else {j: [p[0]/2, p[1]/2] for j, p in v.items()})
          for k, v in lm512.items() if k in ('neck','pelvis','near','far')}
    face = facing(lm)
    if face == 'left':
        src = ImageOps.mirror(src)
        flip = lambda p: [255 - p[0], p[1]]
        lm = {k: (flip(v) if isinstance(v, list) else {j: flip(p) for j, p in v.items()}) for k, v in lm.items()}
    alpha = np.array(src)[:, :, 3] > 40
    ys, xs = np.nonzero(alpha)
    def snap(p):
        d = (xs - p[0])**2 + (ys - p[1])**2
        i = d.argmin()
        return [float(xs[i]), float(ys[i])] if d[i] > 4 else p
    for leg in ('near','far'):
        for j in lm[leg]:
            lm[leg][j] = snap(lm[leg][j])
    return src, lm, face


def seg_dist(px, py, a, b):
    ax, ay = a; bx, by = b
    vx, vy = bx-ax, by-ay
    t = np.clip(((px-ax)*vx + (py-ay)*vy) / max(vx*vx+vy*vy, 1e-6), 0, 1)
    return np.hypot(px-(ax+t*vx), py-(ay+t*vy))


def split(src, lm, width=13):
    arr = np.array(src); alpha = arr[:, :, 3] > 40
    yy, xx = np.mgrid[0:256, 0:256]
    top = min(lm['near']['hip'][1], lm['far']['hip'][1]) - 4
    names, dists = [], []
    for leg in ('near','far'):
        for part, a, b in SEGS:
            names.append(f'{leg}-{part}')
            d = seg_dist(xx, yy, lm[leg][a], lm[leg][b])
            if part == 'foot':  # boots extend below the ankle-toe line to the sole
                d = np.minimum(d, seg_dist(xx, yy, [lm[leg]['ankle'][0], lm[leg]['ankle'][1]+8], [lm[leg]['toe'][0], lm[leg]['toe'][1]+4]))
            dists.append(d)
    dists = np.stack(dists)
    owner = dists.argmin(0)
    leg_px = alpha & (yy > top) & (dists.min(0) < width)
    parts = {}
    for i, n in enumerate(names):
        m = leg_px & (owner == i)
        m = binary_dilation(m, iterations=2) & alpha & (dists[i] < width + 2)  # joint overlap, original pixels only
        a = arr.copy(); a[~m] = 0
        parts[n] = Image.fromarray(a)
    t = arr.copy(); t[leg_px] = 0
    # Drop loose leg fragments and ground-shadow slivers left outside the leg corridors.
    from scipy.ndimage import label
    comp, n = label(t[:, :, 3] > 40)
    for c in range(1, n+1):
        ys, xs = np.nonzero(comp == c)
        thin = (ys.max()-ys.min() < 4 and xs.max()-xs.min() > 12)
        if xs.max()-xs.min() < 4 and ys.max()-ys.min() > 30: t[comp == c] = 0; continue
        if len(ys) < 40 or (thin and ys.min() > top): t[comp == c] = 0
    parts['torso'] = Image.fromarray(t)
    return parts


def ang(a, b):
    return math.atan2(b[1]-a[1], b[0]-a[0])


def motion_deltas(motion):
    """Per-frame thigh/shin swing from the Mesh2Motion clip, relative to its mean pose."""
    out = []
    for f in motion['frames']:
        row = {}
        for side in ('l','r'):
            h, k, a = (f[n+'_'+side] for n in ('thigh','calf','foot'))
            th = math.atan2(k[1]-h[1], h[2]-k[2]); sh = math.atan2(a[1]-k[1], k[2]-a[2])
            row[side] = (th, sh)
        out.append(row)
    mean = {s: (np.mean([r[s][0] for r in out]), np.mean([r[s][1] for r in out])) for s in ('l','r')}
    # Mesh2Motion: angle measured from forward axis; convert to screen swing deltas (+ = toward facing)
    return [{s: (-SWING*(r[s][0]-mean[s][0]), -SWING*(r[s][1]-mean[s][1])) for s in ('l','r')} for r in out]


def procedural_deltas(n=8, thigh=.30, knee=.55):
    """Used when the Mesh2Motion clip is missing: a plain walk cycle. Each thigh swings sin(t) (half a cycle apart; + swings it back, so the planted foot slides back as the body walks forward);
    the knee folds while that leg swings forward, so the foot lifts instead of dragging. Same shape as motion_deltas."""
    out = []
    for f in range(n):
        t = 2*math.pi*f/n; row = {}
        for side, ph in (('l', 0), ('r', math.pi)):
            th = thigh*math.sin(t+ph)
            sh = knee*max(0.0, -math.cos(t+ph))  # fold only while the leg swings forward (+ thigh angle = back, so forward is when it falls)
            row[side] = (th, sh)
        out.append(row)
    return out


def scaled(delta, k):
    return {s: (delta[s][0]*k, delta[s][1]*min(k, 1.3)) for s in delta} if delta else delta


def rot(p, c, t):
    x, y = p[0]-c[0], p[1]-c[1]
    return [c[0] + x*math.cos(t) - y*math.sin(t), c[1] + x*math.sin(t) + y*math.cos(t)]


def place(cell, layer, pivot_src, pivot_dst, theta, offset):
    """Rigid rotate layer about pivot_src by theta, landing at pivot_dst + offset."""
    c, s = math.cos(theta), math.sin(theta)
    dx, dy = pivot_dst[0]+offset[0], pivot_dst[1]+offset[1]
    # inverse map: src = R^-1 (dst - d) + pivot_src
    m = (c, s, pivot_src[0] - c*dx - s*dy, -s, c, pivot_src[1] + s*dx - c*dy)
    big = Image.new('RGBA', (CELL, CELL)); big.paste(layer, (0, 0))
    cell.alpha_composite(big.transform((CELL, CELL), Image.Transform.AFFINE, m, Image.Resampling.NEAREST))


def pose(lm, delta):
    """World joints for one frame; feet stay world-flat so toes keep pointing forward."""
    j = {}
    for leg, side in (('near','l'), ('far','r')):
        L = lm[leg]; dt, ds = delta[side] if delta else (0, 0)
        knee = rot(L['knee'], L['hip'], dt)
        ankle = rot(rot(L['ankle'], L['hip'], dt), knee, ds)
        j[leg] = {'hip': L['hip'], 'knee': knee, 'ankle': ankle, 'dt': dt, 'ds': ds}
    return j


def foot_bottom(parts, lm, j):
    low = -1e9
    for leg in ('near','far'):
        a = np.array(parts[f'{leg}-foot'])[:, :, 3]
        ys = np.nonzero(a.any(1))[0]
        if len(ys): low = max(low, j[leg]['ankle'][1] + (ys.max() - lm[leg]['ankle'][1]))
    return low


def render(parts, lm, delta):
    j = pose(lm, delta)
    off = [CX - lm['pelvis'][0], SOLE - foot_bottom(parts, lm, j)]
    cell = Image.new('RGBA', (CELL, CELL))
    def leg(name):
        L, J = lm[name], j[name]
        place(cell, parts[f'{name}-thigh'], L['hip'], J['hip'], J['dt'], off)
        place(cell, parts[f'{name}-shin'], L['knee'], J['knee'], J['dt']+J['ds'], off)
        place(cell, parts[f'{name}-foot'], L['ankle'], J['ankle'], 0, off)
    leg('far')
    place(cell, parts['torso'], lm['pelvis'], lm['pelvis'], 0, off)
    leg('near')
    return cell, j, off


def build(source, output):
    output = Path(output); output.mkdir(parents=True, exist_ok=True)
    items = dict(zip(RIGS, json.loads((Path(source)/'manifest.json').read_text())['knights']))
    first = lambda *ps: next(p for p in ps if p.exists())
    L = json.loads(first(HERE/'rig-landmarks/landmarks-512.json', HERE/'landmarks-512.json').read_text())
    cues = {s['id']: s for s in json.loads(first(HERE/'animation-cues.json', HERE.parent/'art-v3-cues-v1/animation-cues.json').read_text())['species']}
    clip = ROOT/'src/assets/shared-rig/mesh2motion-motion.json'
    deltas = motion_deltas(json.loads(clip.read_text())) if clip.exists() else procedural_deltas()
    records = []
    for key in RIGS:
        src = Image.open(Path(source)/items[key]['sheet']).convert('RGBA').crop((0, 0, 256, 256))
        src, lm, face = normalize(src, L[key])
        parts = split(src, lm, LEG_W)
        assets = {}
        for action in ('idle', 'walk'):
            k = STRIDE.get(key, 1.0)
            cells = [render(parts, lm, scaled(deltas[int(f/8*len(deltas))], k) if action == 'walk' else None)[0] for f in range(8)]
            for d in ('right', 'left'):
                strip = Image.new('RGBA', (CELL*8, CELL))
                for f, c in enumerate(cells): strip.alpha_composite(c if d == 'right' else ImageOps.mirror(c), (f*CELL, 0))
                strip.save(output/f'{key}-{action}-{d}.png'); assets[f'{action}-{d}'] = f'{key}-{action}-{d}.png'
        cue = cues[key]
        records.append({**{k: cue[k] for k in ('id','name','className','weapon','role','action','requiredMovement')},
            'classLabel': items[key]['class'], 'sourceFacing': face, 'assets': assets,
            'landmarks': lm, 'status': 'full-body-fitted-skin-review',
            'notes': 'All pieces cut from original armour pixels; legs fitted to per-species joints. Arms/weapon move with torso.'})
    (output/'catalog.json').write_text(json.dumps(records, indent=1))
    print('built', len(records))


if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2])
