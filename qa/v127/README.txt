qa/v127 — START GAME "M" spike fix
=================================
CAUSE: js/draw.js otxt() stroked text with canvas default lineJoin=miter.
Sharp peaks on capital M extended into long black miter needles (James photo).

FIX: lineJoin='round' + miterLimit=2 in otxt(). Same colour/weight; logo art untouched.

REAL in-game screenshots (shot.html, peak pulse scale, ?nodev=1):
  title-gate-desktop.png / title-gate-desktop-css.png
  title-gate-phone.png / title-gate-phone-css.png
  *-pillcrop.png — pill close-ups
Objective thin-spike scan on pill crops after fix: 0 needle columns.
miter-compare.html/.png — isolated miter vs round stroke of "GAME" (not in-game).
