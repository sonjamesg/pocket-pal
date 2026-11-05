// ===== achieve.js — v70 ACHIEVEMENTS BOARD: 24 unlocks in 5 tiers (v117: 50 in 8), Job-Board style; toasts; saved in DB.ach (local + cloud via saveDB) =====
// Open: walk up to the ACHIEVEMENTS BOARD (next to the JOB BOARD) and press A only — no Shift/T/SELECT shortcut.
// Pacing: 1 WOOL CYCLE = 6h fleece regrow (≈4 a day). cycles = max(fleeces sheared, 6h blocks since your first sheep) so nobody soft-locks.
// Specialty farm openings: CLUCKY HOLLOW 10 cycles, MUDDY TROTTERS +50% = 15, GALLOP RIDGE +50% = 23 (MOO MEADOW is open from the start).
const CYCLE_MS=6*3600e3,FARM_CYC={chickfarm:10,pigfarm:15,horsefarm:23},FARM_NM={chickfarm:'CLUCKY HOLLOW',pigfarm:'MUDDY TROTTERS',horsefarm:'GALLOP RIDGE'};
function achD(){const A=DB.ach||(DB.ach={u:{},c:{}});A.u=A.u||{};A.c=A.c||{};return A}
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
let achQ=[],achToast=null,achBusy=0;
function achCheck(){if(achBusy||!DB||!DB.avatar)return;achBusy=1;try{const A=achD();let ch=0;for(const a of ACH_ALL){if(A.u[a.id])continue;if(achVal(a)>=a.goal){A.u[a.id]=Date.now();achQ.push(a);ch=1}}if(ch)saveDB()}finally{achBusy=0}}
setInterval(()=>{if(S&&S.scene!=='title')achCheck()},1000);
// ---- event hooks ----
{const _j=owJump;owJump=function(){const o=ui.ow,b=o&&o.jt;_j();if(o&&!b&&o.jt>0)achInc('jump')}}
{const _s=say;say=function(m,t){_s(m,t);if(typeof TREE_LINES!=='undefined'&&typeof treeStreak!=='undefined'&&(TREE_LINES.includes(m)||/apple tree/.test(m))){const A=achD();A.c.treeMax=Math.max(A.c.treeMax||0,treeStreak);achCheck()}}}
{const _f=feed;feed=function(f){const h=S.hunger;_f(f);if(S.hunger!==h)achInc('feed')}}
{const _o=openAct;openAct=function(i){if(ACTIONS[i]==='BRUSH')achInc('brush');return _o(i)}}
{const _e=endGame;endGame=function(){const m=ui.mg;if(m&&m.id==='fetch'&&_sp(S)==='dog'){const A=achD();A.c.fetchBest=Math.max(A.c.fetchBest||0,m.score)}return _e()}}
{const _t=toggleFollow;toggleFollow=function(){_t();if(DB.follow)achInc('follow')}}
{const _oi=owInput;owInput=function(k){const n=CUR==='ranch'&&typeof ragL==='function'?ragL().length:0;const r=_oi(k);if(n&&ragL().length<n)achInc('rag');return r}}
{const _ie=intEnter;intEnter=function(id,fx,fy){const r=_ie(id,fx,fy);if(id==='cowfarm')achInc('moo');if(FARM_CYC[id]){const c=woolCycles();setTimeout(()=>say(farmOpen(id)?FARM_NM[id]+' is OPEN in your achievements! Shop coming soon.':FARM_NM[id]+' opens after '+FARM_CYC[id]+' WOOL CYCLES (you have '+c+'). Check the 🏆 board!',260),50)}return r}}
{const _ou=owUpdate;let ls=-1,lm='';owUpdate=function(){_ou();const o=ui.ow;if(!o)return;if(lm!==CUR){if(CUR==='outer'&&!achC('woods'))achInc('woods');lm=CUR}
  if(ls>=0&&o.step>ls&&typeof nightNow==='function'&&nightNow()&&S.scene==='map')achInc('night',o.step-ls);ls=o.step;
  if(CUR==='ranch'&&DB.follow&&DB.pets[DB.follow]&&_sp(DB.pets[DB.follow])==='dog'&&!achC('herd')&&o.x>=46&&o.x<=58&&o.y>=46&&o.y<=54&&(typeof fieldSheep!=='function'||fieldSheep().length))achInc('herd')}}
// ---- board (v83: frozen backdrop, CLAIM ★ flow, COMPLETED tab, star bank) ----
const ACH_W=[1,1,2,2,3,3,4,5],NT=()=>ACH_TIERS.length;// stars per claim by tier
function achMig(){const A=achD();A.cl=A.cl||{};if(A.stars==null)A.stars=0;if(!A.mig){for(const a of ACH_ALL)if(A.u[a.id]&&A.u[a.id]<1793818800000&&!A.cl[a.id]){A.cl[a.id]=A.u[a.id];A.stars+=ACH_W[a.ti]}A.mig=1;try{saveDB()}catch(e){}}return A}
let achSnap=null,achFx=[],achShow=0,achPop=0;
function achRows(){const A=achMig();if(ui.atier===NT())return ACH_ALL.filter(a=>A.cl[a.id]).sort((x,y)=>A.cl[y.id]-A.cl[x.id]);return ACH_ALL.filter(a=>a.ti===ui.atier&&!A.cl[a.id]).sort((x,y)=>(!!A.u[y.id])-(!!A.u[x.id]))}
function openAch(){try{achSnap=document.createElement('canvas');achSnap.width=cv.width;achSnap.height=cv.height;achSnap.getContext('2d').drawImage(cv,0,0)}catch(e){achSnap=null}
  S={scene:'ach'};ui.atier=ui.atier||0;ui.asel=0;ui.msgT=0;achFx=[];const A=achMig();achShow=A.stars;sfx&&sfx('click');achCheck()}
function achClaim(a){const A=achMig();if(!A.u[a.id]||A.cl[a.id])return;const n=ACH_W[a.ti];A.cl[a.id]=Date.now();A.stars+=n;saveDB();achPop=20;
  const i=ui.asel,y=62+i*27;for(let k=0;k<10+n*6;k++)achFx.push({x:W-40,y:y+12,vx:(Math.random()-.5)*5,vy:-Math.random()*4-1,t:0,d:k*1.5,s:k<n*4});
  try{sfx('fanfare')}catch(e){}try{sparkle(20,W-40,y+12)}catch(e){}const L=achRows();ui.asel=Math.max(0,Math.min(ui.asel,L.length-1))}
{const _i0=input0;input0=function(k){if(S.scene!=='ach')return _i0(k);const L=achRows(),n=Math.max(1,L.length);
  if(k==='left'){ui.atier=(ui.atier+NT())%(NT()+1);ui.asel=0;sfx&&sfx('blip')}if(k==='right'){ui.atier=(ui.atier+1)%(NT()+1);ui.asel=0;sfx&&sfx('blip')}
  if(k==='up')ui.asel=(ui.asel+n-1)%n;if(k==='down')ui.asel=(ui.asel+1)%n;
  if(k==='b'||k==='start'||k==='select'){S={scene:'map'};achSnap=null}
  if(k==='a'){const a=L[ui.asel];if(a&&ui.atier<NT()&&achD().u[a.id])achClaim(a);else sfx&&sfx('blip')}}}
function drawAch(t){if(achSnap)g.drawImage(achSnap,0,0,W,H);else R(0,0,W,H,'#2a1a10');R(0,0,W,H,'#0009');const A=achMig();
  RR(5,9,W-10,H-12,10,'#382010');RR(7,10,W-14,H-15,9,'#a8703c');for(let k=0;k<6;k++){R(9,16+k*34,W-18,1,'#8a5a2e');R(9,17+k*34,W-18,1,'#c48c50')}
  RR(13,24,W-26,H-33,7,'#5a3418');RR(14,25,W-28,H-35,6,'#fff6de');for(const[x,y]of[[11,13],[W-14,13],[11,H-8],[W-14,H-8]]){E(x+1,y+1,2.4,2.4,'#382010');E(x+1,y,2.2,2.2,'#e8c870')}
  RR(W/2-66,1,132,22,8,'#382010');RR(W/2-65,1,130,20,7,'#ffc83a');RR(W/2-63,3,126,8,5,'#ffe08a');otxt('🏆 ACHIEVEMENTS',W/2,16,'#fff',11);
  // star bank (counts up as stars land)
  if(achShow<A.stars&&t%3===0)achShow++;if(achShow>A.stars)achShow=A.stars;if(achPop>0)achPop--;const sc=1+achPop/40;
  RR(W-62,3,52,17,8,'#382010');RR(W-61,3,50,15,7,'#fff3a0','#d89a10');otxt('★',W-52,15,'#ffc83a',11*sc);txt(''+achShow,W-28,14.5,'#5a3418',10*sc);
  const ready=ACH_ALL.filter(a=>A.u[a.id]&&!A.cl[a.id]).length;if(ready){const p=.6+.4*Math.sin(t/6);g.globalAlpha=p;RR(10,3,48,15,7,'#ff5a8b');g.globalAlpha=1;txt(ready+' to CLAIM!',34,13.5,'#fff',6.5)}
  // tabs: tiers 1-5 + 🏆 completed
  const tw=(W-36)/(NT()+1);for(let i=0;i<=NT();i++){const x=18+i*tw,w=tw-2,on=i===ui.atier,T=ACH_TIERS[i],
    rd=i<NT()&&T.L.some(r=>A.u[r[0]]&&!A.cl[r[0]]),done=i<NT()&&T.L.every(r=>A.cl[r[0]]);
    RR(x,27,w,12,5,on?(i<NT()?T.c[0]:'#ffc83a'):'#e8dcc0',on?(i<NT()?T.c[1]:'#a06000'):rd?'#ff5a8b':'#c8b48c');txt(i<NT()?(done?'★':'')+(i+1):'🏆',x+w/2,36,on?'#fff':'#8a7058',8);if(rd&&!on)E(x+w-2,28,2.5,2.5,'#ff5a8b')}
  const L=achRows();
  if(ui.atier===NT()){txt('◀ COMPLETED  •  '+L.length+'/'+ACH_ALL.length+' ▶',W/2,50,'#a06000',9)}
  else{const T=ACH_TIERS[ui.atier];txt('◀ TIER '+(ui.atier+1)+': '+T.n+'  •  '+ACH_W[ui.atier]+'★ each ▶',W/2,50,T.c[1],8.5)}
  const top=Math.max(0,Math.min(ui.asel-2,L.length-5));
  if(!L.length){txt(ui.atier===NT()?'Nothing yet — claim a ★ to fill your scrapbook!':'Tier complete! ★ Check the 🏆 tab',W/2,110,'#8a7a68',7.5)}
  L.slice(top,top+5).forEach((a,j)=>{const i=top+j,y=55+j*27,on=i===ui.asel,T=ACH_TIERS[a.ti],cl=!!A.cl[a.id],rd=!cl&&!!A.u[a.id],v=achVal(a),pl=.5+.5*Math.sin(t/5);
    if(on){g.globalAlpha=.55+.45*pl;RR(16,y-2,W-32,28,8,T.c[0]);g.globalAlpha=1}
    RR(18,y,W-36,24,6,cl?'#fffbe8':rd?'#fff4c8':on?'#fff':'#f3ead6',cl?'#e8c870':rd?'#ffc83a':on?T.c[1]:'#d8c49c');
    if(cl){g.save();g.translate(30,y+12);g.rotate(-.12);RR(-9,-9,18,18,3,'#fff','#c8b48c');g.restore()}else RR(21,y+3,18,18,5,rd?'#ffe36a':'#d8ccb4');
    g.globalAlpha=cl||rd?1:.5;txt(a.ic,30,y+17,'#000',11);g.globalAlpha=1;
    txt(a.n,43,y+10,cl||rd?'#2b2440':'#6a5a48',8,'left',W-115);
    if(cl){const d=new Date(A.cl[a.id]);txt('Tier '+(a.ti+1)+' • '+d.getDate()+'/'+(d.getMonth()+1)+'/'+String(d.getFullYear()).slice(2),43,y+20,'#a08a68',6.5,'left',W-115);
      g.save();g.translate(W-42,y+12);g.rotate(-.18);RR(-18,-7,36,14,4,'#ffe36a','#c88a10');txt('+'+ACH_W[a.ti]+'★',0,3.5,'#a05a00',8);g.restore()}
    else{txt(a.d,43,y+20,'#8a7a68',6.5,'left',W-115);
      if(rd){const s=1+.08*Math.sin(t/4);g.save();g.translate(W-42,y+12);g.scale(s,s);g.globalAlpha=.35+.3*pl;RR(-23,-9,46,18,9,'#ffe36a');g.globalAlpha=1;RR(-20,-7,40,14,7,'#ff8a3a','#c05a10');RR(-18,-6,36,4,3,'#ffb878');txt('CLAIM ★',0,3.5,'#fff',7);g.restore()}
      else{RR(W-64,y+10,44,7,3.5,'#d8ccb4');RR(W-64,y+10,Math.max(4,44*v/a.goal),7,3.5,T.c[0]);g.globalAlpha=.5;R(W-62,y+11,Math.max(2,40*v/a.goal),1.5,'#fff');g.globalAlpha=1;
        const sx=W-64+((t*1.5)%60)-8;if(v>0&&sx<W-64+44*v/a.goal-3&&sx>W-64){g.globalAlpha=.6;R(sx,y+10,3,7,'#fff');g.globalAlpha=1}txt(v+'/'+a.goal,W-42,y+8,'#6a5a48',6.5)}}});
  if(L.length>5){txt(top>0?'▲':'',W-20,58,'#a08a68',6);txt(top+5<L.length?'▼':'',W-20,H-34,'#a08a68',6)}
  // next reward tease
  const near=ACH_ALL.filter(a=>!A.u[a.id]).map(a=>[a,achVal(a)/a.goal]).sort((x,y)=>y[1]-x[1])[0];const c=woolCycles(),nx=Object.keys(FARM_CYC).find(id=>c<FARM_CYC[id]);
  RR(18,H-30,W-36,15,7,'#efe6ff','#5b4b8a');txt(near&&near[1]>0&&t%240<120?'✨ SO CLOSE: '+near[0].n+' → +'+ACH_W[near[0].ti]+'★':'🧶 Wool cycles: '+c+(nx?'  •  '+FARM_NM[nx]+' at '+FARM_CYC[nx]:'  •  All farms open!'),W/2,H-19.5,'#5b4b8a',7,'center',W-44);
  txt('◀▶ tab  ▲▼ pick  A claim  B close',W/2,H-6,'#fff',6.5);
  // flying stars → header bank
  achFx=achFx.filter(p=>{if(p.d>0){p.d--;return true}p.t++;if(p.t<14){p.x+=p.vx;p.y+=p.vy;p.vy+=.3}else{p.x+=(W-52-p.x)*.2;p.y+=(11-p.y)*.2}
    const k=Math.min(1,p.t/6);g.globalAlpha=k;otxt(p.s?'★':'✦',p.x,p.y,p.s?'#ffc83a':'#fff3a0',p.s?10:7);g.globalAlpha=1;if(p.t>30){achPop=Math.max(achPop,12);return false}return true})}
function drawAchToast(){if(!achToast&&achQ.length){achToast={a:achQ.shift(),t:0};try{sfx('fanfare')}catch(e){}try{sparkle(24,W/2,30)}catch(e){}}if(!achToast)return;const z=achToast;z.t++;
  const k=z.t<15?z.t/15:z.t>165?Math.max(0,(190-z.t)/25):1,y=-34+k*40;RR(20,y,W-40,32,9,'#382010');RR(21,y,W-42,30,8,'#ffe36a','#a06000');RR(26,y+4,22,22,6,'#fff');txt(z.a.ic,37,y+20,'#000',13);
  txt('🏆 READY TO CLAIM ★ at the board!',54,y+12,'#a05a00',7.5,'left');txt(z.a.n,54,y+24,'#2b2440',9.5,'left',W-100);if(z.t>190)achToast=null}
// v73: ACHIEVEMENTS BOARD prop next to the JOB BOARD (walk up + A). Gold-trimmed clone of the job board with a trophy plaque.
function mkAchBoard(){const src=IMG.p_jobboard;if(!src||!src.naturalWidth)return false;const T=14,c=document.createElement('canvas');c.width=src.naturalWidth;c.height=src.naturalHeight+T;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  x.drawImage(src,0,T);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(255,200,40,.38)';x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='source-over';
  const w=c.width,cx=w/2,P=(X,Y,W,H,C)=>{x.fillStyle=C;x.fillRect(X,Y,W,H)};
  // gold trophy mounted on top of the wooden frame (outline, cup, handles, stem, wooden mount block)
  P(cx-7,1,14,2,'#2b2440');P(cx-8,2,16,8,'#2b2440');P(cx-3,10,6,3,'#2b2440');P(cx-5,12,10,4,'#2b2440');
  P(cx-6,2,12,7,'#ffc83a');P(cx-5,3,4,4,'#fff3a0');P(cx+3,3,2,5,'#d89a10');P(cx-9,3,3,4,'#2b2440');P(cx+6,3,3,4,'#2b2440');P(cx-8,4,2,2,'#ffc83a');P(cx+6,4,2,2,'#ffc83a');
  P(cx-2,9,4,3,'#d89a10');P(cx-4,12,8,3,'#8a5a2e');P(cx-4,12,8,1,'#c48c50');
  // small star plaque on the board face
  const cy=T+Math.round(src.naturalHeight*.38);P(cx-6,cy-5,12,10,'#2b2440');P(cx-5,cy-4,10,8,'#ffe36a');P(cx-1,cy-3,2,6,'#c88a10');P(cx-3,cy-1,6,2,'#c88a10');
  c.naturalWidth=w;c.naturalHeight=c.height;IMG.p_achboard=c;return true}
{const t=setInterval(()=>{if(mkAchBoard())clearInterval(t)},300)}
if(typeof PROP_MSG!=='undefined')PROP_MSG.achboard='The ACHIEVEMENTS BOARD — press A!';
{const _h=owHint;owHint=function(th){if(th&&th.prop==='achboard')return 'A: open ACHIEVEMENTS';return _h(th)}}
{const _oi=owInput;owInput=function(k){const o=ui.ow;if(k==='a'&&o&&!o.mv&&CUR==='ranch'){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);if(th&&th.prop==='achboard'){openAch();return}}return _oi(k)}}
{const _ox=owExtras;owExtras=function(t,o){_ox(t,o);if(CUR!=='ranch')return;const P=PROPS.find(q=>q[4]==='achboard');if(!P)return;const X=P[0]*TS+P[2]*8,Y=(P[1]+P[3])*TS,f=()=>{RR(X-28,Y-1,56,8,3,'#6a4020','#382010');txt('ACHIEVEMENTS',X,Y+5,'#ffe36a',5)};if(typeof P3D!=='undefined'&&P3D)p3later(X,Y+2,f);else f()}}
{const _fr=frame;frame=function(){if(S.scene==='ach'){g.setTransform(cv.width/W,0,0,cv.height/H,0,0);ui.anim++;const t=ui.anim;g.clearRect(0,0,W,H);drawAch(t);drawAchToast();requestAnimationFrame(frame);return}_fr();if(S.scene!=='title')drawAchToast()}}
// job board pointer to the trophy board
{const _dj=drawJobs;drawJobs=function(t){_dj(t);txt('🏆 ACHIEVEMENTS board is right next door ▶',W/2,H-1.5,'#ffe36a',6)}}
if(window.__pp)Object.assign(window.__pp,{openAch,achCheck,ACH_ALL,woolCycles});
// v71 safety net: one throwing decor layer must never kill the building/prop draw
{const _x=owExtras;owExtras=function(t,o){try{_x(t,o)}catch(e){console.warn('owExtras',e)}}}
{const _h=owHud;owHud=function(t){try{_h(t)}catch(e){console.warn('owHud',e)}}}
{const _ts=tiltShift;tiltShift=function(){try{_ts()}catch(e){console.warn('tilt',e)}}}
{const _b=bloom;bloom=function(...a){try{_b(...a)}catch(e){}}}
if(typeof lamps==='function'){const _l=lamps;lamps=function(t){try{_l(t)}catch(e){}}}
if(typeof penRoamers==='function'){const _p=penRoamers;penRoamers=function(t){try{_p(t)}catch(e){}}}

// v117 extra counters: salon visits, trick performs, follow-walk steps, chore day streaks
{let ps='';setInterval(()=>{try{if(!S||!DB||!DB.avatar)return;const sc=S.scene;if(sc!==ps){if(sc==='groom')achInc('salon');ps=sc}
  const A=achD(),j=DB.jobsDone||0;if(j>(A.c.lastJobs||0)){A.c.lastJobs=j;const d=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);if(A.c.jobDay!==d){A.c.streak=A.c.jobDay===d-1?(A.c.streak||0)+1:1;A.c.jobDay=d;A.c.streakMax=Math.max(A.c.streakMax||0,A.c.streak);saveDB()}}}catch(e){}},700)}
{const _p=perform;perform=function(tr){_p(tr);achInc('perform')}}
{const _ou=owUpdate;let ls=-1;owUpdate=function(){_ou();const o=ui.ow;if(!o)return;if(ls>=0&&o.step>ls&&DB.follow&&DB.pets[DB.follow]&&S.scene==='map')achInc('followSteps',o.step-ls);ls=o.step}}
