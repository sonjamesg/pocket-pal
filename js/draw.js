// ===== draw.js — canvas drawing primitives =====
const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
function E(x,y,rx,ry,c,rot=0){g.fillStyle=c;g.beginPath();g.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot,0,7);g.fill()}
function RR(x,y,w,h,r,c,stroke){g.beginPath();g.roundRect(x,y,w,h,r);if(c){g.fillStyle=c;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=1.5;g.stroke()}}
function txt(t,x,y,c='#2b2440',s=10,al='center'){g.fillStyle=c;g.font=`800 ${s}px system-ui,sans-serif`;g.textAlign=al;g.fillText(t,x,y)}
function otxt(t,x,y,c,s,al='center'){g.font=`800 ${s}px system-ui,sans-serif`;g.textAlign=al;g.lineWidth=3;g.strokeStyle='#2b2440';g.strokeText(t,x,y);g.fillStyle=c;g.fillText(t,x,y)}
function heartS(x,y,s=1,c='#ff4f8b'){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=c;g.beginPath();g.moveTo(0,3);g.bezierCurveTo(-7,-3,-3,-8,0,-4);g.bezierCurveTo(3,-8,7,-3,0,3);g.fill();g.restore()}
function star(x,y,r,c){g.fillStyle=c;g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.fill()}
function mix(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
