// v86: adaptive graphics quality — watches FPS, dials heavy effects down on slow phones, restores when smooth
// levels: 2=HIGH 1=MED 0=LOW. Session-only (sessionStorage) so a hitch never locks low forever.
const GFX={lvl:2,avg:16.7,last:0,bad:0,good:0,toast:0,
  ok(f){const L=this.lvl;if(f==='blur'||f==='glow')return L>=2;if(f==='shadow'||f==='ambient')return L>=1;return true},
  dpr(){return Math.min(this.lvl>=2?3:this.lvl>=1?2:1,window.devicePixelRatio||1)},
  set(l){if(l===this.lvl)return;const down=l<this.lvl;this.lvl=l;this.bad=this.good=0;try{sessionStorage.setItem('pf_gfx',l)}catch(e){}
    if(down&&!this.toasted){this.toasted=1;this.toast=150}try{fit()}catch(e){}},
  tick(now){if(this.last){let dt=now-this.last;if(dt<250&&!document.hidden){this.avg+=(dt-this.avg)*.05;const fps=1000/this.avg;
      if(fps<(this.lvl>=2?40:28)){if(++this.bad>120)this.set(this.lvl-1)}else this.bad=Math.max(0,this.bad-1);
      if(this.lvl<2&&fps>55){if(++this.good>300)this.set(this.lvl+1)}else this.good=0}}this.last=now}};
try{const s=sessionStorage.getItem('pf_gfx');if(s!=null)GFX.lvl=+s}catch(e){}
addEventListener('load',()=>{
  const F=frame;frame=function(){GFX.tick(performance.now());F();
    if(GFX.toast>0){GFX.toast--;g.save();g.globalAlpha=Math.min(1,GFX.toast/30);g.fillStyle='#2b2440cc';g.fillRect(W-58,4,54,12);g.fillStyle='#fff';g.font='7px monospace';g.textAlign='center';g.fillText('LOW GFX',W-31,13);g.restore()}};
  const TS=tiltShift;tiltShift=function(){if(GFX.ok('blur'))return TS();
    // cheap path: keep the sky tint, skip blur + glow
    const cv=g.canvas;if(CUR!=='int'&&CUR!=='shop'&&typeof skyTint==='function'){const s=skyTint(dayPhase());if(s){g.save();g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba('+s[0]+','+s[1]+','+s[2]+','+s[3]+')';g.fillRect(0,0,cv.width,cv.height);g.restore()}}};
  const AW=ambienceWorld;ambienceWorld=function(t){if(!GFX.ok('ambient'))return;return AW(t)};
  const PS=p3shadow;p3shadow=function(a,b,c,d){if(GFX.ok('shadow'))PS(a,b,c,d)};
  try{fit()}catch(e){}
});
