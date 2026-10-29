# Edició 45.2: teclat sencer

Data: 29 d'octubre de 2026. Són els mateixos canvis de LECAA CAST (PR 6 i 7), adaptats a LECAA.

## Canvis

- **Botó «Activar teclat sencer».** «Lletra i so» i «Construeix la paraula» tenen un botó més a la columna de la dreta, amb un interruptor lliscant. Quan està activat, el botó es veu premut, l'interruptor passa a la dreta i el text canvia a «Desactivar teclat sencer».
- **Què canvia en activar-lo.** Desapareixen les opcions («Lletra i so») o el teclat reduït («Construeix la paraula») i l'alumne escriu la resposta:
  - amb selecció directa o ratolí, amb el teclat físic, si n'hi ha, o amb el teclat en pantalla del sistema operatiu;
  - amb encercament o lector ocular, amb un teclat de LECAA en pantalla (QWERTY amb ç). L'encercament passa primer per dos blocs (meitat esquerra i meitat dreta), després per files i després per tecles. També s'hi pot escriure amb un teclat físic.
- **On es desa.** L'opció es desa per a cada alumne i per a cada activitat per separat, i queda anotada a l'historial de canvis del perfil. També es pot canviar a Opcions avançades › Pla, amb dues caselles. Quan alguna està marcada, hi apareix el selector «Teclat en pantalla»: automàtic segons l'accés, teclat de LECAA o teclat del sistema operatiu.
- **«Lletra i so».** L'alumne escriu la lletra i prem «Fet» o la tecla de retorn. Una lletra que fa el mateix so aïllat que la demanada (per exemple, *v* per *b*) compta com a encert i queda anotada com a tal a la resposta.
- **«Construeix la paraula».** Les lletres escrites omplen les caselles. Si es desactiva el teclat sencer a mitja paraula, el que s'ha escrit es conserva.
- **Ajudes.** Amb el nivell 2, el teclat de LECAA marca la lletra demanada («Lletra i so») o la primera lletra de la paraula («Construeix la paraula»), com ja feia el teclat reduït. Amb els nivells 3 i 4 tornen les opcions o el teclat reduït.
- **Registre.** Cada resposta anota com s'ha donat: teclat sencer del dispositiu, teclat de LECAA, opcions o teclat reduït.
- **Mida de les lletres a «Construeix la paraula» (versió en línia).** A les pantalles de 850 px d'alçada o menys i més de 700 px d'amplada (per exemple, 1366 × 768, 1024 × 600 o un iPad en horitzontal), les lletres feien 76 px dins d'una casella de 58 px. Quedaven travessades per la línia i trepitjaven el teclat. Ara la mida de la lletra s'ajusta a l'alçada de la casella. El canvi és a `eines/ajusta_compatibilitat.py`.

## Comprovacions (Chromium, Linux)

- **Funcionament.** 34 comprovacions superades, tant en línia com amb el fitxer únic: activar i desactivar, opció desada per alumne i per activitat, escriptura amb teclat físic, lletra amb el mateix so, ajudes, pestanya Pla, encercament de dos commutadors per blocs, files i tecles, encercament automàtic, temps d'espera del lector ocular i teclat triat a mà. Cap error de JavaScript.
- **Disposició amb l'opció activada.** 306 casos: 9 mides d'ordinador i tauleta, iPad Mini i iPad Pro 11 en vertical i horitzontal, Pixel 7, iPhone 14, iPhone SE i Galaxy S9+, amb les mides M, L i XL i amb selecció directa i encercament.
  - A ordinadors, tauletes i el Pixel 7, cap element queda retallat ni se superposa.
  - En mòbils de 320 a 390 px d'amplada en vertical, alguns botons o tecles queden fora de la part visible i cal desplaçar l'activitat. Amb encercament, l'activitat es desplaça sola fins a l'element enfocat. El teclat reduït ja tenia aquesta limitació en aquests mòbils.
- **Disposició amb l'opció desactivada.**
  - `node eines/proves_compatibilitat.cjs chromium --extended`: 210 i 588 casos sense retalls, i selecció amb dos commutadors correcta, igual que l'edició anterior.
  - 306 casos comparats amb l'edició anterior: els mateixos retalls en mòbils petits, més el botó nou a l'iPhone SE de 320 px. Les lletres ara caben a la casella.
- **iPad i iPhone.** Restricció d'àudio d'iOS emulada en 20 activitats: cap locució muda.
- **Sense connexió.** 1.859 recursos desats; sense connexió, l'aplicació funciona i el peu indica «Disponible sense connexió».

## Límits

- Només s'ha provat amb Chromium. No s'ha provat amb Safari, Firefox, un iPad o un iPhone reals, ni amb commutadors o lectors oculars reals.
- És probable que Safari a l'iPad i l'iPhone no obri el teclat en pantalla quan comença cada activitat, perquè només l'obre després d'un toc. En aquest cas, cal tocar el requadre on diu «Toca aquí i escriu amb el teclat». No s'ha pogut comprovar en un dispositiu real.
- La Guia i Marc Teòric encara descriu només el teclat reduït.
