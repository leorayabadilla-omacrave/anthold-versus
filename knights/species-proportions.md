# Species builds

Every knight is a person in armour: limbs and head keep human proportions. Species read apart by armour colour (taken from the real insect), breastplate pattern, weapon, helmet crest and height. The class still reads from the sigil (shield, or shoulder plate for Fly and Scorpion knights), visor, pauldron rim, belt buckle and cape.

Height: `scale = clamp(0.85, 1.2, 0.8 + 0.06*log2(mm/2))`. Values live in `knight-rig.js` (`SPECIES`). Blank weapon = the class weapon.

## Ant Knights

| Species | Real size | Height | Armour | Pattern | Weapon | Crest | Notes |
|---|---|---|---|---|---|---|---|
| worker | 4 mm | ×0.86 | `#8a5a3c` | plates | halberd |  | Brown-plated footsoldier, halberd |
| fire | 4 mm | ×0.86 | `#e8742a` | bands | spear | plume | Fire-orange armour, spear, flame plume |
| leafcutter | 9 mm | ×0.93 | `#6f8f3a` | veins | scythe |  | Leaf-green armour, scythe, leaf banner |
| army | 10 mm | ×0.94 | `#7a3b22` | plates | axe | spikes | Rust armour, axe, spiked helm, hooked faceguard |
| wingedant | 10 mm | ×0.94 | `#3a3a4a` | sheen | lance |  | Dark slate armour, lance, wing cape |
| bullet | 25 mm | ×1.02 | `#2a1a12` | sheen | greatsword | fin | Black-lacquer heavy armour, greatsword, cloak |

## Beetle Knights

| Species | Real size | Height | Armour | Pattern | Weapon | Crest | Notes |
|---|---|---|---|---|---|---|---|
| ladybug | 7 mm | ×0.91 | `#d6322a` | spots | mace |  | Red domed breastplate with black spots, mace |
| bombardier | 15 mm | ×0.97 | `#e08a2a` | bands | axe | fin | Orange banded armour, axe |
| stag | 60 mm | ×1.09 | `#5a3320` | sheen | greatsword |  | Chestnut armour, greatsword, antler helm |
| rhino | 55 mm | ×1.09 | `#3b2a20` | sheen | hammer |  | Heaviest beetle: dark glossy plate, war hammer, great horn |
| dung | 20 mm | ×1 | `#2f6a5a` | sheen | pick |  | Teal metallic armour, pick |

## Butterfly Knights

| Species | Real size | Height | Armour | Pattern | Weapon | Crest | Notes |
|---|---|---|---|---|---|---|---|
| monarch | 25 mm | ×1.02 | `#e8862a` | veins | lance |  | Orange armour with black veins, lance; wingspan 100 mm |
| swallowtail | 28 mm | ×1.03 | `#f0d040` | stripes | spear |  | Yellow and black stripes, spear, tailed cape; 90 mm |
| morpho | 35 mm | ×1.05 | `#3fa0ff` | sheen | sword | plume | Bright blue sheen, sword, plume; 140 mm |
| hawkmoth | 45 mm | ×1.07 | `#8a7a6a` | bands | axe |  | Grey-brown banded, axe, narrow cape |
| atlas | 50 mm | ×1.08 | `#a8452a` | eyes | halberd | crown | Russet with eye-spot, halberd, crown; up to 250 mm |

## Fly Knights

| Species | Real size | Height | Armour | Pattern | Weapon | Crest | Notes |
|---|---|---|---|---|---|---|---|
| fruitfly | 3 mm | ×0.85 | `#d8a060` | bands |  |  | Smallest knight: tan armour, red eye-visor |
| housefly | 7 mm | ×0.91 | `#6a6a72` | stripes |  |  | Grey striped armour |
| horsefly | 20 mm | ×1 | `#5a6a4a` | plates | axe |  | Olive armour, green eye-visor, axe |
| botfly | 15 mm | ×0.97 | `#c8a040` | fuzz | mace |  | Fuzzy yellow armour, mace |
| robberfly | 28 mm | ×1.03 | `#4a4038` | bands | spear | plume | Lean hunter: dark armour, spear, plume |

## Cricket Knights

| Species | Real size | Height | Armour | Pattern | Weapon | Crest | Notes |
|---|---|---|---|---|---|---|---|
| camel | 20 mm | ×1 | `#c9a46a` | bands |  |  | Tan banded armour, cloak |
| field | 22 mm | ×1.01 | `#2a2420` | sheen |  |  | Black glossy armour, sword |
| katydid | 50 mm | ×1.08 | `#5fae4a` | veins | scythe |  | Leaf-green with veins, scythe |
| mole | 40 mm | ×1.06 | `#7a5a3c` | fuzz | pick |  | Velvet-brown, pick, digging gauntlet |
| weta | 75 mm | ×1.11 | `#8a5a30` | bands | mace | spikes | Heaviest cricket: banded, mace, spiked helm |

## Scorpion Knights

| Species | Real size | Height | Armour | Pattern | Weapon | Crest | Notes |
|---|---|---|---|---|---|---|---|
| pseudo | 3 mm | ×0.85 | `#9a4a2a` | plates |  |  | Smallest scorpion: no tail |
| bark | 70 mm | ×1.11 | `#d8b060` | bands |  |  | Pale straw armour, slim tail |
| vinegaroon | 60 mm | ×1.09 | `#4a1a1a` | sheen |  | fin | Dark maroon, whip tail |
| deathstalker | 80 mm | ×1.12 | `#e8d080` | plates |  | spikes | Pale yellow, longest tail, spiked helm |
| emperor | 180 mm | ×1.19 | `#1c2030` | sheen |  | crown | Biggest of all: blue-black, heavy claws, crown |

## Bee Knights

| Species | Real size | Height | Armour | Pattern | Weapon | Crest | Notes |
|---|---|---|---|---|---|---|---|
| honeybee | 13 mm | ×0.96 | `#c88a20` | stripes | spear |  | Amber and black stripes, spear |
| killer | 12 mm | ×0.96 | `#7a5a20` | stripes | sword | spikes | Dark amber stripes, sword, spiked helm |
| forager | 13 mm | ×0.96 | `#e8c040` | stripes | lance |  | Pale gold stripes, lance, pollen pouch |
| carpenter | 22 mm | ×1.01 | `#222230` | sheen | axe |  | Glossy black armour, axe |
| bumble | 20 mm | ×1 | `#f0c030` | fuzz | hammer | plume | Round and fuzzy, hammer, plume |

## Termite Knights

| Species | Real size | Height | Armour | Pattern | Weapon | Crest | Notes |
|---|---|---|---|---|---|---|---|
| alate | 10 mm | ×0.94 | `#4a3020` | sheen | spear |  | Dark brown, spear, wing cape |
| tworker | 5 mm | ×0.88 | `#e8dcc0` | bands | pick |  | Pale cream armour, pick |
| nasute | 5 mm | ×0.88 | `#7a4a2a` | plates | sword |  | Brown, sword, nozzle helm |
| kamikaze | 6 mm | ×0.9 | `#3a7ac8` | pack | mace |  | Blue crystal backpack, mace |
| major | 14 mm | ×0.97 | `#d87a30` | plates |  | crown | Orange soldier: mattock, big mandible faceguard |
