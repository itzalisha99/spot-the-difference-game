# Mothlight — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/itzalisha99/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/itzalisha99/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game that opens straight into play:
two near-identical hand-drawn pictures side by side, gold rings on the
differences you find, several still hiding, and a counter that always
shows how many are left.

## The game

**Mothlight** follows a travelling moth-keeper through six original
scenes — a dawn bun shop, a lantern night market, a clockmaker's
workshop, a moth garden, a sky-lantern festival on the river, and a
lighthouse at storm's end. Every scene is drawn in code, so the two
panels match exactly except for the differences hidden in them.

- **6 scenes, 42 differences in all** — 5, 6, 7, 7, 8 and 9 per scene,
  with the timer shrinking from 120s to 95s as the hunt gets harder.
- **Fair but not obvious** — differences are real changes (a missing
  croissant, a clock that lost an hour, a beam that turned the other
  way), never single-pixel hunting. Click in either picture; the ring
  appears in both.
- **Feel** — a chime and gold ring on every find, a combo that grows
  (+100, +125, +150…), a wrong click costs 2 seconds and breaks the
  combo, and the timer bar turns red under 10 seconds.
- **Hints that behave** — 3 per scene, −25 points each, one unfound
  difference pulses in blue for a few seconds.
- **Win / lose flow** — clear a scene for a time bonus and confetti,
  run out of time and the missed differences are circled in red so you
  can study them, find all 42 and earn a rank, from Curious Newcomer
  to Legend of the Mothlight.
- **No network, no files to load** — all art is vector shapes drawn on
  canvas, all sound is synthesised WebAudio. Open `game/index.html`
  from any static server and play.

## How to play

| Input | What it does |
|---|---|
| Click / tap a picture | Ring a difference (either picture counts) |
| H | Use a hint (3 per scene) |
| N | Next scene after a clear |
| R | Restart the current scene |
| 1–6 | Jump to a scene |
| M | Mute |

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Or serve `game/` with any static server. To build the make.fun
hand-in (copies `game/` and `screenshots/` and writes `dossier.json`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `game/index.html` — the page; `game/css/style.css` — the frame.
- `game/js/main.js` — boot, input, animation loop.
- `game/js/game.js` — state, scoring, timer, hints, rendering, overlays.
- `game/js/levels.js` — the 6 scenes and their 42 differences.
- `game/js/scenes.js` — the six hand-drawn scene painters.
- `game/js/draw.js` — shared canvas drawing helpers.
- `game/js/audio.js` — synthesised WebAudio sounds.
- `game/js/shots.js` — screenshot staging (`?shot=cover|play|festival|win`).
- `main.ts` — the make.fun hand-in program; `vendor/makefun-game.ts` — the kit library.

## Entry

- Competition: https://make.fun/bounty/best-spot-the-difference-game-20261121-0451
- Referral code: `y05d5qm6`

## Licence

MIT — see `LICENSE`.
