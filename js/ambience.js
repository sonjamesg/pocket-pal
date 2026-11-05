// ===== ambience.js — v50 cooler pass: lighter tilt-shift, day/night + golden hour, window glow,
// ambient life (butterflies, leaves, chimney smoke, pecking chickens), door mats/shadows, chunky HUD chrome
const AMB={bf:[],lf:[],sm:[]};
function dayPhase(){const q=/[?&]hour=([\d.]+)/.exec(location.search)||/[?&]hour=([\d.]+)/.exec((parent&&parent.location&&parent.location.search)||'');if(q)return +q[1];const d=new Date(),h=d.getHours()+d.getMinutes()/60;return h} // real local clock
function skyTint(h){ // [r,g,b,a]
  if(h>=7&&h<17)return null;if(h>=17&&h<19.5)return[255,150,50,.26*(1-Math.abs(h-18.25)/1.25)+.12];
  if(h>=5.5&&h<7)return[255,190,120,.12];if(h>=19.5&&h<21)return[90,60,160,.3];return[30,40,110,.36]}
const isDusk=h=>h>=18||h<6.5;
function owExtras2(t,o){if(CUR!=='ranch')return;
  if(MAP_LAYOUT.pond&&IMG.pond&&IMG.pond.naturalWidth){const [qx,qy]=MAP_LAYOUT.pond;g.drawImage(IMG.pond,qx*TS,qy*TS)}
  // door shadows + welcome mats on each doorstep
  const mat=(X,Y,w)=>{R(X-w/2,Y-3,w,3,'#0a281440');RR(X-w/2+1,Y+1,w-2,6,2,'#c0503a','#6a2a1a');for(let i=X-w/2+4;i<X+w/2-3;i+=3)R(i,Y+3,1,2,'#f0c070')};
  for(const [bx,by,bw,bh] of BARNS)mat(bx*TS+bw*8,(by+bh)*TS+8,bw%2?14:22);mat(HOME[0]*TS+24,(HOME[1]+2)*TS+2,14);
  // chickens pecking in the run beside the coop
  const coop=BARNS.find(b=>b[4]==='coop');if(coop)for(let i=0;i<3;i++){const X=(coop[0]-2)*TS+40+i*22+Math.sin(t/90+i*2)*6,Y=(coop[1]+coop[3]+3)*TS+6+i*5,pk=((t/12+i*7)|0)%20<4;
    p3later(X,Y+6,()=>{E(X,Y+6,5,2,'#0003');E(X,Y+1,5,4,i===1?'#a0582a':'#fff8ee');E(X+(pk?4:3),Y-(pk?-1:3),3,3,i===1?'#a0582a':'#fff8ee');R(X+(pk?6:5),Y-(pk?-1:3),2,1,'#f0a020');R(X+(pk?4:3),Y-(pk?1:5),2,1,'#e03030')})}}
function ambienceWorld(t){if(CUR==='int'||CUR==='shop')return;const [ccx,ccy]=CAMC,L=ccx-W/2,T=ccy-H/2,h=dayPhase();
  if(CUR==='ranch'){ // chimney smoke from the farmhouse
    if(t%40===0)AMB.sm.push({x:HOME[0]*TS+34,y:HOME[1]*TS-30,a:1});
    AMB.sm=AMB.sm.filter(s=>(s.y-=.25,s.x+=.12,s.a-=.006)>0);AMB.sm.forEach(s=>{g.globalAlpha=s.a*.6;E(s.x,s.y,4+(1-s.a)*6,3+(1-s.a)*5,'#f4f4f4');g.globalAlpha=1});
    if(isDusk(h)){g.globalCompositeOperation='lighter';const glow=(X,Y)=>{const gr=g.createRadialGradient(X,Y,1,X,Y,14);gr.addColorStop(0,'rgba(255,200,90,.55)');gr.addColorStop(1,'rgba(255,200,90,0)');g.fillStyle=gr;g.fillRect(X-14,Y-14,28,28)};
      for(const [bx,by,bw,bh] of BARNS){glow(bx*TS+bw*4,(by+bh)*TS-20);glow(bx*TS+bw*12,(by+bh)*TS-20)}glow(HOME[0]*TS+12,(HOME[1]+2)*TS-18);glow(HOME[0]*TS+36,(HOME[1]+2)*TS-18);g.globalCompositeOperation='source-over'}}
  // butterflies (day) / fireflies (night)
  while(AMB.bf.length<5)AMB.bf.push({x:L+Math.random()*W,y:T+20+Math.random()*(H-40),p:Math.random()*9,c:['#ffe050','#ff8ac0','#9ad0ff','#fff'][AMB.bf.length%4]});
  AMB.bf.forEach(b=>{b.x+=Math.sin(t/50+b.p)*.5+.15;b.y+=Math.cos(t/37+b.p)*.4;if(b.x<L-20||b.x>L+W+20||b.y<T-20||b.y>T+H+20){b.x=L+Math.random()*W;b.y=T+20+Math.random()*(H-40)}
    if(isDusk(h)){g.globalAlpha=.5+.5*Math.sin(t/15+b.p);E(b.x,b.y,2,2,'#e8ff80');g.globalAlpha=1}else{const f=Math.abs(Math.sin(t/4+b.p))*3+1;E(b.x-f/2-1,b.y,f,2,b.c);E(b.x+f/2+1,b.y,f,2,b.c);R(b.x-.5,b.y-1,1,3,'#2b2440')}});
  // falling leaves drifting past
  if(AMB.lf.length<4&&Math.random()<.02)AMB.lf.push({x:L+Math.random()*W,y:T-6,p:Math.random()*9,c:['#e8a030','#d86030','#9ac040'][(Math.random()*3)|0]});
  AMB.lf=AMB.lf.filter(f=>(f.y+=.35,f.x+=Math.sin(t/30+f.p)*.5,f.y<T+H+8));AMB.lf.forEach(f=>{g.save();g.translate(f.x,f.y);g.rotate(Math.sin(t/20+f.p));E(0,0,3,1.6,f.c);g.restore()})}
// lighter tilt-shift (phones stay crisp) + sky tint
tiltShift=function(){const cv=g.canvas,k=cv.width/W;g.save();g.setTransform(1,0,0,1,0,0);
  if(g.filter!==undefined){[[0,14,.9],[H-12,12,.8]].forEach(([y,h,b])=>{g.filter='blur('+(b*k/2)+'px)';g.drawImage(cv,0,y*k,cv.width,h*k,0,y*k,cv.width,h*k)});g.filter='none'}
  let gr=g.createLinearGradient(0,0,0,cv.height);gr.addColorStop(0,'rgba(255,250,220,.08)');gr.addColorStop(.2,'rgba(255,250,220,0)');gr.addColorStop(.85,'rgba(20,30,60,0)');gr.addColorStop(1,'rgba(20,30,60,.07)');g.fillStyle=gr;g.fillRect(0,0,cv.width,cv.height);
  if(CUR!=='int'&&CUR!=='shop'){const s=skyTint(dayPhase());if(s){g.fillStyle='rgba('+s[0]+','+s[1]+','+s[2]+','+s[3]+')';g.fillRect(0,0,cv.width,cv.height)}}
  g.restore()};
{const _x=owExtras;owExtras=function(t,o){owExtras2(t,o);const r=_x(t,o);ambienceWorld(t);return r}}
// v123: no full-width PET FARM title strip during map play — compact wallet chip only (title stays on title/login)
{const _h=owHud;owHud=function(t){if(CUR!=='int'&&CUR!=='shop'){
  RR(W-58,2,54,12,5,'#ffe9a0','#b07a20');E(W-50,8,4,4,'#ffc820');E(W-50,8,2,2,'#fff6b0');txt(String(DB.wallet),W-8,11,'#6a4010',8,'right')}
  return _h(t)}}
