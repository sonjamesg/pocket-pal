// ===== critters.js — cat / chicken / pig / horse / rabbit art =====
// ===== critters (cat / chicken / pig) =====
function critter(cx,cy,sp,stage,o){const T=ui.anim,pose=o.pose||'idle',mood=o.mood||'ok';const sz={puppy:.6,youngster:.74,teen:.87,adult:1,senior:1}[stage]||1;
  if(IMG[sp]&&IMG[sp].naturalWidth){const sleep=pose==='sleep'||pose==='lay'||pose==='nap';let dy=0;if(pose==='hop'||pose==='happy')dy=-Math.abs(Math.sin(T/6))*10;if(pose==='walk'||pose==='play')dy=-Math.abs(Math.sin(T/5))*2;const im=IMG[sp],iw=im.naturalWidth,ih=im.naturalHeight,sc=28*sz/Math.max(iw,ih);g.save();g.translate(cx,cy+dy);g.scale((o.dir||1)*sc,sc);if(pose==='roll')g.rotate(Math.sin(T/8)*.5);g.imageSmoothingEnabled=false;g.drawImage(im,-iw/2,-ih+(sleep?4:0));g.restore();return}
  const sleep=pose==='sleep'||pose==='lay'||pose==='nap',eat=pose==='eat'||pose==='sniff';
  let dy=0;if(pose==='hop'||pose==='happy')dy=-Math.abs(Math.sin(T/6))*12;if(pose==='walk'||pose==='trot'||pose==='play')dy=-Math.abs(Math.sin(T/5))*2;
  g.save();g.translate(cx,cy);E(0,1,20*sz,4*sz,'#0003');g.translate(0,dy);g.scale(sz*(o.dir||1),sz);if(pose==='roll')g.rotate(Math.sin(T/8)*.6);
  const sw=(pose==='walk'||pose==='trot'||pose==='play')?Math.sin(T/5)*3:0,blink=T%170<6||sleep;
  const eye=(x,y,r=2.2)=>{if(blink){g.strokeStyle='#2b2020';g.lineWidth=1.3;g.beginPath();g.arc(x,y,r,.2,Math.PI-.2);g.stroke()}else{E(x,y,r,r*1.15,'#2b2020');E(x+.7,y-.8,.8,.8,'#fff')}};
  if(sp==='cat'){const c='#f0a050',d='#c07030';const by=sleep?-8:-16;
    // tail
    g.strokeStyle=c;g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(-14,by);g.quadraticCurveTo(-26,by-6+Math.sin(T/12)*4,-22,by-20);g.stroke();
    if(!sleep){[[-10,0],[-4,0],[8,0],[13,0]].forEach(([x],i)=>RR(x-2,by+4,4,-by-3+(i%2?sw:-sw)*.3,2,i<2?d:c))}
    E(0,by,17,sleep?8:10,c);for(let i=-8;i<12;i+=6)R(i,by-9,2,6,d);E(4,by+5,10,4,'#fff4e6');
    const hx=sleep?16:14,hy=sleep?-10:by-12+(eat?8:0);
    g.fillStyle=c;[[-7,-1],[3,1]].forEach(([a])=>{g.beginPath();g.moveTo(hx+a-1,hy-6);g.lineTo(hx+a+2,hy-16);g.lineTo(hx+a+6,hy-6);g.fill()});
    E(hx,hy,10,9,c);E(hx+4,hy+3,5,3.5,'#fff4e6');E(hx+6,hy+1.5,1.4,1,'#ff8aa0');eye(hx-1,hy-2);eye(hx+5,hy-2,1.8);
    g.strokeStyle='#5a4030';g.lineWidth=.6;for(const k of [-1,1]){g.beginPath();g.moveTo(hx+7,hy+3);g.lineTo(hx+15,hy+3+k*2);g.stroke()}}
  if(sp==='chicken'){const peck=eat?Math.abs(Math.sin(T/4))*8:0;
    if(!sleep){g.strokeStyle='#f0a020';g.lineWidth=2;[[-3,sw],[3,-sw]].forEach(([x,s])=>{g.beginPath();g.moveTo(x,-8);g.lineTo(x+s*.4,0);g.lineTo(x+s*.4+3,0);g.stroke()})}
    const by=sleep?-9:-16;E(-12,by-4,6,8,'#f0e8d8',-.5);E(0,by,13,11,'#fff8ec');E(-2,by+1,7,5,'#efe2cc',.3);
    const hx=9,hy=by-12+peck;E(hx,hy,7,7,'#fff8ec');[0,3,6].forEach(i=>E(hx-3+i,hy-7,2,2.6,'#e83a3a'));
    g.fillStyle='#f0a020';g.beginPath();g.moveTo(hx+6,hy-1);g.lineTo(hx+11,hy+1);g.lineTo(hx+6,hy+3);g.fill();E(hx+6,hy+5,1.6,2.4,'#e83a3a');eye(hx+2,hy-1,1.6)}
  if(sp==='pig'){const c='#ffb0c0',d='#e88aa0',by=sleep?-9:-15;
    g.strokeStyle=d;g.lineWidth=2;g.beginPath();g.arc(-21,by-3,3,0,Math.PI*1.6+Math.sin(T/6));g.stroke();
    if(!sleep)[[-12,1],[-6,-1],[8,1],[13,-1]].forEach(([x,s])=>RR(x-2.5,by+6,5,-by-5+s*sw*.3,2,d));
    E(0,by,21,12,c);if(o.coat>0||S.species==='pig'&&(S.dirt||0)>0)E(-6,by+6,8,4,'#7a5030aa');
    const hx=18,hy=by-2+(eat?6:0);E(hx,hy,11,10,c);g.fillStyle=d;g.beginPath();g.moveTo(hx-6,hy-7);g.lineTo(hx-2,hy-15);g.lineTo(hx+1,hy-7);g.fill();
    E(hx+9,hy+2,4,4.5,d);E(hx+8,hy+1,.9,1.3,'#7a3a4a');E(hx+10.5,hy+1,.9,1.3,'#7a3a4a');eye(hx+2,hy-3,1.8);
    if(mood==='happy'||pose==='happy'){g.strokeStyle='#7a3a4a';g.lineWidth=1;g.beginPath();g.arc(hx+5,hy+5,2.5,.2,Math.PI-.4);g.stroke()}}
  if(sp==='horse'){const c='#8c5a32',d='#5a3a20',by=sleep?-10:-18;
    if(!sleep)[[-10,1],[-4,-1],[6,1],[12,-1]].forEach(([x,s])=>RR(x-2,by+6,4,-by-4+s*sw*.3,2,d));
    E(0,by,18,11,c);g.strokeStyle=d;g.lineWidth=3;g.beginPath();g.moveTo(-18,by-2);g.quadraticCurveTo(-28,by+4,-24,by+10);g.stroke();
    const hx=16,hy=by-10+(eat?6:0);R(hx-2,hy,6,12,c);E(hx+6,hy-2,9,7,c);E(hx+10,hy-1,3,2.5,d);eye(hx+4,hy-3,1.6);R(hx-1,hy-8,2,8,'#3a2818')}
  if(sp==='rabbit'){const c='#dcdce6',d='#b0b0c0',by=sleep?-8:-14;
    if(!sleep)[[-6,sw],[-2,-sw],[6,sw],[10,-sw]].forEach(([x,s])=>RR(x-1.5,by+4,3,-by-3+s*.2,1.5,d));
    E(0,by,12,9,c);E(-10,by+1,4,4,'#fff');const hx=10,hy=by-6+(eat?5:0);
    [[-2,0],[3,0]].forEach(([a])=>{g.fillStyle=c;g.beginPath();g.moveTo(hx+a,hy-2);g.lineTo(hx+a-1,hy-18);g.lineTo(hx+a+3,hy-2);g.fill();E(hx+a+1,hy-10,1.2,5,'#ffb0c0')});
    E(hx,hy,8,7,c);eye(hx-1,hy-1,1.5);eye(hx+3,hy-1,1.5);E(hx+2,hy+2,1.5,1,'#ff90a8')}
  if(mood==='sad'&&!sleep&&T%90<60)E(cx?0:0,-30,0,0,'#0000');
  g.restore()}
