qa/v128 — staging: LOW ranch perf + title sky clouds
====================================================

LIVE MILESTONE (separate): pocket-pal main @ 252e228 / v127 Pages success
  https://github.com/sonjamesg/pocket-pal/actions/runs/42101543138
  Served version.json {"v":127}. Perf/cloud work is STAGING ONLY (v128).

TITLE CLOUDS (t241u)
  Cause: js/frame.js drew soft radial-gradient ellipses drifting over the full
  title (including barn/animals). Logo JPG already has pixel sky clouds baked in.
  Fix: removed soft overlays; added clipped pixel rect clouds in upper sky only,
  skipping the barn column. Baked logo clouds stay static (no separate sky layer).
  Real frames: title-clouds-t10.png / t200.png / t400.png (sky-band pixels differ).

PERF (t240u) — proxy timings, NOT physical Galaxy
  Method: Playwright headless, Samsung Internet UA, 390×844, DSF 2.75, CDP CPU×4.
  Baseline ranch LOW: ~14.7 fps, frame avg 68ms, p3dWarp avg 25.5ms, canvas 346×312.
  After: ranch ~89 fps, frame avg 11ms, no p3dWarp on overworld LOW, canvas 240×216.
  Shop remains light (~shop after ~2.7ms/frame under same throttle).
  Changes:
    - LOW overworld skips P3D tilt/warp (flat map; gameplay/cull unchanged)
    - fit() caps LOW CSS scale to 1× logical backing store
    - p3dWarp (when used) coarser strips + no haze/smoothing on LOW
    - edgeForest caches thinned keep-set by quantized camera window
    - grass tufts skipped on LOW
    - ?perf=1 shows small FPS chip
  Limits: interiors still use P3D; MED/HIGH unchanged; real niece phone must re-test.
  Saves/cloud data untouched; live v127 not modified by this batch.
