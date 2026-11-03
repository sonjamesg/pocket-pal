// ===== map-data.js — farm overworld layout (single source of truth) =====
// Pure JSON object between the markers; scripts/build-farm-grid.py parses it. Edit, then run scripts/build.sh.
const MAP_LAYOUT=/*JSON-START*/{
 "_doc": "SINGLE SOURCE OF TRUTH for the overworld. Top level = the RANCH; 'outer' = the world beyond the ranch gate. Edit, then run scripts/build.sh to regenerate assets/world/farm-grid.* and world-grid.*. houseSlots/locks/petStore are [x,y] top-left tiles (0-based; x=0 is column A, y=0 is row 1) and are 3x2 (door = middle of bottom row). Trees (T/P) are 2x2 with 'x' body cells. Walking onto a G gate tile switches maps.",
 "legend": {
  "g": "grass",
  "h": "tall grass",
  "F": "flowers (also J,K)",
  "p": "path",
  "b": "sand",
  "f": "fence",
  "T": "tree 2x2 origin",
  "P": "pine 2x2 origin",
  "x": "tree body",
  "w": "water",
  "B": "bridge",
  "r": "rock",
  "C": "corn",
  "W": "wheat",
  "s": "sign",
  "G": "gate"
 },
 "tileSize": 16,
 "width": 56,
 "height": 44,
 "houseSlots": [
  [
   6,
   8
  ],
  [
   13,
   8
  ],
  [
   20,
   8
  ],
  [
   34,
   8
  ],
  [
   41,
   8
  ],
  [
   48,
   8
  ]
 ],
 "petStore": [
  20,
  33
 ],
 "locks": [
  [
   34,
   15,
   "COW BARN"
  ],
  [
   42,
   15,
   "STABLE"
  ]
 ],
 "gate": [
  [
   27,
   43
  ],
  [
   28,
   43
  ]
 ],
 "start": [
  27,
  24
 ],
 "rows": [
  "ffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  "fTxPxTxTxPxTxTxgKFKPxTxTxggggPxTxTxTxJKJgTxggTxPxTxTxPxf",
  "fxxxxxxxxxxxxxxgKFKxxxxxxggggxxxxxxxxggggxxggxxxxxxxxxxf",
  "fTxggghhhFKFggggFggggggggggppggggggggggggggggggggggggTxf",
  "fxxggghhhKJKJggggggggggggggppggggggggggggggggggggggggxxf",
  "fggggggggggggggggggggggggggppggggggggggggggggggggggggggf",
  "fTxggggggggggggggggggggggggppggggggggggggggghhhggggggPxf",
  "fxxggggggggggggggggggggggggppggggggggggggggggggggggggxxf",
  "fggggggggggggggggggggggggggppggggggggggggggggggggggggggf",
  "fTxggggggggggggggggggggggggppgggggggggggKFFggggggggggTxf",
  "fxxggggpggFFFhpggggggpgggggppggggKJpggggKgpggggggpgggxxf",
  "fgghhhhpggKJggpggggggpgggggppggggggpggggFgpggggggpgggggf",
  "fTxhpppppppppppppppppppppppppppppppppppppppppppppppppPxf",
  "fxxggFJJggggggggggghhggggggppgggggggggggTxgggggggggggxxf",
  "fggggJggggTxPxggggggTxgggggppgggggggggggxxggggggggggghhf",
  "fPxgggggggxxxxggggggxxgggggpphFhgggggggggggggggggggTxPxf",
  "fxxggggggggggggggTxggggggggppgFggggggggFKFggggggTxgxxxxf",
  "fgggggggggTxgggggxxgggggggFppFgFJFgpgggFgggpggggxxgggggf",
  "fPxgggggggxxgggggggggggggggppggJJKgpgggJgPxpgggggggggTxf",
  "fxxgggggggggggggggggggggggsppghJJFgpgggggxxpgggggggggxxf",
  "fgppppppppppppppppppppppppppppppppppppppppppppppppppppgf",
  "fgppppppppppppppppppppppppppppppppppppppppppppppppppppgf",
  "fgggggggpggggggggggpgggggggppggggggggggggggggggggggggggf",
  "fFJfffffpffffffffffpfffffggppggggggggggggggggggggggggggf",
  "fJgfCCCCCCCCCffWWWWWWWWWfggpphhhghhggTxggggggggggggggTxf",
  "fggfCCCCCCCCCffWWWWWWWWWfggppggTxhhhhxxggggggggggggTxxxf",
  "fggfCCCCCCCCCffWWWWWWWWWfggppggxxgggggggKJwwwwwwwggxxggf",
  "fTxfCCCCCCCCCffWWWWWWWWWfggppggggggggghTxwwwwwwwwwgggTxf",
  "fxxfCCCCCCCCCffWWWWWWWWWfggppggggggggghxxwwwwwwwwwgggxxf",
  "fggfCCCCCCCCCffWWWWWWWWWfggppggggggggggwwwwwwwwwwwggJKFf",
  "fTxfCCCCCCCCCffWWWWWWWWWfggppggggggPxgwwwwwwggwwwwwgJFKf",
  "fxxffffffffffffffffffffffggppggggggxxwwwwwwwggggwwwwgggf",
  "fgggghhgggggggTxgggggggggggppgggggTxwwwwwwwwggwwwwwwwJJf",
  "fTxgPxgggwwwggxxgggggggggggppgggggxxwwwwwwwwwwwwwwwwwwKf",
  "fxxgxxTxwwwwwwwgggTxggggJFFppggggTxggwwwwwwwwwwwwwwwwwFf",
  "fgggggxxwwwwwwwwggxxgpgggggppggggxxggggggggwwwwwwwwwwwgf",
  "fTxgggwwwwwwwwwwwggTxppppppppggggggggggggggPxwwwwwwwwhgf",
  "fxxPxwwwwwwwwwwwwwgxxggggggppgggggggggggPxgxxgggwwwwwwgf",
  "fggxxwwwwwwwwwwwwwgJTxTxgggppggggPxgggggxxgggggKwwwwwwgf",
  "fTxgTxwwwwwwwwwwwwgJxxxxgggppggggxxggggTxghggggFwwwwwTxf",
  "fxxJxxFwwwwwggwwwwgJKJgggggppgggTxgggggxxghhhhggwwgggxxf",
  "fgggggggFwwggggggTxgggggggsppgggxxgggggTxghhTxggTxTxgggf",
  "fgggggggghhhhggggxxggggggggppgggggghhhgxxgggxxggxxxxgggf",
  "fffffffffffffffffffffffffffGGfffffffffffffffffffffffffff"
 ],
 "outer": {
  "name": "WILD WOODS",
  "width": 80,
  "height": 60,
  "gate": [
   [
    39,
    0
   ],
   [
    40,
    0
   ]
  ],
  "legend": {
   "g": "grass",
   "h": "tall grass",
   "F": "flowers (also J,K)",
   "p": "path",
   "b": "sand",
   "f": "fence",
   "T": "tree 2x2 origin",
   "P": "pine 2x2 origin",
   "x": "tree body",
   "w": "water",
   "B": "bridge",
   "r": "rock",
   "C": "corn",
   "W": "wheat",
   "s": "sign",
   "G": "gate"
  },
  "rows": [
   "PxPxTxPxPxTxPxPxTxPxTxPxTxPxPxTxPxTxTxgGGgTxTxggPxTxhhhgrwwwggPxTxPxTxPxPxPxPxTx",
   "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxsppgxxxxgKxxxxgrrrrggwwwxxxxxxxxxxxxxxxxxx",
   "PxPxggggggggggPxggggggggggPxgggggggggggppgggPxgggggggrrrhhgggwwwggggggggggTxPxPx",
   "xxxxggggggggTxxxggggggggggxxggTxgggggggppgggxxggggTxhrgggggPxggwwwggggggggxxxxxx",
   "PxggrrrrggggxxggggFJJggPxgggggxxgggggggppgggggPxggxxgggPxggxxgTxwwwgTxggghhhggPx",
   "xxggrrgPxgggTxPxggFJgggxxggggggggggggggppgggTxxxgggggggxxgggggxxgwwwxxgggrrgggxx",
   "PxgrrrrxxgrgxxxxggKFFKggPxgTxggggggggggppgggxxggggKgPxgggggggggggwwwgggggrrrrgPx",
   "xxggggghhhrFJKKgggJJggggxxgxxgTxgggggggpphhhgggggTxgxxPxgggggggggwwwgggTxgPxggxx",
   "PxggggghgPxggggTxTxggPxggPxgggxxFFJFgggppggggggggxxgggxxggggggppwwwhhhgxxgxxggPx",
   "xxgggggggxxPxggxxxxggxxwgxxTxgggKKKggggppggggPxgggggPxggggggggpBwwghhhhggggPxgxx",
   "PxgggggggggxxgggggggggwwwhhxxgggFJTxgggppggggxxgKKKJxxggggggggBBwhghhhhggggxxgPx",
   "xxggggggggggggTxgggKgwwwwwgwwggTxgxxgggppggghhhgKJgggggggggggwBBgggggggPxggghhxx",
   "PxgggPxgTxggJgxxgggFwwwwwwwwwwwxxggggggppFFghhgggPxgggggggggwwBphhhhPxgxxggghgPx",
   "xxgggxxgxxhggggggggwwwwwwwwwwwwgPxgggggppFFgTxgggxxggggggggwwwppggghxxgggPxPxgxx",
   "PxggggggTxhggggPxggwwwwwwwwwwwwgxxgggggppgggxxggJFKFPxgggPxwwwppggPxghhhgxxxxgPx",
   "xxggggggxxhPxggxxhhhwwwwwwwwwwgggggPxggppgggPxggJgggxxgggxxwwwpprgxxghggggggggxx",
   "PxgggghTxggxxgggggggwwwwwwwwwggggggxxggppgggxxPxgggPxPxPxggwwwppgFJghhhhhgghhhPx",
   "xxPxhhgxxPxPxghhPxTxgwwwwwwwgPxggPxggggppFggggxxgggxxxxxxggwwwppggPxhhgggrrhhgxx",
   "PxxxgggggxxxxgggxxxxgwwwgggggxxggxxggggppgggggKgggPxggggggrwwwpphgxxgggggrgggggg",
   "xxgggTxggggggTxgTxgggwwhhhgggggTxggggggppggggPxgggxxggggggwwwhpphhhhgggPxrrrrrrg",
   "PxgggxxggggggxxgxxggggghhhhgTxgxxggggggppggggxxggghhhgggggwwwgpphhhTxggxxggrrrPx",
   "xxgggggghhggggggggPxggPxggggxxgggggggggppggPxTxghghhhggggwwwggppgggxxgggggggggxx",
   "ggggggggggggggggghxxggxxgggggggggTxggggppgFxxxxgggTxggggwwwgPxppgPxgggggggggggPx",
   "KFggPxggggTxggggghgPxgggggggTxgggxxggggppgFgPxggPxxxggwwwhhgxxppgxxgggPxggggggxx",
   "PxJgxxggggxxTxgggPxxxPxggTxhxxhggggTxggppgJFxxggxxgggwwwggggggpphhhgggxxPxggPxPx",
   "xxKJgggggPxgxxPxgxxTxxxggxxggghhgggxxggppggggggggggwwwrgggggggppggggggghxxggxxxx",
   "PxFFFggggxxPxgxxgggxxJKFKggggghhgTxggggppgggTxgggwwwgTxgggggPxppPxhggggggggPxgPx",
   "xxgggKFJKgFxxggPxggggFPxPxgggggggxxggggppgggxxggwwwggxxgggggxxppxxggggggggFxxhxx",
   "PxgggJggggKKJFgxxggggJxxxxgggTxggTxggggppggggggwwwgggggPxTxgggppgggggggggggFFFPx",
   "xxgggFggggFJJhhgggggggPxgggggxxggxxPxggppggPxggwwwgggggxxxxgggppggggPxgggggFKJxx",
   "ggggJFKJggggggggggggggxxgggggggJKFFxxggppggxxggwwwggggPxggggggppFJFgxxgggggggKJg",
   "JFgTxTxgggggggggJKKFgggPxggggggFJKgPxggppFFgggggwwwFPxxxggggggppghhhhPxgggPxgggg",
   "PxgxxxxggggggghgFJJggggxxggFFJKghhhxxggppKgggggggwwwxxggggggggppghhggxxgggxxggPx",
   "xxgggggggggggghgggggggggggggFFKghhhhhhsppggggggggggwwwggggggKFppghhhFFFgggggggxx",
   "PxggpppppppppppppppppppppppppppppppppppppppppppppppppBBBppppppppppppppppppppggPx",
   "xxggpppppppppppppppppppppppppppppppppppppppppppppppppppBBBppppppppppppppppppggxx",
   "PxgggggggggggrhhppgggggggggggggggggggghhppgggKgggggggggggwwwggggggggggggggggggPx",
   "xxgggggggggggrrrppggPxggggTxgggggggggghhppggTxgTxggggggTxgwwwggPxgggggggggggggxx",
   "PxggggggggggggggppggxxggggxxggggggggTxhgppggxxgxxggggggxxgggwwwxxggTxggggTxTxgPx",
   "xxggggggggbbbbbgppggggrrrgggTxTxgPxgxxggpphhPxgghhgggggggggggwwwgggxxggTxxxxxgxx",
   "PxggbbbbbbbbbbbbppggggggggTxxxxxgxxgggFgpphgxxgghhhgggTxggTxgwwwggTxPxgxxgggggPx",
   "xxbbbbbbbbbwwwwbppgbbbbbbbxxggTxgggPxgFgppgKFggPxgggggxxhhxxggwwwhxxxxggggTxggxx",
   "gbbbbwwwwwwwwwwwppbbbwbbbbbbggxxgggxxgFgppgggggxxggggggPxhhgggwwwTxggggPxgxxggFK",
   "gbbbwwwwwwwwwwwwBBwwwwwwwbbbrrgggggFFFFgppggggggggTxgggxxggggwwwgxxggggxxgFFJggg",
   "gbbbwwwwwwwwwwwwBBwwwwwwwbbbKFggFFKJKFJgpphTxgggggxxgTxggggggwwwggggggggTxggggPx",
   "gbbbwwwwwwwwwwwwBBwwwwwwwwbbKFJgJJgKKJFgpphxxggggggPxxxggggggwwwPxggggTxxxggggxx",
   "PxbbwwwwwwwwwwwwBBwwwwwwwbbbggggTxJJKKFFppgPxggTxggxxgggggTxwwwgxxggggxxTxggggPx",
   "xxgbbbwwwwwwwwwwBBwwwwwwbbbgPxggxxgJKFFgppgxxggxxgggggTxggxxgwwwggggTxggxxgTxgxx",
   "gggggbbwwwwwwwwwBBwwwwwbbbFgxxhhgggTxgggppggPxgPxgggggxxgggggwwwTxPxxxggrrFxxgPx",
   "KFKggggbbwwwwwwwBBwwwwbbTxgggghhhhgxxgggppggxxgxxgggFJFJgggggwwwxxxxggPxrrrgggxx",
   "KFrrrrggbbwwwwwwBBwwwbbgxxrrrgggggTxggggppgggggTxTxgFKFTxgJFggwwwTxgggxxgggrrgPx",
   "JgrrggggbbwwwwwwBBwwbbTxgggggTxgggxxTxggppgggggxxxxgKFgxxgggggwwwxxTxggggggrrgxx",
   "PxggggggbbwwwwwwBBwwbbxxgggggxxgggggxxggppgPxgggTxgggTxgggggTxgwwwgxxgggggggTxPx",
   "xxggggggbbwwwwwwBBwbbbgPxggTxggggggggggggggxxgggxxgPxxxgggggxxgwwwghgPxgggggxxxx",
   "PxggghhhbbbbwbbbppbbbggxxggxxggTxTxhhTxggggggggggggxxgggghhgggwwwgTxgxxggTxgggPx",
   "xxgggggggbbbbbbbppbbgggKTxgggggxxxxhhxxggggTxgggggggggggghhFFwwwggxxgggggxxgggxx",
   "PxggggggggbbbbgggggggghhxxggggPxPxghhhgggggxxggTxggggggPxhhhwwwggggTxgggggggggPx",
   "xxgggggggggggggggggggghgggggggxxxxgggrgggggggggxxggggggxxgwwwggggggxxhhhggggggxx",
   "gJFgPxTxPxTxTxPxTxTxPxTxPxTxPxTxPxTxPxPxTxhhggggPxTxJgggwwwgPxTxTxTxPxPxPxTxPxTx",
   "gFFKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxgJJKKgxxxxggwwwgggxxxxxxxxxxxxxxxxxxxx"
  ]
 }
}/*JSON-END*/;
const TS=MAP_LAYOUT.tileSize,HSLOT=MAP_LAYOUT.houseSlots,LOCKS=MAP_LAYOUT.locks,STORE=MAP_LAYOUT.petStore;
const MAPS={ranch:{name:'RANCH',w:MAP_LAYOUT.width,h:MAP_LAYOUT.height,gate:MAP_LAYOUT.gate,rows:MAP_LAYOUT.rows.map(r=>r.split(''))},
  outer:{name:MAP_LAYOUT.outer.name,w:MAP_LAYOUT.outer.width,h:MAP_LAYOUT.outer.height,gate:MAP_LAYOUT.outer.gate,rows:MAP_LAYOUT.outer.rows.map(r=>r.split(''))}};
let CUR='ranch',OWBASE=MAPS.ranch.rows,MW=MAPS.ranch.w,MH=MAPS.ranch.h;
function setMap(id){CUR=id;const m=MAPS[id];OWBASE=m.rows;MW=m.w;MH=m.h}
