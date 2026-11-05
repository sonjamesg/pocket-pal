// ===== overworld-draw.js — walking, input, drawOverworld, farmer =====
const DV={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function owAt(id){const i=homePets().slice(0,6).findIndex(p=>p.id===id);if(i<0)return null;const [hx,hy]=HSLOT[i];return{x:hx+1,y:hy+2,dir:'down'}}
function owInit(back){const a=back&&owAt(back);if(a){setMap('ranch');ui.ow=Object.assign({px:a.x*TS,py:a.y*TS,step:0,map:'ranch'},a)}else if(!ui.ow){const [sx,sy]=MAP_LAYOUT.start;setMap('ranch');ui.ow={x:sx,y:sy+1,dir:'down',px:sx*TS,py:(sy+1)*TS,step:0,map:'ranch'}}else setMap(ui.ow.map||'ranch');ui.ow.mv=null;grandpaAllowance()}
function owTry(d){const o=ui.ow;if(o.mv)return;o.dir=d;const [dx,dy]=DV[d],nx=o.x+dx,ny=o.y+dy;if(!owSolid(nx,ny)){o.mv={tx:nx,ty:ny,t:0};o.step++}}
function owUpdate(){const o=ui.ow;if(!o)return;if(o.mv){o.mv.t+=1/8;const k=Math.min(1,o.mv.t);o.px=(o.x+(o.mv.tx-o.x)*k)*TS;o.py=(o.y+(o.mv.ty-o.y)*k)*TS;
    if(k>=1){o.x=o.mv.tx;o.y=o.mv.ty;o.mv=null;owGate()}}
  if(!o.mv&&!ui.modal){for(const d of ['up','down','left','right'])if(held[d]){owTry(d);break}}}/* v68: no hold delay — keep walking the instant a step lands while held; a tap released before the 8-frame step ends is still 1 tile */
function owInput(k){const o=ui.ow;if(k==='select'){loadArt(true);say('Art reloaded');return}if(DV[k]){if(!o.mv)owTry(k);return}
  if(k==='a'&&!o.mv){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);if(!th)return;
    if(th.barn){barnTalk(th.barn);return}if(CUR==='ranch'&&th.weed){chore(o.x+dx,o.y+dy,'weed');return}if(th.pet){loadPet(th.pet.id);return}if(th.empty){say('An empty plot. Buy a pet at the PET SHOP in the woods!');return}if(th.store){openStore();return}if(th.home){say('Home sweet home! Pets come from the PET SHOP in the WILD WOODS.');return}
    if(th.gate){owGate();return}if(th.lock)say(th.lock+' — coming soon!');else if(th.sign)say(farmSign(o.x+dx,o.y+dy)||(CUR==='ranch'?'N: Homes  E: Barns  S: Gate to the WILD WOODS':'N: Ranch gate  — explore the woods!'));else if(th.prop)say(PROP_MSG[th.prop]||'Part of the ranch.');else if(th.bed)say('A pretty flower bed.');else if(th.hay)say('A bale of sweet-smelling hay.');else if(th.crop)say((th.crop==='C'?'Corn':th.crop==='W'?'Wheat':th.crop==='U'?'Pumpkins':'Tilled soil')+' — harvesting coming soon!');else if(th.water)say(CUR==='ranch'?'A shiny pond.':'Cool, clear water.');else if(th.rock)say('A mossy rock.');else if(th.tree)say(th.tree==='apple'?'An apple tree heavy with red apples!':'A big leafy tree.');else if(th.wall)say('Go round to the door!')}
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
// v79: building no-tree boxes [x0,y0,x1,y1] inclusive tiles; 1 tile pad, 3 north (tall roofs), 2 south
const BLD_PROPS='farmshop jobboard achboard windmill silo well';
function bldBoxes(){const L=[],add=(x,y,w,h)=>L.push([x-1,y-3,x+w,y+h+1]);
  if(CUR==='ranch'){BARNS.forEach(b=>add(b[0],b[1],b[2],b[3]));if(HOME)add(HOME[0]-1,HOME[1],4,2);PROPS.forEach(p=>{if(BLD_PROPS.includes(p[4]))add(p[0],p[1],p[2],p[3])})}
  else if(STORE)add(STORE[0]-1,STORE[1]-1,5,3);return L}
const TREE_SP={T:'tree2',P:'pine2',A:'apple2'};
const PROP_MSG={windmill:'The old windmill creaks round — it pumps water for the ranch!',silo:'A tall silo packed with grain for the winter.',well:'Grandpa\'s wishing well. The water is cool and clear.',scarecrow:'Mr. Straw keeps the crows off the crops!',trough:'A water trough for thirsty animals.'};
// v124: bigger barn exteriors (visual scale, footprint/doors unchanged) + facade name plaques (no floating ground labels)
const BARN_SCALE_W=1.18,BARN_SCALE_H=1.32; // v125: taller look, less side overhang onto paths/fences
const BARN_SCALE=BARN_SCALE_W;
function drawBarnArt(im,X,Y,dw,dh){const [dx,dy]=leanOff(X+dw/2,Y+dh,dh/2);g.drawImage(im,0,0,im.width,im.height,Math.round(X+dx),Math.round(Y+dy),Math.round(dw),Math.round(dh))}
function facadePlaque(cx,y,name,maxW){const long=name.length>12,fs=long?4:5,lw=Math.min(maxW||120,Math.ceil(name.length*(long?3.1:3.8)+12));
  const x0=Math.round(cx-lw/2),yy=Math.round(y);
  /* wood board screwed to facade */R(x0-1,yy-9,lw+2,14,'#5a3418');RR(x0,yy-8,lw,12,2,'#c48c50','#3a2010');RR(x0+1,yy-7,lw-2,10,2,'#fff3d6');
  R(x0+3,yy-6,2,2,'#5a3418');R(x0+lw-5,yy-6,2,2,'#5a3418');R(x0+3,yy+1,2,2,'#5a3418');R(x0+lw-5,yy+1,2,2,'#5a3418');
  txt(name,cx,yy+1,'#5a3418',fs)}
// v112: Pet Shop exterior drawn 5x3 tiles (matches the roomy interior) with a big tile-aligned door on the door tile
let _BSI=null;function bigStoreImg(ok){if(_BSI)return _BSI;if(!ok('petstore'))return null;const s=IMG.petstore,w=80,h=Math.round(s.height*w/s.width),c=document.createElement('canvas');c.width=w;c.height=h;const q=c.getContext('2d');q.imageSmoothingEnabled=false;q.drawImage(s,0,0,w,h);
  const k=w/s.width,fy=h-Math.round(4*k);q.fillStyle='#63c2a3';q.fillRect(Math.round(24*k),Math.round(66*k),Math.round(16*k),fy-Math.round(66*k));
  const dx=32,dw=16,dh=30,dy=fy-dh;q.fillStyle='#2b2440';q.fillRect(dx-2,dy-2,dw+4,dh+2);q.fillStyle='#d59125';q.fillRect(dx,dy,dw,dh);q.fillStyle='#f0b848';q.fillRect(dx+2,dy+2,dw-4,dh-6);q.fillStyle='#d59125';q.fillRect(dx+7,dy+2,2,dh-6);q.fillStyle='#bfe8ff';q.fillRect(dx+3,dy+5,3,6);q.fillRect(dx+10,dy+5,3,6);q.fillStyle='#6b462f';q.fillRect(dx+12,dy+16,2,2);q.fillRect(dx-3,fy,dw+6,2);return _BSI=c}
function drawOverworld(t){/* v128: LOW skips overworld P3D warp (measured ~25ms/frame under 4x CPU) — flat map draw, same gameplay/cull */const _p3=P3D;if(typeof GFX!=='undefined'&&GFX.lvl<=0)P3D=false;
try{owUpdate();const o=ui.ow;const cx=Math.max(-40,Math.min(MW*TS-W+40,o.px+8-W/2)),cy=Math.max(-40,Math.min(MH*TS-H+32,o.py+8-H/2+10));
  CAMC=[cx+W/2,cy+H/2];g.fillStyle='#205828';g.fillRect(0,0,W,H);let BB=null;if(P3D){P3Q=[];P3GROUND=true;BB=p3dBegin(Math.round(cx),Math.round(cy));g.fillStyle='#4f9a36';g.fillRect(P3C.ox-40,P3C.oy-40,W/P3.A+80,H/P3.A+80)}else{P3C=null;g.save();g.translate(-Math.round(cx),-Math.round(cy))}
  g.imageSmoothingEnabled=false;const ok=n=>IMG[n]&&IMG[n].naturalWidth;
  const x0=Math.max(0,BB?BB.x0:Math.floor(cx/TS)-2),x1=Math.min(MW-1,BB?BB.x1:Math.ceil((cx+W)/TS)+1),y0=Math.max(0,BB?BB.y0:Math.floor(cy/TS)-2),y1=Math.min(MH-1,BB?BB.y1:Math.ceil((cy+H)/TS)+1);
  const wa=ok('waterauto1')&&(t>>5)%2?'waterauto1':'waterauto0',trees=[],fences=[];
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const c=OWBASE[y][x],X=x*TS,Y=y*TS,hh=((x*73856093)^(y*19349663))>>>0,gv=hh%10<6?0:hh%10<8?1:hh%10<9?2:3;
    if(ok('grass'+gv))g.drawImage(IMG['grass'+gv],X,Y);else if(ok('grass'))g.drawImage(IMG.grass,X,Y);else R(X,Y,TS,TS,'#78c858');
    if(c==='w'&&CUR==='ranch'&&MAP_LAYOUT.pond&&ok('pond')){const [qx,qy,qw,qh]=MAP_LAYOUT.pond;if(x>=qx&&x<qx+qw&&y>=qy&&y<qy+qh)continue}
    if(c==='w'||c==='B'){if([[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]].some(([a,b])=>isK('b',x+a,y+b)))R(X,Y,TS,TS,'#f0e0a8');if(ok(wa))autoT(IMG[wa],'wB',x,y,X,Y);else R(X,Y,TS,TS,'#4888e8');if(c==='B'){if(ok('bridge'))g.drawImage(IMG.bridge,X,Y);else R(X,Y,TS,TS,'#a06830')}continue}
    if(c==='b'){if(ok('sandauto'))autoT(IMG.sandauto,'bwB',x,y,X,Y);else R(X,Y,TS,TS,'#f0e0a8');continue}
    if(c==='p'||c==='G'){if(ok('pathauto'))autoT(IMG.pathauto,'pGB',x,y,X,Y);else R(X,Y,TS,TS,'#e8d8a0');
      if(P3D){const up=y>0?OWBASE[y-1][x]:'p';if(!'pGBbw'.includes(up)){const j=hh%4;R(X,Y,TS,4+j%2,'#3f9a2e');R(X+((hh>>3)%9),Y+4+j%2,5,2,'#3f9a2e');R(X,Y+4+j%2,TS,1,'#2a6a20');R(X,Y,TS,1,'#6ad050')}
        const dn=y<MH-1?OWBASE[y+1][x]:'p';if(!'pGBbw'.includes(dn))R(X,Y+14,TS,2,'#c9934a')}continue}
    if(P3D&&!(typeof GFX!=='undefined'&&GFX.lvl<=0)&&c==='g'&&hh%11===0&&!BARNS.some(b=>x>=b[0]-1&&x<=b[0]+b[2]&&y>=b[1]-4&&y<b[1]+b[3])&&!(x>=HOME[0]-1&&x<=HOME[0]+3&&y>=HOME[1]-4&&y<HOME[1]+2))p3later(X+8,Y+12,()=>grassTuft(X+8,Y+12,hh));
    if(TREE_SP[c]){trees.push([x,y,TREE_SP[c]]);continue}if(c==='f'){fences.push([x,y]);continue}
    const n=(CUR==='ranch'&&x<88&&'CWUcY'.includes(c)&&typeof cropTile==='function')?cropTile(c,x,y):{U:'pumpkin',Y:'flowerbed',y:'hay',C:'corn',W:'wheat',c:'field',f:'fence',s:'sign',h:'tallgrass',F:'flower0',J:'flower1',K:'flower2',r:'rock'}[c];
    if(P3D&&n&&'pumpkin corn wheat sprout tallgrass hay sign rock'.includes(n)&&ok(n==='hay'?'p_hay':n)){if(n!=='tallgrass'&&n!=='rock'&&n!=='hay'&&ok('field'))g.drawImage(IMG.field,X,Y);const im=IMG[n==='hay'?'p_hay':n];p3later(X+8,Y+15,()=>{E(X+8,Y+15,6,2,'#0a281430');g.drawImage(im,X,Y)})}
    else if(n==='hay'&&ok('p_hay'))g.drawImage(IMG.p_hay,X,Y);else if(n&&ok(n))g.drawImage(IMG[n],X,Y);else if(n)R(X,Y,TS,TS,{field:'#986838',fence:'#b07038',corn:'#d0b040',wheat:'#e8c860',sign:'#c89a60',tallgrass:'#309028',flower0:'#f05868',flower1:'#f8e048',flower2:'#fff',rock:'#8890a0'}[n])}
  if(typeof gateRoad==='function')gateRoad();
  if(typeof edgeForest==='function')edgeForest(trees,x0,x1,y0,y1);
  // v79: cull trees whose 2x2 sprite would poke through a building/prop (expanded AABB; roofs extend north)
  {const bx=bldBoxes();if(bx.length){const hit=(x,y)=>bx.some(([a,b,c,d])=>x+1>=a&&x<=c&&y+1>=b&&y<=d);for(let i=trees.length-1;i>=0;i--)if(hit(trees[i][0],trees[i][1]))trees.splice(i,1)}}
  // gate posts either side of the gate tiles
  {const gt=MAPS[CUR].gate,gx=gt[0][0],gy=gt[0][1];if(ok('gatepost')){g.drawImage(IMG.gatepost,(gx-1)*TS,gy*TS);g.drawImage(IMG.gatepost,(gx+gt.length)*TS,gy*TS)}
    RR(gx*TS-6,gy*TS+(CUR==='ranch'?-11:17),gt.length*TS+12,10,3,'#6a4020','#382010');txt(CUR==='ranch'?'WILD WOODS':'RANCH',gx*TS+gt.length*8,gy*TS+(CUR==='ranch'?-3:25),'#fff',6)}
  if(P3D){if(CUR==='ranch')HSLOT.forEach(([hx,hy],i)=>{if(!homePets()[i]){const px=hx*TS,py=hy*TS;g.fillStyle='#a0783c55';g.fillRect(px+4,py+6,40,22)}});owExtras(t,o);P3GROUND=false;p3dWarp();g.save();g.translate(-Math.round(cx),-Math.round(cy))}
  const FY=(o.py!=null?o.py:o.y*TS)/TS;const drawTrees=front=>trees.forEach(([x,y,n])=>{if((y+1>FY)!==front)return;if(P3D)p3flush(y*TS+31);const fx=x*TS+16,fy=y*TS+32;p3shadow(fx,fy-1,22,36);withProj(fx,fy,()=>{if(ok(n)){const im=IMG[n];E(fx,fy-2,13,4,'#0a281438');/* v124: no lean shear — keep trunk rooted at foot while camera scrolls vertically */g.drawImage(im,Math.round(fx-im.width/2),Math.round(fy-im.height))}else{E(fx,fy-18,14,12,'#307030')}})});
  const drawFences=front=>fences.forEach(([x,y])=>{if((y>FY)===front)withProj(x*TS+8,y*TS+14,()=>drawFence(x,y))});
  drawFences(false);drawTrees(false);
  const drawStore=front=>{if(CUR!=='ranch'&&((STORE[1]+1>=FY)===front))withProj(STORE[0]*TS+24,(STORE[1]+2)*TS,()=>{const [sx,sy]=STORE,bx=(sx-1)*TS,by=(sy+2)*TS;const im=bigStoreImg(ok);if(im)drawLean(im,bx,by-im.height);else{R(bx+2,by-46,76,44,'#f0a040')}const ty=by-(im?im.height:60)+30;RR(bx+14,ty,52,12,3,'#ff5a8b','#2b2440');txt('PET SHOP',bx+40,ty+9,'#fff',8)})};let drawHome=()=>{};
  if(CUR==='ranch'){
  drawHome=front=>{if((HOME[1]+1>=FY)!==front)return;if(P3D)p3flush((HOME[1]+2)*TS-1);const [hx,hy]=HOME,baseY=(hy+2)*TS,cx=hx*TS+24;p3shadow(cx,baseY-2,72,80);
    withProj(cx,baseY,()=>{/* v125: larger ranch-house exterior (~matches roomy interior), door stays at footprint bottom-centre */
      if(ok('b_farmhouse')){const im=IMG.b_farmhouse,sw=1.72,sh=1.55,dw=im.width*sw,dh=im.height*sh;drawBarnArt(im,cx-dw/2,baseY-dh,dw,dh);
        /* porch light / door hint */RR(cx-5,baseY-22,10,14,2,'#7a4a20','#3a2010');R(cx+2,baseY-14,1,1,'#ffd84a')}
      else{const X=hx*TS,Y=hy*TS;E(X+24,Y+31,28,4,'#0003');R(X-4,Y+8,56,24,'#e8c890');g.fillStyle='#3a6ad8';g.beginPath();g.moveTo(X-8,Y+12);g.lineTo(X+24,Y-14);g.lineTo(X+56,Y+12);g.fill();R(X+20,Y+18,8,14,'#7a4a20')}
      /* chopped log stack — left of house, on grass, clear of the south path */
      const lx=hx*TS-18,ly=baseY-2;E(lx+8,ly+1,12,3,'#0003');
      [[0,0,'#8a5a2e'],[6,-3,'#a07040'],[12,0,'#6a4020'],[3,-6,'#9a6634'],[9,-5,'#7a4a22']].forEach(([ox,oy,c])=>{RR(lx+ox,ly+oy-4,10,5,2,c,'#3a2010');R(lx+ox+1,ly+oy-3,8,1,'#c48c50')})})};
  const L=homePets().slice(0,6);
  HSLOT.forEach(([hx,hy],i)=>{const p=L[i],X=hx*TS+24,Y=hy*TS+32;if(p)withProj(X,Y,()=>{const sp=spOf(p);if(sp==='dog'&&ok('b_doghouse')){drawLean(IMG.b_doghouse,hx*TS,(hy-1)*TS);plaque(p.name,X,Y+7,5,44)}else house(sp,X,Y,.66,false,p.name);R(X-4,Y-1,8,2,'#5a3a20')});
    else if(!P3D){const px=hx*TS,py=hy*TS;g.fillStyle='#a0783c55';g.fillRect(px+4,py+6,40,22);g.fillStyle='#7a5030';[[px+3,py+5],[px+43,py+5],[px+3,py+26],[px+43,py+26]].forEach(([a,b])=>g.fillRect(a,b,2,4));R(px+22,py+18,4,10,'#7a5030');R(px+17,py+14,14,6,'#e8d0a0')}});
  LOCKS.forEach(([hx,hy,n])=>withProj(hx*TS+24,hy*TS+30,()=>lockedHouse(n,hx*TS+24,hy*TS+30,.66)));
  }
  const big=CUR==='ranch'?BARNS.map(b=>({b,bot:b[1]+b[3]-1})).concat(PROPS.map(q=>({q,bot:q[1]+q[3]-1}))).sort((a,b)=>a.bot-b.bot):[];
  const drawBig=front=>big.forEach(({b,q,bot})=>{if((bot>=FY)!==front)return;const fx=b?b[0]*TS+b[2]*8:q[0]*TS+q[2]*8,fy=b?(b[1]+b[3])*TS:(q[1]+q[3])*TS;if(P3D)p3flush(fy-1);if(b)p3shadow(fx,fy-2,b[2]*TS*BARN_SCALE_W,70);withProj(fx,fy,()=>{
    if(b){const [bx,by,bw,bh,id,n]=b,k='b_'+id,baseY=(by+bh)*TS,cx=bx*TS+bw*8;E(cx+2,baseY-2,bw*8*BARN_SCALE_W*.55,5,'#0a281444');
      if(ok(k)){const im=IMG[k],dw=im.width*BARN_SCALE_W,dh=im.height*BARN_SCALE_H,X=cx-dw/2,Y=baseY-dh;drawBarnArt(im,X,Y,dw,dh);
        /* facade plaque above the door */facadePlaque(cx,baseY-Math.round(dh*.32),n,Math.round(dw-10))}
      else{R(bx*TS+2,by*TS+8,bw*TS-4,bh*TS-4,'#b04030');facadePlaque(cx,baseY-22,n,bw*TS-8)}}
    else{const [px,py,pw,ph,id]=q,k='p_'+id;if(!ok(k))return;const im=IMG[k];let X=px*TS+pw*8-im.width/2,Y=(py+ph)*TS-im.height;
      if(id==='windmill'){drawLean(im,X,Y);const [lx,ly]=leanOff(X+im.width/2,Y+im.height,im.height/2),a=t/40,cx=X+24+lx,cy=Y+24+ly;g.save();g.translate(cx,cy);g.rotate(a);for(let i=0;i<4;i++){g.rotate(Math.PI/2);R(-1,-22,2,22,'#4a2c14');R(1,-22,6,15,'#f8f4e8');R(1,-22,6,1,'#6a4a2a');R(6,-22,1,15,'#6a4a2a');R(1,-14,6,1,'#b0a080')}g.restore();E(cx,cy,3,3,'#6a4020')}
      else drawLean(im,X,Y)}})});
  drawStore(false);drawHome(false);drawBig(false);if(!P3D)owExtras(t,o);
  p3flush(o.py+16);withProj(o.px+8,o.py+16,()=>{E(o.px+8,o.py+12,6,2,'#0004');const AVS=avImg('s'),FS=DB.avatar==='girl'&&ok('farmergirl')?'farmergirl':'farmer';if(AVS||ok(FS)){const row={down:0,up:1,left:2,right:3}[o.dir],fr=o.mv&&o.step%2?1:0;const SI=AVS||IMG[FS],FH=(SI.height||SI.naturalHeight)/4;const Y0=Math.round(o.py)-4-(o.jh||0)-(FH-16)-(o.mv&&o.mv.t>.3&&o.mv.t<.7?1:0);g.drawImage(SI,fr*16,row*FH,16,FH,Math.round(o.px),Y0,16,FH);if(P3D)hatTop(o.px+8,Y0+3)}else farmer(o.px,o.py-3,o.dir,o.step,!!o.mv);});p3flush();drawBig(true);drawStore(true);drawHome(true);drawFences(true);drawTrees(true);g.restore();
  tiltShift();
  // v123: no gameplay PET FARM title strip (wallet chip drawn in owHud)
  const [dx,dy]=DV[o.dir],th=!o.mv&&owThing(o.x+dx,o.y+dy);
  if(ui.msgT>0){}
  else if(th&&(th.pet||th.empty)){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(th.pet?'A: visit '+th.pet.name:'Empty plot — buy a pet at the PET STORE',W/2,H-19,'#2b2440',8)}
  else if(th&&th.gate){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(CUR==='ranch'?'Walk on: leave for the WILD WOODS':'Walk on: back to the RANCH',W/2,H-19,'#2b2440',8)}
  else if(th&&th.home){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt('A: go inside your ranch house',W/2,H-19,'#2b2440',8)}
  else if(th&&th.barn){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt((th.door?'Walk in: ':'A: look at the ')+th.barn[5],W/2,H-19,'#2b2440',8)}
  else if(th&&CUR==='ranch'&&(th.weed||owHint(th))){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(th.weed?'A: pull weeds (+coins)':owHint(th),W/2,H-19,'#2b2440',8)}
  else if(th&&th.store){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt('A: enter PET SHOP',W/2,H-19,'#2b2440',8)}
  else txt(ui.hose!=null?'✚ walk  A spray  B put hose back':'✚ walk  A use  B back',W/2,H-4,'#fff',7);owHud(t)}finally{P3D=_p3}}

// v48: Link's Awakening tilt-shift — soft blur at the top & bottom of the view + warm/cool depth haze
function tiltShift(){const cv=g.canvas,k=cv.width/W;if(!g.filter&&g.filter!=='')return;g.save();g.setTransform(1,0,0,1,0,0);
  [[0,30,1.6],[0,18,2.4],[H-26,26,1.4],[H-14,14,2.2]].forEach(([y,h,b])=>{g.filter='blur('+(b*k/2)+'px)';g.drawImage(cv,0,y*k,cv.width,h*k,0,y*k,cv.width,h*k)});
  g.filter='none';let gr=g.createLinearGradient(0,0,0,cv.height);gr.addColorStop(0,'rgba(255,250,220,.16)');gr.addColorStop(.25,'rgba(255,250,220,0)');gr.addColorStop(.8,'rgba(20,30,60,0)');gr.addColorStop(1,'rgba(20,30,60,.14)');g.fillStyle=gr;g.fillRect(0,0,cv.width,cv.height);g.restore()}
