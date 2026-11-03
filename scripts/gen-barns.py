#!/usr/bin/env python3
"""GBA western ranch buildings -> assets/world/buildings/<id>.png (w*16 x (h+1)*16; drawn 1 tile above footprint)."""
import os
from PIL import Image, ImageDraw
OUT=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'assets','world','buildings')
OL=(40,24,24,255)
def sh(c,k): return tuple(max(0,min(255,int(v*k))) for v in c[:3])+(255,)
def plank(d,x0,y0,x1,y1,c,vert=True,step=4):
    d.rectangle([x0,y0,x1,y1],fill=c)
    if vert:
        for x in range(x0,x1,step): d.line([x,y0,x,y1],fill=sh(c,.82))
    else:
        for y in range(y0,y1,step): d.line([x0,y,x1,y],fill=sh(c,.82))
    d.line([x0,y0,x1,y0],fill=sh(c,1.15))
def roof(d,x0,y0,x1,y1,c,gambrel=False):
    w=x1-x0;mx=(x0+x1)//2
    if gambrel: pts=[(x0-2,y1),(x0+w//8,y0+(y1-y0)//2),(mx,y0),(x1-w//8,y0+(y1-y0)//2),(x1+2,y1)]
    else: pts=[(x0-2,y1),(mx,y0),(x1+2,y1)]
    d.polygon(pts,fill=c,outline=OL)
    for i,y in enumerate(range(y0+3,y1,3)): d.line([x0,y,x1,y],fill=sh(c,.8))
    d.polygon(pts,outline=OL)
    # re-clip shingles: redraw outside as transparent handled by mask below
def shingle_roof(im,x0,y0,x1,y1,c,gambrel=False):
    m=Image.new('L',im.size,0);md=ImageDraw.Draw(m);w=x1-x0;mx=(x0+x1)//2
    pts=[(x0-2,y1),(x0+w//8,y0+(y1-y0)//2),(mx,y0),(x1-w//8,y0+(y1-y0)//2),(x1+2,y1)] if gambrel else [(x0-2,y1),(mx,y0),(x1+2,y1)]
    md.polygon(pts,fill=255);L=Image.new('RGBA',im.size,c);ld=ImageDraw.Draw(L)
    for y in range(y0,y1+1,3):
        ld.line([0,y,im.width,y],fill=sh(c,.78))
        for x in range((y//3%2)*3,im.width,6): ld.point((x,y+1),fill=sh(c,.78))
    ld.line([0,y1,im.width,y1],fill=sh(c,.6));im.paste(L,(0,0),m);ImageDraw.Draw(im).polygon(pts,outline=OL)
    ImageDraw.Draw(im).line([pts[0],pts[-1]],fill=sh(c,.55),width=2)
def xdoor(d,x0,y0,x1,y1,c,trim=(240,236,224,255)):
    d.rectangle([x0,y0,x1,y1],fill=c,outline=trim);d.line([x0,y0,x1,y1],fill=trim);d.line([x0,y1,x1,y0],fill=trim)
    d.line([(x0+x1)//2,y0,(x0+x1)//2,y1],fill=trim)
def window(d,x,y,w=6,h=5):
    d.rectangle([x,y,x+w,y+h],fill=(150,210,255,255),outline=(240,236,224,255));d.line([x+1,y+1,x+w-2,y+1],fill=(230,248,255,255))
    d.line([x+w//2,y,x+w//2,y+h],fill=(240,236,224,255))
def sign(d,x,y,w,c=(110,70,34,255)):
    d.rectangle([x,y,x+w,y+5],fill=c,outline=OL)
def base(w,h): im=Image.new('RGBA',(w*16,(h+1)*16),(0,0,0,0));return im,ImageDraw.Draw(im)
def shadow(d,W,H): d.ellipse([2,H-5,W-3,H+1],fill=(0,0,0,60))

def barn(id,w,h,wall,roofc,doorc,gambrel=True,hay=True,trim=(240,236,224,255)):
    im,d=base(w,h);W,H=im.size;shadow(d,W,H);top=int(H*.42)
    plank(d,2,top,W-3,H-3,wall);d.rectangle([2,top,W-3,H-3],outline=OL)
    d.line([2,H-4,W-3,H-4],fill=sh(wall,.6))
    shingle_roof(im,3,2,W-4,top+2,roofc,gambrel);d=ImageDraw.Draw(im)
    if hay:  # hayloft
        cx=W//2;d.rectangle([cx-5,top-12,cx+5,top-3],fill=(60,36,24,255),outline=trim);d.rectangle([cx-4,top-6,cx+4,top-4],fill=(232,200,90,255))
    dw=max(12,W//4);xdoor(d,W//2-dw//2,H-4-int((H-top)*.62),W//2+dw//2,H-4,doorc,trim)
    for x in (6, W-13): window(d,x,top+5)
    d.rectangle([2,top,W-3,top+1],fill=trim)
    im.save(os.path.join(OUT,id+'.png'))
def coop():
    im,d=base(4,3);W,H=im.size;shadow(d,W,H);top=24
    for x in (6,W-8): d.rectangle([x,H-6,x+2,H-2],fill=(90,56,30,255))
    plank(d,3,top,W-4,H-7,(236,196,110,255),False,3);d.rectangle([3,top,W-4,H-7],outline=OL)
    shingle_roof(im,4,6,W-5,top+2,(200,60,44,255));d=ImageDraw.Draw(im)
    d.rectangle([W//2-5,H-22,W//2+5,H-7],fill=(60,36,24,255),outline=(240,236,224,255))
    d.line([W//2+5,H-7,W//2+14,H-1],fill=(160,110,60,255),width=2)
    for i in range(3): d.line([W//2+6+i*3,H-6+i*2,W//2+8+i*3,H-6+i*2],fill=(90,56,30,255))
    window(d,8,top+5,5,4);window(d,W-15,top+5,5,4)
    d.polygon([(W-14,8),(W-10,4),(W-8,8)],fill=(250,220,70,255),outline=OL)  # weathervane rooster
    d.line([W-10,8,W-10,14],fill=OL)
    im.save(os.path.join(OUT,'coop.png'))
def sty():
    im,d=base(4,3);W,H=im.size;shadow(d,W,H)
    d.rectangle([2,30,W-3,H-3],fill=(150,100,60,255));
    for i in range(10): d.ellipse([4+i*6,34+(i*7)%10,9+i*6,37+(i*7)%10],fill=(110,70,40,255))  # mud
    plank(d,2,10,W//2,30,(214,150,110,255));d.rectangle([2,10,W//2,30],outline=OL)
    d.polygon([(0,12),(W//2+3,4),(W//2+3,12)],fill=(120,80,50,255),outline=OL)
    d.rectangle([10,18,22,30],fill=(50,30,20,255))
    for x in range(2,W-2,6): d.rectangle([x,H-12,x+2,H-2],fill=(170,120,70,255),outline=OL)
    d.rectangle([2,H-10,W-3,H-9],fill=(190,140,80,255));d.rectangle([2,H-6,W-3,H-5],fill=(190,140,80,255))
    d.rectangle([W-22,24,W-6,30],fill=(120,120,130,255),outline=OL);d.rectangle([W-20,25,W-8,27],fill=(230,190,90,255))  # trough
    im.save(os.path.join(OUT,'sty.png'))
def shed(id,wall,roofc,icon):
    im,d=base(3,2);W,H=im.size;shadow(d,W,H);top=18
    plank(d,3,top,W-4,H-3,wall);d.rectangle([3,top,W-4,H-3],outline=OL)
    shingle_roof(im,4,3,W-5,top+2,roofc);d=ImageDraw.Draw(im)
    d.rectangle([W//2-6,H-18,W//2+6,H-3],fill=sh(wall,.6),outline=(240,236,224,255));d.line([W//2,H-18,W//2,H-3],fill=(240,236,224,255))
    if icon=='feed':
        for x in (5,W-12): d.rectangle([x,H-10,x+7,H-3],fill=(232,212,160,255),outline=OL);d.line([x+1,H-8,x+6,H-8],fill=(160,120,60,255))
    else:
        d.line([7,H-14,7,H-3],fill=(120,80,40,255),width=2);d.rectangle([5,H-16,10,H-14],fill=(170,170,180,255))  # pitchfork
        d.ellipse([W-13,H-10,W-5,H-3],fill=(170,170,180,255),outline=OL)  # bucket
    im.save(os.path.join(OUT,id+'.png'))
def doghouse():
    im,d=base(3,2);W,H=im.size;shadow(d,W,H);top=16
    plank(d,6,top,W-7,H-3,(214,92,74,255),False,3);d.rectangle([6,top,W-7,H-3],outline=OL)
    shingle_roof(im,7,2,W-8,top+3,(110,60,40,255));d=ImageDraw.Draw(im)
    d.pieslice([W//2-7,H-20,W//2+7,H+4],180,360,fill=(40,22,20,255));d.rectangle([W//2-7,H-13,W//2+7,H-3],fill=(40,22,20,255))
    d.rectangle([W//2-8,top+1,W//2+8,top+5],fill=(240,236,224,255),outline=OL)
    d.ellipse([W-10,H-7,W-3,H-2],fill=(60,120,220,255),outline=OL)
    im.save(os.path.join(OUT,'doghouse.png'))
os.makedirs(OUT,exist_ok=True)
barn('cowbarn',6,3,(196,52,40,255),(90,90,100,255),(160,40,30,255))
barn('stable',6,3,(150,100,58,255),(70,110,60,255),(110,70,40,255),gambrel=False)
barn('sheepshed',4,3,(230,220,196,255),(80,110,170,255),(150,120,90,255),gambrel=False,hay=False,trim=(120,90,60,255))
coop();sty();doghouse()
shed('feedshed',(170,120,70,255),(200,60,44,255),'feed')
shed('toolshed',(120,130,140,255),(80,70,60,255),'tool')
print('ok')
