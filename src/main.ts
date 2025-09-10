import { generateWords, generateWordFromTemplate } from "./generators/words.js";

const tmpl = document.querySelector("#tmpl") as HTMLInputElement;

const $ = <T extends HTMLElement>(sel: string) =>
  document.querySelector(sel) as T;

const len = $("#len") as HTMLInputElement;
const count = $("#count") as HTMLInputElement;
const seed = $("#seed") as HTMLInputElement;
const start = $("#start") as HTMLSelectElement;
const out = $("#out") as HTMLDivElement;
const gen = $("#gen") as HTMLButtonElement;
const copy = $("#copy") as HTMLButtonElement;

function run() {
  const L = parseInt(len.value, 10);
  const C = parseInt(count.value, 10);
  const S = seed.value.trim() ? seed.value.trim() : undefined;
  const st = start.value as "random" | "consonant" | "vowel";
  const t = tmpl.value.trim();
  // const words = generateWords(C, { length: L, seed: S, start: st });

  let words: string[];
  if (t) {
    words = [];
    for (let i = 0; i < C; i++) {
      // Seed behavior matches generateWords: random when S is undefined, deterministic when set
      const effectiveSeed =
        S === undefined ? `${cryptoRandom()}:${i}` : `${S}:${i}`;
      words.push(generateWordFromTemplate(t, { seed: effectiveSeed }));
    }
  } else {
    words = generateWords(C, { length: L, seed: S, start: st });
  }
  out.textContent = words.join("\n");
}

// helper for main.ts only
function cryptoRandom(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const u32 = new Uint32Array(1);
    crypto.getRandomValues(u32);
    return u32[0] || Date.now();
  }
  return Date.now();
}

gen.addEventListener("click", run);

copy.addEventListener("click", async () => {
  await navigator.clipboard.writeText(out.textContent ?? "");
});

run(); // generate once on load
