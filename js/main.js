// ===== main.js — boot, debug hook, version check =====
window.__pp={loadArt,IMG,openMap,owTry,get ow(){return ui.ow},input,get S(){return S},set S(v){S=v},ui,DB,save,loadPet,startWalk,careAct};
fit();frame();

const GAME_VER=18;
function hardReload(){const go=()=>{const u=new URL(location.href);u.searchParams.set('r',Date.now());location.replace(u.toString())};
try{const p=[];if(window.caches)p.push(caches.keys().then(k=>Promise.all(k.map(x=>caches.delete(x)))));if(navigator.serviceWorker)p.push(navigator.serviceWorker.getRegistrations().then(r=>Promise.all(r.map(x=>x.unregister()))));Promise.all(p).then(go,go);setTimeout(go,1500)}catch(e){go()}}
fetch('version.json?check='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(j=>{if(j.v>GAME_VER){const b=document.createElement('div');b.textContent='New version — tap here to update';b.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99;background:#ffd84a;color:#222;font:bold 14px sans-serif;text-align:center;padding:10px';b.onclick=hardReload;document.body.appendChild(b)}}).catch(()=>{});
