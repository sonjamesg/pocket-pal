// ===== achieve.js — v70 ACHIEVEMENTS BOARD: 24 unlocks in 5 tiers, Job-Board style; toasts; saved in DB.ach (local + cloud via saveDB) =====
// Open: walk up to the ACHIEVEMENTS BOARD (next to the JOB BOARD) and press A. Shortcuts: SELECT / T on the map.
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
// [id, icon, name, how, value(), goal]
const ACH_TIERS=[
 {n:'SPROUT',c:['#7ad46a','#3a8a2a'],L:[
  ['hello','👋','HOWDY!','Read the JOB BOARD',()=>wm().step>=1?1:0,1],
  ['jump','🦘','BOING!','Jump 5 times (Space / C / X)',()=>achC('jump'),5],
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
  ['rich','💰','MONEY BAGS','Have 500 coins',()=>DB.wallet||0,500]]}];
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
// ---- board ----
function openAch(){S={scene:'ach'};ui.atier=ui.atier||0;ui.asel=0;ui.msgT=0;sfx&&sfx('click');achCheck()}
{const _oi=owInput;owInput=function(k){if(k==='select'){openAch();return}return _oi(k)}}
{const _in=input;input=function(k){if(k==='ach'){if(!ui.modal&&S.scene==='map')openAch();return}return _in(k)}}
if(typeof KM!=='undefined'){KM.t='ach'}
{const _i0=input0;input0=function(k){if(S.scene!=='ach')return _i0(k);const T=ACH_TIERS[ui.atier];
  if(k==='left'){ui.atier=(ui.atier+4)%5;ui.asel=0}if(k==='right'){ui.atier=(ui.atier+1)%5;ui.asel=0}if(k==='up')ui.asel=(ui.asel+T.L.length-1)%T.L.length;if(k==='down')ui.asel=(ui.asel+1)%T.L.length;
  if(k==='b'||k==='start'||k==='select'){S={scene:'map'}}if(k==='a'){sfx&&sfx('blip')}}}
function drawAch(t){drawOverworld(t);R(0,0,W,H,'#0007');const A=achD();
  RR(5,9,W-10,H-12,10,'#382010');RR(7,10,W-14,H-15,9,'#a8703c');for(let k=0;k<6;k++){R(9,16+k*34,W-18,1,'#8a5a2e');R(9,17+k*34,W-18,1,'#c48c50')}
  RR(13,24,W-26,H-33,7,'#5a3418');RR(14,25,W-28,H-35,6,'#fff6de');for(const[x,y]of[[11,13],[W-14,13],[11,H-8],[W-14,H-8]]){E(x+1,y+1,2.4,2.4,'#382010');E(x+1,y,2.2,2.2,'#e8c870')}
  RR(W/2-66,1,132,22,8,'#382010');RR(W/2-65,1,130,20,7,'#ffc83a');RR(W/2-63,3,126,8,5,'#ffe08a');otxt('🏆 ACHIEVEMENTS',W/2,16,'#fff',11);
  const got=ACH_ALL.filter(a=>A.u[a.id]).length;txt('★'+got+'/'+ACH_ALL.length,W-20,50,'#5a3418',8,'right');
  // tier tabs
  ACH_TIERS.forEach((T,i)=>{const x=18+i*((W-48)/5),w=(W-48)/5-2,on=i===ui.atier,done=T.L.every(a=>A.u[a[0]]);RR(x,27,w,12,5,on?T.c[0]:'#e8dcc0',on?T.c[1]:'#c8b48c');txt((done?'★':'')+(i+1),x+w/2,36,on?'#fff':'#8a7058',8)});
  const T=ACH_TIERS[ui.atier];txt('◀ TIER '+(ui.atier+1)+': '+T.n+' ▶',W/2-8,50,T.c[1],9);
  T.L.forEach((r,i)=>{const a=ACH_ALL.find(x=>x.id===r[0]),y=55+i*27,on=i===ui.asel,u=!!A.u[a.id],v=achVal(a);
    if(on)RR(17,y-1,W-34,26,7,T.c[0]);RR(18,y,W-36,24,6,u?'#fffbe8':on?'#fff':'#f3ead6',u?'#ffc83a':on?T.c[0]:'#d8c49c');
    RR(21,y+3,18,18,5,u?'#ffe36a':'#d8ccb4');g.globalAlpha=u?1:.45;txt(a.ic,30,y+17,'#000',11);g.globalAlpha=1;
    txt(a.n,43,y+10,u?'#2b2440':'#6a5a48',8,'left',W-110);txt(a.d,43,y+20,'#8a7a68',6.5,'left',W-110);
    if(u){RR(W-58,y+6,36,12,6,'#48c070');txt('DONE ✓',W-40,y+14.5,'#fff',7)}else{RR(W-62,y+9,40,7,3.5,'#d8ccb4');RR(W-62,y+9,Math.max(3,40*v/a.goal),7,3.5,T.c[0]);txt(v+'/'+a.goal,W-42,y+7,'#6a5a48',6.5)}});
  const c=woolCycles();RR(18,H-30,W-36,15,7,'#efe6ff','#5b4b8a');
  const nx=Object.keys(FARM_CYC).find(id=>c<FARM_CYC[id]);txt('🧶 Wool cycles: '+c+(nx?'  •  '+FARM_NM[nx]+' at '+FARM_CYC[nx]:'  •  All farms open!'),W/2,H-19.5,'#5b4b8a',7);
  txt('◀▶ tier  ▲▼ pick  B close',W/2,H-6,'#fff',6.5)}
function drawAchToast(){if(!achToast&&achQ.length){achToast={a:achQ.shift(),t:0};try{sfx('fanfare')}catch(e){}try{sparkle(24,W/2,30)}catch(e){}}if(!achToast)return;const z=achToast;z.t++;
  const k=z.t<15?z.t/15:z.t>165?Math.max(0,(190-z.t)/25):1,y=-34+k*40;RR(20,y,W-40,32,9,'#382010');RR(21,y,W-42,30,8,'#ffe36a','#a06000');RR(26,y+4,22,22,6,'#fff');txt(z.a.ic,37,y+20,'#000',13);
  txt('🏆 ACHIEVEMENT UNLOCKED!',54,y+12,'#a05a00',7.5,'left');txt(z.a.n,54,y+24,'#2b2440',9.5,'left',W-100);if(z.t>190)achToast=null}
// v73: ACHIEVEMENTS BOARD prop next to the JOB BOARD (walk up + A). Gold-trimmed clone of the job board with a trophy plaque.
function mkAchBoard(){const src=IMG.p_jobboard;if(!src||!src.naturalWidth)return false;const c=document.createElement('canvas');c.width=src.naturalWidth;c.height=src.naturalHeight;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  x.drawImage(src,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(255,200,40,.38)';x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='source-over';
  const w=c.width,cx=w/2,cy=Math.round(c.height*.38);x.fillStyle='#2b2440';x.fillRect(cx-8,cy-8,16,15);x.fillStyle='#ffc83a';x.fillRect(cx-7,cy-7,14,13);
  x.fillStyle='#fff3a0';x.fillRect(cx-4,cy-5,8,5);x.fillStyle='#c88a10';x.fillRect(cx-1,cy,2,3);x.fillRect(cx-3,cy+3,6,2);x.fillStyle='#ffe36a';x.fillRect(cx-6,cy-4,2,3);x.fillRect(cx+4,cy-4,2,3);
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
