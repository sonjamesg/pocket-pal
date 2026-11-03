# v51 plastic-toy pets: chunky rounded silhouettes, big heads, glossy highlights, dark outline (Link's Awakening Switch toy look).
# Base colours stay matched to VAR_MAP in js/critters.js (tabby/black cat, brown hen, rooster recolour by tolerance).
import os,importlib.util
sp=importlib.util.spec_from_file_location('dio',os.path.join(os.path.dirname(__file__),'gen-diorama-art.py'))
src=open(sp.origin).read().split('# --- buildings ---')[0]; dio={'__file__':sp.origin}; exec(src,dio)
C,mix,hx=dio['C'],dio['mix'],dio['hx']
W=hx('ffffff'); EYE=hx('282828'); PINK=hx('ff8aa8')
def gloss(c,x,y,rx,ry): c.ell(x,y,rx,ry,hx('ffffff'),ol=False)
def eyes(c,x1,x2,y,r=2.2):
  for x in (x1,x2): c.ell(x,y,r,r*1.1,EYE); c.ell(x+.7,y-.8,.8,.8,W)
def blush(c,x,y): c.ell(x,y,1.6,1,PINK)
def cat():
  B=hx('e8a048'); D=hx('c87830'); c=C(32,32)
  c.d.line(c.S([24,24,29,14]),fill=dio['OL'],width=5*4); c.d.line(c.S([24,24,29,14]),fill=B,width=3*4)
  c.rr(9,17,16,12,6,B); [c.rr(x,26,4,4,2,B) for x in (10,19)]
  c.poly([(6,9),(8,1),(13,6)],B); c.poly([(19,6),(24,1),(26,9)],B)
  c.ell(16,12,10,8.5,B,ol=True); gloss(c,12,7,3,1.6)
  for x in (12,16,20): c.rr(x-.6,4.5,1.2,3,.5,D,ol=False,shade=False)
  c.ell(16,16,4,2.6,hx('fff1e0')); eyes(c,12,20,12); c.ell(16,14.6,1,.7,PINK); blush(c,9.5,15); blush(c,22.5,15)
  c.save('animals/cat.png')
def chicken():
  B=hx('f5f5f0'); D=hx('dcdcd2'); c=C(32,32)
  c.rr(13,26,1.5,5,0,hx('f0a020'),ol=False,shade=False); c.rr(18,26,1.5,5,0,hx('f0a020'),ol=False,shade=False)
  c.poly([(4,14),(2,8),(9,13)],B); c.ell(14,20,10,8,B,ol=True); c.ell(13,21,5,3.5,D)
  c.ell(21,11,6.5,6.5,B,ol=True); gloss(c,19,8,2,1.2)
  c.ell(21,4.5,2,2,hx('e83030'),ol=True); c.ell(24,4.8,1.6,1.6,hx('e83030'))
  c.poly([(26,11),(30,12.5),(26,14)],hx('ffa020')); c.ell(25.5,15.5,1.2,1.6,hx('e83030'))
  eyes(c,22,22,10,1.6); blush(c,19,13)
  c.save('animals/chicken.png')
def pig():
  B=hx('ffaabb'); c=C(32,32)
  [c.rr(x,24,4,6,2,B) for x in (8,13,19,23)]
  c.ell(15,19,11,7.5,B,ol=True); gloss(c,12,14,4,1.5)
  c.poly([(17,8),(19,2),(23,6)],B); c.poly([(25,6),(29,2),(30,9)],B)
  c.ell(24,14,7.5,7,B,ol=True); gloss(c,22,10,2.2,1.2)
  c.ell(26,17,3.5,2.6,hx('ff8aa0'),ol=True); c.ell(25,17,.7,.9,hx('a04060')); c.ell(27.2,17,.7,.9,hx('a04060'))
  eyes(c,21.5,28,12.5,1.5); c.d.arc(c.S([2,13,8,19]),200,40,fill=dio['OL'],width=4)
  c.save('animals/pig.png')
def rabbit():
  B=hx('fafafa'); c=C(32,32)
  c.rr(11,1,4,12,2,B); c.rr(17,1,4,12,2,B); c.rr(12,3,2,8,1,PINK,ol=False,shade=False); c.rr(18,3,2,8,1,PINK,ol=False,shade=False)
  c.ell(16,23,9,7,B,ol=True); c.ell(7,24,3,3,B,ol=True)
  c.ell(16,15,7.5,6.5,B,ol=True); gloss(c,13,11,2.4,1.2)
  eyes(c,13,19,15); c.ell(16,18,1,.7,PINK); blush(c,11,18); blush(c,21,18)
  c.save('animals/rabbit.png')
def horse():
  B=hx('a8643a'); M=hx('5a3018'); c=C(32,40)
  [c.rr(x,26,4,12,1.5,B) for x in (6,11,19,24)]; [c.rr(x,35,4,3,1,M,ol=False,shade=False) for x in (6,11,19,24)]
  c.d.line(c.S([4,20,1,30]),fill=M,width=4*4)
  c.rr(4,17,24,12,6,B); gloss(c,10,19,5,1.4)
  c.poly([(20,20),(22,8),(28,8),(27,20)],B)
  c.ell(26,9,6,5.5,B,ol=True); c.rr(25,10,7,6,3,hx('d8a078')); gloss(c,24,6,2,1)
  c.poly([(21,4),(22,0),(24,4)],B); c.rr(19,3,3,16,1.5,M,ol=False,shade=False)
  eyes(c,25,25,8,1.5); c.ell(30,13,.6,.6,hx('5a3018'))
  c.save('animals/horse.png')
cat(); chicken(); pig(); rabbit(); horse()
