# Edició 45.3: «He oblidat la contrasenya»

Data: 5 de novembre de 2026.

## Problema

Cada perfil té una contrasenya per entrar a la zona d'adult. Només es podia canviar des de dins (Opcions avançades › Dades). Si s'oblidava, no hi havia cap manera de tornar a entrar al perfil.

## Canvis

- El diàleg «Zona d'adult» té l'enllaç «He oblidat la contrasenya». El perfil de mostra no en té, perquè no té contrasenya.
- L'enllaç obre el diàleg «Contrasenya nova», que demana resoldre una multiplicació de dues xifres (factors de 12 a 99, sense múltiples de 10 ni d'11). Després cal escriure i repetir la contrasenya nova, de 4 caràcters com a mínim.
- Si el resultat no és correcte, apareix una altra multiplicació. Així no es pot encertar provant.
- En desar, s'obre la zona d'adult i l'historial de canvis del perfil anota «Contrasenya nova amb «He oblidat la contrasenya»». La contrasenya anterior deixa de funcionar.
- «Torna» recupera el diàleg de la contrasenya i Esc el tanca. Si s'hi arriba des d'una sessió, aquesta queda en pausa fins que es desa o es torna a la sessió.

La contrasenya serveix perquè l'alumne no entri sol a la zona d'adult. No protegeix les dades d'un adult que tingui el dispositiu, igual que abans: les dades són al navegador i no hi ha comptes en línia.

## Comprovacions (Chromium, Linux)

- 19 comprovacions superades, tant en línia com amb el fitxer únic:
  - l'enllaç i el diàleg;
  - una multiplicació nova després d'un error;
  - contrasenya massa curta o que no coincideix;
  - contrasenya desada i anotada a l'historial;
  - la contrasenya anterior ja no funciona i la nova sí;
  - «Torna», Esc i accés amb teclat;
  - el perfil de mostra no té l'enllaç;
  - el restabliment des d'una sessió en curs;
  - el diàleg cap en un iPhone 14 i en un iPad Mini.
- Les 34 comprovacions del teclat sencer i `node eines/proves_compatibilitat.cjs chromium --extended` continuen superades.

## Límits

Només s'ha provat amb Chromium. No s'ha provat amb Safari ni en un iPad o un iPhone reals.
