# Correcció de compatibilitat de la versió publicada de LECAA

Data de revisió: 22 d'octubre de 2026. Base: `b2222518c5081e3a327151bdd6af6dd7a05d40a9`.

## Problema i canvi

Amb mida XL, Lectura a 1.024 × 768 podia disposar les quatre respostes en dues files i ocultar-ne gairebé tota l'última. Rimes retallava els botons en algunes alçades d'ordinador i Escriptura podia ocultar tecles en tauletes verticals. El focus d'encercament es podia aplicar a un control sense fer-lo visible.

La zona d'activitat calcula ara les mides de les respostes segons l'amplada i l'alçada disponibles. Les respostes es mantenen en una fila, amb mida màxima segons la preferència del perfil; imatges i respostes de Rimes comparteixen l'espai vertical. El teclat i les caselles d'escriptura s'ajusten a l'amplada disponible. Els ajustos de disposició s'apliquen a partir de 701 píxels CSS i es recalculen en redimensionar i en carregar tipografies.

El focus de mirada o encercament desplaça, quan cal, només la franja de l'activitat per fer visible el control; la capçalera i els controls de sessió conserven la seva posició. No s'han introduït adaptacions específiques per a mòbils.

La PWA mostra la preparació per a l'ús sense connexió al peu de les pantalles d'adult, fora de les activitats. Només indica «Disponible sense connexió» quan s'han desat els 1.858 recursos. Mostra errors i permet reintentar tant un registre fallit com una descàrrega interrompuda. Tres peticions simultànies limiten la concurrència. La versió de la memòria cau inclou el codi HTML i el codi PWA.

## Validació executada

- 1.008 casos de disposició sense controls retallats ni desbordament horitzontal: 588 en Chromium 153, 210 en Firefox 153 i 210 en WebKit 26.5, sobre Linux. Inclou 14 mides d'ordinador/tauleta, M/L/XL i cinc activitats; l'ampliació de Chromium afegeix paraules llargues, teclats amplis i majúscules/minúscules.
- Desplaçament del focus en contingut que necessita desplaçament i rotació d'una activitat oberta.
- Deu ítems amb àudio real en Chromium: cinc activitats amb Anna i cinc amb Jordi.
- Selecció directa, fixació, mirada + commutador, encercament automàtic i pas a pas amb un o dos commutadors, amb entrades simulades.
- Creació de perfil, contrasenya incorrecta/correcta, sessió de sis activitats, exportació i importació des de la interfície.
- Restauració amb materials de prova i persistència després de recarregar.
- PWA: errors controlats de registre i descàrrega, reintent, 1.858 recursos desats, recàrrega i reproducció d'un fonema sense connexió, resposta parcial de 100 bytes amb estat 206.
- Actualització d'una instal·lació anterior, conservant un perfil i una imatge personalitzada de prova; retirada de la memòria cau de nucli antiga.
- Política CSP del script recalculada; regeneració idempotent des de l'HTML anterior.

Les proves de disposició substitueixen temporalment locucions i animacions. L'àudio real es comprova separadament. La sessió completa usa locució substituïda per verificar la lògica i els registres. No s'han provat dispositius físics de tots els sistemes operatius; aquestes comprovacions no són una certificació universal de Windows, ChromeOS, macOS, iPadOS, Android o Linux. Les limitacions de reproducció en Firefox/WebKit de l'entorn automatitzat continuen requerint una prova nativa. La correcció no modifica la seqüència curricular ni la cobertura de grafies.

## Reproducció i regeneració

Amb Playwright i els navegadors de prova instal·lats:

```sh
node eines/proves_compatibilitat.cjs chromium --extended
node eines/proves_compatibilitat.cjs firefox
node eines/proves_compatibilitat.cjs webkit
```

Els resultats es desen en un directori temporal (o a `LECAA_TEST_OUTPUT`). Es poden indicar `LECAA_ROOT`, `LECAA_BROWSER_PATH` i `LECAA_BROWSER_ARGS` per adaptar l'entorn de prova. El programa retorna un codi d'error si detecta controls retallats o falla una comprovació.

Per regenerar la publicació des d'un HTML d'un sol fitxer:

```sh
python3 eines/separa_recursos.py LECAA.html .
python3 eines/afegeix_pwa.py .
```

El segon pas executa `ajusta_compatibilitat.py` de manera idempotent, recalcula la CSP i genera els fitxers PWA. El fitxer descarregable de les releases anteriors és una distribució separada i no es reemplaça amb aquesta publicació web.
