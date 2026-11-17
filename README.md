# Begehungs-App – Einrichtung als App für Windows und Android

Diese App erfasst Gebäudebegehungen auf PDF-Plänen: Räume einzeichnen, je Raum Bemerkungen, Zustand, Mängel und Fotos erfassen, Bericht als PDF/Word erzeugen.

- **Installierbar** auf Windows (Edge oder Chrome) und Android (Chrome) – mit eigenem Symbol und eigenem Fenster.
- **Offline-fähig:** Alle Daten liegen zuerst auf dem Gerät. Die Begehung funktioniert auch ohne Netz.
- **OneDrive als gemeinsamer Speicher:** PC und Tablet gleichen sich über deinen OneDrive-Ordner `Begehungs-App` ab. Pläne, Fotos und Berichte liegen dort lesbar in einem Ordner je Projekt.

Die Einrichtung dauert etwa 30 Minuten und ist nur einmal nötig.

---

## Überblick: Was wohin kommt

| Was | Wo |
|---|---|
| App-Code (diese Dateien) | GitHub Pages, eine kostenlose Webadresse wie `https://DEINNAME.github.io/begehung/` |
| Projekte, Pläne, Fotos | auf dem jeweiligen Gerät und in **deinem** OneDrive (Firmenkonto) |
| Anmeldung | Microsoft-365-Konto (enviro.immo) |

Auf GitHub liegen **keine Projektdaten**, nur der Programmcode. Die Anwendungs-ID in `config.js` ist kein Geheimnis. Sie darf öffentlich sein.

---

## Schritt 1 – GitHub-Repository anlegen und Dateien hochladen

1. Auf <https://github.com> ein kostenloses Konto anlegen (falls noch nicht vorhanden).
2. Oben rechts **+ → New repository**.
   - Repository name: `begehung`
   - **Public** auswählen. GitHub Pages ist für private Repositories nur mit einem bezahlten Plan verfügbar.
   - **Create repository**.
3. Auf der neuen Seite **uploading an existing file** anklicken (oder **Add file → Upload files**).
4. Die ZIP-Datei auf dem PC entpacken. Dann den **Inhalt** des entpackten Ordners in das Upload-Feld ziehen: `index.html`, `sw.js`, `config.js`, `manifest.webmanifest`, `README.md` und die Ordner `lib` und `icons`.
5. Unten auf **Commit changes** klicken.

## Schritt 2 – GitHub Pages einschalten

1. Im Repository: **Settings → Pages**.
2. Unter *Build and deployment*: Source **Deploy from a branch**, Branch **main**, Ordner **/ (root)** → **Save**.
3. Nach 1–2 Minuten erscheint oben die Adresse, z. B. `https://DEINNAME.github.io/begehung/`. **Diese Adresse brauchst du in Schritt 3** (mit `/` am Ende).

## Schritt 3 – App bei Microsoft registrieren (für den OneDrive-Zugriff)

Je nach Einstellungen eures Microsoft-365-Mandanten darfst du das selbst, oder eure IT bzw. ein Administrator muss es tun. Es dauert etwa 10 Minuten.

1. <https://entra.microsoft.com> öffnen → **Anwendungen → App-Registrierungen → Neue Registrierung**.
2. Ausfüllen:
   - **Name:** `Begehungs-App`
   - **Unterstützte Kontotypen:** *Nur Konten in diesem Organisationsverzeichnis* (einzelner Mandant)
   - **Umleitungs-URI:** Plattform **Single-Page-Anwendung (SPA)**, Adresse = deine GitHub-Pages-Adresse aus Schritt 2, z. B. `https://DEINNAME.github.io/begehung/`
   - **Registrieren**.
3. Auf der Seite **Übersicht** zwei Werte notieren:
   - **Anwendungs-ID (Client)**
   - **Verzeichnis-ID (Mandant)**
4. **API-Berechtigungen → Berechtigung hinzufügen → Microsoft Graph → Delegierte Berechtigungen**. Dort `Files.ReadWrite` und `offline_access` anhaken. `User.Read` ist bereits vorhanden. Dann **Berechtigungen hinzufügen**.
5. Falls dort *„Administratorzustimmung erforderlich“* steht: **Administratorzustimmung für … erteilen** (nur durch einen Admin möglich).

> Wichtig: Die Umleitungs-URI muss **genau** der App-Adresse entsprechen, inklusive `https://` und dem `/` am Ende. Sonst meldet Microsoft bei der Anmeldung „redirect_uri mismatch“.

## Schritt 4 – `config.js` anpassen

1. Im GitHub-Repository die Datei `config.js` öffnen → Stift-Symbol (**Edit**).
2. Die beiden Werte aus Schritt 3 eintragen:

```js
window.BEGEHUNG_CONFIG = {
  clientId: '1a2b3c4d-....',   // Anwendungs-ID (Client)
  tenantId: '9z8y7x6w-....',   // Verzeichnis-ID (Mandant)
  oneDriveFolder: 'Begehungs-App',
};
```

3. **Commit changes**. Nach ca. 1 Minute ist die Änderung online.

## Schritt 5 – App installieren

**Windows (Edge oder Chrome)**
1. Die App-Adresse öffnen.
2. In der Adressleiste auf das Symbol **„App installieren“** klicken (Edge: *Apps → Diese Website als App installieren*).
3. Die App erscheint im Startmenü und kann an die Taskleiste angeheftet werden.

**Android-Tablet (Chrome)**
1. Die App-Adresse in Chrome öffnen.
2. Menü **⋮ → App installieren** (oder *Zum Startbildschirm hinzufügen*).
3. Die App startet danach im Vollbild über ihr eigenes Symbol.

Auf beiden Geräten in der App auf der Startseite **„Mit Microsoft anmelden“** tippen. Verwende auf beiden Geräten dasselbe Konto.

---

## So arbeitest du damit

1. **Am PC vorbereiten:** Projekt anlegen, Pläne hochladen, Räume einzeichnen. Die App gleicht automatisch mit OneDrive ab. Der Status steht oben rechts.
2. **Vor der Begehung** das Tablet einmal mit Internet öffnen. Die App lädt dann alle Pläne und Fotos aufs Gerät. Danach funktioniert alles offline.
3. **Während der Begehung** werden alle Eingaben und Fotos sofort auf dem Tablet gespeichert. Ohne Netz zeigt der Status „Offline · lokal gespeichert“.
4. **Danach** gleicht die App automatisch ab, sobald wieder Internet da ist. Den Bericht kannst du am PC oder am Tablet erstellen. Er wird heruntergeladen und zusätzlich im OneDrive-Ordner `Begehungsdokumentation` abgelegt.
5. **„Letzter Abschnitt“** (Button oben links) bringt dich jederzeit zurück zum zuletzt angesehenen Planausschnitt: aus der Raumliste, dem Bericht oder der Startseite. In der Planansicht springt er zum vorherigen Ausschnitt zurück, z. B. nach „Ganzen Plan zeigen“, einem Seitenwechsel oder „Nächster“.

### Ordner in OneDrive

```
Begehungs-App/
  Bürogebäude Musterstraße 12/
    begehung-daten.json          ← Daten der App (bitte nicht von Hand ändern)
    Pläne/grundriss-eg.pdf
    Vorschaubilder/              ← verkleinerte Arbeitskopien für die App
    Begehungsdokumentation/      ← Berichte (PDF, Word, CSV)
      … Begehungsbericht 2026-11-07.pdf
      Fotos/                     ← alle Einzelfotos in Originalqualität, benannt nach Raum
        0.01 Büro - Foto 1.jpg
        0.01 Büro - Foto 1 (bearbeitet).jpg   ← mit Zeichnung, volle Größe
        0.01 Büro - Foto 2.jpg
        Titelbild.jpg
```

Die Fotos im Ordner `Fotos` sind die unveränderten Kameradateien. Die App selbst arbeitet mit kleineren Kopien (`Vorschaubilder`), damit sie auf dem Tablet schnell bleibt. Nach dem Hochladen gibt die App den Speicher der großen Kameradatei auf dem Tablet wieder frei.

Berichte, die ohne Internet erstellt werden, legt die App beim nächsten Abgleich automatisch in `Begehungsdokumentation` ab.

**Dokumentation im eigenen Projektordner ablegen:** Im Reiter *Projekt → OneDrive → Ordner wählen …* kannst du einen beliebigen Ordner in deinem OneDrive wählen, z. B. euren Projektordner `Projekte/2026-012 Musterstraße`. Die App legt dort den Unterordner `Begehungsdokumentation` mit dem Ordner `Fotos` an. Bereits abgelegte Berichte und Fotos werden automatisch mit verschoben. Pläne und App-Daten bleiben im Ordner `Begehungs-App`.

### Gut zu wissen

- **Gleichzeitiges Arbeiten:** Wenn PC und Tablet verschiedene Räume ändern, werden beide Änderungen zusammengeführt. Wird *derselbe* Raum auf beiden Geräten geändert, gewinnt die zuletzt gespeicherte Fassung.
- **Anmeldung erneuern:** Microsoft begrenzt die Anmeldung solcher Web-Apps auf 24 Stunden. Die App erneuert sie selbst, sobald sie mit Internet geöffnet wird: kurz zu Microsoft und zurück, ohne Eingabe. Voraussetzung: Bei der Microsoft-Anmeldung „Angemeldet bleiben?“ mit **Ja** beantworten. Verlangt Microsoft doch eine Eingabe (z. B. Authenticator nach Vorgabe der IT), zeigt die App „Anmeldung nötig“ und den Button „Neu anmelden“. Während du etwas eingibst, fotografierst oder zeichnest, springt die App nie weg. Deine Daten bleiben in der Zwischenzeit auf dem Gerät erhalten.
- **Projekt löschen** verschiebt den OneDrive-Ordner in den OneDrive-Papierkorb. Von dort ist er wiederherstellbar.
- **Daten aus der Claude-Version übernehmen:** Dort unter *Projekt → Sicherung exportieren (ZIP)*, hier auf der Startseite *Sicherung importieren*.
- **Stift-Eingabe:** Alle Textfelder sind normale Eingabefelder. Auf Samsung-Tablets mit S Pen kannst du direkt hineinschreiben, die Handschrift wird in Text umgewandelt. Die Einstellung heißt „S Pen zu Text“ (*Einstellungen → Erweiterte Funktionen → S Pen*). Mit Gboard ab Android 14 heißt sie „In Textfelder schreiben“.
- **Browserdaten nicht löschen,** solange noch nicht synchronisiert wurde (Status prüfen). Sonst gehen nicht abgeglichene Änderungen verloren.

### Updates einspielen

Neue Version: die geänderten Dateien im GitHub-Repository ersetzen (**Add file → Upload files**). `config.js` dabei **nicht** überschreiben. Die App holt sich die neue Version beim nächsten Start mit Internet.

### Fehlerbehebung

| Meldung / Problem | Lösung |
|---|---|
| „redirect_uri … does not match“ | Umleitungs-URI in Entra exakt wie die App-Adresse eintragen, Plattform *Single-Page-Anwendung*. |
| „Need admin approval“ / „Administratorgenehmigung erforderlich“ | Admin muss in Entra die Administratorzustimmung für die Berechtigungen erteilen (Schritt 3.5). |
| „OneDrive-Fehler … Files.ReadWrite“ | Berechtigung `Files.ReadWrite` fehlt (Schritt 3.4). |
| Kein „App installieren“ sichtbar | Seite einmal neu laden; nur über `https://` und in Edge/Chrome möglich. |
| Plan wird auf dem Tablet nicht angezeigt | Tablet einmal mit Internet öffnen und Abgleich abwarten (Status „Synchronisiert …“). |
