// Screenshot staging: ?shot=cover|play|festival|win freezes the game in
// a real mid-play state so the screenshots are honest renders of the
// game's own code — two pictures side by side, gold rings on the
// differences found, several still unfound, and the counter showing
// how many are left. ?level=&found=1,2&time=&score= stages any state.

export const SHOTS = {
  cover: { level: 2, found: [0, 1, 3, 5], timeLeft: 83, score: 1450, combo: 3 },
  play: { level: 0, found: [1, 3], timeLeft: 102, score: 420, combo: 2 },
  festival: { level: 4, found: [0, 2, 4, 5, 7], timeLeft: 61, score: 2980, combo: 4, hintDiff: 1 },
  win: { level: 5, found: [0, 1, 2, 3, 4, 5, 6, 7, 8], timeLeft: 34, score: 5120, combo: 5, totalFound: 42, status: 'levelClear' },
};

export function shotFromUrl(search) {
  const params = new URLSearchParams(search);
  const name = params.get('shot');
  if (name && SHOTS[name]) return SHOTS[name];
  if (params.get('level') !== null) {
    const found = params.get('found')
      ? params.get('found').split(',').map((n) => parseInt(n, 10)).filter((n) => !Number.isNaN(n))
      : [];
    return {
      level: parseInt(params.get('level'), 10) || 0,
      found,
      timeLeft: params.get('time') ? parseInt(params.get('time'), 10) : undefined,
      score: params.get('score') ? parseInt(params.get('score'), 10) : 0,
      combo: params.get('combo') ? parseInt(params.get('combo'), 10) : 0,
      status: params.get('status') || undefined,
    };
  }
  return null;
}
