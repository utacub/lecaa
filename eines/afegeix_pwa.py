"""Fa que la versió en línia de LECAA es pugui instal·lar com a aplicació (PWA).

S'executa després de separa_recursos.py. Copia el manifest, el treballador de
servei i les icones, hi posa la llista de recursos de l'index.html i adapta la
capçalera i la política CSP. Aplica els ajustos de disposició i focus de la revisió de compatibilitat.

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
    html = html[:i] + '\n<script src="pwa.js"></script>' + html[i:]
open(index, 'w', encoding='utf-8').write(html)

recursos = sorted(set(re.findall(r'recursos/[0-9a-f]{20}\.[a-z0-9]+', html)))
sw = open(os.path.join(dir_pwa, 'sw.js'), encoding='utf-8').read()
# Rotate the core cache for changes to either application or offline code.
pwa = open(os.path.join(dir_pwa, 'pwa.js'), encoding='utf-8').read()
versio = hashlib.sha256((html + sw + pwa).encode()).hexdigest()[:12]
sw = sw.replace('__VERSIO__', versio).replace('__RECURSOS__', json.dumps(recursos))
open(os.path.join(out, 'sw.js'), 'w', encoding='utf-8').write(sw)
for nom in ('pwa.js', 'manifest.webmanifest'):
    shutil.copy(os.path.join(dir_pwa, nom), os.path.join(out, nom))

print('PWA:', len(recursos), 'recursos a la memòria cau, versió', versio)
