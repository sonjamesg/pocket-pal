// ===== avatar.js — western cowboy/cowgirl + runtime hair/eye palette swap =====
// Art uses KEY colours (see scripts/gen-western.py): hair #FF80FF/#FF00FF/#A000A0, iris #00FFFF.
const AV_HAIR={black:[[70,70,90],[36,32,44],[14,12,20]],brown:[[170,110,60],[120,70,30],[74,42,18]],blonde:[[255,240,160],[240,200,90],[190,140,50]],auburn:[[190,90,60],[140,50,35],[90,30,25]],ginger:[[255,150,70],[230,100,30],[170,60,20]]};
const AV_EYES={brown:[120,70,30],blue:[60,130,230],green:[50,160,80],hazel:[160,120,50],grey:[140,150,165]};
const AV_HK=Object.keys(AV_HAIR),AV_EK=Object.keys(AV_EYES);const avCache={};
function avLook(){const l=DB.look||{};return{body:DB.avatar==='girl'?'girl':'boy',hair:AV_HAIR[l.hair]?l.hair:'brown',eyes:AV_EYES[l.eyes]?l.eyes:'brown'}}
// part: 'p' portrait | 's' walk sheet. Returns a canvas (or null until art loads).
function avImg(part,body,hair,eyes){const L=avLook();body=body||L.body;hair=hair||L.hair;eyes=eyes||L.eyes;
  const src=IMG[(part==='p'?'p':'s')+(body==='girl'?'cowgirl':'cowboy')];if(!src||!src.naturalWidth)return null;
  const key=part+body+hair+eyes+src.src;if(avCache[key])return avCache[key];
  const c=document.createElement('canvas');c.width=src.naturalWidth;c.height=src.naturalHeight;const x=c.getContext('2d');x.drawImage(src,0,0);
  const d=x.getImageData(0,0,c.width,c.height),p=d.data,H=AV_HAIR[hair],E=AV_EYES[eyes];
  const M={'255,128,255':H[0],'255,0,255':H[1],'160,0,160':H[2],'0,255,255':E};
  for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const m=M[p[i]+','+p[i+1]+','+p[i+2]];if(m){p[i]=m[0];p[i+1]=m[1];p[i+2]=m[2]}}
  x.putImageData(d,0,0);return avCache[key]=c}
function avatarOpen(){S={scene:'avatar'};ui.sel=DB.avatar==='girl'?1:0;ui.arow=0;const L=avLook();ui.ah=AV_HK.indexOf(L.hair);ui.ae=AV_EK.indexOf(L.eyes);ui.msgT=0}
function avatarKey(k){if(ui.arow==null){ui.arow=0;ui.ah=1;ui.ae=0}
  if(k==='up')ui.arow=(ui.arow+2)%3;if(k==='down')ui.arow=(ui.arow+1)%3;
  const d=k==='left'?-1:k==='right'?1:0;if(d){if(ui.arow===0)ui.sel=1-ui.sel;else if(ui.arow===1)ui.ah=(ui.ah+d+AV_HK.length)%AV_HK.length;else ui.ae=(ui.ae+d+AV_EK.length)%AV_EK.length}
  if(k==='a'||k==='start'){DB.avatar=ui.sel?'girl':'boy';DB.look={hair:AV_HK[ui.ah],eyes:AV_EK[ui.ae]};saveDB();ui.nameFor='player';ui.modal={type:'name',name:'',k:0}}
  if(k==='b'){S={scene:'title'};ui.tsel=0}}
function drawAvatar(t){bg(false);g.imageSmoothingEnabled=false;if(ui.arow==null){ui.arow=0;ui.ah=1;ui.ae=0}
  otxt('YOUR RANCHER',W/2,20,'#ffe36a',13);const body=ui.sel?'girl':'boy',hair=AV_HK[ui.ah],eyes=AV_EK[ui.ae];
  RR(W/2-50,28,100,96,10,'#f8ecd0','#7a4a24');const bo=Math.round(Math.sin(t/6)*1.5),p=avImg('p',body,hair,eyes);if(p)g.drawImage(p,W/2-42,32+bo,84,84);
  const s=avImg('s',body,hair,eyes),fr=(t>>4)%2;if(s)g.drawImage(s,fr*16,0,16,16,W/2+52,100,16,16);
  const rows=[['',ui.sel?'COWGIRL':'COWBOY'],['HAIR',hair.toUpperCase()],['EYES',eyes.toUpperCase()]];
  rows.forEach(([l,v],i)=>{const y=134+i*20,on=ui.arow===i;RR(30,y-9,W-60,17,6,on?'#ffe0a0':'#fffc',on?'#c0602a':'#2b244055');
    if(l)txt(l,46,y+3,'#7a4a24',8,'left');txt((on?'◀ ':'')+v+(on?' ▶':''),W/2+(l?14:0),y+3,'#2b2440',10);
    if(i===1)R(W-52,y-4,8,8,'rgb('+AV_HAIR[hair][1]+')');if(i===2)R(W-52,y-4,8,8,'rgb('+AV_EYES[eyes]+')')});
  txt('▲▼ pick  ◀▶ change  A next',W/2,H-10,'#fff',9)}
