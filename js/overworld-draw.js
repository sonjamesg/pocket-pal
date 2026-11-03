// ===== overworld-draw.js — walking, input, drawOverworld, farmer =====
const DV={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function owAt(id){const i=petList().slice(0,6).findIndex(p=>p.id===id);if(i<0)return null;const [hx,hy]=HSLOT[i];return{x:hx+1,y:hy+2,dir:'down'}}
function owInit(back){const a=back&&owAt(back);if(a){ui.ow=Object.assign({px:a.x*TS,py:a.y*TS,step:0},a)}else if(!ui.ow)ui.ow={x:13,y:15,dir:'up',px:13*TS,py:15*TS,step:0};ui.ow.mv=null}
function owTry(d){const o=ui.ow;if(o.mv)return;o.dir=d;const [dx,dy]=DV[d],nx=o.x+dx,ny=o.y+dy;if(!owSolid(nx,ny)){o.mv={tx:nx,ty:ny,t:0};o.step++}}
function owUpdate(){const o=ui.ow;if(!o)return;if(o.mv){o.mv.t+=1/8;const k=Math.min(1,o.mv.t);o.px=(o.x+(o.mv.tx-o.x)*k)*TS;o.py=(o.y+(o.mv.ty-o.y)*k)*TS;
    if(k>=1){o.x=o.mv.tx;o.y=o.mv.ty;o.mv=null}}
  if(!o.mv&&!ui.modal){for(const d of ['up','down','left','right'])if(held[d]){owTry(d);break}}}
function owInput(k){const o=ui.ow;if(k==='select'){loadArt(true);say('Art reloaded');return}if(DV[k]){if(!o.mv)owTry(k);return}
  if(k==='a'&&!o.mv){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);if(!th)return;
    if(th.pet){loadPet(th.pet.id);return}if(th.empty){say('An empty plot. Adopt a pet!');newPet();return}
    if(th.lock)say(th.lock+' — coming soon!');else if(th.sign)say('NORTH: Homes  EAST: Barns  S: Field');else if(th.crop)say((th.crop==='C'?'Corn':th.crop==='W'?'Wheat':'Crops')+' — harvesting coming soon!');else if(th.water)say('A shiny pond.');else if(th.wall)say('Go round to the door!')}
  if(k==='b'){if(ui.mapBack&&DB.pets[ui.mapBack])loadPet(ui.mapBack);else{S={scene:'title'};ui.tsel=0}}
  if(k==='start'){S={scene:'title'};ui.tsel=0}}
function farmer(x,y,dir,step,moving){g.save();g.translate(Math.round(x),Math.round(y));const b=moving&&step%2?1:0;E(8,15,5,2,'#0003');
  R(4,9,8,5,'#3a6ad8');R(4+(b?1:0),13,3,3,'#5a3a20');R(9-(b?1:0),13,3,3,'#5a3a20');R(3,9,2,4,'#ffd0a0');R(11,9,2,4,'#ffd0a0');
  R(4,2,8,7,'#ffd0a0');R(3,1,10,3,'#e8402a');R(3,3,dir==='up'?10:2,2,'#e8402a');if(dir==='left')R(1,3,4,1,'#c83020');if(dir==='right')R(11,3,4,1,'#c83020');if(dir==='down')R(3,4,10,1,'#c83020');
  if(dir!=='up'){const ex=dir==='left'?-1:dir==='right'?1:0;R(6+ex,6,1,1,'#222');R(9+ex,6,1,1,'#222')}else R(4,4,8,5,'#7a4a20');g.restore()}
function drawOverworld(t){owUpdate();const o=ui.ow;const cx=Math.max(0,Math.min(MW*TS-W,o.px+8-W/2)),cy=Math.max(0,Math.min(MH*TS-H,o.py+8-H/2+10));
  g.save();g.translate(-Math.round(cx),-Math.round(cy));
  g.imageSmoothingEnabled=false;const ok=n=>IMG[n]&&IMG[n].naturalWidth;
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const c=OWBASE[y][x],X=x*TS,Y=y*TS;
    if(ok('grass'))g.drawImage(IMG.grass,X,Y);else R(X,Y,TS,TS,'#78c858');
    const n={C:'corn',W:'wheat',p:'path',w:'water',c:'field',f:'fence',t:'tree',s:'sign'}[c];
    if(n==='water'&&ok('water'))g.drawImage(IMG.water,X+((t>>4)%2?0:0),Y);else if(n&&ok(n))g.drawImage(IMG[n],X,Y);else if(n)R(X,Y,TS,TS,{path:'#e8d8a0',water:'#4888e8',field:'#986838',fence:'#b07038',corn:'#d0b040',wheat:'#e8c860',tree:'#307030',sign:'#c89a60'}[n])}
  const L=petList().slice(0,6);
  HSLOT.forEach(([hx,hy],i)=>{const p=L[i],X=hx*TS+24,Y=hy*TS+32;if(p){const sp=spOf(p);house(sp,X,Y,.66,false,p.name);R(X-4,Y-1,8,2,'#5a3a20')}
    else{g.fillStyle='#0001';g.fillRect(hx*TS+2,hy*TS+2,44,28);txt('EMPTY',X,Y-12,'#ffffffaa',6)}});
  LOCKS.forEach(([hx,hy,n])=>lockedHouse(n,hx*TS+24,hy*TS+30,.66));
  if(ok('farmer')){const row={down:0,up:1,left:2,right:3}[o.dir],fr=o.mv&&o.step%2?1:0;g.drawImage(IMG.farmer,fr*16,row*16,16,16,Math.round(o.px),Math.round(o.py)-4-(o.mv&&o.mv.t>.3&&o.mv.t<.7?1:0),16,16)}else farmer(o.px,o.py-3,o.dir,o.step,!!o.mv);g.restore();
  R(0,0,W,16,'#2b2440cc');txt('PET FARM',6,12,'#fff',9,'left');txt('● '+petList().reduce((a,p)=>a+(p.coins||0),0),W-6,12,'#ffd84a',8,'right');
  const [dx,dy]=DV[o.dir],th=!o.mv&&owThing(o.x+dx,o.y+dy);
  if(th&&(th.pet||th.empty)){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(th.pet?'A: visit '+th.pet.name:'A: adopt a pet here',W/2,H-19,'#2b2440',8)}
  else txt('✚ walk  A use  B back',W/2,H-4,'#fff',7)}
