// ===== missions.js — v28 JOB BOARD hub, wool-farm tutorial, WELL bucket watering, sheep field =====
// DB.missions.wool = {step:0..5, sheepId}. 0 not taken, 1 go to PET SHOP, 2 walk sheep home to SHEEP FIELD,
// 3 feed/care until wool full + SHEAR, 4 collect reward at JOB BOARD, 5 done.
if(!DB.missions)DB.missions={};
const FIELD=[47,47,10,6]; // sheep pasture inside the white fence south of the SHEEP SHED (x,y,w,h)
const FIELD_SPOTS=[[50,49],[53,48],[48,51],[55,50],[51,52],[54,52]];
const MISSION_REWARD=25;
const WOOL_STEPS=['','Go to the PET SHOP (south gate, WILD WOODS) and talk to the shop lady for a FREE sheep.',
  'Walk your sheep home to the SHEEP FIELD (fenced pasture by the SHEEP SHED).',
  'Feed & cuddle your sheep so its wool grows. When it is FULL, choose SHEAR!',
  'Wool sheared! Collect your reward at the JOB BOARD.','Done! You started a wool farm.'];
const wm=()=>DB.missions.wool||(DB.missions.wool={step:0});
const sheepList=()=>petList().filter(p=>p.species==='sheep');
const fieldSheep=()=>sheepList().filter(p=>!p.carry).slice(0,FIELD_SPOTS.length);
const inField=(x,y)=>x>=FIELD[0]&&y>=FIELD[1]&&x<FIELD[0]+FIELD[2]&&y<FIELD[1]+FIELD[3];
function woolNow(p){const fed=(p.hunger||0)>=WOOL.need&&(p.happy||0)>=WOOL.need,h=Math.max(0,now()-(p.last||now()))/HOUR;return Math.min(100,(p.wool||0)+(fed?WOOL.fast:WOOL.slow)*h)}
function sheepAt(x,y){if(CUR!=='ranch')return null;const L=fieldSheep();for(let i=0;i<L.length;i++){const [sx,sy]=FIELD_SPOTS[i];if(sx===x&&sy===y)return L[i]}return null}
// ---- well bucket + wet tiles ----
function wetKey(x,y){return x+','+y}
function wetToday(){if(!DB.wet||DB.wet.day!==today())DB.wet={day:today(),t:{}};return DB.wet.t}
function waterTile(x,y){if(!DB.bucket){say('Dry soil. Fill a bucket at the WELL first!',160);return}
  const W0=wetToday();if(W0[wetKey(x,y)]){say('Already watered today — try another bed!');return}
  const before=DB.chores||0,day=DB.choreDay;chore(x,y,'water');if(DB.chores!==before||DB.choreDay!==day){W0[wetKey(x,y)]=1;DB.bucket=0;saveDB()}}
function wellUse(){if(DB.bucket){say('Your bucket is full! Water a flower bed or crop.');return}DB.bucket=1;saveDB();say('Filled a bucket of well water! Now water a bed or crop.',170)}
// ---- hints for the bottom bar ----
function owHint(th){if(!th)return null;if(th.prop==='jobboard')return 'A: read the JOB BOARD';if(th.prop==='well')return DB.bucket?'Bucket full — go water something':'A: fill bucket at the WELL';
  if(th.sheepP)return 'A: visit '+th.sheepP.name+' ('+Math.round(woolNow(th.sheepP))+'% wool)';
  if(th.bed||th.crop)return DB.bucket?'A: water it (+coins)':null;if(th.water)return 'Pond water is muddy — use the WELL';return null}
// ---- overworld hooks ----
const _owSolidM=owSolid,_owThingM=owThing,_owInputM=owInput;
owSolid=function(x,y){if(sheepAt(x,y))return true;return _owSolidM(x,y)};
owThing=function(x,y){const p=sheepAt(x,y);if(p)return{sheepP:p};return _owThingM(x,y)};
owInput=function(k){const o=ui.ow;
  if(k==='a'&&!o.mv&&CUR==='ranch'){const [dx,dy]=DV[o.dir],tx=o.x+dx,ty=o.y+dy,th=owThing(tx,ty);
    if(th){if(th.prop==='jobboard'){openJobs();return}if(th.prop==='well'){wellUse();return}
      if(th.sheepP){loadPet(th.sheepP.id);return}
      if(th.bed||th.crop){if(DB.bucket){waterTile(tx,ty);return}}
      if(th.water){say('Pond water is muddy! Fetch clean water from the WELL.',170);return}}}
  if(k==='a'&&!o.mv&&CUR==='shop'&&wm().step===1){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);if(th&&th.lady){say('A wool farm? Lovely! This sheep is FREE — give it a name!',220);ui.nameSheep=1;ui.modal={type:'name',name:'',k:0};return}}
  return _owInputM(k)};
const _owUpdateM=owUpdate;owUpdate=function(){_owUpdateM();const o=ui.ow;if(!o)return;
  const tr=ui.trail||(ui.trail=[]),l=tr[tr.length-1];if(!l||l[0]!==o.px||l[1]!==o.py){tr.push([o.px,o.py,o.dir,CUR]);if(tr.length>40)tr.shift()}
  const m=wm();if(m.step===2&&CUR==='ranch'&&!o.mv&&inField(o.x,o.y)){const p=DB.pets[m.sheepId];if(p)delete p.carry;m.step=3;saveDB();sparkle(20,W/2,100);say((p?p.name:'Your sheep')+' loves the field! Now feed it so the wool grows.',240)}};
// sheep naming
const _finishNameM=finishName;finishName=function(n){if(!ui.nameSheep)return _finishNameM(n);ui.nameSheep=null;ui.modal=null;n=(n||'').trim().slice(0,8).toUpperCase()||'WOOLY';
  const id='p'+now().toString(36)+Math.floor(Math.random()*1e4),p=fix({id,name:n,species:'sheep',breed:'sheep',scene:'main',stage:'adult',hunger:35,happy:55,xp:0,coat:5,plaque:0,wool:0,
    stageStart:now(),born:now(),created:now(),last:now(),sleep:false,carry:1,lastPlayed:now()});DB.pets[id]=p;const m=wm();m.step=2;m.sheepId=id;saveDB();sparkle(24,W/2,100);
  say(n+' follows you! Walk it home to the SHEEP FIELD.',260)};
const _modalInputM=modalInput;modalInput=function(k){if(ui.nameSheep&&k==='b'&&ui.modal&&ui.modal.type==='name'&&!ui.modal.name){ui.modal=null;ui.nameSheep=null;return}return _modalInputM(k)};
// world-space extras: wet beds, sheep in the field, sheep following you home
function owExtras(t,o){if(CUR==='ranch'&&DB.wet&&DB.wet.day===today())for(const k in DB.wet.t){const [x,y]=k.split(',').map(Number);g.fillStyle='#2050a040';g.fillRect(x*TS+1,y*TS+9,TS-2,6);if((t>>4)%4===0&&k.length%3===0)E(x*TS+8,y*TS+6,1,1.5,'#9ad8ff')}
  if(CUR==='ranch')fieldSheep().forEach((p,i)=>{const [sx,sy]=FIELD_SPOTS[i],bob=Math.sin(t/30+i)>0,X=sx*TS+8,Y=sy*TS+14;g.save();g.translate(X,Y);g.scale(.62,.62);
    critter(0,0,'sheep','adult',{pose:(t>>6)%3===i%3?'eat':'idle',mood:'happy',dir:bob?1:-1,wool:woolNow(p)});g.restore();
    const lw=p.name.length*4+6;RR(X-lw/2,Y+1,lw,7,3,'#fff8');txt(p.name.slice(0,8),X,Y+6,'#5b4b8a',5);if(woolNow(p)>=100&&(t>>4)%2)txt('!',X+10,Y-18,'#e8402a',9)});
  const m=wm();if(m.step===2&&ui.trail&&ui.trail.length>8){const p=DB.pets[m.sheepId],q=ui.trail[Math.max(0,ui.trail.length-12)];if(p&&q[3]===CUR){g.save();g.translate(q[0]+8,q[1]+13);g.scale(.5,.5);critter(0,0,'sheep','adult',{pose:o.mv?'walk':'idle',mood:'happy',dir:q[2]==='left'?-1:1,wool:p.wool||0});g.restore()}}}
// screen-space HUD: bucket + current job tracker (the full list lives only on the JOB BOARD)
function owHud(t){if(DB.bucket){RR(W-74,2,14,12,3,'#9ad8ff','#2b2440');R(W-70,5,6,6,'#3a86e8');R(W-71,4,8,1,'#2b2440')}
  const m=wm();if(m.step>0&&m.step<5&&ui.msgT<=0){RR(4,18,W-8,13,5,'#2b2440cc');txt('JOB: '+['','Get a FREE sheep at the PET SHOP','Walk sheep to the SHEEP FIELD','Grow wool, then SHEAR','Collect reward at JOB BOARD'][m.step],W/2,28,'#ffe36a',7)}}
// ---- JOB BOARD scene ----
function jobs(){const m=wm(),c=DB.choreDay===today()?DB.chores||0:0;return[
  {id:'wool',n:'START A WOOL FARM',tag:m.step===0?'NEW':m.step>=5?'DONE':m.step===4?'REWARD!':'ACTIVE',d:m.step===0?'Tutorial: get a free sheep, raise it, shear its wool. Reward ● '+MISSION_REWARD:WOOL_STEPS[m.step]},
  {id:'water',n:'WATER THE RANCH',tag:c+'/12',d:'Fill a bucket at the WELL by the farmhouse, then water flower beds or crops. ● 5-12 each.'},
  {id:'weeds',n:'PULL WEEDS',tag:c+'/12',d:'Pull tall grass around the ranch. ● 5-12 each. (Shares the 12 chores a day.)'}]}
function openJobs(){S={scene:'jobs'};ui.jsel=0;ui.msgT=0}
function jobsInput(k){const J=jobs(),n=J.length;if(k==='up')ui.jsel=(ui.jsel+n-1)%n;if(k==='down')ui.jsel=(ui.jsel+1)%n;if(k==='b'||k==='start'){S={scene:'map'};return}
  if(k==='a'){const j=J[ui.jsel],m=wm();if(j.id!=='wool'){S={scene:'map'};say(j.id==='water'?'The WELL is right by the farmhouse!':'Look for tall grass on the ranch.',160);return}
    if(m.step===0){m.step=1;saveDB();S={scene:'map'};say('Job taken! Head to the PET SHOP for your FREE sheep.',240);return}
    if(m.step===4){m.step=5;DB.wallet=(DB.wallet||0)+MISSION_REWARD;saveDB();S={scene:'map'};sparkle(30,W/2,100);say('Wool farm started! Reward +'+MISSION_REWARD+' coins!',240);return}
    S={scene:'map'};say(m.step>=5?'You already finished this job. Keep shearing for coins!':WOOL_STEPS[m.step].slice(0,80),240)}}
function drawJobs(t){drawOverworld(t);R(0,0,W,H,'#0006');RR(10,8,W-20,H-16,6,'#c48c50','#382010');R(14,12,W-28,H-24,'#e0b070');for(let y=24;y<H-14;y+=14)R(14,y,W-28,1,'#c89a58');
  RR(W/2-48,4,96,16,4,'#6a4020','#382010');txt('JOB BOARD',W/2,15,'#ffe36a',9);
  jobs().forEach((j,i)=>{const y=26+i*52,on=i===ui.jsel;RR(20,y,W-40,46,3,on?'#fffbe8':'#f4ecd4',on?'#e8402a':'#8a7050');E(W/2,y+2,2,2,'#e8402a');
    txt(j.n,28,y+14,'#2b2440',9,'left');RR(W-76,y+5,50,12,4,j.tag==='NEW'||j.tag==='REWARD!'?'#e8402a':j.tag==='DONE'?'#2a9a50':'#5b4b8a');txt(j.tag,W-51,y+14,'#fff',7);
    wrapTxt(j.d,W-58,7).slice(0,3).forEach((l,k)=>txt(l,28,y+25+k*9,'#5a4a3a',7,'left'))});
  const m=wm(),j=jobs()[ui.jsel];txt(j.id==='wool'?(m.step===0?'A accept job':m.step===4?'A collect reward':'A see next step'):'A ok','✚'.length?W/2:0,H-12,'#382010',8);txt('B back',W-24,H-12,'#382010',7)}
// ---- SHEAR scene ----
function startShear(){if((S.wool||0)<100){say('Wool '+Math.round(S.wool||0)+'% — not ready to shear yet!');return}S.scene='shear';ui.mg={t:0,start:S.wool,done:false}}
function shearInput(k){const m=ui.mg;if(m.done){if(k==='a'||k==='b'){ui.mg=null;S.scene='main';setPose('happy',80);hearts(4);save()}return}
  if(k==='b'){ui.mg=null;S.scene='main';return}
  if(k==='a'){S.wool=Math.max(0,S.wool-12);for(let i=0;i<6;i++)ui.fx.push({x:120+Math.random()*50-25,y:130+Math.random()*20,vx:Math.random()*2-1,vy:-Math.random()*1.5,t:45,ch:'wool'});
    if(S.wool<=0){m.done=true;S.wool=0;S.happy=clamp(S.happy+10);addXP(3);DB.wallet=(DB.wallet||0)+WOOL.coins;DB.woolBales=(DB.woolBales||0)+1;const w=wm();if(w.step===3&&w.sheepId===S.id)w.step=4;else if(w.step===3)w.step=4;saveDB();sparkle(24,W/2,110);save(true)}}}
function drawShear(t){const m=ui.mg;m.t++;R(0,0,W,H,'#e8f4d8');for(let x=0;x<W;x+=16)R(x,150,8,66,'#d8e8c0');RR(10,8,W-20,22,6,'#5a7a9a','#2b2440');txt('SHEARING SHED',W/2,23,'#fff',10);
  R(0,170,W,46,'#c8a070');for(let x=0;x<W;x+=24)R(x,170,1,46,'#a88050');
  g.save();g.translate(W/2,176);g.scale(2.4,2.4);critter(0,0,'sheep','adult',{pose:m.done?'happy':'idle',mood:'happy',dir:1,wool:S.wool});g.restore();
  const sx=W/2+30+Math.sin(t/4)*6,sy=120;g.strokeStyle='#9aa0b0';g.lineWidth=2;const op=Math.abs(Math.sin(t/3))*.5;[op,-op].forEach(a=>{g.beginPath();g.moveTo(sx,sy);g.lineTo(sx-Math.cos(a)*14,sy+Math.sin(a)*14);g.stroke()});RR(sx,sy-3,10,6,3,'#e8402a');
  RR(30,40,180,10,5,'#2b2440');RR(32,42,176*(1-(S.wool||0)/100),6,3,'#5ad07a');txt('Fleece off: '+Math.round(100-(S.wool||0))+'%',W/2,62,'#2b2440',9);
  if(m.done){R(0,0,W,H,'#0007');panel(30,70,W-60,80,'WOOL!');txt('A big fluffy fleece!',W/2,100,'#2b2440',10);txt('+'+WOOL.coins+' coins • bales: '+(DB.woolBales||0),W/2,118,'#8a80a8',9);txt('A done',W/2,138,'#e0457b',10)}
  else txt('Tap A to shear ✂   B stop',W/2,H-8,'#2b2440',9)}
// ---- scene routing ----
const _input0M=input0;input0=function(k){if(S.scene==='jobs')return jobsInput(k);if(S.scene==='shear')return shearInput(k);return _input0M(k)};
const _frameM=frame;frame=function(){const sc=S.scene;if(sc!=='jobs'&&sc!=='shear')return _frameM();ui.anim++;const t=ui.anim;g.clearRect(0,0,W,H);
  if(sc==='jobs')drawJobs(t);else drawShear(t);
  ui.fx=ui.fx.filter(f=>{f.x+=f.vx;f.y+=f.vy;f.vy+=.06;f.t--;g.globalAlpha=Math.min(1,f.t/20);if(f.ch==='wool'){E(f.x,f.y,3,2.5,'#fffaf0');E(f.x+2,f.y-1,2,2,'#f0e8d8')}else star(f.x,f.y,4,['#ffd84a','#ff5a8b','#a07cff'][f.t%3]);g.globalAlpha=1;return f.t>0});
  if(ui.msgT>0){ui.msgT--;drawMsg(H-40)}if(ui.modal)drawModal(t);requestAnimationFrame(frame)};
