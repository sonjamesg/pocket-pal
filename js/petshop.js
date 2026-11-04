// ===== petshop.js — v40 PET SHOP: animal CATEGORY menu -> browse that species (cute smooth puppies) =====
// v43 UNLOCK LADDER: sheep -> puppies -> cats / chickens -> cows -> (horses, bunnies, pigs soon)
const SHOP_CATS=[
 {id:'sheep',n:'SHEEP',col:'#2a9a50'},
 {id:'dogs',n:'PUPPIES',col:'#ff5a8b',need:'Shear 1 sheep',ok:()=>wm().step>=4||ownSp('dog')>0},
 {id:'chicken',n:'CHICKENS',col:'#d8a020',need:'Finish WOOL job',ok:()=>wm().step>=6},
 {id:'cat',n:'CATS',col:'#f0a050',need:'Get a puppy',ok:()=>ownSp('dog')>0},
 {id:'cow',n:'COWS',col:'#6a5040',need:'Get 2 chickens',ok:()=>ownSp('chicken')>=2},
 {id:'horse',n:'HORSES',col:'#8c5a32',soon:1,need:'Rides — after COWS'},
 {id:'rabbit',n:'BUNNIES',col:'#8a80c8',soon:1,need:'Show ribbons soon'},{id:'pig',n:'PIGS',col:'#e88aa0',soon:1,need:'Truffle hunt soon'}];
function ownSp(sp){return petList().filter(p=>spOf(p)===sp).length}
function catOpen(c){if(c.soon)return false;if(!c.ok)return true;if(!DB.unl)DB.unl={};if(DB.unl[c.id])return true;if(c.ok()){DB.unl[c.id]=1;saveDB();return true}return false}
function catItems(c){if(c.id==='dogs')return BKEYS.map(b=>({dog:b,n:BREEDS[b].n,p:priceOf(b),desc:BREEDS[b].desc}));
  if(c.id==='sheep'){const L=[];if(wm().step===1)L.push({sp:'sheep',free:1,n:'FREE SHEEP',p:0,desc:'For your WOOL job!'});SHEEP_TYPES.forEach(s=>L.push({sp:'sheep',sv:s.id,n:s.n,p:s.p,desc:s.desc}));return L}
  if(ANIMAL_TYPES[c.id])return ANIMAL_TYPES[c.id].map(t=>({sp:c.id,sv:t.id,n:t.n,p:t.p,desc:t.desc}));
  return [{sp:c.id,n:BREEDS[c.id].n,p:SPECIES_PRICE[c.id]||40,soon:1,desc:BREEDS[c.id].desc}]}
const TYPE_HOME={cat:'your HOUSE',chicken:'the COOP',cow:'the COW BARN'},TYPE_NAMES={cat:['WHISKERS','TIGER','MITTENS','SOOTY'],chicken:['NUGGET','PECKY','HENNY','GOLDIE'],cow:['DAISY','BUTTERCUP','MOO MOO','BELLA']};
const _finishNameT=finishName;finishName=function(n){if(!ui.nameType)return _finishNameT(n);const t=ui.nameType;ui.nameType=null;ui.modal=null;S={scene:'map'};
  n=(n||'').trim().slice(0,8).toUpperCase()||TYPE_NAMES[t.sp][0];if(DB.wallet<t.p){say('Need '+t.p+' coins!');return}
  const id='p'+now().toString(36)+Math.floor(Math.random()*1e4),p=fix({id,name:n,species:t.sp,breed:t.sv,scene:'main',stage:t.sp==='cat'?'puppy':'adult',hunger:60,happy:70,xp:0,coat:0,plaque:0,
    stageStart:now(),born:now(),created:now(),last:now(),sleep:false,lastPlayed:now()});
  DB.wallet-=t.p;DB.pets[id]=p;saveDB();sfx&&sfx('coin');sparkle(24,W/2,100);say(n+' the '+t.n+' is home in '+TYPE_HOME[t.sp]+'!',260)};
const _openStoreP=openStore;openStore=function(){_openStoreP();ui.cat=null;ui.csel=0;ui.sel=0};
function shopPup(x,y,b,s,t){g.save();g.translate(x,y);g.scale(s,s);dog(0,0,b,'puppy',{pose:t%200<130?'idle':'happy',mood:'happy',coat:0,dir:1});g.restore()}
function shopIcon(c,x,y,t){if(c.id==='dogs')return shopPup(x,y-2,'corgi',.6,t);g.save();g.translate(x,y);const s=c.id==='horse'?.75:c.id==='sheep'?.2:c.id==='cow'?.62:1.1;g.scale(s,s);critter(0,0,c.id,'adult',{pose:'idle',mood:'happy',dir:1,wool:100,sv:{cat:'cat_tabby',chicken:'chicken_rooster',cow:'cow_brown'}[c.id]});g.restore()}
storeInput=function(k){
  if(ui.cat==null){const n=SHOP_CATS.length;let i=ui.csel||0;
    if(k==='left'&&i%2)i--;if(k==='right'&&i%2===0&&i+1<n)i++;if(k==='up'&&i>=2)i-=2;if(k==='down'&&i+2<n)i+=2;ui.csel=i;
    if(k==='b'||k==='start'){S={scene:'map'};return}
    if(k==='a'){const c=SHOP_CATS[i];if(c.soon){say(c.n+': '+c.need+'!');return}if(!catOpen(c))say('🔒 To unlock '+c.n+': '+c.need.toUpperCase()+'!',220);ui.cat=i;ui.sel=0}return}
  const c=SHOP_CATS[ui.cat],L=catItems(c),n=L.length;
  if(k==='b'||k==='start'){ui.cat=null;return}
  if(k==='left')ui.sel=(ui.sel+n-1)%n;if(k==='right')ui.sel=(ui.sel+1)%n;
  if(k==='a'){const it=L[ui.sel%n];if(!catOpen(c)){say('🔒 Locked! To unlock: '+c.need.toUpperCase(),220);return}if(it.soon){say(it.n+'S coming soon!');return}
    if(it.sp==='sheep'){if(sheepList().length>=Math.min(SHEEP_MAX,FIELD_SPOTS.length)){say('Field full — 4 sheep max!');return}
      if(it.free){ui.nameSheep=1;pickName(SHEEP_NAMES);return}if(DB.wallet<it.p){say('Need '+it.p+' coins. Do jobs to earn more!');return}ui.sheepType=it.sv;ui.nameSheep=2;pickName(SHEEP_NAMES);return}
    if(TYPE_MAX[it.sp]){if(ownSp(it.sp)>=TYPE_MAX[it.sp]){say('Full! '+TYPE_MAX[it.sp]+' '+c.n+' max.');return}if(DB.wallet<it.p){say('Need '+it.p+' coins. Do jobs to earn more!');return}ui.nameType=it;pickName(TYPE_NAMES[it.sp]);return}
    buyDog(it.dog)}};
function shopHeader(title){const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#ffd6e6');gr.addColorStop(1,'#c8e8ff');g.fillStyle=gr;g.fillRect(0,0,W,H);
  for(let i=0;i<12;i++)E((i*53+ui.anim/3)%(W+20)-10,(i*37)%H,3,3,'#ffffff66');
  R(0,0,W,26,'#2b2440');txt(title,8,18,'#ffe36a',13,'left');RR(W-62,5,56,16,8,'#ffd84a','#fff');txt('● '+DB.wallet,W-34,17,'#2b2440',10)}
drawPetCatalog=function(t){
  if(ui.cat==null){R(0,0,W,H,'#fff');shopHeader('PET SHOP');txt('Pick an animal!  🔒 = how to unlock',W/2,38,'#2b2440',8);const job=wm().step===1;
    SHOP_CATS.forEach((c,i)=>{const col=i%2,row=i>>1,x=10+col*114,y=42+row*41,w=106,h=37,lk=!catOpen(c),on=i===(ui.csel||0),bob=on?Math.round(Math.sin(t/6)):0;
      RR(x,y+bob,w,h,10,lk?'#d8d4e4':c.col,on?'#ffe36a':'#2b2440');if(on)RR(x-2,y+bob-2,w+4,h+4,12,'#0000','#2b2440');
      RR(x+3,y+3+bob,32,30,8,'#fffd');g.save();if(lk)g.globalAlpha=.45;shopIcon(c,x+19,y+30+bob,t);g.restore();
      otxt(c.n,x+40+33,y+(lk?15:21)+bob,lk?'#5b4b8a':'#fff',c.n.length>7?9:11);
      if(lk){RR(x+38,y+19+bob,66,15,6,c.soon?'#8a80a8':'#2b2440');txt('🔒',x+45,y+30+bob,'#fff',7);txt(c.need.toUpperCase(),x+75,y+30+bob,c.soon?'#fff':'#ffe36a',c.need.length>13?5:6,'center',56)}
      if(c.id==='sheep'&&job&&(t>>4)%2){RR(x+w-34,y-6+bob,38,13,6,'#ffe36a','#2b2440');txt('FREE!',x+w-15,y+4+bob,'#2a9a50',8)}});
    txt('✚ pick   A open   B leave',W/2,H-3,'#2b2440',8);return}
  const c=SHOP_CATS[ui.cat],L=catItems(c),it=L[ui.sel%L.length],lk=!catOpen(c),can=!lk&&(it.free||DB.wallet>=it.p);
  R(0,0,W,H,'#fff');shopHeader(c.n);
  RR(14,32,W-28,124,14,'#fffffff0',c.col);RR(30,128,W-60,20,10,'#00000010');
  E(W/2,146,40,6,'#0002');
  if(it.dog)shopPup(W/2,150,it.dog,1.5,t);else{const sc=it.sp==='sheep'?.75:it.sp==='cow'?1.25:1.6;g.save();g.translate(W/2,148);g.scale(sc,sc);critter(0,0,it.sp,'adult',{pose:t%200<120?'idle':'happy',mood:'happy',dir:1,wool:100,sv:it.sv});g.restore()}
  otxt(it.n,W/2,54,'#fff',it.n.length>10?12:15);txt(it.desc||'',W/2,68,'#5b4b8a',8);if(it.sp==='sheep')txt('🐑 '+sheepList().length+' / '+SHEEP_MAX,W-40,46,'#2a9a50',8);if(TYPE_MAX[it.sp])txt(ownSp(it.sp)+' / '+TYPE_MAX[it.sp],W-36,46,c.col,8);
  if(L.length>1){[[2,'◀'],[W-28,'▶']].forEach(([x,a])=>{RR(x,76,26,40,8,c.col,'#fff');otxt(a,x+13,103,'#fff',16)})}
  if(it.free){RR(22,8+28,52,13,6,'#ffe36a','#2b2440');txt('★ JOB',48,46,'#2a9a50',8)}
  const lab=lk?'🔒 '+c.need.toUpperCase():it.soon?'COMING SOON':it.free?'★ TAKE FREE SHEEP':(c.id==='dogs'?'ADOPT PUP  ● ':c.id==='cat'?'ADOPT KITTEN  ● ':'BUY  ● ')+it.p;
  RR(30,162,W-60,28,14,lk?'#2b2440':it.soon?'#a99fc8':it.free?'#2a9a50':can?'#ff5a8b':'#c8c0d8','#fff');otxt(lab,W/2,181,lk?'#ffe36a':'#fff',it.free||lk?11:13);if(lk){RR(W/2-46,72,92,14,7,'#2b2440');txt('🔒 LOCKED',W/2,83,'#ffe36a',9)}
  L.forEach((_,i)=>E(W/2-(L.length-1)*5+i*10,197,3,3,i===ui.sel%L.length?c.col:'#c8c0d8'));
  txt((L.length>1?'◀ ▶ look   ':'')+'A '+(it.free?'take':'buy')+'   B back',W/2,H-3,'#2b2440',8)};
