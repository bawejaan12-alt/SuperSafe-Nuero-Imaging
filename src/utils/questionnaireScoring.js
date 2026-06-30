// PHQ-9: items 0–8, each 0–3. Sum → severity.
export function scorePhq9(answers) {
  const score = answers.reduce((s, v) => s + (v || 0), 0);
  const severity =
    score <= 4  ? 'minimal' :
    score <= 9  ? 'mild' :
    score <= 14 ? 'moderate' :
    score <= 19 ? 'moderately severe' : 'severe';
  return { score, severity };
}

// GAD-7: items 0–6, each 0–3. Sum → severity.
export function scoreGad7(answers) {
  const score = answers.reduce((s, v) => s + (v || 0), 0);
  const severity =
    score <= 4  ? 'minimal' :
    score <= 9  ? 'mild' :
    score <= 14 ? 'moderate' : 'severe';
  return { score, severity };
}

// PSS-10: items 0–9, each 0–4.
// Items 4, 5, 7, 8 (0-indexed: 3, 4, 6, 7) are reverse-scored (4 - x).
const PSS_REVERSE = [3, 4, 6, 7];
export function scorePss10(answers) {
  const score = answers.reduce((s, v, i) =>
    s + (PSS_REVERSE.includes(i) ? 4 - (v || 0) : (v || 0)), 0);
  return { score };
}

// TIPI: 10 items, 1–7. Big Five computed via pair averaging.
// Trait pairs (1-indexed): E=1,6r  A=2r,7  C=3,8r  ES=4r,9  O=5,10r
// r = reverse-scored (8 - x)
export function scoreTipi(answers) {
  const a = answers.map(v => v || 4);
  const r = x => 8 - x;
  return {
    E: (a[0] + r(a[5])) / 2,
    A: (r(a[1]) + a[6]) / 2,
    C: (a[2] + r(a[7])) / 2,
    N: (r(a[3]) + a[8]) / 2,
    O: (a[4] + r(a[9])) / 2,
  };
}
