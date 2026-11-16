# ANTHOLD unit roles

What every species does in a fight: how it attacks, how it moves, and whether it can hit flyers. This is the rulebook for gameplay. The weapons and designs come from [knights/species-weapons.md](../knights/species-weapons.md). The numbers come from `versus.html`.

When the two disagree, this document wins. Change the game to match it, not the other way round.

## The rules

**Three roles.** Every species has one role, shown above it in battle:

| Role | Glyph | Who |
|---|---|---|
| Walker | ■ | Close-combat units on the ground |
| Flyer | ▲ | Anything with wings, whether it fights up close or at range |
| Ranged | ● | Units that shoot from a distance |

The roles beat each other in a circle: walkers beat ranged, ranged beat flyers, and flyers beat walkers. A unit deals 1.2× damage to the role it beats and 0.85× to the role that beats it. A flyer that shoots counts as ranged (●), not a flyer: the Butterfly archers now, and the three javelin flyers once they change.

**Attack.** The number is the reach, in world units.

- **Close combat** reaches 10 to 22: the unit has to touch its target.
- **Ranged** reaches over 40: the unit fires a shot from a distance. Its weapon must look like it shoots or throws: a bow, crossbow, dart thrower, javelin, sprayer or blunderbuss.

**Flyers.** Every species with wings flies:

- all the Butterflies, Flies and Bees;
- the Flying Ant, Ladybug and Alate.

Flyers hatch on the ground, take off, rest by landing now and then, and dive to strike.

**Hitting flyers.** Anything that flies, and any ranged unit that shoots upward, can hit flyers. Walkers can reach a flyer only when it is low, landing or diving, unless their class has a way up:

| Class | How its walkers reach flyers |
|---|---|
| Ants | Climb onto each other into a living ladder |
| Crickets | Pounce into the air |
| Termites | Strike from the top of a mound wall |
| Scorpions | Their long tails and claws reach low flyers |
| Beetles | Horns and antlers reach very low flyers |

**Special moves** are listed under "What it does".

## Changes the game still needs

These species carry a throwing or spraying weapon in the design document, but the game has them fighting up close. Following the document, they become ranged:

| Species | Weapon | Now | Becomes |
|---|---|---|---|
| Flying Ant | Light pincer javelin | Close combat, reach 12 | Ranged, reach 60; still flies |
| Killer Bee | Short barbed javelins | Close combat, reach 12 | Ranged, reach 55; still flies |
| Alate | Light javelin | Close combat, reach 12 | Ranged, reach 60; still flies |
| Bombardier Beetle | Acid blunderbuss | Ranged, but reach only 34 | Ranged, reach 55 |

All three javelin flyers then count as ranged (●) in the role circle. The game prices every species from its stats, so these four will cost more once they change. Run the balance sim after making the change.

## Every species

In the tables, bold marks one of the four changes above. "Hatches ×2" means one card hatches two of them.

### Ants

| Species | Tier | Weapon | Attack | Moves | Can hit flyers | What it does |
|---|---|---|---|---|---|---|
| Worker Ant (`worker`) | Starter | Serrated pincer spear, two-handed (as on the sheet) | Close combat, 14 | Walks (hatches ×3) | Climbs into ant ladders to reach flyers | The standard-issue spear; cheap and plentiful |
| Flying Ant (`wingedant`) | Cheapest | Light pincer javelin | **Ranged, 60** (now 12) | Flies (hatches ×2) | Yes | Flies and throws javelins, at flyers too |
| Fire Ant (`fire`) | Specialist | Ember glaive: a pincer blade with a glowing red edge | Close combat, 14 | Walks (hatches ×2) | Climbs into ant ladders to reach flyers | Its bite sets enemies burning |
| Bullet Ant (`bullet`) | Specialist | Great stinger pike, thick and heavy | Close combat, 16 | Walks | Climbs into ant ladders to reach flyers | A slow giant whose sting stuns |
| Leafcutter Ant (`leafcutter`) | Specialist | Serrated machete with a leaf pavise (tall leaf shield) | Close combat, 14 | Walks (hatches ×2) | Climbs into ant ladders to reach flyers | The leaf blocks the first 3 shots |
| Army Ant (`army`) | Specialist | Twin sickle swords, crossed like mandibles | Close combat, 14 | Walks (hatches ×2) | Climbs into ant ladders to reach flyers | A raider that grows stronger with every kill |

### Beetles

| Species | Tier | Weapon | Attack | Moves | Can hit flyers | What it does |
|---|---|---|---|---|---|---|
| Ladybug (`ladybug`) | Starter + cheapest | Spotted flanged mace | Close combat, 12 | Flies | Yes | A small flyer that heals from the damage it deals |
| Rhino Beetle (`rhino`) | Specialist | War hammer with a ring emblem, two-handed (as on the sheet) | Close combat, 18 | Walks | Reaches very low flyers | A tank whose charge deals triple damage |
| Bombardier Beetle (`bombardier`) | Specialist | Acid blunderbuss with a twin flared barrel | **Ranged, 55** (now 34) | Walks | Yes | Ranged acid spray that splashes walkers |
| Dung Beetle (`dung`) | Specialist | Ball flail with a heavy rolling ball | Close combat, 16 | Walks | Reaches flyers only when they dive or land | Rolls in, smashes nests and shoves walkers |
| Stag Beetle (`stag`) | Specialist | Antler poleaxe with two branching blades | Close combat, 20 | Walks | Reaches very low flyers | Big bites that take a share of the victim's health |

### Butterflies

| Species | Tier | Weapon | Attack | Moves | Can hit flyers | What it does |
|---|---|---|---|---|---|---|
| Monarch (`monarch`) | Starter | Pollen dart crossbow | Ranged, 70 | Flies | Yes | Ranged pollen darts; poisons what bites it |
| Swallowtail (`swallowtail`) | Cheapest | Lance (as on the sheet) | Close combat, 12 | Flies | Yes | Its first dive strike deals 2.5x damage |
| Blue Morpho (`morpho`) | Specialist | Prism scepter that flashes light | Ranged, 80 | Flies | Yes | Support: dazzles enemies so they attack slower |
| Atlas Moth (`atlas`) | Specialist | Silk longbow | Ranged, 60 | Flies | Yes | Ranged; spins a cocoon and comes back once |
| Hawk Moth (`hawkmoth`) | Specialist | Atlatl that hurls long darts | Ranged, 90 | Flies | Yes | Longest range in the class; heavy and steady |

### Flies

| Species | Tier | Weapon | Attack | Moves | Can hit flyers | What it does |
|---|---|---|---|---|---|---|
| Fruit Fly (`fruitfly`) | Starter | Twin needle stilettos | Close combat, 10 | Flies (hatches ×4) | Yes | A cloud of four tiny flies |
| Housefly (`housefly`) | Cheapest | Twin daggers (as on the sheet) | Close combat, 12 | Flies (hatches ×2) | Yes | The baseline fly, hatched in pairs |
| Horsefly (`horsefly`) | Specialist | Twin cleavers | Close combat, 12 | Flies | Yes | Double damage against anything big |
| Botfly (`botfly`) | Specialist | Barbed hook knives that stay in the wound | Close combat, 12 | Flies | Yes | Infests its victim; a maggot hatches if it dies |
| Robber Fly (`robberfly`) | Specialist | Needle rapier and a grappling hook | Close combat, 12 | Flies | Yes | Hunts other flyers |

### Crickets

| Species | Tier | Weapon | Attack | Moves | Can hit flyers | What it does |
|---|---|---|---|---|---|---|
| Camel Cricket (`camel`) | Starter + cheapest | Twin short kamas | Close combat, 14 | Walks | Pounces at flyers overhead | Skittish and quick; dodges one hit in three |
| Field Cricket (`field`) | Specialist | Curved short sword (as on the sheet) | Close combat, 14 | Walks | Pounces at flyers overhead | Its chirp makes nearby allies attack faster |
| Mole Cricket (`mole`) | Specialist | Digging-claw gauntlets | Close combat, 14 | Tunnels | Pounces at flyers overhead | Tunnels underground and hits nests |
| Katydid (`katydid`) | Specialist | Leaf-blade naginata | Close combat, 14 | Walks, leaps | Pounces at flyers overhead | Leaps over the front line to strike the back |
| Giant Weta (`weta`) | Specialist | Spiked war club | Close combat, 18 | Walks | Pounces at flyers overhead | A heavyweight that kicks walkers back |

### Scorpions

| Species | Tier | Weapon | Attack | Moves | Can hit flyers | What it does |
|---|---|---|---|---|---|---|
| Pseudoscorpion (`pseudo`) | Starter + cheapest | Tiny pincer hooks and a climbing grapple | Close combat, 14 | Walks | Reaches low flyers | Climbs up to bite low flyers; no tail |
| Emperor Scorpion (`emperor`) | Specialist | Claw gauntlets (as on the sheet) | Close combat, 22 | Walks | Reaches low flyers | Pins its prey in its claws while it strikes |
| Bark Scorpion (`bark`) | Specialist | Slim sickle claws dripping venom | Close combat, 18 | Walks | Reaches low flyers | Venom slows its victims and keeps hurting |
| Vinegaroon (`vinegaroon`) | Specialist | Acid siphon with a whip tail | Ranged, 70 | Walks | Yes | Sprays acid at range, even at flyers |
| Deathstalker (`deathstalker`) | Specialist | Venom katars (punch daggers) | Close combat, 18 | Walks | Reaches low flyers | Venom assassin with lethal damage over time |

### Bees

| Species | Tier | Weapon | Attack | Moves | Can hit flyers | What it does |
|---|---|---|---|---|---|---|
| Honeybee (`honeybee`) | Starter | Striped stinger spear (as on the sheet) | Close combat, 12 | Flies | Yes | One huge armour-piercing sting, then it dies |
| Forager Bee (`forager`) | Cheapest | Pollen sickle and pollen baskets | None | Flies | Never fights | Gathers food rather than fighting |
| Bumblebee (`bumble`) | Specialist | Honey censer staff that trails healing mist | Close combat, 14 | Flies | Yes | Heals every ally around it |
| Killer Bee (`killer`) | Specialist | Short barbed javelins | **Ranged, 55** (now 12) | Flies (hatches ×2) | Yes | An angry pair that throws barbed javelins that pierce armour |
| Carpenter Bee (`carpenter`) | Specialist | Auger drill lance | Close combat, 14 | Flies | Yes | Bores into wood: big damage to nests and walls |

### Termites

| Species | Tier | Weapon | Attack | Moves | Can hit flyers | What it does |
|---|---|---|---|---|---|---|
| Alate (`alate`) | Starter + cheapest | Light javelin | **Ranged, 60** (now 12) | Flies | Yes | Winged and cheap; its javelin reaches flyers |
| Worker Termite (`tworker`) | Specialist | Mattock and hex shield (as on the sheet) | Close combat, 14 | Walks | Reaches flyers from atop a mound wall, or when they land | Builds mound walls when it meets the enemy |
| Nasute Soldier (`nasute`) | Specialist | Glue sprayer fed from the helmet nozzle | Ranged, 80 | Walks | Yes | Squirts glue at range, rooting its target |
| Kamikaze Termite (`kamikaze`) | Specialist | Glue-crystal backpack and a short club | Close combat, 14 | Walks | Reaches flyers from atop a mound wall, or when they land | Bursts when it dies, gluing everything around it |
| Major Soldier (`major`) | Specialist | Great mattock and a tower hex shield | Close combat, 18 | Walks | Reaches very low flyers | The armoured defender that holds the line |

## Summary

| | Close combat | Ranged |
|---|---|---|
| **Walks** | 20: all Ants except the Flying Ant; Rhino, Stag and Dung Beetle; all Crickets; Emperor, Bark and Deathstalker Scorpion and the Pseudoscorpion; Worker, Kamikaze and Major Termite | 3: Bombardier Beetle, Vinegaroon, Nasute Soldier |
| **Flies** | 10: Ladybug, Swallowtail, all 5 Flies, Honeybee, Bumblebee, Carpenter Bee | 7: Monarch, Blue Morpho, Hawk Moth, Atlas Moth, Flying Ant, Killer Bee, Alate |

The Forager Bee does not fight at all. It gathers food, and counts as a flyer.
