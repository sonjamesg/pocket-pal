// ===== nature.js — v63 peaceful outdoor nature ambience (procedural WebAudio, no files, NO music) =====
// Soft wind bed (filtered noise w/ slow swells) + occasional leaf rustle + random birdsong chirps (day) / crickets (night).
// Only while walking outdoors (scene 'map', CUR ranch/outer). Muffled indoors/menus. Respects DB.mute and tab hidden.
const NAT={on:0,bus:null,wind:null,wf:null,nextBird:0,nextRustle:0,nextCrick:0};
function natNight(){const h=new Date().getHours();return h>=21||h<6}
function natInit(){const a=AC;if(!a||NAT.bus)return;const bus=a.createGain();bus.gain.value=0;bus.connect(a.destination);NAT.bus=bus;
  const len=a.sampleRate*4,buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);let b=0;for(let i=0;i<len;i++){b=(b+0.02*(Math.random()*2-1))/1.02;d[i]=b*3.5}
  const src=a.createBufferSource();src.buffer=buf;src.loop=true;const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=420;lp.Q.value=.3;
  const wg=a.createGain();wg.gain.value=.22;src.connect(lp);lp.connect(wg);wg.connect(bus);src.start();NAT.wind=wg;NAT.wf=lp;NAT.nbuf=buf}
function natBird(a,t0){const base=2200+Math.random()*1800,n=2+(Math.random()*4|0),sp=.09+Math.random()*.08,pan=a.createStereoPanner?a.createStereoPanner():null;if(pan)pan.pan.value=Math.random()*1.6-.8;
  const out=a.createGain();out.gain.value=.018+Math.random()*.012;if(pan){out.connect(pan);pan.connect(NAT.bus)}else out.connect(NAT.bus);
  for(let i=0;i<n;i++){const o=a.createOscillator(),gn=a.createGain(),s=t0+i*sp,f=base*(1+(Math.random()*.25-.1));o.type='sine';o.frequency.setValueAtTime(f,s);o.frequency.exponentialRampToValueAtTime(f*(Math.random()<.5?1.35:.75),s+.07);
    gn.gain.setValueAtTime(.0001,s);gn.gain.exponentialRampToValueAtTime(1,s+.012);gn.gain.exponentialRampToValueAtTime(.0001,s+.08);o.connect(gn);gn.connect(out);o.start(s);o.stop(s+.1)}}
function natRustle(a,t0){const s=a.createBufferSource();s.buffer=NAT.nbuf;const hp=a.createBiquadFilter();hp.type='bandpass';hp.frequency.value=1800+Math.random()*1200;hp.Q.value=.7;const gn=a.createGain(),d=1.2+Math.random();
  gn.gain.setValueAtTime(.0001,t0);gn.gain.linearRampToValueAtTime(.05,t0+d*.4);gn.gain.linearRampToValueAtTime(.0001,t0+d);s.connect(hp);hp.connect(gn);gn.connect(NAT.bus);s.start(t0,Math.random()*3);s.stop(t0+d+.05)}
function natCricket(a,t0){const f=4200+Math.random()*400,gn=a.createGain();gn.gain.value=.008;gn.connect(NAT.bus);for(let i=0;i<3;i++){const o=a.createOscillator(),e=a.createGain(),s=t0+i*.06;o.type='sine';o.frequency.value=f;e.gain.setValueAtTime(.0001,s);e.gain.exponentialRampToValueAtTime(1,s+.01);e.gain.exponentialRampToValueAtTime(.0001,s+.045);o.connect(e);e.connect(gn);o.start(s);o.stop(s+.05)}}
setInterval(()=>{const a=AC;if(!a||a.state!=='running')return;natInit();if(!NAT.bus)return;
  const out=typeof S!=='undefined'&&S.scene==='map'&&(CUR==='ranch'||CUR==='outer'),want=DB.mute||document.hidden?0:out?.55:0,now=a.currentTime;
  NAT.bus.gain.setTargetAtTime(want,now,.8);if(want<=0)return;
  NAT.wind.gain.setTargetAtTime(.14+.12*Math.sin(now/7)+.05*Math.sin(now/2.3),now,1.5);NAT.wf.frequency.setTargetAtTime(340+160*Math.sin(now/9),now,2);
  const night=natNight();
  if(!night&&now>NAT.nextBird){natBird(a,now+.05);NAT.nextBird=now+2.5+Math.random()*6}
  if(now>NAT.nextRustle){natRustle(a,now+.05);NAT.nextRustle=now+7+Math.random()*10}
  if(night&&now>NAT.nextCrick){natCricket(a,now+.05);NAT.nextCrick=now+.7+Math.random()*1.2}},250);
