// ===== farm.js — v44 dry fields until watered, HOSES by the fields, big BUCKET splash, POO -> FERTILISER =====
const CROPC='CWUc',HOSES=[[9,16,'CORN'],[25,16,'WHEAT'],[9,32,'PUMPKIN']],HOSE_LEN=16,POO_MAX=4,POO_MS=120e3;
// v65: poo only INSIDE fenced pens, per animal you own: [species, x,y,w,h] (interior tiles; paths/solids skipped)
const POO_PENS=[['sheep',47,47,10,6],['cow',61,27,8,4],['chicken',50,27,8,4],['pig',59,47,6,4],['horse',72,26,13,5]];
function pooOK(x,y){const c=(MAP_LAYOUT.rows[y]||'')[x];return (c==='g'||c==='c')&&!PROPS.some(p=>x>=p[0]&&x<p[0]+p[2]&&y>=p[1]&&y<p[1]+p[3])}
function pooPens(){return POO_PENS.filter(z=>typeof ownSp==='function'&&ownSp(z[0])>0)}
function inPen(x,y){return POO_PENS.some(z=>x>=z[1]&&y>=z[2]&&x<z[1]+z[3]&&y<z[2]+z[4])}
function isCropT(x,y){const c=OWBASE[y]&&OWBASE[y][x];if(CUR==='ranch'&&x>=88)return false;return CROPC.includes(c)||c==='Y'}
// tile art: dry soil until watered; real crop only when READY
function cropTile(c,x,y){const e=grows()[wetKey(x,y)];if(!e)return 'field';const p=growP(e);return p>=1?{U:'pumpkin',C:'corn',W:'wheat',c:'corn',Y:'flowerbed'}[c]:p<.35?'fieldwet':'sprout'}
function hoseAt(x,y){return HOSES.findIndex(h=>h[0]===x&&h[1]===y)}
function pooL(){if(!DB.poo)DB.poo={l:[],t:now()};const P=DB.poo;
  if(!P.v65){P.l=P.l.filter(p=>inPen(p[0],p[1])&&pooOK(p[0],p[1]));P.v65=1}const Z=pooPens();if(!Z.length){P.t=now();return P.l}
  while(P.l.length<POO_MAX&&now()-P.t>=POO_MS){P.t+=POO_MS;for(let tries=0;tries<12;tries++){const z=Z[Math.floor(Math.random()*Z.length)],x=z[1]+Math.floor(Math.random()*z[3]),y=z[2]+Math.floor(Math.random()*z[4]);if(pooOK(x,y)&&!P.l.some(p=>p[0]===x&&p[1]===y)){P.l.push([x,y]);break}}}
  if(P.l.length>=POO_MAX)P.t=now();return P.l}
function pooAt(x,y){return pooL().findIndex(p=>p[0]===x&&p[1]===y)}
function fertN(){return (DB.stock&&DB.stock.fert)||0}
// water every crop tile in a square of radius r around (cx,cy)
function waterArea(cx,cy,r,hose){let n=0,f=0;for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++){if(!isCropT(x,y))continue;const k=wetKey(x,y);if(!grows()[k]){grows()[k]={t:now(),c:OWBASE[y][x]};n++}}
  if(!n){say('All wet here! Move to dry soil.');return 0}if(!hose)DB.bucket--;saveDB();sfx('water');sparkle(12,W/2,110);
  say(hose?'Whoosh! Watered '+n+' plots with the HOSE!':'Splash! Watered '+n+' plots. Bucket: '+DB.bucket+' left',170);return n}
function harvestArea(cx,cy){let n=0;for(let y=cy-1;y<=cy+1;y++)for(let x=cx-1;x<=cx+1;x++){const e=grows()[wetKey(x,y)];if(e&&growP(e)>=1){const good=CROP_GOOD[e.c]||'corn';delete grows()[wetKey(x,y)];DB.stock=DB.stock||{};DB.stock[good]=(DB.stock[good]||0)+1;DB.harvested=(DB.harvested||0)+1;n++}}
  if(n){saveDB();sfx('coin');sparkle(14,W/2,110);say('Picked '+n+'! Sell them at YOUR FARM SHOP.',170)}return n}
function fertArea(cx,cy){let n=0;for(let y=cy-1;y<=cy+1;y++)for(let x=cx-1;x<=cx+1;x++){const e=grows()[wetKey(x,y)];if(e&&!e.f&&growP(e)<1){e.f=1;e.t-=GROW_MS*.6;n++}}
  if(!n)return 0;DB.stock.fert--;saveDB();sfx('water');sparkle(14,W/2,110);say('Fertiliser! '+n+' plots grow FASTER. Bags left: '+fertN(),170);return n}
{const _s=owSolid,_t=owThing,_i=owInput,_u=owUpdate,_x=owExtras,_h=owHint,_hud=owHud;
owSolid=function(x,y){if(CUR==='ranch'){if(hoseAt(x,y)>=0)return true;const c=OWBASE[y]&&OWBASE[y][x];if(c&&CROPC.includes(c)&&!sheepAt(x,y))return false}return _s(x,y)};
owThing=function(x,y){if(CUR==='ranch'){const h=hoseAt(x,y);if(h>=0)return{hose:h};if(pooAt(x,y)>=0)return{poo:1,px:x,py:y}}return _t(x,y)};
owHint=function(th){if(th&&th.hose!=null)return ui.hose===th.hose?'A: put the HOSE back':'A: grab the '+HOSES[th.hose][2]+' HOSE';if(th&&th.poo)return 'A: scoop the poo (fertiliser!)';if(th&&(th.crop||th.bed)){const e=grows()[wetKey(th.tx,th.ty)];if(!e||growP(e)<1){if(ui.hose!=null)return 'A: SPRAY with the hose';if(!e)return DB.bucket>0?'A: splash bucket (big area) ×'+DB.bucket:'Dry soil — grab a HOSE or WELL bucket';if(fertN()&&!e.f)return 'A: add POO FERTILISER';}}return _h(th)};
function cropHere(o){const [dx,dy]=DV[o.dir];return isCropT(o.x,o.y)||isCropT(o.x+dx,o.y+dy)}
owInput=function(k){const o=ui.ow;
  if(k==='b'&&ui.hose!=null){ui.hose=null;sfx('click');say('Hose put back.');return}/* v61: B cancels hose */
  if(k==='a'&&o&&!o.mv&&CUR==='ranch'){const [dx,dy]=DV[o.dir],tx=o.x+dx,ty=o.y+dy,th=owThing(tx,ty);
    if(th&&th.hose!=null){if(ui.hose===th.hose){ui.hose=null;say('Hose put back.')}else{ui.hose=th.hose;sfx('click');say('Got the HOSE! Press A on the field to spray. B to put it back.',200)}return}
    if(th&&th.poo){scoopPoo(tx,ty);return}
    if(cropHere(o)){const cx=isCropT(o.x,o.y)?o.x:tx,cy=isCropT(o.x,o.y)?o.y:ty;
      if(harvestArea(cx,cy))return;
      if(ui.hose!=null){if(waterArea(cx,cy,2,1))return}
      else if(DB.bucket>0){if(waterArea(cx,cy,1,0))return}
      if(fertN()>0&&fertArea(cx,cy))return;
      const e=grows()[wetKey(cx,cy)];if(e){say('Growing! '+Math.round(growP(e)*100)+'%'+(fertN()?'':' — poo fertiliser makes it faster'));return}
      say('Dry soil! Grab a HOSE or fill a bucket at the WELL.',180);return}}
  return _i(k)};
function scoopPoo(x,y){const i=pooAt(x,y);if(i<0)return false;pooL().splice(i,1);DB.stock=DB.stock||{};DB.stock.fert=fertN()+1;DB.scooped=(DB.scooped||0)+1;saveDB();sfx('click');say('Scooped! 1 bag of FERTILISER. Use it on crops or sell it.',200);return true}
owUpdate=function(){_u();const o=ui.ow;if(o&&!o.mv&&CUR==='ranch')scoopPoo(o.x,o.y);if(ui.hose!=null&&o){const h=HOSES[ui.hose];if(CUR!=='ranch'||Math.hypot(o.x-h[0],o.y-h[1])>HOSE_LEN){ui.hose=null;say('The hose is too short — it sprang back!')}}};
owExtras=function(t,o){_x(t,o);if(CUR!=='ranch')return;
  for(const k in grows()){const e=grows()[k];if(!e.f)continue;const [x,y]=k.split(',').map(Number);if(growP(e)<1){R(x*TS+2,y*TS+2,2,2,'#6a4020');R(x*TS+12,y*TS+3,2,2,'#6a4020')}}
  pooL().forEach(([x,y])=>{const X=x*TS+8,Y=y*TS+10;E(X,Y+3,6,2,'#0003');E(X,Y,5,3,'#6a4020');E(X,Y-3,3.5,2.5,'#7a4a24');E(X,Y-5,2,1.5,'#8a5a2c');if((t>>4)%3===0){R(X-4,Y-10,1,1,'#5a8a30');R(X+3,Y-12,1,1,'#5a8a30')}});
  HOSES.forEach(([x,y],i)=>{const hf=()=>{const X=x*TS,Y=y*TS,held=ui.hose===i,bob=Math.sin(t/14+i)*.6;g.save();g.translate(X+8,Y+15);g.scale(1.4,1.4);g.translate(-X-8,-Y-15);/* v59 chunky toy hose reel */
    E(X+8,Y+15,8,2.4,'#0a281440');RR(X+1,Y+11,14,4,2,'#2b2440');RR(X+1,Y+10,14,4,2,'#ffd84a');R(X+2,Y+10,12,1,'#fff3a0');
    R(X+2,Y+3,3,9,'#2b2440');R(X+11,Y+3,3,9,'#2b2440');R(X+2.5,Y+3,2,8.5,'#ff5a8b');R(X+11.5,Y+3,2,8.5,'#ff5a8b');R(X+2.5,Y+3,1,8,'#ffb3cb');
    E(X+8,Y+6.5,6.2,6.2,'#2b2440');E(X+8,Y+6.5,5.4,5.4,held?'#9ad8b0':'#3ccf6a');if(!held){E(X+8,Y+6.5,4,4,'#2fb050');E(X+8,Y+6.5,2.6,2.6,'#3ccf6a');E(X+6.6,Y+4.6,1.6,1.1,'#b8f5c8')}E(X+8,Y+6.5,1.4,1.4,'#ffd84a');
    if(!held){R(X+13,Y+8,3,2,'#2fb050');R(X+15,Y+7,2,4,'#4aa8e8');R(X+15,Y+7,1,1,'#c8f0ff');E(X+18,Y+8+bob,1,1.3,'#7ad0ff')}
    if(!held&&(t>>5)%2){g.globalAlpha=.9;RR(X+3,Y-7,10,7,3,'#fff','#2b2440');E(X+8,Y-3,2,2.2,'#4aa8e8');R(X+7.2,Y-6,1.6,2,'#4aa8e8');E(X+7.4,Y-3.6,.7,.7,'#c8f0ff');g.globalAlpha=1}
    g.restore();if(0){E(X+8,Y+14,7,2,'#0003');R(X+3,Y+2,2,12,'#6a4020');R(X+11,Y+2,2,12,'#6a4020');E(X+8,Y+8,6,6,'#2a9a40');E(X+8,Y+8,4,4,'#40c060');E(X+8,Y+8,1.5,1.5,'#1a5a28');
    if(ui.hose!==i){R(X+12,Y+9,3,2,'#2a9a40')}}};if(typeof P3D!=='undefined'&&P3D)p3later(x*TS+8,y*TS+15,hf);else hf()});
  if(ui.hose!=null){const [hx,hy]=HOSES[ui.hose];g.strokeStyle='#2a9a40';g.lineWidth=2;g.beginPath();g.moveTo(hx*TS+14,hy*TS+9);const mx=(hx*TS+o.px)/2+8,my=Math.max(hy*TS,o.py)+14;g.quadraticCurveTo(mx,my,o.px+12,o.py+6);g.stroke();
    const [dx,dy]=DV[o.dir];for(let i=0;i<6;i++){const s=((t*2+i*9)%24)/24;R(o.px+8+dx*(4+s*20)+(i%3-1)*s*6,o.py+6+dy*(4+s*20)+((i>>1)%3-1)*s*6,2,2,'#9ad8ff')}}};
owHud=function(t){_hud(t);let y=52;if(ui.hose!=null){RR(W-62,y,58,12,4,'#40c060','#2b2440');txt('HOSE ON',W-33,y+9,'#fff',7);RR(W-62,y+13,58,11,4,'#fff','#2b2440');txt('B: put back',W-33,y+21,'#2b2440',6.5);y+=12;y+=14}
  };}
GOODS.fert={n:'POO FERTILISER',p:5};GOOD_COL.fert='#7a4a24';
// v117: drop stale crop entries left on tiles that are no longer fields (map edits left yellow "ready crop" discs on grass by the FEED SHED)
function pruneGrows(){try{if(CUR!=='ranch')return;const G=grows();for(const k in G){const [x,y]=k.split(',').map(Number),c=(MAP_LAYOUT.rows[y]||'')[x];if(!(CROPC.includes(c)||c==='Y')){delete G[k];G.__pr=1}}if(G.__pr){delete G.__pr;saveDB()}}catch(e){}}
{const _ox=owExtras;owExtras=function(t,o){pruneGrows();return _ox(t,o)}}
