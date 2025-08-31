import { CONSONANTS, VOWELS } from "../data/en.js";
import { createRNG, randInt } from "./rng.js";

type State = { prevWasVowel: boolean };

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randomConsonant(rng: () => number) {
  return pick(CONSONANTS, rng);
}
function randomVowel(rng: () => number) {
  return pick(VOWELS, rng);
}

function nextPhoneme(rng: () => number, st: State): string {
  // Alternate vowel/consonant like your C++ (toggling on each call)
  if (st.prevWasVowel) {
    st.prevWasVowel = false;
    return randomConsonant(rng);
  } else {
    st.prevWasVowel = true;
    return randomVowel(rng);
  }
}

export interface WordOpts {
  length?: number; // phoneme count; default random 2..7 (like C++)
  seed?: string | number; // optional deterministic seed
  start?: "random" | "consonant" | "vowel";
}

export function generateWord(opts: WordOpts = {}): string {
  const rng = createRNG(opts.seed ?? 42);
  const length = opts.length ?? randInt(rng, 2, 7);

  // First phoneme type: consonant/vowel/random (coin flip)
  let st: State;
  if (opts.start === "consonant") st = { prevWasVowel: true };
  else if (opts.start === "vowel") st = { prevWasVowel: false };
  else st = { prevWasVowel: randInt(rng, 1, 2) === 1 }; // 1 => consonant first

  let out = "";
  for (let i = 0; i < length; i++) out += nextPhoneme(rng, st);
  return out;
}

export function generateWords(count: number, opts: WordOpts = {}): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    // Offset seed per word so reps vary but remain reproducible
    out.push(generateWord({ ...opts, seed: `${opts.seed ?? 42}:${i}` }));
  }
  return out;
}
