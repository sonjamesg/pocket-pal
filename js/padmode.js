// v67: hide on-screen D-pad/A/B on desktop (fine primary pointer, no touch) or when a physical gamepad is connected.
(function(){const h=document.documentElement,mq=matchMedia('(hover:hover) and (pointer:fine)');let pads=0;
function upd(){const desk=mq.matches&&!(navigator.maxTouchPoints>0&&matchMedia('(pointer:coarse)').matches);const on=desk||pads>0;if(h.classList.contains('no-pads')!==on){h.classList.toggle('no-pads',on);dispatchEvent(new Event('resize'))}}
addEventListener('gamepadconnected',()=>{pads++;upd()});addEventListener('gamepaddisconnected',()=>{pads=Math.max(0,pads-1);upd()});
mq.addEventListener&&mq.addEventListener('change',upd);upd()})();
