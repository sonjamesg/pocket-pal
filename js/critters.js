// ===== critters.js — cat / chicken / pig / horse / rabbit art =====
// ===== critters (cat / chicken / pig) =====
function critter(cx,cy,sp,stage,o){const T=ui.anim,pose=o.pose||'idle',mood=o.mood||'ok';const sz={puppy:.6,youngster:.74,teen:.87,adult:1,senior:1}[stage]||1;
  if(IMG[sp]&&IMG[sp].naturalWidth){const sleep=pose==='sleep'||pose==='lay'||pose==='nap';let dy=0;if(pose==='hop'||pose==='happy')dy=-Math.abs(Math.sin(T/6))*10;if(pose==='walk'||pose==='play')dy=-Math.abs(Math.sin(T/5))*2;const im=varImg(IMG[sp],o.sv),iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height,sc=28*sz/Math.max(iw,ih);g.save();g.translate(cx,cy+dy);g.scale((o.dir||1)*sc,sc);if(pose==='roll')g.rotate(Math.sin(T/8)*.5);g.imageSmoothingEnabled=false;g.drawImage(im,-iw/2,-ih+(sleep?4:0));g.restore();return}
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
  if(sp==='sheep'&&IMG.sheep0&&IMG.sheep0.naturalWidth){const wv=Math.max(0,Math.min(100,o.wool==null?60:o.wool)),st=wv<15?0:wv<50?1:wv<90?2:3,im=IMG['sheep'+st+(eat?'e':'')]||IMG['sheep'+st];
    g.scale(1.25,1.25);g.translate(-2,-im.height+2);g.imageSmoothingEnabled=false;g.drawImage(sheepTint(im,o.sv),-im.width/2+4,0);if(wv>=100&&T%60<30){star(-14,4,4,'#ffd84a');star(16,-2,3,'#fff6a0')}g.restore();return}
  if(sp==='sheep'){const wv=Math.max(0,Math.min(100,o.wool==null?60:o.wool))/100,by=sleep?-9:-15,fx=12+wv*7,fy=8+wv*5,wc=wv>.98?'#fffdf4':mix('#f0e6d0','#fffaf0',wv),fd=mix('#d8ccb0','#e8e0cc',wv),sk='#3a3440';
    if(!sleep)[[-9,sw],[-4,-sw],[6,sw],[11,-sw]].forEach(([x,s])=>RR(x-1.5,by+4,3,-by-3+s*.25,1.5,sk));
    E(0,by,fx,fy,fd);for(let i=0;i<9;i++){const a=i/9*Math.PI*2;E(Math.cos(a)*fx*.75,by+Math.sin(a)*fy*.7-1,3+wv*3,3+wv*3,wc)}E(-1,by-1,fx*.8,fy*.8,wc);
    if(wv<.15){E(0,by,fx*.9,fy*.9,'#f4dcc8');E(-2,by-2,4,2,'#fff0e0')}
    const hx=fx*.85,hy=by-6+(eat?6:0);E(hx-2,hy-6,4+wv*2,3+wv,wc);E(hx-5,hy-1,3,1.6,sk,-.4);E(hx+5,hy-1,3,1.6,sk,.4);E(hx,hy,5.5,6.5,sk);eye(hx-2,hy-1,1.3);eye(hx+2,hy-1,1.3);E(hx,hy+3,1.6,1,'#ff9ab0');
    if(wv>=1&&T%60<30){star(-fx+2,by-fy,3,'#ffd84a')}}
  if(mood==='sad'&&!sleep&&T%90<60)E(cx?0:0,-30,0,0,'#0000');
  g.restore()}

// v41 sheep colour types: recolour light wool pixels, cached
const _sheepC={};function sheepTint(im,sv){const T=typeof SHEEP_TYPES!=='undefined'&&SHEEP_TYPES.find(x=>x.id===sv);if(!T||(!T.f&&!T.spot))return im;
 const k=sv+im.src;if(_sheepC[k])return _sheepC[k];const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
 let d;try{d=x.getImageData(0,0,c.width,c.height)}catch(e){return im}const a=d.data,w=c.width;
 for(let i=0;i<a.length;i+=4){if(a[i+3]<10)continue;const r=a[i],gg=a[i+1],b=a[i+2],lum=(r+gg+b)/3;if(lum<150||Math.max(r,gg,b)-Math.min(r,gg,b)>60)continue;
  const p=i/4,px=p%w,py=(p/w)|0;
  if(T.spot){const cx=(px/7)|0,cy=(py/7)|0,dx=px-cx*7-3.5,dy=py-cy*7-3.5;if((cx*5+cy*3)%4===0&&dx*dx+dy*dy<9){a[i]=a[i+1]=60;a[i+2]=70}}
  else{a[i]=r*T.f[0];a[i+1]=gg*T.f[1];a[i+2]=b*T.f[2]}}
 x.putImageData(d,0,0);return _sheepC[k]=c}

// v43 cat / chicken colour types: palette swap the 16px sprite (cached)
const VAR_MAP={cat_tabby:{'232,160,72':[176,146,108],'200,120,48':[96,76,56]},cat_black:{'232,160,72':[64,62,78],'200,120,48':[40,40,54],'40,40,40':[240,206,60]},
 chicken_brown:{'245,245,240':[192,120,64],'220,220,210':[146,86,42]},chicken_rooster:{'245,245,240':[214,92,44],'220,220,210':[36,84,64]}};
const _varC={};function varImg(im,sv){const M=VAR_MAP[sv];if(!M||!im)return im;const k=sv+im.src;if(_varC[k])return _varC[k];
 const c=document.createElement('canvas');c.width=im.naturalWidth||im.width;c.height=im.naturalHeight||im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
 let d;try{d=x.getImageData(0,0,c.width,c.height)}catch(e){return im}const a=d.data;
 for(let i=0;i<a.length;i+=4){if(a[i+3]<10)continue;const m=M[a[i]+','+a[i+1]+','+a[i+2]];if(m){a[i]=m[0];a[i+1]=m[1];a[i+2]=m[2]}}
 x.putImageData(d,0,0);
 if(sv==='chicken_rooster'){x.fillStyle='#e8302a';x.fillRect(10,0,2,2);x.fillRect(9,1,1,1);x.fillRect(12,6,1,2);x.fillStyle='#1e4a3a';x.fillRect(1,3,2,3);x.fillRect(0,4,1,3);x.fillStyle='#e8a020';x.fillRect(10,5,1,1)}
 return _varC[k]=c}
// v43 COW (procedural, chunky): white / brown / black
const COW_COL={cow_white:['#fbf8f0','#2e2a2e','#f0b0b8'],cow_brown:['#a8683a','#f6efe4','#f0b0b8'],cow_black:['#34303a','#f6efe4','#e8a0b0']};
const _critC=critter;critter=function(cx,cy,sp,stage,o){if(sp!=='cow')return _critC(cx,cy,sp,stage,o);o=o||{};
 const T=ui.anim,pose=o.pose||'idle',sz={puppy:.6,youngster:.74,teen:.87,adult:1,senior:1}[stage]||1,[c,p,nose]=COW_COL[o.sv]||COW_COL.cow_white,sleep=pose==='sleep'||pose==='lay'||pose==='nap',eat=pose==='eat';
 let dy=0;if(pose==='happy'||pose==='hop')dy=-Math.abs(Math.sin(T/6))*6;const sw=(pose==='walk'||pose==='play')?Math.sin(T/5)*3:0,ol='#2b2020';
 g.save();g.translate(cx,cy);E(0,1,24*sz,4*sz,'#0003');g.translate(0,dy);g.scale(sz*(o.dir||1),sz);const by=sleep?-10:-20;
 if(!sleep)[[-14,sw],[-8,-sw],[8,sw],[14,-sw]].forEach(([x,s])=>{RR(x-3,by+6,6,-by-6+s*.3,2,c,ol);R(x-3,-3,6,3,'#3a2a20')});
 g.strokeStyle=ol;g.lineWidth=2;g.beginPath();g.moveTo(-21,by-4);g.quadraticCurveTo(-27,by+4+Math.sin(T/10)*2,-24,by+12);g.stroke();E(-24,by+13,2.5,3,ol);
 RR(-22,by-11,42,22,10,c,ol);E(-8,by-3,7,5,p);E(6,by+4,6,4,p);E(-14,by+6,4,3,p);E(2,by+9,5,2.5,'#f4b0c0');
 const hx=20,hy=by-10+(eat?8:0);E(hx-6,hy-8,4,2.5,c);E(hx+6,hy-8,4,2.5,c);R(hx-5,hy-13,2,4,'#f0e6c8');R(hx+3,hy-13,2,4,'#f0e6c8');
 RR(hx-8,hy-9,16,17,6,c,ol);E(hx-2,hy-4,3,3,p);RR(hx-7,hy+3,14,7,4,nose,ol);E(hx-3,hy+6,1.2,1.2,'#7a3a4a');E(hx+3,hy+6,1.2,1.2,'#7a3a4a');
 const bl=T%170<6||sleep;[-3,3].forEach(ex=>{if(bl){R(hx+ex-1.5,hy-2,3,1,ol)}else{E(hx+ex,hy-2,1.8,2.1,ol);E(hx+ex+.6,hy-2.8,.6,.6,'#fff')}});
 g.restore()};
