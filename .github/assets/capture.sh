#!/usr/bin/env bash
# .github/assets/capture.sh: regenerates demo.gif from the live site.
# Run from the repo root: SKILL=~/.agents/skills/readme-writer bash .github/assets/capture.sh
# Needs the readme-writer skill's scripts (bash "$SKILL/scripts/setup.sh" once) and ffmpeg.
set -euo pipefail
out=$(mktemp -d)
node "$SKILL/scripts/capture-web.cjs" https://kudayyurter.dev "$out" \
  --steps .github/assets/steps.json --wait 3000 --hold 1200
# capture-web prints the exact --start/--length for the recorded steps; update these if they change:
bash "$SKILL/scripts/to-gif.sh" "$out/demo.webm" .github/assets/demo --start 3.3 --length 12.3
rm -f .github/assets/demo.mp4   # keep the MP4 only to upload it on github.com
