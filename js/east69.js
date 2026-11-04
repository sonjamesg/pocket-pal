// ===== east69.js — v69: hay fields art guard, pens w/ roaming animals, endless edge forest, closed WEST road,
// JUMP (Space / C / pad X or Y — never over farm fences), tree-examine joke chain, street lamps + night windows =====
// --- endless forest beyond the world edge (perimeter is invisible-solid 'x'; we paint trees past it) ---
function edgeForest(trees,x0,x1,y0,y1){const sx=Math.floor((x0-6)/2)*2-1,sy=Math.floor((y0-6)/2)*2-1;
  for(let gy=sy;gy<=y1+4;gy+=2)for(let gx=sx;gx<=x1+4;gx+=2){if(!(gx<0||gy<0||gx>=MW-1||gy>=MH-1))continue;
    if(CUR==='ranch'&&gx<0&&gy===33)continue;const gt=MAPS[CUR].gate;if(gt&&gt.some(([a,b])=>Math.abs(a-gx)<=1&&Math.abs(b-gy)<=1))continue;
    const h=((gx*73856093)^(gy*19349663))>>>0,j=((h>>4)%7-3)/10;trees.push([gx+j,gy+(((h>>8)%5)-2)/10,h%3?'pine2':'tree2'])}}
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
let LAMPS=null;function lampList(){if(LAMPS)return LAMPS;LAMPS=[];const Rw=MAP_LAYOUT.rows,isP=(x,y)=>'pG'.includes((Rw[y]||'')[x]);
  for(let y=1;y<MAP_LAYOUT.height-1;y++)for(let x=1;x<MAP_LAYOUT.width-1;x++){if(Rw[y][x]!=='g')continue;
    const hz=isP(x,y+1)&&isP(x+1,y+1)&&isP(x-1,y+1)&&!isP(x,y-1),vt=isP(x+1,y)&&isP(x+1,y-1)&&isP(x+1,y+1)&&!isP(x-1,y);
    if((hz&&x%8===0)||(vt&&y%7===0&&!hz))LAMPS.push([x,y])}return LAMPS}
const nightNow=()=>{const h=dayPhase();return h>=19.25||h<6.5};
function lamps(t){const night=nightNow(),[cx,cy]=CAMC;lampList().forEach(([x,y])=>{const X=x*TS+8,Y=y*TS+14;if(Math.abs(X-cx)>W||Math.abs(Y-cy)>H)return;
  const f=()=>{E(X,Y+1,4,1.5,'#0004');R(X-1,Y-22,3,23,'#3a3048');R(X-2,Y-1,5,2,'#2b2440');RR(X-4,Y-29,9,8,2,night?'#fff2a0':'#d8e8f0','#2b2440');R(X-3,Y-31,7,2,'#2b2440')};
  if(typeof P3D!=='undefined'&&P3D)p3later(X,Y+1,f);else f()})}
function nightGlow(t){if(!nightNow()||CUR!=='ranch')return;const cv=g.canvas,k=cv.width/W,kv=cv.height/H;g.save();g.setTransform(k,0,0,kv,0,0);g.globalCompositeOperation='lighter';
  const pt=(wx,wy,up)=>{if(typeof P3D!=='undefined'&&P3D&&P3C){const [sx,sy,s]=proj(wx,wy);return[sx,sy-up*s,s]}return[wx-CAMC[0]+W/2,wy-CAMC[1]+H/2-up,1]};
  const pool=(X,Y,r,a)=>{if(X<-r||Y<-r||X>W+r||Y>H+r)return;const gr=g.createRadialGradient(X,Y,1,X,Y,r);gr.addColorStop(0,'rgba(255,205,110,'+a+')');gr.addColorStop(1,'rgba(255,190,90,0)');g.fillStyle=gr;g.fillRect(X-r,Y-r,2*r,2*r)};
  lampList().forEach(([x,y])=>{const wx=x*TS+8,wy=y*TS+14,fl=.04*Math.sin(t/7+x),[a,b,s]=pt(wx,wy,25),[c,d,s2]=pt(wx,wy,0);pool(a,b,11*s,.9);pool(c,d,34*s2,.42+fl)});
  const win=(wx,wy,up)=>{const [X,Y,s]=pt(wx,wy,up);pool(X,Y,11*s,.8);g.fillStyle='rgba(255,225,130,.85)';g.fillRect(X-3*s,Y-2.5*s,6*s,5*s);const [c,d,s2]=pt(wx,wy+6,0);pool(c,d,18*s2,.25)};
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
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(OWBASE[y][x]!=='Y')continue;const h=((x*73856093)^(y*19349663))>>>0;
    [[4,7],[12,6],[8,13]].forEach(([fx,fy],i)=>{const X=x*TS+fx,Y=y*TS+fy-8,c=BLOOM_C[(h>>>(i*3))%5],s=1.5+((h>>>(i+2))%3)*.25,sw=Math.sin(t/40+x+i)*.6,
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
  const X=q[0]+8,Y=q[1]+14,mv=!!o.mv,f=()=>{E(X,Y,6,2,'#0004');g.save();g.translate(X,Y-2);g.scale(.42,.42);try{const sp=spOf(p);if(sp==='dog')dog(0,0,p.breed,p.stage||'adult',{pose:mv?'walk':'idle',mood:'happy',dir:q[2]==='left'?-1:1,coat:p.coat||0});else critter(0,0,sp,p.stage||'adult',{pose:mv?'walk':'idle',mood:'happy',dir:q[2]==='left'?-1:1,sv:p.breed})}catch(e){}g.restore()};
  if(typeof P3D!=='undefined'&&P3D)p3later(X,Y,f);else f()}}
