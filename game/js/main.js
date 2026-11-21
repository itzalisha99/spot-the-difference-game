// Mothlight boot: create the game, stage a screenshot state when the
// URL asks for one, then run the animation loop and wire mouse, touch
// and keyboard input. The first frame is already mid-play: level 1
// starts immediately, never a menu.

import { SpotGame } from './game.js';
import { shotFromUrl } from './shots.js';

const canvas = document.getElementById('game');
const statusEl = document.getElementById('status');
const game = new SpotGame(canvas, statusEl);

const staged = shotFromUrl(window.location.search);
if (staged) {
  game.frozen = true;
  game.animTime = 1200;
  game.loadLevel(staged.level, staged);
  if (staged.status === 'levelClear') {
    game.levelBonus = Math.ceil(game.timeLeft) * 10;
  }
} else {
  game.loadLevel(0);
}

window.__mothlight = game;

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 1280,
    y: ((event.clientY - rect.top) / rect.height) * 720,
  };
}

canvas.addEventListener('click', (event) => {
  const p = canvasPoint(event);
  game.handleClick(p.x, p.y);
});

canvas.addEventListener('touchstart', (event) => {
  event.preventDefault();
  const touch = event.changedTouches[0];
  const p = canvasPoint(touch);
  game.handleClick(p.x, p.y);
}, { passive: false });

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'h') game.useHint();
  else if (key === 'n') game.nextLevel();
  else if (key === 'r') game.loadLevel(game.levelIndex);
  else if (key === 'm') {
    import('./audio.js').then((audio) => audio.setMuted(!audio.isMuted()));
  } else if (key >= '1' && key <= '6') {
    game.loadLevel(parseInt(key, 10) - 1);
  }
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(100, now - last);
  last = now;
  game.update(dt);
  game.render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
