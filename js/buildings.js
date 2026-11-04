// ===== buildings.js — backgrounds, house(), lockedHouse, drawMap =====
// ===== backgrounds =====
function isNight(){const h=new Date().getHours();return S.sleep||h>=20||h<7}
function plaque(name,x,y,sz,maxW){if(!name)return;sz=sz||6;maxW=maxW||60;g.font=`800 ${sz}px system-ui,sans-serif`;let w=g.measureText(name).width;while(w>maxW&&sz>4){sz-=.5;g.font=`800 ${sz}px system-ui,sans-serif`;w=g.measureText(name).width}
  const pw=Math.min(maxW,w)+6,ph=sz+4;RR(x-pw/2+1,y-ph+3,pw,ph,3,'#0003');RR(x-pw/2,y-ph+2,pw,ph,3,'#fff4dc','#8a5a3a');txt(name,x,y,'#5b4b8a',sz,'center',maxW)}
function bg(night){const t=ui.anim,h=new Date().getHours(),gold=!night&&(h>=17||h<8);const sky=g.createLinearGradient(0,0,0,130);
  if(night){sky.addColorStop(0,'#141640');sky.addColorStop(.6,'#2e2c66');sky.addColorStop(1,'#5a4a8a')}else if(gold){sky.addColorStop(0,'#6aa8e8');sky.addColorStop(.6,'#f8c890');sky.addColorStop(1,'#ffe0b0')}else{sky.addColorStop(0,'#5fb4f4');sky.addColorStop(.7,'#a8dcff');sky.addColorStop(1,'#e4f6ff')}
  g.fillStyle=sky;g.fillRect(0,0,W,H);
  if(night){for(let i=0;i<34;i++){const tw=(t+i*13)%90<70;if(tw)R((i*53)%W,(i*29)%96,i%5?1:2,i%5?1:2,i%3?'#fff':'#ffe9a8')}E(200,40,15,15,'#fff4c040');E(200,40,11,11,'#fff4c0');E(204,37,9,9,'#2e2c66')}
  else{const sx=206,sy=gold?70:44;E(sx,sy,22,22,'#fff6a030');E(sx,sy,13,13,gold?'#ffb84a':'#ffe36a');E(sx-4,sy-4,4,4,'#fff8d0')}
  // fluffy layered clouds
  const cl=night?['#4a4880','#5e5a96']:gold?['#f0b8a0','#fff0e0']:['#d6e8f8','#ffffff'];
  [[.12,30,1],[.07,58,.8],[.18,18,.7]].forEach(([sp,y,k],j)=>{const x=((t*sp)+j*95)%(W+80)-40;[[0,0,16,8],[12,-5,11,9],[-11,-2,10,7],[22,1,9,6]].forEach(([dx,dy,rx,ry])=>E(x+dx*k,y+dy*k+2,rx*k,ry*k,cl[0]));[[0,-1,15,7],[12,-6,10,8],[-11,-3,9,6],[22,0,8,5]].forEach(([dx,dy,rx,ry])=>E(x+dx*k,y+dy*k,rx*k,ry*k,cl[1]))});
  // distant hills + treeline
  const hc=night?['#2a3a5a','#203048']:gold?['#9ab890','#7aa070']:['#9fd0a0','#7cbc7c'];
  E(50,104,90,22,hc[0]);E(190,106,100,20,hc[0]);
  for(let x=-6;x<W+10;x+=11){const yy=96+((x*7)%5);E(x,yy,8,10,hc[1]);E(x+3,yy-6,6,7,night?'#28405a':mix(hc[1],'#ffffff',.12))}
  R(0,100,W,8,hc[1]);
  // ground
  const gr=g.createLinearGradient(0,108,0,H);gr.addColorStop(0,night?'#2f5a3e':'#8fd46a');gr.addColorStop(1,night?'#1a3424':'#5aae44');g.fillStyle=gr;g.fillRect(0,108,W,H-108);
  // chunky fence with posts, shadow & depth
  const fw=night?'#7a6a8a':'#f2dcb0',fs=night?'#5a4a6a':'#c89c68',fd=night?'#3a2e4a':'#8a6038';
  R(0,140,W,4,'#0002');
  R(0,116,W,5,fs);R(0,117,W,3,fw);R(0,130,W,5,fs);R(0,131,W,3,fw);
  for(let x=-2;x<W;x+=12){const post=(x+2)%48===0;const pw=post?9:8,ph=post?38:33,py=post?104:108;R(x+2,py+2,pw,ph,'#0002');RR(x,py,pw,ph,2,fs);RR(x,py,pw-2,ph-1,2,fw);g.fillStyle=fw;g.beginPath();g.moveTo(x,py+1);g.lineTo(x+pw/2,py-4);g.lineTo(x+pw,py+1);g.fill();R(x+pw-2,py,2,ph,fs);if(post)R(x+3,py+4,2,2,fd)}
  // dirt patch by kennel + grass tufts + flowers
  E(196,180,40,14,night?'#3a3020':'#c8a070');E(196,179,34,11,night?'#4a3a28':'#dab884');
  const tc=night?'#24492f':'#4a9a3a',tl=night?'#3a6a48':'#a8e888';
  for(let i=0;i<26;i++){const x=(i*37+11)%W,y=150+(i*23)%60;if(x>160&&y>165)continue;g.strokeStyle=tc;g.lineWidth=1.2;g.beginPath();g.moveTo(x,y);g.lineTo(x+1,y-5);g.moveTo(x+3,y);g.lineTo(x+3,y-7);g.moveTo(x+6,y);g.lineTo(x+5,y-4);g.stroke();R(x+2,y-7,1,2,tl)}
  if(!night)[[60,206,'#ff7aa8'],[104,158,'#ffe36a'],[150,208,'#fff'],[14,152,'#b48aff']].forEach(([x,y,c])=>{E(x,y,2,2,c);E(x,y,.8,.8,'#ffd84a')});
  if(!night){const bx=120+Math.sin(t*.03)*40,by=150+Math.sin(t*.07)*8,f=(t>>2)%2?3:1;E(bx-2,by,f,2,'#ffb0e0');E(bx+2,by,f,2,'#ffb0e0')}
  // kennel
  const sp=spOf(S);E(200,170,34,6,"#0003");
  const im=IMG.b_doghouse;if(sp==='dog'&&im&&im.naturalWidth){const sc=1.6;g.save();g.imageSmoothingEnabled=false;if(night)g.filter='brightness(.6) saturate(.8)';g.drawImage(im,196-im.width*sc/2,170-im.height*sc,im.width*sc,im.height*sc);g.restore();plaque(S.name,196,124,7,56)}
  else house(sp,212,166,1,night,S.name);
  if(S.species==='pig')E(120,196,40,7,night?'#3a2a1a':'#8a6038');
  // bowl (toy plastic)
  E(27,186,15,4,'#0003');E(26,182,13,4,'#1e5aa8');R(13,175,26,7,'#3a86e8');R(15,176,4,5,'#7ab8ff');E(26,175,13,3.5,'#5aa0f0');E(26,175,10,2.5,S.hunger>40?'#a6683a':'#1e4a90');if(S.hunger>40){E(23,174,2,1,'#c88a5a');E(29,175,2,1,'#c88a5a')}}
function house(sp,x,y,s,night,name){g.save();g.translate(x,y);g.scale(s,s);const dk=c=>night?mix(c,'#1b1d4a',.4):c;
  E(0,1,30,5,'#0003');R(-10,0,20,3,dk('#c0504a'));
  if(sp==='dog'){RR(-22,-38,44,38,3,dk('#d65a4a'));g.fillStyle=dk('#a83a30');g.beginPath();g.moveTo(-28,-36);g.lineTo(0,-58);g.lineTo(28,-36);g.fill();R(-26,-37,52,3,dk('#7a2a24'));RR(-9,-24,18,24,9,'#3a2020')}
  if(sp==='cat'){RR(-20,-34,40,34,12,dk('#b48ad8'));E(0,-36,22,8,dk('#8a5ab8'));E(0,-12,11,12,'#3a2848');E(0,-1,13,4,dk('#ffd84a'));star(0,-42,4,'#ffe36a')}
  if(sp==='chicken'){R(-22,-34,44,30,dk('#e8c070'));for(let i=-20;i<22;i+=6)R(i,-34,1,30,dk('#c89a50'));g.fillStyle=dk('#c0402a');g.beginPath();g.moveTo(-27,-32);g.lineTo(0,-52);g.lineTo(27,-32);g.fill();
    R(-20,-4,3,4,'#7a5030');R(17,-4,3,4,'#7a5030');RR(-6,-24,12,14,6,'#3a2020');g.strokeStyle=dk('#a0a0a0');g.lineWidth=1.5;g.beginPath();g.moveTo(6,-10);g.lineTo(20,0);g.stroke()}
  if(sp==='pig'){E(0,-2,32,6,dk('#7a5030'));RR(-24,-28,34,24,2,dk('#d8a070'));R(-26,-32,38,5,dk('#8a5a3a'));RR(-10,-20,10,16,3,'#3a2020');
    for(let i=-30;i<34;i+=8)R(i,-12,3,12,dk('#b08050'));R(-30,-10,64,2,dk('#b08050'))}
  if(sp==='horse'){RR(-26,-40,52,40,3,dk('#c89050'));g.fillStyle=dk('#8a5030');g.beginPath();g.moveTo(-30,-38);g.lineTo(0,-62);g.lineTo(30,-38);g.fill();RR(-8,-26,16,26,2,'#3a2020');R(-28,-18,8,18,dk('#a07040'));R(20,-18,8,18,dk('#a07040'))}
  if(sp==='rabbit'){RR(-18,-28,36,28,6,dk('#e8d8b0'));R(-20,-30,40,6,dk('#7a9a50'));RR(-6,-18,12,14,4,'#3a2020');E(-14,-8,5,4,dk('#fff0'));E(14,-8,5,4,dk('#fff0'))}
  if(sp==='sheep'){R(-24,-30,48,30,dk('#e8dcc0'));for(let i=-22;i<24;i+=6)R(i,-30,1,30,dk('#c8b890'));g.fillStyle=dk('#5a7a9a');g.beginPath();g.moveTo(-28,-28);g.lineTo(0,-46);g.lineTo(28,-28);g.fill();RR(-8,-20,16,20,2,'#3a2020')}
  if(name)plaque(name,0,-23+(sp==='pig'?-8:sp==='horse'?-12:0),6,52);
  g.restore()}
function lockedHouse(n,x,y,s){g.save();g.globalAlpha=.55;g.translate(x,y);g.scale(s,s);R(-24,-30,48,30,'#b0a8c0');g.fillStyle='#8a80a8';g.beginPath();g.moveTo(-28,-28);g.lineTo(0,-46);g.lineTo(28,-28);g.fill();g.globalAlpha=1;lock(0,-16);g.restore();txt(n,x,y+8*s,'#fff',6);txt('coming soon',x,y+15*s,'#ffffffaa',5)}
function drawMap(t){const sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#8fd06e');sky.addColorStop(1,'#6cbf50');g.fillStyle=sky;g.fillRect(0,0,W,H);
  for(let i=0;i<40;i++){const x=(i*67)%W,y=30+(i*41)%180;g.strokeStyle='#5aa848';g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+2,y-4);g.lineTo(x+4,y);g.stroke()}
  // paths
  g.strokeStyle='#e8d8a8';g.lineWidth=10;g.lineCap='round';g.beginPath();g.moveTo(0,120);g.lineTo(W,120);g.moveTo(120,24);g.lineTo(120,H);g.stroke();
  // field (later) + pond
  R(150,128,84,40,'#a07848');for(let y=132;y<166;y+=6)R(152,y,80,2,'#8a6038');txt('FIELD — soon',192,178,'#fff',7);
  E(36,192,26,12,'#5ab0ff');E(30,189,10,4,'#8ad0ff');
  for(let i=0;i<5;i++){E(8+i*14,30,8,9,'#4a9a3a')}
  R(0,0,W,22,'#2b2440cc');txt('FARM MAP',8,15,'#fff',10,'left');txt('● '+DB.wallet,W-8,15,'#ffd84a',9,'right');
  const L=petList(),slots=[[30,92],[78,92],[166,92],[214,92],[78,170],[30,150]];
  const pets=L.slice(0,6);if(ui.msel>L.length)ui.msel=0;
  pets.forEach((p,i)=>{const [x,y]=slots[i],on=ui.msel===i,sp=spOf(p);if(on){E(x,y+2,28,7,'#ffe36a');}
    house(sp,x,y,.8,false,p.name);if(p.stage){g.save();g.translate(x+16,y+6);g.scale(.32,.32);dog(0,0,p.breed,p.stage,{pose:on?'hop':'sit',mood:'happy',coat:p.coat});g.restore()}
    });
  if(L.length>6)txt('+'+(L.length-6)+' more in MY PETS',W/2,206,'#fff',7);
  lockedHouse('COW BARN',190,212,.6);lockedHouse('STABLE',230,212,.5);
  const ny=[78,166][0],newOn=ui.msel>=L.length;RR(96,96,48,16,8,newOn?'#ff5a8b':'#fffc','#2b2440');txt('+ NEW',120,107,newOn?'#fff':'#5b4b8a',8);
  const cur=L[ui.msel];RR(10,26,W-20,16,8,'#fffe','#2b2440');
  txt(cur?cur.name+' — '+SP[spOf(cur)].house+' • '+stageName(cur.stage,spOf(cur))+'  (A visit)':'Adopt a new pet (A)',W/2,37,'#2b2440',8);
  txt('✚ choose  A go  B back',W/2,H-3,'#fff',7)}
