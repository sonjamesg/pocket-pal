// ===== menus.js — title/pause items, naming & confirm modals =====
const PAUSE=['RESUME','FARM MAP','SAVE','MY PETS','HOME'];
function hasSave(){return !!((DB.avatar&&DB.playerName)||petList().length)}
function titleItems(){if(!hasSave())return['NEW GAME'];const a=['CONTINUE','NEW GAME'];if(petList().length)a.push('MY PETS');return a}
function newGame(){const go=()=>{try{localStorage.removeItem(SAVE)}catch(e){}DB={v:9,pets:{},lastId:null,wallet:60,coinsMerged:1,missions:{}};saveDB();S={scene:'title'};avatarOpen()};if(hasSave())askConfirm('Start a NEW GAME? Your ranch will be erased.',()=>askConfirm('REALLY erase? Pets and coins will be GONE forever!',go));else go()}
function continueGame(){if(DB.avatar&&DB.playerName&&DB.introDone){openMap();return}if(DB.lastId&&DB.pets[DB.lastId]){loadPet(DB.lastId);return}openMap()}
function openMap(){if(!DB.avatar||!DB.playerName){avatarOpen();return}if(!DB.introDone){startIntro();return}if(S.id)save(true);const near=S.id&&S.stage?S.id:null;/* v129: spawn near the pet you left, but clear sticky B→reopen */ui.mapBack=null;S={scene:'map'};ui.msgT=0;owInit(near)}
const KEYS='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['DEL','DONE']);
// v16: no starter pet — pets are bought at the PET STORE on the farm map
function newPet(){openMap();say('PET SHOP: out the south GATE',240)}
function openStore(){S={scene:'store'};ui.sel=0;ui.msgT=0}
function buyDog(b){const p=priceOf(b);if(DB.wallet<p){say('Need '+p+' coins — you have '+DB.wallet);return}ui.buy=b;ui.modal={type:'name',name:'',k:0}}
function finishName(n){ui.modal=null;if(ui.nameFor){ui.nameFor=null;DB.playerName=(n||'').trim().slice(0,8).toUpperCase()||(DB.avatar==='girl'?'DAISY':'DUSTY');saveDB();startIntro();return}n=(n||'').trim().slice(0,8).toUpperCase()||'PIP';const b=ui.buy;ui.buy=null;if(!b){S={scene:'species',name:n};ui.sel=0;return}
  DB.wallet-=priceOf(b);S={scene:'egg',name:n,species:'dog',breed:b};syncActs();S.id='p'+now().toString(36)+Math.floor(Math.random()*1e4);S.created=now();fix(S);ui.hatch=0;save();saveDB()}
function askConfirm(q,yes){ui.modal={type:'confirm',q,yes,k:1}}
function modalInput(k){const m=ui.modal;
  if(m.type==='confirm'){if(k==='left'||k==='right'||k==='up'||k==='down')m.k^=1;if(k==='b'){ui.modal=null}if(k==='a'||k==='start'){ui.modal=null;if(m.k===0)m.yes()}return}
  const C=7,n=KEYS.length;
  if(k==='left')m.k=(m.k+n-1)%n;if(k==='right')m.k=(m.k+1)%n;if(k==='up')m.k=(m.k-C+n)%n;if(k==='down')m.k=Math.min(n-1,m.k+C)%n;
  if(k==='b'){if(m.name)m.name=m.name.slice(0,-1);else{ui.modal=null;if(ui.buy){ui.buy=null}else if(ui.nameFor){ui.nameFor=null;DB.avatar=null;avatarOpen()}else{S={scene:'title'};ui.tsel=0}}}
  const need=()=>{if(!(m.name||'').trim()){m.err='Type at least 1 letter!';return true}return false};if(k==='start'){if(!need())finishName(m.name)}
  if(k==='a'){const c=KEYS[m.k];if(c==='DEL')m.name=m.name.slice(0,-1);else if(c==='DONE'){if(!need())finishName(m.name)}else if(m.name.length<8){m.err='';m.name+=c;if(m.name.length===8)m.k=n-1}}}
function drawModal(t){const m=ui.modal;R(0,0,W,H,'#2b244099');
  if(m.type==='confirm'){panel(24,62,W-48,92,'ARE YOU SURE?');const words=m.q.split(' ');let line='',y=88;words.forEach(w=>{if((line+w).length>26){txt(line,W/2,y,'#2b2440',10);y+=13;line=''}line+=w+' '});txt(line,W/2,y,'#2b2440',10);
    ['YES','NO'].forEach((l,i)=>{const x=W/2-62+i*66,on=m.k===i;RR(x,128,58,18,9,on?'#ff5a8b':'#fff',on?'#fff':'#5b4b8a');txt(l,x+29,141,on?'#fff':'#5b4b8a',10)});return}
  panel(12,14,W-24,H-26,ui.nameFor?'WHAT IS YOUR NAME?':ui.nameSheep?'NAME YOUR SHEEP':'NAME YOUR PET');
  RR(40,28,W-80,24,8,'#efe6ff','#5b4b8a');const nm=m.name+(m.name.length<8&&t%40<20?'_':'');txt(nm||'',W/2,46,'#5b4b8a',15);if(!m.name)txt(t%40<20?'_':'',W/2,46,'#5b4b8a',15);
  txt(m.name.length+'/8',W-46,62,'#8a80a8',8,'right');if(m.err)txt(m.err,W/2,62,'#e8402a',9);
  const C=7,cw=26,ch=20,x0=(W-C*cw)/2+1,y0=66;
  KEYS.forEach((c,i)=>{const wide=i>=26,on=i===m.k;let x,y,w;
    if(wide){const j=i-26;w=72;x=W/2-78+j*84;y=y0+4*ch+2}else{x=x0+(i%C)*cw;y=y0+Math.floor(i/C)*ch;w=cw-4}
    RR(x,y,w,ch-4,6,on?'#ff5a8b':(wide?'#e6dcff':'#fff'),on?'#fff':'#5b4b8a55');txt(c,x+w/2,y+12,on?'#fff':'#5b4b8a',wide?9:10)});
  txt('✚ move  A pick  B delete  START done',W/2,H-16,'#8a80a8',8)}
function input(k){if(ui.modal)return modalInput(k);return input0(k)}

// ===== intro: Grandpa hands over the ranch (Pokémon-style typed dialogue) =====
function introPages(){const n=DB.playerName||'KID';return['Howdy, '+n+'! There you are, partner. Come closer, let your old Grandpa get a look at you.',
  'I want you to have my ranch. Once it was full of animals and life… but in my old age, I let it slip away.',
  'Bring it back to its former glory, '+n+'. First, go read the JOB BOARD by the farmhouse. It shows what to do next. I believe in you!']}
function startIntro(){S={scene:'intro'};ui.dlg={i:0,c:0};ui.ow=null;owInit(null)}
function introInput(k){const d=ui.dlg,P=introPages(),full=P[d.i].length;if(k!=='a'&&k!=='start'&&k!=='b')return;
  if(d.c<full){d.c=full;return}if(d.i<P.length-1){d.i++;d.c=0;return}DB.introDone=1;saveDB();S={scene:'map'};ui.msgT=0;owInit(null)}
function wrapTxt(s,maxW,size){g.font='bold '+size+'px sans-serif';const out=[];let line='';for(const w of s.split(' ')){const t=line?line+' '+w:w;if(g.measureText(t).width>maxW&&line){out.push(line);line=w}else line=t}if(line)out.push(line);return out}
function drawIntro(t){drawOverworld(t);const d=ui.dlg,P=introPages(),s=P[d.i];d.c=Math.min(s.length,d.c+.8);
  R(0,0,W,H,'#0004');const ok=n=>IMG[n]&&IMG[n].naturalWidth;
  RR(8,H-108,60,60,6,'#fff','#2b2440');if(ok('pgrandpa'))g.drawImage(IMG.pgrandpa,14,H-102,48,48);RR(8,H-50,60,12,4,'#e8402a','#2b2440');txt('GRANDPA',38,H-41,'#fff',7);
  RR(6,H-48,W-12,44,6,'#fff','#2b2440');R(9,H-45,W-18,38,'#fff');g.strokeStyle='#58a8f8';g.lineWidth=1;g.strokeRect(10.5,H-44.5,W-21,37);
  wrapTxt(s.slice(0,Math.floor(d.c)),W-30,8).forEach((l,i)=>txt(l,15,H-32+i*11,'#2b2440',8,'left'));
  if(d.c>=s.length&&(t>>4)%2){g.fillStyle='#e8402a';g.beginPath();g.moveTo(W-20,H-12);g.lineTo(W-12,H-12);g.lineTo(W-16,H-8);g.fill()}
  txt((d.i+1)+'/'+P.length,W-14,H-40,'#a99fc8',6,'right')}
