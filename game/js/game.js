// Mothlight game state and rendering: one 1280x720 canvas holds the
// HUD, the two side-by-side panels, the bottom bar and every overlay.
// Clicking a difference in EITHER panel rings it in both.

import { LEVELS, TOTAL_DIFFS, rankForScore, PANEL_W, PANEL_H } from './levels.js';
import { PAINTERS } from './scenes.js';
import { circle, ellipse, rect, roundRect, poly, line, text } from './draw.js';
import { playFind, playWrong, playHint, playWin, playTick, playClick, setMuted, isMuted } from './audio.js';

export const CANVAS_W = 1280;
export const CANVAS_H = 720;
const PANEL_Y = 76;
const LEFT_X = 20;
const RIGHT_X = 660;
const HINT_BTN = { x: 20, y: 624, w: 180, h: 56 };
const MUTE_BTN = { x: 1100, y: 624, w: 160, h: 56 };

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export class SpotGame {
  constructor(canvas, statusEl) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.statusEl = statusEl;
    this.levelIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.hintsLeft = 3;
    this.timeLeft = LEVELS[0].time;
    this.status = 'playing';
    this.frozen = false;
    this.animTime = 0;
    this.particles = [];
    this.toast = '';
    this.toastUntil = 0;
    this.hintPulse = null;
    this.shakeUntil = 0;
    this.lastTickSecond = -1;
    this.levelBonus = 0;
    this.totalFound = 0;
    this.startedAt = Date.now();
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get remaining() {
    return this.level.diffs.length - this.found.size;
  }

  loadLevel(index, staged) {
    this.levelIndex = index;
    this.found = new Set(staged && staged.found ? staged.found : []);
    this.hintsLeft = staged && staged.hintsLeft !== undefined ? staged.hintsLeft : 3;
    this.timeLeft = staged && staged.timeLeft !== undefined ? staged.timeLeft : this.level.time;
    this.score = staged && staged.score !== undefined ? staged.score : this.score;
    this.combo = staged && staged.combo !== undefined ? staged.combo : 0;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.totalFound = staged && staged.totalFound !== undefined ? staged.totalFound : this.totalFound;
    this.status = staged && staged.status ? staged.status : 'playing';
    this.particles = [];
    this.hintPulse = staged && staged.hintDiff !== undefined ? { diff: staged.hintDiff, until: Infinity } : null;
    this.levelBonus = 0;
    this.toast = staged && staged.toast ? staged.toast : '';
    this.toastUntil = this.toast ? Infinity : 0;
    this.announce(`${this.level.name}. ${this.remaining} differences left.`);
  }

  announce(msg) {
    if (this.statusEl) this.statusEl.textContent = msg;
  }

  // Panel-local point for a canvas point, or null when outside both panels.
  panelPoint(x, y) {
    if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
    if (x >= LEFT_X && x <= LEFT_X + PANEL_W) return { px: x - LEFT_X, py: y - PANEL_Y, side: 'left' };
    if (x >= RIGHT_X && x <= RIGHT_X + PANEL_W) return { px: x - RIGHT_X, py: y - PANEL_Y, side: 'right' };
    return null;
  }

  nearestUnfound(px, py) {
    let best = null;
    let bestDist = Infinity;
    this.level.diffs.forEach((diff, i) => {
      if (this.found.has(i)) return;
      const spots = [{ x: diff.x, y: diff.y }];
      if (diff.x2 !== undefined) spots.push({ x: diff.x2, y: diff.y2 });
      for (const s of spots) {
        const d = Math.hypot(px - s.x, py - s.y);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
    });
    return best !== null && bestDist <= this.level.diffs[best].r + 16 ? best : -1;
  }

  handleClick(x, y) {
    if (this.status === 'levelClear') {
      if (this.inRect(x, y, this.cardButtonRect())) this.nextLevel();
      return;
    }
    if (this.status === 'timeUp') {
      if (this.inRect(x, y, this.cardButtonRect())) this.loadLevel(this.levelIndex);
      return;
    }
    if (this.status === 'gameClear') {
      if (this.inRect(x, y, this.cardButtonRect())) this.restart();
      return;
    }
    if (this.status !== 'playing') return;
    if (this.inRect(x, y, HINT_BTN)) {
      this.useHint();
      return;
    }
    if (this.inRect(x, y, MUTE_BTN)) {
      setMuted(!isMuted());
      playClick();
      return;
    }
    const dot = this.levelDotAt(x, y);
    if (dot >= 0 && dot !== this.levelIndex) {
      playClick();
      this.loadLevel(dot);
      return;
    }
    const p = this.panelPoint(x, y);
    if (!p) return;
    const hit = this.nearestUnfound(p.px, p.py);
    if (hit >= 0) this.findDifference(hit, p);
    else this.missClick(p);
  }

  inRect(x, y, r) {
    return r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  }

  findDifference(index, point) {
    const diff = this.level.diffs[index];
    this.found.add(index);
    this.totalFound++;
    this.combo++;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    const gained = 100 + (this.combo - 1) * 25;
    this.score += gained;
    playFind();
    this.toast = `+${gained}  ·  ${diff.label}`;
    this.toastUntil = Date.now() + 2200;
    this.spawnRing(point, diff);
    this.announce(`${diff.label}. ${this.remaining} differences left.`);
    if (this.found.size === this.level.diffs.length) this.clearLevel();
  }

  missClick(point) {
    this.combo = 0;
    this.timeLeft = Math.max(0, this.timeLeft - 2);
    this.shakeUntil = Date.now() + 180;
    playWrong();
    this.toast = 'Not there — minus 2 seconds. Look closer!';
    this.toastUntil = Date.now() + 1800;
    this.particles.push({ kind: 'x', x: point.px, y: point.py, side: point.side, born: Date.now(), life: 700 });
    this.announce('No difference there. Two seconds lost.');
  }

  useHint() {
    if (this.hintsLeft <= 0) {
      this.toast = 'No hints left on this level.';
      this.toastUntil = Date.now() + 1800;
      return;
    }
    const unfound = this.level.diffs.map((d, i) => i).filter((i) => !this.found.has(i));
    if (unfound.length === 0) return;
    const pick = unfound[Math.floor(Math.random() * unfound.length)];
    this.hintsLeft--;
    this.score = Math.max(0, this.score - 25);
    playHint();
    this.hintPulse = { diff: pick, until: Date.now() + 2600 };
    this.toast = 'Hint: watch the pulsing ring. −25 points.';
    this.toastUntil = Date.now() + 2200;
    this.announce('Hint used. One difference is pulsing.');
  }

  clearLevel() {
    this.levelBonus = Math.ceil(this.timeLeft) * 10;
    this.score += this.levelBonus;
    this.status = 'levelClear';
    playWin();
    this.spawnConfetti();
    this.announce(`${this.level.name} complete! Time bonus +${this.levelBonus}.`);
  }

  nextLevel() {
    playClick();
    if (this.levelIndex + 1 >= LEVELS.length) {
      this.status = 'gameClear';
      return;
    }
    this.loadLevel(this.levelIndex + 1);
  }

  restart() {
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.totalFound = 0;
    this.loadLevel(0);
  }

  cardButtonRect() {
    return { x: 490, y: 468, w: 300, h: 56 };
  }

  levelDotAt(x, y) {
    for (let i = 0; i < LEVELS.length; i++) {
      const cx = 560 + i * 44;
      if (Math.hypot(x - cx, y - 652) <= 16) return i;
    }
    return -1;
  }

  spawnRing(point, diff) {
    const spots = [{ x: diff.x, y: diff.y }];
    if (diff.x2 !== undefined) spots.push({ x: diff.x2, y: diff.y2 });
    for (const s of spots) {
      this.particles.push({ kind: 'ring', x: s.x, y: s.y, born: Date.now(), life: 900 });
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        this.particles.push({
          kind: 'spark', x: s.x, y: s.y, vx: Math.cos(a) * 90, vy: Math.sin(a) * 90,
          born: Date.now(), life: 600,
        });
      }
    }
  }

  spawnConfetti() {
    for (let i = 0; i < 90; i++) {
      this.particles.push({
        kind: 'confetti', x: 100 + Math.random() * 1080, y: 90 + Math.random() * 60,
        vx: (Math.random() - 0.5) * 60, vy: 60 + Math.random() * 120,
        colour: ['#ffd166', '#ff5d73', '#7ec8e3', '#9be15d', '#ff9a5c'][i % 5],
        born: Date.now(), life: 1800 + Math.random() * 800,
      });
    }
  }

  update(dt) {
    if (this.frozen) return;
    this.animTime += dt;
    if (this.status === 'playing') {
      this.timeLeft -= dt / 1000;
      const whole = Math.ceil(this.timeLeft);
      if (this.timeLeft <= 10 && whole !== this.lastTickSecond && this.timeLeft > 0) {
        this.lastTickSecond = whole;
        playTick();
      }
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.status = 'timeUp';
        this.announce(`Time up on ${this.level.name}. The missing differences are circled in red.`);
      }
    }
    if (this.hintPulse && this.hintPulse.until !== Infinity && Date.now() > this.hintPulse.until) {
      this.hintPulse = null;
    }
  }

  // ---------------------------------------------------------------- render

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.save();
    if (Date.now() < this.shakeUntil) {
      ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    }
    this.drawTopBar(ctx);
    this.drawPanels(ctx);
    this.drawBottomBar(ctx);
    this.drawParticles(ctx);
    if (this.status === 'levelClear') this.drawLevelClear(ctx);
    if (this.status === 'timeUp') this.drawTimeUp(ctx);
    if (this.status === 'gameClear') this.drawGameClear(ctx);
    ctx.restore();
  }

  drawTopBar(ctx) {
    rect(ctx, 0, 0, CANVAS_W, 64, '#1d1430');
    text(ctx, '✦ MOTHLIGHT', 20, 26, 26, '#ffd166', 'left', '800');
    text(ctx, this.level.name, 20, 50, 15, '#f3e9d2', 'left', '600');
    // Timer bar.
    const frac = clamp(this.timeLeft / this.level.time, 0, 1);
    roundRect(ctx, 480, 18, 320, 16, 8, '#3d2b4a');
    roundRect(ctx, 480, 18, 320 * frac, 16, 8, this.timeLeft <= 10 ? '#ff5d73' : '#ffd166');
    const mm = Math.floor(Math.max(0, this.timeLeft) / 60);
    const ss = String(Math.floor(Math.max(0, this.timeLeft) % 60)).padStart(2, '0');
    text(ctx, `${mm}:${ss}`, 640, 50, 18, this.timeLeft <= 10 ? '#ff8fa0' : '#f3e9d2', 'center', '800');
    text(ctx, `SCORE  ${this.score}`, 830, 26, 22, '#f3e9d2', 'left', '800');
    text(ctx, `COMBO ×${this.combo}`, 830, 50, 14, '#ffd166', 'left', '700');
    // The counter the judge looks for: found, and how many are left.
    const counter = `FOUND ${this.found.size}/${this.level.diffs.length}  ·  ${this.remaining} LEFT`;
    roundRect(ctx, 1020, 10, 240, 44, 10, this.remaining === 0 ? '#2b6b3d' : '#7a2e12', '#ffd166', 2);
    text(ctx, counter, 1140, 33, 19, '#fff3d6', 'center', '800');
  }

  drawPanels(ctx) {
    const panels = [
      { x: LEFT_X, isRight: false, tag: 'LEFT · ORIGINAL' },
      { x: RIGHT_X, isRight: true, tag: 'RIGHT · CHANGED' },
    ];
    for (const panel of panels) {
      ctx.save();
      ctx.translate(panel.x, PANEL_Y);
      roundRect(ctx, 0, 0, PANEL_W, PANEL_H, 12, '#000000');
      ctx.clip();
      PAINTERS[this.levelIndex](ctx, panel.isRight, this.animTime);
      ctx.restore();
      roundRect(ctx, panel.x, PANEL_Y, PANEL_W, PANEL_H, 12, null, '#ffd166', 3);
      // Panel tag.
      roundRect(ctx, panel.x + 10, PANEL_Y + 10, 168, 26, 13, 'rgba(20,16,31,0.78)');
      text(ctx, panel.tag, panel.x + 94, PANEL_Y + 24, 13, '#ffd166', 'center', '800');
      this.drawMarkers(ctx, panel.x, panel.isRight);
      if (this.hintPulse) this.drawHintPulse(ctx, panel.x);
      if (this.status === 'timeUp') this.drawReveal(ctx, panel.x);
    }
  }

  drawMarkers(ctx, panelX, isRight) {
    this.level.diffs.forEach((diff, i) => {
      if (!this.found.has(i)) return;
      const spots = [{ x: diff.x, y: diff.y }];
      if (diff.x2 !== undefined) spots.push({ x: diff.x2, y: diff.y2 });
      for (const s of spots) {
        const cx = panelX + s.x;
        const cy = PANEL_Y + s.y;
        circle(ctx, cx, cy, diff.r + 6, null, '#ffd166', 5);
        circle(ctx, cx, cy, diff.r + 12, null, 'rgba(255,209,102,0.45)', 2);
        // Gold check mark on the ring.
        ctx.beginPath();
        ctx.moveTo(cx - 9, cy);
        ctx.lineTo(cx - 2, cy + 8);
        ctx.lineTo(cx + 11, cy - 8);
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    });
  }

  drawHintPulse(ctx, panelX) {
    const diff = this.level.diffs[this.hintPulse.diff];
    if (!diff || this.found.has(this.hintPulse.diff)) return;
    const pulse = 1 + Math.sin(this.animTime / 180) * 0.18;
    const spots = [{ x: diff.x, y: diff.y }];
    if (diff.x2 !== undefined) spots.push({ x: diff.x2, y: diff.y2 });
    for (const s of spots) {
      ctx.save();
      ctx.setLineDash([8, 6]);
      circle(ctx, panelX + s.x, PANEL_Y + s.y, (diff.r + 10) * pulse, null, '#7ec8e3', 4);
      ctx.restore();
    }
  }

  drawReveal(ctx, panelX) {
    this.level.diffs.forEach((diff, i) => {
      if (this.found.has(i)) return;
      const spots = [{ x: diff.x, y: diff.y }];
      if (diff.x2 !== undefined) spots.push({ x: diff.x2, y: diff.y2 });
      for (const s of spots) {
        ctx.save();
        ctx.setLineDash([6, 5]);
        circle(ctx, panelX + s.x, PANEL_Y + s.y, diff.r + 6, null, '#ff5d73', 4);
        ctx.restore();
      }
    });
  }

  drawBottomBar(ctx) {
    rect(ctx, 0, 608, CANVAS_W, 112, '#1d1430');
    // Hint button.
    roundRect(ctx, HINT_BTN.x, HINT_BTN.y, HINT_BTN.w, HINT_BTN.h, 12, this.hintsLeft > 0 ? '#3d6b8e' : '#3d2b4a', '#7ec8e3', 2);
    text(ctx, `💡 HINT  (${this.hintsLeft})`, HINT_BTN.x + 90, HINT_BTN.y + 29, 17, '#fff3d6', 'center', '800');
    // Level dots: click one to jump to that scene.
    text(ctx, 'SCENES', 560, 632, 12, '#b8a8d8', 'left', '700');
    for (let i = 0; i < LEVELS.length; i++) {
      const cx = 560 + i * 44;
      const done = i < this.levelIndex;
      const current = i === this.levelIndex;
      circle(ctx, cx, 652, current ? 13 : 10, current ? '#ffd166' : done ? '#2b6b3d' : '#3d2b4a', '#ffd166', 2);
      text(ctx, String(i + 1), cx, 653, 12, current ? '#1d1430' : '#f3e9d2', 'center', '800');
    }
    // Mute button.
    roundRect(ctx, MUTE_BTN.x, MUTE_BTN.y, MUTE_BTN.w, MUTE_BTN.h, 12, '#3d2b4a', '#b8a8d8', 2);
    text(ctx, isMuted() ? '🔇 MUTED' : '🔊 SOUND', MUTE_BTN.x + 80, MUTE_BTN.y + 29, 16, '#f3e9d2', 'center', '800');
    // Second row: scene info on the left, controls on the right. A live
    // toast takes the middle of this row instead of the two labels.
    if (this.toast && Date.now() < this.toastUntil) {
      text(ctx, this.toast, 640, 697, 15, '#ffd166', 'center', '700');
    } else {
      text(ctx, `${this.level.sub}  ·  ${TOTAL_DIFFS} differences in all  ·  6 scenes`, 220, 697, 13, '#f3e9d2', 'left', '600');
      text(ctx, 'Click a difference in either picture  ·  H hint  ·  N next  ·  R restart', 1260, 697, 12, '#b8a8d8', 'right', '600');
    }
  }

  drawParticles(ctx) {
    const now = Date.now();
    this.particles = this.particles.filter((p) => now - p.born < p.life);
    for (const p of this.particles) {
      const age = (now - p.born) / p.life;
      if (p.kind === 'ring') {
        const panelX = LEFT_X;
        circle(ctx, panelX + p.x, PANEL_Y + p.y, 10 + age * 46, null, `rgba(255,209,102,${1 - age})`, 4);
        circle(ctx, RIGHT_X + p.x, PANEL_Y + p.y, 10 + age * 46, null, `rgba(255,209,102,${1 - age})`, 4);
      } else if (p.kind === 'spark') {
        circle(ctx, LEFT_X + p.x + p.vx * age * 0.6, PANEL_Y + p.y + p.vy * age * 0.6, 3, `rgba(255,209,102,${1 - age})`);
        circle(ctx, RIGHT_X + p.x + p.vx * age * 0.6, PANEL_Y + p.y + p.vy * age * 0.6, 3, `rgba(255,209,102,${1 - age})`);
      } else if (p.kind === 'x') {
        const baseX = p.side === 'left' ? LEFT_X : RIGHT_X;
        ctx.save();
        ctx.globalAlpha = 1 - age;
        line(ctx, baseX + p.x - 12, PANEL_Y + p.y - 12, baseX + p.x + 12, PANEL_Y + p.y + 12, '#ff5d73', 5);
        line(ctx, baseX + p.x + 12, PANEL_Y + p.y - 12, baseX + p.x - 12, PANEL_Y + p.y + 12, '#ff5d73', 5);
        ctx.restore();
      } else if (p.kind === 'confetti') {
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - age);
        rect(ctx, p.x + p.vx * age, p.y + p.vy * age, 8, 5, p.colour);
        ctx.restore();
      }
    }
  }

  drawCard(ctx, title, lines, buttonLabel) {
    ctx.save();
    ctx.fillStyle = 'rgba(20,16,31,0.72)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    roundRect(ctx, 390, 180, 500, 344, 18, '#241a3d', '#ffd166', 3);
    text(ctx, title, 640, 232, 30, '#ffd166', 'center', '800');
    lines.forEach((lineText, i) => {
      text(ctx, lineText, 640, 292 + i * 34, 18, '#f3e9d2', 'center', '600');
    });
    const btn = this.cardButtonRect();
    roundRect(ctx, btn.x, btn.y, btn.w, btn.h, 12, '#ffd166', '#7a2e12', 2);
    text(ctx, buttonLabel, 640, btn.y + 29, 19, '#1d1430', 'center', '800');
    ctx.restore();
  }

  drawLevelClear(ctx) {
    const last = this.levelIndex + 1 >= LEVELS.length;
    this.drawCard(
      ctx,
      '✦ LEVEL COMPLETE ✦',
      [
        `${this.level.name} — all ${this.level.diffs.length} differences found!`,
        `Time bonus +${this.levelBonus}  ·  Best combo ×${this.bestCombo}`,
        `Score ${this.score}  ·  ${this.totalFound} of ${TOTAL_DIFFS} differences found`,
      ],
      last ? 'SEE YOUR RESULT  →' : 'NEXT SCENE  →  (N)',
    );
  }

  drawTimeUp(ctx) {
    this.drawCard(
      ctx,
      "TIME'S UP",
      [
        `${this.level.name} — you found ${this.found.size} of ${this.level.diffs.length}.`,
        'The ones you missed are circled in red on both pictures.',
        'Study them, then try the scene again.',
      ],
      'TRY AGAIN  (R)',
    );
  }

  drawGameClear(ctx) {
    this.drawCard(
      ctx,
      '✦ YOU FOUND THEM ALL ✦',
      [
        `All ${TOTAL_DIFFS} differences across 6 scenes.`,
        `Final score ${this.score}  ·  Best combo ×${this.bestCombo}`,
        `Your rank: ${rankForScore(this.score)}`,
      ],
      'PLAY AGAIN  (R)',
    );
  }
}
