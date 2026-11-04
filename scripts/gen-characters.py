#!/usr/bin/env python3
"""v46 taller walk sprites (16x24 frames; sheet 32x96: cols=step0/1, rows=down,up,left,right)
for cowboy/cowgirl (hair/iris KEY colours kept for js/avatar.js swap) + shop lady NPC (32x24: 2 idle frames).
Longer face w/ chin, shaded skin, nose/cheeks — matches v43 portraits/Grandpa. Chunky pixel."""
import os,sys
from PIL import Image,ImageDraw
sys.path.insert(0,os.path.dirname(__file__))
from importlib import import_module
gw=import_module('gen-western')
B=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S=B+'/assets/world/player';N=B+'/assets/world/npc';Q=B+'/qa/v46-characters'
os.makedirs(N,exist_ok=True);os.makedirs(Q,exist_ok=True)
HL,HB,HD,IR,SK,SKD,W,OL=gw.HL,gw.HB,gw.HD,gw.IR,gw.SK,gw.SKD,gw.W,gw.OL
SKL=(255,230,200,255);CH=(244,160,150,255);WH=(255,255,255,255);EYE=(40,28,28,255)
def face(d,dirn,x0=4,y0=4,hairKey=True,hb=HB,hl=HL,hd=HD,ir=IR):
    # head 8w x 9h with chin taper
    d.rectangle([x0,y0,x0+7,y0+7],fill=SK);d.rectangle([x0+1,y0+8,x0+6,y0+8],fill=SKD)  # chin shade
    d.line([(x0+7,y0+2),(x0+7,y0+7)],fill=SKD)
    if dirn=='up':
        d.rectangle([x0,y0,x0+7,y0+7],fill=hb);d.line([(x0+1,y0+1),(x0+5,y0+1)],fill=hl);d.line([(x0,y0+7),(x0+7,y0+7)],fill=hd);return
    d.rectangle([x0,y0,x0+7,y0+1],fill=hb);d.line([(x0+1,y0),(x0+4,y0)],fill=hl)
    if dirn=='down':
        d.point((x0,y0+2),fill=hb);d.point((x0+7,y0+2),fill=hb)
        for ex in (x0+1,x0+5):d.point((ex,y0+3),fill=EYE);d.point((ex,y0+4),fill=WH);d.point((ex+1,y0+4),fill=ir);d.point((ex+1,y0+3),fill=EYE)
        d.point((x0+4,y0+5),fill=SKD)  # nose
        d.point((x0+1,y0+6),fill=CH);d.point((x0+6,y0+6),fill=CH)
        d.line([(x0+3,y0+7),(x0+4,y0+7)],fill=(200,90,90,255))
    else:
        L=dirn=='left';ex=x0+1 if L else x0+5
        d.rectangle([x0+5,y0,x0+7,y0+5] if L else [x0,y0,x0+2,y0+5],fill=hb)
        d.point((ex,y0+3),fill=EYE);d.point((ex,y0+4),fill=ir);d.point((ex+(1 if L else -1)*0,y0+4),fill=ir)
        d.point((x0 if L else x0+7,y0+5),fill=SKD)  # nose tip
        d.point((x0+2 if L else x0+5,y0+6),fill=CH)
        d.point((x0+1 if L else x0+6,y0+7),fill=(200,90,90,255))
def walk(kind,dirn,step):
    im=Image.new('RGBA',(16,24));d=ImageDraw.Draw(im);girl=kind=='cowgirl'
    hat,hatD,band=((120,72,36,255),(84,48,24,255),(60,34,18,255)) if not girl else ((236,220,190,255),(196,170,130,255),(200,60,90,255))
    sh,shD,shL=((200,50,50,255),(140,30,36,255),(240,110,100,255)) if not girl else ((80,150,220,255),(50,100,170,255),(150,200,250,255))
    jean,jeanD=(60,90,160,255),(40,60,120,255);boot,bootD=(110,62,30,255),(70,38,18,255)
    a,b=(0,1) if step else (1,0)
    if dirn in('left','right'):a,b=(0,2) if step else (2,0)
    # legs 17-21, boots 21-23
    lc,lcD=(jean,jeanD) if not girl else (SK,SKD)
    d.rectangle([5,17,7,21-a],fill=lc);d.rectangle([8,17,10,21-b],fill=lcD if dirn in('left','right') else lc)
    d.rectangle([5,21-a,7,23-a],fill=boot);d.rectangle([8,21-b,10,23-b],fill=boot);d.line([(5,23-a),(7,23-a)],fill=bootD);d.line([(8,23-b),(10,23-b)],fill=bootD)
    if girl: d.rectangle([4,15,11,18],fill=(150,60,90,255));d.line([(4,18),(11,18)],fill=(110,40,70,255))
    # torso 12-16
    d.rectangle([4,12,11,16],fill=sh);d.line([(11,12),(11,16)],fill=shD);d.line([(4,12),(11,12)],fill=shL)
    if not girl: d.line([(4,16),(11,16)],fill=(90,50,24,255));d.point((7,16),fill=(240,200,90,255))  # belt+buckle
    if dirn=='down': d.point((7,13),fill=WH);d.point((8,13),fill=WH)  # collar
    if not girl and dirn!='up': d.rectangle([4,12,5,15],fill=(130,80,40,255));d.rectangle([10,12,11,15],fill=(130,80,40,255))  # vest
    # arms swing
    if dirn in('down','up'):
        d.rectangle([3,12+b,3,15+b],fill=sh);d.point((3,16+b),fill=SK);d.rectangle([12,12+a,12,15+a],fill=sh);d.point((12,16+a),fill=SK)
    else:
        ax=7;d.rectangle([ax,13,ax+1,15],fill=shD);d.rectangle([ax+(1 if step else -1)*1,16,ax+1+(1 if step else -1),16],fill=SK)
    d.rectangle([6,11,9,12],fill=SKD)  # neck
    face(d,dirn)
    if girl:  # long braids
        if dirn=='down': d.rectangle([3,6,3,13],fill=HB);d.rectangle([12,6,12,13],fill=HB);d.point((3,13),fill=HD);d.point((12,13),fill=HD)
        elif dirn=='left': d.rectangle([11,5,12,13],fill=HB);d.point((12,13),fill=HD)
        elif dirn=='right': d.rectangle([3,5,4,13],fill=HB);d.point((3,13),fill=HD)
        else: d.rectangle([5,11,10,13],fill=HB);d.line([(5,13),(10,13)],fill=HD)
    # hat: brim row 3, crown 0-2
    d.rectangle([1,3,14,3],fill=hatD);d.rectangle([2,4,13,4],fill=(0,0,0,60)) if False else None
    d.rectangle([4,0,11,2],fill=hat);d.line([(4,2),(11,2)],fill=band);d.point((5,0),fill=(255,255,255,90)) 
    return gw.outline(im)
def sheet(kind):
    sh=Image.new('RGBA',(32,96))
    for r,dn in enumerate(['down','up','left','right']):
        for c in (0,1): sh.paste(walk(kind,dn,c),(c*16,r*24))
    return sh
def lady(fr):
    im=Image.new('RGBA',(16,24));d=ImageDraw.Draw(im)
    HB2,HL2,HD2=(150,80,40,255),(200,120,60,255),(100,50,24,255)
    # hair bun + back hair
    d.ellipse([5,0,10,3],fill=HB2);d.rectangle([3,4,12,12],fill=HB2)
    d.rectangle([6,11,9,12],fill=SKD)
    # dress + apron
    d.rectangle([3,12,12,23],fill=(232,106,154,255));d.line([(12,12),(12,23)],fill=(180,70,110,255))
    d.rectangle([5,14,10,22],fill=WH);d.line([(5,14),(10,14)],fill=(240,220,230,255));d.rectangle([6,17,9,18],fill=(232,106,154,255))  # apron pocket heart-ish
    d.point((7,13),fill=WH);d.point((8,13),fill=WH)
    wave=fr==1
    d.rectangle([2,13,2,17],fill=(232,106,154,255));d.point((2,18),fill=SK)
    if wave: d.rectangle([13,9,13,13],fill=(232,106,154,255));d.rectangle([13,7,14,8],fill=SK)
    else: d.rectangle([13,13,13,17],fill=(232,106,154,255));d.point((13,18),fill=SK)
    face(d,'down',4,4,hb=HB2,hl=HL2,hd=HD2,ir=(60,130,90,255))
    d.point((4,6),fill=HB2);d.point((11,6),fill=HB2)
    d.point((10,1),fill=(250,210,80,255))  # flower in bun
    return gw.outline(im)
if __name__=='__main__':
    for k in ('cowboy','cowgirl'): sheet(k).save(f'{S}/{k}.png')
    ls=Image.new('RGBA',(32,24));ls.paste(lady(0),(0,0));ls.paste(lady(1),(16,0));ls.save(N+'/shop-lady.png')
    prev=Image.new('RGBA',(32*3+8,96),(120,180,90,255))
    for i,k in enumerate(('cowboy','cowgirl')):
        s=gw.swap(sheet(k),'brown','blue');prev.paste(s,(i*36,0),s)
    prev.paste(ls,(72,0),ls);prev.resize((prev.width*8,prev.height*8),Image.NEAREST).save(Q+'/sprites-x8.png');print('ok')
