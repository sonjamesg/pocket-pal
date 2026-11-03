#!/usr/bin/env python3
"""v26 pseudo-3D western farm buildings (original designs; ref used only for volume: tall facade,
roof seen from above, eaves overhang, side face, baked shading). Sprites are bottom-aligned on their
footprint and rise 2 tiles above it so the player walks *behind* roofs (Y-sorted in overworld-draw.js)."""
import os,random
from PIL import Image, ImageDraw
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));OUT=os.path.join(ROOT,'assets','world')
OL=(44,26,30,255)
def C(h): h=h.lstrip('#');return tuple(int(h[i:i+2],16) for i in (0,2,4))+(255,)
def sh(c,k): return tuple(max(0,min(255,int(v*k))) for v in c[:3])+(255,)
def plank(d,box,c,vert=True,step=4,noise=True):
    x0,y0,x1,y1=box;d.rectangle(box,fill=c)
    if vert:
        for x in range(x0+step,x1,step): d.line([x,y0,x,y1],fill=sh(c,.78)); d.line([x+1,y0,x+1,y1],fill=sh(c,1.08))
    else:
        for y in range(y0+step,y1,step): d.line([x0,y,x1,y],fill=sh(c,.78)); d.line([x0,y+1,x1,y+1],fill=sh(c,1.08))
    if noise:
        r=random.Random(x0*7+y0)
        for _ in range((x1-x0)*(y1-y0)//40): d.point((r.randint(x0,x1),r.randint(y0,y1)),fill=sh(c,.88))
def shingles(im,poly,c,top,bot,rowh=3):
    m=Image.new('L',im.size,0);ImageDraw.Draw(m).polygon(poly,fill=255)
    L=Image.new('RGBA',im.size,(0,0,0,0));d=ImageDraw.Draw(L);n=max(1,bot-top)
    for y in range(top,bot+1):
        f=(y-top)/n;base=sh(c,1.18-.38*f)     # lit at the ridge, darker toward the eave
        d.line([0,y,im.width,y],fill=base)
        if (y-top)%rowh==rowh-1:
            d.line([0,y,im.width,y],fill=sh(base,.72))
        elif (y-top)%rowh==0:
            off=((y-top)//rowh%2)*3
            for x in range(off,im.width,6): d.point((x,y),fill=sh(base,.72))
    im.paste(L,(0,0),m);ImageDraw.Draw(im).polygon(poly,outline=OL)
def window(d,x,y,w=7,h=7,trim=C('#f4eee0'),shut=None):
    d.rectangle([x-1,y-1,x+w+1,y+h+1],fill=OL);d.rectangle([x,y,x+w,y+h],fill=trim)
    d.rectangle([x+1,y+1,x+w-1,y+h-1],fill=C('#6aa8e0'));d.line([x+1,y+1,x+w-1,y+1],fill=C('#c8ecff'));d.point((x+2,y+2),fill=C('#ffffff'))
    d.line([x+w//2,y,x+w//2,y+h],fill=trim);d.line([x,y+h//2,x+w,y+h//2],fill=trim)
    d.line([x-1,y+h+2,x+w+1,y+h+2],fill=sh(trim,.7))   # sill
    if shut: d.rectangle([x-4,y,x-2,y+h],fill=shut,outline=OL);d.rectangle([x+w+2,y,x+w+4,y+h],fill=shut,outline=OL)
def xdoor(d,x0,y0,x1,y1,c,trim=C('#f4eee0')):
    d.rectangle([x0-1,y0-1,x1+1,y1],fill=OL);d.rectangle([x0,y0,x1,y1],fill=c)
    for x in range(x0+2,x1,3): d.line([x,y0,x,y1],fill=sh(c,.8))
    d.rectangle([x0,y0,x1,y1],outline=trim);mx=(x0+x1)//2;d.line([mx,y0,mx,y1],fill=trim)
    d.line([x0,y0,mx,y1],fill=trim);d.line([mx,y0,x0,y1],fill=trim);d.line([mx,y0,x1,y1],fill=trim);d.line([x1,y0,mx,y1],fill=trim)
def pdoor(d,x0,y0,x1,y1,c):
    d.rectangle([x0-1,y0-1,x1+1,y1],fill=OL);d.rectangle([x0,y0,x1,y1],fill=c);d.rectangle([x0+1,y0+1,x1-1,y0+4],fill=sh(c,1.15))
    d.rectangle([x0+1,y0+7,x1-1,y1-2],outline=sh(c,.75));d.point((x1-2,(y0+y1)//2+1),fill=C('#ffd84a'))
    d.rectangle([x0-2,y1+1,x1+2,y1+1],fill=C('#8a8a90'))   # stone step
def side_face(im,x,y0,y1,w,c):  # receding right-hand wall = volume
    d=ImageDraw.Draw(im)
    for i in range(w): d.line([x+i,y0+i//2,x+i,y1],fill=sh(c,.62-.04*i))
    d.line([x+w,y0+w//2,x+w,y1],fill=OL)
def ground_shadow(d,x0,x1,y):
    d.rectangle([x0,y,x1,y+1],fill=(20,40,20,90))
def chimney(d,x,y,h=10,c=C('#a04a3a')):
    d.rectangle([x-1,y-1,x+6,y+h],fill=OL);d.rectangle([x,y,x+5,y+h],fill=c)
    for yy in range(y+2,y+h,3): d.line([x,yy,x+5,yy],fill=sh(c,.75))
    d.line([x+4,y,x+4,y+h],fill=sh(c,.7));d.rectangle([x-2,y-2,x+7,y],fill=sh(c,.6),outline=OL)

# ---------- generic gabled-ridge building, seen 3/4 from the front ----------
def house(W,H,wall,roof,wallh,door='plank',dcol=C('#7a3a22'),wins=(),chim=None,trim=C('#f4eee0'),siding=False,porch=False,sign=None):
    im=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(im);sw=4
    wy0=H-2-wallh;ground_shadow(d,2,W-1,H-2)
    # front wall
    plank(d,[2,wy0,W-sw-3,H-3],wall,vert=not siding,step=3 if siding else 4)
    side_face(im,W-sw-2,wy0-2,H-3,sw,wall)
    d.rectangle([2,wy0,W-sw-3,H-3],outline=OL)
    d.line([3,wy0+1,W-sw-4,wy0+1],fill=(0,0,0,70));d.line([3,wy0+2,W-sw-4,wy0+2],fill=(0,0,0,40))  # eave shadow
    d.rectangle([3,H-5,W-sw-4,H-4],fill=sh(wall,.6))  # foundation
    # roof: back slope (lit) + front slope, overhanging the wall
    ry=4;ridge=ry+(wy0-ry)*2//5
    if chim: chimney(d,chim,1,ridge-1)
    shingles(im,[(4,ry),(W-6,ry),(W-1,ridge),(W-1,wy0),(0,wy0),(0,ridge)],roof,ry,wy0)
    d=ImageDraw.Draw(im);d.line([1,ridge,W-2,ridge],fill=sh(roof,1.35));d.line([1,ridge+1,W-2,ridge+1],fill=sh(roof,.6))
    d.rectangle([0,wy0-1,W-1,wy0],fill=sh(roof,.45));d.line([0,wy0+1,W-1,wy0+1],fill=OL)  # fascia/overhang lip
    if chim: chimney(d,chim,1,min(ridge-1,8))
    for wx,wyo in wins: window(d,wx,wy0+wyo,shut=sh(roof,.8))
    dx=(W-sw)//2-5
    if door=='plank': pdoor(d,dx,H-17,dx+9,H-5,dcol)
    else: xdoor(d,dx-3,H-19,dx+12,H-5,dcol,trim)
    if porch:
        d.rectangle([dx-8,H-22,dx+17,H-20],fill=sh(roof,.55),outline=OL)
        for px in (dx-7,dx+15): d.rectangle([px,H-20,px+1,H-5],fill=trim)
    if sign:
        sx,sy,txtc,col=sign;d.rectangle([sx,sy,sx+len(txtc)*4+3,sy+6],fill=col,outline=OL)
    return im,d

# ---------- gambrel barn with front gable + hayloft ----------
def barn(W,H,wall,roof,trim=C('#f4eee0'),hay=True,stalls=0,cupola=False,lowroof=False):
    im=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(im);sw=5;fw=W-sw-3
    ground_shadow(d,2,W-1,H-2)
    eave=H-30 if lowroof else H-34;top=6 if not cupola else 12;mx=(2+fw)//2
    # roof receding behind the gable (seen from above): long strip
    shingles(im,[(mx-3,top-3),(W-2,top+2),(W-1,eave+2),(fw,eave+2),(fw,top+4)],roof,top-3,eave)
    d=ImageDraw.Draw(im)
    gam=[(0,eave+2),(6,eave-(eave-top)//2),(mx,top),(fw+4,eave-(eave-top)//2),(fw+3,eave+2)]
    side_face(im,fw+1,eave,H-3,sw,wall)
    # gable facade
    m=Image.new('L',im.size,0);md=ImageDraw.Draw(m);md.polygon([(2,eave+2),(8,eave-(eave-top)//2+2),(mx,top+3),(fw-4,eave-(eave-top)//2+2),(fw,eave+2)],fill=255);md.rectangle([2,eave+2,fw,H-3],fill=255)
    L=Image.new('RGBA',im.size,(0,0,0,0));plank(ImageDraw.Draw(L),[0,0,W-1,H-1],wall);im.paste(L,(0,0),m);d=ImageDraw.Draw(im)
    d.line(gam,fill=OL,width=4);d.line([(p[0],p[1]+1) for p in gam],fill=sh(roof,.9),width=2)  # roof trim edge
    d.line([2,eave+3,fw,eave+3],fill=trim);d.rectangle([2,eave+2,fw,H-3],outline=OL)
    d.rectangle([3,H-5,fw-1,H-4],fill=sh(wall,.55))
    if cupola:
        d.rectangle([mx-4,top-10,mx+4,top-1],fill=trim,outline=OL);d.rectangle([mx-2,top-8,mx+2,top-3],fill=OL)
        d.polygon([(mx-6,top-10),(mx,top-15),(mx+6,top-10)],fill=sh(roof,.8),outline=OL);d.line([mx,top-20,mx,top-15],fill=OL);d.line([mx-2,top-19,mx+3,top-19],fill=OL)
    if hay:
        hy=top+(eave-top)//2-2;d.rectangle([mx-6,hy,mx+6,hy+10],fill=OL);d.rectangle([mx-5,hy+1,mx+5,hy+9],fill=C('#3a2418'))
        d.rectangle([mx-5,hy+6,mx+5,hy+9],fill=C('#e8c050'));d.line([mx-4,hy+6,mx+4,hy+5],fill=C('#f8e080'))
        d.rectangle([mx-6,hy,mx+6,hy+10],outline=trim);d.line([mx-1,hy-3,mx-1,hy],fill=OL);d.rectangle([mx-2,hy-4,mx,hy-3],fill=C('#808080'))
    dw=14 if W>64 else 10;xdoor(d,mx-dw//2,H-21,mx+dw//2,H-5,sh(wall,.8),trim)
    for i in range(stalls):
        for sx in (mx-dw//2-12-i*14,mx+dw//2+5+i*14):
            if 4<sx and sx+7<fw: window(d,sx,eave+8,w=7,h=6,trim=trim)
    return im,d

def save(im,p): im.save(os.path.join(OUT,p))

# footprints (tiles): coop 4x3, cowbarn 6x3, stable 6x3, sheepshed 4x3, sty 4x3, feed/tool 3x2, farmhouse 3x2 (drawn 4 wide), store 3x2, doghouse 3x2, silo 2x2
R=lambda w,h:(w*16,(h+2)*16)
im,d=barn(*R(6,3),C('#b8322a'),C('#5a5e6a'),stalls=1,cupola=True);save(im,'buildings/cowbarn.png')
im,d=barn(*R(6,3),C('#8a5432'),C('#3e6a48'),hay=True,stalls=2);  # stable: horse-head half doors
for x in (12,74):
    d.rectangle([x,58,x+9,73],fill=OL);d.rectangle([x+1,59,x+8,72],fill=C('#5a3420'));d.rectangle([x+1,66,x+8,72],fill=C('#a06a40'));d.line([x+1,66,x+8,66],fill=C('#f4eee0'))
save(im,'buildings/stable.png')
im,d=house(*R(4,3),C('#e8c070'),C('#c0402a'),30,door='x',dcol=C('#a0623a'),wins=((8,8),),siding=True)
for i in range(3): d.rectangle([40+i*5,68,43+i*5,73],fill=C('#7a5030'))  # chicken ramp
d.line([38,74,54,66],fill=C('#7a5030'),width=2);d.ellipse([47,10,53,15],fill=C('#ffd84a'),outline=OL);save(im,'buildings/coop.png')
im,d=house(*R(4,3),C('#f0ead8'),C('#4a6aa8'),30,door='x',dcol=C('#7a8aa0'),wins=((6,8),(44,8)),siding=True);save(im,'buildings/sheepshed.png')
im,d=house(*R(4,3),C('#c89060'),C('#7a4a2a'),24,door='x',dcol=C('#8a5a3a'),wins=((8,6),))
d.rectangle([2,72,58,77],fill=C('#7a5030'));[d.rectangle([x,64,x+1,77],fill=C('#a07040')) for x in range(2,58,6)];d.line([2,66,58,66],fill=C('#a07040'));save(im,'buildings/sty.png')
im,d=house(*R(3,2),C('#c8a060'),C('#8a3a2a'),24,door='x',dcol=C('#9a6a3a'));d.rectangle([4,40,13,47],fill=C('#e8c050'),outline=OL);save(im,'buildings/feedshed.png')
im,d=house(*R(3,2),C('#8a8a7a'),C('#5a4a3a'),24,door='x',dcol=C('#6a5a4a'));d.line([6,44,6,54],fill=C('#6a4020'),width=1);d.rectangle([4,42,9,44],fill=C('#b0b0b8'));save(im,'buildings/toolshed.png')
im,d=house(64,80,C('#f4e4c4'),C('#3a62b0'),36,door='plank',dcol=C('#a03a2a'),wins=((7,10),(44,10)),chim=44,siding=True,porch=True)
window(d,26,46,w=6,h=5);save(im,'buildings/farmhouse.png')
# pet store: false-front western storefront with awning + paw sign
im=Image.new('RGBA',(48,64),(0,0,0,0));d=ImageDraw.Draw(im);ground_shadow(d,2,47,62)
shingles(im,[(6,10),(44,14),(47,30),(40,30),(40,14)],C('#7a4a2a'),10,30);d=ImageDraw.Draw(im)
side_face(im,40,12,61,5,C('#4aa890'))
plank(d,[2,4,40,61],C('#4aa890'),vert=False,step=3);d.rectangle([2,4,40,61],outline=OL)
d.rectangle([1,2,41,5],fill=C('#2a6a5a'),outline=OL)
d.rectangle([6,9,36,19],fill=C('#fff4dc'),outline=OL)
for (cx,cy) in ((14,14),(28,14)): d.ellipse([cx-2,cy-1,cx+2,cy+3],fill=C('#ff5a8b'));[d.point(p,fill=C('#ff5a8b')) for p in ((cx-3,cy-2),(cx-1,cy-3),(cx+1,cy-3),(cx+3,cy-2))]
d.line([19,12,23,16],fill=C('#c0405a'));d.line([19,16,23,12],fill=C('#c0405a'))
for i in range(7): d.polygon([(2+i*6,30),(8+i*6,30),(8+i*6,36),(5+i*6,38),(2+i*6,36)],fill=C('#ff5a8b') if i%2==0 else C('#fff4f4'),outline=OL)
window(d,5,42,w=8,h=9);window(d,29,42,w=8,h=9);pdoor(d,17,46,25,59,C('#ff8a40'))
save(im,'buildings/petstore.png')
# doghouse 48x48 (3x2 slot drawn from 1 tile above)
im,d=house(48,48,C('#c84a3a'),C('#f0ead8'),18,door='x');d.rectangle([18,36,26,45],fill=OL);d.ellipse([18,32,26,40],fill=OL);d.rectangle([16,22,28,26],fill=C('#6a4020'),outline=OL);save(im,'buildings/doghouse.png')
# silo 32x80: cylinder with lit left / dark right bands + dome
im=Image.new('RGBA',(32,80),(0,0,0,0));d=ImageDraw.Draw(im);ground_shadow(d,2,31,78)
for x in range(3,29):
    f=(x-3)/25;k=1.25-abs(f-.3)*1.3;d.line([x,14,x,76],fill=sh(C('#b8bcc8'),k))
for y in range(18,76,6): d.arc([3,y-2,28,y+2],0,180,fill=C('#7a7e90'))
d.rectangle([3,14,28,76],outline=OL)
for x in range(3,29):
    f=(x-3)/25;k=1.25-abs(f-.3)*1.3;yy=int(14-10*(1-(2*f-1)**2)**.5);d.line([x,yy,x,14],fill=sh(C('#b8322a'),k))
d.arc([3,4,28,24],180,360,fill=OL);d.line([3,14,28,14],fill=OL);d.rectangle([12,30,18,72],outline=C('#606470'))
save(im,'props/silo.png')
print('ok')
