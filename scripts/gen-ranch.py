#!/usr/bin/env python3
"""v23 spacious ranch (88x68): buildings spread out with yards/paths, crop fields, windmill, silo,
orchard, flower beds, rounded ponds. Rewrites ONLY the ranch part of js/map-data.js (outer world kept)."""
# NOTE v59/v62: js/map-data.js was hand-edited after generation (wider gates, sheep shed/sty y=41, shop path col 39 rows 11-13,
# mud-pen fence col 22, well moved to [39,19] + path row 21 cols 39-42, silo 3-wide w/ path col 70 rows 22-32; v65: cow pen fence 60-69x26-31, trough 66,28, map widened 88->112 with MOO MEADOW FARM + paddock east of col 87). Re-running this script will LOSE those edits.
import json, math, os, random, re
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P=os.path.join(ROOT,'js','map-data.js'); src=open(P).read()
L=json.loads(re.search(r'/\*JSON-START\*/(.*?)/\*JSON-END\*/',src,re.S).group(1))
RW,RH=88,68; M=[['g']*RW for _ in range(RH)]; rnd=random.Random(23)
def rect(x0,y0,x1,y1,c):
    for y in range(max(0,y0),min(RH,y1+1)):
        for x in range(max(0,x0),min(RW,x1+1)): M[y][x]=c
def frame(x0,y0,x1,y1,c='f'):
    for x in range(x0,x1+1): M[y0][x]=M[y1][x]=c
    for y in range(y0,y1+1): M[y][x0]=M[y][x1]=c
def blob(cx,cy,rx,ry,c,seed,only=None):
    r=random.Random(seed); ph=[r.random()*6 for _ in range(3)]
    for y in range(RH):
        for x in range(RW):
            a=math.atan2(y-cy,x-cx); k=1+.14*math.sin(3*a+ph[0])+.09*math.sin(5*a+ph[1])+.06*math.sin(2*a+ph[2])
            if ((x-cx)/rx)**2+((y-cy)/ry)**2<=k*k and (only is None or M[y][x] in only): M[y][x]=c
occupied=set()
def claim(x,y,w,h,pad=1):
    for j in range(-pad,h+pad):
        for i in range(-pad,w+pad): occupied.add((x+i,y+j))
def free(x,y,w=2,h=2):
    return all(0<=x+i<RW and 0<=y+j<RH and M[y+j][x+i]=='g' and (x+i,y+j) not in occupied for j in range(h) for i in range(w))
def tree(x,y,kind='T'):
    if not free(x,y): return False
    M[y][x]=kind; M[y][x+1]=M[y+1][x]=M[y+1][x+1]='x'; return True
frame(0,0,RW-1,RH-1)
GATE=[[43,RH-1],[44,RH-1]]
HOME=[42,6]; claim(42,6,3,2,2)
# roads
rect(43,8,44,RH-1,'p')            # main N-S road to gate
rect(6,14,81,14,'p')              # dog-house lane
rect(6,33,81,34,'p')              # barn road
rect(43,8,44,9,'p')
# dog-house slots (3x2, door middle-bottom) along the lane, spaced 7 apart
HS=[[16,10],[24,10],[32,10],[53,10],[61,10],[69,10]]
for hx,hy in HS: claim(hx,hy,3,2,1); rect(hx+1,hy+2,hx+1,13,'p')
# barns [x,y,w,h,id,name] — far apart, each with a path to the barn road
BARNS=[[52,21,4,3,'coop','CHICKEN COOP'],[62,21,6,3,'cowbarn','COW BARN'],[75,21,6,3,'stable','HORSE STABLE'],
       [50,42,4,3,'sheepshed','SHEEP SHED'],[60,42,4,3,'sty','PIG STY'],[24,42,3,2,'feedshed','FEED SHED'],[33,42,3,2,'toolshed','TOOL SHED']]
for bx,by,bw,bh,_,_n in BARNS:
    claim(bx,by-1,bw,bh+1,2); dx=bx+bw//2; d0=dx-1 if bw%2==0 else dx   # even width: 2-wide door path
    if by<33: rect(d0,by+bh,dx,32,'p')
    else: rect(d0,by+bh,bx+bw,by+bh,'p'); rect(bx+bw,35,bx+bw,by+bh,'p')   # path from door round the side to barn road
# yards: chicken run, horse paddock, sheep pasture, pig mud
frame(49,26,58,31); M[26][54]='p'; M[31][54]='p'
frame(71,25,85,31); M[25][78]='p'; M[31][78]='p'                 # horse paddock (gap = gate by stable door)
frame(46,46,57,53); M[46][52]='p'                 # sheep pasture
frame(58,46,65,51); M[46][62]='p'                 # pig pen
rect(59,47,64,50,'c')                              # mud/soil wallow
for x,y in ((52,28),(55,29),(74,28),(80,27),(49,49),(54,51)): M[y][x]='y'   # hay bales in yards
# props [x,y,w,h,id] solid footprint; art drawn bottom-aligned
PROPS=[[36,22,3,2,'windmill'],[69,20,3,2,'silo'],[39,19,2,2,'well'],[9,22,1,1,'scarecrow'],[27,22,1,1,'scarecrow'],[10,37,1,1,'scarecrow'],
       [66,26,2,1,'trough'],[63,51,2,1,'trough']]
for x,y,w,h,_ in PROPS: claim(x,y,w,h,1)
# crop fields (fenced, with a path gate)
for (x0,y0,x1,y1,c) in [(4,18,17,28,'C'),(20,18,33,28,'W'),(4,36,17,42,'U'),(20,36,22,40,'c')]:
    frame(x0-1,y0-1,x1+1,y1+1); rect(x0,y0,x1,y1,c); M[y1+1][(x0+x1)//2]='p'; M[y0-1][(x0+x1)//2]='p'
    rect((x0+x1)//2,y1+2,(x0+x1)//2,32 if y1<33 else 32,'p') if y1<33 else rect((x0+x1)//2,35,(x0+x1)//2,y0-2,'p')
for x,y,w,h,_ in PROPS:
    if _=='scarecrow': M[y][x]='c'
rect(36,24,38,32,'g'); rect(37,24,37,32,'p')       # windmill track
# flower beds round the house + along main road
for x in (39,40,46,47): M[7][x]='Y'
for y in range(16,31):
    if y not in (23,24): M[y][41]='Y'; M[y][46]='Y'
for x in range(35,42): M[12][x]=rnd.choice('FJK')
for x in range(46,53): M[12][x]=rnd.choice('FJK')
# orchard (apple trees in neat rows)
for y in range(48,60,4):
    for x in range(5,32,4): tree(x,y,'A')
rect(4,46,33,46,'p'); rect(18,35,18,46,'p') if False else None
# ponds: big rounded pond SE with beach ring, little duck pond W
blob(70,57,11,6.5,'b',2,only='g'); blob(70,57,9,5,'w',2)
blob(70,57,1.6,1.1,'g',9)
blob(38,54,4.0,2.7,'w',0); M[54][42]='g'   # v52: smooth oval duck pond, grass verge by the road
rect(44,55,44,56,'p')
# tall-grass weed patches (chores)
for (cx,cy) in ((10,8),(28,7),(58,8),(78,9),(36,47),(78,40),(16,62),(56,62),(84,48),(6,46)):
    for _ in range(7):
        x,y=cx+rnd.randint(-2,2),cy+rnd.randint(-1,1)
        if 0<x<RW-1 and 0<y<RH-1 and M[y][x]=='g' and (x,y) not in occupied: M[y][x]='h'
# wild flowers
for _ in range(60):
    x,y=rnd.randrange(2,RW-2),rnd.randrange(2,RH-2)
    if M[y][x]=='g' and (x,y) not in occupied: M[y][x]=rnd.choice('FJK')
# signs
M[32][42]='s'; M[RH-3][42]='s'; M[9][42]='g'
# tree belt: dense mix along the border + clumps
for x in range(1,RW-2,2):
    tree(x,1,'P' if rnd.random()<.35 else 'T')
    if rnd.random()<.6: tree(x+rnd.randint(0,1),3,'T' if rnd.random()<.6 else 'P')
for y in range(3,RH-3,2):
    tree(1,y,'P' if rnd.random()<.4 else 'T'); tree(RW-3,y,'P' if rnd.random()<.4 else 'T')
    if rnd.random()<.4: tree(3,y,'T')
    if rnd.random()<.4: tree(RW-5,y,'T')
for x in range(1,RW-2,2):
    if not 40<=x<=46: tree(x,RH-3,'T' if rnd.random()<.6 else 'P')
for _ in range(220):
    x,y=rnd.randrange(2,RW-3),rnd.randrange(4,RH-4)
    if any(abs(x-a)<5 and abs(y-b)<4 for a,b in ((43,y),)): continue
    near=sum(1 for j in range(-2,4) for i in range(-2,4) if 0<=x+i<RW and 0<=y+j<RH and M[y+j][x+i] in 'pfCWUcwbYsy')
    if near==0: tree(x,y,'T' if rnd.random()<.7 else 'P')
for gx,gy in GATE: M[gy][gx]='G'
L['legend'].update({'A':'apple tree 2x2 origin','U':'pumpkins','Y':'flower bed','y':'hay bale','c':'tilled soil / mud'})
L.update(pond=[33,51,11,7],width=RW,height=RH,houseSlots=HS,home=HOME,locks=[],gate=GATE,start=[HOME[0]+1,HOME[1]+2],barns=BARNS,props=PROPS,
         paddock=[71,25,15,7],rows=[''.join(r) for r in M])
L['_doc']=L['_doc'].split(' props=')[0]+" props = [x,y,w,h,imageId] solid decorations (windmill, silo, well, scarecrow, trough) drawn bottom-aligned on their footprint. Generated by scripts/gen-ranch.py."
s=re.sub(r'/\*JSON-START\*/.*?/\*JSON-END\*/',lambda m:'/*JSON-START*/'+json.dumps(L,indent=1)+'/*JSON-END*/',src,flags=re.S)
open(P,'w').write(s); print('ranch',RW,RH)
