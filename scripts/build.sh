#!/bin/sh
# Pet Farm build: syntax-check modules + regenerate the farm grid from js/map-data.js.
# Run after ANY change (required after map layout edits). Also run by .githooks/pre-commit.
set -e; cd "$(dirname "$0")/.."
if command -v node >/dev/null; then for f in js/*.js; do node --check "$f"; done; fi
python3 scripts/build-farm-grid.py
python3 scripts/build-farm-grid.py outer
