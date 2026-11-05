// ===== overworld.js — collision + things on the overworld (ranch + outer world) =====
const SOLID='ftPTAxwsCWrUYy';
const homePets=()=>petList().filter(p=>['dog','cat','rabbit'].includes(p.species||'dog')); // v117: livestock (sheep/cow/chicken/pig/horse) live in their barns, no backyard plot
function owSolid(x,y){if(x<0||y<0||x>=MW||y>=MH)return true;const c=OWBASE[y][x];if(SOLID.includes(c))return true;
  if(CUR!=='ranch'){const [sx,sy]=STORE;if(x>=sx-1&&x<sx+4&&y>=sy-1&&y<sy+2)return true}else for(const [hx,hy] of HSLOT.concat(LOCKS,[HOME]))if(x>=hx&&x<hx+3&&y>=hy&&y<hy+2)return true;
  if(CUR==='ranch')for(const [bx,by,bw,bh] of PROPS)if(x>=bx&&x<bx+bw&&y>=by&&y<by+bh)return true;
  if(CUR==='ranch')for(const [bx,by,bw,bh] of BARNS)if(x>=bx&&x<bx+bw&&y>=by&&y<by+bh)return true;return false}
function owThing(x,y){const c=OWBASE[y]&&OWBASE[y][x];
  if(CUR==='ranch'){const L=homePets().slice(0,6);for(let i=0;i<6;i++){const [hx,hy]=HSLOT[i];if(y===hy+1&&x===hx+1)return L[i]?{pet:L[i]}:{empty:true};if(x>=hx&&x<hx+3&&y>=hy&&y<hy+2)return{wall:1}}
  {const [sx,sy]=HOME;if(x===sx+1&&y===sy+1)return{home:1};if(x>=sx-1&&x<sx+4&&y>=sy-1&&y<sy+2)return{wall:1}}
  for(const b of BARNS){const [bx,by,bw,bh]=b;if(x>=bx&&x<bx+bw&&y>=by&&y<by+bh)return{barn:b,door:(x===bx+(bw>>1)||(bw%2===0&&x===bx+(bw>>1)-1))&&y===by+bh-1}}
  for(const [bx,by,bw,bh,id] of PROPS)if(x>=bx&&x<bx+bw&&y>=by&&y<by+bh)return{prop:id};
  if(c==='h')return{weed:1};
  for(const [hx,hy,n] of LOCKS)if(x>=hx&&x<hx+3&&y>=hy&&y<hy+2)return{lock:n}}
  else{const [sx,sy]=STORE;if(x===sx+1&&y===sy+1)return{store:1};if(x>=sx&&x<sx+3&&y>=sy&&y<sy+2)return{wall:1}}
  if(c==='G')return{gate:1};if(c==='s')return{sign:1};if(c&&'cCWU'.includes(c))return{crop:c};if(c==='Y')return{bed:1};if(c==='y')return{hay:1};if(c==='w')return{water:1};if(c==='r')return{rock:1};if(c&&'TPAx'.includes(c))return{tree:c==='A'?'apple':1};return null}
// gate: stepping onto a G tile swaps ranch <-> outer world
function owGate(){const o=ui.ow;if(OWBASE[o.y][o.x]!=='G')return;const to=CUR==='ranch'?'outer':'ranch';const i=MAPS[CUR].gate.findIndex(([gx,gy])=>gx===o.x&&gy===o.y);
  setMap(to);const [gx,gy]=MAPS[to].gate[Math.max(0,i)],ny=to==='outer'?gy+1:gy-1;Object.assign(o,{map:to,x:gx,y:ny,px:gx*TS,py:ny*TS,dir:to==='outer'?'down':'up',mv:null});say(to==='outer'?MAPS.outer.name+' — B/walk N to go home':'Back at the RANCH')}

// ===== ranch buildings + kid chores (weeds, pond water) + Grandpa allowance =====
const BARN_MSG={coop:'Nesting boxes and perches are ready for chickens!',cowbarn:'Clean stalls and fresh hay — waiting for cows!',stable:'Horse stalls are swept. The paddock is ready!',
  cowfarm:'MOO MEADOW FARM — Farmer ROSIE sells cows and a BULL! Walk in to say hi.',sheepshed:'Cosy pens for sheep — shearing tools on the wall.',sty:'A muddy wallow and a full trough — pigs will love it!',feedshed:'Sacks of feed for every animal on the ranch.',toolshed:'Grandpa\'s old tools: pitchfork, bucket, brush.'};
function barnTalk(b){const id=b[4],n=b[5],sp={coop:'chicken',cowbarn:'cow',stable:'horse',sheepshed:'sheep',sty:'pig'}[id],own=sp?petList().filter(p=>spOf(p)===sp).length:0;
  say(n+': '+BARN_MSG[id]+(sp?(own?' '+own+' '+sp+(own>1?'s':'')+' live here.':' Get '+sp+'s at the PET SHOP soon!'):''),200)}
const today=()=>new Date().toDateString();
function grandpaAllowance(){if(DB.allowDay===today())return;const first=DB.allowDay==null;DB.allowDay=today();if(!first){DB.wallet=(DB.wallet||0)+30;say('Grandpa sent you 30 coins today!',200)}saveDB()}
// chores: 5-12 coins each, 3s cooldown, 12 per day (~100 coins in a few minutes, not hours). Pulled weeds regrow next visit.
function chore(x,y,kind){if(DB.choreDay!==today()){DB.choreDay=today();DB.chores=0}
  if(DB.chores>=12){say('All chores done today, partner! Come back tomorrow.');return}
  if(Date.now()-(ui.choreT||0)<3000){say('Catch your breath a sec...');return}ui.choreT=Date.now();
  const c=5+Math.floor(Math.random()*8);if(kind==='weed')OWBASE[y][x]='g';DB.chores++;DB.wallet=(DB.wallet||0)+c;saveDB();
  say((kind==='weed'?'Pulled the weeds!':'Watered with well water!')+' +'+c+' coins ('+DB.chores+'/12 today)')}
