#!/usr/bin/env python3
"""GBA-style 48x48 character portraits: boy, girl, grandpa (assets/world/portraits/)."""
import os
from PIL import Image, ImageDraw
R=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'assets','world','portraits');os.makedirs(R,exist_ok=True)
OL=(40,24,24,255)
def outline(im):
    a=im.split()[3];px=im.load();o=im.copy();op=o.load()
    for y in range(48):
        for x in range(48):
            if a.getpixel((x,y))==0 and any(0<=x+dx<48 and 0<=y+dy<48 and a.getpixel((x+dx,y+dy)) for dx,dy in((1,0),(-1,0),(0,1),(0,-1))): op[x,y]=OL
    return o
def person(skin,skinD,hair,hairD,shirt,shirtD,hat,hatD,kind):
    im=Image.new('RGBA',(48,48));d=ImageDraw.Draw(im)
    # shoulders / shirt
    d.rounded_rectangle([7,36,40,47],8,fill=shirt);d.rectangle([7,42,40,47],fill=shirt);d.polygon([(20,36),(24,42),(28,36)],fill=skin)
    d.line([(14,40),(14,47)],fill=shirtD);d.line([(33,40),(33,47)],fill=shirtD)
    if kind=='grandpa': d.rectangle([12,38,16,47],fill=(70,110,170,255));d.rectangle([31,38,35,47],fill=(70,110,170,255))  # overall straps
    # neck + face
    d.rectangle([20,31,27,37],fill=skinD)
    if kind=='girl':  # long hair behind
        d.rounded_rectangle([9,12,16,42],3,fill=hairD);d.rounded_rectangle([31,12,38,42],3,fill=hairD)
    d.ellipse([12,12,35,36],fill=skin);d.ellipse([12,26,35,36],fill=skin)
    d.ellipse([10,21,14,28],fill=skin);d.ellipse([33,21,37,28],fill=skin)  # ears
    d.arc([12,14,35,36],20,160,fill=skinD)
    # eyes
    for ex in (18,27):
        if kind=='grandpa': d.line([(ex,24),(ex+3,24)],fill=OL)  # kind squint
        else: d.rectangle([ex,22,ex+2,26],fill=OL);d.point((ex+1,23),fill=(255,255,255,255))
    d.ellipse([15,27,19,30],fill=(240,150,140,255));d.ellipse([28,27,32,30],fill=(240,150,140,255))  # cheeks
    if kind=='grandpa':
        d.rectangle([15,19,21,20],fill=(235,235,235,255));d.rectangle([26,19,32,20],fill=(235,235,235,255))  # brows
        d.ellipse([14,28,33,40],fill=(240,240,240,255));d.ellipse([16,27,31,31],fill=(220,220,220,255))  # beard+moustache
        d.arc([20,31,27,35],0,180,fill=(200,120,110,255))
        d.ellipse([16,21,23,27],outline=(90,70,50,255));d.ellipse([25,21,32,27],outline=(90,70,50,255));d.line([(23,24),(25,24)],fill=(90,70,50,255))  # glasses
    else:
        d.arc([20,27,27,32],20,160,fill=OL)
        d.rectangle([12,12,35,19],fill=hair);d.polygon([(12,19),(18,19),(14,23)],fill=hair);d.polygon([(22,19),(30,19),(26,22)],fill=hair)
        d.polygon([(30,19),(35,19),(35,24)],fill=hairD)
    # hat
    if kind=='grandpa':  # straw hat
        d.ellipse([3,12,44,19],fill=hatD);d.rounded_rectangle([12,3,35,16],5,fill=hat);d.rectangle([12,12,35,14],fill=(170,60,40,255))
        for x in range(14,34,4): d.point((x,7),fill=hatD)
    else:
        d.rounded_rectangle([11,4,36,15],6,fill=hat);d.rectangle([11,12,36,15],fill=hatD);d.polygon([(24,13),(42,13),(40,17),(24,17)] if kind=='boy' else [(8,13),(24,13),(24,17),(10,17)],fill=hatD)
        d.ellipse([22,6,26,10],fill=(255,255,255,255))
        if kind=='girl': d.ellipse([36,8,42,14],fill=(255,220,90,255))  # flower clip
    return outline(im)
person((255,214,170,255),(230,170,130,255),(120,70,30,255),(80,45,20,255),(60,110,220,255),(40,80,170,255),(232,64,40,255),(170,40,30,255),'boy').save(R+'/boy.png')
person((255,214,170,255),(230,170,130,255),(150,80,35,255),(110,55,25,255),(180,90,210,255),(130,60,160,255),(248,112,168,255),(200,64,120,255),'girl').save(R+'/girl.png')
person((245,200,160,255),(215,160,120,255),(230,230,230,255),(200,200,200,255),(200,80,60,255),(150,50,40,255),(240,210,120,255),(200,160,70,255),'grandpa').save(R+'/grandpa.png')
