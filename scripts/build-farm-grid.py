#!/usr/bin/env python3
"""Regenerate assets/world/farm-grid.{png,json,html} from js/map-data.js (the single
source of truth the game also loads). Run after ANY map layout change: scripts/build.sh"""
import json, os, re
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W_DIR = os.path.join(ROOT, 'assets', 'world')
src = open(os.path.join(ROOT, 'js', 'map-data.js'), encoding='utf-8').read()
L = json.loads(re.search(r'/\*JSON-START\*/(.*?)/\*JSON-END\*/', src, re.S).group(1))
TS, MW, MH, rows = L['tileSize'], L['width'], L['height'], L['rows']
assert len(rows) == MH and all(len(r) == MW for r in rows), 'rows must be width x height'
def col(x):
    s = ''
    x += 1
    while x: x, r = divmod(x - 1, 26); s = chr(65 + r) + s
    return s
name = lambda x, y: f'{col(x)}{y + 1}'
legend = dict(L['legend'], H='house', L='locked')
cells = {}
for y in range(MH):
    for x in range(MW):
        c = rows[y][x]; cells[name(x, y)] = {'x': x, 'y': y, 'tile': c, 'kind': legend.get(c, c)}
slots, locked = [], []
for i, (hx, hy) in enumerate(L['houseSlots']):
    for dy in range(2):
        for dx in range(3):
            cells[name(hx+dx, hy+dy)].update(kind='house_slot', feature=f'H{i+1}', slot=i+1)
    slots.append({'slot': i+1, 'origin': [hx, hy], 'door': [hx+1, hy+1], 'grid': name(hx, hy), 'doorGrid': name(hx+1, hy+1)})
for hx, hy, n in L['locks']:
    for dy in range(2):
        for dx in range(3):
            cells[name(hx+dx, hy+dy)].update(kind='locked', feature=n)
    locked.append({'name': n, 'origin': [hx, hy], 'grid': name(hx, hy)})
store = None
if L.get('petStore'):
    sx, sy = L['petStore']
    for dy in range(2):
        for dx in range(3):
            cells[name(sx+dx, sy+dy)].update(kind='pet_store', feature='PET STORE')
    store = {'origin': [sx, sy], 'door': [sx+1, sy+1], 'grid': name(sx, sy), 'doorGrid': name(sx+1, sy+1)}
out = {'generatedFrom': 'js/map-data.js', 'width': MW, 'height': MH, 'tileSize': TS,
       'cols': [col(x) for x in range(MW)], 'rows': list(range(1, MH+1)),
       'howTo': 'Caller says e.g. B2 → look up cells["B2"]. Letters = columns left→right starting A=x0. Numbers = rows top→bottom starting 1=y0.',
       'legend': legend, 'houseSlots': slots, 'locked': locked, 'petStore': store, 'cells': cells}
json.dump(out, open(os.path.join(W_DIR, 'farm-grid.json'), 'w'), indent=2, ensure_ascii=False)
# --- PNG ---
man = json.load(open(os.path.join(W_DIR, 'manifest.json')))['images']
def img(k):
    p = man.get(k)
    try: return Image.open(os.path.join(W_DIR, p)).convert('RGBA') if p else None
    except Exception: return None
TILE = {'C':'corn','W':'wheat','p':'path','w':'water','c':'field','f':'fence','t':'tree','s':'sign'}
FALL = {'grass':'#78c858','path':'#e8d8a0','water':'#4888e8','field':'#986838','fence':'#b07038','corn':'#d0b040','wheat':'#e8c860','tree':'#307030','sign':'#c89a60'}
S, M = 28, 36  # px per cell, margin for labels
cache = {}
def tile(k):
    if k not in cache:
        im = img(k); cache[k] = im.crop((0, max(0, im.height-TS), TS, im.height)).resize((S, S), Image.NEAREST) if im else None
    return cache[k]
im = Image.new('RGBA', (M + MW*S + 4, M + MH*S + 4), '#1d1830'); d = ImageDraw.Draw(im)
try: font = ImageFont.truetype('DejaVuSans-Bold.ttf', 12); small = ImageFont.truetype('DejaVuSans-Bold.ttf', 9)
except Exception: font = small = ImageFont.load_default()
for y in range(MH):
    for x in range(MW):
        X, Y = M + x*S, M + y*S
        for k in ('grass', TILE.get(rows[y][x])):
            if not k: continue
            t = tile(k)
            if t: im.alpha_composite(t, (X, Y))
            else: d.rectangle([X, Y, X+S-1, Y+S-1], fill=FALL[k])
def box(hx, hy, fill, label):
    X, Y = M + hx*S, M + hy*S
    d.rectangle([X+1, Y+1, X+3*S-2, Y+2*S-2], fill=fill, outline='#2b2440', width=2)
    d.text((X+3*S/2, Y+S), label, fill='#fff', font=small, anchor='mm')
for s in slots: box(*s['origin'], '#c0503a', f"HOUSE {s['slot']}")
for l in locked: box(*l['origin'], '#7a7090', l['name'])
if store: box(*store['origin'], '#e08a20', 'PET STORE')
for x in range(MW + 1): d.line([M + x*S, M, M + x*S, M + MH*S], fill=(0, 0, 0, 90))
for y in range(MH + 1): d.line([M, M + y*S, M + MW*S, M + y*S], fill=(0, 0, 0, 90))
for x in range(MW): d.text((M + x*S + S/2, M/2), col(x), fill='#ffd84a', font=font, anchor='mm')
for y in range(MH): d.text((M/2, M + y*S + S/2), str(y+1), fill='#ffd84a', font=font, anchor='mm')
im.save(os.path.join(W_DIR, 'farm-grid.png'))
hs = ', '.join(f"#{s['slot']}={s['grid']}" for s in slots); ls = ', '.join(f"{l['name']}={l['grid']}" for l in locked)
open(os.path.join(W_DIR, 'farm-grid.html'), 'w', encoding='utf-8').write(f'''<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Pet Farm grid</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{{margin:0;background:#1d1830;color:#eee;font-family:system-ui,sans-serif}}
img{{max-width:100%;height:auto;image-rendering:pixelated;display:block;margin:12px auto;background:#111}}
p{{padding:0 16px;max-width:920px;margin:8px auto;line-height:1.45}}
code{{background:#2a2347;padding:2px 6px;border-radius:4px}}</style></head>
<body>
<p><b>Pet Farm overworld grid</b> — say coordinates like <code>B2</code> or <code>P10</code>. Letters = columns left→right (<code>A</code> = x0). Numbers = rows top→bottom (<code>1</code> = y0). Each cell is one game tile. Auto-generated from <code>js/map-data.js</code>.</p>
<img src="farm-grid.png?t={os.path.getmtime(os.path.join(W_DIR, 'farm-grid.png')):.0f}" alt="Farm grid" width="{im.width}" height="{im.height}">
<p>Pet house origins: {hs}. Locked: {ls}. Pet store: {store['grid'] if store else '-'} (door {store['doorGrid'] if store else '-'}).</p>
<p>Download: <a href="farm-grid.png" style="color:#ffd84a">farm-grid.png</a> · <a href="farm-grid.json" style="color:#ffd84a">farm-grid.json</a> (agent reference).</p>
</body></html>
''')
print(f'farm-grid regenerated: {MW}x{MH}, houses {hs}; locked {ls}')
