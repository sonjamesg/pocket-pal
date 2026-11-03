// ===== shop.js — PET SHOP interior map (enter from Wild Woods door) =====
// legend: # wall, . floor, k counter (lady behind), b behind-counter, c cage block, p pen block, D door/exit
const SHOP_ROWS=["################","################","#cc.bbbbbbbb.cc#","#cc.kkkkkkkk.cc#","#..............#","#pp..........pp#","#pp..........pp#","#..............#","#cc..........cc#","#cc..........cc#","#..............#","#######DD#######"];
MAPS.shop={name:'PET SHOP',w:16,h:12,gate:[[7,11],[8,11]],rows:SHOP_ROWS.map(r=>r.split(''))};
const SHOP_LADY=[8,2],SHOP_PENS=[[1,2,'dog0'],[13,2,'cat'],[1,5,'dog1'],[13,5,'pig'],[1,8,'rabbit'],[13,8,'chicken']];
function shopEnter(){const o=ui.ow;setMap('shop');Object.assign(o,{map:'shop',x:7,y:10,px:7*TS,py:10*TS,dir:'up',mv:null});say('Welcome to the PET SHOP!')}
function shopExit(){const o=ui.ow,[sx,sy]=STORE;setMap('outer');Object.assign(o,{map:'outer',x:sx+1,y:sy+2,px:(sx+1)*TS,py:(sy+2)*TS,dir:'down',mv:null})}
const _owSolid=owSolid,_owThing=owThing,_owGate=owGate,_owInput=owInput,_drawOW=drawOverworld;
owSolid=function(x,y){if(CUR!=='shop')return _owSolid(x,y);if(x<0||y<0||x>=MW||y>=MH)return true;return !'.D'.includes(OWBASE[y][x])};
owThing=function(x,y){if(CUR!=='shop')return _owThing(x,y);const c=OWBASE[y]&&OWBASE[y][x];if(c==='k'||c==='b')return{lady:1};if(c==='D')return{exit:1};
  for(const [px,py,a] of SHOP_PENS)if(x>=px&&x<px+2&&y>=py&&y<py+2)return{pen:a};if(c==='#')return{shelf:1};return null};
owGate=function(){if(CUR==='shop'){if(OWBASE[ui.ow.y][ui.ow.x]==='D')shopExit();return}_owGate()};
owInput=function(k){const o=ui.ow;
  if(CUR!=='shop'){if(k==='a'&&!o.mv){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);if(th&&th.store){shopEnter();return}}return _owInput(k)}
  if(DV[k]||k==='select'||k==='start')return _owInput(k);
  if(k==='b'){shopExit();return}
  if(k==='a'&&!o.mv){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);if(!th)return;
    if(th.lady){openStore();say('Hi '+(DB.playerName||'partner')+'! Which pup catches your eye?',200);return}
    if(th.exit){shopExit();return}
    if(th.pen){const n={dog0:'A playful pup!',dog1:'This pup wags at you!',cat:'A cat — coming soon to buy!',pig:'A pig — coming soon to buy!',rabbit:'A bunny — coming soon to buy!',chicken:'A chicken — coming soon to buy!'}[th.pen];say(n);return}
    if(th.shelf)say('Shelves of pet food and toys.')}};
function shopLady(X,Y){E(X+8,Y+15,6,2,'#0003');R(X+3,Y+8,10,7,'#e86a9a');R(X+4,Y+9,8,6,'#fff');R(X+6,Y+11,4,2,'#e86a9a');R(X+2,Y+9,2,4,'#ffd8b8');R(X+12,Y+9,2,4,'#ffd8b8');
  R(X+4,Y+2,8,7,'#ffd8b8');R(X+3,Y+1,10,3,'#7a3a20');R(X+3,Y+3,2,5,'#7a3a20');R(X+11,Y+3,2,5,'#7a3a20');E(X+8,Y,3,2.5,'#7a3a20');R(X+6,Y+5,1,1,'#2b2020');R(X+9,Y+5,1,1,'#2b2020');R(X+7,Y+7,2,1,'#d05060');R(X+5,Y+6,1,1,'#ffa0a0');R(X+10,Y+6,1,1,'#ffa0a0')}
function drawShop(t){owUpdate();const o=ui.ow,cx=(MW*TS-W)/2,cy=Math.max(-20,Math.min(MH*TS-H+4,o.py+8-H/2));
  g.fillStyle='#181020';g.fillRect(0,0,W,H);g.save();g.translate(-Math.round(cx),-Math.round(cy));g.imageSmoothingEnabled=false;
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const c=OWBASE[y][x],X=x*TS,Y=y*TS;
    if(y<2){R(X,Y,TS,TS,y?'#f0d8b0':'#c89870');if(y===1){R(X,Y+12,TS,4,'#a87850');R(X,Y+11,TS,1,'#805838')}else{R(X,Y,TS,3,'#6a4028');for(let i=0;i<TS;i+=4)R(X+i,Y+3,1,13,'#b88860')}continue}
    if(c==='#'){R(X,Y,TS,TS,'#a87850');R(X+(x?0:12),Y,4,TS,'#805838');continue}
    R(X,Y,TS,TS,(x+y)%2?'#f8e8c8':'#ecd8b0');R(X,Y+15,TS,1,'#d8c098');
    if(c==='D'){R(X,Y,TS,TS,'#c84848');R(X+1,Y+1,TS-2,TS-2,'#e86060');for(let i=3;i<TS;i+=4)R(X+2,Y+i,TS-4,1,'#c84848')}
    if(c==='b')R(X,Y,TS,TS,'#e8d0a0')}
  // windows on back wall + signs
  [[2,0],[5,0],[10,0],[13,0]].forEach(([wx])=>{const X=wx*TS,Y=4;R(X-1,Y-1,TS+10,20,'#6a4028');R(X,Y,TS+8,18,'#9ad8ff');R(X,Y+8,TS+8,1,'#6a4028');R(X+12,Y,1,18,'#6a4028');R(X+2,Y+2,4,2,'#fff')});
  RR(6*TS,2,4*TS,10,3,'#ff5a8b','#2b2440');txt('PET SHOP',8*TS,10,'#fff',7);
  // shelves behind counter
  for(let x=4;x<12;x++){const X=x*TS,Y=2*TS;R(X,Y,TS,6,'#a87850');[['#e85050',2],['#50a0e8',7],['#f0c040',11]].forEach(([c,i])=>R(X+i,Y-2,3,6,c))}
  shopLady(SHOP_LADY[0]*TS,SHOP_LADY[1]*TS+Math.round(Math.sin(t/20)));
  // counter
  {const X=4*TS,Y=3*TS;R(X,Y+2,8*TS,14,'#8a5a30');R(X,Y,8*TS,5,'#c88a50');R(X,Y+5,8*TS,1,'#6a4020');for(let i=0;i<8;i++)R(X+i*TS+7,Y+7,2,8,'#6a4020');R(X+5*TS,Y-5,10,6,'#505868');R(X+5*TS+2,Y-4,6,2,'#9ae0a0');R(X+2*TS,Y-3,8,4,'#f0e0a0')}
  // pens + cages with display animals
  SHOP_PENS.forEach(([px,py,a],i)=>{const X=px*TS,Y=py*TS,cage=OWBASE[py][px]==='c';
    R(X+1,Y+1,30,30,cage?'#d8d0c0':'#e8c868');if(!cage)for(let k=0;k<5;k++)R(X+3+k*6,Y+20+(k%2)*4,4,1,'#c8a040');
    g.save();g.translate(X+16,Y+25);g.scale(.42,.42);const dir=Math.sin(t/60+i)>0?1:-1,pose=((t>>6)+i)%3===0?'sit':'walk';
    if(a.startsWith('dog'))dog(0,0,BKEYS[(a==='dog1'?3:0)%BKEYS.length],'puppy',{pose,mood:'happy',dir});else{g.scale(1.8,1.8);critter(0,0,a,'adult',{pose,mood:'happy',dir})};g.restore();
    if(cage){g.fillStyle='#707888';for(let k=0;k<=30;k+=5)g.fillRect(X+1+k,Y+1,1,30);R(X+1,Y+1,30,2,'#505868');R(X+1,Y+29,30,2,'#505868')}
    else{R(X,Y+1,32,2,'#a06830');R(X,Y+29,32,2,'#a06830');R(X,Y,2,32,'#a06830');R(X+30,Y,2,32,'#a06830')}});
  // mat by the door
  R(6*TS+4,10*TS+6,4*TS-8,8,'#5a8a48');
  const AVS=avImg('s'),FS=DB.avatar==='girl'&&IMG.farmergirl&&IMG.farmergirl.naturalWidth?'farmergirl':'farmer';
  if(AVS||(IMG[FS]&&IMG[FS].naturalWidth)){const row={down:0,up:1,left:2,right:3}[o.dir],fr=o.mv&&o.step%2?1:0;g.drawImage(AVS||IMG[FS],fr*16,row*16,16,16,Math.round(o.px),Math.round(o.py)-4,16,16)}else farmer(o.px,o.py-3,o.dir,o.step,!!o.mv);
  g.restore();
  R(0,0,W,16,'#2b2440cc');txt('PET SHOP',6,12,'#fff',9,'left');txt('● '+DB.wallet,W-6,12,'#ffd84a',8,'right');
  const [dx,dy]=DV[o.dir],th=!o.mv&&owThing(o.x+dx,o.y+dy),hint=th&&th.lady?'A: talk to the shop lady':th&&th.pen?'A: look at the animal':th&&th.exit?'Walk out the door':null;
  if(ui.msgT>0){}else if(hint){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(hint,W/2,H-19,'#2b2440',8)}else txt('✚ walk  A talk  B leave',W/2,H-4,'#fff',7)}
drawOverworld=function(t){if(CUR==='shop')return drawShop(t);return _drawOW(t)};
