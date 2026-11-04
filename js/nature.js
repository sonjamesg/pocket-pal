// ===== nature.js — v63 peaceful outdoor nature ambience (procedural WebAudio, no files, NO music) =====
// v84: NO noise at all (rustle removed — it read as distant waves). Day = varied gentle birdsong; night = soft crickets.
// Only while walking outdoors (scene 'map', CUR ranch/outer). Muffled indoors/menus. Respects DB.mute and tab hidden.
const NAT={on:0,bus:null,wind:null,wf:null,nextBird:0,nextRustle:0,nextCrick:0};
function natNight(){const h=new Date().getHours();return h>=21||h<6}
function natInit(){const a=AC;if(!a||NAT.bus)return;const bus=a.createGain();bus.gain.value=0;bus.connect(a.destination);NAT.bus=bus /* v84: no noise of any kind — no wind/waves/rustle */}
function natBird(a,t0){const pan=a.createStereoPanner?a.createStereoPanner():null;if(pan)pan.pan.value=Math.random()*1.6-.8;
  const out=a.createGain();out.gain.value=.012+Math.random()*.01;const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=5200;out.connect(lp);if(pan){lp.connect(pan);pan.connect(NAT.bus)}else lp.connect(NAT.bus);
  const m=Math.random()*5|0,base=2000+Math.random()*1400;let notes=[];
  if(m===0)for(let i=0;i<3+(Math.random()*3|0);i++)notes.push([i*.11,base*(1+i*.04),1.3,.07]); // rising chirps
  else if(m===1)notes=[[0,base*1.2,.8,.18],[.25,base,.85,.16]]; // two-note whistle (tee-tew)
  else if(m===2)for(let i=0;i<6;i++)notes.push([i*.055,base*1.1,.9,.04]); // quick trill
  else if(m===3)notes=[[0,base,1.25,.12],[.16,base*1.25,.9,.1],[.3,base*1.1,1.15,.14]]; // warble
  else notes=[[0,base*.9,1.5,.2]]; // single sweet slide
  notes.forEach(([dt,f,r,len])=>{const o=a.createOscillator(),gn=a.createGain(),s=t0+dt;o.type='sine';o.frequency.setValueAtTime(f,s);o.frequency.exponentialRampToValueAtTime(f*r,s+len*.8);
    gn.gain.setValueAtTime(.0001,s);gn.gain.exponentialRampToValueAtTime(1,s+.02);gn.gain.exponentialRampToValueAtTime(.0001,s+len);o.connect(gn);gn.connect(out);o.start(s);o.stop(s+len+.02)})}
function natCricket(a,t0){const f=4200+Math.random()*400,gn=a.createGain();gn.gain.value=.008;gn.connect(NAT.bus);for(let i=0;i<3;i++){const o=a.createOscillator(),e=a.createGain(),s=t0+i*.06;o.type='sine';o.frequency.value=f;e.gain.setValueAtTime(.0001,s);e.gain.exponentialRampToValueAtTime(1,s+.01);e.gain.exponentialRampToValueAtTime(.0001,s+.045);o.connect(e);e.connect(gn);o.start(s);o.stop(s+.05)}}
setInterval(()=>{const a=AC;if(!a||a.state!=='running')return;natInit();if(!NAT.bus)return;
  const out=typeof S!=='undefined'&&S.scene==='map'&&(CUR==='ranch'||CUR==='outer'),want=DB.mute||document.hidden?0:out?.55:0,now=a.currentTime;
  NAT.bus.gain.setTargetAtTime(want,now,.8);if(want<=0)return;
  const night=natNight();
  if(!night&&now>NAT.nextBird){natBird(a,now+.05);NAT.nextBird=now+1.8+Math.random()*5}
  if(night&&now>NAT.nextCrick){natCricket(a,now+.05);NAT.nextCrick=now+.7+Math.random()*1.2}},250);
