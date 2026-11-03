# Pet Farm world assets

Drop replacement PNGs here using the **same filenames**. No code changes needed.

| key | path | size |
|-----|------|------|
| tree | trees/tree.png | 16×24 |
| grass/path/water/field/fence/sign | tiles/*.png | 16×16 |
| corn / wheat | tiles/corn.png, tiles/wheat.png | 16×16 |
| farmer | player/farmer.png | spritesheet |

## Workflow
1. Copy an asset out (e.g. `trees/tree.png` or `tiles/corn.png`).
2. Edit it in Aseprite / Piskel / Photoshop (keep transparency).
3. Save back over the same path.
4. Bump `"rev"` in `manifest.json` by 1 (e.g. 2 → 3).
5. With the game open in **dev mode**, art refreshes automatically within a couple of seconds.

## Dev mode (auto-refresh)
Open with `?dev=1`, or `localStorage.setItem('PETFARM_DEV','1')` then reload.

## Local server
```bash
python3 -m http.server 8080
```
Open `http://localhost:8080/?dev=1`.
