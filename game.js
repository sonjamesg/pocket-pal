// ===== Pocket Pal v2 =====
const W=240,H=216;
const TUNE={hungerDrain:1.2,happyDrain:1.0,tickMs:10000,petAmt:8,
  stageReq:{baby:[6,60],toddler:[10,90],teen:[14,120],adult:[18,180]},hatchTaps:6,needsCareAt:15,trickNeed:5};
const STAGES=['egg','baby','toddler','teen','adult','old'];
const SPECIES={
  dog:{c:'#d39a5a',d:'#8a5a30',l:'#f3dcc0',n:'DOG'},
  horse:{c:'#b87a48',d:'#4a2c18',l:'#e8c8a8',n:'HORSE'},
  rabbit:{c:'#f4efe8',d:'#cfc4ba',l:'#ffffff',n:'RABBIT'}};
const FOODS=[
  {id:'kibble',n:'KIBBLE',v:20,love:['dog']},
  {id:'bone',n:'BONE',v:22,love:['dog']},
  {id:'carrot',n:'CARROT',v:20,love:['rabbit','horse']},
  {id:'lettuce',n:'LETTUCE',v:18,love:['rabbit']},
  {id:'apple',n:'APPLE',v:20,love:['horse']},
  {id:'hay',n:'HAY',v:24,love:['horse']},
  {id:'berries',n:'BERRIES',v:14,love:['rabbit']},
  {id:'treat',n:'TREAT',v:10,love:['dog','horse','rabbit'],joy:10}];
const GAMES=[{id:'fetch',n:'FETCH',d:'Tap A when the ball hits the zone'},{id:'simon',n:'MEMORY',d:'Repeat the pad pattern'},{id:'dash',n:'DASH',d:'▲▼ dodge rocks, grab hearts'}];
const TRICKS=[{id:'sit',n:'SIT'},{id:'twirl',n:'TWIRL'},{id:'dance',n:'DANCE'},{id:'lay',n:'LAY DOWN'},{id:'roll',n:'ROLL OVER'}];
const cv=document.getElementById('screen'),g=cv.getContext('2d');
const SAVE='pocketpal_v2';
let S=load();
let ui={sel:0,menu:0,anim:0,msg:'',msgT:0,fx:[],hatch:0,shake:0,pose:'idle',poseT:0,mg:null};
function load(){try{let s=JSON.parse(localStorage.getItem(SAVE));if(s)return fix(s);
  const o=JSON.parse(localStorage.getItem('pocketpal_v1'));if(o){if(o.scene!=='main'&&o.scene!=='egg')return{scene:'title'};return fix(o)}}catch(e){}return{scene:'title'}}
function fix(s){s.tricks=s.tricks||{};TRICKS.forEach(t=>{if(s.tricks[t.id]==null)s.tricks[t.id]=0});s.best=s.best||{};if(s.scene!=='egg'&&s.scene!=='title'&&s.scene!=='pick')s.scene='main';return s}
function save(){localStorage.setItem(SAVE,JSON.stringify(S))}
const now=()=>Date.now(),clamp=v=>Math.max(0,Math.min(100,v));
function say(m,t=110){ui.msg=m;ui.msgT=t}
if(S.scene==='main'){const n=Math.min(30,Math.floor((now()-(S.last||now()))/TUNE.tickMs));for(let i=0;i<n;i++)drain()}
function drain(){S.hunger=clamp(S.hunger-TUNE.hungerDrain*(S.stage==='old'?1.3:1));S.happy=clamp(S.happy-TUNE.happyDrain*(S.hunger<30?2:1));S.last=now()}
setInterval(()=>{if(S.scene==='main'&&!S.sleep&&!ui.mg){drain();checkGrow();save()}},TUNE.tickMs);
function checkGrow(){const r=TUNE.stageReq[S.stage];if(!r)return;
  if(S.care>=r[0]&&(now()-S.stageStart)/1000>=r[1]&&S.hunger>30&&S.happy>30){S.stage=STAGES[STAGES.indexOf(S.stage)+1];S.care=0;S.stageStart=now();say(S.name+(S.stage==='old'?' is now a wise elder!':' grew into a'+(S.stage==='adult'?'n ':' ')+S.stage+'!'));sparkle(24);save()}}
function sparkle(n,x=W/2,y=110){for(let i=0;i<n;i++)ui.fx.push({x:x+Math.random()*60-30,y,vx:Math.random()*3-1.5,vy:-Math.random()*3-.5,t:50,ch:'star'})}
function hearts(n){for(let j=0;j<n;j++)ui.fx.push({x:100+j*12,y:90,vx:Math.random()-.5,vy:-.8,t:50,ch:'heart'})}
function setPose(p,t){ui.pose=p;ui.poseT=t}
const ACTIONS=['FEED','PLAY','TRICKS','PET','SLEEP'];

// ===== input =====
function input(k){
  const sc=S.scene;
  if(sc==='title'){if(k==='a'||k==='start'){let n=prompt('Name your pet (optional):','')||'';n=n.trim().slice(0,8).toUpperCase()||'PIP';S=fix({scene:'pick',name:n});ui.sel=0}}
  else if(sc==='pick'){const keys=Object.keys(SPECIES);
    if(k==='left')ui.sel=(ui.sel+2)%3;if(k==='right')ui.sel=(ui.sel+1)%3;
    if(k==='a'||k==='start'){S.species=keys[ui.sel];S.scene='egg';ui.hatch=0;save()}if(k==='b')S={scene:'title'}}
  else if(sc==='egg'){if(k==='a'){ui.hatch++;ui.shake=12;for(let i=0;i<4;i++)ui.fx.push({x:W/2+Math.random()*30-15,y:100,vx:Math.random()*2-1,vy:-Math.random()*2,t:25,ch:'shell'});
    if(ui.hatch>=TUNE.hatchTaps){Object.assign(S,{scene:'main',stage:'baby',hunger:70,happy:70,care:0,stageStart:now(),born:now(),last:now(),sleep:false});sparkle(30);say("It's a baby "+SPECIES[S.species].n.toLowerCase()+'!');save()}}}
  else if(sc==='main'){
    if(S.sleep){if(k==='a'||k==='b'){S.sleep=false;say('Good morning!');save()}return}
    const n=ACTIONS.length;
    if(k==='left')ui.menu=(ui.menu+n-1)%n;if(k==='right')ui.menu=(ui.menu+1)%n;
    if(k==='a')openAct(ui.menu);if(k==='b'){ui.menu=0;openAct(0)}
    if(k==='select'&&confirm('Start over with a new egg?')){localStorage.removeItem(SAVE);localStorage.removeItem('pocketpal_v1');S={scene:'title'}}
    if(k==='start')say(`${S.name} • ${S.stage.toUpperCase()} • tricks ${learned().length}/5`);
  }
  else if(sc==='food'){const n=FOODS.length;
    if(k==='left')ui.sel=(ui.sel+n-1)%n;if(k==='right')ui.sel=(ui.sel+1)%n;if(k==='up')ui.sel=(ui.sel+n-4)%n;if(k==='down')ui.sel=(ui.sel+4)%n;
    if(k==='b')S.scene='main';if(k==='a')feed(FOODS[ui.sel])}
  else if(sc==='games'){if(k==='up')ui.sel=(ui.sel+2)%3;if(k==='down')ui.sel=(ui.sel+1)%3;if(k==='b')S.scene='main';
    if(k==='a'){if(S.hunger<12){say('Too hungry to play!');S.scene='main';return}startGame(GAMES[ui.sel].id)}}
  else if(sc==='game')gameInput(k);
  else if(sc==='tricks'){const n=TRICKS.length;if(k==='up')ui.sel=(ui.sel+n-1)%n;if(k==='down')ui.sel=(ui.sel+1)%n;if(k==='b')S.scene='main';
    const tr=TRICKS[ui.sel];
    if(k==='a'){if(S.tricks[tr.id]>=TUNE.trickNeed)perform(tr);else startTeach(tr)}
    if(k==='right'&&S.tricks[tr.id]<TUNE.trickNeed)startTeach(tr)}
  else if(sc==='teach')teachInput(k);
}
function openAct(i){const a=ACTIONS[i];
  if(a==='FEED'){S.scene='food';ui.sel=0}
  if(a==='PLAY'){S.scene='games';ui.sel=0}
  if(a==='TRICKS'){S.scene='tricks';ui.sel=0}
  if(a==='PET'){S.happy=clamp(S.happy+TUNE.petAmt);if(Math.random()<.5)S.care++;hearts(5);setPose('happy',60);say(['Purr~','*nuzzle*','Love you!'][Math.floor(Math.random()*3)])}
  if(a==='SLEEP'){S.sleep=true;say('Zzz... (A to wake)')}
  checkGrow();save()}
function feed(f){if(S.hunger>=98){say('Too full!');S.happy=clamp(S.happy-3);return}
  const loved=f.love.includes(S.species)&&f.id!=='treat';const amt=loved?Math.round(f.v*1.5):f.v;
  S.hunger=clamp(S.hunger+amt);S.happy=clamp(S.happy+(f.joy||0)+(loved?6:0));S.care++;
  S.scene='main';setPose('eat',70);ui.eatFood=f.id;
  say(loved?`LOVES ${f.n}! +${amt}`:`${f.n} +${amt}`);if(loved)hearts(3);checkGrow();save()}
function learned(){return TRICKS.filter(t=>S.tricks[t.id]>=TUNE.trickNeed)}
function perform(tr){S.scene='main';setPose(tr.id,120);S.happy=clamp(S.happy+12);S.hunger=clamp(S.hunger-2);S.care++;sparkle(14);say(`${S.name} does ${tr.n}!`);checkGrow();save()}

// ===== trick teaching =====
const CUES=['a','up','down','left','right'];
function startTeach(tr){S.scene='teach';ui.mg={tr,cue:null,wait:40,win:0,hits:0,miss:0,round:0,res:null,resT:0}}
function teachInput(k){const m=ui.mg;if(k==='b'){endTeach();return}
  if(!m.cue)return;if(k===m.cue){m.hits++;S.tricks[m.tr.id]=Math.min(TUNE.trickNeed,S.tricks[m.tr.id]+1);m.res='GOOD!';hearts(2);setPose(m.tr.id,50)}else{m.miss++;m.res='OOPS';}
  m.resT=40;m.cue=null;m.wait=50;save();
  if(S.tricks[m.tr.id]>=TUNE.trickNeed){S.happy=clamp(S.happy+15);S.care+=2;sparkle(30);setPose(m.tr.id,120);say(`Learned ${m.tr.n}!`);S.scene='main';ui.mg=null;save()}}
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
  if(m.over){if(k==='a'||k==='b')endGame();return}
  if(k==='b'&&m.t>10){m.over=true;return}
  if(m.id==='fetch'&&k==='a'&&m.state==='fly'){const d=Math.abs(m.ball-m.zone);
    if(d<.06){m.score+=d<.025?3:2;m.res=d<.025?'PERFECT!':'NICE!';m.state='caught';setPose('happy',30)}else{m.res='MISS';m.state='miss'}m.resT=45;m.throws++}
  if(m.id==='simon'&&m.mode==='input'){const p=PADS.indexOf(k);if(p<0)return;m.lit=p;m.litT=12;
    if(p===m.seq[m.pos]){m.pos++;if(m.pos>=m.seq.length){m.score=m.seq.length;m.res='GREAT!';m.resT=40;m.mode='wait';m.waitT=45}}else{m.res='WRONG!';m.resT=60;m.over=true}}
  if(m.id==='dash'){if(k==='up')m.lane=Math.max(0,m.lane-1);if(k==='down')m.lane=Math.min(2,m.lane+1)}}
function gameTick(){const m=ui.mg;if(m.over)return;m.t++;if(m.resT>0)m.resT--;if(m.t>=m.dur){m.over=true;return}
  if(m.id==='fetch'){if(m.state==='fly'){m.ball+=m.spd/100;if(m.ball>1.05){m.state='miss';m.res='MISSED';m.resT=40;m.throws++}}
    else if(m.resT<=0){m.state='fly';m.ball=0;m.zone=.45+Math.random()*.45;m.spd=1.3+m.throws*.12+Math.random()*.5}}
  if(m.id==='simon'){if(m.litT>0)m.litT--;
    if(m.mode==='show'){if(--m.showT<=0){if(m.show<m.seq.length){m.lit=m.seq[m.show];m.litT=Math.max(14,28-m.seq.length*2);m.show++;m.showT=m.litT+10}else{m.mode='input';m.lit=-1}}}
    if(m.mode==='wait'&&--m.waitT<=0)addSimon(m)}
  if(m.id==='dash'){m.dist+=m.spd;m.spd=2+m.t/600;if(m.hit>0)m.hit--;
    if(m.t%Math.max(22,50-Math.floor(m.t/120))===0){m.obs.push({x:W+10,lane:Math.floor(Math.random()*3),type:Math.random()<.35?'heart':'rock'})}
    m.obs.forEach(o=>{o.x-=m.spd;if(!o.done&&o.lane===m.lane&&o.x<60&&o.x>34){o.done=true;if(o.type==='heart'){m.score+=2;m.res='+2';m.resT=20}else if(m.hit<=0){m.score=Math.max(0,m.score-1);m.hit=40;m.res='OUCH';m.resT=30}}});
    m.obs=m.obs.filter(o=>o.x>-20&&!(o.done&&o.type==='heart'));m.score+=m.t%60===0?1:0}}
function endGame(){const m=ui.mg;const joy=Math.min(35,8+m.score*3);S.happy=clamp(S.happy+joy);S.hunger=clamp(S.hunger-6);S.care++;
  const b=S.best[m.id]||0;if(m.score>b)S.best[m.id]=m.score;ui.mg=null;S.scene='main';setPose('happy',60);hearts(4);say(`Score ${m.score}! Joy +${joy}${m.score>b?' NEW BEST':''}`);checkGrow();save()}

// ===== controls =====
document.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;b.addEventListener('touchstart',e=>{e.preventDefault();b.classList.add('pressed');input(k);navigator.vibrate&&navigator.vibrate(10)},{passive:false});b.addEventListener('touchend',()=>b.classList.remove('pressed'));b.addEventListener('mousedown',e=>{if(!('ontouchstart' in window))input(k)})});
const KM={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',z:'b',x:'a',Enter:'start',Shift:'select'};
addEventListener('keydown',e=>{if(KM[e.key]){e.preventDefault();input(KM[e.key])}});
document.addEventListener('gesturestart',e=>e.preventDefault());

// ===== drawing helpers =====
const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
function E(x,y,rx,ry,c,rot=0){g.fillStyle=c;g.beginPath();g.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot,0,7);g.fill()}
function RR(x,y,w,h,r,c,stroke){g.beginPath();g.roundRect(x,y,w,h,r);if(c){g.fillStyle=c;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=1.5;g.stroke()}}
function txt(t,x,y,c='#2b2440',s=10,al='center'){g.fillStyle=c;g.font=`800 ${s}px system-ui,sans-serif`;g.textAlign=al;g.fillText(t,x,y)}
function otxt(t,x,y,c,s,al='center'){g.font=`800 ${s}px system-ui,sans-serif`;g.textAlign=al;g.lineWidth=3;g.strokeStyle='#2b2440';g.strokeText(t,x,y);g.fillStyle=c;g.fillText(t,x,y)}
function heartS(x,y,s=1,c='#ff4f8b'){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=c;g.beginPath();g.moveTo(0,3);g.bezierCurveTo(-7,-3,-3,-8,0,-4);g.bezierCurveTo(3,-8,7,-3,0,3);g.fill();g.restore()}
function star(x,y,r,c){g.fillStyle=c;g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.fill()}
function mix(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function foodIcon(id,x,y,s=1){g.save();g.translate(x,y);g.scale(s,s);
  if(id==='kibble'){E(0,4,10,5,'#c33');E(0,2,9,4,'#e55');E(-3,0,3,2,'#a6683a');E(2,-1,3,2,'#8a5030');E(4,1,3,2,'#b07040')}
  if(id==='bone'){R(-7,-2,14,4,'#f4ead8');[[-8,-3],[-8,3],[8,-3],[8,3]].forEach(([a,b])=>E(a,b,3.5,3.5,'#f4ead8'))}
  if(id==='carrot'){g.fillStyle='#f38a24';g.beginPath();g.moveTo(-3,-5);g.lineTo(3,-5);g.lineTo(0,9);g.fill();E(-2,-7,2,4,'#4caf50',-.4);E(2,-7,2,4,'#4caf50',.4)}
  if(id==='lettuce'){E(0,2,9,7,'#7cc64a');E(-3,0,5,5,'#a6e06a');E(3,1,5,5,'#95d85a');E(0,3,2,4,'#e8f8c8')}
  if(id==='apple'){E(0,2,8,7,'#e23b3b');E(-3,0,2,2,'#ff8a8a');R(-.5,-8,1.5,4,'#6b3e1e');E(3,-6,3,1.5,'#4caf50',-.5)}
  if(id==='hay'){for(let i=-6;i<=6;i+=2){g.strokeStyle=i%4?'#e8c24a':'#c9a030';g.lineWidth=1.5;g.beginPath();g.moveTo(i,8);g.lineTo(i*0.6+(i%3),-7);g.stroke()}R(-7,1,14,3,'#a0522d')}
  if(id==='berries'){E(-4,2,4,4,'#5b3fc0');E(3,3,4,4,'#6b4fd0');E(0,-3,4,4,'#4b2fa0');E(0,-7,3,1.5,'#4caf50')}
  if(id==='treat'){E(0,0,8,8,'#d9a05b');E(0,0,6.5,6.5,'#e8b878');[[-3,-2],[2,-3],[0,2],[3,2]].forEach(([a,b])=>E(a,b,1.3,1.3,'#5a3010'))}
  g.restore()}

// ===== background =====
function bg(night,sp){const sky=g.createLinearGradient(0,0,0,150);
  if(night){sky.addColorStop(0,'#1b1d4a');sky.addColorStop(1,'#4a3f7a')}else{sky.addColorStop(0,'#7ec8ff');sky.addColorStop(1,'#d8f0ff')}
  g.fillStyle=sky;g.fillRect(0,0,W,H);const t=ui.anim;
  if(night){for(let i=0;i<25;i++){const tw=(t+i*13)%80<60;if(tw)R((i*53)%W,(i*29)%100,1.5,1.5,'#fff')}E(200,28,12,12,'#fff4c0');E(205,24,10,10,'#2b2d5a')}
  else{E(204,30,15,15,'#ffe36a');E(204,30,20,20,'#ffe36a33');[[(t*.15)%(W+60)-30,30],[((t*.1)+120)%(W+60)-30,52]].forEach(([x,y])=>{E(x,y,16,7,'#fff');E(x+10,y-5,10,8,'#fff');E(x-8,y-2,9,6,'#fff')})}
  E(60,150,110,40,night?'#2c4a48':'#8fd06e');E(200,155,100,38,night?'#28423e':'#7fc260');
  const gr=g.createLinearGradient(0,140,0,H);gr.addColorStop(0,night?'#2f5a3e':'#9de07a');gr.addColorStop(1,night?'#1f3a2a':'#6cbf50');g.fillStyle=gr;g.fillRect(0,140,W,H-140);
  for(let x=4;x<W;x+=14){g.strokeStyle=night?'#26492f':'#5aa848';g.lineWidth=1;g.beginPath();g.moveTo(x,148+(x%5));g.lineTo(x+2,143+(x%5));g.lineTo(x+4,148+(x%5));g.stroke()}
  if(!night)[[20,170],[210,180],[40,195]].forEach(([x,y],i)=>{E(x,y,2.5,2.5,['#ff7ab0','#ffe14a','#fff'][i]);E(x,y,1,1,'#f90')});
  if(sp==='dog'){RR(178,108,46,38,3,night?'#7a3a3a':'#d65a4a');g.fillStyle=night?'#5a2a2a':'#a83a30';g.beginPath();g.moveTo(172,110);g.lineTo(201,88);g.lineTo(230,110);g.fill();RR(192,120,18,26,9,'#3a2020')}
  if(sp==='horse'){g.strokeStyle=night?'#6a5038':'#b88a58';g.lineWidth=4;for(let x=160;x<W;x+=22){g.beginPath();g.moveTo(x,148);g.lineTo(x,118);g.stroke()}g.beginPath();g.moveTo(156,126);g.lineTo(W,126);g.moveTo(156,138);g.lineTo(W,138);g.stroke();E(30,140,18,10,'#e8c24a');E(30,134,14,8,'#f0d060')}
  if(sp==='rabbit'){E(205,146,26,14,night?'#4a3a2a':'#8a6a40');E(205,148,12,8,'#2a1a10');E(25,140,6,6,'#7cc64a');E(35,142,6,6,'#7cc64a')}}

// ===== pet =====
function pet(cx,cy,sp,stage,mood,t,pose='idle',pt=0){
  const P=SPECIES[sp];let c=P.c,d=P.d,l=P.l;if(stage==='old'){c=mix(c,'#b8b8b8',.4);d=mix(d,'#999999',.4)}
  const sc={baby:.6,toddler:.75,teen:.9,adult:1.05,old:1}[stage]||1, hs={baby:1.35,toddler:1.25,teen:1.1,adult:1,old:1}[stage]||1;
  const sleeping=S.sleep&&pose==='idle';let bob=sleeping?Math.sin(t/30)*1:Math.sin(t/9)*(mood==='sad'?.6:2);
  g.save();g.translate(cx,cy);
  E(0,30*sc,30*sc,5*sc,'#0003');
  let rot=0,sx=1,sy=1,dy=0,dx=0;const T=ui.anim;
  if(pose==='happy'){dy=-Math.abs(Math.sin(T/5))*10}
  if(pose==='twirl'){sx=Math.cos(T/5)}
  if(pose==='dance'){rot=Math.sin(T/6)*.25;dy=-Math.abs(Math.sin(T/6))*8;dx=Math.sin(T/12)*8}
  if(pose==='roll'){const p=(pt%60)/60;rot=p*Math.PI*2;dy=-Math.sin(p*Math.PI)*14}
  if(pose==='walk'){dy=-Math.abs(Math.sin(T/4))*3}
  g.translate(dx,bob+dy);g.rotate(rot);g.scale(sc*sx,sc*sy);
  const sit=pose==='sit',lay=pose==='lay'||sleeping||pose==='roll';
  const by=lay?14:sit?6:0, legLen=lay?0:sit?6:14;
  // tail
  const wag=Math.sin(T/(mood==='happy'?3:8))*(mood==='sad'?.1:.5);
  if(sp==='dog'){g.save();g.translate(-22,by-2);g.rotate(-.8+wag);E(0,-8,4,10,c);E(0,-16,3,4,l);g.restore()}
  if(sp==='horse'){g.save();g.translate(-24,by);g.rotate(.3+wag*.4);E(-2,10,6,16,d);g.restore()}
  if(sp==='rabbit'){E(-24,by+4,8,8,'#fff');E(-25,by+2,5,5,'#fafafa')}
  // legs
  if(!lay){const step=pose==='walk'?Math.sin(T/4)*3:0;[[-14,1],[-6,-1],[6,1],[14,-1]].forEach(([x,ph])=>{RR(x-4,by+6,8,legLen+(sit&&Math.abs(x)>10?-4:0)+ph*step*.3,4,d);RR(x-4.5,by+4+legLen-2,9,5,3,sp==='horse'?'#3a2a20':mix(d,'#000000',.2))})}
  else{[[-18,0],[16,0]].forEach(([x])=>E(x,by+12,9,5,d))}
  // body
  E(0,by+4,lay?30:24,lay?13:sit?18:16,c);E(2,by+8,lay?18:14,lay?7:10,l);
  // head
  const hx=lay?16:12,hy=(lay?-2:sit?-16:-14)+(pose==='eat'?Math.abs(Math.sin(T/5))*8+6:0);
  g.save();g.translate(hx,hy);g.scale(hs,hs);
  if(sp==='dog'){E(-12,-2,6,12,d,.3);E(12,-2,6,12,d,-.3);E(0,0,15,14,c);E(0,7,9,7,l);E(0,4,3.5,2.5,'#2b2020')}
  if(sp==='horse'){E(-8,-15,4,9,c,-.2);E(8,-15,4,9,c,.2);E(-8,-14,2,5,'#e8a0a0',-.2);E(8,-14,2,5,'#e8a0a0',.2);E(0,0,13,15,c);E(0,10,10,8,l);E(-4,10,1.5,2,'#5a3a2a');E(4,10,1.5,2,'#5a3a2a');
    for(let i=-1;i<=1;i++)E(i*5,-13,5,6,d);E(-14,4,4,12,d,.2)}
  if(sp==='rabbit'){const ed=mood==='sad'?.6:0;g.save();g.rotate(-.15-ed);E(-6,-24,5,15,c);E(-6,-24,2.5,11,'#ffc0d0');g.restore();g.save();g.rotate(.15+ed);E(6,-24,5,15,c);E(6,-24,2.5,11,'#ffc0d0');g.restore();
    E(0,0,14,13,c);E(0,6,7,5,'#fff');E(0,3,2.5,1.8,'#ff8fa8');R(-1.5,8,3,3,'#fff')}
  // eyes
  const blink=t%150<6||sleeping;const ex=6,ey=-3;
  [-ex,ex].forEach(x=>{if(blink||pose==='happy'){g.strokeStyle='#2b2020';g.lineWidth=1.6;g.beginPath();if(sleeping||blink)g.arc(x,ey,3,.2,Math.PI-.2);else g.arc(x,ey+2,3,Math.PI+.3,-.3);g.stroke()}
    else{E(x,ey,3.4,4,'#2b2020');E(x+1,ey-1.5,1.3,1.3,'#fff');E(x-1,ey+1.5,.7,.7,'#fff')}});
  if(stage==='old'){g.strokeStyle='#555';g.lineWidth=1;[-ex,ex].forEach(x=>{g.beginPath();g.arc(x,ey,5,0,7);g.stroke()});g.beginPath();g.moveTo(-1,ey);g.lineTo(1,ey);g.stroke()}
  E(-10,4,3,2,'#ff9ab0aa');E(10,4,3,2,'#ff9ab0aa');
  // mouth
  const my=sp==='horse'?14:sp==='rabbit'?11:10;g.strokeStyle='#2b2020';g.lineWidth=1.3;g.beginPath();
  if(pose==='eat'&&T%20<10){E(0,my,3,2.5,'#7a2a30')}
  else if(mood==='sad'){g.arc(0,my+3,3,Math.PI+.4,-.4)}else if(mood==='happy'||pose!=='idle'){g.arc(0,my-1,3.5,.3,Math.PI-.3)}else{g.moveTo(-2,my);g.lineTo(2,my)}g.stroke();
  if(mood==='sad'&&!sleeping&&t%90<60)E(ex+1,ey+6+(t%60)/10,1.5,2,'#5ab0ff');
  if(stage==='baby'){E(0,-14,2,3,d)}
  g.restore();g.restore();
  if(pose==='eat'&&ui.eatFood)foodIcon(ui.eatFood,cx+24*sc,cy+20,1-(pt%70)/140)}
function egg(cx,cy,sp,shake,cracks){const o=shake?Math.sin(ui.anim*1.3)*3:0;g.save();g.translate(cx,cy);g.rotate(o*.03);
  E(0,30,22,5,'#0003');const gr=g.createRadialGradient(-6,-10,4,0,0,34);gr.addColorStop(0,'#fffef8');gr.addColorStop(1,'#ecdcc0');
  g.fillStyle=gr;g.beginPath();g.ellipse(0,2,22,28,0,0,7);g.fill();
  [[-8,-6,5],[9,4,4],[-3,14,4.5],[8,-14,3],[-12,8,3]].forEach(([x,y,r])=>E(x,y,r,r*.8,SPECIES[sp].d+'aa'));
  g.strokeStyle='#5a4a3a';g.lineWidth=1.5;const cr=[[-14,-2,-8,-6,-4,0,2,-5],[2,-5,7,1,12,-4,16,0],[-10,10,-4,6,2,11,8,6]];
  for(let i=0;i<Math.min(cracks,6);i++){const a=cr[i%3];g.beginPath();g.moveTo(a[0],a[1]+(i>2?8:0));for(let j=2;j<8;j+=2)g.lineTo(a[j],a[j+1]+(i>2?8:0));g.stroke()}
  g.restore()}

// ===== UI pieces =====
function panel(x,y,w,h,title){RR(x+2,y+3,w,h,8,'#0004');RR(x,y,w,h,8,'#fff8ee','#2b2440');if(title){RR(x+8,y-7,title.length*7+14,14,7,'#5b4b8a');txt(title,x+15,y+4,'#fff',9,'left')}}
function bar(x,y,v,col,label,icon){RR(x,y,74,11,5,'#2b2440');const w=Math.max(0,68*v/100);if(w>1){const gr=g.createLinearGradient(0,y,0,y+11);gr.addColorStop(0,'#fff');gr.addColorStop(.3,v<25?'#ff5a7a':col);gr.addColorStop(1,mix(v<25?'#ff5a7a':col,'#000000',.25));RR(x+3,y+2,w,7,3.5,gr)}
  if(icon==='food')foodIcon('apple',x-8,y+5,.6);else heartS(x-8,y+5,.9);}
function chrome(){R(0,0,W,30,'#ffffffcc');R(0,30,W,1,'#2b244033');bar(16,4,S.hunger,'#ffa53f','',('food'));bar(16,17,S.happy,'#5ad07a','','joy');
  txt(S.name,W-6,13,'#5b4b8a',11,'right');RR(W-60,17,54,11,5,'#ff5a8b');txt(S.stage.toUpperCase(),W-33,26,'#fff',8)}

function frame(){ui.anim++;const t=ui.anim;g.clearRect(0,0,W,H);if(ui.poseT>0){ui.poseT--;if(!ui.poseT)ui.pose='idle'}
  const sc=S.scene;
  if(sc==='title'){bg(false,'dog');otxt('POCKET PAL',W/2,44,'#ffe36a',26);egg(W/2,110,['dog','horse','rabbit'][Math.floor(t/90)%3],t%90<15,0);if(t%60<40)otxt('PRESS A TO START',W/2,186,'#fff',12)}
  else if(sc==='pick'){bg(false,Object.keys(SPECIES)[ui.sel]);otxt('CHOOSE YOUR PAL',W/2,24,'#fff',15);
    Object.keys(SPECIES).forEach((sp,i)=>{const x=42+i*78,on=i===ui.sel;RR(x-34,40,68,112,10,on?'#fffc':'#fff6',on?'#ff5a8b':null);pet(x,100+(on?0:0),sp,'baby',on?'happy':'ok',on?t:0);otxt(SPECIES[sp].n,x,144,on?'#ff5a8b':'#fff',11)});
    otxt('◀ ▶ choose   A select',W/2,196,'#fff',11)}
  else if(sc==='egg'){bg(false,S.species);otxt(S.name+"'S EGG",W/2,28,'#fff',15);if(ui.shake>0)ui.shake--;egg(W/2,112,S.species,ui.shake>0||t%100<12,ui.hatch);
    otxt('TAP A TO HATCH',W/2,172,'#fff',12);for(let i=0;i<TUNE.hatchTaps;i++)heartS(W/2-(TUNE.hatchTaps-1)*7+i*14,192,1,i<ui.hatch?'#ff4f8b':'#fff8')}
  else if(sc==='game')drawGame(t);
  else{ // main + overlays
    bg(S.sleep,S.species);const mood=(S.hunger<30||S.happy<30)?'sad':(S.hunger>60&&S.happy>60)?'happy':'ok';
    let pose=ui.pose;if(sc==='teach'&&ui.poseT===0)pose='idle';if(pose==='idle'&&!S.sleep&&t%600>520)pose='walk';
    g.save();g.translate(W/2-10,150);g.scale(1.5,1.5);pet(0,0,S.species,S.stage,mood,t,pose,ui.poseT);g.restore();
    if(S.sleep)[0,1,2].forEach(i=>{const p=((t+i*30)%90)/90;g.globalAlpha=1-p;otxt('Z',W/2+20+p*20+i*4,100-p*40,'#fff',9+i*3);g.globalAlpha=1});
    chrome();const r=TUNE.stageReq[S.stage];if(r){const p=Math.min(1,S.care/r[0])*.5+Math.min(1,(now()-S.stageStart)/1000/r[1])*.5;RR(6,33,W-12,4,2,'#0002');RR(6,33,(W-12)*p,4,2,'#a07cff')}
    if(sc==='main'){const low=S.hunger<TUNE.needsCareAt&&S.happy<TUNE.needsCareAt;
      if(low&&!S.sleep&&t%50<35){RR(40,68,160,16,8,'#ff4f7b');txt('NEEDS CARE! FEED ME',W/2,80,'#fff',10)}
      else if(mood==='sad'&&!S.sleep&&t%120<50){RR(W/2+20,60,58,16,8,'#fff','#2b2440');txt(S.hunger<30?'hungry…':'lonely…',W/2+49,72,'#5b4b8a',9)}
      R(0,H-28,W,28,'#2b2440');ACTIONS.forEach((a,i)=>{const x=24+i*48;if(i===ui.menu)RR(x-23,H-25,46,22,7,'#ff5a8b');txt(a,x,H-10,'#fff',9)})}
    if(sc==='food'){panel(10,46,W-20,H-56,'FEED');FOODS.forEach((f,i)=>{const x=20+(i%4)*52,y=58+Math.floor(i/4)*58,on=i===ui.sel,lv=f.love.includes(S.species)&&f.id!=='treat';
        RR(x,y,46,50,8,on?'#ffe0ec':'#fff',on?'#ff5a8b':'#d8d0e8');foodIcon(f.id,x+23,y+19,on?1.3+Math.sin(t/6)*.08:1.15);txt('+'+(lv?Math.round(f.v*1.5):f.v),x+23,y+45,lv?'#e0457b':'#5b4b8a',9);if(lv)heartS(x+39,y+8,.6)});
      const f=FOODS[ui.sel];txt(f.n+(f.love.includes(S.species)&&f.id!=='treat'?' ♥ favourite':f.joy?' +joy':''),W/2,186,'#2b2440',10);txt('✚ choose  A feed  B back',W/2,201,'#8a80a8',9)}
    if(sc==='games'){panel(16,50,W-32,H-62,'PLAY');GAMES.forEach((gm,i)=>{const y=62+i*40,on=i===ui.sel;RR(26,y,W-52,34,8,on?'#ffe0ec':'#fff',on?'#ff5a8b':'#d8d0e8');gameIcon(gm.id,46,y+17);txt(gm.n,66,y+15,'#2b2440',11,'left');txt(gm.d,66,y+28,'#8a80a8',8,'left');txt('★'+(S.best[gm.id]||0),W-34,y+15,'#e0a020',9,'right')});
      txt('▲▼ choose  A play  B back',W/2,H-16,'#8a80a8',9)}
    if(sc==='tricks'){panel(16,50,W-32,H-62,'TRICKS');TRICKS.forEach((tr,i)=>{const y=60+i*26,on=i===ui.sel,p=S.tricks[tr.id],done=p>=TUNE.trickNeed;RR(26,y,W-52,22,7,on?'#ffe0ec':'#fff',on?'#ff5a8b':'#d8d0e8');
        txt(tr.n,36,y+15,'#2b2440',10,'left');for(let j=0;j<TUNE.trickNeed;j++)star(130+j*12,y+11,5,j<p?'#ffc83a':'#ddd');txt(done?'DO IT':'TEACH',W-34,y+15,done?'#2a9a50':'#e0457b',9,'right')});
      txt('A teach / perform  B back',W/2,H-16,'#8a80a8',9)}
    if(sc==='teach'){const m=ui.mg;teachTick();if(!ui.mg){}else{panel(20,46,W-40,40,'TEACH '+m.tr.n);
      txt(m.cue?'Press it NOW!':'Watch for the cue…',W/2,66,'#5b4b8a',10);for(let j=0;j<TUNE.trickNeed;j++)star(W/2-24+j*12,78,5,j<S.tricks[m.tr.id]?'#ffc83a':'#ddd');
      if(m.cue){const sz=1+Math.sin(t/3)*.08;g.save();g.translate(W/2+50,110);g.scale(sz,sz);RR(-18,-18,36,36,10,'#ff5a8b','#2b2440');otxt({a:'A',up:'▲',down:'▼',left:'◀',right:'▶'}[m.cue],0,7,'#fff',20);g.restore();RR(W/2+30,132,40*(m.win/90),4,2,'#ff5a8b')}
      if(m.resT>0)otxt(m.res,W/2,40+m.resT/2+60,m.res==='GOOD!'?'#5ad07a':'#ff5a7a',16);txt('B stop',W/2,H-8,'#fff',9)}}
  }
  ui.fx=ui.fx.filter(f=>{f.x+=f.vx;f.y+=f.vy;f.vy+=f.ch==='shell'?.15:0;f.t--;g.globalAlpha=Math.min(1,f.t/20);
    if(f.ch==='heart')heartS(f.x,f.y,1.2);else if(f.ch==='shell')E(f.x,f.y,3,2,'#f4e8d0');else star(f.x,f.y,4,['#ffd84a','#ff5a8b','#a07cff'][f.t%3]);g.globalAlpha=1;return f.t>0});
  if(ui.msgT>0){ui.msgT--;const y=sc==='main'?42:H-40;RR(14,y,W-28,22,10,'#fff','#2b2440');txt(ui.msg.slice(0,36),W/2,y+15,'#2b2440',10)}
  document.getElementById('led').style.opacity=sc==='title'||sc==='pick'?.3:1;
  requestAnimationFrame(frame)}
function gameIcon(id,x,y){if(id==='fetch'){E(x,y,9,9,'#c8e83a');g.strokeStyle='#fff';g.lineWidth=1.5;g.beginPath();g.arc(x-9,y,8,-.9,.9);g.stroke();g.beginPath();g.arc(x+9,y,8,Math.PI-.9,Math.PI+.9);g.stroke()}
  if(id==='simon'){['#ff5a7a','#5ad07a','#5ab0ff','#ffc83a'].forEach((c,i)=>RR(x-9+(i%2)*10,y-9+Math.floor(i/2)*10,8,8,2,c))}
  if(id==='dash'){g.fillStyle='#ff5a8b';g.beginPath();g.moveTo(x-8,y-8);g.lineTo(x+9,y);g.lineTo(x-8,y+8);g.fill();R(x-12,y-6,3,2,'#5b4b8a');R(x-14,y,4,2,'#5b4b8a');R(x-12,y+5,3,2,'#5b4b8a')}}
function drawGame(t){const m=ui.mg;gameTick();
  if(m.id==='fetch'){bg(false,S.species);const bx=20+m.ball*200,by=150-Math.sin(m.ball*Math.PI)*90;
    RR(20+(m.zone-.06)*200,160,24,8,4,'#ff5a8b88');RR(20+(m.zone-.025)*200,160,10,8,4,'#ffc83a');RR(20,164,200,2,1,'#fff8');
    E(20+m.zone*200,150-Math.sin(m.zone*Math.PI)*90,14,14,'#ffffff55');
    const px=m.state==='caught'?bx:20+m.zone*200;pet(px,140,S.species,S.stage,'happy',t,m.state==='fly'?'walk':'happy',30);
    if(m.state==='fly'||m.state==='miss'){E(bx,by,6,6,'#c8e83a');g.strokeStyle='#fff';g.lineWidth=1;g.beginPath();g.arc(bx-6,by,5,-.9,.9);g.stroke()}
    otxt('A when ball is over the glow!',W/2,196,'#fff',10)}
  if(m.id==='simon'){R(0,0,W,H,'#3a3360');const C=['#ff5a7a','#5ad07a','#5ab0ff','#ffc83a'],pos=[[W/2,72],[W/2+44,116],[W/2,160],[W/2-44,116]],lab=['▲','▶','▼','◀'];
    pos.forEach(([x,y],i)=>{const on=m.lit===i&&m.litT>0;E(x,y+3,24,24,'#0005');E(x,y,on?26:22,on?26:22,on?'#fff':C[i]);E(x,y,on?22:18,on?22:18,on?C[i]:mix(C[i],'#000000',.25));otxt(lab[i],x,y+6,'#fff',14)});
    pet(W/2,128,S.species,'baby','happy',t,m.mode==='input'?'idle':'happy',10);otxt(m.mode==='show'?'WATCH…':m.mode==='input'?'YOUR TURN!':'',W/2,210,'#fff',11)}
  if(m.id==='dash'){const sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#ffb07a');sky.addColorStop(1,'#ffe0b0');g.fillStyle=sky;g.fillRect(0,0,W,H);
    for(let i=0;i<4;i++)E(((i*80-m.dist*.3)%(W+80)+W+80)%(W+80)-40,96,50,24,'#e89a70');
    [0,1,2].forEach(l=>{R(0,110+l*32,W,32,l%2?'#8fd06e':'#9de07a');for(let x=-((m.dist)%30);x<W;x+=30)R(x,110+l*32+30,14,2,'#6cbf50')});
    m.obs.forEach(o=>{const y=126+o.lane*32;if(o.type==='rock'){E(o.x,y+6,13,9,'#7a7a8a');E(o.x-3,y+3,6,4,'#a0a0b0')}else heartS(o.x,y,1.8)});
    if(!(m.hit>0&&t%6<3)){g.save();g.translate(46,126+m.lane*32+6);pet(0,0,S.species,'baby','happy',t,'walk');g.restore()}}
  chromeGame(m);
  if(m.resT>0)otxt(m.res,W/2,60,'#fff',18);
  if(m.over){R(0,0,W,H,'#0008');panel(30,60,W-60,90,'DONE!');txt('Score '+m.score,W/2,100,'#2b2440',16);txt('Best '+Math.max(m.score,S.best[m.id]||0),W/2,120,'#8a80a8',10);txt('A to collect joy',W/2,140,'#e0457b',10)}}
function chromeGame(m){R(0,0,W,24,'#2b2440cc');txt(GAMES.find(x=>x.id===m.id).n,8,16,'#fff',11,'left');txt('★ '+m.score,W/2,16,'#ffc83a',11);const left=Math.max(0,Math.ceil((m.dur-m.t)/60));txt(left+'s',W-8,16,'#fff',11,'right');if(m.id==='simon')txt('B quit',W-8,H-6,'#fff8',8,'right')}
frame();
