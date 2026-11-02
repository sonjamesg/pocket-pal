# Pocket Pal portrait QA
URL: https://sonjamesg.github.io/pocket-pal/?v=qa
Method: separate Chrome window resized with wmctrl to 532x1150 device px (content ~532 CSS px wide, tall portrait; narrower than 390 isn't possible, Chrome min window width). DevTools device toolbar not available through the box tools. Screenshots cropped from the X display to that window (browser chrome visible at top; the other maximized Chrome window shows faintly at the edges — not a game bug).
Clean title: "0 pets saved on this device", no Continue shown. Name prompt answered STEVE (2nd pet REX, cancelled at species screen).

| File | Shows |
|---|---|
| 01-title.png | Title, NEW PET, "0 pets saved" |
| 02-species.png | CHOOSE YOUR PAL, Dog highlighted (Horse, Rabbit) |
| 03-egg.png | STEVE'S EGG, TAP A TO HATCH, 6 hearts |
| 04-main.png | Main care screen, HUD + dog + FEED/PLAY/TRICKS/PET/SLEEP bar |
| 05-feed.png | FEED panel, 8 foods, "KIBBLE ♥ favourite" |
| 06-play.png | PLAY panel: Fetch/Memory/Dash |
| 07-fetch.png | Fetch in progress (23s) |
| 08-tricks.png | TRICKS list (5 tricks) |
| 09-start-menu.png | MENU: Resume/Save/My Pets/New Pet/Home |
| 10-mypets.png | MY PETS: STEVE + "+ NEW PET" |

## Fit issues
1. **Tricks list (08):** 5th star of each row runs under the "TEACH" label (stars and TEACH overlap). Real overlap bug.
2. **"SAVED" toast** (bottom-right of game screen) overlaps content: covers the ROLL OVER "TEACH" label on the tricks list and the DASH row text corner on the play menu. It's transient (~2s) but collides with UI.
3. **Layout/gap:** game screen takes only the top ~half; there is a ~50px empty dark band above the screen and a large dark gap between screen and controller; controller doesn't use the full width (D-pad left, A/B right, big empty middle between them is OK but A/B cluster sits off-centre). Screen is ~4:3, leaving unused vertical space.
4. **Small controls:** SELECT / START pills are small (~80x28 px) and low emphasis; "POCKET PAL" label between them is tiny, dark-on-dark, nearly unreadable.
5. **Dense panels:** Feed menu (05) fills nearly the whole screen incl. all 8 foods; hint text "choose A feed B back" is small (~13px) but readable. Panels hide pet entirely while open (by design).
6. **Keyboard:** pressing Enter (Start) did not open the menu in my test; clicking on-screen START did. Z/X/arrows worked. (May be key-event timing; re-check.)
7. **Fetch end:** after pressing B in Fetch, the DONE card appeared with timer frozen at 18s and the game seemed to flicker between running and DONE frames briefly before settling on DONE. Minor state glitch.
8. No horizontal scroll/clipping of game canvas seen; title text and species labels all fit. "NEW PET" row in My Pets and list fit well.
9. Tooling note: X screen grabs lag ~2-3s behind, so a couple of frames were retaken.
