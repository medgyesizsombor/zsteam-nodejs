# ZSteam-nodejs

PRF Beadandó Backend része.

# Pontok

- A backend statikusan hostolja a frontendet.
- Az alkalmazás kapcsolódik egy mongodb instance-hoz.
- A szerver megvalósít legalább két modellt, melyek sémája egyértelműen definiált.
- Adott egy olyan adatbázis hook, amelyek a modellek mentése vagy lekérése közben futnak le.
- A szerver megvalósít egy lokális autentikációs stratégiát.
- A szerver kezeli a login sessiont.
- A szerver rendelkezik a két kezelt modell CRUD interfészeivel, illetve egy login, logout, register route-tal.
