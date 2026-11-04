// ===== input.js — button input routing + care actions, idle life, walk/teeth/groom logic =====
// ===== input =====
function input0(k){
  const sc=S.scene;
  if(sc==='title'){const it=titleItems(),n=it.length;if(k==='up')ui.tsel=(ui.tsel+n-1)%n;if(k==='down')ui.tsel=(ui.tsel+1)%n;
    if(k==='a'||k==='start'){const c=it[ui.tsel];if(c==='NEW GAME')newGame();else if(c==='FARM MAP')openMap();else if(c==='CONTINUE')continueGame();else if(c==='MY PETS'){S={scene:'list'};ui.psel=0;ui.msgT=0}else newPet()}}
  else if(sc==='list'){const L=petList(),n=L.length+1;if(k==='up')ui.psel=(ui.psel+n-1)%n;if(k==='down')ui.psel=(ui.psel+1)%n;if(k==='b'){S={scene:'title'};ui.tsel=0;ui.msgT=0}
    if(k==='a'||k==='start'){if(ui.psel===L.length)newPet();else loadPet(L[ui.psel].id)}
    if(k==='select'&&L[ui.psel]){const id=L[ui.psel].id;askConfirm('Say goodbye to '+L[ui.psel].name+' forever? Other pets stay safe.',()=>{delete DB.pets[id];if(DB.lastId===id)DB.lastId=null;save(true);ui.psel=0})}}
  else if(sc==='pause'){const n=PAUSE.length;if(k==='up')ui.sel=(ui.sel+n-1)%n;if(k==='down')ui.sel=(ui.sel+1)%n;if(k==='b'||k==='start'){S.scene='main';return}
    if(k==='a'){const c=PAUSE[ui.sel];S.scene='main';if(c==='FARM MAP'){openMap();return}if(c==='SAVE'){save();say('Saved on this device!')}if(c==='MY PETS'){save(true);S={scene:'list'};ui.psel=0;ui.msgT=0}if(c==='NEW PET'){save(true);newPet()}if(c==='HOME'){save(true);S={scene:'title'};ui.tsel=0;ui.msgT=0}}}
  else if(sc==='species'){const n=SPECIES.length;if(k==='left')ui.sel=(ui.sel+n-1)%n;if(k==='right')ui.sel=(ui.sel+1)%n;
    if(k==='a'||k==='start'){const sp=SPECIES[ui.sel];if(sp.ok){if(sp.id==='dog'){S.scene='breed';ui.sel=0}else{S.species=sp.id;S.breed=sp.id;S.id='p'+now().toString(36)+Math.floor(Math.random()*1e4);S.created=now();S.scene='egg';fix(S);ui.hatch=0;save()}}else say(SPECIES[ui.sel].n+'S are coming soon!')}if(k==='b'){S={scene:'title'};ui.tsel=0}}
  else if(sc==='map')owInput(k);
  else if(sc==='intro'){introInput(k)}
  else if(sc==='avatar')avatarKey(k)
  else if(sc==='store'){const n=BKEYS.length;if(k==='left')ui.sel=(ui.sel+n-1)%n;if(k==='right')ui.sel=(ui.sel+1)%n;if(k==='b'||k==='start'){openMap();return}if(k==='a')buyDog(BKEYS[ui.sel])}
  else if(sc==='breed'){const n=BKEYS.length;if(k==='left')ui.sel=(ui.sel+n-1)%n;if(k==='right')ui.sel=(ui.sel+1)%n;if(k==='b'){S.scene='species';ui.sel=0}
    if(k==='a'||k==='start'){S.species='dog';S.breed=BKEYS[ui.sel];syncActs();S.id='p'+now().toString(36)+Math.floor(Math.random()*1e4);S.created=now();S.scene='egg';fix(S);ui.hatch=0;save()}}
  else if(sc==='egg'){if(k==='a'){ui.hatch++;ui.shake=12;for(let i=0;i<4;i++)ui.fx.push({x:W/2+Math.random()*30-15,y:100,vx:Math.random()*2-1,vy:-Math.random()*2,t:25,ch:'shell'});
    save(true);if(ui.hatch>=TUNE.hatchTaps){Object.assign(S,{scene:'main',stage:'puppy',hunger:75,happy:80,xp:0,coat:5,plaque:0,stageStart:now(),born:now(),last:now(),sleep:false});ui.dx=110;syncActs();ui.menu=0;sparkle(30);say(S.species==='dog'?"It's a "+BREEDS[S.breed].n.toLowerCase()+' puppy!':"It's a "+SP[S.species].baby.toLowerCase()+'!',200);save()}}}
  else if(sc==='main'){
    if(S.sleep){if(k==='start'){S.scene='pause';ui.sel=0;return}if(k==='a'||k==='b'){S.sleep=false;say('Good morning!');save()}return}
    const n=ACTIONS.length;if(k==='left')ui.menu=(ui.menu+n-1)%n;if(k==='right')ui.menu=(ui.menu+1)%n;
    if(k==='a')openAct(ui.menu);if(k==='b'){if(ui.menu===0){openMap();return}ui.menu=0;openAct(0)}
    if(k==='select')askConfirm('Start '+S.name+' again as a new egg? Other pets stay saved.',()=>{Object.assign(S,{stage:undefined,xp:0,tricks:{},best:{},sleep:false});fix(S);S.scene='egg';ui.hatch=0;save()});
    if(k==='start'){S.scene='pause';ui.sel=0}}
  else if(sc==='food')gridIn(k,foods().length,()=>feed(foods()[ui.sel]));
  else if(sc==='toys')gridIn(k,TOYS.length,()=>toy(TOYS[ui.sel]));
  else if(sc==='games'){if(k==='up')ui.sel=(ui.sel+2)%3;if(k==='down')ui.sel=(ui.sel+1)%3;if(k==='b')S.scene='main';
    if(k==='a'){if(S.hunger<12){say('Too hungry to play!');S.scene='main';return}startGame(GAMES[ui.sel].id)}}
  else if(sc==='care'){const n=careList().length;if(k==='up')ui.sel=(ui.sel+n-1)%n;if(k==='down')ui.sel=(ui.sel+1)%n;if(k==='b')S.scene='main';if(k==='a')careAct(careList()[ui.sel].id)}
  else if(sc==='game')gameInput(k);
  else if(sc==='walk')walkInput(k);
  else if(sc==='groom')groomInput(k);
  else if(sc==='teeth')teethInput(k);
  else if(sc==='tricks'){const n=TRICKS.length;if(k==='up')ui.sel=(ui.sel+n-1)%n;if(k==='down')ui.sel=(ui.sel+1)%n;if(k==='b')S.scene='main';
    const tr=TRICKS[ui.sel];if(k==='a'){if(S.tricks[tr.id]>=TUNE.trickNeed)perform(tr);else startTeach(tr)}if(k==='right'&&S.tricks[tr.id]<TUNE.trickNeed)startTeach(tr)}
  else if(sc==='teach')teachInput(k);
}
function gridIn(k,n,go){if(k==='left')ui.sel=(ui.sel+n-1)%n;if(k==='right')ui.sel=(ui.sel+1)%n;if(k==='up'&&ui.sel>=4)ui.sel-=4;if(k==='down'&&ui.sel+4<n)ui.sel+=4;if(k==='b')S.scene='main';if(k==='a')go()}
function openAct(i){const a=ACTIONS[i];ui.sel=0;
  if(a==='FEED')S.scene='food';if(a==='PLAY')S.scene='games';if(a==='TRICKS')S.scene='tricks';if(a==='TOYS')S.scene='toys';if(a==='CARE')S.scene='care';
  if(a==='WALK'){if(S.hunger<10){say('Too hungry for a walk — feed first!');return}startWalk()}
  if(a==='CUDDLE'){careAct('cuddle');return}if(a==='BRUSH'){S.happy=clamp(S.happy+15);/* v60: brushing no longer adds wool */addXP(1);hearts(4);setPose('happy',60);say('Brushed! Happy +15');save();return}if(a==='SHEAR'){startShear();return}if(a==='SLEEP'){S.sleep=true;say('Zzz... (A to wake)')}save(true)}
function careAct(id){
  if(id==='cuddle'){S.scene='main';S.happy=clamp(S.happy+TUNE.petAmt);addXP(1);hearts(5);setPose('happy',70);say(rnd({dog:['*wag wag*','*licks your face*','Belly rubs!','Love you!'],cat:['*purrrr*','*head boop*','Mrrow!'],chicken:['*cluck cluck*','*happy bok*','*fluffs feathers*'],pig:['*oink oink!*','*happy snort*','Belly scratch!'],horse:['*nicker*','*soft neigh*','Carrot please!'],rabbit:['*nose twitch*','*happy hop*','*binky!*'],sheep:['*baa-aa!*','*soft baa*','*fluffy nuzzle*']}[S.species]||['Love you!']));save()}
  if(id==='teeth'){S.scene='teeth';ui.mg={bx:0,last:null,scrub:0,done:false,t:0}}
  if(id==='groom'){S.scene='groom';ui.mg={ph:S.coat<15?'short':'intro',snips:0,t:0,start:S.coat,mat:S.coat>=TUNE.matAt,brush:0,last:null}}}
function feed(f){if(S.hunger>=97&&!f.plq){say('Too full!');return}
  S.hunger=clamp(S.hunger+f.v);S.happy=clamp(S.happy+(f.joy||0));if(f.plq)S.plaque=clamp(S.plaque+f.plq);addXP(2);
  S.scene='main';setPose('eat',80);ui.eatFood=f.id;say(f.n+' +'+f.v+(f.plq<0?' • cleaner teeth':''));if(f.joy>5)hearts(3);checkGrow();save()}
function toy(t){if(!S.toys.includes(t.id)){if(DB.wallet<t.p){say('Need '+t.p+' coins — play games & walk!');return}
    DB.wallet-=t.p;S.toys.push(t.id);sparkle(16);say('Got a '+t.n+'!');save();return}
  S.scene='main';S.happy=clamp(S.happy+12);addXP(2);ui.idle={k:'play',t:300,toy:t.id};ui.poseT=0;hearts(3);say(S.name+' loves the '+t.n.toLowerCase()+'!');save()}
function perform(tr){S.scene='main';setPose(tr.id,120);S.happy=clamp(S.happy+10);S.hunger=clamp(S.hunger-2);addXP(1);sparkle(14);say(S.name+' does '+tr.n+'!');checkGrow();save()}
function endGame(){const m=ui.mg;const joy=Math.min(30,8+m.score*3),coins=Math.min(15,2+m.score);S.happy=clamp(S.happy+joy);S.hunger=clamp(S.hunger-5);DB.wallet+=coins;addXP(2);
  const b=S.best[m.id]||0;if(m.score>b)S.best[m.id]=m.score;ui.mg=null;S.scene='main';setPose('happy',60);hearts(4);say('Joy +'+joy+'  ● +'+coins+(m.score>b?' NEW BEST':''));checkGrow();save()}
// ---- idle life ----
function pickIdle(){const I=ui.idle,sad=S.happy<35||S.coat>=TUNE.matAt||S.plaque>=TUNE.plaqueBad||S.hunger<25;
  const sp=S.species;let o=sad?['sit','lay','walk','sit','nap']:['walk','walk','hop','sit','sniff','nap','zoom','roll','walk'].concat(S.toys.length?['play','play','play']:[]);
  if(!sad&&sp==='cat')o=['walk','sit','nap','nap','hop','sniff','play','walk'];if(!sad&&sp==='chicken')o=['walk','walk','sniff','sniff','hop','sit','zoom'];if(!sad&&sp==='pig')o=['walk','sniff','sniff','lay','nap','roll','walk'];
  I.k=rnd(o);I.t={walk:360,zoom:160,hop:100,sit:200,sniff:150,nap:480,lay:300,roll:60,play:300}[I.k];
  if(I.k==='walk')I.tx=50+Math.random()*120;if(I.k==='zoom')I.tx=ui.dx<110?170:50;if(I.k==='play')I.toy=rnd(S.toys)}
function idleTick(){const I=ui.idle;if(--I.t<=0)pickIdle();
  if(I.k==='walk'||I.k==='zoom'){const sp=I.k==='zoom'?1.7:.5;if(Math.abs(I.tx-ui.dx)<2){I.k='sit';I.t=120}else{ui.dir=I.tx>ui.dx?1:-1;ui.dx+=ui.dir*sp}}
  if(I.k==='play'&&ui.anim%140===0){ui.dir*=-1}if(I.k==='play'){ui.dx=Math.max(50,Math.min(170,ui.dx+ui.dir*.6))}}
function idlePose(){const k=ui.idle.k;return{walk:'walk',zoom:'trot',hop:'hop',sit:'sit',sniff:'sniff',nap:'sleep',lay:'lay',roll:'roll',play:'play'}[k]||'idle'}
// ---- walk ----
function startWalk(){const evs=[];let x=220;const ty=['sniff','lamp','poo','sniff','lamp','sniff'];ty.sort(()=>Math.random()-.5);
  ty.forEach(t=>{evs.push({x,t});x+=170+Math.random()*90});
  S.scene='walk';ui.mg={x:0,len:x+80,evs,st:'walk',stT:0,boost:0,sn:0,bag:0,left:0,poos:[],done:false}}
function walkInput(k){const m=ui.mg;if(m.done){if(k==='a'||k==='b')endWalk();return}
  if(k==='b'){m.done=true;return}
  if(m.st==='walk'&&(k==='right'||k==='a'))m.boost=50;
  if(m.st==='sniffQ'){if(k==='a'){m.st='sniff';m.stT=110;m.sn++}if(k==='right'){m.st='walk';m.cur.d=true}}
  if(m.st==='bagQ'){if(k==='a'){m.st='bagging';m.stT=50;m.bag++;m.cur.bagged=true}if(k==='right'){m.left++;m.cur.d=true;m.st='walk';say('Oops! Always bag the poo!')}}}
function walkTick(){const m=ui.mg;if(m.done)return;if(m.stT>0)m.stT--;
  if(m.st==='walk'){m.x+=m.boost>0?1.4:.7;if(m.boost>0)m.boost--;
    const e=m.evs.find(e=>!e.d&&e.x-m.x<4);if(e){m.cur=e;if(e.t==='sniff')m.st='sniffQ';if(e.t==='lamp'){m.st='wee';m.stT=90}if(e.t==='poo'){m.st='poo';m.stT=80}}
    if(m.x>=m.len)m.done=true}
  else if(m.st==='sniff'&&!m.stT){m.cur.d=true;m.st='walk';hearts(2,70,130)}
  else if(m.st==='wee'&&!m.stT){m.cur.d=true;m.st='walk';say('Wee on the lamp post!',70)}
  else if(m.st==='poo'&&!m.stT){m.cur.px=m.x+60;m.st='bagQ'}
  else if(m.st==='bagging'&&!m.stT){m.cur.d=true;m.st='walk';say('Good owner! Bagged & binned',80);sparkle(8,80,150)}}
function endWalk(){const m=ui.mg,joy=Math.min(35,10+m.sn*4+Math.round(m.x/m.len*10)),coins=3+m.bag*2;S.happy=clamp(S.happy+joy);S.hunger=clamp(S.hunger-6);DB.wallet+=coins;addXP(3);S.lastWalk=now();
  ui.mg=null;S.scene='main';setPose('happy',60);hearts(4);say('Lovely walk! Joy +'+joy+'  ● +'+coins);checkGrow();save()}
// ---- teeth ----
function teethInput(k){const m=ui.mg;if(m.done){if(k==='a'||k==='b'){S.scene='main';ui.mg=null;setPose('happy',60);save()}return}
  if(k==='b'){S.scene='main';ui.mg=null;save();return}
  if((k==='left'||k==='right')&&k!==m.last){m.last=k;m.bx=k==='left'?-1:1;S.plaque=Math.max(0,S.plaque-5);m.scrub++;for(let i=0;i<2;i++)ui.fx.push({x:W/2+m.bx*30,y:120,vx:Math.random()*2-1,vy:-Math.random()*1.5,t:30,ch:'bubble'});
    if(S.plaque<=0){m.done=true;S.happy=clamp(S.happy+10);addXP(2);sparkle(20,W/2,110);save()}}}
// ---- groomer ----
function groomInput(k){const m=ui.mg;
  if(m.ph==='short'||m.ph==='done'){if(k==='a'||k==='b'){if(m.ph==='done'){setPose('happy',80);hearts(5)}S.scene='main';ui.mg=null;save()}return}
  if(k==='b'){S.scene='main';ui.mg=null;save();return}
  if(m.ph==='intro'&&k==='a'){m.ph=m.mat?'brush':'cut';return}
  if(m.ph==='brush'&&(k==='left'||k==='right')&&k!==m.last){m.last=k;m.brush++;if(m.brush>=12){m.ph='cut';S.coat=Math.min(S.coat,TUNE.matAt-1)}}
  if(m.ph==='cut'&&k==='a'){m.snips++;S.coat=Math.max(5,S.coat-12);for(let i=0;i<5;i++)ui.fx.push({x:150+Math.random()*40-20,y:110+Math.random()*20,vx:Math.random()*2-1,vy:Math.random(),t:45,ch:'hair'});
    if(S.coat<=5){m.ph='done';S.happy=clamp(S.happy+(m.mat?30:15));addXP(3);S.lastGroom=now();sparkle(24,150,110)}}}
