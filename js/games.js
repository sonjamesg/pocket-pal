// ===== games.js — trick teaching + mini-games =====
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
  if(id==='fetch'){m.ball=0;m.spd=1.0;m.zone=.45+Math.random()*.35;m.state='fly';m.throws=0;m.dx=0;m.lock=0}
  if(id==='simon'){m.seq=[];m.pos=0;m.show=0;m.showT=0;m.lit=-1;m.litT=0;addSimon(m)}
  if(id==='dash'){m.lane=1;m.obs=[];m.spd=2;m.hit=0;m.dist=0}}
function addSimon(m){m.seq.push(Math.floor(Math.random()*4));m.show=0;m.showT=40;m.pos=0;m.mode='show'}
const PADS=['up','right','down','left'];
function gameInput(k){const m=ui.mg;
  if(m.over){if((k==='a'||k==='b')&&!(m.lock>0))endGame();return}
  if(k==='b'&&m.t>10){m.over=true;m.lock=25;m.state='done';m.resT=0;return}
  if(m.id==='fetch'&&k==='a'&&m.state==='fly'&&m.ball>.08){const d=Math.abs(m.ball-m.zone);
    if(d<.09){m.score+=d<.03?3:2;m.res=d<.03?'PERFECT!':'NICE!';m.state='caught';setPose('happy',30)}else{m.res='MISS';m.state='miss'}m.resT=45;m.throws++}
  if(m.id==='simon'&&m.mode==='input'){const p=PADS.indexOf(k);if(p<0)return;m.lit=p;m.litT=12;
    if(p===m.seq[m.pos]){m.pos++;if(m.pos>=m.seq.length){m.score=m.seq.length;m.res='GREAT!';m.resT=40;m.mode='wait';m.waitT=45}}else{m.res='WRONG!';m.resT=60;m.over=true}}
  if(m.id==='dash'){if(k==='up')m.lane=Math.max(0,m.lane-1);if(k==='down')m.lane=Math.min(2,m.lane+1)}}
function gameTick(){const m=ui.mg;if(m.over){if(m.lock>0)m.lock--;return}m.t++;if(m.resT>0)m.resT--;if(m.t>=m.dur){m.over=true;return}
  if(m.id==='fetch'){if(m.state==='fly'){m.ball+=m.spd/100;if(m.ball>1.05){m.state='miss';m.res='MISSED';m.resT=40;m.throws++}}
    else if(m.state==='caught'||m.state==='miss'){const tx=Math.min(1,m.ball);m.dx+=Math.sign(tx-m.dx)*Math.min(.03,Math.abs(tx-m.dx));if(Math.abs(tx-m.dx)<.01&&m.resT<=0)m.state='back'}
    else if(m.state==='back'){m.dx=Math.max(0,m.dx-.03);if(m.dx<=0){m.state='fly';m.ball=0;m.zone=.4+Math.random()*.45;m.spd=Math.min(2.2,1.0+m.throws*.08+Math.random()*.3)}}}
  if(m.id==='simon'){if(m.litT>0)m.litT--;
    if(m.mode==='show'){if(--m.showT<=0){if(m.show<m.seq.length){m.lit=m.seq[m.show];m.litT=Math.max(14,28-m.seq.length*2);m.show++;m.showT=m.litT+10}else{m.mode='input';m.lit=-1}}}
    if(m.mode==='wait'&&--m.waitT<=0)addSimon(m)}
  if(m.id==='dash'){m.dist+=m.spd;m.spd=2+m.t/600;if(m.hit>0)m.hit--;
    if(m.t%Math.max(22,50-Math.floor(m.t/120))===0){m.obs.push({x:W+10,lane:Math.floor(Math.random()*3),type:Math.random()<.35?'heart':'rock'})}
    m.obs.forEach(o=>{o.x-=m.spd;if(!o.done&&o.lane===m.lane&&o.x<60&&o.x>34){o.done=true;if(o.type==='heart'){m.score+=2;m.res='+2';m.resT=20}else if(m.hit<=0){m.score=Math.max(0,m.score-1);m.hit=40;m.res='OUCH';m.resT=30}}});
    m.obs=m.obs.filter(o=>o.x>-20&&!(o.done&&o.type==='heart'));m.score+=m.t%60===0?1:0}}
function endGame(){const m=ui.mg;const joy=Math.min(35,8+m.score*3);S.happy=clamp(S.happy+joy);S.hunger=clamp(S.hunger-6);addXP(1);
  const b=S.best[m.id]||0;if(m.score>b)S.best[m.id]=m.score;ui.mg=null;S.scene='main';setPose('happy',60);hearts(4);say(`Score ${m.score}! Joy +${joy}${m.score>b?' NEW BEST':''}`);checkGrow();save()}

