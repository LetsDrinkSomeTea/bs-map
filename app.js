/* ---------- Globale Variablen ---------- */
let places = [];
let map;                  // Leaflet-Map-Instanz
const markers = [];

/* ---------- App-Start ---------- */
function startApp() {
  /* Karte initialisieren */
  map = L.map('map').setView([48.0173, 9.4980], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap-Mitwirkende'
  }).addTo(map);

  /* Marker anlegen */
  places.forEach(p => {
    const m = L.marker(p.coords)
      .bindPopup(`<b>${p.name}</b><br>${p.type}${p.tags.length ? '<br>' + p.tags.join(', ') : ''}`);
    m.type = p.type;   // für Filter
    m.tags = p.tags;
    m.addTo(map);
    markers.push(m);
  });

  buildFilters();
}

/* ---------- Filter-Oberfläche ---------- */
function buildFilters() {
  const types = [...new Set(places.map(p => p.type))];           // eindeutige Typen
  const tags  = [...new Set(places.flatMap(p => p.tags))];       // eindeutige Tags

  const ctrl = document.getElementById('control-panel');
  ctrl.innerHTML =
    buildSection('Typ', types, 'type-filter', true) +
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
    const typeOk = activeTypes.includes(m.type);
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

