"""Fa que la versió en línia de LECAA es pugui instal·lar com a aplicació (PWA).

S'executa després de separa_recursos.py. Copia el manifest, el treballador de
servei i les icones, hi posa la llista de recursos de l'index.html i adapta la
capçalera i la política CSP. Aplica els ajustos de disposició i focus de la revisió de compatibilitat.
Escriu pwa-fitxers.json, la llista de fitxers amb la mida de cadascun, que lecaa-pwa.js fa servir per
descarregar-ho tot i mostrar la barra de progrés.

Ús: python3 eines/afegeix_pwa.py .
"""
import hashlib, json, os, re, shutil, sys, subprocess

out = sys.argv[1]
dir_pwa = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pwa')
index = os.path.join(out, 'index.html')
subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                'ajusta_compatibilitat.py'), index], check=True)
html = open(index, encoding='utf-8').read()

# Icones fetes a partir de la icona SVG de l'aplicació (la adaptable té el dibuix dins la zona segura).
shutil.copytree(os.path.join(dir_pwa, 'icones'), os.path.join(out, 'icones'), dirs_exist_ok=True)

if '<link rel="manifest"' not in html:
    html = html.replace('<meta name="theme-color"', '<link rel="manifest" href="manifest.webmanifest">\n<meta name="theme-color"', 1)
    html = html.replace("script-src 'sha256-", "script-src 'self' 'sha256-", 1)
    for antic, nou in (("connect-src 'none'", "connect-src 'self'"), ("worker-src 'none'", "worker-src 'self'"),
                       ("manifest-src 'none'", "manifest-src 'self'")):
        assert antic in html, f'La política CSP no té {antic}'
        html = html.replace(antic, nou, 1)
    i = html.rindex('</script>') + len('</script>')
    html = html[:i] + '\n<script src="lecaa-pwa.js"></script>' + html[i:]
open(index, 'w', encoding='utf-8').write(html)

recursos = sorted(set(re.findall(r'recursos/[0-9a-f]{20}\.[a-z0-9]+', html)))
sw = open(os.path.join(dir_pwa, 'sw.js'), encoding='utf-8').read()
# Rotate the core cache for changes to either application or offline code.
pwa = open(os.path.join(dir_pwa, 'lecaa-pwa.js'), encoding='utf-8').read()
versio = hashlib.sha256((html + sw + pwa).encode()).hexdigest()[:12]
icones = sorted('icones/' + f for f in os.listdir(os.path.join(dir_pwa, 'icones')))
nucli = ['./', 'index.html', 'lecaa-pwa.js', 'manifest.webmanifest', 'pwa-fitxers.json'] + icones
sw = (sw.replace('__VERSIO__', versio).replace('__NUCLI__', json.dumps(nucli))
        .replace('__RECURSOS__', json.dumps(recursos)))
open(os.path.join(out, 'sw.js'), 'w', encoding='utf-8').write(sw)
for nom in ('lecaa-pwa.js', 'manifest.webmanifest'):
    shutil.copy(os.path.join(dir_pwa, nom), os.path.join(out, nom))
antic = os.path.join(out, 'pwa.js')
if os.path.exists(antic):
    os.remove(antic)

# Mida de cada fitxer: la pàgina comprova que cada descàrrega és completa i en mostra el progrés.
mida = lambda f: os.path.getsize(os.path.join(out, f))
fitxers = [[r, mida(r)] for r in recursos]
bytes_nucli = sum(mida(f) for f in nucli if f not in ('./', 'pwa-fitxers.json'))
with open(os.path.join(out, 'pwa-fitxers.json'), 'w', encoding='utf-8') as f:
    json.dump({'versio': versio, 'nucli': bytes_nucli, 'fitxers': fitxers}, f, separators=(',', ':'))

total = bytes_nucli + sum(m for _, m in fitxers)
print('PWA:', len(recursos), 'recursos per descarregar,', round(total / 1048576), 'MB, versió', versio)
