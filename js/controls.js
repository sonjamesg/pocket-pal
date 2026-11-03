// ===== controls.js — on-screen buttons, keyboard, responsive canvas =====
// ===== controls =====
document.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;
  b.addEventListener('pointerdown',e=>{e.preventDefault();b.classList.add('pressed');held[k]=1;input(k);navigator.vibrate&&navigator.vibrate(8)});
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>{b.classList.remove('pressed');held[k]=0}));
  b.addEventListener('contextmenu',e=>e.preventDefault())});
document.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
document.addEventListener('dblclick',e=>e.preventDefault());
// ===== responsive canvas (layout v3) =====
const LAND=matchMedia('(orientation: landscape)');
function fit(){const box=document.getElementById('screenwrap').getBoundingClientRect();const sc=Math.max(.5,Math.min((box.width-12)/W,(box.height-12)/H));
  const cw=Math.floor(W*sc),ch=Math.floor(H*sc),dpr=Math.min(3,window.devicePixelRatio||1);cv.style.width=cw+'px';cv.style.height=ch+'px';
  cv.width=Math.round(cw*dpr);cv.height=Math.round(ch*dpr);g.setTransform(cv.width/W,0,0,cv.height/H,0,0);document.body.dataset.layout=LAND.matches?'landscape':'portrait'}
addEventListener('resize',fit);LAND.addEventListener?LAND.addEventListener('change',()=>setTimeout(fit,60)):LAND.addListener(fit);
if(window.visualViewport)visualViewport.addEventListener('resize',fit);
addEventListener('pagehide',()=>save(true));document.addEventListener('visibilitychange',()=>{if(document.hidden)save(true)});
const KM={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',z:'b',x:'a',Enter:'start',Shift:'select',Escape:'start',Backspace:'select'};
addEventListener('keyup',e=>{const k=KM[e.key]||KM[(e.key||'').toLowerCase()];if(k)held[k]=0});addEventListener('blur',()=>{for(const k in held)held[k]=0});
addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;if(ui.modal&&ui.modal.type==='name'&&!e.ctrlKey&&!e.metaKey){const m=ui.modal;if(/^[a-zA-Z]$/.test(e.key)){e.preventDefault();if(m.name.length<8)m.name+=e.key.toUpperCase();return}if(e.key==='Backspace'){e.preventDefault();m.name=m.name.slice(0,-1);return}if(e.key==='Enter'){e.preventDefault();finishName(m.name);return}if(e.key==='Escape'){e.preventDefault();ui.modal=null;S={scene:'title'};ui.tsel=0;return}}const k=KM[e.key]||KM[e.key.toLowerCase()];if(!k)return;e.preventDefault();held[k]=1;if(e.repeat)return;if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();input(k)},{capture:true});
document.addEventListener('gesturestart',e=>e.preventDefault());
