// ===== animalsfx.js — v71: real farm-animal SFX from BigSoundBank (CC0, https://bigsoundbank.com/licenses.html).
// Credits: assets/sfx/animals/CREDITS.txt. Triggers: cuddle on pet screen; pressing A near/at a pen; occasional ambient call
// when you stand near a pen (≥14s apart, per-species ≥25s). Respects DB.mute and hidden tab.
// CUSTOM HORSE HOOK: drop James's recording at assets/sfx/custom/horse.mp3 — if present it's used for ~2/3 of horse calls.
const ASFX={dir:'assets/sfx/animals/',vol:.55,
  set:{cow:['cow1','cow2'],sheep:['sheep1','sheep2'],chicken:['hen1','rooster'],pig:['pig1','pig2'],horse:['horse1','horse2'],goat:['goat'],duck:['duck'],dog:['bark1','bark2'],pup:['pup1','pup2']},
  custom:{horse:'assets/sfx/custom/horse.mp3'},have:{},last:{},lastAny:0,amb:0};
for(const sp in ASFX.custom)fetch(ASFX.custom[sp],{method:'HEAD'}).then(r=>{if(r.ok)ASFX.have[sp]=1}).catch(()=>{});
function animalSfx(sp,o={}){sp=sp==='bull'?'cow':sp;const L=ASFX.set[sp];if(!L||(typeof DB!=='undefined'&&DB.mute)||document.hidden)return;
  const n=Date.now(),cd=o.cd==null?1500:o.cd;if(n-(ASFX.last[sp]||0)<cd||n-ASFX.lastAny<500)return;ASFX.last[sp]=ASFX.lastAny=n;
  const src=ASFX.have[sp]&&Math.random()<.67?ASFX.custom[sp]:ASFX.dir+L[Math.floor(Math.random()*L.length)]+'.mp3';
  try{const a=new Audio(src);a.preload='auto';const vv=Math.max(0,Math.min(1,ASFX.vol*(o.vol==null?1:o.vol)));a.volume=vv;
    /* v105: keep a live ref until 'ended' so mobile GC/stream reuse can't cut the clip short */ASFX.live=ASFX.live||new Set();ASFX.live.add(a);const done=()=>ASFX.live.delete(a);a.addEventListener('ended',done);a.addEventListener('error',done);setTimeout(done,15000);
    if(typeof AC!=='undefined'&&AC&&AC.state==='running'&&AC.createGain){try{const m=AC.createMediaElementSource(a),gn=AC.createGain();gn.gain.value=vv;a.volume=1;let nd=m;if(AC.createStereoPanner&&o.pan){const p=AC.createStereoPanner();p.pan.value=Math.max(-1,Math.min(1,o.pan));m.connect(p);nd=p}nd.connect(gn);gn.connect(AC.destination)}catch(e){a.volume=vv}}
    a.play().catch(done)}catch(e){}}
// pen rects on the ranch map → species
// v84: every animal source on the ranch: pens (POO_PENS covers sheep too) + MAP_LAYOUT pens + field sheep spots
function asfxSources(){const R=[];if(typeof POO_PENS!=='undefined')POO_PENS.forEach(([sp,x,y,w,h])=>R.push([[x,y,w,h],sp]));asfxPens().forEach(e=>R.push(e));
  try{if(typeof fieldSheep==='function'&&typeof FIELD_SPOTS!=='undefined')fieldSheep().forEach((_,i)=>{const p=FIELD_SPOTS[i];if(p)R.push([[p[0],p[1],1,1],'sheep'])})}catch(e){}return R}
const ASFX_MAX=10;
// v105: only species you actually own make noise
function asfxOwn(sp){try{return typeof ownSp==='function'?ownSp(sp==='bull'?'cow':sp)>0:true}catch(e){return true}}
function asfxAll(){const o=ui&&ui.ow;if(!o||typeof CUR==='undefined'||CUR!=='ranch')return[];const best={};
  asfxSources().forEach(([[x,y,w,h],sp])=>{const dx=Math.max(x-o.x,0,o.x-(x+w-1)),dy=Math.max(y-o.y,0,o.y-(y+h-1)),d=Math.hypot(dx,dy);
    if(d<=ASFX_MAX&&asfxOwn(sp)&&(!best[sp]||d<best[sp].d))best[sp]={sp,d,rx:(x+w/2)-o.x}});return Object.values(best)}
function asfxVol(d){const t=Math.max(0,1-d/ASFX_MAX);return Math.pow(t,1.6)} // smooth falloff, silent at 11 tiles
function asfxPens(){const M=typeof MAP_LAYOUT!=='undefined'?MAP_LAYOUT:{},R=[];[['cowPaddock','cow'],['chickPen','chicken'],['pigPen','pig'],['horsePen','horse']].forEach(([k,sp])=>{if(M[k])R.push([M[k],sp])});return R}
function asfxNear(r){const o=ui&&ui.ow;if(!o||typeof CUR==='undefined'||CUR!=='ranch')return null;let best=null,bd=1e9;
  asfxPens().forEach(([[x,y,w,h],sp])=>{const dx=Math.max(x-o.x,0,o.x-(x+w-1)),dy=Math.max(y-o.y,0,o.y-(y+h-1)),d=Math.max(dx,dy);if(d<=r&&d<bd){bd=d;best=sp}});return best}
// cuddle on pet screen (replaces synth 'baa' for sheep with the real one)
{const _sf=sfx;sfx=function(k){if(k==='baa'&&ASFX.set.sheep){animalSfx('sheep');return}
  /* v116: no more synth sawtooth 'woof' (sounded like a fart) — always one real bark clip */if(k==='woof'){const st=(typeof S!=='undefined'&&S.stage)||'adult';animalSfx(['egg','puppy','youngster'].includes(st)?'pup':'dog',{cd:2000});return}return _sf(k)}}
{const _ca=careAct;careAct=function(id){if(id==='cuddle'&&!0&&typeof S!=='undefined'&&S.species&&S.species!=='sheep')animalSfx(S.species);return _ca(id)}}
// A pressed at/next to a pen on the map
{const _oi=owInput;owInput=function(k){if(k==='a'&&S.scene==='map'){const sp=asfxNear(1);if(sp){const e=asfxAll().find(q=>q.sp===sp);animalSfx(sp,{cd:2000,vol:e?Math.max(.75,asfxVol(e.d)):1,pan:e?e.rx/8:0})}}return _oi(k)}}
// v84 immersive proximity: nearby species call on a soft timer, volume by distance, panned by relative X; nearer = more often
setInterval(()=>{try{if(typeof S==='undefined'||S.scene!=='map')return;const n=Date.now();if(n-ASFX.amb<3500)return;
  for(const e of asfxAll().sort(()=>Math.random()-.5)){const v=asfxVol(e.d);if(v<.03)continue;const cd=9000+(1-v)*22000;
    if(n-(ASFX.last[e.sp]||0)<cd||Math.random()>.12+v*.3)continue;ASFX.amb=n;animalSfx(e.sp,{cd,vol:v,pan:e.rx/8});break}}catch(e){}},1000);
