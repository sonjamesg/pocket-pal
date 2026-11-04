// ===== nameinput.js — v64 native phone keyboard for ALL animal/player naming (replaces the in-game letter grid) =====
(function(){
  const ov=document.createElement('div');ov.id='nameov';ov.className='kbov';ov.hidden=true;
  ov.innerHTML='<form class="kbform" autocomplete="off"><div class="kbttl">NAME YOUR PET</div><div class="kbhint">Up to 8 letters</div><input class="kbin" type="text" maxlength="8" autocapitalize="characters" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="NAME"><div class="kberr"></div><div class="acctbtns"><button type="button" class="kbback">BACK</button><button type="submit" class="kbok">DONE</button></div></form>';
  document.getElementById('screenwrap').appendChild(ov);
  const f=ov.querySelector('form'),inp=ov.querySelector('input'),ttl=ov.querySelector('.kbttl'),hint=ov.querySelector('.kbhint'),er=ov.querySelector('.kberr');
  const isName=()=>ui.modal&&ui.modal.type==='name'&&!ui.nameAcct;
  function open(){const m=ui.modal,pl=ui.nameFor==='player';ttl.textContent=pl?'YOUR NAME':'NAME YOUR PET';hint.textContent=pl?'Your rancher name (up to 8 letters)':'Type a name (up to 8 letters)';
    inp.value=(m.name||'').toUpperCase();er.textContent='';ov.hidden=false;inp.focus();setTimeout(()=>{if(!ov.hidden)inp.focus()},40)}
  function close(){ov.hidden=true;inp.blur()}
  function sync(){if(isName()){if(ov.hidden)open()}else if(!ov.hidden)close()}
  window.nameKbSync=sync;
  inp.addEventListener('input',()=>{inp.value=inp.value.replace(/[^a-zA-Z]/g,'').toUpperCase().slice(0,8);if(ui.modal)ui.modal.name=inp.value;er.textContent=''});
  inp.addEventListener('keydown',e=>e.stopPropagation(),true);
  f.addEventListener('submit',e=>{e.preventDefault();const n=inp.value.trim();if(!n){er.textContent='Type at least 1 letter!';inp.focus();return}close();finishName(n);sync()});
  ov.querySelector('.kbback').addEventListener('click',()=>{close();if(ui.modal){ui.modal.name='';modalInput('b')}sync()});
  // open in the SAME tap/keypress that created the name modal (iOS only shows the keyboard inside a user gesture)
  const _in=input;input=function(k){if(!ov.hidden)return;const r=_in(k);sync();return r};
  // hide the old canvas letter grid entirely
  const _dm=drawModal;drawModal=function(t){if(isName())return;return _dm(t)};
  setInterval(sync,300);
})();
