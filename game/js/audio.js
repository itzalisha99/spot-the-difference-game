// Tiny WebAudio sound kit: every sound is synthesised, no audio files.
// The context is created lazily on the first user gesture, so the game
// stays silent (and error-free) in screenshots and headless runs.

let audioCtx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function ctx() {
  if (audioCtx) return audioCtx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  audioCtx = new AC();
  return audioCtx;
}

function tone(freq, startAt, dur, type, vol) {
  if (muted) return;
  const ac = ctx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, ac.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol || 0.12, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

export function playFind() {
  tone(660, 0, 0.16, 'sine', 0.14);
  tone(880, 0.09, 0.22, 'sine', 0.14);
  tone(1320, 0.18, 0.28, 'triangle', 0.08);
}

export function playWrong() {
  tone(180, 0, 0.18, 'sawtooth', 0.06);
  tone(140, 0.1, 0.2, 'sawtooth', 0.05);
}

export function playHint() {
  tone(520, 0, 0.12, 'sine', 0.09);
  tone(780, 0.1, 0.12, 'sine', 0.09);
  tone(1040, 0.2, 0.18, 'sine', 0.09);
}

export function playWin() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle', 0.12));
}

export function playTick() {
  tone(980, 0, 0.06, 'square', 0.04);
}

export function playClick() {
  tone(440, 0, 0.07, 'sine', 0.06);
}
