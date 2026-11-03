// ===== animals.js — dog art, egg, food/toy icons =====
// ===== dog art =====
function dog(cx,cy,bid,stage,o={}){if(BREEDS[bid]&&BREEDS[bid].sp)return critter(cx,cy,BREEDS[bid].sp,stage,Object.assign({sv:bid},o));
  if(IMG['dog_'+bid]&&IMG['dog_'+bid].naturalWidth&&!o.oldArt)return critter(cx,cy,'dog_'+bid,stage,o); // v52 plastic-toy puppy sprites
  const B=BREEDS[bid]||BREEDS.lab,T=ui.anim,pose=o.pose||'idle',coat=o.coat||0,mood=o.mood||'ok',plq=o.plaque||0,pt=o.pt||0;
  let c=B.c,d=B.d,l=B.l;const sen=stage==='senior';
  const sz={puppy:.62,youngster:.75,teen:.88,adult:1,senior:1}[stage]||1,hk={puppy:1.38,youngster:1.22,teen:1.1,adult:1,senior:1}[stage]||1;
  const lay=pose==='lay'||pose==='sleep'||pose==='roll',sit=pose==='sit'||pose==='poo';
  const bl=B.bl,bh=B.bh,L=B.leg*(stage==='puppy'?.85:1),hr=B.hr*hk;
  const fur=coat/100*B.fur*6,mat=coat>=TUNE.matAt,furC=mat?mix(c,'#6a5a48',.35):c;
  g.save();g.translate(cx,cy);E(0,1,bl*sz*1.35,4*sz,'#0003');
  let dy=0,rot=0,sx=1;
  if(pose==='hop'||pose==='happy')dy=-Math.abs(Math.sin(T/6))*14;
  if(pose==='dance'){rot=Math.sin(T/6)*.18;dy=-Math.abs(Math.sin(T/6))*8}
  if(pose==='twirl')sx=Math.cos(T/5);
  if(pose==='trot')dy=-Math.abs(Math.sin(T/3))*3;
  if(pose==='walk')dy=-Math.abs(Math.sin(T/6))*1.5;
  g.translate(0,dy);g.scale(sz*sx*(o.dir||1),sz);
  const walk=pose==='walk'||pose==='trot'||pose==='play',sw=walk?Math.sin(T/(pose==='trot'?3:6))*.45:0;
  let R0,F0;const st=-(L+bh*.7);
  if(sit){R0=[-bl*.45,-bh*.9];F0=[bl*.45,-(L+bh*.95)]}else if(lay){R0=[-bl*.6,-bh*.85];F0=[bl*.6,-bh*.85]}
  else if(pose==='play'||pose==='sniff'){R0=[-bl*.6,st-2];F0=[bl*.6,st+L*.35]}else{R0=[-bl*.6,st];F0=[bl*.6,st]}
  if(pose==='roll'){const p=(pt%60)/60;g.translate(0,-bh);g.rotate(p*Math.PI*2);g.translate(0,bh)}
  if(rot)g.rotate(rot);
  const mx=(R0[0]+F0[0])/2,my=(R0[1]+F0[1])/2,ang=Math.atan2(F0[1]-R0[1],F0[0]-R0[0]),rx=Math.hypot(F0[0]-R0[0],F0[1]-R0[1])/2+bh*.75;
  const wag=Math.sin(T/(mood==='happy'||pose==='play'?2.2:7))*(mood==='sad'?.12:1);
  const paw=mix(d,'#000000',.15),legC=B.white?l:d,legFar=mix(legC,'#000000',.18);
  function leg(x,y,a,col,len){g.save();g.translate(x,y);g.rotate(a);RR(-3.2,-2,6.4,len+2,3.2,col);E(1.5,len,4.6,2.8,B.white?mix(l,'#000000',.08):paw);g.restore()}
  // far legs
  if(!lay){const fy=F0[1]+bh*.3;leg(F0[0]-3,fy,-sw,legFar,-fy);if(!sit){const ry=R0[1]+bh*.3;leg(R0[0]-3,ry,sw,legFar,-ry)}}
  // tail
  tailDraw(R0[0]-bh*.5,R0[1]-bh*.35,B,sit?c:(B.saddle?d:c),wag,sit);
  // body + coat
  if(fur>1){const n=14;for(let i=0;i<n;i++){const th=i/n*Math.PI*2,px=Math.cos(th)*rx,py=Math.sin(th)*bh;
      const xx=mx+px*Math.cos(ang)-py*Math.sin(ang),yy=my+px*Math.sin(ang)+py*Math.cos(ang),ex=Math.cos(th)*fur*.5,ey=Math.sin(th)*fur*.6+(py>0?fur*.5:0);
      if(B.curly)E(xx+ex,yy+ey,2+fur*.45,2+fur*.45,furC);else E(xx+ex,yy+ey,1.6+fur*.3,2+fur*.55,furC,th)}}
  E(mx,my,rx,bh,c,ang);
  if(B.saddle)E(mx-2,my-bh*.35,rx*.72,bh*.6,d,ang);
  if(B.white)E(mx+3,my+bh*.45,rx*.72,bh*.45,l,ang);
  if(B.mask)E(mx+bh*.2,my+bh*.4,rx*.5,bh*.35,mix(c,'#ffffff',.3),ang);
  if(mat)[[-.5,-.6],[.1,-.85],[.55,-.4],[-.2,.6],[.4,.55]].forEach(([a,b2],i)=>{const xx=mx+a*rx,yy=my+b2*bh;E(xx,yy,3.4,3,'#6a5236');g.strokeStyle='#3a2a1a';g.lineWidth=.8;g.beginPath();g.arc(xx,yy,2,i,i+4);g.stroke()});
  // near legs
  if(lay){E(F0[0]+bh*.5,-3,8,3.2,legC);E(F0[0]+bh*.2,-2,8,3,mix(legC,'#000000',.05));E(R0[0]+2,-4,bh*.85,bh*.6,c);E(R0[0]+bh*.6,-2,6,2.6,legC)}
  else if(sit){const fy=F0[1]+bh*.3;leg(F0[0]+2,fy,0,legC,-fy);E(R0[0],R0[1]+2,bh*.85,bh*.75,c);E(R0[0]+bh*.6,-2.5,6,3,B.white?l:paw)}
  else{const fy=F0[1]+bh*.3,ry=R0[1]+bh*.3;leg(F0[0]+2,fy,sw,legC,-fy);leg(R0[0]+2,ry,pose==='wee'?-1.2:-sw,legC,-ry)}
  // head
  let hx=F0[0]+bl*.35,hy=F0[1]-bh*.85-hr*.55;
  if(lay){hx=F0[0]+bl*.45;hy=-hr*.9-bh*.4}if(pose==='sleep'){hx=F0[0]+bl*.55;hy=-hr*.75}
  if(pose==='eat'||pose==='sniff'||pose==='play'){hx=F0[0]+bl*.5;hy=F0[1]+(pose==='eat'?Math.abs(Math.sin(T/5))*4:pose==='sniff'?Math.sin(T/4)*2:0)}
  g.strokeStyle=c;g.lineCap='round';g.lineWidth=hr*1.1;g.beginPath();g.moveTo(F0[0],F0[1]-bh*.2);g.lineTo(hx-hr*.3,hy+hr*.3);g.stroke();
  // collar
  g.strokeStyle='#e8405a';g.lineWidth=3;g.beginPath();const cxp=(F0[0]+hx)/2+hr*.1,cyp=(F0[1]+hy)/2+hr*.15;g.moveTo(cxp-hr*.5,cyp-hr*.35);g.lineTo(cxp+hr*.2,cyp+hr*.45);g.stroke();E(cxp+hr*.15,cyp+hr*.65,1.8,1.8,'#ffd84a');
  g.save();g.translate(hx,hy);
  const ec=B.earC||d,sl=B.sn*(stage==='puppy'?.6:stage==='youngster'?.8:1);
  if(B.ear==='pointy'||B.ear==='semi'||B.ear==='bat'){const big=B.ear==='bat'?1.25:B.ear==='semi'?.9:1.1;
    g.fillStyle=B.ear==='bat'?c:ec==='#3e4452'?c:c;g.beginPath();g.moveTo(-hr*.7,-hr*.45);g.lineTo(-hr*.25,-hr*(1+big*.7));g.lineTo(hr*.2,-hr*.6);g.fill();
    g.fillStyle='#f2a8b8';g.beginPath();g.moveTo(-hr*.5,-hr*.5);g.lineTo(-hr*.25,-hr*(.9+big*.6));g.lineTo(hr*.05,-hr*.62);g.fill();
    if(B.ear==='semi')E(-hr*.12,-hr*1.45,hr*.3,hr*.18,ec,.5)}
  if(B.ear==='pom')E(0,-hr*.85,hr*.65*(1+coat/200),hr*.45*(1+coat/200),l);
  E(0,0,hr,hr*.92,c);
  if(B.white&&bid==='husky'){E(hr*.25,hr*.35,hr*.75,hr*.5,l);E(hr*.35,-hr*.45,2.2,1.5,l)}
  if(B.white&&bid!=='husky')E(hr*.35,-hr*.25,hr*.16,hr*.6,l,-.7);
  const muz=B.mask?d:B.white?l:mix(c,'#ffffff',.25);
  E(hr*.6+sl*.45,hr*.32,sl*.6+3.5,hr*.42,muz);if(sen)E(hr*.6+sl*.45,hr*.32,sl*.6+3.5,hr*.42,'#d8d8d8aa');
  E(hr*.62+sl,hr*.12,2.8,2.3,'#1e1818');E(hr*.62+sl-.8,hr*.02,1,.7,'#ffffff88');
  // mouth / teeth / tongue
  const open=(mood==='happy'||pose==='happy'||pose==='play'||pose==='smile'||pose==='trot'||pose==='dance')&&pose!=='sleep',eat=pose==='eat'&&T%20<10;
  const mx2=hr*.5+sl*.5,my2=hr*.62;
  if(open||eat){E(mx2,my2,sl*.45+2,2.6,'#6a2030');const tc=mix('#ffffff','#c9a23a',Math.min(1,plq/90));R(mx2-sl*.35,my2-2.4,sl*.7+1,1.6,tc);if(!eat)E(mx2+1,my2+2.4,2.6,3,'#ff7d9a')}
  else{g.strokeStyle='#2b2020';g.lineWidth=1;g.beginPath();if(mood==='sad')g.arc(mx2,my2+2.5,2.5,Math.PI+.5,-.5);else{g.moveTo(mx2-sl*.4,my2);g.lineTo(mx2+sl*.4,my2-.6)}g.stroke()}
  // eye
  const ex=hr*.25,ey=-hr*.15,blink=ui.anim%170<6||pose==='sleep';
  if(blink){g.strokeStyle='#2b2020';g.lineWidth=1.4;g.beginPath();g.arc(ex,ey,2.4,.2,Math.PI-.2);g.stroke()}
  else if(pose==='happy'){g.strokeStyle='#2b2020';g.lineWidth=1.5;g.beginPath();g.arc(ex,ey+1.5,2.4,Math.PI+.3,-.3);g.stroke()}
  else{E(ex,ey,2.5*hk,2.8*hk,B.eye||'#2b2020');if(B.eye)E(ex+.3,ey,1.2,1.4,'#1a1a2a');E(ex+.9,ey-1,1,1,'#fff')}
  if(sen){g.strokeStyle='#e8e8e8';g.lineWidth=1.2;g.beginPath();g.moveTo(ex-3,ey-4);g.lineTo(ex+3,ey-4.5);g.stroke()}
  E(hr*.3,hr*.45,2.5,1.5,'#ff9ab088');
  if(mood==='sad'&&pose!=='sleep'&&ui.anim%90<60)E(ex+1,ey+5+(ui.anim%60)/12,1.3,2,'#5ab0ff');
  // ears that hang go on top
  if(B.ear==='flop')E(-hr*.3,hr*.05,hr*.36,hr*.72,ec,.25);
  if(B.ear==='long')E(-hr*.25,hr*.4,hr*.38,hr*.95,ec,.12);
  if(B.ear==='pom'){for(let i=0;i<4;i++)E(-hr*.3+(i%2)*2,hr*.1+i*hr*.28,hr*.3*(1+coat/150),hr*.3*(1+coat/150),l)}
  if(fur>2.5&&!B.curly)for(let i=0;i<4;i++)E(-hr*.6+i*hr*.35,-hr*.85,1.5+fur*.2,2+fur*.3,furC,-.4+i*.25);
  g.restore();
  if(plq>=TUNE.plaqueBad&&ui.anim%80<50){g.strokeStyle='#8ac24a';g.lineWidth=1;for(let i=0;i<2;i++){g.beginPath();g.moveTo(hx+hr+4+i*3,hy+hr*.3);g.quadraticCurveTo(hx+hr+8+i*3,hy-2,hx+hr+5+i*3,hy-6);g.stroke()}}
  g.restore()}
function tailDraw(tx,ty,B,c,wag,sit){g.lineCap='round';const k=B.tail;if(k==='stub'){E(tx+1,ty,3.5,3,c);return}
  let a,len,w;if(k==='otter'){a=-2.5+wag*.35;len=15;w=5}else if(k==='whip'){a=-2.0+wag*.45;len=14;w=3}else if(k==='plume'){a=2.6+wag*.3;len=16;w=6}else if(k==='curl'){a=-1.6;len=11;w=5}else{a=-2.1+wag*.4;len=12;w=2.5}
  if(sit)a=3.0;const ex=tx+Math.cos(a)*len,ey=ty+Math.sin(a)*len;g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(tx,ty);
  let fx=ex,fy=ey;if(k==='curl'&&!sit){fx=tx+8+wag*2;fy=ty-12;g.quadraticCurveTo(tx-8,ty-16,fx,fy)}else g.quadraticCurveTo((tx+ex)/2-2,(ty+ey)/2+(k==='plume'?-3:3),ex,ey);g.stroke();
  if(k==='pom')E(fx,fy,5,5,B.l);if(B.white&&k!=='pom')E(fx,fy,w*.6,w*.6,B.l)}
function egg(cx,cy,spot,shake,cracks,grey){const o=shake?Math.sin(ui.anim*1.3)*3:0;g.save();g.translate(cx,cy);g.rotate(o*.03);
  E(0,30,22,5,'#0003');const gr=g.createRadialGradient(-6,-10,4,0,0,34);gr.addColorStop(0,grey?'#d8d8e0':'#fffef8');gr.addColorStop(1,grey?'#a0a0b0':'#ecdcc0');
  g.fillStyle=gr;g.beginPath();g.ellipse(0,2,22,28,0,0,7);g.fill();
  [[-8,-6,5],[9,4,4],[-3,14,4.5],[8,-14,3],[-12,8,3]].forEach(([x,y,r])=>E(x,y,r,r*.8,(grey?'#8888a0':spot)+'aa'));
  g.strokeStyle='#5a4a3a';g.lineWidth=1.5;const cr=[[-14,-2,-8,-6,-4,0,2,-5],[2,-5,7,1,12,-4,16,0],[-10,10,-4,6,2,11,8,6]];
  for(let i=0;i<Math.min(cracks,6);i++){const a=cr[i%3];g.beginPath();g.moveTo(a[0],a[1]+(i>2?8:0));for(let j=2;j<8;j+=2)g.lineTo(a[j],a[j+1]+(i>2?8:0));g.stroke()}
  g.restore()}
function lock(x,y){RR(x-7,y-2,14,11,3,'#5b4b8a');g.strokeStyle='#5b4b8a';g.lineWidth=2.5;g.beginPath();g.arc(x,y-2,4.5,Math.PI,0);g.stroke();E(x,y+3,1.6,1.6,'#ffe36a')}
function foodIcon(id,x,y,s=1){g.save();g.translate(x,y);g.scale(s,s);
  const bowl=c=>{E(0,5,11,4,'#2b6cc4');R(-11,1,22,4,'#3a86e8');E(0,1,11,3,c)};
  if(id==='kibble'){bowl('#a6683a');[[-5,0],[-1,-1],[3,0],[6,1],[-3,1.5],[1,1.5]].forEach(([a,b],i)=>E(a,b-1,2.3,1.6,i%2?'#8a5030':'#b97a44'))}
  if(id==='wet'){bowl('#8a4a2a');E(-3,-1,3,1.5,'#a85a3a');E(3,0,3,1.5,'#7a3a20');E(0,-2,2,1,'#c87a5a')}
  if(id==='chicken'){E(-1,1,8,6,'#e8a060');E(-2,-1,5,3,'#f8c890');R(5,-1,6,2.4,'#f4ead8');E(11,-2,2,2,'#f4ead8');E(11,1,2,2,'#f4ead8')}
  if(id==='salmon'){E(0,1,10,5,'#ff8a6a');for(let i=-6;i<=6;i+=3){g.strokeStyle='#ffd0c0';g.lineWidth=1;g.beginPath();g.moveTo(i,-3);g.lineTo(i+2,5);g.stroke()}}
  if(id==='biscuit'){R(-7,-2,14,5,'#d9a05b');[[-8,-3],[-8,3],[8,-3],[8,3]].forEach(([a,b])=>E(a,b,3.5,3.5,'#d9a05b'));E(0,0,3,1.5,'#8a5020')}
  if(id==='dental'){g.save();g.rotate(-.5);RR(-10,-2.5,20,5,2.5,'#6fd08a');for(let i=-8;i<9;i+=4)R(i,-2.5,1.4,5,'#4aa868');g.restore()}
  if(id==='catbisc'){bowl('#c88a50');[[-5,0],[0,-1],[5,0],[-2,1]].forEach(([a,b])=>{g.fillStyle='#e8a060';g.beginPath();g.moveTo(a-2,b+1);g.lineTo(a,b-2);g.lineTo(a+2,b+1);g.fill()})}
  if(id==='corn'){E(0,0,4,9,'#ffd84a');for(let i=-6;i<7;i+=3)R(-3,i,6,1,'#e8b020');E(-4,3,3,7,'#7ac04a',.3);E(4,3,3,7,'#7ac04a',-.3)}
  if(id==='grain'){bowl('#e8c070');[[-5,-1],[-1,0],[3,-1],[6,0],[-3,1],[1,1]].forEach(([a,b],i)=>E(a,b-1,1.4,1,i%2?'#c09040':'#f0d890'))}
  if(id==='worms'){bowl('#8a6038');g.strokeStyle='#e8b080';g.lineWidth=2;[-5,0,5].forEach(a=>{g.beginPath();g.moveTo(a-3,0);g.quadraticCurveTo(a,-4,a+3,0);g.stroke()})}
  if(id==='greens'){E(-3,0,6,4,'#5ac04a',.4);E(3,-1,6,4,'#7ad05a',-.4);E(0,2,5,3,'#4aa83a')}
  if(id==='slop'){E(0,5,12,4,'#7a7a8a');R(-12,0,24,5,'#9a9aaa');E(0,0,12,3,'#a07040');E(-4,-1,2,1,'#c09060');E(3,0,2,1,'#c09060')}
  if(id==='apple'){E(0,1,7,7,'#e83a3a');E(-2,-1,2,2,'#ff8a8a');R(-.5,-9,1.5,4,'#7a5030');E(3,-7,3,1.5,'#5ac04a',-.4)}
  if(id==='veg'){E(-4,1,5,4,'#7ad05a');E(4,0,4,4,'#ff9a3a');E(0,3,4,3,'#c84a8a')}
  if(id==='hay'){R(-9,-5,18,11,'#e8c860');R(-9,-5,18,2,'#f8e090');for(let i=-8;i<9;i+=3)R(i,-3,1,8,'#c8a040');R(-9,-1,18,1,'#a06830');R(-9,3,18,1,'#a06830')}
  if(id==='carrot'){g.fillStyle='#f38a24';g.beginPath();g.moveTo(-3,-5);g.lineTo(3,-5);g.lineTo(0,9);g.fill();E(-2,-7,2,4,'#4caf50',-.4);E(2,-7,2,4,'#4caf50',.4)}
  g.restore()}
function toyIcon(id,x,y,s=1){g.save();g.translate(x,y);g.scale(s,s);
  if(id==='ball'){E(0,0,7,7,'#c8e83a');g.strokeStyle='#fff';g.lineWidth=1.3;g.beginPath();g.arc(-7,0,6,-.9,.9);g.stroke();g.beginPath();g.arc(7,0,6,Math.PI-.9,Math.PI+.9);g.stroke()}
  if(id==='squeak'){R(-7,-2,14,4,'#ff6fa8');[[-8,-3],[-8,3],[8,-3],[8,3]].forEach(([a,b])=>E(a,b,3.4,3.4,'#ff6fa8'))}
  if(id==='rope'){g.lineCap='round';g.strokeStyle='#e44';g.lineWidth=4;g.beginPath();g.moveTo(-9,0);g.lineTo(9,0);g.stroke();g.strokeStyle='#fff';g.setLineDash([3,3]);g.beginPath();g.moveTo(-9,0);g.lineTo(9,0);g.stroke();g.setLineDash([]);E(-10,0,3,4,'#4a8ae8');E(10,0,3,4,'#4a8ae8')}
  if(id==='frisbee'){E(0,0,10,4,'#5ab0ff');E(0,-1,7,2.4,'#8ad0ff')}
  if(id==='duck'){E(0,2,7,5,'#ffd84a');E(4,-4,4,4,'#ffd84a');E(8,-3,3,1.5,'#ff9a2a');E(5,-5,.9,.9,'#222')}
  g.restore()}
