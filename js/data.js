// ===== data.js — species, breeds, foods, toys, tricks tables + logo =====
const LOGO={img:new Image(),ok:false};LOGO.img.onload=()=>LOGO.ok=true;LOGO.img.onerror=()=>{LOGO.ok=false;LOGO.err=true};LOGO.img.src='assets/pet-farm-logo.jpg?v=14';
// ===== Pet Farm v16 — modular build =====
const W=240,H=216,HOUR=3600e3,DAY=24*HOUR;
// per real HOUR. Coat fully long in ~12 days, plaque bad in ~6 days.
const RATE={hunger:6,happy:3,coat:100/(12*24),plaque:100/(8*24)};
const TUNE={petAmt:8,hatchTaps:6,trickNeed:5,xpPerDay:14,longAt:60,matAt:80,plaqueBad:65};
const STAGES=['egg','puppy','youngster','teen','adult','senior'];
const STAGE_N={egg:'EGG',puppy:'PUPPY',youngster:'YOUNGSTER',teen:'TEEN',adult:'ADULT',senior:'SENIOR'};
// real days in stage + care XP (max 14 XP/day) — Adult ≈ 6 weeks, Senior ≈ 4 months of caring
const GROW={puppy:{days:7,xp:60},youngster:{days:14,xp:120},teen:{days:21,xp:180},adult:{days:75,xp:600}};
const SPECIES=[{id:'dog',n:'DOG',ok:true},{id:'cat',n:'CAT',ok:true},{id:'chicken',n:'CHICKEN',ok:true},{id:'pig',n:'PIG',ok:true},
 {id:'horse',n:'HORSE',ok:true},{id:'rabbit',n:'RABBIT',ok:true},{id:'cow',n:'COW'},{id:'sheep',n:'SHEEP',ok:true},{id:'donkey',n:'DONKEY'},{id:'mule',n:'MULE'},{id:'bird',n:'BIRD'}];
const SP={dog:{baby:'PUPPY',house:'KENNEL',food:'DOG FOOD'},cat:{baby:'KITTEN',house:'CAT HUT',food:'CAT FOOD'},chicken:{baby:'CHICK',house:'COOP',food:'CHICKEN FEED'},pig:{baby:'PIGLET',house:'PIG STY',food:'PIG FOOD'},horse:{baby:'FOAL',house:'STABLE',food:'HORSE FEED'},rabbit:{baby:'KIT',house:'HUTCH',food:'RABBIT FOOD'},sheep:{baby:'LAMB',house:'SHEEP FIELD',food:'SHEEP FOOD'}};
const spOf=p=>(p&&p.species&&SP[p.species])?p.species:'dog';
function stageName(st,sp){return st==='puppy'?SP[sp||'dog'].baby:STAGE_N[st||'egg']}
const BREEDS={
 lab:{n:'LABRADOR',c:'#e9c47e',d:'#c99a50',l:'#f7e6c0',ear:'flop',tail:'otter',bl:22,bh:13,leg:14,hr:11,sn:8,fur:.6,desc:'Loyal, loves food & swimming'},
 frenchie:{n:'FRENCH BULLDOG',c:'#dcc6a4',d:'#3a2e2a',l:'#f1e6d2',ear:'bat',tail:'stub',bl:17,bh:13,leg:10,hr:12,sn:4,fur:.4,mask:true,desc:'Big bat ears, little snorts'},
 dachshund:{n:'DACHSHUND',c:'#a8552a',d:'#6e3216',l:'#c97a48',ear:'long',tail:'whip',bl:28,bh:10,leg:7,hr:10,sn:11,fur:.6,desc:'Long sausage body, brave!'},
 poodle:{n:'POODLE',c:'#f3e4d0',d:'#dcc4a8',l:'#fffaf2',ear:'pom',tail:'pom',bl:19,bh:12,leg:17,hr:10,sn:9,fur:1.5,curly:true,desc:'Curly coat — grows FAST'},
 staffy:{n:'WHITE STAFFY',c:'#fbf8f2',d:'#e6dccc',l:'#ffffff',ear:'flop',tail:'whip',bl:21,bh:13,leg:10,hr:13,sn:6,fur:.3,desc:'Big grin, strong & cuddly'},
 corgi:{n:'CORGI',c:'#e38b3a',d:'#b0602a',l:'#fff6ea',ear:'pointy',tail:'stub',bl:24,bh:12,leg:7,hr:11,sn:8,fur:.8,white:true,desc:'Short legs, huge smile'},
 husky:{n:'HUSKY',c:'#6d7484',d:'#3e4452',l:'#f4f6fa',ear:'pointy',tail:'curl',bl:23,bh:13,leg:15,hr:11,sn:9,fur:1.1,white:true,eye:'#4fb0ff',desc:'Ice-blue eyes, loves to run'},
 beagle:{n:'BEAGLE',c:'#c98a48',d:'#2e2622',l:'#fffaf2',ear:'flop',earC:'#9a6030',tail:'whip',bl:20,bh:12,leg:12,hr:11,sn:8,fur:.5,saddle:true,white:true,desc:'Super sniffer nose'},
 cat:{sp:'cat',n:'CAT',c:'#f0a050',d:'#c07030',l:'#fff4e6',bl:20,bh:11,leg:12,hr:11,sn:4,fur:0,desc:'Purrs, naps, loves a cushion'},
 chicken:{sp:'chicken',n:'CHICKEN',c:'#fff8ec',d:'#e8d8c0',l:'#ffffff',bl:14,bh:13,leg:10,hr:8,sn:3,fur:0,desc:'Clucks, pecks & scratches'},
 pig:{sp:'pig',n:'PIG',c:'#ffb0c0',d:'#e88aa0',l:'#ffd0dc',bl:24,bh:14,leg:8,hr:12,sn:5,fur:0,desc:'Oink! Loves a muddy roll'},
 horse:{sp:'horse',n:'HORSE',c:'#8c5a32',d:'#5a3a20',l:'#c89a70',bl:28,bh:16,leg:18,hr:12,sn:8,fur:0,desc:'Gallops, neighs & loves carrots'},
 rabbit:{sp:'rabbit',n:'RABBIT',c:'#dcdce6',d:'#b0b0c0',l:'#ffffff',bl:16,bh:12,leg:10,hr:10,sn:3,fur:0,desc:'Hops, flops ears & munches greens'},
 sheep:{sp:'sheep',n:'SHEEP',c:'#f4efe0',d:'#3a3440',l:'#ffffff',bl:22,bh:14,leg:9,hr:9,sn:4,fur:0,desc:'Baa! Grows wool fast — shear it for coins'},
 collie:{n:'BORDER COLLIE',c:'#2a2630',d:'#16131a',l:'#ffffff',ear:'semi',tail:'plume',bl:22,bh:12,leg:15,hr:10,sn:9,fur:1.2,white:true,desc:'Clever! Learns tricks fast'}};
const SHEEP_TYPES=[
 {id:'sheep',n:'WHITE SHEEP',p:60,desc:'Soft white wool'},
 {id:'sheep_black',n:'BLACK SHEEP',p:80,desc:'Dark wool, cheeky face',f:[.35,.32,.4]},
 {id:'sheep_brown',n:'BROWN SHEEP',p:90,desc:'Cosy chocolate wool',f:[.82,.6,.42]},
 {id:'sheep_spot',n:'SPOTTY SHEEP',p:110,desc:'Black spots all over!',spot:1},
 {id:'sheep_pink',n:'PINK FLUFFY',p:150,desc:'Extra fluffy & pink',f:[1,.78,.88]},
 {id:'sheep_gold',n:'GOLDEN SHEEP',p:200,desc:'Rare shiny gold wool',f:[1,.86,.45]}];
const SHEEP_MAX=4;
const BKEYS=Object.keys(BREEDS).filter(k=>!BREEDS[k].sp);
const FOODS=[
 {id:'kibble',n:'KIBBLE',v:22},{id:'wet',n:'WET FOOD',v:28,joy:3},{id:'chicken',n:'CHICKEN',v:24,joy:6},{id:'salmon',n:'SALMON',v:22,joy:5,d:'Shiny coat'},
 {id:'biscuit',n:'PEANUT TREAT',v:8,joy:12,plq:4,d:'Dog-safe peanut biscuit'},{id:'dental',n:'DENTAL CHEW',v:6,joy:6,plq:-30,d:'Cleans teeth!'},{id:'carrot',n:'CARROT STICK',v:10,joy:2,plq:-8,d:'Crunchy, helps teeth'}];
const SFOODS={cat:[{id:'catbisc',n:'CAT BISCUITS',v:20},{id:'wet',n:'WET FOOD',v:28,joy:3},{id:'salmon',n:'SALMON',v:22,joy:6},{id:'chicken',n:'CHICKEN',v:24,joy:5},{id:'dental',n:'DENTAL TREAT',v:6,joy:6,plq:-30,d:'Cleans teeth!'}],
 chicken:[{id:'corn',n:'CORN',v:20},{id:'grain',n:'MIXED GRAIN',v:24},{id:'worms',n:'MEALWORMS',v:12,joy:10,d:'Favourite snack!'},{id:'greens',n:'GREENS',v:14,joy:4}],
 pig:[{id:'slop',n:'PIG NUTS',v:26},{id:'apple',n:'APPLE',v:14,joy:8},{id:'carrot',n:'CARROT',v:12,joy:4},{id:'corn',n:'CORN',v:18,joy:3},{id:'veg',n:'VEG SCRAPS',v:22,joy:2}],
 horse:[{id:'hay',n:'HAY',v:24},{id:'oats',n:'OATS',v:22,joy:4},{id:'carrot',n:'CARROT',v:14,joy:8},{id:'apple',n:'APPLE',v:14,joy:6},{n:'SUGAR LUMP',id:'sugar',v:6,joy:12}],
 sheep:[{id:'greens',n:'FRESH GRASS',v:18,d:'Free!'},{id:'hay',n:'HAY',v:30,cost:3,stock:'hay',d:'Uses your HAY, or ● 3'},{id:'corn',n:'CORN',v:24,joy:4,cost:3,stock:'corn',d:'Uses your CORN, or ● 3'},{id:'apple',n:'APPLE',v:12,joy:8,cost:2,d:'● 2'},{id:'carrot',n:'CARROT',v:12,joy:6,cost:2,d:'● 2'}],
 rabbit:[{id:'pellets',n:'PELLETS',v:20},{id:'hay',n:'HAY',v:18,joy:3},{id:'carrot',n:'CARROT',v:14,joy:8},{id:'greens',n:'GREENS',v:12,joy:5},{id:'apple',n:'APPLE SLICE',v:10,joy:6}]};
function foods(){return S.species&&SFOODS[S.species]||FOODS}
const TOYS=[{id:'ball',n:'TENNIS BALL',p:0},{id:'squeak',n:'SQUEAKY BONE',p:15},{id:'rope',n:'TUG ROPE',p:20},{id:'frisbee',n:'FRISBEE',p:30},{id:'duck',n:'PLUSH DUCK',p:40}];
const GAMES=[{id:'fetch',n:'FETCH',d:'Tap A when the ball hits the zone'},{id:'simon',n:'MEMORY',d:'Repeat the pad pattern'},{id:'dash',n:'DASH',d:'▲▼ dodge rocks, grab hearts'}];
const TRICKS=[{id:'sit',n:'SIT'},{id:'twirl',n:'TWIRL'},{id:'dance',n:'DANCE'},{id:'lay',n:'LAY DOWN'},{id:'roll',n:'ROLL OVER'}];
const CARE=[{id:'cuddle',n:'CUDDLE',d:'Pats & belly rubs'},{id:'teeth',n:'BRUSH TEETH',d:'Scrub away plaque'},{id:'groom',n:"TARA SCISSOR HOUNDS",d:'Cecily trims the coat'}];
const ACTS={dog:['FEED','PLAY','TRICKS','CARE'],cat:['FEED','PLAY','CARE'],chicken:['FEED','PLAY','CUDDLE','SLEEP'],pig:['FEED','PLAY','CUDDLE','SLEEP'],horse:['FEED','PLAY','CUDDLE','SLEEP'],rabbit:['FEED','PLAY','CUDDLE','SLEEP'],sheep:['FEED','CUDDLE','BRUSH','SHEAR','SLEEP']};
// v28 sheep wool: % per real HOUR. Fed+happy: 0->100 in ~3 min. Hungry or sad: 1/3 speed (~9 min). Sheep get hungry faster than dogs.
const WOOL={fast:100*20,slow:100*20/3,hunger:7,happy:3.5,need:40,coins:0}; // v32: hunger/happy decay close to dogs (6/3 per hr)
let ACTIONS=ACTS.dog;const CARE_X=[{id:'toys',n:'TOYS',d:'Pick a toy to play with'},{id:'sleep',n:'SLEEP',d:'Tuck in for a nap'}];function careList(){return (S.species==='cat'?CARE.slice(0,2):CARE).concat(CARE_X)}
// ===== v43 animal TYPES (variants) for cats / chickens / cows =====
const ANIMAL_TYPES={
 cat:[{id:'cat_tabby',n:'TABBY CAT',p:60,desc:'Stripy! Keeps mice away'},{id:'cat_black',n:'BLACK CAT',p:70,desc:'Gold eyes, mouse catcher'},{id:'cat_ginger',n:'GINGER CAT',p:80,desc:'Cuddly — care bonus coins'}],
 chicken:[{id:'chicken_brown',n:'BROWN HEN',p:30,desc:'Lays brown EGGS to sell'},{id:'chicken_white',n:'WHITE HEN',p:35,desc:'Lays white EGGS to sell'},{id:'chicken_rooster',n:'ROOSTER',p:50,desc:'Guards the flock! Wakes you'}],
 cow:[{id:'cow_white',n:'WHITE COW',p:150,desc:'Gives MILK to sell'},{id:'cow_brown',n:'BROWN COW',p:180,desc:'MILK makes CHEESE!'},{id:'cow_black',n:'BLACK COW',p:200,desc:'Lots of MILK & CHEESE'},{id:'cow_jersey',n:'JERSEY COW',p:220,desc:'Golden & gentle — creamy MILK'},{id:'cow_bull',n:'BULL',p:300,desc:'Big strong horns — gentle giant!'}]};
const TYPE_MAX={cat:4,chicken:6,cow:6};
BREEDS.cow={sp:'cow',n:'COW',c:'#f4f0e8',d:'#3a3030',l:'#ffffff',bl:24,bh:14,leg:10,hr:10,sn:5,fur:0,desc:'Moo! Lives in the COW BARN'};
Object.keys(ANIMAL_TYPES).forEach(sp=>ANIMAL_TYPES[sp].forEach(t=>{BREEDS[t.id]=Object.assign({},BREEDS[sp],{n:t.n,desc:t.desc})}));
SP.cow={baby:'CALF',house:'COW BARN',food:'COW FEED'};ACTS.cow=['FEED','PLAY','CUDDLE','SLEEP'];
SFOODS.cow=[{id:'greens',n:'FRESH GRASS',v:18},{id:'hay',n:'HAY',v:30},{id:'corn',n:'CORN',v:22,joy:3},{id:'apple',n:'APPLE',v:12,joy:8}];
// v43 DAILY WOOL: after the tutorial's first shear, (v59) a full coat takes ~6 real hours (9h if hungry/sad)
function woolRate(fed){const tut=DB.missions&&DB.missions.wool&&(DB.missions.wool.step||0)<4;return tut?(fed?WOOL.fast:WOOL.slow):(fed?100/6:100/9)}
function woolETA(p,w){const fed=(p.hunger||0)>=WOOL.need&&(p.happy||0)>=WOOL.need,h=(100-w)/woolRate(fed);return h<1?'Ready in '+Math.max(1,Math.ceil(h*60))+' min':'Ready in '+Math.ceil(h)+'h'}
