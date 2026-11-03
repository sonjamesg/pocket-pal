// ===== overworld.js — collision + things on the overworld (ranch + outer world) =====
const SOLID='ftPTxwsCWr';
function owSolid(x,y){if(x<0||y<0||x>=MW||y>=MH)return true;const c=OWBASE[y][x];if(SOLID.includes(c))return true;
  for(const [hx,hy] of CUR==='ranch'?HSLOT.concat(LOCKS,[HOME]):[STORE])if(x>=hx&&x<hx+3&&y>=hy&&y<hy+2)return true;return false}
function owThing(x,y){const c=OWBASE[y]&&OWBASE[y][x];
  if(CUR==='ranch'){const L=petList().slice(0,6);for(let i=0;i<6;i++){const [hx,hy]=HSLOT[i];if(y===hy+1&&x===hx+1)return L[i]?{pet:L[i]}:{empty:true};if(x>=hx&&x<hx+3&&y>=hy&&y<hy+2)return{wall:1}}
  {const [sx,sy]=HOME;if(x===sx+1&&y===sy+1)return{home:1};if(x>=sx&&x<sx+3&&y>=sy&&y<sy+2)return{wall:1}}
  for(const [hx,hy,n] of LOCKS)if(x>=hx&&x<hx+3&&y>=hy&&y<hy+2)return{lock:n}}
  else{const [sx,sy]=STORE;if(x===sx+1&&y===sy+1)return{store:1};if(x>=sx&&x<sx+3&&y>=sy&&y<sy+2)return{wall:1}}
  if(c==='G')return{gate:1};if(c==='s')return{sign:1};if(c&&'cCW'.includes(c))return{crop:c};if(c==='w')return{water:1};if(c==='r')return{rock:1};if(c&&'TPx'.includes(c))return{tree:1};return null}
// gate: stepping onto a G tile swaps ranch <-> outer world
function owGate(){const o=ui.ow;if(OWBASE[o.y][o.x]!=='G')return;const to=CUR==='ranch'?'outer':'ranch';const i=MAPS[CUR].gate.findIndex(([gx,gy])=>gx===o.x&&gy===o.y);
  setMap(to);const [gx,gy]=MAPS[to].gate[Math.max(0,i)],ny=to==='outer'?gy+1:gy-1;Object.assign(o,{map:to,x:gx,y:ny,px:gx*TS,py:ny*TS,dir:to==='outer'?'down':'up',mv:null});say(to==='outer'?MAPS.outer.name+' — B/walk N to go home':'Back at the RANCH')}
