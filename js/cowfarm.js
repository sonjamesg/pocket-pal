// ===== cowfarm.js — v65 MOO MEADOW FARM: big cow farm east of the barns, paddock of roaming cows, Farmer ROSIE sells cows =====
INT.cowfarm={name:'MOO MEADOW FARM',floor:'straw',rows:["################","################","#hh....N.....mm#","#h.....QQ.....m#","#..............#","#|.|.|....|.|.|#","#t.t.t....t.t.t#","#..............#","#ww..........kk#","#......rr......#","#######DD#######"]};
INT_MSG.N='Farmer ROSIE — press A to talk!';
const ROSIE_HI=["Howdy, partner! I'm Farmer ROSIE of MOO MEADOW. Want to buy a cow? I've got a BULL too! Press A to look.","Back again? My cows are friendly and give lots of MILK. Press A to see who's for sale!"];
// draw Rosie (standing behind the counter) instead of a toy object
{const _dio=drawIntObj;drawIntObj=function(c,X,Y,x,y,t){if(c==='Q'){RR(X,Y+3,16,12,2,'#8a5a2e','#4a2c14');R(X,Y+3,16,3,'#c88a4a');R(X+1,Y+12,14,2,'#6a4020');if(OWBASE[y][x-1]!=='Q'){RR(X+4,Y-3,4,7,2,'#fff','#2b2440');R(X+4,Y-3,4,2,'#4aa8e8')}return}if(c!=='N')return _dio(c,X,Y,x,y,t);const im=IMG.npc_rosie;E(X+8,Y+13,6,2,'#0004');
  if(im&&im.naturalWidth){const fr=((t/40)|0)%4===0?16:0;g.drawImage(im,fr,0,16,24,X,Y-10,16,24)}else{R(X+4,Y,8,12,'#60b254');E(X+8,Y-3,4,4,'#ffd6aa')}
  if(!ui.rosieSeen&&(t>>5)%2){RR(X+3,Y-22,10,10,4,'#fff','#2b2440');txt('!',X+8,Y-14,'#ff5a8b',8)}}}
const _tbase=toyBase;toyBase=function(c,X,Y){if(c==='N')return;return _tbase(c,X,Y)};
function openCowShop(){const i=SHOP_CATS.findIndex(c=>c.id==='cow');S={scene:'store'};ui.cowShop=1;ui.cat=i;ui.sel=0;ui.msgT=0}
{const _oi=owInput;owInput=function(k){const o=ui.ow;
  if(CUR==='int'&&MAPS.int&&MAPS.int.id==='cowfarm'&&k==='a'&&o&&!o.mv){const [dx,dy]=DV[o.dir],at=(n)=>OWBASE[o.y+dy*n]&&OWBASE[o.y+dy*n][o.x+dx*n],c=at(1);
    if(c==='N'||(c==='Q'&&at(2)==='N')){ui.rosieAsk=1;say(ROSIE_HI[ui.rosieSeen?1:0],240);ui.rosieSeen=1;sfx('blip');return}}
  return _oi(k)}}
{const _co=catOpen;catOpen=function(c){if(ui.cowShop&&c.id==='cow')return true;return _co(c)}}
{const _si=storeInput;storeInput=function(k){if(ui.cowShop&&(k==='b'||k==='start')){ui.cowShop=0;ui.cat=null;S={scene:'map'};say('Come back any time! — ROSIE',160);return}
  let swap=null;if(k==='a'&&ui.cat!=null){const c=SHOP_CATS[ui.cat],L=catItems(c),it=L[ui.sel%L.length];if(it&&it.sv==='cow_bull'){swap=TYPE_NAMES.cow;TYPE_NAMES.cow=['BRUNO','TANK','BIG TED','DUKE']}}
  try{return _si(k)}finally{if(swap)TYPE_NAMES.cow=swap}}}
{const _os=openStore;openStore=function(){ui.cowShop=0;return _os()}}
{const _dc=drawPetCatalog;drawPetCatalog=function(t){const c=SHOP_CATS.find(c=>c.id==='cow');if(!c)return _dc(t);const n=c.n;if(ui.cowShop)c.n='MOO MEADOW';try{_dc(t)}finally{c.n=n}}}
{const _fn=finishName;finishName=function(n){const r=_fn(n);ui.cowShop=0;return r}}
// roaming cows in the big paddock (decor: the farm's herd, incl. the BULL)
const HERD=[['cow_white',0],['cow_brown',1.7],['cow_bull',3.1],['cow_black',4.4],['cow_jersey',5.6],['cow_white',2.4]];
{const _ox=owExtras;owExtras=function(t,o){_ox(t,o);if(CUR!=='ranch'||!MAP_LAYOUT.cowPaddock)return;const [px,py,pw,ph]=MAP_LAYOUT.cowPaddock;
  HERD.forEach(([sv,ph0],i)=>{const k=t/900+ph0,X=(px+1+(pw-3)*(0.5+0.45*Math.sin(k*1.3+i)))*TS,Y=(py+2+(ph-4)*(0.5+0.45*Math.sin(k*0.9+i*2.1)))*TS,dir=Math.cos(k*1.3+i)>0?1:-1,
    eat=Math.sin(t/120+i*3)>.4,f=()=>{g.save();g.translate(X,Y);g.scale(.62,.62);try{critter(0,0,'cow','adult',{pose:eat?'eat':'walk',mood:'happy',sv,dir})}catch(e){}g.restore()};
    if(typeof P3D!=='undefined'&&P3D)p3later(X,Y,f);else f()})}}
// after Rosie's speech bubble closes (A or timeout) -> open her cow shop
setInterval(()=>{if(ui.rosieAsk&&!(ui.msgT>0)){ui.rosieAsk=0;if(S.scene==='map'&&CUR==='int'&&MAPS.int&&MAPS.int.id==='cowfarm'){sfx&&sfx('click');openCowShop()}}},150);
INT_MSG.Q='ROSIE\'s farm counter — fresh MILK bottles on top.';
// v102: YOUR cows roam the ranch cow pen by the COW BARN (fenced x60-69, y26-31)
{const _ox=owExtras;owExtras=function(t,o){_ox(t,o);if(CUR!=='ranch')return;const C=(typeof petList==='function'?petList():[]).filter(p=>spOf(p)==='cow').slice(0,6);if(!C.length)return;
  const px=61,py=27,pw=8,ph=4;C.forEach((p,i)=>{const k=t/700+i*1.9,X=(px+.6+(pw-1.2)*(0.5+0.45*Math.sin(k*1.1+i)))*TS,Y=(py+.9+(ph-1.4)*(0.5+0.42*Math.sin(k*.8+i*2.3)))*TS,dir=Math.cos(k*1.1+i)>0?1:-1,eat=Math.sin(t/110+i*2)>.3,
    f=()=>{E(X,Y+2,9,3,'#0004');g.save();g.translate(X,Y);g.scale(.55,.55);try{critter(0,0,'cow',p.stage||'adult',{pose:eat?'eat':'walk',mood:'happy',sv:p.breed,dir})}catch(e){}g.restore();g.save();g.font='bold 7px sans-serif';g.textAlign='center';g.fillStyle='#fff';g.strokeStyle='#2b2440';g.lineWidth=2;g.strokeText(p.name||'COW',X,Y-20);g.fillText(p.name||'COW',X,Y-20);g.restore()};
    if(typeof P3D!=='undefined'&&P3D)p3later(X,Y,f);else f()})}}
