// ===== missions.js — v28 JOB BOARD hub, wool-farm tutorial, WELL bucket watering, sheep field =====
// DB.missions.wool = {step:0..5, sheepId}. 0 not taken, 1 go to PET SHOP, 2 walk sheep home to SHEEP FIELD,
// 3 feed/care until wool full + SHEAR, 4 collect reward at JOB BOARD, 5 done.
if(!DB.missions)DB.missions={};
const FIELD=[47,47,10,6]; // sheep pasture inside the white fence south of the SHEEP SHED (x,y,w,h)
const FIELD_SPOTS=[[50,49],[53,48],[48,51],[55,50],[51,52],[54,52],[48,48],[56,48],[50,51],[56,52]];
const MISSION_REWARD=25;
const WOOL_STEPS=['','Go to the PET SHOP (south gate, WILD WOODS) and talk to the shop lady for a FREE sheep.',
  'Walk your sheep home to the SHEEP FIELD (fenced pasture by the SHEEP SHED).',
  'Feed & cuddle your sheep so its wool grows. When it is FULL, choose SHEAR!',
  'Wool sheared! Take your WOOL to YOUR FARM SHOP and SELL it.','Wool sold! Collect your reward at the JOB BOARD.','Done! You started a wool farm.'];
const wm=()=>{if(!DB.missions)DB.missions={};const m=DB.missions.wool||(DB.missions.wool={step:0,v:2});if(!m.v){if(m.step>=4)m.step++;m.v=2}return m};
const sheepList=()=>petList().filter(p=>p.species==='sheep');
const fieldSheep=()=>sheepList().filter(p=>!p.carry).slice(0,FIELD_SPOTS.length);
const inField=(x,y)=>x>=FIELD[0]&&y>=FIELD[1]&&x<FIELD[0]+FIELD[2]&&y<FIELD[1]+FIELD[3];
function woolNow(p){const fed=(p.hunger||0)>=WOOL.need&&(p.happy||0)>=WOOL.need,h=Math.max(0,now()-(p.last||now()))/HOUR;return Math.min(100,(p.wool||0)+woolRate(fed)*h)}
function sheepAt(x,y){if(CUR!=='ranch')return null;const L=fieldSheep();for(let i=0;i<L.length;i++){const [sx,sy]=FIELD_SPOTS[i];if(sx===x&&sy===y)return L[i]}return null}
// ---- well bucket + wet tiles ----
function wetKey(x,y){return x+','+y}
function wetToday(){if(!DB.wet||DB.wet.day!==today())DB.wet={day:today(),t:{}};return DB.wet.t}
// v32: bucket holds 5 waters. Watered beds/crops GROW (~90s) -> HARVEST -> stock -> sell at FARM SHOP
const BUCKET=5,GROW_MS=90e3,CROP_GOOD={C:'corn',W:'hay',U:'pumpkin',Y:'flower',c:'corn'};
const grows=()=>DB.grow||(DB.grow={});
function growP(e){return Math.min(1,(now()-e.t)/GROW_MS)}
function waterTile(x,y){const k=wetKey(x,y),e=grows()[k];if(e){say(growP(e)>=1?'It is ready — press A to HARVEST!':'Growing! Come back soon.');return}
  if(!(DB.bucket>0)){say('Fill your bucket at the WELL first!',160);return}
  DB.bucket--;grows()[k]={t:now(),c:OWBASE[y][x]};saveDB();sfx('water');say('Watered! It will grow. Waters left: '+DB.bucket,170)}
function harvest(x,y){const k=wetKey(x,y),e=grows()[k],good=CROP_GOOD[e.c]||'corn';delete grows()[k];DB.stock=DB.stock||{};DB.stock[good]=(DB.stock[good]||0)+1;DB.harvested=(DB.harvested||0)+1;saveDB();sfx('coin');sparkle(10,W/2,110);
  say('Picked 1 '+GOODS[good].n+'! It is in YOUR FARM SHOP.',170)}
function wellUse(){if(DB.bucket>=BUCKET){say('Bucket is full! 5 waters. Go water beds or crops.');return}DB.bucket=BUCKET;saveDB();sfx('water');say('Bucket filled! 5 waters. Water beds or crops.',170)}
// ---- hints for the bottom bar ----
function owHint(th){if(!th)return null;if(th.prop==='jobboard')return 'A: read the JOB BOARD';if(th.prop==='farmshop')return 'A: open YOUR FARM SHOP';if(th.prop==='well')return DB.bucket>=BUCKET?'Bucket full (5 waters)':'A: fill bucket at the WELL';
  if(th.sheepP)return 'A: visit '+th.sheepP.name+' ('+Math.round(woolNow(th.sheepP))+'% wool'+(woolNow(th.sheepP)<100?' — '+woolETA(th.sheepP,woolNow(th.sheepP)):'')+')';
  if(th.bed||th.crop){const e=grows()[wetKey(th.tx,th.ty)];if(e)return growP(e)>=1?'A: HARVEST!':'Growing… '+Math.round(growP(e)*100)+'%';return DB.bucket>0?'A: water it ('+DB.bucket+' left)':'Fill bucket at the WELL to grow this'}if(th.water)return 'Pond water is muddy — use the WELL';return null}
// ---- overworld hooks ----
const _owSolidM=owSolid,_owThingM=owThing,_owInputM=owInput;
owSolid=function(x,y){if(sheepAt(x,y))return true;return _owSolidM(x,y)};
owThing=function(x,y){const p=sheepAt(x,y);if(p)return{sheepP:p};const th=_owThingM(x,y);if(th&&(th.bed||th.crop)){th.tx=x;th.ty=y}return th};
owInput=function(k){const o=ui.ow;
  if(k==='a'&&!o.mv&&CUR==='ranch'){const [dx,dy]=DV[o.dir],tx=o.x+dx,ty=o.y+dy,th=owThing(tx,ty);
    if(th){if(th.prop==='jobboard'){openJobs();return}if(th.prop==='farmshop'){S={scene:'sell'};ui.msgT=0;ui.sold=0;return}if(th.prop==='well'){wellUse();return}
      if(th.sheepP){sfx('baa');loadPet(th.sheepP.id);return}
      if(th.bed||th.crop){const e=grows()[wetKey(tx,ty)];if(e&&growP(e)>=1){harvest(tx,ty);return}waterTile(tx,ty);return}
      if(th.water){say('Pond water is muddy! Fetch clean water from the WELL.',170);return}}}
  if(k==='a'&&!o.mv&&CUR==='shop'&&wm().step===1){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);if(th&&th.lady){openStore();say('Wool farm job? Tap SHEEP — one is FREE!',260);return}}
  return _owInputM(k)};
const _owUpdateM=owUpdate;owUpdate=function(){_owUpdateM();const o=ui.ow;if(!o)return;
  const tr=ui.trail||(ui.trail=[]),l=tr[tr.length-1];if(!l||l[0]!==o.px||l[1]!==o.py){tr.push([o.px,o.py,o.dir,CUR]);if(tr.length>40)tr.shift()}
  const m=wm();if(m.step===2&&CUR==='ranch'&&!o.mv&&inField(o.x,o.y)){const p=DB.pets[m.sheepId];if(p)delete p.carry;m.step=3;saveDB();sparkle(20,W/2,100);say((p?p.name:'Your sheep')+' loves the field! Now feed it so the wool grows.',240)}};
// sheep naming
const _finishNameM=finishName;finishName=function(n){if(!ui.nameSheep)return _finishNameM(n);const paid=ui.nameSheep===2;ui.nameSheep=null;ui.modal=null;S={scene:'map'};n=(n||'').trim().slice(0,8).toUpperCase()||'WOOLY';
  const id='p'+now().toString(36)+Math.floor(Math.random()*1e4),p=fix({id,name:n,species:'sheep',breed:(paid&&ui.sheepType)||'sheep',scene:'main',stage:'adult',hunger:35,happy:55,xp:0,coat:5,plaque:0,wool:0,
    stageStart:now(),born:now(),created:now(),last:now(),sleep:false,carry:paid?0:1,lastPlayed:now()});if(paid){delete p.carry;DB.wallet-=((typeof SHEEP_TYPES!=='undefined'&&SHEEP_TYPES.find(x=>x.id===ui.sheepType))||{p:SPECIES_PRICE.sheep}).p;ui.sheepType=null;DB.pets[id]=p;saveDB();sparkle(24,W/2,100);say(n+' is waiting in your SHEEP FIELD!',240);return}
  DB.pets[id]=p;const m=wm();m.step=2;m.sheepId=id;saveDB();sparkle(24,W/2,100);
  say(n+' follows you! Walk it home to the SHEEP FIELD.',260)};
const SHEEP_NAMES=['WOOLY','FLUFFY','COTTON','DAISY'],DOG_NAMES=['BISCUIT','BUDDY','PIP','ROSIE'];
function pickName(L){ui.modal={type:'pick',opts:L.concat(['TYPE MY OWN']),k:0}}
const _modalInputM=modalInput;modalInput=function(k){const m=ui.modal;
  if(m&&m.type==='pick'){const n=m.opts.length;if(k==='up')m.k=(m.k+n-1)%n;if(k==='down')m.k=(m.k+1)%n;if(k==='b'){ui.modal=null;ui.nameSheep=null;ui.buy=null;return}
    if(k==='a'||k==='start'){sfx('click');const c=m.opts[m.k];if(c==='TYPE MY OWN')ui.modal={type:'name',name:'',k:0};else finishName(c)}return}
  if(ui.nameSheep&&k==='b'&&m&&m.type==='name'&&!m.name){ui.modal=null;ui.nameSheep=null;return}return _modalInputM(k)};
const _drawModalM=drawModal;drawModal=function(t){const m=ui.modal;if(!m||m.type!=='pick')return _drawModalM(t);R(0,0,W,H,'#2b244099');panel(20,14,W-40,H-26,ui.nameSheep?'NAME YOUR SHEEP':'NAME YOUR PET');
  m.opts.forEach((c,i)=>{const y=30+i*32,on=i===m.k;RR(34,y,W-68,26,12,on?'#ff5a8b':'#fff',on?'#fff':'#5b4b8a');txt(c,W/2,y+18,on?'#fff':'#5b4b8a',c.length>8?11:14)});txt('▲▼ pick   A choose',W/2,H-18,'#8a80a8',10)};
const _buyDogM=buyDog;buyDog=function(b){_buyDogM(b);if(ui.modal&&ui.modal.type==='name'&&ui.buy)pickName(DOG_NAMES)};
// world-space extras: wet beds, sheep in the field, sheep following you home
const GOOD_COL={corn:'#ffd84a',hay:'#e8c860',pumpkin:'#ff8a2a',flower:'#ff6fa8',wool:'#fffaf0'};
function owExtras(t,o){if(CUR==='ranch')for(const k in grows()){const e=grows()[k],[x,y]=k.split(',').map(Number),X=x*TS,Y=y*TS,p=growP(e);g.fillStyle='#2050a050';g.fillRect(X+1,Y+10,TS-2,5);
    if(p<1){const h=3+Math.floor(p*8);R(X+7,Y+14-h,2,h,'#2a8a2a');R(X+4,Y+14-h,3,2,'#4ac04a');R(X+9,Y+13-h,3,2,'#4ac04a')}
    else{const b=Math.round(Math.sin(t/8)*1.5);E(X+8,Y+6+b,5,5,'#2b2440');E(X+8,Y+6+b,4,4,GOOD_COL[CROP_GOOD[e.c]]||'#ffd84a');if((t>>3)%4===0)star(X+13,Y+1,2.5,'#fff')}}
  if(CUR==='ranch')fieldSheep().forEach((p,i)=>{const [sx,sy]=FIELD_SPOTS[i],bob=Math.sin(t/30+i)>0,X=sx*TS+8,Y=sy*TS+14;p3later(X,Y,()=>{g.save();g.translate(X,Y);g.scale(.62,.62);
    critter(0,0,'sheep','adult',{pose:(t>>6)%3===i%3?'eat':'idle',mood:'happy',dir:bob?1:-1,wool:woolNow(p),sv:p.breed});g.restore();
    const lw=p.name.length*4+6;RR(X-lw/2,Y+1,lw,7,3,'#fff8');txt(p.name.slice(0,8),X,Y+6,'#5b4b8a',5);if(woolNow(p)>=100&&(t>>4)%2)txt('!',X+10,Y-18,'#e8402a',9)})});
  const m=wm();if(m.step===2&&ui.trail&&ui.trail.length>8){const p=DB.pets[m.sheepId],q=ui.trail[Math.max(0,ui.trail.length-12)];if(p&&q[3]===CUR){g.save();g.translate(q[0]+8,q[1]+13);g.scale(.5,.5);critter(0,0,'sheep','adult',{pose:o.mv?'walk':'idle',mood:'happy',dir:q[2]==='left'?-1:1,wool:p.wool||0,sv:p.breed});g.restore()}}}
// screen-space HUD: bucket + current job tracker (the full list lives only on the JOB BOARD)
function owHud(t){if(DB.bucket>0){RR(W-96,1,36,14,4,'#9ad8ff','#2b2440');R(W-92,4,7,7,'#3a86e8');R(W-93,3,9,1,'#2b2440');txt('×'+DB.bucket,W-74,12,'#2b2440',9)}
  const nx=nextThing();ui.banner=nx;if(ui.bannerT!==nx.t){ui.bannerT=nx.t;ui.bannerAt=Date.now()}const bAge=(Date.now()-(ui.bannerAt||0))/1000,bA=bAge<4.5?1:Math.max(0,1-(bAge-4.5)/0.6);ui.bannerVis=bA>0&&ui.bannerOff!==nx.t;if(ui.bannerVis){const _ga=g.globalAlpha;g.globalAlpha=_ga*bA;RR(30,17,W-60,13,6,'#8a5a2e','#4a2c14');RR(32,18.5,W-64,10,4,'#fff3d6');txt('▶ '+nx.t,W/2-5,26.5,'#5a3418',7);RR(W-44,18,11,11,5.5,'#e8604a','#4a2c14');txt('✕',W-38.5,26.5,'#fff',7);g.globalAlpha=_ga};drawGoalArrow(t,nx)}
// ---- JOB BOARD scene ----
const JOBS={more:{n:'MORE WOOL',d:'Shear 2 more full fleeces.',rew:30,unl:()=>wm().step>=6,ready:j=>(DB.woolBales||0)>=j.base+2,base:()=>DB.woolBales||0,hint:'Grow & SHEAR wool'},
  dog:{n:'DOG BUDDY',d:'Get a dog at the PET SHOP and teach it SIT.',rew:30,unl:()=>wm().step>=6,ready:()=>petList().some(p=>p.species==='dog'&&p.tricks&&p.tricks.sit>=TUNE.trickNeed),base:()=>0,hint:'Get a dog & teach SIT'},
  crops:{n:'GROW CROPS',d:'Water beds or crops with the WELL bucket. Wait, then HARVEST 3.',rew:20,unl:()=>wm().step>=1,ready:j=>(DB.harvested||0)>=j.base+3,base:()=>DB.harvested||0,hint:'Water & HARVEST 3 crops'},
  flock:{n:'BIG FLOCK',d:'Have 3 sheep in your SHEEP FIELD.',rew:40,unl:()=>jst('more').s===2,ready:()=>sheepList().length>=3,base:()=>0,hint:'Get 3 sheep'}};
function jst(id){const M=DB.missions||(DB.missions={});return M[id]||(M[id]={s:0})}
function jobs(){const m=wm(),L=[{id:'wool',n:'START A WOOL FARM',tag:m.step===0?'NEW':m.paused&&m.step<6?'PAUSED':m.step>=6?'DONE':m.step===5?'REWARD!':'ACTIVE',d:m.paused&&m.step<6?'Job cancelled. Your sheep & wool are safe. A: start it again!':m.step===0?'Get a FREE sheep, grow its wool, shear and sell it! Reward ● '+MISSION_REWARD:WOOL_STEPS[m.step]}];
  for(const id in JOBS){const J=JOBS[id],st=jst(id);if(!J.unl()&&!st.s)continue;L.push({id,n:J.n,tag:st.s===0?(st.c?'PAUSED':'NEW'):st.s===2?'DONE':J.ready(st)?'REWARD!':'ACTIVE',d:J.d+(st.s<2?' Reward ● '+J.rew:'')})}
  return L.sort((a,b)=>(a.tag==='DONE')-(b.tag==='DONE'))}
function nextThing(){const m=wm(),S1=['Read the JOB BOARD','Get a FREE sheep at the PET SHOP','Walk sheep to the SHEEP FIELD','Feed sheep, grow wool, SHEAR','SELL wool at YOUR FARM SHOP','Get your reward at the JOB BOARD'];
  if(m.step<6&&m.step>0&&!m.paused)return{t:S1[m.step],k:'wool'+m.step};
  for(const id in JOBS){const st=jst(id);if(st.s===1&&JOBS[id].ready(st))return{t:'Get your reward at the JOB BOARD',k:'board'}}
  if(m.step===0)return{t:S1[0],k:'board'};if(m.paused&&m.step<6&&!Object.keys(JOBS).some(id=>jst(id).s===1))return{t:'No job right now. Visit the JOB BOARD!',k:'free'};
  for(const id in JOBS){const st=jst(id);if(st.s===1)return{t:JOBS[id].hint,k:'job_'+id}}
  if(jobs().some(j=>j.tag==='NEW'&&!(DB.jobSeen||{})[j.id]))return{t:'New job on the JOB BOARD!',k:'free'};return{t:'Grow, shear & sell for coins!',k:'free'}}
function openJobs(){S={scene:'jobs'};ui.jsel=0;ui.jconf=0;ui.msgT=0}
function celebrate(a,b){ui.cele={a,b,t:0};sfx('fanfare');sparkle(40,W/2,100)}
function jobsInput(k){const J=jobs(),n=J.length;
  if(ui.jconf){const j=J[ui.jsel];if(k==='a'&&j){if(j.id==='wool'){wm().paused=true}else{const st=jst(j.id);st.s=0;st.c=1}saveDB();ui.jconf=0;S={scene:'map'};say('Job cancelled. Pick a new job at the JOB BOARD any time!',240);return}ui.jconf=0;return}
  if(k==='left'||k==='right'||k==='select'){const j=J[ui.jsel];if(j&&j.tag==='ACTIVE'){ui.jconf=1;return}}if(k==='up')ui.jsel=(ui.jsel+n-1)%n;if(k==='down')ui.jsel=(ui.jsel+1)%n;if(k==='b'||k==='start'){S={scene:'map'};return}
  if(k==='a'){const j=J[ui.jsel],m=wm();
    if(j.id==='wool'&&m.paused&&m.step<6){m.paused=false;saveDB();S={scene:'map'};say('Job back on! '+WOOL_STEPS[m.step],240);return}
    if(j.id!=='wool'){const st=jst(j.id),D=JOBS[j.id];if(st.s===0){st.s=1;st.c=0;st.base=D.base();saveDB();S={scene:'map'};say('Job taken! '+D.d,240);return}
      if(st.s===1&&D.ready(st)){st.s=2;DB.wallet+=D.rew;saveDB();S={scene:'map'};sfx('coin');celebrate('JOB DONE!',D.n+'  +'+D.rew+' coins');return}
      S={scene:'map'};say(st.s===2?'Done! Great work.':D.d,200);return}
    if(m.step===0){m.step=1;saveDB();S={scene:'map'};say('Job taken! Go to the PET SHOP for your FREE sheep.',240);return}
    if(m.step===5){m.step=6;DB.wallet=(DB.wallet||0)+MISSION_REWARD;saveDB();S={scene:'map'};sfx('coin');celebrate('WOOL FARM STARTED!','+'+MISSION_REWARD+' coins  •  New jobs on the board!');return}
    S={scene:'map'};say(m.step>=6?'You finished this job! Keep shearing for coins.':WOOL_STEPS[m.step],240)}}
function drawJobs(t){drawOverworld(t);R(0,0,W,H,'#0007');
  /* v58: chunky wood frame + parchment */RR(5,9,W-10,H-12,10,'#382010');RR(7,10,W-14,H-15,9,'#a8703c');for(let k=0;k<6;k++){R(9,16+k*34,W-18,1,'#8a5a2e');R(9,17+k*34,W-18,1,'#c48c50')}
  RR(13,24,W-26,H-33,7,'#5a3418');RR(14,25,W-28,H-35,6,'#fff6de');R(16,27,W-32,2,'#fffdf4');
  for(const[x,y]of[[11,13],[W-14,13],[11,H-8],[W-14,H-8]]){E(x+1,y+1,2.4,2.4,'#382010');E(x+1,y,2.2,2.2,'#e8c870')}
  RR(W/2-58,1,116,22,8,'#382010');RR(W/2-57,1,114,20,7,'#ff8fb1');RR(W/2-55,3,110,8,5,'#ffb3cb');otxt('JOB BOARD',W/2,16,'#fff',12);
  const J=jobs();if(ui.jsel>=J.length)ui.jsel=0;const TC={NEW:['#ff5a8b','#b8264f'],'REWARD!':['#ffb020','#a06000'],DONE:['#48c070','#22784a'],PAUSED:['#9b8ad0','#5b4b8a'],ACTIVE:['#4aa8e8','#1f6aa0']};
  J.slice(0,5).forEach((j,i)=>{const y=30+i*24,on=i===ui.jsel,dn=j.tag==='DONE';
    if(on)RR(17,y-1,W-34,23,7,'#ff5a8b');RR(18,y,W-36,21,6,on?'#fff':dn?'#f1ead8':'#fbf3df',on?'#ff5a8b':'#d8c49c');R(20,y+19,W-40,1,on?'#ffd0de':'#e6d6b4');
    const c=TC[j.tag]||TC.ACTIVE;RR(22,y+4,4,13,2,c[0]);
    txt((on?'▶ ':'')+j.n,30,y+14,dn&&!on?'#8a7a68':'#2b2440',9.5,'left',W-120);
    const cw=Math.max(40,j.tag.length*6+12),cx=W-24-cw;RR(cx,y+5,cw,13,6,c[1]);RR(cx,y+4,cw,12,6,c[0]);txt(j.tag,cx+cw/2,y+13,'#fff',8)});
  const j=J[ui.jsel],y0=30+Math.min(5,J.length)*24+3,dh=H-y0-27;RR(18,y0,W-36,dh,6,'#efe6ff','#5b4b8a');
  const ln=j.d.split(' Reward ● '),rw=ln[1];wrapMsg(ln[0],W-56,9).slice(0,rw?2:3).forEach((l,k)=>txt(l,25,y0+12+k*11,'#2b2440',9,'left'));
  if(rw){const ry=y0+dh-14;RR(W-86,ry,64,13,6,'#ffe36a','#a06000');E(W-77,ry+6.5,4,4,'#f0b020');E(W-77,ry+6,2.6,2.6,'#ffe36a');txt('+'+rw,W-50,ry+10,'#6a3a00',9)}
  if(ui.jconf){R(0,0,W,H,'#0005');RR(26,H/2-34,W-52,62,10,'#382010');RR(28,H/2-33,W-56,58,9,'#fff6de','#e8402a');txt('CANCEL THIS JOB?',W/2,H/2-13,'#e8402a',11);txt('Animals & coins stay safe.',W/2,H/2+2,'#2b2440',9);txt('A: YES, CANCEL   B: NO',W/2,H/2+17,'#5b4b8a',9);return}
  const pill=(x,w,c,tx,tc)=>{RR(x,H-23,w,16,8,'#382010');RR(x,H-24,w,15,8,c);txt(tx,x+w/2,H-13,tc||'#fff',8.5)};
  if(j.tag==='ACTIVE'){pill(22,70,'#ff5a8b','A: OK');pill(W-104,82,'#e8402a','◀▶ CANCEL JOB');return}
  const at=j.tag==='NEW'?'A: TAKE JOB':j.tag==='PAUSED'?'A: START AGAIN':j.tag==='REWARD!'?'A: GET REWARD':'A: OK';pill(W/2-50,100,j.tag==='DONE'?'#9b8ad0':'#ff5a8b',at)}
// goal arrow: bouncing arrow over the target, or an edge arrow pointing to it
function goalTile(nx){const k=nx.k,m=wm();if(CUR==='ranch'){if(k==='wool1')return MAPS.ranch.gate[0];if(k==='wool2')return[52,47];if(k==='wool3'){const i=fieldSheep().findIndex(p=>p.id===m.sheepId);return i>=0?FIELD_SPOTS[i]:[52,47]}
    if(k==='wool4')return[39,11];if(k==='board')return[45.5,8];if(k==='job_crops')return DB.bucket>0?[41,18]:[39.5,19];if(k==='job_more'||k==='job_flock')return[52,47];if(k==='job_dog')return MAPS.ranch.gate[0];return null}
  if(CUR==='outer'){if(k==='wool1'||k==='job_dog'||k==='job_flock')return[STORE[0]+1,STORE[1]+1];return MAPS.outer.gate[0]}return null}
function drawGoalArrow(t,nx){const T=goalTile(nx);if(!T)return;const ox=CAMC[0]-W/2,oy=CAMC[1]-H/2,sx=T[0]*TS+8-ox,sy=T[1]*TS-oy,b=Math.abs(Math.sin(t/10))*4;
  if(sx>8&&sx<W-8&&sy>40&&sy<H-10){g.fillStyle='#ffe36a';g.strokeStyle='#2b2440';g.lineWidth=1.5;g.beginPath();g.moveTo(sx-6,sy-14-b);g.lineTo(sx+6,sy-14-b);g.lineTo(sx,sy-5-b);g.closePath();g.fill();g.stroke();return}
  const cx=W/2,cy=H/2+10,a=Math.atan2(sy-cy,sx-cx),ex=cx+Math.cos(a)*Math.min(W/2-16,90),ey=cy+Math.sin(a)*Math.min(H/2-30,52);
  g.save();g.translate(ex,ey);g.rotate(a);g.fillStyle='#ffe36a';g.strokeStyle='#2b2440';g.lineWidth=1.5;g.beginPath();g.moveTo(10+b,0);g.lineTo(-4+b,-7);g.lineTo(-4+b,7);g.closePath();g.fill();g.stroke();g.restore()}
// ---- SHEAR scene ----
function startShear(){if((S.wool||0)<100){say('Wool '+Math.round(S.wool||0)+'% — not ready to shear yet!');return}S.scene='shear';ui.mg={t:0,start:S.wool,done:false}}
function shearInput(k){const m=ui.mg;if(m.done){if(k==='a'||k==='b'){ui.mg=null;S.scene='main';setPose('happy',80);hearts(4);save();say('Take your WOOL to YOUR FARM SHOP by the farmhouse to sell it!',260)}return}
  if(k==='b'){ui.mg=null;S.scene='main';return}
  if(k==='a'){sfx('snip');S.wool=Math.max(0,S.wool-12);for(let i=0;i<6;i++)ui.fx.push({x:120+Math.random()*50-25,y:130+Math.random()*20,vx:Math.random()*2-1,vy:-Math.random()*1.5,t:45,ch:'wool'});
    if(S.wool<=0){m.done=true;S.wool=0;S.happy=clamp(S.happy+10);addXP(3);DB.stock=DB.stock||{};DB.stock.wool=(DB.stock.wool||0)+FLEECE_BALES;DB.woolBales=(DB.woolBales||0)+1;const w=wm();if(w.step===3&&w.sheepId===S.id)w.step=4;saveDB();sfx('coin');sparkle(24,W/2,110);save(true)}}}
function drawShear(t){const m=ui.mg;m.t++;R(0,0,W,H,'#e8f4d8');for(let x=0;x<W;x+=16)R(x,150,8,66,'#d8e8c0');RR(10,8,W-20,22,6,'#5a7a9a','#2b2440');txt('SHEARING SHED',W/2,23,'#fff',10);
  R(0,170,W,46,'#c8a070');for(let x=0;x<W;x+=24)R(x,170,1,46,'#a88050');
  g.save();g.translate(W/2,176);g.scale(2.4,2.4);critter(0,0,'sheep','adult',{pose:m.done?'happy':'idle',mood:'happy',dir:1,wool:S.wool,sv:S.breed});g.restore();
  const sx=W/2+30+Math.sin(t/4)*6,sy=120;g.strokeStyle='#9aa0b0';g.lineWidth=2;const op=Math.abs(Math.sin(t/3))*.5;[op,-op].forEach(a=>{g.beginPath();g.moveTo(sx,sy);g.lineTo(sx-Math.cos(a)*14,sy+Math.sin(a)*14);g.stroke()});RR(sx,sy-3,10,6,3,'#e8402a');
  RR(30,40,180,10,5,'#2b2440');RR(32,42,176*(1-(S.wool||0)/100),6,3,'#5ad07a');txt('Fleece off: '+Math.round(100-(S.wool||0))+'%',W/2,62,'#2b2440',9);
  if(m.done){R(0,0,W,H,'#0007');panel(30,70,W-60,80,'WOOL!');txt('A big fluffy fleece!',W/2,100,'#2b2440',10);txt('+'+FLEECE_BALES+' WOOL to your shop!',W/2,116,'#2a9a50',11);txt('Sell it at YOUR FARM SHOP',W/2,132,'#8a80a8',9);txt('A done',W/2,146,'#e0457b',10)}
  else txt('Tap A to shear ✂   B stop',W/2,H-8,'#2b2440',9)}
// ---- scene routing ----
const _input0M=input0;input0=function(k){au();if(ui.cele){if(ui.cele.t>30&&(k==='a'||k==='b'||k==='start')){ui.cele=null;sfx('click')}return}if(k==='a')sfx('click');if(ui.msgT>0&&(S.scene==='map'||S.scene==='jobs'||S.scene==='sell')&&(k==='a'||k==='b')){if((ui.msgC||0)<ui.msg.length){ui.msgC=ui.msg.length;ui.msgT=Math.max(ui.msgT,120)}else ui.msgT=0;return}if(S.scene==='store'&&!ui.modal)return storeInput(k);if(S.scene==='sell')return sellInput(k);if(S.scene==='jobs')return jobsInput(k);if(S.scene==='shear')return shearInput(k);return _input0M(k)};
const _frameM=frame;frame=function(){const sc=S.scene;if(sc!=='jobs'&&sc!=='shear'&&sc!=='store'&&sc!=='sell'){_frameM();drawCele();return}ui.anim++;const t=ui.anim;
  /* v110: full ctx reset — this path bypassed frame.js resets, so a leaked transform/alpha/filter/clip from the last map frame could paint the shop invisibly (black) */
  g.setTransform(cv.width/W,0,0,cv.height/H,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';if(g.filter!==undefined)g.filter='none';g.imageSmoothingEnabled=false;g.clearRect(0,0,W,H);
  try{if(sc==='store'&&ui.cat!=null&&!(ui.cat>=0&&ui.cat<8))ui.cat=null;
  if(sc==='jobs')drawJobs(t);else if(sc==="store")drawPetCatalog(t);else if(sc==='sell')drawSell(t);else drawShear(t);}catch(e){console.error('scene draw',sc,e);g.setTransform(cv.width/W,0,0,cv.height/H,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';if(g.filter!==undefined)g.filter='none';
    g.fillStyle='#ffe6f0';g.fillRect(0,0,W,H);try{txt('Oops! Press B to go back',W/2,H/2,'#2b2440',10)}catch(_){}if(sc==='store'){ui.cat=null;ui.farmShop=0;ui.cowShop=0}}
  ui.fx=ui.fx.filter(f=>{f.x+=f.vx;f.y+=f.vy;f.vy+=.06;f.t--;g.globalAlpha=Math.min(1,f.t/20);if(f.ch==='wool'){E(f.x,f.y,3,2.5,'#fffaf0');E(f.x+2,f.y-1,2,2,'#f0e8d8')}else star(f.x,f.y,4,['#ffd84a','#ff5a8b','#a07cff'][f.t%3]);g.globalAlpha=1;return f.t>0});
  if(ui.msgT>0){ui.msgT--;drawMsg(H-40)}if(ui.modal)drawModal(t);drawCele();requestAnimationFrame(frame)};

// ---- v29 PET SHOP catalog: flick ◀ ▶ through ALL pets; SHEEP entry shows FREE (wool job) + BUY ----
const SHOP_SP=['cat','rabbit','chicken','pig','horse','sheep'];
function catalog(){return BKEYS.map(b=>({dog:b,n:BREEDS[b].n,p:priceOf(b)})).concat(SHOP_SP.map(sp=>({sp,n:BREEDS[sp].n,p:SPECIES_PRICE[sp]||40,soon:sp!=='sheep'})))}
function sheepOpts(){const o=[];if(wm().step===1)o.push('free');o.push('buy');return o}
function storeInput(k){const C=catalog(),n=C.length;if(k==='left'){ui.sel=(ui.sel+n-1)%n;ui.opt=0}if(k==='right'){ui.sel=(ui.sel+1)%n;ui.opt=0}if(k==='b'||k==='start'){S={scene:'map'};return}
  const it=C[ui.sel];if(it.sp==='sheep'){const O=sheepOpts();if(k==='up'||k==='down')ui.opt=((ui.opt||0)+1)%O.length;
    if(k==='a'){const c=O[ui.opt||0]||'buy';if(sheepList().length>=Math.min(SHEEP_MAX,FIELD_SPOTS.length)){say('Field full — 4 sheep max!');return}if(c==='free'){ui.nameSheep=1;pickName(SHEEP_NAMES);return}if(DB.wallet<it.p){say('Need '+it.p+' coins. Do jobs to earn more!');return}ui.nameSheep=2;pickName(SHEEP_NAMES)}return}
  if(k==='a'){if(it.soon){say(it.n+'S coming soon!');return}buyDog(it.dog)}}
function drawPetCatalog(t){bg(false);const C=catalog(),it=C[ui.sel%C.length],can=DB.wallet>=it.p;R(0,0,W,26,'#2b2440');txt('PET SHOP',8,18,'#ffe36a',13,'left');txt('● '+DB.wallet,W-8,18,'#ffd84a',12,'right');
  RR(14,32,W-28,124,12,'#fffc','#2b2440');
  g.save();g.translate(W/2,150);const sc=it.sp==='sheep'?1.5:it.dog?1.4:1.8;g.scale(sc,sc);if(it.dog)dog(0,0,it.dog,'adult',{pose:t%240<150?'idle':'happy',mood:'happy',coat:30});else critter(0,0,it.sp,'adult',{pose:t%200<120?'idle':'happy',mood:'happy',dir:1,wool:100});g.restore();
  // big flick arrows
  const pulse=Math.sin(t/8)*2;[[4,'◀'],[W-30,'▶']].forEach(([x,a],i)=>{RR(x,74+pulse*(i?1:-1)*0,26,40,8,'#ff5a8b','#fff');otxt(a,x+13,101,'#fff',16)});
  otxt(it.n,W/2,66,'#fff',16);
  if(it.sp==='sheep'){const O=sheepOpts();O.forEach((c,i)=>{const y=160+i*24,on=i===(ui.opt||0),free=c==='free';RR(24,y,W-48,22,10,on?(free?'#2a9a50':'#ff5a8b'):'#fff',on?'#fff':'#2b2440');
      txt(free?'★ FREE SHEEP (JOB) ★':'BUY SHEEP  ● '+it.p,W/2,y+16,on?'#fff':(free?'#2a9a50':'#5b4b8a'),11)});
    if(O.length>1)txt('▲▼ pick   A take',W/2,H-3,'#2b2440',8);else txt(can?'A buy':'Need more coins',W/2,H-3,'#2b2440',9)}
  else{RR(40,162,W-80,26,12,it.soon?'#a99fc8':can?'#ff5a8b':'#c8c0d8','#fff');otxt(it.soon?'COMING SOON':'BUY  ● '+it.p,W/2,180,'#fff',13);txt('◀ ▶ look   A buy   B leave',W/2,204,'#2b2440',9)}
  if(wm().step===1&&it.sp!=='sheep'){RR(30,30,W-60,16,8,'#2a9a50','#fff');txt('FREE SHEEP → keep flicking ▶',W/2,42,'#fff',9)}
  C.forEach((c,i)=>E(W/2-(C.length-1)*3.5+i*7,H-12+(it.sp==='sheep'&&sheepOpts().length>1?-100:0)*0,2.5,2.5,i===ui.sel?'#ff5a8b':c.sp==='sheep'&&wm().step===1?'#2a9a50':'#fff'))}

// ---- v31 YOUR FARM SHOP: shear -> WOOL stock -> SELL here. 1 fleece = 5 WOOL x 20 = 100 coins ----
const FLEECE_BALES=5,GOODS={wool:{n:'WOOL',p:20},corn:{n:'CORN',p:4},hay:{n:'HAY',p:3},pumpkin:{n:'PUMPKIN',p:6},flower:{n:'FLOWERS',p:3}};
function stockList(){const st=DB.stock||{};return Object.keys(GOODS).filter(k=>st[k]>0).map(k=>({k,n:st[k],g:GOODS[k]}))}
function sellInput(k){if(k==='b'||k==='start'){S={scene:'map'};return}if(k==='a'){const L=stockList();if(!L.length){say('Shop is empty! Shear sheep or harvest crops.');return}
  const st=DB.stock,c=L.reduce((a,x)=>a+x.n*x.g.p,0),hadWool=L.some(x=>x.k==='wool');L.forEach(x=>st[x.k]=0);DB.wallet=(DB.wallet||0)+c;ui.sold=c;ui.soldT=120;const m=wm();if(m.step===4&&hadWool)m.step=5;sfx('coin');
  if(hadWool&&!DB.firstSell){DB.firstSell=1;celebrate('FIRST SALE!','You sold wool for '+c+' coins!')}saveDB();sparkle(30,W/2,120);
  if(m.step===5)say('Now get your reward at the JOB BOARD!',220)}}
function drawSell(t){drawOverworld(t);R(0,0,W,H,'#0007');RR(10,10,W-20,H-20,8,'#f4e4c0','#382010');R(10,10,W-20,26,'#c83c32');txt('YOUR FARM SHOP',W/2,28,'#fff',13);
  const L=stockList();RR(22,42,W-44,82,10,'#fff','#2b2440');
  if(!L.length){txt('Shop is empty',W/2,74,'#8a80a8',13);txt('Shear sheep or harvest crops!',W/2,94,'#8a80a8',10)}
  L.slice(0,5).forEach((x,i)=>{const y=56+i*15;E(36,y-4,5,5,'#2b2440');E(36,y-4,4,4,GOOD_COL[x.k]);txt(x.g.n+' × '+x.n,46,y,'#2b2440',11,'left');txt('● '+x.n*x.g.p,W-32,y,'#d89a10',11,'right')});
  const tot=L.reduce((a,x)=>a+x.n*x.g.p,0);RR(40,132,W-80,34,14,tot?'#2a9a50':'#a99fc8','#fff');otxt(tot?'SELL ALL  ● '+tot:'NO STOCK',W/2,155,'#fff',15);
  if(ui.soldT>0){ui.soldT--;otxt('+'+ui.sold+' COINS!',W/2,186-((120-ui.soldT)/6),'#ffd84a',18)}else txt(tot?'A sell   B leave':'B leave',W/2,184,'#2b2440',10);txt('Coins: ● '+DB.wallet,W/2,H-16,'#2b2440',11)}
const _owExtrasM=owExtras;owExtras=function(t,o){_owExtrasM(t,o);if(CUR!=='ranch')return;const q=PROPS.find(p=>p[4]==='farmshop');if(!q||!(IMG.p_farmshop&&IMG.p_farmshop.naturalWidth))return;
  const im=IMG.p_farmshop,X=q[0]*TS+q[2]*8-im.width/2,Y=(q[1]+q[3])*TS-im.height,[dx,dy]=leanOff(X+im.width/2,Y+im.height,im.height/2);txt('FARM SHOP',X+24+dx,Y+15+dy,'#7a3a20',7);const n=stockList().length;if(n&&(t>>4)%2)txt('!',X+44+dx,Y+2+dy,'#e8402a',11)};

// ---- v32 celebrations ----
function drawCele(){const c=ui.cele;if(!c)return;c.t++;const t=c.t;R(0,0,W,H,'#2b2440aa');const s=Math.min(1,t/12);g.save();g.translate(W/2,H/2);g.scale(s,s);
  RR(-100,-56,200,112,14,'#fff8e0','#e8402a');for(let i=0;i<8;i++){const a=i/8*6.283+t/30;star(Math.cos(a)*92,Math.sin(a)*50,5,['#ffd84a','#ff5a8b','#5ab0ff','#5ad07a'][i%4])}
  otxt('★',0,-24,'#ffd84a',22);const big=wrapMsg(c.a,180,15);big.forEach((l,i)=>otxt(l,0,-2+i*16,'#e8402a',15));wrapMsg(c.b,180,10).slice(0,2).forEach((l,i)=>txt(l,0,22+i*12,'#2b2440',10));g.restore();
  if(t>30&&(t>>4)%2)txt('A: YAY!',W/2,H/2+70,'#fff',11)}
// ---- v32 sound: tiny WebAudio blips (no files) ----
let AC=null;function au(){try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){}return AC}
function tone(f,d,type,v,f2,delay){const a=AC;if(!a||DB.mute)return;const t0=a.currentTime+(delay||0),o=a.createOscillator(),gn=a.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t0);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+d);
  gn.gain.setValueAtTime(v||.04,t0);gn.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(gn);gn.connect(a.destination);o.start(t0);o.stop(t0+d+.02)}
function sfx(k){if(!AC)return;if(k==='click')tone(880,.04,'square',.025);if(k==='blip')tone(620,.05,'triangle',.03);if(k==='coin'){tone(988,.08,'square',.04);tone(1319,.18,'square',.04,0,.08)}
  if(k==='water')tone(500,.25,'sine',.05,180);if(k==='snip'){tone(2400,.03,'square',.02);tone(1800,.03,'square',.02,0,.04)}
  if(k==='baa'){for(let i=0;i<4;i++)tone(i%2?380:340,.1,'sawtooth',.03,0,i*.09)}
  if(k==='woof'){tone(320,.09,'sawtooth',.05,170);tone(260,.12,'sawtooth',.045,140,.16)}
  if(k==='fanfare')[523,659,784,1047].forEach((f,i)=>tone(f,.16,'square',.04,0,i*.12))}
const _sayM=say;say=function(m,t){_sayM(m,t);sfx('blip')};
const _careActM=careAct;careAct=function(id){if(id==='cuddle'&&S.species==='sheep')sfx('baa');return _careActM(id)};
// sheep food costs a little (or uses farm stock)
const _feedM=feed;feed=function(f){if(S.species==='sheep'&&f.cost&&S.hunger<97){const st=DB.stock||(DB.stock={});if(f.stock&&st[f.stock]>0)st[f.stock]--;else if(DB.wallet>=f.cost)DB.wallet-=f.cost;else{say('Need ● '+f.cost+'. Try FRESH GRASS — it is free!');return}saveDB()}return _feedM(f)};

// v53: tap the goal banner (✕) to dismiss it; 'New job' stays hidden until a NEW job appears that you haven't seen
function dismissBanner(){const nx=ui.banner;if(!nx)return;if(nx.t==='New job on the JOB BOARD!'){DB.jobSeen=DB.jobSeen||{};jobs().forEach(j=>{if(j.tag==='NEW')DB.jobSeen[j.id]=1});saveDB()}else ui.bannerOff=nx.t}
cv.addEventListener('pointerdown',e=>{if(!S||(S.scene!=='map'))return;const r=cv.getBoundingClientRect(),y=(e.clientY-r.top)*H/r.height;if(y>=17&&y<=37&&ui.bannerVis){e.preventDefault();dismissBanner()}});
