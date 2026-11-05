// ===== east69.js — v69: hay fields art guard, pens w/ roaming animals, endless edge forest, closed WEST road,
// JUMP (Space / C / pad X or Y — never over farm fences), tree-examine joke chain, street lamps + night windows + lamp collision =====
// --- endless forest beyond the world edge (perimeter is invisible-solid 'x'; we paint trees past it) ---
function edgeForest(trees,x0,x1,y0,y1){const sy=Math.floor((y0-6)/2)*2-1;
  // v91: staggered rows (3 wide, offset every other row) so off-map crowns don't pile up
  for(let gy=sy,r=0;gy<=y1+4;gy+=2,r++){const sx=Math.floor((x0-6)/3)*3-1+(((gy%2+2)>>0)%2?0:0)+(r%2?1.5:0);for(let gx=sx;gx<=x1+4;gx+=3){if(!(gx<0||gy<0||gx>=MW-1||gy>=MH-1))continue;
    if(CUR==='ranch'&&gx<0&&gy===33)continue;const gt=MAPS[CUR].gate;if(gt&&gt.some(([a,b])=>Math.abs(a-gx)<=2.6&&Math.abs(b-gy)<=4))continue; if(gt&&gt.some(([a,b])=>Math.abs(a-gx)<=3.5&&(b===0?gy<=1:gy>=b-1)))continue; // v97: open road corridor off-map past gate // v91: wide clear corridor at gates
    const h=((Math.round(gx*2)*73856093)^(gy*19349663))>>>0,j=((h>>4)%5-2)/10;trees.push([gx+j,gy+(((h>>8)%5)-2)/10,h%3?'pine2':'tree2'])}}
  // v91/v124: thin overlapping trees — sort by stable hash first so keep-set does not depend on camera scan order
  const GT=MAPS[CUR].gate||[],nearGate=t=>GT.some(([a,b])=>t[0]>a-2.2&&t[0]<a+1.2&&Math.abs(t[1]-b)<3);
  const pri=t=>((Math.round(t[0]*10)*73856093)^(Math.round(t[1]*10)*19349663))>>>0;
  trees.sort((a,b)=>pri(a)-pri(b)||a[0]-b[0]||a[1]-b[1]);
  const keep=[],G=new Map(),K=(a,b)=>a+','+b;for(const t of trees){const cx=Math.floor(t[0]/2),cy=Math.floor(t[1]/2);let bad=nearGate(t);
    for(let dy=-1;dy<=1&&!bad;dy++)for(let dx=-1;dx<=1&&!bad;dx++){const L=G.get(K(cx+dx,cy+dy));if(L)for(const u of L)if(Math.abs(u[0]-t[0])<1.6&&Math.abs(u[1]-t[1])<1.3){bad=true;break}}
    if(bad)continue;keep.push(t);const k=K(cx,cy);(G.get(k)||G.set(k,[]).get(k)).push(t)}
  trees.length=0;trees.push(...keep)}
// v97: dirt road continues off-map past each gate so the way to the RANCH / PET SHOP reads clearly
function gateRoad(){const gt=MAPS[CUR].gate;if(!gt)return;const xs=gt.map(q=>q[0]),gy=gt[0][1],x0=Math.min(...xs),n=xs.length,up=gy===0,L=14;const ok=IMG.pathauto&&IMG.pathauto.naturalWidth;
  for(let j=1;j<=L;j++){const ty=up?gy-j:gy+j;for(let i=0;i<n;i++){const X=(x0+i)*TS,Y=ty*TS;if(!ok){R(X,Y,TS,TS,'#e8d8a0');continue}
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sy],q)=>{const edge=(sx<0&&i===0)||(sx>0&&i===n-1);g.drawImage(IMG.pathauto,(edge?3:0)*8,q*8,8,8,X+(sx>0?8:0),Y+(sy>0?8:0),8,8)})}}}
// --- pens: decorative roamers (Clucky Hollow chickens, Muddy Trotters pigs, Gallop Ridge horses) ---
const PEN_ROAM={chickPen:['chicken',.5,[['chicken_white',0],['chicken_brown',1.1],['chicken_rooster',2.3],['chicken_white',3.2],['chicken_brown',4.4],['chicken_white',5.1],['chicken_brown',.7]]],
  pigPen:['pig',.6,[[null,0],[null,1.6],[null,2.9],[null,4.2],[null,5.3]]],
  horsePen:['horse',.7,[[null,0],['horse_donkey',1.9],[null,3.3],[null,4.6],[null,5.7]]]};
function penRoamers(t){for(const k in PEN_ROAM){const P=MAP_LAYOUT[k];if(!P)continue;const [px,py,pw,ph]=P,[sp,sc,L]=PEN_ROAM[k];
  L.forEach(([sv,ph0],i)=>{const q=t/(sp==='chicken'?500:900)+ph0,X=(px+1.5+(pw-3)*(0.5+0.45*Math.sin(q*1.3+i)))*TS,Y=(py+2+(ph-3.5)*(0.5+0.45*Math.sin(q*0.9+i*2.1)))*TS,dir=Math.cos(q*1.3+i)>0?1:-1,
    eat=Math.sin(t/120+i*3)>.4,f=()=>{g.save();g.translate(X,Y);g.scale(sc,sc);try{critter(0,0,sp,'adult',{pose:eat?'eat':'walk',mood:'happy',sv:sv||undefined,dir})}catch(e){}g.restore()};
    if(typeof P3D!=='undefined'&&P3D)p3later(X,Y,f);else f()})}}
// --- closed west road barrier ---
function westBarrier(t){const w=MAP_LAYOUT.westRoad;if(!w)return;const X=w[0]*TS,Y=w[1]*TS,f=()=>{R(X+2,Y-6,3,40,'#5a3418');R(X+11,Y-6,3,40,'#5a3418');
  for(let i=0;i<2;i++){const by=Y+2+i*16;R(X-4,by,24,7,'#fff');for(let s=0;s<24;s+=6)R(X-4+s,by,3,7,'#e83a3a');R(X-4,by+7,24,1,'#2b2440')}
  RR(X+18,Y-14,46,14,3,'#ffe9a0','#6a4020');txt('OPENING',X+41,Y-8,'#c03020',5);txt('SOON!',X+41,Y-2,'#c03020',5)};
  if(typeof P3D!=='undefined'&&P3D)p3later(X+8,Y+31,f);else f()}
// --- street lamps + night window light ---
let LAMPS=null,LAMPSET=null;function lampList(){if(LAMPS)return LAMPS;LAMPS=[];LAMPSET=new Set();const Rw=MAP_LAYOUT.rows,isP=(x,y)=>'pG'.includes((Rw[y]||'')[x]);
  for(let y=1;y<MAP_LAYOUT.height-1;y++)for(let x=1;x<MAP_LAYOUT.width-1;x++){if(Rw[y][x]!=='g')continue;
    const hz=isP(x,y+1)&&isP(x+1,y+1)&&isP(x-1,y+1)&&!isP(x,y-1),vt=isP(x+1,y)&&isP(x+1,y-1)&&isP(x+1,y+1)&&!isP(x-1,y);
    if((hz&&x%8===0)||(vt&&y%7===0&&!hz)){LAMPS.push([x,y]);LAMPSET.add(x+','+y)}}return LAMPS}
function lampAt(x,y){if(!LAMPSET)lampList();return LAMPSET.has(x+','+y)}
// v122: lamp post bases are one-tile solid (grass next to path only — paths stay walkable)
{const _s=owSolid;owSolid=function(x,y){if(CUR==='ranch'&&lampAt(x,y))return true;return _s(x,y)}}
{const _t=owThing;owThing=function(x,y){if(CUR==='ranch'&&lampAt(x,y))return{lamp:1};return _t(x,y)}}
if(typeof owHint==='function'){const _h=owHint;owHint=function(th){if(th&&th.lamp)return 'A street lamp';return _h(th)}}
const nightNow=()=>{const h=dayPhase();return h>=19.25||h<6.5};
function lamps(t){const night=nightNow(),[cx,cy]=CAMC;lampList().forEach(([x,y])=>{const X=x*TS+8,Y=y*TS+14;if(Math.abs(X-cx)>W||Math.abs(Y-cy)>H)return;
  const f=()=>{E(X,Y+1,4,1.5,'#0004');R(X-1,Y-22,3,23,'#3a3048');R(X-2,Y-1,5,2,'#2b2440');RR(X-4,Y-29,9,8,2,night?'#fff2a0':'#d8e8f0','#2b2440');R(X-3,Y-31,7,2,'#2b2440')};
  if(typeof P3D!=='undefined'&&P3D)p3later(X,Y+1,f);else f()})}
let _glowSpr=null;function glowSprite(){if(_glowSpr)return _glowSpr;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),gr=x.createRadialGradient(32,32,2,32,32,32);gr.addColorStop(0,'rgba(255,205,110,1)');gr.addColorStop(1,'rgba(255,190,90,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);return _glowSpr=c}
function nightGlow(t){if(!nightNow()||CUR!=='ranch')return;const cv=g.canvas,k=cv.width/W,kv=cv.height/H;g.save();g.setTransform(k,0,0,kv,0,0);g.globalCompositeOperation='lighter';
  // v92: stable glows — pre-rendered sprite, positions snapped to whole device pixels, scale quantised, no time wobble
  const pt=(wx,wy,up)=>{if(typeof P3D!=='undefined'&&P3D&&P3C){const [sx,sy,s]=proj(wx,wy);return[sx,sy-up*s,s]}return[wx-Math.round(CAMC[0]-W/2),wy-Math.round(CAMC[1]-H/2)-up,1]};
  const spr=glowSprite(),q=v=>Math.round(v*k)/k,qs=v=>Math.round(v*16)/16;
  const pool=(X,Y,r,a)=>{if(X<-r||Y<-r||X>W+r||Y>H+r)return;r=qs(r);g.globalAlpha=Math.min(1,a);g.drawImage(spr,q(X-r),q(Y-r),2*r,2*r);g.globalAlpha=1};
  lampList().forEach(([x,y])=>{const wx=x*TS+8,wy=y*TS+14,[a,b,s]=pt(wx,wy,25),[c,d,s2]=pt(wx,wy,0);pool(a,b,11*s,.9);pool(c,d,34*s2,.42)});
  const win=(wx,wy,up)=>{const [X,Y,s0]=pt(wx,wy,up),s=qs(s0);pool(X,Y,11*s,.8);g.fillStyle='rgba(255,225,130,.85)';g.fillRect(q(X-3*s),q(Y-2.5*s),q(6*s),q(5*s));const [c,d,s2]=pt(wx,wy+6,0);pool(c,d,18*s2,.25)};
  for(const [bx,by,bw,bh] of BARNS){const wy=(by+bh)*TS;win(bx*TS+bw*4,wy,20);win(bx*TS+bw*12,wy,20)}
  win(HOME[0]*TS+12,(HOME[1]+2)*TS,18);win(HOME[0]*TS+36,(HOME[1]+2)*TS,18);
  homePets().slice(0,6).forEach((p,i)=>{const [hx,hy]=HSLOT[i];win(hx*TS+24,(hy+2)*TS,14)});
  PROPS.forEach(([px,py,pw,ph,id])=>{if(id==='farmshop')win(px*TS+pw*8,(py+ph)*TS,14)});
  g.restore()}
{const _ts=tiltShift;tiltShift=function(){_ts();try{nightGlow(ui.anim||0)}catch(e){}}}
{const _ox=owExtras;owExtras=function(t,o){_ox(t,o);if(CUR!=='ranch')return;penRoamers(t);westBarrier(t);lamps(t)}}
// --- signs ---
{const _fs=farmSign;farmSign=function(x,y){if(CUR==='ranch'&&x<8)return 'ROAD CLOSED — the WEST ROAD is OPENING SOON! Come back later, explorer!';return _fs(x,y)}}
// --- JUMP: hop on the spot / while walking; can leap ONE small thing (rock, hay bale, flower bed, 1-tile stream) but NEVER fences, trees or buildings ---
const JUMP_D=14,HOP_OK='ryYw';
function owJump(){const o=ui.ow;if(!o||o.jt>0)return;o.jt=1;sfx&&sfx('blip');if(o.mv)return;const [dx,dy]=DV[o.dir],c=OWBASE[o.y+dy]&&OWBASE[o.y+dy][o.x+dx];
  const n2x=o.x+2*dx,n2y=o.y+2*dy;if(c&&HOP_OK.includes(c)&&owSolid(o.x+dx,o.y+dy)&&!owSolid(n2x,n2y)&&!(OWBASE[n2y]&&OWBASE[n2y][n2x]==='w')){
    // must not be part of a barn/prop footprint (owSolid covers those) and never a fence: 'f' is not in HOP_OK
    o.mv={tx:n2x,ty:n2y,t:0,hop:1};o.step++}}
{const _ou=owUpdate;owUpdate=function(){const o=ui.ow;if(o&&o.mv&&o.mv.hop)o.mv.t-=1/16;_ou();if(o&&o.jt>0){o.jt++;o.jh=Math.sin(Math.PI*Math.min(1,o.jt/JUMP_D))*9;if(o.jt>=JUMP_D&&!(o.mv&&o.mv.hop)){o.jt=0;o.jh=0}}}}
{const _in=input;input=function(k){if(k==='jump'){if(!ui.modal&&S.scene==='map'&&ui.ow)owJump();return}return _in(k)}}
if(typeof KM!=='undefined'){KM[' ']='jump';KM.c='jump'}
// Controller A (and keyboard A): jump while walking when nothing to use in front of you
{const _oi=owInput;owInput=function(k){if(k==='a'&&!ui.modal&&S.scene==='map'&&ui.ow){const o=ui.ow,[dx,dy]=DV[o.dir],th=typeof owThing==='function'?owThing(o.x+dx,o.y+dy):null;
  const use=th&&(th.prop||th.pet||th.empty||th.home||th.barn||th.store||th.gate||th.tree||th.hose!=null||th.poo||th.bed||th.crop||th.weed||th.sheepP||th.rag||th.hayfield||th.lady||th.pen||th.exit||th.shelf||th.station||(typeof owHint==='function'&&owHint(th)));
  if(!use){owJump();return}}return _oi(k)}}
// --- tree examine joke chain (only when looking at trees one after another) ---
const TREE_LINES=['A big leafy tree.','Another big leafy tree.',"It's a tree!",'STOP LOOKING AT TREES!','STOP IT AHHHH'];let treeStreak=0;
{const _oi=owInput;owInput=function(k){const o=ui.ow;if(k==='a'&&o&&!o.mv){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);
    if(th&&th.tree){const n=treeStreak%5;treeStreak++;say(n===0&&th.tree==='apple'?'An apple tree heavy with red apples!':TREE_LINES[n],n>=3?200:140);if(n===4)sfx&&sfx('blip');return}treeStreak=0}
  else if(k==='b')treeStreak=0;return _oi(k)}}
// east hay fields are scenery, not your crops
{const _ot=owThing;owThing=function(x,y){if(CUR==='ranch'&&x>=88&&OWBASE[y]&&OWBASE[y][x]==='W')return{hayfield:1};return _ot(x,y)}}
{const _oi=owInput;owInput=function(k){const o=ui.ow;if(k==='a'&&o&&!o.mv){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);if(th&&th.hayfield){treeStreak=0;say('Rolling fields of golden HAY, swaying in the breeze.',140);return}}return _oi(k)}}
// --- gate UX: A while facing the gate walks you through; louder hint; WILD WOODS "PET SHOP" arrow ---
{const _oi=owInput;owInput=function(k){const o=ui.ow;if(k==='a'&&o&&!o.mv){const [dx,dy]=DV[o.dir],c=OWBASE[o.y+dy]&&OWBASE[o.y+dy][o.x+dx];if(c==='G'){owTry(o.dir);return}}return _oi(k)}}
{const _oh=owHud;owHud=function(t){_oh(t);const o=ui.ow;if(!o||ui.msgT>0||(CUR!=='ranch'&&CUR!=='outer'))return;const gt=MAPS[CUR].gate;if(!gt)return;
  const near=gt.some(([gx,gy])=>Math.abs(gx-o.x)<=2&&Math.abs(gy-o.y)<=3);if(!near)return;const s=CUR==='ranch'?'Walk into the gate ▼ WILD WOODS + PET SHOP':'Walk into the gate ▲ back to the RANCH';
  RR(10,H-48,W-20,16,8,(t>>4)%2?'#ffe14a':'#fff3a0','#2b2440');txt(s,W/2,H-37,'#2b2440',7)}}
{const _ox=owExtras;owExtras=function(t,o){_ox(t,o);if(CUR!=='outer'||!STORE)return;const gx=MAPS.outer.gate[0][0],X=(gx-4)*TS,Y=3*TS+4,f=()=>{R(X+7,Y,3,16,'#5a3418');RR(X-6,Y-12,40,13,3,'#ff5a8b','#2b2440');txt('PET SHOP ▶',X+14,Y-3,'#fff',5)};
  if(typeof P3D!=='undefined'&&P3D)p3later(X+8,Y+16,f);else f()}}
// --- chunky toy-diorama blooms on every flower bed (Y): stems, layered petals w/ shade + highlight, bobbing ---
const BLOOM_C=[['#ff5a8b','#c8306a','#ffc0d8'],['#ffd84a','#d09a10','#fff3a8'],['#ffffff','#c8c8e0','#ffffff'],['#9a6aff','#6a3ad0','#d8c4ff'],['#ff8a3a','#c85a10','#ffd0a0']];
function bloom(X,Y,c,s,t){const [m,d,l]=c;R(X-.5,Y,1.5,6*s,'#3a8a2a');E(X+2.2*s,Y+3*s,2*s,1*s,'#4aa83a');E(X,Y+6*s,3*s,1.2*s,'#0a281430');
  const r=2.6*s;for(let i=0;i<5;i++){const a=i*1.2566+t;E(X+Math.cos(a)*r,Y+Math.sin(a)*r*.75+.6,r*.85,r*.7,d)}
  for(let i=0;i<5;i++){const a=i*1.2566+t;E(X+Math.cos(a)*r*.9,Y+Math.sin(a)*r*.7-.4,r*.75,r*.6,m)}
  E(X-r*.5,Y-r*.7,r*.45,r*.3,l);E(X,Y,r*.45,r*.4,'#ffb020');E(X-.4,Y-.5,r*.2,r*.18,'#fff6c0')}
{const _ox=owExtras;owExtras=function(t,o){_ox(t,o);if(CUR!=='ranch')return;const [cx,cy]=CAMC,x0=Math.max(0,((cx-W)/TS)|0),x1=Math.min(MW-1,((cx+W)/TS)|0),y0=Math.max(0,((cy-H)/TS)|0),y1=Math.min(MH-1,((cy+H)/TS)|0);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(OWBASE[y][x]!=='Y')continue;const ge=grows()[wetKey(x,y)];if(!ge)continue;const gp=Math.min(1,growP(ge));if(gp<.35)continue;const gs=gp>=1?1:.45+gp*.35;const h=((x*73856093)^(y*19349663))>>>0;
    [[4,7],[12,6],[8,13]].forEach(([fx,fy],i)=>{const X=x*TS+fx,Y=y*TS+fy-8,c=BLOOM_C[(h>>>(i*3))%5],s=(1.5+((h>>>(i+2))%3)*.25)*gs,sw=Math.sin(t/40+x+i)*.6,
      f=()=>bloom(X+sw,Y,c,s,(h%7)*.3);if(typeof P3D!=='undefined'&&P3D)p3later(X,Y+6,f);else f()})}}}
// --- v69: pulling weeds is no longer a coin chore/job: tall grass is just scenery ---
{const _ot=owThing;owThing=function(x,y){const r=_ot(x,y);if(r&&r.weed)return null;return r}}
// --- HORSE FOOD: proper horse diet, NO apples ---
SFOODS.horse=[{id:'hay',n:'HAY',v:26},{id:'haylage',n:'HAYLAGE',v:28,joy:3},{id:'greens',n:'FRESH GRASS',v:18,d:'Free grazing!'},{id:'horsenuts',n:'HORSE NUTS',v:24,joy:2},
  {id:'garlic',n:'GARLIC BRICK',v:6,joy:8,d:'Lick — keeps flies off'},{id:'mineral',n:'MINERAL LICK',v:4,joy:6,d:'Salts + vitamins'},{id:'beet',n:'SUGAR BEET',v:20,joy:5},{id:'carrot',n:'CARROT',v:12,joy:8},{id:'oats',n:'OATS',v:20,joy:4}];
// --- RAGWORT in the horse fields: toxic to horses — pull it out! (A when facing it). Regrows over time. ---
const RAG_PENS=()=>{const L=[[72,26,13,5]];if(MAP_LAYOUT.horsePen){const [x,y,w,h]=MAP_LAYOUT.horsePen;L.push([x+1,y+1,w-2,h-2])}return L},RAG_MAX=4,RAG_MS=8*60e3;
function ragL(){if(!DB.rag)DB.rag={l:[],t:0};const R=DB.rag,n=Date.now();if(!R.t)R.t=n-RAG_MS*RAG_MAX;
  RAG_PENS().forEach((P,pi)=>{const mine=R.l.filter(r=>r[2]===pi);let k=Math.min(RAG_MAX-mine.length,Math.floor((n-R.t)/RAG_MS));
    for(let tries=0;k>0&&tries<30;tries++){const x=P[0]+Math.floor(Math.random()*P[2]),y=P[1]+Math.floor(Math.random()*P[3]);const c=MAP_LAYOUT.rows[y][x];if((c==='g'||c==='h')&&!R.l.some(r=>r[0]===x&&r[1]===y)){R.l.push([x,y,pi]);k--}}});
  if(n-R.t>=RAG_MS)R.t=n;return R.l}
let _ragC=0;
{const _ot=owThing;owThing=function(x,y){if(CUR==='ranch'&&ragL().some(r=>r[0]===x&&r[1]===y))return{ragwort:1,tx:x,ty:y};return _ot(x,y)}}
{const _oi=owInput;owInput=function(k){const o=ui.ow;if(k==='a'&&o&&!o.mv&&CUR==='ranch'){const [dx,dy]=DV[o.dir],x=o.x+dx,y=o.y+dy,L=ragL(),i=L.findIndex(r=>r[0]===x&&r[1]===y);
    if(i>=0){L.splice(i,1);const c=4+Math.floor(Math.random()*4);DB.wallet=(DB.wallet||0)+c;saveDB();sfx&&sfx('click');say('Pulled out RAGWORT! It\'s poisonous to horses — good job keeping them safe. +'+c+' coins',200);return}}return _oi(k)}}
if(typeof owHint==='function'){const _h=owHint;owHint=function(th){if(th&&th.ragwort)return 'A: pull the RAGWORT (bad for horses!)';return _h(th)}}
{const _ox=owExtras;owExtras=function(t,o){_ox(t,o);if(CUR!=='ranch')return;ragL().forEach(([x,y])=>{const X=x*TS+8,Y=y*TS+14,f=()=>{E(X,Y+1,6,2,'#0a281440');
    for(let i=-1;i<=1;i++){R(X+i*3,Y-10+Math.abs(i)*2,1.5,11-Math.abs(i)*2,'#3a7a22');E(X+i*4,Y-3,3,1.5,'#4a9a2a')}
    [[-4,-12],[0,-14],[4,-11],[-2,-9],[3,-15]].forEach(([a,b])=>{E(X+a,Y+b,2.4,2,'#e8b810');E(X+a-.5,Y+b-.6,1.2,1,'#fff27a');E(X+a,Y+b,.8,.8,'#c07a00')})};
    if(typeof P3D!=='undefined'&&P3D)p3later(X,Y+1,f);else f()})}}
// --- PET FOLLOW: press F (keyboard) or LB/RB (controller) on the map to have your dog walk behind you; press again for the next pet / off ---
function followPets(){return petList().filter(p=>(p.species||'dog')==='dog'||spOf(p)==='dog').concat(petList().filter(p=>!((p.species||'dog')==='dog'||spOf(p)==='dog')&&['cat'].includes(spOf(p))))}
function toggleFollow(){const L=followPets();if(!L.length){say('You need a pet first! Get a puppy at the PET SHOP in the WILD WOODS.',180);return}
  const i=L.findIndex(p=>p.id===DB.follow),n=i+1<L.length?L[i+1]:null;DB.follow=n?n.id:null;saveDB();sfx&&sfx('click');say(n?n.name+' is following you! (F / LB to swap or stop)':'Your pet went back home.',150)}
{const _in=input;input=function(k){if(k==='follow'){if(!ui.modal&&S.scene==='map'&&ui.ow)toggleFollow();return}return _in(k)}}
if(typeof KM!=='undefined')KM.f='follow';
{const _ou=owUpdate;owUpdate=function(){_ou();const o=ui.ow;if(!o)return;const T=ui.trail||(ui.trail=[]),l=T[T.length-1];if(!l||l[0]!==o.px||l[1]!==o.py||l[3]!==CUR){T.push([o.px,o.py,o.dir,CUR]);if(T.length>60)T.shift()}}}
{const _ox=owExtras;owExtras=function(t,o){_ox(t,o);const p=DB.follow&&DB.pets[DB.follow];if(!p||!ui.trail||ui.trail.length<2)return;const T=ui.trail,q=T[Math.max(0,T.length-14)];if(q[3]!==CUR)return;
  const W2=ui.fw||(ui.fw={bk:240,jp:0,bs:0,pc:2400,poos:[]}),mv=!!o.mv;
  /* v102: following = walking. occasional hop+bark, mood up, rare poo */
  if(--W2.bk<=0){W2.bk=420+Math.random()*600|0;W2.jp=18;W2.bs=50;if(!document.hidden){/* v113: one real bark — cute yip for puppy/youngster, proper bark when older */const pup=['egg','puppy','youngster'].includes(p.stage||'puppy');if(typeof animalSfx==='function')animalSfx(pup?'pup':'dog',{cd:2000,vol:pup?.8:.9})}}
  if(mv&&p.happy!=null&&t%60===0){p.happy=Math.min(100,p.happy+0.6);if(p.xp!=null)p.xp+=0.2}
  if(mv&&--W2.pc<=0){W2.pc=3600+Math.random()*3600|0;if(W2.poos.filter(z=>z[2]===CUR).length<2)W2.poos.push([q[0]+8,q[1]+14,CUR])}
  const pl=T[T.length-1];W2.poos=W2.poos.filter(z=>{if(z[2]!==CUR)return true;if(Math.abs(pl[0]+8-z[0])<10&&Math.abs(pl[1]+14-z[1])<10){p.happy=Math.min(100,(p.happy||0)+3);saveDB();sfx&&sfx('coin');say('Picked up '+p.name+"'s poo. Good owner! 💩",120);return false}g.save();g.font='9px sans-serif';g.textAlign='center';g.fillText('💩',z[0],z[1]);g.restore();return true});
  const jy=W2.jp>0?-Math.sin((18-W2.jp--)/18*Math.PI)*6:0;
  const X=q[0]+8,Y=q[1]+14,f=()=>{E(X,Y,6,2,'#0004');g.save();g.translate(X,Y-2+jy);g.scale(.42,.42);try{const sp=spOf(p);if(sp==='dog')dog(0,0,p.breed,p.stage||'adult',{pose:mv?'walk':'idle',mood:'happy',dir:q[2]==='left'?-1:1,coat:p.coat||0});else critter(0,0,sp,p.stage||'adult',{pose:mv?'walk':'idle',mood:'happy',dir:q[2]==='left'?-1:1,sv:p.breed})}catch(e){}g.restore()};
  if(typeof P3D!=='undefined'&&P3D)p3later(X,Y,f);else f();
  if(W2.bs>0){W2.bs--;g.save();g.font='bold 8px sans-serif';g.textAlign='center';g.fillStyle='#fff';g.strokeStyle='#2b2440';g.lineWidth=2;g.strokeText('WOOF!',X,Y-26);g.fillText('WOOF!',X,Y-26);g.restore()}}}
// v95: FOLLOW / UNFOLLOW in the dog's visit menu (uses DB.follow like F / LB)
function setFollow(on){if(!S||!S.id)return;DB.follow=on?S.id:null;saveDB();sfx&&sfx('click');if(on&&typeof achInc==='function')achInc('follow');syncActs();say(on?S.name+' will follow you on the map!':S.name+' will stay home.',150)}
{const _sa=syncActs;syncActs=function(){_sa();if(spOf(S)==='dog'){ACTIONS=ACTIONS.filter(a=>a!=='FOLLOW'&&a!=='UNFOLLOW');ACTIONS.push(DB.follow===S.id?'UNFOLLOW':'FOLLOW');if(ui&&ui.menu>=ACTIONS.length)ui.menu=0}}}
{const _oa=openAct;openAct=function(i){const a=ACTIONS[i];if(a==='FOLLOW'){setFollow(true);return}if(a==='UNFOLLOW'){setFollow(false);return}return _oa(i)}}
{const _tf=toggleFollow;toggleFollow=function(){_tf();try{syncActs()}catch(e){}}}
// v107: PET SHOP sells only dogs, cats, bunnies (+ the free WOOL-job sheep). Farm animals are sold by their farmers.
const FARM_SELL={cowfarm:['cow','ROSIE','MOO MEADOW'],chickfarm:['chicken','HATTIE','CLUCKY HOLLOW'],pigfarm:['pig','PERCY','MUDDY TROTTERS'],horsefarm:['horse','GRACE','GALLOP RIDGE']};
{const _K=SHOP_CATS.slice(),PET=['dogs','cat','rabbit'],FARM=['cow','chicken','pig','horse','sheep'];
 const dog=SHOP_CATS.find(c=>c.id==='dogs');if(dog){delete dog.ok;delete dog.need}
 const vis=()=>_K.filter(c=>{if(ui.farmShop)return c.id===ui.farmShop;if(ui.cowShop)return c.id==='cow';return PET.includes(c.id)||(c.id==='sheep'&&typeof wm==='function'&&wm().step===1)}).sort((a,b)=>(a.id==='sheep'?-1:0)-(b.id==='sheep'?-1:0));
 const scope=fn=>function(){const keep=SHOP_CATS.slice();SHOP_CATS.length=0;vis().forEach(c=>SHOP_CATS.push(c));try{return fn.apply(this,arguments)}finally{const cur=ui.cat!=null?SHOP_CATS[ui.cat]:null;SHOP_CATS.length=0;keep.forEach(c=>SHOP_CATS.push(c));if(cur)ui._catId=cur.id}};
 storeInput=scope(storeInput);drawPetCatalog=scope(drawPetCatalog);
 const _co=catOpen;catOpen=function(c){if(ui.farmShop&&c.id===ui.farmShop)return true;return _co(c)};
 const _os=openStore;openStore=function(){ui.farmShop=0;return _os()};
 const _fn=finishName;finishName=function(n){const r=_fn(n);ui.farmShop=0;return r};
 // farmer NPC tile in each specialty farm
 [['chickfarm',2,5],['pigfarm',2,5],['horsefarm',6,7]].forEach(([id,y,x])=>{const d=INT[id];if(!d)return;const R=d.rows.slice();R[y]=R[y].slice(0,x)+'N'+R[y].slice(x+1);INT[id]=Object.assign({},d,{rows:R})});
 for(const k of ['chickfarm','pigfarm','horsefarm'])delete FARM_SOON[k];
 Object.assign(BARN_MSG,{chickfarm:'CLUCKY HOLLOW — Farmer HATTIE sells CHICKENS. Walk in!',pigfarm:'MUDDY TROTTERS — Farmer PERCY sells PIGS. Walk in!',horsefarm:'GALLOP RIDGE — Farmer GRACE sells HORSES. Walk in!'});
 const _oi=owInput;owInput=function(k){const o=ui.ow,id=MAPS.int&&MAPS.int.id,F=FARM_SELL[id];
  if(CUR==='int'&&F&&id!=='cowfarm'&&k==='a'&&o&&!o.mv){const [dx,dy]=DV[o.dir],c=OWBASE[o.y+dy]&&OWBASE[o.y+dy][o.x+dx];
   if(c==='N'){sfx&&sfx('blip');if(typeof farmOpen==='function'&&!farmOpen(id)){say('Farmer '+F[1]+': "'+F[2]+' opens after '+FARM_CYC[id]+' WOOL CYCLES — you have '+(typeof woolCycles==='function'?woolCycles():0)+'. Shear sheep (1 cycle = 6h fleece regrow) and check the 🏆 board!"',300);return}
    say('Farmer '+F[1]+': "Welcome to '+F[2]+'! Have a look at my animals."',140);setTimeout(()=>{if(S.scene==='map'&&CUR==='int'){ui.farmShop=F[0];S={scene:'store'};ui.cowShop=0;ui.cat=0;ui.sel=0;ui.msgT=0}},900);return}}
  return _oi(k)};
 const _si=storeInput;storeInput=function(k){if(ui.farmShop&&(k==='b'||k==='start')){const F=Object.values(FARM_SELL).find(f=>f[0]===ui.farmShop);ui.farmShop=0;ui.cat=null;S={scene:'map'};say('Come back any time! — '+(F?F[1]:'the farmer'),160);return}return _si(k)};
 const _dc=drawPetCatalog;drawPetCatalog=function(t){if(!ui.farmShop)return _dc(t);const c=_K.find(c=>c.id===ui.farmShop),F=Object.values(FARM_SELL).find(f=>f[0]===ui.farmShop),n=c.n;c.n=F?F[2]:n;try{return _dc(t)}finally{c.n=n}};
 // cow shop index: Rosie opens with only the cow category visible
 openCowShop=function(){S={scene:'store'};ui.cowShop=1;ui.farmShop=0;ui.cat=0;ui.sel=0;ui.msgT=0};
 // farmer needs a little 'N' greeting
 Object.assign(INT_MSG,{});}
// v107: farmer portraits (Grandpa-style) when a specialty farmer is talking
const FARMER_PORT={ROSIE:['#60b254',0],HATTIE:['#e8a020',40],PERCY:['#e88aa0',300],GRACE:['#8c5a32',200]};
{const _say=say;say=function(m,d){const r=_say.apply(this,arguments);const k=Object.keys(FARMER_PORT).find(n=>String(m).includes(n));ui.msgWho=k&&/Farmer|ROSIE/.test(String(m))?{n:k,m:ui.msg}:null;return r}}
{const _dm=drawMsg;drawMsg=function(y){_dm(y);const w=ui.msgWho;if(!w||w.m!==ui.msg)return;const [col,hue]=FARMER_PORT[w.n],im=IMG.npc_rosie,bx=8,by=y<H/2?Math.min(H-80,y+60):H-118;
  RR(bx,by,52,52,6,'#fff','#2b2440');R(bx+3,by+3,46,40,'#bfe3ff');R(bx+3,by+30,46,13,'#8fd06a');
  if(im&&im.naturalWidth){g.save();g.imageSmoothingEnabled=false;if(hue)g.filter='hue-rotate('+hue+'deg)';g.drawImage(im,0,0,16,14,bx+5,by+3,42,37);g.restore()}else{E(bx+26,by+20,12,12,'#ffd6aa');R(bx+14,by+30,24,12,col)}
  RR(bx,by+42,52,12,4,col,'#2b2440');txt(w.n,bx+26,by+51,'#fff',7)}}
// v108: Grandpa rocking in his chair by the fire, reading a book (left fireside chair), second armchair stays for you
{const _dio=drawIntObj;drawIntObj=function(c,X,Y,x,y,t){if(!(c==='a'&&MAPS.int&&MAPS.int.id==='house'&&x===3&&y===3))return _dio(c,X,Y,x,y,t);
  const a=Math.sin(t/28)*0.09;E(X+8,Y+15,8,2,'#0004');g.save();g.translate(X+8,Y+14);g.rotate(a);g.translate(-8,-14);
  // rocking chair
  g.strokeStyle='#5a3418';g.lineWidth=1.5;g.beginPath();g.arc(8,6,10,0.35*Math.PI,0.65*Math.PI);g.stroke();
  RR(2,-2,12,10,3,'#8a5a2e');RR(3,-1,10,8,2,'#a86a3a');RR(1,7,14,4,2,'#b07a44');R(2,10,2,4,'#5a3418');R(12,10,2,4,'#5a3418');
  // grandpa
  RR(4,6,8,6,2,'#3a5a9a');R(5,11,2,3,'#3a5a9a');R(9,11,2,3,'#3a5a9a');R(4,13,3,1.5,'#3a2010');R(9,13,3,1.5,'#3a2010');
  RR(4,1,8,7,2,'#c84838');R(7.5,1,1,6,'#f0e0c0');
  E(8,-1,3.2,3.2,'#f0c8a0');RR(5.2,0,5.6,3,1.5,'#f4f4f4');E(6.8,-1.6,.5,.5,'#2b2020');E(9.2,-1.6,.5,.5,'#2b2020');
  R(4,-4,8,1.5,'#7a4a20');RR(5.5,-6.5,5,3,1,'#9a6430');
  // book
  const fl=((t/90)|0)%6===0;R(4,4,8,4,'#f8f0dc');R(7.6,4,.8,4,'#8a3a24');R(4,7.5,8,.8,'#2a6a3a');if(fl)R(8,3,3,4,'#fff');
  g.restore();
  if(((t>>6)%9)===0){g.save();g.font='7px sans-serif';g.fillStyle='#fff';g.fillText('z',X+13,Y-6-((t>>3)%4));g.restore()}}}
{const _oi=owInput;owInput=function(k){const o=ui.ow;if(k==='a'&&CUR==='int'&&MAPS.int&&MAPS.int.id==='house'&&o&&!o.mv){const [dx,dy]=DV[o.dir];if(o.x+dx===3&&o.y+dy===3){const L=['Grandpa: "Ah, come sit by the fire, '+(DB.playerName||'partner')+'. This book\'s about a brave farm dog!"','Grandpa: "Rock-a-bye... don\'t mind me, just resting my eyes."','Grandpa: "Pull up the other chair — nothing beats a warm fire after farm work."'];say(L[(Date.now()/1000|0)%L.length],220);return}}return _oi(k)}}

// v118: facing a specialty farmer shows who they are + what unlocks their shop (instead of "A: look")
function farmerHint(o){try{if(CUR!=='int')return null;const id=MAPS.int&&MAPS.int.id,F=FARM_SELL[id];if(!F)return null;const [dx,dy]=DV[o.dir],at=n=>OWBASE[o.y+dy*n]&&OWBASE[o.y+dy*n][o.x+dx*n];
  if(!(at(1)==='N'||(at(1)==='Q'&&at(2)==='N')))return null;
  if(typeof farmOpen==='function'&&FARM_CYC[id]&&!farmOpen(id))return '🔒 '+F[2]+': need '+FARM_CYC[id]+' WOOL CYCLES ('+woolCycles()+' now)';
  return 'A: talk to Farmer '+F[1]+' — buy '+F[0].toUpperCase()+'S'}catch(e){return null}}
