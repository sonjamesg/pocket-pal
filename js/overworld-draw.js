// ===== overworld-draw.js — walking, input, drawOverworld, farmer =====
const DV={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function owAt(id){const i=petList().slice(0,6).findIndex(p=>p.id===id);if(i<0)return null;const [hx,hy]=HSLOT[i];return{x:hx+1,y:hy+2,dir:'down'}}
function owInit(back){const a=back&&owAt(back);if(a){setMap('ranch');ui.ow=Object.assign({px:a.x*TS,py:a.y*TS,step:0,map:'ranch'},a)}else if(!ui.ow){const [sx,sy]=MAP_LAYOUT.start;setMap('ranch');ui.ow={x:sx,y:sy+1,dir:'down',px:sx*TS,py:(sy+1)*TS,step:0,map:'ranch'}}else setMap(ui.ow.map||'ranch');ui.ow.mv=null;grandpaAllowance()}
function owTry(d){const o=ui.ow;if(o.mv)return;o.dir=d;const [dx,dy]=DV[d],nx=o.x+dx,ny=o.y+dy;if(!owSolid(nx,ny)){o.mv={tx:nx,ty:ny,t:0};o.step++}}
function owUpdate(){const o=ui.ow;if(!o)return;if(o.mv){o.mv.t+=1/8;const k=Math.min(1,o.mv.t);o.px=(o.x+(o.mv.tx-o.x)*k)*TS;o.py=(o.y+(o.mv.ty-o.y)*k)*TS;
    if(k>=1){o.x=o.mv.tx;o.y=o.mv.ty;o.mv=null;owGate()}}
  if(!o.mv&&!ui.modal){for(const d of ['up','down','left','right'])if(held[d]){owTry(d);break}}}
function owInput(k){const o=ui.ow;if(k==='select'){loadArt(true);say('Art reloaded');return}if(DV[k]){if(!o.mv)owTry(k);return}
  if(k==='a'&&!o.mv){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);if(!th)return;
    if(th.barn){barnTalk(th.barn);return}if(CUR==='ranch'&&(th.weed||th.water)){chore(o.x+dx,o.y+dy,th.weed?'weed':'water');return}if(th.pet){loadPet(th.pet.id);return}if(th.empty){say('An empty plot. Buy a pet at the PET SHOP in the woods!');return}if(th.store){openStore();return}if(th.home){say('Home sweet home! Pets come from the PET SHOP in the WILD WOODS.');return}
    if(th.gate){owGate();return}if(th.lock)say(th.lock+' — coming soon!');else if(th.sign)say(CUR==='ranch'?'N: Homes  E: Barns  S: Gate to the WILD WOODS':'N: Ranch gate  — explore the woods!');else if(th.prop)say(PROP_MSG[th.prop]||'Part of the ranch.');else if(th.bed)say('A pretty flower bed.');else if(th.hay)say('A bale of sweet-smelling hay.');else if(th.crop)say((th.crop==='C'?'Corn':th.crop==='W'?'Wheat':th.crop==='U'?'Pumpkins':'Tilled soil')+' — harvesting coming soon!');else if(th.water)say(CUR==='ranch'?'A shiny pond.':'Cool, clear water.');else if(th.rock)say('A mossy rock.');else if(th.tree)say(th.tree==='apple'?'An apple tree heavy with red apples!':'A big leafy tree.');else if(th.wall)say('Go round to the door!')}
  if(k==='b'&&CUR!=='ranch'){const [gx,gy]=MAPS.outer.gate[0];Object.assign(o,{x:gx,y:gy});owGate();return}
  if(k==='b'){if(ui.mapBack&&DB.pets[ui.mapBack])loadPet(ui.mapBack);else{S={scene:'title'};ui.tsel=0}}
  if(k==='start'){S={scene:'title'};ui.tsel=0}}
function farmer(x,y,dir,step,moving){g.save();g.translate(Math.round(x),Math.round(y));const b=moving&&step%2?1:0;E(8,15,5,2,'#0003');
  R(4,9,8,5,'#3a6ad8');R(4+(b?1:0),13,3,3,'#5a3a20');R(9-(b?1:0),13,3,3,'#5a3a20');R(3,9,2,4,'#ffd0a0');R(11,9,2,4,'#ffd0a0');
  R(4,2,8,7,'#ffd0a0');R(3,1,10,3,'#e8402a');R(3,3,dir==='up'?10:2,2,'#e8402a');if(dir==='left')R(1,3,4,1,'#c83020');if(dir==='right')R(11,3,4,1,'#c83020');if(dir==='down')R(3,4,10,1,'#c83020');
  if(dir!=='up'){const ex=dir==='left'?-1:dir==='right'?1:0;R(6+ex,6,1,1,'#222');R(9+ex,6,1,1,'#222')}else R(4,4,8,5,'#7a4a20');g.restore()}
function isK(set,x,y){if(x<0||y<0||x>=MW||y>=MH)return set.includes(OWBASE[Math.max(0,Math.min(MH-1,y))][Math.max(0,Math.min(MW-1,x))]);return set.includes(OWBASE[y][x])}
// 4-quadrant autotile: atlas col = 0 interior,1 outer corner,2 top/bottom edge,3 left/right edge,4 inner corner; row = TL,TR,BL,BR
function autoT(im,set,x,y,X,Y){[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sy],q)=>{const h=isK(set,x+sx,y),v=isK(set,x,y+sy),d=isK(set,x+sx,y+sy);
  const st=!h&&!v?1:h&&v?(d?0:4):h?2:3;g.drawImage(im,st*8,q*8,8,8,X+(sx>0?8:0),Y+(sy>0?8:0),8,8)})}
const TREE_SP={T:'tree2',P:'pine2',A:'apple2'};
const PROP_MSG={windmill:'The old windmill creaks round — it pumps water for the ranch!',silo:'A tall silo packed with grain for the winter.',well:'Grandpa\'s wishing well. The water is cool and clear.',scarecrow:'Mr. Straw keeps the crows off the crops!',trough:'A water trough for thirsty animals.'};
function drawOverworld(t){owUpdate();const o=ui.ow;const cx=Math.max(0,Math.min(MW*TS-W,o.px+8-W/2)),cy=Math.max(-16,Math.min(MH*TS-H,o.py+8-H/2+10));
  CAMC=[cx+W/2,cy+H/2];g.fillStyle='#205828';g.fillRect(0,0,W,H);g.save();g.translate(-Math.round(cx),-Math.round(cy));
  g.imageSmoothingEnabled=false;const ok=n=>IMG[n]&&IMG[n].naturalWidth;
  const x0=Math.max(0,Math.floor(cx/TS)-2),x1=Math.min(MW-1,Math.ceil((cx+W)/TS)+1),y0=Math.max(0,Math.floor(cy/TS)-2),y1=Math.min(MH-1,Math.ceil((cy+H)/TS)+1);
  const wa=ok('waterauto1')&&(t>>5)%2?'waterauto1':'waterauto0',trees=[],fences=[];
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const c=OWBASE[y][x],X=x*TS,Y=y*TS,hh=((x*73856093)^(y*19349663))>>>0,gv=hh%10<6?0:hh%10<8?1:hh%10<9?2:3;
    if(ok('grass'+gv))g.drawImage(IMG['grass'+gv],X,Y);else if(ok('grass'))g.drawImage(IMG.grass,X,Y);else R(X,Y,TS,TS,'#78c858');
    if(c==='w'||c==='B'){if([[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]].some(([a,b])=>isK('b',x+a,y+b)))R(X,Y,TS,TS,'#f0e0a8');if(ok(wa))autoT(IMG[wa],'wB',x,y,X,Y);else R(X,Y,TS,TS,'#4888e8');if(c==='B'){if(ok('bridge'))g.drawImage(IMG.bridge,X,Y);else R(X,Y,TS,TS,'#a06830')}continue}
    if(c==='b'){if(ok('sandauto'))autoT(IMG.sandauto,'bwB',x,y,X,Y);else R(X,Y,TS,TS,'#f0e0a8');continue}
    if(c==='p'||c==='G'){if(ok('pathauto'))autoT(IMG.pathauto,'pGB',x,y,X,Y);else R(X,Y,TS,TS,'#e8d8a0');continue}
    if(TREE_SP[c]){trees.push([x,y,TREE_SP[c]]);continue}if(c==='f'){fences.push([x,y]);continue}
    const n={U:'pumpkin',Y:'flowerbed',y:'hay',C:'corn',W:'wheat',c:'field',f:'fence',s:'sign',h:'tallgrass',F:'flower0',J:'flower1',K:'flower2',r:'rock'}[c];
    if(n==='hay'&&ok('p_hay'))g.drawImage(IMG.p_hay,X,Y);else if(n&&ok(n))g.drawImage(IMG[n],X,Y);else if(n)R(X,Y,TS,TS,{field:'#986838',fence:'#b07038',corn:'#d0b040',wheat:'#e8c860',sign:'#c89a60',tallgrass:'#309028',flower0:'#f05868',flower1:'#f8e048',flower2:'#fff',rock:'#8890a0'}[n])}
  // gate posts either side of the gate tiles
  {const gt=MAPS[CUR].gate,gx=gt[0][0],gy=gt[0][1];if(ok('gatepost')){g.drawImage(IMG.gatepost,(gx-1)*TS,gy*TS);g.drawImage(IMG.gatepost,(gx+gt.length)*TS,gy*TS)}
    RR(gx*TS-6,gy*TS+(CUR==='ranch'?-11:17),gt.length*TS+12,10,3,'#6a4020','#382010');txt(CUR==='ranch'?'WILD WOODS':'RANCH',gx*TS+gt.length*8,gy*TS+(CUR==='ranch'?-3:25),'#fff',6)}
  const drawTrees=front=>trees.forEach(([x,y,n])=>{if((y+1>o.y)!==front)return;if(ok(n)){const im=IMG[n];E(x*TS+16,y*TS+30,13,4,'#0a281438');drawLean(im,x*TS,y*TS)}else{E(x*TS+16,y*TS+14,14,12,'#307030')}});
  const drawFences=front=>fences.forEach(([x,y])=>{if((y>o.y)===front)drawFence(x,y)});
  drawFences(false);drawTrees(false);
  if(CUR!=='ranch'){const [sx,sy]=STORE;if(ok('petstore'))drawLean(IMG.petstore,sx*TS,sy*TS);else{R(sx*TS+2,sy*TS+2,44,28,'#f0a040')}RR(sx*TS+4,sy*TS-9,40,9,3,'#ff5a8b','#2b2440');txt('PET SHOP',sx*TS+24,sy*TS-2,'#fff',6)}
  if(CUR==='ranch'){
  if(ok('b_farmhouse')){const [hx,hy]=HOME;drawLean(IMG.b_farmhouse,hx*TS-8,(hy-2)*TS)}else {const [hx,hy]=HOME,X=hx*TS,Y=hy*TS;E(X+24,Y+31,24,4,'#0003');R(X+3,Y+12,42,20,'#e8c890');for(let i=0;i<5;i++)R(X+3,Y+15+i*4,42,1,'#c8a070');g.fillStyle='#3a6ad8';g.beginPath();g.moveTo(X-1,Y+14);g.lineTo(X+24,Y-6);g.lineTo(X+49,Y+14);g.fill();g.fillStyle='#2a4aa8';g.fillRect(X-1,Y+12,50,3);R(X+20,Y+20,8,12,'#7a4a20');R(X+26,Y+26,1,1,'#ffd84a');R(X+7,Y+18,9,7,'#9ad8ff');R(X+32,Y+18,9,7,'#9ad8ff');R(X+7,Y+21,9,1,'#fff');R(X+32,Y+21,9,1,'#fff');R(X+36,Y-2,5,8,'#a04030')}
  const L=petList().slice(0,6);
  HSLOT.forEach(([hx,hy],i)=>{const p=L[i],X=hx*TS+24,Y=hy*TS+32;if(p){const sp=spOf(p);if(sp==='dog'&&ok('b_doghouse')){drawLean(IMG.b_doghouse,hx*TS,(hy-1)*TS);RR(X-14,Y+1,28,8,3,'#fff8');txt(p.name.slice(0,6),X,Y+7,'#5b4b8a',5)}else house(sp,X,Y,.66,false,p.name);R(X-4,Y-1,8,2,'#5a3a20')}
    else{const px=hx*TS,py=hy*TS;g.fillStyle='#a0783c55';g.fillRect(px+4,py+6,40,22);g.fillStyle='#7a5030';[[px+3,py+5],[px+43,py+5],[px+3,py+26],[px+43,py+26]].forEach(([a,b])=>g.fillRect(a,b,2,4));R(px+22,py+18,4,10,'#7a5030');R(px+17,py+14,14,6,'#e8d0a0')}});
  LOCKS.forEach(([hx,hy,n])=>lockedHouse(n,hx*TS+24,hy*TS+30,.66));
  }
  const big=CUR==='ranch'?BARNS.map(b=>({b,bot:b[1]+b[3]-1})).concat(PROPS.map(q=>({q,bot:q[1]+q[3]-1}))):[];
  const drawBig=front=>big.forEach(({b,q,bot})=>{if((bot>=o.y)!==front)return;
    if(b){const [bx,by,bw,bh,id,n]=b,k='b_'+id,X=bx*TS,Y=(by-1)*TS;E(X+bw*8+3,(by+bh)*TS-2,bw*8+2,5,'#0a281444');if(ok(k))drawLean(IMG[k],X,Y);else R(X+2,Y+18,bw*TS-4,bh*TS-4,'#b04030');
      const lw=n.length*4+8;RR(X+bw*8-lw/2,(by+bh)*TS-1,lw,8,3,'#6a4020','#382010');txt(n,X+bw*8,(by+bh)*TS+5,'#fff',5)}
    else{const [px,py,pw,ph,id]=q,k='p_'+id;if(!ok(k))return;const im=IMG[k];let X=px*TS+pw*8-im.width/2,Y=(py+ph)*TS-im.height;
      if(id==='windmill'){drawLean(im,X,Y);const [lx,ly]=leanOff(X+im.width/2,Y+im.height,im.height-24),a=t/40,cx=X+24+lx,cy=Y+24+ly;g.save();g.translate(cx,cy);g.rotate(a);for(let i=0;i<4;i++){g.rotate(Math.PI/2);R(-1,-22,2,22,'#4a2c14');R(1,-22,6,15,'#f8f4e8');R(1,-22,6,1,'#6a4a2a');R(6,-22,1,15,'#6a4a2a');R(1,-14,6,1,'#b0a080')}g.restore();E(cx,cy,3,3,'#6a4020')}
      else drawLean(im,X,Y)}});
  drawBig(false);
  const AVS=avImg('s'),FS=DB.avatar==='girl'&&ok('farmergirl')?'farmergirl':'farmer';if(AVS||ok(FS)){const row={down:0,up:1,left:2,right:3}[o.dir],fr=o.mv&&o.step%2?1:0;g.drawImage(AVS||IMG[FS],fr*16,row*16,16,16,Math.round(o.px),Math.round(o.py)-4-(o.mv&&o.mv.t>.3&&o.mv.t<.7?1:0),16,16)}else farmer(o.px,o.py-3,o.dir,o.step,!!o.mv);drawBig(true);drawFences(true);drawTrees(true);g.restore();
  R(0,0,W,16,'#2b2440cc');txt(CUR==='ranch'?'PET FARM':MAPS.outer.name,6,12,'#fff',9,'left');txt('● '+DB.wallet,W-6,12,'#ffd84a',8,'right');
  const [dx,dy]=DV[o.dir],th=!o.mv&&owThing(o.x+dx,o.y+dy);
  if(th&&(th.pet||th.empty)){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(th.pet?'A: visit '+th.pet.name:'Empty plot — buy a pet at the PET STORE',W/2,H-19,'#2b2440',8)}
  else if(th&&th.gate){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(CUR==='ranch'?'Walk on: leave for the WILD WOODS':'Walk on: back to the RANCH',W/2,H-19,'#2b2440',8)}
  else if(th&&th.home){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt('A: go inside your ranch house',W/2,H-19,'#2b2440',8)}
  else if(th&&th.barn){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt((th.door?'A: go inside the ':'A: look at the ')+th.barn[5],W/2,H-19,'#2b2440',8)}
  else if(th&&CUR==='ranch'&&(th.weed||th.water)){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(th.weed?'A: pull weeds (+coins)':'A: fill water bucket (+coins)',W/2,H-19,'#2b2440',8)}
  else if(th&&th.store){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt('A: enter PET SHOP',W/2,H-19,'#2b2440',8)}
  else txt('✚ walk  A use  B back',W/2,H-4,'#fff',7)}
