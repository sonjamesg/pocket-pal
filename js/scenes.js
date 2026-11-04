// ===== scenes.js — UI panels/chrome + groom, teeth, walk scenes =====
// ===== UI pieces =====
function panel(x,y,w,h,title){RR(x+2,y+3,w,h,8,'#0004');RR(x,y,w,h,8,'#fff8ee','#2b2440');if(title){RR(x+8,y-7,title.length*6.4+14,14,7,'#5b4b8a');txt(title,x+15,y+4,'#fff',9,'left')}}
function bar(x,y,w,v,col){RR(x,y,w,9,4.5,'#2b2440');const ww=Math.max(0,(w-4)*v/100);if(ww>1)RR(x+2,y+2,ww,5,2.5,col)}
function chrome(){R(0,0,W,30,'#ffffffdd');R(0,30,W,1,'#2b244033');
  foodIcon('kibble',9,8,.5);bar(17,4,60,S.hunger,S.hunger<25?'#ff5a7a':'#ffa53f');heartS(9,21,.8);bar(17,17,60,S.happy,S.happy<25?'#ff5a7a':'#5ad07a');
  const cl=S.coat,cc=cl>=TUNE.matAt?'#ff4f7b':cl>=TUNE.longAt?'#ffb03a':'#a07cff';if(S.species==='dog'){txt('✂',87,12,cc,9);bar(93,4,40,cl,cc)}if(S.species==='sheep'){const wv=S.wool||0;txt('☁',87,13,wv>=100?'#2a9a50':'#a0a0b0',9);bar(93,4,40,wv,wv>=100?'#5ad07a':'#d8d0c0')}
  const pq=S.plaque,pc=pq>=TUNE.plaqueBad?'#ff4f7b':pq>=40?'#e0c040':'#5ab0ff';if(S.species==='dog'||S.species==='cat'){toothI(87,21,pq);bar(93,17,40,pq,pc)}
  txt(S.name,W-6,12,'#5b4b8a',10,'right');txt('● '+DB.wallet,W-6,26,'#d89a10',8,'right');RR(140,17,50,10,5,'#ff5a8b');txt(stageName(S.stage,S.species),165,25,'#fff',7);
  R(0,31,W,3,'#0001');R(0,31,W*growProg(),3,'#a07cff')}
function toothI(x,y,p){g.fillStyle=mix('#ffffff','#d8b040',Math.min(1,p/90));g.strokeStyle='#2b2440';g.lineWidth=.8;g.beginPath();g.moveTo(x-3.5,y-4);g.lineTo(x+3.5,y-4);g.lineTo(x+3,y+1);g.lineTo(x+1.5,y+4);g.lineTo(x,y+1);g.lineTo(x-1.5,y+4);g.lineTo(x-3,y+1);g.closePath();g.fill();g.stroke()}
function warnings(){const w=[];if(S.species==='sheep'){if((S.wool||0)>=100)w.push(['Wool is FULL — SHEAR me!',0]);else{if(S.hunger<WOOL.need)w.push(['Hungry! Feed me so my wool grows',1]);else if(S.happy<WOOL.need)w.push(['Cuddle or brush me — wool grows slow when sad',0]);else w.push(['Wool '+Math.round(S.wool||0)+'% — '+woolETA(S,S.wool||0),0]);if(wm().step>=4&&(S.wool||0)<100)w.push(['New wool grows each DAY — come back tomorrow!',0])}return w}if(S.species!=='dog'){}else if(S.coat>=TUNE.matAt)w.push(['OUCH! Matted fur — go to Tara\'s!',1]);else if(S.coat>=TUNE.longAt)w.push(['Coat getting long — groom soon',0]);
  if(S.plaque>=TUNE.plaqueBad)w.push(['Ouch, my teeth! Brush them',1]);if(S.hunger<25)w.push(['Hungry… feed me',1]);if(S.happy<30&&!w.length)w.push(['Lonely… play with me',0]);return w}
function mood(){return(S.hunger<30||S.happy<30||S.coat>=TUNE.matAt||S.plaque>=TUNE.plaqueBad)?'sad':(S.hunger>55&&S.happy>60)?'happy':'ok'}
function dogAt(x,y,s,pose,pt,dir){g.save();g.translate(x,y);g.scale(s,s);dog(0,0,S.breed,S.stage,{pose,pt,mood:mood(),coat:S.coat,plaque:S.plaque,dir,wool:S.wool});g.restore()}
function cecDog(x,y,c){E(x,y,2.2,1.9,c);E(x-1.8,y-1.6,.9,1.2,c);E(x+1.8,y-1.6,.9,1.2,c);E(x,y+.6,.6,.45,'#111')}
function cecily(x,y,t,snip){g.save();g.translate(x,y);const bob=Math.sin(t/14)*.6;
  E(0,0,15,4,'#0005');
  // legs / black pants + shoes
  RR(-7,-18,6,17,2.5,'#1a1a22');RR(1,-18,6,17,2.5,'#1a1a22');R(-6,-17,1.5,14,'#ffffff14');
  E(-4.5,-1.5,4.5,2.4,'#ff5a8b');E(4.5,-1.5,4.5,2.4,'#ff5a8b');E(-5.5,-2.5,2,.8,'#ffffff88');E(3.5,-2.5,2,.8,'#ffffff88');
  g.translate(0,bob);
  // long flowing back hair (behind body, to mid-back)
  {const sw=Math.sin(t/20)*1.2;g.fillStyle='#d9a232';g.beginPath();g.moveTo(-13,-60);g.quadraticCurveTo(-19,-42,-16+sw,-26);g.quadraticCurveTo(-8,-22,0,-24);g.quadraticCurveTo(8,-22,16+sw,-26);g.quadraticCurveTo(19,-42,13,-60);g.closePath();g.fill();
   g.strokeStyle='#f2c65088';g.lineWidth=1;[-12,-7,7,12].forEach(hx=>{g.beginPath();g.moveTo(hx*.9,-56);g.quadraticCurveTo(hx*1.25,-42,hx+sw,-27);g.stroke()})}
  // black dog-print tunic
  RR(-12,-46,24,31,9,'#16161e','#000');RR(-11,-45,6,28,4,'#ffffff10');
  const pc=['#bfc4d4','#ffb3cf','#9fe0ff','#ffe39a'];
  [[-7,-40],[2,-41],[8,-35],[-3,-33],[-8,-26],[5,-27],[0,-21],[-6,-19],[8,-20]].forEach((p,i)=>cecDog(p[0],p[1],pc[i%4]));
  R(-12,-18,24,2,'#000');RR(4,-44,6,5,2,'#e0457b');txt('TSH',7,-40.5,'#fff',3.5);
  // back arm
  RR(-15,-43,5,15,2.5,'#16161e');E(-12.5,-27,2.6,2.6,'#f6cfb0');
  // neck + head
  R(-2.5,-50,5,5,'#ecbd9c');
  E(0,-60,14,11,'#e7b23e'); // back hair crown
  E(0,-57,11,11,'#f8d4b6');E(-3,-61,4,3,'#ffffff30');
  // side-swept bangs + long side locks framing face
  g.fillStyle='#f2c650';g.beginPath();g.moveTo(-12.5,-54);g.quadraticCurveTo(-14,-72,0,-71);g.quadraticCurveTo(14,-72,12.5,-54);g.quadraticCurveTo(10,-63,4,-64);g.quadraticCurveTo(-2,-62,-6,-65);g.quadraticCurveTo(-9,-61,-12.5,-54);g.fill();
  [-1,1].forEach(sd=>{g.fillStyle='#f2c650';g.beginPath();g.moveTo(sd*9,-62);g.quadraticCurveTo(sd*15,-52,sd*13,-36);g.quadraticCurveTo(sd*11,-32,sd*9,-36);g.quadraticCurveTo(sd*10.5,-48,sd*8,-58);g.fill();
    g.strokeStyle='#fff2b0aa';g.lineWidth=.8;g.beginPath();g.moveTo(sd*11,-58);g.quadraticCurveTo(sd*13,-48,sd*11.5,-38);g.stroke()});
  g.strokeStyle='#fff2b0';g.lineWidth=1.2;g.beginPath();g.arc(-2,-66,6,Math.PI*1.1,Math.PI*1.6);g.stroke();
  // pink bow
  E(6.5,-67,2.6,1.8,'#ff5a8b');E(10.5,-67,2.6,1.8,'#ff5a8b');E(8.5,-67,1.2,1.2,'#e0457b');
  // eyes
  [-4.5,4.5].forEach(ex=>{E(ex,-56,2.6,3,'#fff');E(ex,-55.6,2.1,2.5,'#3a8ee8');E(ex,-54.8,1.6,1.4,'#6fb6ff');E(ex,-55.5,1.1,1.4,'#13306a');E(ex-.8,-56.8,.8,.8,'#fff');E(ex+.7,-54.6,.4,.4,'#fff');g.strokeStyle='#2a1a08';g.lineWidth=1;g.beginPath();g.moveTo(ex+(ex<0?-2.6:2.6),-56.5);g.lineTo(ex+(ex<0?-3.6:3.6),-57.6);g.stroke();g.strokeStyle='#5a3a10';g.lineWidth=.8;g.beginPath();g.arc(ex,-55.5,3,Math.PI*1.15,Math.PI*1.85);g.stroke()});
  E(-7.5,-51.5,2.4,1.4,'#ff8aa866');E(7.5,-51.5,2.4,1.4,'#ff8aa866');
  g.strokeStyle='#c0506a';g.lineWidth=1;g.beginPath();g.arc(0,-52.5,2.3,.35,Math.PI-.35);g.stroke();
  // front arm with scissors
  g.save();g.translate(10,-42);g.rotate(-1.1+(snip?Math.sin(t/2.5)*.2:0));RR(-2.5,0,5,10,2.5,'#16161e');RR(-2.2,9,4.4,6,2.2,'#f6cfb0');
  g.translate(0,17);const op=snip?Math.abs(Math.sin(t/2))*.5:.25;g.strokeStyle='#c8ccd8';g.lineWidth=2;[op,-op].forEach(a=>{g.beginPath();g.moveTo(0,0);g.lineTo(Math.sin(a)*12,Math.cos(a)*12);g.stroke()});
  g.strokeStyle='#e0457b';g.lineWidth=1.6;g.beginPath();g.arc(-3,-2,2.5,0,7);g.stroke();g.beginPath();g.arc(3,-2,2.5,0,7);g.stroke();g.restore();g.restore()}
function salonBg(){R(0,0,W,H,'#2bb3a8');for(let x=0;x<W;x+=20)R(x,0,10,150,'#27a59b');R(0,0,W,4,'#1e8a82');
  R(0,138,W,12,'#1c7f78');R(0,138,W,2,'#5fd8cd');
  for(let x=0;x<W;x+=24)for(let y=150;y<H;y+=16)R(x+((y/16)%2?12:0)-12,y,24,16,((x/24+y/16)%2)?'#151519':'#1d1d23');
  for(let y=150;y<H;y+=16)R(0,y,W,1,'#000');g.fillStyle='#ffffff0d';g.beginPath();g.moveTo(60,150);g.lineTo(110,150);g.lineTo(80,H);g.lineTo(20,H);g.fill();
  RR(24,6,192,30,9,'#e0457b','#fff');txt('TARA SCISSOR HOUNDS',W/2,20,'#fff',11);txt('✂ dog grooming ✂',W/2,31,'#ffe36a',8);
  RR(174,42,44,56,20,'#fff','#1a1a22');RR(177,45,38,50,17,'#cfefff');R(186,52,5,30,'#ffffff99');R(195,56,3,20,'#ffffff66');
  R(18,62,56,4,'#1a1a22');R(18,62,56,1,'#555');['#5ab0ff','#ff9ac0','#ffd84a','#7ad07a'].forEach((c,i)=>{RR(22+i*13,46,9,16,3,c);R(24+i*13,48,2,10,'#ffffff66');R(23+i*13,44,7,3,'#1a1a22')});
  E(90,58,7,7,'#fff');cecDog(90,58,'#e0457b');
  RR(106,140,100,9,3,'#e0457b');R(106,140,100,2,'#ff9ac0');R(118,149,5,29,'#1a1a22');R(189,149,5,29,'#1a1a22');RR(104,176,104,4,2,'#2a2a33');R(108,159,96,3,'#2a2a33')}
function bubble(t,x,y,w){const L=[];let line='';t.split(' ').forEach(wd=>{if((line+wd).length*5.2>w-10){L.push(line);line=''}line+=wd+' '});L.push(line);
  RR(x,y,w,L.length*11+8,8,'#fff','#2b2440');L.forEach((l,i)=>txt(l,x+w/2,y+12+i*11,'#2b2440',8))}
function drawGroom(t){const m=ui.mg;m.t++;salonBg();
  dogAt(156,140,1.15,m.ph==='done'?'happy':m.ph==='cut'?'idle':'sit',0,-1);
  /* v100: occasional bark on the grooming table */if(m.bk==null)m.bk=90+Math.floor(Math.random()*120);if(--m.bk<=0){m.bk=300+Math.floor(Math.random()*360);m.bkS=45;if(!document.hidden)sfx('woof')}if(m.bkS>0){m.bkS--;g.save();g.font='bold 10px monospace';g.fillStyle='#fff';g.strokeStyle='#123';g.lineWidth=3;g.strokeText('WOOF!',176,92);g.fillText('WOOF!',176,92);g.restore()}
  if(m.ph==='done'){g.save();g.translate(152-S.stage.length,98);g.fillStyle='#ff5a8b';g.beginPath();g.moveTo(0,0);g.lineTo(-8,-5);g.lineTo(-8,5);g.fill();g.beginPath();g.moveTo(0,0);g.lineTo(8,-5);g.lineTo(8,5);g.fill();E(0,0,2.5,2.5,'#e0457b');g.restore()}
  cecily(70,176,t,m.ph==='cut'&&t%30<20);
  const line={intro:m.mat?"Hi, I'm Cecily! Oh dear, "+S.name+"'s fur is matted. Let's fix it gently!":"Hi, I'm Cecily! Ready for a lovely trim, "+S.name+"?",
    short:S.name+"'s coat looks lovely already! Come back when it's longer.",brush:'First we brush the knots out gently… ◀ ▶ ◀ ▶',cut:'Snip snip! Press A to trim.',done:'All done! '+S.name+' looks fabulous!'}[m.ph];
  bubble(line,12,42,150);
  if(m.ph==='brush'){RR(30,196,180,10,5,'#2b2440');RR(32,198,176*Math.min(1,m.brush/12),6,3,'#ff5a8b');txt('◀ ▶ brush',W/2,192,'#5b4b8a',9)}
  if(m.ph==='cut'){const p=1-(S.coat-5)/Math.max(1,m.start-5);RR(30,196,180,10,5,'#2b2440');RR(32,198,176*Math.max(0,Math.min(1,p)),6,3,'#5ad07a');txt('A snip ✂   coat '+Math.round(S.coat)+'%',W/2,192,'#5b4b8a',9)}
  if(m.ph==='intro')txt('A start',W/2,204,'#5b4b8a',9);txt('B exit',W-16,H-6,'#ffffff66',6)}
function drawTeeth(t){const m=ui.mg;m.t++;R(0,0,W,H,'#dff4ff');for(let x=0;x<W;x+=24)for(let y=0;y<H;y+=24)RR(x+1,y+1,22,22,3,'#cfeaff');
  otxt('BRUSH TEETH',W/2,20,'#fff',13);dogAt(48,120,1,'smile',0,1);
  RR(96,44,134,104,14,'#fff','#2b2440');E(163,82,56,20,'#ff8aa8');E(163,118,56,18,'#ff8aa8');
  const tc=mix('#ffffff','#c9a23a',Math.min(1,S.plaque/90));for(let i=0;i<7;i++){RR(118+i*13,80,11,15,4,tc,'#e0b0b8');RR(118+i*13,104,11,14,4,tc,'#e0b0b8')}
  if(S.plaque>30)for(let i=0;i<7;i++)if((i*3)%5<S.plaque/25)E(124+i*13,92,4,2.5,'#b8902a99');
  const bx=163+(m.bx||0)*34+Math.sin(t/3)*2;g.save();g.translate(bx,100);RR(-4,-8,30,6,3,'#5ab0ff');RR(-10,-12,10,10,3,'#fff','#5ab0ff');g.restore();
  RR(100,154,126,10,5,'#2b2440');RR(102,156,122*(1-S.plaque/100),6,3,'#5ad07a');txt('CLEAN '+Math.round(100-S.plaque)+'%',163,176,'#2b2440',10);
  txt(m.done?'Sparkly clean! A done':'◀ ▶ ◀ ▶ scrub!   B stop',W/2,204,'#5b4b8a',10)}
function drawWalk(t){const m=ui.mg;walkTick();const x=m.x;
  const sky=g.createLinearGradient(0,0,0,150);sky.addColorStop(0,'#5fb4f2');sky.addColorStop(.6,'#a8dcff');sky.addColorStop(1,'#eaf8ff');g.fillStyle=sky;g.fillRect(0,0,W,H);
  E(205,44,16,16,'#fff4b8aa');E(205,44,10,10,'#fffbe0');
  for(let i=0;i<4;i++){const cx=((i*85+20-x*.08)%(W+80)+W+80)%(W+80)-40,cy=34+(i%2)*12;E(cx,cy,16,7,'#ffffffdd');E(cx-10,cy+2,10,5,'#ffffffdd');E(cx+11,cy+1,11,6,'#ffffffdd');E(cx,cy+4,18,3,'#d8ecfa')}
  for(let i=0;i<8;i++){const hx=((i*55-x*.15)%(W+60)+W+60)%(W+60)-40;E(hx,96,34,18,'#8cc4a0')}
  for(let i=0;i<5;i++){const hx=((i*72-x*.3)%(W+72)+W+72)%(W+72)-56,wc=['#f6d2b0','#cfe0f4','#f7e6a6','#f4c6cc','#d6ecc4'][i%5],rc=['#b8524a','#5a6a9a','#c06a3a','#8a4a6a','#4a7a5a'][i%5];
    R(hx+4,74,52,58,'#0002');R(hx,70,52,62,wc);R(hx,70,3,62,'#0001');R(hx+49,70,3,62,'#0002');
    R(hx+36,54,7,12,'#8a6a5a');R(hx+35,52,9,3,'#6a4a3a');
    g.fillStyle=rc;g.beginPath();g.moveTo(hx-6,74);g.lineTo(hx+26,48);g.lineTo(hx+58,74);g.fill();g.fillStyle='#0003';g.fillRect(hx-6,72,64,3);
    g.fillStyle='#ffffff55';g.beginPath();g.moveTo(hx+26,48);g.lineTo(hx+30,51);g.lineTo(hx+2,73);g.lineTo(hx-3,73);g.fill();
    for(const wx of[7,33]){R(hx+wx-1,81,14,14,'#fff');R(hx+wx+1,83,10,10,'#7ab8e0');R(hx+wx+1,83,4,4,'#cdeaff');R(hx+wx+6,83,1,10,'#fff');R(hx+wx-2,95,16,3,'#e9e2d6');E(hx+wx+3,98,3,2,'#ff7ab0');E(hx+wx+9,98,3,2,'#ffd84a')}
    R(hx+19,106,14,26,'#fff');R(hx+20,107,12,25,['#7a4a30','#3a6ab0','#c0405a'][i%3]);E(hx+29,120,1.2,1.2,'#ffd84a');R(hx+17,131,18,2,'#a0503a');R(hx+18,103,16,3,'#0002')}
  R(0,128,W,18,'#4e9a4a');for(let px=-((x*.6)%16);px<W;px+=16){E(px+8,130,9,7,'#5cae52');E(px+4,127,4,3,'#6cc05e')}
  for(let i=0;i<5;i++){const tx=((i*90+40-x*.6)%(W+90)+W+90)%(W+90)-40;E(tx+3,146,14,3,'#0003');R(tx-2,120,6,27,'#7a5030');R(tx-2,120,2,27,'#9a6a40');E(tx+4,110,16,14,'#3e8a3a');E(tx,104,15,13,'#5aa848');E(tx-5,100,8,6,'#7cc860');E(tx+8,112,6,4,'#ff8ab8')}
  R(0,146,W,10,'#7cc860');for(let px=-((x)%12);px<W;px+=12){R(px,145,2,3,'#8ed870');E(px+6,150,1.4,1.4,['#fff','#ffd84a','#ff8ab8'][(Math.floor((px+x)/12)%3+3)%3])}
  R(0,156,W,32,'#d9d2c6');for(let px=-(x%24);px<W;px+=24){R(px,156,1,32,'#bcb4a6');R(px+1,156,1,32,'#ece6dc')}R(0,171,W,1,'#bcb4a6');R(0,172,W,1,'#ece6dc');R(0,156,W,2,'#0002');
  R(0,186,W,3,'#eee8de');R(0,189,W,3,'#a49c90');R(0,192,W,24,'#4a4a56');R(0,192,W,2,'#0003');for(let px=-((x*1)%40);px<W;px+=40)RR(px,203,20,2,1,'#f4f0e0');
  const sx=e=>e.x-x+100;
  m.evs.forEach(e=>{const X=sx(e);if(X<-30||X>W+30)return;
    if(e.t==='lamp'){E(X+16,157,8,2,'#0003');R(X+12,150,8,7,'#2e3a4a');R(X+14,86,4,66,'#3a4a5c');R(X+14,86,1,66,'#6a7a90');R(X+10,80,12,4,'#2e3a4a');E(X+16,88,10,6,'#ffe36a33');RR(X+11,82,10,8,2,'#fff2a0','#2e3a4a');g.fillStyle='#2e3a4a';g.beginPath();g.moveTo(X+9,82);g.lineTo(X+16,75);g.lineTo(X+23,82);g.fill()}
    if(e.t==='sniff'){E(X+16,152,16,10,'#4a9a3a');E(X+8,148,9,8,'#5aa848');E(X+20,146,6,3,'#ff7ab0')}
    if(e.t==='poo'&&e.px!=null&&!e.bagged){const P=e.px-x+100-60;E(P,182,5,3,'#6a4020');E(P,179,3.6,2.4,'#7a4a28');E(P,177,2,1.6,'#8a5a30')}});
  const binX=m.len-x+120;if(binX<W+30){RR(binX,150,18,26,3,'#3a8a4a');R(binX-2,148,22,4,'#2a6a3a');txt('🐾',binX+9,166,'#fff',8)}
  const pose={walk:m.boost>0?'trot':'walk',sniffQ:'sniff',sniff:'sniff',wee:'wee',poo:'poo',bagQ:'sit',bagging:'happy'}[m.st]||'walk';
  dogAt(100,182,1.05,m.done?'happy':pose,0,1);
  {const k=({puppy:.62,youngster:.75,teen:.88}[S.stage]||1)/.62,bob=Math.sin(t/5)*1,nx=100-2*k,ny=174-8*k+bob*.5,hx=-2,hy=150+Math.sin(t/5+1)*1.5;
   g.strokeStyle='#a02040';g.lineWidth=2.6;g.beginPath();g.moveTo(hx,hy);g.quadraticCurveTo((hx+nx)/2,Math.max(hy,ny)+10+Math.sin(t/8)*3,nx,ny);g.stroke();
   g.strokeStyle='#ff5a78';g.lineWidth=1.4;g.stroke();
   g.fillStyle='#e8405a';g.beginPath();g.ellipse(nx,ny,3.4*k,1.8*k,-.5,0,6.29);g.fill();g.strokeStyle='#a02040';g.lineWidth=.8;g.stroke();
   E(nx,ny+1.2*k,1.3,1.3,'#ffd84a');E(nx-.4,ny+.8*k,.5,.5,'#fff');RR(-6,hy-4,10,8,3,'#f2c49a','#a06a4a')}
  if(m.st==='wee'&&t%10<6)for(let i=0;i<3;i++)E(88-i*3,176+i*2,1.2,1.2,'#ffe36a');
  if(m.st==='bagging'){g.save();g.translate(40+(50-m.stT),170);RR(-6,-8,12,12,3,'#3ac04a');g.restore()}
  R(0,0,W,22,'#2b2440cc');txt('WALK',8,15,'#fff',10,'left');RR(48,8,120,7,3,'#ffffff33');RR(48,8,120*Math.min(1,x/m.len),7,3,'#5ad07a');txt('💩 '+m.bag+'  👃 '+m.sn,W-8,15,'#fff',9,'right');
  if(m.st==='sniffQ')promptBox('Something smells good!','A sniff   ▶ keep going');
  if(m.st==='bagQ')promptBox(S.name+' did a poo!','A BAG IT   ▶ walk on');
  if(m.st==='walk'&&!m.done)txt('▶ walk faster   B head home',W/2,212,'#fff',8);
  if(m.done){R(0,0,W,H,'#0007');panel(30,60,W-60,90,'HOME AGAIN');txt('Lovely walk with '+S.name+'!',W/2,92,'#2b2440',10);txt('Poo bagged: '+m.bag+'  Sniffs: '+m.sn,W/2,110,'#8a80a8',9);txt('A to finish',W/2,134,'#e0457b',10)}}
function promptBox(a,b){RR(30,34,180,38,10,'#fff','#2b2440');txt(a,W/2,50,'#2b2440',10);txt(b,W/2,64,'#e0457b',9)}
