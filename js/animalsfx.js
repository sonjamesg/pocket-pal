// ===== animalsfx.js — v71: real farm-animal SFX from BigSoundBank (CC0, https://bigsoundbank.com/licenses.html).
// Credits: assets/sfx/animals/CREDITS.txt. Triggers: cuddle on pet screen; pressing A near/at a pen; occasional ambient call
// when you stand near a pen (≥14s apart, per-species ≥25s). Respects DB.mute and hidden tab.
// CUSTOM HORSE HOOK: drop James's recording at assets/sfx/custom/horse.mp3 — if present it's used for ~2/3 of horse calls.
const ASFX={dir:'assets/sfx/animals/',vol:.55,
  set:{cow:['cow1','cow2'],sheep:['sheep1','sheep2'],chicken:['hen1','rooster'],pig:['pig1','pig2'],horse:['horse1','horse2'],goat:['goat'],duck:['duck']},
  custom:{horse:'assets/sfx/custom/horse.mp3'},have:{},last:{},lastAny:0,amb:0};
for(const sp in ASFX.custom)fetch(ASFX.custom[sp],{method:'HEAD'}).then(r=>{if(r.ok)ASFX.have[sp]=1}).catch(()=>{});
function animalSfx(sp,o={}){sp=sp==='bull'?'cow':sp;const L=ASFX.set[sp];if(!L||(typeof DB!=='undefined'&&DB.mute)||document.hidden)return;
  const n=Date.now(),cd=o.cd==null?1500:o.cd;if(n-(ASFX.last[sp]||0)<cd||n-ASFX.lastAny<500)return;ASFX.last[sp]=ASFX.lastAny=n;
  const src=ASFX.have[sp]&&Math.random()<.67?ASFX.custom[sp]:ASFX.dir+L[Math.floor(Math.random()*L.length)]+'.mp3';
  try{const a=new Audio(src);a.volume=Math.max(0,Math.min(1,ASFX.vol*(o.vol||1)));a.play().catch(()=>{})}catch(e){}}
// pen rects on the ranch map → species
function asfxPens(){const M=typeof MAP_LAYOUT!=='undefined'?MAP_LAYOUT:{},R=[];[['cowPaddock','cow'],['chickPen','chicken'],['pigPen','pig'],['horsePen','horse']].forEach(([k,sp])=>{if(M[k])R.push([M[k],sp])});return R}
function asfxNear(r){const o=ui&&ui.ow;if(!o||typeof CUR==='undefined'||CUR!=='ranch')return null;let best=null,bd=1e9;
  asfxPens().forEach(([[x,y,w,h],sp])=>{const dx=Math.max(x-o.x,0,o.x-(x+w-1)),dy=Math.max(y-o.y,0,o.y-(y+h-1)),d=Math.max(dx,dy);if(d<=r&&d<bd){bd=d;best=sp}});return best}
// cuddle on pet screen (replaces synth 'baa' for sheep with the real one)
{const _sf=sfx;sfx=function(k){if(k==='baa'&&ASFX.set.sheep){animalSfx('sheep');return}return _sf(k)}}
{const _ca=careAct;careAct=function(id){if(id==='cuddle'&&typeof S!=='undefined'&&S.species&&S.species!=='sheep')animalSfx(S.species);return _ca(id)}}
// A pressed at/next to a pen on the map
{const _oi=owInput;owInput=function(k){if(k==='a'&&S.scene==='map'){const sp=asfxNear(1);if(sp)animalSfx(sp,{cd:2000})}return _oi(k)}}
// gentle ambient calls when near a pen
setInterval(()=>{try{if(typeof S==='undefined'||S.scene!=='map')return;const sp=asfxNear(4),n=Date.now();if(!sp||n-ASFX.amb<14000||Math.random()>.18)return;ASFX.amb=n;animalSfx(sp,{cd:25000,vol:.6})}catch(e){}},1000);
