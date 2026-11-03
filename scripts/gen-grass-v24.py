#!/usr/bin/env python3
"""v24 realistic grass: dense multi-tone blades, seamless 16x16, 4 variants + tallgrass."""
import os,random
from PIL import Image
D=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'assets','world','tiles')
P=['#1f6a30','#2f8040','#3f9a46','#55ad4e','#6cc05a','#8ad46c','#b2e690']
def H(h):return tuple(int(h[i:i+2],16) for i in (1,3,5))+(255,)
def grass(seed,dens=60,bright=0,flowers=0,tall=False):
    r=random.Random(seed);im=Image.new('RGBA',(16,16),H(P[3]));p=im.load()
    for y in range(16):
        for x in range(16):
            n=r.random()
            p[x,y]=H(P[2] if n<.25 else P[3] if n<.75 else P[4])
    for _ in range(dens if not tall else dens*2):
        x,y=r.randrange(16),r.randrange(16);L=r.choice([2,3,3,4]) + (2 if tall else 0);lean=r.choice([-1,0,0,1])
        for k in range(L):
            c=P[1] if k==0 else P[min(6,2+k+bright)] if k==L-1 else P[3+(k%2)]
            if tall and k==0:c=P[0]
            xx=(x+(lean if k>=L//2 else 0))%16;yy=(y-k)%16;p[xx,yy]=H(c)
        p[(x+1)%16,y]=H(P[1]) if r.random()<.5 else p[(x+1)%16,y]
    for _ in range(flowers):
        x,y=r.randrange(16),r.randrange(16);p[x,y]=H(r.choice(['#ffffff','#fff070','#ffa0c0']))
    return im
for i,(s,d,b,f) in enumerate([(11,55,0,0),(12,70,1,0),(13,50,0,2),(14,80,1,0)]):
    im=grass(s,d,b,f);im.save(f'{D}/grass{i}.png')
    if i==0:im.save(f'{D}/grass.png')
grass(19,60,1,0,True).save(f'{D}/tallgrass.png');print('ok')
