// Scene painters: each scene is drawn twice, once per panel, from the
// same code. The right panel passes isRight=true and draws the altered
// version of every difference. Nothing here loads a file; all art is
// flat vector shapes drawn on the canvas, so the two panels always match
// except for the differences themselves. t is animation time in ms.

import { circle, ellipse, rect, roundRect, poly, line, star, skyGradient, text, cloud, bird, lantern, cat } from './draw.js';

const W = 600;
const H = 520;

// --- Level 1: The Bun Shop at Dawn ---------------------------------------
export function paintBakery(ctx, isRight, t) {
  skyGradient(ctx, W, H, '#ffd9a0', '#fff3d6');
  // Window with the dawn sky.
  roundRect(ctx, 58, 48, 130, 100, 10, '#bfe3ff', '#5b3a1e', 4);
  line(ctx, 123, 48, 123, 148, '#5b3a1e', 4);
  line(ctx, 58, 98, 188, 98, '#5b3a1e', 4);
  if (isRight) {
    star(ctx, 118, 92, 16, '#ffd166', 5);
  } else {
    ctx.beginPath();
    ctx.arc(118, 92, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#ffe9a8';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(128, 86, 17, 0, Math.PI * 2);
    ctx.fillStyle = '#bfe3ff';
    ctx.fill();
  }
  // Hanging shop sign (right side).
  line(ctx, 472, 60, 472, 96, '#5b3a1e', 3);
  roundRect(ctx, 428, 96, 88, 56, 12, '#8b5a2b', '#5b3a1e', 3);
  text(ctx, 'BUNS', 472, 126, 22, '#fff3d6', 'center');
  if (!isRight) circle(ctx, 472, 152, 7, '#ffd166', '#5b3a1e', 2);
  // Shelves with bread.
  rect(ctx, 220, 150, 180, 10, '#8b5a2b');
  for (let i = 0; i < 3; i++) {
    ellipse(ctx, 252 + i * 58, 138, 24, 14, '#e8a04c', '#8b5a2b', 2);
  }
  rect(ctx, 220, 230, 180, 10, '#8b5a2b');
  for (let i = 0; i < 3; i++) {
    circle(ctx, 252 + i * 58, 218, 13, '#c96f4a', '#8b5a2b', 2);
  }
  // Counter and the croissant tray.
  rect(ctx, 0, 360, W, 160, '#a9713f');
  rect(ctx, 0, 360, W, 14, '#c98d54');
  ellipse(ctx, 302, 222, 86, 26, '#d9d9d9', '#8a8a8a', 3);
  const croissants = isRight ? 2 : 3;
  for (let i = 0; i < croissants; i++) {
    const cx = 262 + i * 42;
    ellipse(ctx, cx, 214, 20, 12, '#e8a04c', '#8b5a2b', 2);
    line(ctx, cx - 10, 210, cx + 10, 210, '#8b5a2b', 2);
  }
  // Jam jar on the counter (right side).
  roundRect(ctx, 414, 376, 48, 56, 8, isRight ? '#7fb069' : '#d94f3d', '#5b3a1e', 3);
  roundRect(ctx, 414, 376, 48, 16, 8, '#f3e9d2', '#5b3a1e', 2);
  text(ctx, 'JAM', 438, 414, 13, '#fff3d6', 'center');
  // The shop cat sits on the counter (left side).
  if (!isRight) cat(ctx, 168, 402, 1, '#3d3d5c', true);
  // A sleepy baker behind the counter.
  circle(ctx, 520, 330, 26, '#f2c9a0', '#5b3a1e', 3);
  poly(ctx, [[494, 306], [520, 268], [546, 306]], '#fff3d6', '#5b3a1e', 3);
  rect(ctx, 492, 356, 56, 60, '#fff3d6', '#5b3a1e', 3);
  circle(ctx, 512, 326, 3, '#14101f');
  circle(ctx, 530, 326, 3, '#14101f');
}

// --- Level 2: Lantern Night Market ---------------------------------------
export function paintMarket(ctx, isRight, t) {
  skyGradient(ctx, W, H, '#1d1440', '#3d2b6b');
  if (!isRight) star(ctx, 486, 84, 13, '#fff3d6', 4);
  star(ctx, 80, 60, 10, '#fff3d6', 4);
  star(ctx, 330, 52, 9, '#fff3d6', 4);
  star(ctx, 560, 140, 8, '#fff3d6', 4);
  circle(ctx, 540, 60, 22, '#ffe9a8');
  // Strings of lanterns across the street.
  const sway = Math.sin(t / 900) * 0.06;
  lantern(ctx, 96, 118, 22, isRight ? '#7ec8e3' : '#ff5d73', sway);
  lantern(ctx, 210, 100, 20, '#ffb347', -sway);
  lantern(ctx, 330, 116, 22, '#ff5d73', sway);
  lantern(ctx, 452, 100, 20, '#ffd166', -sway);
  lantern(ctx, 540, 128, 18, '#9be15d', sway);
  // Market stalls.
  roundRect(ctx, 40, 300, 240, 130, 10, '#6b3f2a', '#3d2417', 3);
  poly(ctx, [[30, 300], [150, 250], [290, 300]], '#ff5d73', '#7a2e12', 3);
  roundRect(ctx, 330, 300, 230, 130, 10, '#6b3f2a', '#3d2417', 3);
  poly(ctx, [[320, 300], [445, 250], [570, 300]], '#ffb347', '#7a2e12', 3);
  // Fish on the left stall.
  if (!isRight) {
    ellipse(ctx, 268, 322, 26, 12, '#7ec8e3', '#1d4e6b', 2);
    poly(ctx, [[292, 322], [306, 312], [306, 332]], '#7ec8e3', '#1d4e6b', 2);
    circle(ctx, 250, 320, 2.5, '#14101f');
  }
  ellipse(ctx, 120, 322, 20, 10, '#e8a04c', '#8b5a2b', 2);
  ellipse(ctx, 180, 322, 20, 10, '#e8a04c', '#8b5a2b', 2);
  circle(ctx, 420, 322, 14, '#d94f3d', '#7a2e12', 2);
  circle(ctx, 470, 322, 14, '#9be15d', '#3d5c1e', 2);
  // The vendor behind the right stall.
  circle(ctx, 356, 178, 0, null);
  rect(ctx, 330, 210, 52, 70, '#3d6b8e', '#1d4e6b', 3);
  circle(ctx, 356, 182, 24, '#f2c9a0', '#5b3a1e', 3);
  if (!isRight) {
    ellipse(ctx, 356, 160, 30, 12, '#ffd166', '#8a6d1a', 2);
    rect(ctx, 350, 138, 12, 22, '#ffd166', '#8a6d1a', 2);
  }
  circle(ctx, 348, 182, 3, '#14101f');
  circle(ctx, 365, 182, 3, '#14101f');
  // Kite flying over the right stall; its string snaps on the right.
  poly(ctx, [[512, 238], [540, 262], [514, 282], [492, 258]], '#ff5d73', '#7a2e12', 2);
  if (isRight) line(ctx, 516, 266, 522, 282, '#fff3d6', 2);
  else line(ctx, 516, 266, 528, 300, '#fff3d6', 2);
  // Cobblestones and a dropped coin.
  rect(ctx, 0, 430, W, 90, '#4a3b5c');
  for (let i = 0; i < 8; i++) ellipse(ctx, 40 + i * 74, 470, 26, 10, '#5c4a72');
  if (!isRight) circle(ctx, 198, 428, 12, '#ffd166', '#8a6d1a', 2);
  text(ctx, 'NIGHT MARKET', 300, 500, 20, '#f3e9d2', 'center');
}

// --- Level 3: The Clockmaker's Workshop ----------------------------------
export function paintWorkshop(ctx, isRight, t) {
  skyGradient(ctx, W, H, '#2b3a4a', '#4a5a6b');
  // Window with a bird on the sill (right panel only).
  roundRect(ctx, 150, 40, 120, 90, 8, '#bfe3ff', '#1d2b38', 4);
  line(ctx, 210, 40, 210, 130, '#1d2b38', 4);
  if (isRight) bird(ctx, 210, 78, 1.1, '#14101f');
  // The big wall clock.
  circle(ctx, 300, 132, 62, '#f3e9d2', '#1d2b38', 5);
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    circle(ctx, 300 + Math.sin(a) * 50, 132 - Math.cos(a) * 50, 3, '#1d2b38');
  }
  // Left: 10:10. Right: 11:10 — the big clock lost an hour.
  const hourAngle = isRight ? -Math.PI / 6 : -Math.PI / 3;
  line(ctx, 300, 132, 300 + Math.sin(hourAngle) * 30, 132 - Math.cos(hourAngle) * 30, '#14101f', 5);
  line(ctx, 300, 132, 300 + Math.sin(Math.PI / 3) * 44, 132 - Math.cos(Math.PI / 3) * 44, '#14101f', 4);
  circle(ctx, 300, 132, 5, '#d94f3d');
  // Wall gears.
  const gear = (x, y, r, colour) => {
    circle(ctx, x, y, r, colour, '#1d2b38', 3);
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      rect(ctx, x + Math.cos(a) * r - 5, y + Math.sin(a) * r - 5, 10, 10, colour, '#1d2b38', 2);
    }
    circle(ctx, x, y, r * 0.35, '#f3e9d2', '#1d2b38', 2);
  };
  if (!isRight) gear(122, 258, 26, '#c9a86a');
  gear(480, 120, 20, '#c9a86a');
  gear(120, 150, 18, '#8a8a8a');
  // Workbench.
  rect(ctx, 0, 360, W, 160, '#6b4a2f');
  rect(ctx, 0, 360, W, 14, '#8b6a45');
  // Candle with a flame that changes colour.
  rect(ctx, 88, 372, 16, 34, '#f3e9d2', '#1d2b38', 2);
  ellipse(ctx, 96, 396, 9, 12, isRight ? '#7ec8e3' : '#ff9a3d');
  // Book stack; the right panel gains one more book.
  rect(ctx, 470, 380, 76, 12, '#d94f3d', '#1d2b38', 2);
  rect(ctx, 474, 368, 68, 12, '#3d6b8e', '#1d2b38', 2);
  rect(ctx, 478, 356, 60, 12, '#9be15d', '#1d2b38', 2);
  if (isRight) rect(ctx, 482, 344, 52, 12, '#ffd166', '#1d2b38', 2);
  // Tools on the bench.
  line(ctx, 180, 380, 230, 400, '#c9c9c9', 5);
  circle(ctx, 250, 392, 10, '#c9a86a', '#1d2b38', 2);
  // The workshop cat on the bench.
  cat(ctx, 452, 386, 0.9, '#2b2b3d', !isRight);
  // Pendulum under the big clock: swinging on the left, still on the right.
  const swing = isRight ? 0 : Math.sin(t / 700) * 0.35;
  ctx.save();
  ctx.translate(300, 196);
  ctx.rotate(swing);
  line(ctx, 0, 0, 0, 250, '#1d2b38', 4);
  circle(ctx, 0, 256, 16, '#c9a86a', '#1d2b38', 3);
  ctx.restore();
  text(ctx, 'TICK · TOCK', 300, 500, 18, '#f3e9d2', 'center');
}

// --- Level 4: The Moth Garden ---------------------------------------------
export function paintGarden(ctx, isRight, t) {
  skyGradient(ctx, W, H, '#ffd27a', '#a8d98a');
  // Sun, or the cloud that hides it on the right.
  if (isRight) {
    cloud(ctx, 452, 70, 1.2, '#fff3d6');
  } else {
    circle(ctx, 486, 70, 28, '#ffd166');
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      line(ctx, 486 + Math.cos(a) * 36, 70 + Math.sin(a) * 36, 486 + Math.cos(a) * 46, 70 + Math.sin(a) * 46, '#ffd166', 4);
    }
  }
  cloud(ctx, 120, 70, 1, '#fff3d6');
  // The butterfly that flies away on the right.
  if (!isRight) {
    const flap = Math.sin(t / 200) * 0.3;
    ctx.save();
    ctx.translate(300, 128);
    ctx.rotate(flap);
    ellipse(ctx, -15, 0, 18, 12, '#ff9a5c', '#7a2e12', 2);
    ellipse(ctx, 15, 0, 18, 12, '#ffb347', '#7a2e12', 2);
    ellipse(ctx, -12, 12, 12, 8, '#ff7a3d', '#7a2e12', 2);
    ellipse(ctx, 12, 12, 12, 8, '#ff9a5c', '#7a2e12', 2);
    line(ctx, 0, -12, 0, 16, '#3d2417', 3);
    ctx.restore();
  }
  // The big moth on the right side.
  const mothX = 470;
  const mothY = 180;
  ellipse(ctx, mothX - 18, mothY, 20, 12, '#c9b8e8', '#5b4a7a', 2);
  ellipse(ctx, mothX + 18, mothY, 20, 12, '#c9b8e8', '#5b4a7a', 2);
  ellipse(ctx, mothX, mothY, 8, 16, '#8a7ab8', '#5b4a7a', 2);
  if (!isRight) {
    circle(ctx, mothX - 18, mothY - 2, 5, '#ffd166');
    circle(ctx, mothX + 18, mothY - 2, 5, '#ffd166');
  }
  // Flower beds.
  rect(ctx, 0, 340, W, 180, '#7fb069');
  rect(ctx, 0, 340, W, 12, '#9be15d');
  const tulip = (x, y, colour) => {
    line(ctx, x, y, x, y + 46, '#2b6b2b', 4);
    poly(ctx, [[x, y + 20], [x - 14, y + 34], [x, y + 30]], '#2b6b2b');
    circle(ctx, x - 8, y - 8, 8, colour, '#7a2e12', 2);
    circle(ctx, x + 8, y - 8, 8, colour, '#7a2e12', 2);
    circle(ctx, x, y - 13, 9, colour, '#7a2e12', 2);
    ellipse(ctx, x, y + 2, 12, 8, colour, '#7a2e12', 2);
  };
  tulip(132, 300, isRight ? '#9b5de5' : '#d94f3d');
  tulip(210, 320, '#ffb347');
  tulip(300, 310, '#ff5d73');
  tulip(390, 300, '#fff3d6');
  tulip(520, 320, '#ff5d73');
  // Watering can; the spout is missing on the right.
  roundRect(ctx, 180, 400, 60, 40, 8, '#7ec8e3', '#1d4e6b', 3);
  if (!isRight) poly(ctx, [[240, 412], [272, 404], [272, 420], [240, 424]], '#7ec8e3', '#1d4e6b', 2);
  circle(ctx, 196, 396, 8, '#7ec8e3', '#1d4e6b', 2);
  // A mushroom sprouts on the right.
  if (isRight) {
    rect(ctx, 506, 408, 12, 22, '#f3e9d2', '#7a2e12', 2);
    ellipse(ctx, 512, 406, 20, 12, '#d94f3d', '#7a2e12', 2);
    circle(ctx, 506, 402, 2.5, '#fff3d6');
    circle(ctx, 518, 406, 2.5, '#fff3d6');
  }
  // The snail in the corner; its shell swirl is gone on the right.
  ellipse(ctx, 96, 452, 26, 16, '#c9a86a', '#5b3a1e', 2);
  circle(ctx, 118, 440, 10, '#c9a86a', '#5b3a1e', 2);
  if (!isRight) {
    ctx.beginPath();
    ctx.arc(96, 452, 9, 0, Math.PI * 1.5);
    ctx.strokeStyle = '#5b3a1e';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  text(ctx, 'THE MOTH GARDEN', 300, 500, 18, '#2b4a2b', 'center');
}

// --- Level 5: Sky Lanterns over the River ---------------------------------
export function paintFestival(ctx, isRight, t) {
  skyGradient(ctx, W, H, '#241a4a', '#7a3d6b');
  // Moon with a crater that vanishes on the right.
  circle(ctx, 508, 84, 26, '#ffe9a8');
  if (!isRight) {
    circle(ctx, 500, 78, 6, '#e8c96a');
    circle(ctx, 516, 92, 4, '#e8c96a');
  }
  // Fireworks that change colour.
  const fwColour = isRight ? '#9be15d' : '#ffd166';
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5;
    line(ctx, 210, 150, 210 + Math.cos(a) * 34, 150 + Math.sin(a) * 34, fwColour, 3);
  }
  circle(ctx, 210, 150, 6, fwColour);
  // Sky lanterns drifting up; one goes dark on the right.
  lantern(ctx, 132, 96, 18, isRight ? '#4a3b5c' : '#ffb347', Math.sin(t / 800) * 0.05);
  lantern(ctx, 330, 80, 16, '#ff5d73', -Math.sin(t / 800) * 0.05);
  lantern(ctx, 440, 110, 15, '#ffd166', Math.sin(t / 900) * 0.05);
  // The river and the bridge.
  rect(ctx, 0, 380, W, 140, '#2b4a6b');
  for (let i = 0; i < 5; i++) {
    line(ctx, 30 + i * 120, 420 + (i % 2) * 22, 110 + i * 120, 420 + (i % 2) * 22, 'rgba(255,255,255,0.35)', 3);
  }
  poly(ctx, [[340, 380], [420, 300], [500, 300], [580, 380]], '#8b5a2b', '#3d2417', 3);
  ellipse(ctx, 460, 384, 46, 30, '#2b4a6b');
  rect(ctx, 340, 368, 240, 12, '#8b5a2b', '#3d2417', 2);
  circle(ctx, 452, 268, 7, isRight ? '#3d2b4a' : '#ffd166');
  circle(ctx, 452, 268, 12, 'rgba(255,209,102,0.25)');
  // The little boat with its flag.
  poly(ctx, [[220, 340], [320, 340], [300, 372], [240, 372]], '#a9713f', '#3d2417', 3);
  line(ctx, 268, 340, 268, 292, '#3d2417', 3);
  poly(ctx, [[268, 292], [296, 302], [268, 312]], isRight ? '#7ec8e3' : '#d94f3d');
  // The fish that stops jumping on the right.
  if (!isRight) {
    ellipse(ctx, 386, 428, 18, 9, '#7ec8e3', '#1d4e6b', 2);
    poly(ctx, [[402, 428], [414, 420], [414, 436]], '#7ec8e3', '#1d4e6b', 2);
  }
  // Festival-goers on the bank; one vanishes on the right.
  const person = (x, y, colour) => {
    circle(ctx, x, y, 12, '#f2c9a0', '#3d2417', 2);
    rect(ctx, x - 12, y + 12, 24, 34, colour, '#3d2417', 2);
  };
  if (!isRight) person(96, 356, '#ff5d73');
  person(160, 360, '#7ec8e3');
  person(215, 360, '#9be15d');
  // Blossom tree on the right bank; its blossom is gone on the right.
  line(ctx, 540, 380, 540, 330, '#5b3a1e', 6);
  line(ctx, 540, 350, 516, 330, '#5b3a1e', 4);
  if (!isRight) {
    circle(ctx, 540, 322, 20, '#ffb3c9', '#7a2e4a', 2);
    circle(ctx, 516, 336, 14, '#ffb3c9', '#7a2e4a', 2);
    circle(ctx, 562, 336, 14, '#ffb3c9', '#7a2e4a', 2);
  }
  text(ctx, 'SKY LANTERN FESTIVAL', 300, 500, 18, '#f3e9d2', 'center');
}

// --- Level 6: The Lighthouse at Storm's End -------------------------------
export function paintLighthouse(ctx, isRight, t) {
  skyGradient(ctx, W, H, '#1d2b4a', '#4a6b8a');
  // Rain cloud that drifts away on the right.
  if (!isRight) cloud(ctx, 386, 140, 1.1, '#5c6b7a');
  cloud(ctx, 80, 120, 0.9, '#5c6b7a');
  // The gull that flies off on the right.
  if (!isRight) bird(ctx, 132, 84, 1.2, '#f3e9d2');
  bird(ctx, 460, 70, 1, '#f3e9d2');
  // The sea.
  rect(ctx, 0, 380, W, 140, '#1d4e6b');
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 400 + i * 30);
    ctx.quadraticCurveTo(150, 388 + i * 30, 300, 400 + i * 30);
    ctx.quadraticCurveTo(450, 412 + i * 30, 600, 400 + i * 30);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  // The taller wave on the right.
  if (isRight) {
    ctx.beginPath();
    ctx.moveTo(440, 470);
    ctx.quadraticCurveTo(470, 410, 500, 452);
    ctx.quadraticCurveTo(515, 470, 540, 470);
    ctx.closePath();
    ctx.fillStyle = '#7ec8e3';
    ctx.fill();
  }
  // Rocks and the lighthouse.
  poly(ctx, [[220, 520], [260, 380], [340, 380], [380, 520]], '#5c5c6b');
  poly(ctx, [[60, 520], [120, 460], [190, 520]], '#4a4a5c');
  poly(ctx, [[420, 520], [480, 470], [560, 520]], '#4a4a5c');
  // The anchor that vanishes on the right.
  if (!isRight) {
    circle(ctx, 120, 452, 8, '#c9a86a', '#1d2b38', 2);
    line(ctx, 120, 452, 120, 478, '#c9a86a', 4);
    line(ctx, 104, 470, 136, 470, '#c9a86a', 4);
  }
  // The rock that slips into the sea on the right.
  if (!isRight) ellipse(ctx, 540, 470, 18, 10, '#3d3d4a');
  rect(ctx, 272, 240, 56, 150, '#f3e9d2', '#1d2b38', 3);
  rect(ctx, 272, 280, 56, 22, '#d94f3d', '#1d2b38', 2);
  rect(ctx, 272, 330, 56, 22, '#d94f3d', '#1d2b38', 2);
  // A window that goes dark on the right.
  rect(ctx, 288, 240, 24, 26, isRight ? '#2b3a4a' : '#ffd166', '#1d2b38', 2);
  // Lamp room and the beam that turns the other way.
  rect(ctx, 264, 196, 72, 44, '#2b3a4a', '#1d2b38', 3);
  circle(ctx, 300, 218, 14, '#ffd166');
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  if (isRight) {
    ctx.moveTo(336, 218);
    ctx.lineTo(600, 150);
    ctx.lineTo(600, 290);
    ctx.closePath();
  } else {
    ctx.moveTo(264, 218);
    ctx.lineTo(0, 150);
    ctx.lineTo(0, 290);
    ctx.closePath();
  }
  ctx.fill();
  ctx.restore();
  // The flag that flips direction.
  line(ctx, 300, 196, 300, 156, '#1d2b38', 4);
  if (isRight) poly(ctx, [[300, 156], [300, 176], [272, 166]], '#d94f3d');
  else poly(ctx, [[300, 156], [300, 176], [328, 166]], '#d94f3d');
  // The little boat; its sail is gone on the right.
  poly(ctx, [[180, 440], [240, 440], [228, 458], [192, 458]], '#a9713f', '#3d2417', 2);
  line(ctx, 210, 440, 210, 404, '#3d2417', 3);
  if (!isRight) poly(ctx, [[210, 404], [210, 432], [236, 432]], '#fff3d6', '#3d2417', 2);
  text(ctx, "THE LIGHTHOUSE AT STORM'S END", 300, 500, 16, '#f3e9d2', 'center');
}

export const PAINTERS = [
  paintBakery,
  paintMarket,
  paintWorkshop,
  paintGarden,
  paintFestival,
  paintLighthouse,
];
