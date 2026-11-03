#!/usr/bin/env python3
"""v23 'beautiful' GBA FireRed-style world art: multi-tone grass, soft autotiles (path/sand/water),
dense shaded trees, crops, farm props (windmill, silo, scarecrow, well, hay, pumpkins, flowerbeds).
Overwrites assets/world/tiles|trees|props. Hand-edited PNGs can replace any output."""
import os, math, random
from PIL import Image, ImageDraw
D=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'assets','world')
os.makedirs(os.path.join(D,'props'),exist_ok=True)
def H(h,a=255): return tuple(int(h[i:i+2],16) for i in (1,3,5))+(a,)
def new(w=16,h=16,c=None): return Image.new('RGBA',(w,h),H(c) if c else (0,0,0,0))
def px(im,x,y,c):
    if 0<=x<im.width and 0<=y<im.height: im.putpixel((x,y),H(c) if isinstance(c,str) else c)
def save(im,p): im.save(os.path.join(D,p)); print('wrote',p)
def hsh(x,y,s=0): return ((x*73856093)^(y*19349663)^(s*83492791))&0xffff
# ---------------- GRASS (seamless, 4 variants) ----------------
G0,G1,G2,G3,G4='#2f8a3c','#48a848','#68c058','#88d468','#b4e888'
def grass(seed,tufts=5,flowers=0):
    r=random.Random(seed); im=new(c=G2)
    # soft mid-tone mottling (seamless via wrap)
    for _ in range(26):
        x,y=r.randrange(16),r.randrange(16); c=r.choice([G1,G3,G3,G1,G2])
        for dx,dy in ((0,0),(1,0),(0,1)):
            if r.random()<.8: px(im,(x+dx)%16,(y+dy)%16,c)
    for _ in range(tufts):  # blade tufts: dark V with light tip
        x,y=r.randrange(16),r.randrange(16)
        for dx,dy,c in ((0,0,G0),(2,0,G0),(1,1,G0),(0,-1,G1),(2,-1,G1),(1,0,G1),(0,-2,G3),(2,-2,G4)):
            px(im,(x+dx)%16,(y+dy)%16,c)
    for _ in range(4): px(im,r.randrange(16),r.randrange(16),G4)
    for _ in range(flowers):
        x,y=r.randrange(1,15),r.randrange(1,15); c=r.choice(['#ffffff','#fff060','#ff90b0'])
        px(im,x,y,c); px(im,x+1,y,c);px(im,x-1,y,c);px(im,x,y-1,c);px(im,x,y+1,c);px(im,x,y,'#f8c030')
    return im
for i,(s,t,f) in enumerate([(1,5,0),(2,7,0),(3,3,1),(4,9,0)]):
    im=grass(s,t,f); save(im,f'tiles/grass{i}.png')
    if i==0: save(im,'tiles/grass.png')
# tall grass (weeds, chore spot): dense blades, dark base
tg=grass(9,0)
r=random.Random(5)
for x0 in range(0,16,3):
    for y0 in (4,10):
        x=x0+r.randint(0,1); y=y0+r.randint(0,2)
        for k in range(5): px(tg,x,y+k-2,G0 if k>2 else G1)
        px(tg,x+1,y-2,G3);px(tg,x-1,y-1,G1);px(tg,x,y-3,G4);px(tg,x+1,y+2,G0)
save(tg,'tiles/tallgrass.png')
# flowers (3 colours) on grass
for i,(pc,cc) in enumerate([('#f05868','#ffe080'),('#f8e048','#e07020'),('#ffffff','#f8c030')]):
    im=grass(20+i,2); r=random.Random(30+i)
    for (x,y) in [(3,4),(11,3),(7,9),(2,12),(12,12)]:
        x+=r.randint(-1,1);y+=r.randint(-1,1)
        px(im,x,y+2,G0);px(im,x,y+3,G0)
        for dx,dy in ((-1,0),(1,0),(0,-1),(0,1)): px(im,x+dx,y+dy,pc)
        px(im,x,y,cc); px(im,x+1,y+1,'#00000040' if False else G1)
    save(im,f'tiles/flower{i}.png')
# ---------------- AUTOTILES (atlas 40x32: col=state, row=quadrant TL,TR,BL,BR) ----------------
def atlas(fill,edge_off=0.0,r_out=6.0):
    """fill(gx,gy,d) -> colour or None, d = distance (px) from the outer edge of the region."""
    im=new(40,32)
    for q,(sx,sy) in enumerate([(-1,-1),(1,-1),(-1,1),(1,1)]):
        for st in range(5):
            for y in range(8):
                for x in range(8):
                    dx=x+.5 if sx<0 else 7.5-x; dy=y+.5 if sy<0 else 7.5-y
                    if st==0: d=99
                    elif st==2: d=dy
                    elif st==3: d=dx
                    elif st==1:
                        d=(r_out-math.hypot(r_out-dx,r_out-dy)) if dx<r_out and dy<r_out else min(dx,dy)
                    else: d=math.hypot(dx,dy)-1.0
                    # wobble so edges look organic, not ruler-straight
                    gx=x+(0 if sx<0 else 8); gy=y+(0 if sy<0 else 8)
                    d+=((hsh(gx+st*3,gy+q*5)%7)-3)*.18
                    c=fill(gx,gy,d-edge_off)
                    if c: im.putpixel((st*8+x,q*8+y),H(c) if isinstance(c,str) else c)
    return im
def pathfill(gx,gy,d):
    if d<0.6: return None
    if d<1.6: return '#a88a58'
    if d<2.6: return '#c8a66c'
    h=hsh(gx,gy,7)%23
    return '#b8945e' if h==0 else '#d4b47a' if h<4 else '#f0dcac' if h<6 else '#e4c890'
save(atlas(pathfill),'tiles/path-auto.png')
def sandfill(gx,gy,d):
    if d<0.5: return None
    if d<1.5: return '#d8c088'
    h=hsh(gx,gy,9)%19
    return '#e8cc8c' if h<3 else '#fff4d0' if h<5 else '#f8e6b0'
save(atlas(sandfill),'tiles/sand-auto.png')
def waterfill(frame):
    def f(gx,gy,d):
        if d<0.4: return None
        if d<1.4: return '#f8fcff'     # foam line
        if d<2.4: return '#a8e0f8'     # shallows
        if d<3.6: return '#68b8f0'
        h=hsh(gx+frame*5,gy,3)%29
        wave=((gx+gy*2+frame*3)%16)<2 and (gy%5==(frame*2)%5)
        if wave: return '#a0d8ff'
        return '#ffffff' if h==0 else '#3a88e0' if (gx//4+gy//3+frame)%3 else '#4898e8'
    return f
for fr in (0,1): save(atlas(waterfill(fr)),f'tiles/water-auto{fr}.png')
# ---------------- TREES 32x32 ----------------
def blob_canopy(im,cx,cy,rad,pal,seed,lumps=7):
    r=random.Random(seed); d=ImageDraw.Draw(im)
    pts=[(cx+math.cos(a)*rad*.55,cy+math.sin(a)*rad*.45) for a in [i*2*math.pi/lumps+r.random()*.4 for i in range(lumps)]]
    # outline pass then 4 shading passes, light from top-left
    for (x,y) in pts+[(cx,cy)]:
        rr=rad*.55; d.ellipse([x-rr-1,y-rr-1,x+rr+1,y+rr+1],fill=H(pal[0]))
    for (x,y) in pts+[(cx,cy)]:
        rr=rad*.55; d.ellipse([x-rr,y-rr,x+rr,y+rr],fill=H(pal[1]))
    for (x,y) in pts+[(cx,cy)]:
        rr=rad*.42; d.ellipse([x-rr-1,y-rr-2,x+rr-1,y+rr-2],fill=H(pal[2]))
    for (x,y) in pts:
        if y<cy+1 and x<cx+3: rr=rad*.26; d.ellipse([x-rr-1,y-rr-2,x+rr-1,y+rr-2],fill=H(pal[3]))
    for _ in range(18):  # leaf texture
        x=int(cx+r.uniform(-rad,rad)*.8); y=int(cy+r.uniform(-rad,rad)*.65)
        if im.getpixel((x,y))[3] and im.getpixel((x,y))[:3]!=H(pal[0])[:3]:
            px(im,x,y,pal[1] if y>cy else pal[4]); px(im,x+1,y,pal[0] if y>cy+3 else pal[2])
def tree2(seed,pal,fruit=None):
    im=new(32,32); d=ImageDraw.Draw(im)
    d.ellipse([5,25,27,31],fill=(10,40,20,90))
    d.rectangle([13,19,18,28],fill=H('#4a2c14')); d.rectangle([14,19,16,28],fill=H('#7a4a22')); px(im,15,22,'#a06a34');px(im,14,25,'#a06a34')
    px(im,12,28,'#4a2c14');px(im,19,28,'#4a2c14')
    blob_canopy(im,16,12,13,pal,seed)
    if fruit:
        r=random.Random(seed+9)
        for _ in range(9):
            x,y=r.randint(6,25),r.randint(5,19)
            if im.getpixel((x,y))[3]: px(im,x,y,fruit);px(im,x+1,y,fruit);px(im,x,y+1,'#901820');px(im,x+1,y+1,fruit);px(im,x,y-1,'#ffd0d0')
    return im
LEAF=['#103820','#1f6a34','#3a9a44','#6cc85a','#a8e878']
save(tree2(3,LEAF),'trees/tree2x2.png')
save(tree2(7,['#183818','#2a6a2a','#4a9a38','#88c850','#c8f080'],'#e83838'),'trees/apple2x2.png')
# pine: stacked shaded tiers
pi=new(32,32); d=ImageDraw.Draw(pi); d.ellipse([7,26,25,31],fill=(10,40,20,90))
d.rectangle([14,24,17,29],fill=H('#4a2c14')); d.rectangle([15,24,16,29],fill=H('#7a4a22'))
for i,(y0,w) in enumerate([(1,5),(6,8),(11,11),(16,14)]):
    y1=y0+9
    d.polygon([(16,y0-1),(16-w-1,y1),(16+w+1,y1)],fill=H('#0c2c1c'))
    d.polygon([(16,y0),(16-w,y1-1),(16+w,y1-1)],fill=H('#1c5a34'))
    d.polygon([(16,y0+1),(16-w+2,y1-2),(17,y1-2)],fill=H('#2e7a40'))
    d.polygon([(15,y0+2),(16-w+4,y1-3),(15,y1-4)],fill=H('#4c9c4c'))
    for x in range(16-w+1,16+w,3): px(pi,x,y1-1,'#0c2c1c'); px(pi,x+1,y1-2,'#1c5a34')
px(pi,16,1,'#a8e090')
save(pi,'trees/pine2x2.png')
# small 1x1 tree kept for legacy
t1=tree2(3,LEAF).resize((16,16),Image.NEAREST); save(t1,'trees/tree.png')
# ---------------- FIELD / CROPS ----------------
def soil(seed=0):
    im=new(c='#8a5a30'); r=random.Random(seed)
    for y in range(16):
        for x in range(16):
            if y%4==0: px(im,x,y,'#6a4020')
            elif y%4==1: px(im,x,y,'#a87040')
            elif r.random()<.08: px(im,x,y,'#9a6838')
    return im
save(soil(),'tiles/field.png')
corn=soil(1); d=ImageDraw.Draw(corn)
for x in (3,11):
    d.line([x,15,x,1],fill=H('#2e7a30')); d.line([x+1,15,x+1,3],fill=H('#4aa040'))
    for y,s in ((4,-1),(8,1),(11,-1)):
        d.line([x,y,x+3*s,y+3],fill=H('#5cb84a')); px(corn,x+3*s,y+3,'#88d868')
    d.rectangle([x+1,5,x+2,9],fill=H('#f0c838')); px(corn,x+1,5,'#fff080'); px(corn,x+2,9,'#c89020'); px(corn,x,4,'#e8e0a0')
save(corn,'tiles/corn.png')
wh=soil(2); r=random.Random(4)
for x in range(0,16,2):
    hgt=r.randint(9,12); d=ImageDraw.Draw(wh); d.line([x+1,15,x+1,15-hgt],fill=H('#c89830'))
    for k in range(4): px(wh,x+(k%2)*2,15-hgt+k,'#f8d868'); px(wh,x+1,15-hgt+k,'#e8b840')
    px(wh,x+1,15-hgt-1,'#fff0a0')
save(wh,'tiles/wheat.png')
pk=soil(3); d=ImageDraw.Draw(pk)
d.line([0,4,16,6],fill=H('#3a8a30')); 
d.ellipse([2,6,13,14],fill=H('#a84808')); d.ellipse([3,6,12,13],fill=H('#e87818')); d.ellipse([4,7,7,10],fill=H('#f8a848'))
d.line([7,6,7,13],fill=H('#c85c10')); px(pk,7,5,'#3a6a20'); px(pk,8,4,'#3a6a20'); px(pk,10,5,'#5ab040'); px(pk,11,5,'#5ab040')
save(pk,'tiles/pumpkin.png')
# flower bed: dark soil border + dense blooms
fb=new(c='#6a4020'); r=random.Random(11)
for y in range(1,15):
    for x in range(1,15): px(fb,x,y,'#3a8a3a' if r.random()<.5 else '#2a6a30')
for (x,y) in [(3,3),(8,2),(12,4),(5,8),(10,8),(3,12),(8,12),(12,11)]:
    c=r.choice(['#f05868','#f8e048','#c070f0','#ffffff','#ff9040'])
    for dx,dy in ((-1,0),(1,0),(0,-1),(0,1)): px(fb,x+dx,y+dy,c)
    px(fb,x,y,'#fff0a0')
for i in range(16): px(fb,i,0,'#8a5a30');px(fb,0,i,'#8a5a30');px(fb,i,15,'#4a2c14');px(fb,15,i,'#4a2c14')
save(fb,'tiles/flowerbed.png')
# ---------------- FENCE (wooden ranch rail) + rock + sign ----------------
f=new()
for x0 in (1,10):
    for y in range(3,15): px(f,x0,y,'#5a3418');px(f,x0+1,y,'#b07a44');px(f,x0+2,y,'#8a5a2e');px(f,x0+3,y,'#4a2810')
    px(f,x0+1,2,'#d09a5c');px(f,x0+2,2,'#b07a44')
for yy in (5,10):
    for x in range(16): px(f,x,yy,'#d49e60');px(f,x,yy+1,'#9a6634');px(f,x,yy+2,'#5a3418')
for x in range(1,15): px(f,x,15,(10,40,20,80))
save(f,'tiles/fence.png')
rk=new(); d=ImageDraw.Draw(rk); d.ellipse([1,9,15,15],fill=(10,40,20,80)); d.ellipse([1,3,14,14],fill=H('#3a4050'))
d.ellipse([2,3,13,12],fill=H('#7c8494')); d.ellipse([3,4,10,9],fill=H('#a4acbc')); px(rk,5,5,'#dce0ea');px(rk,6,5,'#dce0ea')
for x,y in ((9,9),(10,10),(4,10)): px(rk,x,y,'#5c6474')
px(rk,3,6,'#5aa848');px(rk,4,5,'#5aa848');px(rk,11,4,'#5aa848')
save(rk,'tiles/rock.png')
# ---------------- PROPS ----------------
def shadow(d,x0,y0,x1,y1): d.ellipse([x0,y0,x1,y1],fill=(10,40,20,85))
# windmill 48x80 (footprint 3x2 tiles at bottom; drawn so bottom aligns with footprint)
wm=new(48,80); d=ImageDraw.Draw(wm); shadow(d,4,70,46,79)
d.polygon([(12,76),(17,28),(31,28),(36,76)],fill=H('#5a3a20'))
d.polygon([(13,75),(18,29),(30,29),(35,75)],fill=H('#f0e6d0'))
d.polygon([(25,29),(30,29),(35,75),(28,75)],fill=H('#c8b898'))
for y in range(34,75,5): d.line([(14+ (75-y)*0.1,y),(34-(75-y)*0.1,y)],fill=H('#d8ccb0'))
d.rectangle([20,60,28,76],fill=H('#7a2a1c'),outline=H('#3a1a10')); d.line([24,60,24,76],fill=H('#5a1a10')); px(wm,27,68,'#ffd84a')
d.rectangle([21,42,27,48],fill=H('#8ad0ff'),outline=H('#5a3a20')); d.line([24,42,24,48],fill=H('#5a3a20'))
d.polygon([(14,30),(24,16),(34,30)],fill=H('#3a1a10')); d.polygon([(15,29),(24,17),(33,29)],fill=H('#c0402a')); d.polygon([(24,17),(33,29),(26,29)],fill=H('#8a2a1c'))
d.ellipse([21,21,27,27],fill=H('#6a4020'),outline=H('#2a1408'))  # hub; sails are animated in code
save(wm,'props/windmill.png')
# silo 32x64 (footprint 2x2)
si=new(32,64); d=ImageDraw.Draw(si); shadow(d,1,56,31,63)
d.rectangle([3,14,28,60],fill=H('#5a6878')); d.rectangle([4,14,27,60],fill=H('#a8b4c4'))
d.rectangle([4,14,9,60],fill=H('#dce4ee')); d.rectangle([21,14,27,60],fill=H('#7c8898'))
for y in range(20,60,7): d.line([4,y,27,y],fill=H('#6a7888'))
d.pieslice([2,2,29,28],180,360,fill=H('#c0402a'),outline=H('#3a1a10')); d.pieslice([6,5,16,22],180,270,fill=H('#e86850'))
d.rectangle([12,44,19,60],fill=H('#7a2a1c'),outline=H('#3a1a10'))
for y in range(22,42,3): d.line([24,y,26,y],fill=H('#3a4450'))
save(si,'props/silo.png')
# scarecrow 16x32
sc=new(16,32); d=ImageDraw.Draw(sc); shadow(d,3,27,13,31)
d.line([8,10,8,30],fill=H('#6a4020'),width=2); d.line([1,14,15,14],fill=H('#6a4020'),width=2)
d.rectangle([4,13,11,22],fill=H('#c04848')); d.rectangle([4,16,11,17],fill=H('#e8c040'))
for x in (1,2,14,15): px(sc,x,15,'#f0d060'); px(sc,x,16,'#d8b040')
d.ellipse([4,5,11,12],fill=H('#f0d8a0')); px(sc,6,8,'#3a2010');px(sc,9,8,'#3a2010');d.line([6,10,9,10],fill=H('#8a4020'))
d.polygon([(2,6),(8,0),(14,6)],fill=H('#8a6030')); d.rectangle([1,5,14,6],fill=H('#6a4820'))
for x in (4,6,10): px(sc,x,23,'#f0d060');px(sc,x,24,'#d8b040')
save(sc,'props/scarecrow.png')
# well 32x32
we=new(32,32); d=ImageDraw.Draw(we); shadow(d,2,24,30,31)
d.ellipse([4,16,28,28],fill=H('#5c6474')); d.ellipse([5,16,27,26],fill=H('#9aa2b2')); d.ellipse([9,18,23,23],fill=H('#1a3a6a'))
for x in range(6,27,4): d.line([x,23,x,27],fill=H('#6c7484'))
d.line([7,6,7,21],fill=H('#5a3418'),width=2); d.line([25,6,25,21],fill=H('#5a3418'),width=2)
d.polygon([(3,8),(16,1),(29,8)],fill=H('#3a1a10')); d.polygon([(4,8),(16,2),(28,8)],fill=H('#c0402a'))
d.line([8,11,24,11],fill=H('#8a5a2e')); d.line([16,11,16,18],fill=H('#c8b898')); d.rectangle([14,17,18,20],fill=H('#8a5a2e'))
save(we,'props/well.png')
# hay bale 16x16
hb=new(); d=ImageDraw.Draw(hb); shadow(d,1,11,15,15)
d.rounded_rectangle([1,3,14,13],3,fill=H('#c89830')); d.rounded_rectangle([1,3,14,10],3,fill=H('#f0cc58'))
for x in (5,10): d.line([x,3,x,13],fill=H('#9a6a20'))
for y in (5,8): d.line([2,y,13,y],fill=H('#e0b840'))
save(hb,'props/hay.png')
# mailbox / water trough 32x16
tr=new(32,16); d=ImageDraw.Draw(tr); shadow(d,1,10,31,15)
d.polygon([(2,5),(30,5),(27,13),(5,13)],fill=H('#6a4020')); d.rectangle([4,5,28,8],fill=H('#68b8f0')); d.line([4,6,10,6],fill=H('#c8f0ff'))
save(tr,'props/trough.png')
# farmhouse 64x64 (footprint 3x2 tiles; drawn at x-8, 2 tiles above footprint; door = bottom middle)
fh=new(64,64); d=ImageDraw.Draw(fh); shadow(d,4,56,62,63)
d.rectangle([8,28,55,61],fill=H('#5a3418'))
for y in range(29,61,3): d.rectangle([9,y,54,y+2],fill=H('#e8d4a8') if (y//3)%2 else H('#dcc494'))
d.rectangle([9,29,12,60],fill=H('#c8b080'))
d.rectangle([5,58,58,61],fill=H('#7a7a84'))  # porch step
d.polygon([(2,32),(32,6),(62,32)],fill=H('#3a1a10')); d.polygon([(4,31),(32,8),(60,31)],fill=H('#c84a2a'))
for i,y in enumerate(range(12,31,3)):
    w=int((y-8)*28/23); d.line([32-w,y,32+w,y],fill=H('#a03820'))
    for x in range(32-w+(i%2)*3,32+w,6): px(fh,x,y+1,'#a03820')
d.polygon([(32,8),(60,31),(46,31)],fill=H('#a83c22'))
d.rectangle([44,6,50,18],fill=H('#7a3020'),outline=H('#3a1a10')); d.rectangle([43,5,51,7],fill=H('#5a2418'))
d.ellipse([26,16,38,26],fill=H('#f8f0d8'),outline=H('#5a3418')); d.line([32,16,32,26],fill=H('#5a3418')); d.line([26,21,38,21],fill=H('#5a3418'))
for x0 in (13,41):
    d.rectangle([x0,36,x0+10,46],fill=H('#8ad0ff'),outline=H('#f8f8f0')); d.line([x0+5,36,x0+5,46],fill=H('#f8f8f0')); d.line([x0,41,x0+10,41],fill=H('#f8f8f0'))
    px(fh,x0+2,38,'#e8f8ff');px(fh,x0+3,38,'#e8f8ff');px(fh,x0+2,39,'#e8f8ff')
    d.rectangle([x0-2,36,x0-1,46],fill=H('#3a7a40')); d.rectangle([x0+11,36,x0+12,46],fill=H('#3a7a40'))
    d.rectangle([x0-1,47,x0+11,49],fill=H('#6a4020'))
    for k in range(0,11,3): px(fh,x0+k,46,'#f05868'); px(fh,x0+k+1,46,'#f8e048')
d.rectangle([27,42,36,58],fill=H('#7a3a1c'),outline=H('#3a1a10')); d.rectangle([29,44,34,49],fill=H('#9a5a2c')); d.rectangle([29,51,34,56],fill=H('#9a5a2c')); px(fh,35,51,'#ffd84a')
d.rectangle([24,38,39,40],fill=H('#5a3418'))
save(fh,'buildings/farmhouse.png')
print('done')
