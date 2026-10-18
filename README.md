# LECAA

**Lectura i Escriptura per a usuaris de Comunicació Augmentativa i Alternativa** · Edició 45 (17 d'octubre de 2026)

LECAA és una aplicació web per practicar les bases del codi escrit en català. Inclou activitats de so inicial, rima, correspondència entre lletres i sons, lectura de paraules i construcció de paraules amb un teclat reduït. Totes les respostes es donen seleccionant, de manera que no cal respondre oralment. Es pot fer servir amb selecció directa, ratolí, lector ocular o un o dos commutadors.

LECAA és un recurs complementari. No és un mètode complet d'ensenyament de la lectura i l'escriptura, ni substitueix la intervenció educativa, la lectura compartida, l'escriptura amb finalitats comunicatives o el treball de vocabulari i comprensió. Com a aplicació, no compta amb evidència pròpia, però el seu disseny s'ha basat en tota l'evidència científica disponible en el moment de la seva creació, que es resumeix a la [Guia i Marc Teòric](docs/GUIA-I-MARC-TEORIC.md).

L'aplicació s'ha creat des de la Unitat de Tècniques Augmentatives i Alternatives de Comunicació (UTAC) amb eines d'intel·ligència artificial.

## Com fer-la servir

- **En línia:** https://utacub.github.io/lecaa/
- **Descàrrega en un sol fitxer:** https://github.com/utacub/lecaa/releases/latest/download/LECAA.html

El fitxer descarregat porta incorporats totes les imatges, els àudios, les animacions i les fonts. S'obre amb qualsevol navegador actual i funciona sense connexió.

La versió en línia és la mateixa aplicació amb els recursos en fitxers separats, perquè GitHub no admet fitxers de més de 100 MB. Es genera a partir del fitxer únic amb [`eines/separa_recursos.py`](eines/separa_recursos.py).

## Dades i privacitat

Els perfils, el progrés, les fotografies i els àudios personalitzats es desen només al navegador del dispositiu. LECAA no els envia a cap servidor, no té comptes en línia i no sincronitza dades entre dispositius. Les dades de la versió en línia i les del fitxer descarregat es desen en espais diferents del navegador. Per canviar de dispositiu, de versió o de manera d'obrir l'aplicació, cal exportar una còpia de seguretat des de l'aplicació i importar-la a l'altre lloc. Aquesta còpia conté dades personals i s'ha de conservar en privat.

## Contingut del repositori

| Carpeta | Contingut |
|---|---|
| [`docs/`](docs/) | Guia i marc teòric, instruccions (LLEGEIX-ME), fonts i llicències, i sumes de comprovació de l'edició 45. |
| [`index.html`](index.html), [`recursos/`](recursos/) | Versió en línia de l'aplicació. |
| [`eines/`](eines/) | Script que genera la versió en línia a partir del fitxer únic. |
| [`historial/`](historial/) | Canvis i verificacions de les edicions 42 a 45, auditoria de l'edició 41 i indicacions de les il·lustracions. |

## Llicències

Les atribucions i les llicències dels components (pictogrames d'ARASAAC, fonts tipogràfiques i logotips institucionals) es detallen a [FONTS-I-LLICENCIES.txt](docs/FONTS-I-LLICENCIES.txt). No s'assigna cap llicència nova a l'aplicació ni als logotips de tercers.
