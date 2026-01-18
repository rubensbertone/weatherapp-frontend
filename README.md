# Weather App Frontend

Willkommen bei der Weather App! Diese Anwendung ermöglicht es dir, Wetterdaten für Städte weltweit abzurufen und deine Lieblingsorte zu speichern.

## Funktionen & Benutzung

Die App bietet folgende Hauptfunktionen für Nutzer:

### 1. Wetter suchen
*   Auf der Startseite kannst du über den Button **"Stadt suchen"** die Suchleiste öffnen.
*   Gib den Namen einer Stadt ein (mindestens 3 Zeichen).
*   Wähle aus den automatischen Vorschlägen den gewünschten Ort aus.
*   Du wirst zur Detailansicht weitergeleitet, wo du aktuelle Wetterinformationen siehst.

### 2. Account erstellen (Registrieren)
*   Um Orte speichern zu können, benötigst du einen Account.
*   Klicke auf **"Registrieren"** in der Navigation oder auf der Startseite.
*   Wähle einen Benutzernamen und ein sicheres Passwort.
*   Nach erfolgreicher Registrierung kannst du dich direkt einloggen.

### 3. Einloggen
*   Klicke auf **"Login"**, um dich mit deinen Zugangsdaten anzumelden.
*   Nach dem Login hast du Zugriff auf deine persönlichen Favoriten.

### 4. Favoriten verwalten
*   **Speichern:** Wenn du eingeloggt bist, erscheint in der Wetter-Ansicht ein Herz-Symbol. Klicke darauf, um den aktuellen Ort zu deinen Favoriten hinzuzufügen.
*   **Ansehen:** Über den Menüpunkt **"Favoriten"** gelangst du zu einer Übersicht all deiner gespeicherten Orte.
*   Von dort aus kannst du schnell wieder auf das Wetter deiner Lieblingsstädte zugreifen.

### 5. Ausloggen
*   Über den **"Logout"**-Button in der Navigation kannst du deine Sitzung sicher beenden.

---

## Technische Details

Dieses Projekt wurde mit [Vue 3](https://vuejs.org/) und [Vite](https://vitejs.dev/) erstellt.

### Voraussetzungen

*   Node.js (Version 20 oder höher empfohlen)
*   Ein laufendes Backend (siehe Backend-Repository), standardmäßig unter `http://localhost:8080` erreichbar.

### Installation & Start

1.  Abhängigkeiten installieren:
    ```sh
    npm install
    ```

2.  Entwicklungsserver starten:
    ```sh
    npm run dev
    ```

3.  Tests ausführen:
    ```sh
    npm run test:unit
    ```

### Build für Produktion

```sh
npm run build
```
