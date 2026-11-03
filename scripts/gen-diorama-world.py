# v48: Link's Awakening (Switch) / Mabe Village diorama WORLD art — ground, paths, water, trees, crops, props.
# Refs: refs/links-awakening-switch/ (james-mabe-village, koholint-prairie). Same pixel sizes as before.
import os,sys,math,random
sys.path.insert(0,os.path.dirname(__file__))
from PIL import Image,ImageDraw,ImageFilter
import importlib.util
sp=importlib.util.spec_from_file_location('dio',os.path.join(os.path.dirname(__file__),'gen-diorama-art.py'))
# reuse helpers without running building mains
src=open(sp.origin).read().split('# --- buildings ---')[0]; dio={'__file__':sp.origin}; exec(src,dio)
C,mix,hx,OL,K=dio['C'],dio['mix'],dio['hx'],dio['OL'],dio['K']
OUT=os.path.join(os.path.dirname(__file__),'..','assets','world')
def P(p): return os.path.join(OUT,p)
G=hx('86d04a'); GL=hx('a2e05a'); GD=hx('5fae36'); GDD=hx('3f8a2a')
def img(w,h,c=(0,0,0,0)): return Image.new('RGBA',(w,h),c)
def grassbase(seed):
  r=random.Random(seed); im=img(16,16,G); px=im.load()
  for y in range(16):
    for x in range(16):
      n=(math.sin((x+seed)*.9)+math.cos((y*1.3+seed)))*.5
      px[x,y]=mix(G,GL,.18) if n>.55 else mix(G,GD,.12) if n<-.7 else G
  return im,r
def tuft(d,x,y,s=1):
  for dx,h in((-2,3),(0,4),(2,3)):
    d.line([(x+dx*s*.5,y),(x+dx*s,y-h*s)],fill=GDD,width=1)
  d.point((x,y-4*s+1),fill=GL)
def daisy(d,x,y,c=(255,255,255,255)):
  for a,b in((0,-1),(0,1),(-1,0),(1,0)): d.point((x+a,y+b),fill=c)
  d.point((x,y),fill=hx('ffd84a'))
for i in range(4):
  im,r=grassbase(i*7); d=ImageDraw.Draw(im)
  if i==1: tuft(d,8,11)
  if i==2: daisy(d,5,5); daisy(d,11,11)
  if i==3: [d.point((3+k*4,4+(k%2)*6),fill=GD) for k in range(3)]
  im.save(P(f'tiles/grass{i}.png'))
grassbase(0)[0].save(P('tiles/grass.png'))
def bladeclump(cols,seed=1):  # LA tall-grass clump
  c=C(16,16); r=random.Random(seed)
  c.ell(8,13.5,7,2.5,(40,90,30,120))
  for k in range(14):
    x=1.5+k; h=7+r.random()*6; col=cols[k%len(cols)]
    c.poly([(x-1.2,15),(x+r.uniform(-2,2),15-h),(x+1.2,15)],col,ol=False)
  return c
c=bladeclump([hx('3fb03a'),hx('58c845'),hx('2f9a32'),hx('6ad850')]); c.save('tiles/tallgrass.png')
for i,fc in enumerate([hx('ff5a7a'),hx('ffd84a'),hx('ffffff')]):
  im,r=grassbase(30+i); d=ImageDraw.Draw(im)
  for (x,y) in((4,4),(11,6),(6,11),(12,12)):
    for a,b in((0,-1),(0,1),(-1,0),(1,0)): d.point((x+a,y+b),fill=fc)
    d.point((x,y),fill=hx('ffb030') if i!=1 else hx('ff7a30'))
  im.save(P(f'tiles/flower{i}.png'))
# flowerbed: soil mound + flower cluster
c=C(16,16); c.rr(1,5,14,10,4,hx('9a5a32')); 
for x,y,col in((4,7,'ff5a7a'),(8,6,'ffd84a'),(12,8,'ffffff'),(5,11,'b07aff'),(10,11,'ff5a7a')):
  c.ell(x,y+1,2,1.4,hx('3f9a30')); c.ell(x,y,1.6,1.6,hx(col)); c.ell(x,y,.5,.5,hx('ffb030'))
c.save('tiles/flowerbed.png')
# ---- autotiles 40x32: col 0 interior,1 outer corner,2 h-edge,3 v-edge,4 inner corner; rows TL,TR,BL,BR
def autotile(name,fill,rim,tex,inner_bg=None,foam=None):
  im=img(40,32); px=im.load()
  for st in range(5):
    for q,(sx,sy) in enumerate([(-1,-1),(1,-1),(-1,1),(1,1)]):
      for yy in range(8):
        for xx in range(8):
          u=xx if sx>0 else 7-xx; v=yy if sy>0 else 7-yy   # u,v grow toward the outside
          if st==0: dd=-9
          elif st==1: dd=math.hypot(max(u-1.5,0),max(v-1.5,0))-4.6
          elif st==2: dd=v-5.6
          elif st==3: dd=u-5.6
          else: dd=-(math.hypot(u-8.5,v-8.5)-3.6)
          X,Y=st*8+xx,q*8+yy
          if dd>0: px[X,Y]=(0,0,0,0); continue
          col=tex(xx+(8 if sx>0 else 0),yy+(8 if sy>0 else 0),st)
          if dd>-1.2: col=rim
          elif dd>-2.2 and foam: col=foam
          px[X,Y]=col
  im.save(P(name))
PATH=hx('e8b860'); PATHL=hx('f4cf7e'); PATHD=hx('c9934a')
def ptex(x,y,st):
  h=(x*37+y*91)%23
  return PATHL if h==0 else PATHD if h==7 else mix(PATH,PATHL,.25) if (x+y)%7==0 else PATH
autotile('tiles/path-auto.png',PATH,hx('b47a3c'),ptex)
SAND=hx('f6e2a6')
autotile('tiles/sand-auto.png',SAND,hx('d8b870'),lambda x,y,s:hx('fff0c0') if (x*13+y*7)%19==0 else SAND)
for f in range(2):
  W1=hx('46a8f0');W2=hx('6cc4ff')
  autotile(f'tiles/water-auto{f}.png',W1,hx('2a6ab0'),lambda x,y,s:hx('d8f4ff') if (y in (4,12) and (x+f*4)%16 in (2,3,4)) else W2 if (x-y+f*3)%16 in (0,1) else W1,foam=hx('e8f8ff'))
im=img(16,16,hx('46a8f0')); d=ImageDraw.Draw(im); d.line([(3,5),(7,5)],fill=hx('d8f4ff')); d.line([(9,11),(13,11)],fill=hx('d8f4ff')); im.save(P('tiles/water.png'))
im=img(16,16,hx('46a8f0')); d=ImageDraw.Draw(im); d.rectangle([0,0,15,3],fill=hx('e8f8ff')); d.rectangle([0,4,15,4],fill=hx('2a6ab0')); im.save(P('tiles/water-edge.png'))
im=img(16,16,PATH); [im.putpixel((x,y),ptex(x,y,0)) for x in range(16) for y in range(16)]; im.save(P('tiles/path.png'))
# bridge: chunky planks
c=C(16,16); c.rr(-1,1,18,14,1,hx('c8844a'),ol=False)
for y in (1,5,9,13): c.d.line(c.S([0,y,16,y]),fill=hx('7a4a28'),width=K)
c.rr(-1,0,18,1.2,0,hx('7a4a28'),ol=False,shade=False); c.save('tiles/bridge.png')
# rock: LA dark grey boulder
c=C(16,16); c.ell(8,13.5,6.5,2,(30,50,30,110)); c.ell(8,9,6,5.5,hx('6a7280'),ol=True); c.ell(6.5,7,3.5,2.6,hx('9aa2b0')); c.ell(5.5,6,1.5,1,hx('d0d6e0')); c.save('tiles/rock.png')
# soil tiles
def soil(name,base,wet=False,sprout=0):
  c=C(16,16); c.rr(.5,.5,15,15,3,base,ol=False)
  for y in (4,9,14):
    c.rr(1.5,y-2.6,13,3,1.5,mix(base,(255,255,255),.16),ol=False,shade=False)
    c.d.line(c.S([2,y+.6,14,y+.6]),fill=mix(base,(30,10,20),.35),width=K)
  if wet:
    c.ell(5,6,1.5,.8,hx('a8d8ff')); c.ell(11,12,1.2,.6,hx('a8d8ff'))
  if sprout:
    for x,y in((4,4),(11,4),(7,9),(4,14),(11,14)):
      c.poly([(x,y),(x-2.4,y-2.2),(x-.4,y-.6)],hx('5ad040'),ol=False); c.poly([(x,y),(x+2.4,y-2.6),(x+.4,y-.6)],hx('7ae858'),ol=False)
      c.d.line(c.S([x,y,x,y-1.5]),fill=hx('3f9a30'),width=K//2)
  c.save(name)
soil('tiles/field.png',hx('c8925a'))        # dry: pale dusty soil
soil('tiles/fieldwet.png',hx('8a5232'),wet=True)
soil('tiles/sprout.png',hx('8a5232'),sprout=1)
def crop(name,kind):
  c=C(16,16); c.rr(.5,9,15,6.5,3,hx('8a5232'),ol=False)
  if kind=='corn':
    for x in (4,11):
      c.rr(x-1,1,2,13,1,hx('4aa83a'),ol=False,shade=False)
      c.poly([(x,9),(x-5,5),(x-1,7)],hx('5ac845')); c.poly([(x,7),(x+5,3),(x+1,5)],hx('6ad850'))
      c.ell(x+1.5,6,1.6,3,hx('ffd84a'),ol=True); c.ell(x+1,5,.6,1.5,hx('fff2a0'))
  if kind=='wheat':
    for x in (3,7,11,14):
      c.d.line(c.S([x,14,x,4]),fill=hx('d8a830'),width=K)
      c.ell(x,4,1.4,2.8,hx('ffd060'),ol=True); c.ell(x-.4,3,.5,1.2,hx('fff0a0'))
  if kind=='pumpkin':
    c.poly([(3,10),(6,6),(8,9)],hx('4aa83a'),ol=False); c.poly([(12,10),(14,6),(10,8)],hx('5ac845'),ol=False)
    c.ell(8,11,6,4,hx('ff8a20'),ol=True); c.ell(6,10,2,2.6,hx('ffa848')); c.ell(8,11,.6,3.6,hx('d86010'))
    c.rr(7.3,5.5,1.6,2.5,.5,hx('4a8a28'))
  c.save(name)
crop('tiles/corn.png','corn'); crop('tiles/wheat.png','wheat'); crop('tiles/pumpkin.png','pumpkin')
# sign + gatepost (log style)
c=C(16,16); c.ell(8,14.5,5,1.6,(30,50,30,110)); c.rr(7,6,2,9,1,hx('8a5228')); c.rr(1.5,2,13,7,2,hx('d89a58')); c.d.line(c.S([4,5,12,5]),fill=hx('8a5228'),width=K//2); c.save('tiles/sign.png')
def logpost(c,x,base,h,r=2.4):
  c.ell(x,base,r+.6,1.2,(30,50,30,110)); c.rr(x-r,base-h,r*2,h,r,hx('a86a38'))
  c.d.line(c.S([x+r-1,base-h+2,x+r-1,base-1]),fill=hx('7a4a22'),width=K//2)
  c.ell(x,base-h+1,r-.3,1.1,hx('e8c088'),ol=False); c.ell(x,base-h+1,.7,.4,hx('b07848'),ol=False)
c=C(16,16); logpost(c,8,15,14,3.2); c.save('tiles/gatepost.png')
c=C(16,16); logpost(c,4,14,10); logpost(c,12,14,10); c.save('tiles/fence.png')
# ---- trees: LA tiered dome trees with scalloped leaves
def scallops(c,cx,cy,rx,ry,col):
  c.ell(cx,cy,rx,ry,col,ol=True)
  for i in range(int(rx*1.2)):
    a=i/(rx*1.2)*math.pi; x=cx-rx*.8+i*(rx*1.6/(rx*1.2)); c.ell(x,cy+ry*.55,1.8,1.3,mix(col,(20,40,20),.25))
  c.ell(cx-rx*.35,cy-ry*.45,rx*.45,ry*.3,mix(col,(255,255,200),.3))
def dome(path,w,h,cols,apples=False,pine=False):
  c=C(w,h); cx=w/2
  sh=Image.new('RGBA',c.im.size,(0,0,0,0)); ImageDraw.Draw(sh).ellipse(c.S([cx-w*.42,h-6,cx+w*.42,h-1]),fill=(20,50,20,120))
  c.im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(K)))
  c.rr(cx-2.5,h-11,5,9,1.5,hx('7a4424'))
  if pine:
    for i,(y,rw) in enumerate([(h-12,w*.44),(h-19,w*.34),(h-25,w*.22)]):
      c.poly([(cx-rw,y+4),(cx,y-8),(cx+rw,y+4)],cols[i%len(cols)])
      c.ell(cx-rw*.3,y-1,rw*.25,1.5,mix(cols[i%len(cols)],(255,255,200),.3))
  else:
    scallops(c,cx,h-14,w*.44,7,cols[0]); scallops(c,cx,h-20,w*.36,6.5,cols[1]); scallops(c,cx,h-25,w*.24,5,cols[2])
  if apples:
    for x,y in((cx-8,h-16),(cx+6,h-13),(cx-2,h-22),(cx+8,h-21),(cx-10,h-11)):
      c.ell(x,y,1.6,1.6,hx('ff3a3a'),ol=True); c.ell(x-.5,y-.5,.5,.5,hx('ffd0d0'))
  c.save(path)
GR=[hx('2f9a3a'),hx('3fb042'),hx('58c850')]
dome('trees/tree2x2.png',32,32,GR); dome('trees/apple2x2.png',32,32,GR,apples=True)
dome('trees/pine2x2.png',32,32,[hx('1f7a46'),hx('2a9050'),hx('3aa860')],pine=True)
c=C(16,16); c.rr(6.5,10,3,5,1,hx('7a4424')); scallops(c,8,8,6.5,5,GR[1]); c.save('trees/tree.png')
# ---- props
c=C(16,16); c.ell(8,14,7,1.8,(30,50,30,110)); c.rr(1.5,4,13,10,3,hx('f0c850'))
for x in (5,11): c.d.line(c.S([x,4,x,14]),fill=hx('a06a28'),width=K)
c.d.line(c.S([3,8,13,8]),fill=hx('d8a838'),width=K//2); c.save('props/hay.png')
c=C(32,16); c.shadow(); c.rr(2,4,28,10,3,hx('a86a38'),); c.rr(4,5,24,4,2,hx('6cc4ff'),ol=False,shade=False); c.d.line(c.S([6,6,14,6]),fill=hx('e8f8ff'),width=K//2); c.save('props/trough.png')
c=C(16,32); c.ell(8,30,5,1.6,(30,50,30,110)); c.rr(7,10,2,20,1,hx('8a5228')); c.rr(1,13,14,3,1.5,hx('8a5228'))
c.rr(4,13,8,10,3,hx('e85a4a')); c.ell(8,8,4,4,hx('f6e0a0'),ol=True); c.ell(6.5,7.5,.7,.7,OL); c.ell(9.5,7.5,.7,.7,OL)
c.poly([(2,5),(8,0),(14,5)],hx('f0c850')); c.rr(1,4,14,2,1,hx('f0c850')); c.save('props/scarecrow.png')
c=C(32,80); c.shadow(); c.rr(5,24,22,52,4,hx('e8e2d6'),)
for y in range(30,74,7): c.d.line(c.S([6,y,26,y]),fill=hx('b8b0a6'),width=K//2)
c.rr(4,24,24,4,2,hx('e85a4a')); c.poly([(3,26),(16,8),(29,26)],hx('e85a4a')); c.ell(16,10,2,2,hx('ffd84a'),ol=True)
c.rr(11,58,10,18,3,hx('c8844a')); c.save('props/silo.png')
# hose reel (new)
c=C(16,16); c.ell(8,14.5,7,1.6,(30,50,30,110)); c.rr(2,3,2.4,12,1,hx('8a5228')); c.rr(11.6,3,2.4,12,1,hx('8a5228'))
c.ell(8,8,5.6,5.6,hx('2fb050'),ol=True); c.ell(8,8,3.8,3.8,hx('4ad068')); c.ell(8,8,1.6,1.6,hx('1a6a30')); c.ell(6,6,1.4,1,hx('b8f8c8')); c.save('props/hose.png')
print('done')
