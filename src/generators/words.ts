import { CONSONANTS, VOWELS } from "../data/en.js";
import { createRNG, randInt, randomSeed } from "./rng.js";

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

  if (opts.seed === undefined) {
    // No seed given: new random seed for this run (so each click differs)
    const base = randomSeed();
    for (let i = 0; i < count; i++) {
      out.push(generateWord({ ...opts, seed: `${base}:${i}` }));
    }
  } else {
    // Deterministic: same seed + index offset
    for (let i = 0; i < count; i++) {
      out.push(generateWord({ ...opts, seed: `${opts.seed}:${i}` }));
    }
  }
  return out;
}

// --- Template support: C = consonant, V = vowel, N = digit 0-9, (...) optional group ---

function expandTemplate(template: string, rng: () => number): string {
  // Recursively process parentheses with 50% inclusion
  let i = 0;

  function parse(): string {
    let out = "";
    while (i < template.length) {
      const ch = template[i++];

      if (ch === "(") {
        const inner = parse(); // parse until matching ')'
        // 50% chance to include the inner group
        if (rng() < 0.5) out += inner;
      } else if (ch === ")") {
        break; // end of this group
      } else if (/[CVN]/.test(ch)) {
        out += ch;
      } else {
        // treat any other literal as-is so users can write separators like '-' or '_'
        out += ch;
      }
    }
    return out;
  }

  return parse();
}

function emitFromTokens(tokens: string, rng: () => number): string {
  let word = "";
  for (const t of tokens) {
    if (t === "C") word += randomConsonant(rng);
    else if (t === "V") word += randomVowel(rng);
    else if (t === "N") word += String(randInt(rng, 0, 9));
    else word += t; // any literal
  }
  return word;
}

export function generateWordFromTemplate(
  template: string,
  opts: WordOpts = {}
): string {
  const rng = createRNG(opts.seed ?? 42);
  const tokens = expandTemplate(template, rng); // e.g., "CVCN-" etc.
  return emitFromTokens(tokens, rng);
}
