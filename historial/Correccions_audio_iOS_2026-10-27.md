# Correcció de les locucions a iPad i iPhone

Data: 27 d'octubre de 2026. Mateixa correcció que LECAA CAST 0.6.7.

## Problema

- **iPad i iPhone.** Cada locució creava un element d'àudio nou. iOS i iPadOS només deixen sonar un element si s'ha començat a reproduir amb un toc, de manera que les consignes que sonen soles (la presentació de cada activitat, la retroacció i les ajudes automàtiques) podien quedar mudes. Llavors apareixia l'avís «Aquest text encara no es pot escoltar: …».
- **Velocitat de la veu.** La velocitat no s'aplicava mai, perquè `load()` tornava l'àudio a 1× abans de sonar. «Velocitat de la veu» i les ajudes lentes sonaven a velocitat normal.

## Canvis

- Les locucions d'Anna i Jordi i els enregistraments propis del perfil fan servir un sol element d'àudio. El primer toc el desbloqueja amb un silenci breu.
- La velocitat s'aplica després de carregar l'àudio, entre 0,5× i 4×.
- No es mostra cap avís a la pantalla quan un text no es pot reproduir. Queda anotat a `Voice.missingSpeech`.
- `eines/ajusta_compatibilitat.py` recalcula ara el hash CSP tant si la política ja té `'self'` com si no. Abans, en regenerar des del fitxer únic, el hash quedava antic i el navegador bloquejava l'aplicació.

## Comprovacions (Chromium 153, Linux)

- Cobertura: les 9.251 frases que pot dir l'aplicació i 1.482 parelles de rima tenen locució amb Anna i amb Jordi; els 834 fitxers d'àudio es descodifiquen.
- Restricció d'iOS emulada (un element només sona si el primer `play()` es fa durant un toc), 20 activitats de les cinc menes amb Anna i Jordi. Abans: 20 de 20 amb locucions mudes i l'avís a la pantalla. Després: 0 de 20, tant en línia com amb el fitxer únic.
- Velocitat: amb 0,6 la locució sona a 0,6× (abans, 1×).
- PWA: 1.859 recursos desats; sense connexió, la veu sona i el peu indica «Disponible sense connexió».
- `node eines/proves_compatibilitat.cjs chromium`: 210 casos de disposició sense retalls i selecció amb dos commutadors correcta.

Comprovat en un iPad real per la UTAC el 27 d'octubre de 2026: les locucions sonen. No s'ha provat en un iPhone.
