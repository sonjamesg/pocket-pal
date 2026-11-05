// v86: adaptive graphics quality — watches FPS, dials heavy effects down on slow phones, restores when smooth
// levels: 2=HIGH 1=MED 0=LOW. Session-only (sessionStorage) so a hitch never locks low forever.
const GFX={lvl:2,avg:16.7,last:0,bad:0,good:0,toast:0,
  ok(f){const L=this.lvl;if(f==='blur')return L>=2;if(f==='glow')return L>=1;if(f==='shadow'||f==='ambient')return L>=1;return true},
  dpr(){const c=this.mob?(this.lvl>=2?1.5:this.lvl>=1?1.25:1):(this.lvl>=2?2:this.lvl>=1?1.5:1);return Math.min(c,window.devicePixelRatio||1)},
  mode:'auto',
  set(l){if(this.mode!=='auto'&&this.mode in {high:1,med:1,low:1}){l=({high:2,med:1,low:0})[this.mode]}l=Math.max(0,Math.min(2,l));if(l===this.lvl)return;const down=l<this.lvl;this.lvl=l;this.bad=this.good=0;try{sessionStorage.setItem('pf_gfx',l);if(this.mode==='auto'&&this.mob)localStorage.setItem('pf_gfx_auto',l)}catch(e){}
    if(down&&!this.toasted){this.toasted=1;this.toast=150}try{fit()}catch(e){}},
  tick(now){if(this.mode!=='auto'){this.last=now;return}if(this.last){let dt=now-this.last;if(dt<250&&!document.hidden){this.avg+=(dt-this.avg)*.05;const fps=1000/this.avg;
      if(fps<(this.lvl>=2?40:28)){if(++this.bad>(this.mob?45:120))this.set(this.lvl-1)}else this.bad=Math.max(0,this.bad-1);
      /* v131: desktop AUTO may upshift; mobile AUTO never upshifts — MED↔LOW flipped P3D (laggy walk → flat "expand" + faster) */
      if(!this.mob&&this.lvl<2&&fps>55){if(++this.good>300)this.set(this.lvl+1)}else this.good=0}}this.last=now}};
// v98: phones start lighter — Android/mobile default MED (Android low-RAM → LOW), DPR capped harder; auto drops sooner and remembers per device
GFX.mob=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)||(navigator.maxTouchPoints>0&&matchMedia('(pointer:coarse)').matches);
GFX.droid=/Android/i.test(navigator.userAgent);
if(GFX.mob)GFX.lvl=(GFX.droid&&(navigator.deviceMemory||8)<=4)?0:1;
try{const s=localStorage.getItem('pf_gfx_auto');if(s!=null)GFX.lvl=Math.min(GFX.lvl,+s)}catch(e){}
try{const s=sessionStorage.getItem('pf_gfx');if(s!=null)GFX.lvl=+s}catch(e){}
// v88: persisted Options — graphics mode (auto/high/med/low) + sound
const GFXM={high:2,med:1,low:0};
let _gfxModeSaved=false;
try{const m=localStorage.getItem('pf_gfx_mode');if(m&&(m==='auto'||m in GFXM)){GFX.mode=m;if(m in GFXM)GFX.lvl=GFXM[m];_gfxModeSaved=true}}catch(e){}
/* v131: phones with no saved choice get fixed LOW (not AUTO). AUTO was starting MED (P3D) then downshifting on walk → view expand + speed-up. Manual LOW/MED/HIGH never adapt. */
if(!_gfxModeSaved&&GFX.mob){GFX.mode='low';GFX.lvl=0;try{localStorage.setItem('pf_gfx_mode','low')}catch(e){}}
if(GFX.mode in GFXM)GFX.lvl=GFXM[GFX.mode];
let OPT_MUTE=false;try{OPT_MUTE=localStorage.getItem('pf_mute')==='1'}catch(e){}
function gfxMode(m){GFX.mode=m;try{localStorage.setItem('pf_gfx_mode',m)}catch(e){}if(m!=='auto'){GFX.toasted=1;GFX.bad=GFX.good=0;const l=GFXM[m];if(l===GFX.lvl){try{fit()}catch(e){}}else GFX.set(l)}else{GFX.bad=GFX.good=0;try{fit()}catch(e){}}}
function setMute(v){OPT_MUTE=!!v;try{localStorage.setItem('pf_mute',v?'1':'0')}catch(e){}if(typeof DB!=='undefined'&&DB){DB.mute=OPT_MUTE;if(typeof ACC!=='undefined'&&ACC.token)try{saveDB()}catch(e){}}}
const GMODES=['auto','high','med','low'],GLBL={auto:'AUTO',high:'HIGH',med:'MED',low:'LOW'};
function openOpts(back){ui.opts={row:0,back:back||null}}
function optsInput(k){const O=ui.opts;if(k==='b'||(k==='start'&&O.row===2)){ui.opts=null;return}
  if(k==='up')O.row=(O.row+2)%3;if(k==='down')O.row=(O.row+1)%3;
  const d=k==='left'?-1:(k==='right'||k==='a'||k==='start')?1:0;if(!d)return;
  if(O.row===0){const i=GMODES.indexOf(GFX.mode);gfxMode(GMODES[(i+d+4)%4])}
  else if(O.row===1)setMute(!OPT_MUTE);else if(k==='a'||k==='start')ui.opts=null;
  try{!OPT_MUTE&&sfx&&sfx('blip')}catch(e){}}
function drawOpts(){const O=ui.opts;g.save();R(0,0,W,H,'#2b2440aa');panel(30,40,W-60,140,'OPTIONS');
  const rows=[['GRAPHICS',GLBL[GFX.mode]+(GFX.mode==='auto'?' ('+['LOW','MED','HIGH'][GFX.lvl]+')':'')],['SOUND',OPT_MUTE?'OFF':'ON'],['BACK','']];
  rows.forEach(([a,b],i)=>{const y=58+i*30,on=i===O.row;RR(40,y,W-80,24,8,on?'#ff5a8b':'#fff',on?'#fff':'#d8d0e8');
    if(b){txt(a,W/2-36,y+16,on?'#fff':'#5b4b8a',10);txt((on?'◀ ':'')+b+(on?' ▶':''),W/2+40,y+16,on?'#fff':(a==='SOUND'&&OPT_MUTE?'#e8402a':'#2a9a50'),10)}else txt(a,W/2,y+16,on?'#fff':'#5b4b8a',10)});
  txt(O.row===0?'LOW = fixed for slow phones · AUTO adapts':'◀ ▶ change   B back',W/2,170,'#5b4b8a',8);g.restore()}
// title + pause entries
{const _ti=titleItems;titleItems=function(){const a=_ti();return a.includes('OPTIONS')?a:a.concat(['OPTIONS'])}}
if(typeof PAUSE!=='undefined'&&!PAUSE.includes('OPTIONS'))PAUSE.splice(PAUSE.indexOf('HOME'),0,'OPTIONS');
{const _in=input0;input0=function(k){if(ui.opts)return optsInput(k);
  if(S.scene==='title'&&!ui.modal&&(k==='a'||k==='start')){const it=titleItems(),c=it[ui.tsel%it.length];if(c==='OPTIONS'){openOpts('title');return}}
  if(S.scene==='pause'&&k==='a'&&PAUSE[ui.sel]==='OPTIONS'){openOpts('pause');return}
  return _in(k)}}
GFX._perf=/[?&]perf=1/.test(location.search);addEventListener('load',()=>{
  const F=frame;frame=function(){GFX.tick(performance.now());if(typeof DB!=='undefined'&&DB&&!!DB.mute!==OPT_MUTE)DB.mute=OPT_MUTE;F();
    if(ui.opts){try{g.setTransform(g.canvas.width/W,0,0,g.canvas.height/H,0,0);drawOpts()}catch(e){console.error(e)}}
    if(GFX.toast>0){GFX.toast--;g.save();g.globalAlpha=Math.min(1,GFX.toast/30);g.fillStyle='#2b2440cc';g.fillRect(W-58,4,54,12);g.fillStyle='#fff';g.font='7px monospace';g.textAlign='center';g.fillText('LOW GFX',W-31,13);g.restore()}
    if(GFX._perf){const now=performance.now();if(GFX._pt){const dt=now-GFX._pt;GFX._pa=GFX._pa?GFX._pa*0.9+dt*0.1:dt}GFX._pt=now;
      g.save();g.globalAlpha=.75;g.fillStyle='#0008';g.fillRect(4,4,54,12);g.fillStyle='#8f8';g.font='7px monospace';g.textAlign='left';g.fillText((GFX._pa?Math.round(1000/GFX._pa):0)+'fps L'+GFX.lvl,6,13);g.restore()}};
  const TS=tiltShift;tiltShift=function(){if(GFX.ok('blur'))return TS();
    // cheap path: keep the sky tint, skip blur + glow
    const cv=g.canvas;if(CUR!=='int'&&CUR!=='shop'&&typeof skyTint==='function'){const s=skyTint(dayPhase());if(s){g.save();g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba('+s[0]+','+s[1]+','+s[2]+','+s[3]+')';g.fillRect(0,0,cv.width,cv.height);g.restore()}}};
  const AW=ambienceWorld;ambienceWorld=function(t){if(!GFX.ok('ambient'))return;return AW(t)};
  const PS=p3shadow;p3shadow=function(a,b,c,d){if(GFX.ok('shadow'))PS(a,b,c,d)};
  if(typeof nightGlow==='function'){const NG=nightGlow;nightGlow=function(t){if(GFX.ok('glow'))return NG(t)}}
  if(typeof owExtras2==='function'){const OE=owExtras2;owExtras2=function(t,o){if(GFX.lvl>0||!(typeof MAP_LAYOUT!=='undefined'&&MAP_LAYOUT.pond))return OE(t,o);
    if(CUR==='ranch'&&IMG.pond&&IMG.pond.naturalWidth){const [qx,qy]=MAP_LAYOUT.pond;g.drawImage(IMG.pond,qx*TS,qy*TS)}}}
  try{fit()}catch(e){}
});
