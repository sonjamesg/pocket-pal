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
  g.fillStyle='#140c10';g.fillRect(0,0,W,H);g.save();g.translate(-Math.round(cx),-Math.round(cy));g.imageSmoothingEnabled=false;
  const fl=m.floor,house=m.id==='house';
  const floorT=(X,Y,x,y)=>{const h=((x*73856093)^(y*19349663))>>>0;
    if(fl==='straw'){R(X,Y,TS,TS,'#d8b058');for(let i=0;i<6;i++){const a=(h>>(i*3))&15,b=(h>>(i*2+5))&15;R(X+a,Y+b,3,1,i%2?'#f0cc70':'#b8903c')}}
    else if(fl==='mud'){R(X,Y,TS,TS,'#b08850');for(let i=0;i<4;i++)R(X+((h>>(i*4))&15),Y+((h>>(i*3+2))&15),2,1,'#d0a868')}
    else{R(X,Y,TS,TS,house?'#c8925a':'#a87848');for(let i=0;i<TS;i+=4)R(X,Y+i,TS,1,house?'#a87040':'#8a5a30');R(X+((y*5)%16),Y,1,4,'#8a5a30');R(X+((y*11+7)%16),Y+8,1,4,'#8a5a30')}};
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const c=OWBASE[y][x],X=x*TS,Y=y*TS;
    if(c==='#'){if(y<2){if(house){R(X,Y,TS,TS,y?'#f4e4c4':'#e8d0a8');for(let i=2;i<TS;i+=6)R(X+i,Y,1,TS,y?'#e8d0a8':'#d8bc90');if(y===0)R(X,Y,TS,3,'#7a4a22');else{R(X,Y+11,TS,5,'#a86a3a');R(X,Y+11,TS,1,'#c88a50')}}
        else{R(X,Y,TS,TS,y?'#b07a44':'#9a6634');for(let i=0;i<TS;i+=5)R(X+i,Y,1,TS,y?'#8a5a2e':'#7a4a22');if(y===0){R(X,Y,TS,4,'#5a3418');R(X,Y+4,TS,1,'#3a2010')}else{R(X,Y+13,TS,3,'#7a4a22')}}}
      else if(y===MH-1){R(X,Y,TS,TS,'#3a2010');R(X,Y,TS,3,house?'#a86a3a':'#7a4a22')}else{R(X,Y,TS,TS,'#3a2010');R(X+(x?0:11),Y,5,TS,house?'#a86a3a':'#6a4020')}continue}
    floorT(X,Y,x,y);
    if(c==='M'){const n=(a,b)=>OWBASE[y+b]&&OWBASE[y+b][x+a]==='M';R(X+(n(-1,0)?0:3),Y+(n(0,-1)?0:3),TS-(n(-1,0)?0:3)-(n(1,0)?0:3),TS-(n(0,-1)?0:3)-(n(0,1)?0:3),'#7a5028');const hh=(x*7+y*13)%5;R(X+4+hh,Y+6,4,1,'#9a7040');R(X+9-hh,Y+11,3,1,'#5a3818');if(!n(0,-1))R(X+3,Y+3,10,1,'#9a7040')}
    if(c==='r'){const rc=house?['#b03838','#e8c040']:['#5a8a48','#3a6a30'];R(X,Y+1,TS,TS-2,rc[0]);R(X,Y+3,TS,1,rc[1]);R(X,Y+12,TS,1,rc[1]);if(OWBASE[y][x-1]!=='r')R(X,Y+1,2,TS-2,rc[1]);if(OWBASE[y][x+1]!=='r')R(X+14,Y+1,2,TS-2,rc[1])}
    if(c==='D'){R(X,Y,TS,TS,'#5a3418');R(X+1,Y,TS-2,TS,'#e8d8b0');R(X+2,Y+3,TS-4,8,'#b03838');R(X+2,Y+6,TS-4,1,'#e8c040')}}
  // windows on the back wall, with light pools on the floor
  for(let x=2;x<MW-2;x+=4){if(OWBASE[2][x]==='f'||OWBASE[2][x]==='B')continue;const X=x*TS+2,Y=5;R(X-1,Y-1,14,18,house?'#7a4a22':'#4a2810');R(X,Y,12,16,'#8ad0ff');R(X,Y+9,12,7,'#b8e8ff');R(X+5,Y,1,16,house?'#7a4a22':'#4a2810');R(X,Y+7,12,1,house?'#7a4a22':'#4a2810');R(X+1,Y+1,3,2,'#fff');
    if(house){R(X-3,Y-2,4,19,'#c84a4a');R(X+11,Y-2,4,19,'#c84a4a')}
    g.fillStyle='#fff6c81c';g.beginPath();g.moveTo(X,2*TS);g.lineTo(X+12,2*TS);g.lineTo(X+18,5*TS);g.lineTo(X+4,5*TS);g.fill()}
  if(!house)for(let x=0;x<MW;x+=5)R(x*TS,0,TS*5,2,'#3a2010');
  // objects, sorted top-to-bottom, player in between
  let drawn=false;const drawP=()=>{const AVS=avImg('s'),FS=DB.avatar==='girl'&&IMG.farmergirl&&IMG.farmergirl.naturalWidth?'farmergirl':'farmer';E(o.px+8,o.py+12,5,2,'#0004');
    if(AVS||(IMG[FS]&&IMG[FS].naturalWidth)){const row={down:0,up:1,left:2,right:3}[o.dir],fr=o.mv&&o.step%2?1:0;g.drawImage(AVS||IMG[FS],fr*16,row*16,16,16,Math.round(o.px),Math.round(o.py)-4,16,16)}else farmer(o.px,o.py-3,o.dir,o.step,!!o.mv);drawn=true};
  for(let y=0;y<MH;y++){if(!drawn&&y*TS>o.py)drawP();for(let x=0;x<MW;x++){const c=OWBASE[y][x];if(INT_MSG[c])drawIntObj(c,x*TS,y*TS,x,y,t)}}
  if(!drawn)drawP();
  // cosy owned animals of this building's species, wandering in place
  const sp={coop:'chicken',cowbarn:'cow',stable:'horse',sheepshed:'sheep',sty:'pig'}[m.id];
  if(sp&&typeof critter==='function'){const own=petList().filter(p=>spOf(p)===sp).slice(0,4);own.forEach((p,i)=>{const X=(3+i*3)*TS,Y=6*TS+Math.round(Math.sin(t/30+i)*2);g.save();g.translate(X,Y);g.scale(.75,.75);try{critter(0,0,sp,p.stage||'adult',{pose:'walk',mood:'happy',dir:Math.sin(t/80+i)>0?1:-1})}catch(e){}g.restore()})}
  g.restore();
  // warm lighting vignette
  const vg=g.createRadialGradient(W/2,H/2,40,W/2,H/2,170);vg.addColorStop(0,'#0000');vg.addColorStop(1,house?'#40200030':'#20100040');g.fillStyle=vg;g.fillRect(0,0,W,H);
  R(0,0,W,16,'#2b2440cc');txt(m.name,6,12,'#fff',9,'left');txt('● '+DB.wallet,W-6,12,'#ffd84a',8,'right');
  const [dx,dy]=DV[o.dir],th=!o.mv&&owThing(o.x+dx,o.y+dy),hint=th&&th.obj?'A: look':th&&th.exit?'Walk out the door':null;
  if(ui.msgT>0){}else if(hint){RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(hint,W/2,H-19,'#2b2440',8)}else txt('✚ walk  A look  B leave',W/2,H-4,'#fff',7)}
