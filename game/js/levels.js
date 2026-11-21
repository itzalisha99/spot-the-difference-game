// Mothlight level data: six hand-drawn scenes, 42 differences in all.
// A difference is a point in panel coordinates (600 x 520) with a hit
// radius and a short label the game shows when it is found. The right
// panel always shows the altered version; the left panel is the original.
// Coordinates here must match the branches in scenes.js exactly.

export const PANEL_W = 600;
export const PANEL_H = 520;

export const LEVELS = [
  {
    name: 'The Bun Shop at Dawn',
    sub: 'Level 1 · Warm-up · 5 differences',
    time: 120,
    accent: '#ffb347',
    diffs: [
      { x: 118, y: 92, r: 30, label: 'Moon turned to a star' },
      { x: 302, y: 214, r: 34, label: 'A croissant vanished' },
      { x: 472, y: 128, r: 30, label: 'The bell fell off the sign' },
      { x: 168, y: 402, r: 36, label: 'The shop cat slipped away' },
      { x: 438, y: 404, r: 32, label: 'Red jam turned green' },
    ],
  },
  {
    name: 'Lantern Night Market',
    sub: 'Level 2 · Busy street · 6 differences',
    time: 115,
    accent: '#ff5d73',
    diffs: [
      { x: 96, y: 118, r: 32, label: 'A lantern changed colour' },
      { x: 268, y: 322, r: 34, label: 'A fish is missing from the stall' },
      { x: 486, y: 84, r: 28, label: 'A star blinked out' },
      { x: 356, y: 178, r: 34, label: 'The vendor lost his hat' },
      { x: 198, y: 428, r: 30, label: 'A coin rolled away' },
      { x: 528, y: 300, r: 32, label: 'The kite string snapped' },
    ],
  },
  {
    name: "The Clockmaker's Workshop",
    sub: 'Level 3 · Ticking puzzle · 7 differences',
    time: 110,
    accent: '#7ec8e3',
    diffs: [
      { x: 300, y: 132, r: 36, label: 'The big clock lost an hour' },
      { x: 122, y: 258, r: 30, label: 'A gear fell off the wall' },
      { x: 452, y: 386, r: 32, label: "The cat's tail went down" },
      { x: 96, y: 396, r: 28, label: 'The candle flame went blue' },
      { x: 508, y: 216, r: 30, label: 'An extra book appeared' },
      { x: 210, y: 78, r: 28, label: 'A bird landed on the window' },
      { x: 300, y: 452, r: 30, label: 'The pendulum stopped swinging' },
    ],
  },
  {
    name: 'The Moth Garden',
    sub: 'Level 4 · Quiet hunt · 7 differences',
    time: 105,
    accent: '#9be15d',
    diffs: [
      { x: 132, y: 300, r: 32, label: 'A tulip changed colour' },
      { x: 300, y: 128, r: 30, label: 'A butterfly flew away' },
      { x: 470, y: 180, r: 34, label: 'The moth lost a wing spot' },
      { x: 210, y: 420, r: 30, label: 'The watering can lost its spout' },
      { x: 512, y: 420, r: 30, label: 'A mushroom sprouted' },
      { x: 96, y: 452, r: 30, label: 'The snail lost its shell swirl' },
      { x: 486, y: 70, r: 30, label: 'The sun hid behind a cloud' },
    ],
  },
  {
    name: 'Sky Lanterns over the River',
    sub: 'Level 5 · Festival night · 8 differences',
    time: 100,
    accent: '#ff9a5c',
    diffs: [
      { x: 132, y: 96, r: 30, label: 'A sky lantern went out' },
      { x: 268, y: 330, r: 32, label: 'The boat flag changed colour' },
      { x: 452, y: 268, r: 34, label: 'The bridge lost an arch light' },
      { x: 386, y: 428, r: 30, label: 'A fish stopped jumping' },
      { x: 508, y: 84, r: 30, label: 'The moon lost its crater' },
      { x: 210, y: 150, r: 32, label: 'Fireworks turned green' },
      { x: 96, y: 356, r: 32, label: 'A festival-goer vanished' },
      { x: 540, y: 380, r: 30, label: 'Blossom fell off the tree' },
    ],
  },
  {
    name: "The Lighthouse at Storm's End",
    sub: 'Level 6 · Final watch · 9 differences',
    time: 95,
    accent: '#ffd166',
    diffs: [
      { x: 140, y: 220, x2: 470, y2: 220, r: 40, label: 'The beam turned the other way' },
      { x: 132, y: 84, r: 28, label: 'A gull flew off' },
      { x: 480, y: 452, r: 34, label: 'A wave grew taller' },
      { x: 300, y: 240, r: 28, label: 'A lighthouse window went dark' },
      { x: 120, y: 452, r: 30, label: 'The anchor vanished' },
      { x: 420, y: 140, r: 28, label: 'A rain cloud drifted away' },
      { x: 210, y: 430, r: 32, label: 'The little boat lost its sail' },
      { x: 540, y: 470, r: 30, label: 'A rock slipped into the sea' },
      { x: 300, y: 52, r: 28, label: 'The flag flipped direction' },
    ],
  },
];

export const TOTAL_DIFFS = LEVELS.reduce((n, level) => n + level.diffs.length, 0);

export function rankForScore(score) {
  if (score >= 9000) return 'Legend of the Mothlight';
  if (score >= 7000) return 'Eagle-Eyed Keeper';
  if (score >= 5000) return 'Sharp-Eyed Wanderer';
  if (score >= 3000) return 'Patient Spotter';
  return 'Curious Newcomer';
}
