// ===== buildings.js — backgrounds, house(), lockedHouse, drawMap =====
// ===== backgrounds =====
function isNight(){const h=new Date().getHours();return S.sleep||h>=20||h<7}
function bg(night){const sky=g.createLinearGradient(0,0,0,150);
  if(night){sky.addColorStop(0,'#1b1d4a');sky.addColorStop(1,'#4a3f7a')}else{sky.addColorStop(0,'#7ec8ff');sky.addColorStop(1,'#d8f0ff')}
  g.fillStyle=sky;g.fillRect(0,0,W,H);const t=ui.anim;
  if(night){for(let i=0;i<25;i++){if((t+i*13)%80<60)R((i*53)%W,(i*29)%100,1.5,1.5,'#fff')}E(200,48,12,12,'#fff4c0');E(205,44,10,10,'#2b2d5a')}
  else{E(206,52,13,13,'#ffe36a');[[(t*.15)%(W+60)-30,58],[((t*.1)+120)%(W+60)-30,76]].forEach(([x,y])=>{E(x,y,16,7,'#fff');E(x+10,y-5,10,8,'#fff');E(x-8,y-2,9,6,'#fff')})}
  // fence
  for(let x=0;x<W;x+=16){RR(x+2,104,11,40,3,night?'#6a5a7a':'#f4e4c8')}R(0,114,W,4,night?'#5a4a6a':'#e0cca8');R(0,132,W,4,night?'#5a4a6a':'#e0cca8');
  const gr=g.createLinearGradient(0,140,0,H);gr.addColorStop(0,night?'#2f5a3e':'#9de07a');gr.addColorStop(1,night?'#1f3a2a':'#6cbf50');g.fillStyle=gr;g.fillRect(0,140,W,H-140);
  for(let x=4;x<W;x+=14){g.strokeStyle=night?'#26492f':'#5aa848';g.lineWidth=1;g.beginPath();g.moveTo(x,150+(x%7));g.lineTo(x+2,145+(x%7));g.lineTo(x+4,150+(x%7));g.stroke()}
  // kennel
  house(spOf(S),212,166,1,night,S.name);if(S.species==='pig')E(120,196,40,7,night?'#3a2a1a':'#8a6038');
  // bowl
  E(26,182,12,4,'#2b6cc4');R(14,176,24,6,'#3a86e8');E(26,176,12,3,S.hunger>40?'#a6683a':'#1e4a90')}
function house(sp,x,y,s,night,name){g.save();g.translate(x,y);g.scale(s,s);const dk=c=>night?mix(c,'#1b1d4a',.4):c;
  if(sp==='dog'){RR(-22,-38,44,38,3,dk('#d65a4a'));g.fillStyle=dk('#a83a30');g.beginPath();g.moveTo(-28,-36);g.lineTo(0,-58);g.lineTo(28,-36);g.fill();RR(-9,-24,18,24,9,'#3a2020')}
  if(sp==='cat'){RR(-20,-34,40,34,12,dk('#b48ad8'));E(0,-36,22,8,dk('#8a5ab8'));E(0,-12,11,12,'#3a2848');E(0,-1,13,4,dk('#ffd84a'));star(0,-42,4,'#ffe36a')}
  if(sp==='chicken'){R(-22,-34,44,30,dk('#e8c070'));for(let i=-20;i<22;i+=6)R(i,-34,1,30,dk('#c89a50'));g.fillStyle=dk('#c0402a');g.beginPath();g.moveTo(-27,-32);g.lineTo(0,-52);g.lineTo(27,-32);g.fill();
    R(-20,-4,3,4,'#7a5030');R(17,-4,3,4,'#7a5030');RR(-6,-24,12,14,6,'#3a2020');g.strokeStyle=dk('#a0a0a0');g.lineWidth=1.5;g.beginPath();g.moveTo(6,-10);g.lineTo(20,0);g.stroke()}
  if(sp==='pig'){E(0,-2,32,6,dk('#7a5030'));RR(-24,-28,34,24,2,dk('#d8a070'));R(-26,-32,38,5,dk('#8a5a3a'));RR(-10,-20,10,16,3,'#3a2020');
    for(let i=-30;i<34;i+=8)R(i,-12,3,12,dk('#b08050'));R(-30,-10,64,2,dk('#b08050'))}
  if(sp==='horse'){RR(-26,-40,52,40,3,dk('#c89050'));g.fillStyle=dk('#8a5030');g.beginPath();g.moveTo(-30,-38);g.lineTo(0,-62);g.lineTo(30,-38);g.fill();RR(-8,-26,16,26,2,'#3a2020');R(-28,-18,8,18,dk('#a07040'));R(20,-18,8,18,dk('#a07040'))}
  if(sp==='rabbit'){RR(-18,-28,36,28,6,dk('#e8d8b0'));R(-20,-30,40,6,dk('#7a9a50'));RR(-6,-18,12,14,4,'#3a2020');E(-14,-8,5,4,dk('#fff0'));E(14,-8,5,4,dk('#fff0'))}
  if(sp==='sheep'){R(-24,-30,48,30,dk('#e8dcc0'));for(let i=-22;i<24;i+=6)R(i,-30,1,30,dk('#c8b890'));g.fillStyle=dk('#5a7a9a');g.beginPath();g.moveTo(-28,-28);g.lineTo(0,-46);g.lineTo(28,-28);g.fill();RR(-8,-20,16,20,2,'#3a2020')}
  if(name){RR(-15,-30+(sp==='pig'?-8:sp==='horse'?-12:0),30,9,3,'#fff8');txt(name.slice(0,6),0,-23+(sp==='pig'?-8:sp==='horse'?-12:0),'#5b4b8a',6)}
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
  R(0,0,W,22,'#2b2440cc');txt('FARM MAP',8,15,'#fff',10,'left');txt('● '+petList().reduce((a,p)=>a+(p.coins||0),0),W-8,15,'#ffd84a',9,'right');
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
