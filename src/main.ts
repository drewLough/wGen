import { generateWords } from "./generators/words.js";

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
  const S = seed.value || undefined;
  const st = start.value as "random" | "consonant" | "vowel";
  const words = generateWords(C, { length: L, seed: S, start: st });
  out.textContent = words.join("\n");
}

gen.addEventListener("click", run);

copy.addEventListener("click", async () => {
  await navigator.clipboard.writeText(out.textContent ?? "");
});

run(); // generate once on load
