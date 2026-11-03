#!/usr/bin/env python3
"""Generates the GBA (FireRed-style) world PNGs. Re-run to reset art; hand-edited PNGs can simply replace the outputs."""
import os, random
from PIL import Image, ImageDraw
D = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'world')
H = lambda h: tuple(int(h[i:i+2], 16) for i in (1, 3, 5)) + (255,)
def new(w=16, h=16, c=None): return Image.new('RGBA', (w, h), H(c) if c else (0, 0, 0, 0))
def put(im, pts, c):
    for x, y in pts:
        if 0 <= x < im.width and 0 <= y < im.height: im.putpixel((x, y), H(c))
def save(im, p): im.save(os.path.join(D, p)); print('wrote', p)
# --- grass: teal-green base, darker tufts, light accent dots (seamless) ---
g = new(c='#58c890')
for x, y in [(2, 3), (10, 1), (6, 9), (13, 11), (1, 13)]:  # tufts  "V"
    put(g, [(x, y), (x+2, y), (x+1, y+1)], '#3fa877'); put(g, [(x+1, y)], '#48b480')
put(g, [(5, 2), (12, 6), (3, 7), (9, 13), (15, 4), (7, 15)], '#9ae8c0')
put(g, [(5, 3), (12, 7), (9, 14)], '#c8f8dc')
save(g, 'tiles/grass.png')
# --- path ---
p = new(c='#e6cf98'); random.seed(3)
for _ in range(14): put(p, [(random.randrange(16), random.randrange(16))], random.choice(['#cfb07a', '#d8bc88']))
for _ in range(6): put(p, [(random.randrange(16), random.randrange(16))], '#f6e6bc')
put(p, [(4, 5), (5, 5), (4, 6)], '#b89a68'); put(p, [(11, 11), (12, 11)], '#b89a68')
save(p, 'tiles/path.png')
# --- water: deep blue with lighter wave strokes ---
w = new(c='#3a7ef0')
for x0, y in [(1, 3), (9, 6), (3, 10), (11, 13)]:
    put(w, [(x0+i, y - (1 if i in (2, 3) else 0)) for i in range(6)], '#6aa8f8')
    put(w, [(x0+i, y+1) for i in (1, 4)], '#2a62d8')
put(w, [(7, 1), (14, 9), (1, 14)], '#a8d0ff')
save(w, 'tiles/water.png')
# --- water edge (TOP side; game rotates it for other sides): tan rocky rim ---
e = new()
for x in range(16):
    put(e, [(x, 0)], '#f0c890'); put(e, [(x, 1)], '#d8a060'); put(e, [(x, 2)], '#b87838')
    put(e, [(x, 3)], '#7a4a24' if x % 4 else '#8a5a2e')
put(e, [(2, 1), (3, 1), (9, 1), (10, 2), (14, 1)], '#a06a34')
put(e, [(x, 4) for x in (1, 2, 6, 11, 12)], '#2a62d8')
save(e, 'tiles/water-edge.png')
# --- tree: rounded canopy with 4-tone depth, outline, trunk ---
t = new(); dr = ImageDraw.Draw(t)
dr.ellipse([1, 0, 14, 12], fill=H('#184a30'))
dr.ellipse([2, 1, 13, 11], fill=H('#2a7a48'))
dr.ellipse([3, 1, 11, 8], fill=H('#40a058'))
dr.ellipse([4, 2, 8, 5], fill=H('#7ccc6a'))
put(t, [(5, 2), (6, 3)], '#bdf0a0')
put(t, [(3, 9), (6, 10), (9, 9), (12, 7), (11, 10)], '#1f5e3a')  # under-shadow leaves
dr.rectangle([6, 11, 9, 14], fill=H('#6a4020')); put(t, [(7, 11), (7, 12), (7, 13)], '#94602e')
put(t, [(5, 15), (6, 15), (9, 15), (10, 15)], '#2f8a5a'); put(t, [(4, 14), (11, 14)], '#3fa877')
save(t, 'trees/tree.png')
# --- fence: white picket like FireRed ---
f = new()
for x0 in (1, 9):
    for y in range(3, 15):
        put(f, [(x0, y), (x0+1, y), (x0+2, y)], '#f4f4f4'); put(f, [(x0+3, y)], '#8890a0'); put(f, [(x0-1 if x0 else 0, y)], '#8890a0')
    put(f, [(x0+1, 2)], '#f4f4f4'); put(f, [(x0, 14), (x0+1, 14), (x0+2, 14)], '#b8c0cc')
for x in range(16): put(f, [(x, 6)], '#e0e4ea'); put(f, [(x, 7)], '#8890a0'); put(f, [(x, 11)], '#e0e4ea'); put(f, [(x, 12)], '#8890a0')
put(f, [(x, 15) for x in range(16)], '#3fa877')
save(f, 'tiles/fence.png')
# --- pet store 48x32 (3x2 tiles; door bottom-middle) ---
s = new(48, 32); dr = ImageDraw.Draw(s)
dr.polygon([(0, 13), (5, 1), (43, 1), (47, 13)], fill=H('#d84838'), outline=H('#702018'))
for x in range(6, 44, 4): dr.line([(x, 2), (x - 2, 12)], fill=H('#f06850'))
dr.rectangle([0, 12, 47, 14], fill=H('#902a1e'))
dr.rectangle([2, 14, 45, 31], fill=H('#f6e2a8'), outline=H('#5a4020'))
for y in range(17, 31, 3): dr.line([(3, y), (44, y)], fill=H('#e6cc88'))
for x0 in (4, 32): dr.rectangle([x0, 17, x0 + 10, 25], fill=H('#5aa0f0'), outline=H('#2a3a68')); put(s, [(x0+2, 19), (x0+3, 19), (x0+2, 20)], '#d8f0ff')
dr.rectangle([19, 19, 28, 31], fill=H('#3a5ab8'), outline=H('#1a2448')); dr.line([(23, 20), (23, 31)], fill=H('#2a4498')); put(s, [(26, 25)], '#ffd84a')
dr.rectangle([15, 3, 32, 10], fill=H('#fff8e8'), outline=H('#5a4020'))  # paw sign
dr.ellipse([21, 6, 26, 9], fill=H('#e0457b')); [put(s, [(x, 4), (x, 5)], '#e0457b') for x in (20, 22, 25, 27)]
save(s, 'buildings/petstore.png')
