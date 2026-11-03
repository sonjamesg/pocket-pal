const LOGO={img:new Image(),ok:false};LOGO.img.onload=()=>LOGO.ok=true;LOGO.img.onerror=()=>LOGO.ok=false;LOGO.img.src='assets/pet-farm-logo.jpg?v=14';
// ===== Pet Farm v15 — walkable overworld, cat/chicken/pig + dogs =====
const W=240,H=216,HOUR=3600e3,DAY=24*HOUR;
// per real HOUR. Coat fully long in ~12 days, plaque bad in ~6 days.
const RATE={hunger:6,happy:3,coat:100/(12*24),plaque:100/(8*24)};
const TUNE={petAmt:8,hatchTaps:6,trickNeed:5,xpPerDay:14,longAt:60,matAt:80,plaqueBad:65};
const STAGES=['egg','puppy','youngster','teen','adult','senior'];
const STAGE_N={egg:'EGG',puppy:'PUPPY',youngster:'YOUNGSTER',teen:'TEEN',adult:'ADULT',senior:'SENIOR'};
// real days in stage + care XP (max 14 XP/day) — Adult ≈ 6 weeks, Senior ≈ 4 months of caring
const GROW={puppy:{days:7,xp:60},youngster:{days:14,xp:120},teen:{days:21,xp:180},adult:{days:75,xp:600}};
const SPECIES=[{id:'dog',n:'DOG',ok:true},{id:'cat',n:'CAT',ok:true},{id:'chicken',n:'CHICKEN',ok:true},{id:'pig',n:'PIG',ok:true},
 {id:'cow',n:'COW'},{id:'sheep',n:'SHEEP'},{id:'horse',n:'HORSE'},{id:'donkey',n:'DONKEY'},{id:'mule',n:'MULE'},{id:'rabbit',n:'RABBIT'},{id:'bird',n:'BIRD'}];
const SP={dog:{baby:'PUPPY',house:'KENNEL',food:'DOG FOOD'},cat:{baby:'KITTEN',house:'CAT HUT',food:'CAT FOOD'},chicken:{baby:'CHICK',house:'COOP',food:'CHICKEN FEED'},pig:{baby:'PIGLET',house:'PIG STY',food:'PIG FOOD'}};
const spOf=p=>(p&&p.species&&SP[p.species])?p.species:'dog';
function stageName(st,sp){return st==='puppy'?SP[sp||'dog'].baby:STAGE_N[st||'egg']}
const BREEDS={
 lab:{n:'LABRADOR',c:'#e9c47e',d:'#c99a50',l:'#f7e6c0',ear:'flop',tail:'otter',bl:22,bh:13,leg:14,hr:11,sn:8,fur:.6,desc:'Loyal, loves food & swimming'},
 frenchie:{n:'FRENCH BULLDOG',c:'#dcc6a4',d:'#3a2e2a',l:'#f1e6d2',ear:'bat',tail:'stub',bl:17,bh:13,leg:10,hr:12,sn:4,fur:.4,mask:true,desc:'Big bat ears, little snorts'},
 dachshund:{n:'DACHSHUND',c:'#a8552a',d:'#6e3216',l:'#c97a48',ear:'long',tail:'whip',bl:28,bh:10,leg:7,hr:10,sn:11,fur:.6,desc:'Long sausage body, brave!'},
 poodle:{n:'POODLE',c:'#f3e4d0',d:'#dcc4a8',l:'#fffaf2',ear:'pom',tail:'pom',bl:19,bh:12,leg:17,hr:10,sn:9,fur:1.5,curly:true,desc:'Curly coat — grows FAST'},
 corgi:{n:'CORGI',c:'#e38b3a',d:'#b0602a',l:'#fff6ea',ear:'pointy',tail:'stub',bl:24,bh:12,leg:7,hr:11,sn:8,fur:.8,white:true,desc:'Short legs, huge smile'},
 husky:{n:'HUSKY',c:'#6d7484',d:'#3e4452',l:'#f4f6fa',ear:'pointy',tail:'curl',bl:23,bh:13,leg:15,hr:11,sn:9,fur:1.1,white:true,eye:'#4fb0ff',desc:'Ice-blue eyes, loves to run'},
 beagle:{n:'BEAGLE',c:'#c98a48',d:'#2e2622',l:'#fffaf2',ear:'flop',earC:'#9a6030',tail:'whip',bl:20,bh:12,leg:12,hr:11,sn:8,fur:.5,saddle:true,white:true,desc:'Super sniffer nose'},
 cat:{sp:'cat',n:'CAT',c:'#f0a050',d:'#c07030',l:'#fff4e6',bl:20,bh:11,leg:12,hr:11,sn:4,fur:0,desc:'Purrs, naps, loves a cushion'},
 chicken:{sp:'chicken',n:'CHICKEN',c:'#fff8ec',d:'#e8d8c0',l:'#ffffff',bl:14,bh:13,leg:10,hr:8,sn:3,fur:0,desc:'Clucks, pecks & scratches'},
 pig:{sp:'pig',n:'PIG',c:'#ffb0c0',d:'#e88aa0',l:'#ffd0dc',bl:24,bh:14,leg:8,hr:12,sn:5,fur:0,desc:'Oink! Loves a muddy roll'},
 collie:{n:'BORDER COLLIE',c:'#2a2630',d:'#16131a',l:'#ffffff',ear:'semi',tail:'plume',bl:22,bh:12,leg:15,hr:10,sn:9,fur:1.2,white:true,desc:'Clever! Learns tricks fast'}};
const BKEYS=Object.keys(BREEDS).filter(k=>!BREEDS[k].sp);
const FOODS=[
 {id:'kibble',n:'KIBBLE',v:22},{id:'wet',n:'WET FOOD',v:28,joy:3},{id:'chicken',n:'CHICKEN',v:24,joy:6},{id:'salmon',n:'SALMON',v:22,joy:5,d:'Shiny coat'},
 {id:'biscuit',n:'PEANUT TREAT',v:8,joy:12,plq:4,d:'Dog-safe peanut biscuit'},{id:'dental',n:'DENTAL CHEW',v:6,joy:6,plq:-30,d:'Cleans teeth!'},{id:'carrot',n:'CARROT STICK',v:10,joy:2,plq:-8,d:'Crunchy, helps teeth'}];
const SFOODS={cat:[{id:'catbisc',n:'CAT BISCUITS',v:20},{id:'wet',n:'WET FOOD',v:28,joy:3},{id:'salmon',n:'SALMON',v:22,joy:6},{id:'chicken',n:'CHICKEN',v:24,joy:5},{id:'dental',n:'DENTAL TREAT',v:6,joy:6,plq:-30,d:'Cleans teeth!'}],
 chicken:[{id:'corn',n:'CORN',v:20},{id:'grain',n:'MIXED GRAIN',v:24},{id:'worms',n:'MEALWORMS',v:12,joy:10,d:'Favourite snack!'},{id:'greens',n:'GREENS',v:14,joy:4}],
 pig:[{id:'slop',n:'PIG NUTS',v:26},{id:'apple',n:'APPLE',v:14,joy:8},{id:'carrot',n:'CARROT',v:12,joy:4},{id:'corn',n:'CORN',v:18,joy:3},{id:'veg',n:'VEG SCRAPS',v:22,joy:2}]};
function foods(){return S.species&&SFOODS[S.species]||FOODS}
const TOYS=[{id:'ball',n:'TENNIS BALL',p:0},{id:'squeak',n:'SQUEAKY BONE',p:15},{id:'rope',n:'TUG ROPE',p:20},{id:'frisbee',n:'FRISBEE',p:30},{id:'duck',n:'PLUSH DUCK',p:40}];
const GAMES=[{id:'fetch',n:'FETCH',d:'Tap A when the ball hits the zone'},{id:'simon',n:'MEMORY',d:'Repeat the pad pattern'},{id:'dash',n:'DASH',d:'▲▼ dodge rocks, grab hearts'}];
const TRICKS=[{id:'sit',n:'SIT'},{id:'twirl',n:'TWIRL'},{id:'dance',n:'DANCE'},{id:'lay',n:'LAY DOWN'},{id:'roll',n:'ROLL OVER'}];
const CARE=[{id:'cuddle',n:'CUDDLE',d:'Pats & belly rubs'},{id:'teeth',n:'BRUSH TEETH',d:'Scrub away plaque'},{id:'groom',n:"TARA SCISSOR HOUNDS",d:'Cecily trims the coat'}];
const ACTS={dog:['FEED','PLAY','WALK','TOYS','TRICKS','CARE','SLEEP'],cat:['FEED','PLAY','TOYS','CARE','SLEEP'],chicken:['FEED','PLAY','CUDDLE','SLEEP'],pig:['FEED','PLAY','CUDDLE','SLEEP']};
let ACTIONS=ACTS.dog;function careList(){return S.species==='cat'?CARE.slice(0,2):CARE}
const cv=document.getElementById('screen'),g=cv.getContext('2d');
const SAVE='pocketpal_v9';
const now=()=>Date.now(),clamp=v=>Math.max(0,Math.min(100,v)),rnd=a=>a[Math.floor(Math.random()*a.length)];
const STAGE_MAP={baby:'puppy',toddler:'youngster',teen:'teen',adult:'adult',old:'senior'};
let DB=loadDB();
function loadDB(){let d=null;try{d=JSON.parse(localStorage.getItem(SAVE))}catch(e){}
  if(d&&d.pets)return d;d={v:9,pets:{},lastId:null};
  try{const o=JSON.parse(localStorage.getItem('pocketpal_v7'));if(o&&o.pets){Object.values(o.pets).forEach(p=>{p.species=p.species||'dog';d.pets[p.id]=p});d.lastId=o.lastId;localStorage.setItem(SAVE,JSON.stringify(d));return d}}catch(e){}
  try{const o=JSON.parse(localStorage.getItem('pocketpal_v3'));if(o&&o.pets){Object.values(o.pets).forEach(p=>{const q=migrate(p);d.pets[q.id]=q});d.lastId=o.lastId}}catch(e){}
  try{localStorage.setItem(SAVE,JSON.stringify(d))}catch(e){}return d}
function migrate(p){p=Object.assign({},p);if(p.species&&p.species!=='dog')p.wasSpecies=p.species;p.species='dog';p.breed=p.breed||'lab';
  if(p.stage)p.stage=STAGE_MAP[p.stage]||p.stage;p.stageStart=now();p.xp=0;p.coat=20;p.plaque=10;p.last=now();return fix(p)}
function fix(s){s.species=SP[s.species]?s.species:'dog';if(s.species!=='dog')s.breed=s.species;s.tricks=s.tricks||{};TRICKS.forEach(t=>{if(s.tricks[t.id]==null)s.tricks[t.id]=0});s.best=s.best||{};
  s.toys=s.toys||['ball'];if(s.coins==null)s.coins=20;if(s.coat==null)s.coat=10;if(s.plaque==null)s.plaque=5;if(s.xp==null)s.xp=0;
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
function say(m,t=130){ui.msg=m;ui.msgT=t}
// ---- real-time care ----
function timeTick(){const n=now();if(!S.last){S.last=n;return}const hrs=Math.min(n-S.last,3*DAY)/HOUR;S.last=n;if(hrs<=0)return;
  if(S.sleep&&(new Date().getHours()>=7&&new Date().getHours()<20)&&hrs>8)S.sleep=false;
  const sen=S.stage==='senior'?1.15:1;S.hunger=clamp(S.hunger-RATE.hunger*hrs*(S.sleep?.4:1)*sen);
  let hd=RATE.happy*(S.sleep?.3:1);if(S.hunger<30)hd+=3;if(S.coat>=TUNE.matAt)hd+=6;if(S.plaque>=TUNE.plaqueBad)hd+=3;
  S.happy=clamp(S.happy-hd*hrs);if(S.species==='dog')S.coat=Math.min(100,S.coat+RATE.coat*hrs*(BREEDS[S.breed].curly?1.3:1));else S.coat=5;if(S.species==='dog'||S.species==='cat')S.plaque=Math.min(100,S.plaque+RATE.plaque*hrs);else S.plaque=0}
setInterval(()=>{if(S.stage&&!['title','list','species','breed','egg','map'].includes(S.scene)){timeTick();checkGrow();if(ui.anim%10===0)save(true)}},1000);
setInterval(()=>{if(S.stage)save(true)},30000);
function addXP(n){const d=new Date().toDateString();if(S.xpDay!==d){S.xpDay=d;S.xpToday=0}const a=Math.min(n,TUNE.xpPerDay-(S.xpToday||0));if(a>0){S.xp+=a;S.xpToday+=a}}
function growProg(){const r=GROW[S.stage];if(!r)return 1;return Math.min(1,(now()-S.stageStart)/DAY/r.days,S.xp/r.xp)}
function daysLeft(){const r=GROW[S.stage];if(!r)return 0;const a=r.days-(now()-S.stageStart)/DAY,b=(r.xp-S.xp)/TUNE.xpPerDay;return Math.max(0,Math.ceil(Math.max(a,b)))}
function checkGrow(){const r=GROW[S.stage];if(!r)return;
  if((now()-S.stageStart)/DAY>=r.days&&S.xp>=r.xp&&S.hunger>30&&S.happy>40){S.stage=STAGES[STAGES.indexOf(S.stage)+1];S.xp=0;S.stageStart=now();
    say(S.name+' is now '+(S.stage==='adult'?'an ':'a ')+stageName(S.stage,S.species)+'!',200);sparkle(30);save()}}
function sparkle(n,x=W/2,y=110){for(let i=0;i<n;i++)ui.fx.push({x:x+Math.random()*60-30,y,vx:Math.random()*3-1.5,vy:-Math.random()*3-.5,t:50,ch:'star'})}
function hearts(n,x=ui.dx,y=120){for(let j=0;j<n;j++)ui.fx.push({x:x-20+j*10,y,vx:Math.random()-.5,vy:-.8,t:50,ch:'heart'})}
function setPose(p,t){ui.pose=p;ui.poseT=t}
const PAUSE=['RESUME','FARM MAP','SAVE','MY PETS','NEW PET','HOME'];
function titleItems(){return petList().length?['CONTINUE','FARM MAP','MY PETS','NEW PET']:['NEW PET']}
function openMap(){if(S.id)save(true);ui.mapBack=S.id&&S.stage?S.id:null;S={scene:'map'};ui.msgT=0;owInit(ui.mapBack)}
const KEYS='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['DEL','SKIP','DONE']);
function newPet(){S={scene:'title'};ui.msgT=0;ui.modal={type:'name',name:'',k:0}}
function finishName(n){ui.modal=null;n=(n||'').trim().slice(0,8).toUpperCase()||'PIP';S={scene:'species',name:n};ui.sel=0}
function askConfirm(q,yes){ui.modal={type:'confirm',q,yes,k:1}}
function modalInput(k){const m=ui.modal;
  if(m.type==='confirm'){if(k==='left'||k==='right'||k==='up'||k==='down')m.k^=1;if(k==='b'){ui.modal=null}if(k==='a'||k==='start'){ui.modal=null;if(m.k===0)m.yes()}return}
  const C=7,n=KEYS.length;
  if(k==='left')m.k=(m.k+n-1)%n;if(k==='right')m.k=(m.k+1)%n;if(k==='up')m.k=(m.k-C+n)%n;if(k==='down')m.k=Math.min(n-1,m.k+C)%n;
  if(k==='b'){if(m.name)m.name=m.name.slice(0,-1);else{ui.modal=null;S={scene:'title'};ui.tsel=0}}
  if(k==='start')finishName(m.name);
  if(k==='a'){const c=KEYS[m.k];if(c==='DEL')m.name=m.name.slice(0,-1);else if(c==='SKIP')finishName('');else if(c==='DONE')finishName(m.name);else if(m.name.length<8){m.name+=c;if(m.name.length===8)m.k=n-1}}}
function drawModal(t){const m=ui.modal;R(0,0,W,H,'#2b244099');
  if(m.type==='confirm'){panel(24,62,W-48,92,'ARE YOU SURE?');const words=m.q.split(' ');let line='',y=88;words.forEach(w=>{if((line+w).length>26){txt(line,W/2,y,'#2b2440',10);y+=13;line=''}line+=w+' '});txt(line,W/2,y,'#2b2440',10);
    ['YES','NO'].forEach((l,i)=>{const x=W/2-62+i*66,on=m.k===i;RR(x,128,58,18,9,on?'#ff5a8b':'#fff',on?'#fff':'#5b4b8a');txt(l,x+29,141,on?'#fff':'#5b4b8a',10)});return}
  panel(12,14,W-24,H-26,'NAME YOUR PET');
  RR(40,28,W-80,24,8,'#efe6ff','#5b4b8a');const nm=m.name+(m.name.length<8&&t%40<20?'_':'');txt(nm||'',W/2,46,'#5b4b8a',15);if(!m.name)txt(t%40<20?'_':'',W/2,46,'#5b4b8a',15);
  txt(m.name.length+'/8',W-46,62,'#8a80a8',8,'right');
  const C=7,cw=26,ch=20,x0=(W-C*cw)/2+1,y0=66;
  KEYS.forEach((c,i)=>{const wide=i>=26,on=i===m.k;let x,y,w;
    if(wide){const j=i-26;w=52;x=W/2-84+j*58;y=y0+4*ch+2}else{x=x0+(i%C)*cw;y=y0+Math.floor(i/C)*ch;w=cw-4}
    RR(x,y,w,ch-4,6,on?'#ff5a8b':(wide?'#e6dcff':'#fff'),on?'#fff':'#5b4b8a55');txt(c,x+w/2,y+12,on?'#fff':'#5b4b8a',wide?9:10)});
  txt('✚ move  A pick  B delete  START done',W/2,H-16,'#8a80a8',8)}
function input(k){if(ui.modal)return modalInput(k);return input0(k)}
// ===== trick teaching =====
const CUES=['a','up','down','left','right'];
function startTeach(tr){S.scene='teach';ui.mg={tr,cue:null,wait:40,win:0,hits:0,miss:0,round:0,res:null,resT:0}}
function teachInput(k){const m=ui.mg;if(k==='b'){endTeach();return}
  if(!m.cue)return;if(k===m.cue){m.hits++;S.tricks[m.tr.id]=Math.min(TUNE.trickNeed,S.tricks[m.tr.id]+1);m.res='GOOD!';hearts(2);setPose(m.tr.id,50)}else{m.miss++;m.res='OOPS';}
  m.resT=40;m.cue=null;m.wait=50;save();
  if(S.tricks[m.tr.id]>=TUNE.trickNeed){S.happy=clamp(S.happy+15);addXP(3);sparkle(30);setPose(m.tr.id,120);say(`Learned ${m.tr.n}!`);S.scene='main';ui.mg=null;save()}}
function teachTick(){const m=ui.mg;if(m.resT>0)m.resT--;
  if(m.cue){m.win--;if(m.win<=0){m.cue=null;m.miss++;m.res='TOO SLOW';m.resT=40;m.wait=40}}
  else if(--m.wait<=0){m.round++;if(m.round>8){endTeach();return}m.cue=Math.random()<.4?'a':CUES[1+Math.floor(Math.random()*4)];m.win=Math.max(45,90-S.tricks[m.tr.id]*8)}}
function endTeach(){const m=ui.mg;S.scene='tricks';ui.mg=null;say(`Practice done: ${S.tricks[m.tr.id]}/${TUNE.trickNeed}`);save()}

// ===== mini-games =====
function startGame(id){S.scene='game';ui.mg={id,t:0,score:0,over:false,dur:id==='dash'?30*60:id==='fetch'?25*60:40*60};const m=ui.mg;
  if(id==='fetch'){m.ball=0;m.spd=1.4;m.zone=0.7+Math.random()*.2;m.state='fly';m.throws=0}
  if(id==='simon'){m.seq=[];m.pos=0;m.show=0;m.showT=0;m.lit=-1;m.litT=0;addSimon(m)}
  if(id==='dash'){m.lane=1;m.obs=[];m.spd=2;m.hit=0;m.dist=0}}
function addSimon(m){m.seq.push(Math.floor(Math.random()*4));m.show=0;m.showT=40;m.pos=0;m.mode='show'}
const PADS=['up','right','down','left'];
function gameInput(k){const m=ui.mg;
  if(m.over){if((k==='a'||k==='b')&&!(m.lock>0))endGame();return}
  if(k==='b'&&m.t>10){m.over=true;m.lock=25;m.state='done';m.resT=0;return}
  if(m.id==='fetch'&&k==='a'&&m.state==='fly'){const d=Math.abs(m.ball-m.zone);
    if(d<.06){m.score+=d<.025?3:2;m.res=d<.025?'PERFECT!':'NICE!';m.state='caught';setPose('happy',30)}else{m.res='MISS';m.state='miss'}m.resT=45;m.throws++}
  if(m.id==='simon'&&m.mode==='input'){const p=PADS.indexOf(k);if(p<0)return;m.lit=p;m.litT=12;
    if(p===m.seq[m.pos]){m.pos++;if(m.pos>=m.seq.length){m.score=m.seq.length;m.res='GREAT!';m.resT=40;m.mode='wait';m.waitT=45}}else{m.res='WRONG!';m.resT=60;m.over=true}}
  if(m.id==='dash'){if(k==='up')m.lane=Math.max(0,m.lane-1);if(k==='down')m.lane=Math.min(2,m.lane+1)}}
function gameTick(){const m=ui.mg;if(m.over){if(m.lock>0)m.lock--;return}m.t++;if(m.resT>0)m.resT--;if(m.t>=m.dur){m.over=true;return}
  if(m.id==='fetch'){if(m.state==='fly'){m.ball+=m.spd/100;if(m.ball>1.05){m.state='miss';m.res='MISSED';m.resT=40;m.throws++}}
    else if(m.resT<=0){m.state='fly';m.ball=0;m.zone=.45+Math.random()*.45;m.spd=1.3+m.throws*.12+Math.random()*.5}}
  if(m.id==='simon'){if(m.litT>0)m.litT--;
    if(m.mode==='show'){if(--m.showT<=0){if(m.show<m.seq.length){m.lit=m.seq[m.show];m.litT=Math.max(14,28-m.seq.length*2);m.show++;m.showT=m.litT+10}else{m.mode='input';m.lit=-1}}}
    if(m.mode==='wait'&&--m.waitT<=0)addSimon(m)}
  if(m.id==='dash'){m.dist+=m.spd;m.spd=2+m.t/600;if(m.hit>0)m.hit--;
    if(m.t%Math.max(22,50-Math.floor(m.t/120))===0){m.obs.push({x:W+10,lane:Math.floor(Math.random()*3),type:Math.random()<.35?'heart':'rock'})}
    m.obs.forEach(o=>{o.x-=m.spd;if(!o.done&&o.lane===m.lane&&o.x<60&&o.x>34){o.done=true;if(o.type==='heart'){m.score+=2;m.res='+2';m.resT=20}else if(m.hit<=0){m.score=Math.max(0,m.score-1);m.hit=40;m.res='OUCH';m.resT=30}}});
    m.obs=m.obs.filter(o=>o.x>-20&&!(o.done&&o.type==='heart'));m.score+=m.t%60===0?1:0}}
function endGame(){const m=ui.mg;const joy=Math.min(35,8+m.score*3);S.happy=clamp(S.happy+joy);S.hunger=clamp(S.hunger-6);addXP(1);
  const b=S.best[m.id]||0;if(m.score>b)S.best[m.id]=m.score;ui.mg=null;S.scene='main';setPose('happy',60);hearts(4);say(`Score ${m.score}! Joy +${joy}${m.score>b?' NEW BEST':''}`);checkGrow();save()}

// ===== input =====
function input0(k){
  const sc=S.scene;
  if(sc==='title'){const it=titleItems(),n=it.length;if(k==='up')ui.tsel=(ui.tsel+n-1)%n;if(k==='down')ui.tsel=(ui.tsel+1)%n;
    if(k==='a'||k==='start'){const c=it[ui.tsel];if(c==='FARM MAP')openMap();else if(c==='CONTINUE')loadPet(DB.lastId&&DB.pets[DB.lastId]?DB.lastId:petList()[0].id);else if(c==='MY PETS'){S={scene:'list'};ui.psel=0;ui.msgT=0}else newPet()}}
  else if(sc==='list'){const L=petList(),n=L.length+1;if(k==='up')ui.psel=(ui.psel+n-1)%n;if(k==='down')ui.psel=(ui.psel+1)%n;if(k==='b'){S={scene:'title'};ui.tsel=0;ui.msgT=0}
    if(k==='a'||k==='start'){if(ui.psel===L.length)newPet();else loadPet(L[ui.psel].id)}
    if(k==='select'&&L[ui.psel]){const id=L[ui.psel].id;askConfirm('Say goodbye to '+L[ui.psel].name+' forever? Other pets stay safe.',()=>{delete DB.pets[id];if(DB.lastId===id)DB.lastId=null;save(true);ui.psel=0})}}
  else if(sc==='pause'){const n=PAUSE.length;if(k==='up')ui.sel=(ui.sel+n-1)%n;if(k==='down')ui.sel=(ui.sel+1)%n;if(k==='b'||k==='start'){S.scene='main';return}
    if(k==='a'){const c=PAUSE[ui.sel];S.scene='main';if(c==='FARM MAP'){openMap();return}if(c==='SAVE'){save();say('Saved on this device!')}if(c==='MY PETS'){save(true);S={scene:'list'};ui.psel=0;ui.msgT=0}if(c==='NEW PET'){save(true);newPet()}if(c==='HOME'){save(true);S={scene:'title'};ui.tsel=0;ui.msgT=0}}}
  else if(sc==='species'){const n=SPECIES.length;if(k==='left')ui.sel=(ui.sel+n-1)%n;if(k==='right')ui.sel=(ui.sel+1)%n;
    if(k==='a'||k==='start'){const sp=SPECIES[ui.sel];if(sp.ok){if(sp.id==='dog'){S.scene='breed';ui.sel=0}else{S.species=sp.id;S.breed=sp.id;S.id='p'+now().toString(36)+Math.floor(Math.random()*1e4);S.created=now();S.scene='egg';fix(S);ui.hatch=0;save()}}else say(SPECIES[ui.sel].n+'S are coming soon!')}if(k==='b'){S={scene:'title'};ui.tsel=0}}
  else if(sc==='map')owInput(k);
  else if(sc==='breed'){const n=BKEYS.length;if(k==='left')ui.sel=(ui.sel+n-1)%n;if(k==='right')ui.sel=(ui.sel+1)%n;if(k==='b'){S.scene='species';ui.sel=0}
    if(k==='a'||k==='start'){S.species='dog';S.breed=BKEYS[ui.sel];syncActs();S.id='p'+now().toString(36)+Math.floor(Math.random()*1e4);S.created=now();S.scene='egg';fix(S);ui.hatch=0;save()}}
  else if(sc==='egg'){if(k==='a'){ui.hatch++;ui.shake=12;for(let i=0;i<4;i++)ui.fx.push({x:W/2+Math.random()*30-15,y:100,vx:Math.random()*2-1,vy:-Math.random()*2,t:25,ch:'shell'});
    save(true);if(ui.hatch>=TUNE.hatchTaps){Object.assign(S,{scene:'main',stage:'puppy',hunger:75,happy:80,xp:0,coat:5,plaque:0,stageStart:now(),born:now(),last:now(),sleep:false});ui.dx=110;syncActs();ui.menu=0;sparkle(30);say(S.species==='dog'?"It's a "+BREEDS[S.breed].n.toLowerCase()+' puppy!':"It's a "+SP[S.species].baby.toLowerCase()+'!',200);save()}}}
  else if(sc==='main'){
    if(S.sleep){if(k==='start'){S.scene='pause';ui.sel=0;return}if(k==='a'||k==='b'){S.sleep=false;say('Good morning!');save()}return}
    const n=ACTIONS.length;if(k==='left')ui.menu=(ui.menu+n-1)%n;if(k==='right')ui.menu=(ui.menu+1)%n;
    if(k==='a')openAct(ui.menu);if(k==='b'){if(ui.menu===0){openMap();return}ui.menu=0;openAct(0)}
    if(k==='select')askConfirm('Start '+S.name+' again as a new egg? Other pets stay saved.',()=>{Object.assign(S,{stage:undefined,xp:0,tricks:{},best:{},sleep:false});fix(S);S.scene='egg';ui.hatch=0;save()});
    if(k==='start'){S.scene='pause';ui.sel=0}}
  else if(sc==='food')gridIn(k,foods().length,()=>feed(foods()[ui.sel]));
  else if(sc==='toys')gridIn(k,TOYS.length,()=>toy(TOYS[ui.sel]));
  else if(sc==='games'){if(k==='up')ui.sel=(ui.sel+2)%3;if(k==='down')ui.sel=(ui.sel+1)%3;if(k==='b')S.scene='main';
    if(k==='a'){if(S.hunger<12){say('Too hungry to play!');S.scene='main';return}startGame(GAMES[ui.sel].id)}}
  else if(sc==='care'){const n=careList().length;if(k==='up')ui.sel=(ui.sel+n-1)%n;if(k==='down')ui.sel=(ui.sel+1)%n;if(k==='b')S.scene='main';if(k==='a')careAct(careList()[ui.sel].id)}
  else if(sc==='game')gameInput(k);
  else if(sc==='walk')walkInput(k);
  else if(sc==='groom')groomInput(k);
  else if(sc==='teeth')teethInput(k);
  else if(sc==='tricks'){const n=TRICKS.length;if(k==='up')ui.sel=(ui.sel+n-1)%n;if(k==='down')ui.sel=(ui.sel+1)%n;if(k==='b')S.scene='main';
    const tr=TRICKS[ui.sel];if(k==='a'){if(S.tricks[tr.id]>=TUNE.trickNeed)perform(tr);else startTeach(tr)}if(k==='right'&&S.tricks[tr.id]<TUNE.trickNeed)startTeach(tr)}
  else if(sc==='teach')teachInput(k);
}
function gridIn(k,n,go){if(k==='left')ui.sel=(ui.sel+n-1)%n;if(k==='right')ui.sel=(ui.sel+1)%n;if(k==='up'&&ui.sel>=4)ui.sel-=4;if(k==='down'&&ui.sel+4<n)ui.sel+=4;if(k==='b')S.scene='main';if(k==='a')go()}
function openAct(i){const a=ACTIONS[i];ui.sel=0;
  if(a==='FEED')S.scene='food';if(a==='PLAY')S.scene='games';if(a==='TRICKS')S.scene='tricks';if(a==='TOYS')S.scene='toys';if(a==='CARE')S.scene='care';
  if(a==='WALK'){if(S.hunger<10){say('Too hungry for a walk — feed first!');return}startWalk()}
  if(a==='CUDDLE'){careAct('cuddle');return}if(a==='SLEEP'){S.sleep=true;say('Zzz... (A to wake)')}save(true)}
function careAct(id){
  if(id==='cuddle'){S.scene='main';S.happy=clamp(S.happy+TUNE.petAmt);addXP(1);hearts(5);setPose('happy',70);say(rnd({dog:['*wag wag*','*licks your face*','Belly rubs!','Love you!'],cat:['*purrrr*','*head boop*','Mrrow!'],chicken:['*cluck cluck*','*happy bok*','*fluffs feathers*'],pig:['*oink oink!*','*happy snort*','Belly scratch!']}[S.species]||['Love you!']));save()}
  if(id==='teeth'){S.scene='teeth';ui.mg={bx:0,last:null,scrub:0,done:false,t:0}}
  if(id==='groom'){S.scene='groom';ui.mg={ph:S.coat<15?'short':'intro',snips:0,t:0,start:S.coat,mat:S.coat>=TUNE.matAt,brush:0,last:null}}}
function feed(f){if(S.hunger>=97&&!f.plq){say('Too full!');return}
  S.hunger=clamp(S.hunger+f.v);S.happy=clamp(S.happy+(f.joy||0));if(f.plq)S.plaque=clamp(S.plaque+f.plq);addXP(2);
  S.scene='main';setPose('eat',80);ui.eatFood=f.id;say(f.n+' +'+f.v+(f.plq<0?' • cleaner teeth':''));if(f.joy>5)hearts(3);checkGrow();save()}
function toy(t){if(!S.toys.includes(t.id)){if(S.coins<t.p){say('Need '+t.p+' coins — play games & walk!');return}
    S.coins-=t.p;S.toys.push(t.id);sparkle(16);say('Got a '+t.n+'!');save();return}
  S.scene='main';S.happy=clamp(S.happy+12);addXP(2);ui.idle={k:'play',t:300,toy:t.id};ui.poseT=0;hearts(3);say(S.name+' loves the '+t.n.toLowerCase()+'!');save()}
function perform(tr){S.scene='main';setPose(tr.id,120);S.happy=clamp(S.happy+10);S.hunger=clamp(S.hunger-2);addXP(1);sparkle(14);say(S.name+' does '+tr.n+'!');checkGrow();save()}
function endGame(){const m=ui.mg;const joy=Math.min(30,8+m.score*3),coins=Math.min(15,2+m.score);S.happy=clamp(S.happy+joy);S.hunger=clamp(S.hunger-5);S.coins+=coins;addXP(2);
  const b=S.best[m.id]||0;if(m.score>b)S.best[m.id]=m.score;ui.mg=null;S.scene='main';setPose('happy',60);hearts(4);say('Joy +'+joy+'  ● +'+coins+(m.score>b?' NEW BEST':''));checkGrow();save()}
// ---- idle life ----
function pickIdle(){const I=ui.idle,sad=S.happy<35||S.coat>=TUNE.matAt||S.plaque>=TUNE.plaqueBad||S.hunger<25;
  const sp=S.species;let o=sad?['sit','lay','walk','sit','nap']:['walk','walk','hop','sit','sniff','nap','zoom','roll','walk'].concat(S.toys.length?['play','play','play']:[]);
  if(!sad&&sp==='cat')o=['walk','sit','nap','nap','hop','sniff','play','walk'];if(!sad&&sp==='chicken')o=['walk','walk','sniff','sniff','hop','sit','zoom'];if(!sad&&sp==='pig')o=['walk','sniff','sniff','lay','nap','roll','walk'];
  I.k=rnd(o);I.t={walk:360,zoom:160,hop:100,sit:200,sniff:150,nap:480,lay:300,roll:60,play:300}[I.k];
  if(I.k==='walk')I.tx=50+Math.random()*120;if(I.k==='zoom')I.tx=ui.dx<110?170:50;if(I.k==='play')I.toy=rnd(S.toys)}
function idleTick(){const I=ui.idle;if(--I.t<=0)pickIdle();
  if(I.k==='walk'||I.k==='zoom'){const sp=I.k==='zoom'?1.7:.5;if(Math.abs(I.tx-ui.dx)<2){I.k='sit';I.t=120}else{ui.dir=I.tx>ui.dx?1:-1;ui.dx+=ui.dir*sp}}
  if(I.k==='play'&&ui.anim%140===0){ui.dir*=-1}if(I.k==='play'){ui.dx=Math.max(50,Math.min(170,ui.dx+ui.dir*.6))}}
function idlePose(){const k=ui.idle.k;return{walk:'walk',zoom:'trot',hop:'hop',sit:'sit',sniff:'sniff',nap:'sleep',lay:'lay',roll:'roll',play:'play'}[k]||'idle'}
// ---- walk ----
function startWalk(){const evs=[];let x=220;const ty=['sniff','lamp','poo','sniff','lamp','sniff'];ty.sort(()=>Math.random()-.5);
  ty.forEach(t=>{evs.push({x,t});x+=170+Math.random()*90});
  S.scene='walk';ui.mg={x:0,len:x+80,evs,st:'walk',stT:0,boost:0,sn:0,bag:0,left:0,poos:[],done:false}}
function walkInput(k){const m=ui.mg;if(m.done){if(k==='a'||k==='b')endWalk();return}
  if(k==='b'){m.done=true;return}
  if(m.st==='walk'&&(k==='right'||k==='a'))m.boost=50;
  if(m.st==='sniffQ'){if(k==='a'){m.st='sniff';m.stT=110;m.sn++}if(k==='right'){m.st='walk';m.cur.d=true}}
  if(m.st==='bagQ'){if(k==='a'){m.st='bagging';m.stT=50;m.bag++;m.cur.bagged=true}if(k==='right'){m.left++;m.cur.d=true;m.st='walk';say('Oops! Always bag the poo!')}}}
function walkTick(){const m=ui.mg;if(m.done)return;if(m.stT>0)m.stT--;
  if(m.st==='walk'){m.x+=m.boost>0?1.4:.7;if(m.boost>0)m.boost--;
    const e=m.evs.find(e=>!e.d&&e.x-m.x<4);if(e){m.cur=e;if(e.t==='sniff')m.st='sniffQ';if(e.t==='lamp'){m.st='wee';m.stT=90}if(e.t==='poo'){m.st='poo';m.stT=80}}
    if(m.x>=m.len)m.done=true}
  else if(m.st==='sniff'&&!m.stT){m.cur.d=true;m.st='walk';hearts(2,70,130)}
  else if(m.st==='wee'&&!m.stT){m.cur.d=true;m.st='walk';say('Wee on the lamp post!',70)}
  else if(m.st==='poo'&&!m.stT){m.cur.px=m.x+60;m.st='bagQ'}
  else if(m.st==='bagging'&&!m.stT){m.cur.d=true;m.st='walk';say('Good owner! Bagged & binned',80);sparkle(8,80,150)}}
function endWalk(){const m=ui.mg,joy=Math.min(35,10+m.sn*4+Math.round(m.x/m.len*10)),coins=3+m.bag*2;S.happy=clamp(S.happy+joy);S.hunger=clamp(S.hunger-6);S.coins+=coins;addXP(3);S.lastWalk=now();
  ui.mg=null;S.scene='main';setPose('happy',60);hearts(4);say('Lovely walk! Joy +'+joy+'  ● +'+coins);checkGrow();save()}
// ---- teeth ----
function teethInput(k){const m=ui.mg;if(m.done){if(k==='a'||k==='b'){S.scene='main';ui.mg=null;setPose('happy',60);save()}return}
  if(k==='b'){S.scene='main';ui.mg=null;save();return}
  if((k==='left'||k==='right')&&k!==m.last){m.last=k;m.bx=k==='left'?-1:1;S.plaque=Math.max(0,S.plaque-5);m.scrub++;for(let i=0;i<2;i++)ui.fx.push({x:W/2+m.bx*30,y:120,vx:Math.random()*2-1,vy:-Math.random()*1.5,t:30,ch:'bubble'});
    if(S.plaque<=0){m.done=true;S.happy=clamp(S.happy+10);addXP(2);sparkle(20,W/2,110);save()}}}
// ---- groomer ----
function groomInput(k){const m=ui.mg;
  if(m.ph==='short'||m.ph==='done'){if(k==='a'||k==='b'){if(m.ph==='done'){setPose('happy',80);hearts(5)}S.scene='main';ui.mg=null;save()}return}
  if(k==='b'){S.scene='main';ui.mg=null;save();return}
  if(m.ph==='intro'&&k==='a'){m.ph=m.mat?'brush':'cut';return}
  if(m.ph==='brush'&&(k==='left'||k==='right')&&k!==m.last){m.last=k;m.brush++;if(m.brush>=12){m.ph='cut';S.coat=Math.min(S.coat,TUNE.matAt-1)}}
  if(m.ph==='cut'&&k==='a'){m.snips++;S.coat=Math.max(5,S.coat-12);for(let i=0;i<5;i++)ui.fx.push({x:150+Math.random()*40-20,y:110+Math.random()*20,vx:Math.random()*2-1,vy:Math.random(),t:45,ch:'hair'});
    if(S.coat<=5){m.ph='done';S.happy=clamp(S.happy+(m.mat?30:15));addXP(3);S.lastGroom=now();sparkle(24,150,110)}}}
const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
function E(x,y,rx,ry,c,rot=0){g.fillStyle=c;g.beginPath();g.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot,0,7);g.fill()}
function RR(x,y,w,h,r,c,stroke){g.beginPath();g.roundRect(x,y,w,h,r);if(c){g.fillStyle=c;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=1.5;g.stroke()}}
function txt(t,x,y,c='#2b2440',s=10,al='center'){g.fillStyle=c;g.font=`800 ${s}px system-ui,sans-serif`;g.textAlign=al;g.fillText(t,x,y)}
function otxt(t,x,y,c,s,al='center'){g.font=`800 ${s}px system-ui,sans-serif`;g.textAlign=al;g.lineWidth=3;g.strokeStyle='#2b2440';g.strokeText(t,x,y);g.fillStyle=c;g.fillText(t,x,y)}
function heartS(x,y,s=1,c='#ff4f8b'){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=c;g.beginPath();g.moveTo(0,3);g.bezierCurveTo(-7,-3,-3,-8,0,-4);g.bezierCurveTo(3,-8,7,-3,0,3);g.fill();g.restore()}
function star(x,y,r,c){g.fillStyle=c;g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.fill()}
function mix(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
// ===== Overworld (v15) — walkable top-down farm =====
const TS=16,MW=30,MH=24,HSLOT=[[3,3],[9,3],[15,3],[3,9],[9,9],[15,9]],LOCKS=[[22,3,'COW BARN'],[22,9,'STABLE']];
const OWBASE=(()=>{const m=[];for(let y=0;y<MH;y++){const r=[];for(let x=0;x<MW;x++){let c='g';
  if(x===0||y===0||x===MW-1||y===MH-1)c='f';
  else if(y===7||y===13||x===13||x===27&&y<20)c='p';
  if((x===2&&y>15&&y<22))c='t';if(y===MH-2&&x>1&&x<12&&x%3===0)c='t';
  r.push(c)}m.push(r)}
  for(let y=16;y<21;y++)for(let x=3;x<10;x++)if((x-6)**2/9+(y-18)**2/4<=1.1)m[y][x]='w';
  const F=(x0,y0,x1,y1,ch,gx)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)m[y][x]=(y===y0||y===y1||x===x0||x===x1)?(x===gx&&y===y0?'g':'f'):ch};
  F(15,15,20,21,'C',17);F(21,15,26,21,'W',23);F(18,2,21,6,'C',-1);
  [[6,1],[12,1],[20,1],[25,1],[28,5],[28,10],[19,15],[11,15],[1,14]].forEach(([x,y])=>{if(m[y])m[y][x]='t'});
  m[7][0]='p';m[13][MW-1]='f';m[12][13]='s';return m})();
function owSolid(x,y){if(x<0||y<0||x>=MW||y>=MH)return true;const c=OWBASE[y][x];if(c==='f'||c==='t'||c==='w'||c==='s'||c==='C'||c==='W')return true;
  for(const [hx,hy] of HSLOT.concat(LOCKS))if(x>=hx&&x<hx+3&&y>=hy&&y<hy+2)return true;return false}
function owThing(x,y){const L=petList().slice(0,6);for(let i=0;i<6;i++){const [hx,hy]=HSLOT[i];if(y===hy+1&&x===hx+1)return L[i]?{pet:L[i]}:{empty:true};if(x>=hx&&x<hx+3&&y>=hy&&y<hy+2)return{wall:1}}
  for(const [hx,hy,n] of LOCKS)if(x>=hx&&x<hx+3&&y>=hy&&y<hy+2)return{lock:n};if(OWBASE[y]&&OWBASE[y][x]==='s')return{sign:1};if(OWBASE[y]&&'cCW'.includes(OWBASE[y][x]))return{crop:OWBASE[y][x]};if(OWBASE[y]&&OWBASE[y][x]==='w')return{water:1};return null}
const held={};const IMG={};let ART_REV=0;const ART_DEV=/[?&]dev=1/.test(location.search)||(()=>{try{return localStorage.PETFARM_DEV==='1'}catch(e){return false}})()||/^(localhost|127\.|192\.168\.|10\.)/.test(location.hostname);
function loadArt(force){return fetch('assets/world/manifest.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(m=>{if(!force&&m.rev===ART_REV)return;ART_REV=m.rev;
  for(const k in m.images){const im=new Image();im.onload=()=>{IMG[k]=im};im.src='assets/world/'+m.images[k]+'?r='+m.rev+(ART_DEV?'.'+Date.now():'')}}).catch(()=>{})}
loadArt(true);if(ART_DEV)setInterval(()=>loadArt(false),2000);
const DV={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function owAt(id){const i=petList().slice(0,6).findIndex(p=>p.id===id);if(i<0)return null;const [hx,hy]=HSLOT[i];return{x:hx+1,y:hy+2,dir:'down'}}
function owInit(back){const a=back&&owAt(back);if(a){ui.ow=Object.assign({px:a.x*TS,py:a.y*TS,step:0},a)}else if(!ui.ow)ui.ow={x:13,y:15,dir:'up',px:13*TS,py:15*TS,step:0};ui.ow.mv=null}
function owTry(d){const o=ui.ow;if(o.mv)return;o.dir=d;const [dx,dy]=DV[d],nx=o.x+dx,ny=o.y+dy;if(!owSolid(nx,ny)){o.mv={tx:nx,ty:ny,t:0};o.step++}}
function owUpdate(){const o=ui.ow;if(!o)return;if(o.mv){o.mv.t+=1/8;const k=Math.min(1,o.mv.t);o.px=(o.x+(o.mv.tx-o.x)*k)*TS;o.py=(o.y+(o.mv.ty-o.y)*k)*TS;
    if(k>=1){o.x=o.mv.tx;o.y=o.mv.ty;o.mv=null}}
  if(!o.mv&&!ui.modal){for(const d of ['up','down','left','right'])if(held[d]){owTry(d);break}}}
function owInput(k){const o=ui.ow;if(k==='select'){loadArt(true);say('Art reloaded');return}if(DV[k]){if(!o.mv)owTry(k);return}
  if(k==='a'&&!o.mv){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);if(!th)return;
    if(th.pet){loadPet(th.pet.id);return}if(th.empty){say('An empty plot. Adopt a pet!');newPet();return}
    if(th.lock)say(th.lock+' — coming soon!');else if(th.sign)say('NORTH: Homes  EAST: Barns  S: Field');else if(th.crop)say((th.crop==='C'?'Corn':th.crop==='W'?'Wheat':'Crops')+' — harvesting coming soon!');else if(th.water)say('A shiny pond.');else if(th.wall)say('Go round to the door!')}
  if(k==='b'){if(ui.mapBack&&DB.pets[ui.mapBack])loadPet(ui.mapBack);else{S={scene:'title'};ui.tsel=0}}
  if(k==='start'){S={scene:'title'};ui.tsel=0}}
function farmer(x,y,dir,step,moving){g.save();g.translate(Math.round(x),Math.round(y));const b=moving&&step%2?1:0;E(8,15,5,2,'#0003');
  R(4,9,8,5,'#3a6ad8');R(4+(b?1:0),13,3,3,'#5a3a20');R(9-(b?1:0),13,3,3,'#5a3a20');R(3,9,2,4,'#ffd0a0');R(11,9,2,4,'#ffd0a0');
  R(4,2,8,7,'#ffd0a0');R(3,1,10,3,'#e8402a');R(3,3,dir==='up'?10:2,2,'#e8402a');if(dir==='left')R(1,3,4,1,'#c83020');if(dir==='right')R(11,3,4,1,'#c83020');if(dir==='down')R(3,4,10,1,'#c83020');
  if(dir!=='up'){const ex=dir==='left'?-1:dir==='right'?1:0;R(6+ex,6,1,1,'#222');R(9+ex,6,1,1,'#222')}else R(4,4,8,5,'#7a4a20');g.restore()}
function drawOverworld(t){owUpdate();const o=ui.ow;const cx=Math.max(0,Math.min(MW*TS-W,o.px+8-W/2)),cy=Math.max(0,Math.min(MH*TS-H,o.py+8-H/2+10));
  g.save();g.translate(-Math.round(cx),-Math.round(cy));
  g.imageSmoothingEnabled=false;const ok=n=>IMG[n]&&IMG[n].naturalWidth;
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const c=OWBASE[y][x],X=x*TS,Y=y*TS;
    if(ok('grass'))g.drawImage(IMG.grass,X,Y);else R(X,Y,TS,TS,'#78c858');
    const n={C:'corn',W:'wheat',p:'path',w:'water',c:'field',f:'fence',t:'tree',s:'sign'}[c];
    if(n==='water'&&ok('water'))g.drawImage(IMG.water,X+((t>>4)%2?0:0),Y);else if(n&&ok(n))g.drawImage(IMG[n],X,Y);else if(n)R(X,Y,TS,TS,{path:'#e8d8a0',water:'#4888e8',field:'#986838',fence:'#b07038',corn:'#d0b040',wheat:'#e8c860',tree:'#307030',sign:'#c89a60'}[n])}
  const L=petList().slice(0,6);
  HSLOT.forEach(([hx,hy],i)=>{const p=L[i],X=hx*TS+24,Y=hy*TS+32;if(p){const sp=spOf(p);house(sp,X,Y,.66,false,p.name);R(X-4,Y-1,8,2,'#5a3a20')}
    else{g.fillStyle='#0001';g.fillRect(hx*TS+2,hy*TS+2,44,28);txt('EMPTY',X,Y-12,'#ffffffaa',6)}});
  LOCKS.forEach(([hx,hy,n])=>lockedHouse(n,hx*TS+24,hy*TS+30,.66));
  if(ok('farmer')){const row={down:0,up:1,left:2,right:3}[o.dir],fr=o.mv&&o.step%2?1:0;g.drawImage(IMG.farmer,fr*16,row*16,16,16,Math.round(o.px),Math.round(o.py)-4-(o.mv&&o.mv.t>.3&&o.mv.t<.7?1:0),16,16)}else farmer(o.px,o.py-3,o.dir,o.step,!!o.mv);g.restore();
  R(0,0,W,16,'#2b2440cc');txt('PET FARM',6,12,'#fff',9,'left');txt('● '+petList().reduce((a,p)=>a+(p.coins||0),0),W-6,12,'#ffd84a',8,'right');
  const [dx,dy]=DV[o.dir],th=!o.mv&&owThing(o.x+dx,o.y+dy);
  if(th&&(th.pet||th.empty)){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(th.pet?'A: visit '+th.pet.name:'A: adopt a pet here',W/2,H-19,'#2b2440',8)}
  else txt('✚ walk  A use  B back',W/2,H-4,'#fff',7)}
// ===== controls =====
document.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;
  b.addEventListener('pointerdown',e=>{e.preventDefault();b.classList.add('pressed');held[k]=1;input(k);navigator.vibrate&&navigator.vibrate(8)});
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>{b.classList.remove('pressed');held[k]=0}));
  b.addEventListener('contextmenu',e=>e.preventDefault())});
document.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
document.addEventListener('dblclick',e=>e.preventDefault());
// ===== responsive canvas (layout v3) =====
const LAND=matchMedia('(orientation: landscape)');
function fit(){const box=document.getElementById('screenwrap').getBoundingClientRect();const sc=Math.max(.5,Math.min((box.width-12)/W,(box.height-12)/H));
  const cw=Math.floor(W*sc),ch=Math.floor(H*sc),dpr=Math.min(3,window.devicePixelRatio||1);cv.style.width=cw+'px';cv.style.height=ch+'px';
  cv.width=Math.round(cw*dpr);cv.height=Math.round(ch*dpr);g.setTransform(cv.width/W,0,0,cv.height/H,0,0);document.body.dataset.layout=LAND.matches?'landscape':'portrait'}
addEventListener('resize',fit);LAND.addEventListener?LAND.addEventListener('change',()=>setTimeout(fit,60)):LAND.addListener(fit);
if(window.visualViewport)visualViewport.addEventListener('resize',fit);
addEventListener('pagehide',()=>save(true));document.addEventListener('visibilitychange',()=>{if(document.hidden)save(true)});
const KM={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',z:'b',x:'a',Enter:'start',Shift:'select',Escape:'start',Backspace:'select'};
addEventListener('keyup',e=>{const k=KM[e.key]||KM[(e.key||'').toLowerCase()];if(k)held[k]=0});addEventListener('blur',()=>{for(const k in held)held[k]=0});
addEventListener('keydown',e=>{if(ui.modal&&ui.modal.type==='name'&&!e.ctrlKey&&!e.metaKey){const m=ui.modal;if(/^[a-zA-Z]$/.test(e.key)){e.preventDefault();if(m.name.length<8)m.name+=e.key.toUpperCase();return}if(e.key==='Backspace'){e.preventDefault();m.name=m.name.slice(0,-1);return}if(e.key==='Enter'){e.preventDefault();finishName(m.name);return}if(e.key==='Escape'){e.preventDefault();ui.modal=null;S={scene:'title'};ui.tsel=0;return}}const k=KM[e.key]||KM[e.key.toLowerCase()];if(!k)return;e.preventDefault();held[k]=1;if(e.repeat)return;if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();input(k)},{capture:true});
document.addEventListener('gesturestart',e=>e.preventDefault());
// ===== dog art =====
function dog(cx,cy,bid,stage,o={}){if(BREEDS[bid]&&BREEDS[bid].sp)return critter(cx,cy,BREEDS[bid].sp,stage,o);
  const B=BREEDS[bid]||BREEDS.lab,T=ui.anim,pose=o.pose||'idle',coat=o.coat||0,mood=o.mood||'ok',plq=o.plaque||0,pt=o.pt||0;
  let c=B.c,d=B.d,l=B.l;const sen=stage==='senior';
  const sz={puppy:.62,youngster:.75,teen:.88,adult:1,senior:1}[stage]||1,hk={puppy:1.38,youngster:1.22,teen:1.1,adult:1,senior:1}[stage]||1;
  const lay=pose==='lay'||pose==='sleep'||pose==='roll',sit=pose==='sit'||pose==='poo';
  const bl=B.bl,bh=B.bh,L=B.leg*(stage==='puppy'?.85:1),hr=B.hr*hk;
  const fur=coat/100*B.fur*6,mat=coat>=TUNE.matAt,furC=mat?mix(c,'#6a5a48',.35):c;
  g.save();g.translate(cx,cy);E(0,1,bl*sz*1.35,4*sz,'#0003');
  let dy=0,rot=0,sx=1;
  if(pose==='hop'||pose==='happy')dy=-Math.abs(Math.sin(T/6))*14;
  if(pose==='dance'){rot=Math.sin(T/6)*.18;dy=-Math.abs(Math.sin(T/6))*8}
  if(pose==='twirl')sx=Math.cos(T/5);
  if(pose==='trot')dy=-Math.abs(Math.sin(T/3))*3;
  if(pose==='walk')dy=-Math.abs(Math.sin(T/6))*1.5;
  g.translate(0,dy);g.scale(sz*sx*(o.dir||1),sz);
  const walk=pose==='walk'||pose==='trot'||pose==='play',sw=walk?Math.sin(T/(pose==='trot'?3:6))*.45:0;
  let R0,F0;const st=-(L+bh*.7);
  if(sit){R0=[-bl*.45,-bh*.9];F0=[bl*.45,-(L+bh*.95)]}else if(lay){R0=[-bl*.6,-bh*.85];F0=[bl*.6,-bh*.85]}
  else if(pose==='play'||pose==='sniff'){R0=[-bl*.6,st-2];F0=[bl*.6,st+L*.35]}else{R0=[-bl*.6,st];F0=[bl*.6,st]}
  if(pose==='roll'){const p=(pt%60)/60;g.translate(0,-bh);g.rotate(p*Math.PI*2);g.translate(0,bh)}
  if(rot)g.rotate(rot);
  const mx=(R0[0]+F0[0])/2,my=(R0[1]+F0[1])/2,ang=Math.atan2(F0[1]-R0[1],F0[0]-R0[0]),rx=Math.hypot(F0[0]-R0[0],F0[1]-R0[1])/2+bh*.75;
  const wag=Math.sin(T/(mood==='happy'||pose==='play'?2.2:7))*(mood==='sad'?.12:1);
  const paw=mix(d,'#000000',.15),legC=B.white?l:d,legFar=mix(legC,'#000000',.18);
  function leg(x,y,a,col,len){g.save();g.translate(x,y);g.rotate(a);RR(-3.2,-2,6.4,len+2,3.2,col);E(1.5,len,4.6,2.8,B.white?mix(l,'#000000',.08):paw);g.restore()}
  // far legs
  if(!lay){const fy=F0[1]+bh*.3;leg(F0[0]-3,fy,-sw,legFar,-fy);if(!sit){const ry=R0[1]+bh*.3;leg(R0[0]-3,ry,sw,legFar,-ry)}}
  // tail
  tailDraw(R0[0]-bh*.5,R0[1]-bh*.35,B,sit?c:(B.saddle?d:c),wag,sit);
  // body + coat
  if(fur>1){const n=14;for(let i=0;i<n;i++){const th=i/n*Math.PI*2,px=Math.cos(th)*rx,py=Math.sin(th)*bh;
      const xx=mx+px*Math.cos(ang)-py*Math.sin(ang),yy=my+px*Math.sin(ang)+py*Math.cos(ang),ex=Math.cos(th)*fur*.5,ey=Math.sin(th)*fur*.6+(py>0?fur*.5:0);
      if(B.curly)E(xx+ex,yy+ey,2+fur*.45,2+fur*.45,furC);else E(xx+ex,yy+ey,1.6+fur*.3,2+fur*.55,furC,th)}}
  E(mx,my,rx,bh,c,ang);
  if(B.saddle)E(mx-2,my-bh*.35,rx*.72,bh*.6,d,ang);
  if(B.white)E(mx+3,my+bh*.45,rx*.72,bh*.45,l,ang);
  if(B.mask)E(mx+bh*.2,my+bh*.4,rx*.5,bh*.35,mix(c,'#ffffff',.3),ang);
  if(mat)[[-.5,-.6],[.1,-.85],[.55,-.4],[-.2,.6],[.4,.55]].forEach(([a,b2],i)=>{const xx=mx+a*rx,yy=my+b2*bh;E(xx,yy,3.4,3,'#6a5236');g.strokeStyle='#3a2a1a';g.lineWidth=.8;g.beginPath();g.arc(xx,yy,2,i,i+4);g.stroke()});
  // near legs
  if(lay){E(F0[0]+bh*.5,-3,8,3.2,legC);E(F0[0]+bh*.2,-2,8,3,mix(legC,'#000000',.05));E(R0[0]+2,-4,bh*.85,bh*.6,c);E(R0[0]+bh*.6,-2,6,2.6,legC)}
  else if(sit){const fy=F0[1]+bh*.3;leg(F0[0]+2,fy,0,legC,-fy);E(R0[0],R0[1]+2,bh*.85,bh*.75,c);E(R0[0]+bh*.6,-2.5,6,3,B.white?l:paw)}
  else{const fy=F0[1]+bh*.3,ry=R0[1]+bh*.3;leg(F0[0]+2,fy,sw,legC,-fy);leg(R0[0]+2,ry,pose==='wee'?-1.2:-sw,legC,-ry)}
  // head
  let hx=F0[0]+bl*.35,hy=F0[1]-bh*.85-hr*.55;
  if(lay){hx=F0[0]+bl*.45;hy=-hr*.9-bh*.4}if(pose==='sleep'){hx=F0[0]+bl*.55;hy=-hr*.75}
  if(pose==='eat'||pose==='sniff'||pose==='play'){hx=F0[0]+bl*.5;hy=F0[1]+(pose==='eat'?Math.abs(Math.sin(T/5))*4:pose==='sniff'?Math.sin(T/4)*2:0)}
  g.strokeStyle=c;g.lineCap='round';g.lineWidth=hr*1.1;g.beginPath();g.moveTo(F0[0],F0[1]-bh*.2);g.lineTo(hx-hr*.3,hy+hr*.3);g.stroke();
  // collar
  g.strokeStyle='#e8405a';g.lineWidth=3;g.beginPath();const cxp=(F0[0]+hx)/2+hr*.1,cyp=(F0[1]+hy)/2+hr*.15;g.moveTo(cxp-hr*.5,cyp-hr*.35);g.lineTo(cxp+hr*.2,cyp+hr*.45);g.stroke();E(cxp+hr*.15,cyp+hr*.65,1.8,1.8,'#ffd84a');
  g.save();g.translate(hx,hy);
  const ec=B.earC||d,sl=B.sn*(stage==='puppy'?.6:stage==='youngster'?.8:1);
  if(B.ear==='pointy'||B.ear==='semi'||B.ear==='bat'){const big=B.ear==='bat'?1.25:B.ear==='semi'?.9:1.1;
    g.fillStyle=B.ear==='bat'?c:ec==='#3e4452'?c:c;g.beginPath();g.moveTo(-hr*.7,-hr*.45);g.lineTo(-hr*.25,-hr*(1+big*.7));g.lineTo(hr*.2,-hr*.6);g.fill();
    g.fillStyle='#f2a8b8';g.beginPath();g.moveTo(-hr*.5,-hr*.5);g.lineTo(-hr*.25,-hr*(.9+big*.6));g.lineTo(hr*.05,-hr*.62);g.fill();
    if(B.ear==='semi')E(-hr*.12,-hr*1.45,hr*.3,hr*.18,ec,.5)}
  if(B.ear==='pom')E(0,-hr*.85,hr*.65*(1+coat/200),hr*.45*(1+coat/200),l);
  E(0,0,hr,hr*.92,c);
  if(B.white&&bid==='husky'){E(hr*.25,hr*.35,hr*.75,hr*.5,l);E(hr*.35,-hr*.45,2.2,1.5,l)}
  if(B.white&&bid!=='husky')E(hr*.35,-hr*.25,hr*.16,hr*.6,l,-.7);
  const muz=B.mask?d:B.white?l:mix(c,'#ffffff',.25);
  E(hr*.6+sl*.45,hr*.32,sl*.6+3.5,hr*.42,muz);if(sen)E(hr*.6+sl*.45,hr*.32,sl*.6+3.5,hr*.42,'#d8d8d8aa');
  E(hr*.62+sl,hr*.12,2.8,2.3,'#1e1818');E(hr*.62+sl-.8,hr*.02,1,.7,'#ffffff88');
  // mouth / teeth / tongue
  const open=(mood==='happy'||pose==='happy'||pose==='play'||pose==='smile'||pose==='trot'||pose==='dance')&&pose!=='sleep',eat=pose==='eat'&&T%20<10;
  const mx2=hr*.5+sl*.5,my2=hr*.62;
  if(open||eat){E(mx2,my2,sl*.45+2,2.6,'#6a2030');const tc=mix('#ffffff','#c9a23a',Math.min(1,plq/90));R(mx2-sl*.35,my2-2.4,sl*.7+1,1.6,tc);if(!eat)E(mx2+1,my2+2.4,2.6,3,'#ff7d9a')}
  else{g.strokeStyle='#2b2020';g.lineWidth=1;g.beginPath();if(mood==='sad')g.arc(mx2,my2+2.5,2.5,Math.PI+.5,-.5);else{g.moveTo(mx2-sl*.4,my2);g.lineTo(mx2+sl*.4,my2-.6)}g.stroke()}
  // eye
  const ex=hr*.25,ey=-hr*.15,blink=ui.anim%170<6||pose==='sleep';
  if(blink){g.strokeStyle='#2b2020';g.lineWidth=1.4;g.beginPath();g.arc(ex,ey,2.4,.2,Math.PI-.2);g.stroke()}
  else if(pose==='happy'){g.strokeStyle='#2b2020';g.lineWidth=1.5;g.beginPath();g.arc(ex,ey+1.5,2.4,Math.PI+.3,-.3);g.stroke()}
  else{E(ex,ey,2.5*hk,2.8*hk,B.eye||'#2b2020');if(B.eye)E(ex+.3,ey,1.2,1.4,'#1a1a2a');E(ex+.9,ey-1,1,1,'#fff')}
  if(sen){g.strokeStyle='#e8e8e8';g.lineWidth=1.2;g.beginPath();g.moveTo(ex-3,ey-4);g.lineTo(ex+3,ey-4.5);g.stroke()}
  E(hr*.3,hr*.45,2.5,1.5,'#ff9ab088');
  if(mood==='sad'&&pose!=='sleep'&&ui.anim%90<60)E(ex+1,ey+5+(ui.anim%60)/12,1.3,2,'#5ab0ff');
  // ears that hang go on top
  if(B.ear==='flop')E(-hr*.3,hr*.05,hr*.36,hr*.72,ec,.25);
  if(B.ear==='long')E(-hr*.25,hr*.4,hr*.38,hr*.95,ec,.12);
  if(B.ear==='pom'){for(let i=0;i<4;i++)E(-hr*.3+(i%2)*2,hr*.1+i*hr*.28,hr*.3*(1+coat/150),hr*.3*(1+coat/150),l)}
  if(fur>2.5&&!B.curly)for(let i=0;i<4;i++)E(-hr*.6+i*hr*.35,-hr*.85,1.5+fur*.2,2+fur*.3,furC,-.4+i*.25);
  g.restore();
  if(plq>=TUNE.plaqueBad&&ui.anim%80<50){g.strokeStyle='#8ac24a';g.lineWidth=1;for(let i=0;i<2;i++){g.beginPath();g.moveTo(hx+hr+4+i*3,hy+hr*.3);g.quadraticCurveTo(hx+hr+8+i*3,hy-2,hx+hr+5+i*3,hy-6);g.stroke()}}
  g.restore()}
function tailDraw(tx,ty,B,c,wag,sit){g.lineCap='round';const k=B.tail;if(k==='stub'){E(tx+1,ty,3.5,3,c);return}
  let a,len,w;if(k==='otter'){a=-2.5+wag*.35;len=15;w=5}else if(k==='whip'){a=-2.0+wag*.45;len=14;w=3}else if(k==='plume'){a=2.6+wag*.3;len=16;w=6}else if(k==='curl'){a=-1.6;len=11;w=5}else{a=-2.1+wag*.4;len=12;w=2.5}
  if(sit)a=3.0;const ex=tx+Math.cos(a)*len,ey=ty+Math.sin(a)*len;g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(tx,ty);
  let fx=ex,fy=ey;if(k==='curl'&&!sit){fx=tx+8+wag*2;fy=ty-12;g.quadraticCurveTo(tx-8,ty-16,fx,fy)}else g.quadraticCurveTo((tx+ex)/2-2,(ty+ey)/2+(k==='plume'?-3:3),ex,ey);g.stroke();
  if(k==='pom')E(fx,fy,5,5,B.l);if(B.white&&k!=='pom')E(fx,fy,w*.6,w*.6,B.l)}
function egg(cx,cy,spot,shake,cracks,grey){const o=shake?Math.sin(ui.anim*1.3)*3:0;g.save();g.translate(cx,cy);g.rotate(o*.03);
  E(0,30,22,5,'#0003');const gr=g.createRadialGradient(-6,-10,4,0,0,34);gr.addColorStop(0,grey?'#d8d8e0':'#fffef8');gr.addColorStop(1,grey?'#a0a0b0':'#ecdcc0');
  g.fillStyle=gr;g.beginPath();g.ellipse(0,2,22,28,0,0,7);g.fill();
  [[-8,-6,5],[9,4,4],[-3,14,4.5],[8,-14,3],[-12,8,3]].forEach(([x,y,r])=>E(x,y,r,r*.8,(grey?'#8888a0':spot)+'aa'));
  g.strokeStyle='#5a4a3a';g.lineWidth=1.5;const cr=[[-14,-2,-8,-6,-4,0,2,-5],[2,-5,7,1,12,-4,16,0],[-10,10,-4,6,2,11,8,6]];
  for(let i=0;i<Math.min(cracks,6);i++){const a=cr[i%3];g.beginPath();g.moveTo(a[0],a[1]+(i>2?8:0));for(let j=2;j<8;j+=2)g.lineTo(a[j],a[j+1]+(i>2?8:0));g.stroke()}
  g.restore()}
function lock(x,y){RR(x-7,y-2,14,11,3,'#5b4b8a');g.strokeStyle='#5b4b8a';g.lineWidth=2.5;g.beginPath();g.arc(x,y-2,4.5,Math.PI,0);g.stroke();E(x,y+3,1.6,1.6,'#ffe36a')}
function foodIcon(id,x,y,s=1){g.save();g.translate(x,y);g.scale(s,s);
  const bowl=c=>{E(0,5,11,4,'#2b6cc4');R(-11,1,22,4,'#3a86e8');E(0,1,11,3,c)};
  if(id==='kibble'){bowl('#a6683a');[[-5,0],[-1,-1],[3,0],[6,1],[-3,1.5],[1,1.5]].forEach(([a,b],i)=>E(a,b-1,2.3,1.6,i%2?'#8a5030':'#b97a44'))}
  if(id==='wet'){bowl('#8a4a2a');E(-3,-1,3,1.5,'#a85a3a');E(3,0,3,1.5,'#7a3a20');E(0,-2,2,1,'#c87a5a')}
  if(id==='chicken'){E(-1,1,8,6,'#e8a060');E(-2,-1,5,3,'#f8c890');R(5,-1,6,2.4,'#f4ead8');E(11,-2,2,2,'#f4ead8');E(11,1,2,2,'#f4ead8')}
  if(id==='salmon'){E(0,1,10,5,'#ff8a6a');for(let i=-6;i<=6;i+=3){g.strokeStyle='#ffd0c0';g.lineWidth=1;g.beginPath();g.moveTo(i,-3);g.lineTo(i+2,5);g.stroke()}}
  if(id==='biscuit'){R(-7,-2,14,5,'#d9a05b');[[-8,-3],[-8,3],[8,-3],[8,3]].forEach(([a,b])=>E(a,b,3.5,3.5,'#d9a05b'));E(0,0,3,1.5,'#8a5020')}
  if(id==='dental'){g.save();g.rotate(-.5);RR(-10,-2.5,20,5,2.5,'#6fd08a');for(let i=-8;i<9;i+=4)R(i,-2.5,1.4,5,'#4aa868');g.restore()}
  if(id==='catbisc'){bowl('#c88a50');[[-5,0],[0,-1],[5,0],[-2,1]].forEach(([a,b])=>{g.fillStyle='#e8a060';g.beginPath();g.moveTo(a-2,b+1);g.lineTo(a,b-2);g.lineTo(a+2,b+1);g.fill()})}
  if(id==='corn'){E(0,0,4,9,'#ffd84a');for(let i=-6;i<7;i+=3)R(-3,i,6,1,'#e8b020');E(-4,3,3,7,'#7ac04a',.3);E(4,3,3,7,'#7ac04a',-.3)}
  if(id==='grain'){bowl('#e8c070');[[-5,-1],[-1,0],[3,-1],[6,0],[-3,1],[1,1]].forEach(([a,b],i)=>E(a,b-1,1.4,1,i%2?'#c09040':'#f0d890'))}
  if(id==='worms'){bowl('#8a6038');g.strokeStyle='#e8b080';g.lineWidth=2;[-5,0,5].forEach(a=>{g.beginPath();g.moveTo(a-3,0);g.quadraticCurveTo(a,-4,a+3,0);g.stroke()})}
  if(id==='greens'){E(-3,0,6,4,'#5ac04a',.4);E(3,-1,6,4,'#7ad05a',-.4);E(0,2,5,3,'#4aa83a')}
  if(id==='slop'){E(0,5,12,4,'#7a7a8a');R(-12,0,24,5,'#9a9aaa');E(0,0,12,3,'#a07040');E(-4,-1,2,1,'#c09060');E(3,0,2,1,'#c09060')}
  if(id==='apple'){E(0,1,7,7,'#e83a3a');E(-2,-1,2,2,'#ff8a8a');R(-.5,-9,1.5,4,'#7a5030');E(3,-7,3,1.5,'#5ac04a',-.4)}
  if(id==='veg'){E(-4,1,5,4,'#7ad05a');E(4,0,4,4,'#ff9a3a');E(0,3,4,3,'#c84a8a')}
  if(id==='carrot'){g.fillStyle='#f38a24';g.beginPath();g.moveTo(-3,-5);g.lineTo(3,-5);g.lineTo(0,9);g.fill();E(-2,-7,2,4,'#4caf50',-.4);E(2,-7,2,4,'#4caf50',.4)}
  g.restore()}
function toyIcon(id,x,y,s=1){g.save();g.translate(x,y);g.scale(s,s);
  if(id==='ball'){E(0,0,7,7,'#c8e83a');g.strokeStyle='#fff';g.lineWidth=1.3;g.beginPath();g.arc(-7,0,6,-.9,.9);g.stroke();g.beginPath();g.arc(7,0,6,Math.PI-.9,Math.PI+.9);g.stroke()}
  if(id==='squeak'){R(-7,-2,14,4,'#ff6fa8');[[-8,-3],[-8,3],[8,-3],[8,3]].forEach(([a,b])=>E(a,b,3.4,3.4,'#ff6fa8'))}
  if(id==='rope'){g.lineCap='round';g.strokeStyle='#e44';g.lineWidth=4;g.beginPath();g.moveTo(-9,0);g.lineTo(9,0);g.stroke();g.strokeStyle='#fff';g.setLineDash([3,3]);g.beginPath();g.moveTo(-9,0);g.lineTo(9,0);g.stroke();g.setLineDash([]);E(-10,0,3,4,'#4a8ae8');E(10,0,3,4,'#4a8ae8')}
  if(id==='frisbee'){E(0,0,10,4,'#5ab0ff');E(0,-1,7,2.4,'#8ad0ff')}
  if(id==='duck'){E(0,2,7,5,'#ffd84a');E(4,-4,4,4,'#ffd84a');E(8,-3,3,1.5,'#ff9a2a');E(5,-5,.9,.9,'#222')}
  g.restore()}
// ===== backgrounds =====
function isNight(){const h=new Date().getHours();return S.sleep||h>=20||h<7}
function bg(night){const sky=g.createLinearGradient(0,0,0,150);
  if(night){sky.addColorStop(0,'#1b1d4a');sky.addColorStop(1,'#4a3f7a')}else{sky.addColorStop(0,'#7ec8ff');sky.addColorStop(1,'#d8f0ff')}
  g.fillStyle=sky;g.fillRect(0,0,W,H);const t=ui.anim;
  if(night){for(let i=0;i<25;i++){if((t+i*13)%80<60)R((i*53)%W,(i*29)%100,1.5,1.5,'#fff')}E(200,48,12,12,'#fff4c0');E(205,44,10,10,'#2b2d5a')}
  else{E(206,52,13,13,'#ffe36a');[[(t*.15)%(W+60)-30,58],[((t*.1)+120)%(W+60)-30,76]].forEach(([x,y])=>{E(x,y,16,7,'#fff');E(x+10,y-5,10,8,'#fff');E(x-8,y-2,9,6,'#fff')})}
  // fence
  for(let x=0;x<W;x+=16){RR(x+2,104,11,40,3,night?'#6a5a7a':'#f4e4c8')}R(0,114,W,4,night?'#5a4a6a':'#e0cca8');R(0,132,W,4,night?'#5a4a6a':'#e0cca8');
  const gr=g.createLinearGradient(0,140,0,H);gr.addColorStop(0,night?'#2f5a3e':'#9de07a');gr.addColorStop(1,night?'#1f3a2a':'#6cbf50');g.fillStyle=gr;g.fillRect(0,140,W,H-140);
  for(let x=4;x<W;x+=14){g.strokeStyle=night?'#26492f':'#5aa848';g.lineWidth=1;g.beginPath();g.moveTo(x,150+(x%7));g.lineTo(x+2,145+(x%7));g.lineTo(x+4,150+(x%7));g.stroke()}
  // kennel
  house(spOf(S),212,166,1,night,S.name);if(S.species==='pig')E(120,196,40,7,night?'#3a2a1a':'#8a6038');
  // bowl
  E(26,182,12,4,'#2b6cc4');R(14,176,24,6,'#3a86e8');E(26,176,12,3,S.hunger>40?'#a6683a':'#1e4a90')}
function house(sp,x,y,s,night,name){g.save();g.translate(x,y);g.scale(s,s);const dk=c=>night?mix(c,'#1b1d4a',.4):c;
  if(sp==='dog'){RR(-22,-38,44,38,3,dk('#d65a4a'));g.fillStyle=dk('#a83a30');g.beginPath();g.moveTo(-28,-36);g.lineTo(0,-58);g.lineTo(28,-36);g.fill();RR(-9,-24,18,24,9,'#3a2020')}
  if(sp==='cat'){RR(-20,-34,40,34,12,dk('#b48ad8'));E(0,-36,22,8,dk('#8a5ab8'));E(0,-12,11,12,'#3a2848');E(0,-1,13,4,dk('#ffd84a'));star(0,-42,4,'#ffe36a')}
  if(sp==='chicken'){R(-22,-34,44,30,dk('#e8c070'));for(let i=-20;i<22;i+=6)R(i,-34,1,30,dk('#c89a50'));g.fillStyle=dk('#c0402a');g.beginPath();g.moveTo(-27,-32);g.lineTo(0,-52);g.lineTo(27,-32);g.fill();
    R(-20,-4,3,4,'#7a5030');R(17,-4,3,4,'#7a5030');RR(-6,-24,12,14,6,'#3a2020');g.strokeStyle=dk('#a0a0a0');g.lineWidth=1.5;g.beginPath();g.moveTo(6,-10);g.lineTo(20,0);g.stroke()}
  if(sp==='pig'){E(0,-2,32,6,dk('#7a5030'));RR(-24,-28,34,24,2,dk('#d8a070'));R(-26,-32,38,5,dk('#8a5a3a'));RR(-10,-20,10,16,3,'#3a2020');
    for(let i=-30;i<34;i+=8)R(i,-12,3,12,dk('#b08050'));R(-30,-10,64,2,dk('#b08050'))}
  if(name){RR(-15,-30+(sp==='pig'?-8:0),30,9,3,'#fff8');txt(name.slice(0,6),0,-23+(sp==='pig'?-8:0),'#5b4b8a',6)}
  g.restore()}
function lockedHouse(n,x,y,s){g.save();g.globalAlpha=.55;g.translate(x,y);g.scale(s,s);R(-24,-30,48,30,'#b0a8c0');g.fillStyle='#8a80a8';g.beginPath();g.moveTo(-28,-28);g.lineTo(0,-46);g.lineTo(28,-28);g.fill();g.globalAlpha=1;lock(0,-16);g.restore();txt(n,x,y+8*s,'#fff',6);txt('coming soon',x,y+15*s,'#ffffffaa',5)}
function drawMap(t){const sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#8fd06e');sky.addColorStop(1,'#6cbf50');g.fillStyle=sky;g.fillRect(0,0,W,H);
  for(let i=0;i<40;i++){const x=(i*67)%W,y=30+(i*41)%180;g.strokeStyle='#5aa848';g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+2,y-4);g.lineTo(x+4,y);g.stroke()}
  // paths
  g.strokeStyle='#e8d8a8';g.lineWidth=10;g.lineCap='round';g.beginPath();g.moveTo(0,120);g.lineTo(W,120);g.moveTo(120,24);g.lineTo(120,H);g.stroke();
  // field (later) + pond
  R(150,128,84,40,'#a07848');for(let y=132;y<166;y+=6)R(152,y,80,2,'#8a6038');txt('FIELD — soon',192,178,'#fff',7);
  E(36,192,26,12,'#5ab0ff');E(30,189,10,4,'#8ad0ff');
  for(let i=0;i<5;i++){E(8+i*14,30,8,9,'#4a9a3a')}
  R(0,0,W,22,'#2b2440cc');txt('FARM MAP',8,15,'#fff',10,'left');txt('● '+petList().reduce((a,p)=>a+(p.coins||0),0),W-8,15,'#ffd84a',9,'right');
  const L=petList(),slots=[[30,92],[78,92],[166,92],[214,92],[78,170],[30,150]];
  const pets=L.slice(0,6);if(ui.msel>L.length)ui.msel=0;
  pets.forEach((p,i)=>{const [x,y]=slots[i],on=ui.msel===i,sp=spOf(p);if(on){E(x,y+2,28,7,'#ffe36a');}
    house(sp,x,y,.8,false,p.name);if(p.stage){g.save();g.translate(x+16,y+6);g.scale(.32,.32);dog(0,0,p.breed,p.stage,{pose:on?'hop':'sit',mood:'happy',coat:p.coat});g.restore()}
    });
  if(L.length>6)txt('+'+(L.length-6)+' more in MY PETS',W/2,206,'#fff',7);
  lockedHouse('COW BARN',190,212,.6);lockedHouse('STABLE',230,212,.5);
  const ny=[78,166][0],newOn=ui.msel>=L.length;RR(96,96,48,16,8,newOn?'#ff5a8b':'#fffc','#2b2440');txt('+ NEW',120,107,newOn?'#fff':'#5b4b8a',8);
  const cur=L[ui.msel];RR(10,26,W-20,16,8,'#fffe','#2b2440');
  txt(cur?cur.name+' — '+SP[spOf(cur)].house+' • '+stageName(cur.stage,spOf(cur))+'  (A visit)':'Adopt a new pet (A)',W/2,37,'#2b2440',8);
  txt('✚ choose  A go  B back',W/2,H-3,'#fff',7)}
// ===== critters (cat / chicken / pig) =====
function critter(cx,cy,sp,stage,o){const T=ui.anim,pose=o.pose||'idle',mood=o.mood||'ok';const sz={puppy:.6,youngster:.74,teen:.87,adult:1,senior:1}[stage]||1;
  const sleep=pose==='sleep'||pose==='lay'||pose==='nap',eat=pose==='eat'||pose==='sniff';
  let dy=0;if(pose==='hop'||pose==='happy')dy=-Math.abs(Math.sin(T/6))*12;if(pose==='walk'||pose==='trot'||pose==='play')dy=-Math.abs(Math.sin(T/5))*2;
  g.save();g.translate(cx,cy);E(0,1,20*sz,4*sz,'#0003');g.translate(0,dy);g.scale(sz*(o.dir||1),sz);if(pose==='roll')g.rotate(Math.sin(T/8)*.6);
  const sw=(pose==='walk'||pose==='trot'||pose==='play')?Math.sin(T/5)*3:0,blink=T%170<6||sleep;
  const eye=(x,y,r=2.2)=>{if(blink){g.strokeStyle='#2b2020';g.lineWidth=1.3;g.beginPath();g.arc(x,y,r,.2,Math.PI-.2);g.stroke()}else{E(x,y,r,r*1.15,'#2b2020');E(x+.7,y-.8,.8,.8,'#fff')}};
  if(sp==='cat'){const c='#f0a050',d='#c07030';const by=sleep?-8:-16;
    // tail
    g.strokeStyle=c;g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(-14,by);g.quadraticCurveTo(-26,by-6+Math.sin(T/12)*4,-22,by-20);g.stroke();
    if(!sleep){[[-10,0],[-4,0],[8,0],[13,0]].forEach(([x],i)=>RR(x-2,by+4,4,-by-3+(i%2?sw:-sw)*.3,2,i<2?d:c))}
    E(0,by,17,sleep?8:10,c);for(let i=-8;i<12;i+=6)R(i,by-9,2,6,d);E(4,by+5,10,4,'#fff4e6');
    const hx=sleep?16:14,hy=sleep?-10:by-12+(eat?8:0);
    g.fillStyle=c;[[-7,-1],[3,1]].forEach(([a])=>{g.beginPath();g.moveTo(hx+a-1,hy-6);g.lineTo(hx+a+2,hy-16);g.lineTo(hx+a+6,hy-6);g.fill()});
    E(hx,hy,10,9,c);E(hx+4,hy+3,5,3.5,'#fff4e6');E(hx+6,hy+1.5,1.4,1,'#ff8aa0');eye(hx-1,hy-2);eye(hx+5,hy-2,1.8);
    g.strokeStyle='#5a4030';g.lineWidth=.6;for(const k of [-1,1]){g.beginPath();g.moveTo(hx+7,hy+3);g.lineTo(hx+15,hy+3+k*2);g.stroke()}}
  if(sp==='chicken'){const peck=eat?Math.abs(Math.sin(T/4))*8:0;
    if(!sleep){g.strokeStyle='#f0a020';g.lineWidth=2;[[-3,sw],[3,-sw]].forEach(([x,s])=>{g.beginPath();g.moveTo(x,-8);g.lineTo(x+s*.4,0);g.lineTo(x+s*.4+3,0);g.stroke()})}
    const by=sleep?-9:-16;E(-12,by-4,6,8,'#f0e8d8',-.5);E(0,by,13,11,'#fff8ec');E(-2,by+1,7,5,'#efe2cc',.3);
    const hx=9,hy=by-12+peck;E(hx,hy,7,7,'#fff8ec');[0,3,6].forEach(i=>E(hx-3+i,hy-7,2,2.6,'#e83a3a'));
    g.fillStyle='#f0a020';g.beginPath();g.moveTo(hx+6,hy-1);g.lineTo(hx+11,hy+1);g.lineTo(hx+6,hy+3);g.fill();E(hx+6,hy+5,1.6,2.4,'#e83a3a');eye(hx+2,hy-1,1.6)}
  if(sp==='pig'){const c='#ffb0c0',d='#e88aa0',by=sleep?-9:-15;
    g.strokeStyle=d;g.lineWidth=2;g.beginPath();g.arc(-21,by-3,3,0,Math.PI*1.6+Math.sin(T/6));g.stroke();
    if(!sleep)[[-12,1],[-6,-1],[8,1],[13,-1]].forEach(([x,s])=>RR(x-2.5,by+6,5,-by-5+s*sw*.3,2,d));
    E(0,by,21,12,c);if(o.coat>0||S.species==='pig'&&(S.dirt||0)>0)E(-6,by+6,8,4,'#7a5030aa');
    const hx=18,hy=by-2+(eat?6:0);E(hx,hy,11,10,c);g.fillStyle=d;g.beginPath();g.moveTo(hx-6,hy-7);g.lineTo(hx-2,hy-15);g.lineTo(hx+1,hy-7);g.fill();
    E(hx+9,hy+2,4,4.5,d);E(hx+8,hy+1,.9,1.3,'#7a3a4a');E(hx+10.5,hy+1,.9,1.3,'#7a3a4a');eye(hx+2,hy-3,1.8);
    if(mood==='happy'||pose==='happy'){g.strokeStyle='#7a3a4a';g.lineWidth=1;g.beginPath();g.arc(hx+5,hy+5,2.5,.2,Math.PI-.4);g.stroke()}}
  if(mood==='sad'&&!sleep&&T%90<60)E(cx?0:0,-30,0,0,'#0000');
  g.restore()}
// ===== UI pieces =====
function panel(x,y,w,h,title){RR(x+2,y+3,w,h,8,'#0004');RR(x,y,w,h,8,'#fff8ee','#2b2440');if(title){RR(x+8,y-7,title.length*6.4+14,14,7,'#5b4b8a');txt(title,x+15,y+4,'#fff',9,'left')}}
function bar(x,y,w,v,col){RR(x,y,w,9,4.5,'#2b2440');const ww=Math.max(0,(w-4)*v/100);if(ww>1)RR(x+2,y+2,ww,5,2.5,col)}
function chrome(){R(0,0,W,30,'#ffffffdd');R(0,30,W,1,'#2b244033');
  foodIcon('kibble',9,8,.5);bar(17,4,60,S.hunger,S.hunger<25?'#ff5a7a':'#ffa53f');heartS(9,21,.8);bar(17,17,60,S.happy,S.happy<25?'#ff5a7a':'#5ad07a');
  const cl=S.coat,cc=cl>=TUNE.matAt?'#ff4f7b':cl>=TUNE.longAt?'#ffb03a':'#a07cff';if(S.species==='dog'){txt('✂',87,12,cc,9);bar(93,4,40,cl,cc)}
  const pq=S.plaque,pc=pq>=TUNE.plaqueBad?'#ff4f7b':pq>=40?'#e0c040':'#5ab0ff';if(S.species==='dog'||S.species==='cat'){toothI(87,21,pq);bar(93,17,40,pq,pc)}
  txt(S.name,W-6,12,'#5b4b8a',10,'right');txt('● '+S.coins,W-6,26,'#d89a10',8,'right');RR(140,17,50,10,5,'#ff5a8b');txt(stageName(S.stage,S.species),165,25,'#fff',7);
  R(0,31,W,3,'#0001');R(0,31,W*growProg(),3,'#a07cff')}
function toothI(x,y,p){g.fillStyle=mix('#ffffff','#d8b040',Math.min(1,p/90));g.strokeStyle='#2b2440';g.lineWidth=.8;g.beginPath();g.moveTo(x-3.5,y-4);g.lineTo(x+3.5,y-4);g.lineTo(x+3,y+1);g.lineTo(x+1.5,y+4);g.lineTo(x,y+1);g.lineTo(x-1.5,y+4);g.lineTo(x-3,y+1);g.closePath();g.fill();g.stroke()}
function warnings(){const w=[];if(S.species!=='dog'){}else if(S.coat>=TUNE.matAt)w.push(['OUCH! Matted fur — go to Tara\'s!',1]);else if(S.coat>=TUNE.longAt)w.push(['Coat getting long — groom soon',0]);
  if(S.plaque>=TUNE.plaqueBad)w.push(['Ouch, my teeth! Brush them',1]);if(S.hunger<25)w.push(['Hungry… feed me',1]);if(S.happy<30&&!w.length)w.push(['Lonely… play with me',0]);return w}
function mood(){return(S.hunger<30||S.happy<30||S.coat>=TUNE.matAt||S.plaque>=TUNE.plaqueBad)?'sad':(S.hunger>55&&S.happy>60)?'happy':'ok'}
function dogAt(x,y,s,pose,pt,dir){g.save();g.translate(x,y);g.scale(s,s);dog(0,0,S.breed,S.stage,{pose,pt,mood:mood(),coat:S.coat,plaque:S.plaque,dir});g.restore()}
function cecily(x,y,t,snip){g.save();g.translate(x,y);E(0,0,14,4,'#0003');
  RR(-7,-24,5,24,2,'#3a3a5a');RR(2,-24,5,24,2,'#3a3a5a');E(-5,-1,4,2,'#2b2440');E(5,-1,4,2,'#2b2440');
  RR(-12,-58,24,38,10,'#3fb8a8');RR(-9,-50,18,28,6,'#ffd6e6');txt('TSH',0,-34,'#e0457b',6);
  E(0,-70,11,12,'#f3c9a8');E(0,-78,12,8,'#7a3e22');E(-9,-70,4,9,'#7a3e22');E(9,-70,4,9,'#7a3e22');E(0,-90,6,6,'#7a3e22');E(5,-88,3,2,'#ff5a8b');
  E(-4,-69,1.3,1.7,'#2b2020');E(4,-69,1.3,1.7,'#2b2020');g.strokeStyle='#2b2020';g.lineWidth=1;g.beginPath();g.arc(0,-65,3,.3,Math.PI-.3);g.stroke();E(-7,-65,2,1.2,'#ff9ab088');E(7,-65,2,1.2,'#ff9ab088');
  g.save();g.translate(11,-50);g.rotate(-1.1+(snip?Math.sin(t/2.5)*.2:0));RR(-2.5,0,5,16,2.5,'#f3c9a8');
  g.translate(0,18);const op=snip?Math.abs(Math.sin(t/2))*.5:.25;g.strokeStyle='#9aa0b0';g.lineWidth=2;[op,-op].forEach(a=>{g.beginPath();g.moveTo(0,0);g.lineTo(Math.sin(a)*12,Math.cos(a)*12);g.stroke()});
  g.strokeStyle='#e0457b';g.lineWidth=1.5;g.beginPath();g.arc(-3,-2,2.5,0,7);g.stroke();g.beginPath();g.arc(3,-2,2.5,0,7);g.stroke();g.restore();g.restore()}
function salonBg(){R(0,0,W,H,'#ffe4ee');for(let x=0;x<W;x+=20)R(x,0,10,150,'#ffd4e4');
  for(let x=0;x<W;x+=16)for(let y=150;y<H;y+=16)R(x,y,16,16,((x+y)/16)%2?'#f7f0e6':'#e8dccc');
  RR(24,6,192,30,9,'#e0457b','#fff');txt('TARA SCISSOR HOUNDS',W/2,20,'#fff',11);txt('✂ dog grooming ✂',W/2,31,'#ffe36a',8);
  RR(176,44,40,52,18,'#cfefff','#b88a58');R(186,52,6,30,'#ffffff88');
  R(20,60,50,3,'#b88a58');['#5ab0ff','#ff9ac0','#ffd84a','#7ad07a'].forEach((c,i)=>RR(22+i*12,46,8,14,3,c));
  RR(108,140,96,8,3,'#5b4b8a');R(118,148,5,30,'#3a3060');R(188,148,5,30,'#3a3060');RR(104,176,104,4,2,'#3a3060')}
function bubble(t,x,y,w){const L=[];let line='';t.split(' ').forEach(wd=>{if((line+wd).length*5.2>w-10){L.push(line);line=''}line+=wd+' '});L.push(line);
  RR(x,y,w,L.length*11+8,8,'#fff','#2b2440');L.forEach((l,i)=>txt(l,x+w/2,y+12+i*11,'#2b2440',8))}
function drawGroom(t){const m=ui.mg;m.t++;salonBg();
  dogAt(156,140,1.15,m.ph==='done'?'happy':m.ph==='cut'?'idle':'sit',0,-1);
  if(m.ph==='done'){g.save();g.translate(152-S.stage.length,98);g.fillStyle='#ff5a8b';g.beginPath();g.moveTo(0,0);g.lineTo(-8,-5);g.lineTo(-8,5);g.fill();g.beginPath();g.moveTo(0,0);g.lineTo(8,-5);g.lineTo(8,5);g.fill();E(0,0,2.5,2.5,'#e0457b');g.restore()}
  cecily(70,176,t,m.ph==='cut'&&t%30<20);
  const line={intro:m.mat?"Hi, I'm Cecily! Oh dear, "+S.name+"'s fur is matted. Let's fix it gently!":"Hi, I'm Cecily! Ready for a lovely trim, "+S.name+"?",
    short:S.name+"'s coat looks lovely already! Come back when it's longer.",brush:'First we brush the knots out gently… ◀ ▶ ◀ ▶',cut:'Snip snip! Press A to trim.',done:'All done! '+S.name+' looks fabulous!'}[m.ph];
  bubble(line,12,42,150);
  if(m.ph==='brush'){RR(30,196,180,10,5,'#2b2440');RR(32,198,176*Math.min(1,m.brush/12),6,3,'#ff5a8b');txt('◀ ▶ brush',W/2,192,'#5b4b8a',9)}
  if(m.ph==='cut'){const p=1-(S.coat-5)/Math.max(1,m.start-5);RR(30,196,180,10,5,'#2b2440');RR(32,198,176*Math.max(0,Math.min(1,p)),6,3,'#5ad07a');txt('A snip ✂   coat '+Math.round(S.coat)+'%',W/2,192,'#5b4b8a',9)}
  if(m.ph==='intro')txt('A start   B leave',W/2,204,'#5b4b8a',9);if(m.ph==='done'||m.ph==='short')txt('A go home',W/2,204,'#5b4b8a',9)}
function drawTeeth(t){const m=ui.mg;m.t++;R(0,0,W,H,'#dff4ff');for(let x=0;x<W;x+=24)for(let y=0;y<H;y+=24)RR(x+1,y+1,22,22,3,'#cfeaff');
  otxt('BRUSH TEETH',W/2,20,'#fff',13);dogAt(48,120,1,'smile',0,1);
  RR(96,44,134,104,14,'#fff','#2b2440');E(163,82,56,20,'#ff8aa8');E(163,118,56,18,'#ff8aa8');
  const tc=mix('#ffffff','#c9a23a',Math.min(1,S.plaque/90));for(let i=0;i<7;i++){RR(118+i*13,80,11,15,4,tc,'#e0b0b8');RR(118+i*13,104,11,14,4,tc,'#e0b0b8')}
  if(S.plaque>30)for(let i=0;i<7;i++)if((i*3)%5<S.plaque/25)E(124+i*13,92,4,2.5,'#b8902a99');
  const bx=163+(m.bx||0)*34+Math.sin(t/3)*2;g.save();g.translate(bx,100);RR(-4,-8,30,6,3,'#5ab0ff');RR(-10,-12,10,10,3,'#fff','#5ab0ff');g.restore();
  RR(100,154,126,10,5,'#2b2440');RR(102,156,122*(1-S.plaque/100),6,3,'#5ad07a');txt('CLEAN '+Math.round(100-S.plaque)+'%',163,176,'#2b2440',10);
  txt(m.done?'Sparkly clean! A done':'◀ ▶ ◀ ▶ scrub!   B stop',W/2,204,'#5b4b8a',10)}
function drawWalk(t){const m=ui.mg;walkTick();const x=m.x;
  const sky=g.createLinearGradient(0,0,0,120);sky.addColorStop(0,'#8fd0ff');sky.addColorStop(1,'#e8f6ff');g.fillStyle=sky;g.fillRect(0,0,W,H);
  for(let i=0;i<6;i++){const hx=((i*70-x*.3)%(W+70)+W+70)%(W+70)-50,c=['#f0b89a','#c8d8f0','#f4e0a0'][i%3];R(hx,70,50,62,c);g.fillStyle='#b05a4a';g.beginPath();g.moveTo(hx-4,72);g.lineTo(hx+25,52);g.lineTo(hx+54,72);g.fill();R(hx+8,84,10,10,'#fff');R(hx+30,84,10,10,'#fff');R(hx+20,110,10,22,'#7a4a30')}
  for(let i=0;i<5;i++){const tx=((i*90+40-x*.6)%(W+90)+W+90)%(W+90)-40;R(tx-2,118,5,30,'#7a5030');E(tx,112,14,16,'#5aa848');E(tx-6,118,9,9,'#6cbf50')}
  R(0,146,W,10,'#8fd06e');R(0,156,W,32,'#cfcac2');for(let px=-(x%24);px<W;px+=24){R(px,156,1,32,'#b0aaa0')}R(0,171,W,1,'#b0aaa0');R(0,188,W,4,'#9a948c');R(0,192,W,24,'#5a5a64');for(let px=-((x*1)%40);px<W;px+=40)R(px,203,20,2,'#fff');
  const sx=e=>e.x-x+100;
  m.evs.forEach(e=>{const X=sx(e);if(X<-30||X>W+30)return;
    if(e.t==='lamp'){R(X+14,84,4,72,'#4a4a5a');RR(X+8,80,16,6,3,'#4a4a5a');E(X+16,88,5,3,'#ffe36a')}
    if(e.t==='sniff'){E(X+16,152,16,10,'#4a9a3a');E(X+8,148,9,8,'#5aa848');E(X+20,146,6,3,'#ff7ab0')}
    if(e.t==='poo'&&e.px!=null&&!e.bagged){const P=e.px-x+100-60;E(P,182,5,3,'#6a4020');E(P,179,3.6,2.4,'#7a4a28');E(P,177,2,1.6,'#8a5a30')}});
  const binX=m.len-x+120;if(binX<W+30){RR(binX,150,18,26,3,'#3a8a4a');R(binX-2,148,22,4,'#2a6a3a');txt('🐾',binX+9,166,'#fff',8)}
  const pose={walk:m.boost>0?'trot':'walk',sniffQ:'sniff',sniff:'sniff',wee:'wee',poo:'poo',bagQ:'sit',bagging:'happy'}[m.st]||'walk';
  dogAt(100,182,1.05,m.done?'happy':pose,0,1);
  g.strokeStyle='#e8405a';g.lineWidth=1.5;g.beginPath();g.moveTo(-4,120);g.quadraticCurveTo(50,150+Math.sin(t/8)*3,110,140);g.stroke();
  if(m.st==='wee'&&t%10<6)for(let i=0;i<3;i++)E(88-i*3,176+i*2,1.2,1.2,'#ffe36a');
  if(m.st==='bagging'){g.save();g.translate(40+(50-m.stT),170);RR(-6,-8,12,12,3,'#3ac04a');g.restore()}
  R(0,0,W,22,'#2b2440cc');txt('WALK',8,15,'#fff',10,'left');RR(48,8,120,7,3,'#ffffff33');RR(48,8,120*Math.min(1,x/m.len),7,3,'#5ad07a');txt('💩 '+m.bag+'  👃 '+m.sn,W-8,15,'#fff',9,'right');
  if(m.st==='sniffQ')promptBox('Something smells good!','A sniff   ▶ keep going');
  if(m.st==='bagQ')promptBox(S.name+' did a poo!','A BAG IT   ▶ walk on');
  if(m.st==='walk'&&!m.done)txt('▶ walk faster   B head home',W/2,212,'#fff',8);
  if(m.done){R(0,0,W,H,'#0007');panel(30,60,W-60,90,'HOME AGAIN');txt('Lovely walk with '+S.name+'!',W/2,92,'#2b2440',10);txt('Poo bagged: '+m.bag+'  Sniffs: '+m.sn,W/2,110,'#8a80a8',9);txt('A to finish',W/2,134,'#e0457b',10)}}
function promptBox(a,b){RR(30,34,180,38,10,'#fff','#2b2440');txt(a,W/2,50,'#2b2440',10);txt(b,W/2,64,'#e0457b',9)}
function frame(){ui.anim++;const t=ui.anim;g.clearRect(0,0,W,H);if(ui.poseT>0){ui.poseT--;if(!ui.poseT)ui.pose='idle'}
  const sc=S.scene;
  if(sc==='title'){if(LOGO.ok){const iw=LOGO.img.width,ih=LOGO.img.height,k=Math.max(W/iw,H/ih),dw=iw*k,dh=ih*k,ox=(W-dw)/2,oy=(H-dh)/2;g.drawImage(LOGO.img,ox,oy,dw,dh);
      const P=(x,y)=>[ox+x*1.25*k,oy+y*1.25*k];
      const eat=(t%240),dip=eat<90?Math.sin(eat/90*Math.PI)*4:0;
      if(dip>0.3){const sx=850,sy=305,sw=110,sh=100,[dx,dy]=P(sx/1.25,sy/1.25);g.fillStyle='#e9e1cc';g.fillRect(dx+2,dy,sw*k-4,dip+1);g.drawImage(LOGO.img,sx,sy,sw,sh,dx,dy+dip,sw*k,sh*k);
        const[gx,gy]=P(735,330);g.fillStyle='#4f9a3a';for(let j=0;j<5;j++)g.fillRect(Math.round(gx-6+j*3),Math.round(gy-(j%2?3:5)),1,j%2?3:5);
        if(eat>30&&eat<60&&(eat>>3)%2){g.fillStyle='#3a7a2a';g.fillRect(Math.round(gx-2),Math.round(gy+dip-6),3,1)}}
      const blink=(ph,ex)=>{const f=(t+ph)%200;if(f<7){ex.forEach(([x,y,c])=>{const[a,b]=P(x,y);g.fillStyle=c;g.fillRect(Math.round(a-2),Math.round(b-1.5),4,3);g.fillStyle='#2b2440';g.fillRect(Math.round(a-2),Math.round(b),4,1)})}};
      blink(0,[[322,246,'#f2ede4'],[352,246,'#f2ede4']]);
      if(dip<=0.3)blink(97,[[713,276,'#f0d2c0']]);
      for(let i=0;i<4;i++){const cx=((t*0.25*(1+i*0.3)+i*90)%(W+80))-40,cy=10+i*9+Math.sin(t/60+i)*2;g.fillStyle='rgba(255,255,255,0.55)';g.beginPath();g.ellipse(cx,cy,16,5,0,0,7);g.ellipse(cx+10,cy-3,10,5,0,0,7);g.fill()}
      g.fillStyle='rgba(43,36,64,0.55)';g.fillRect(0,118,W,H-118)}
    else{bg(false);otxt('PET FARM',W/2,34,'#ffe36a',26);g.save();g.translate(W/2,112);g.scale(1.1,1.1);dog(0,0,BKEYS[Math.floor(t/150)%BKEYS.length],'puppy',{pose:t%150<70?'hop':'sit',mood:'happy'});g.restore()}
    const it=titleItems();if(ui.tsel>=it.length)ui.tsel=0;it.forEach((c,i)=>{const y=124+i*24,on=i===ui.tsel;RR(60,y,120,20,10,on?'#ff5a8b':'#fffc',on?'#fff':'#2b244055');txt((on?'▶ ':'')+c,W/2,y+14,on?'#fff':'#5b4b8a',11)});
    const lp=DB.pets[DB.lastId];if(lp&&it[ui.tsel]==='CONTINUE')txt(lp.name+' • '+stageName(lp.stage,spOf(lp)),W/2,206,'#fff',9);else txt(petList().length+' pet'+(petList().length===1?'':'s')+' saved on this device',W/2,206,'#fff',9)}
  else if(sc==='list'){bg(false);otxt('MY PETS',W/2,22,'#fff',15);const L=petList(),rows=L.concat([null]),top=Math.max(0,Math.min(ui.psel-3,rows.length-5));
    rows.slice(top,top+5).forEach((p,ii)=>{const i=ii+top,y=32+ii*32,on=i===ui.psel;RR(14,y,W-28,28,8,on?'#ffe0ec':'#fffd',on?'#ff5a8b':'#d8d0e8');
      if(!p){txt('+ NEW PET',W/2,y+18,'#e0457b',11);return}
      g.save();g.translate(36,y+25);g.scale(.5,.5);if(p.stage)dog(0,0,p.breed||'lab',p.stage,{mood:'happy',coat:p.coat,pose:on?'walk':'idle'});else egg(0,-24,BREEDS[p.breed||'lab'].d,false,0);g.restore();
      txt(p.name,62,y+13,'#2b2440',11,'left');txt((BREEDS[p.breed]||BREEDS.lab).n+' • '+stageName(p.stage,spOf(p))+(p.wasSpecies?' (was '+p.wasSpecies+')':''),62,y+24,'#8a80a8',7,'left');
      if(p.stage){RR(W-58,y+7,34,5,2,'#0002');RR(W-58,y+7,34*(p.hunger||0)/100,5,2,'#ffa53f');RR(W-58,y+16,34,5,2,'#0002');RR(W-58,y+16,34*(p.happy||0)/100,5,2,'#5ad07a')}});
    txt('A load  B back  SELECT goodbye',W/2,208,'#fff',9)}
  else if(sc==='species'){bg(false);otxt('CHOOSE YOUR PET',W/2,24,'#fff',15);
    const off=Math.max(0,Math.min(ui.sel-1,SPECIES.length-4));SPECIES.slice(off,off+4).forEach((sp,ii)=>{const i=ii+off,x=33+ii*58,on=i===ui.sel;RR(x-26,40,52,118,10,on?'#fffc':'#fff6',on?'#ff5a8b':null);
      if(sp.ok){g.save();g.translate(x,118);g.scale(.85,.85);dog(0,0,sp.id==='dog'?'beagle':sp.id,'puppy',{pose:on?'hop':'sit',mood:'happy'});g.restore();house(sp.id,x,150,.45,false)}else{egg(x,96,'#888',false,0,true);lock(x,100);txt('COMING',x,136,'#8a80a8',7);txt('SOON',x,145,'#8a80a8',7)}
      otxt(sp.n,x,172,on?'#ff5a8b':'#fff',10)});
    if(off>0)otxt('◀',6,104,'#fff',12);if(off+4<SPECIES.length)otxt('▶',W-6,104,'#fff',12);
    otxt(SPECIES[ui.sel].ok?'◀ ▶ choose   A select':'More pets coming soon!',W/2,198,'#fff',11)}
  else if(sc==='breed'){bg(false);const b=BKEYS[ui.sel],B=BREEDS[b];otxt('PICK YOUR DOG',W/2,22,'#fff',15);
    RR(14,32,W-28,136,12,'#fff9','#ffffff');g.save();g.translate(W/2-14,138);g.scale(1.7,1.7);dog(0,0,b,'adult',{pose:t%240<150?'idle':'happy',mood:'happy',coat:30});g.restore();
    g.save();g.translate(W/2+70,160);g.scale(.8,.8);dog(0,0,b,'puppy',{pose:'sit',mood:'happy'});g.restore();txt('puppy',W/2+70,166,'#8a80a8',7);
    otxt('◀',22,104,'#fff',16);otxt('▶',W-22,104,'#fff',16);otxt(B.n,W/2,186,'#ffe36a',14);txt(B.desc+(B.fur>=1.1?' • needs grooming':''),W/2,200,'#2b2440',8);
    BKEYS.forEach((k,i)=>E(W/2-28+i*8,210,2.5,2.5,i===ui.sel?'#ff5a8b':'#fff'))}
  else if(sc==='egg'){bg(false);otxt(S.name+"'S EGG",W/2,28,'#fff',15);if(ui.shake>0)ui.shake--;egg(W/2,112,BREEDS[S.breed].d,ui.shake>0||t%100<12,ui.hatch);
    otxt('TAP A TO HATCH',W/2,172,'#fff',12);for(let i=0;i<TUNE.hatchTaps;i++)heartS(W/2-(TUNE.hatchTaps-1)*7+i*14,192,1,i<ui.hatch?'#ff4f8b':'#fff8')}
  else if(sc==='map')drawOverworld(t);
  else if(sc==='game')drawGame(t);
  else if(sc==='walk')drawWalk(t);
  else if(sc==='groom')drawGroom(t);
  else if(sc==='teeth')drawTeeth(t);
  else{ bg(isNight());
    S.toys.forEach((id,i)=>{if(ui.idle.k==='play'&&ui.idle.toy===id)return;toyIcon(id,60+i*26,203-(i%2)*4,.8)});
    let pose=ui.pose,pt=ui.poseT;if(sc==='teach'&&ui.poseT===0)pose='idle';
    if(S.sleep){pose='sleep'}else if(pose==='idle'&&sc==='main'){idleTick();pose=idlePose();pt=ui.idle.t}
    else if(pose==='idle')pose='sit';
    if(pose==='eat')foodIcon(ui.eatFood,ui.dx+ui.dir*40,186,1.1);
    dogAt(ui.dx,186,1.45,pose,pt,ui.dir);
    if(pose==='play'){const tid=ui.idle.toy,b=Math.abs(Math.sin(t/12));toyIcon(tid,ui.dx+ui.dir*(44+b*10),184-b*16,1.1);if(tid==='squeak'&&t%60<10)otxt('SQUEAK!',ui.dx,118,'#ff6fa8',9)}
    if(pose==='sleep')[0,1,2].forEach(i=>{const p=((t+i*30)%90)/90;g.globalAlpha=1-p;otxt('Z',ui.dx+20+p*20+i*4,130-p*40,'#fff',9+i*3);g.globalAlpha=1});
    chrome();
    if(sc==='main'){const w=warnings();if(w.length&&!S.sleep&&ui.msgT<=0){const cur=w[Math.floor(t/180)%w.length];if(t%180<140){RR(26,40,W-52,17,8,cur[1]?'#ff4f7b':'#fff',cur[1]?'#fff':'#2b2440');txt(cur[0],W/2,52,cur[1]?'#fff':'#5b4b8a',8)}}
      R(0,H-24,W,24,'#2b2440');const bw=W/ACTIONS.length;ACTIONS.forEach((a,i)=>{const x=bw/2+i*bw;if(i===ui.menu)RR(x-bw/2+1,H-22,bw-2,20,6,'#ff5a8b');txt(a,x,H-9,'#fff',a.length>5?6.5:7.5)})}
    if(sc==='food'){const FOODS=foods();panel(10,46,W-20,H-56,SP[spOf(S)].food);FOODS.forEach((f,i)=>{const x=20+(i%4)*52,y=56+Math.floor(i/4)*60,on=i===ui.sel;
        RR(x,y,46,52,8,on?'#ffe0ec':'#fff',on?'#ff5a8b':'#d8d0e8');foodIcon(f.id,x+23,y+20,on?1.3+Math.sin(t/6)*.08:1.15);txt('+'+f.v,x+23,y+46,f.plq<0?'#2a9a50':'#5b4b8a',9)});
      const f=FOODS[ui.sel]||FOODS[0];txt(f.n+(f.d?' — '+f.d:''),W/2,184,'#2b2440',9);txt('✚ choose  A feed  B back',W/2,200,'#8a80a8',9)}
    if(sc==='toys'){panel(10,46,W-20,H-56,'TOYS');TOYS.forEach((ty,i)=>{const x=20+(i%4)*52,y=56+Math.floor(i/4)*60,on=i===ui.sel,own=S.toys.includes(ty.id);
        RR(x,y,46,52,8,on?'#ffe0ec':'#fff',on?'#ff5a8b':'#d8d0e8');toyIcon(ty.id,x+23,y+22,on?1.4:1.2);txt(own?'OWNED':'● '+ty.p,x+23,y+46,own?'#2a9a50':'#d89a10',8)});
      const ty=TOYS[ui.sel],own=S.toys.includes(ty.id);txt(ty.n+(own?' — A to give':' — A to buy'),W/2,184,'#2b2440',9);txt('You have ● '+S.coins+'   B back',W/2,200,'#8a80a8',9)}
    if(sc==='games'){panel(16,50,W-32,H-62,'PLAY');GAMES.forEach((gm,i)=>{const y=62+i*40,on=i===ui.sel;RR(26,y,W-52,34,8,on?'#ffe0ec':'#fff',on?'#ff5a8b':'#d8d0e8');gameIcon(gm.id,46,y+17);txt(gm.n,66,y+15,'#2b2440',11,'left');txt(gm.d,66,y+28,'#8a80a8',8,'left');txt('★'+(S.best[gm.id]||0),W-34,y+15,'#e0a020',9,'right')});
      txt('▲▼ choose  A play  B back',W/2,H-16,'#8a80a8',10)}
    if(sc==='care'){panel(16,50,W-32,H-62,'CARE');careList().forEach((c,i)=>{const y=62+i*40,on=i===ui.sel;RR(26,y,W-52,34,8,on?'#ffe0ec':'#fff',on?'#ff5a8b':'#d8d0e8');
        if(c.id==='cuddle')heartS(44,y+17,1.6);if(c.id==='teeth')toothI(44,y+17,S.plaque);if(c.id==='groom')txt('✂',44,y+22,'#e0457b',14);
        txt(c.n,60,y+15,'#2b2440',c.n.length>12?9:11,'left');const info=c.id==='teeth'?'Plaque '+Math.round(S.plaque)+'%':c.id==='groom'?'Coat '+Math.round(S.coat)+'% — '+c.d:c.d;txt(info,60,y+28,'#8a80a8',8,'left')});
      txt('▲▼ choose  A go  B back',W/2,H-16,'#8a80a8',10)}
    if(sc==='tricks'){panel(16,50,W-32,H-62,'TRICKS');TRICKS.forEach((tr,i)=>{const y=60+i*26,on=i===ui.sel,p=S.tricks[tr.id],done=p>=TUNE.trickNeed;RR(26,y,W-52,22,7,on?'#ffe0ec':'#fff',on?'#ff5a8b':'#d8d0e8');
        txt(tr.n,36,y+15,'#2b2440',10,'left');for(let j=0;j<TUNE.trickNeed;j++)star(108+j*11,y+11,4.5,j<p?'#ffc83a':'#a99fc8');txt(done?'DO IT':'TEACH',W-34,y+15,done?'#2a9a50':'#e0457b',9,'right')});
      txt('A teach / perform  B back',W/2,H-16,'#8a80a8',10)}
    if(sc==='pause'){R(0,0,W,H,'#2b244099');if(LOGO.ok)g.drawImage(LOGO.img,W/2-32,4,64,36);panel(50,42,W-100,PAUSE.length*24+20,'MENU');PAUSE.forEach((c,i)=>{const y=54+i*24,on=i===ui.sel;RR(60,y,W-120,20,8,on?'#ff5a8b':'#fff',on?null:'#d8d0e8');txt(c,W/2,y+14,on?'#fff':'#5b4b8a',10)});
      const age=Math.floor((now()-(S.born||now()))/DAY);txt('Age '+age+' day'+(age===1?'':'s')+(GROW[S.stage]?' • grows in ~'+daysLeft()+' days':''),W/2,H-24,'#fff',9);txt('A choose  B back',W/2,H-10,'#fff',9)}
    if(sc==='teach'){const m=ui.mg;teachTick();if(ui.mg){panel(20,46,W-40,40,'TEACH '+m.tr.n);
      txt(m.cue?'Press it NOW!':'Watch for the cue…',W/2,66,'#5b4b8a',10);for(let j=0;j<TUNE.trickNeed;j++)star(W/2-24+j*12,78,5,j<S.tricks[m.tr.id]?'#ffc83a':'#a99fc8');
      if(m.cue){const sz=1+Math.sin(t/3)*.08;g.save();g.translate(W/2+70,110);g.scale(sz,sz);RR(-18,-18,36,36,10,'#ff5a8b','#2b2440');otxt({a:'A',up:'▲',down:'▼',left:'◀',right:'▶'}[m.cue],0,7,'#fff',20);g.restore()}
      if(m.resT>0)otxt(m.res,W/2,40+m.resT/2+60,m.res==='GOOD!'?'#5ad07a':'#ff5a7a',16);txt('B stop',W/2,H-8,'#fff',9)}}
  }
  ui.fx=ui.fx.filter(f=>{f.x+=f.vx;f.y+=f.vy;f.vy+=f.ch==='shell'||f.ch==='hair'?.12:0;f.t--;g.globalAlpha=Math.min(1,f.t/20);
    if(f.ch==='heart')heartS(f.x,f.y,1.2);else if(f.ch==='shell')E(f.x,f.y,3,2,'#f4e8d0');else if(f.ch==='hair')E(f.x,f.y,3,1,BREEDS[S.breed||'lab'].c,f.t/5);else if(f.ch==='bubble'){g.strokeStyle='#5ab0ff';g.lineWidth=1;g.beginPath();g.arc(f.x,f.y,2.5,0,7);g.stroke()}else star(f.x,f.y,4,['#ffd84a','#ff5a8b','#a07cff'][f.t%3]);g.globalAlpha=1;return f.t>0});
  if(ui.msgT>0){ui.msgT--;const y=sc==='main'?40:H-40;RR(14,y,W-28,20,10,'#fff','#2b2440');txt(ui.msg.slice(0,40),W/2,y+14,'#2b2440',9)}
  if(saveFlash>0){saveFlash--;g.globalAlpha=Math.min(1,saveFlash/15);RR(W/2-24,36,48,13,6,'#5ad07a');txt('SAVED',W/2,46,'#fff',8);g.globalAlpha=1}
  if(ui.modal)drawModal(t);requestAnimationFrame(frame)}
function gameIcon(id,x,y){if(id==='fetch')toyIcon('ball',x,y,1.2);
  if(id==='simon'){['#ff5a7a','#5ad07a','#5ab0ff','#ffc83a'].forEach((c,i)=>RR(x-9+(i%2)*10,y-9+Math.floor(i/2)*10,8,8,2,c))}
  if(id==='dash'){g.fillStyle='#ff5a8b';g.beginPath();g.moveTo(x-8,y-8);g.lineTo(x+9,y);g.lineTo(x-8,y+8);g.fill()}}
function drawGame(t){const m=ui.mg;gameTick();
  if(m.id==='fetch'){bg(false);const bx=20+m.ball*200,by=150-Math.sin(m.ball*Math.PI)*90;
    RR(20+(m.zone-.06)*200,190,24,8,4,'#ff5a8b88');RR(20+(m.zone-.025)*200,190,10,8,4,'#ffc83a');
    E(20+m.zone*200,150-Math.sin(m.zone*Math.PI)*90,14,14,'#ffffff55');
    const px=m.state==='caught'?bx:20+m.zone*200;dogAt(px,186,1.1,m.state==='fly'?'trot':'happy',0,1);
    if(m.state==='fly'||m.state==='miss')toyIcon('ball',bx,by,.9);otxt('A when ball is over the glow!',W/2,40,'#fff',10)}
  if(m.id==='simon'){R(0,0,W,H,'#3a3360');const C=['#ff5a7a','#5ad07a','#5ab0ff','#ffc83a'],pos=[[W/2,62],[W/2+54,116],[W/2,170],[W/2-54,116]],lab=['▲','▶','▼','◀'];
    pos.forEach(([x,y],i)=>{const on=m.lit===i&&m.litT>0;E(x,y+3,22,22,'#0005');E(x,y,on?24:20,on?24:20,on?'#fff':C[i]);E(x,y,on?20:16,on?20:16,on?C[i]:mix(C[i],'#000000',.25));otxt(lab[i],x,y+6,'#fff',13)});
    g.save();g.translate(W/2,140);g.scale(.8,.8);dog(0,0,S.breed,'puppy',{pose:m.mode==='input'?'sit':'happy',mood:'happy'});g.restore();otxt(m.mode==='show'?'WATCH…':m.mode==='input'?'YOUR TURN!':'',W/2,210,'#fff',11)}
  if(m.id==='dash'){const sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#ffb07a');sky.addColorStop(1,'#ffe0b0');g.fillStyle=sky;g.fillRect(0,0,W,H);
    for(let i=0;i<4;i++)E(((i*80-m.dist*.3)%(W+80)+W+80)%(W+80)-40,96,50,24,'#e89a70');
    [0,1,2].forEach(l=>{R(0,110+l*32,W,32,l%2?'#8fd06e':'#9de07a');for(let x=-((m.dist)%30);x<W;x+=30)R(x,110+l*32+30,14,2,'#6cbf50')});
    m.obs.forEach(o=>{const y=126+o.lane*32;if(o.type==='rock'){E(o.x,y+6,13,9,'#7a7a8a');E(o.x-3,y+3,6,4,'#a0a0b0')}else heartS(o.x,y,1.8)});
    if(!(m.hit>0&&t%6<3)){g.save();g.translate(46,126+m.lane*32+14);g.scale(.7,.7);dog(0,0,S.breed,'puppy',{pose:'trot',mood:'happy'});g.restore()}}
  chromeGame(m);if(m.resT>0)otxt(m.res,W/2,64,'#fff',18);
  if(m.over){R(0,0,W,H,'#0008');panel(30,60,W-60,90,'DONE!');txt('Score '+m.score,W/2,100,'#2b2440',16);txt('Best '+Math.max(m.score,S.best[m.id]||0),W/2,120,'#8a80a8',10);txt('A to collect joy & coins',W/2,140,'#e0457b',10)}}
function chromeGame(m){R(0,0,W,24,'#2b2440cc');txt(GAMES.find(x=>x.id===m.id).n,8,16,'#fff',11,'left');txt('★ '+m.score,W/2,16,'#ffc83a',11);const left=Math.max(0,Math.ceil((m.dur-m.t)/60));txt(left+'s',W-8,16,'#fff',11,'right');if(m.id==='simon')txt('B quit',W-8,H-6,'#fff8',8,'right')}
window.__pp={loadArt,IMG,openMap,owTry,get ow(){return ui.ow},input,get S(){return S},set S(v){S=v},ui,DB,save,loadPet,startWalk,careAct};
fit();frame();

const GAME_VER=15;
function hardReload(){const go=()=>{const u=new URL(location.href);u.searchParams.set('r',Date.now());location.replace(u.toString())};
try{const p=[];if(window.caches)p.push(caches.keys().then(k=>Promise.all(k.map(x=>caches.delete(x)))));if(navigator.serviceWorker)p.push(navigator.serviceWorker.getRegistrations().then(r=>Promise.all(r.map(x=>x.unregister()))));Promise.all(p).then(go,go);setTimeout(go,1500)}catch(e){go()}}
fetch('version.json?check='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(j=>{if(j.v>GAME_VER){const b=document.createElement('div');b.textContent='New version — tap here to update';b.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99;background:#ffd84a;color:#222;font:bold 14px sans-serif;text-align:center;padding:10px';b.onclick=hardReload;document.body.appendChild(b)}}).catch(()=>{});
