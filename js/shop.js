// ===== shop.js — PET SHOP interior map (enter from Wild Woods door) =====
// legend: # wall, . floor, k counter (lady behind), b behind-counter, c cage block, p pen block, D door/exit
const SHOP_ROWS=["################","################","#pp.bbbbbbbb.pp#","#pp.kkkkkkkk.pp#","#..............#","#pp..........pp#","#pp..........pp#","#..............#","#pp..........pp#","#pp..........pp#","#..............#","#######DD#######"];
MAPS.shop={name:'PET SHOP',w:16,h:12,gate:[[7,11],[8,11]],rows:SHOP_ROWS.map(r=>r.split(''))};
const SHOP_LADY=[8,2],SHOP_PENS=[[1,2,'dog0'],[13,2,'cat'],[1,5,'dog1'],[13,5,'rabbit'],[1,8,'cat2'],[13,8,'rabbit2']];
// v104: open play pens (no cages) — chunky toy-wood fence, soft rug, two pets playing + a toy
function shopPenFloor(X,Y,i){RR(X+1,Y+3,30,28,6,['#bfe39a','#ffd6e6','#cfe6ff'][i%3]);for(let k=0;k<6;k++)E(X+5+k*4.5,Y+12+(k%2)*9,1.6,1,'#fff8');}
function shopPenPets(X,Y,a,i,t){const kind=a.replace(/\d/,''),ph=t/40+i*1.7,ch=Math.sin(ph);
  const draw=(dx,hop,dir,pose,j)=>{g.save();g.translate(X+16+dx,Y+26-hop);g.scale(.38,.38);if(kind==='dog')dog(0,0,BKEYS[(i*2+j)%BKEYS.length],'puppy',{pose,mood:'happy',dir});else{g.scale(1.8,1.8);critter(0,0,kind,'adult',{pose,mood:'happy',dir,sv:kind==='cat'?(j?'cat_black':undefined):undefined})}g.restore()};
  const bx=X+16+Math.sin(ph*1.3)*9,by=Y+24-Math.abs(Math.sin(ph*2.6))*5;E(bx,Y+26,2.5,1,'#0003');
  if(kind==='cat'){g.strokeStyle='#ffd84a';g.lineWidth=1;g.beginPath();g.moveTo(X+16,Y+4);g.lineTo(bx,by);g.stroke();E(bx,by,2,2,'#ff5a8b')}else{E(bx,by,2.5,2.5,kind==='rabbit'?'#ff9a3a':'#e84848');if(kind==='rabbit')R(bx-.5,by-4,1,2,'#3a9a3a')}
  draw(-7+ch*3,Math.max(0,Math.sin(ph*2.2))*(kind==='rabbit'?5:3),Math.cos(ph)>0?1:-1,((t>>6)+i)%4===0?'sit':'walk',0);
  draw(7-ch*3,Math.max(0,Math.sin(ph*2.2+2))*(kind==='rabbit'?5:3),Math.cos(ph)>0?-1:1,'walk',1);
  if(((t>>5)+i*3)%17===0){g.save();g.font='8px sans-serif';g.textAlign='center';g.fillText('♥',X+16,Y+8);g.restore()}}
function shopPenFence(X,Y){const w='#e0a060',d='#9a5a2a';[[X,Y+3],[X,Y+29]].forEach(([x,y])=>{RR(x,y-2,32,4,2,w);R(x,y+1,32,1,d)});[X,X+29].forEach(x=>{RR(x,Y+1,3,31,1.5,w);R(x+2,Y+1,1,31,d)});[[X,Y],[X+29,Y],[X,Y+27],[X+29,Y+27]].forEach(([x,y])=>{RR(x-1,y,5,6,2,'#ffd08a','#9a5a2a')})}

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
    if(th.pen){const n={dog0:'A playful pup!',dog1:'This pup wags at you!',cat:'Kittens playing with a toy!',cat2:'These cats love a cuddle!',rabbit:'Bunnies hopping about!',rabbit2:'Fluffy bunnies nibbling carrots!'}[th.pen];say(n);return}
    if(th.shelf)say('Shelves of pet food and toys.')}};
function shopLady(X,Y){const LI=IMG.npc_lady;if(LI&&LI.naturalWidth){E(X+8,Y+15,6,2,'#0003');g.drawImage(LI,((Date.now()/700|0)%4===0?16:0),0,16,24,X,Y-9,16,24);return}E(X+8,Y+15,6,2,'#0003');R(X+3,Y+8,10,7,'#e86a9a');R(X+4,Y+9,8,6,'#fff');R(X+6,Y+11,4,2,'#e86a9a');R(X+2,Y+9,2,4,'#ffd8b8');R(X+12,Y+9,2,4,'#ffd8b8');
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
  // v104 open play pens
  SHOP_PENS.forEach(([px,py,a],i)=>{const X=px*TS,Y=py*TS;shopPenFloor(X,Y,i);shopPenPets(X,Y,a,i,t);shopPenFence(X,Y)});
  // mat by the door
  R(6*TS+4,10*TS+6,4*TS-8,8,'#5a8a48');
  const AVS=avImg('s'),FS=DB.avatar==='girl'&&IMG.farmergirl&&IMG.farmergirl.naturalWidth?'farmergirl':'farmer';
  if(AVS||(IMG[FS]&&IMG[FS].naturalWidth)){const row={down:0,up:1,left:2,right:3}[o.dir],fr=o.mv&&o.step%2?1:0;const SI=AVS||IMG[FS],FH=(SI.height||SI.naturalHeight)/4;g.drawImage(SI,fr*16,row*FH,16,FH,Math.round(o.px),Math.round(o.py)-4-(FH-16),16,FH);if(P3D)hatTop(o.px+8,Math.round(o.py)-1-(FH-16))}else farmer(o.px,o.py-3,o.dir,o.step,!!o.mv);
  g.restore();
  R(0,0,W,16,'#2b2440cc');txt('PET SHOP',6,12,'#fff',9,'left');txt('● '+DB.wallet,W-6,12,'#ffd84a',8,'right');
  const [dx,dy]=DV[o.dir],th=!o.mv&&owThing(o.x+dx,o.y+dy),hint=th&&th.lady?'A: talk to the shop lady':th&&th.pen?'A: look at the animal':th&&th.exit?'Walk out the door':null;
  if(ui.msgT>0){}else if(hint){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(hint,W/2,H-19,'#2b2440',8)}else txt('✚ walk  A talk  B leave',W/2,H-4,'#fff',7)}
drawOverworld=function(t){if(CUR==='shop')return drawShop(t);return _drawOW(t)};

// ===== v55 angled PET SHOP: looking into the shop from the door, tall back wall, counter + cages as toy billboards =====
function drawShop3D(t){owUpdate();const o=ui.ow,cx=Math.round((MW*TS-W)/2),cy=Math.round(Math.max(-20,Math.min(MH*TS-H+4,o.py+8-H/2)));
  g.fillStyle='#181020';g.fillRect(0,0,W,H);P3Q=[];P3GROUND=true;p3dBegin(cx,cy);g.fillStyle='#2a1a14';g.fillRect(P3C.ox-40,P3C.oy-40,W/P3.A+80,H/P3.A+80);g.imageSmoothingEnabled=false;
  for(let y=2;y<MH;y++)for(let x=0;x<MW;x++){const c=OWBASE[y][x],X=x*TS,Y=y*TS;
    if(c==='#'){R(X,Y,TS,TS,'#6a4028');continue}R(X,Y,TS,TS,(x+y)%2?'#f8e8c8':'#ecd8b0');R(X,Y+15,TS,1,'#d8c098');
    if(c==='D'){R(X,Y,TS,TS,'#c84848');R(X+1,Y+1,TS-2,TS-2,'#e86060')}}
  SHOP_PENS.forEach(([px,py],i)=>shopPenFloor(px*TS,py*TS,i));
  R(6*TS+4,10*TS+6,4*TS-8,8,'#5a8a48');
  P3GROUND=false;p3dWarp('#2a1a14');g.save();g.translate(-cx,-cy);
  const L=TS,Rx=(MW-1)*TS,WH=62;
  // back wall
  withProj((L+Rx)/2,2*TS,()=>{const top=2*TS-WH,w=Rx-L;R(L,top,w,WH,'#f6e2bc');for(let x=L+4;x<Rx;x+=10)R(x,top,4,WH-16,'#ffeccc');R(L,2*TS-16,w,16,'#e86a9a');R(L,2*TS-17,w,2,'#ffb0cc');R(L,top,w,5,'#6a4028');
    [L+14,L+54,Rx-84,Rx-44].forEach(x=>{RR(x-1,top+11,26,20,4,'#6a4028');R(x+1,top+13,22,16,'#9ad8ff');R(x+1,top+21,22,8,'#c8ecff');R(x+12,top+13,1,16,'#6a4028');R(x+3,top+14,5,2,'#fff')});
    RR((L+Rx)/2-34,top+6,68,14,6,'#ff5a8b','#2b2440');txt('PET SHOP',(L+Rx)/2,top+17,'#fff',9);
    for(let x=4*TS;x<12*TS;x+=8){R(x,top+36,8,3,'#8a5a30');[['#e85050',1],['#50a0e8',4]].forEach(([c,i])=>RR(x+i,top+29,3,7,1,c))}
    R(L-4,top-6,w+8,7,'#5a3418');R(L-4,top-6,w+8,2,'#8a5a2e')});
  p3SideWalls(L,Rx,2*TS,(MH-1)*TS+8,WH,'#e8c8a0','#6a4028');
  const items=[];
  // shop lady behind a chunky counter (counter front face is tall so it reads as a toy block)
  items.push([3*TS+16,()=>{{const ly=SHOP_LADY[1]*TS+8+Math.round(Math.sin(t/20));shopLady(SHOP_LADY[0]*TS,ly);E(SHOP_LADY[0]*TS+8,ly-8,5,2.4,'#7a3a20');E(SHOP_LADY[0]*TS+8,ly-11,3,2.4,'#7a3a20');E(SHOP_LADY[0]*TS+7,ly-12,1.2,.7,'#b06a40')}const X=4*TS,Y=3*TS+16;R(X,Y-14,8*TS,14,'#c88a50');R(X,Y-14,8*TS,3,'#e8b070');R(X,Y-3,8*TS,3,'#6a4020');for(let i=0;i<8;i++)RR(X+i*TS+3,Y-11,10,6,2,'#a86a3a');R(X+5*TS,Y-20,10,6,'#505868');R(X+5*TS+2,Y-19,6,2,'#9ae0a0');RR(X+2*TS,Y-19,10,5,2,'#f0e0a0')},4*TS+64]);
  SHOP_PENS.forEach(([px,py,a],i)=>{const X=px*TS,Y=py*TS;items.push([Y+32,()=>{shopPenPets(X,Y,a,i,t);shopPenFence(X,Y)},X+16]);});
  items.push([o.py+16,()=>{const AVS=avImg('s'),FS=DB.avatar==='girl'&&IMG.farmergirl&&IMG.farmergirl.naturalWidth?'farmergirl':'farmer';E(o.px+8,o.py+12,6,2,'#0004');
    if(AVS||(IMG[FS]&&IMG[FS].naturalWidth)){const row={down:0,up:1,left:2,right:3}[o.dir],fr=o.mv&&o.step%2?1:0;const SI=AVS||IMG[FS],FH=(SI.height||SI.naturalHeight)/4;g.drawImage(SI,fr*16,row*FH,16,FH,Math.round(o.px),Math.round(o.py)-4-(FH-16),16,FH);if(P3D)hatTop(o.px+8,Math.round(o.py)-1-(FH-16))}else farmer(o.px,o.py-3,o.dir,o.step,!!o.mv)},o.px+8]);
  items.sort((a,b)=>a[0]-b[0]).forEach(([y,fn,x])=>withProj(x,y,fn));
  g.restore();
  R(0,0,W,16,'#2b2440cc');txt('PET SHOP',6,12,'#fff',9,'left');txt('● '+DB.wallet,W-6,12,'#ffd84a',8,'right');
  const [dx,dy]=DV[o.dir],th=!o.mv&&owThing(o.x+dx,o.y+dy),hint=th&&th.lady?'A: talk to the shop lady':th&&th.pen?'A: look at the animal':th&&th.exit?'Walk out the door':null;
  if(ui.msgT>0){}else if(hint){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(hint,W/2,H-19,'#2b2440',8)}else txt('✚ walk  A talk  B leave',W/2,H-4,'#fff',7)}
{const _ds=drawShop;drawShop=function(t){return P3D?drawShop3D(t):_ds(t)}}
