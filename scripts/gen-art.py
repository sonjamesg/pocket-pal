#!/usr/bin/env python3
"""Generate GBA-style v18 tiles into assets/world/ (grass variants, autotile atlases, 2x2 trees, bridge, rock, flowers).
Re-run to regenerate; hand-edited PNGs can replace any output (manifest-driven)."""
import os, random, math
from PIL import Image, ImageDraw
R = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'world')
def P(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))+(255,)
G = [P('58b848'),P('68c858'),P('78d468'),P('48a040'),P('388830'),P('90e078')]
def grass(seed, dens=1.0):
    rnd=random.Random(seed); im=Image.new('RGBA',(16,16),G[1]); px=im.load()
    for y in range(16):
        for x in range(16):
            n=rnd.random()
            if n<.18: px[x,y]=G[0]
            elif n<.30: px[x,y]=G[2]
    for _ in range(int(5*dens)):  # blade tufts
        x,y=rnd.randrange(1,15),rnd.randrange(2,15)
        px[x,y]=G[3];px[x,y-1]=G[3];
        if x+1<16: px[x+1,y]=G[4]
        if x-1>=0: px[x-1,y-1]=G[5]
    return im
def save(im,p): os.makedirs(os.path.dirname(os.path.join(R,p)),exist_ok=True); im.save(os.path.join(R,p))
for i in range(4): save(grass(100+i, [1,1.6,.6,2.2][i]),f'tiles/grass{i}.png')
save(grass(100),'tiles/grass.png')
# tall grass
im=grass(7,.5);d=ImageDraw.Draw(im)
for bx in (1,6,11):
    for by in (3,10):
        d.polygon([(bx,by+5),(bx+1,by),(bx+2,by+3),(bx+3,by-1),(bx+4,by+5)],fill=P('309028'),outline=P('206818'))
        d.point([(bx+1,by+1),(bx+3,by)],fill=P('a0f088'))
save(im,'tiles/tallgrass.png')
# flowers
for k,(c,cc) in enumerate([('f05868','ffd0d8'),('f8e048','fffff0'),('ffffff','f8d040')]):
    im=grass(30+k,.7);px=im.load();rnd=random.Random(k)
    for _ in range(4):
        x,y=rnd.randrange(2,14),rnd.randrange(2,14)
        for dx,dy in ((0,-1),(1,0),(0,1),(-1,0)): px[x+dx,y+dy]=P(c)
        px[x,y]=P(cc); px[x,y+2]=G[4]
    save(im,f'tiles/flower{k}.png')
# --- autotile atlas: 40x32; col=state(0 interior,1 outer corner,2 edge top/bottom,3 edge left/right,4 inner corner), row=quadrant TL,TR,BL,BR
def blob(fill_fn, rim, rim2, base, rad=7, frame=0):
    A=Image.new("RGBA",(48,48))
    m=Image.new('L',(48,48),0); ImageDraw.Draw(m).rounded_rectangle([0,0,47,47],rad,fill=255)
    m2=Image.new('L',(48,48),0); ImageDraw.Draw(m2).rounded_rectangle([2,2,45,45],rad-2,fill=255)
    m3=Image.new('L',(48,48),0); ImageDraw.Draw(m3).rounded_rectangle([1,1,46,46],rad-1,fill=255)
    A.paste(Image.new('RGBA',(48,48),rim),(0,0),m); A.paste(Image.new('RGBA',(48,48),rim2),(0,0),m3)
    A.paste(fill_fn(48,frame),(0,0),m2)
    B=fill_fn(48,frame).copy()
    for ty in range(3):
        for tx in range(3):
            pass
    gm=Image.new('L',(48,48),0); ImageDraw.Draw(gm).ellipse([24-rad-1,24-rad-1,24+rad,24+rad],fill=255)
    g1=Image.new('L',(48,48),0); ImageDraw.Draw(g1).ellipse([24-rad,24-rad,24+rad-1,24+rad-1],fill=255)
    g2=Image.new('L',(48,48),0); ImageDraw.Draw(g2).ellipse([24-rad+1,24-rad+1,24+rad-2,24+rad-2],fill=255)
    B.paste(Image.new('RGBA',(48,48),rim2),(0,0),gm); B.paste(Image.new('RGBA',(48,48),rim),(0,0),g1)
    B.paste(Image.new('RGBA',(48,48),(0,0,0,0)),(0,0),g2)  # transparent: ground drawn underneath
    at=Image.new('RGBA',(40,32))
    # quadrant offsets inside tile
    Q=[(0,0),(8,0),(0,8),(8,8)]
    for q,(qx,qy) in enumerate(Q):
        sx=0 if qx==0 else 40; sy=0 if qy==0 else 40  # outer corner from A corners
        at.paste(A.crop((16+qx,16+qy,24+qx,24+qy)),(0,q*8))
        at.paste(A.crop((sx,sy,sx+8,sy+8)),(8,q*8))
        at.paste(A.crop((16+qx,sy,24+qx,sy+8)),(16,q*8))  # top/bottom edge
        at.paste(A.crop((sx,16+qy,sx+8,24+qy)),(24,q*8))  # left/right edge
        ix=24 if qx==0 else 16; iy=24 if qy==0 else 16
        at.paste(B.crop((ix,iy,ix+8,iy+8)),(32,q*8))
    return at
def water(n,frame):
    im=Image.new('RGBA',(n,n),P('3878e0'));d=ImageDraw.Draw(im);rnd=random.Random(5)
    for _ in range(n*n//40):
        x,y=rnd.randrange(n),rnd.randrange(n); x=(x+frame*2)%n
        d.line([(x,y),(x+3,y)],fill=P('68a8f8'))
    for _ in range(n*n//90):
        x,y=rnd.randrange(n),rnd.randrange(n); d.point((x,y),fill=P('2860c0'))
    return im
for f in (0,1): save(blob(water,P('d8c088'),P('f0e0a8'),None,frame=f).copy(),f'tiles/water-auto{f}.png')
def dirt(n,frame):
    im=Image.new('RGBA',(n,n),P('e0c888'));px=im.load();rnd=random.Random(9)
    for _ in range(n*n//8):
        x,y=rnd.randrange(n),rnd.randrange(n);px[x,y]=rnd.choice([P('d0b070'),P('ecd8a0'),P('c8a868')])
    return im
save(blob(dirt,P('48a040'),P('b89858'),None,rad=5),'tiles/path-auto.png')
def sand(n,frame):
    im=Image.new('RGBA',(n,n),P('f0e0a8'));px=im.load();rnd=random.Random(3)
    for _ in range(n*n//10):
        x,y=rnd.randrange(n),rnd.randrange(n);px[x,y]=rnd.choice([P('e0cc90'),P('fff0c0')])
    return im
save(blob(sand,P('48a040'),P('d8c088'),None,rad=6),'tiles/sand-auto.png')
# --- 2x2 trees (32x32)
def tree(kind):
    im=Image.new('RGBA',(32,32));d=ImageDraw.Draw(im)
    d.ellipse([5,26,27,31],fill=(0,0,0,70))
    d.rectangle([13,20,18,29],fill=P('6a4020'),outline=P('382010'));d.line([(14,21),(14,28)],fill=P('8a5a30'))
    if kind==0:
        O,D,M,L,H=P('184818'),P('287028'),P('389838'),P('58b848'),P('90d870')
        for (x0,y0,x1,y1) in [(2,6,18,22),(13,6,30,22),(6,0,26,16),(4,10,28,25)]: d.ellipse([x0,y0,x1,y1],fill=O)
        for (x0,y0,x1,y1) in [(3,7,17,21),(14,7,29,21),(7,1,25,15),(5,11,27,24)]: d.ellipse([x0,y0,x1,y1],fill=D)
        for (x0,y0,x1,y1) in [(5,7,16,18),(9,2,24,13),(15,8,27,18)]: d.ellipse([x0,y0,x1,y1],fill=M)
        for (x0,y0,x1,y1) in [(8,3,17,10),(6,9,12,14),(18,9,23,13)]: d.ellipse([x0,y0,x1,y1],fill=L)
        d.point([(10,4),(11,4),(7,10),(19,10),(14,6)],fill=H)
    else:
        O,D,M,L=P('103828'),P('1c5838'),P('287848'),P('48a060')
        for i,w in enumerate([3,6,8,10,12,13,14]):
            y=1+i*3; d.polygon([(16,y),(16-w,y+7),(16+w,y+7)],fill=O)
            d.polygon([(16,y+1),(17-w,y+6),(15+w,y+6)],fill=D)
            d.polygon([(16,y+1),(17-w,y+6),(16,y+6)],fill=M)
            d.line([(16,y+2),(18-w//2,y+5)],fill=L)
    return im
save(tree(0),'trees/tree2x2.png');save(tree(1),'trees/pine2x2.png')
# bridge planks
im=Image.new('RGBA',(16,16),P('a06830'));d=ImageDraw.Draw(im)
for y in range(0,16,4): d.line([(0,y),(15,y)],fill=P('603818')); d.line([(0,y+1),(15,y+1)],fill=P('c08848'))
d.rectangle([0,0,1,15],fill=P('503010'));d.rectangle([14,0,15,15],fill=P('503010'));save(im,'tiles/bridge.png')
# rock
im=Image.new('RGBA',(16,16));d=ImageDraw.Draw(im);d.ellipse([2,11,14,15],fill=(0,0,0,60))
d.polygon([(2,13),(3,6),(7,3),(12,4),(14,9),(13,13)],fill=P('8890a0'),outline=P('404858'));d.polygon([(5,6),(8,4),(11,5),(8,8)],fill=P('c8d0d8'))
save(im,'tiles/rock.png')
# gate post
im=Image.new('RGBA',(16,16));d=ImageDraw.Draw(im);d.rectangle([5,0,10,15],fill=P('f4f0e8'),outline=P('6a6070'));d.rectangle([4,0,11,2],fill=P('d0c8c0'),outline=P('6a6070'))
save(im,'tiles/gatepost.png')
print('art ok')
