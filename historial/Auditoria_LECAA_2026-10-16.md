# Auditoria de tancament de LECAA

**Data:** 16 d’octubre de 2026. **Versió rebuda:** edició 40. **Versió corregida:** edició 41.

**Dictamen:** les incidències tècniques reproduïdes s’han corregit i les comprovacions finals d’execució han passat. **No es pot afirmar encara que tot el projecte estigui tancat:** queda per decidir l’abast curricular, perquè la seqüència no cobreix totes les grafies del corpus i l’escriptura exclou les paraules de més de sis grafemes. Aquesta auditoria tampoc aporta una validació humana documentada dels continguts fonètics ni de la utilització amb els dispositius reals.

Aquest informe distingeix resultats observats, limitacions de disseny i comprovacions que no s’han fet. Les dades específiques de LECAA procedeixen de la inspecció dels fitxers i de les proves registrades a l’arxiu d’evidències adjunt (UTAC, 2026a, 2026b). Les fonts externes serveixen per establir criteris tècnics; no acrediten l’eficàcia educativa de LECAA.

## 1. Abast i metodologia

S’ha inspeccionat l’HTML complet, no una maqueta ni una versió amb recursos substituïts. S’han contrastat els requisits de la conversa: guies, animacions, tres estils d’imatge, paleta, capçaleres, crèdits, eliminació dels missatges lliures, majúscules/minúscules, ressaltat de lletres, suports, perfils locals i còpies de seguretat.

Les proves s’han executat en Chromium, tant obrint el fitxer local com servint l’HTML per HTTP en un servidor de prova. S’han utilitzat perfils ficticis i contextos de navegador independents. Els àudios i vídeos s’han descodificat; s’han verificat les imatges i les fonts. Les 900 associacions entre paraula i estil s’han inspeccionat visualment en quinze fulls de contacte. Aquesta inspecció visual no equival a una prova de reconeixement dels dibuixos amb alumnes.

S’han completat **102 comprovacions agrupades: 101 superades i una constatació curricular oberta**. Els recomptes no són una certificació de cobertura de tot estat possible del programa. Les proves funcionals combinen seleccions reals sobre la interfície amb proves controlades del motor de tasques. En les proves de lògica s’ha accelerat o substituït la locució; la reproducció real d’un àudio i d’un vídeo s’ha comprovat separadament.

## 2. Recursos i integritat

| Element | Resultat observat |
| --- | --- |
| Corpus | 300 paraules, distribuïdes en 12 nivells. |
| Senzilles / Detallades / ARASAAC | Cobertura de les 300 paraules en cadascun dels tres estils. Són 900 associacions; alguns conceptes comparteixen pictograma. |
| Imatges i tipografies incrustades | 623 WebP, 309 PNG, 2 SVG i 2 fonts TTF; verificació sense errors. |
| Àudio incrustat | 234 recursos MPEG i 602 WAV; descodificació sense errors. Alguns recursos són blocs amb molts fragments. |
| Fragments d’àudio | 5.731 entrades actives/resoltes comprovades; cap tall fora dels límits temporals dels recursos. |
| Veus | Les 300 paraules, els sons de la seqüència actual i les presentacions dels nou guies tenen recursos amb Anna i Jordi. |
| Animacions | 81 MP4: nou clips per cadascun dels nou guies; descodificació sense errors. |
| Retalls estàtics dels guies | Els nou PNG de selecció tenen canal alfa amb transparència real. |
| Conservació de recursos | Els 1.853 recursos incrustats són idèntics, byte a byte, entre les edicions 40 i 41. |
| Distribució | L’HTML incorpora els recursos i el ZIP conté el mateix HTML verificat. |

«Sense errors de descodificació» no significa «pronunciació validada». Les durades i els límits són comprovables automàticament; la precisió dels fonemes, la prosòdia i l’adequació perceptiva requereixen escolta professional.

## 3. Requisits de la versió final

| Requisit | Resultat |
| --- | --- |
| Oliva i dofí retirats de la selecció; elefant conservat | Nou guies disponibles, amb noms genèrics, inclosa Tortuga. |
| Guia animat, estàtic o sense guia | Comportament comprovat; el moviment reduït del sistema també atura les animacions. |
| Guia sense bombolla | El contenidor conserva el seu nom intern però no té fons, contorn, ombra ni arrodoniment visible en les activitats. |
| Capçalera i enunciat | Marca UTAC negra i LECAA; nom del perfil i accés d’adult a la mateixa capçalera; guia i enunciat a la franja següent. |
| Pàgina inicial | Formulació «Lectura i Escriptura per usuaris de Comunicació Augmentativa i Alternativa (LECAA)» i escena d’aula incorporades. |
| Crèdits institucionals | Cinc logotips en ordre: UTAC, UB en color, FBG en fons blanc i dos departaments. Paràgrafs que es va demanar retirar absents. |
| Tres estils d’imatge | Noms Senzilles, Detallades i ARASAAC; preferència del perfil. |
| ARASAAC de plom | Diferent del de tub; es conserva el PNG aportat. |
| Missatges lliures de l’alumne i notes família/professionals | No hi ha plantilles d’activitat ni pestanyes actives d’aquests missatges. |
| Majúscules/minúscules | Configuració del perfil aplicada als elements dels exercicis; enunciats amb el format establert. |
| «El que he escrit» | Ressaltat seqüencial i neteja del ressaltat en acabar. |
| Controls d’escriptura | A la dreta; visibles en les proves a 1.366×768 i 1.024×768. Sense desbordament horitzontal a 390 i 320 píxels. |
| Enunciats i suports | El cronòmetre de suports comença després de la presentació. A T8 no s’ha observat inici de pistes o encercament durant l’enunciat. |
| Modalitats d’accés | Selecció directa, fixació, mirada + commutador, encercament automàtic i pas a pas amb un o dos commutadors: selecció comprovada amb entrada simulada. |

## 4. Incidències corregides a l’edició 41

| Incidència reproduïda o identificada al codi | Correcció i verificació |
| --- | --- |
| Les respostes T11 s’afegien al registre però no al comptador de la sessió | Recompte sincronitzat amb els ítems registrats; T11 passa de 0/1 a 1/1 en la prova. |
| Pausar durant l’enunciat podia deixar «Repetir» bloquejat | Presentació cancel·lable i represa explícita; comprovada la repetició després de continuar. La mateixa gestió s’aplica al retorn des de la zona d’adult. |
| Escalfament/tancament podien generar T2 encara que estigués desactivada | La selecció respecta les activitats habilitades. Sense activitat elegible es torna al Pla amb un missatge explicatiu. |
| Rimes podia utilitzar paraules excloses del perfil | Filtrat de les famílies i comprovació de disponibilitat. Prova amb 500 parelles i amb el banc esgotat. |
| Distractors amb conceptes equivalents podien competir en altres estils | S’unifiquen els conceptes ja identificats per ID o etiqueta al catàleg; «got/vas», «roca/pedra», «fruit/poma» i «mona/mico» no competeixen entre si en cap dels tres estils, quan s’utilitzen les imatges incorporades. Les fotos pròpies mantenen la seva prioritat. |
| Caselles buides d’escriptura invisibles | El tractament genèric dels missatges buits ocultava el contenidor `slots`; s’exclou d’aquell tractament. Caselles visibles abans de teclejar en les quatre amplades provades. |
| Botons de reproducció sense nom accessible després de convertir la icona a SVG | Etiquetes descriptives per als 24 sons; noms per als deu emblemes de perfil. |
| Diàlegs de pausa/contrasenya sense confinament de Tab | Focus dins del diàleg i gestió d’Esc. Provat el diàleg de contrasenya amb error i accés correcte. |
| Una tecla aliena podia completar una pulsació mínima de commutador | Només s’accepta l’alliberament de la tecla configurada; s’esborren pulsacions pendents en canviar de context. |
| Registre del primer error buit en escriptura | Es conserva la resposta inicial buida com un error i no se sobreescriu en intents posteriors. |
| Denominació «Flow · Omni Lite 1.1» no acreditada pels arxius | El crèdit queda com a **Flow — Google**. La documentació oficial diferencia Veo 3.1 Lite i Gemini Omni Flash 1.1; sense metadades de generació no s’atribueix un model concret (Google, s. d.). |

S’ha actualitzat la signatura del codi de la política CSP i la identificació d’edició. S’han mantingut els recursos i els perfils utilitzen el mateix esquema de dades.

## 5. Privacitat, conservació i còpies

Les proves sobre l’HTML auditat han confirmat persistència local, exportació individual i conjunta, restauració en un context independent, conservació exacta d’imatges i àudios personalitzats, contrasenya codificada, preferències, progrés i historial. També han passat la compatibilitat amb còpies antigues, els noms repetits, el rebuig de còpies malformades o amb recursos remots i la recuperació davant un error d’espai durant la importació.

En el servidor de prova només s’han rebut peticions del document. Els intents controlats d’enviament amb `fetch`, balisa i imatge remota s’han bloquejat. L’HTML auditat no incorpora comptes remots ni una base de dades d’alumnes al servidor; els perfils són al navegador. La CSP restringeix les connexions de l’aplicació, d’acord amb el funcionament d’aquesta política (World Wide Web Consortium [W3C], s. d.).

**Aquesta constatació es refereix al fitxer exacte auditat.** No s’ha inspeccionat el web de producció, una possible pàgina que l’incrusti, les capçaleres del servidor ni els seus registres. No s’afirma que un allotjament extern no tracti dades de navegació.

**Actualització entre versions:** abans de canviar el fitxer, la carpeta, el navegador o l’adreça de publicació, cal exportar els perfils i comprovar-ne la importació. MDN documenta que el comportament de l’emmagatzematge en URL `file:` no està garantit entre navegadors; un canvi de ruta pot mostrar un altre espai local (MDN contributors, 2026). La còpia JSON conté dades personals i no està xifrada, tal com indica la documentació inclosa.

## 6. Pendent prioritari: cobertura curricular real

### 6.1. Trenta-vuit paraules fora de la seqüència

Amb totes les 24 entrades de la seqüència marcades com apreses, **38 de 300 paraules no superen el filtre de descodificació**. Contenen una o més de les grafies `j`, `x`, `qu`, `gu`, `rr`, `ss`, `tx` o `tg`, que el segmentador reconeix però que el Pla no permet ensenyar o marcar dins de la seqüència actual.

Conseqüència observada: sense exclusions ni guia que retiri una paraula, hi ha **262 paraules elegibles per a lectura**, no 300. Tenir imatge i àudio per a una paraula no implica que el motor l’arribi a seleccionar.

| Grafies absents | Paraules afectades |
| --- | --- |
| gu | guix |
| x | panxa, caixa, vaixell, bruixa, maduixa, gronxador |
| j | jersei, joia, jove, pluja, granja, platja, pijama, taronja |
| rr | torre, carro, sorra, gorra |
| tx | cotxe, dutxa, motxilla |
| ss | tassa, bossa, cassola, pallasso, professor |
| qu | paquet, esquirol, esquena, forquilla, orquestra |
| tg | metge, rellotge, formatge |
| gu, rr | guitarra |
| ss, rr | pissarra |
| j, qu | jaqueta |

**Decisió necessària:** confirmar si aquesta cobertura parcial és intencional. Si es vol treballar tot el corpus, s’han de definir les correspondències i la progressió pedagògica de les grafies absents i després implementar-les i provar-les. No s’ha inventat automàticament una seqüència nova durant l’auditoria.

### 6.2. Límit d’escriptura de sis grafemes

T11 només selecciona paraules amb un màxim de sis grafemes. **42 paraules del corpus excedeixen aquest límit**, incloses 34 que sí que són descodificables amb la seqüència completa. El màxim actual d’escriptura és, per tant, **228 paraules** abans d’aplicar exclusions o retirar el nom del guia. Les limitacions de les seccions 6.1 i 6.2 se solapen; no s’han de sumar directament.

Paraules de més de sis grafemes:

cristall, sardina, patinet, carpeta, tortuga, formiga, bufanda, ganivet, taronja, castanya, muntanya, esquirol, maduixa, faldilla, forquilla, formatge, bombolla, granota, finestra, cocodril, planeta, trompeta, tricicle, escombra, vinagre, princesa, cogombre, estrella, llibreta, clarinet, magrana, ciclista, triangle, orquestra, pedrera, tramvia, fragata, padrina, pollastre, professor, escriptor, gronxador.

El límit és explícit al codi: no és un fitxer absent. Cal confirmar si forma part del disseny docent o si s’ha d’ampliar, amb comprovació de teclats i disposició visual per a les paraules llargues.

## 7. Altres decisions i límits de l’auditoria

1. **Validació fonètica i dels estímuls.** La integritat i la cobertura són correctes, però aquesta auditoria no aporta una escolta humana de tots els fonemes ni una prova de comprensió de les imatges amb alumnes. Les equivalències ARASAAC acordades i els conceptes amplis —per exemple «fruit» representat per una poma— continuen requerint criteri docent.
2. **Criteri de rima.** El banc inclou famílies de coincidència consonàntica i la parella «casa/pala», que comparteix les vocals però no totes les consonants. Cal explicitar si T2 treballa rima assonant, consonant o totes dues; no s’ha qualificat automàticament aquella parella d’error. La distinció es basa en la definició de rima d’Enciclopèdia Catalana (s. d.).
3. **Llicència dels materials propis.** Els crèdits inclouen ARASAAC, les fonts i les marques. Les atribucions ARASAAC i l’enllaç BY-NC-SA 4.0 són presents i s’han contrastat amb les fonts institucionals. No s’ha trobat una llicència explícita de distribució del codi i de les col·leccions pròpies de LECAA; correspon a la UTAC decidir-la. La llicència ARASAAC requereix atribució, ús no comercial i les condicions de compartició de les adaptacions (ARASAAC, s. d.; Creative Commons, s. d.).
4. **Accessibilitat.** No s’han detectat candidats de contrast insuficient en el mostreig de text de les vuit vistes d’adult; s’han comprovat focus, controls i disposició en les resolucions indicades. No és una certificació WCAG 2.2 AA. Queden fora una avaluació completa amb lector de pantalla, ampliació real al 200%, Safari/iOS/Firefox i proves amb els commutadors i lectors oculars de destinació. WCAG requereix avaluar processos complets i combinar comprovacions automatitzades i humanes (W3C, 2024).
5. **Pes i rendiment.** L’HTML pesa aproximadament 202,4 MiB, perquè incorpora els recursos. S’ha obert i utilitzat durant les proves, però no s’ha fet un benchmark en ordinadors escolars o tauletes. Una eventual versió en línia amb càrrega diferida seria una optimització independent, mantenint un paquet descarregable complet.
6. **Eficàcia educativa.** S’ha comprovat que el motor aplica les seves regles, inclòs el criteri d’avanç entre sessions. No s’ha validat científicament l’eficàcia de LECAA, l’ordre d’ensenyament, els llindars de domini o l’adequació individual de la intervenció. Aquesta auditoria no substitueix una validació docent o un estudi amb participants.

## 8. Resultat de tancament

**Tancament tècnic de les incidències reproduïdes:** resolt en l’edició 41, segons les comprovacions adjuntes. **Tancament del projecte complet:** condicionat a resoldre o acceptar explícitament l’abast curricular de la secció 6, documentar la validació docent/fonètica i concretar la distribució dels materials propis. L’edició 41 és una versió corregida i auditable, no una declaració que no existeixi cap altre error possible.

### Identificació dels fitxers

- Edició 40, SHA-256: `7ca3d99f20ad05cc1fb12d88d327a353bb656c13ef4cb9480642f9368bb6b482`.
- Edició 41, SHA-256: `3f189e085f67c350a2aca0dff0627e15006ec19f3526929be3cf561e250b7d82`.
- Evidències: `Evidencies_auditoria_LECAA_2026-10-16.json`.
- El ZIP inclou l’HTML, aquest informe, les evidències, instruccions, fonts i sumes de verificació.

## Referències

ARASAAC. (s. d.). *Condiciones de uso*. Aula Abierta de ARASAAC. https://aulaabierta.arasaac.org/condiciones-de-uso

Creative Commons. (s. d.). *Attribution-NonCommercial-ShareAlike 4.0 International*. https://creativecommons.org/licenses/by-nc-sa/4.0/

Enciclopèdia Catalana. (s. d.). *Rima*. Gran enciclopèdia catalana. https://www.enciclopedia.cat/gran-enciclopedia-catalana/rima-0

Google. (s. d.). *Información sobre modelos de Google Flow y funciones compatibles*. Ayuda de Google Flow. https://support.google.com/flow/answer/16352836?hl=es-ES

MDN contributors. (2026, 12 d’octubre). *Window: localStorage property*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

Unitat de Tècniques Augmentatives de Comunicació. (2026a). *LECAA* (edició 40) [Aplicació web]. Fitxer del projecte auditat.

Unitat de Tècniques Augmentatives de Comunicació. (2026b). *LECAA* (edició 41) [Aplicació web]. Versió corregida durant aquesta auditoria.

World Wide Web Consortium. (2024, 12 de desembre). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/

World Wide Web Consortium. (s. d.). *Content Security Policy Level 3*. https://www.w3.org/TR/CSP/
