// ===== frame.js — main render loop per scene (incl. title logo anim) =====
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
    const n=petList().length;if(!hasSave())txt('No save on this device yet',W/2,206,'#fff',9);else if(it[ui.tsel]==='NEW GAME')txt('Start over: new rancher & avatar',W/2,206,'#fff',9);else txt((DB.playerName||'RANCHER')+' • '+n+' pet'+(n===1?'':'s')+' • '+(DB.wallet||0)+' coins',W/2,206,'#fff',9)}
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
  else if(sc==='intro'){drawIntro(t)}
  else if(sc==='avatar')drawAvatar(t)
  else if(sc==='store'){bg(false);const b=BKEYS[ui.sel],B=BREEDS[b],p=priceOf(b),can=DB.wallet>=p;otxt('PET STORE',W/2,22,'#ffe36a',15);txt('● '+DB.wallet,W-10,22,'#ffd84a',10,'right');
    RR(14,32,W-28,136,12,'#fff9','#ffffff');g.save();g.translate(W/2-14,138);g.scale(1.7,1.7);dog(0,0,b,'adult',{pose:t%240<150?'idle':'happy',mood:'happy',coat:30});g.restore();
    g.save();g.translate(W/2+70,160);g.scale(.8,.8);dog(0,0,b,'puppy',{pose:'sit',mood:'happy'});g.restore();txt('puppy',W/2+70,166,'#8a80a8',7);
    otxt('◀',22,104,'#fff',16);otxt('▶',W-22,104,'#fff',16);otxt(B.n+'  ● '+p,W/2,186,can?'#ffe36a':'#ff8a8a',14);txt(can?'A buy   B leave':'Not enough coins   B leave',W/2,200,'#2b2440',8);
    BKEYS.forEach((k,i)=>E(W/2-28+i*8,210,2.5,2.5,i===ui.sel?'#ff5a8b':'#fff'))}
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
  if(ui.msgT>0){ui.msgT--;drawMsg(sc==='main'?40:H-40)}
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

// v30: Grandpa-style speech bubble (no portrait). Wraps with the SAME font it draws with, so nothing overflows on phones.
function wrapMsg(str,maxW,size){g.font='800 '+size+'px system-ui,sans-serif';const out=[];let line='';for(const w of String(str).split(' ')){const t=line?line+' '+w:w;if(g.measureText(t).width>maxW&&line){out.push(line);line=w}else line=t}if(line)out.push(line);return out}
function drawMsg(y){if(ui.msgShown!==ui.msg){ui.msgShown=ui.msg;ui.msgC=0}ui.msgC=Math.min(ui.msg.length,(ui.msgC||0)+1.2);
  let size=10,L=wrapMsg(ui.msg,W-36,size);if(L.length>3){size=9;L=wrapMsg(ui.msg,W-36,size)}L=L.slice(0,4);const lh=size+3,h=L.length*lh+14,top=y<H/2?y-6:H-6-h;
  RR(6,top,W-12,h,7,'#fff','#2b2440');g.strokeStyle='#58a8f8';g.lineWidth=1;g.strokeRect(10.5,top+3.5,W-21,h-7);
  let left=Math.floor(ui.msgC);L.forEach((l,i)=>{const part=l.slice(0,Math.max(0,left));left-=l.length+1;txt(part,16,top+8+size+i*lh,'#2b2440',size,'left')});
  if(ui.msgC>=ui.msg.length&&S.scene==='map'&&(ui.anim>>4)%2){g.fillStyle='#e8402a';g.beginPath();g.moveTo(W-22,top+h-9);g.lineTo(W-14,top+h-9);g.lineTo(W-18,top+h-5);g.fill()}}
