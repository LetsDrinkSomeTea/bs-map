/* ---------- Globale Variablen ---------- */
let places = [];          // wird durch places.json initialisiert
let map;                  // Leaflet-Map-Instanz
const markers = [];       // Marker-Referenzen für Filter

/* ---------- App-Start ---------- */
function startApp() {
  map = L.map('map');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap-Mitwirkende'
  }).addTo(map);

  /* Marker anlegen */
  places.forEach(p => {
    const parts = [
      `<b>${p.name}</b>`,
      p.type,
      (p.tags && p.tags.length) ? p.tags.join(', ') : null,
      p.address || null,
      p.website ? `<a href="${p.website}" target="_blank" rel="noopener">Webseite</a>` : null
    ];
    const popupContent = parts.filter(Boolean).join('<br>');

    const m = L.marker(p.coords)
    .bindPopup(popupContent);
    m.type = p.type;
    m.tags = p.tags;
    m.addTo(map);
    markers.push(m);
  });

  /* ---- Kartenausschnitt automatisch anpassen ---- */
  if (places.length === 1) {
    map.setView(places[0].coords, 15);
  } else {
    const bounds = L.latLngBounds(places.map(p => p.coords));
    map.fitBounds(bounds.pad(0.01));      // 5 % Rand
  }

  buildFilters();
}

/* ---------- Filter-Oberfläche ---------- */
function buildFilters() {
  const types = [...new Set(places.map(p => p.type))].sort();     // remove duplicates
  const tags  = [...new Set(places.flatMap(p => p.tags))].sort(); // remove duplicates

  const ctrl = document.getElementById('control-panel');
  ctrl.innerHTML =
    buildSection('Typ', types, 'type-filter', false) +
    buildSection('Nachhaltigkeit', tags, 'tag-filter', false);

  ctrl.addEventListener('change', updateFilters);
}

function buildSection(title, items, cssClass, checked) {
  return `
    <div class="filter-section">
      <h3>${title}:</h3>
      <div class="filter-group">
        ${items.map(i => `
          <label>
            <input type="checkbox" class="${cssClass}" value="${i}" ${checked ? 'checked' : ''}>
            ${i}
          </label>`).join('')}
      </div>
    </div>`;
}

function updateFilters() {
  const activeTypes = [...document.querySelectorAll('.type-filter:checked')].map(cb => cb.value);
  const activeTags  = [...document.querySelectorAll('.tag-filter:checked')].map(cb => cb.value);

  markers.forEach(m => {
    const typeOk = activeTypes.length ===0 || activeTypes.includes(m.type);
    const tagOk  = activeTags.length === 0 || activeTags.every(t => m.tags.includes(t));
    if (typeOk && tagOk) {
      m.addTo(map);
    } else {
      map.removeLayer(m);
    }
  });
}

/* ---------- Daten laden & App starten ---------- */
fetch('places.json')
  .then(r => r.json())
  .then(data => { places = data; startApp(); })
  .catch(err => console.error('places.json konnte nicht geladen werden:', err));

