"""Genera la versió en línia de LECAA a partir de l'HTML d'un sol fitxer.

Extreu cada recurs incrustat (data:...;base64) a recursos/, el substitueix
per una ruta relativa, recalcula el hash del script a la política CSP i hi
afegeix 'self' per a imatges, àudios, vídeos i fonts. No canvia res més.

Ús: python3 eines/separa_recursos.py LECAA.html .
"""
import base64, hashlib, os, re, sys

EXT = {'image/webp': 'webp', 'audio/wav': 'wav', 'image/png': 'png', 'audio/mpeg': 'mp3',
       'video/mp4': 'mp4', 'font/ttf': 'ttf', 'image/svg+xml': 'svg'}
PAT = re.compile(r'data:([a-z]+/[a-z0-9.+-]+)(?:;[a-z0-9=-]+)*;base64,([A-Za-z0-9+/]*={0,2})')

src, out = sys.argv[1], sys.argv[2]
html = open(src, encoding='utf-8').read()
os.makedirs(os.path.join(out, 'recursos'), exist_ok=True)

def extreu(m):
    data = base64.b64decode(m.group(2), validate=True)
    nom = f"recursos/{hashlib.sha256(data).hexdigest()[:20]}.{EXT[m.group(1)]}"
    with open(os.path.join(out, nom), 'wb') as f:
        f.write(data)
    return nom

html = PAT.sub(extreu, html)
scripts = re.findall(r'<script>([\s\S]*?)</script>', html)
assert len(scripts) == 1, 'Cal exactament un script en línia'
nou = base64.b64encode(hashlib.sha256(scripts[0].encode()).digest()).decode()
html = re.sub(r"script-src 'sha256-[^']+'", f"script-src 'sha256-{nou}'", html, count=1)
antic = "img-src data: blob:; media-src data: blob:; font-src data:;"
assert antic in html, 'La política CSP no té el format esperat'
html = html.replace(antic, "img-src 'self' data: blob:; media-src 'self' data: blob:; font-src 'self' data:;", 1)
open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(html)
print('Fet:', len(os.listdir(os.path.join(out, 'recursos'))), 'recursos')
