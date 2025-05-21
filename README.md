# Lokale Geschäfte & Filterkarte

Eine kleine Web‑Anwendung, die auf einer interaktiven Leaflet‑Karte nachhaltige Restaurants, Cafés, Geschäfte und Dienstleister in Bad Saulgau darstellt. Über Checkbox‑Filter lassen sich die Marker nach **Typ** und **Nachhaltigkeitstags** (Bio, Fair, Regional …) filtern.

## Demo

👉 [Live‑App ansehen](https://pages.faigle.dev/bs-map)

## Funktionen

* **Leaflet**‑Karte mit OpenStreetMap‑Tiles
* Dynamische Marker basierend auf *places.json*
* Checkbox‑Filter (Typ & Tags) mit sofortiger Aktualisierung der Karte

## Projektstruktur

```text
.
├── index.html         # Grundgerüst der Seite
├── styles.css         # Layout & Design
├── app.js             # Haupt‑Logik (Karte, Filter)
└── places.json        # Datengrundlage für Marker
```

## Schnellstart

```bash
git clone https://github.com/LetsDrinkSomeTea/bs-map.git
cd bs-map
# Beliebigen Static‑Server starten, z. B.:
npx http-server # or
python3 -m http.server 8080
```

Anschließend im Browser `http://localhost:8080` (oder Port des Servers) öffnen.

## Deployment

Die Anwendung ist **komplett statisch** und kann daher problemlos auf Diensten wie GitHub Pages, Netlify oder Vercel gehostet werden. Eine aktuelle Deployment‑Instanz ist unter  zu finden.

### GitHub Pages (Beispiel)

```bash
# Im Projektordner
npm install --global gh-pages
npm run deploy   # definiert in package.json oder manuell "gh-pages -d ."
```

## Daten aktualisieren

Die Datei **places.json** enthält ein Array von Einträgen. Struktur eines Eintrags:

```json
{
  "name": "Schwarzer Adler",
  "coords": [48.01772, 9.49899],
  "type": "Restaurant",
  "tags": ["Regional", "Fair"]
}
```

* **coords** → \[Breitengrad, Längengrad]
* **type**   → Beliebiger String; neue Typen erscheinen automatisch in den Filtern.
* **tags**   → Beliebige Strings; mehrere Tags möglich.

## Lizenz

MIT License

## Credits

* [Leaflet](https://leafletjs.com)
* [OpenStreetMap](https://www.openstreetmap.org)
