// ===== map-data.js — farm overworld layout (single source of truth) =====
// Pure JSON object between the markers; scripts/build-farm-grid.py parses it. Edit, then run scripts/build.sh.
const MAP_LAYOUT=/*JSON-START*/{
 "_doc": "SINGLE SOURCE OF TRUTH for the farm overworld. Edit here, then run scripts/build.sh to regenerate assets/world/farm-grid.*. houseSlots/locks are [x,y] top-left tiles (0-based; x=0 is column A, y=0 is row 1); houses/petStore are 3x2 tiles (door = middle of bottom row).",
 "legend": {"g": "grass", "p": "path", "f": "fence", "t": "tree", "w": "water", "C": "corn", "W": "wheat", "s": "sign", "c": "field"},
 "tileSize": 16,
 "width": 30,
 "height": 24,
 "houseSlots": [[3, 3], [9, 3], [15, 3], [3, 9], [9, 9], [15, 9]],
 "petStore": [8, 14],
 "locks": [[22, 3, "COW BARN"], [22, 9, "STABLE"]],
 "rows": [
  "ffffffffffffffffffffffffffffff",
  "fgggggtgggggtpggggggtggggtgpgf",
  "fggggggggggggpggggffffgggggpgf",
  "fggggggggggggpggggfCCfgggggpgf",
  "fggggggggggggpggggfCCfgggggpgf",
  "fggggggggggggpggggfCCfgggggptf",
  "fggggggggggggpggggffffgggggpgf",
  "pppppppppppppppppppppppppppppf",
  "fggggggggggggpgggggggggggggpgf",
  "fggggggggggggpgggggggggggggpgf",
  "fggggggggggggpgggggggggggggptf",
  "fggggggggggggpgggggggggggggpgf",
  "fggggggggggggsgggggggggggggpgf",
  "fppppppppppppppppppppppppppppf",
  "ftgggggggggggpgggggggggggggpgf",
  "fggggggggggtgpgffgftfffgfffpgf",
  "fgtgggwggggggpgfCCCCffWWWWfpgf",
  "fgtgwwwwwggggpgfCCCCffWWWWfpgf",
  "fgtwwwwwwwgggpgfCCCCffWWWWfpgf",
  "fgtgwwwwwggggpgfCCCCffWWWWfpgf",
  "fgtgggwggggggpgfCCCCffWWWWfggf",
  "fgtggggggggggpgffffffffffffggf",
  "fggtggtggtgggpgggggggggggggggf",
  "ffffffffffffffffffffffffffffff"
 ]
}/*JSON-END*/;
const TS=MAP_LAYOUT.tileSize,MW=MAP_LAYOUT.width,MH=MAP_LAYOUT.height,HSLOT=MAP_LAYOUT.houseSlots,LOCKS=MAP_LAYOUT.locks,STORE=MAP_LAYOUT.petStore;
const OWBASE=MAP_LAYOUT.rows.map(r=>r.split(''));
