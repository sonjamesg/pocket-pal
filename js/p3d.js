// ===== p3d.js — v54 angled "Link's Awakening Switch" camera =====
// Raised, tilted camera (~35-40° down) with low-FOV perspective. Ground is drawn flat into a buffer, then
// re-projected row-by-row onto a tilted plane (far rows smaller + foreshortened). Upright things (buildings,
// trees, fences, player, furniture, back walls) are NOT warped: they're billboards placed at their projected
// foot point and scaled by depth, so you see their full fronts — the LA Switch "toy diorama" look.
let P3D=true;const P3={A:.5,c:.7,F:420,H0:H/2+8};let P3C=null;
function p3v(y){const d=y-P3.H0;return d/(P3.c+d/P3.F)}
function proj(wx,wy){const C=P3C;if(!C)return[wx,wy,1];const v=wy-C.camY,s=1/(1-v/P3.F);return[W/2+(wx-C.camX)*s,P3.H0+P3.c*v*s,s]}
// draw fn() in world coords, anchored + depth-scaled at world foot point (wx,wy). Must be called inside the world translate.
function withProj(wx,wy,fn){if(!P3D||!P3C)return fn();const [sx,sy,s]=proj(wx,wy);g.save();g.translate(sx+P3C.cx,sy+P3C.cy);g.scale(s,s);g.translate(-wx,-wy);try{fn()}finally{g.restore()}}
// begin the flat ground pass: returns tile bounds covering everything the tilted view can see
function p3dBegin(cx,cy){const camX=cx+W/2,camY=cy+P3.H0,vt=p3v(0),ox=camX-(W/2)/P3.A,oy=camY+vt-4;P3C={cx,cy,camX,camY,ox,oy};
  const k=g.canvas.width/W,kv=g.canvas.height/H;g.save();g.setTransform(k*P3.A,0,0,kv*P3.A,-ox*k*P3.A,-oy*kv*P3.A);
  return{x0:Math.floor(ox/TS)-1,x1:Math.ceil((ox+W/P3.A)/TS)+1,y0:Math.floor(oy/TS)-1,y1:Math.ceil((oy+H/P3.A)/TS)+1}}
let _p3buf=null;
function p3dWarp(sky){const cv=g.canvas,C=P3C;g.restore();if(!_p3buf)_p3buf=document.createElement('canvas');const b=_p3buf;if(b.width!==cv.width||b.height!==cv.height){b.width=cv.width;b.height=cv.height}
  const bx=b.getContext('2d');bx.setTransform(1,0,0,1,0,0);bx.clearRect(0,0,b.width,b.height);bx.drawImage(cv,0,0);
  const k=cv.width/W,kv=cv.height/H,A=P3.A;g.save();g.setTransform(1,0,0,1,0,0);g.fillStyle=sky||'#9ad8f0';g.fillRect(0,0,cv.width,cv.height);g.imageSmoothingEnabled=true;
  const step=Math.max(1,Math.round(kv));for(let Y=0;Y<cv.height;Y+=step){const y=Y/kv,v=p3v(y),v2=p3v(y+step/kv),s=1/(1-v/P3.F),hw=(W/2)/s;
    const sx=(C.camX-hw-C.ox)*A*k,sw=2*hw*A*k,sy=(C.camY+v-C.oy)*A*kv,sh=Math.max(.5,(v2-v)*A*kv);g.drawImage(b,sx,sy,sw,sh,0,Y,cv.width,step)}
  // soft distance haze toward the horizon (far = lighter / bluer)
  const gr=g.createLinearGradient(0,0,0,cv.height*.45);gr.addColorStop(0,'rgba(200,235,255,.35)');gr.addColorStop(1,'rgba(200,235,255,0)');g.fillStyle=gr;g.fillRect(0,0,cv.width,cv.height*.45);
  g.restore();g.imageSmoothingEnabled=false}
if(typeof LEAN!=='undefined'){LEAN.x=0;LEAN.y=0}   // perspective replaces the old lean shear
// smooth perspective side walls for rooms: one quad per side from the back wall (yFar) to the camera edge (yNear)
function p3SideWalls(xl,xr,yFar,yNear,h,col,trim){if(!P3D||!P3C)return;const C=P3C,pt=(x,y,up)=>{const [sx,sy,s]=proj(x,y);return[sx+C.cx,sy+C.cy-up*s]};
  for(const [x,inner] of [[xl,1],[xr,-1]]){const a=pt(x,yFar,0),b=pt(x,yNear,0),c=pt(x,yNear,h),d=pt(x,yFar,h);
    g.fillStyle=col;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.closePath();g.fill();
    // outer edge thickness (wall is a chunky toy panel) + top trim
    const e=pt(x-inner*6,yNear,h),f=pt(x-inner*6,yFar,h);g.fillStyle=trim;g.beginPath();g.moveTo(d[0],d[1]);g.lineTo(c[0],c[1]);g.lineTo(e[0],e[1]);g.lineTo(f[0],f[1]);g.closePath();g.fill();
    const gr=g.createLinearGradient(a[0],0,a[0]+inner*30,0);gr.addColorStop(0,'rgba(0,0,0,.25)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.closePath();g.fill()}}
// deferred billboards queued during the ground pass (field animals, crops) — drawn upright after the warp
let P3Q=[];let P3GROUND=false;
function p3later(wx,wy,fn){if(P3D&&P3GROUND){P3Q.push([wy,wx,fn]);return}fn()}
function p3flush(maxY){const keep=[];P3Q.sort((a,b)=>a[0]-b[0]);for(const q of P3Q){if(maxY!=null&&q[0]>maxY){keep.push(q);continue}withProj(q[1],q[0],q[2])}P3Q=keep}
// cast shadow for a billboard (soft parallelogram toward lower-right, like LA's sun)
function p3shadow(wx,wy,w,h){if(!P3D)return;const C=P3C,[sx,sy,s]=proj(wx,wy),X=sx+C.cx,Y=sy+C.cy;g.fillStyle='rgba(10,40,20,.22)';g.beginPath();g.moveTo(X-w*s/2,Y);g.lineTo(X+w*s/2,Y);g.lineTo(X+w*s/2+h*.35*s,Y+h*.18*s);g.lineTo(X-w*s/2+h*.35*s,Y+h*.18*s);g.closePath();g.fill()}
