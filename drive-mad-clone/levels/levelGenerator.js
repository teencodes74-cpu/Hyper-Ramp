export function generateProceduralLevel(seed = 1, difficulty = 1) {
  const rand = mulberry32(seed * 9871 + difficulty * 7919);
  const segments = [];
  let x = 200;
  let y = 600;
  for (let i = 0; i < 24; i += 1) {
    const w = 140 + Math.floor(rand() * 170);
    const tilt = (rand() - 0.5) * difficulty * 0.2;
    segments.push({ type: 'platform', x, y, width: w, height: 30, angle: tilt });
    x += w + 40 + rand() * 80 * difficulty;
    y += (rand() - 0.5) * 80 * difficulty;
    if (rand() > 0.7) {
      segments.push({ type: 'obstacle', x: x - 20, y: y - 40, width: 30, height: 60, angle: 0 });
    }
  }

  return {
    id: `proc-${seed}`,
    name: `Procedural ${seed}`,
    start: { x: 150, y: 520 },
    finish: { x: x + 120, y: y - 50, width: 50, height: 160 },
    objects: segments,
    timeLimit: Math.max(18, 70 - difficulty * 4)
  };
}

function mulberry32(a) {
  return function random() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
