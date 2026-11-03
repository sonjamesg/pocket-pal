// ===== overworld.js — collision + things on the overworld =====
function owSolid(x,y){if(x<0||y<0||x>=MW||y>=MH)return true;const c=OWBASE[y][x];if(c==='f'||c==='t'||c==='w'||c==='s'||c==='C'||c==='W')return true;
  for(const [hx,hy] of HSLOT.concat(LOCKS))if(x>=hx&&x<hx+3&&y>=hy&&y<hy+2)return true;return false}
function owThing(x,y){const L=petList().slice(0,6);for(let i=0;i<6;i++){const [hx,hy]=HSLOT[i];if(y===hy+1&&x===hx+1)return L[i]?{pet:L[i]}:{empty:true};if(x>=hx&&x<hx+3&&y>=hy&&y<hy+2)return{wall:1}}
  for(const [hx,hy,n] of LOCKS)if(x>=hx&&x<hx+3&&y>=hy&&y<hy+2)return{lock:n};if(OWBASE[y]&&OWBASE[y][x]==='s')return{sign:1};if(OWBASE[y]&&'cCW'.includes(OWBASE[y][x]))return{crop:OWBASE[y][x]};if(OWBASE[y]&&OWBASE[y][x]==='w')return{water:1};return null}
