"""Draw the guide templates in docs/templates/ (see docs/ART-SPECS.md).

    python tools/make-templates.py

arena-template.png      3600 x 2250, one arena layer: what every screen shows, the lane, the nests, flat ground, bleed.
animation-template.png  3072 x 384, one move strip: 8 frames, the clear margin, the feet line, figure height, the impact frame.
Designers put these on a layer above their art and switch it off before export.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "docs" / "templates"; OUT.mkdir(parents=True, exist_ok=True)
font = lambda n: ImageFont.load_default(size=n)

# ---- arena: world x -500..1900, y -400..1100 at 1.5 px per unit
K, X0, Y0 = 1.5, -500, -400
px = lambda x, y: (round((x - X0) * K), round((y - Y0) * K))
im = Image.new("RGBA", (3600, 2250), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
def box(x0, y0, x1, y1, fill, outline, w=6): d.rectangle([*px(x0, y0), *px(x1, y1)], fill=fill, outline=outline, width=w)
box(-500, -400, 1900, 1100, (90, 90, 90, 40), (60, 60, 60, 255), 8)                       # bleed: painted, never empty
box(-420, -115, 1820, 935, (60, 120, 200, 40), (40, 90, 200, 255), 6)                    # seen on some screens
box(0, -40, 1400, 775, (60, 170, 80, 45), (30, 140, 60, 255), 6)                          # on every screen
d.line([px(-500, 560), px(1900, 560)], fill=(220, 30, 30, 255), width=6)                  # the lane
for x0, x1 in [(0, 340), (1060, 1400)]: box(x0, 548, x1, 572, (240, 160, 0, 120), (200, 120, 0, 255), 3)  # flat ground under nests
for cx in (130, 1270): box(cx - 166, 560 - 324, cx + 166, 560, None, (200, 40, 160, 255), 5)               # nest size
for kx in (420, 700, 980): box(kx - 25, 460, kx + 25, 560, (0, 0, 0, 60), (0, 0, 0, 200), 3)                 # a knight (100 units)
for x, y, t, c in [(-480, -380, "BLEED: paint to the edge (wide or tall screens may show it)", (60, 60, 60)),
                   (-400, -100, "SEEN ON SOME SCREENS (phones show the sides, laptops more sky and ground)", (40, 90, 200)),
                   (20, -20, "ON EVERY SCREEN: the playfield", (30, 140, 60)),
                   (20, 575, "LANE LINE y=1440px: the walking ground's top edge", (220, 30, 30)),
                   (20, 600, "flat ground under the nests (orange)", (200, 120, 0)),
                   (-16, 200, "your nest", (200, 40, 160)), (1130, 200, "enemy nest", (200, 40, 160)),
                   (380, 440, "knights stand ~100 units (150px) tall", (0, 0, 0))]:
    d.text(px(x, y), t, fill=(*c, 255), font=font(42))
d.text((30, 2190), "ANTHOLD arena template 3600x2250 - 1.5px per game unit - turn this layer off before export", fill=(0, 0, 0, 255), font=font(36))
im.save(OUT / "arena-template.png")

# ---- animation strip: 8 frames of 384 x 384
C, M, FOOT = 384, 16, 352
im = Image.new("RGBA", (8 * C, C), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
for f in range(8):
    x = f * C
    d.rectangle([x, 0, x + C - 1, C - 1], fill=(220, 40, 40, 70))                         # the margin: keep empty
    d.rectangle([x + M, M, x + C - 1 - M, C - 1 - M], fill=(255, 255, 255, 0), outline=(220, 40, 40, 255), width=3)
    d.line([(x + M, FOOT), (x + C - M, FOOT)], fill=(30, 140, 60, 255), width=3)          # feet line
    d.line([(x + C // 2, M), (x + C // 2, C - M)], fill=(40, 90, 200, 160), width=2)      # body centre
    d.rectangle([x + C // 2 - 30, FOOT - 200, x + C // 2 + 30, FOOT], outline=(0, 0, 0, 160), width=2)  # standing height ~200px
    d.text((x + 22, 20), f"frame {f + 1}" + ("  IMPACT (attack)" if f == 4 else ""), fill=(0, 0, 0, 255), font=font(22))
d.text((22, FOOT + 6), "feet on y=352", fill=(30, 140, 60, 255), font=font(18))
im.save(OUT / "animation-template.png")
print("wrote", OUT / "arena-template.png", "and", OUT / "animation-template.png")
