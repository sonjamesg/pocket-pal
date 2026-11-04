// ===== save.js — localStorage (pocketpal_v9), migrate, pet state =====
const cv=document.getElementById('screen'),g=cv.getContext('2d');
const SAVE='pocketpal_v9';
const now=()=>Date.now(),clamp=v=>Math.max(0,Math.min(100,v)),rnd=a=>a[Math.floor(Math.random()*a.length)];
const STAGE_MAP={baby:'puppy',toddler:'youngster',teen:'teen',adult:'adult',old:'senior'};
let DB=loadDB();if(DB.wallet==null)DB.wallet=60;
// v32: one wallet — fold any old per-pet coins (above the 20 starter) into DB.wallet once
if(!DB.coinsMerged){Object.values(DB.pets||{}).forEach(p=>{if((p.coins||0)>20)DB.wallet+=p.coins-20;p.coins=0});DB.coinsMerged=1;try{localStorage.setItem('pocketpal_v9',JSON.stringify(DB))}catch(e){}}
function saveDB(){try{localStorage.setItem(SAVE,JSON.stringify(DB))}catch(e){}}
const DOG_PRICE={beagle:25,dachshund:30,lab:35,collie:40,poodle:45,corgi:55,husky:60,frenchie:75,staffy:65};
// economy (v22): starter 60, chores 5-12 each, Grandpa 30/day. Future: SPECIES_PRICE mid 40-60, premium 70-100; SLOT_PRICE ranch slot upgrades > a pet
const SPECIES_PRICE={cat:40,rabbit:40,chicken:45,pig:55,sheep:60,cow:80,horse:100},SLOT_PRICE=[0,0,0,120,160,220];const priceOf=b=>DOG_PRICE[b]||40;
function loadDB(){let d=null;try{d=JSON.parse(localStorage.getItem(SAVE))}catch(e){}
  if(d&&d.pets)return d;d={v:9,pets:{},lastId:null};
  try{const o=JSON.parse(localStorage.getItem('pocketpal_v7'));if(o&&o.pets){Object.values(o.pets).forEach(p=>{p.species=p.species||'dog';d.pets[p.id]=p});d.lastId=o.lastId;localStorage.setItem(SAVE,JSON.stringify(d));return d}}catch(e){}
  try{const o=JSON.parse(localStorage.getItem('pocketpal_v3'));if(o&&o.pets){Object.values(o.pets).forEach(p=>{const q=migrate(p);d.pets[q.id]=q});d.lastId=o.lastId}}catch(e){}
  try{localStorage.setItem(SAVE,JSON.stringify(d))}catch(e){}return d}
function migrate(p){p=Object.assign({},p);if(p.species&&p.species!=='dog')p.wasSpecies=p.species;p.species='dog';p.breed=p.breed||'lab';
  if(p.stage)p.stage=STAGE_MAP[p.stage]||p.stage;p.stageStart=now();p.xp=0;p.coat=20;p.plaque=10;p.last=now();return fix(p)}
function fix(s){s.species=SP[s.species]?s.species:'dog';if(s.species!=='dog'&&!(s.breed&&String(s.breed).startsWith(s.species+'_')))s.breed=s.species;s.tricks=s.tricks||{};TRICKS.forEach(t=>{if(s.tricks[t.id]==null)s.tricks[t.id]=0});s.best=s.best||{};
  s.toys=s.toys||['ball'];if(s.coins==null)s.coins=20;if(s.coat==null)s.coat=10;if(s.plaque==null)s.plaque=5;if(s.xp==null)s.xp=0;if(s.species==='sheep'&&s.wool==null)s.wool=0;
  if(s.scene&&!['egg','title','species','breed'].includes(s.scene))s.scene='main';return s}
function syncActs(){ACTIONS=ACTS[spOf(S)];if(ui&&ui.menu>=ACTIONS.length)ui.menu=0}
function petList(){return Object.values(DB.pets).sort((a,b)=>(b.lastPlayed||0)-(a.lastPlayed||0))}
function save(quiet){if(S.id&&S.breed){S.lastPlayed=now();const c=Object.assign({},S);if(!['egg','main'].includes(c.scene))c.scene=c.stage?'main':'egg';c.hatch=ui.hatch;DB.pets[S.id]=c;DB.lastId=S.id}
  try{localStorage.setItem(SAVE,JSON.stringify(DB))}catch(e){}if(!quiet)flashSave()}
let saveFlash=0;function flashSave(){saveFlash=90}
function loadPet(id){const p=DB.pets[id];if(!p)return;S=fix(JSON.parse(JSON.stringify(p)));ui.hatch=p.hatch||0;ui.menu=0;ui.dx=110;ui.idle={k:'sit',t:60};syncActs();
  if(S.scene==='main'){timeTick();checkGrow()}DB.lastId=id;save(true)}
let S={scene:'title'};
let ui={tsel:0,psel:0,sel:0,menu:0,anim:0,msg:'',msgT:0,fx:[],hatch:0,shake:0,pose:'idle',poseT:0,mg:null,dx:110,dir:1,idle:{k:'sit',t:60},warnI:0};
function say(m,t=130){ui.msg=m;ui.msgT=Math.max(t,90+String(m).length*3)}
