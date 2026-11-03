"""v29 sheep sprites: 4 wool stages (0 shorn .. 3 full) + eating variants. Chunky, outlined, kid-readable."""
import math,json,os
from PIL import Image,ImageDraw
B=os.path.dirname(os.path.abspath(__file__))+'/..'
OUT=(43,36,64,255);FACE=(64,54,80,255);LEG=(58,48,72,255);SK=(255,206,190,255)
def outline(im):
  px=im.load();w,h=im.size;o=Image.new('RGBA',im.size,(0,0,0,0));q=o.load()
  for y in range(h):
    for x in range(w):
      if px[x,y][3]==0 and any(0<=x+a<w and 0<=y+b<h and px[x+a,y+b][3]>0 for a,b in((1,0),(-1,0),(0,1),(0,-1))):q[x,y]=OUT
  o.alpha_composite(im);return o
def C(d,x,y,r,f):d.ellipse([x-r,y-r,x+r,y+r],fill=f)
def sheep(stage,eat=False):
  W,H=56,42;im=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(im);k=[0,.35,.7,1][stage]
  for x in (12,18,27,33):d.rectangle([x,31,x+3,39],fill=LEG);d.rectangle([x,38,x+3,39],fill=(28,22,38,255))
  cx,cy=23,24;rx=9+k*9;ry=7+k*6;base=(240,232,214,255);hi=(255,254,248,255);sh=(212,200,182,255)
  if stage==0:C(d,cx,cy,0,SK);d.ellipse([cx-rx,cy-ry,cx+rx,cy+ry],fill=SK);d.ellipse([cx-rx+2,cy-ry+1,cx+rx-4,cy],fill=(255,226,212,255))
  else:
    n=11;pts=[(cx+math.cos(i/n*6.283)*rx,cy+math.sin(i/n*6.283)*ry,3+k*3) for i in range(n)]
    for x,y,r in pts:C(d,x,y+1,r,sh)
    d.ellipse([cx-rx,cy-ry+1,cx+rx,cy+ry+1],fill=sh);d.ellipse([cx-rx,cy-ry,cx+rx,cy+ry-1],fill=base)
    for x,y,r in pts:
      if y<=cy+1:C(d,x,y,r-1,base)
    C(d,cx-4,cy-ry+3,2+k*2,hi);C(d,cx+3,cy-ry+2,1+k*2,hi)
    for (x,y) in [(cx-6,cy+1),(cx+2,cy+4),(cx+7,cy-1),(cx-2,cy-3)]:d.arc([x-2,y-2,x+2,y+2],200,340,fill=sh)
  hx,hy=int(cx+rx-1),int(cy-6+(6 if eat else 0))
  d.ellipse([hx-6,hy-2,hx,hy+3],fill=FACE);d.ellipse([hx+10,hy-2,hx+16,hy+3],fill=FACE)
  d.ellipse([hx-3,hy-2,hx+13,hy+13],fill=FACE)
  d.ellipse([hx-1,hy-6,hx+11,hy+2],fill=base if stage else (250,240,226,255))
  for ex in (hx+1,hx+8):d.rectangle([ex,hy+4,ex+2,hy+7],fill=(16,12,24,255));d.point((ex+1,hy+4),fill=(255,255,255,255));d.point((ex+2,hy+5),fill=(255,255,255,255))
  d.rectangle([hx-1,hy+8,hx,hy+9],fill=(255,130,160,255));d.rectangle([hx+11,hy+8,hx+12,hy+9],fill=(255,130,160,255))
  d.line([(hx+4,hy+10),(hx+6,hy+10)],fill=(255,170,190,255))
  return outline(im)
if __name__=='__main__':
  for s in range(4):sheep(s).save(B+f'/assets/world/animals/sheep{s}.png');sheep(s,True).save(B+f'/assets/world/animals/sheep{s}e.png')
  big=Image.new('RGBA',(56*4*4,42*4),(120,200,90,255))
  for s in range(4):big.alpha_composite(sheep(s).resize((224,168),Image.NEAREST),(s*224,0))
  big.save(B+'/qa/v29-sheep-stages.png')
