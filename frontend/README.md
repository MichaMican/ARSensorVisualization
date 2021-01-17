# Frontend

Zur initialisierung des Projekts kann der Befehl `npm install` genutzt werden.
Dieser lädt alle Abhängigkeiten herunter, und baut die Ordnerstruktur auf.

Danach kann das Projekt mit dem Befehl `npm run-script build` gebaut werden.
Dabei werden in dem Ordner `out` alle Dateien erzeugt, die von einem HTTP-Server
ausgeliefert werden müssen, um das Frontend zu nutzen.

Mit dem Befehl `npm start` wird ein Entwicklungsserver gestartet, mit dem das
Frontend getestet werden kann. Dieser überwacht Änderungen im Quellcode, und
startet sich, wenn nötig, neu. Dabei werden keine Dateien im `out` Ordner
erzeugt.
