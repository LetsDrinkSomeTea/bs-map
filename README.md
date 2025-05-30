# Lokale Geschäfte & Filterkarte

Eine kleine Web‑Anwendung, die auf einer interaktiven Leaflet‑Karte Point of Interests (PoI) markiert. Über Checkbox‑Filter lassen sich die Marker nach **Typ** und **Tags** filtern.

## Demo

Eine Demo der App mit Cafès, Restaurants und Lebensmittelläden und ihrem Nachhaltigkeitsstatus.

[Live‑App ansehen](https://pages.faigle.dev/bs-map)

## Funktionen

* **Leaflet**‑Karte mit OpenStreetMap‑Tiles
* Dynamische Marker basierend auf *places.json*
* Checkbox‑Filter (Typ & Tags) mit sofortiger Aktualisierung der Karte
  * Ein PoI muss **nur einem** der Typen entsprechen um angezeigt zu werden
  * Ein PoI muss **alle** der Tags besitzten um angezeigt zu werden
* Kategorisierung von Orten nach Typ und Tags für einfache Filterung
* Anzeige von Adresse und Website-Link in Popups

## Projektstruktur

```text
.
├── index.html                    # Grundgerüst der Seite
├── styles.css                    # Layout & Design
├── app.js                        # Haupt‑Logik (Karte, Filter)
├── places.json                   # Datengrundlage für Marker
├── parse.py                      # Script zum Konvertieren von CSV zu JSON
└── Digitaler Einkaufsführer.csv  # Beispiel-CSV mit Ortsdaten
```

## Schnellstart

```bash
git clone https://github.com/LetsDrinkSomeTea/bs-map.git
cd bs-map
# Beliebigen Static‑Server starten, z. B.:
npx http-server # or
python3 -m http.server 8080
```

Anschließend im Browser `http://localhost:8080` (oder Port des Servers) öffnen.

## Deployment

Die Anwendung ist **komplett statisch** und kann daher problemlos auf Diensten wie GitHub Pages, Netlify oder Vercel gehostet werden. Eine aktuelle Deployment‑Instanz ist unter [https://pages.faigle.dev/bs-map](https://pages.faigle.dev/bs-map) zu finden.

## Daten aktualisieren

### Manuelle Aktualisierung

Die Datei **places.json** enthält ein Array von Einträgen. Struktur eines Eintrags:

```json
{
  "name": "Schwarzer Adler",
  "coords": [48.01772, 9.49899],
  "type": "Restaurant",
  "category": "einkehren",
  "tags": ["Regional", "Fair"],
  "address": "Hauptstraße 41",
  "website": "https://schwarzeradler-bs.de/"
}
```

* **coords** → \[Breitengrad, Längengrad]
* **type**   → Beliebiger String; neue Typen erscheinen automatisch in den Filtern
* **category** → Gruppierung für die Filter-Anzeige (z.B. "einkaufen", "einkehren")
* **tags**   → Beliebige Strings; mehrere Tags möglich
* **address** → Adresse des Ortes (optional)
* **website** → URL zur Website (optional)

### CSV-Parsing mit parse.py

Das Projekt enthält ein Python-Script (`parse.py`), mit dem CSV-Dateien in das benötigte JSON-Format konvertiert werden können:

```bash
python parse.py input.csv output.json
```

#### CSV-Format

Die CSV-Datei sollte folgende Spalten enthalten:

```
name,coords,type,category,tags,address,website
```

Beispiel:
```
"Café Beispiel","48.01234, 9.56789",Café,Einkehren,"bio, regional",Hauptstraße 1,https://example.com
```

* **coords** muss als "Breitengrad, Längengrad" formatiert sein
* **tags** können durch Kommas getrennt werden

## Lizenz

MIT License

## Credits

* [Leaflet](https://leafletjs.com)
* [OpenStreetMap](https://www.openstreetmap.org)