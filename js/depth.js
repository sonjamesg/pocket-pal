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
// v48: Link's Awakening log-stake fence — round wooden posts, no rails (clean on long runs)
function logStake(X,base,h,lx,ly){E(X+2,base+1,3,1.2,'#0a281440');for(let k=0;k<h;k++){const f=k/h,ox=Math.round(lx*(1-f)),oy=Math.round(ly*(1-f));R(X+ox,base-h+k+oy,5,1,'#a86a38');R(X+ox+3,base-h+k+oy,1,1,'#7a4a22');R(X+ox,base-h+k+oy,1,1,'#c88a50');R(X+ox-1,base-h+k+oy,1,1,'#3a2a3a');R(X+ox+5,base-h+k+oy,1,1,'#3a2a3a')}
  R(X+lx,base-h-1+ly,5,2,'#e8c088');R(X+lx,base-h-2+ly,5,1,'#3a2a3a');R(X+lx+2,base-h-1+ly,1,1,'#b07848')}
function drawFence(x,y){const X=x*TS,Y=y*TS,base=Y+14,L=isF(x-1,y),Rt=isF(x+1,y),U=isF(x,y-1),D=isF(x,y+1),[lx,ly]=leanOff(X+8,base,10);
  if(U||D){logStake(X+5,base,10,lx,ly);if(D)logStake(X+5,base+8,10,lx,ly);return}
  logStake(X+1,base,10,lx,ly);logStake(X+9,base,10,lx,ly)}
