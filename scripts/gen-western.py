#!/usr/bin/env python3
"""Western cowboy/cowgirl avatars (GBA style). Hair & eyes are drawn in KEY colours
that js/avatar.js palette-swaps at runtime:
  hair light #FF80FF, hair base #FF00FF, hair dark #A000A0 ; iris #00FFFF
Outputs assets/world/portraits/cowboy.png, cowgirl.png (48x48) and
assets/world/player/cowboy.png, cowgirl.png (32x64: cols=step 0/1, rows=down,up,left,right),
plus grandpa.png (western). Previews -> qa/avatar-preview/."""
import os
from PIL import Image, ImageDraw
B=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P=B+'/assets/world/portraits';S=B+'/assets/world/player';Q=B+'/qa/avatar-preview'
for d in (P,S,Q): os.makedirs(d,exist_ok=True)
OL=(40,24,24,255);HL=(255,128,255,255);HB=(255,0,255,255);HD=(160,0,160,255);IR=(0,255,255,255)
SK=(255,214,170,255);SKD=(228,168,126,255);W=(255,255,255,255)
def outline(im):
    w,h=im.size;a=im.split()[3];o=im.copy();op=o.load()
    for y in range(h):
        for x in range(w):
            if a.getpixel((x,y))==0 and any(0<=x+dx<w and 0<=y+dy<h and a.getpixel((x+dx,y+dy)) for dx,dy in((1,0),(-1,0),(0,1),(0,-1))): op[x,y]=OL
    return o
def plaid(d,box,c1,c2,c3):
    x0,y0,x1,y1=box
    for x in range(x0,x1+1,4): d.line([(x,y0),(x,y1)],fill=c2)
    for y in range(y0,y1+1,4): d.line([(x0,y),(x1,y)],fill=c2)
    for x in range(x0+2,x1+1,8): d.line([(x,y0),(x,y1)],fill=c3)
def portrait(kind):
    im=Image.new('RGBA',(48,48));d=ImageDraw.Draw(im);girl=kind=='cowgirl'
    shirt,sh2,sh3=((200,50,50,255),(150,30,40,255),(240,200,90,255)) if not girl else ((80,150,220,255),(50,100,170,255),(250,250,250,255))
    if girl: d.rounded_rectangle([9,14,16,40],3,fill=HD)  # hair behind
    d.rounded_rectangle([6,36,41,47],8,fill=shirt);d.rectangle([6,42,41,47],fill=shirt);plaid(d,(8,38,39,47),shirt,sh2,sh3)
    if not girl:  # leather vest
        d.polygon([(7,40),(19,37),(21,47),(7,47)],fill=(130,80,40,255));d.polygon([(40,40),(28,37),(26,47),(40,47)],fill=(130,80,40,255))
        d.point((15,43),fill=(240,200,90,255));d.point((32,43),fill=(240,200,90,255))
        d.polygon([(18,35),(24,42),(30,35)],fill=(220,40,40,255));d.point((24,38),fill=W)  # bandana
    else:
        for x in range(8,40,3): d.point((x,40),fill=(250,250,250,255))  # fringe yoke
        d.polygon([(21,36),(24,40),(27,36)],fill=SK)
        d.rectangle([22,40,26,42],fill=(200,200,210,255));d.point((24,41),fill=(80,150,220,255))  # bolo tie
    d.rectangle([20,31,27,37],fill=SKD)
    d.ellipse([12,13,35,36],fill=SK);d.ellipse([10,22,14,29],fill=SK);d.ellipse([33,22,37,29],fill=SK)
    for ex in (17,27):
        d.rectangle([ex,23,ex+3,27],fill=W);d.rectangle([ex+1,23,ex+3,27],fill=IR);d.rectangle([ex+2,24,ex+3,26],fill=OL);d.point((ex+1,23),fill=W)
        d.line([(ex,21),(ex+3,21)],fill=HD)
    if girl:
        d.line([(ex-11,22),(ex-12,23)],fill=OL);d.line([(31,22),(32,23)],fill=OL)  # lashes
        d.ellipse([15,28,19,31],fill=(245,140,140,255));d.ellipse([28,28,32,31],fill=(245,140,140,255))
        d.arc([20,28,27,33],20,160,fill=(190,60,70,255))
    else:
        d.ellipse([15,28,19,31],fill=(240,165,140,255));d.ellipse([28,28,32,31],fill=(240,165,140,255))
        d.arc([20,27,28,33],10,150,fill=OL)
    # hair fringe under hat
    d.rectangle([12,14,35,18],fill=HB);d.polygon([(12,18),(16,18),(13,23)],fill=HB);d.polygon([(31,18),(35,18),(35,23)],fill=HD)
    d.line([(14,15),(20,15)],fill=HL)
    if not girl: d.rectangle([11,16,13,25],fill=HB);d.rectangle([34,16,36,25],fill=HD);d.line([(12,17),(12,22)],fill=HL)
    if girl:  # braid over shoulder
        for i,y in enumerate(range(24,44,4)):
            d.ellipse([33+(i%2),y,39+(i%2),y+5],fill=HB);d.point((35+(i%2),y+1),fill=HL)
        d.rectangle([34,43,38,45],fill=(220,60,90,255))
    # hat
    hat,hatD,band=((120,72,36,255),(84,48,24,255),(40,28,20,255)) if not girl else ((236,220,190,255),(196,170,130,255),(200,60,90,255))
    d.ellipse([1,12,46,20],fill=hatD);d.ellipse([3,12,44,17],fill=hat)
    d.polygon([(12,14),(14,4),(20,2),(24,5),(28,2),(34,4),(36,14)],fill=hat);d.line([(24,5),(24,10)],fill=hatD)
    d.rectangle([12,11,36,14],fill=band)
    if girl: d.ellipse([30,9,35,14],fill=(250,250,250,255));d.point((32,11),fill=(240,200,60,255))
    else: d.rectangle([22,11,25,14],fill=(240,200,90,255))
    d.line([(15,6),(18,4)],fill=(255,255,255,90) if girl else (160,110,60,255))
    return outline(im)
def spr(kind,dirn,step):
    im=Image.new('RGBA',(16,16));d=ImageDraw.Draw(im);girl=kind=='cowgirl'
    hat,hatD=((120,72,36,255),(84,48,24,255)) if not girl else ((236,220,190,255),(196,170,130,255))
    shirt=(200,50,50,255) if not girl else (80,150,220,255)
    leg=(60,90,160,255);boot=(100,56,28,255)
    # legs/boots
    a,b=(0,1) if step else (1,0)
    if girl: d.rectangle([5,11,10,12],fill=(150,60,90,255))  # skirt
    d.rectangle([5,11+a,7,13],fill=leg if not girl else SK);d.rectangle([8,11+b,10,13],fill=leg if not girl else SK)
    d.rectangle([5,14,7,15],fill=boot);d.rectangle([8,14,10,15],fill=boot)
    d.rectangle([4,7,11,11],fill=shirt)
    if not girl and dirn!='up': d.rectangle([4,7,5,11],fill=(130,80,40,255));d.rectangle([10,7,11,11],fill=(130,80,40,255))
    if girl: d.rectangle([5,11,10,12],fill=(150,60,90,255))
    d.rectangle([3,8,3,10],fill=SK);d.rectangle([12,8,12,10],fill=SK)
    # head
    d.rectangle([4,3,11,7],fill=SK)
    if dirn=='up': d.rectangle([4,3,11,7],fill=HB);d.line([(5,4),(9,4)],fill=HL)
    else:
        d.rectangle([4,3,11,4],fill=HB)
        if dirn=='down': d.point((6,5),fill=IR);d.point((9,5),fill=IR)
        elif dirn=='left': d.point((5,5),fill=IR);d.rectangle([10,3,11,6],fill=HB)
        else: d.point((10,5),fill=IR);d.rectangle([4,3,5,6],fill=HB)
    if girl:
        if dirn=='left': d.rectangle([11,5,12,10],fill=HB)
        elif dirn=='right': d.rectangle([3,5,4,10],fill=HB)
        elif dirn=='up': d.rectangle([7,7,8,11],fill=HB);d.point((7,9),fill=HD)
    # hat
    d.rectangle([1,2,14,2],fill=hatD);d.rectangle([4,0,11,1],fill=hat);d.line([(4,1),(11,1)],fill=hatD if not girl else (200,60,90,255))
    return outline(im)
def sheet(kind):
    sh=Image.new('RGBA',(32,64))
    for r,dn in enumerate(['down','up','left','right']):
        for c in (0,1): sh.paste(spr(kind,dn,c),(c*16,r*16))
    return sh
def grandpa():
    im=Image.new('RGBA',(48,48));d=ImageDraw.Draw(im)
    d.rounded_rectangle([6,36,41,47],8,fill=(90,120,170,255));d.rectangle([6,42,41,47],fill=(90,120,170,255))
    d.polygon([(7,40),(19,37),(21,47),(7,47)],fill=(110,70,40,255));d.polygon([(40,40),(28,37),(26,47),(40,47)],fill=(110,70,40,255))
    d.polygon([(19,35),(24,41),(29,35)],fill=(200,60,40,255))
    d.rectangle([20,31,27,37],fill=(215,160,120,255))
    d.ellipse([12,13,35,36],fill=(245,200,160,255));d.ellipse([10,22,14,29],fill=(245,200,160,255));d.ellipse([33,22,37,29],fill=(245,200,160,255))
    d.rectangle([15,20,21,21],fill=(235,235,235,255));d.rectangle([26,20,32,21],fill=(235,235,235,255))
    for ex in (17,27): d.arc([ex,22,ex+4,26],200,340,fill=OL)
    d.ellipse([15,28,19,31],fill=(240,150,140,255));d.ellipse([28,28,32,31],fill=(240,150,140,255))
    d.polygon([(16,29),(24,27),(31,29),(30,32),(24,30),(17,32)],fill=(240,240,240,255))  # handlebar moustache
    d.polygon([(18,31),(30,31),(27,40),(24,42),(21,40)],fill=(230,230,230,255))
    hat,hatD=(200,170,120,255),(160,130,80,255)
    d.ellipse([0,11,47,20],fill=hatD);d.ellipse([2,11,45,16],fill=hat)
    d.polygon([(12,14),(14,3),(20,1),(24,4),(28,1),(34,3),(36,14)],fill=hat);d.rectangle([12,11,36,14],fill=(70,40,30,255))
    d.line([(24,4),(24,9)],fill=hatD)
    return outline(im)
HAIR={'black':[(70,70,90),(36,32,44),(14,12,20)],'brown':[(170,110,60),(120,70,30),(74,42,18)],'blonde':[(255,240,160),(240,200,90),(190,140,50)],
      'auburn':[(190,90,60),(140,50,35),(90,30,25)],'ginger':[(255,150,70),(230,100,30),(170,60,20)]}
EYES={'brown':(120,70,30),'blue':(60,130,230),'green':(50,160,80),'hazel':(160,120,50),'grey':(140,150,165)}
def swap(im,h,e):
    im=im.copy();px=im.load();m={HL[:3]:HAIR[h][0],HB[:3]:HAIR[h][1],HD[:3]:HAIR[h][2],IR[:3]:EYES[e]}
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            p=px[x,y]
            if p[3] and p[:3] in m: px[x,y]=m[p[:3]]+(p[3],)
    return im
if __name__=='__main__':
    for k in ('cowboy','cowgirl'):
        portrait(k).save(f'{P}/{k}.png');sheet(k).save(f'{S}/{k}.png')
    grandpa().save(P+'/grandpa.png')
    combos=[('brown','brown'),('blonde','blue'),('ginger','green'),('black','hazel'),('auburn','grey')]
    for k in ('cowboy','cowgirl'):
        row=Image.new('RGBA',(len(combos)*(48*6+12),48*6+16*8+20),(248,240,220,255))
        for i,(h,e) in enumerate(combos):
            x=i*(48*6+12)+6;row.paste(swap(portrait(k),h,e).resize((288,288),Image.NEAREST),(x,6),swap(portrait(k),h,e).resize((288,288),Image.NEAREST))
            sp=swap(sheet(k),h,e).resize((256,512),Image.NEAREST)
            strip=Image.new('RGBA',(256,128));[strip.paste(sp.crop((0,r*128,128,r*128+128)),(r%2*128,0)) for r in (0,)];strip.paste(sp.crop((0,0,128,128)),(0,0));strip.paste(sp.crop((128,256,256,384)),(128,0))
            row.paste(strip,(x+16,300),strip)
        row.save(f'{Q}/{k}-combos.png')
    grandpa().resize((288,288),Image.NEAREST).save(Q+'/grandpa-western-x6.png')
    print('ok')
