// ===== jobs2.js — v45 care-only ANIMAL MONEY LOOPS (never meat!) + horses/bunnies/pigs unlocked =====
Object.assign(ANIMAL_TYPES,{
 horse:[{id:'horse',n:'BROWN HORSE',p:220,desc:'Pony RIDES for coins + poo!'},{id:'horse_donkey',n:'DONKEY',p:160,desc:'Hauls crops: delivery coins'}],
 rabbit:[{id:'rabbit',n:'FLUFFY BUNNY',p:45,desc:'Brush for SHOW RIBBONS'}],
 pig:[{id:'pig',n:'PINK PIG',p:90,desc:'Sniffs out TRUFFLES'}]});
Object.assign(TYPE_MAX,{horse:3,rabbit:4,pig:3});
Object.assign(TYPE_HOME,{horse:'the STABLE',rabbit:'your HOUSE',pig:'the PIG STY'});
Object.assign(TYPE_NAMES,{horse:['STAR','HONEY','DUSTY','NED'],rabbit:['HOPPY','THUMPER','BUN','SNOWY'],pig:['PEPPA','TRUFFLE','OINKY','PIGLET']});
{const S2=id=>SHOP_CATS.find(c=>c.id===id);
 Object.assign(S2('horse'),{soon:0,need:'Get a cow',ok:()=>ownSp('cow')>0});
 Object.assign(S2('rabbit'),{soon:0,need:'Get a cat',ok:()=>ownSp('cat')>0});
 Object.assign(S2('pig'),{soon:0,need:'Get a horse',ok:()=>ownSp('horse')>0});}
Object.assign(GOODS,{egg:{n:'EGGS',p:3},milk:{n:'MILK',p:6},cheese:{n:'CHEESE',p:12},truffle:{n:'TRUFFLE',p:20}});
Object.assign(GOOD_COL,{egg:'#fff4d8',milk:'#ffffff',cheese:'#ffd040',truffle:'#5a3a20'});
function donkeys(){return petList().filter(p=>spOf(p)==='horse'&&p.breed==='horse_donkey').length}
function chore(id){DB.daily=DB.daily||{};if(DB.daily[id]===today())return false;DB.daily[id]=today();return true}
function addStock(k,n){DB.stock=DB.stock||{};DB.stock[k]=(DB.stock[k]||0)+n}
function pay(n){DB.wallet=(DB.wallet||0)+n;sfx('coin')}
// [building, object char, species needed, run(count) -> message]
const STATIONS=[
 ['coop','n','chicken',n=>{addStock('egg',n*2);return 'Collected '+n*2+' EGGS! Sell them at YOUR FARM SHOP.'}],
 ['cowbarn','m','cow',n=>{addStock('milk',n*2);if(n>=1)addStock('cheese',n);return 'Milked! '+n*2+' MILK + '+n+' CHEESE for your shop.'}],
 ['stable','S','horse',n=>{const c=n*15+donkeys()*10;pay(c);return 'Pony rides'+(donkeys()?' & donkey deliveries':'')+'! +'+c+' coins'}],
 ['sty','M','pig',n=>{addStock('truffle',n);return 'Snuffle snuffle! Your pigs found '+n+' TRUFFLE'+(n>1?'S':'')+'!'}],
 ['feedshed','k','cat',n=>{const c=n*6;pay(c);return 'Your cats kept the mice off the feed! Tip +'+c}],
 ['sheepshed','|','dog',n=>{const c=n*8;pay(c);return 'Good dogs! They herded the sheep. +'+c+' coins'}],
 ['toolshed','W','rabbit',n=>{const c=n*10;pay(c);return 'Brushed bunnies won SHOW RIBBONS! +'+c+' coins'}]];
const JOB_HINT={chicken:'Buy CHICKENS at the PET SHOP',cow:'Buy a COW at the PET SHOP',horse:'Buy a HORSE at the PET SHOP',pig:'Buy a PIG at the PET SHOP',cat:'Get a CAT to chase mice',dog:'Get a PUPPY to herd',rabbit:'Get a BUNNY to brush'};
function stationAt(c){const id=MAPS.int&&MAPS.int.id;return STATIONS.find(s=>s[0]===id&&s[1]===c&&s[3])}
{const _i=owInput,_h=owHint;
owInput=function(k){const o=ui.ow;if(CUR==='int'&&k==='a'&&o&&!o.mv){const [dx,dy]=DV[o.dir],c=OWBASE[o.y+dy]&&OWBASE[o.y+dy][o.x+dx],st=c&&stationAt(c);
    if(st){const n=ownSp(st[2]);if(!n){say(JOB_HINT[st[2]]+'!',200);return}if(!chore(st[0]+st[1])){say('All done today! Come back TOMORROW.',180);return}
      const m=st[3](n);DB.jobsDone=(DB.jobsDone||0)+1;saveDB();sparkle(18,W/2,100);say(m,220);return}}return _i(k)};}
// bottom hint inside barns
{const _d=drawOverworld;drawOverworld=function(t){_d(t);if(CUR!=='int'||ui.msgT>0)return;const o=ui.ow,[dx,dy]=DV[o.dir],c=OWBASE[o.y+dy]&&OWBASE[o.y+dy][o.x+dx],st=c&&stationAt(c);if(!st)return;
  const L={coop:'collect EGGS',cowbarn:'MILK the cows',stable:'give PONY RIDES',sty:'TRUFFLE hunt',feedshed:'cats: MICE patrol',sheepshed:'dogs: HERD sheep',toolshed:'brush BUNNIES for ribbons'}[st[0]];
  const done=DB.daily&&DB.daily[st[0]+st[1]]===today();RR(10,H-30,W-20,16,8,'#fffe','#2b2440');txt(done?'Done today — come back tomorrow!':'A: '+L,W/2,H-19,'#2b2440',8)}}
