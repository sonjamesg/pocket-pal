// ===== depth.js — fake-3D: lean/parallax for tall sprites, white picket fences =====
// LEAN: tall objects shear away from camera centre, so their tops shift as you walk (SNES/GBA depth illusion).
const LEAN={x:.010,y:.006};let CAMC=[0,0];
function leanOff(bx,by,h){return[Math.round((bx-CAMC[0])*h*LEAN.x/16),Math.round((by-CAMC[1])*h*LEAN.y/16)]}
// draw image (or sub-rect) with its base fixed and upper rows shifted progressively
// v27: whole-sprite integer offset (no per-strip shear) -> no seams/tears crawling with camera
function drawLean(im,X,Y,w,h,sx,sy){w=w||im.width;h=h||im.height;sx=sx||0;sy=sy||0;const [dx,dy]=leanOff(X+w/2,Y+h,h/2);
  g.drawImage(im,sx,sy,w,h,X+dx,Y+dy,w,h)}
const isF=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&OWBASE[y][x]==='f';
const FW='#fbfbf4',FS='#c8ccd8',FD='#7a8098',FO='#3a3e58';
function picket(X,Y,h,lx,ly){// one picket at X, base Y, height h, lean offset at top
  const t=Y-h;for(let k=0;k<h;k++){const f=k/h,ox=Math.round(lx*(1-f)),oy=Math.round(ly*(1-f));R(X+ox,t+k+oy,3,1,FW);R(X+ox+2,t+k+oy,1,1,FS);R(X+ox-1,t+k+oy,1,1,FO);R(X+ox+3,t+k+oy,1,1,FO)}
  R(X+lx,t+ly-1,3,1,FO);R(X+lx+1,t+ly-2,1,1,FO);R(X+lx+1,t+ly-1,1,1,FW)}
function drawFence(x,y){const X=x*TS,Y=y*TS,base=Y+13,L=isF(x-1,y),Rt=isF(x+1,y),U=isF(x,y-1),D=isF(x,y+1),[lx,ly]=leanOff(X+8,base,12);
  E(X+8,base+1,8,2,'#0a281430');
  const horiz=L||Rt||!(U||D);
  if(horiz){const a=L?0:5,b=Rt?16:11;// rails behind & front
    for(const ry of [5,10]){const ox=Math.round(lx*ry/12),oy=Math.round(ly*ry/12);R(X+a+ox,base-ry+oy,b-a,2,FW);R(X+a+ox,base-ry+oy+1,b-a,1,FS);R(X+a+ox,base-ry+oy+2,b-a,1,FD)}
    for(const px of [1,5,9,13])if(px>=a-1&&px<=b-2)picket(X+px,base,11,lx,ly)}
  if(U||D){// vertical run seen end-on: narrow pickets stacked, rails as a column
    const t=U?Y-4:Y+4,bt=D?Y+16:base;R(X+7+lx,t,3,bt-t,FS);R(X+7+lx,t,1,bt-t,FW);R(X+10+lx,t,1,bt-t,FD);for(let k=t;k<bt;k+=4)picket(X+7,Math.min(bt,k+8),9,lx,ly)}
  // chunky corner/end post
  if(!(L&&Rt)||U||D){const ph=14;for(let k=0;k<ph;k++){const f=k/ph,ox=Math.round(lx*(1-f)),oy=Math.round(ly*(1-f));R(X+6+ox,base-ph+k+oy,5,1,FW);R(X+10+ox,base-ph+k+oy,1,1,FD);R(X+5+ox,base-ph+k+oy,1,1,FO);R(X+11+ox,base-ph+k+oy,1,1,FO)}
    R(X+5+lx,base-ph-1+ly,7,2,FO);R(X+6+lx,base-ph+ly,5,1,'#fff')}}
