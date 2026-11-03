#!/usr/bin/env python3
"""Procedurally lay out the v18 ranch + outer world and write them into js/map-data.js (JSON block).
Hand edits to map-data.js are fine afterwards — only re-run this to start a layout from scratch."""
import json, math, os, random, re
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rnd=random.Random(18)
def grid(w,h,c='g'): return [[c]*w for _ in range(h)]
def blob(M,cx,cy,rx,ry,c,seed):
    r=random.Random(seed); ph=[r.random()*6 for _ in range(3)]
    for y in range(len(M)):
        for x in range(len(M[0])):
            a=math.atan2(y-cy,x-cx); k=1+.18*math.sin(3*a+ph[0])+.12*math.sin(5*a+ph[1])+.08*math.sin(2*a+ph[2])
            if ((x-cx)/rx)**2+((y-cy)/ry)**2<=k*k: M[y][x]=c
def rect(M,x0,y0,x1,y1,c):
    for y in range(y0,y1+1):
        for x in range(x0,x1+1): M[y][x]=c
def free(M,x,y,w=2,h=2,ok='ghF'):
    return all(0<=y+j<len(M) and 0<=x+i<len(M[0]) and M[y+j][x+i] in ok for j in range(h) for i in range(w))
def tree(M,x,y,pine=False):
    if not free(M,x,y): return False
    M[y][x]='P' if pine else 'T'; M[y][x+1]=M[y+1][x]=M[y+1][x+1]='x'; return True
def scatter(M,box,n,pine=.3,seed=0,keep=()):
    r=random.Random(seed); x0,y0,x1,y1=box
    for _ in range(n*6):
        if n<=0: break
        x,y=r.randint(x0,x1-1),r.randint(y0,y1-1)
        if any(kx0-1<=x<=kx1+1 and ky0-1<=y<=ky1+1 for kx0,ky0,kx1,ky1 in keep): continue
        if tree(M,x,y,r.random()<pine): n-=1
def deco(M,n,seed,c):
    r=random.Random(seed)
    for _ in range(n):
        x,y=r.randrange(len(M[0])),r.randrange(len(M))
        for dy in range(r.randint(1,3)):
            for dx in range(r.randint(1,4)):
                if 0<=y+dy<len(M) and 0<=x+dx<len(M[0]) and M[y+dy][x+dx]=='g': M[y+dy][x+dx]=c if c!='F' else r.choice('FFJK')
# ---------- RANCH 56x44 ----------
RW,RH=56,44; M=grid(RW,RH)
for x in range(RW): M[0][x]=M[RH-1][x]='f'
for y in range(RH): M[y][0]=M[y][RW-1]='f'
GATE=[[27,RH-1],[28,RH-1]]
rect(M,27,3,28,RH-1,'p')            # main N-S road to gate
rect(M,2,20,53,21,'p')              # E-W road
rect(M,4,12,52,12,'p')              # house lane
for x in (7,14,21,35,42,49): rect(M,x,10,x,12,'p')
HS=[[6,8],[13,8],[20,8],[34,8],[41,8],[48,8]]
LK=[[34,15,'COW BARN'],[42,15,'STABLE']]
rect(M,35,17,35,19,'p');rect(M,43,17,43,19,'p')
STORE=[20,33]; rect(M,21,35,21,36,'p'); rect(M,21,36,26,36,'p')
M[19][26]='s'; M[RH-3][26]='s'
# fields
for (x0,y0,x1,y1,c) in [(4,24,12,30,'C'),(15,24,23,30,'W')]:
    rect(M,x0-1,y0-1,x1+1,y1+1,'f'); rect(M,x0,y0,x1,y1,c); M[y0-1][(x0+x1)//2]='p'
rect(M,8,22,8,22,'p');rect(M,19,22,19,22,'p')
blob(M,11,37,7,3.6,'w',1); blob(M,45,31,7.5,5.5,'w',2); blob(M,50,38,3,2.5,'w',3)
blob(M,45,31,1.6,1.2,'g',4)   # little island
deco(M,26,5,'F'); deco(M,22,6,'h')
keep=[(h[0],h[1],h[0]+2,h[1]+1) for h in HS]+[(l[0],l[1],l[0]+2,l[1]+1) for l in LK]+[(STORE[0],STORE[1],STORE[0]+2,STORE[1]+1)]
for x in range(1,RW-2,2):
    if rnd.random()<.75: tree(M,x,1,rnd.random()<.3)
for y in range(3,RH-3,3):
    tree(M,1,y,rnd.random()<.4); tree(M,RW-3,y,rnd.random()<.4)
scatter(M,(30,23,54,42),16,seed=7,keep=keep); scatter(M,(2,31,26,42),10,seed=8,keep=keep); scatter(M,(2,13,54,19),9,seed=9,keep=keep)
# ---------- OUTER WORLD 80x60 ----------
OW_,OH=80,60; O=grid(OW_,OH)
OGATE=[[39,0],[40,0]]
rect(O,39,0,40,34,'p'); rect(O,4,34,75,35,'p'); rect(O,62,8,63,34,'p'); rect(O,16,35,17,55,'p'); rect(O,40,35,41,52,'p')
for y in range(OH):  # meandering river
    cx=int(58+7*math.sin(y/6.0)+3*math.sin(y/2.7))
    for x in range(cx-1,cx+2): O[y][x]='B' if O[y][x]=='p' else 'w'
blob(O,14,47,10,6,'w',11); blob(O,14,47,13,8.5,'b',12) if False else None
# beach ring around big lake
L=grid(OW_,OH,'.'); blob(L,14,47,12.5,8,'b',11)
for y in range(OH):
    for x in range(OW_):
        if L[y][x]=='b' and O[y][x]=='g': O[y][x]='b'
blob(O,14,47,10,6,'w',11)
blob(O,24,14,6,4,'w',13)
for y in range(OH):
    for x in range(OW_):
        if O[y][x]=='w' and (16<=x<=17 or 39<=x<=41) and (y in (34,35) or 35<y<=55 and x in (16,17)):
            O[y][x]='B'
deco(O,60,21,'F'); deco(O,70,22,'h'); deco(O,25,23,'r')
for x in range(0,OW_-1,2):
    for y in (0,OH-2):
        if not (37<=x<=41 and y==0): tree(O,x,y,rnd.random()<.5)
for y in range(2,OH-2,2): tree(O,0,y,True); tree(O,OW_-2,y,True)
scatter(O,(2,2,36,32),70,pine=.5,seed=31); scatter(O,(43,2,78,32),60,pine=.7,seed=32)
scatter(O,(43,37,78,57),55,pine=.4,seed=33); scatter(O,(19,37,38,57),25,seed=34)
O[33][38]='s'; O[1][38]='s'
for y in range(OH):
    for x in range(OW_):
        if O[y][x] in 'w' and False: pass
rows=lambda G:[''.join(r) for r in G]
legend={"g":"grass","h":"tall grass","F":"flowers (also J,K)","p":"path","b":"sand","f":"fence","T":"tree 2x2 origin","P":"pine 2x2 origin","x":"tree body","w":"water","B":"bridge","r":"rock","C":"corn","W":"wheat","s":"sign","G":"gate"}
for gx,gy in GATE: M[gy][gx]='G'
for gx,gy in OGATE: O[gy][gx]='G'
L={"_doc":"SINGLE SOURCE OF TRUTH for the overworld. Top level = the RANCH; 'outer' = the world beyond the ranch gate. Edit, then run scripts/build.sh to regenerate assets/world/farm-grid.* and world-grid.*. houseSlots/locks/petStore are [x,y] top-left tiles (0-based; x=0 is column A, y=0 is row 1) and are 3x2 (door = middle of bottom row). Trees (T/P) are 2x2 with 'x' body cells. Walking onto a G gate tile switches maps.",
 "legend":legend,"tileSize":16,"width":RW,"height":RH,"houseSlots":HS,"petStore":STORE,"locks":LK,"gate":GATE,"start":[27,24],
 "rows":rows(M),
 "outer":{"name":"WILD WOODS","width":OW_,"height":OH,"gate":OGATE,"legend":legend,"rows":rows(O)}}
p=os.path.join(ROOT,'js','map-data.js'); s=open(p).read()
s=re.sub(r'/\*JSON-START\*/.*?/\*JSON-END\*/','/*JSON-START*/'+json.dumps(L,indent=1).replace('\\','\\\\')+'/*JSON-END*/',s,flags=re.S)
open(p,'w').write(s); print('maps written',RW,RH,OW_,OH)
