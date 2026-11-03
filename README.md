# Pet Farm (v16 — modular)

A slow, wholesome browser Tamagotchi for phones (portrait or landscape) with Game Boy Advance-style controls.
Play: https://sonjamesg.github.io/pocket-pal/

- **Pick a dog breed**: Labrador, French Bulldog, Dachshund, Poodle, Corgi, Husky, Beagle, Border Collie. Cats, horses & rabbits are *coming soon*.
- **Grows in real time**: Puppy → Youngster → Teen → Adult → Senior. Needs real days *and* daily care (max 14 care XP/day): Adult in ~6 weeks, Senior after ~4 months.
- **Idle life**: walks, hops, zoomies, sniffs, naps, rolls and plays with its toys.
- **Care**: dog-only foods (kibble, wet food, chicken, salmon, peanut treat, dental chew, carrot), toys bought with coins, cuddles, teeth brushing (plaque builds up), optional walks (sniff, wee, bag the poo — no fixed schedule).
- **Tara Scissor Hounds**: the coat grows over ~12 days; long fur mats and hurts happiness. Cecily brushes and trims it.
- Tricks, Fetch / Memory / Dash games. Multi-pet saves on the device (`localStorage` key `pocketpal_v7`, migrates v3 saves).

Keys: arrows, X = A, Z = B, Enter = Start, Shift = Select.

## Code layout (v16)
Plain `<script>` files loaded in order by `index.html` (shared globals, no bundler, `?v=16` cache bust):

| file | what lives there |
|---|---|
| js/data.js | species, breeds, foods, toys, tricks, logo |
| js/save.js | localStorage `pocketpal_v9`, migrate, pet state |
| js/care.js | real-time stat decay, growth, fx |
| js/menus.js | title/pause items, name & confirm modals |
| js/games.js | trick teaching, mini-games |
| js/input.js | input routing, care actions, idle life, walk/teeth/groom logic |
| js/draw.js | canvas primitives (R, E, RR, txt…) |
| **js/map-data.js** | **farm overworld layout — single source of truth** |
| js/overworld.js | collision / what's on a tile |
| js/assets.js | manifest loader, `IMG`, dev live-reload |
| js/overworld-draw.js | walking, overworld input, drawOverworld, farmer |
| js/controls.js | on-screen buttons, keyboard, responsive canvas |
| js/animals.js | dog art, egg, food/toy icons |
| js/buildings.js | backgrounds, house(), drawMap |
| js/critters.js | cat/chicken/pig/horse/rabbit art |
| js/scenes.js | UI panels + groom/teeth/walk scenes |
| js/frame.js | main render per scene (title logo anim) |
| js/main.js | boot + version check |

## Farm grid (B2-style coordinates)
`assets/world/farm-grid.{png,json,html}` are **generated** from `js/map-data.js` (the same JSON the game loads).
After editing the map layout run:

```sh
scripts/build.sh        # node --check every module + python3 scripts/build-farm-grid.py
```
A git pre-commit hook (`.githooks/`, enable with `git config core.hooksPath .githooks`) runs it automatically when `js/map-data.js` or world art changes.

## Adding / changing an image
Drop the PNG in `assets/world/<folder>/`, add/keep its key in `assets/world/manifest.json`, bump `rev`. With `?dev=1` the game hot-swaps it (SELECT on the map reloads art). New tile letters: add to `legend` in map-data.js and the tile→key map in `js/overworld-draw.js` + `scripts/build-farm-grid.py` (`TILE`).

## v17 (staging)
- GBA FireRed-style art: `scripts/make-gba-art.py` regenerates grass/path/water/water-edge/tree/fence/pet store PNGs (replace any PNG by hand as usual).
- No starter pet: title START → farm map → **PET STORE** (`petStore` in js/map-data.js, door J16). Buy dog breeds with coins (wallet starts at 60, `DB.wallet`).
- Staging: https://sonjamesg.github.io/pocket-pal-staging/ (repo `sonjamesg/pocket-pal-staging`, pushed from `feature/pokemon-world`). Live `main` is untouched.

## v18 (staging)
- Ranch is 56×44 (was 30×24); gate **AB44–AC44** (bottom fence) leads to the 80×60 **WILD WOODS** outer world (`outer` in js/map-data.js, gate AN1–AO1). Walk onto a gate (or B in the woods) to switch maps.
- `scripts/gen-maps.py` lays out both maps procedurally (organic blob lakes, meandering river, bridges, beaches); `scripts/gen-art.py` makes multi-tone grass variants, tall grass, flowers, rocks, 2×2 trees/pines, bridge, gate posts and 4-quadrant autotile atlases (water-auto0/1, path-auto, sand-auto) for rounded shorelines.
- `scripts/build.sh` now also regenerates `assets/world/world-grid.*`.
- Onboarding: first map open asks **BOY / GIRL** (`DB.avatar`, sprites `player/farmer.png` / `player/farmer-girl.png`). You start at your blue **ranch house** (`home` AD5, door AE6). No starter pet; the **PET SHOP** moved off the ranch to the Wild Woods (`outer.petStore` AS31, door AT32).
- Intro: BOY/GIRL portraits (`portraits/*.png`, scripts/gen-portraits.py) → name entry (`DB.playerName`) → Grandpa typed dialogue (3 pages, `introPages()` in js/menus.js) → start at your house door (AE7).
