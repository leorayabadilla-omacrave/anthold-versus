# Arenas and disasters — v2 art + rules

Redrawn in the knight art style (flat minimal silhouette, cream / black / bone-white palette).
Nothing here replaces an existing file — this folder is new work for you to pick from.

## What's in this folder

| Folder | Files | Size | Use |
| --- | --- | --- | --- |
| `arenas/` | 3 arena backgrounds | 1920x1088 JPG | Full-frame arena art behind the lane |
| `disasters/` | 8 disaster card illustrations | 1024x1024 JPG | Card art for the power-up choice prompt |

No text is baked into any image — overlay your own names and effect text in the UI.

## Arenas

Each arena changes the ground under the same duel. The lane runs left to right between the two strongholds.

### The Meadow — `arenas/arena-01-meadow.jpg`
- **What it shows:** open rolling dirt lane framed by tall grass, clover and a dandelion clock.
- **Rule:** no terrain effects — the fair, neutral duel. Tall grass at each end hides your knight from the other side's sight until they get close.
- **Tip:** best for learning a kit; ranged knights get full value from the long sightlines.
- **Character ground:** the open dirt clearing in the lower half of the frame.

### The Garden Bed — `arenas/arena-02-garden-bed.jpg`
- **What it shows:** a raised soil plateau in the middle with ramps on both sides, a terracotta pot and a wooden planter wall.
- **Rule:** whoever holds the plateau gets +15% attack on knights below them. Walking up a ramp slows you by 20%.
- **Tip:** fight for the centre early; heavy knights (Beetle, Termite) love holding the high ground.
- **Character ground:** the horizontal soil ledge in the middle tier.

### The Creek — `arenas/arena-03-creek.jpg`
- **What it shows:** the lane dips into a shallow stream crossed by stepping stones and a fallen twig bridge.
- **Rule:** walkers in the water move 30% slower; flyers (Butterfly, Fly, Bee) cross freely. The twig bridge holds one knight at a time.
- **Tip:** flyers dominate the middle; walkers should push minion waves across the bridge.
- **Character ground:** the flat mossy turf on either bank, the log bridge, or the stones in the stream.

## Disasters

Disasters are the aggressive option in the power-up choice. Picking one adds a charge to your hand for the rest of the match.

| Card | Effect | Stronghold damage | Counter | Recharge |
| --- | --- | --- | --- | --- |
| `01-hailstorm.jpg` | Hail pounds the enemy half of the lane for 4s. Flyers take 50% more. | Chips 3% of stronghold health | Step under your stronghold — its roof blocks hail. | 60s |
| `02-downpour.jpg` | The enemy half floods for 6s: walkers wade at 60% speed, minions drown slowly. | None | Flyers ignore it; walkers can stand on high ground. | 64s |
| `03-gale.jpg` | For 3s the rival knight and minions are blown back toward their own stronghold. Flyers go twice as far. | None — buys space to push | Heavy knights (Beetle, Termite) are only pushed half as far. | 52s |
| `04-boulder.jpg` | A boulder rolls from your stronghold down the lane, crushing walkers it hits. | Slams the enemy stronghold for 8% | Jump, fly or dash over it — readable 1s rumble warning first. | 92s |
| `05-earthquake.jpg` | Every enemy walker is stunned for 2s and hurt. | Cracks the enemy stronghold for 6% | Airborne knights at the moment of impact are untouched. | 116s |
| `06-sunbeam.jpg` | A magnified sunbeam sweeps from your stronghold to theirs, burning everything it passes. | Scorches the enemy stronghold for 5% | Shadows (bridges, plateau edges, strongholds) block the beam. | 92s |
| `07-tornado.jpg` | A twister crosses the lane toward the enemy stronghold, flinging the rival knight back. | Hits the stronghold for 4% on arrival | Move off its line — it travels straight and slow. | 104s |
| `08-wildfire.jpg` | Grass under every enemy walker burns for 5s. | None | Water (Creek) and Downpour put it out instantly. | 68s |

### Disaster rules that apply to all eight
1. Disasters are offered as power-up choices: picking one adds a charge to your hand for the rest of the match.
2. Every disaster shows a 1s warning (rumble, shadow, wind lines) before it hits, so the rival can react.
3. Only one disaster can be active on the field at a time; a second cast waits in a short queue.
4. Disasters can never take more than one stronghold damage stage on their own — knights and minions must finish the job.

## How this fits the match

Pick a class, then a species, then duel a player or bot that is always a different species. Power-up choices come every 90 seconds and again each time either stronghold loses a damage stage — that is where disasters come from. The match is won by destroying the rival stronghold, which breaks in four visible damage stages.

## Numbers and known issues

- **All numbers above are playtest starting values**, not tuned. Attack bonuses, slow percentages, durations and recharge times are all expected to move.
- Arena images are 1920x1088, not exactly 1920x1080 — crop 4px off the top or bottom, or scale to fit.
- The Garden Bed drawing has two rough spots: the raised bed in the middle reads as a sharply angled trough, and the bottom quarter is a flat block of solid brown earth. It works as a background, but the plateau edge may need a hand touch-up before it ships.
- These are AI-generated drafts, so give each one a look in the engine before committing to it.
