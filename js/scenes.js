// ===== scenes.js — UI panels/chrome + groom, teeth, walk scenes =====
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
