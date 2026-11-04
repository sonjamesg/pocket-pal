// ===== main.js — boot, debug hook, version check =====
// v57: title gate — logo + flashing START GAME before the normal title menu
ui.gate=true;
function gateGo(){if(!ui.gate)return false;if(S.scene!=='title'){ui.gate=false;return false}ui.gate=false;ui.tsel=0;try{au();sfx('click')}catch(e){}return true}
{const _inG=input;input=function(k){if(ui.gate&&S.scene==='title'){if(k==='a'||k==='start'||k==='b'||k==='select')gateGo();return}return _inG(k)};
 document.getElementById('screen').addEventListener('pointerdown',e=>{if(ui.gate&&S.scene==='title'){e.preventDefault();gateGo()}});
 addEventListener('keydown',e=>{if(ui.gate&&S.scene==='title'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();gateGo()}});}
window.__pp={loadArt,IMG,openMap,owTry,get ow(){return ui.ow},input,get S(){return S},set S(v){S=v},ui,DB,save,loadPet,startWalk,careAct};
fit();frame();

const GAME_VER=73; // keep in sync with version.json + ?v=
function hardReload(){const go=()=>{const u=new URL(location.href);u.searchParams.set('r',Date.now());location.replace(u.toString())};
try{const p=[];if(window.caches)p.push(caches.keys().then(k=>Promise.all(k.map(x=>caches.delete(x)))));if(navigator.serviceWorker)p.push(navigator.serviceWorker.getRegistrations().then(r=>Promise.all(r.map(x=>x.unregister()))));Promise.all(p).then(go,go);setTimeout(go,1500)}catch(e){go()}}
fetch('version.json?check='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(j=>{if(j.v>GAME_VER){const b=document.createElement('div');b.textContent='New version — tap here to update';b.style.cssText='position:fixed;top:0;left:0;right:0;z-index:9999;background:#ffd84a;color:#222;font:bold 16px sans-serif;text-align:center;padding:16px;cursor:pointer;touch-action:manipulation;pointer-events:auto;user-select:none';let fired=false;const go=e=>{if(e){e.preventDefault();e.stopPropagation()}if(fired)return;fired=true;b.textContent='Updating…';hardReload()};b.addEventListener('pointerup',go);b.addEventListener('touchend',go,{passive:false});b.addEventListener('click',go);document.body.appendChild(b)}}).catch(()=>{});
