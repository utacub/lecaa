# Correccions de la instal·lació sense connexió (PWA)

Data: 21 de novembre de 2026. Només canvia la versió en línia; el fitxer HTML únic és el mateix de l'edició 45.3.

## Problema

LECAA es va instal·lar en una tauleta i, sense connexió, hi faltaven molts elements (imatges, sons i vídeos).

## Causes

La versió anterior podia deixar la descàrrega a mitges per tres motius. No es pot saber quin va afectar la tauleta.

- **La descàrrega depenia del treballador de servei.** El treballador de servei (`sw.js`) descarregava els 1.859 fitxers en segon pla. El navegador el pot aturar al cap d'uns minuts, o quan la tauleta passa a segon pla o s'apaga la pantalla. Llavors la descàrrega no es reprenia fins que es tornava a obrir LECAA.
- **Un sol error aturava tota la descàrrega.** Si un fitxer fallava, no es tornava a provar.
- **A l'iPad i l'iPhone, l'aplicació de la pantalla d'inici té l'emmagatzematge separat de Safari.** El que s'havia descarregat a Safari no hi era.

A més, el progrés només es veia al peu de les pantalles d'adult. Cap avís deia que calia esperar amb LECAA oberta.

## Canvis

### La finestra «Instal·lar LECAA»

El botó «Instal·lar» de la pàgina inicial obre una finestra que indica quant ocupa LECAA: 154 MB, desglossats en imatges, sons i veus, vídeos, i programa i lletres.

- **Chrome i Edge.** El botó «Instal·la» demana al navegador que instal·li l'aplicació i en descarrega tots els fitxers. Si el navegador no permet instal·lar des de la pàgina, el botó diu «Descarrega».
- **iPad, iPhone i Safari del Mac.** La finestra explica com afegir LECAA a la pantalla d'inici o al Dock. També diu que cal obrir-la des d'allà amb connexió i esperar que acabi.
- **Mentre es descarrega.** La finestra mostra:
  - l'avís «No tanquis LECAA ni desconnectis el dispositiu d'Internet fins que acabi»;
  - una barra de progrés, els MB descarregats i el percentatge;
  - el botó «Atura la descàrrega».

  La pàgina inicial i el peu de les pantalles d'adult també mostren el percentatge.
- **En acabar.** La finestra diu que LECAA funciona sense connexió, i el peu indica «Disponible sense connexió».

### Descàrrega més segura

- **La fa la pàgina, no el treballador de servei.** Baixa cinc fitxers alhora i comprova la mida de cada fitxer.
- **Errors.** Torna a provar cada fitxer que falla fins a tres vegades. Un fitxer només es dona per perdut si no rep dades durant 30 segons, de manera que també funciona amb connexions lentes.
- **Represa.** Si s'atura, la vegada següent continua on s'havia quedat, sense tornar a baixar el que ja hi ha. Si es perd la connexió, ho diu i continua sola quan la connexió torna.
- **Durant la descàrrega:**
  - la pantalla no s'apaga, si el navegador ho permet;
  - es demana al navegador que no esborri els fitxers quan li falti espai;
  - si LECAA és oberta en dues finestres, només en descarrega una.
- **L'aplicació instal·lada.** La primera vegada que s'obre, obre la finestra i ho descarrega tot. Si encara falta alguna cosa, avisa i ho completa quan torna a haver-hi connexió. Si una versió nova de LECAA porta fitxers nous, els descarrega sense obrir la finestra.
- **Visitar la web sense instal·lar-la no descarrega res de més.** Abans, qualsevol visita començava a descarregar els 154 MB.

### Fitxers

- `eines/afegeix_pwa.py` escriu `pwa-fitxers.json`, amb la llista de fitxers i la mida de cadascun.
- `eines/pwa/pwa.js` passa a ser `eines/pwa/lecaa-pwa.js`. Amb un nom nou, el treballador de servei de la versió anterior no pot servir l'script antic a la pàgina nova.
- `eines/pwa/sw.js` ja no descarrega res, només serveix els fitxers desats. Té tres canvis més:
  - fa passar per la xarxa la pàgina i els fitxers del programa, i fa servir la còpia desada si no hi ha connexió o la xarxa no respon en 4 segons;
  - desa les còpies noves en instal·lar-se, i no les de la memòria del navegador;
  - només desa com a pàgina de LECAA la pàgina principal.

## Comprovacions (Chromium, Linux)

S'han fet amb un servidor local que imita GitHub Pages i pot fallar o anar lent a voluntat.

- **Visita sense instal·lar.** No es descarrega cap fitxer de més.
- **Descàrrega completa.** S'han desat els 1.859 fitxers (154 MB), tots amb la mida correcta, i els 8 fitxers del programa.
- **Sense connexió:**
  - LECAA s'obre i els 1.859 fitxers es poden obrir. Es carreguen 941 imatges, 835 sons i 81 vídeos.
  - Els àudios i vídeos responen a les peticions parcials que fan els navegadors.
  - En una sessió de 45 passos amb el perfil de mostra no hi ha cap imatge trencada, petició fallida ni error de JavaScript.
- **Represa i errors:**
  - Si es recarrega a mitges, la descàrrega continua sola: 1.861 peticions per a 1.859 fitxers.
  - «Atura la descàrrega» la deixa aturada en aquella visita.
  - Si es perd la connexió a mitges, avisa i continua sola quan torna.
  - Amb un servidor que falla el 8 % de les peticions, s'acaba igualment.
  - Si un fitxer falla sempre, apareix un missatge d'error, i la descàrrega s'acaba quan el fitxer torna a funcionar.
- **Aplicació instal·lada (simulada):**
  - La primera vegada obre la finestra i ho descarrega tot. Les vegades següents no surt la finestra, i s'obre sense connexió.
  - Si es tanca abans d'acabar i s'obre sense connexió, avisa del que falta. Quan torna la connexió, ho completa sola.
- **iPad (simulat).** A Safari mostra els passos i no descarrega res. L'aplicació de la pantalla d'inici ho descarrega tot.
- **Pas des de la versió publicada:**
  - Amb tot descarregat, la versió nova s'activa, no torna a baixar res i funciona sense connexió (3 proves de 3, amb Chromium sense eines de proves connectades al treballador de servei).
  - Amb la descàrrega antiga interrompuda, com a la tauleta, l'aplicació instal·lada obre la finestra i ho completa.
- **Mida de la finestra.** La finestra cap en un iPhone SE, un iPhone 14 i un iPad Mini.
- **Disposició.** `node eines/proves_compatibilitat.cjs chromium --extended` supera els 210 i 588 casos sense retalls, igual que l'edició anterior.

## Límits

- Només s'ha provat amb Chromium. No s'ha provat amb Safari, Firefox ni Edge, ni en una tauleta, un iPad o un iPhone reals. L'aplicació instal·lada i l'iPad s'han simulat.
- La primera vegada cal connexió, i cal deixar LECAA oberta fins que acabi la descàrrega.
- En una tauleta que ja tingui LECAA instal·lada, la versió nova arriba la primera vegada que s'obre amb connexió. Si llavors falta algun fitxer, s'obre la finestra i es completa la descàrrega.
