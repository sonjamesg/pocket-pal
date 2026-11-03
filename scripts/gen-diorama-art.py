# Link's-Awakening-Switch style "toy diorama" buildings. Renders at 4x, downsamples (soft AA).
# Output: same pixel sizes as legacy sprites so doors/walkability/anchors are unchanged.
from PIL import Image, ImageDraw, ImageFilter
import os
K=4; OUT=os.path.join(os.path.dirname(__file__),'..','assets','world')
def mix(a,b,t): return tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3))+(255,)
def hx(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))+(255,)
OL=hx('3a2a3a')
class C:
  def __init__(s,w,h): s.w,s.h=w,h; s.im=Image.new('RGBA',(w*K,h*K),(0,0,0,0)); s.d=ImageDraw.Draw(s.im)
  def S(s,v): return [x*K for x in v]
  def rr(s,x,y,w,h,r,c,ol=True,shade=True):
    if ol: s.d.rounded_rectangle(s.S([x-1,y-1,x+w+1,y+h+1]),r*K+K,fill=OL)
    s.d.rounded_rectangle(s.S([x,y,x+w,y+h]),r*K,fill=c)
    if shade and h>=6 and w>=4:  # soft top highlight + bottom shade (diorama light)
      s.d.rounded_rectangle(s.S([x+1,y+1,x+w-1,y+h*0.28]),max(r-1,0)*K,fill=mix(c,(255,255,255),.22))
      s.d.rounded_rectangle(s.S([x+1,y+h*0.78,x+w-1,y+h-1]),max(r-1,0)*K,fill=mix(c,(40,20,60),.22))
  def poly(s,pts,c,ol=True):
    if ol: s.d.polygon([(px*K,py*K) for px,py in pts],fill=OL,outline=OL,width=2*K)
    s.d.polygon([(px*K,py*K) for px,py in pts],fill=c)
  def ell(s,x,y,rx,ry,c,ol=False):
    if ol: s.d.ellipse(s.S([x-rx-1,y-ry-1,x+rx+1,y+ry+1]),fill=OL)
    s.d.ellipse(s.S([x-rx,y-ry,x+rx,y+ry]),fill=c)
  def shadow(s):
    sh=Image.new('RGBA',s.im.size,(0,0,0,0)); ImageDraw.Draw(sh).ellipse(s.S([2,s.h-7,s.w-2,s.h]),fill=(30,40,30,110))
    sh=sh.filter(ImageFilter.GaussianBlur(2*K)); sh.alpha_composite(s.im); s.im=sh; s.d=ImageDraw.Draw(s.im)
  def save(s,p):
    im=s.im.resize((s.w,s.h),Image.LANCZOS)
    px=im.load()
    for y in range(s.h):
      for x in range(s.w):
        r,g,b,a=px[x,y]; px[x,y]=(r,g,b,0 if a<60 else 255) if a<200 else (r,g,b,255)
    im.save(os.path.join(OUT,p)); print('wrote',p)
# --- parts ---
def roof(c,x,y,w,h,col,shingle=True,over=4):
  # chunky rounded hip roof with tilt-shift soft top light
  c.rr(x-over,y,w+over*2,h,5,col)
  if shingle:
    for i in range(1,int(h/5)):
      yy=y+i*5; c.d.line(c.S([x-over+2,yy,x+w+over-2,yy]),fill=mix(col,(40,20,60),.18),width=K)
      for j in range(int((w+over*2)/6)):
        xx=x-over+3+j*6+(3 if i%2 else 0); c.d.line(c.S([xx,yy,xx,yy+5]),fill=mix(col,(40,20,60),.12),width=K//2)
  c.rr(x-over+3,y+1,w+over*2-6,2.2,1,mix(col,(255,255,255),.45),ol=False,shade=False)
def gable(c,cx,top,w,base,col):
  c.poly([(cx-w/2,base),(cx,top),(cx+w/2,base)],col)
  c.poly([(cx-w/2+3,base-1),(cx,top+3),(cx-1,base-1)],mix(col,(255,255,255),.25),ol=False)
def wall(c,x,y,w,h,col,planks=False,boards=False):
  c.rr(x,y,w,h,2,col)
  if planks:
    for yy in range(int(y+4),int(y+h-1),4): c.d.line(c.S([x+1,yy,x+w-1,yy]),fill=mix(col,(60,30,40),.15),width=K//2)
  if boards:
    for xx in range(int(x+5),int(x+w-1),5): c.d.line(c.S([xx,y+1,xx,y+h-1]),fill=mix(col,(60,30,40),.2),width=K//2)
def win(c,x,y,w=9,h=8,frame=hx('ffffff')):
  c.rr(x,y,w,h,2,frame,shade=False); c.rr(x+1.3,y+1.3,w-2.6,h-2.6,1.5,hx('6ec8ff'),ol=False,shade=False)
  c.d.polygon([( (x+1.5)*K,(y+h-2)*K),((x+w-3)*K,(y+1.5)*K),((x+w-1.5)*K,(y+1.5)*K),((x+3)*K,(y+h-1.5)*K)],fill=hx('d8f4ff'))
  c.d.line(c.S([x+w/2,y+1,x+w/2,y+h-1]),fill=frame,width=K//2)
def door(c,x,y,w,h,col,barn=False,arch=True):
  c.rr(x,y,w,h,4 if arch else 1,col)
  if barn:
    c.d.line(c.S([x+1,y+1,x+w-1,y+h-1]),fill=hx('ffffff'),width=K); c.d.line(c.S([x+w-1,y+1,x+1,y+h-1]),fill=hx('ffffff'),width=K)
    c.d.line(c.S([x+w/2,y,x+w/2,y+h]),fill=OL,width=K//2)
  else: c.ell(x+w-2.5,y+h/2+1,1,1,hx('ffd84a'))
def flowers(c,x,y,n):
  cols=[hx('ff6a8a'),hx('ffd84a'),hx('ffffff'),hx('b07aff')]
  c.rr(x,y,n*4+2,4,2,hx('4aa83a'),shade=False)
  for i in range(n): c.ell(x+2+i*4,y+1,1.4,1.4,cols[i%4])
def sign(c,cx,y,w,txtcol,bg):
  c.rr(cx-w/2,y,w,7,3,bg)
# --- buildings ---
def farmhouse():
  c=C(64,80); c.shadow()
  wall(c,6,42,52,32,hx('fff1d6'),planks=True)
  roof(c,6,22,52,22,hx('3f7cf0'))
  c.rr(42,8,7,16,1,hx('e86a4a'))  # chimney
  c.ell(46,5,3,2,hx('ffffffaa'.replace('aa','')))
  gable(c,32,10,26,24,hx('3f7cf0')); win(c,28,15,8,7)
  win(c,10,50); win(c,45,50)
  c.rr(24,56,16,2,1,hx('e86a4a'),shade=False)
  door(c,26,58,12,16,hx('d0503a'))
  flowers(c,8,62,4); flowers(c,44,62,4)
  c.save('buildings/farmhouse.png')
def barn(name,w,col,roofc,label=None):
  c=C(w,80); c.shadow(); cx=w/2
  wall(c,5,36,w-10,38,col,boards=True)
  c.rr(5,36,w-10,3,1,hx('ffffff'),shade=False); c.rr(5,72,w-10,2,1,hx('ffffff'),shade=False)
  c.poly([(1,40),(10,22),(cx,10),(w-10,22),(w-1,40)],roofc)
  c.poly([(5,38),(12,23),(cx,13),(cx,17),(14,26),(9,38)],mix(roofc,(255,255,255),.3),ol=False)
  c.rr(cx-6,20,12,10,2,hx('ffffff')); c.rr(cx-4.5,21.5,9,7,1,hx('ffe08a'),ol=False,shade=False)
  if w>=90: win(c,12,46); win(c,w-21,46)
  door(c,cx-11,48,22,26,mix(col,(255,255,255),.1),barn=True,arch=False)
  if label: c.rr(cx-10,40,20,6,3,hx('fff6dc'))
  c.save(name)
def coop():
  c=C(64,80); c.shadow()
  for xx in (10,50): c.rr(xx,66,4,10,1,hx('8a5a3a'))
  wall(c,6,40,52,28,hx('ffd27a'),planks=True)
  roof(c,6,24,52,18,hx('ee4a3a'))
  c.ell(32,32,5,5,hx('ffffff'),ol=True); c.ell(32,32,3,3,hx('6a3a20'))
  win(c,12,46,8,7); win(c,44,46,8,7)
  door(c,26,50,12,18,hx('a8643a'))
  c.d.line(c.S([38,68,52,78]),fill=hx('b07a4a'),width=2*K)
  c.ell(53,20,3,3,hx('ffffff'),ol=True); c.ell(55,20,1.5,1,hx('ffb020'))  # tiny chicken on roof
  c.ell(53,16.5,1,1.2,hx('ee3a3a'))
  c.save('buildings/coop.png')
def shed(name,wallc,roofc,acc,w=48,h=64,planks=True,boards=False,doorc=None):
  c=C(w,h); c.shadow(); wt=h-34
  wall(c,5,h-wt-6,w-10,wt,wallc,planks=planks,boards=boards)
  roof(c,5,h-wt-24,w-10,19,roofc,over=3)
  win(c,9,h-wt+1,8,7)
  door(c,w-22,h-wt+1,13,wt-7,doorc or acc,barn=True,arch=False)
  c.save(name); return c
def sty():
  c=C(64,80); c.shadow()
  wall(c,6,42,52,30,hx('f2b8a8'),planks=True)
  roof(c,6,24,52,20,hx('8a5ad8'))
  win(c,12,50); door(c,32,50,16,22,hx('b0603a'),barn=True,arch=False)
  for xx in range(2,64,8): c.rr(xx,66,3,10,1,hx('fff6e6'),shade=False)
  c.rr(1,69,62,2,1,hx('fff6e6'),shade=False)
  c.ell(14,36,4,3,hx('ffb0c0'),ol=True)
  c.save('buildings/sty.png')
def doghouse():
  c=C(48,48); c.shadow()
  wall(c,8,22,32,22,hx('ff8a3a'),planks=True)
  c.poly([(3,25),(24,6),(45,25)],hx('3f7cf0'))
  c.poly([(8,23),(24,10),(24,14),(12,24)],mix(hx('3f7cf0'),(255,255,255),.35),ol=False)
  c.rr(17,28,14,16,7,hx('3a2030'),shade=False); c.rr(15,16,18,6,3,hx('fff6dc'))
  c.ell(36,42,4,2,hx('3a86e8'),ol=True)
  c.save('buildings/doghouse.png')
def petstore():
  c=C(48,64); c.shadow()
  wall(c,4,26,40,34,hx('6ad8b0'))
  roof(c,4,14,40,14,hx('ff6aa8'),over=3)
  for i in range(5): c.rr(4+i*8,27,8,5,2,hx('ffffff') if i%2 else hx('ff6aa8'),ol=False,shade=False)
  c.rr(8,4,32,10,4,hx('fff6dc')); c.ell(18,9,2.5,2.2,hx('ff5a8b')); c.ell(30,9,2.5,2.2,hx('ff5a8b'))
  c.poly([(22,9),(24,7),(26,9),(24,11)],hx('ffb020'),ol=False)
  win(c,7,37,12,10); door(c,28,40,12,20,hx('ffb020'))
  c.save('buildings/petstore.png')
def farmshop():
  c=C(48,48); c.shadow()
  c.rr(6,26,36,18,2,hx('c8844a'),)
  for i in range(3): c.ell(14+i*10,25,4,3,[hx('ff4a3a'),hx('ffd84a'),hx('ff9a2a')][i],ol=True)
  for xx in (7,39): c.rr(xx,6,3,22,1,hx('8a5a3a'))
  for i in range(6): c.rr(4+i*7,6,7,9,3 if i in(0,5) else 0,hx('ff5a4a') if i%2==0 else hx('ffffff'),ol=False,shade=False)
  c.d.rounded_rectangle(c.S([4,6,46,15]),2*K,outline=OL,width=K)
  c.rr(10,15,28,7,3,hx('fff6dc'))
  c.save('props/farmshop.png')
def jobboard():
  c=C(32,32); c.shadow()
  for xx in (6,24): c.rr(xx,10,3,20,1,hx('8a5a3a'))
  c.rr(3,6,26,16,3,hx('c8844a'))
  c.rr(6,9,8,8,1,hx('fff6dc'),shade=False); c.rr(16,10,9,6,1,hx('ffe36a'),shade=False)
  c.ell(10,10,1.2,1.2,hx('e8402a')); c.ell(20,11,1.2,1.2,hx('3a86e8'))
  c.poly([(2,7),(16,0),(30,7)],hx('ee4a3a'))
  c.save('props/jobboard.png')
def well():
  c=C(32,32); c.shadow()
  for xx in (5,25): c.rr(xx,6,3,18,1,hx('8a5a3a'))
  c.poly([(1,9),(16,1),(31,9)],hx('3f7cf0'))
  c.ell(16,22,12,5,hx('b8c0d8'),ol=True); c.rr(4,22,24,7,3,hx('b8c0d8'))
  for xx in range(6,28,5): c.d.line(c.S([xx,23,xx,28]),fill=hx('8890b0'),width=K//2)
  c.ell(16,21,9,3,hx('3a86e8')); c.ell(14,20.5,3,1,hx('a8e0ff'))
  c.d.line(c.S([16,9,16,17]),fill=OL,width=K//2); c.rr(14,16,4,4,1,hx('c8844a'))
  c.save('props/well.png')
def windmill():
  c=C(48,80); c.shadow()
  c.poly([(14,76),(18,30),(30,30),(34,76)],hx('fff1d6'))
  c.poly([(15,74),(19,32),(22,32),(19,74)],hx('ffffff'),ol=False)
  c.poly([(12,32),(24,16),(36,32)],hx('ee4a3a'))
  win(c,20,42,8,7); door(c,19,62,10,14,hx('3f7cf0'))
  import math
  for k in range(4):
    a=math.radians(45+k*90); ex,ey=24+math.cos(a)*22,24+math.sin(a)*22
    px,py=-math.sin(a)*3.5,math.cos(a)*3.5
    c.poly([(24+px*.3,24+py*.3),(ex+px,ey+py),(ex,ey),(24,24)],hx('fffaf0'))
    c.d.line(c.S([24,24,ex,ey]),fill=hx('8a5a3a'),width=K)
  c.ell(24,24,3,3,hx('ffd84a'),ol=True)
  c.save('props/windmill.png')
def fence():
  c=C(16,16)
  c.rr(1,7,14,2,1,hx('ffffff'),ol=True,shade=False); c.rr(1,11,14,2,1,hx('ffffff'),ol=True,shade=False)
  c.poly([(5,14),(5,4),(8,1),(11,4),(11,14)],hx('ffffff'))
  c.d.line(c.S([10,4,10,14]),fill=hx('d8d0e8'),width=K)
  c.save('tiles/fence.png')
farmhouse()
barn('buildings/cowbarn.png',96,hx('e8443a'),hx('6a4ad0'))
barn('buildings/stable.png',96,hx('c8844a'),hx('2fae6a'))
barn('buildings/sheepshed.png',64,hx('fff1d6'),hx('3f9cf0'))
coop(); sty(); doghouse(); petstore(); farmshop(); jobboard(); well(); windmill(); fence()
shed('buildings/feedshed.png',hx('ffd27a'),hx('2fae6a'),hx('c8844a'))
shed('buildings/toolshed.png',hx('b8c8e8'),hx('ff8a3a'),hx('6a7aa8'),boards=True,planks=False)
