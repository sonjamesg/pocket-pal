// v66 CONTROLLER (Gamepad API, standard mapping) — same pattern as Big Rig: poll every frame, edge-detect, feed the same held{}/input() path as touch + keyboard.
// Buttons: 0 A/Cross -> a, 1 B/Circle -> b, 9 Menu/Options -> start, 8 View/Share -> select, 12-15 D-pad. Left stick (deadzone .25) -> d-pad.
(function(){
const gp={idx:-1,prev:{},seen:{}};
function list(){try{return navigator.getGamepads?Array.from(navigator.getGamepads()||[]):[]}catch(e){return[]}}
function hint(t){let d=document.getElementById('padHint');if(!d){d=document.createElement('div');d.id='padHint';d.style.cssText='position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:99;background:#fff;color:#2b2440;border:3px solid #2b2440;border-radius:10px;padding:6px 12px;font:bold 14px monospace;box-shadow:0 3px 0 #2b2440;pointer-events:none;white-space:nowrap;transition:opacity .4s';document.body.appendChild(d)}d.textContent=t;d.style.opacity=1;clearTimeout(d._t);d._t=setTimeout(()=>d.style.opacity=0,2200)}
addEventListener('gamepadconnected',e=>{if(!gp.seen[e.gamepad.index]){gp.seen[e.gamepad.index]=1;if(gp.idx<0)gp.idx=e.gamepad.index;hint('\u{1F3AE} Controller connected')}});
addEventListener('gamepaddisconnected',e=>{delete gp.seen[e.gamepad.index];if(gp.idx===e.gamepad.index){gp.idx=-1;for(const k in gp.prev)if(gp.prev[k])held[k]=0;gp.prev={}}hint('\u{1F3AE} Controller disconnected')});
const DZ=.25;
function tick(){requestAnimationFrame(tick);const L=list();let g=L[gp.idx];if(!g){g=L.find(x=>x);if(!g)return;gp.idx=g.index}
  const B=i=>{const b=g.buttons[i];return!!b&&(b.pressed||b.value>.5)};const ax=g.axes[0]||0,ay=g.axes[1]||0;
  const sx=Math.abs(ax)>DZ&&Math.abs(ax)>=Math.abs(ay),sy=Math.abs(ay)>DZ&&Math.abs(ay)>Math.abs(ax);
  const now={up:B(12)||(sy&&ay<0),down:B(13)||(sy&&ay>0),left:B(14)||(sx&&ax<0),right:B(15)||(sx&&ax>0),a:B(0),b:B(1),start:B(9),select:B(8)};
  for(const k in now){if(now[k]&&!gp.prev[k]){if(!held[k])held[k]=performance.now();try{input(k)}catch(e){console.warn(e)}}else if(!now[k]&&gp.prev[k])held[k]=0}
  gp.prev=now}
requestAnimationFrame(tick);
window.__padTest=function(fake){navigator.getGamepads=()=>[fake]};
})();
