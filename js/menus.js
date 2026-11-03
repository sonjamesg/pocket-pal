// ===== menus.js — title/pause items, naming & confirm modals =====
const PAUSE=['RESUME','FARM MAP','SAVE','MY PETS','HOME'];
function titleItems(){return petList().length?['CONTINUE','FARM MAP','MY PETS']:['START']}
function openMap(){if(S.id)save(true);ui.mapBack=S.id&&S.stage?S.id:null;S={scene:'map'};ui.msgT=0;owInit(ui.mapBack)}
const KEYS='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['DEL','SKIP','DONE']);
// v16: no starter pet — pets are bought at the PET STORE on the farm map
function newPet(){openMap();say('Visit the PET STORE to get a pet!',200)}
function openStore(){S={scene:'store'};ui.sel=0;ui.msgT=0}
function buyDog(b){const p=priceOf(b);if(DB.wallet<p){say('Need '+p+' coins — you have '+DB.wallet);return}ui.buy=b;ui.modal={type:'name',name:'',k:0}}
function finishName(n){ui.modal=null;n=(n||'').trim().slice(0,8).toUpperCase()||'PIP';const b=ui.buy;ui.buy=null;if(!b){S={scene:'species',name:n};ui.sel=0;return}
  DB.wallet-=priceOf(b);S={scene:'egg',name:n,species:'dog',breed:b};syncActs();S.id='p'+now().toString(36)+Math.floor(Math.random()*1e4);S.created=now();fix(S);ui.hatch=0;save();saveDB()}
function askConfirm(q,yes){ui.modal={type:'confirm',q,yes,k:1}}
function modalInput(k){const m=ui.modal;
  if(m.type==='confirm'){if(k==='left'||k==='right'||k==='up'||k==='down')m.k^=1;if(k==='b'){ui.modal=null}if(k==='a'||k==='start'){ui.modal=null;if(m.k===0)m.yes()}return}
  const C=7,n=KEYS.length;
  if(k==='left')m.k=(m.k+n-1)%n;if(k==='right')m.k=(m.k+1)%n;if(k==='up')m.k=(m.k-C+n)%n;if(k==='down')m.k=Math.min(n-1,m.k+C)%n;
  if(k==='b'){if(m.name)m.name=m.name.slice(0,-1);else{ui.modal=null;if(ui.buy){ui.buy=null}else{S={scene:'title'};ui.tsel=0}}}
  if(k==='start')finishName(m.name);
  if(k==='a'){const c=KEYS[m.k];if(c==='DEL')m.name=m.name.slice(0,-1);else if(c==='SKIP')finishName('');else if(c==='DONE')finishName(m.name);else if(m.name.length<8){m.name+=c;if(m.name.length===8)m.k=n-1}}}
function drawModal(t){const m=ui.modal;R(0,0,W,H,'#2b244099');
  if(m.type==='confirm'){panel(24,62,W-48,92,'ARE YOU SURE?');const words=m.q.split(' ');let line='',y=88;words.forEach(w=>{if((line+w).length>26){txt(line,W/2,y,'#2b2440',10);y+=13;line=''}line+=w+' '});txt(line,W/2,y,'#2b2440',10);
    ['YES','NO'].forEach((l,i)=>{const x=W/2-62+i*66,on=m.k===i;RR(x,128,58,18,9,on?'#ff5a8b':'#fff',on?'#fff':'#5b4b8a');txt(l,x+29,141,on?'#fff':'#5b4b8a',10)});return}
  panel(12,14,W-24,H-26,'NAME YOUR PET');
  RR(40,28,W-80,24,8,'#efe6ff','#5b4b8a');const nm=m.name+(m.name.length<8&&t%40<20?'_':'');txt(nm||'',W/2,46,'#5b4b8a',15);if(!m.name)txt(t%40<20?'_':'',W/2,46,'#5b4b8a',15);
  txt(m.name.length+'/8',W-46,62,'#8a80a8',8,'right');
  const C=7,cw=26,ch=20,x0=(W-C*cw)/2+1,y0=66;
  KEYS.forEach((c,i)=>{const wide=i>=26,on=i===m.k;let x,y,w;
    if(wide){const j=i-26;w=52;x=W/2-84+j*58;y=y0+4*ch+2}else{x=x0+(i%C)*cw;y=y0+Math.floor(i/C)*ch;w=cw-4}
    RR(x,y,w,ch-4,6,on?'#ff5a8b':(wide?'#e6dcff':'#fff'),on?'#fff':'#5b4b8a55');txt(c,x+w/2,y+12,on?'#fff':'#5b4b8a',wide?9:10)});
  txt('✚ move  A pick  B delete  START done',W/2,H-16,'#8a80a8',8)}
function input(k){if(ui.modal)return modalInput(k);return input0(k)}
