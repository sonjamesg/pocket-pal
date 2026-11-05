// ===== achieve.js — v70 ACHIEVEMENTS BOARD: 24 unlocks in 5 tiers (v117: 50 in 8), Job-Board style; toasts; saved in DB.ach (local + cloud via saveDB) =====
// Open: walk up to the ACHIEVEMENTS BOARD (next to the JOB BOARD) and press A only — no Shift/T/SELECT shortcut.
// Pacing: 1 WOOL CYCLE = 6h fleece regrow (≈4 a day). cycles = max(fleeces sheared, 6h blocks since your first sheep) so nobody soft-locks.
// Specialty farm openings: CLUCKY HOLLOW 10 cycles, MUDDY TROTTERS +50% = 15, GALLOP RIDGE +50% = 23 (MOO MEADOW is open from the start).
const CYCLE_MS=6*3600e3,FARM_CYC={chickfarm:10,pigfarm:15,horsefarm:23},FARM_NM={chickfarm:'CLUCKY HOLLOW',pigfarm:'MUDDY TROTTERS',horsefarm:'GALLOP RIDGE'};
function achD(){const A=DB.ach||(DB.ach={u:{},c:{}});A.u=A.u||{};A.c=A.c||{};
  /* v119 one-time: SONJAMES had later-tier unlocks before tier gating — clear unlocked/claimed/stars (counters + wool clock kept) */
  if(!DB.achR119&&String(DB.playerName||'').toUpperCase()==='SONJAMES'){A.u={};A.cl={};A.stars=0;A.mig=1;DB.achR119=1;try{setTimeout(saveDB,0)}catch(e){}}
  return A}
function achC(k){return achD().c[k]||0}
function achInc(k,n=1){const A=achD();A.c[k]=(A.c[k]||0)+n;achCheck()}
const _sl=()=>typeof sheepList==='function'?sheepList():[],_pl=()=>typeof petList==='function'?petList():[],_sp=p=>{try{return spOf(p)}catch(e){return p.species}};
function woolCycles(){const A=achD();if(!A.first&&_sl().length)A.first=Date.now();const t=A.first?Math.floor((Date.now()-A.first)/CYCLE_MS):0;return Math.max(DB.woolBales||0,t)}
function farmOpen(id){return !FARM_CYC[id]||woolCycles()>=FARM_CYC[id]}
const dogs=()=>_pl().filter(p=>_sp(p)==='dog'),trickMax=id=>Math.max(0,...dogs().map(p=>(p.tricks&&p.tricks[id])||0));
const _own=sp=>_pl().filter(p=>_sp(p)===sp).length,_kinds=()=>new Set(_pl().map(_sp)).size,
  trickCount=()=>Math.max(0,...dogs().map(p=>TRICKS.filter(t=>((p.tricks||{})[t.id]||0)>=TUNE.trickNeed).length));
// [id, icon, name, how, value(), goal]  (v117: 8 tiers / 50 unlocks — early ones easy, later ones take weeks)
const ACH_TIERS=[
 {n:'SPROUT',c:['#7ad46a','#3a8a2a'],L:[
  ['hello','👋','HOWDY!','Read the JOB BOARD',()=>wm().step>=1?1:0,1],
  ['jump','🦘','BOING!','Jump 5 times (A / Space / C / X)',()=>achC('jump'),5],
  ['sheep1','🐑','FIRST SHEEP','Get your first sheep',()=>_sl().length,1],
  ['tree','🌳','TREE HUGGER','Look at 5 trees in a row',()=>achC('treeMax'),5],
  ['feed','🥕','SNACK TIME','Feed your animals 5 times',()=>achC('feed'),5]]},
 {n:'FARMHAND',c:['#4aa8e8','#1f6aa0'],L:[
  ['shear1','✂️','FIRST SHEAR','Shear a full fleece',()=>DB.woolBales||0,1],
  ['sell1','🪙','WOOL SELLER','Sell wool at YOUR FARM SHOP',()=>DB.firstSell?1:0,1],
  ['brush','🪮','BRUSH BUDDY','Brush animals 5 times',()=>achC('brush'),5],
  ['woods','🌲','INTO THE WOODS','Walk through the gate to the WILD WOODS',()=>achC('woods'),1],
  ['night','🌙','NIGHT OWL','Walk 30 steps at night',()=>achC('night'),30]]},
 {n:'DOG TRAINER',c:['#ff8a3a','#c05a10'],L:[
  ['dog','🐶','PUPPY PAL','Get a dog from the PET SHOP',()=>dogs().length,1],
  ['follow','🐾','WALKIES','Have your dog FOLLOW you (F / LB)',()=>achC('follow'),1],
  ['sit','🪑','SIT!','Teach your dog SIT',()=>trickMax('sit'),TUNE.trickNeed],
  ['fetch','🎾','FETCH!','Score 6 in FETCH with your dog',()=>achC('fetchBest'),6],
  ['herd','🐕','HERD!','Walk your following dog into the SHEEP FIELD',()=>achC('herd'),1]]},
 {n:'RANCHER',c:['#ff5a8b','#b8264f'],L:[
  ['moo','🐄','MOO MEADOW','Visit Farmer ROSIE at MOO MEADOW',()=>achC('moo'),1],
  ['cow','🐮','COW OWNER','Buy a cow from ROSIE',()=>_pl().filter(p=>_sp(p)==='cow').length,1],
  ['rag','🌼','RAGWORT RANGER','Pull 5 RAGWORT from horse fields',()=>achC('rag'),5],
  ['flock','🐏','BIG FLOCK','Own 3 sheep',()=>_sl().length,3],
  ['cyc4','☀️','ONE FARM DAY','Reach 4 WOOL CYCLES (1 day)',()=>woolCycles(),4]]},
 {n:'LEGEND',c:['#b07cff','#6a3ad0'],L:[
  ['chickfarm','🐔','CLUCKY HOLLOW OPENS','Reach '+FARM_CYC.chickfarm+' WOOL CYCLES',()=>woolCycles(),FARM_CYC.chickfarm],
  ['pigfarm','🐷','MUDDY TROTTERS OPENS','Reach '+FARM_CYC.pigfarm+' WOOL CYCLES',()=>woolCycles(),FARM_CYC.pigfarm],
  ['horsefarm','🐴','GALLOP RIDGE OPENS','Reach '+FARM_CYC.horsefarm+' WOOL CYCLES',()=>woolCycles(),FARM_CYC.horsefarm],
  ['rich','💰','MONEY BAGS','Have 500 coins',()=>DB.wallet||0,500]]},
 {n:'BARN BOSS',c:['#e8b23a','#9a6a10'],L:[
  ['pets3','🏡','FULL HOUSE','Own 3 animals',()=>_pl().length,3],
  ['hen','🐔','HEN KEEPER','Own a chicken (CLUCKY HOLLOW)',()=>_own('chicken'),1],
  ['pig','🐷','PIG PAL','Own a pig (MUDDY TROTTERS)',()=>_own('pig'),1],
  ['horse','🐴','SADDLE UP','Own a horse (GALLOP RIDGE)',()=>_own('horse'),1],
  ['cows3','🐄','HERD OF COWS','Own 3 cows',()=>_own('cow'),3],
  ['salon1','💇','PAMPERED','Visit the grooming salon 5 times',()=>achC('salon'),5],
  ['tricks3','🎪','SHOW DOG','Fully teach a dog 3 tricks',()=>trickCount(),3],
  ['jobs10','📋','HARD WORKER','Do 10 barn chores',()=>DB.jobsDone||0,10]]},
 {n:'TOP RANCHER',c:['#3ac0a8','#14806a'],L:[
  ['tricks5','🌟','SUPERSTAR','Fully teach a dog ALL 5 tricks',()=>trickCount(),5],
  ['perform','🎭','ENCORE!','Perform tricks 25 times',()=>achC('perform'),25],
  ['walk500','🐾','LONG WALKIES','Walk 500 steps with a dog following',()=>achC('followSteps'),500],
  ['streak3','📅','3 DAY STREAK','Do chores 3 days in a row',()=>achC('streakMax'),3],
  ['shear10','🧶','WOOL MAKER','Shear 10 fleeces',()=>DB.woolBales||0,10],
  ['harv25','🌽','GREEN THUMB','Harvest 25 crops',()=>DB.harvested||0,25],
  ['zoo','🦁','ONE OF EACH','Own 6 kinds of animal',()=>_kinds(),6],
  ['rich1k','💰','PIGGY BANK','Have 1000 coins',()=>DB.wallet||0,1000]]},
 {n:'HALL OF FAME',c:['#ff6a4a','#b02a10'],L:[
  ['allfarms','🗺️','ALL FARMS OPEN','Reach '+FARM_CYC.horsefarm+' WOOL CYCLES',()=>woolCycles(),FARM_CYC.horsefarm],
  ['cyc40','🌈','TEN FARM DAYS','Reach 40 WOOL CYCLES',()=>woolCycles(),40],
  ['cyc120','🏅','A MONTH ON THE FARM','Reach 120 WOOL CYCLES',()=>woolCycles(),120],
  ['streak7','🔥','WEEK STREAK','Do chores 7 days in a row',()=>achC('streakMax'),7],
  ['jobs100','🛠️','RANCH HAND','Do 100 barn chores',()=>DB.jobsDone||0,100],
  ['walk3k','🥾','MARATHON','Walk 3000 steps with a dog following',()=>achC('followSteps'),3000],
  ['salon25','✨','SALON VIP','Visit the grooming salon 25 times',()=>achC('salon'),25],
  ['shear50','🐑','WOOL BARON','Shear 50 fleeces',()=>DB.woolBales||0,50],
  ['pets10','🏰','BIG RANCH','Own 10 animals',()=>_pl().length,10],
  ['rich5k','👑','RANCH TYCOON','Have 5000 coins',()=>DB.wallet||0,5000]]}];
const ACH_ALL=[].concat(...ACH_TIERS.map((T,ti)=>T.L.map(a=>({id:a[0],ic:a[1],n:a[2],d:a[3],v:a[4],goal:a[5],ti}))));
function achVal(a){let v=0;try{v=a.v()}catch(e){}return Math.min(a.goal,v||0)}
// v118: tier N only unlocks once every goal in the tiers before it is done
function tierOpen(ti){const A=achD();for(let i=0;i<ti;i++)if(ACH_TIERS[i].L.some(r=>!A.u[r[0]]))return false;return true}
let achQ=[],achToast=null,achBusy=0;
function achCheck(){if(achBusy||!DB||!DB.avatar)return;achBusy=1;try{const A=achD();let ch=0;for(const a of ACH_ALL){if(A.u[a.id])continue;if(!tierOpen(a.ti))continue;if(achVal(a)>=a.goal){A.u[a.id]=Date.now();achQ.push(a);ch=1}}if(ch)saveDB()}finally{achBusy=0}}
setInterval(()=>{if(S&&S.scene!=='title')achCheck()},1000);
