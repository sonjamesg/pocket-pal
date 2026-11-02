// ===== Tuning knobs =====
const TUNE={
  hungerDrain:1.2,   // hunger points lost per minute... per 10s (0-100 scale)
  happyDrain:1.0,    // happiness lost per 10s
  tickMs:10000,      // drain interval
  feedAmt:25, playAmt:20, petAmt:10, playHungerCost:8,
  // [care points needed, minimum seconds in stage] to leave each stage
  stageReq:{baby:[6,60],toddler:[10,90],teen:[14,120],adult:[18,180]},
  hatchTaps:5,       // A presses to hatch
  needsCareAt:15     // below this on both meters -> "needs care"
};
const STAGES=['egg','baby','toddler','teen','adult','old'];
const SPECIES={dog:{c:'#c98a4b',d:'#7a4f2a',n:'DOG'},horse:{c:'#a86b3c',d:'#3d2616',n:'HORSE'},rabbit:{c:'#f2eee8',d:'#e79bb0',n:'RABBIT'}};
const cv=document.getElementById('screen'),g=cv.getContext('2d');
const SAVE='pocketpal_v1';
let S=load()||{scene:'title'};
let ui={sel:0,menu:0,anim:0,msg:'',msgT:0,fx:[],hatch:0};
function load(){try{return JSON.parse(localStorage.getItem(SAVE))}catch(e){return null}}
function save(){localStorage.setItem(SAVE,JSON.stringify(S))}
function now(){return Date.now()}
function say(m){ui.msg=m;ui.msgT=90}
// catch up on time away (capped so it's never cruel)
if(S.scene==='main'){const ticks=Math.min(30,Math.floor((now()-S.last)/TUNE.tickMs));for(let i=0;i<ticks;i++)drain();}
function drain(){S.hunger=Math.max(0,S.hunger-TUNE.hungerDrain*(S.stage==='old'?1.3:1));S.happy=Math.max(0,S.happy-TUNE.happyDrain*(S.hunger<30?2:1));S.last=now();}
setInterval(()=>{if(S.scene==='main'&&!S.sleep){drain();checkGrow();save()}},TUNE.tickMs);
function checkGrow(){const r=TUNE.stageReq[S.stage];if(!r)return;
  if(S.care>=r[0]&&(now()-S.stageStart)/1000>=r[1]&&S.hunger>30&&S.happy>30){S.stage=STAGES[STAGES.indexOf(S.stage)+1];S.care=0;S.stageStart=now();say(S.name+' grew into '+(S.stage==='old'?'a wise elder':'a'+(S.stage==='adult'?'n ':' ')+S.stage)+'!');sparkle(12);save();}}
function sparkle(n){for(let i=0;i<n;i++)ui.fx.push({x:80+Math.random()*40-20,y:70,vx:Math.random()*2-1,vy:-Math.random()*2-.5,t:40,ch:'*'})}
const ACTIONS=['FEED','PLAY','PET','SLEEP'];
function input(k){
  ui.anim=0;
  if(S.scene==='title'){if(k==='a'||k==='start'){let n=prompt('Name your pet (optional):','')||'';n=n.trim().slice(0,8).toUpperCase()||'PIP';S={scene:'pick',name:n};ui.sel=0}}
  else if(S.scene==='pick'){const keys=Object.keys(SPECIES);
    if(k==='left')ui.sel=(ui.sel+2)%3;if(k==='right')ui.sel=(ui.sel+1)%3;
    if(k==='a'||k==='start'){S.species=keys[ui.sel];S.scene='egg';ui.hatch=0;save()} if(k==='b')S={scene:'title'}}
  else if(S.scene==='egg'){if(k==='a'){ui.hatch++;ui.shake=8;if(ui.hatch>=TUNE.hatchTaps){Object.assign(S,{scene:'main',stage:'baby',hunger:70,happy:70,care:0,stageStart:now(),born:now(),last:now(),sleep:false});sparkle(20);say('It\'s a baby '+SPECIES[S.species].n.toLowerCase()+'!');save()}}}
  else if(S.scene==='main'){
    if(S.sleep){if(k==='a'||k==='b'){S.sleep=false;say('Good morning!');save()}return}
    if(k==='left')ui.menu=(ui.menu+3)%4;if(k==='right')ui.menu=(ui.menu+1)%4;
    if(k==='up')ui.menu=0;if(k==='down')ui.menu=1;
    if(k==='b')act(0); // B = quick feed
    if(k==='a')act(ui.menu);
    if(k==='select'&&confirm('Start over with a new egg?')){localStorage.removeItem(SAVE);S={scene:'title'}}
    if(k==='start')say(`${S.name} ${S.stage.toUpperCase()} care ${S.care}`);
  }
}
function act(i){
  if(i===0){if(S.hunger>=98){say('Too full!');S.happy=Math.max(0,S.happy-3)}else{S.hunger=Math.min(100,S.hunger+TUNE.feedAmt);S.care++;say(['Yum!','Munch munch','Tasty!'][S.care%3]);ui.fx.push({x:100,y:80,vx:0,vy:-.5,t:40,ch:'food'})}}
  if(i===1){if(S.hunger<15){say('Too hungry to play');return}S.happy=Math.min(100,S.happy+TUNE.playAmt);S.hunger=Math.max(0,S.hunger-TUNE.playHungerCost);S.care++;ui.jump=30;say('Wheee!')}
  if(i===2){S.happy=Math.min(100,S.happy+TUNE.petAmt);if(Math.random()<.5)S.care++;for(let j=0;j<4;j++)ui.fx.push({x:70+j*6,y:60,vx:0,vy:-.6,t:40,ch:'heart'});say('Purr~')}
  if(i===3){S.sleep=true;say('Zzz... (A to wake)')}
  checkGrow();save();
}
document.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;b.addEventListener('touchstart',e=>{e.preventDefault();b.classList.add('pressed');input(k);navigator.vibrate&&navigator.vibrate(10)},{passive:false});b.addEventListener('touchend',()=>b.classList.remove('pressed'));b.addEventListener('mousedown',e=>{if(!('ontouchstart' in window))input(k)})});
const KM={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',z:'b',x:'a',Enter:'start',Shift:'select'};
addEventListener('keydown',e=>{if(KM[e.key])input(KM[e.key])});
document.addEventListener('gesturestart',e=>e.preventDefault());
// ===== drawing =====
const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)};
function txt(t,x,y,c='#2b2440',s=8,al='center'){g.fillStyle=c;g.font=`bold ${s}px monospace`;g.textAlign=al;g.fillText(t,x,y)}
function heart(x,y,c='#e0457b'){R(x,y,2,1,c);R(x+3,y,2,1,c);R(x-1,y+1,7,2,c);R(x,y+3,5,1,c);R(x+1,y+4,3,1,c);R(x+2,y+5,1,1,c)}
function food(x,y){R(x,y+2,8,4,'#e85');R(x+1,y+1,6,1,'#e85');R(x+3,y-1,2,2,'#5a3')}
function egg(cx,cy,sp,sh){const o=sh?Math.sin(ui.anim)*2:0;g.save();g.translate(cx+o,cy);
  for(let y=-18;y<=18;y++){const w=Math.round(14*Math.sqrt(1-(y/18.5)**2)*(y<0?.85:1));R(-w,y,w*2,1,'#fff8e8')}
  [[-6,-4],[5,2],[-2,8],[6,-10]].forEach(([x,y])=>R(x,y,4,3,SPECIES[sp].c));
  if(ui.hatch>1){R(-4,-2,3,1,'#555');R(-1,-1,3,1,'#555')} if(ui.hatch>3){R(2,0,4,1,'#555');R(5,1,3,1,'#555')}
  g.restore()}
function pet(cx,cy,sp,stage,mood,t){
  const s={baby:.55,toddler:.7,teen:.85,adult:1,old:1}[stage]||1;const P=SPECIES[sp];
  let c=P.c,d=P.d;if(stage==='old'){c=mix(c,'#bbbbbb',.45);}
  const bob=Math.round(Math.sin(t/8)*(mood==='sad'?.5:1.5));
  g.save();g.translate(cx,cy+bob);g.scale(s,s);
  const B=(x,y,w,h,col)=>R(x,y,w,h,col);
  R(-20,22,40,3,'#0002');
  // legs
  const lp=Math.sin(t/5)>0?1:0;
  [-14,-6,6,14].forEach((x,i)=>B(x-2,12,5,10-((i+lp)%2),d));
  // body
  B(-18,-2,36,16,c);B(-16,-4,32,20,c);
  if(sp==='horse'){B(14,-18,8,18,c);B(16,-26,14,12,c);B(26,-20,6,6,c);B(14,-22,4,16,d);B(16,-30,3,5,c);B(22,-30,3,5,c);B(-22,0,4,14,d);B(29,-18,2,2,'#222');}
  else if(sp==='dog'){B(8,-20,20,18,c);B(24,-12,8,8,c);B(30,-12,3,3,'#222');B(6,-20,5,14,d);B(-22,-8,5,4,c);B(-24,-12,4,5,c);B(-14,0,10,8,mix(c,'#fff',.4))}
  else {B(8,-18,18,16,c);B(10,-38,5,22,c);B(18,-38,5,22,c);B(11,-36,3,18,d);B(19,-36,3,18,d);B(-22,-2,8,8,'#fff');B(24,-10,3,2,d)}
  // eyes & mouth
  const ex=sp==='horse'?22:sp==='dog'?18:16,ey=sp==='horse'?-24:sp==='dog'?-16:-14;
  const blink=t%120<6;
  if(S.sleep){B(ex,ey+2,4,1,'#222');}
  else if(blink)B(ex,ey+2,4,1,'#222');else{B(ex,ey,4,4,'#222');B(ex+1,ey,1,1,'#fff')}
  if(stage==='old'){B(ex-2,ey-1,8,1,'#444');B(ex-2,ey-1,1,5,'#444');B(ex+5,ey-1,1,5,'#444');}
  const mx=ex-1,my=ey+8;
  if(!S.sleep){if(mood==='happy'){B(mx,my,1,1,'#222');B(mx+1,my+1,3,1,'#222');B(mx+4,my,1,1,'#222')}
  else if(mood==='sad'){B(mx,my+1,1,1,'#222');B(mx+1,my,3,1,'#222');B(mx+4,my+1,1,1,'#222');B(ex+4,ey+5,1,3,'#59f')}
  else B(mx+1,my,3,1,'#222');
  B(ex-4,ey+5,3,2,'#f9a8')}
  g.restore()}
function mix(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),Bb=p(b);return'#'+A.map((v,i)=>Math.round(v+(Bb[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function bar(x,y,v,col,label){txt(label,x,y+6,'#2b2440',7,'left');R(x+20,y,50,7,'#2b2440');R(x+21,y+1,48,5,'#fff');R(x+21,y+1,Math.round(48*v/100),5,v<25?'#e0457b':col)}
function bg(night){R(0,0,160,144,night?'#3b3a6b':'#dff3ff');R(0,96,160,48,night?'#2f4a3a':'#a8e08a');for(let x=0;x<160;x+=8)R(x,96,4,2,night?'#264030':'#8fcf70');
  if(night){for(let i=0;i<12;i++)R((i*37)%160,(i*23)%80,1,1,'#fff');R(130,12,10,10,'#ffe9a0')}else{R(130,10,12,12,'#ffd84a');R(20,20,18,5,'#fff');R(24,16,10,5,'#fff')}}
function frame(){ui.anim++;const t=ui.anim;g.clearRect(0,0,160,144);
  if(S.scene==='title'){bg();txt('POCKET PAL',80,34,'#5b4b8a',14);egg(80,78,['dog','horse','rabbit'][Math.floor(t/60)%3],true);if(t%60<40)txt('PRESS A TO START',80,126,'#2b2440',8)}
  else if(S.scene==='pick'){bg();txt('CHOOSE YOUR PAL',80,16,'#5b4b8a',9);const k=Object.keys(SPECIES);
    k.forEach((sp,i)=>{const x=28+i*52;if(i===ui.sel){R(x-24,30,48,66,'#fff8');R(x-24,30,48,2,'#e0457b');R(x-24,94,48,2,'#e0457b')}g.save();pet(x,62,sp,'baby',i===ui.sel?'happy':'ok',i===ui.sel?t:0);g.restore();txt(SPECIES[sp].n,x,108,i===ui.sel?'#e0457b':'#2b2440',8)});
    txt('◀ ▶ choose   A ok',80,132,'#2b2440',7)}
  else if(S.scene==='egg'){bg();txt(S.name+"'S EGG",80,18,'#5b4b8a',9);if(ui.shake>0)ui.shake--;egg(80,72,S.species,ui.shake>0||t%90<10);txt('TAP A TO HATCH',80,118,'#2b2440',8);txt('●'.repeat(ui.hatch)+'○'.repeat(TUNE.hatchTaps-ui.hatch),80,132,'#e0457b',8)}
  else if(S.scene==='main'){bg(S.sleep);
    const low=S.hunger<TUNE.needsCareAt&&S.happy<TUNE.needsCareAt;
    const mood=(S.hunger<30||S.happy<30)?'sad':(S.hunger>60&&S.happy>60)?'happy':'ok';
    R(0,0,160,22,'#fffc');bar(4,3,S.hunger,'#f9a03f','FOOD');bar(4,12,S.happy,'#5bc06b','JOY');
    txt(S.name,150,10,'#5b4b8a',7,'right');txt(S.stage.toUpperCase(),150,19,'#e0457b',7,'right');
    let jy=0;if(ui.jump>0){ui.jump--;jy=-Math.abs(Math.sin(ui.jump/5))*14}
    pet(76,84+jy,S.species,S.stage,mood,S.sleep?0:t);
    if(S.sleep&&t%40<30)txt('z Z',104,52-(t%40)/4,'#fff',9);
    if(low&&!S.sleep&&t%50<35){R(20,28,120,12,'#e0457b');txt('NEEDS CARE! FEED ME',80,37,'#fff',7)}
    else if(mood==='sad'&&!S.sleep&&t%80<10)txt(S.hunger<30?'hungry...':'lonely...',112,46,'#5b4b8a',7);
    // growth progress
    const r=TUNE.stageReq[S.stage];if(r){const p=Math.min(1,S.care/r[0])*.5+Math.min(1,(now()-S.stageStart)/1000/r[1])*.5;R(4,25,152,2,'#0002');R(4,25,152*p,2,'#a07cff')}
    // menu
    R(0,124,160,20,'#2b2440');ACTIONS.forEach((a,i)=>{const x=20+i*40;if(i===ui.menu)R(x-18,126,36,16,'#e0457b');txt(a,x,137,'#fff',7)});
  }
  ui.fx=ui.fx.filter(f=>{f.x+=f.vx;f.y+=f.vy;f.t--;if(f.ch==='heart')heart(f.x,f.y);else if(f.ch==='food')food(f.x,f.y);else R(f.x,f.y,2,2,['#ffd84a','#e0457b','#a07cff'][f.t%3]);return f.t>0});
  if(ui.msgT>0){ui.msgT--;R(8,100,144,14,'#fff');R(8,100,144,1,'#2b2440');R(8,113,144,1,'#2b2440');txt(ui.msg.slice(0,30),80,110,'#2b2440',7)}
  document.getElementById('led').style.opacity=S.scene==='main'?1:.3;
  requestAnimationFrame(frame)}
frame();
