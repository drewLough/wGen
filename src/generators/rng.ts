function hashSeed(seed: string | number): number {
  let s = 0x811c9dc5;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    s ^= str.charCodeAt(i);
    s = Math.imul(s, 0x01000193);
  }
  return s >>> 0;
}

export function createRNG(seed: string | number = 0xdeadbeef): () => number {
  let s = hashSeed(seed) || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

export function randInt(rng: () => number, min: number, max: number): number {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}

export function randomSeed(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] || Date.now(); // fallback if zero by chance
  }
  return Date.now(); // Node/older browsers fallback
}
