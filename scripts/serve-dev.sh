#!/bin/sh
# Serve Pet Farm locally with art live-reload. Run from anywhere.
cd "$(dirname "$0")/.." && echo "Open http://localhost:8000/?dev=1" && python3 -m http.server 8000
