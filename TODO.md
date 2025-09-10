Repo hygiene (5 min)

Add MIT LICENSE.

Add a short README with run steps (npm i, npm run dev).

Seed + presets (easy win)

Save last-used settings to localStorage and restore on load.

Add a “🔒 Lock seed” checkbox so results stay reproducible while you tweak other inputs.

Deterministic default length

Right now length defaults to random 2..7 when empty. Keep that, but seed it so hitting “Generate” with the same seed gives the same lengths across runs.

Basic error-guarding

Clamp inputs (e.g., length 1–12, count 1–500).

Disable “Copy” when output is empty.

Mini refactor

Move UI glue into src/ui.ts and keep src/main.ts as a tiny bootstrap. Keeps things clean before we add features.

Then (feature choices you can pick from)

A) Templates (C/V strings): let users type CVCV or CV(C)CV (optional groups) and generate against that.
B) Weights: let phonemes have weights (e.g., {"p":"th","w":0.5}) and bias the picks.
C) Language packs: add en.json, jp.json, etc., and a language dropdown.
D) Export: add “Download .txt” and “Download .json”.
