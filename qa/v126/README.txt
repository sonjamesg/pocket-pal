qa/v126 — genuine in-game canvas captures (NOT mockups)
=======================================================
Captured 2026-11-05 Europe/London via headless Chrome + Playwright against
local shot.html harness (nodev=1) serving the feature/pokemon-world tree.
Each PNG is the #screen canvas toDataURL / POST /__shot (game render buffer),
not a hand-drawn mockup and not an isolated asset on green.

REAL GAME SCREENSHOTS:
  house-day.png      — ranch house interior, hour=14 (day windows/light)
  house-night.png    — same interior, hour=22 (night windows, lamp/hearth glow; Grandpa present)
  exterior.png       — farmhouse on ranch map with log pile, path, lamps
  farmer-talk.png    — Clucky Hollow long locked-farm line + HATTIE portrait panel
  barn-sheep.png     — Sheep Shed facade plaque on ranch map
  art-test.png       — earlier harness smoke (canvas upload path)

ILLUSTRATIVE / NOT PROOF (do not treat as in-game):
  qa/v125/*          — crude mockups from prior pass (flat rectangles/isolated assets)

LIMITATIONS:
  - Headless Chrome on the agent box; CSS scales canvas ~2x in the saved PNG.
  - Seeded save (SHOT / wallet 2618); not a phone or alias device test.
  - hour= query forces dayPhase; not wall-clock London night.
  - farmer-talk uses intEnter(chickfarm) auto locked-farm say (same path as players).
  - No claim these were taken in a physical browser window the user watched.
