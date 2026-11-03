// ===== account.js — v33 cloud accounts: USERNAME + 4-digit CODE (no email), like I Am Speed =====
// Talks to Supabase Edge Function 'petfarm' (no keys needed in the client; PIN is bcrypt-hashed server-side).
const ACC_URL='https://bowjzdxyinmxhtexmtgl.supabase.co/functions/v1/petfarm';
const ACC={name:null,token:null,busy:false};try{ACC.token=sessionStorage.getItem('pf_tok');ACC.name=sessionStorage.getItem('pf_name')}catch(e){}
const lastName=()=>{try{return localStorage.getItem('pf_lastname')||''}catch(e){return ''}};
function accCall(body){return fetch(ACC_URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}).then(r=>r.json()).catch(()=>({ok:false,err:'net'}))}
function accSet(name,token){ACC.name=name;ACC.token=token;try{sessionStorage.setItem('pf_tok',token);sessionStorage.setItem('pf_name',name);localStorage.setItem('pf_lastname',name)}catch(e){}}
function accLogout(){cloudFlush();ACC.name=ACC.token=null;try{sessionStorage.removeItem('pf_tok');sessionStorage.removeItem('pf_name')}catch(e){}S={scene:'title'};ui.tsel=0}
const ERR={wrong_pin:'Wrong code — try again',no_user:'No player with that name',taken:'That name is taken — pick another',bad_name:'Use letters and numbers (1-12)',bad_pin:'Code must be 4 numbers',locked:'Too many tries! Wait 10 minutes',net:'No internet — try again',server:'Oops! Try again',no_session:'Please log in again'};
// ---- cloud sync (debounced) ----
let cloudT=null,cloudDirty=false;
function cloudSave(){if(!ACC.token)return;cloudDirty=true;clearTimeout(cloudT);cloudT=setTimeout(cloudFlush,3000)}
function cloudFlush(){if(!ACC.token||!cloudDirty)return;cloudDirty=false;clearTimeout(cloudT);const tok=ACC.token;accCall({action:'save_game',token:tok,save:DB}).then(r=>{if(!r.ok&&r.err==='no_session'&&ACC.token===tok){ACC.token=null;say('Please log in again to save online.')}})}
const _saveDBA=saveDB;saveDB=function(){_saveDBA();cloudSave()};
const _saveA=save;save=function(q){_saveA(q);cloudSave()};
document.addEventListener('visibilitychange',()=>{if(document.hidden)cloudFlush()});
function applyCloud(sv,isNew){if(sv&&sv.pets){DB=sv;if(!DB.missions)DB.missions={};try{localStorage.setItem(SAVE,JSON.stringify(DB))}catch(e){}window.__pp&&(window.__pp.DB=DB)}
  else if(isNew){cloudDirty=true;cloudFlush()}S={scene:'title'};ui.tsel=0}
// ---- title gate ----
const _titleItemsA=titleItems;titleItems=function(){if(!ACC.token)return['PLAY'];return _titleItemsA().concat(['LOG OUT'])};
function openAcct(){S={scene:'acct'};ui.asel=0;ui.aerr=''}
// ---- PIN pad ----
const PADK=['1','2','3','4','5','6','7','8','9','DEL','0','OK'];
function openPin(mode){S={scene:'pin'};ui.pin={mode,code:'',first:null,k:0};ui.aerr=''}
function pinOK(){const P=ui.pin;if(P.code.length<4){ui.aerr='Type 4 numbers';return}
  if(P.mode==='create'&&!P.first){P.first=P.code;P.code='';ui.aerr='';return}
  if(P.mode==='create'&&P.first!==P.code){P.first=null;P.code='';ui.aerr='Codes did not match — try again';return}
  ACC.busy=true;const nm=ui.acctName;accCall({action:P.mode==='create'?'register':'login',name:nm,pin:P.code}).then(r=>{ACC.busy=false;
    if(!r.ok){P.code='';if(P.mode==='create'&&r.err==='taken'){ui.aerr=ERR.taken;setTimeout(()=>{ui.acctMode='create';askName()},900);return}ui.aerr=(ERR[r.err]||ERR.server)+(r.err==='wrong_pin'&&r.left?' ('+r.left+' tries left)':'');return}
    accSet(r.name,r.token);sfx&&sfx('fanfare');
    if(P.mode==='create'){const local=hasSave();if(local)askConfirm('Bring this device\'s ranch into '+r.name+'?',()=>{cloudDirty=true;cloudFlush()});else{DB={v:9,pets:{},lastId:null,wallet:60,coinsMerged:1,missions:{}};try{localStorage.setItem(SAVE,JSON.stringify(DB))}catch(e){}}
      S={scene:'title'};ui.tsel=0;if(!local){cloudDirty=true;cloudFlush()}
      // if they say NO to bringing the ranch, start fresh
      if(local&&ui.modal){const yes=ui.modal.yes;ui.modal.no=()=>{DB={v:9,pets:{},lastId:null,wallet:60,coinsMerged:1,missions:{}};try{localStorage.setItem(SAVE,JSON.stringify(DB))}catch(e){}cloudDirty=true;cloudFlush()};ui.modal.yes=yes}
      say('Welcome, '+r.name+'! Your code saves your ranch.',220);return}
    applyCloud(r.save,false);say('Welcome back, '+r.name+'!',200)})}
function pinInput(k){const P=ui.pin;if(ACC.busy)return;if(k==='b'){if(P.code)P.code=P.code.slice(0,-1);else openAcct();return}
  if(k==='left')P.k=(P.k+11)%12;if(k==='right')P.k=(P.k+1)%12;if(k==='up')P.k=(P.k+9)%12;if(k==='down')P.k=(P.k+3)%12;if(k==='start'){pinOK();return}
  if(k==='a'){const c=PADK[P.k];sfx&&sfx('click');if(c==='DEL')P.code=P.code.slice(0,-1);else if(c==='OK')pinOK();else if(P.code.length<4){P.code+=c;ui.aerr='';if(P.code.length===4)P.k=11}}}
function drawPin(t){bg(false);R(0,0,W,H,'#2b244066');const P=ui.pin;panel(12,6,W-24,H-12,P.mode==='create'?(P.first?'TYPE IT AGAIN':'MAKE A 4-NUMBER CODE'):'TYPE YOUR CODE');
  txt(ui.acctName||'',W/2,26,'#5b4b8a',11);for(let i=0;i<4;i++){const x=W/2-51+i*28;RR(x,32,22,24,6,'#efe6ff','#5b4b8a');if(i<P.code.length)E(x+11,44,5,5,'#2b2440')}
  if(ACC.busy)txt('Checking…',W/2,68,'#8a80a8',10);else if(ui.aerr)txt(ui.aerr,W/2,68,'#e8402a',9);else txt(P.mode==='create'?'Remember it! You need it to play.':'Hi again! Type your code',W/2,68,'#8a80a8',9);
  PADK.forEach((c,i)=>{const x=36+(i%3)*58,y=76+Math.floor(i/3)*31,on=i===P.k;RR(x,y,52,27,9,on?'#ff5a8b':c==='OK'?'#2a9a50':c==='DEL'?'#e6dcff':'#fff',on?'#fff':'#5b4b8a');txt(c,x+26,y+19,on||c==='OK'?'#fff':'#5b4b8a',c.length>1?11:16)});
  txt('✚ move  A press  B back',W/2,H-9,'#8a80a8',8)}
// ---- username entry reuses the big letter keyboard ----
function askName(){S={scene:'acct'};ui.nameAcct=1;ui.modal={type:'name',name:ui.acctMode==='login'?lastName().slice(0,8):'',k:0}}
const _finishNameA=finishName;finishName=function(n){if(!ui.nameAcct)return _finishNameA(n);ui.nameAcct=null;ui.modal=null;n=(n||'').trim().toUpperCase();if(!n){ui.aerr='Type a username first';return}
  ui.acctName=n;if(ui.acctMode==='login'){openPin('login');return}ACC.busy=true;accCall({action:'check_name',name:n}).then(r=>{ACC.busy=false;if(!r.ok){ui.aerr=ERR[r.err]||ERR.server;return}if(r.taken){ui.aerr=ERR.taken;return}openPin('create')})};
const _modalInputA=modalInput;modalInput=function(k){const m=ui.modal;if(ui.nameAcct&&m&&m.type==='name'){if(k==='b'&&!m.name){ui.modal=null;ui.nameAcct=null;return}}
  if(m&&m.type==='confirm'&&m.no&&(k==='a'||k==='start')&&m.k===1){ui.modal=null;m.no();return}return _modalInputA(k)};
const _drawModalA=drawModal;drawModal=function(t){_drawModalA(t);if(ui.nameAcct&&ui.modal&&ui.modal.type==='name'){R(18,6,W-36,16,'#5b4b8a');txt('YOUR NAME',W/2,18,'#fff',10)}};
function acctInput(k){if(ACC.busy)return;if(k==='up'||k==='down')ui.asel^=1;if(k==='b'){S={scene:'title'};ui.tsel=0;return}
  if(k==='a'||k==='start'){sfx&&sfx('click');ui.acctMode=ui.asel===0?'create':'login';ui.aerr='';askName()}}
function drawAcct(t){bg(false);otxt('PET FARM',W/2,34,'#ffe36a',24);txt('Play with your own name & code',W/2,54,'#2b2440',10);
  ['NEW PLAYER','I HAVE A CODE'].forEach((c,i)=>{const y=74+i*44,on=i===ui.asel;RR(30,y,W-60,36,14,on?'#ff5a8b':'#fff',on?'#fff':'#5b4b8a');txt(c,W/2,y+24,on?'#fff':'#5b4b8a',14)});
  txt(ui.asel?'Log in on any device':'Make a name + 4-number code',W/2,172,'#2b2440',10);if(ACC.busy)txt('Checking…',W/2,190,'#5b4b8a',10);else if(ui.aerr)txt(ui.aerr,W/2,190,'#e8402a',10);
  if(lastName())txt('Last player here: '+lastName(),W/2,206,'#5b4b8a',9)}
// ---- routing ----
const _input0A=input0;input0=function(k){au&&au();
  if(S.scene==='acct'&&!ui.modal)return acctInput(k);if(S.scene==='pin')return pinInput(k);
  if(S.scene==='title'&&(k==='a'||k==='start')){const it=titleItems(),c=it[ui.tsel%it.length];if(c==='PLAY'){openAcct();if(lastName())ui.asel=1;return}if(c==='LOG OUT'){accLogout();say('Logged out. See you soon!');return}}
  return _input0A(k)};
const _frameA=frame;frame=function(){try{frame0()}catch(e){console.error(e);requestAnimationFrame(frame)}};function frame0(){const sc=S.scene;if(sc!=='acct'&&sc!=='pin'){_frameA();if(sc==='title'&&ACC.name){RR(W/2-70,100,140,16,8,'#fffd','#2b2440');txt('Player: '+ACC.name,W/2,112,'#5b4b8a',10)}return}
  ui.anim++;const t=ui.anim;g.clearRect(0,0,W,H);if(sc==='acct')drawAcct(t);else drawPin(t);if(ui.msgT>0){ui.msgT--;drawMsg(H-40)}if(ui.modal)drawModal(t);requestAnimationFrame(frame)}
// ===== v36 flow: CONTINUE / SWITCH ACCOUNT; username → code; username = in-game name =====
try{const t=localStorage.getItem('pf_tok'),n=localStorage.getItem('pf_name');if(!ACC.token&&t){ACC.token=t;ACC.name=n}}catch(e){}
const _accSetB=accSet;accSet=function(n,t){_accSetB(n,t);try{localStorage.setItem('pf_tok',t);localStorage.setItem('pf_name',n)}catch(e){}};
const _accLogoutB=accLogout;accLogout=function(){_accLogoutB();try{localStorage.removeItem('pf_tok');localStorage.removeItem('pf_name');localStorage.removeItem(SAVE)}catch(e){}DB={v:9,pets:{},lastId:null,wallet:60,coinsMerged:1,missions:{}}};
titleItems=function(){return ACC.token?['CONTINUE','SWITCH ACCOUNT']:['PLAY']};
function freshDB(){DB={v:9,pets:{},lastId:null,wallet:60,coinsMerged:1,missions:{}};try{localStorage.setItem(SAVE,JSON.stringify(DB))}catch(e){}window.__pp&&(window.__pp.DB=DB)}
function acctGo(){if(ACC.name)DB.playerName=ACC.name;if(!DB.avatar){avatarOpen();return}saveDB();continueGame()}
// one username box: name exists → login code, new → create code
function askName(){S={scene:'acct'};ui.nameAcct=1;ui.acctMode='any';ui.modal={type:'name',name:'',k:0}}
finishName=(function(prev){return function(n){if(!ui.nameAcct)return prev(n);ui.nameAcct=null;ui.modal=null;n=(n||'').trim().toUpperCase();
  if(!/[A-Z]/.test(n)){ui.aerr='Use at least 1 letter';askName();return}ui.acctName=n;ACC.busy=true;
  accCall({action:'check_name',name:n}).then(r=>{ACC.busy=false;if(!r.ok){ui.aerr=ERR[r.err]||ERR.server;askName();return}openPin(r.taken?'login':'create')})}})(_finishNameA);
pinOK=(function(){return function(){const P=ui.pin;if(P.code.length<4){ui.aerr='Type 4 numbers';return}
  if(P.mode==='create'&&!P.first){P.first=P.code;P.code='';ui.aerr='';return}
  if(P.mode==='create'&&P.first!==P.code){P.first=null;P.code='';ui.aerr='Codes did not match — try again';return}
  ACC.busy=true;accCall({action:P.mode==='create'?'register':'login',name:ui.acctName,pin:P.code}).then(r=>{ACC.busy=false;
    if(!r.ok){P.code='';ui.aerr=(ERR[r.err]||ERR.server)+(r.err==='wrong_pin'&&r.left?' ('+r.left+' tries left)':'');return}
    accSet(r.name,r.token);sfx&&sfx('fanfare');
    if(P.mode==='create'){freshDB();DB.playerName=r.name;cloudDirty=true;cloudFlush();avatarOpen();say('Hi '+r.name+'! Pick your rancher.',200);return}
    if(r.save&&r.save.pets)applyCloud(r.save,false);else freshDB();acctGo();say('Welcome back, '+r.name+'!',200)})}})();
const _pinInputB=pinInput;pinInput=function(k){if(k==='b'&&ui.pin&&!ui.pin.code&&!ACC.busy){askName();return}return _pinInputB(k)};
// avatar: no second name screen when logged in
const _avatarKeyB=avatarKey;avatarKey=function(k){if(ACC.name&&(k==='a'||k==='start')){DB.avatar=ui.sel?'girl':'boy';DB.look={hair:AV_HK[ui.ah],eyes:AV_EK[ui.ae]};DB.playerName=ACC.name;saveDB();startIntro();return}
  if(ACC.name&&k==='b'){S={scene:'title'};ui.tsel=0;return}return _avatarKeyB(k)};
const _input0B=input0;input0=function(k){
  if(S.scene==='title'&&!ui.modal&&(k==='a'||k==='start')){const it=titleItems(),c=it[ui.tsel%it.length];au&&au();
    if(c==='PLAY'){ui.aerr='';askName();return}if(c==='CONTINUE'){acctGo();return}if(c==='SWITCH ACCOUNT'){accLogout();askName();return}}
  if(S.scene==='acct'&&!ui.modal){if(k==='b'){S={scene:'title'};ui.tsel=0}else askName();return}
  return _input0B(k)};
drawAcct=function(t){bg(false);otxt('PET FARM',W/2,40,'#ffe36a',24);if(ACC.busy)txt('Checking…',W/2,110,'#2b2440',12);else if(ui.aerr)txt(ui.aerr,W/2,110,'#e8402a',11)};
// ---- v37: native phone keyboard for account username + PIN (DOM overlay) ----
titleItems=function(){return ACC.token?['CONTINUE','SWITCH ACCOUNT']:['LOGIN']};
(function(){
  const ov=document.createElement('div');ov.id='acctov';ov.hidden=true;
  ov.innerHTML='<form id="acctform" autocomplete="off"><div id="acctttl">YOUR NAME</div><div id="accthint"></div><input id="acctin"><div id="accterr"></div><div class="acctbtns"><button type="button" id="acctback">BACK</button><button type="submit" id="acctok">NEXT</button></div></form>';
  document.getElementById('screenwrap').appendChild(ov);
  const f=ov.querySelector('form'),inp=ov.querySelector('#acctin'),ttl=ov.querySelector('#acctttl'),hint=ov.querySelector('#accthint'),er=ov.querySelector('#accterr'),ok=ov.querySelector('#acctok');
  let mode=null;
  function show(m){mode=m;ov.hidden=false;S={scene:'acct'};ui.modal=null;ui.nameAcct=null;inp.value='';er.textContent=ui.aerr||'';
    if(m==='name'){ttl.textContent='YOUR NAME';hint.textContent='Your player name in the game';inp.type='text';inp.inputMode='text';inp.maxLength=8;inp.autocapitalize='characters';inp.placeholder='NAME';inp.setAttribute('autocorrect','off');inp.spellcheck=false;inp.removeAttribute('pattern');inp.autocomplete='username';ok.textContent='NEXT'}
    else{const P=ui.pin;ttl.textContent=P.mode==='create'?(P.first?'TYPE IT AGAIN':'MAKE A 4-NUMBER CODE'):'TYPE YOUR CODE';hint.textContent=P.mode==='create'?'Remember it! You need it to play.':'Hi '+ui.acctName+'! Type your code';
      inp.type='password';inp.inputMode='numeric';inp.pattern='[0-9]*';inp.maxLength=4;inp.placeholder='••••';inp.autocomplete='off';ok.textContent='GO'}
    setTimeout(()=>{inp.focus()},30)}
  function hide(){ov.hidden=true;mode=null;inp.blur()}
  window.acctOverlayHide=hide;
  inp.addEventListener('input',()=>{if(mode==='pin'){inp.value=inp.value.replace(/\D/g,'').slice(0,4);if(inp.value.length===4)setTimeout(submit,120)}else inp.value=inp.value.replace(/[^a-zA-Z0-9 ]/g,'').toUpperCase().slice(0,8)});
  inp.addEventListener('keydown',e=>e.stopPropagation(),true);
  function busy(b){ok.disabled=b;inp.disabled=b;if(b){er.style.color='#8a80a8';er.textContent='Checking…'}else er.style.color=''}
  function submit(){if(ACC.busy||inp.disabled)return;er.textContent='';
    if(mode==='name'){const n=inp.value.trim().toUpperCase();if(!/[A-Z]/.test(n)){er.textContent='Use at least 1 letter';return}
      ui.acctName=n;ACC.busy=true;busy(true);accCall({action:'check_name',name:n}).then(r=>{ACC.busy=false;busy(false);if(!r.ok){er.textContent=ERR[r.err]||ERR.server;inp.focus();return}ui.aerr='';openPin(r.taken?'login':'create')})}
    else if(mode==='pin'){const P=ui.pin;P.code=inp.value;if(P.code.length<4){er.textContent='Type 4 numbers';return}
      const wasFirst=P.mode==='create'&&!P.first;if(wasFirst||(P.mode==='create'&&P.first!==P.code)){pinOK();show('pin');er.textContent=ui.aerr||'';return}
      busy(true);pinOK();const w=setInterval(()=>{if(!ACC.busy){clearInterval(w);busy(false);if(S.scene==='pin'||S.scene==='acct'){show('pin');er.textContent=ui.aerr||'';inp.focus()}else hide()}},80)}}
  f.addEventListener('submit',e=>{e.preventDefault();submit()});
  ov.querySelector('#acctback').addEventListener('click',()=>{if(ACC.busy)return;if(mode==='pin')show('name');else{hide();S={scene:'title'};ui.tsel=0}});
  askName=function(){ui.acctMode='any';show('name')};
  const _op=openPin;openPin=function(m){_op(m);show('pin')};
  const _al=accLogout;accLogout=function(){hide();_al()};
  // game input ignored while overlay open
  const _in=input0;input0=function(k){if(!ov.hidden)return;return _in(k)};
  input0=(function(p){return function(k){if(S.scene==='title'&&!ui.modal&&ov.hidden&&(k==='a'||k==='start')){const it=titleItems(),c=it[ui.tsel%it.length];if(c==='LOGIN'){au&&au();ui.aerr='';askName();return}}return p(k)}})(input0);
})();
