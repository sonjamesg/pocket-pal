// ===== interiors.js — walk-in insides for ranch buildings + the ranch house =====
// Each layout: '#' wall, '.' floor, D door/exit, r rug, M mud (walkable). Solid objects:
// t trough, | stall rail, h hay, n nest box, p perch, m milk cans, w water barrel, k feed sacks, x crate,
// T tool rack, W workbench, S saddle rack, b bed, K table, c chair, f fireplace, B bookshelf, P plant, O stove
const INT={
 coop:{name:'CHICKEN COOP',floor:'straw',rows:["############","############","#nnnn..nnnn#","#..........#","#.pp....pp.#","#..........#","#hh......tt#","#h.........#","#.....r....#","#####DD#####"]},
 cowbarn:{name:'COW BARN',floor:'straw',rows:["################","################","#t.t.t.t.t...hh#","#|.|.|.|.|...hh#","#|.|.|.|.|.....#","#............mm#","#..............#","#hh..........ww#","#h.............#","#......rr......#","#######DD#######"]},
 stable:{name:'HORSE STABLE',floor:'straw',rows:["################","################","#t..t..t..t..SS#","#|..|..|..|....#","#|..|..|..|....#","#|..|..|..|..hh#","#.............h#","#..............#","#ww..........kk#","#......rr......#","#######DD#######"]},
 sheepshed:{name:'SHEEP SHED',floor:'straw',rows:["############","############","#tt....hhhh#","#..........#","#||||..||||#","#..........#","#..........#","#kk......ww#","#....rr....#","#####DD#####"]},
 sty:{name:'PIG STY',floor:'mud',rows:["############","############","#tttt..hh..#","#.MMMM.....#","#.MMMMMM...#","#..MMMM....#","#..........#","#||||..||||#","#..........#","#####DD#####"]},
 feedshed:{name:'FEED SHED',floor:'wood',rows:["##########","##########","#kkkk.kkk#","#........#","#xx....xx#","#........#","#h......w#","#...rr...#","####DD####"]},
 toolshed:{name:'TOOL SHED',floor:'wood',rows:["##########","##########","#TTT..WWW#","#........#","#x......x#","#........#","#w.....xx#","#...rr...#","####DD####"]},
 house:{name:'RANCH HOUSE',floor:'house',rows:["##############","##############","#BB.ff..O..bb#","#..........bb#","#.P...KK.....#","#....cKKc....#","#.....rrrr..P#","#.....rrrr...#","#............#","######DD######"]}
};
const INT_MSG={t:'A feed trough — full of fresh feed.','|':'A sturdy wooden stall.',h:'Soft golden hay.',n:'Nesting boxes — eggs will go here!',p:'A perch for sleepy chickens.',m:'Shiny milk cans.',w:'A barrel of clean water.',
  k:'Sacks of animal feed.',x:'A wooden crate of supplies.',T:'Pitchfork, rake and shovel.',W:'Grandpa\'s old workbench.',S:'Saddles and bridles for the horses.',b:'Your cosy bed. Sweet dreams!',
  K:'The kitchen table. Grandpa\'s old cowboy hat sits on it.',c:'A rocking chair.',f:'A crackling fireplace — so warm!',B:'Shelves of farming books.',P:'A happy house plant.',O:'An old iron stove. Smells like pie!'};
let INT_FROM=null;
MAPS.int={name:'',w:12,h:10,gate:[[5,9]],rows:INT.coop.rows.map(r=>r.split(''))};
function intEnter(id,fx,fy){const d=INT[id],o=ui.ow;INT_FROM={id,x:fx,y:fy};MAPS.int={name:d.name,id,floor:d.floor,w:d.rows[0].length,h:d.rows.length,gate:[],rows:d.rows.map(r=>r.split(''))};
  setMap('int');const dx=d.rows[0].length/2-1;Object.assign(o,{map:'int',x:dx,y:MH-2,px:dx*TS,py:(MH-2)*TS,dir:'up',mv:null});say(d.name)}
function intExit(){const o=ui.ow,f=INT_FROM||{x:MAP_LAYOUT.start[0],y:MAP_LAYOUT.start[1]};setMap('ranch');Object.assign(o,{map:'ranch',x:f.x,y:f.y,px:f.x*TS,py:f.y*TS,dir:'down',mv:null})}
{const _s=owSolid,_t=owThing,_g=owGate,_i=owInput,_d=drawOverworld,_init=owInit;
owInit=function(back){if(ui.ow&&(ui.ow.map==='int'||ui.ow.map==='shop')&&!MAPS[ui.ow.map].rows.length)ui.ow.map='ranch';return _init(back)};
owSolid=function(x,y){if(CUR!=='int')return _s(x,y);if(x<0||y<0||x>=MW||y>=MH)return true;return !'.DrM'.includes(OWBASE[y][x])};
owThing=function(x,y){if(CUR!=='int')return _t(x,y);const c=OWBASE[y]&&OWBASE[y][x];if(!c)return null;if(c==='D')return{exit:1};if(c==='#')return{wallI:1};if(INT_MSG[c])return{obj:c};if(c==='M')return{mud:1};return null};
owGate=function(){if(CUR==='int'){if(OWBASE[ui.ow.y][ui.ow.x]==='D')intExit();return}_g()};
owInput=function(k){const o=ui.ow;
  if(CUR==='ranch'&&k==='a'&&!o.mv){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);
    if(th&&th.barn&&th.door&&INT[th.barn[4]]){intEnter(th.barn[4],o.x,o.y);return}
    if(th&&th.home){intEnter('house',o.x,o.y);return}}
  if(CUR!=='int')return _i(k);
  if(DV[k]||k==='select'||k==='start')return _i(k);
  if(k==='b'){intExit();return}
  if(k==='a'&&!o.mv){const [dx,dy]=DV[o.dir],th=owThing(o.x+dx,o.y+dy);if(!th)return;
    if(th.exit){intExit();return}if(th.obj){say(INT_MSG[th.obj]);return}if(th.mud){say('Squelchy mud — pigs love it!');return}
    if(th.wallI){const id=MAPS.int.id;say(id==='house'?'Grandpa\'s old family photos hang on the wall.':'Sturdy barn walls. Sunlight peeks through the windows.')}}};
drawOverworld=function(t){if(CUR==='int')return drawInt(t);return _d(t)};}
// ---- pixel helpers for interior objects ----
function drawIntObj(c,X,Y,x,y,t){const rows=OWBASE,L=x>0?rows[y][x-1]:'',Rr=rows[y][x+1],U=y>0?rows[y-1][x]:'',Dn=rows[y+1]?rows[y+1][x]:'';
  switch(c){
  case 't':E(X+8,Y+13,8,3,'#0003');R(X+1,Y+6,14,8,'#6a4020');R(X+2,Y+7,12,3,'#c89830');for(let i=3;i<13;i+=3)R(X+i,Y+7,1,2,'#f0cc58');R(X+1,Y+6,14,1,'#9a6634');R(X+2,Y+13,2,2,'#4a2810');R(X+12,Y+13,2,2,'#4a2810');break;
  case '|':{R(X+6,Y,4,16,'#8a5a2e');R(X+7,Y,1,16,'#b07a44');R(X+9,Y,1,16,'#5a3418');if(U!=='|'){R(X+5,Y,6,3,'#b07a44');R(X+5,Y+2,6,1,'#5a3418')}
    if(L&&'.r'.includes(L))R(X,Y+5,6,2,'#b07a44');if(Rr&&'.r'.includes(Rr))R(X+10,Y+5,6,2,'#b07a44');break}
  case 'h':E(X+8,Y+14,7,2,'#0003');RR(X+1,Y+3,14,11,3,'#c89830');RR(X+1,Y+3,14,8,3,'#f0cc58');R(X+5,Y+3,1,11,'#9a6a20');R(X+10,Y+3,1,11,'#9a6a20');R(X+3,Y+6,10,1,'#fff0a0');break;
  case 'n':R(X,Y+2,16,12,'#8a5a2e');R(X+1,Y+3,14,10,'#5a3418');E(X+8,Y+10,6,3,'#f0cc58');E(X+6,Y+9,2,2.5,'#fff8e8');E(X+10,Y+9.5,2,2.5,'#f8e8c8');R(X,Y+2,16,1,'#b07a44');R(X,Y+13,16,1,'#4a2810');break;
  case 'p':R(X,Y+6,16,2,'#8a5a2e');R(X,Y+6,16,1,'#b07a44');R(X+3,Y+8,2,7,'#5a3418');R(X+11,Y+8,2,7,'#5a3418');break;
  case 'm':for(const ox of [2,9]){E(X+ox+3,Y+14,3,1.5,'#0003');R(X+ox,Y+4,6,10,'#a8b4c4');R(X+ox,Y+4,2,10,'#dce4ee');R(X+ox+5,Y+4,1,10,'#6a7888');R(X+ox+1,Y+2,4,2,'#7c8898')}break;
  case 'w':E(X+8,Y+14,6,2,'#0003');R(X+2,Y+2,12,12,'#8a5a2e');R(X+2,Y+4,12,1,'#4a4a50');R(X+2,Y+11,12,1,'#4a4a50');E(X+8,Y+3,6,2,'#68b8f0');R(X+4,Y+2,3,1,'#c8f0ff');R(X+3,Y+5,2,6,'#b07a44');break;
  case 'k':E(X+8,Y+14,7,2,'#0003');RR(X+1,Y+5,7,10,3,'#e8dcc0');RR(X+7,Y+4,8,11,3,'#d8c8a0');R(X+2,Y+9,5,2,'#c04848');R(X+8,Y+9,6,2,'#3a6ad8');R(X+3,Y+5,3,1,'#fff');break;
  case 'x':E(X+8,Y+14,7,2,'#0003');R(X+1,Y+3,14,12,'#b07a44');R(X+1,Y+3,14,12,'#0000');g.strokeStyle='#5a3418';g.lineWidth=1;g.strokeRect(X+1.5,Y+3.5,13,11);g.beginPath();g.moveTo(X+2,Y+4);g.lineTo(X+14,Y+14);g.moveTo(X+14,Y+4);g.lineTo(X+2,Y+14);g.stroke();R(X+2,Y+4,12,1,'#d49e60');break;
  case 'T':R(X,Y+1,16,3,'#5a3418');R(X+3,Y+3,1,12,'#8a8a90');R(X+2,Y+13,3,2,'#6a6a70');R(X+8,Y+3,1,12,'#a07040');for(let i=0;i<4;i++)R(X+6+i,Y+12+(i%2),1,3,'#8a8a90');R(X+12,Y+3,1,10,'#a07040');R(X+11,Y+12,3,3,'#8a8a90');break;
  case 'W':R(X,Y+6,16,4,'#b07a44');R(X,Y+6,16,1,'#d49e60');R(X+1,Y+10,2,5,'#5a3418');R(X+13,Y+10,2,5,'#5a3418');if(x%2)R(X+4,Y+3,6,3,'#8a8a90');else{R(X+3,Y+4,8,2,'#c04848')}break;
  case 'S':R(X,Y+5,16,2,'#5a3418');E(X+8,Y+8,6,4,'#8a3a1c');E(X+8,Y+7,5,2.5,'#b05028');R(X+7,Y+10,2,5,'#4a2810');break;
  case 'b':if(U!=='b'){R(X,Y+1,16,15,'#7a4a22');R(X+1,Y+2,14,6,'#f8f8f0');}else{R(X,Y,16,14,'#7a4a22');R(X+1,Y,14,12,'#c84a4a');for(let i=2;i<12;i+=4)R(X+1,Y+i,14,1,'#e86a6a');R(X+1,Y+12,14,2,'#5a3418')}if(L==='b')R(X-1,Y,2,16,'#0000');break;
  case 'K':R(X,Y+2,16,10,'#b07a44');R(X,Y+2,16,2,'#d49e60');R(X,Y+11,16,1,'#5a3418');if(U!=='K'&&L==='K')E(X+3,Y+6,5,2,'#6a4020');if(U!=='K'&&L!=='K'){E(X+10,Y+7,3,2,'#fff');R(X+9,Y+5,2,2,'#c04848')}break;
  case 'c':E(X+8,Y+14,5,2,'#0003');R(X+3,Y+2,10,4,'#8a5a2e');R(X+3,Y+7,10,4,'#b07a44');R(X+3,Y+11,2,4,'#5a3418');R(X+11,Y+11,2,4,'#5a3418');break;
  case 'f':R(X,Y-8,16,24,'#8a8a94');for(let i=0;i<24;i+=4)R(X+(i%8?0:4),Y-8+i,16,1,'#6a6a74');R(X+3,Y+4,10,10,'#2a1a14');const fl=(t>>3)%2;E(X+8,Y+12,4,3+fl,'#f08020');E(X+8,Y+12,2,2,'#ffe060');R(X-1,Y+2,18,2,'#5a3418');break;
  case 'B':R(X,Y-10,16,26,'#6a4020');for(const yy of [-6,0,6])R(X+1,Y+yy,14,1,'#4a2810');[['#c04848',-9],['#3a6ad8',-3],['#48a048',3],['#e8c040',9]].forEach(([cc,yy],i)=>{for(let k=0;k<4;k++)R(X+2+k*3,Y+yy,2,5,k%2?cc:'#f0e0c0')});break;
  case 'P':E(X+8,Y+14,5,2,'#0003');R(X+5,Y+9,6,6,'#c86a3a');R(X+5,Y+9,6,1,'#e88a5a');E(X+8,Y+6,5,4,'#3a9a44');E(X+6,Y+5,2,2,'#6cc85a');E(X+11,Y+7,2,2,'#1f6a34');break;
  case 'O':R(X+1,Y-4,14,18,'#3a3a44');R(X+2,Y-3,12,4,'#5a5a64');R(X+4,Y+4,8,6,'#1a1a20');E(X+8,Y+8,2,1,'#f08020');R(X+6,Y-12,3,8,'#3a3a44');break;
  }}
function drawInt(t){owUpdate();const o=ui.ow,m=MAPS.int,cx=MW*TS<=W?(MW*TS-W)/2:Math.max(0,Math.min(MW*TS-W,o.px+8-W/2)),cy=Math.max(-22,Math.min(MH*TS-H+4,o.py+8-H/2));
  g.fillStyle='#140c10';g.fillRect(0,0,W,H);if(P3D){p3dBegin(Math.round(cx),Math.round(cy));g.fillStyle='#2a1a14';g.fillRect(P3C.ox-40,P3C.oy-40,W/P3.A+80,H/P3.A+80)}else{P3C=null;g.save();g.translate(-Math.round(cx),-Math.round(cy))}g.imageSmoothingEnabled=false;
  const fl=m.floor,house=m.id==='house';
  const floorT=(X,Y,x,y)=>{const h=((x*73856093)^(y*19349663))>>>0;
    if(fl==='straw'){R(X,Y,TS,TS,'#d8b058');for(let i=0;i<6;i++){const a=(h>>(i*3))&15,b=(h>>(i*2+5))&15;R(X+a,Y+b,3,1,i%2?'#f0cc70':'#b8903c')}}
    else if(fl==='mud'){R(X,Y,TS,TS,'#b08850');for(let i=0;i<4;i++)R(X+((h>>(i*4))&15),Y+((h>>(i*3+2))&15),2,1,'#d0a868')}
    else{R(X,Y,TS,TS,house?'#c8925a':'#a87848');for(let i=0;i<TS;i+=4)R(X,Y+i,TS,1,house?'#a87040':'#8a5a30');R(X+((y*5)%16),Y,1,4,'#8a5a30');R(X+((y*11+7)%16),Y+8,1,4,'#8a5a30')}};
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const c=OWBASE[y][x],X=x*TS,Y=y*TS;
    if(c==='#'&&P3D){R(X,Y,TS,TS,house?'#7a4a22':'#3a2010');if(y>=2&&y<MH-1)R(X+(x?0:10),Y,6,TS,house?'#a86a3a':'#5a3418');continue}
    if(c==='#'){if(y<2){if(house){R(X,Y,TS,TS,y?'#f4e4c4':'#e8d0a8');for(let i=2;i<TS;i+=6)R(X+i,Y,1,TS,y?'#e8d0a8':'#d8bc90');if(y===0)R(X,Y,TS,3,'#7a4a22');else{R(X,Y+11,TS,5,'#a86a3a');R(X,Y+11,TS,1,'#c88a50')}}
        else{R(X,Y,TS,TS,y?'#b07a44':'#9a6634');for(let i=0;i<TS;i+=5)R(X+i,Y,1,TS,y?'#8a5a2e':'#7a4a22');if(y===0){R(X,Y,TS,4,'#5a3418');R(X,Y+4,TS,1,'#3a2010')}else{R(X,Y+13,TS,3,'#7a4a22')}}}
      else if(y===MH-1){R(X,Y,TS,TS,'#3a2010');R(X,Y,TS,3,house?'#a86a3a':'#7a4a22')}else{R(X,Y,TS,TS,'#3a2010');R(X+(x?0:11),Y,5,TS,house?'#a86a3a':'#6a4020')}continue}
    floorT(X,Y,x,y);
    if(c==='M'){const n=(a,b)=>OWBASE[y+b]&&OWBASE[y+b][x+a]==='M';R(X+(n(-1,0)?0:3),Y+(n(0,-1)?0:3),TS-(n(-1,0)?0:3)-(n(1,0)?0:3),TS-(n(0,-1)?0:3)-(n(0,1)?0:3),'#7a5028');const hh=(x*7+y*13)%5;R(X+4+hh,Y+6,4,1,'#9a7040');R(X+9-hh,Y+11,3,1,'#5a3818');if(!n(0,-1))R(X+3,Y+3,10,1,'#9a7040')}
    if(c==='r'){const rc=house?['#b03838','#e8c040']:['#5a8a48','#3a6a30'];R(X,Y+1,TS,TS-2,rc[0]);R(X,Y+3,TS,1,rc[1]);R(X,Y+12,TS,1,rc[1]);if(OWBASE[y][x-1]!=='r')R(X,Y+1,2,TS-2,rc[1]);if(OWBASE[y][x+1]!=='r')R(X+14,Y+1,2,TS-2,rc[1])}
    if(c==='D'){R(X,Y,TS,TS,'#5a3418');R(X+1,Y,TS-2,TS,'#e8d8b0');R(X+2,Y+3,TS-4,8,'#b03838');R(X+2,Y+6,TS-4,1,'#e8c040')}}
  if(P3D){p3dWarp(house?'#3a2418':'#20140e');g.save();g.translate(-Math.round(cx),-Math.round(cy));intWalls(m,house,t)}
  // windows on the back wall, with light pools on the floor
  if(!P3D)for(let x=2;x<MW-2;x+=4){if(OWBASE[2][x]==='f'||OWBASE[2][x]==='B')continue;const X=x*TS+2,Y=5;R(X-1,Y-1,14,18,house?'#7a4a22':'#4a2810');R(X,Y,12,16,'#8ad0ff');R(X,Y+9,12,7,'#b8e8ff');R(X+5,Y,1,16,house?'#7a4a22':'#4a2810');R(X,Y+7,12,1,house?'#7a4a22':'#4a2810');R(X+1,Y+1,3,2,'#fff');
    if(house){R(X-3,Y-2,4,19,'#c84a4a');R(X+11,Y-2,4,19,'#c84a4a')}
    g.fillStyle='#fff6c81c';g.beginPath();g.moveTo(X,2*TS);g.lineTo(X+12,2*TS);g.lineTo(X+18,5*TS);g.lineTo(X+4,5*TS);g.fill()}
  if(!house&&!P3D)for(let x=0;x<MW;x+=5)R(x*TS,0,TS*5,2,'#3a2010');
  // objects, sorted top-to-bottom, player in between
  let drawn=false;const drawP=()=>withProj(o.px+8,o.py+16,()=>{const AVS=avImg('s'),FS=DB.avatar==='girl'&&IMG.farmergirl&&IMG.farmergirl.naturalWidth?'farmergirl':'farmer';E(o.px+8,o.py+12,5,2,'#0004');
    if(AVS||(IMG[FS]&&IMG[FS].naturalWidth)){const row={down:0,up:1,left:2,right:3}[o.dir],fr=o.mv&&o.step%2?1:0;const SI=AVS||IMG[FS],FH=(SI.height||SI.naturalHeight)/4;g.drawImage(SI,fr*16,row*FH,16,FH,Math.round(o.px),Math.round(o.py)-4-(FH-16),16,FH);if(P3D)hatTop(o.px+8,Math.round(o.py)-1-(FH-16))}else farmer(o.px,o.py-3,o.dir,o.step,!!o.mv);drawn=true});
  for(let y=0;y<MH;y++){if(!drawn&&y*TS>o.py)drawP();for(let x=0;x<MW;x++){const c=OWBASE[y][x];if(INT_MSG[c])withProj(x*TS+8,y*TS+16,()=>{toyBase(c,x*TS,y*TS);drawIntObj(c,x*TS,y*TS,x,y,t)})}}
  if(!drawn)drawP();
  // cosy owned animals of this building's species, wandering in place
  const sp={coop:'chicken',cowbarn:'cow',stable:'horse',sheepshed:'sheep',sty:'pig'}[m.id];
  if(sp&&typeof critter==='function'){const own=petList().filter(p=>spOf(p)===sp).slice(0,4);own.forEach((p,i)=>{const X=(3+i*3)*TS,Y=6*TS+Math.round(Math.sin(t/30+i)*2);withProj(X,Y,()=>{g.save();g.translate(X,Y);g.scale(.75,.75);try{critter(0,0,sp,p.stage||'adult',{pose:'walk',mood:'happy',sv:p.breed,dir:Math.sin(t/80+i)>0?1:-1})}catch(e){}g.restore()})})}
  g.restore();
  // warm lighting vignette
  const vg=g.createRadialGradient(W/2,H/2,40,W/2,H/2,170);vg.addColorStop(0,'#0000');vg.addColorStop(1,house?'#40200030':'#20100040');g.fillStyle=vg;g.fillRect(0,0,W,H);
  R(0,0,W,16,'#2b2440cc');txt(m.name,6,12,'#fff',9,'left');txt('● '+DB.wallet,W-6,12,'#ffd84a',8,'right');
  const [dx,dy]=DV[o.dir],th=!o.mv&&owThing(o.x+dx,o.y+dy),hint=th&&th.obj?'A: look':th&&th.exit?'Walk out the door':null;
  if(ui.msgT>0){}else if(hint){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(hint,W/2,H-19,'#2b2440',8)}else txt('✚ walk  A look  B leave',W/2,H-4,'#fff',7)}

// walk-in doors: bumping into a door (barn/house/pet store) enters it — no A needed
{const _try=owTry;owTry=function(d){const o=ui.ow;if(o.mv||ui.modal)return _try(d);const [dx,dy]=DV[d],nx=o.x+dx,ny=o.y+dy;
  if(d==='up'&&(CUR==='ranch'||CUR==='outer')){const th=owThing(nx,ny);
    if(th&&th.barn&&th.door&&INT[th.barn[4]]){o.dir=d;intEnter(th.barn[4],o.x,o.y);return}
    if(th&&th.home){o.dir=d;intEnter('house',o.x,o.y);return}
    if(th&&th.store&&typeof shopEnter==='function'){o.dir=d;shopEnter();return}}
  return _try(d)};if(window.__pp)window.__pp.owTry=owTry}

// ---- v54 angled interiors: tall back wall + side walls as upright billboards, chunky toy furniture bases ----
const WALL_H=58;
function toyBase(c,X,Y){if('|p'.includes(c))return;E(X+8,Y+15,8,2.5,'#0005')}
function intWalls(m,house,t){const L=TS,Rx=(MW-1)*TS,id=m.id;
  const wallC=house?['#f6e6c8','#ead2a8','#b8784a']:id==='coop'?['#ffd27a','#e8b050','#a8643a']:id==='sty'?['#f2b8a8','#d8988a','#8a5a40']:id==='toolshed'?['#b8c8e8','#98a8c8','#5a6a90']:['#c8844a','#a86a38','#6a4020'];
  // back wall billboard at the far floor edge (row 2)
  withProj((L+Rx)/2,2*TS,()=>{const top=2*TS-WALL_H,w=Rx-L;
    R(L,top,w,WALL_H,wallC[0]);
    if(house){for(let x=L+3;x<Rx;x+=8)R(x,top,3,WALL_H-14,wallC[1]);R(L,2*TS-16,w,16,wallC[2]);R(L,2*TS-17,w,2,'#e8b070');R(L,top,w,5,'#7a4a22')}
    else{for(let x=L;x<Rx;x+=6)R(x,top,1,WALL_H,wallC[1]);R(L,top,w,4,wallC[2]);R(L,top+18,w,3,wallC[2]);for(let x=L+20;x<Rx-8;x+=48)R(x,top,5,WALL_H,wallC[2])}
    R(L,2*TS-3,w,3,'#0004');
    // windows with sunbeams
    for(let x=L+24;x<Rx-24;x+=56){const wy=top+14;RR(x-1,wy-1,20,18,4,house?'#7a4a22':'#4a2810');R(x+1,wy+1,16,14,'#8ad0ff');R(x+1,wy+9,16,6,'#b8e8ff');R(x+9,wy+1,1,14,'#4a2810');R(x+1,wy+7,16,1,'#4a2810');R(x+3,wy+2,4,2,'#fff');
      if(house){R(x-5,wy-3,5,22,'#d84a4a');R(x+18,wy-3,5,22,'#d84a4a');R(x-6,wy-4,30,3,'#7a4a22')}}
    // per-building wall decor (chunky + readable)
    const deco=(x,y,fn)=>fn(x,top+y);
    if(house){deco(L+8,10,(x,y)=>{RR(x,y,14,12,2,'#7a4a22');R(x+2,y+2,10,8,'#8ac0e8');E(x+7,y+7,3,3,'#f0d040')}); // picture
      deco(Rx-26,8,(x,y)=>{E(x+9,y+9,8,8,'#fff8e8');E(x+9,y+9,7,7,'#fff');R(x+9,y+4,1,5,'#2b2440');R(x+9,y+9,4,1,'#2b2440')}); // clock
      deco(L+w2(L,Rx)-20,6,(x,y)=>{R(x,y+14,40,3,'#8a5a2e');[0,9,18,27].forEach((o,i)=>RR(x+2+o,y+4,7,10,2,['#e85a4a','#4aa8e8','#f0c040','#6ac050'][i]))})}
    else if(id==='coop'){for(let x=L+6;x<Rx-6;x+=22){RR(x,top+34,18,14,3,'#8a5a2e');E(x+9,top+44,6,3,'#f0cc58');E(x+7,top+42,2,2.5,'#fff8e8')}}
    else if(id==='toolshed'||id==='feedshed'){R(L+6,top+26,Rx-L-12,3,'#6a4020');for(let x=L+10;x<Rx-10;x+=12){if(id==='toolshed'){R(x,top+8,2,18,'#a07040');R(x-2,top+24,6,3,'#8a8a90')}else RR(x-2,top+12,10,14,3,'#e8dcc0')}}
    else{R(L+6,top+28,Rx-L-12,3,'#6a4020');for(let x=L+12;x<Rx-12;x+=30){E(x,top+24,5,5,'#ffe08a');R(x-1,top+18,2,6,'#3a2010')}}  // lanterns
    // ceiling beams
    R(L-4,top-6,w+8,7,'#5a3418');R(L-4,top-6,w+8,2,'#8a5a2e')});
  // v55 smooth perspective side walls
  p3SideWalls(TS,(MW-1)*TS,2*TS,(MH-1)*TS+8,WALL_H,wallC[1],wallC[2])}
function w2(a,b){return(b-a)/2}
