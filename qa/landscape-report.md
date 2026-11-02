# Pocket Pal v4 – Landscape QA
URL: https://sonjamesg.github.io/pocket-pal/?v=4 (cache-busted with &r=1). Window content ≈ 832×395 CSS px. Existing pet STEVE (dog, baby) used.
Screenshots: landscape/L01..L06 (cropped to the page content). Portrait: portrait-v4/P01–P03 (≈346×680 window).

## Layout
- Split is CORRECT: D-pad left, game screen centre, A/B right, SELECT bottom-left, START bottom-right.
- D-pad: fully visible, not clipped (left edge ~4px from window edge – tight but ok).
- A/B: fully visible, not clipped; staggered diagonal, B lower-left of A. No overlap.
- SELECT/START: readable, in bottom corners.

## Screens
- L01 title / L02 main / L03 feed (A on FEED feeds directly; toast "CARROT +20") / L05 start menu / L06 My Pets: all readable, no clipping.
- L04 tricks: stars do NOT overlap TEACH / DO IT (≈15–20px gap). Rows and footer hint fit inside panel. YES = no overlap.

## Fit notes / remaining issues
1. Game screen is small in landscape (~268×240 of 395px height); bottom of screen sits ~150px above window bottom, leaving an empty dark band beneath it (lower half of centre column). Screen could be taller.
2. Visible vertical bands: centre column background (~x200–635) is slightly lighter than the side panels with a hard edge, ending at ~y245 – looks like a leftover panel box that doesn't reach the bottom.
3. Small text (stat bars, "DOG • BABY", footer hints "A load B back SELECT release") is ~8–9px – readable but small.
4. Tricks title tab "TRICKS" slightly overlaps the panel top border (looks intentional).
5. Tricks panel stars are light grey on cream – low contrast (unlearned state).
Not tested: hatching a new pet, DO IT state with learned tricks (stars filled).
