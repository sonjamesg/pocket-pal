// ===== assets.js — manifest load, IMG, ART_DEV live-reload =====
const held={};const IMG={};let ART_REV=0;const ART_DEV=!/[?&]nodev=1/.test(location.search)&&(/[?&]dev=1/.test(location.search)||(()=>{try{return localStorage.PETFARM_DEV==='1'}catch(e){return false}})()||/^(localhost|127\.|192\.168\.|10\.)/.test(location.hostname));
function loadArt(force){return fetch('assets/world/manifest.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(m=>{if(!force&&m.rev===ART_REV)return;ART_REV=m.rev;
  for(const k in m.images){const im=new Image();im.onload=()=>{IMG[k]=im};im.src='assets/world/'+m.images[k]+'?r='+m.rev+(ART_DEV?'.'+Date.now():'')}}).catch(()=>{})}
loadArt(true);if(ART_DEV)setInterval(()=>loadArt(false),2000);
