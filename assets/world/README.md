# Pet Farm world art

All overworld art lives here and is loaded **only** via `manifest.json` — no code change needed to swap art.

| key | file | size |
|---|---|---|
| tree | trees/tree.png | 16×16, transparent |
| grass/path/water/field/fence/sign | tiles/*.png | 16×16 |
| farmer | player/farmer.png | 32×64 sheet: rows down/up/left/right, 2 walk frames (16×16 each) |

## Swap art
1. Edit or replace a PNG (keep the same filename and size; hard pixels, transparent background).
2. Bump `"rev"` in `manifest.json` by 1 and save. (New image? add a key → path; the code uses the keys above.)
3. Local: run `scripts/serve-dev.sh` (or `python3 -m http.server 8000` in the project folder), open `http://localhost:8000/?dev=1`. The game re-checks the manifest every 2s and swaps art while you play. SELECT on the farm map forces a reload.
4. Live (GitHub Pages): commit + push to `main`; the `?r=<rev>` query busts the browser cache.

Dev mode is on for `?dev=1`, `localStorage.PETFARM_DEV='1'`, or localhost/LAN addresses.
