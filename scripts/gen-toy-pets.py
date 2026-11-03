# v51 plastic-toy pets: chunky rounded silhouettes, big heads, glossy highlights, dark outline (Link's Awakening Switch toy look).
# Base colours stay matched to VAR_MAP in js/critters.js (tabby/black cat, brown hen, rooster recolour by tolerance).
import os,importlib.util
sp=importlib.util.spec_from_file_location('dio',os.path.join(os.path.dirname(__file__),'gen-diorama-art.py'))
src=open(sp.origin).read().split('# --- buildings ---')[0]; dio={'__file__':sp.origin}; exec(src,dio)
C,mix,hx=dio['C'],dio['mix'],dio['hx']
W=hx('ffffff'); EYE=hx('282828'); PINK=hx('ff8aa8')
def gloss(c,x,y,rx,ry): c.ell(x,y,rx,ry,hx('ffffff'),ol=False)
def eyes(c,x1,x2,y,r=2.2):
  for x in (x1,x2): c.ell(x,y,r,r*1.1,EYE); c.ell(x+.7,y-.8,.8,.8,W)
def blush(c,x,y): c.ell(x,y,1.6,1,PINK)
def cat():
  B=hx('e8a048'); D=hx('c87830'); c=C(32,32)
  c.d.line(c.S([24,24,29,14]),fill=dio['OL'],width=5*4); c.d.line(c.S([24,24,29,14]),fill=B,width=3*4)
  c.rr(9,17,16,12,6,B); [c.rr(x,26,4,4,2,B) for x in (10,19)]
  c.poly([(6,9),(8,1),(13,6)],B); c.poly([(19,6),(24,1),(26,9)],B)
  c.ell(16,12,10,8.5,B,ol=True); gloss(c,12,7,3,1.6)
  for x in (12,16,20): c.rr(x-.6,4.5,1.2,3,.5,D,ol=False,shade=False)
  c.ell(16,16,4,2.6,hx('fff1e0')); eyes(c,12,20,12); c.ell(16,14.6,1,.7,PINK); blush(c,9.5,15); blush(c,22.5,15)
  c.save('animals/cat.png')
def chicken():
  B=hx('f5f5f0'); D=hx('dcdcd2'); c=C(32,32)
  c.rr(13,26,1.5,5,0,hx('f0a020'),ol=False,shade=False); c.rr(18,26,1.5,5,0,hx('f0a020'),ol=False,shade=False)
  c.poly([(4,14),(2,8),(9,13)],B); c.ell(14,20,10,8,B,ol=True); c.ell(13,21,5,3.5,D)
  c.ell(21,11,6.5,6.5,B,ol=True); gloss(c,19,8,2,1.2)
  c.ell(21,4.5,2,2,hx('e83030'),ol=True); c.ell(24,4.8,1.6,1.6,hx('e83030'))
  c.poly([(26,11),(30,12.5),(26,14)],hx('ffa020')); c.ell(25.5,15.5,1.2,1.6,hx('e83030'))
  eyes(c,22,22,10,1.6); blush(c,19,13)
  c.save('animals/chicken.png')
def pig():
  B=hx('ffaabb'); c=C(32,32)
  [c.rr(x,24,4,6,2,B) for x in (8,13,19,23)]
  c.ell(15,19,11,7.5,B,ol=True); gloss(c,12,14,4,1.5)
  c.poly([(17,8),(19,2),(23,6)],B); c.poly([(25,6),(29,2),(30,9)],B)
  c.ell(24,14,7.5,7,B,ol=True); gloss(c,22,10,2.2,1.2)
  c.ell(26,17,3.5,2.6,hx('ff8aa0'),ol=True); c.ell(25,17,.7,.9,hx('a04060')); c.ell(27.2,17,.7,.9,hx('a04060'))
  eyes(c,21.5,28,12.5,1.5); c.d.arc(c.S([2,13,8,19]),200,40,fill=dio['OL'],width=4)
  c.save('animals/pig.png')
def rabbit():
  B=hx('fafafa'); c=C(32,32)
  c.rr(11,1,4,12,2,B); c.rr(17,1,4,12,2,B); c.rr(12,3,2,8,1,PINK,ol=False,shade=False); c.rr(18,3,2,8,1,PINK,ol=False,shade=False)
  c.ell(16,23,9,7,B,ol=True); c.ell(7,24,3,3,B,ol=True)
  c.ell(16,15,7.5,6.5,B,ol=True); gloss(c,13,11,2.4,1.2)
  eyes(c,13,19,15); c.ell(16,18,1,.7,PINK); blush(c,11,18); blush(c,21,18)
  c.save('animals/rabbit.png')
def horse():
  B=hx('a8643a'); M=hx('5a3018'); c=C(32,40)
  [c.rr(x,26,4,12,1.5,B) for x in (6,11,19,24)]; [c.rr(x,35,4,3,1,M,ol=False,shade=False) for x in (6,11,19,24)]
  c.d.line(c.S([4,20,1,30]),fill=M,width=4*4)
  c.rr(4,17,24,12,6,B); gloss(c,10,19,5,1.4)
  c.poly([(20,20),(22,8),(28,8),(27,20)],B)
  c.ell(26,9,6,5.5,B,ol=True); c.rr(25,10,7,6,3,hx('d8a078')); gloss(c,24,6,2,1)
  c.poly([(21,4),(22,0),(24,4)],B)
  for i,(x,y) in enumerate([(22,3),(21,7),(20.5,11),(20,15),(19.5,19)]): c.ell(x,y,2.6,2.4,M,ol=True); c.ell(x-.6,y-.8,1,.7,mix(M,(255,255,255),.35))
  eyes(c,25,25,8,1.5); c.ell(30,13,.6,.6,hx('5a3018'))
  c.save('animals/horse.png')
import math,json
WOOL=hx('f4efe4'); WOOLH=hx('ffffff'); WOOLS=hx('d8d0c0'); FACE=hx('4a3e58'); SKIN=hx('ffd0c0')
def sheep(stage,eat=False):
  c=C(56,42); k=[0,.4,.75,1][stage]
  for x in (14,20,30,36): c.rr(x,30,4,9,2,FACE); c.rr(x,36,4,3,1.5,hx('2a2234'),ol=False,shade=False)
  cx,cy=25,24; rx=9+k*10; ry=7+k*7
  if stage==0: c.ell(cx,cy,rx+1,ry+1,SKIN,ol=True); gloss(c,cx-4,cy-4,4,1.6)
  else:
    n=12; pts=[(cx+math.cos(i/n*6.283)*rx,cy+math.sin(i/n*6.283)*ry*.9) for i in range(n)]
    r=3.5+k*3.5
    for x,y in pts: c.ell(x,y,r+1,r+1,dio['OL'])
    c.ell(cx,cy,rx+1,ry,dio['OL'])
    for x,y in pts: c.ell(x,y+1,r,r,WOOLS)
    c.ell(cx,cy,rx,ry-1,WOOL)
    for x,y in pts[6:]+pts[:1]: c.ell(x,y,r*.85,r*.8,WOOL)
    for x,y in pts[7:11]: c.ell(x-r*.2,y-r*.25,r*.45,r*.3,WOOLH)
    gloss(c,cx-rx*.35,cy-ry*.45,rx*.3,ry*.18)
  hy=cy+(6 if eat else -2); hx_=cx+rx-2 if stage else cx+rx
  c.ell(hx_+2,hy-5,4,2,FACE,ol=True)
  c.ell(hx_+4,hy,7,6.5,FACE,ol=True); gloss(c,hx_+2,hy-3.5,2.2,1)
  if stage>=2: c.ell(hx_+3,hy-6,4.5,2.6,WOOL,ol=True)
  eyes(c,hx_+2.5,hx_+7,hy-.5,1.7); blush(c,hx_+1,hy+3); blush(c,hx_+8.5,hy+3)
  if eat: c.ell(hx_+5,hy+5,2,1.2,hx('5ac040'))
  c.save(f'animals/sheep{stage}{"e" if eat else ""}.png')
def dogspr(bid,b):
  B_=hx(b['c']); D=hx(b['d']); L_=hx(b['l']); w,h=48,40; c=C(w,h)
  bl=b['bl']*.75; leg=max(4,b['leg']*.38); bh=b['bh']*.62; by=h-3-leg-bh/2; bx=18
  tail=b.get('tail','whip'); tx=bx-bl/2
  if tail=='curl': c.ell(tx-1,by-6,4,4,B_,ol=True); c.ell(tx-1,by-6,1.6,1.6,L_)
  elif tail=='pom': c.d.line(c.S([tx,by,tx-3,by-7]),fill=B_,width=8); c.ell(tx-3,by-8,3.5,3.5,L_,ol=True)
  elif tail=='plume': c.ell(tx-3,by-4,5,3,B_,ol=True); c.ell(tx-5,by-5,2.4,1.4,L_)
  elif tail!='stub': c.d.line(c.S([tx+1,by,tx-4,by-8]),fill=dio['OL'],width=16); c.d.line(c.S([tx+1,by,tx-4,by-8]),fill=B_,width=9)
  for x in (bx-bl/2+3,bx-bl/2+7,bx+bl/2-7,bx+bl/2-3): c.rr(x-2,h-3-leg-1,4.5,leg+1,2,B_); c.rr(x-2,h-5,4.5,2,1,L_ if b.get('white') else mix(B_,(255,255,255),.3),ol=False,shade=False)
  c.rr(bx-bl/2,by-bh/2,bl,bh,bh/2.2,B_)
  if b.get('saddle'): c.rr(bx-bl/2+3,by-bh/2+.5,bl-8,bh*.45,bh/4,D,ol=False,shade=False)
  if b.get('white') or b.get('mask') is None: c.ell(bx+bl/2-5,by+bh*.2,4,bh*.3,L_)
  gloss(c,bx-bl/4,by-bh/2+2,bl/5,1.1)
  hr=b['hr']*.9; hx0=bx+bl/2+hr*.2; hy0=by-bh/2-hr*.3; ear=b.get('ear','flop'); EC=hx(b['earC']) if b.get('earC') else (D if ear in('flop','long','semi') else B_)
  if ear in('pointy','bat','semi'):
    c.poly([(hx0-hr*.8,hy0-hr*.3),(hx0-hr*.55,hy0-hr*1.45),(hx0-hr*.05,hy0-hr*.7)],EC); c.poly([(hx0+hr*.1,hy0-hr*.7),(hx0+hr*.55,hy0-hr*1.45),(hx0+hr*.85,hy0-hr*.3)],EC)
  c.ell(hx0,hy0,hr,hr*.92,B_,ol=True)
  if b.get('curly'): [c.ell(hx0+dx,hy0-hr*.8,2.4,2.2,L_,ol=True) for dx in (-3,0,3)]
  if b.get('mask'): c.ell(hx0+hr*.15,hy0-hr*.2,hr*.6,hr*.3,D)
  if b.get('white'): c.ell(hx0+hr*.4,hy0+hr*.4,hr*.55,hr*.42,L_)
  c.ell(hx0+hr*.62,hy0+hr*.5,hr*.38,hr*.3,L_,ol=True); c.ell(hx0+hr*.82,hy0+hr*.38,1.7,1.3,hx('2a2028'))
  if ear in('flop','long'): c.ell(hx0-hr*.7,hy0+hr*(.25 if ear=='flop' else .5),hr*.32,hr*(.55 if ear=='flop' else .8),EC,ol=True)
  gloss(c,hx0-hr*.35,hy0-hr*.55,hr*.3,hr*.15)
  e=hx(b['eye']) if b.get('eye') else EYE
  for x in (hx0-hr*.25,hx0+hr*.42): c.ell(x,hy0-hr*.12,2.3,2.6,hx('ffffff') if b.get('mask') else e); c.ell(x,hy0-hr*.12,1.9,2.2,e); c.ell(x+.7,hy0-hr*.35,.8,.8,W)
  blush(c,hx0-hr*.45,hy0+hr*.35)
  if bid=='staffy': c.d.arc(c.S([hx0+hr*.3,hy0+hr*.45,hx0+hr*.9,hy0+hr*.8]),10,170,fill=hx('3a2a3a'),width=4)
  c.save(f'animals/dog_{bid}.png')
cat(); chicken(); pig(); rabbit(); horse()
for st in range(4):
  for e in (False,True): sheep(st,e)
ROOT=os.path.join(os.path.dirname(__file__),'..')
import subprocess
BR=json.loads(subprocess.check_output(['node','-e','const s=require("fs").readFileSync(process.argv[1],"utf8");const i=s.indexOf("const BREEDS=")+13,j=s.indexOf("};",i)+1;console.log(JSON.stringify(eval("("+s.slice(i,j)+")")))',os.path.join(ROOT,'js','data.js')]))
mp=os.path.join(ROOT,'assets','world','manifest.json'); M=json.load(open(mp))
for k,b in BR.items():
  if not b.get('sp'): dogspr(k,b); M['images']['dog_'+k]='animals/dog_'+k+'.png'
json.dump(M,open(mp,'w'))
